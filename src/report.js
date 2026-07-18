// Radiology report explainer — pure functions, no React, no I/O, unit-testable.
//
// SCOPE, stated plainly and non-negotiably:
//   * This reads the WORDS of a report a radiologist already wrote. It does NOT read images and it
//     does NOT produce a diagnosis. The radiologist did the diagnosis; this makes their words legible.
//   * The whole value is: translate the jargon, flag what standardised categories mean and what
//     follow-up they carry, and hand the person the right questions to ask their doctor.
//   * Standardised assessment categories (BI-RADS, Lung-RADS) map to published management
//     recommendations from the American College of Radiology. Those are facts about the category,
//     not a judgement about the person's image.
//
// Nothing here decides treatment, assigns a category the report didn't state, or reassures. When a
// report says BI-RADS 4 we say what BI-RADS 4 means; we never say "this looks like a 2 instead".

// ---------------------------------------------------------------------------
// Standardised assessment categories → published management (ACR)
// ---------------------------------------------------------------------------
// BI-RADS (Breast Imaging Reporting and Data System), ACR BI-RADS Atlas 5th ed. Categories 0–6.
// Verified against ACR / City of Hope / Cleveland Clinic / StatPearls.
export const BIRADS = {
  "0": { key:"birads0", risk:"incomplete", followUp:"more-imaging" },
  "1": { key:"birads1", risk:"negative",   followUp:"routine" },
  "2": { key:"birads2", risk:"benign",     followUp:"routine" },
  "3": { key:"birads3", risk:"probably-benign", followUp:"short-interval" }, // <2% malignancy, 6-mo f/u
  "4": { key:"birads4", risk:"suspicious", followUp:"biopsy" },              // 2–95%, biopsy usual
  "5": { key:"birads5", risk:"highly-suspicious", followUp:"biopsy" },       // >95%
  "6": { key:"birads6", risk:"known-malignancy", followUp:"treatment" },     // biopsy-proven
};

// Lung-RADS (ACR, low-dose CT lung screening). Categories 0–4 (+4X, +S modifier).
export const LUNGRADS = {
  "0": { key:"lungrads0", risk:"incomplete", followUp:"more-imaging" },
  "1": { key:"lungrads1", risk:"negative",   followUp:"annual-screen" },
  "2": { key:"lungrads2", risk:"benign",     followUp:"annual-screen" },
  "3": { key:"lungrads3", risk:"probably-benign", followUp:"short-interval" }, // ~1–2%, 6-mo LDCT
  "4": { key:"lungrads4", risk:"suspicious", followUp:"workup" },              // 4A/4B/4X → PET/biopsy
};

// ---------------------------------------------------------------------------
// Term glossary keys. The human-readable translations live in tl.js (11 languages) keyed by these
// canonical English strings, so the explainer stays language-agnostic and the medical wording is
// reviewed in one place. Each entry: the match patterns and the glossary key.
// ---------------------------------------------------------------------------
// Patterns are lowercase substrings / simple regexes matched against the lowercased report text.
export const TERMS = [
  // breast
  { key:"microcalcifications", pats:["microcalcification","mikrokalsifikasyon","mikrokalsifik"] },
  { key:"architectural-distortion", pats:["architectural distortion","yapısal distorsiyon","mimari distorsiyon"] },
  { key:"spiculated", pats:["spiculat","spiküle","spikül"] },
  { key:"fibroadenoma", pats:["fibroadenoma","fibroadenom"] },
  { key:"breast-density", pats:["breast density","dense breast","meme yoğunluğu","yoğun meme","dens meme"] },
  // general masses
  { key:"well-circumscribed", pats:["well-circumscribed","well circumscribed","düzgün sınırlı","iyi sınırlı"] },
  { key:"irregular-margin", pats:["irregular margin","irregular mass","irregular","düzensiz sınır","düzensiz kenar","düzensiz kitle"] },
  { key:"hypoechoic", pats:["hypoechoic","hipoekoik"] },
  { key:"hyperechoic", pats:["hyperechoic","hiperekoik"] },
  { key:"cystic", pats:["cystic","kistik","cyst ","kist"] },
  { key:"solid-lesion", pats:["solid lesion","solid nodule","solid mass","solid kitle","solid nodül","solid lezyon"] },
  // lung / chest
  { key:"ground-glass", pats:["ground-glass","ground glass","buzlu cam"] },
  { key:"nodule", pats:["nodule","nodül"] },
  { key:"consolidation", pats:["consolidation","konsolidasyon"] },
  { key:"pleural-effusion", pats:["pleural effusion","plevral efüzyon","plevral sıvı"] },
  { key:"emphysema", pats:["emphysema","amfizem"] },
  // MRI / neuro
  { key:"t2-hyperintense", pats:["t2 hyperintense","t2 hiperintens","t2-hyperintense"] },
  { key:"enhancement", pats:["contrast enhancement","kontrast tutulum","enhancement","tutulum göster"] },
  { key:"edema", pats:["edema","ödem","oedema"] },
  { key:"herniation", pats:["disc herniation","herniation","herniasyon","disk hernisi","bulging","protrüzyon"] },
  { key:"stenosis", pats:["stenosis","stenoz","darlık"] },
  // liver / abdomen
  { key:"hepatic-steatosis", pats:["hepatic steatosis","steatosis","hepatosteatoz","yağlanma","fatty liver"] },
  { key:"hypodense-lesion", pats:["hypodense","hipodens"] },
  { key:"hyperdense-lesion", pats:["hyperdense","hiperdens"] },
  { key:"simple-cyst", pats:["simple cyst","basit kist"] },
  // reassuring / non-specific
  { key:"no-significant-abnormality", pats:["no significant abnormality","no acute","unremarkable","olağan","patoloji saptanmadı","özellik göstermeyen","normal sınırlarda"] },
  { key:"incidental", pats:["incidental","insidental","rastlantısal"] },
];

