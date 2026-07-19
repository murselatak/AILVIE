import { CRITICAL, SOURCES, criticalFor, trendFor, trendAlert, patterns, drugLabChecks, derived, dialysisAdequacy, clinicalSummary } from "../src/clinical.js";

let pass = 0, fail = 0;
const ok = (name, cond, extra) => { if (cond) { pass++; } else { fail++; console.log("  ✗ " + name + (extra ? "  → " + JSON.stringify(extra) : "")); } };

// --- REF_LIB units, copied from App.jsx. If these drift apart the thresholds become nonsense,
// which is exactly the class of bug that must never ship in a health app.
const REF_UNITS = {
  hemoglobin: "g/L", platelet: "x10^9/L", sodium: "mmol/L", potassium: "mmol/L",
  calcium: "mg/dL", magnesium: "mg/dL", phosphorus: "mg/dL", pt: "s", aptt: "s",
};

console.log("=== 1) Birim tutarliligi (REF_LIB ile ayni mi?) ===");
for (const [test, c] of Object.entries(CRITICAL)) {
  ok("unit " + test, REF_UNITS[test] === c.unit, { critical: c.unit, refLib: REF_UNITS[test] });
}

console.log("=== 2) Kritik esik sinirlari ===");
// potassium: REF_LIB normal 3.5-5.0, critical <3.0 / >6.1
ok("K 7.5 -> critical-high", criticalFor("potassium", 7.5) === "critical-high");
ok("K 5.3 -> null (sadece yuksek)", criticalFor("potassium", 5.3) === null);
ok("K 6.1 -> null (sinir dahil degil)", criticalFor("potassium", 6.1) === null);
ok("K 6.2 -> critical-high", criticalFor("potassium", 6.2) === "critical-high");
ok("K 2.9 -> critical-low", criticalFor("potassium", 2.9) === "critical-low");
ok("K 4.0 -> null", criticalFor("potassium", 4.0) === null);

// haemoglobin is the unit trap: 7.0 g/dL == 70 g/L
ok("Hb 65 g/L -> critical-low", criticalFor("hemoglobin", 65) === "critical-low");
ok("Hb 70 g/L -> null (sinirin kendisi)", criticalFor("hemoglobin", 70) === null);
ok("Hb 120 g/L -> null (dusuk ama kritik degil)", criticalFor("hemoglobin", 120) === null);
ok("Hb 7 (yanlislikla g/dL girilse) -> critical-low", criticalFor("hemoglobin", 7) === "critical-low");

ok("Na 115 -> critical-low", criticalFor("sodium", 115) === "critical-low");
ok("Na 132 -> null", criticalFor("sodium", 132) === null);
ok("Plt 15 -> critical-low", criticalFor("platelet", 15) === "critical-low");
ok("Plt 1200 -> critical-high", criticalFor("platelet", 1200) === "critical-high");
ok("Plt 250 -> null", criticalFor("platelet", 250) === null);
ok("Ca 5.5 -> critical-low", criticalFor("calcium", 5.5) === "critical-low");
ok("Ca 13.5 -> critical-high", criticalFor("calcium", 13.5) === "critical-high");
ok("aPTT 90 -> critical-high", criticalFor("aptt", 90) === "critical-high");
ok("aPTT tek yonlu (dusuk kritik yok)", criticalFor("aptt", 5) === null);
ok("bilinmeyen test -> null", criticalFor("zzz", 999) === null);
ok("gecersiz deger -> null", criticalFor("potassium", NaN) === null);

console.log("=== 3) Trend ===");
const D = 86400000, T0 = Date.now() - 90 * D;
const mk = (test, vals) => vals.map((v, i) => ({ id: "x" + i, ts: T0 + i * 30 * D, test, canonValue: v, canonUnit: "mg/dL", level: "normal" }));
const up = trendFor(mk("creatinine", [0.9, 1.2, 1.6]), "creatinine");
ok("yukselen trend tespit", up.ok && up.dir === "up", up);
ok("yukselen % pozitif", up.ok && up.pct > 0, up.pct);
ok("gun araligi ~60", up.ok && Math.abs(up.spanDays - 60) <= 1, up.spanDays);
const dn = trendFor(mk("hemoglobin", [140, 120, 95]), "hemoglobin");
ok("dusen trend tespit", dn.ok && dn.dir === "down", dn);
const fl = trendFor(mk("sodium", [140, 141, 140]), "sodium");
ok("duz trend tespit", fl.ok && fl.dir === "flat", fl);
const few = trendFor(mk("alt", [30, 40]), "alt");
ok("2 nokta -> trend yok", !few.ok && few.reason === "not-enough-points", few);
ok("bos veri -> trend yok", !trendFor([], "alt").ok);

