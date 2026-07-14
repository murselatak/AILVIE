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

  // ---- Batch 2: common readable UI phrases ----
  "Signed out": {de:"Abgemeldet",ru:"Выход выполнен",zh:"已退出",hi:"साइन आउट",nl:"Afgemeld",es:"Sesión cerrada",ar:"تم تسجيل الخروج",fr:"Déconnecté",pt:"Sessão encerrada",id:"Keluar",bn:"সাইন আউট"},
  "Signed in": {de:"Angemeldet",ru:"Вход выполнен",zh:"已登录",hi:"साइन इन",nl:"Aangemeld",es:"Sesión iniciada",ar:"تم تسجيل الدخول",fr:"Connecté",pt:"Sessão iniciada",id:"Masuk",bn:"সাইন ইন"},
  "Enter data": {de:"Daten eingeben",ru:"Ввести данные",zh:"输入数据",hi:"डेटा दर्ज करें",nl:"Gegevens invoeren",es:"Ingresar datos",ar:"إدخال البيانات",fr:"Saisir des données",pt:"Inserir dados",id:"Masukkan data",bn:"তথ্য দিন"},
  "Taken Meds": {de:"Eingenommene Medikamente",ru:"Принятые лекарства",zh:"已服药物",hi:"ली गई दवाएं",nl:"Ingenomen medicijnen",es:"Medicamentos tomados",ar:"الأدوية المتناولة",fr:"Médicaments pris",pt:"Medicamentos tomados",id:"Obat yang diminum",bn:"নেওয়া ওষুধ"},
  "How to use": {de:"Anleitung",ru:"Как пользоваться",zh:"使用方法",hi:"उपयोग कैसे करें",nl:"Hoe te gebruiken",es:"Cómo usar",ar:"كيفية الاستخدام",fr:"Comment utiliser",pt:"Como usar",id:"Cara pakai",bn:"যেভাবে ব্যবহার করবেন"},
  "Identifier": {de:"Kennung",ru:"Идентификатор",zh:"标识符",hi:"पहचानकर्ता",nl:"Identificatie",es:"Identificador",ar:"المعرّف",fr:"Identifiant",pt:"Identificador",id:"Pengenal",bn:"শনাক্তকারী"},
  "Biometrics": {de:"Biometrie",ru:"Биометрия",zh:"生物识别",hi:"बायोमेट्रिक्स",nl:"Biometrie",es:"Biometría",ar:"القياسات الحيوية",fr:"Biométrie",pt:"Biometria",id:"Biometrik",bn:"বায়োমেট্রিক্স"},
  "Contact Us": {de:"Kontakt",ru:"Связаться с нами",zh:"联系我们",hi:"संपर्क करें",nl:"Contact",es:"Contáctanos",ar:"اتصل بنا",fr:"Nous contacter",pt:"Fale conosco",id:"Hubungi kami",bn:"যোগাযোগ করুন"},
  "Empty note": {de:"Leere Notiz",ru:"Пустая заметка",zh:"空笔记",hi:"खाली नोट",nl:"Lege notitie",es:"Nota vacía",ar:"ملاحظة فارغة",fr:"Note vide",pt:"Nota vazia",id:"Catatan kosong",bn:"খালি নোট"},
  "Overweight": {de:"Übergewicht",ru:"Избыточный вес",zh:"超重",hi:"अधिक वजन",nl:"Overgewicht",es:"Sobrepeso",ar:"زيادة الوزن",fr:"Surpoids",pt:"Sobrepeso",id:"Kelebihan berat badan",bn:"অতিরিক্ত ওজন"},
  "Connection": {de:"Verbindung",ru:"Подключение",zh:"连接",hi:"कनेक्शन",nl:"Verbinding",es:"Conexión",ar:"الاتصال",fr:"Connexion",pt:"Conexão",id:"Koneksi",bn:"সংযোগ"},
  "Take photo": {de:"Foto aufnehmen",ru:"Сделать фото",zh:"拍照",hi:"फोटो लें",nl:"Foto maken",es:"Tomar foto",ar:"التقاط صورة",fr:"Prendre une photo",pt:"Tirar foto",id:"Ambil foto",bn:"ছবি তুলুন"},
  "Disconnect": {de:"Trennen",ru:"Отключить",zh:"断开",hi:"डिस्कनेक्ट",nl:"Verbreken",es:"Desconectar",ar:"قطع الاتصال",fr:"Déconnecter",pt:"Desconectar",id:"Putuskan",bn:"বিচ্ছিন্ন করুন"},
  "Test again": {de:"Erneut testen",ru:"Повторить тест",zh:"重新测试",hi:"फिर से जांचें",nl:"Opnieuw testen",es:"Probar de nuevo",ar:"إعادة الاختبار",fr:"Retester",pt:"Testar novamente",id:"Uji lagi",bn:"আবার পরীক্ষা করুন"},
  "New Record": {de:"Neuer Eintrag",ru:"Новая запись",zh:"新记录",hi:"नया रिकॉर्ड",nl:"Nieuw record",es:"Nuevo registro",ar:"سجل جديد",fr:"Nouvel enregistrement",pt:"Novo registro",id:"Catatan baru",bn:"নতুন রেকর্ড"},
  "Voice call": {de:"Sprachanruf",ru:"Голосовой вызов",zh:"语音通话",hi:"वॉइस कॉल",nl:"Spraakoproep",es:"Llamada de voz",ar:"مكالمة صوتية",fr:"Appel vocal",pt:"Chamada de voz",id:"Panggilan suara",bn:"ভয়েস কল"},
  "Video call": {de:"Videoanruf",ru:"Видеозвонок",zh:"视频通话",hi:"वीडियो कॉल",nl:"Videogesprek",es:"Videollamada",ar:"مكالمة فيديو",fr:"Appel vidéo",pt:"Videochamada",id:"Panggilan video",bn:"ভিডিও কল"},
  "Conference": {de:"Konferenz",ru:"Конференция",zh:"会议",hi:"कॉन्फ्रेंस",nl:"Vergadering",es:"Conferencia",ar:"مؤتمر",fr:"Conférence",pt:"Conferência",id:"Konferensi",bn:"কনফারেন্স"},
  "Group name": {de:"Gruppenname",ru:"Название группы",zh:"群组名称",hi:"समूह का नाम",nl:"Groepsnaam",es:"Nombre del grupo",ar:"اسم المجموعة",fr:"Nom du groupe",pt:"Nome do grupo",id:"Nama grup",bn:"গ্রুপের নাম"},
  "Navigation": {de:"Navigation",ru:"Навигация",zh:"导航",hi:"नेविगेशन",nl:"Navigatie",es:"Navegación",ar:"الملاحة",fr:"Navigation",pt:"Navegação",id:"Navigasi",bn:"নেভিগেশন"},
  "Background": {de:"Hintergrund",ru:"Фон",zh:"背景",hi:"पृष्ठभूमि",nl:"Achtergrond",es:"Fondo",ar:"الخلفية",fr:"Arrière-plan",pt:"Fundo",id:"Latar belakang",bn:"পটভূমি"},
  "Formatting": {de:"Formatierung",ru:"Форматирование",zh:"格式",hi:"फ़ॉर्मेटिंग",nl:"Opmaak",es:"Formato",ar:"التنسيق",fr:"Mise en forme",pt:"Formatação",id:"Pemformatan",bn:"ফরম্যাটিং"},
  "Reset zoom": {de:"Zoom zurücksetzen",ru:"Сбросить масштаб",zh:"重置缩放",hi:"ज़ूम रीसेट करें",nl:"Zoom resetten",es:"Restablecer zoom",ar:"إعادة ضبط التكبير",fr:"Réinitialiser le zoom",pt:"Redefinir zoom",id:"Atur ulang zoom",bn:"জুম রিসেট"},
  "My account": {de:"Mein Konto",ru:"Мой аккаунт",zh:"我的账户",hi:"मेरा खाता",nl:"Mijn account",es:"Mi cuenta",ar:"حسابي",fr:"Mon compte",pt:"Minha conta",id:"Akun saya",bn:"আমার অ্যাকাউন্ট"},
  "Live Health": {de:"Live-Gesundheit",ru:"Здоровье в реальном времени",zh:"实时健康",hi:"लाइव हेल्थ",nl:"Live gezondheid",es:"Salud en vivo",ar:"الصحة المباشرة",fr:"Santé en direct",pt:"Saúde ao vivo",id:"Kesehatan langsung",bn:"লাইভ স্বাস্থ্য"},
  "Unlock sync": {de:"Sync entsperren",ru:"Разблокировать синхронизацию",zh:"解锁同步",hi:"सिंक अनलॉक करें",nl:"Sync ontgrendelen",es:"Desbloquear sincronización",ar:"فتح المزامنة",fr:"Déverrouiller la sync",pt:"Desbloquear sincronização",id:"Buka kunci sinkronisasi",bn:"সিঙ্ক আনলক"},
  "Remove lock": {de:"Sperre entfernen",ru:"Убрать блокировку",zh:"移除锁定",hi:"लॉक हटाएं",nl:"Vergrendeling verwijderen",es:"Quitar bloqueo",ar:"إزالة القفل",fr:"Supprimer le verrou",pt:"Remover bloqueio",id:"Hapus kunci",bn:"লক সরান"},
  "Active Plan": {de:"Aktiver Plan",ru:"Активный план",zh:"当前套餐",hi:"सक्रिय योजना",nl:"Actief abonnement",es:"Plan activo",ar:"الخطة النشطة",fr:"Forfait actif",pt:"Plano ativo",id:"Paket aktif",bn:"সক্রিয় প্ল্যান"},
  "Data Backup": {de:"Datensicherung",ru:"Резервная копия",zh:"数据备份",hi:"डेटा बैकअप",nl:"Gegevensback-up",es:"Copia de seguridad",ar:"نسخ البيانات احتياطيًا",fr:"Sauvegarde des données",pt:"Backup de dados",id:"Cadangan data",bn:"ডেটা ব্যাকআপ"},
  "Select meal": {de:"Mahlzeit wählen",ru:"Выбрать приём пищи",zh:"选择餐次",hi:"भोजन चुनें",nl:"Maaltijd kiezen",es:"Seleccionar comida",ar:"اختر الوجبة",fr:"Choisir un repas",pt:"Selecionar refeição",id:"Pilih makanan",bn:"খাবার নির্বাচন করুন"},
  "Add Reading": {de:"Messwert hinzufügen",ru:"Добавить измерение",zh:"添加读数",hi:"रीडिंग जोड़ें",nl:"Meting toevoegen",es:"Añadir medición",ar:"إضافة قراءة",fr:"Ajouter une mesure",pt:"Adicionar leitura",id:"Tambah pengukuran",bn:"রিডিং যোগ করুন"},
  "Goal weight": {de:"Zielgewicht",ru:"Целевой вес",zh:"目标体重",hi:"लक्ष्य वजन",nl:"Streefgewicht",es:"Peso objetivo",ar:"الوزن المستهدف",fr:"Poids cible",pt:"Peso alvo",id:"Berat target",bn:"লক্ষ্য ওজন"},
  "Vital Signs": {de:"Vitalzeichen",ru:"Показатели жизнедеятельности",zh:"生命体征",hi:"महत्वपूर्ण संकेत",nl:"Vitale functies",es:"Signos vitales",ar:"العلامات الحيوية",fr:"Signes vitaux",pt:"Sinais vitais",id:"Tanda vital",bn:"শারীরিক লক্ষণ"},
  "Vital signs": {de:"Vitalzeichen",ru:"Показатели жизнедеятельности",zh:"生命体征",hi:"महत्वपूर्ण संकेत",nl:"Vitale functies",es:"Signos vitales",ar:"العلامات الحيوية",fr:"Signes vitaux",pt:"Sinais vitais",id:"Tanda vital",bn:"শারীরিক লক্ষণ"},
  "Last 7 days": {de:"Letzte 7 Tage",ru:"Последние 7 дней",zh:"最近7天",hi:"पिछले 7 दिन",nl:"Laatste 7 dagen",es:"Últimos 7 días",ar:"آخر 7 أيام",fr:"7 derniers jours",pt:"Últimos 7 dias",id:"7 hari terakhir",bn:"গত ৭ দিন"},
  "New group": {de:"Neue Gruppe",ru:"Новая группа",zh:"新群组",hi:"नया समूह",nl:"Nieuwe groep",es:"Nuevo grupo",ar:"مجموعة جديدة",fr:"Nouveau groupe",pt:"Novo grupo",id:"Grup baru",bn:"নতুন গ্রুপ"},
  "Underweight": {de:"Untergewicht",ru:"Недостаточный вес",zh:"体重过轻",hi:"कम वजन",nl:"Ondergewicht",es:"Bajo peso",ar:"نقص الوزن",fr:"Insuffisance pondérale",pt:"Abaixo do peso",id:"Berat badan kurang",bn:"কম ওজন"},
  "Add photo": {de:"Foto hinzufügen",ru:"Добавить фото",zh:"添加照片",hi:"फोटो जोड़ें",nl:"Foto toevoegen",es:"Añadir foto",ar:"إضافة صورة",fr:"Ajouter une photo",pt:"Adicionar foto",id:"Tambah foto",bn:"ছবি যোগ করুন"},
  "Try again": {de:"Erneut versuchen",ru:"Повторить",zh:"重试",hi:"पुनः प्रयास करें",nl:"Opnieuw proberen",es:"Reintentar",ar:"حاول مرة أخرى",fr:"Réessayer",pt:"Tentar novamente",id:"Coba lagi",bn:"আবার চেষ্টা করুন"},
  "Delete all": {de:"Alle löschen",ru:"Удалить все",zh:"全部删除",hi:"सभी हटाएं",nl:"Alles verwijderen",es:"Eliminar todo",ar:"حذف الكل",fr:"Tout supprimer",pt:"Excluir tudo",id:"Hapus semua",bn:"সব মুছুন"},
};

export const TL = (en, lang) => {
  if (!lang || lang === "tr" || lang === "en") return en;
  const e = TLD[en];
  return (e && e[lang]) || en;
};
