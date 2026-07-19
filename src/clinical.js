// Clinical rule engine — pure functions, no React, no I/O, so it can be unit-tested directly.
//
// Scope and limits, deliberately:
//   * This reads NUMBERS against published rules. It does not diagnose, and it never reads pixels.
//   * Every output is meant to end in "take this to your doctor", not "you have X".
//   * Nothing here starts, stops or doses a medication.
//
// All thresholds are expressed in the SAME canonical units as REF_LIB in App.jsx. Getting a unit
// wrong here would be dangerous (a haemoglobin critical limit of 7.0 g/dL is 70 g/L), so each
// entry carries its unit and there is a unit-consistency test in clinical.test.mjs.

// ---------------------------------------------------------------------------
// Sources
// ---------------------------------------------------------------------------
// Every rule the engine applies is traceable to a published source, and the UI shows it. A person
// who reads "potassium critical" or "FIB-4 high" deserves to know which guideline that came from —
// it is the difference between a black box and something they can take to their doctor. Keys here
// are attached to each output as `source`, and the app maps the key to a short human label.
export const SOURCES = {
  "critical-arup": { label: "ARUP Laboratories critical values (cross-checked: URMC Rochester)", short: "ARUP" },
  "fib4-sterling": { label: "Sterling 2006 FIB-4 (verified: Labcorp, Medscape)", short: "Sterling 2006" },
  "friedewald": { label: "Friedewald equation for LDL", short: "Friedewald" },
  "aniongap": { label: "Serum anion gap; albumin correction Figge/Wellally", short: "Anion gap" },
  "dialysis-kdoqi": { label: "Kt/V Daugirdas 2nd-gen; targets KDOQI (URR ≥65%, Kt/V ≥1.2)", short: "KDOQI / Daugirdas" },
  "egfr-ckdepi": { label: "eGFR CKD-EPI 2021 (race-free)", short: "CKD-EPI 2021" },
  "reference-range": { label: "Adult reference ranges (ARUP / common laboratory values)", short: "Lab reference" },
  "drug-label": { label: "Drug-label & guideline cautions (e.g. metformin at low eGFR)", short: "Drug guidance" },
  "pattern": { label: "Pattern recognition from routine panels (supportive, not diagnostic)", short: "Panel pattern" },
  "corrected-calcium": { label: "Albumin-corrected calcium, Payne formula (ionised Ca preferred when in doubt)", short: "Payne" },
  "non-hdl": { label: "Non-HDL cholesterol (Total − HDL); a secondary lipid target", short: "Non-HDL" },
  "bun-cr-ratio": { label: "BUN:creatinine ratio, common laboratory interpretation", short: "BUN:Cr" },
  "tsat": { label: "Transferrin saturation = serum iron / TIBC × 100", short: "TSAT" },
  "eag": { label: "Estimated average glucose from HbA1c (ADAG study, Nathan 2008)", short: "ADAG" },
  "osmolality": { label: "Calculated serum osmolality 2×Na + glucose/18 + BUN/2.8 (ADA/AAP)", short: "Calc. osmolality" },
  "corrected-sodium": { label: "Sodium corrected for hyperglycaemia (Katz 1973)", short: "Katz" },
  "anemia-morphology": { label: "Anaemia morphology by MCV (microcytic <80, normocytic 80–100, macrocytic >100 fL)", short: "MCV morphology" },
  "aki-kdigo": { label: "Acute kidney injury, KDIGO 2012 creatinine criteria (≥0.3 mg/dL in 48h or ≥1.5× baseline in 7d)", short: "KDIGO AKI" },
  "apri-wai": { label: "APRI = (AST/ULN)/platelets ×100 (Wai 2003; interpretation Lin/Chou meta-analyses)", short: "APRI (Wai)" },
  "globulin-ag": { label: "Globulin = total protein − albumin; A/G ratio = albumin / globulin (URMC, Cleveland Clinic)", short: "A/G ratio" },
  "fena": { label: "Fractional excretion of sodium (Espinel 1976 / Miller 1978): (UNa×PCr)/(PNa×UCr)×100", short: "FENa" },
};

// ---------------------------------------------------------------------------
// CRITICAL ("panic") limits
// ---------------------------------------------------------------------------
// Source: ARUP Laboratories Critical Values list, cross-checked against the University of
// Rochester (URMC) clinical critical-value notification list. These are the values a lab treats
// as life-threatening and phones the physician about immediately.
//
// IMPORTANT HONESTY NOTE: critical limits are NOT universally agreed. Published surveys show real
// spread between laboratories (e.g. low sodium limits ranging from 110 to 130 mmol/L). So these are
// a widely-used reference set, not a universal truth, and the UI says so: the user's own lab may
// use a different limit. We deliberately keep only limits we could verify against a published list
// rather than inventing plausible-looking numbers for the remaining tests.
export const CRITICAL = {
  // haematology
  hemoglobin: { lo: 70, hi: null, unit: "g/L" },        // ARUP: <7.0 g/dL  -> 70 g/L
  platelet:   { lo: 20, hi: 1000, unit: "x10^9/L" },    // ARUP: <=20 or >=1000 x10^3/uL (numerically identical)
  // electrolytes / chemistry
  sodium:     { lo: 120, hi: 160, unit: "mmol/L" },     // ARUP: <120 or >160
  potassium:  { lo: 3.0, hi: 6.1, unit: "mmol/L" },     // ARUP: <3.0 or >6.1
  calcium:    { lo: 6.0, hi: 13.0, unit: "mg/dL" },     // ARUP: <6.0 or >13.0 (total calcium)
  magnesium:  { lo: 1.0, hi: 9.0, unit: "mg/dL" },      // ARUP: <1.0 or >9.0
  phosphorus: { lo: 1.0, hi: 9.0, unit: "mg/dL" },      // ARUP: <1.0 or >9.0
  // coagulation
  pt:         { lo: null, hi: 46.4, unit: "s" },        // ARUP: >=46.4 s
  aptt:       { lo: null, hi: 85, unit: "s" },          // ARUP: >=85 s
};