console.log("=== 3b) AKI (trend hızlanma) ===");
const now = Date.now();
// 48h absolute rise >=0.3: 1.0 -> 1.4 over 24h
const aki48 = trendAlert([
  { id: "a", ts: now - 24 * 3600 * 1000, test: "creatinine", canonValue: 1.0, canonUnit: "mg/dL" },
  { id: "b", ts: now, test: "creatinine", canonValue: 1.4, canonUnit: "mg/dL" },
]);
ok("AKI: 48s'de ≥0.3 artış yakalandı", aki48.length === 1 && aki48[0].id === "aki-rising-creatinine", aki48);
ok("48s mutlak artış kriteri", aki48[0].criterion === "abs-48h" && aki48[0].absRise === 0.4);
// 7-day ratio >=1.5: 1.0 -> 1.8 over 5 days (ratio 1.8 -> stage 1)
const aki7 = trendAlert([
  { id: "a", ts: now - 5 * D, test: "creatinine", canonValue: 1.0, canonUnit: "mg/dL" },
  { id: "b", ts: now, test: "creatinine", canonValue: 1.8, canonUnit: "mg/dL" },
]);
ok("AKI: 7g'de ≥1.5× yakalandı", aki7.length === 1 && aki7[0].ratio === 1.8, aki7);
ok("evre 1 (1.5–1.9×)", aki7[0].stage === 1);
// stage 3: ratio >=3
const aki3 = trendAlert([
  { id: "a", ts: now - 3 * D, test: "creatinine", canonValue: 1.0, canonUnit: "mg/dL" },
  { id: "b", ts: now, test: "creatinine", canonValue: 3.5, canonUnit: "mg/dL" },
]);
ok("evre 3 (≥3×)", aki3[0].stage === 3, aki3);
// stage 3 by absolute >=4.0
const aki4 = trendAlert([
  { id: "a", ts: now - 2 * D, test: "creatinine", canonValue: 3.0, canonUnit: "mg/dL" },
  { id: "b", ts: now, test: "creatinine", canonValue: 4.2, canonUnit: "mg/dL" },
]);
ok("evre 3 (≥4.0 mg/dL)", aki4[0].stage === 3, aki4);
// stable creatinine -> no alert
ok("stabil kreatinin → AKI uyarısı yok", trendAlert([
  { id: "a", ts: now - 5 * D, test: "creatinine", canonValue: 1.0, canonUnit: "mg/dL" },
  { id: "b", ts: now, test: "creatinine", canonValue: 1.05, canonUnit: "mg/dL" },
]).length === 0);
// old rise outside 7d window -> no alert
ok("7 günden eski yükseliş → uyarı yok", trendAlert([
  { id: "a", ts: now - 30 * D, test: "creatinine", canonValue: 1.0, canonUnit: "mg/dL" },
  { id: "b", ts: now, test: "creatinine", canonValue: 2.0, canonUnit: "mg/dL" },
]).length === 0);
ok("tek değer → AKI uyarısı yok", trendAlert([{ id: "a", ts: now, test: "creatinine", canonValue: 3.0, canonUnit: "mg/dL" }]).length === 0);
ok("AKI kaynağı SOURCES'ta", aki48[0].source === "aki-kdigo" && SOURCES["aki-kdigo"]);
// direction carries no judgement: rising Hb and rising creatinine both report "up"
const hbUp = trendFor(mk("hemoglobin", [90, 110, 135]), "hemoglobin");
ok("yon yargi tasimaz (Hb yukselisi de 'up')", hbUp.ok && hbUp.dir === "up");

