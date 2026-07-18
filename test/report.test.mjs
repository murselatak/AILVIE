import { extractCategories, findTerms, urgencyOf, suggestedQuestions, explainReport, BIRADS, LUNGRADS } from "../src/report.js";

let pass = 0, fail = 0;
const ok = (n, c, e) => { if (c) pass++; else { fail++; console.log("  ✗ " + n + (e ? "  → " + JSON.stringify(e) : "")); } };

console.log("=== 1) BI-RADS kategori çıkarma ===");
let c = extractCategories("Assessment: BI-RADS 4. Biopsy recommended.");
ok("BI-RADS 4 bulundu", c.length === 1 && c[0].n === "4", c);
ok("risk = suspicious", c[0] && c[0].risk === "suspicious");
ok("takip = biopsy", c[0] && c[0].followUp === "biopsy");
ok("BI-RADS 4A alt kategori", extractCategories("BI-RADS 4a")[0]?.sub === "a");
// Real reports often write "BI-RADS Category 4C" — the word between the label and the number must
// not break extraction. This was a real miss caught by pasting an actual mammography report.
ok("BI-RADS Category 4C (Category araya girer)", extractCategories("ACR BI-RADS Category 4C: Suspicious")[0]?.value === "4C");
ok("BI-RADS Kategori 5 (TR)", extractCategories("BI-RADS Kategori 5 olarak raporlandı")[0]?.n === "5");
ok("Lung-RADS Category 4B", extractCategories("Lung-RADS Category 4B")[0]?.value === "4B");
ok("BIRADS bitişik yazım", extractCategories("BIRADS2")[0]?.n === "2");
ok("Türkçe rapor: BI-RADS 3", extractCategories("Sonuç: Bİ-RADS 3 olarak değerlendirildi")[0]?.n === "3" || extractCategories("Sonuç: BI-RADS 3 olarak değerlendirildi")[0]?.n === "3");
ok("BI-RADS 0 = incomplete", extractCategories("BI-RADS 0")[0]?.risk === "incomplete");
ok("kategori YOKSA boş döner", extractCategories("Meme dokusu olağan görünümde.").length === 0);

console.log("=== 2) Lung-RADS ===");
let lr = extractCategories("Lung-RADS 4B, spiculated nodule.");
ok("Lung-RADS 4 bulundu", lr.length === 1 && lr[0].n === "4", lr);
ok("4B alt kategori", lr[0]?.sub === "b");
ok("Lung-RADS 2 = annual-screen", extractCategories("Lung-RADS 2")[0]?.followUp === "annual-screen");

console.log("=== 3) Terim eşleştirme ===");
ok("ground-glass (EN)", findTerms("There is a ground-glass opacity").includes("ground-glass"));
ok("buzlu cam (TR)", findTerms("Sağ üst lobda buzlu cam opasitesi").includes("ground-glass"));
ok("spiküle (TR)", findTerms("spiküle kenarlı lezyon").includes("spiculated"));
ok("microcalcification", findTerms("clustered microcalcifications").includes("microcalcifications"));
ok("T2 hiperintens", findTerms("T2 hiperintens sinyal değişikliği").includes("t2-hyperintense"));
ok("disk hernisi", findTerms("L4-L5 disk hernisi mevcut").includes("herniation"));
ok("hepatosteatoz", findTerms("hepatosteatoz ile uyumlu").includes("hepatic-steatosis"));
ok("normal ifadesi yakalanır", findTerms("patoloji saptanmadı, olağan").includes("no-significant-abnormality"));
ok("tekrarlı terim tekilleşir", findTerms("nodül nodül nodül").filter(x => x === "nodule").length === 1);
ok("alakasız metinde terim yok", findTerms("hasta randevuya geç geldi").length === 0);

console.log("=== 4) Aciliyet — SADECE belirtilen kategoriden ===");
ok("BI-RADS 4 → biopsy", urgencyOf(extractCategories("BI-RADS 4")) === "biopsy");
ok("BI-RADS 2 → routine", urgencyOf(extractCategories("BI-RADS 2")) === "routine");
ok("BI-RADS 3 → short-interval", urgencyOf(extractCategories("BI-RADS 3")) === "short-interval");
ok("kategori yoksa → routine", urgencyOf([]) === "routine");
// two categories: takes the higher urgency
const two = [...extractCategories("BI-RADS 2"), ...extractCategories("Lung-RADS 4")];
ok("iki kategori → yüksek olan", urgencyOf(two) === "workup", two.map(x=>x.followUp));

console.log("=== 5) Doktora sorulacak sorular ===");
const q4 = suggestedQuestions(extractCategories("BI-RADS 4"), []);
ok("biyopsi kategorisinde biyopsi sorusu", q4.includes("q-biopsy-next"), q4);
ok("her zaman 'önceki ile karşılaştır' sorusu", q4.includes("q-compare-prior"));
const qEmpty = suggestedQuestions([], []);
ok("hiçbir şey yoksa sade özet sorusu", qEmpty.includes("q-plain-summary"));
const qDens = suggestedQuestions([], findTerms("dense breast tissue"));
ok("yoğun memede ek tarama sorusu", qDens.includes("q-density-supplemental"), qDens);

console.log("=== 6) GÜVENLİK: hiçbir şey uydurmaz ===");
// a report with scary words but no stated category must NOT invent one
const scary = explainReport("Solid, spiculated, irregular mass with microcalcifications.");
ok("korkutucu terimler var ama kategori UYDURULMAZ", scary.categories.length === 0, scary.categories);
ok("terimler yine de listelenir", scary.terms.length >= 3);
ok("kategori yoksa aciliyet routine kalır", scary.urgency === "routine");
// the module must never downgrade/upgrade a stated category
const stated = explainReport("BI-RADS 5 highly suspicious");
ok("belirtilen BI-RADS 5 korunur (düşürülmez)", stated.categories[0].n === "5" && stated.categories[0].risk === "highly-suspicious");

console.log("=== 7) explainReport roll-up ===");
const full = explainReport("MAMOGRAFİ: Sağ memede spiküle kenarlı kitle, mikrokalsifikasyonlar. BI-RADS 4C.");
ok("hasContent true", full.hasContent);
ok("kategori + terim + soru birlikte", full.categories.length === 1 && full.terms.length >= 2 && full.questions.length >= 2, {c:full.categories.length,t:full.terms.length,q:full.questions.length});
ok("boş rapor → hasContent false", explainReport("").hasContent === false);

console.log("\n" + (fail === 0 ? `✅ ${pass}/${pass} TEST GECTI` : `❌ ${fail} BASARISIZ, ${pass} gecti`));
process.exit(fail === 0 ? 0 : 1);