// Returns "critical-low" | "critical-high" | null for a canonical value.
export function criticalFor(test, canonValue) {
  const c = CRITICAL[test];
  if (!c) return null;
  const v = Number(canonValue);
  if (!isFinite(v)) return null;
  if (c.lo != null && v < c.lo) return "critical-low";
  if (c.hi != null && v > c.hi) return "critical-high";
  return null;
}

// ---------------------------------------------------------------------------
// Trend
// ---------------------------------------------------------------------------
// A single value is a snapshot; a doctor reads the direction. Least-squares slope over the
// canonical values, reported as % change across the window so it is comparable across tests.
//
// `dir` is purely directional (up/down/flat) — it carries NO judgement, because whether "up" is
// good or bad depends on the test (rising haemoglobin in anaemia is good; rising creatinine is not).
// Interpretation is left to the caller / the model, which knows the reference direction.
export function trendFor(labs, test, opts = {}) {
  const minN = opts.minN || 3;
  const flatPct = opts.flatPct == null ? 10 : opts.flatPct; // below this, call it flat
  const rows = (labs || [])
    .filter(r => r && r.test === test && isFinite(Number(r.canonValue)) && isFinite(Number(r.ts)))
    .sort((a, b) => a.ts - b.ts);
  if (rows.length < minN) return { ok: false, reason: "not-enough-points", n: rows.length };

  const t0 = rows[0].ts;
  const DAY = 86400000;
  const xs = rows.map(r => (r.ts - t0) / DAY);
  const ys = rows.map(r => Number(r.canonValue));
  const n = rows.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let num = 0, den = 0;
  for (let i = 0; i < n; i++) { num += (xs[i] - mx) * (ys[i] - my); den += (xs[i] - mx) ** 2; }
  const spanDays = xs[n - 1] - xs[0];
  if (den === 0 || spanDays <= 0) return { ok: false, reason: "no-time-span", n };

  const slope = num / den;                    // units per day
  const change = slope * spanDays;            // modelled change across the window
  const base = Math.abs(my) > 1e-9 ? Math.abs(my) : 1;
  const pct = (change / base) * 100;
  const dir = Math.abs(pct) < flatPct ? "flat" : (change > 0 ? "up" : "down");

  return {
    ok: true, n, dir,
    pct: Math.round(pct * 10) / 10,
    slopePerDay: slope,
    spanDays: Math.round(spanDays),
    first: { v: ys[0], ts: rows[0].ts },
    last: { v: ys[n - 1], ts: rows[n - 1].ts },
    unit: rows[n - 1].canonUnit || null,
  };
}

// ---------------------------------------------------------------------------
// Rate-of-change alert: acute kidney injury (AKI) from rising creatinine
// ---------------------------------------------------------------------------
// A single creatinine that's "high" is one thing; a creatinine that has JUMPED is a different, more
// urgent thing. KDIGO 2012 defines AKI on the RATE of rise, not the absolute value:
//   * an increase of >=0.3 mg/dL within 48 hours, OR
//   * an increase to >=1.5x the baseline within 7 days.
// This walks the creatinine history (canonical mg/dL) and reports the strongest KDIGO criterion met,
// with the stage from the ratio. It is deliberately conservative and honest about its limits: a
// slow rise from a fluid change or a rehydration rebound can mimic this, and in CKD the percentage
// criterion can overstate; so it is surfaced as "warrants prompt review", not a diagnosis, and it
// needs at least two dated creatinine values to say anything at all.
export function trendAlert(labs) {
  const out = [];
  const cr = (labs || [])
    .filter(r => r && r.test === "creatinine" && r.canonValue != null && r.ts != null)
    .map(r => ({ v: Number(r.canonValue), ts: Number(r.ts) }))
    .filter(r => isFinite(r.v) && isFinite(r.ts) && r.v > 0)
    .sort((a, b) => a.ts - b.ts);
  if (cr.length < 2) return out;

  const latest = cr[cr.length - 1];
  const H48 = 48 * 3600 * 1000, D7 = 7 * 24 * 3600 * 1000;
  let crit = null;   // "abs-48h" | "ratio-7d"
  let baseline = null, ratio = null, absRise = null;

  // 48-hour absolute rise: compare latest with the lowest value within the preceding 48h.
  const win48 = cr.filter(r => latest.ts - r.ts <= H48 && r.ts < latest.ts);
  if (win48.length) {
    const low48 = Math.min(...win48.map(r => r.v));
    if (latest.v - low48 >= 0.3) { crit = "abs-48h"; absRise = Math.round((latest.v - low48) * 100) / 100; baseline = low48; }
  }
  // 7-day ratio: compare latest with the lowest value within the preceding 7 days.
  const win7 = cr.filter(r => latest.ts - r.ts <= D7 && r.ts < latest.ts);
  if (win7.length) {
    const low7 = Math.min(...win7.map(r => r.v));
    if (low7 > 0 && latest.v / low7 >= 1.5) {
      const rr = latest.v / low7;
      // Prefer the ratio criterion label when the ratio is the stronger signal (or 48h didn't fire).
      if (!crit || rr >= 1.5) { crit = crit === "abs-48h" && rr < 1.5 ? crit : "ratio-7d"; ratio = Math.round(rr * 100) / 100; if (baseline == null) baseline = low7; }
    }
  }
  if (!crit) return out;

  // Stage from the ratio when we have it (KDIGO: 1 = 1.5–1.9x, 2 = 2.0–2.9x, 3 = >=3x or >=4.0 mg/dL).
  let stage = 1;
  if (ratio != null) stage = ratio >= 3.0 ? 3 : (ratio >= 2.0 ? 2 : 1);
  if (latest.v >= 4.0) stage = 3;

  out.push({
    id: "aki-rising-creatinine",
    test: "creatinine",
    criterion: crit,
    stage,
    baseline: baseline == null ? null : Math.round(baseline * 100) / 100,
    latest: Math.round(latest.v * 100) / 100,
    ratio,
    absRise,
    source: "aki-kdigo",
  });
  return out;
}