console.log("=== 4) Oruntu ===");
const ironLabs = [
  { id: "a", ts: T0, test: "hemoglobin", canonValue: 95, level: "low" },
  { id: "b", ts: T0, test: "ferritin", canonValue: 8, level: "low" },
  { id: "c", ts: T0, test: "tibc", canonValue: 500, level: "high" },
];
const p1 = patterns(ironLabs);
ok("demir eksikligi tablosu", p1.some(p => p.id === "iron-deficiency"), p1);
ok("3 test -> 'supported'", p1.find(p => p.id === "iron-deficiency")?.strength === "supported");
ok("ferritin akut faz uyarisi var", p1.find(p => p.id === "iron-deficiency")?.caveat === "ferritin-acute-phase");
const p2 = patterns([{ id: "a", ts: T0, test: "hemoglobin", canonValue: 95, level: "low" }]);
ok("sadece Hb dusuk -> demir eksikligi IDDIA ETMEZ", !p2.some(p => p.id === "iron-deficiency"), p2);
const liver = patterns([
  { id: "a", ts: T0, test: "alt", canonValue: 120, level: "high" },
  { id: "b", ts: T0, test: "ast", canonValue: 240, level: "high" },
]);
const lp = liver.find(p => p.id === "liver-enzymes-raised");
ok("karaciger enzim tablosu", !!lp, liver);
ok("AST/ALT orani hesaplandi", lp && lp.astAltRatio === 2, lp);
ok("eksik ALP bildiriliyor (tahmin etmiyor)", lp && lp.missing && lp.missing.includes("alp"), lp);
// ALP present and high + bilirubin high -> cholestatic hint
const liverAlp = patterns([
  { id: "a", ts: T0, test: "alt", canonValue: 55, level: "high" },
  { id: "b", ts: T0, test: "ast", canonValue: 60, level: "high" },
  { id: "c", ts: T0, test: "alp", canonValue: 300, level: "high" },
  { id: "d", ts: T0, test: "bilirubin", canonValue: 3, level: "high" },
], {});
const lap = liverAlp.find(p => p.id === "liver-enzymes-raised");
ok("ALP varsa karaciğer örüntüsüne dahil", lap && lap.tests.includes("alp"), lap);
ok("ALP+bilirubin yüksek → kolestatik ipucu", lap && lap.picture === "cholestatic-hint");
ok("ALP dahilken missing yok", lap && !lap.missing);
// ALP high alone (transaminases normal but present) still triggers via ALP
const liverAlpOnly = patterns([
  { id: "a", ts: T0, test: "alt", canonValue: 20, level: "normal" },
  { id: "b", ts: T0, test: "ast", canonValue: 22, level: "normal" },
  { id: "c", ts: T0, test: "alp", canonValue: 300, level: "high" },
], {});
ok("sadece ALP yüksek → örüntü tetiklenir", liverAlpOnly.some(p => p.id === "liver-enzymes-raised"), liverAlpOnly);

console.log("=== 4b) Yeni örüntüler ===");
// Kidney: low eGFR (from ctx) + high UACR
const kid = patterns([
  { id: "a", ts: T0, test: "creatinine", canonValue: 2.5, level: "high" },
  { id: "b", ts: T0, test: "uacr", canonValue: 200, level: "high" },
], { egfr: 35 });
const kp = kid.find(p => p.id === "kidney-impairment");
ok("böbrek örüntüsü (eGFR + UACR)", !!kp, kid);
ok("iki eksen → supported", kp && kp.strength === "supported");
ok("CKD kalıcılık uyarısı", kp && kp.caveat === "ckd-needs-persistence");
ok("eGFR normalse ve UACR yoksa böbrek örüntüsü yok", !patterns([{ id: "a", ts: T0, test: "creatinine", canonValue: 0.9, level: "normal" }], { egfr: 95 }).some(p => p.id === "kidney-impairment"));
// only UACR high, no eGFR -> possible + missing eGFR handled (eGFR null)
const kidU = patterns([{ id: "b", ts: T0, test: "uacr", canonValue: 200, level: "high" }], {});
ok("sadece UACR → possible", kidU.find(p => p.id === "kidney-impairment")?.strength === "possible", kidU);
// Thyroid: high TSH alone
const thy = patterns([{ id: "a", ts: T0, test: "tsh", canonValue: 8, level: "high" }], {});
const tp = thy.find(p => p.id === "thyroid-screen");
ok("tiroid tarama (yüksek TSH)", tp && tp.direction === "tsh-high", thy);
ok("FT4 eksik bildiriliyor", tp && tp.missing && tp.missing.includes("ft4"));
// thyroid with ft4
const thy2 = patterns([
  { id: "a", ts: T0, test: "tsh", canonValue: 8, level: "high" },
  { id: "b", ts: T0, test: "ft4", canonValue: 0.6, level: "low" },
], {});
const tp2 = thy2.find(p => p.id === "thyroid-screen");
ok("FT4 varsa seviye bildirilir", tp2 && tp2.ft4Level === "low", tp2);
ok("normal TSH → tiroid örüntüsü yok", !patterns([{ id: "a", ts: T0, test: "tsh", canonValue: 2, level: "normal" }], {}).some(p => p.id === "thyroid-screen"));
// Electrolyte: two off
const ely = patterns([
  { id: "a", ts: T0, test: "potassium", canonValue: 2.8, level: "low" },
  { id: "b", ts: T0, test: "magnesium", canonValue: 1.2, level: "low" },
], {});
const ep = ely.find(p => p.id === "electrolyte-disturbance");
ok("elektrolit dengesizliği (2+ anormal)", !!ep, ely);
ok("hangi elektrolitler listeleniyor", ep && ep.tests.includes("potassium") && ep.tests.includes("magnesium"));
ok("tek elektrolit anormal → grup örüntüsü yok", !patterns([{ id: "a", ts: T0, test: "potassium", canonValue: 2.8, level: "low" }], {}).some(p => p.id === "electrolyte-disturbance"));

