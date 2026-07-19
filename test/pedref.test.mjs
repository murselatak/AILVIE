// Tests for the paediatric / pregnancy reference-selection logic used by selectReference() in
// App.jsx. Because App.jsx is a single-file React bundle that can't be imported directly here, this
// mirrors the exact banding logic and the exact verified ranges. If App.jsx's logic or ranges
// change, update BOTH — this test is the guard that the age-banding maths stays correct.
//
// Ranges verified against: UI Health Care lab handbook + ACCP PedSAP (creatinine by age),
// WHO/paediatric haemoglobin thresholds. Bands are [maxAgeYears, [low, high]] in ascending order;
// selection is the first row where age < maxAgeYears.

const REF = {
  creatinine: { unit: "mg/dL", adult: { male: [0.70, 1.30], female: [0.50, 1.10] }, peds: [[0.041, [0.40, 1.00]], [2, [0.20, 0.40]], [4, [0.30, 0.50]], [12, [0.40, 0.70]], [16, [0.50, 0.90]]], pregnancy: [0.40, 0.85] },
  hemoglobin: { unit: "g/L", adult: { male: [130, 180], female: [115, 165] }, peds: [[0.5, [100, 140]], [5, [110, 150]], [12, [115, 155]]] },
  alp: { unit: "U/L", adult: { male: [40, 129], female: [35, 104] }, peds: [[0.041, [83, 248]], [1, [122, 469]], [10, [142, 335]], [13, [129, 468]], [16, [55, 331]]] },
  phosphorus: { unit: "mg/dL", adult: { any: [2.5, 4.5] }, peds: [[0.041, [4.3, 9.3]], [1, [4.5, 7.0]], [12, [4.5, 6.5]], [16, [2.7, 4.7]]] },
  bun: { unit: "mg/dL", adult: { any: [7, 20] }, peds: [[2, [4, 15]], [16, [5, 20]]] },
  alt: { unit: "U/L", adult: { any: [10, 40] } },   // deliberately no peds -> caveat
};

function selectReference(test, ctx) {
  const e = REF[test]; if (!e) return { ok: false, reason: "not-in-library" };
  const age = Number(ctx.ageYears);
  if (ctx.pregnant) {
    if (e.pregnancy) return { ok: true, low: e.pregnancy[0], high: e.pregnancy[1], note: "pregnancy" };
    return { ok: false, reason: "pregnancy-adult-range-may-not-apply" };
  }
  const isChild = (ctx.band !== "adult" && ctx.band !== "older") || (isFinite(age) && age < 18);
  if (isChild) {
    if (e.peds && isFinite(age)) { const row = e.peds.find(r => age < r[0]); if (row) return { ok: true, low: row[1][0], high: row[1][1], note: "paediatric" }; }
    if (!e.peds) return { ok: false, reason: "paediatric-adult-range-may-not-apply" };
  }
  const sex = (ctx.sex === "male" || ctx.sex === "female") ? ctx.sex : null;
  const r = e.adult[sex] || e.adult.any; if (!r) return { ok: false, reason: "needs-sex" };
  return { ok: true, low: r[0], high: r[1] };
}

let pass = 0, fail = 0;
const ok = (n, c, extra) => { if (c) { pass++; } else { fail++; console.log("  ✗ " + n, extra !== undefined ? JSON.stringify(extra) : ""); } };

console.log("=== Pediatrik kreatinin bantları ===");
ok("15 günden küçük [0.40,1.00]", (r => r.ok && r.low === 0.40 && r.high === 1.00)(selectReference("creatinine", { band: "infant", ageYears: 0.02, sex: "male" })));
ok("1 yaş [0.20,0.40]", (r => r.ok && r.low === 0.20 && r.high === 0.40)(selectReference("creatinine", { band: "infant", ageYears: 1, sex: "female" })));
ok("3 yaş [0.30,0.50]", (r => r.ok && r.low === 0.30 && r.high === 0.50 && r.note === "paediatric")(selectReference("creatinine", { band: "child", ageYears: 3, sex: "male" })));
ok("10 yaş [0.40,0.70]", (r => r.ok && r.low === 0.40 && r.high === 0.70)(selectReference("creatinine", { band: "child", ageYears: 10, sex: "male" })));
ok("14 yaş [0.50,0.90]", (r => r.ok && r.low === 0.50 && r.high === 0.90)(selectReference("creatinine", { band: "adolescent", ageYears: 14, sex: "male" })));
ok("17 yaş -> erişkin [0.70,1.30]", (r => r.ok && r.low === 0.70 && r.high === 1.30)(selectReference("creatinine", { band: "adolescent", ageYears: 17, sex: "male" })));