// ---------------------------------------------------------------------------
// Derived values
// ---------------------------------------------------------------------------
// Things a clinician computes rather than reads off the sheet.
const latestOf = (labs, test) => {
  let best = null;
  for (const r of labs || []) {
    if (r && r.test === test && isFinite(Number(r.canonValue))) {
      if (!best || r.ts > best.ts) best = r;
    }
  }
  return best;
};

export function derived(labs, ctx = {}) {
  const out = {};
  const chol = latestOf(labs, "cholesterol");   // mg/dL
  const tg = latestOf(labs, "triglyceride");    // mg/dL
  const hdl = latestOf(labs, "hdl");            // mg/dL (may not exist in the catalogue yet)

  // Friedewald LDL. Only valid on a fasting sample and NOT valid when triglycerides are high —
  // the formula systematically under-estimates LDL above ~400 mg/dL, which is exactly when an
  // under-estimate would matter. So it refuses rather than returning a wrong-but-plausible number.
  if (chol && tg && hdl) {
    const tgv = Number(tg.canonValue);
    if (tgv >= 400) {
      out.ldlCalc = { ok: false, reason: "triglycerides-too-high", note: "Friedewald is not valid at TG >= 400 mg/dL" };
    } else {
      const v = Number(chol.canonValue) - Number(hdl.canonValue) - tgv / 5;
      out.ldlCalc = { ok: true, value: Math.round(v * 10) / 10, unit: "mg/dL", formula: "Friedewald", source: "friedewald" };
    }
  }

  // FIB-4 — non-invasive estimate of advanced liver fibrosis. Formula (Sterling 2006, verified
  // against Labcorp/Medscape): Age × AST / (Platelet[10^9/L] × √ALT). Needs age, so it silently
  // does nothing if age is unknown rather than guessing. Age also shifts the cutoff: >=65 uses a
  // higher low-risk threshold (2.0 instead of 1.3) because FIB-4 rises with age and would otherwise
  // over-flag the elderly. Bands are the widely-cited Sterling values, reported as a band, not a
  // diagnosis.
  const ast = latestOf(labs, "ast"), alt = latestOf(labs, "alt"), plt = latestOf(labs, "platelet");
  const age = Number(ctx.ageYears);
  if (ast && alt && plt && isFinite(age) && age > 0) {
    const a = Number(ast.canonValue), l = Number(alt.canonValue), p = Number(plt.canonValue);
    if (a > 0 && l > 0 && p > 0) {
      const v = (age * a) / (p * Math.sqrt(l));
      const lowCut = age >= 65 ? 2.0 : 1.3;
      const band = v < lowCut ? "low" : (v > 2.67 ? "high" : "indeterminate");
      out.fib4 = { ok: true, value: Math.round(v * 100) / 100, band, lowCut, highCut: 2.67, note: age >= 65 ? "age>=65-adjusted" : null, source: "fib4-sterling" };
    }
  }

  // APRI = (AST / AST-upper-limit) / platelet[10^9/L] × 100 (Wai 2003). A second, simpler liver
  // fibrosis marker that corroborates FIB-4 — and unlike FIB-4 it needs no age, so it can speak when
  // FIB-4 can't. AST upper limit taken as 40 U/L (matching REF_LIB). Interpretation from Lin/Chou
  // meta-analyses: <0.5 makes significant fibrosis unlikely, >0.7 suggests significant fibrosis, >1.0
  // raises cirrhosis. Reported as a band, never a diagnosis.
  if (ast && plt) {
    const a = Number(ast.canonValue), p = Number(plt.canonValue);
    if (a > 0 && p > 0) {
      const AST_ULN = 40;
      const apri = ((a / AST_ULN) / p) * 100;
      const band = apri < 0.5 ? "low" : (apri > 1.0 ? "high" : "indeterminate");
      out.apri = { ok: true, value: Math.round(apri * 100) / 100, band, lowCut: 0.5, highCut: 1.0, source: "apri-wai" };
    }
  }

  // Anion gap = Na − (Cl + HCO₃). Verified normal ~8–12 mEq/L (lower on modern ion-selective
  // analysers), so the raw number is reported with the caveat that the person's own lab range is
  // what counts. Albumin correction matters: low albumin lowers the gap and can HIDE a real high-gap
  // acidosis, so when albumin is available a corrected value is added (AG + 2.5×(4.0 − albumin g/dL)).
  const na = latestOf(labs, "sodium"), cl = latestOf(labs, "chloride"), hco3 = latestOf(labs, "bicarbonate");
  if (na && cl && hco3) {
    const nav = Number(na.canonValue), clv = Number(cl.canonValue), hv = Number(hco3.canonValue);
    if ([nav, clv, hv].every(isFinite)) {
      const ag = nav - (clv + hv);
      const res = { ok: true, value: Math.round(ag * 10) / 10, unit: "mmol/L", refLow: 8, refHigh: 12, source: "aniongap" };
      const alb = latestOf(labs, "albumin");   // g/dL in REF_LIB
      if (alb && isFinite(Number(alb.canonValue))) {
        const albv = Number(alb.canonValue);
        const corr = ag + 2.5 * (4.0 - albv);
        res.corrected = Math.round(corr * 10) / 10;
        res.correctedFor = "albumin";
      }
      out.anionGap = res;
    }
  }

  // Albumin-corrected calcium (Payne): Ca + 0.8×(4.0 − albumin g/dL). Total calcium is misleading
  // when albumin is off because ~40% of it is protein-bound. HONEST LIMIT: this formula is known to
  // over/under-estimate ionised calcium and can mask or invent abnormality — where calcium status
  // truly matters, ionised calcium is the better test. So it is reported WITH that caveat, and only
  // when albumin is actually abnormal (>= 4.0 the measured value stands).
  const ca = latestOf(labs, "calcium"), albc = latestOf(labs, "albumin");
  if (ca && albc) {
    const cav = Number(ca.canonValue), av = Number(albc.canonValue);  // mg/dL, g/dL
    if (isFinite(cav) && isFinite(av) && av < 4.0) {
      const corr = cav + 0.8 * (4.0 - av);
      out.correctedCalcium = { ok: true, value: Math.round(corr * 100) / 100, unit: "mg/dL", refLow: 8.6, refHigh: 10.2, caveat: "ionised-calcium-preferred", source: "corrected-calcium" };
    }
  }

  // Globulin (= total protein − albumin) and the A/G ratio (= albumin / globulin). Both are on every
  // basic metabolic/liver panel and are CALCULATED, not measured. A low A/G ratio (<1.0) means
  // globulin has overtaken albumin — seen in chronic inflammation, autoimmune disease, liver disease
  // and multiple myeloma; a high ratio (>2.5) usually means low globulin. IMPORTANT and encoded as a
  // caveat: the ratio is only a flag — it doesn't say which protein is abnormal, so it must be read
  // alongside albumin and globulin, never alone. Needs total protein and albumin, both g/dL.
  const tp = latestOf(labs, "totalProtein"), albG = latestOf(labs, "albumin");
  if (tp && albG) {
    const t = Number(tp.canonValue), al = Number(albG.canonValue);   // both g/dL
    if (isFinite(t) && isFinite(al) && t > al && al > 0) {
      const glob = t - al;
      if (glob > 0) {
        const ag = al / glob;
        const band = ag < 1.0 ? "low" : (ag > 2.5 ? "high" : "normal");
        out.globulinAG = {
          ok: true,
          globulin: Math.round(glob * 10) / 10,
          agRatio: Math.round(ag * 100) / 100,
          band,
          refLow: 1.0, refHigh: 2.5,
          caveat: "ag-ratio-is-a-flag",
          source: "globulin-ag",
        };
      }
    }
  }

  // Non-HDL cholesterol = Total − HDL. Captures all the atherogenic particles (not just LDL) in one
  // number; a common secondary lipid target. Simple and robust (valid even when triglycerides are
  // high, unlike Friedewald LDL).
  const cholN = latestOf(labs, "cholesterol"), hdlN = latestOf(labs, "hdl");
  if (cholN && hdlN) {
    const c = Number(cholN.canonValue), h = Number(hdlN.canonValue);
    if (isFinite(c) && isFinite(h)) {
      out.nonHDL = { ok: true, value: Math.round((c - h) * 10) / 10, unit: "mg/dL", refHigh: 130, source: "non-hdl" };
    }
  }

  // BUN:creatinine ratio — helps separate pre-renal (dehydration, ratio typically >20) from
  // intrinsic renal patterns (ratio ~10–15). Both must be in mg/dL; the module reports the ratio and
  // a broad band, never a diagnosis. Needs BUN, which is a distinct test from urea.
  const bun = latestOf(labs, "bun"), crb = latestOf(labs, "creatinine");
  if (bun && crb) {
    const b = Number(bun.canonValue), cr = Number(crb.canonValue);   // both mg/dL
    if (isFinite(b) && isFinite(cr) && cr > 0) {
      const ratio = b / cr;
      const band = ratio > 20 ? "high" : (ratio < 10 ? "low" : "normal");
      out.bunCrRatio = { ok: true, value: Math.round(ratio * 10) / 10, band, refLow: 10, refHigh: 20, source: "bun-cr-ratio" };
    }
  }

  // Transferrin saturation (TSAT) = serum iron / TIBC × 100. More stable and meaningful than serum
  // iron alone; low (<20%) points to iron deficiency, high (>45%) to iron overload. Read with
  // ferritin. Serum iron and TIBC must share units (both canonical µg/dL here).
  const ironL = latestOf(labs, "iron"), tibcL = latestOf(labs, "tibc");
  if (ironL && tibcL) {
    const fe = Number(ironL.canonValue), tb = Number(tibcL.canonValue);
    if (isFinite(fe) && isFinite(tb) && tb > 0) {
      const tsat = (fe / tb) * 100;
      const band = tsat < 20 ? "low" : (tsat > 45 ? "high" : "normal");
      out.tsat = { ok: true, value: Math.round(tsat * 10) / 10, unit: "%", band, refLow: 20, refHigh: 45, source: "tsat" };
    }
  }

  // Estimated average glucose (eAG) from HbA1c — ADAG/Nathan 2008: eAG mg/dL = 28.7×A1c − 46.7. This
  // is the single thing people with diabetes most want: their A1c translated into the mg/dL they see
  // on a meter. HONEST LIMITS encoded as a caveat: the relationship is altered in pregnancy (standard
  // eAG should NOT be used then) and A1c can diverge from true average glucose in anaemia, recent
  // blood loss, kidney disease or haemoglobin variants.
  const a1c = latestOf(labs, "hba1c");
  if (a1c) {
    const hv = Number(a1c.canonValue);   // %
    if (isFinite(hv) && hv > 0) {
      const eag = 28.7 * hv - 46.7;
      out.eag = { ok: true, value: Math.round(eag), unit: "mg/dL", mmol: Math.round((eag / 18) * 10) / 10, caveat: "eag-unreliable-when", source: "eag" };
    }
  }

  // Calculated serum osmolality = 2×Na + glucose/18 + BUN/2.8 (ADA/AAP). Screening estimate; a large
  // gap vs a measured value can flag unmeasured osmoles (e.g. toxic alcohols) — but this only reports
  // the calculated number, never a gap it cannot see. Needs Na, glucose and BUN together.
  const naO = latestOf(labs, "sodium"), gluO = latestOf(labs, "glucose"), bunO = latestOf(labs, "bun");
  if (naO && gluO && bunO) {
    const nav = Number(naO.canonValue), gv = Number(gluO.canonValue), bv = Number(bunO.canonValue);
    if ([nav, gv, bv].every(isFinite)) {
      const osm = 2 * nav + gv / 18 + bv / 2.8;
      out.osmolality = { ok: true, value: Math.round(osm), unit: "mOsm/kg", refLow: 275, refHigh: 295, source: "osmolality" };
    }
  }

  // Sodium corrected for hyperglycaemia (Katz 1973): measured Na + 1.6×(glucose − 100)/100. High
  // glucose pulls water out of cells and dilutes sodium, so a low measured sodium may be
  // pseudohyponatraemia. Only meaningful when glucose is actually raised, so it only fires above
  // 100 mg/dL, and it carries the caveat that this is an estimate, not the "true" sodium.
  if (naO && gluO) {
    const nav = Number(naO.canonValue), gv = Number(gluO.canonValue);
    if (isFinite(nav) && isFinite(gv) && gv > 100) {
      const corr = nav + 1.6 * (gv - 100) / 100;
      out.correctedSodium = { ok: true, value: Math.round(corr * 10) / 10, unit: "mmol/L", measured: nav, caveat: "estimate-not-true-value", source: "corrected-sodium" };
    }
  }

  // Fractional excretion of sodium (FENa) = (UNa × PCr) / (PNa × UCr) × 100. The classic tool for
  // splitting the two commonest causes of acute kidney injury: prerenal (the kidney is fine but
  // under-perfused, so it avidly holds sodium → FENa <1%) vs intrinsic/ATN (damaged tubules can't
  // hold sodium → FENa >2%). This directly complements the AKI alert. Needs four values, all paired
  // by unit (Na in mmol/L, creatinine in mg/dL). HONEST LIMITS encoded as caveats: diuretics falsely
  // raise it (use FEUrea then), and it's unreliable in CKD and can be low despite hypovolaemia in
  // cirrhosis/heart failure — so it's a pointer, never a verdict.
  const uNa = latestOf(labs, "urineSodium"), uCr = latestOf(labs, "urineCreatinine");
  const pNa = latestOf(labs, "sodium"), pCr = latestOf(labs, "creatinine");
  if (uNa && uCr && pNa && pCr) {
    const un = Number(uNa.canonValue), uc = Number(uCr.canonValue), pn = Number(pNa.canonValue), pc = Number(pCr.canonValue);
    if ([un, uc, pn, pc].every(isFinite) && pn > 0 && uc > 0) {
      const fena = ((un * pc) / (pn * uc)) * 100;
      const band = fena < 1 ? "prerenal" : (fena > 2 ? "intrinsic" : "indeterminate");
      out.fena = {
        ok: true,
        value: Math.round(fena * 100) / 100,
        band,
        caveat: ctx.onDiuretic ? "fena-diuretic-unreliable" : "fena-context",
        source: "fena",
      };
    }
  }

  return out;
}