console.log("=== 4c) Anemi morfolojisi (MCV) ===");
// low Hgb + MCV 70 -> microcytic
const anMic = patterns([
  { id: "a", ts: T0, test: "hemoglobin", canonValue: 90, level: "low" },
  { id: "b", ts: T0, test: "mcv", canonValue: 70, level: "low" },
], {});
const amp = anMic.find(p => p.id === "anemia-morphology");
ok("mikrositik anemi (Hgb düşük + MCV 70)", amp && amp.morphology === "microcytic", anMic);
// low Hgb + MCV 110 -> macrocytic
ok("makrositik (MCV 110)", patterns([
  { id: "a", ts: T0, test: "hemoglobin", canonValue: 100, level: "low" },
  { id: "b", ts: T0, test: "mcv", canonValue: 110, level: "high" },
], {}).find(p => p.id === "anemia-morphology")?.morphology === "macrocytic");
// low Hgb + MCV 90 -> normocytic
ok("normositik (MCV 90)", patterns([
  { id: "a", ts: T0, test: "hemoglobin", canonValue: 110, level: "low" },
  { id: "b", ts: T0, test: "mcv", canonValue: 90, level: "normal" },
], {}).find(p => p.id === "anemia-morphology")?.morphology === "normocytic");
// normal Hgb + low MCV -> NOT anemia morphology (not anaemic)
ok("normal Hgb + düşük MCV → anemi morfolojisi YOK", !patterns([
  { id: "a", ts: T0, test: "hemoglobin", canonValue: 150, level: "normal" },
  { id: "b", ts: T0, test: "mcv", canonValue: 75, level: "low" },
], {}).some(p => p.id === "anemia-morphology"));
ok("MCV yoksa morfoloji hesaplanmaz", !patterns([{ id: "a", ts: T0, test: "hemoglobin", canonValue: 90, level: "low" }], {}).some(p => p.id === "anemia-morphology"));
ok("anemi morfolojisi kaynağı", amp && amp.source === "anemia-morphology" && SOURCES["anemia-morphology"]);

console.log("=== 5) Ilac x tahlil ===");
const meds = [{ name: "Glucophage 1000mg" }, { name: "Ramipril 5mg" }];
const c1 = drugLabChecks(meds, [], { egfr: 25 });
ok("metformin + eGFR 25 -> yuksek uyari", c1.some(x => x.id === "metformin-egfr" && x.severity === "high"), c1);
const c2 = drugLabChecks(meds, [], { egfr: 40 });
ok("metformin + eGFR 40 -> gozden gecir", c2.some(x => x.id === "metformin-egfr-review"), c2);
const c3 = drugLabChecks(meds, [], { egfr: 90 });
ok("metformin + eGFR 90 -> uyari yok", !c3.some(x => x.id.startsWith("metformin")), c3);
const c4 = drugLabChecks(meds, [{ id: "k", ts: T0, test: "potassium", canonValue: 5.8, level: "high" }], { egfr: 90 });
ok("ramipril + yuksek K -> uyari", c4.some(x => x.id === "acei-arb-potassium"), c4);
const c5 = drugLabChecks([], [{ id: "k", ts: T0, test: "potassium", canonValue: 5.8, level: "high" }], {});
ok("ilac yoksa uyari yok", c5.length === 0, c5);
const c6 = drugLabChecks(meds, [], {});
ok("eGFR bilinmiyorsa metformin uyarisi UYDURMAZ", !c6.some(x => x.id.startsWith("metformin")), c6);

console.log("=== 5b) Yeni ilaç-tahlil kuralları ===");
const dgK = drugLabChecks([{ name: "Digoxin 0.25mg" }], [{ id: "k", ts: T0, test: "potassium", canonValue: 2.9, level: "low" }], {});
ok("digoksin + düşük K → yüksek uyarı", dgK.some(x => x.id === "digoxin-potassium" && x.severity === "high"), dgK);
const dgM = drugLabChecks([{ name: "Lanoxin" }], [{ id: "m", ts: T0, test: "magnesium", canonValue: 1.2, level: "low" }], {});
ok("digoksin + düşük Mg → uyarı", dgM.some(x => x.id === "digoxin-magnesium"), dgM);
const dgE = drugLabChecks([{ name: "Digoxin" }], [], { egfr: 45 });
ok("digoksin + düşük eGFR → uyarı", dgE.some(x => x.id === "digoxin-egfr"), dgE);
ok("digoksin + normal → uyarı yok", drugLabChecks([{ name: "Digoxin" }], [{ id: "k", ts: T0, test: "potassium", canonValue: 4.0, level: "normal" }], { egfr: 90 }).length === 0);
const ns = drugLabChecks([{ name: "Ibuprofen 400mg" }], [], { egfr: 40 });
ok("NSAİİ + düşük eGFR → uyarı", ns.some(x => x.id === "nsaid-egfr"), ns);
ok("NSAİİ + normal eGFR → uyarı yok", !drugLabChecks([{ name: "Ibuprofen" }], [], { egfr: 90 }).some(x => x.id === "nsaid-egfr"));
ok("NSAİİ + eGFR bilinmiyor → UYDURMAZ", !drugLabChecks([{ name: "Ibuprofen" }], [], {}).some(x => x.id === "nsaid-egfr"));
const al = drugLabChecks([{ name: "Allopurinol 300mg" }], [], { egfr: 35 });
ok("allopurinol + düşük eGFR → uyarı", al.some(x => x.id === "allopurinol-egfr"), al);
ok("yeni kuralların hepsi source taşır", [...dgK, ...ns, ...al].every(x => x.source === "drug-label"));