const RE_BIRADS = /\bbi[\s-]?rads?\s*(?:categor(?:y|ie)|kategori|kat\.?|cat\.?)?\s*[:\-.]?\s*(0|1|2|3|4[abc]?|5|6)\b/i;
const RE_LUNGRADS = /\blung[\s-]?rads?\s*(?:categor(?:y|ie)|kategori|kat\.?|cat\.?)?\s*[:\-.]?\s*(0|1|2|3|4[abx]?)\b/i;

// Pull the assessment category actually stated in the report (never inferred).
export function extractCategories(text) {
  const out = [];
  const t = String(text || "");
  const b = t.match(RE_BIRADS);
  if (b) {
    const n = b[1].replace(/[abc]$/i, "");
    const sub = /[abc]$/i.test(b[1]) ? b[1].slice(-1).toLowerCase() : null;
    if (BIRADS[n]) out.push({ system:"BI-RADS", value:b[1].toUpperCase(), n, sub, ...BIRADS[n] });
  }
  const l = t.match(RE_LUNGRADS);
  if (l) {
    const n = l[1].replace(/[abx]$/i, "");
    const sub = /[abx]$/i.test(l[1]) ? l[1].slice(-1).toLowerCase() : null;
    if (LUNGRADS[n]) out.push({ system:"Lung-RADS", value:l[1].toUpperCase(), n, sub, ...LUNGRADS[n] });
  }
  return out;
}

// Find glossary terms present in the report.
export function findTerms(text) {
  const t = String(text || "").toLowerCase();
  const seen = new Set();
  const out = [];
  for (const term of TERMS) {
    if (term.pats.some(p => t.includes(p))) {
      if (!seen.has(term.key)) { seen.add(term.key); out.push(term.key); }
    }
  }
  return out;
}

// Highest urgency implied by the *stated* categories. This drives whether the UI says "book a
// follow-up" vs "this warrants prompt discussion". It is derived only from the report's own
// category, never from reading anything into the free text.
export function urgencyOf(categories) {
  let level = "routine";
  const rank = { routine:0, "annual-screen":0, "short-interval":1, "more-imaging":1, workup:2, biopsy:2, treatment:2 };
  for (const c of categories) {
    if ((rank[c.followUp] || 0) > (rank[level] || 0)) level = c.followUp;
  }
  return level; // routine | short-interval | more-imaging | workup | biopsy | treatment
}

// The whole point: give the person the right questions to take back to their doctor. Keys resolve
// to translated strings; which questions appear depends on what the report actually contains.
export function suggestedQuestions(categories, terms) {
  const qs = [];
  const fu = urgencyOf(categories);
  if (categories.length) {
    qs.push("q-category-meaning");           // "what does this category mean for me specifically?"
    if (fu === "biopsy") qs.push("q-biopsy-next");
    if (fu === "short-interval") qs.push("q-followup-when");
    if (fu === "more-imaging") qs.push("q-which-extra-imaging");
    if (fu === "treatment") qs.push("q-treatment-plan");
  }
  if (terms.includes("incidental")) qs.push("q-incidental-significance");
  if (terms.includes("breast-density")) qs.push("q-density-supplemental");
  if (!categories.length && !terms.length) qs.push("q-plain-summary");
  qs.push("q-compare-prior");                 // always useful: compare to previous imaging
  return [...new Set(qs)];
}

// Roll-up used by both the UI and the AI context.
export function explainReport(text) {
  const categories = extractCategories(text);
  const terms = findTerms(text);
  return {
    hasContent: categories.length > 0 || terms.length > 0,
    categories,
    terms,
    urgency: urgencyOf(categories),
    questions: suggestedQuestions(categories, terms),
  };
}