// ---------------------------------------------------------------------------
// Patterns
// ---------------------------------------------------------------------------
// Recognising a *picture* across several tests is a large part of what reading a panel means.
// These are deliberately phrased as "this looks like the pattern of X — ask your doctor", never
// as a diagnosis, and each carries the reasoning so the user can see why.
// ---------------------------------------------------------------------------
// Dialysis adequacy — URR and Kt/V
// ---------------------------------------------------------------------------
// Unlike the other derived values these are SESSION-based: they need the urea/BUN before and after
// a haemodialysis session, not a single lab point. So this takes an explicit session object rather
// than reading `labs`. Everything is verified against Daugirdas' second-generation formula and the
// KDOQI adequacy targets.
//
// URR = (1 - postBUN/preBUN) × 100. Target >= 65% for thrice-weekly HD. Simple, but it ignores
// fluid removal, so in patients with large ultrafiltration it can understate real clearance.
//
// Kt/V (single-pool, Daugirdas 2nd generation):
//   Kt/V = -ln(R - 0.008×t) + (4 - 3.5×R) × UF/W
//   R = postBUN/preBUN, t = session hours, UF = fluid removed (L), W = post-dialysis weight (kg).
//   KDOQI minimum adequate target 1.2. This is the preferred measure because the UF/W term accounts
//   for ultrafiltration.
//
// Refuses (returns ok:false) rather than guessing when inputs are missing or non-physiological
// (e.g. post >= pre, which would make URR negative and the log undefined).
export function dialysisAdequacy(session = {}) {
  const pre = Number(session.preBUN);
  const post = Number(session.postBUN);
  if (!isFinite(pre) || !isFinite(post) || pre <= 0 || post < 0) {
    return { ok: false, reason: "need-pre-post-bun" };
  }
  if (post >= pre) {
    // Post should be lower than pre after dialysis; if not, the sample or entry is off, and both
    // formulas break (URR <= 0, and the Kt/V log goes undefined). Say so rather than emit nonsense.
    return { ok: false, reason: "post-not-below-pre" };
  }
  const R = post / pre;
  const out = { ok: true };

  // URR
  const urr = (1 - R) * 100;
  out.urr = { value: Math.round(urr * 10) / 10, target: 65, adequate: urr >= 65, unit: "%", source: "dialysis-kdoqi" };

  // Kt/V needs the session mechanics too. Compute only if all are present and sensible.
  const t = Number(session.hours);
  const uf = Number(session.ufLiters);
  const w = Number(session.postWeightKg);
  if (isFinite(t) && t > 0 && isFinite(uf) && uf >= 0 && isFinite(w) && w > 0) {
    const inner = R - 0.008 * t;
    if (inner > 0) {
      const ktv = -Math.log(inner) + (4 - 3.5 * R) * (uf / w);
      out.ktv = { value: Math.round(ktv * 100) / 100, target: 1.2, adequate: ktv >= 1.2, formula: "Daugirdas-2G", source: "dialysis-kdoqi" };
    }
  }
  return out;
}