console.log("=== 6) Turev ===");
const lip = [
  { id: "a", ts: T0, test: "cholesterol", canonValue: 200, level: "normal" },
  { id: "b", ts: T0, test: "hdl", canonValue: 50, level: "normal" },
  { id: "c", ts: T0, test: "triglyceride", canonValue: 150, level: "normal" },
];
const d1 = derived(lip);
ok("Friedewald LDL = 200-50-30 = 120", d1.ldlCalc && d1.ldlCalc.ok && d1.ldlCalc.value === 120, d1);
const lip2 = lip.map(x => x.test === "triglyceride" ? { ...x, canonValue: 450 } : x);
const d2 = derived(lip2);
ok("TG>=400 -> Friedewald REDDEDER (yanlis sayi vermez)", d2.ldlCalc && d2.ldlCalc.ok === false, d2);
ok("HDL yoksa LDL hesaplanmaz", !derived([lip[0], lip[2]]).ldlCalc);

console.log("=== 6b) FIB-4 ===");
const fibLabs = [
  { id: "a", ts: T0, test: "ast", canonValue: 80, level: "high" },
  { id: "b", ts: T0, test: "alt", canonValue: 50, level: "high" },
  { id: "c", ts: T0, test: "platelet", canonValue: 120, level: "low" },
];
// Age 60, AST 80, ALT 50, PLT 120 -> (60*80)/(120*sqrt(50)) = 4800/848.5 = 5.66 -> high
const f4 = derived(fibLabs, { ageYears: 60 });
ok("FIB-4 hesaplandı", f4.fib4 && f4.fib4.ok, f4.fib4);
ok("FIB-4 değeri ~5.66", f4.fib4 && Math.abs(f4.fib4.value - 5.66) < 0.05, f4.fib4 && f4.fib4.value);
ok("FIB-4 yüksek bandı", f4.fib4 && f4.fib4.band === "high");
// low case: young, normal enzymes, good platelets
const f4low = derived([
  { id: "a", ts: T0, test: "ast", canonValue: 20, level: "normal" },
  { id: "b", ts: T0, test: "alt", canonValue: 20, level: "normal" },
  { id: "c", ts: T0, test: "platelet", canonValue: 250, level: "normal" },
], { ageYears: 30 });
ok("FIB-4 düşük bandı (genç, normal)", f4low.fib4 && f4low.fib4.band === "low", f4low.fib4);
// APRI: AST 80, PLT 120 -> (80/40)/120*100 = 1.67 -> high (cirrhosis risk)
ok("APRI hesaplandı ~1.67", f4.apri && Math.abs(f4.apri.value - 1.67) < 0.02, f4.apri);
ok("APRI yüksek bandı (>1.0)", f4.apri && f4.apri.band === "high");
// APRI needs NO age (unlike FIB-4) — fires even without ageYears
const apriNoAge = derived([
  { id: "a", ts: T0, test: "ast", canonValue: 80, level: "high" },
  { id: "c", ts: T0, test: "platelet", canonValue: 120, level: "low" },
], {});
ok("APRI yaş olmadan da hesaplanır", apriNoAge.apri && apriNoAge.apri.ok, apriNoAge.apri);
ok("APRI yaşsızken FIB-4 hesaplanmaz", !apriNoAge.fib4);
// APRI low: normal AST, good platelets -> (20/40)/250*100 = 0.2 -> low
ok("APRI düşük bandı (<0.5)", f4low.apri && f4low.apri.band === "low" && f4low.apri.value === 0.2, f4low.apri);
ok("APRI trombosit yoksa hesaplanmaz", !derived([{ id: "a", ts: T0, test: "ast", canonValue: 80, level: "high" }]).apri);
ok("APRI kaynağı", f4.apri && f4.apri.source === "apri-wai" && SOURCES["apri-wai"]);
// age >=65 uses higher low cutoff (2.0)
const f4old = derived([
  { id: "a", ts: T0, test: "ast", canonValue: 30, level: "normal" },
  { id: "b", ts: T0, test: "alt", canonValue: 25, level: "normal" },
  { id: "c", ts: T0, test: "platelet", canonValue: 200, level: "normal" },
], { ageYears: 70 });
ok("FIB-4 65+ eşiği 2.0 kullanır", f4old.fib4 && f4old.fib4.lowCut === 2.0, f4old.fib4);
ok("yaş yoksa FIB-4 UYDURMAZ", !derived(fibLabs, {}).fib4);
ok("platelet yoksa FIB-4 hesaplanmaz", !derived([fibLabs[0], fibLabs[1]], { ageYears: 60 }).fib4);

