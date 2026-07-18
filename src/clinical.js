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

export function derived(labs) {
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
      out.ldlCalc = { ok: true, value: Math.round(v * 10) / 10, unit: "mg/dL", formula: "Friedewald" };
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
    });
  }

  // Liver injury pattern: cholestatic vs hepatocellular. ALP is not in the catalogue yet, so this
  // reports the transaminase picture only and says what is missing rather than guessing.
  const alt = L("alt"), ast = L("ast"), bil = L("bilirubin"), alp = L("alp");
  if (alt && ast && (lvl(alt) === "high" || lvl(ast) === "high")) {
    const a = Number(alt.canonValue), s = Number(ast.canonValue);
    const ratio = a > 0 ? s / a : null;
    const p = {
      id: "liver-enzymes-raised",
      tests: ["alt", "ast"],
      astAltRatio: ratio == null ? null : Math.round(ratio * 100) / 100,
      strength: "possible",
    };
    if (bil && lvl(bil) === "high") p.tests.push("bilirubin");
    if (!alp) p.missing = ["alp"];   // needed to call cholestatic vs hepatocellular
    out.push(p);
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
      out.push({ id: rule.id, drug: hit, severity: rule.severity, egfr });
      continue;
    }
    if (need.testHigh) {
      const r = latestOf(labs, need.testHigh);
      if (!r || (lvl(r) !== "high" && lvl(r) !== "critical-high")) continue;
      out.push({ id: rule.id, drug: hit, severity: lvl(r) === "critical-high" ? "high" : rule.severity, test: need.testHigh, value: r.canonValue, level: lvl(r) });
      continue;
    }
    if (need.testLow) {
      const r = latestOf(labs, need.testLow);
      if (!r || (lvl(r) !== "low" && lvl(r) !== "critical-low")) continue;
      out.push({ id: rule.id, drug: hit, severity: lvl(r) === "critical-low" ? "high" : rule.severity, test: need.testLow, value: r.canonValue, level: lvl(r) });
      continue;
    }
    if (need.testCritical) {
      const r = latestOf(labs, need.testCritical);
      if (!r || !String(lvl(r) || "").startsWith("critical")) continue;
      out.push({ id: rule.id, drug: hit, severity: "high", test: need.testCritical, value: r.canonValue, level: lvl(r) });
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
    .map(r => ({ test: r.test, value: r.canonValue, unit: r.canonUnit, level: r.level }));

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
    derived: derived(labs),
  };
}
