// AILVIE — country-aware emergency numbers.
//
// WHY: hardcoding a single number (e.g. 112) is unsafe for a global health app — a user in the
// US must dial 911, in Australia 000, in Japan 119. This module maps ISO-3166-1 alpha-2 country
// codes to the number a person should dial for a MEDICAL emergency.
//
// SAFETY RULES followed here:
//  1. Only countries with well-documented numbers are listed. Anything uncertain is intentionally
//     omitted so it falls back to 112, which GSM handsets redirect to local services in most of
//     the world — a safe default is better than a confidently wrong number.
//  2. Where a country runs a single unified emergency line (112 / 911 / 999 / 000 / 111), that is
//     used. Where services are split, the AMBULANCE/medical number is used (this is a health app).
//  3. The UI must always keep the "your local emergency number may differ" disclaimer visible.
//
// Sources cross-checked: EU 112 (EENA), UK 999/112, US/Canada 911 (FCC), Wikipedia
// "List of emergency telephone numbers", US Dept. of State "911 Abroad".
// Verify against local authorities before store launch.

export const DEFAULT_EMG = "112"; // widest GSM fallback worldwide

export const EMG_NUMBERS = {
  // ---- Europe: unified 112 ----
  AT:"112", BE:"112", BG:"112", HR:"112", CY:"112", CZ:"112", DK:"112", EE:"112", FI:"112",
  FR:"112", DE:"112", GR:"112", HU:"112", IE:"112", IT:"112", LV:"112", LT:"112", LU:"112",
  MT:"112", NL:"112", PL:"112", PT:"112", RO:"112", SK:"112", SI:"112", ES:"112", SE:"112",
  NO:"112", IS:"112", CH:"112", LI:"112", AD:"112", MC:"112", SM:"112", VA:"112",
  RS:"112", ME:"112", MK:"112", AL:"112", BA:"112", MD:"112", UA:"112", TR:"112", RU:"112",
  GE:"112", XK:"112",
  GB:"999", // 112 also connects

  // ---- Americas ----
  US:"911", CA:"911", MX:"911", AR:"911", CR:"911", PA:"911", DO:"911", EC:"911", UY:"911",
  PY:"911", PR:"911", GU:"911", VI:"911",
  BR:"192", // SAMU (ambulance)
  CL:"131", // SAMU (ambulance)
  CO:"123",
  PE:"106", // SAMU (ambulance)
  VE:"171",

  // ---- Asia ----
  JP:"119", // ambulance/fire (110 = police)
  KR:"119",
  TW:"119",
  CN:"120", // ambulance (119 fire, 110 police)
  HK:"999", MO:"999",
  SG:"995", // ambulance/fire (999 police)
  MY:"999",
  TH:"1669", // ambulance
  VN:"115", // ambulance
  ID:"112",
  PH:"911",
  IN:"112", // unified (108 ambulance in many states)
  PK:"1122", // Rescue 1122
  BD:"999",
  LK:"1990", // Suwa Seriya ambulance
  NP:"102", // ambulance
  KH:"119",
  MM:"192",
  MN:"103",
  KZ:"103", UZ:"103", AZ:"103",
  IL:"101", // Magen David Adom
  JO:"911",
  LB:"140", // Lebanese Red Cross
  SA:"997", // Red Crescent (ambulance)
  AE:"998", // ambulance
  QA:"999", BH:"999", KW:"112",
  OM:"9999",
  IQ:"122",
  IR:"115", // ambulance
  SY:"110",
  YE:"191",

  // ---- Oceania ----
  AU:"000",
  NZ:"111",
  FJ:"911",

  // ---- Africa ----
  EG:"123", // ambulance
  ZA:"112", // mobile (10177 = ambulance landline)
  NG:"112", GH:"112", MA:"112", RW:"112", TZ:"112", ZM:"112", BW:"112",
  KE:"999", UG:"999", ZW:"999", MU:"999",
  TN:"190", // ambulance
  ET:"907", // ambulance
};

// Poison-control lines, where a distinct national number is well documented.
// Everything else falls back to the generic "local poison centre" wording.
export const POISON_NUMBERS = {
  TR:"114",
  US:"1-800-222-1222",
};

// Per-service numbers for countries that split ambulance / police / fire.
// Countries not listed fall back to their unified number for all three (correct for 112/911/999
// regions). Label keys are English; they are localized in the UI.
export const EMG_SERVICES = {
  TR:{ambulance:"112", police:"155", fire:"110"},
  DE:{ambulance:"112", police:"110", fire:"112"},
  FR:{ambulance:"15",  police:"17",  fire:"18"},   // 112 also reaches all
  RU:{ambulance:"103", police:"102", fire:"101"},
  JP:{ambulance:"119", police:"110", fire:"119"},
  KR:{ambulance:"119", police:"112", fire:"119"},
  CN:{ambulance:"120", police:"110", fire:"119"},
  TW:{ambulance:"119", police:"110", fire:"119"},
  IN:{ambulance:"108", police:"100", fire:"101"},  // 112 unified also works
  BR:{ambulance:"192", police:"190", fire:"193"},
  CL:{ambulance:"131", police:"133", fire:"132"},
  AR:{ambulance:"107", police:"101", fire:"100"},
  SG:{ambulance:"995", police:"999", fire:"995"},
  IL:{ambulance:"101", police:"100", fire:"102"},
  EG:{ambulance:"123", police:"122", fire:"180"},
  SA:{ambulance:"997", police:"999", fire:"998"},
  AE:{ambulance:"998", police:"999", fire:"997"},
};

// Turkish labels for the fixed services (other languages come from the TL dictionary).
export const EMG_LABELS_TR = {
  "Ambulance":"Ambulans",
  "Police":"Polis",
  "Fire brigade":"İtfaiye",
};

const norm = (cc) => String(cc || "").trim().toUpperCase();

/** Medical emergency number for a country code; safe 112 fallback when unknown. */
export const emgFor = (cc) => EMG_NUMBERS[norm(cc)] || DEFAULT_EMG;

/** Fixed emergency services for a country, ready to render. */
export const servicesFor = (cc) => {
  const s = EMG_SERVICES[norm(cc)] || (n => ({ambulance:n, police:n, fire:n}))(emgFor(cc));
  return [
    {id:1, k:"Ambulance",    number:s.ambulance, icon:"🚑", fixed:true},
    {id:2, k:"Police",       number:s.police,    icon:"🚔", fixed:true},
    {id:3, k:"Fire brigade", number:s.fire,      icon:"🚒", fixed:true},
  ];
};

/** Poison-control number for a country, or null when there's no distinct documented line. */
export const poisonFor = (cc) => POISON_NUMBERS[norm(cc)] || null;

/** True when we actually know this country (i.e. not just falling back). */
export const emgKnown = (cc) => !!EMG_NUMBERS[norm(cc)];