console.log("=== 6c) Anyon açığı ===");
// Na 140, Cl 105, HCO3 24 -> AG = 140-(105+24) = 11 (normal)
const agLabs = [
  { id: "a", ts: T0, test: "sodium", canonValue: 140, level: "normal" },
  { id: "b", ts: T0, test: "chloride", canonValue: 105, level: "normal" },
  { id: "c", ts: T0, test: "bicarbonate", canonValue: 24, level: "normal" },
];
const ag = derived(agLabs);
ok("anyon açığı = 11", ag.anionGap && ag.anionGap.value === 11, ag.anionGap);
// high gap: Na 140, Cl 100, HCO3 12 -> 28
const agHigh = derived([
  { id: "a", ts: T0, test: "sodium", canonValue: 140, level: "normal" },
  { id: "b", ts: T0, test: "chloride", canonValue: 100, level: "normal" },
  { id: "c", ts: T0, test: "bicarbonate", canonValue: 12, level: "low" },
]);
ok("yüksek anyon açığı = 28", agHigh.anionGap && agHigh.anionGap.value === 28, agHigh.anionGap);
// albumin correction: low albumin should RAISE the corrected gap
const agAlb = derived([...agLabs, { id: "d", ts: T0, test: "albumin", canonValue: 2.0, level: "low" }]);
// corrected = 11 + 2.5*(4.0-2.0) = 11 + 5 = 16
ok("albümin düzeltmesi (2.0 g/dL) → 16", agAlb.anionGap && agAlb.anionGap.corrected === 16, agAlb.anionGap);
ok("albümin yoksa düzeltme yok", !ag.anionGap.corrected);
ok("klorür yoksa anyon açığı hesaplanmaz", !derived([agLabs[0], agLabs[2]]).anionGap);

console.log("=== 6d) Diyaliz yeterliliği (URR + Kt/V) ===");
// Verified example (Daugirdas): pre 80, post 24, 4h, 2.5L UF, 70kg -> URR 70%, Kt/V ~1.42
const da = dialysisAdequacy({ preBUN: 80, postBUN: 24, hours: 4, ufLiters: 2.5, postWeightKg: 70 });
ok("URR hesaplandı = 70%", da.ok && da.urr.value === 70, da.urr);
ok("URR yeterli (>=65)", da.ok && da.urr.adequate === true);
ok("Kt/V ~1.42", da.ok && Math.abs(da.ktv.value - 1.42) < 0.03, da.ktv);
ok("Kt/V yeterli (>=1.2)", da.ok && da.ktv.adequate === true);
// URR only (no session mechanics) — still gives URR, no Kt/V
const daUrrOnly = dialysisAdequacy({ preBUN: 80, postBUN: 32 });
ok("sadece BUN → URR var (60%)", daUrrOnly.ok && daUrrOnly.urr.value === 60, daUrrOnly.urr);
ok("mekanik yoksa Kt/V yok", daUrrOnly.ok && !daUrrOnly.ktv);
ok("URR 60% yetersiz işaretlenir", daUrrOnly.ok && daUrrOnly.urr.adequate === false);
// safety: post >= pre must refuse, not emit nonsense
const daBad = dialysisAdequacy({ preBUN: 40, postBUN: 45 });
ok("post >= pre → REDDEDER", !daBad.ok && daBad.reason === "post-not-below-pre", daBad);
ok("eksik BUN → reddeder", !dialysisAdequacy({ preBUN: 80 }).ok);

console.log("=== 6e) Kaynak gösterimi ===");
ok("SOURCES sözlüğü var", SOURCES && SOURCES["critical-arup"] && SOURCES["fib4-sterling"]);
ok("LDL kaynağı", derived(lip).ldlCalc.source === "friedewald");
ok("FIB-4 kaynağı", f4.fib4.source === "fib4-sterling");
ok("anyon açığı kaynağı", ag.anionGap.source === "aniongap");
ok("URR/Kt/V kaynağı", da.urr.source === "dialysis-kdoqi" && da.ktv.source === "dialysis-kdoqi");
ok("örüntü kaynağı", p1.find(p => p.id === "iron-deficiency").source === "pattern");
ok("ilaç kontrolü kaynağı", c1.find(x => x.id === "metformin-egfr").source === "drug-label");
const sumSrc = clinicalSummary([{ id: "k", ts: T0, test: "potassium", canonValue: 7.2, level: "critical-high" }], [], {});
ok("kritik değer kaynağı", sumSrc.criticals[0].source === "critical-arup");
ok("her kaynak anahtarı SOURCES'ta tanımlı", ["critical-arup","fib4-sterling","friedewald","aniongap","dialysis-kdoqi","pattern","drug-label"].every(k => SOURCES[k]));