const lvl = (r) => (r && r.level) || null;

export function patterns(labs, ctx = {}) {
  const out = [];
  const L = (t) => latestOf(labs, t);

  // Iron-deficiency picture: low haemoglobin + low ferritin (+ high TIBC supports it).
  const hb = L("hemoglobin"), fer = L("ferritin"), tibc = L("tibc");
  if (hb && fer && lvl(hb) === "low" && lvl(fer) === "low") {
    const why = ["hemoglobin", "ferritin"];
    if (tibc && lvl(tibc) === "high") why.push("tibc");
    out.push({
      id: "iron-deficiency",
      tests: why,
      strength: why.length >= 3 ? "supported" : "possible",
      // Ferritin is an acute-phase reactant: infection/inflammation can lift it into the normal
      // range and mask a real deficiency. Saying so is the difference between a rule and a doctor.
      caveat: "ferritin-acute-phase",
      source: "pattern",
    });
  }

  // Liver injury pattern: cholestatic vs hepatocellular. ALT/AST speak to hepatocellular injury; ALP
  // (with bilirubin) to a cholestatic picture. When ALP is present and high we add it and flag the
  // pattern accordingly; when it's absent we say so, since it's needed to tell the two apart. The
  // AST:ALT ratio is descriptive only — never a diagnosis.
  const alt = L("alt"), ast = L("ast"), bil = L("bilirubin"), alp = L("alp");
  if (alt && ast && (lvl(alt) === "high" || lvl(ast) === "high" || (alp && lvl(alp) === "high"))) {
    const a = Number(alt.canonValue), s = Number(ast.canonValue);
    const ratio = a > 0 ? s / a : null;
    const p = {
      id: "liver-enzymes-raised",
      tests: ["alt", "ast"],
      astAltRatio: ratio == null ? null : Math.round(ratio * 100) / 100,
      strength: "possible",
      source: "pattern",
    };
    if (bil && lvl(bil) === "high") p.tests.push("bilirubin");
    if (alp && lvl(alp) === "high") {
      p.tests.push("alp");
      // ALP high with a bilirubin rise leans cholestatic; ALP high but transaminases dominant leans
      // hepatocellular. Only a hint, and only when we actually have ALP.
      p.picture = (bil && lvl(bil) === "high") ? "cholestatic-hint" : "mixed-hint";
    } else if (!alp) {
      p.missing = ["alp"];   // needed to call cholestatic vs hepatocellular
    }
    out.push(p);
  }

  // Kidney-function picture: low eGFR and/or raised urine albumin:creatinine (UACR). KDIGO stages
  // CKD on both axes, so this reports whichever is present and says what's missing. eGFR comes from
  // ctx (computed from the latest creatinine upstream); UACR is a lab. Reported as 'possible', with
  // the important caveat that a single low eGFR is not CKD — that needs persistence over >=3 months.
  const egfr = ctx.egfr == null ? null : Number(ctx.egfr);
  const uacr = L("uacr");
  const egfrLow = egfr != null && isFinite(egfr) && egfr < 60;
  const uacrHigh = uacr && (lvl(uacr) === "high" || lvl(uacr) === "borderline");
  if (egfrLow || uacrHigh) {
    const tests = [];
    if (egfrLow) tests.push("creatinine");
    if (uacrHigh) tests.push("uacr");
    const p = { id: "kidney-impairment", tests, strength: (egfrLow && uacrHigh) ? "supported" : "possible", caveat: "ckd-needs-persistence", source: "pattern" };
    if (egfr != null && isFinite(egfr)) p.egfr = Math.round(egfr);
    if (!uacr) p.missing = ["uacr"];        // the second KDIGO axis
    out.push(p);
  }

  // Thyroid picture. TSH alone is a screen, not an answer: high TSH suggests hypothyroid, low TSH
  // hyperthyroid, but free T4 is needed to say more (and to separate overt from subclinical). So
  // this reports the TSH direction and, if free T4 is present, notes whether the pair fits a
  // consistent picture — always as 'possible', pointing at the doctor.
  const tsh = L("tsh"), ft4 = L("ft4");
  if (tsh && (lvl(tsh) === "high" || lvl(tsh) === "low")) {
    const dir = lvl(tsh) === "high" ? "tsh-high" : "tsh-low";
    const p = { id: "thyroid-screen", tests: ["tsh"], direction: dir, strength: "possible", source: "pattern" };
    if (ft4 && lvl(ft4)) {
      p.tests.push("ft4");
      p.ft4Level = lvl(ft4);
    } else {
      p.missing = ["ft4"];   // needed to interpret and to separate overt vs subclinical
    }
    out.push(p);
  }

  // Electrolyte disturbance: two or more electrolytes out of range at once is worth surfacing as a
  // group rather than as isolated values, because combinations point somewhere (e.g. low K + low Mg
  // often travel together). Purely descriptive — lists which are off, no cause claimed.
  const elytes = ["sodium", "potassium", "calcium", "magnesium", "phosphorus"];
  const offElytes = elytes.map(t => ({ t, r: L(t) })).filter(x => x.r && x.r.level && x.r.level !== "normal");
  if (offElytes.length >= 2) {
    out.push({
      id: "electrolyte-disturbance",
      tests: offElytes.map(x => x.t),
      details: offElytes.map(x => ({ test: x.t, level: x.r.level })),
      strength: "possible",
      source: "pattern",
    });
  }

  // Anaemia morphology by MCV. When haemoglobin is low, MCV is the first fork a clinician takes:
  // microcytic (<80 fL, e.g. iron deficiency, thalassaemia), normocytic (80–100, e.g. chronic
  // disease, acute blood loss) or macrocytic (>100, e.g. B12/folate deficiency). This classifies the
  // picture and names the broad category — never a specific diagnosis, and only when anaemia is
  // actually present (a low MCV with normal haemoglobin is not this).
  const hgb = L("hemoglobin"), mcv = L("mcv");
  if (hgb && lvl(hgb) === "low" && mcv) {
    const m = Number(mcv.canonValue);
    if (isFinite(m)) {
      const morph = m < 80 ? "microcytic" : (m > 100 ? "macrocytic" : "normocytic");
      out.push({ id: "anemia-morphology", tests: ["hemoglobin", "mcv"], morphology: morph, mcvValue: Math.round(m * 10) / 10, strength: "possible", source: "anemia-morphology" });
    }
  }

  return out;
}

