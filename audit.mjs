// Dictionary integrity audit: catches wrong-script contamination, empty/missing translations.
// Motivation: a Chinese fragment slipped into a Russian string; eyeballing 660+ entries is unreliable.
import { TLD } from "./src/tl.js";

// NOTE: U+0964 "।" (danda) and U+0965 "॥" live in the Devanagari block but are the standard
// sentence terminator in Bengali too — they are NOT contamination. Excluded from the checks below.
const DANDA = "\u0964\u0965";
const SCRIPT = {
  ru: { name: "Кириллица", must: /[\u0400-\u04FF]/, forbid: /[\u4E00-\u9FFF\u0600-\u06FF\u0900-\u0963\u0966-\u097F\u0980-\u09FF]/ },
  zh: { name: "汉字", must: /[\u4E00-\u9FFF]/, forbid: /[\u0400-\u04FF\u0600-\u06FF\u0900-\u0963\u0966-\u097F\u0980-\u09FF]/ },
  ar: { name: "العربية", must: /[\u0600-\u06FF]/, forbid: /[\u4E00-\u9FFF\u0400-\u04FF\u0900-\u0963\u0966-\u097F\u0980-\u09FF]/ },
  hi: { name: "देवनागरी", must: /[\u0900-\u097F]/, forbid: /[\u4E00-\u9FFF\u0400-\u04FF\u0600-\u06FF\u0980-\u09FF]/ },
  bn: { name: "বাংলা", must: /[\u0980-\u09FF]/, forbid: /[\u4E00-\u9FFF\u0400-\u04FF\u0600-\u06FF\u0900-\u0963\u0966-\u097F]/ },
  de: { name: "Latin", must: null, forbid: /[\u4E00-\u9FFF\u0400-\u04FF\u0600-\u06FF\u0900-\u0963\u0966-\u097F\u0980-\u09FF]/ },
  nl: { name: "Latin", must: null, forbid: /[\u4E00-\u9FFF\u0400-\u04FF\u0600-\u06FF\u0900-\u0963\u0966-\u097F\u0980-\u09FF]/ },
  es: { name: "Latin", must: null, forbid: /[\u4E00-\u9FFF\u0400-\u04FF\u0600-\u06FF\u0900-\u0963\u0966-\u097F\u0980-\u09FF]/ },
  fr: { name: "Latin", must: null, forbid: /[\u4E00-\u9FFF\u0400-\u04FF\u0600-\u06FF\u0900-\u0963\u0966-\u097F\u0980-\u09FF]/ },
  pt: { name: "Latin", must: null, forbid: /[\u4E00-\u9FFF\u0400-\u04FF\u0600-\u06FF\u0900-\u0963\u0966-\u097F\u0980-\u09FF]/ },
  id: { name: "Latin", must: null, forbid: /[\u4E00-\u9FFF\u0400-\u04FF\u0600-\u06FF\u0900-\u0963\u0966-\u097F\u0980-\u09FF]/ },
};
const LANGS = Object.keys(SCRIPT);
const keys = Object.keys(TLD);

let contamination = 0, missing = 0, empty = 0, noScript = 0;

for (const k of keys) {
  const e = TLD[k];
  for (const l of LANGS) {
    const v = e[l];
    if (v === undefined) { missing++; console.log(`✗ EKSIK  [${l}] "${k.slice(0, 45)}"`); continue; }
    if (typeof v !== "string" || !v.trim()) { empty++; console.log(`✗ BOS    [${l}] "${k.slice(0, 45)}"`); continue; }
    const sc = SCRIPT[l];
    if (sc.forbid.test(v)) {
      contamination++;
      const bad = v.match(sc.forbid);
      console.log(`✗ ALFABE [${l}] "${k.slice(0, 40)}" → yabanci karakter: "${bad[0]}" | ...${v.slice(Math.max(0, v.indexOf(bad[0]) - 25), v.indexOf(bad[0]) + 15)}...`);
    }
    // a translation identical to the English source is a silent fallback (suspicious for long text)
    if (k.length > 25 && v === k) { noScript++; console.log(`⚠ AYNI   [${l}] cevrilmemis olabilir: "${k.slice(0, 45)}"`); }
  }
}

console.log("\n=== OZET ===");
console.log("  girdi sayisi:", keys.length, "| dil:", LANGS.length, "| toplam deger:", keys.length * LANGS.length);
console.log("  alfabe karismasi:", contamination);
console.log("  eksik dil:", missing);
console.log("  bos deger:", empty);
console.log("  ingilizce ile ayni (supheli):", noScript);
console.log(contamination === 0 && missing === 0 && empty === 0 ? "\n✅ TEMIZ" : "\n⚠ DUZELTILECEK VAR");