console.log("=== 6f) Yeni türevler ===");
// Corrected calcium: Ca 8.0, albumin 2.0 -> 8.0 + 0.8*(4-2) = 9.6
const ccLabs = [
  { id: "a", ts: T0, test: "calcium", canonValue: 8.0, level: "low" },
  { id: "b", ts: T0, test: "albumin", canonValue: 2.0, level: "low" },
];
const cc = derived(ccLabs);
ok("düzeltilmiş kalsiyum = 9.6", cc.correctedCalcium && cc.correctedCalcium.value === 9.6, cc.correctedCalcium);
ok("iyonize kalsiyum uyarısı var", cc.correctedCalcium && cc.correctedCalcium.caveat === "ionised-calcium-preferred");
ok("albümin normal (>=4) → düzeltme yapılmaz", !derived([{ id: "a", ts: T0, test: "calcium", canonValue: 9.5, level: "normal" }, { id: "b", ts: T0, test: "albumin", canonValue: 4.2, level: "normal" }]).correctedCalcium);
// Globulin + A/G: total protein 7.0, albumin 4.0 -> globulin 3.0, A/G 1.33 (normal)
const agrD = derived([
  { id: "a", ts: T0, test: "totalProtein", canonValue: 7.0, level: "normal" },
  { id: "b", ts: T0, test: "albumin", canonValue: 4.0, level: "normal" },
]);
ok("globulin = 3.0", agrD.globulinAG && agrD.globulinAG.globulin === 3.0, agrD.globulinAG);
ok("A/G oranı = 1.33", agrD.globulinAG && agrD.globulinAG.agRatio === 1.33, agrD.globulinAG);
ok("A/G normal bandı", agrD.globulinAG && agrD.globulinAG.band === "normal");
ok("A/G bir bayraktır uyarısı", agrD.globulinAG && agrD.globulinAG.caveat === "ag-ratio-is-a-flag");
// low A/G: total protein 9.0, albumin 3.0 -> globulin 6.0, A/G 0.5 (low -> myeloma/inflammation)
const agrLow = derived([
  { id: "a", ts: T0, test: "totalProtein", canonValue: 9.0, level: "high" },
  { id: "b", ts: T0, test: "albumin", canonValue: 3.0, level: "low" },
]);
ok("düşük A/G bandı (0.5)", agrLow.globulinAG && agrLow.globulinAG.agRatio === 0.5 && agrLow.globulinAG.band === "low", agrLow.globulinAG);
// high A/G: total protein 6.0, albumin 5.0 -> globulin 1.0, A/G 5.0 (high)
const agrHigh = derived([
  { id: "a", ts: T0, test: "totalProtein", canonValue: 6.0, level: "normal" },
  { id: "b", ts: T0, test: "albumin", canonValue: 5.0, level: "normal" },
]);
ok("yüksek A/G bandı (5.0)", agrHigh.globulinAG && agrHigh.globulinAG.band === "high", agrHigh.globulinAG);
ok("total protein albüminden küçükse hesaplanmaz", !derived([
  { id: "a", ts: T0, test: "totalProtein", canonValue: 3.0, level: "low" },
  { id: "b", ts: T0, test: "albumin", canonValue: 4.0, level: "normal" },
]).globulinAG);
ok("total protein yoksa A/G hesaplanmaz", !derived([{ id: "b", ts: T0, test: "albumin", canonValue: 4.0, level: "normal" }]).globulinAG);
ok("A/G kaynağı", agrD.globulinAG && agrD.globulinAG.source === "globulin-ag" && SOURCES["globulin-ag"]);
// Non-HDL: chol 200, HDL 50 -> 150
const nh = derived([
  { id: "a", ts: T0, test: "cholesterol", canonValue: 200, level: "normal" },
  { id: "b", ts: T0, test: "hdl", canonValue: 50, level: "normal" },
]);
ok("non-HDL = 150", nh.nonHDL && nh.nonHDL.value === 150, nh.nonHDL);
ok("non-HDL yüksek TG'de bile hesaplanır", !!derived([
  { id: "a", ts: T0, test: "cholesterol", canonValue: 250, level: "high" },
  { id: "b", ts: T0, test: "hdl", canonValue: 40, level: "low" },
]).nonHDL);
// BUN:Cr ratio: BUN 40, Cr 1.0 -> 40 (high, pre-renal picture)
const bc = derived([
  { id: "a", ts: T0, test: "bun", canonValue: 40, level: "high" },
  { id: "b", ts: T0, test: "creatinine", canonValue: 1.0, level: "normal" },
]);
ok("BUN:Cr oranı = 40", bc.bunCrRatio && bc.bunCrRatio.value === 40, bc.bunCrRatio);
ok("BUN:Cr yüksek bandı (>20)", bc.bunCrRatio && bc.bunCrRatio.band === "high");
const bc2 = derived([
  { id: "a", ts: T0, test: "bun", canonValue: 14, level: "normal" },
  { id: "b", ts: T0, test: "creatinine", canonValue: 1.0, level: "normal" },
]);
ok("BUN:Cr normal bandı", bc2.bunCrRatio && bc2.bunCrRatio.band === "normal");
// TSAT: iron 30, TIBC 300 -> 10% (low, iron deficiency)
const ts = derived([
  { id: "a", ts: T0, test: "iron", canonValue: 30, level: "low" },
  { id: "b", ts: T0, test: "tibc", canonValue: 300, level: "high" },
]);
ok("TSAT = 10%", ts.tsat && ts.tsat.value === 10, ts.tsat);
ok("TSAT düşük bandı (<20)", ts.tsat && ts.tsat.band === "low");
const ts2 = derived([
  { id: "a", ts: T0, test: "iron", canonValue: 180, level: "high" },
  { id: "b", ts: T0, test: "tibc", canonValue: 300, level: "normal" },
]);
ok("TSAT yüksek bandı (>45)", ts2.tsat && ts2.tsat.band === "high", ts2.tsat);
ok("her yeni türevin kaynağı SOURCES'ta", ["corrected-calcium","non-hdl","bun-cr-ratio","tsat"].every(k => SOURCES[k]));