console.log("=== Pediatrik hemoglobin bantları ===");
ok("3 ay [100,140]", (r => r.ok && r.low === 100 && r.high === 140)(selectReference("hemoglobin", { band: "infant", ageYears: 0.25 })));
ok("3 yaş [110,150]", (r => r.ok && r.low === 110 && r.high === 150)(selectReference("hemoglobin", { band: "child", ageYears: 3 })));
ok("8 yaş [115,155]", (r => r.ok && r.low === 115 && r.high === 155)(selectReference("hemoglobin", { band: "child", ageYears: 8 })));

console.log("=== Pediatrik ALP bantları (büyümeyle yüksek — normal) ===");
ok("6 ay ALP [122,469] (bebek yüksek)", (r => r.ok && r.low === 122 && r.high === 469)(selectReference("alp", { band: "infant", ageYears: 0.5 })));
ok("5 yaş ALP [142,335]", (r => r.ok && r.low === 142 && r.high === 335)(selectReference("alp", { band: "child", ageYears: 5 })));
ok("11 yaş ALP [129,468] (puberte artışı)", (r => r.ok && r.low === 129 && r.high === 468)(selectReference("alp", { band: "child", ageYears: 11 })));
ok("17 yaş ALP -> erişkin [40,129]", (r => r.ok && r.low === 40 && r.high === 129)(selectReference("alp", { band: "adolescent", ageYears: 17, sex: "male" })));

console.log("=== Pediatrik fosfor bantları (büyümeyle yüksek — normal) ===");
ok("yenidoğan fosfor [4.3,9.3]", (r => r.ok && r.low === 4.3 && r.high === 9.3)(selectReference("phosphorus", { band: "infant", ageYears: 0.02 })));
ok("6 aylık fosfor [4.5,7.0]", (r => r.ok && r.low === 4.5 && r.high === 7.0)(selectReference("phosphorus", { band: "infant", ageYears: 0.5 })));
ok("5 yaş fosfor [4.5,6.5]", (r => r.ok && r.low === 4.5 && r.high === 6.5 && r.note === "paediatric")(selectReference("phosphorus", { band: "child", ageYears: 5 })));
ok("14 yaş fosfor [2.7,4.7]", (r => r.ok && r.low === 2.7 && r.high === 4.7)(selectReference("phosphorus", { band: "adolescent", ageYears: 14 })));
ok("18+ fosfor -> erişkin [2.5,4.5]", (r => r.ok && r.low === 2.5 && r.high === 4.5)(selectReference("phosphorus", { band: "adult", ageYears: 30 })));

console.log("=== Pediatrik BUN bantları (çocukta düşük) ===");
ok("1 yaş BUN [4,15]", (r => r.ok && r.low === 4 && r.high === 15 && r.note === "paediatric")(selectReference("bun", { band: "infant", ageYears: 1 })));
ok("8 yaş BUN [5,20]", (r => r.ok && r.low === 5 && r.high === 20)(selectReference("bun", { band: "child", ageYears: 8 })));
ok("18+ BUN -> erişkin [7,20]", (r => r.ok && r.low === 7 && r.high === 20)(selectReference("bun", { band: "adult", ageYears: 30 })));

console.log("=== Uyarılar (aralık yoksa) ===");
ok("çocuk ALT -> pediatrik uyarı", (r => !r.ok && r.reason === "paediatric-adult-range-may-not-apply")(selectReference("alt", { band: "child", ageYears: 8 })));
ok("gebe kreatinin -> gebelik uyarısı", (r => !r.ok && r.reason === "pregnancy-adult-range-may-not-apply")(selectReference("alt", { band: "adult", ageYears: 30, pregnant: true, sex: "female" })));
ok("gebe kreatinin -> doğrulanmış gebelik aralığı [0.40,0.85]", (r => r.ok && r.low === 0.40 && r.high === 0.85 && r.note === "pregnancy")(selectReference("creatinine", { band: "adult", ageYears: 30, pregnant: true, sex: "female" })));

console.log("=== Erişkin dokunulmamış ===");
ok("erişkin erkek kreatinin [0.70,1.30]", (r => r.ok && r.low === 0.70 && r.high === 1.30)(selectReference("creatinine", { band: "adult", ageYears: 40, sex: "male" })));
ok("erişkin kadın kreatinin [0.50,1.10]", (r => r.ok && r.low === 0.50 && r.high === 1.10)(selectReference("creatinine", { band: "adult", ageYears: 40, sex: "female" })));

console.log(`\n${fail === 0 ? "✅" : "❌"} ${pass}/${pass + fail} TEST GECTI`);
process.exit(fail ? 1 : 0);
