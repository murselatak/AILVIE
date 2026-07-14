// AILVIE 13-language string layer.
// Core UI is already fully localized via the T dictionary. This layer localizes the many
// inline `lang==="tr"?TR:EN` strings for the other 11 languages. TL(en, lang) returns the
// translation for the current language, or the English source as a safe fallback.
// The dictionary grows in batches; medical/safety-critical strings are reviewed with extra care.
// Languages: de ru zh hi nl es ar fr pt id bn  (tr comes from the ternary; en is the source/fallback)

export const TLD = {
  // ---- Batch 1: high-frequency, context-safe UI words ----
  "Add": {de:"Hinzufügen",ru:"Добавить",zh:"添加",hi:"जोड़ें",nl:"Toevoegen",es:"Añadir",ar:"إضافة",fr:"Ajouter",pt:"Adicionar",id:"Tambah",bn:"যোগ করুন"},
  "Edit": {de:"Bearbeiten",ru:"Изменить",zh:"编辑",hi:"संपादित करें",nl:"Bewerken",es:"Editar",ar:"تعديل",fr:"Modifier",pt:"Editar",id:"Ubah",bn:"সম্পাদনা"},
  "Done": {de:"Fertig",ru:"Готово",zh:"完成",hi:"हो गया",nl:"Klaar",es:"Hecho",ar:"تم",fr:"Terminé",pt:"Concluído",id:"Selesai",bn:"সম্পন্ন"},
  "Copy": {de:"Kopieren",ru:"Копировать",zh:"复制",hi:"कॉपी",nl:"Kopiëren",es:"Copiar",ar:"نسخ",fr:"Copier",pt:"Copiar",id:"Salin",bn:"কপি"},
  "Name": {de:"Name",ru:"Имя",zh:"名称",hi:"नाम",nl:"Naam",es:"Nombre",ar:"الاسم",fr:"Nom",pt:"Nome",id:"Nama",bn:"নাম"},
  "Date": {de:"Datum",ru:"Дата",zh:"日期",hi:"तारीख",nl:"Datum",es:"Fecha",ar:"التاريخ",fr:"Date",pt:"Data",id:"Tanggal",bn:"তারিখ"},
  "Time": {de:"Zeit",ru:"Время",zh:"时间",hi:"समय",nl:"Tijd",es:"Hora",ar:"الوقت",fr:"Heure",pt:"Hora",id:"Waktu",bn:"সময়"},
  "Now": {de:"Jetzt",ru:"Сейчас",zh:"现在",hi:"अभी",nl:"Nu",es:"Ahora",ar:"الآن",fr:"Maintenant",pt:"Agora",id:"Sekarang",bn:"এখন"},
  "On": {de:"An",ru:"Вкл",zh:"开",hi:"चालू",nl:"Aan",es:"Activado",ar:"تشغيل",fr:"Activé",pt:"Ligado",id:"Aktif",bn:"চালু"},
  "Off": {de:"Aus",ru:"Выкл",zh:"关",hi:"बंद",nl:"Uit",es:"Desactivado",ar:"إيقاف",fr:"Désactivé",pt:"Desligado",id:"Nonaktif",bn:"বন্ধ"},
  "All": {de:"Alle",ru:"Все",zh:"全部",hi:"सभी",nl:"Alle",es:"Todos",ar:"الكل",fr:"Tout",pt:"Todos",id:"Semua",bn:"সব"},
  "Soon": {de:"Bald",ru:"Скоро",zh:"即将",hi:"जल्द",nl:"Binnenkort",es:"Pronto",ar:"قريبًا",fr:"Bientôt",pt:"Em breve",id:"Segera",bn:"শীঘ্রই"},
  "Good": {de:"Gut",ru:"Хорошо",zh:"良好",hi:"अच्छा",nl:"Goed",es:"Bien",ar:"جيد",fr:"Bon",pt:"Bom",id:"Baik",bn:"ভালো"},
  "Male": {de:"Männlich",ru:"Мужской",zh:"男",hi:"पुरुष",nl:"Man",es:"Hombre",ar:"ذكر",fr:"Homme",pt:"Masculino",id:"Pria",bn:"পুরুষ"},
  "Call": {de:"Anrufen",ru:"Позвонить",zh:"呼叫",hi:"कॉल",nl:"Bellen",es:"Llamar",ar:"اتصال",fr:"Appeler",pt:"Ligar",id:"Panggil",bn:"কল"},
  "Left": {de:"Übrig",ru:"Осталось",zh:"剩余",hi:"बाकी",nl:"Over",es:"Restante",ar:"متبقٍ",fr:"Restant",pt:"Restante",id:"Sisa",bn:"বাকি"},
  "Mood": {de:"Stimmung",ru:"Настроение",zh:"心情",hi:"मूड",nl:"Stemming",es:"Ánimo",ar:"المزاج",fr:"Humeur",pt:"Humor",id:"Suasana hati",bn:"মেজাজ"},
  "Live": {de:"Live",ru:"Онлайн",zh:"实时",hi:"लाइव",nl:"Live",es:"En vivo",ar:"مباشر",fr:"En direct",pt:"Ao vivo",id:"Langsung",bn:"লাইভ"},
  "Fast": {de:"Schnell",ru:"Быстро",zh:"快",hi:"तेज़",nl:"Snel",es:"Rápido",ar:"سريع",fr:"Rapide",pt:"Rápido",id:"Cepat",bn:"দ্রুত"},
  "Slow": {de:"Langsam",ru:"Медленно",zh:"慢",hi:"धीमा",nl:"Langzaam",es:"Lento",ar:"بطيء",fr:"Lent",pt:"Lento",id:"Lambat",bn:"ধীর"},
  "Wake": {de:"Aufwachen",ru:"Подъём",zh:"起床",hi:"जागना",nl:"Wakker",es:"Despertar",ar:"الاستيقاظ",fr:"Réveil",pt:"Acordar",id:"Bangun",bn:"জাগরণ"},
  "Taxi": {de:"Taxi",ru:"Такси",zh:"出租车",hi:"टैक्सी",nl:"Taxi",es:"Taxi",ar:"سيارة أجرة",fr:"Taxi",pt:"Táxi",id:"Taksi",bn:"ট্যাক্সি"},
};

export const TL = (en, lang) => {
  if (!lang || lang === "tr" || lang === "en") return en;
  const e = TLD[en];
  return (e && e[lang]) || en;
};