console.log("=== 6g) eAG / osmolalite / düzeltilmiş sodyum ===");
// eAG: A1c 7.0 -> 28.7*7 - 46.7 = 154.2 -> 154
const eagD = derived([{ id: "a", ts: T0, test: "hba1c", canonValue: 7.0, level: "high" }]);
ok("eAG (A1c 7.0) = 154 mg/dL", eagD.eag && eagD.eag.value === 154, eagD.eag);
ok("eAG mmol/L de veriyor (~8.6)", eagD.eag && Math.abs(eagD.eag.mmol - 8.6) < 0.1, eagD.eag);
ok("eAG güvenilmezlik uyarısı", eagD.eag && eagD.eag.caveat === "eag-unreliable-when");
// Osmolality: Na 140, glu 90, BUN 14 -> 280 + 5 + 5 = 290
const osmD = derived([
  { id: "a", ts: T0, test: "sodium", canonValue: 140, level: "normal" },
  { id: "b", ts: T0, test: "glucose", canonValue: 90, level: "normal" },
  { id: "c", ts: T0, test: "bun", canonValue: 14, level: "normal" },
]);
ok("osmolalite = 290 mOsm/kg", osmD.osmolality && osmD.osmolality.value === 290, osmD.osmolality);
ok("osmolalite Na+glu+BUN gerektirir", !derived([{ id: "a", ts: T0, test: "sodium", canonValue: 140, level: "normal" }]).osmolality);
// Corrected sodium: Na 130, glu 600 -> 130 + 1.6*(500/100) = 130 + 8 = 138
const csD = derived([
  { id: "a", ts: T0, test: "sodium", canonValue: 130, level: "low" },
  { id: "b", ts: T0, test: "glucose", canonValue: 600, level: "high" },
]);
ok("düzeltilmiş sodyum (Na130/glu600) = 138", csD.correctedSodium && csD.correctedSodium.value === 138, csD.correctedSodium);
ok("düzeltilmiş sodyum ölçüleni saklar", csD.correctedSodium && csD.correctedSodium.measured === 130);
ok("normal glukozda düzeltme yapılmaz", !derived([
  { id: "a", ts: T0, test: "sodium", canonValue: 140, level: "normal" },
  { id: "b", ts: T0, test: "glucose", canonValue: 95, level: "normal" },
]).correctedSodium);
ok("yeni üç türevin kaynağı SOURCES'ta", ["eag","osmolality","corrected-sodium"].every(k => SOURCES[k]));

console.log("=== 7) Ozet ===");
const sum = clinicalSummary(
  [...ironLabs, { id: "k", ts: T0 + D, test: "potassium", canonValue: 7.2, level: "critical-high" }],
  meds, { egfr: 25 }
);
ok("kritikler ozete giriyor", sum.criticals.some(c => c.test === "potassium"), sum.criticals);
ok("oruntuler ozete giriyor", sum.patterns.some(p => p.id === "iron-deficiency"));
ok("ilac kontrolleri ozete giriyor", sum.drugChecks.some(c => c.id === "metformin-egfr"));

console.log("\n" + (fail === 0 ? `✅ ${pass}/${pass} TEST GECTI` : `❌ ${fail} BASARISIZ, ${pass} gecti`));
process.exit(fail === 0 ? 0 : 1);