// ---------------------------------------------------------------------------
// Drug x lab cross-checks
// ---------------------------------------------------------------------------
// The point is not to change the dose — it is to surface the question the person should be
// asking. Matching is on the active ingredient, case-insensitive, on the medication name.
const RULES = [
  {
    id: "metformin-egfr",
    drugs: ["metformin", "glucophage", "glifor"],
    needs: { egfrBelow: 30 },
    severity: "high",
  },
  {
    id: "metformin-egfr-review",
    drugs: ["metformin", "glucophage", "glifor"],
    needs: { egfrBelow: 45, egfrAtLeast: 30 },
    severity: "medium",
  },
  {
    id: "acei-arb-potassium",
    drugs: ["lisinopril", "ramipril", "enalapril", "perindopril", "losartan", "valsartan", "irbesartan", "candesartan", "telmisartan"],
    needs: { testHigh: "potassium" },
    severity: "high",
  },
  {
    id: "spironolactone-potassium",
    drugs: ["spironolactone", "eplerenone", "aldactone"],
    needs: { testHigh: "potassium" },
    severity: "high",
  },
  {
    id: "statin-liver",
    drugs: ["atorvastatin", "simvastatin", "rosuvastatin", "pravastatin", "lipitor", "crestor"],
    needs: { testHigh: "alt" },
    severity: "medium",
  },
  {
    id: "diuretic-sodium",
    drugs: ["furosemide", "hydrochlorothiazide", "indapamide", "chlortalidone", "lasix"],
    needs: { testLow: "sodium" },
    severity: "high",
  },
  {
    id: "warfarin-inr",
    drugs: ["warfarin", "coumadin"],
    needs: { testCritical: "inr" },
    severity: "high",
  },
  {
    // Hypokalaemia sensitises the myocardium to digoxin — FDA label: toxicity can occur even at
    // therapeutic levels. Same for low magnesium (separate rule below).
    id: "digoxin-potassium",
    drugs: ["digoxin", "lanoxin", "digoksin"],
    needs: { testLow: "potassium" },
    severity: "high",
  },
  {
    id: "digoxin-magnesium",
    drugs: ["digoxin", "lanoxin", "digoksin"],
    needs: { testLow: "magnesium" },
    severity: "high",
  },
  {
    // Digoxin is renally excreted; impaired function raises toxicity risk (dose reduced <60 mL/min).
    id: "digoxin-egfr",
    drugs: ["digoxin", "lanoxin", "digoksin"],
    needs: { egfrBelow: 60 },
    severity: "medium",
  },
  {
    // NSAIDs reduce renal perfusion; risk of decompensation in impaired kidneys, esp. with ACEi/ARB
    // or diuretics (the 'triple whammy'). Surface it whenever eGFR is low.
    id: "nsaid-egfr",
    drugs: ["ibuprofen", "naproxen", "diclofenac", "celecoxib", "indomethacin", "ketorolac", "brufen", "voltaren", "aleve", "advil"],
    needs: { egfrBelow: 60 },
    severity: "medium",
  },
  {
    // Allopurinol clearance falls with renal function; dose adjustment reduces toxicity risk.
    id: "allopurinol-egfr",
    drugs: ["allopurinol", "zyloprim", "urikoz"],
    needs: { egfrBelow: 60 },
    severity: "medium",
  },
];

export function drugLabChecks(meds, labs, ctx = {}) {
  const out = [];
  const names = (meds || []).map(m => String((m && m.name) || "").toLowerCase()).filter(Boolean);
  if (!names.length) return out;
  const egfr = ctx.egfr == null ? null : Number(ctx.egfr);

  for (const rule of RULES) {
    const hit = rule.drugs.find(d => names.some(n => n.includes(d)));
    if (!hit) continue;
    const need = rule.needs;

    if (need.egfrBelow != null) {
      if (egfr == null || !isFinite(egfr)) continue;
      if (!(egfr < need.egfrBelow)) continue;
      if (need.egfrAtLeast != null && !(egfr >= need.egfrAtLeast)) continue;
      out.push({ id: rule.id, drug: hit, severity: rule.severity, egfr, source: "drug-label" });
      continue;
    }
    if (need.testHigh) {
      const r = latestOf(labs, need.testHigh);
      if (!r || (lvl(r) !== "high" && lvl(r) !== "critical-high")) continue;
      out.push({ id: rule.id, drug: hit, severity: lvl(r) === "critical-high" ? "high" : rule.severity, test: need.testHigh, value: r.canonValue, level: lvl(r), source: "drug-label" });
      continue;
    }
    if (need.testLow) {
      const r = latestOf(labs, need.testLow);
      if (!r || (lvl(r) !== "low" && lvl(r) !== "critical-low")) continue;
      out.push({ id: rule.id, drug: hit, severity: lvl(r) === "critical-low" ? "high" : rule.severity, test: need.testLow, value: r.canonValue, level: lvl(r), source: "drug-label" });
      continue;
    }
    if (need.testCritical) {
      const r = latestOf(labs, need.testCritical);
      if (!r || !String(lvl(r) || "").startsWith("critical")) continue;
      out.push({ id: rule.id, drug: hit, severity: "high", test: need.testCritical, value: r.canonValue, level: lvl(r), source: "drug-label" });
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// Roll-up for the AI context
// ---------------------------------------------------------------------------
// Compact by design: this is injected into every message, so it must earn its tokens. Only
// abnormal things, only real trends, and the critical list first.
export function clinicalSummary(labs, meds, ctx = {}) {
  const latest = {};
  for (const r of labs || []) {
    if (r && r.test && (!latest[r.test] || r.ts > latest[r.test].ts)) latest[r.test] = r;
  }
  const criticals = Object.values(latest)
    .filter(r => String(r.level || "").startsWith("critical"))
    .map(r => ({ test: r.test, value: r.canonValue, unit: r.canonUnit, level: r.level, source: "critical-arup" }));

  const trends = [];
  for (const test of Object.keys(latest)) {
    const tr = trendFor(labs, test);
    if (tr.ok && tr.dir !== "flat") trends.push({ test, dir: tr.dir, pct: tr.pct, spanDays: tr.spanDays, n: tr.n });
  }
  return {
    criticals,
    trends,
    patterns: patterns(labs, ctx),
    drugChecks: drugLabChecks(meds, labs, ctx),
    derived: derived(labs, ctx),
    alerts: trendAlert(labs),
  };
}
