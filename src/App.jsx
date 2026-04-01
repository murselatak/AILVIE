import React from "react";
import { useState, useEffect, useRef, useCallback } from "react";

/* ══════════════════════════════════════════════════════════
   AILVIE v9 — AI Personal Health Assistant
   v2 design + all new features + restructured nav
   ══════════════════════════════════════════════════════════ */

const T={tr:{app:"AILVIE",sl:"Kişisel Yapay Zeka Sağlık Asistanı",home:"Ana Sayfa",meds:"İlaçlar",appts:"Randevular",health:"Sağlık",notes:"Notlar",contacts:"Rehber",community:"Topluluk",chat:"AILVIE Sohbet",settings:"Ayarlar",notif:"Bildirimler",emergency:"ACİL ÇAĞRI",dark:"Karanlık Tema",hc:"Yüksek Kontrast",fSize:"Yazı Boyutu",lang:"Dil",hScore:"Sağlık Skoru",bmi:"BMI",nMed:"Sonraki İlaç",nAppt:"Sonraki Randevu",addMed:"İlaç Ekle",addAppt:"Randevu Ekle",bookAppt:"Randevu Al",nm:"Ad",dose:"Doz",time:"Saat",taken:"Alındı",dr:"Doktor",hosp:"Hastane",clin:"Poliklinik",date:"Tarih",up:"Yaklaşan",past:"Geçmiş",pulse:"Nabız",wt:"Kilo",ht:"Boy",bp:"Tansiyon",norm:"Normal",caut:"Dikkat",save:"Kaydet",del:"Sil",add:"Ekle",copy:"Kopyala",pin:"Sabitle",send:"Gönder",cancel:"İptal",drugR:"İlaç Tanıma",drugN:"İlaç adı yazın...",anlz:"Analiz",prog:"İlerleme",addSys:"Sisteme Ekle",dir:"Yol Tarifi",loc:"AI Konum",emN:"Acil Numaralar",wr:"Mesajınızı yazın...",bpm:"bpm",kg:"kg",cm:"cm",tap:"Dokunun",noM:"İlaç yok",noA:"Randevu yok",noN:"Not yok",noC:"Kişi yok",warn:"⚕️ Tıbbi teşhis aracı değildir",pCard:"Hasta Karnesi",fName:"Ad Soyad",bDate:"Doğum Tarihi",age:"Yaş",bType:"Kan Grubu",allrg:"Alerjiler",chron:"Kronik Hastalıklar",diag:"Teşhis",xray:"Röntgen",mri:"MR/Emar",ultra:"Ultrason",lab:"Tahliller",surg:"Ameliyat",insu:"Sigorta No",emCon:"Acil Kişi",trash:"Çöp Kutusu",trD:"gün sonra silinir",rest:"Geri Yükle",empT:"Boşalt",trE:"Çöp boş",q1:"Nasıl hissediyorsun?",q2:"İlaç bilgisi",q3:"Sağlık önerileri",greet:"Merhaba! Ben AILVIE, kişisel sağlık asistanınızım. 🌸 Size nasıl yardımcı olabilirim?",gm:"Günaydın",ga:"İyi akşamlar",hi:"Merhaba",emj:"Emoji",jan:"Oca",feb:"Şub",mar:"Mar",apr:"Nis",may:"May",jun:"Haz",jul:"Tem",aug:"Ağu",sep:"Eyl",oct:"Eki",nov:"Kas",dec:"Ara",su:"Pz",mo:"Pt",tu:"Sa",we:"Ça",th:"Pe",fr:"Cu",sa:"Ct",nNote:"Yeni Not",extA:"Harici Uygulamalar",addApp:"Uygulama Ekle",cls:"Sınıf",usg:"Kullanım",sEff:"Yan Etkiler",wrn:"Uyarılar",intr:"Etkileşimler",alarm:"Alarm",alarmSet:"Alarm Kuruldu",alarmType:"Alarm Tipi",vibrate:"Titreşim",ring:"Zil",both:"Her İkisi",scanQR:"QR/Barkod Tara",scanManual:"Manuel Barkod Gir",scanning:"Taranıyor...",scanFound:"İlaç Bulundu!",scanNotFound:"Barkod veritabanında bulunamadı",stopScan:"Taramayı Durdur",barcodeNum:"Barkod Numarası",scanAdd:"Tarayarak Ekle",profile:"Profil",login:"Giriş Yap",logout:"Çıkış Yap",permissions:"Uygulama İzinleri",subscription:"Abonelik Planları",free:"Ücretsiz",premium:"Premium",legal:"Hukuki Uyarı",legalText:"AILVIE, yapay zeka destekli kişisel sağlık asistanıdır. Bilgiler yalnızca bilgilendirme amaçlıdır, tıbbi teşhis/tedavi/reçete yerine geçmez. Sağlık kararları için doktorunuza danışın. GÜVENLİK: Verileriniz cihazınızda şifrelenerek saklanır, üçüncü taraflarla paylaşılmaz. KVKK ve GDPR uyumludur. Ödemeler Stripe PCI DSS sertifikalı altyapı üzerinden gerçekleşir. BAĞIŞ: Her PRO aboneliğinden TEGV bursuna otomatik bağış yapılır (Aylık $1, Yıllık $2.99).",about:"Hakkında",version:"Sürüm",privPolicy:"Gizlilik Politikası",terms:"Kullanım Şartları",notifPerm:"Bildirim İzni",locPerm:"Konum İzni",micPerm:"Mikrofon İzni",camPerm:"Kamera İzni",freePlan:"Temel özellikler • Reklamlı • 3 ilaç • 5 not",premPlan:"Reklamsız • Sınırsız AI/İlaç/Not • Sesli asistan • $4.99/ay | $12.99/yıl • TEGV: $1/ay, $2.99/yıl",entPlan:"PRO + Aile (5) • Çoklu profil • Öncelikli destek • $12.99/ay | $59.99/yıl • TEGV dahil",enterprise:"Kurumsal",monthly:"aylık",loggedIn:"Giriş yapıldı",loggedOut:"Çıkış yapıldı",gn:"İyi geceler",feel:"kendini nasıl hissediyorsun? Umarım iyisindir.",adminCh:"AILVIE Destek",adminWelcome:"Mesajınız alındı. En kısa sürede yanıt vereceğiz.",voiceOn:"Sesli Diyalog",wordLangPick:"Dil Seç"},
en:{app:"AILVIE",sl:"Personal AI Health Assistant",home:"Home",meds:"Meds",appts:"Appts",health:"Health",notes:"Notes",contacts:"Contacts",community:"Community",chat:"AILVIE Chat",settings:"Settings",notif:"Notifications",emergency:"EMERGENCY",dark:"Dark Mode",hc:"High Contrast",fSize:"Font Size",lang:"Language",hScore:"Health Score",bmi:"BMI",nMed:"Next Med",nAppt:"Next Appt",addMed:"Add Med",addAppt:"Add Appt",bookAppt:"Book Appt",nm:"Name",dose:"Dose",time:"Time",taken:"Taken",dr:"Doctor",hosp:"Hospital",clin:"Clinic",date:"Date",up:"Upcoming",past:"Past",pulse:"Pulse",wt:"Weight",ht:"Height",bp:"Blood Pressure",norm:"Normal",caut:"Caution",save:"Save",del:"Delete",add:"Add",copy:"Copy",pin:"Pin",send:"Send",cancel:"Cancel",drugR:"Drug Recognition",drugN:"Enter drug name...",anlz:"Analyze",prog:"Progress",addSys:"Add System",dir:"Directions",loc:"AI Location",emN:"Emergency Numbers",wr:"Type message...",bpm:"bpm",kg:"kg",cm:"cm",tap:"Tap to add",noM:"No meds",noA:"No appts",noN:"No notes",noC:"No contacts",warn:"⚕️ Not a medical tool",pCard:"Patient Card",fName:"Full Name",bDate:"Birth Date",age:"Age",bType:"Blood Type",allrg:"Allergies",chron:"Chronic Diseases",diag:"Diagnosis",xray:"X-Ray",mri:"MRI",ultra:"Ultrasound",lab:"Lab Results",surg:"Surgeries",insu:"Insurance",emCon:"Emergency Contact",trash:"Trash",trD:"days auto-delete",rest:"Restore",empT:"Empty",trE:"Trash empty",q1:"How are you feeling?",q2:"Med info",q3:"Health tips",greet:"Hello! I'm AILVIE, your health assistant. 🌸 How can I help?",gm:"Good morning",ga:"Good evening",hi:"Hello",emj:"Emoji",jan:"Jan",feb:"Feb",mar:"Mar",apr:"Apr",may:"May",jun:"Jun",jul:"Jul",aug:"Aug",sep:"Sep",oct:"Oct",nov:"Nov",dec:"Dec",su:"Su",mo:"Mo",tu:"Tu",we:"We",th:"Th",fr:"Fr",sa:"Sa",nNote:"New Note",extA:"External Apps",addApp:"Add App",cls:"Class",usg:"Usage",sEff:"Side Effects",wrn:"Warnings",intr:"Interactions",alarm:"Alarm",alarmSet:"Alarm Set",alarmType:"Alarm Type",vibrate:"Vibrate",ring:"Ring",both:"Both",scanQR:"Scan QR/Barcode",scanManual:"Enter Barcode",scanning:"Scanning...",scanFound:"Drug Found!",scanNotFound:"Barcode not in database",stopScan:"Stop Scan",barcodeNum:"Barcode Number",scanAdd:"Scan to Add",profile:"Profile",login:"Log In",logout:"Log Out",permissions:"App Permissions",subscription:"Subscription Plans",free:"Free",premium:"Premium",legal:"Legal Notice",legalText:"AILVIE is an AI-powered personal health assistant. Information is for informational purposes only, not medical advice. Consult your doctor for health decisions. SECURITY: Your data is encrypted on your device only, never shared with third parties. GDPR and KVKK compliant. Payments processed via Stripe (PCI DSS certified). DONATION: Every PRO subscription automatically donates to TEGV education fund ($1/mo, $2.99/yr).",about:"About",version:"Version",privPolicy:"Privacy Policy",terms:"Terms of Service",notifPerm:"Notification Permission",locPerm:"Location Permission",micPerm:"Microphone Permission",camPerm:"Camera Permission",freePlan:"Basic features • Ads • 3 meds • 5 notes",premPlan:"Ad-free • Unlimited AI/Meds/Notes • Voice assistant • $4.99/mo | $12.99/yr • TEGV: $1/mo, $2.99/yr",entPlan:"PRO + Family (5) • Multi-profile • Priority support • $12.99/mo | $59.99/yr • TEGV included",enterprise:"Enterprise",monthly:"monthly",loggedIn:"Logged in",loggedOut:"Logged out",gn:"Good night",feel:"how are you feeling? Hope you're doing well.",adminCh:"AILVIE Support",adminWelcome:"Message received. We'll respond shortly.",voiceOn:"Voice Dialog",wordLangPick:"Select Language"},
de:{app:"AILVIE",sl:"Persönliche KI-Gesundheitsassistentin",home:"Start",meds:"Medikamente",appts:"Termine",health:"Gesundheit",notes:"Notizen",contacts:"Kontakte",community:"Gemeinschaft",chat:"AILVIE Chat",settings:"Einstellungen",notif:"Meldungen",emergency:"NOTFALL",dark:"Dunkelmodus",hc:"Kontrast",fSize:"Schrift",lang:"Sprache",hScore:"Score",bmi:"BMI",nMed:"Nächstes",nAppt:"Nächster",addMed:"Hinzufügen",addAppt:"Hinzufügen",bookAppt:"Buchen",nm:"Name",dose:"Dosis",time:"Zeit",taken:"Genommen",dr:"Arzt",hosp:"Krankenhaus",clin:"Klinik",date:"Datum",up:"Kommende",past:"Vergangene",pulse:"Puls",wt:"Gewicht",ht:"Größe",bp:"Blutdruck",norm:"Normal",caut:"Achtung",save:"Speichern",del:"Löschen",add:"Hinzufügen",copy:"Kopieren",pin:"Anheften",send:"Senden",cancel:"Abbrechen",drugR:"Erkennung",drugN:"Medikamentenname...",anlz:"Analysieren",prog:"Fortschritt",addSys:"System",dir:"Route",loc:"KI Standort",emN:"Notrufnummern",wr:"Nachricht...",bpm:"bpm",kg:"kg",cm:"cm",tap:"Tippen",noM:"Keine",noA:"Keine",noN:"Keine",noC:"Keine",warn:"⚕️ Kein Diagnosetool",pCard:"Patientenkarte",fName:"Name",bDate:"Geburtsdatum",age:"Alter",bType:"Blutgruppe",allrg:"Allergien",chron:"Chronische",diag:"Diagnose",xray:"Röntgen",mri:"MRT",ultra:"Ultraschall",lab:"Labor",surg:"OP",insu:"Versicherung",emCon:"Notfallkontakt",trash:"Papierkorb",trD:"Tage",rest:"Wiederherstellen",empT:"Leeren",trE:"Leer",q1:"Wie geht es Ihnen?",q2:"Med-Info",q3:"Tipps",greet:"Hallo! Ich bin AILVIE. 🌸",gm:"Guten Morgen",ga:"Guten Abend",hi:"Hallo",emj:"Emoji",jan:"Jan",feb:"Feb",mar:"Mär",apr:"Apr",may:"Mai",jun:"Jun",jul:"Jul",aug:"Aug",sep:"Sep",oct:"Okt",nov:"Nov",dec:"Dez",su:"So",mo:"Mo",tu:"Di",we:"Mi",th:"Do",fr:"Fr",sa:"Sa",nNote:"Neue",extA:"Externe",addApp:"App",cls:"Klasse",usg:"Verwendung",sEff:"Nebenwirkungen",wrn:"Warnungen",intr:"Wechselwirkungen",alarm:"Alarm",alarmSet:"Alarm gesetzt",alarmType:"Alarmtyp",vibrate:"Vibration",ring:"Klingelton",both:"Beides",profile:"Profil",login:"Anmelden",logout:"Abmelden",permissions:"Berechtigungen",subscription:"Abonnement",free:"Kostenlos",premium:"Premium",legal:"Rechtlicher Hinweis",legalText:"AILVIE ist ein KI-gestützter Gesundheitsassistent. Informationen dienen nur zu Informationszwecken. Konsultieren Sie immer einen Arzt.",about:"Über",version:"Version",privPolicy:"Datenschutz",terms:"Nutzungsbedingungen",notifPerm:"Benachrichtigungen",locPerm:"Standort",micPerm:"Mikrofon",camPerm:"Kamera",freePlan:"Grundfunktionen kostenlos",premPlan:"Unbegrenzter KI-Chat, werbefrei",entPlan:"Familienfreigabe, Prioritätssupport",enterprise:"Unternehmen",monthly:"monatlich",loggedIn:"Angemeldet",loggedOut:"Abgemeldet",gn:"Gute Nacht",feel:"wie fühlst du dich? Hoffentlich geht es dir gut.",adminCh:"AILVIE Support",adminWelcome:"Nachricht erhalten.",voiceOn:"Sprachchat",wordLangPick:"Sprache wählen"},
ru:{app:"AILVIE",sl:"Персональный ИИ-ассистент здоровья",home:"Главная",meds:"Лекарства",appts:"Записи",health:"Здоровье",notes:"Заметки",contacts:"Контакты",community:"Сообщество",chat:"AILVIE Чат",settings:"Настройки",notif:"Уведомления",emergency:"SOS",dark:"Тёмная тема",hc:"Контраст",fSize:"Шрифт",lang:"Язык",hScore:"Здоровье",bmi:"ИМТ",nMed:"След.",nAppt:"След.",addMed:"Добавить",addAppt:"Добавить",bookAppt:"Записаться",nm:"Имя",dose:"Доза",time:"Время",taken:"Принято",dr:"Врач",hosp:"Больница",clin:"Поликлиника",date:"Дата",up:"Предстоящие",past:"Прошедшие",pulse:"Пульс",wt:"Вес",ht:"Рост",bp:"Давление",norm:"Норма",caut:"Внимание",save:"Сохранить",del:"Удалить",add:"Добавить",copy:"Копировать",pin:"Закрепить",send:"Отправить",cancel:"Отмена",drugR:"Распознавание",drugN:"Название...",anlz:"Анализ",prog:"Прогресс",addSys:"Система",dir:"Маршрут",loc:"ИИ Местоположение",emN:"Экстренные",wr:"Сообщение...",bpm:"уд/м",kg:"кг",cm:"см",tap:"Нажмите",noM:"Нет",noA:"Нет",noN:"Нет",noC:"Нет",warn:"⚕️ Не диагностика",pCard:"Карта",fName:"ФИО",bDate:"Дата рождения",age:"Возраст",bType:"Группа крови",allrg:"Аллергии",chron:"Хронические",diag:"Диагноз",xray:"Рентген",mri:"МРТ",ultra:"УЗИ",lab:"Анализы",surg:"Операции",insu:"Страховой",emCon:"Экстренный",trash:"Корзина",trD:"дней",rest:"Восстановить",empT:"Очистить",trE:"Пусто",q1:"Как вы себя чувствуете?",q2:"О лекарствах",q3:"Советы",greet:"Здравствуйте! Я AILVIE. 🌸",gm:"Доброе утро",ga:"Добрый вечер",hi:"Здравствуйте",emj:"Эмодзи",jan:"Янв",feb:"Фев",mar:"Мар",apr:"Апр",may:"Май",jun:"Июн",jul:"Июл",aug:"Авг",sep:"Сен",oct:"Окт",nov:"Ноя",dec:"Дек",su:"Вс",mo:"Пн",tu:"Вт",we:"Ср",th:"Чт",fr:"Пт",sa:"Сб",nNote:"Новая",extA:"Внешние",addApp:"Приложение",cls:"Класс",usg:"Применение",sEff:"Побочные",wrn:"Предупреждения",intr:"Взаимодействия",alarm:"Будильник",alarmSet:"Установлен",alarmType:"Тип",vibrate:"Вибрация",ring:"Звонок",both:"Оба",profile:"Профиль",login:"Войти",logout:"Выйти",permissions:"Разрешения",subscription:"Подписка",free:"Бесплатно",premium:"Премиум",legal:"Юридическое уведомление",legalText:"AILVIE — ИИ-помощник. Информация носит ознакомительный характер. Консультируйтесь с врачом.",about:"О приложении",version:"Версия",privPolicy:"Конфиденциальность",terms:"Условия",notifPerm:"Уведомления",locPerm:"Геолокация",micPerm:"Микрофон",camPerm:"Камера",freePlan:"Базовые функции бесплатно",premPlan:"Безлимитный ИИ-чат, без рекламы",entPlan:"Семейный доступ, приоритет",enterprise:"Корпоративный",monthly:"в месяц",loggedIn:"Вход выполнен",loggedOut:"Выход выполнен",gn:"Спокойной ночи",feel:"как вы себя чувствуете? Надеюсь, всё хорошо.",adminCh:"Поддержка AILVIE",adminWelcome:"Сообщение получено.",voiceOn:"Голосовой диалог",wordLangPick:"Выбрать язык"},
zh:{app:"AILVIE",sl:"个人AI健康助手",home:"首页",meds:"药物",appts:"预约",health:"健康",notes:"笔记",contacts:"通讯录",community:"社区",chat:"AILVIE聊天",settings:"设置",notif:"通知",emergency:"紧急",dark:"暗色",hc:"对比度",fSize:"字体",lang:"语言",hScore:"健康分",bmi:"BMI",nMed:"下一药",nAppt:"下一预约",addMed:"添加",addAppt:"添加",bookAppt:"预约",nm:"姓名",dose:"剂量",time:"时间",taken:"已服",dr:"医生",hosp:"医院",clin:"诊所",date:"日期",up:"即将",past:"已过",pulse:"脉搏",wt:"体重",ht:"身高",bp:"血压",norm:"正常",caut:"注意",save:"保存",del:"删除",add:"添加",copy:"复制",pin:"置顶",send:"发送",cancel:"取消",drugR:"药物识别",drugN:"输入药名...",anlz:"分析",prog:"进度",addSys:"添加系统",dir:"路线",loc:"AI位置",emN:"紧急号码",wr:"输入消息...",bpm:"bpm",kg:"kg",cm:"cm",tap:"点击",noM:"暂无",noA:"暂无",noN:"暂无",noC:"暂无",warn:"⚕️非诊断工具",pCard:"患者卡",fName:"姓名",bDate:"出生",age:"年龄",bType:"血型",allrg:"过敏",chron:"慢性病",diag:"诊断",xray:"X光",mri:"MRI",ultra:"超声",lab:"检验",surg:"手术",insu:"保险",emCon:"紧急联系人",trash:"回收站",trD:"天",rest:"恢复",empT:"清空",trE:"空",q1:"感觉如何？",q2:"药物信息",q3:"健康建议",greet:"你好！我是AILVIE。🌸",gm:"早上好",ga:"晚上好",hi:"你好",emj:"表情",jan:"1月",feb:"2月",mar:"3月",apr:"4月",may:"5月",jun:"6月",jul:"7月",aug:"8月",sep:"9月",oct:"10月",nov:"11月",dec:"12月",su:"日",mo:"一",tu:"二",we:"三",th:"四",fr:"五",sa:"六",nNote:"新",extA:"外部",addApp:"添加",cls:"分类",usg:"用途",sEff:"副作用",wrn:"警告",intr:"相互作用",alarm:"闹钟",alarmSet:"已设置",alarmType:"类型",vibrate:"振动",ring:"铃声",both:"两者",profile:"个人资料",login:"登录",logout:"退出",permissions:"权限",subscription:"订阅",free:"免费",premium:"高级",legal:"法律声明",legalText:"AILVIE是AI助手。信息仅供参考。请咨询医生。",about:"关于",version:"版本",privPolicy:"隐私",terms:"条款",notifPerm:"通知",locPerm:"位置",micPerm:"麦克风",camPerm:"相机",freePlan:"基础功能免费",premPlan:"无限AI聊天",entPlan:"家庭共享",enterprise:"企业",monthly:"月",loggedIn:"已登录",loggedOut:"已退出",gn:"晚安",feel:"你感觉怎么样？希望一切都好。",adminCh:"AILVIE 支持",adminWelcome:"消息已收到。",voiceOn:"语音对话",wordLangPick:"选择语言"},
hi:{app:"AILVIE",sl:"व्यक्तिगत AI स्वास्थ्य सहायक",home:"होम",meds:"दवाइयाँ",appts:"अपॉइंटमेंट",health:"स्वास्थ्य",notes:"नोट्स",contacts:"संपर्क",community:"समुदाय",chat:"AILVIE चैट",settings:"सेटिंग्स",notif:"सूचनाएँ",emergency:"आपातकालीन",dark:"डार्क",hc:"कंट्रास्ट",fSize:"फ़ॉन्ट",lang:"भाषा",hScore:"स्कोर",bmi:"BMI",nMed:"अगली",nAppt:"अगला",addMed:"जोड़ें",addAppt:"जोड़ें",bookAppt:"बुक",nm:"नाम",dose:"खुराक",time:"समय",taken:"लिया",dr:"डॉक्टर",hosp:"अस्पताल",clin:"क्लिनिक",date:"तारीख",up:"आगामी",past:"पिछला",pulse:"नाड़ी",wt:"वज़न",ht:"ऊँचाई",bp:"रक्तचाप",norm:"सामान्य",caut:"सावधानी",save:"सहेजें",del:"हटाएँ",add:"जोड़ें",copy:"कॉपी",pin:"पिन",send:"भेजें",cancel:"रद्द",drugR:"दवा पहचान",drugN:"दवा का नाम...",anlz:"विश्लेषण",prog:"प्रगति",addSys:"सिस्टम",dir:"दिशा",loc:"AI स्थान",emN:"आपातकालीन",wr:"संदेश...",bpm:"bpm",kg:"kg",cm:"cm",tap:"टैप",noM:"नहीं",noA:"नहीं",noN:"नहीं",noC:"नहीं",warn:"⚕️ निदान नहीं",pCard:"रोगी कार्ड",fName:"नाम",bDate:"जन्म",age:"उम्र",bType:"रक्त",allrg:"एलर्जी",chron:"पुरानी",diag:"निदान",xray:"एक्स-रे",mri:"एमआरआई",ultra:"अल्ट्रासाउंड",lab:"लैब",surg:"सर्जरी",insu:"बीमा",emCon:"आपातकालीन",trash:"कचरा",trD:"दिन",rest:"पुनर्स्थापित",empT:"खाली",trE:"खाली",q1:"आप कैसा महसूस कर रहे हैं?",q2:"दवा जानकारी",q3:"सुझाव",greet:"नमस्ते! मैं AILVIE हूँ। 🌸",gm:"सुप्रभात",ga:"शुभ संध्या",hi:"नमस्ते",emj:"इमोजी",jan:"जन",feb:"फ़र",mar:"मार्च",apr:"अप्रैल",may:"मई",jun:"जून",jul:"जुल",aug:"अग",sep:"सित",oct:"अक्टू",nov:"नव",dec:"दिस",su:"र",mo:"सो",tu:"मं",we:"बु",th:"गु",fr:"शु",sa:"श",nNote:"नया",extA:"बाहरी",addApp:"जोड़ें",cls:"वर्ग",usg:"उपयोग",sEff:"दुष्प्रभाव",wrn:"चेतावनी",intr:"इंटरैक्शन",alarm:"अलार्म",alarmSet:"सेट",alarmType:"प्रकार",vibrate:"कंपन",ring:"रिंग",both:"दोनों",profile:"प्रोफ़ाइल",login:"लॉगिन",logout:"लॉगआउट",permissions:"अनुमतियाँ",subscription:"सदस्यता",free:"मुफ़्त",premium:"प्रीमियम",legal:"कानूनी",legalText:"AILVIE AI सहायक है। जानकारी केवल सूचनात्मक है। डॉक्टर से परामर्श लें।",about:"के बारे में",version:"संस्करण",privPolicy:"गोपनीयता",terms:"शर्तें",notifPerm:"सूचना",locPerm:"स्थान",micPerm:"माइक",camPerm:"कैमरा",freePlan:"बुनियादी मुफ़्त",premPlan:"असीमित AI चैट",entPlan:"परिवार साझा",enterprise:"उद्यम",monthly:"माह",loggedIn:"लॉगिन हुआ",loggedOut:"लॉगआउट हुआ",gn:"शुभ रात्रि",feel:"आप कैसा महसूस कर रहे हैं? उम्मीद है सब ठीक है।",adminCh:"AILVIE सहायता",adminWelcome:"संदेश मिला।",voiceOn:"वॉइस डायलॉग",wordLangPick:"भाषा चुनें"},
nl:{app:"AILVIE",sl:"Persoonlijke AI-gezondheidsassistent",home:"Home",meds:"Medicijnen",appts:"Afspraken",health:"Gezondheid",notes:"Notities",contacts:"Contacten",community:"Gemeenschap",chat:"AILVIE Chat",settings:"Instellingen",notif:"Meldingen",emergency:"NOODGEVAL",dark:"Donker",hc:"Contrast",fSize:"Lettergrootte",lang:"Taal",hScore:"Score",bmi:"BMI",nMed:"Volgend",nAppt:"Volgende",addMed:"Toevoegen",addAppt:"Toevoegen",bookAppt:"Boeken",nm:"Naam",dose:"Dosis",time:"Tijd",taken:"Ingenomen",dr:"Arts",hosp:"Ziekenhuis",clin:"Kliniek",date:"Datum",up:"Aankomend",past:"Afgelopen",pulse:"Pols",wt:"Gewicht",ht:"Lengte",bp:"Bloeddruk",norm:"Normaal",caut:"Let op",save:"Opslaan",del:"Verwijderen",add:"Toevoegen",copy:"Kopiëren",pin:"Vastzetten",send:"Verzenden",cancel:"Annuleren",drugR:"Herkenning",drugN:"Medicijnnaam...",anlz:"Analyseren",prog:"Voortgang",addSys:"Systeem",dir:"Route",loc:"AI Locatie",emN:"Noodnummers",wr:"Bericht...",bpm:"bpm",kg:"kg",cm:"cm",tap:"Tik",noM:"Geen",noA:"Geen",noN:"Geen",noC:"Geen",warn:"⚕️ Geen diagnose",pCard:"Patiëntenkaart",fName:"Naam",bDate:"Geboortedatum",age:"Leeftijd",bType:"Bloedgroep",allrg:"Allergieën",chron:"Chronisch",diag:"Diagnose",xray:"Röntgen",mri:"MRI",ultra:"Echo",lab:"Lab",surg:"Operatie",insu:"Verzekering",emCon:"Noodcontact",trash:"Prullenbak",trD:"dagen",rest:"Herstellen",empT:"Leegmaken",trE:"Leeg",q1:"Hoe voelt u zich?",q2:"Medicijninfo",q3:"Tips",greet:"Hallo! Ik ben AILVIE. 🌸",gm:"Goedemorgen",ga:"Goedenavond",hi:"Hallo",emj:"Emoji",jan:"Jan",feb:"Feb",mar:"Mrt",apr:"Apr",may:"Mei",jun:"Jun",jul:"Jul",aug:"Aug",sep:"Sep",oct:"Okt",nov:"Nov",dec:"Dec",su:"Zo",mo:"Ma",tu:"Di",we:"Wo",th:"Do",fr:"Vr",sa:"Za",nNote:"Nieuw",extA:"Extern",addApp:"App",cls:"Klasse",usg:"Gebruik",sEff:"Bijwerkingen",wrn:"Waarschuwingen",intr:"Interacties",alarm:"Alarm",alarmSet:"Ingesteld",alarmType:"Type",vibrate:"Trillen",ring:"Beltoon",both:"Beide",profile:"Profiel",login:"Inloggen",logout:"Uitloggen",permissions:"Machtigingen",subscription:"Abonnement",free:"Gratis",premium:"Premium",legal:"Juridisch",legalText:"AILVIE is een AI-assistent. Informatie is alleen informatief. Raadpleeg een arts.",about:"Over",version:"Versie",privPolicy:"Privacy",terms:"Voorwaarden",notifPerm:"Meldingen",locPerm:"Locatie",micPerm:"Microfoon",camPerm:"Camera",freePlan:"Basisfuncties gratis",premPlan:"Onbeperkt AI-chat",entPlan:"Gezinsgebruik",enterprise:"Zakelijk",monthly:"maand",loggedIn:"Ingelogd",loggedOut:"Uitgelogd",gn:"Goedenacht",feel:"hoe voel je je? Hopelijk gaat het goed.",adminCh:"AILVIE Support",adminWelcome:"Bericht ontvangen.",voiceOn:"Spraakchat",wordLangPick:"Taal kiezen"},
es:{app:"AILVIE",sl:"Asistente personal de salud IA",home:"Inicio",meds:"Meds",appts:"Citas",health:"Salud",notes:"Notas",contacts:"Contactos",community:"Comunidad",chat:"AILVIE Chat",settings:"Ajustes",notif:"Notificaciones",emergency:"EMERGENCIA",dark:"Oscuro",hc:"Contraste",fSize:"Tamaño",lang:"Idioma",hScore:"Puntuación",bmi:"IMC",nMed:"Próximo",nAppt:"Próxima",addMed:"Añadir",addAppt:"Añadir",bookAppt:"Pedir",nm:"Nombre",dose:"Dosis",time:"Hora",taken:"Tomado",dr:"Doctor",hosp:"Hospital",clin:"Clínica",date:"Fecha",up:"Próximas",past:"Pasadas",pulse:"Pulso",wt:"Peso",ht:"Altura",bp:"Presión",norm:"Normal",caut:"Precaución",save:"Guardar",del:"Eliminar",add:"Añadir",copy:"Copiar",pin:"Fijar",send:"Enviar",cancel:"Cancelar",drugR:"Reconocimiento",drugN:"Nombre del med...",anlz:"Analizar",prog:"Progreso",addSys:"Sistema",dir:"Ruta",loc:"IA Ubicación",emN:"Emergencia",wr:"Escribe...",bpm:"lpm",kg:"kg",cm:"cm",tap:"Toca",noM:"Sin meds",noA:"Sin citas",noN:"Sin notas",noC:"Sin contactos",warn:"⚕️ No es diagnóstico",pCard:"Tarjeta",fName:"Nombre",bDate:"Nacimiento",age:"Edad",bType:"Sangre",allrg:"Alergias",chron:"Crónicas",diag:"Diagnóstico",xray:"Rayos X",mri:"Resonancia",ultra:"Ecografía",lab:"Laboratorio",surg:"Cirugía",insu:"Seguro",emCon:"Contacto",trash:"Papelera",trD:"días",rest:"Restaurar",empT:"Vaciar",trE:"Vacía",q1:"¿Cómo se siente?",q2:"Info meds",q3:"Consejos",greet:"¡Hola! Soy AILVIE. 🌸",gm:"Buenos días",ga:"Buenas noches",hi:"Hola",emj:"Emoji",jan:"Ene",feb:"Feb",mar:"Mar",apr:"Abr",may:"May",jun:"Jun",jul:"Jul",aug:"Ago",sep:"Sep",oct:"Oct",nov:"Nov",dec:"Dic",su:"Do",mo:"Lu",tu:"Ma",we:"Mi",th:"Ju",fr:"Vi",sa:"Sá",nNote:"Nueva",extA:"Externas",addApp:"App",cls:"Clase",usg:"Uso",sEff:"Efectos",wrn:"Advertencias",intr:"Interacciones",alarm:"Alarma",alarmSet:"Configurada",alarmType:"Tipo",vibrate:"Vibración",ring:"Timbre",both:"Ambos",profile:"Perfil",login:"Iniciar sesión",logout:"Cerrar sesión",permissions:"Permisos",subscription:"Suscripción",free:"Gratis",premium:"Premium",legal:"Aviso legal",legalText:"AILVIE es un asistente IA. La información es solo orientativa. Consulte a un médico.",about:"Acerca de",version:"Versión",privPolicy:"Privacidad",terms:"Términos",notifPerm:"Notificaciones",locPerm:"Ubicación",micPerm:"Micrófono",camPerm:"Cámara",freePlan:"Funciones básicas gratis",premPlan:"Chat IA ilimitado",entPlan:"Familia, soporte prioritario",enterprise:"Empresarial",monthly:"mes",loggedIn:"Sesión iniciada",loggedOut:"Sesión cerrada",gn:"Buenas noches",feel:"¿cómo te sientes? Espero que estés bien.",adminCh:"Soporte AILVIE",adminWelcome:"Mensaje recibido.",voiceOn:"Diálogo de voz",wordLangPick:"Seleccionar idioma"},
ar:{app:"AILVIE",sl:"مساعدة صحية شخصية بالذكاء الاصطناعي",home:"الرئيسية",meds:"الأدوية",appts:"المواعيد",health:"الصحة",notes:"ملاحظات",contacts:"جهات الاتصال",community:"المجتمع",chat:"محادثة",settings:"الإعدادات",notif:"الإشعارات",emergency:"طوارئ",dark:"داكن",hc:"تباين",fSize:"الخط",lang:"اللغة",hScore:"الصحة",bmi:"كتلة",nMed:"التالي",nAppt:"التالي",addMed:"إضافة",addAppt:"إضافة",bookAppt:"حجز",nm:"الاسم",dose:"الجرعة",time:"الوقت",taken:"تم",dr:"طبيب",hosp:"مستشفى",clin:"عيادة",date:"التاريخ",up:"قادمة",past:"سابقة",pulse:"النبض",wt:"الوزن",ht:"الطول",bp:"ضغط الدم",norm:"طبيعي",caut:"تحذير",save:"حفظ",del:"حذف",add:"إضافة",copy:"نسخ",pin:"تثبيت",send:"إرسال",cancel:"إلغاء",drugR:"التعرف",drugN:"اسم الدواء...",anlz:"تحليل",prog:"التقدم",addSys:"نظام",dir:"اتجاهات",loc:"الموقع",emN:"طوارئ",wr:"اكتب...",bpm:"نبضة/د",kg:"كغ",cm:"سم",tap:"اضغط",noM:"لا",noA:"لا",noN:"لا",noC:"لا",warn:"⚕️ ليس تشخيص",pCard:"بطاقة المريض",fName:"الاسم",bDate:"الميلاد",age:"العمر",bType:"فصيلة",allrg:"حساسية",chron:"مزمنة",diag:"تشخيص",xray:"أشعة",mri:"رنين",ultra:"موجات",lab:"تحاليل",surg:"عمليات",insu:"تأمين",emCon:"طوارئ",trash:"المحذوفات",trD:"يوم",rest:"استعادة",empT:"إفراغ",trE:"فارغة",q1:"كيف أشعر؟",q2:"دواء",q3:"نصائح",greet:"مرحبًا! أنا AILVIE. 🌸",gm:"صباح الخير",ga:"مساء الخير",hi:"مرحبا",emj:"رموز",jan:"يناير",feb:"فبراير",mar:"مارس",apr:"أبريل",may:"مايو",jun:"يونيو",jul:"يوليو",aug:"أغسطس",sep:"سبتمبر",oct:"أكتوبر",nov:"نوفمبر",dec:"ديسمبر",su:"أحد",mo:"إثنين",tu:"ثلاثاء",we:"أربعاء",th:"خميس",fr:"جمعة",sa:"سبت",nNote:"جديد",extA:"خارجية",addApp:"تطبيق",cls:"التصنيف",usg:"الاستخدام",sEff:"آثار",wrn:"تحذيرات",intr:"التفاعلات",alarm:"منبه",alarmSet:"تم",alarmType:"نوع",vibrate:"اهتزاز",ring:"رنين",both:"كلاهما",profile:"الملف",login:"دخول",logout:"خروج",permissions:"الأذونات",subscription:"اشتراك",free:"مجاني",premium:"مميز",legal:"قانوني",legalText:"AILVIE مساعد ذكاء اصطناعي. المعلومات إرشادية فقط. استشر طبيبك.",about:"حول",version:"الإصدار",privPolicy:"الخصوصية",terms:"الشروط",notifPerm:"الإشعارات",locPerm:"الموقع",micPerm:"الميكروفون",camPerm:"الكاميرا",freePlan:"مجاني أساسي",premPlan:"محادثة غير محدودة",entPlan:"عائلي",enterprise:"مؤسسي",monthly:"شهرياً",loggedIn:"تم الدخول",loggedOut:"تم الخروج",gn:"تصبح على خير",feel:"كيف حالك؟ أتمنى أن تكون بخير.",adminCh:"دعم AILVIE",adminWelcome:"تم استلام الرسالة.",voiceOn:"حوار صوتي",wordLangPick:"اختر اللغة"}};

const GLOBE_IMG="data:image/png;base64,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";
const LL_NATIVE={tr:"Türkçe",en:"English",de:"Deutsch",ru:"Русский",zh:"中文",hi:"हिन्दी",nl:"Nederlands",es:"Español",ar:"العربية"};
const LL_LOCAL={
tr:{tr:"Türkçe",en:"İngilizce",de:"Almanca",ru:"Rusça",zh:"Çince",hi:"Hintçe",nl:"Felemenkçe",es:"İspanyolca",ar:"Arapça"},
en:{tr:"Turkish",en:"English",de:"German",ru:"Russian",zh:"Chinese",hi:"Hindi",nl:"Dutch",es:"Spanish",ar:"Arabic"},
de:{tr:"Türkisch",en:"Englisch",de:"Deutsch",ru:"Russisch",zh:"Chinesisch",hi:"Hindi",nl:"Niederländisch",es:"Spanisch",ar:"Arabisch"},
ru:{tr:"Турецкий",en:"Английский",de:"Немецкий",ru:"Русский",zh:"Китайский",hi:"Хинди",nl:"Нидерландский",es:"Испанский",ar:"Арабский"},
zh:{tr:"土耳其语",en:"英语",de:"德语",ru:"俄语",zh:"中文",hi:"印地语",nl:"荷兰语",es:"西班牙语",ar:"阿拉伯语"},
hi:{tr:"तुर्की",en:"अंग्रेज़ी",de:"जर्मन",ru:"रूसी",zh:"चीनी",hi:"हिन्दी",nl:"डच",es:"स्पेनिश",ar:"अरबी"},
nl:{tr:"Turks",en:"Engels",de:"Duits",ru:"Russisch",zh:"Chinees",hi:"Hindi",nl:"Nederlands",es:"Spaans",ar:"Arabisch"},
es:{tr:"Turco",en:"Inglés",de:"Alemán",ru:"Ruso",zh:"Chino",hi:"Hindi",nl:"Neerlandés",es:"Español",ar:"Árabe"},
ar:{tr:"تركية",en:"إنجليزية",de:"ألمانية",ru:"روسية",zh:"صينية",hi:"هندية",nl:"هولندية",es:"إسبانية",ar:"عربية"}
};
const LL=LL_NATIVE;
const LC={tr:"tr-TR",en:"en-US",de:"de-DE",ru:"ru-RU",zh:"zh-CN",hi:"hi-IN",nl:"nl-NL",es:"es-ES",ar:"ar-SA"};

// Drug DB (23 drugs, TR+EN)
const DR={paracetamol:{tr:"Analjezik/Antipiretik|Ağrı, ateş|500-1000mg 4-6 saat|Karaciğer hasarı (yüksek doz)|Günlük 4g aşılmamalı|Warfarin",en:"Analgesic|Pain, fever|500-1000mg q4-6h|Liver damage|Max 4g/day|Warfarin"},ibuprofen:{tr:"NSAİİ|Ağrı, iltihap, ateş|200-400mg 4-6 saat|Mide rahatsızlığı|Ülser/böbrek dikkat|Aspirin, Warfarin",en:"NSAID|Pain, inflammation|200-400mg q4-6h|GI upset|Avoid w/ ulcers|Aspirin, Warfarin"},aspirin:{tr:"NSAİİ/Antiplatelet|Ağrı, kan sulandırıcı|300-900mg 4-6 saat|Mide kanaması|16 yaş altı hayır|Warfarin",en:"NSAID|Pain, blood thin|300-900mg q4-6h|GI bleeding|Not <16|Warfarin"},amoxicillin:{tr:"Antibiyotik|Bakteri enfeksiyonları|250-500mg 8 saat|İshal, döküntü|Penisilin alerjisi|Warfarin",en:"Antibiotic|Bacterial infections|250-500mg q8h|Diarrhea, rash|Penicillin allergy|Warfarin"},metformin:{tr:"Biguanid|Tip 2 diyabet|500-2000mg/gün|Mide bulantısı|Böbrek izlenmeli|Alkol",en:"Biguanide|Type 2 diabetes|500-2000mg/day|GI upset|Monitor kidneys|Alcohol"},omeprazole:{tr:"PPI|Mide asidi, ülser|20-40mg/gün|Baş ağrısı, ishal|Uzun süreli: kemik|Klopidogrel",en:"PPI|Acid reflux, ulcers|20-40mg/day|Headache|Long-term: bones|Clopidogrel"},epixx:{tr:"Antiepileptik (Levetirasetam)|Epilepsi, nöbet önleme|250-1500mg günde 2x|Uyuşukluk, baş dönmesi, sinirlilik|Böbrekte doz ayarı. Ani kesilmemeli|Fenitoin",en:"Antiepileptic (Levetiracetam)|Epilepsy|250-1500mg BID|Drowsiness, dizziness|Adjust in renal. Don't stop abruptly|Phenytoin"},levetiracetam:{tr:"Antiepileptik|Epilepsi|250-1500mg 2x/gün|Uyuşukluk, davranış değişikliği|Ani bırakmayın|Metotreksat",en:"Antiepileptic|Epilepsy|250-1500mg BID|Drowsiness, mood|Don't stop abruptly|Methotrexate"},losartan:{tr:"ARB|Hipertansiyon|50-100mg/gün|Baş dönmesi, hiperkalemi|Gebelikte hayır|NSAİİ, Potasyum",en:"ARB|Hypertension|50-100mg/day|Dizziness|Not in pregnancy|NSAIDs"},atorvastatin:{tr:"Statin|Yüksek kolesterol|10-80mg/gün|Kas ağrısı|Karaciğer izlenmeli|Greyfurt",en:"Statin|Cholesterol|10-80mg/day|Muscle pain|Monitor liver|Grapefruit"},metoprolol:{tr:"Beta-bloker|Hipertansiyon, anjina|25-200mg/gün|Yorgunluk, bradikardi|Ani kesilmemeli|Verapamil",en:"Beta-blocker|Hypertension|25-200mg/day|Fatigue|Don't stop abruptly|Verapamil"},amlodipine:{tr:"KKB|Hipertansiyon, anjina|5-10mg/gün|Ödem, baş dönmesi|Karaciğer dikkat|Simvastatin",en:"CCB|Hypertension|5-10mg/day|Edema, dizziness|Caution liver|Simvastatin"},lisinopril:{tr:"ACE İnh.|Hipertansiyon|10-40mg/gün|Kuru öksürük|Gebelikte hayır|NSAİİ",en:"ACE Inh|Hypertension|10-40mg/day|Dry cough|Not in pregnancy|NSAIDs"},sertralin:{tr:"SSRI|Depresyon, anksiyete, OKB|50-200mg/gün|Bulantı, uyku bozukluğu|Gençlerde intihar riski. Ani kesilmemeli|MAO inh., Tramadol",en:"SSRI|Depression, anxiety|50-200mg/day|Nausea, insomnia|Suicide risk in youth|MAOIs"},gabapentin:{tr:"Antiepileptik|Nöropatik ağrı, epilepsi|300-3600mg/gün|Uyuşukluk, kilo alımı|Böbrekte doz ayarı|Morfin, Alkol",en:"Anticonvulsant|Neuropathic pain|300-3600mg/day|Drowsiness|Adjust in renal|Morphine"},ramipril:{tr:"ACE İnh.|Hipertansiyon, kalp koruma|1.25-10mg/gün|Öksürük, hiperkalemi|Gebelikte hayır|NSAİİ, Lityum",en:"ACE Inh|Hypertension|1.25-10mg/day|Cough|Not in pregnancy|NSAIDs"},pantoprazole:{tr:"PPI|Reflü, ülser|20-40mg/gün|Baş ağrısı|Uzun kullanım: B12 eksikliği|Metotreksat",en:"PPI|GERD|20-40mg/day|Headache|Long-term: B12|Methotrexate"},dexketoprofen:{tr:"NSAİİ|Akut ağrı, diş ağrısı|12.5-25mg 8 saat|Mide ağrısı|Ülser dikkat. Maks 3 gün IV|Warfarin",en:"NSAID|Acute pain|12.5-25mg q8h|GI upset|Caution ulcers|Warfarin"},diklofenak:{tr:"NSAİİ|Ağrı, romatizma|50-150mg/gün|Mide kanaması|KV risk artabilir|ACE inh., Warfarin",en:"NSAID|Pain, arthritis|50-150mg/day|GI bleeding|CV risk|ACE inh, Warfarin"},pregabalin:{tr:"Antiepileptik|Nöropatik ağrı, fibromiyalji|150-600mg/gün|Baş dönmesi, kilo alımı|Bağımlılık riski. Ani kesilmemeli|Opioidler",en:"Anticonvulsant|Neuropathic pain|150-600mg/day|Dizziness, weight|Dependence risk|Opioids"},clopidogrel:{tr:"Antiplatelet|Kalp krizi/inme önleme|75mg/gün|Kanama, morluk|Aktif kanamada hayır|Omeprazol",en:"Antiplatelet|Heart/stroke prevention|75mg/day|Bleeding|Not w/ active bleed|Omeprazole"},furosemide:{tr:"Diüretik|Ödem, kalp yetmezliği|20-80mg/gün|Dehidrasyon, elektrolit|Potasyum takibi|Digoksin",en:"Diuretic|Edema, heart failure|20-80mg/day|Dehydration|Monitor K+|Digoxin"},"vitamin d":{tr:"Vitamin|D vitamini eksikliği, kemik|800-4000 IU/gün|Hiperkalsemi (aşırı doz)|Böbrek dikkat|Tiazidler",en:"Supplement|Vit D deficiency|800-4000 IU/day|Hypercalcemia|Caution kidneys|Thiazides"},lansoprazole:{tr:"PPI|Ülser, reflü|15-30mg/gün|Baş ağrısı, ishal|Uzun süre: Mg eksikliği|Klopidogrel",en:"PPI|Ulcers, reflux|15-30mg/day|Headache|Long-term: low Mg|Clopidogrel"}};
function pD(s){const p=s.split("|");return{class:p[0]||"-",usage:p[1]||"-",dose:p[2]||"-",sideEffects:p[3]||"-",warnings:p[4]||"-",interactions:p[5]||"-"};}


const HOLIDAYS={"01-01":{tr:"Yılbaşı",en:"New Year"},"04-23":{tr:"Ulusal Egemenlik ve Çocuk Bayramı",en:"National Sovereignty Day"},"05-01":{tr:"Emek ve Dayanışma Günü",en:"Labour Day"},"05-19":{tr:"Gençlik ve Spor Bayramı",en:"Youth Day"},"07-15":{tr:"Demokrasi Günü",en:"Democracy Day"},"08-30":{tr:"Zafer Bayramı",en:"Victory Day"},"10-29":{tr:"Cumhuriyet Bayramı",en:"Republic Day"},"12-25":{tr:"Noel",en:"Christmas"},"03-20":{tr:"Ramazan Bayramı",en:"Eid al-Fitr"},"03-21":{tr:"Ramazan Bayramı",en:"Eid al-Fitr"},"03-22":{tr:"Ramazan Bayramı",en:"Eid al-Fitr"},"05-27":{tr:"Kurban Bayramı",en:"Eid al-Adha"},"05-28":{tr:"Kurban Bayramı",en:"Eid al-Adha"},"05-29":{tr:"Kurban Bayramı",en:"Eid al-Adha"},"05-30":{tr:"Kurban Bayramı",en:"Eid al-Adha"},"02-14":{tr:"Sevgililer Günü",en:"Valentine's Day"},"03-08":{tr:"Kadınlar Günü",en:"Women's Day"},"05-11":{tr:"Anneler Günü",en:"Mother's Day"},"06-15":{tr:"Babalar Günü",en:"Father's Day"},"11-24":{tr:"Öğretmenler Günü",en:"Teachers' Day"}};
const EMOJIS=["😊","😷","🤒","🤕","💪","❤️","🙏","👍","👋","🌟","💊","🏥","🩺","🩹","🫀","🧠","🦴","👁️","🦷","💉","🔬","📋","✅","⚠️","❓","😀","😢","😴","🤔","🥰"];
const NCOL=["#fff3b0","#b6f7c1","#b0d4f1","#f7b6d2","#f7d6b0","#d4b0f7","#b0f7ef","#f7b0b0"];
const HSYS=[{id:"mhrs",n:"MHRS",f:"tr",u:"https://mhrs.gov.tr"},{id:"nhs",n:"NHS",f:"gb",u:"https://www.nhs.uk"},{id:"mychart",n:"MyChart",f:"us",u:"https://www.mychart.com"},{id:"doctolib",n:"Doctolib",f:"fr",u:"https://www.doctolib.fr"},{id:"jameda",n:"Jameda",f:"de",u:"https://www.jameda.de"}];

// Full-body female doctor avatar
const Avatar=({s=36})=><img src="/avatar.png" alt="AILVIE" style={{width:s,height:s,borderRadius:"50%",objectFit:"cover"}} />;


// Flag component — renders Twemoji SVG for cross-platform flags
const FlagSVG={
tr:<svg viewBox="0 0 30 20"><rect width="30" height="20" fill="#E30A17"/><circle cx="13" cy="10" r="6" fill="#fff"/><circle cx="14.5" cy="10" r="4.8" fill="#E30A17"/><polygon points="16,10 18.5,7.5 16.5,9.5 19.5,10 16.5,10.5 18.5,12.5" fill="#fff"/></svg>,
en:<svg viewBox="0 0 30 20"><rect width="30" height="20" fill="#012169"/><path d="M0,0L30,20M30,0L0,20" stroke="#fff" strokeWidth="3.5"/><path d="M0,0L30,20M30,0L0,20" stroke="#C8102E" strokeWidth="2"/><path d="M15,0V20M0,10H30" stroke="#fff" strokeWidth="6"/><path d="M15,0V20M0,10H30" stroke="#C8102E" strokeWidth="3.5"/></svg>,
de:<svg viewBox="0 0 30 20"><rect y="0" width="30" height="7" fill="#000"/><rect y="7" width="30" height="6" fill="#DD0000"/><rect y="13" width="30" height="7" fill="#FFCC00"/></svg>,
ru:<svg viewBox="0 0 30 20"><rect y="0" width="30" height="7" fill="#fff"/><rect y="7" width="30" height="6" fill="#0039A6"/><rect y="13" width="30" height="7" fill="#D52B1E"/></svg>,
zh:<svg viewBox="0 0 30 20"><rect width="30" height="20" fill="#DE2910"/><polygon points="5,3 5.9,5.8 3,4.2 7,4.2 4.1,5.8" fill="#FFDE00"/><polygon points="10,1.5 10.4,2.7 9.2,2 10.8,2 9.6,2.7" fill="#FFDE00"/><polygon points="12,3.5 12.4,4.7 11.2,4 12.8,4 11.6,4.7" fill="#FFDE00"/><polygon points="12,6.5 12.4,7.7 11.2,7 12.8,7 11.6,7.7" fill="#FFDE00"/><polygon points="10,8.5 10.4,9.7 9.2,9 10.8,9 9.6,9.7" fill="#FFDE00"/></svg>,
hi:<svg viewBox="0 0 30 20"><rect y="0" width="30" height="7" fill="#FF9933"/><rect y="7" width="30" height="6" fill="#fff"/><rect y="13" width="30" height="7" fill="#138808"/><circle cx="15" cy="10" r="2.5" fill="none" stroke="#000080" strokeWidth=".5"/></svg>,
nl:<svg viewBox="0 0 30 20"><rect y="0" width="30" height="7" fill="#AE1C28"/><rect y="7" width="30" height="6" fill="#fff"/><rect y="13" width="30" height="7" fill="#21468B"/></svg>,
es:<svg viewBox="0 0 30 20"><rect y="0" width="30" height="5" fill="#AA151B"/><rect y="5" width="30" height="10" fill="#F1BF00"/><rect y="15" width="30" height="5" fill="#AA151B"/></svg>,
ar:<svg viewBox="0 0 30 20"><rect width="30" height="20" fill="#006C35"/><rect x="0" y="0" width="7" height="20" fill="#fff"/><text x="18" y="13" fontSize="7" fill="#fff" fontFamily="serif">لا</text></svg>,
us:<svg viewBox="0 0 30 20"><rect width="30" height="20" fill="#B22234"/><rect y="1.5" width="30" height="1.5" fill="#fff"/><rect y="4.5" width="30" height="1.5" fill="#fff"/><rect y="7.5" width="30" height="1.5" fill="#fff"/><rect y="10.5" width="30" height="1.5" fill="#fff"/><rect y="13.5" width="30" height="1.5" fill="#fff"/><rect y="16.5" width="30" height="1.5" fill="#fff"/><rect width="12" height="10.5" fill="#3C3B6E"/></svg>,
fr:<svg viewBox="0 0 30 20"><rect x="0" width="10" height="20" fill="#002395"/><rect x="10" width="10" height="20" fill="#fff"/><rect x="20" width="10" height="20" fill="#ED2939"/></svg>,
gb:<svg viewBox="0 0 30 20"><rect width="30" height="20" fill="#012169"/><path d="M0,0L30,20M30,0L0,20" stroke="#fff" strokeWidth="3.5"/><path d="M0,0L30,20M30,0L0,20" stroke="#C8102E" strokeWidth="2"/><path d="M15,0V20M0,10H30" stroke="#fff" strokeWidth="6"/><path d="M15,0V20M0,10H30" stroke="#C8102E" strokeWidth="3.5"/></svg>,
sa:<svg viewBox="0 0 30 20"><rect width="30" height="20" fill="#006C35"/><rect x="0" y="0" width="7" height="20" fill="#fff"/><text x="18" y="13" fontSize="7" fill="#fff" fontFamily="serif">لا</text></svg>
};
const Flag=({code,size=20})=>{const k=code?.toLowerCase();const s=FlagSVG[k];return s?<span style={{display:"inline-block",width:size,height:Math.round(size*0.67),verticalAlign:"middle",borderRadius:2,overflow:"hidden",border:"1px solid rgba(255,255,255,0.2)",lineHeight:0}}>{React.cloneElement(s,{width:size,height:Math.round(size*0.67)})}</span>:<span style={{fontSize:size*0.6,fontWeight:700}}>{code?.toUpperCase()}</span>;};

const RV_VOICES={tr:"Turkish Female",en:"UK English Female",de:"Deutsch Female",ru:"Russian Female",zh:"Chinese Female",hi:"Hindi Female",nl:"Dutch Female",es:"Spanish Female",ar:"Arabic Female"};

export default function AILVIE_App(){
const[lang,setLang]=useState(function(){try{var s=localStorage.getItem("ailvie_lang");if(s)return s;}catch(e){}var b=(navigator.language||"tr").split("-")[0].toLowerCase();return["tr","en","de","ru","zh","hi","nl","es","ar"].indexOf(b)>=0?b:"en";});
const[dark,setDark]=useState(true);
const[hc,setHc]=useState(false);
const[fs,setFs]=useState(15);
const[page,setPage]=useState("home");
const[pageHist,setPageHist]=useState(["home"]);
const[histIdx,setHistIdx]=useState(0);
const goTo=(p)=>{const nh=[...pageHist.slice(0,histIdx+1),p];setPageHist(nh);setHistIdx(nh.length-1);setPage(p);};
const goBack=()=>{if(histIdx>0){setHistIdx(histIdx-1);setPage(pageHist[histIdx-1]);}};
const goFwd=()=>{if(histIdx<pageHist.length-1){setHistIdx(histIdx+1);setPage(pageHist[histIdx+1]);}};
const[trIn,setTrIn]=useState("");
const[trOut,setTrOut]=useState("");
const[trLoad,setTrLoad]=useState(false);
const[showLangPicker,setShowLangPicker]=useState(false);
const[settingsTab,setSettingsTab]=useState("all");
const[showNotif,setShowNotif]=useState(false);
const[showEmergency,setShowEmergency]=useState(false);
const[showMenu,setShowMenu]=useState(false);
const[toast,setToast]=useState(null);
const[showEmoji,setShowEmoji]=useState(false);
const[isLoggedIn,setIsLoggedIn]=useState(false);
const toastTm=useRef(null);
const recRef=useRef(null);
const[isListen,setIsListen]=useState(false);
const[isSpeak,setIsSpeak]=useState(false);
const[zoom,setZoom]=useState(1);
const[voiceActive,setVoiceActive]=useState(false);
const[adminMsgs,setAdminMsgs]=useState([]);
const[adminIn,setAdminIn]=useState("");
const[wordLang,setWordLang]=useState(lang==="tr"?"en":lang==="en"?"tr":"en");
const[showWordLangPicker,setShowWordLangPicker]=useState(false);
const alarmTimers=useRef([]);

const t=T[lang]||T.en;

// ═══ AUTO-SAVE/LOAD ═══
useEffect(()=>{try{const d=JSON.parse(localStorage.getItem("ailvie_data")||"{}");
if(d.meds?.length)setMeds(d.meds);if(d.appts?.length)setAppts(d.appts);if(d.notes?.length)setNotes(d.notes);
if(d.contacts?.length)setContacts(d.contacts);if(d.pat)setPat(p=>({...p,...d.pat}));if(d.hd)setHd(p=>({...p,...d.hd}));
if(d.calNotes)setCalNotes(d.calNotes);if(d.calAlarms)setCalAlarms(d.calAlarms);
}catch{}},[]); // load once
useEffect(()=>{const tm=setTimeout(()=>{try{localStorage.setItem("ailvie_data",JSON.stringify({meds,appts,notes,contacts,pat,hd,calNotes,calAlarms}));}catch{}},1000);return()=>clearTimeout(tm);},[meds,appts,notes,contacts,pat,hd,calNotes,calAlarms]); // save on change
const rtl=lang==="ar";
const lc=LC[lang]||"en-US";

const[now,setNow]=useState(new Date());
useEffect(()=>{const i=setInterval(()=>setNow(new Date()),1000);return()=>clearInterval(i)},[]);

// Notifications
const[notifs,setNotifs]=useState([]);
const unread=notifs.filter(n=>!n.read).length;
const notify=useCallback((txt)=>{
  setNotifs(p=>[{id:Date.now(),text:txt,time:new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}),read:false},...p]);
  setToast(txt);if(toastTm.current)clearTimeout(toastTm.current);
  toastTm.current=setTimeout(()=>setToast(null),3000);
},[]);

// Patient
const[pat,setPat]=useState({name:"",birthDate:"",bloodType:"",allergies:"",chronic:"",insu:"",emContact:"",emPhone:""});
const[records,setRecords]=useState([]);
const[showAddRec,setShowAddRec]=useState(false);
const[newRec,setNewRec]=useState({type:"diag",doctor:"",hospital:"",date:"",content:"",notes:""});
const patAge=pat.birthDate?Math.floor((Date.now()-new Date(pat.birthDate))/(365.25*86400000)):"";

// Permissions
const[perms,setPerms]=useState({notif:true,loc:true,mic:true,cam:false});

// Meds + Alarms
const[meds,setMeds]=useState([]);
const[showAddMed,setShowAddMed]=useState(false);
const[newMed,setNewMed]=useState({name:"",dose:"",time:"",alarmType:"both",count:30,timesPerDay:1});
const WORD_TOPICS={
health:[
{tr:"Kalp",en:"Heart",de:"Herz",ru:"Сердце",zh:"心脏",hi:"हृदय",nl:"Hart",es:"Corazón",ar:"قلب"},
{tr:"Kan",en:"Blood",de:"Blut",ru:"Кровь",zh:"血液",hi:"रक्त",nl:"Bloed",es:"Sangre",ar:"دم"},
{tr:"Nefes",en:"Breath",de:"Atem",ru:"Дыхание",zh:"呼吸",hi:"सांस",nl:"Adem",es:"Aliento",ar:"نفس"},
{tr:"Kemik",en:"Bone",de:"Knochen",ru:"Кость",zh:"骨骼",hi:"हड्डी",nl:"Bot",es:"Hueso",ar:"عظم"},
{tr:"Kas",en:"Muscle",de:"Muskel",ru:"Мышца",zh:"肌肉",hi:"मांसपेशी",nl:"Spier",es:"Músculo",ar:"عضلة"},
{tr:"Beyin",en:"Brain",de:"Gehirn",ru:"Мозг",zh:"大脑",hi:"मस्तिष्क",nl:"Brein",es:"Cerebro",ar:"دماغ"},
{tr:"Akciğer",en:"Lung",de:"Lunge",ru:"Лёгкое",zh:"肺",hi:"फेफड़ा",nl:"Long",es:"Pulmón",ar:"رئة"},
{tr:"Mide",en:"Stomach",de:"Magen",ru:"Желудок",zh:"胃",hi:"पेट",nl:"Maag",es:"Estómago",ar:"معدة"},
{tr:"Böbrek",en:"Kidney",de:"Niere",ru:"Почка",zh:"肾脏",hi:"गुर्दा",nl:"Nier",es:"Riñón",ar:"كلية"},
{tr:"Karaciğer",en:"Liver",de:"Leber",ru:"Печень",zh:"肝脏",hi:"यकृत",nl:"Lever",es:"Hígado",ar:"كبد"},
{tr:"İlaç",en:"Medicine",de:"Medizin",ru:"Лекарство",zh:"药物",hi:"दवा",nl:"Medicijn",es:"Medicina",ar:"دواء"},
{tr:"Ateş",en:"Fever",de:"Fieber",ru:"Жар",zh:"发烧",hi:"बुखार",nl:"Koorts",es:"Fiebre",ar:"حمى"},
{tr:"Ağrı",en:"Pain",de:"Schmerz",ru:"Боль",zh:"疼痛",hi:"दर्द",nl:"Pijn",es:"Dolor",ar:"ألم"},
{tr:"Bağışıklık",en:"Immunity",de:"Immunität",ru:"Иммунитет",zh:"免疫",hi:"प्रतिरक्षा",nl:"Immuniteit",es:"Inmunidad",ar:"مناعة"},
{tr:"Nabız",en:"Pulse",de:"Puls",ru:"Пульс",zh:"脉搏",hi:"नाड़ी",nl:"Pols",es:"Pulso",ar:"نبض"},
{tr:"Vitamin",en:"Vitamin",de:"Vitamin",ru:"Витамин",zh:"维生素",hi:"विटामिन",nl:"Vitamine",es:"Vitamina",ar:"فيتامين"},
{tr:"Aşı",en:"Vaccine",de:"Impfstoff",ru:"Вакцина",zh:"疫苗",hi:"टीका",nl:"Vaccin",es:"Vacuna",ar:"لقاح"},
{tr:"Tansiyon",en:"Pressure",de:"Blutdruck",ru:"Давление",zh:"血压",hi:"रक्तचाप",nl:"Bloeddruk",es:"Presión",ar:"ضغط"},
{tr:"Alerji",en:"Allergy",de:"Allergie",ru:"Аллергия",zh:"过敏",hi:"एलर्जी",nl:"Allergie",es:"Alergia",ar:"حساسية"},
{tr:"Hastane",en:"Hospital",de:"Krankenhaus",ru:"Больница",zh:"医院",hi:"अस्पताल",nl:"Ziekenhuis",es:"Hospital",ar:"مستشفى"}],
daily:[
{tr:"Güneş",en:"Sun",de:"Sonne",ru:"Солнце",zh:"太阳",hi:"सूरज",nl:"Zon",es:"Sol",ar:"شمس"},
{tr:"Su",en:"Water",de:"Wasser",ru:"Вода",zh:"水",hi:"पानी",nl:"Water",es:"Agua",ar:"ماء"},
{tr:"Ekmek",en:"Bread",de:"Brot",ru:"Хлеб",zh:"面包",hi:"रोटी",nl:"Brood",es:"Pan",ar:"خبز"},
{tr:"Ev",en:"Home",de:"Haus",ru:"Дом",zh:"家",hi:"घर",nl:"Huis",es:"Casa",ar:"بيت"},
{tr:"Zaman",en:"Time",de:"Zeit",ru:"Время",zh:"时间",hi:"समय",nl:"Tijd",es:"Tiempo",ar:"وقت"},
{tr:"Aile",en:"Family",de:"Familie",ru:"Семья",zh:"家庭",hi:"परिवार",nl:"Familie",es:"Familia",ar:"عائلة"},
{tr:"Arkadaş",en:"Friend",de:"Freund",ru:"Друг",zh:"朋友",hi:"दोस्त",nl:"Vriend",es:"Amigo",ar:"صديق"},
{tr:"Kitap",en:"Book",de:"Buch",ru:"Книга",zh:"书",hi:"किताब",nl:"Boek",es:"Libro",ar:"كتاب"},
{tr:"Müzik",en:"Music",de:"Musik",ru:"Музыка",zh:"音乐",hi:"संगीत",nl:"Muziek",es:"Música",ar:"موسيقى"},
{tr:"Hayat",en:"Life",de:"Leben",ru:"Жизнь",zh:"生活",hi:"जीवन",nl:"Leven",es:"Vida",ar:"حياة"},
{tr:"Sevgi",en:"Love",de:"Liebe",ru:"Любовь",zh:"爱",hi:"प्रेम",nl:"Liefde",es:"Amor",ar:"حب"},
{tr:"Umut",en:"Hope",de:"Hoffnung",ru:"Надежда",zh:"希望",hi:"आशा",nl:"Hoop",es:"Esperanza",ar:"أمل"},
{tr:"Barış",en:"Peace",de:"Frieden",ru:"Мир",zh:"和平",hi:"शांति",nl:"Vrede",es:"Paz",ar:"سلام"},
{tr:"Sabır",en:"Patience",de:"Geduld",ru:"Терпение",zh:"耐心",hi:"धैर्य",nl:"Geduld",es:"Paciencia",ar:"صبر"},
{tr:"Mutluluk",en:"Happiness",de:"Glück",ru:"Счастье",zh:"幸福",hi:"खुशी",nl:"Geluk",es:"Felicidad",ar:"سعادة"},
{tr:"Doğa",en:"Nature",de:"Natur",ru:"Природа",zh:"自然",hi:"प्रकृति",nl:"Natuur",es:"Naturaleza",ar:"طبيعة"},
{tr:"Renk",en:"Color",de:"Farbe",ru:"Цвет",zh:"颜色",hi:"रंग",nl:"Kleur",es:"Color",ar:"لون"},
{tr:"Bilgi",en:"Knowledge",de:"Wissen",ru:"Знание",zh:"知识",hi:"ज्ञान",nl:"Kennis",es:"Conocimiento",ar:"معرفة"},
{tr:"Güç",en:"Strength",de:"Kraft",ru:"Сила",zh:"力量",hi:"शक्ति",nl:"Kracht",es:"Fuerza",ar:"قوة"},
{tr:"Yol",en:"Road",de:"Straße",ru:"Дорога",zh:"路",hi:"रास्ता",nl:"Weg",es:"Camino",ar:"طريق"},
{tr:"Gece",en:"Night",de:"Nacht",ru:"Ночь",zh:"夜",hi:"रात",nl:"Nacht",es:"Noche",ar:"ليل"},
{tr:"Yıldız",en:"Star",de:"Stern",ru:"Звезда",zh:"星星",hi:"तारा",nl:"Ster",es:"Estrella",ar:"نجم"},
{tr:"Ay",en:"Moon",de:"Mond",ru:"Луна",zh:"月亮",hi:"चाँद",nl:"Maan",es:"Luna",ar:"قمر"},
{tr:"Rüzgar",en:"Wind",de:"Wind",ru:"Ветер",zh:"风",hi:"हवा",nl:"Wind",es:"Viento",ar:"رياح"},
{tr:"Yağmur",en:"Rain",de:"Regen",ru:"Дождь",zh:"雨",hi:"बारिश",nl:"Regen",es:"Lluvia",ar:"مطر"},
{tr:"Kar",en:"Snow",de:"Schnee",ru:"Снег",zh:"雪",hi:"बर्फ",nl:"Sneeuw",es:"Nieve",ar:"ثلج"},
{tr:"Ağaç",en:"Tree",de:"Baum",ru:"Дерево",zh:"树",hi:"पेड़",nl:"Boom",es:"Árbol",ar:"شجرة"},
{tr:"Çiçek",en:"Flower",de:"Blume",ru:"Цветок",zh:"花",hi:"फूल",nl:"Bloem",es:"Flor",ar:"زهرة"},
{tr:"Deniz",en:"Sea",de:"Meer",ru:"Море",zh:"海",hi:"समुद्र",nl:"Zee",es:"Mar",ar:"بحر"},
{tr:"Kuş",en:"Bird",de:"Vogel",ru:"Птица",zh:"鸟",hi:"पक्षी",nl:"Vogel",es:"Pájaro",ar:"طائر"},
{tr:"Kedi",en:"Cat",de:"Katze",ru:"Кошка",zh:"猫",hi:"बिल्ली",nl:"Kat",es:"Gato",ar:"قطة"},
{tr:"Köpek",en:"Dog",de:"Hund",ru:"Собака",zh:"狗",hi:"कुत्ता",nl:"Hond",es:"Perro",ar:"كلب"},
{tr:"Anne",en:"Mother",de:"Mutter",ru:"Мать",zh:"母亲",hi:"माँ",nl:"Moeder",es:"Madre",ar:"أم"},
{tr:"Baba",en:"Father",de:"Vater",ru:"Отец",zh:"父亲",hi:"पिता",nl:"Vader",es:"Padre",ar:"أب"},
{tr:"Çocuk",en:"Child",de:"Kind",ru:"Ребёнок",zh:"孩子",hi:"बच्चा",nl:"Kind",es:"Niño",ar:"طفل"},
{tr:"Okul",en:"School",de:"Schule",ru:"Школа",zh:"学校",hi:"स्कूल",nl:"School",es:"Escuela",ar:"مدرسة"},
{tr:"Araba",en:"Car",de:"Auto",ru:"Машина",zh:"车",hi:"कार",nl:"Auto",es:"Coche",ar:"سيارة"},
{tr:"Yemek",en:"Food",de:"Essen",ru:"Еда",zh:"食物",hi:"खाना",nl:"Eten",es:"Comida",ar:"طعام"},
{tr:"Çay",en:"Tea",de:"Tee",ru:"Чай",zh:"茶",hi:"चाय",nl:"Thee",es:"Té",ar:"شاي"},
{tr:"Kahve",en:"Coffee",de:"Kaffee",ru:"Кофе",zh:"咖啡",hi:"कॉफ़ी",nl:"Koffie",es:"Café",ar:"قهوة"},
{tr:"Kapı",en:"Door",de:"Tür",ru:"Дверь",zh:"门",hi:"दरवाज़ा",nl:"Deur",es:"Puerta",ar:"باب"},
{tr:"Pencere",en:"Window",de:"Fenster",ru:"Окно",zh:"窗户",hi:"खिड़की",nl:"Raam",es:"Ventana",ar:"نافذة"},
{tr:"Masa",en:"Table",de:"Tisch",ru:"Стол",zh:"桌子",hi:"मेज़",nl:"Tafel",es:"Mesa",ar:"طاولة"},
{tr:"Telefon",en:"Phone",de:"Telefon",ru:"Телефон",zh:"手机",hi:"फ़ोन",nl:"Telefoon",es:"Teléfono",ar:"هاتف"},
{tr:"Saat",en:"Clock",de:"Uhr",ru:"Часы",zh:"时钟",hi:"घड़ी",nl:"Klok",es:"Reloj",ar:"ساعة"},
{tr:"Para",en:"Money",de:"Geld",ru:"Деньги",zh:"钱",hi:"पैसा",nl:"Geld",es:"Dinero",ar:"مال"},
{tr:"Sokak",en:"Street",de:"Straße",ru:"Улица",zh:"街道",hi:"गली",nl:"Straat",es:"Calle",ar:"شارع"},
{tr:"Park",en:"Park",de:"Park",ru:"Парк",zh:"公园",hi:"पार्क",nl:"Park",es:"Parque",ar:"حديقة"},
{tr:"Spor",en:"Sport",de:"Sport",ru:"Спорт",zh:"运动",hi:"खेल",nl:"Sport",es:"Deporte",ar:"رياضة"},
{tr:"Film",en:"Movie",de:"Film",ru:"Фильм",zh:"电影",hi:"फ़िल्म",nl:"Film",es:"Película",ar:"فيلم"},
{tr:"Hediye",en:"Gift",de:"Geschenk",ru:"Подарок",zh:"礼物",hi:"उपहार",nl:"Cadeau",es:"Regalo",ar:"هدية"},
{tr:"Bayram",en:"Festival",de:"Fest",ru:"Праздник",zh:"节日",hi:"त्योहार",nl:"Feest",es:"Fiesta",ar:"عيد"},
{tr:"Tatil",en:"Holiday",de:"Urlaub",ru:"Отпуск",zh:"假期",hi:"छुट्टी",nl:"Vakantie",es:"Vacaciones",ar:"عطلة"},
{tr:"İş",en:"Work",de:"Arbeit",ru:"Работа",zh:"工作",hi:"काम",nl:"Werk",es:"Trabajo",ar:"عمل"},
{tr:"Başarı",en:"Success",de:"Erfolg",ru:"Успех",zh:"成功",hi:"सफलता",nl:"Succes",es:"Éxito",ar:"نجاح"},
{tr:"Soru",en:"Question",de:"Frage",ru:"Вопрос",zh:"问题",hi:"सवाल",nl:"Vraag",es:"Pregunta",ar:"سؤال"},
{tr:"Cevap",en:"Answer",de:"Antwort",ru:"Ответ",zh:"答案",hi:"जवाब",nl:"Antwoord",es:"Respuesta",ar:"جواب"},
{tr:"Hayal",en:"Dream",de:"Traum",ru:"Мечта",zh:"梦想",hi:"सपना",nl:"Droom",es:"Sueño",ar:"حلم"},
{tr:"Özgürlük",en:"Freedom",de:"Freiheit",ru:"Свобода",zh:"自由",hi:"आज़ादी",nl:"Vrijheid",es:"Libertad",ar:"حرية"},
{tr:"Saygı",en:"Respect",de:"Respekt",ru:"Уважение",zh:"尊重",hi:"सम्मान",nl:"Respect",es:"Respeto",ar:"احترام"},
{tr:"Güven",en:"Trust",de:"Vertrauen",ru:"Доверие",zh:"信任",hi:"विश्वास",nl:"Vertrouwen",es:"Confianza",ar:"ثقة"},
{tr:"Cesaret",en:"Courage",de:"Mut",ru:"Смелость",zh:"勇气",hi:"साहस",nl:"Moed",es:"Coraje",ar:"شجاعة"},
{tr:"Gökyüzü",en:"Sky",de:"Himmel",ru:"Небо",zh:"天空",hi:"आकाश",nl:"Lucht",es:"Cielo",ar:"سماء"},
{tr:"Toprak",en:"Earth",de:"Erde",ru:"Земля",zh:"土地",hi:"ज़मीन",nl:"Aarde",es:"Tierra",ar:"أرض"},
{tr:"Altın",en:"Gold",de:"Gold",ru:"Золото",zh:"金",hi:"सोना",nl:"Goud",es:"Oro",ar:"ذهب"},
{tr:"Orman",en:"Forest",de:"Wald",ru:"Лес",zh:"森林",hi:"जंगल",nl:"Bos",es:"Bosque",ar:"غابة"},
{tr:"Ada",en:"Island",de:"Insel",ru:"Остров",zh:"岛",hi:"द्वीप",nl:"Eiland",es:"Isla",ar:"جزيرة"},
{tr:"Bulut",en:"Cloud",de:"Wolke",ru:"Облако",zh:"云",hi:"बादल",nl:"Wolk",es:"Nube",ar:"سحابة"},
{tr:"Anahtar",en:"Key",de:"Schlüssel",ru:"Ключ",zh:"钥匙",hi:"चाबी",nl:"Sleutel",es:"Llave",ar:"مفتاح"},
{tr:"Kalem",en:"Pen",de:"Stift",ru:"Ручка",zh:"笔",hi:"कलम",nl:"Pen",es:"Bolígrafo",ar:"قلم"},
{tr:"Elma",en:"Apple",de:"Apfel",ru:"Яблоко",zh:"苹果",hi:"सेब",nl:"Appel",es:"Manzana",ar:"تفاحة"},
{tr:"Portakal",en:"Orange",de:"Orange",ru:"Апельсин",zh:"橙子",hi:"संतरा",nl:"Sinaasappel",es:"Naranja",ar:"برتقال"},
{tr:"Domates",en:"Tomato",de:"Tomate",ru:"Помидор",zh:"番茄",hi:"टमाटर",nl:"Tomaat",es:"Tomate",ar:"طماطم"},
{tr:"Tavuk",en:"Chicken",de:"Huhn",ru:"Курица",zh:"鸡肉",hi:"मुर्गी",nl:"Kip",es:"Pollo",ar:"دجاج"},
{tr:"Bal",en:"Honey",de:"Honig",ru:"Мёд",zh:"蜂蜜",hi:"शहद",nl:"Honing",es:"Miel",ar:"عسل"},
{tr:"Gülümseme",en:"Smile",de:"Lächeln",ru:"Улыбка",zh:"微笑",hi:"मुस्कान",nl:"Glimlach",es:"Sonrisa",ar:"ابتسامة"},
{tr:"Sevinç",en:"Joy",de:"Freude",ru:"Радость",zh:"喜悦",hi:"ख़ुशी",nl:"Vreugde",es:"Alegría",ar:"فرح"},
{tr:"Korku",en:"Fear",de:"Angst",ru:"Страх",zh:"恐惧",hi:"डर",nl:"Angst",es:"Miedo",ar:"خوف"},
{tr:"Merak",en:"Curiosity",de:"Neugier",ru:"Любопытство",zh:"好奇",hi:"जिज्ञासा",nl:"Nieuwsgierigheid",es:"Curiosidad",ar:"فضول"},
{tr:"Merhamet",en:"Compassion",de:"Mitgefühl",ru:"Сострадание",zh:"同情",hi:"करुणा",nl:"Mededogen",es:"Compasión",ar:"رحمة"},
{tr:"Gurur",en:"Pride",de:"Stolz",ru:"Гордость",zh:"骄傲",hi:"गर्व",nl:"Trots",es:"Orgullo",ar:"فخر"},
{tr:"Vefa",en:"Loyalty",de:"Treue",ru:"Верность",zh:"忠诚",hi:"वफ़ादारी",nl:"Trouw",es:"Lealtad",ar:"وفاء"},
{tr:"Nefret",en:"Hatred",de:"Hass",ru:"Ненависть",zh:"仇恨",hi:"नफ़रत",nl:"Haat",es:"Odio",ar:"كراهية"},
{tr:"Affetmek",en:"Forgive",de:"Vergeben",ru:"Простить",zh:"原谅",hi:"माफ़ करना",nl:"Vergeven",es:"Perdonar",ar:"مسامحة"},
{tr:"Hatıra",en:"Memory",de:"Erinnerung",ru:"Воспоминание",zh:"记忆",hi:"याद",nl:"Herinnering",es:"Recuerdo",ar:"ذكرى"},
{tr:"Macera",en:"Adventure",de:"Abenteuer",ru:"Приключение",zh:"冒险",hi:"रोमांच",nl:"Avontuur",es:"Aventura",ar:"مغامرة"},
{tr:"Keşif",en:"Discovery",de:"Entdeckung",ru:"Открытие",zh:"发现",hi:"खोज",nl:"Ontdekking",es:"Descubrimiento",ar:"اكتشاف"},
{tr:"Özlem",en:"Longing",de:"Sehnsucht",ru:"Тоска",zh:"思念",hi:"याद",nl:"Verlangen",es:"Añoranza",ar:"شوق"},
{tr:"Huzur",en:"Serenity",de:"Ruhe",ru:"Покой",zh:"宁静",hi:"शांति",nl:"Rust",es:"Serenidad",ar:"سكينة"},
{tr:"Değişim",en:"Change",de:"Wandel",ru:"Перемена",zh:"变化",hi:"बदलाव",nl:"Verandering",es:"Cambio",ar:"تغيير"},
{tr:"Gelecek",en:"Future",de:"Zukunft",ru:"Будущее",zh:"未来",hi:"भविष्य",nl:"Toekomst",es:"Futuro",ar:"مستقبل"},
{tr:"Geçmiş",en:"Past",de:"Vergangenheit",ru:"Прошлое",zh:"过去",hi:"अतीत",nl:"Verleden",es:"Pasado",ar:"ماضي"},
{tr:"Şimdi",en:"Now",de:"Jetzt",ru:"Сейчас",zh:"现在",hi:"अभी",nl:"Nu",es:"Ahora",ar:"الآن"},
{tr:"Dünya",en:"World",de:"Welt",ru:"Мир",zh:"世界",hi:"दुनिया",nl:"Wereld",es:"Mundo",ar:"عالم"},
{tr:"Ülke",en:"Country",de:"Land",ru:"Страна",zh:"国家",hi:"देश",nl:"Land",es:"País",ar:"بلد"},
{tr:"Şehir",en:"City",de:"Stadt",ru:"Город",zh:"城市",hi:"शहर",nl:"Stad",es:"Ciudad",ar:"مدينة"},
{tr:"Köy",en:"Village",de:"Dorf",ru:"Деревня",zh:"村庄",hi:"गाँव",nl:"Dorp",es:"Pueblo",ar:"قرية"},
{tr:"Nehir",en:"River",de:"Fluss",ru:"Река",zh:"河流",hi:"नदी",nl:"Rivier",es:"Río",ar:"نهر"},
{tr:"Dağ",en:"Mountain",de:"Berg",ru:"Гора",zh:"山",hi:"पहाड़",nl:"Berg",es:"Mutaña",ar:"جبل"},
{tr:"Vadi",en:"Valley",de:"Tal",ru:"Долина",zh:"山谷",hi:"घाटी",nl:"Vallei",es:"Valle",ar:"وادي"},
{tr:"Liman",en:"Harbor",de:"Hafen",ru:"Порт",zh:"港口",hi:"बंदरगाह",nl:"Haven",es:"Puerto",ar:"ميناء"}],
travel:[
{tr:"Havalimanı",en:"Airport",de:"Flughafen",ru:"Аэропорт",zh:"机场",hi:"हवाई अड्डा",nl:"Luchthaven",es:"Aeropuerto",ar:"مطار"},
{tr:"Otel",en:"Hotel",de:"Hotel",ru:"Гостиница",zh:"酒店",hi:"होटल",nl:"Hotel",es:"Hotel",ar:"فندق"},
{tr:"Plaj",en:"Beach",de:"Strand",ru:"Пляж",zh:"海滩",hi:"समुद्र तट",nl:"Strand",es:"Playa",ar:"شاطئ"},
{tr:"Dağ",en:"Mountain",de:"Berg",ru:"Гора",zh:"山",hi:"पहाड़",nl:"Berg",es:"Montaña",ar:"جبل"},
{tr:"Nehir",en:"River",de:"Fluss",ru:"Река",zh:"河流",hi:"नदी",nl:"Rivier",es:"Río",ar:"نهر"},
{tr:"Köprü",en:"Bridge",de:"Brücke",ru:"Мост",zh:"桥",hi:"पुल",nl:"Brug",es:"Puente",ar:"جسر"},
{tr:"Müze",en:"Museum",de:"Museum",ru:"Музей",zh:"博物馆",hi:"संग्रहालय",nl:"Museum",es:"Museo",ar:"متحف"},
{tr:"Restoran",en:"Restaurant",de:"Restaurant",ru:"Ресторан",zh:"餐厅",hi:"रेस्तरां",nl:"Restaurant",es:"Restaurante",ar:"مطعم"},
{tr:"Harita",en:"Map",de:"Karte",ru:"Карта",zh:"地图",hi:"नक्शा",nl:"Kaart",es:"Mapa",ar:"خريطة"},
{tr:"Bilet",en:"Ticket",de:"Ticket",ru:"Билет",zh:"票",hi:"टिकट",nl:"Ticket",es:"Billete",ar:"تذكرة"}],
science:[
{tr:"Atom",en:"Atom",de:"Atom",ru:"Атом",zh:"原子",hi:"परमाणु",nl:"Atoom",es:"Átomo",ar:"ذرة"},
{tr:"Enerji",en:"Energy",de:"Energie",ru:"Энергия",zh:"能量",hi:"ऊर्जा",nl:"Energie",es:"Energía",ar:"طاقة"},
{tr:"Gezegen",en:"Planet",de:"Planet",ru:"Планета",zh:"行星",hi:"ग्रह",nl:"Planeet",es:"Planeta",ar:"كوكب"},
{tr:"Yıldız",en:"Star",de:"Stern",ru:"Звезда",zh:"星星",hi:"तारा",nl:"Ster",es:"Estrella",ar:"نجم"},
{tr:"Yerçekimi",en:"Gravity",de:"Schwerkraft",ru:"Гравитация",zh:"重力",hi:"गुरुत्वाकर्षण",nl:"Zwaartekracht",es:"Gravedad",ar:"جاذبية"},
{tr:"Işık",en:"Light",de:"Licht",ru:"Свет",zh:"光",hi:"प्रकाश",nl:"Licht",es:"Luz",ar:"ضوء"},
{tr:"Hücre",en:"Cell",de:"Zelle",ru:"Клетка",zh:"细胞",hi:"कोशिका",nl:"Cel",es:"Célula",ar:"خلية"},
{tr:"Gen",en:"Gene",de:"Gen",ru:"Ген",zh:"基因",hi:"जीन",nl:"Gen",es:"Gen",ar:"جين"},
{tr:"Evren",en:"Universe",de:"Universum",ru:"Вселенная",zh:"宇宙",hi:"ब्रह्मांड",nl:"Universum",es:"Universo",ar:"كون"},
{tr:"Oksijen",en:"Oxygen",de:"Sauerstoff",ru:"Кислород",zh:"氧气",hi:"ऑक्सीजन",nl:"Zuurstof",es:"Oxígeno",ar:"أكسجين"}]
};
const TOPIC_NAMES={health:{tr:"Sağlık",en:"Health"},daily:{tr:"Günlük",en:"Daily"},travel:{tr:"Seyahat",en:"Travel"},science:{tr:"Bilim",en:"Science"}};
const[wordTopic,setWordTopic]=useState("health");
const WORDS=WORD_TOPICS[wordTopic]||WORD_TOPICS.health;
const dayOfYear=Math.floor((Date.now()-new Date(now.getFullYear(),0,0))/86400000);
const[wordIdx,setWordIdx]=useState(()=>dayOfYear%20);
useEffect(()=>{setWordIdx(dayOfYear%WORDS.length);},[wordTopic]);
const[drugQ,setDrugQ]=useState("");
const[drugRes,setDrugRes]=useState(null);
const[drugLoad,setDrugLoad]=useState(false);
const[showScanner,setShowScanner]=useState(false);
const[scanResult,setScanResult]=useState(null);
const[scanError,setScanError]=useState("");
const videoRef=useRef(null);
const streamRef=useRef(null);
const scanIntervalRef=useRef(null);
const medProg=meds.length?Math.round(meds.filter(m=>m.taken).length/meds.length*100):0;

// Barcode → Drug mapping (common EAN/UPC barcodes)
const BARCODE_DB={
  "8699546090341":{name:"Parol (Parasetamol)",dose:"500mg",drug:"paracetamol"},
  "8699546090358":{name:"Parol Forte",dose:"665mg",drug:"paracetamol"},
  "8699809010017":{name:"Arveles (Deksketoprofen)",dose:"25mg",drug:"dexketoprofen"},
  "8699504090116":{name:"Majezik (Flurbiprofen)",dose:"100mg",drug:"ibuprofen"},
  "8699536090146":{name:"Augmentin (Amoksisilin)",dose:"1000mg",drug:"amoxicillin"},
  "8699504750116":{name:"Glucophage (Metformin)",dose:"1000mg",drug:"metformin"},
  "8699504090246":{name:"Losec (Omeprazol)",dose:"20mg",drug:"omeprazole"},
  "8680199430012":{name:"Epixx",dose:"500mg",drug:"epixx"},
  "8699536750215":{name:"Keppra (Levetirasetam)",dose:"500mg",drug:"levetiracetam"},
  "8699504010014":{name:"Cozaar (Losartan)",dose:"50mg",drug:"losartan"},
  "8699504430218":{name:"Lipitor (Atorvastatin)",dose:"20mg",drug:"atorvastatin"},
  "8699504090345":{name:"Beloc Zok (Metoprolol)",dose:"50mg",drug:"metoprolol"},
  "8699504090444":{name:"Norvasc (Amlodipin)",dose:"5mg",drug:"amlodipine"},
  "8699504310117":{name:"Lustral (Sertralin)",dose:"50mg",drug:"sertralin"},
  "8699504530214":{name:"Neurontin (Gabapentin)",dose:"300mg",drug:"gabapentin"},
  "8699504090543":{name:"Depakin (Pantoprazol)",dose:"40mg",drug:"pantoprazole"},
  "8699504750314":{name:"Lyrica (Pregabalin)",dose:"75mg",drug:"pregabalin"},
  "8699504090642":{name:"Plavix (Klopidogrel)",dose:"75mg",drug:"clopidogrel"},
  "8699504090741":{name:"Lasix (Furosemid)",dose:"40mg",drug:"furosemide"},
  "5000158100688":{name:"Nurofen (İbuprofen)",dose:"200mg",drug:"ibuprofen"},
  "5000158100695":{name:"Aspirin",dose:"500mg",drug:"aspirin"},
  "4005800295607":{name:"Voltaren (Diklofenak)",dose:"75mg",drug:"diklofenak"},
  "8699504090840":{name:"Coumadin (Warfarin)",dose:"5mg",drug:"warfarin"},
  "8699504090147":{name:"Xarelto (Rivaroxaban)",dose:"20mg",drug:"rivaroxaban"},
  "8699504250214":{name:"Euthyrox (Levotiroksin)",dose:"50mcg",drug:"levothyroxine"},
  "8699504250115":{name:"Euthyrox (Levotiroksin)",dose:"100mcg",drug:"levothyroxine"},
  "8699536090245":{name:"Cipro (Siprofloksasin)",dose:"500mg",drug:"ciprofloxacin"},
  "8699504530115":{name:"Xanax (Alprazolam)",dose:"0.5mg",drug:"alprazolam"},
  "8699504750413":{name:"Concerta (Metilfenidat)",dose:"36mg",drug:"methylphenidate"},
  "8699504430119":{name:"Nexium (Esomeprazol)",dose:"40mg",drug:"esomeprazole"},
  "8699504310216":{name:"Cipralex (Essitalopram)",dose:"10mg",drug:"escitalopram"},
  "8699504310315":{name:"Prozac (Fluoksetin)",dose:"20mg",drug:"fluoxetine"},
  "8699504090246":{name:"Lansor (Lansoprazol)",dose:"30mg",drug:"lansoprazole"},
  "8699536750116":{name:"Tegretol (Karbamazepin)",dose:"200mg",drug:"carbamazepine"},
  "8699504530313":{name:"Rivotril (Klonazepam)",dose:"2mg",drug:"clonazepam"},
  "8699504750512":{name:"Ritalin (Metilfenidat)",dose:"10mg",drug:"methylphenidate"},
  "8699504090345":{name:"Atorva (Atorvastatin)",dose:"40mg",drug:"atorvastatin"},
  "8699504310414":{name:"Desyrel (Trazodon)",dose:"100mg",drug:"trazodone"},
  "8699504430317":{name:"Lantus (İnsülin Glarjin)",dose:"100IU/mL",drug:"insulin glargine"},
  "8699504430416":{name:"Novorapid (İnsülin Aspart)",dose:"100IU/mL",drug:"insulin aspart"},
  "8699504090444":{name:"Tenormin (Atenolol)",dose:"50mg",drug:"atenolol"},
  "8699504310513":{name:"Risperdal (Risperidon)",dose:"2mg",drug:"risperidone"},
  "8699504310612":{name:"Zyprexa (Olanzapin)",dose:"10mg",drug:"olanzapine"},
  "8699536090344":{name:"Klacid (Klaritromisin)",dose:"500mg",drug:"clarithromycin"},
  "8699504530412":{name:"Stilnox (Zolpidem)",dose:"10mg",drug:"zolpidem"},
  "8699504090543":{name:"Micardis (Telmisartan)",dose:"80mg",drug:"telmisartan"},
  "8699504750611":{name:"Diamicron (Gliklazid)",dose:"60mg",drug:"gliclazide"},
  "8699504090642":{name:"Aprovel (İrbesartan)",dose:"150mg",drug:"irbesartan"},
  "8699504090741":{name:"Fosamax (Alendronat)",dose:"70mg",drug:"alendronate"},
  "8699504430515":{name:"Ventolin (Salbutamol)",dose:"100mcg",drug:"salbutamol"},
  "8699504430614":{name:"Seretide (Salmeterol/Flutikazon)",dose:"250mcg",drug:"salmeterol"},
  "8699536090443":{name:"Flagyl (Metronidazol)",dose:"500mg",drug:"metronidazole"},
  "8699504750710":{name:"Jardiance (Empagliflozin)",dose:"10mg",drug:"empagliflozin"},
  "8699504750809":{name:"Ozempic (Semaglutid)",dose:"1mg",drug:"semaglutide"},
  "8699504430713":{name:"Symbicort (Budesonid/Formoterol)",dose:"160/4.5mcg",drug:"budesonide"},
  "8699504530511":{name:"Atarax (Hidroksizin)",dose:"25mg",drug:"hydroxyzine"},
  "8699536090542":{name:"Suprax (Sefiksim)",dose:"400mg",drug:"cefixime"},
  "5000158100701":{name:"Panadol (Parasetamol)",dose:"500mg",drug:"paracetamol"},
  "5000158100718":{name:"Calpol (Parasetamol)",dose:"120mg/5mL",drug:"paracetamol"},
  "8699504750908":{name:"Trulicity (Dulaglutid)",dose:"1.5mg",drug:"dulaglutide"},
  "8699504090840a":{name:"Eliquis (Apiksaban)",dose:"5mg",drug:"apixaban"},
};

// Scanner functions
const startScanner=async()=>{
  setShowScanner(true);setScanResult(null);setScanError("");
  try{
    const stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment",width:{ideal:640},height:{ideal:480}}});
    streamRef.current=stream;
    if(videoRef.current){videoRef.current.srcObject=stream;videoRef.current.play();}
    // Try native BarcodeDetector first
    if('BarcodeDetector' in window){
      const detector=new BarcodeDetector({formats:['ean_13','ean_8','upc_a','upc_e','qr_code','code_128','code_39']});
      scanIntervalRef.current=setInterval(async()=>{
        if(!videoRef.current||videoRef.current.readyState<2)return;
        try{
          const barcodes=await detector.detect(videoRef.current);
          if(barcodes.length>0){
            const code=barcodes[0].rawValue;
            handleBarcodeScan(code);
          }
        }catch(e){}
      },500);
    }else{
      // Fallback: manual code entry hint
      setScanError(lang==="tr"?"Tarayıcınız otomatik barkod algılamayı desteklemiyor. Barkod numarasını manuel girebilirsiniz.":"Your browser doesn't support automatic barcode detection. You can enter the barcode number manually.");
    }
  }catch(e){
    setScanError(lang==="tr"?"📷 Kamera erişimi reddedildi. Kamera izni verin.":"📷 Camera access denied. Please grant camera permission.");
    setShowScanner(false);
  }
};

const stopScanner=()=>{
  if(scanIntervalRef.current)clearInterval(scanIntervalRef.current);
  if(streamRef.current)streamRef.current.getTracks().forEach(t=>t.stop());
  streamRef.current=null;scanIntervalRef.current=null;
  setShowScanner(false);
};

const handleBarcodeScan=(code)=>{
  stopScanner();
  const match=BARCODE_DB[code];
  if(match){
    setScanResult({code,found:true,...match});
    setNewMed(p=>({...p,name:match.name,dose:match.dose}));
    setDrugQ(match.drug||match.name);
    // Auto-analyze from local DB
    const db=DR[match.drug];
    if(db){const raw=db[lang]||db.tr||db.en;if(raw)setDrugRes(pD(raw));}
    notify(`✅ ${lang==="tr"?"İlaç tanındı":"Drug recognized"}: ${match.name}`);
    setShowAddMed(true);
  }else{
    setScanResult({code,found:false});
    // Try AI analysis for unknown barcodes
    setDrugQ(code);
    notify(`📊 ${lang==="tr"?"Barkod okundu, AI analiz ediliyor...":"Barcode read, analyzing with AI..."}`);
  }
};

const[manualBarcode,setManualBarcode]=useState("");

const analyzeDrug=async()=>{
  if(!drugQ.trim())return;setDrugLoad(true);setDrugRes(null);
  const key=drugQ.toLowerCase().trim();
  const db=DR[key];
  if(db){const raw=db[lang]||db.tr||db.en;if(raw){setDrugRes(pD(raw));setDrugLoad(false);return;}}
  try{
    const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:800,messages:[{role:"user",content:`"${drugQ}" ilacı hakkında bilgi. MUTLAKA ${LL[lang]} dilinde. JSON: {"class":"...","usage":"...","dose":"...","sideEffects":"...","warnings":"...","interactions":"..."}. SADECE JSON.`}]})});
    const d=await r.json();const txt=d.content?.map(c=>c.text||"").join("")||"";
    setDrugRes(JSON.parse(txt.replace(/```json|```/g,"").trim()));
  }catch{setDrugRes({class:"-",usage:"Analiz edilemedi",dose:"-",sideEffects:"-",warnings:"-",interactions:"-"});}
  setDrugLoad(false);
};



// Appts (declared here so alarm effects can use them)
const[appts,setAppts]=useState([]);
const[showAddAppt,setShowAddAppt]=useState(false);
const[newAppt,setNewAppt]=useState({doctor:"",hospital:"",clinic:"",date:"",time:""});
const[connSys,setConnSys]=useState([]);

// Med Alarm System — voice + pre-alarm
const speakAlarm=(text)=>{
  if(!text)return;
  const rvName=RV_VOICES[lang]||"UK English Female";
  try{if(window.responsiveVoice&&responsiveVoice.voiceSupport()){responsiveVoice.speak(text,rvName,{pitch:1.1,rate:0.9,volume:1});return;}}catch(e){}
  if(!window.speechSynthesis)return;
  const doAlarm=()=>{
    const u=new SpeechSynthesisUtterance(text);u.volume=1;
    const voices=speechSynthesis.getVoices();const base=lc.split("-")[0];
    const MALE=/tolga|onur|kerem|ahmet|david|mark|thomas|james|daniel|george|richard|guy|rishi|fred|male|erkek|man|homme|männlich|мужской/i;
    const FEM=/female|kadın|woman|girl|yelda|filiz|emel|seda|ayşe|zira|samantha|helena|anna|eva|hazel|jenny|aria|karen|moira|tessa|fiona|veena|lekha|ting|meijia|yuna|paulina|monica|luciana|zosia|nora|sara|alva|ellen|amélie|virginie|cécile|céline|petra|katja|milena|weiblich|femme|женский|femenino|vrouwelijk/i;
    const lv=voices.filter(v=>v.lang.toLowerCase().startsWith(base));
    let pick=lv.filter(v=>FEM.test(v.name))[0]||lv.filter(v=>!MALE.test(v.name))[0];
    if(!pick||MALE.test(pick?.name||""))pick=voices.filter(v=>FEM.test(v.name))[0];
    if(pick){u.voice=pick;u.lang=pick.lang;}else{u.lang=lc;}
    const isMale=!pick||MALE.test(pick?.name||"")||!FEM.test(pick?.name||"");
    u.pitch=isMale?1.9:1.15;u.rate=isMale?0.75:0.9;
    speechSynthesis.speak(u);
  };
  if(speechSynthesis.getVoices().length===0){speechSynthesis.onvoiceschanged=()=>{doAlarm();speechSynthesis.onvoiceschanged=null;};setTimeout(doAlarm,500);}
  else doAlarm();
};

// Calendar
const[calM,setCalM]=useState(now.getMonth());
const[calNotes,setCalNotes]=useState({});
const[calAlarms,setCalAlarms]=useState({});
const[selDate,setSelDate]=useState(null);
const[calNoteText,setCalNoteText]=useState("");
const[calAlarmTime,setCalAlarmTime]=useState("");

// Daily reset of taken flag at midnight
const lastResetDay=useRef(new Date().toDateString());
useEffect(()=>{
const today=now.toDateString();
if(today!==lastResetDay.current){
  lastResetDay.current=today;
  setMeds(p=>p.map(m=>({...m,taken:false})));
}
},[now]);

// Med + Calendar Alarm Auto-Check (runs every second)
useEffect(()=>{
const _n=now;
const hhmm=String(_n.getHours()).padStart(2,'0')+':'+String(_n.getMinutes()).padStart(2,'0');
const sec=_n.getSeconds();
if(sec===0){
meds.forEach(m=>{
  if(!m.taken&&m.time===hhmm){
    const cnt=typeof m.count==='number'?m.count:30;
    if(cnt>0){speakAlarm((lang==='tr'?'İlaç zamanı: ':'Med time: ')+m.name+' '+m.dose);notify('💊 '+m.name+' - '+m.dose);}
  }
});
const isoD=_n.toISOString().split('T')[0];
if(calAlarms[isoD]&&calAlarms[isoD]===hhmm){speakAlarm(lang==='tr'?'Takvim hatırlatması: ':'Calendar reminder: '+(calNotes[isoD]||''));notify('📅 '+(calNotes[isoD]||'Alarm'));}
}
},[now,meds,lang,calAlarms,calNotes]);

// Health
const[hd,setHd]=useState({pulse:0,weight:0,height:0,bpS:0,bpD:0});
const[editH,setEditH]=useState(null);
const[tmpH,setTmpH]=useState("");

// Notes
const[notes,setNotes]=useState([]);
const[editNote,setEditNote]=useState(null);
const[nOpen,setNOpen]=useState(false);
const[nT,setNT]=useState("");
const[nC,setNC]=useState("");
const[nCol,setNCol]=useState(NCOL[0]);
const[noteApps,setNoteApps]=useState([{name:"Google Keep",url:"https://keep.google.com",icon:"📒"},{name:"Notion",url:"https://notion.so",icon:"📓"},{name:"Evernote",url:"https://evernote.com",icon:"🐘"}]);
const[showAddNApp,setShowAddNApp]=useState(false);
const[newNApp,setNewNApp]=useState({name:"",url:"",icon:"📱"});

// Contacts
const[contacts,setContacts]=useState([]);
const[catF,setCatF]=useState("all");
const[showAddC,setShowAddC]=useState(false);
const[newC,setNewC]=useState({name:"",phone:"",category:"doctor",note:""});

// Community
const[msgs,setMsgs]=useState([{id:1,user:"Hasta_42",text:"Merhaba herkese! 👋",likes:3,time:"10:30"}]);
const[msgIn,setMsgIn]=useState("");

// Chat
const[chatM,setChatM]=useState([]);
const[chatIn,setChatIn]=useState("");
const[chatL,setChatL]=useState(false);

// Emergency
const[emNums,setEmNums]=useState([{id:1,name:"Ambulans",number:"112",icon:"🚑",fixed:true},{id:2,name:"Polis",number:"155",icon:"🚔",fixed:true},{id:3,name:"İtfaiye",number:"110",icon:"🚒",fixed:true},{id:4,name:"Jandarma",number:"156",icon:"🛡️",fixed:true},{id:5,name:"AFAD",number:"122",icon:"🆘",fixed:true}]);
const[newEm,setNewEm]=useState({name:"",number:""});

// Trash
const[trashItems,setTrashItems]=useState([]);
const[trashDays,setTrashDays]=useState(30);

const bmi=hd.weight>0&&hd.height>0?(hd.weight/((hd.height/100)**2)).toFixed(1):0;
const hscore=(hd.pulse===0&&hd.weight===0)?0:Math.min(100,Math.round(
(hd.pulse>=60&&hd.pulse<=100?30:hd.pulse>=50&&hd.pulse<=110?15:hd.pulse>0?5:0)+
(bmi>=18.5&&bmi<25?25:bmi>=17&&bmi<30?12:bmi>0?5:0)+
(hd.bpS>=90&&hd.bpS<=120&&hd.bpD>=60&&hd.bpD<=80?30:hd.bpS>=85&&hd.bpS<=140&&hd.bpD>=55&&hd.bpD<=90?15:hd.bpS>0?5:0)+
(medProg>=80?15:medProg>50?10:medProg>0?5:0)
));

const sendChat=async(text)=>{
  const q=text||chatIn;if(!q.trim())return;
  const newMsgs=[...chatM,{role:"user",text:q}];
  setChatM(newMsgs);setChatIn("");setChatL(true);
  try{
    let cx=[];
    if(pat.name)cx.push(`Hasta adı: ${pat.name}`);
    if(patAge)cx.push(`Yaş: ${patAge}`);
    if(pat.bloodType)cx.push(`Kan grubu: ${pat.bloodType}`);
    if(hd.weight>0&&hd.height>0)cx.push(`BMI: ${bmi}, Kilo: ${hd.weight}kg, Boy: ${hd.height}cm`);
    if(hd.pulse>0)cx.push(`Nabız: ${hd.pulse} bpm`);
    if(hd.bpS>0)cx.push(`Tansiyon: ${hd.bpS}/${hd.bpD}`);
    if(meds.length)cx.push(`Kullandığı ilaçlar: ${meds.map(m=>`${m.name} (${m.dose}, saat ${m.time})`).join("; ")}`);
    if(pat.allergies)cx.push(`Alerjiler: ${pat.allergies}`);
    if(pat.chronic)cx.push(`Kronik hastalıklar: ${pat.chronic}`);
    if(appts.length)cx.push(`Yaklaşan randevular: ${appts.slice(0,3).map(a=>`${a.doctor} - ${a.date}`).join("; ")}`);
    if(records.length)cx.push(`Tıbbi kayıtlar: ${records.slice(0,3).map(r=>`${r.type}: ${r.content?.substring(0,50)}`).join("; ")}`);
    const ctxStr=cx.length?`\n\nHASTA PROFİLİ:\n${cx.join("\n")}\n`:"Hasta henüz bilgi girmemiş. ";
    const history=newMsgs.slice(-10).map(m=>({role:m.role==="user"?"user":"assistant",content:m.text}));
    const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:`Sen AILVIE — dünya çapında hizmet veren, sıcak, şefkatli ve güvenilir bir KADIN sağlık asistanısın.${ctxStr}
ÖNEMLİ KURALLAR:
1) Hastayı ismiyle hitap et (biliniyorsa). Kişiselleştirilmiş yanıtlar ver.
2) ASLA hasta girmediği veriyi uydurma. Bilmiyorsan "Bu bilgiyi henüz profilinize eklemediniz" de.
3) Her zaman sıcak, empatik ve rahatlatıcı ol. Emoji kullan.
4) Ciddi belirtilerde MUTLAKA doktora yönlendir.
5) SADECE ${LL[lang]} dilinde yanıt ver.
6) Kısa ve öz cevaplar ver (3-5 cümle). Gerekirse detaylandır.
7) Hasta verilerine dayanarak kişiye özel öneriler sun.
8) İlaç etkileşimleri konusunda uyar.`,messages:history})});
    const d=await r.json();
    const reply=d.content?.map(c=>c.text||"").join("")||"Yanıt alınamadı.";
    setChatM(p=>[...p,{role:"assistant",text:reply}]);
    if(voiceActive){speak(reply);const wi=setInterval(()=>{if(!isSpeak&&voiceActive){clearInterval(wi);setTimeout(()=>{if(voiceActive&&!isListen)startVoice((t2)=>sendChat(t2));},500);}},500);setTimeout(()=>clearInterval(wi),30000);}
  }catch(e){setChatM(p=>[...p,{role:"assistant",text:lang==="tr"?"Üzgünüm, şu an yanıt veremiyorum. Lütfen internet bağlantınızı kontrol edip tekrar deneyin. 💙\n\nİpucu: Bu özellik AI servisi gerektirir.":"Sorry, I cannot respond right now. Please check your internet connection and try again. 💙\n\nTip: This feature requires an AI service."}]);}
  setChatL(false);
};

const toTrash=(type,item)=>{setTrashItems(p=>[...p,{...item,_t:type,_d:Date.now()}]);if(type==="med")setMeds(p=>p.filter(x=>x.id!==item.id));if(type==="appt")setAppts(p=>p.filter(x=>x.id!==item.id));if(type==="note")setNotes(p=>p.filter(x=>x.id!==item.id));if(type==="contact")setContacts(p=>p.filter(x=>x.id!==item.id));if(type==="record")setRecords(p=>p.filter(x=>x.id!==item.id));};
const restoreItem=(item)=>{if(item._t==="med")setMeds(p=>[...p,item]);if(item._t==="appt")setAppts(p=>[...p,item]);if(item._t==="note")setNotes(p=>[...p,item]);if(item._t==="contact")setContacts(p=>[...p,item]);if(item._t==="record")setRecords(p=>[...p,item]);setTrashItems(p=>p.filter(x=>x.id!==item.id));};

const[calY,setCalY]=useState(now.getFullYear());

// Speech — FEMALE ONLY
const speak=(text)=>{
  if(!text)return;
  if(isSpeak){
    try{speechSynthesis.cancel();}catch(e){}
    try{if(window.responsiveVoice)responsiveVoice.cancel();}catch(e){}
    setIsSpeak(false);return;
  }
  setIsSpeak(true);
  const rvName=RV_VOICES[lang]||"UK English Female";
  try{
    if(window.responsiveVoice&&typeof responsiveVoice.speak==="function"&&responsiveVoice.voiceSupport()){
      let started=false;
      responsiveVoice.speak(text,rvName,{pitch:1.1,rate:0.9,onstart:()=>{started=true;},onend:()=>setIsSpeak(false),onerror:()=>fallbackSpeak(text)});
      // If RV doesn't start within 2s, fallback (key might be invalid)
      setTimeout(()=>{if(!started){try{responsiveVoice.cancel();}catch(e){}fallbackSpeak(text);}},2000);
      return;
    }
  }catch(e){}
  fallbackSpeak(text);
};
const fallbackSpeak=(text)=>{
  if(!window.speechSynthesis){setIsSpeak(false);return;}
  speechSynthesis.cancel();
  const doSpeak=()=>{
    const u=new SpeechSynthesisUtterance(text);
    const voices=speechSynthesis.getVoices();
    const base=lc.split("-")[0];
    const MALE=/tolga|onur|kerem|ahmet|david|mark|thomas|james|daniel|george|richard|guy|rishi|fred|male|erkek|man|homme|männlich|мужской/i;
    const FEM=/female|kadın|woman|girl|yelda|filiz|emel|seda|ayşe|zira|samantha|helena|anna|eva|hazel|jenny|aria|karen|moira|tessa|fiona|veena|lekha|ting|meijia|yuna|paulina|monica|luciana|zosia|nora|sara|alva|ellen|amélie|virginie|cécile|céline|petra|katja|milena|weiblich|femme|женский|kadın|femenino|vrouwelijk/i;
    // 1. Female voice in current language
    const lv=voices.filter(v=>v.lang.toLowerCase().startsWith(base));
    let pick=lv.filter(v=>FEM.test(v.name))[0];
    // 2. Non-male voice in current language
    if(!pick)pick=lv.filter(v=>!MALE.test(v.name))[0];
    // 3. Any female voice (any language)
    if(!pick||MALE.test(pick?.name||""))pick=voices.filter(v=>FEM.test(v.name)&&v.lang.startsWith(base))[0]||voices.filter(v=>FEM.test(v.name))[0];
    // 4. English female
    if(!pick||MALE.test(pick?.name||"")){const en=voices.filter(v=>v.lang.startsWith("en"));pick=en.filter(v=>FEM.test(v.name))[0]||en.filter(v=>!MALE.test(v.name))[0]||pick;}
    // 5. Last resort — use whatever we have but pitch up heavily
    if(pick){u.voice=pick;u.lang=pick.lang;}else{u.lang=lc;}
    const isMale=!pick||MALE.test(pick?.name||"")||!FEM.test(pick?.name||"");
    u.pitch=isMale?1.9:1.15;u.rate=isMale?0.75:0.9;u.volume=1;
    u.onend=()=>setIsSpeak(false);u.onerror=()=>setIsSpeak(false);
    speechSynthesis.speak(u);
  };
  // Voices load async — wait if needed
  if(speechSynthesis.getVoices().length===0){speechSynthesis.onvoiceschanged=()=>{doSpeak();speechSynthesis.onvoiceschanged=null;};setTimeout(doSpeak,500);}
  else doSpeak();
};
// Voice handled by ResponsiveVoice.js

// Voice — FIXED
const startVoice=(cb)=>{
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!SR){notify("⚠️ Bu tarayıcı ses tanımayı desteklemiyor. Chrome kullanın.");return;}
  if(isListen&&recRef.current){try{recRef.current.abort();}catch(e){}setIsListen(false);recRef.current=null;return;}
  try{
    const r=new SR();recRef.current=r;r.lang=lc;r.continuous=false;r.interimResults=false;r.maxAlternatives=1;
    r.onstart=()=>setIsListen(true);
    r.onresult=(e)=>{cb(e.results[0][0].transcript);setIsListen(false);recRef.current=null;};
    r.onerror=(e)=>{setIsListen(false);recRef.current=null;if(e.error==="not-allowed")notify("🎤 Mikrofon izni gerekli!");};
    r.onend=()=>{setIsListen(false);recRef.current=null;};
    r.start();
  }catch(e){setIsListen(false);}
};

const autoResize=(e)=>{const t=e.target;t.style.height='36px';t.style.height=Math.min(t.scrollHeight,150)+'px';};
const copyTxt=(txt)=>{navigator.clipboard?.writeText(txt);notify("📋 "+t.copy+"!");};
const getLoc=()=>{
  if(!navigator.geolocation){window.open("https://www.google.com/maps/search/hospital+near+me","_blank");return;}
  navigator.geolocation.getCurrentPosition(p=>window.open(`https://www.google.com/maps?q=${p.coords.latitude},${p.coords.longitude}`,"_blank"),()=>window.open("https://www.google.com/maps/search/hospital+near+me","_blank"),{enableHighAccuracy:true,timeout:8000});
};

// ─── STYLES (v2 preserved) ───
const bg=dark?(hc?"#000":"#0a0e14"):(hc?"#fff":"#f2f5f9");
const cd=dark?(hc?"#111":"#151d2b"):(hc?"#fff":"#fff");
const tc=dark?(hc?"#fff":"#d5dde8"):(hc?"#000":"#1a2332");
const ac="#00b4d8",a2="#0077b6",dg="#e63946",sc="#2a9d8f",mt=dark?"#556677":"#8899aa",bd=dark?"#1e2d3d":"#dde3ea";
const CS={background:cd,borderRadius:14,padding:"12px 14px",boxShadow:dark?"0 2px 8px rgba(0,0,0,.3)":"0 1px 6px rgba(0,0,0,.06)",border:`1px solid ${bd}`};
const BP={background:`linear-gradient(135deg,${ac},${a2})`,color:"#fff",border:"none",borderRadius:10,padding:"8px 16px",cursor:"pointer",fontWeight:600,fontSize:fs-1};
const BD={...BP,background:`linear-gradient(135deg,${dg},#c1121f)`};
const IS={background:dark?"#0d1520":"#f8fafc",border:`1px solid ${bd}`,borderRadius:10,padding:"9px 12px",color:tc,fontSize:fs,width:"100%",boxSizing:"border-box",outline:"none"};
const pill=(a)=>({padding:"5px 12px",borderRadius:16,border:`1px solid ${a?ac:bd}`,background:a?ac:"transparent",color:a?"#fff":tc,cursor:"pointer",fontSize:fs-2,fontWeight:500,whiteSpace:"nowrap"});

const hr=now.getHours();
const greetTxt=hr<6?t.gn:hr<12?t.gm:hr<18?t.hi:hr<22?t.ga:t.gn;

const MicBtn=({onResult,inputRef})=>{
  return <button onClick={()=>startVoice((txt)=>{if(inputRef?.current){const el=inputRef.current;const s=el.selectionStart||0,e=el.selectionEnd||0;if(s!==e){const v=el.value;onResult(v.substring(0,s)+txt+v.substring(e));}else onResult(txt);}else onResult(txt);})} style={{background:isListen?`${dg}22`:`${ac}15`,border:`1px solid ${isListen?dg:bd}`,borderRadius:8,padding:"8px 12px",cursor:"pointer",fontSize:18,animation:isListen?"micPulse 2s infinite":"none"}}>{isListen?"🔴":"🎤"}</button>;
};
const SpeakBtn=({text})=>(<button onClick={(e)=>{e.stopPropagation();speak(text);}} style={{background:"none",border:`1px solid ${bd}`,borderRadius:8,padding:"3px 7px",cursor:"pointer",fontSize:13,color:isSpeak?dg:tc}}>{isSpeak?"⏹":"🔊"}</button>);
const EmojiPicker=({onPick,onClose})=>(<div style={{position:"absolute",bottom:52,left:0,right:0,background:cd,border:`1px solid ${bd}`,borderRadius:14,padding:12,zIndex:400,boxShadow:"0 -4px 20px rgba(0,0,0,.3)"}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span style={{fontWeight:700}}>{t.emj}</span><button onClick={onClose} style={{background:"none",border:"none",color:tc,cursor:"pointer",fontSize:18}}>✕</button></div><div style={{display:"flex",flexWrap:"wrap",gap:6}}>{EMOJIS.map(e=><button key={e} onClick={()=>{onPick(e);onClose();}} style={{fontSize:22,background:"none",border:"none",cursor:"pointer",padding:3,borderRadius:6}}>{e}</button>)}</div></div>);

const HField=({icon,label,field,unit})=>{
  const v=hd[field];const ed=editH===field;
  return(<div style={{...CS,display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:22}}>{icon}</span><div style={{flex:1}}><div style={{fontSize:fs-2,color:mt}}>{label}</div>{ed?<div style={{display:"flex",gap:6,alignItems:"center",marginTop:3}}><input type="number" autoFocus value={tmpH} onChange={e=>setTmpH(e.target.value)} style={{...IS,width:80,padding:"6px 8px",fontWeight:700}} onKeyDown={e=>{if(e.key==="Enter"){setHd(p=>({...p,[field]:Number(tmpH)}));setEditH(null);}}}/><span style={{fontSize:fs-2,color:mt}}>{unit}</span><button onClick={()=>{setHd(p=>({...p,[field]:Number(tmpH)}));setEditH(null);}} style={{...BP,padding:"5px 10px"}}>✓</button></div>:<div onClick={()=>{setEditH(field);setTmpH(v>0?String(v):"");}} style={{cursor:"pointer",fontWeight:700,fontSize:fs+2,color:v>0?tc:mt,marginTop:2}}>{v>0?`${v} ${unit}`:t.tap}</div>}</div>{v>0&&field==="pulse"&&<span style={{padding:"3px 8px",borderRadius:6,fontSize:fs-3,fontWeight:600,background:v>=60&&v<=100?`${sc}22`:`${dg}22`,color:v>=60&&v<=100?sc:dg}}>{v>=60&&v<=100?t.norm:t.caut}</span>}</div>);
};

// Analog Clock
const Clock=()=>{const s=now.getSeconds(),m=now.getMinutes(),h=now.getHours()%12;return(<svg width="64" height="64" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill={dark?"#151d2b":"#f8fafc"} stroke={ac} strokeWidth="2"/>{[...Array(12)].map((_,i)=>{const a=(i*30-90)*Math.PI/180;return <line key={i} x1={32+(i%3===0?22:24)*Math.cos(a)} y1={32+(i%3===0?22:24)*Math.sin(a)} x2={32+27*Math.cos(a)} y2={32+27*Math.sin(a)} stroke={tc} strokeWidth={i%3===0?"2":"1"} strokeLinecap="round"/>;})}<line x1="32" y1="32" x2={32+15*Math.cos(((h*30+m*.5)-90)*Math.PI/180)} y2={32+15*Math.sin(((h*30+m*.5)-90)*Math.PI/180)} stroke={tc} strokeWidth="2.5" strokeLinecap="round"/><line x1="32" y1="32" x2={32+20*Math.cos(((m*6+s*.1)-90)*Math.PI/180)} y2={32+20*Math.sin(((m*6+s*.1)-90)*Math.PI/180)} stroke={ac} strokeWidth="1.8" strokeLinecap="round"/><line x1="32" y1="32" x2={32+24*Math.cos((s*6-90)*Math.PI/180)} y2={32+24*Math.sin((s*6-90)*Math.PI/180)} stroke={dg} strokeWidth=".8" strokeLinecap="round"/><circle cx="32" cy="32" r="2.5" fill={ac}/></svg>);};

// ══════ HOME — cleaned up, no duplicate cards ══════
const renderHome=()=>{
  const apptDates=appts.map(a=>a.date);
  const nextMed=meds.filter(m=>!m.taken)[0];
  const nextAppt=appts[0];
  return(<div style={{display:"flex",flexDirection:"column",gap:8}}>
    {/* Greeting + Clock */}
    <div style={{display:"flex",alignItems:"center",gap:10}}>
      <Clock/>
      <div style={{flex:1}}>
        <div style={{fontSize:fs,fontWeight:700,color:ac}}>{greetTxt}{pat.name?`, ${pat.name.split(" ")[0]}`:""} 👋</div>
        <div style={{fontSize:fs-2,color:mt,marginTop:2}}>{t.feel}</div>
        <div style={{fontSize:fs+8,fontWeight:800,fontVariantNumeric:"tabular-nums",color:tc,letterSpacing:1}}>{now.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}</div>
        <div style={{fontSize:fs-2,color:mt}}>{now.toLocaleDateString(lc,{weekday:"long",day:"numeric",month:"long"})}</div>
      </div>
    </div>
    {/* Health + Med Progress strip */}
    <div style={{...CS,display:"flex",alignItems:"center",justifyContent:"space-around",padding:"10px 8px",cursor:"pointer"}} onClick={()=>goTo("health")}>
      <div style={{textAlign:"center"}}><div style={{fontSize:fs+4,fontWeight:800,color:hscore>70?sc:hscore>0?ac:mt}}>{hscore||"—"}</div><div style={{fontSize:fs-4,color:mt}}>{t.hScore}</div></div>
      {hd.pulse>0&&<div style={{textAlign:"center"}}><div style={{fontWeight:700,fontSize:fs}}>❤️ {hd.pulse}</div><div style={{fontSize:fs-4,color:mt}}>{t.bpm}</div></div>}
      {bmi>0&&<div style={{textAlign:"center"}}><div style={{fontWeight:700,fontSize:fs,color:bmi>=18.5&&bmi<25?sc:dg}}>⚖️ {bmi}</div><div style={{fontSize:fs-4,color:mt}}>BMI</div></div>}
      {meds.length>0&&<div style={{textAlign:"center"}}><div style={{fontWeight:700,fontSize:fs,color:medProg===100?sc:ac}}>💊 {medProg}%</div><div style={{fontSize:fs-4,color:mt}}>{t.prog}</div></div>}
    </div>
    {/* Next Med + Next Appt — only if data exists */}
    {<div style={{display:"grid",gridTemplateColumns:nextMed&&nextAppt?"1fr 1fr":"1fr",gap:6}}>
      {<div onClick={()=>goTo("medTime")} style={{...CS,cursor:"pointer",padding:"12px",border:`1px solid ${ac}33`,background:`${ac}06`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
          <span style={{fontWeight:800,fontSize:fs,color:ac}}>💊 {lang==="tr"?"İlaç Zamanı":"Med Time"}</span>
          <span style={{fontSize:fs-2,color:sc,fontWeight:700}}>{meds.filter(m=>m.taken).length}/{meds.length} {lang==="tr"?"Alındı":"Taken"}</span>
        </div>
        <div style={{height:6,background:`${mt}30`,borderRadius:3,overflow:"hidden",marginBottom:6}}>
          <div style={{height:"100%",background:`linear-gradient(90deg,${ac},${sc})`,borderRadius:3,width:`${meds.length?(meds.filter(m=>m.taken).length/meds.length)*100:0}%`,transition:"width 0.5s"}}/>
        </div>
        {nextMed?<div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:22,animation:"pulse 2s infinite"}}>⏰</span>
          <div style={{flex:1}}>
            <div style={{fontWeight:700,fontSize:fs-1}}>{nextMed.name} — {nextMed.dose}</div>
            <div style={{fontSize:fs-3,color:mt}}>{pat.name?pat.name.split(" ")[0]+", ":""}{nextMed.name} {(()=>{const[mH,mM]=m.time.split(":").map(Number);const nowM=new Date().getHours()*60+_n.getMinutes();const medM=mH*60+mM;const diff=nowM-medM;if(diff>0&&diff<120)return lang==="tr"?`${diff} dk geçti. İlacını aldıysan onay ver.`:`${diff} min passed. Confirm if taken.`;if(diff>=120)return lang==="tr"?`${Math.floor(diff/60)} saat ${diff%60} dk geçti!`:`${Math.floor(diff/60)}h ${diff%60}m passed!`;return lang==="tr"?"saatin yaklaşıyor!":"time approaching!";})()}</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontWeight:800,fontSize:fs+1,color:ac}}>{nextMed.time}</div>
            {nextMed.count>0&&<div style={{fontSize:fs-3,color:nextMed.count<=5?dg:sc}}>📦 {nextMed.count} {lang==="tr"?"kaldı":"left"}</div>}
          </div>
        </div>
        :<div style={{fontSize:fs-2,color:mt,textAlign:"center",padding:4}}>{meds.length===0?(lang==="tr"?"İlaç eklemek için tıklayın":"Tap to add medicine"):(lang==="tr"?"Tüm ilaçlar alındı! ✅":"All meds taken! ✅")}</div>}
      </div>}
      {nextAppt&&<div onClick={()=>goTo("appts")} style={{...CS,cursor:"pointer",padding:"10px",display:"flex",alignItems:"center",gap:8}}>
        <span style={{fontSize:20}}>📅</span>
        <div style={{flex:1,minWidth:0}}><div style={{fontWeight:700,fontSize:fs-1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{nextAppt.doctor}</div><div style={{color:sc,fontSize:fs-2}}>{nextAppt.date} {nextAppt.time}</div></div>
      </div>}
    </div>}
    {/* Calendar */}
    <div style={{...CS,padding:"8px 10px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
        <button onClick={()=>{if(calM===0){setCalM(11);setCalY(y=>y-1);}else setCalM(m=>m-1);}} style={{background:"none",border:"none",color:ac,cursor:"pointer",fontSize:14}}>◀</button>
        <span style={{fontWeight:700,fontSize:fs-1}}>{[t.jan,t.feb,t.mar,t.apr,t.may,t.jun,t.jul,t.aug,t.sep,t.oct,t.nov,t.dec][calM]} {calY}</span>
        <button onClick={()=>{if(calM===11){setCalM(0);setCalY(y=>y+1);}else setCalM(m=>m+1);}} style={{background:"none",border:"none",color:ac,cursor:"pointer",fontSize:14}}>▶</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:1,textAlign:"center"}}>
        {[t.su,t.mo,t.tu,t.we,t.th,t.fr,t.sa].map(d=><div key={d} style={{fontSize:11,color:mt,fontWeight:700}}>{d}</div>)}
        {[...Array(new Date(calY,calM,1).getDay()).fill(null),...Array.from({length:new Date(calY,calM+1,0).getDate()},(_,i)=>i+1)].map((d,i)=>{
          if(!d)return <div key={`e${i}`}/>;
          const iso=`${calY}-${String(calM+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
          const isToday=d===now.getDate()&&calM===now.getMonth()&&calY===now.getFullYear();
          const hasAppt=apptDates.includes(iso);
          const dayOfWeek=new Date(calY,calM,d).getDay();const isWeekend=dayOfWeek===0||dayOfWeek===6;const holKey=`${String(calM+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;const holiday=HOLIDAYS[holKey];const hasNote=calNotes[iso];const hasAlarm=calAlarms[iso];
          return <div key={i} onClick={()=>{setSelDate(selDate===iso?null:iso);setCalNoteText(calNotes[iso]||"");setCalAlarmTime(calAlarms[iso]||"");}} style={{fontSize:12,padding:"3px 0",borderRadius:5,background:isToday?ac:holiday?`${sc}25`:hasAppt?`${dg}22`:isWeekend?"rgba(255,180,0,0.1)":"transparent",color:isToday?"#fff":holiday?sc:hasAppt?dg:isWeekend?"#f0a030":tc,fontWeight:isToday||hasAppt||isWeekend?700:400,position:"relative",cursor:"pointer"}}>{d}{hasAppt&&<span style={{position:"absolute",bottom:-1,left:"50%",transform:"translateX(-50%)",width:3,height:3,borderRadius:"50%",background:dg,display:"block"}}/>}{hasNote&&<span style={{position:"absolute",top:-1,right:1,width:3,height:3,borderRadius:"50%",background:sc,display:"block"}}/>}{hasAlarm&&<span style={{position:"absolute",top:-1,left:1,width:3,height:3,borderRadius:"50%",background:"#f0a030",display:"block"}}/>}</div>;
        })}
      </div>
    </div>
    {/* Calendar Date Panel */}
    {selDate&&<div style={{...CS,border:`2px solid ${ac}`,marginTop:4,padding:"10px 12px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
        <span style={{fontWeight:700,fontSize:fs,color:ac}}>📅 {selDate}{(()=>{const h=HOLIDAYS[selDate?.substring(5)];return h?<span style={{marginLeft:6,color:sc,fontSize:fs-2}}>🎉 {h[lang]||h.en}</span>:null;})()}</span>
        <button onClick={()=>setSelDate(null)} style={{background:"none",border:"none",color:mt,cursor:"pointer",fontSize:16}}>✕</button>
      </div>
      <div style={{marginBottom:6}}>
        <div style={{fontSize:fs-2,color:mt,marginBottom:2}}>📝 {t.notes||"Not"}</div>
        <textarea value={calNoteText} onChange={e=>setCalNoteText(e.target.value)} onInput={autoResize} onBlur={()=>{if(calNoteText.trim())setCalNotes(p=>({...p,[selDate]:calNoteText}));else{const n={...calNotes};delete n[selDate];setCalNotes(n);}}} placeholder={lang==="tr"?"Not ekle...":"Add note..."} rows={2} style={{...IS,fontSize:fs-1,resize:"none",minHeight:36,maxHeight:100}}/>
      </div>
      <div style={{display:"flex",gap:6,alignItems:"center"}}>
        <span style={{fontSize:fs-2,color:mt}}>⏰</span>
        <input type="time" value={calAlarmTime} onChange={e=>{setCalAlarmTime(e.target.value);if(e.target.value)setCalAlarms(p=>({...p,[selDate]:e.target.value}));else{const a={...calAlarms};delete a[selDate];setCalAlarms(a);}}} style={{...IS,width:100,padding:"4px 8px"}}/>
        {calAlarms[selDate]&&<span style={{fontSize:fs-3,color:sc}}>✓ {t.alarmSet||"Alarm"}</span>}
      </div>
      {appts.filter(a=>a.date===selDate).map(a=><div key={a.id} style={{marginTop:6,padding:"6px 8px",borderRadius:8,background:`${dg}11`,fontSize:fs-2}}>🏥 {a.doctor} — {a.time}</div>)}
    </div>}
    {/* Word Learning */}
    <div style={{...CS,padding:"10px 12px",background:`linear-gradient(135deg,${ac}08,${sc}08)`,border:`1px solid ${ac}22`}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
        <span style={{fontWeight:700,fontSize:fs-1}}>📚 {lang==="tr"?"Günün Kelimesi":"Word of the Day"}</span>
        <div style={{display:"flex",gap:3}}>{Object.entries(TOPIC_NAMES).map(([k,v])=><button key={k} onClick={()=>setWordTopic(k)} style={{padding:"2px 6px",borderRadius:6,fontSize:fs-3,border:wordTopic===k?`1px solid ${ac}`:`1px solid ${bd}`,background:wordTopic===k?`${ac}15`:"transparent",color:wordTopic===k?ac:mt,cursor:"pointer",fontWeight:wordTopic===k?700:400}}>{v[lang]||v.en}</button>)}</div>
        <div style={{display:"flex",gap:4,alignItems:"center"}}>
          <div style={{position:"relative"}}>
            <button onClick={()=>setShowWordLangPicker(!showWordLangPicker)} style={{background:`${ac}15`,border:`1px solid ${bd}`,borderRadius:8,padding:"3px 10px",fontSize:fs-2,color:ac,cursor:"pointer",fontWeight:600,display:"flex",alignItems:"center",gap:4}}><Flag code={wordLang} size={14}/> {(LL_LOCAL[lang]||LL_LOCAL.en)[wordLang]||wordLang.toUpperCase()} ▾</button>
            {showWordLangPicker&&<div style={{position:"absolute",right:0,top:28,background:cd,border:`1px solid ${bd}`,borderRadius:10,boxShadow:`0 4px 16px rgba(0,0,0,.3)`,zIndex:50,padding:4,width:170,maxHeight:200,overflowY:"auto"}}>{Object.entries(LL).filter(([k])=>k!==lang).map(([k,v])=><button key={k} onClick={()=>{setWordLang(k);setShowWordLangPicker(false);}} style={{display:"flex",alignItems:"center",gap:6,width:"100%",padding:"6px 10px",background:wordLang===k?`${ac}15`:"transparent",border:"none",borderRadius:6,fontSize:fs-2,color:tc,cursor:"pointer"}}><Flag code={k} size={14}/><span style={{fontWeight:wordLang===k?700:400}}>{(LL_LOCAL[lang]||LL_LOCAL.en)[k]||v}</span></button>)}</div>}
          </div>
          <button onClick={()=>setWordIdx(p=>(p+1)%WORDS.length)} style={{background:"none",border:`1px solid ${bd}`,borderRadius:8,padding:"3px 10px",cursor:"pointer",color:ac,fontSize:fs-1}}>→</button>
        </div>
      </div>
      <div style={{textAlign:"center",padding:"8px 0"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginBottom:6}}>
          <Flag code={lang} size={18}/>
          <span style={{fontSize:fs+2,fontWeight:700,color:tc}}>{WORDS[wordIdx]?.[lang]||WORDS[wordIdx]?.en}</span>
        </div>
        <div style={{width:40,height:2,background:ac,margin:"0 auto 8px",borderRadius:1,opacity:.5}}/>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
          <Flag code={wordLang} size={22}/>
          <span style={{fontSize:fs+8,fontWeight:800,color:ac}}>{WORDS[wordIdx]?.[wordLang]||WORDS[wordIdx]?.en}</span>
        </div>
        <div style={{fontSize:fs-3,color:mt,marginTop:4}}>{(LL_LOCAL[lang]||LL_LOCAL.en)[lang]} → {(LL_LOCAL[lang]||LL_LOCAL.en)[wordLang]}</div>
      </div>
    </div>
    {/* AI Translator */}
    <div style={{...CS,padding:"10px 12px"}}>
      <div style={{fontWeight:700,fontSize:fs-1,marginBottom:6}}><img src={GLOBE_IMG} style={{width:18,height:18,verticalAlign:"middle",marginRight:4,borderRadius:9}}/> {lang==="tr"?"Çeviri":lang==="en"?"Translator":lang==="de"?"Übersetzer":lang==="ru"?"Переводчик":lang==="zh"?"翻译":lang==="hi"?"अनुवादक":lang==="nl"?"Vertaler":lang==="es"?"Traductor":lang==="ar"?"مترجم":"Translator"} <span style={{fontSize:fs-3,color:ac,fontWeight:500}}>9 {t.lang}</span></div>
      <textarea value={trIn} onChange={e=>setTrIn(e.target.value)} onInput={autoResize} placeholder={lang==="tr"?"Çevirmek istediğiniz metni yazın...":lang==="en"?"Enter text to translate...":lang==="de"?"Text eingeben...":lang==="ru"?"Введите текст...":lang==="zh"?"输入文本...":lang==="hi"?"अनुवाद के लिए टेक्स्ट...":lang==="nl"?"Voer tekst in...":lang==="es"?"Ingrese texto...":lang==="ar"?"أدخل النص...":"Enter text..."} rows={2} style={{...IS,marginBottom:6,resize:"none",fontSize:fs-1}}/>
      <div style={{display:"flex",gap:6,marginBottom:6}}>
        <button onClick={async()=>{if(!trIn.trim())return;setTrLoad(true);try{const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:600,messages:[{role:"user",content:`Translate "${trIn}" to these 9 languages. Return ONLY a JSON array like: [{"flag":"tr","lang":"Türkçe","text":"..."},{"flag":"en","lang":"English","text":"..."},{"flag":"de","lang":"Deutsch","text":"..."},{"flag":"ru","lang":"Русский","text":"..."},{"flag":"zh","lang":"中文","text":"..."},{"flag":"hi","lang":"हिन्दी","text":"..."},{"flag":"nl","lang":"Nederlands","text":"..."},{"flag":"es","lang":"Español","text":"..."},{"flag":"ar","lang":"العربية","text":"..."}]. ONLY JSON, no markdown.`}]})});const d=await r.json();const txt=d.content?.map(c=>c.text||"").join("")||"[]";const parsed=JSON.parse(txt.replace(/```json|```/g,"").trim());setTrOut(Array.isArray(parsed)?parsed:[{flag:"❌",lang:"Error",text:txt}]);}catch(err){setTrOut([{flag:"❌",lang:"Error",text:lang==="tr"?"Çeviri servisi şu an kullanılamıyor. Lütfen daha sonra tekrar deneyin.":"Translation service unavailable. Please try again later."}]);}setTrLoad(false);}} disabled={trLoad} style={{...BP,flex:1,padding:"8px",fontSize:fs-1}}>{trLoad?"⏳":(lang==="tr"?"Çevir":lang==="en"?"Translate":lang==="de"?"Übersetzen":lang==="ru"?"Перевести":lang==="zh"?"翻译":lang==="hi"?"अनुवाद":lang==="nl"?"Vertalen":lang==="es"?"Traducir":lang==="ar"?"ترجمة":"Translate")}</button>
        {trOut&&<button onClick={()=>{setTrIn("");setTrOut(null);}} style={{...BP,background:mt,padding:"8px 12px"}}>✕</button>}
      </div>
      {trOut&&Array.isArray(trOut)&&<div style={{background:dark?"#0d1520":"#f8fafc",borderRadius:8,padding:6,maxHeight:140,overflowY:"auto"}}>
        {trOut.map((r,i)=><div key={i} style={{padding:"4px 6px",borderBottom:i<trOut.length-1?`1px solid ${bd}`:"none",display:"flex",gap:6,alignItems:"baseline"}}>
          <span style={{fontSize:14}}>{r.flag&&FlagSVG[r.flag]?<Flag code={r.flag} size={16}/>:r.flag}</span>
          <span style={{fontWeight:700,color:ac,fontSize:fs-2,minWidth:55}}>{(LL_LOCAL[lang]||LL_LOCAL.en)[r.flag]||r.lang}</span>
          <span style={{fontSize:fs-1,color:tc}}>{r.text}</span>
        </div>)}
      </div>}
    </div>
    {/* Emergency + Location */}
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
      <button onClick={()=>setShowEmergency(true)} style={{...BD,padding:"10px 8px",fontSize:fs,borderRadius:10}}>🚨 {t.emergency}</button>
      <button onClick={getLoc} style={{...BP,padding:"10px 8px",display:"flex",alignItems:"center",justifyContent:"center",gap:4,fontSize:fs}}>📍 {t.loc}</button>
    </div>
    {/* Notif */}
    {unread>0&&<div onClick={()=>setShowNotif(true)} style={{...CS,background:`${ac}11`,border:`1px solid ${ac}33`,cursor:"pointer",display:"flex",alignItems:"center",gap:8,padding:"8px 12px"}}><span style={{fontSize:16}}>🔔</span><span style={{fontWeight:600,fontSize:fs-1}}>{unread} {t.notif}</span></div>}
    {/* Legal */}
    <div style={{padding:"4px 8px",borderRadius:6,background:`${mt}08`,fontSize:fs-4,color:mt,textAlign:"center",marginBottom:4}}>{t.warn}</div>
  </div>);
};

// All other pages follow same pattern as v5 but I'll include key changes...
// For brevity, the pages reuse v5 logic. Below are the key structural elements.

const renderAppts=()=>{
  const today=new Date().toISOString().split("T")[0];
  return(<div style={{display:"flex",flexDirection:"column",gap:10}}>
    <span style={{fontWeight:700,fontSize:fs+2}}>📅 {t.appts}</span>
    {/* 1. Book Appt — systems on top */}
    <div style={{...CS,border:`2px solid ${sc}`,background:`${sc}06`}}>
      <div style={{fontWeight:700,color:sc,fontSize:fs+1,marginBottom:8}}>🏥 {t.bookAppt}</div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
        {HSYS.map(s=>{const cn=connSys.includes(s.id);return <button key={s.id} onClick={()=>{if(cn)window.open(s.u,"_blank");else{setConnSys(p=>[...p,s.id]);notify(`${s.f} ${s.n} eklendi!`);}}} style={{...pill(cn),padding:"6px 10px",display:"flex",alignItems:"center",gap:4}}><Flag code={s.f} size={14}/> {s.n}{cn?" ✓":""}</button>;})}
      </div>
    </div>
    {/* 2. Add Appt */}
    <button onClick={()=>setShowAddAppt(true)} style={{...CS,border:`2px solid ${ac}`,textAlign:"center",cursor:"pointer",padding:14,background:`${ac}06`}}>
      <span style={{fontSize:24}}>📝</span>
      <div style={{fontWeight:700,color:ac,marginTop:4}}>+ {t.addAppt}</div>
    </button>
    {showAddAppt&&<div style={{...CS,border:`2px solid ${ac}`}}>
      <input placeholder={t.dr} value={newAppt.doctor} onChange={e=>setNewAppt({...newAppt,doctor:e.target.value})} style={{...IS,marginBottom:6}}/>
      <input placeholder={t.hosp} value={newAppt.hospital} onChange={e=>setNewAppt({...newAppt,hospital:e.target.value})} style={{...IS,marginBottom:6}}/>
      <input placeholder={t.clin} value={newAppt.clinic} onChange={e=>setNewAppt({...newAppt,clinic:e.target.value})} style={{...IS,marginBottom:6}}/>
      <div style={{display:"flex",gap:6,marginBottom:6}}><input type="date" value={newAppt.date} onChange={e=>setNewAppt({...newAppt,date:e.target.value})} style={{...IS,flex:1}}/><input type="time" value={newAppt.time} onChange={e=>setNewAppt({...newAppt,time:e.target.value})} style={{...IS,flex:1}}/></div>
      <div style={{display:"flex",gap:6}}><button onClick={()=>{if(newAppt.doctor&&newAppt.date){setAppts(p=>[...p,{id:Date.now(),...newAppt,source:""}]);notify(`📅⏰ ${newAppt.doctor} — ${t.alarmSet}`);setNewAppt({doctor:"",hospital:"",clinic:"",date:"",time:""});setShowAddAppt(false);}}} style={BP}>{t.save}</button><button onClick={()=>setShowAddAppt(false)} style={{...BP,background:mt}}>{t.cancel}</button></div>
    </div>}
    {/* 3. Upcoming / Past */}
    <div style={{display:"flex",gap:6}}>{["up","past"].map(tab=><button key={tab} onClick={()=>goTo(tab==="up"?"appts":"appts")} style={pill(true)}>{t[tab]}</button>)}</div>
    {appts.filter(a=>a.date>=today).length===0&&<div style={{textAlign:"center",color:mt,padding:16}}>{t.noA}</div>}
    {appts.filter(a=>a.date>=today).map(a=>(<div key={a.id} style={CS}><div style={{fontWeight:700,fontSize:fs+1}}>{a.doctor}</div><div style={{fontSize:fs-1,color:mt}}>🏥 {a.hospital} • {a.clinic}</div><div style={{color:ac}}>📅 {a.date} ⏰ {a.time}</div><div style={{fontSize:fs-3,color:sc,marginTop:2}}>🔔 1 gün + 6 saat önce alarm</div><div style={{display:"flex",gap:6,marginTop:6}}><a href={`https://www.google.com/maps/search/${encodeURIComponent(a.hospital)}`} target="_blank" rel="noopener noreferrer" style={{...BP,padding:"6px 12px",textDecoration:"none"}}>🗺️ {t.dir}</a><a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(a.hospital)}&travelmode=transit`} target="_blank" rel="noopener noreferrer" style={{...BP,padding:"6px 12px",background:sc,textDecoration:"none"}}>🚌</a><button onClick={()=>toTrash("appt",a)} style={{background:"none",border:`1px solid ${dg}33`,color:dg,borderRadius:8,padding:"6px 12px",cursor:"pointer"}}>🗑️</button></div></div>))}
    {/* 4. AI Location + Transit */}
    <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
      <button onClick={getLoc} style={{...BP,padding:"6px 12px"}}>📍 {t.loc}</button>
      {[{n:"IETT",u:"https://www.iett.istanbul"},{n:"TfL",u:"https://tfl.gov.uk"},{n:"Moovit",u:"https://moovitapp.com"}].map(l=><a key={l.n} href={l.u} target="_blank" rel="noopener noreferrer" style={{...BP,padding:"6px 12px",background:sc,textDecoration:"none"}}>{l.n}</a>)}
    </div>
  </div>);
};

// Meds page with alarm + QR/Barcode scanner
// ═══ İLAÇ ZAMANI — Dedicated Med Timer Page ═══
const renderMedTime=()=>{
const pending=meds.filter(m=>!m.taken);
const taken=meds.filter(m=>m.taken);
const h=now.getHours();const mn=now.getMinutes();
const getMinLeft=(time)=>{const[th,tm]=time.split(":").map(Number);return(th*60+tm)-(h*60+mn);};

return(<div style={{display:"flex",flexDirection:"column",gap:10}}>
  {/* Header */}
  <div style={{textAlign:"center",padding:"10px 0"}}>
    <div style={{fontSize:40,marginBottom:4,animation:"pulse 2s infinite"}}>⏰</div>
    <div style={{fontWeight:800,fontSize:fs+4,color:ac}}>{lang==="tr"?"İlaç Zamanı":"Med Time"}</div>
    <div style={{fontSize:fs-2,color:mt}}>{pat.name?pat.name+", ":""}{pending.length>0?(lang==="tr"?`${pending.length} ilaç bekliyor`:`${pending.length} meds pending`):(lang==="tr"?"Tüm ilaçlar alındı! ✅":"All meds taken! ✅")}</div>
  </div>

  {/* Progress */}
  <div style={{...CS,padding:"12px"}}>
    <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
      <span style={{fontWeight:700,fontSize:fs-1}}>{lang==="tr"?"Günlük İlerleme":"Daily Progress"}</span>
      <span style={{fontWeight:800,color:sc}}>{taken.length}/{meds.length}</span>
    </div>
    <div style={{height:10,background:`${mt}25`,borderRadius:5,overflow:"hidden"}}>
      <div style={{height:"100%",background:`linear-gradient(90deg,${ac},${sc})`,borderRadius:5,width:`${meds.length?(taken.length/meds.length)*100:0}%`,transition:"width 0.5s"}}/>
    </div>
  </div>

  {/* Pending Meds — Timer Cards */}
  {pending.length>0&&<div style={{fontWeight:700,fontSize:fs,color:dg,marginTop:4}}>🔴 {lang==="tr"?"Bekleyen İlaçlar":"Pending Meds"}</div>}
  {pending.sort((a,b)=>getMinLeft(a.time)-getMinLeft(b.time)).map(m=>{
    const minLeft=getMinLeft(m.time);
    const isNear=minLeft>=0&&minLeft<=30;
    const isPast=minLeft<0;
    return(<div key={m.id} style={{...CS,border:`2px solid ${isNear?dg:isPast?"#f97316":bd}`,background:isNear?`${dg}08`:isPast?`#f9731608`:"transparent",padding:"12px"}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:44,height:44,borderRadius:22,background:isNear?`${dg}15`:`${ac}15`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,animation:isNear?"pulse 1s infinite":"none"}}>{isNear?"🔔":"💊"}</div>
        <div style={{flex:1}}>
          <div style={{fontWeight:800,fontSize:fs+1}}>{m.name}</div>
          <div style={{fontSize:fs-2,color:mt}}>{m.dose} — {m.alarmType==="ring"?"🔔":m.alarmType==="vibrate"?"📳":"🔔📳"}</div>
          <div style={{display:"flex",gap:8,marginTop:3}}>
            <span style={{fontSize:fs-3,color:ac,fontWeight:600}}>📦 {m.count||30} {lang==="tr"?"kaldı":"left"}</span>
          </div>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontWeight:800,fontSize:fs+4,color:isNear?dg:ac}}>{m.time}</div>
          <div style={{fontSize:fs-2,fontWeight:700,color:isNear?dg:isPast?"#f97316":sc}}>
            {isPast?(lang==="tr"?"GEÇTİ!":"OVERDUE!"):minLeft<=0?(lang==="tr"?"ŞİMDİ!":"NOW!"):`${minLeft} ${lang==="tr"?"dk":"min"}`}
          </div>
        </div>
      </div>
      {/* Personalized reminder */}
      {isNear&&<div style={{marginTop:8,padding:"8px 10px",borderRadius:8,background:`${dg}12`,fontSize:fs-1,color:dg,fontWeight:600}}>
        🗣️ {pat.name?pat.name.split(" ")[0]+", ":""}{m.name} {lang==="tr"?"saatin yaklaşıyor! "+minLeft+" dakika sonra kullanmayı unutma!":"time is near! Don't forget in "+minLeft+" minutes!"}
      </div>}
      {/* Actions */}
      <div style={{display:"flex",gap:6,marginTop:8}}>
        <button onClick={()=>{setMeds(p=>p.map(x=>x.id===m.id?{...x,taken:true,count:Math.max(0,Number(x.count||30)-1)}:x));notify("✅ "+m.name+" "+(lang==="tr"?"alındı":"taken"));speakAlarm(m.name+" "+(lang==="tr"?"alındı":"taken"));}} style={{...BP,flex:1,padding:"10px",fontSize:fs,fontWeight:700}}>✅ {lang==="tr"?"Aldım":"Taken"}</button>
        <button onClick={()=>speakAlarm((pat.name||"")+", "+m.name+" "+m.dose+" "+(lang==="tr"?"saatin yaklaşıyor!":"time is near!"))} style={{background:`${ac}15`,border:`1px solid ${ac}`,borderRadius:10,padding:"10px 14px",cursor:"pointer",fontSize:16}}>🔊</button>
      </div>
    </div>);
  })}

  {/* Taken Meds */}
  {taken.length>0&&<div style={{fontWeight:700,fontSize:fs,color:sc,marginTop:4}}>✅ {lang==="tr"?"Alınan İlaçlar":"Taken Meds"}</div>}
  {taken.map(m=>(<div key={m.id} style={{...CS,opacity:0.5,display:"flex",alignItems:"center",gap:10}}>
    <span style={{fontSize:20}}>✅</span>
    <div style={{flex:1}}>
      <div style={{fontWeight:700,textDecoration:"line-through"}}>{m.name}</div>
      <div style={{fontSize:fs-2,color:mt}}>{m.dose} — {m.time}</div>
    </div>
    <button onClick={()=>setMeds(p=>p.map(x=>x.id===m.id?{...x,taken:false}:x))} style={{background:"none",border:`1px solid ${bd}`,borderRadius:8,padding:"4px 10px",cursor:"pointer",color:mt,fontSize:fs-2}}>↩️</button>
  </div>))}

  {/* Add Med shortcut */}
  <button onClick={()=>goTo("meds")} style={{...CS,border:`2px dashed ${ac}33`,cursor:"pointer",textAlign:"center",padding:"14px",color:ac,fontWeight:600}}>
    💊 {lang==="tr"?"İlaç Ekle / Düzenle":"Add / Edit Meds"} →
  </button>
</div>);};


const renderMeds=()=>(<div style={{display:"flex",flexDirection:"column",gap:10}}>
  {/* İlaç Zamanı Alert */}
  {meds.some(m=>!m.taken)&&<div style={{...CS,background:`${dg}12`,border:`1px solid ${dg}33`,display:"flex",alignItems:"center",gap:10,padding:"10px 12px"}}>
    <span style={{fontSize:28,animation:"pulse 1.5s infinite"}}>⏰</span>
    <div>
      <div style={{fontWeight:700,fontSize:fs,color:dg}}>{lang==="tr"?"İlaç Zamanı":"Med Time"}</div>
      <div style={{fontSize:fs-2,color:mt}}>{meds.filter(m=>!m.taken).length} {lang==="tr"?"bekliyor":"pending"}</div>
    </div>
  </div>}
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontWeight:700,fontSize:fs+2}}>💊 {t.meds}</span><div style={{display:"flex",gap:6}}><button onClick={()=>setShowAddMed(true)} style={{...BP,padding:"7px 12px"}}>+ {t.addMed}</button><button onClick={startScanner} style={{...BP,padding:"7px 12px",background:`linear-gradient(135deg,${sc},#1a7a6e)`}}>📷 {t.scanAdd}</button></div></div>
  {meds.length>0&&<div style={CS}><div style={{fontSize:fs-1,color:mt,marginBottom:4}}>{t.prog}: {medProg}%</div><div style={{height:7,borderRadius:4,background:bd}}><div style={{height:7,borderRadius:4,background:`linear-gradient(90deg,${ac},${sc})`,width:`${medProg}%`,transition:"width .3s"}}/></div></div>}
  {/* QR/Barcode Scanner View */}
  {showScanner&&<div style={{...CS,border:`2px solid ${sc}`,overflow:"hidden",position:"relative"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
      <span style={{fontWeight:700,color:sc}}>📷 {t.scanning}</span>
      <button onClick={stopScanner} style={{...BP,padding:"5px 10px",background:`linear-gradient(135deg,${dg},#c1121f)`,fontSize:fs-2}}>{t.stopScan}</button>
    </div>
    <div style={{position:"relative",borderRadius:10,overflow:"hidden",background:"#000",aspectRatio:"4/3"}}>
      <video ref={videoRef} style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:10}} playsInline muted/>
      {/* Scan overlay guide */}
      <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",pointerEvents:"none"}}>
        <div style={{width:"70%",height:"50%",border:`2px solid ${sc}`,borderRadius:12,boxShadow:`0 0 0 9999px rgba(0,0,0,0.4)`,position:"relative"}}>
          <div style={{position:"absolute",top:-2,left:-2,width:20,height:20,borderTop:`3px solid ${ac}`,borderLeft:`3px solid ${ac}`,borderRadius:"4px 0 0 0"}}/>
          <div style={{position:"absolute",top:-2,right:-2,width:20,height:20,borderTop:`3px solid ${ac}`,borderRight:`3px solid ${ac}`,borderRadius:"0 4px 0 0"}}/>
          <div style={{position:"absolute",bottom:-2,left:-2,width:20,height:20,borderBottom:`3px solid ${ac}`,borderLeft:`3px solid ${ac}`,borderRadius:"0 0 0 4px"}}/>
          <div style={{position:"absolute",bottom:-2,right:-2,width:20,height:20,borderBottom:`3px solid ${ac}`,borderRight:`3px solid ${ac}`,borderRadius:"0 0 4px 0"}}/>
          {/* Scan line animation */}
          <div style={{position:"absolute",left:"5%",right:"5%",height:2,background:ac,top:"50%",animation:"scanLine 2s ease-in-out infinite",boxShadow:`0 0 8px ${ac}`}}/>
        </div>
      </div>
    </div>
    <div style={{fontSize:fs-2,color:mt,textAlign:"center",marginTop:6}}>{lang==="tr"?"Barkodu veya QR kodu kameranın önüne tutun":"Hold barcode or QR code in front of camera"}</div>
    {scanError&&<div style={{fontSize:fs-2,color:dg,textAlign:"center",marginTop:4}}>{scanError}</div>}
  </div>}
  {/* Manual Barcode Entry */}
  {showScanner&&<div style={{...CS,border:`1px solid ${sc}33`}}>
    <div style={{fontSize:fs-1,fontWeight:600,marginBottom:6}}>⌨️ {t.scanManual}</div>
    <div style={{display:"flex",gap:6}}>
      <input placeholder={t.barcodeNum+" (EAN/UPC)"} value={manualBarcode} onChange={e=>setManualBarcode(e.target.value)} style={{...IS,flex:1,fontFamily:"monospace",letterSpacing:2}} onKeyDown={e=>{if(e.key==="Enter"&&manualBarcode.trim()){handleBarcodeScan(manualBarcode.trim());setManualBarcode("");}}}/>
      <button onClick={()=>{if(manualBarcode.trim()){handleBarcodeScan(manualBarcode.trim());setManualBarcode("");}}} style={{...BP,background:`linear-gradient(135deg,${sc},#1a7a6e)`}}>🔍</button>
    </div>
  </div>}
  {/* Scan Result */}
  {scanResult&&<div style={{...CS,border:`2px solid ${scanResult.found?sc:dg}`,background:scanResult.found?`${sc}08`:`${dg}08`}}>
    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
      <span style={{fontSize:24}}>{scanResult.found?"✅":"❌"}</span>
      <div>
        <div style={{fontWeight:700,color:scanResult.found?sc:dg}}>{scanResult.found?t.scanFound:t.scanNotFound}</div>
        <div style={{fontSize:fs-2,color:mt,fontFamily:"monospace"}}>📊 {scanResult.code}</div>
      </div>
    </div>
    {scanResult.found&&<div style={{padding:"8px 10px",borderRadius:8,background:cd,border:`1px solid ${bd}`}}>
      <div style={{fontWeight:700,fontSize:fs+1}}>{scanResult.name}</div>
      <div style={{fontSize:fs-1,color:ac}}>{t.dose}: {scanResult.dose}</div>
      <div style={{fontSize:fs-2,color:mt,marginTop:4}}>{lang==="tr"?"↓ İlaç bilgileri aşağıda gösteriliyor":"↓ Drug info shown below"}</div>
    </div>}
    {!scanResult.found&&<div style={{fontSize:fs-2,color:mt}}>{lang==="tr"?"Bu barkod veritabanımızda yok. İlaç adını manuel olarak aratabilirsiniz.":"This barcode is not in our database. You can search the drug name manually."}</div>}
    <button onClick={()=>setScanResult(null)} style={{background:"none",border:"none",color:mt,cursor:"pointer",fontSize:fs-2,marginTop:6}}>✕ {lang==="tr"?"Kapat":"Close"}</button>
  </div>}
  {meds.length===0&&!showScanner&&<div style={{textAlign:"center",color:mt,padding:24}}>{t.noM}</div>}
  {meds.map(m=>(<div key={m.id} style={{...CS,display:"flex",alignItems:"center",gap:10,opacity:m.taken?0.5:1}}>
    <div style={{textAlign:"center"}}><span style={{fontSize:22}}>{m.taken?"✅":"💊"}</span>{m.count>0&&!m.taken&&<div style={{fontSize:fs-4,color:m.count<=5?dg:sc,fontWeight:700,marginTop:1}}>{m.count}</div>}</div>
    <div style={{flex:1}}><div style={{fontWeight:700}}>{m.name}</div><div style={{fontSize:fs-2,color:mt}}>{m.dose} — ⏰ {m.time}</div><div style={{fontSize:fs-3,color:sc}}>{m.alarmType==="ring"?"🔔":m.alarmType==="vibrate"?"📳":"🔔📳"} {m.count>0&&<span style={{color:m.count<=5?dg:mt}}>({lang==="tr"?"Kalan":"Left"}: {m.count})</span>}</div></div>
    {!m.taken&&<button onClick={()=>{setMeds(p=>p.map(x=>x.id===m.id?{...x,taken:true,count:Math.max(0,(x.count||0)-1)}:x));notify(`✅ ${m.name} ${t.taken}${m.count>1?` (${lang==="tr"?"Kalan":"Left"}: ${m.count-1})`:""}`);}} style={{...BP,padding:"6px 12px"}}>✓</button>}
    <button onClick={()=>toTrash("med",m)} style={{background:"none",border:"none",color:dg,cursor:"pointer",fontSize:16}}>🗑️</button>
  </div>))}
  {showAddMed&&<div style={{...CS,border:`2px solid ${ac}`}}>
    <input placeholder={t.nm} value={newMed.name} onChange={e=>setNewMed({...newMed,name:e.target.value})} style={{...IS,marginBottom:6}}/>
    <input placeholder={t.dose} value={newMed.dose} onChange={e=>setNewMed({...newMed,dose:e.target.value})} style={{...IS,marginBottom:6}}/>
    <input type="time" value={newMed.time} onChange={e=>setNewMed({...newMed,time:e.target.value})} style={{...IS,marginBottom:6}}/>
    <div style={{marginBottom:6}}><div style={{fontSize:fs-2,color:mt,marginBottom:4}}>⏰ {t.alarmType}</div><div style={{display:"flex",gap:6}}>{["ring","vibrate","both"].map(at=><button key={at} onClick={()=>setNewMed({...newMed,alarmType:at})} style={pill(newMed.alarmType===at)}>{at==="ring"?"🔔 "+t.ring:at==="vibrate"?"📳 "+t.vibrate:"🔔📳 "+t.both}</button>)}</div></div>
    <div style={{display:"flex",gap:6,marginBottom:6,alignItems:"center"}}><span style={{fontSize:fs-2,color:mt}}>💊 {lang==="tr"?"Kutu adedi":"Box count"}:</span><input type="number" min="1" value={newMed.count} onChange={e=>setNewMed({...newMed,count:Number(e.target.value)})} style={{...IS,width:70,textAlign:"center",fontWeight:700}}/></div>
    <div style={{display:"flex",gap:8}}><button onClick={()=>{if(newMed.name){setMeds(p=>[...p,{id:Date.now(),...newMed,taken:false}]);notify(`💊⏰ ${newMed.name} — ${t.alarmSet} (${newMed.time})${newMed.count?` • ${newMed.count} ${lang==="tr"?"adet":"pcs"}`:""}`);setNewMed({name:"",dose:"",time:"",alarmType:"both",count:30});setShowAddMed(false);}}} style={BP}>{t.save}</button><button onClick={()=>setShowAddMed(false)} style={{...BP,background:mt}}>{t.cancel}</button></div>
  </div>}
  <div style={{...CS,border:`2px dashed ${ac}33`}}><div style={{fontWeight:700,marginBottom:8}}>🔍 {t.drugR}</div><div style={{display:"flex",gap:8}}><input placeholder={t.drugN} value={drugQ} onChange={e=>setDrugQ(e.target.value)} style={{...IS,flex:1}} onKeyDown={e=>{if(e.key==="Enter")analyzeDrug();}}/><button onClick={analyzeDrug} disabled={drugLoad} style={BP}>{drugLoad?"⏳":t.anlz}</button></div>{drugRes&&<div style={{marginTop:10,display:"flex",flexDirection:"column",gap:5}}>{[[t.cls,"class"],[t.usg,"usage"],[t.dose,"dose"],[t.sEff,"sideEffects"],[t.wrn,"warnings"],[t.intr,"interactions"]].map(([l,k])=><div key={k} style={{fontSize:fs-1}}><span style={{fontWeight:700,color:ac}}>{l}: </span><span>{drugRes[k]}</span></div>)}</div>}</div>
</div>);

// Settings with tab filtering
const renderSettings=()=>{const s=settingsTab;const all=s==="all";return(<div style={{display:"flex",flexDirection:"column",gap:10}}>
  {!all&&<button onClick={()=>setSettingsTab("all")} style={{background:"none",border:"none",color:ac,cursor:"pointer",fontSize:fs,textAlign:"left",padding:0}}>← {t.settings}</button>}
  {all&&<span style={{fontWeight:700,fontSize:fs+2}}>⚙️ {t.settings}</span>}
  {(all||s==="all")&&<>{[{l:`🌙 ${t.dark}`,v:dark,f:()=>setDark(!dark)},{l:`🔆 ${t.hc}`,v:hc,f:()=>setHc(!hc)}].map(x=>(<div key={x.l} style={{...CS,display:"flex",justifyContent:"space-between",alignItems:"center"}}><span>{x.l}</span><button onClick={x.f} style={{width:48,height:26,borderRadius:13,background:x.v?ac:bd,border:"none",cursor:"pointer",position:"relative"}}><div style={{width:20,height:20,borderRadius:"50%",background:"#fff",position:"absolute",top:3,left:x.v?25:3,transition:"left .2s"}}/></button></div>))}
  <div style={CS}><div style={{marginBottom:6}}>📝 {t.fSize}: {fs}</div><div style={{display:"flex",gap:8}}>{[12,13,14,16,18].map(sz=><button key={sz} onClick={()=>setFs(sz)} style={pill(fs===sz)}>{sz}</button>)}</div></div>
  <div style={CS}><div style={{marginBottom:6}}>🌍 {t.lang}</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:4}}>{Object.entries(LL).map(([k,v])=><button key={k} onClick={()=>setLang(k)} style={pill(lang===k)}>{v}</button>)}</div></div>
  <div style={CS}><div style={{fontWeight:700,marginBottom:8}}>🚨 {t.emN}</div>{emNums.map(en=>(<div key={en.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px 0",borderBottom:`1px solid ${bd}`}}><span>{en.icon} {en.name} — <strong>{en.number}</strong></span>{!en.fixed&&<button onClick={()=>setEmNums(p=>p.filter(x=>x.id!==en.id))} style={{background:"none",border:"none",color:dg,cursor:"pointer"}}>✕</button>}</div>))}{emNums.filter(e=>!e.fixed).length<5&&<div style={{display:"flex",gap:6,marginTop:8}}><input placeholder={t.nm} value={newEm.name} onChange={e=>setNewEm({...newEm,name:e.target.value})} style={{...IS,flex:1}}/><input placeholder="Nr" value={newEm.number} onChange={e=>setNewEm({...newEm,number:e.target.value})} style={{...IS,width:80}}/><button onClick={()=>{if(newEm.name&&newEm.number){setEmNums(p=>[...p,{id:Date.now(),...newEm,icon:"📞",fixed:false}]);setNewEm({name:"",number:""});}}} style={{...BP,padding:"8px 14px"}}>+</button></div>}</div></>}
  {(all||s==="perms")&&<div style={CS}><div style={{fontWeight:700,marginBottom:8}}>🔒 {t.permissions}</div>{[["notif","notifPerm","🔔"],["loc","locPerm","📍"],["mic","micPerm","🎤"],["cam","camPerm","📷"]].map(([k,label,icon])=>(<div key={k} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"4px 0"}}><span>{icon} {t[label]||label}</span><button onClick={()=>setPerms(p=>({...p,[k]:!p[k]}))} style={{width:40,height:22,borderRadius:11,background:perms[k]?sc:bd,border:"none",cursor:"pointer",position:"relative"}}><div style={{width:16,height:16,borderRadius:"50%",background:"#fff",position:"absolute",top:3,left:perms[k]?21:3,transition:"left .2s"}}/></button></div>))}</div>}
  {(all||s==="subs")&&<div style={CS}><div style={{fontWeight:700,marginBottom:8}}>💎 {t.subscription}</div>
    {[
{n:t.free,p:"$0",d:t.freePlan,c:sc,active:true},
{n:"PRO "+(lang==="tr"?"Aylık":"Monthly"),p:"$4.99/"+t.monthly,d:t.premPlan,c:ac,active:false},
{n:"PRO "+(lang==="tr"?"Yıllık":"Yearly"),p:"$44.99/"+(lang==="tr"?"yıl":"yr"),d:(lang==="tr"?"⚡ %25 İndirim! Yıllık tek ödeme":"⚡ 25% Off! Annual single payment"),c:"#e8a817",active:false,badge:lang==="tr"?"EN POPÜLER":"BEST VALUE"},
{n:"PRO "+(lang==="tr"?"Paylaşımlı":"Shared"),p:"",d:(lang==="tr"?"2 Kişi: $77.99/yıl • 3 Kişi: $119.99/yıl • 5 Kişi: $194.99/yıl • 10 Kişi: $344.99/yıl":"2 Users: $77.99/yr • 3 Users: $119.99/yr • 5 Users: $194.99/yr • 10 Users: $344.99/yr"),c:"#e8a817",active:false},
{n:(lang==="tr"?"Kurumsal Aylık":"Enterprise Monthly"),p:"$12.99/"+t.monthly,d:t.entPlan,c:a2,active:false},
{n:(lang==="tr"?"Kurumsal Yıllık":"Enterprise Yearly"),p:"$116.99/"+(lang==="tr"?"yıl":"yr"),d:(lang==="tr"?"⚡ %25 İndirim! Yıllık tek ödeme":"⚡ 25% Off! Annual single payment"),c:a2,active:false}
].map(plan=>(<div key={plan.n} style={{padding:"8px 10px",borderRadius:10,border:`1px solid ${plan.c}33`,marginBottom:6,background:`${plan.c}08`}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontWeight:700,color:plan.c}}>{plan.n}{plan.badge&&<span style={{marginLeft:6,fontSize:fs-4,padding:"1px 6px",borderRadius:4,background:plan.c,color:"#fff",fontWeight:700}}>{plan.badge}</span>}</span><div style={{display:"flex",alignItems:"center",gap:6}}>{!plan.active&&<span style={{fontSize:fs-3,padding:"2px 8px",borderRadius:8,background:`${mt}22`,color:mt,fontWeight:600}}>{lang==="tr"?"Yakında":"Coming Soon"}</span>}<span style={{fontWeight:700}}>{plan.p}</span></div></div><div style={{fontSize:fs-2,color:mt,marginTop:2}}>{plan.d}</div>{plan.active&&<div style={{fontSize:fs-3,color:sc,marginTop:4,fontWeight:600}}>✓ {lang==="tr"?"Aktif Plan":"Active Plan"}</div>}</div>))}
  </div>}
  {(all||s==="trash")&&<div style={CS}><div style={{fontWeight:700,marginBottom:8}}>🗑️ {t.trash}</div><div style={{display:"flex",gap:8,marginBottom:8}}>{[30,60,90].map(d=><button key={d} onClick={()=>setTrashDays(d)} style={pill(trashDays===d)}>{d} {t.trD}</button>)}</div>{trashItems.length===0&&<div style={{color:mt,textAlign:"center",padding:12}}>🗑️ {t.trE}</div>}{trashItems.map(item=>(<div key={item.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px 0",borderBottom:`1px solid ${bd}`,opacity:.7}}><span style={{fontSize:fs-1}}>{item.name||item.title||item.doctor||item.content?.substring(0,20)||"—"}</span><button onClick={()=>restoreItem(item)} style={{...BP,padding:"4px 10px",fontSize:fs-2}}>{t.rest}</button></div>))}{trashItems.length>0&&<button onClick={()=>setTrashItems([])} style={{...BD,width:"100%",marginTop:8}}>{t.empT}</button>}</div>}
  {(all||s==="legal")&&<div style={CS}><div style={{fontWeight:700,marginBottom:6}}>⚖️ {t.legal}</div><div style={{fontSize:fs-2,color:mt,lineHeight:1.4}}>{t.legalText}</div></div>}
  {all&&<div style={CS}><div style={{fontWeight:700,marginBottom:4}}>ℹ️ {t.about}</div><div style={{fontSize:fs-2,color:mt}}>{t.version}: 9.0.0</div><div style={{fontSize:fs-2,color:mt}}>© 2025-2026 AILVIE Health Technologies</div></div>}
</div>);};

// Simplified page renders for health, pCard, notes, contacts, community, chat (same logic as v5)
const renderHealth=()=>(<div style={{display:"flex",flexDirection:"column",gap:10}}><span style={{fontWeight:700,fontSize:fs+2}}>📊 {t.health}</span>{bmi>0&&<div style={CS}><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontWeight:700,fontSize:fs+1}}>BMI</span><span style={{fontSize:fs+6,fontWeight:800,color:bmi>=18.5&&bmi<25?sc:dg}}>{bmi}</span></div><div style={{height:8,borderRadius:4,background:`linear-gradient(90deg,${ac},${sc},#e9c46a,${dg})`,marginTop:8,position:"relative"}}><div style={{position:"absolute",left:`${Math.min(100,Math.max(0,((bmi-10)/35)*100))}%`,top:-4,width:16,height:16,borderRadius:"50%",background:"#fff",border:`3px solid ${ac}`,transform:"translateX(-50%)"}}/></div></div>}<HField icon="❤️" label={t.pulse} field="pulse" unit={t.bpm}/><HField icon="⚖️" label={t.wt} field="weight" unit={t.kg}/><HField icon="📏" label={t.ht} field="height" unit={t.cm}/><div style={CS}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}><span style={{fontSize:22}}>🩺</span><span style={{fontWeight:700,fontSize:fs+1}}>{t.bp}</span></div><div style={{display:"flex",gap:10,alignItems:"center"}}><input type="number" value={hd.bpS||""} placeholder="SYS" onChange={e=>setHd({...hd,bpS:Number(e.target.value)})} style={{...IS,width:70,textAlign:"center",fontWeight:700}}/><span style={{fontSize:20,color:mt}}>/</span><input type="number" value={hd.bpD||""} placeholder="DIA" onChange={e=>setHd({...hd,bpD:Number(e.target.value)})} style={{...IS,width:70,textAlign:"center",fontWeight:700}}/>{hd.bpS>0&&<span style={{padding:"4px 10px",borderRadius:8,fontSize:fs-2,fontWeight:600,background:hd.bpS>=90&&hd.bpS<=140?`${sc}22`:`${dg}22`,color:hd.bpS>=90&&hd.bpS<=140?sc:dg}}>{hd.bpS>=90&&hd.bpS<=140?t.norm:t.caut}</span>}</div></div></div>);

const renderPCard=()=>(<div style={{display:"flex",flexDirection:"column",gap:10}}><span style={{fontWeight:700,fontSize:fs+2}}>🪪 {t.pCard}</span><div style={CS}>{[["fName","name","text"],["bDate","birthDate","date"],["bType","bloodType","text"],["allrg","allergies","text"],["chron","chronic","text"],["insu","insu","text"],["emCon","emContact","text"],["","emPhone","tel"]].map(([label,field,type])=>(<div key={field} style={{marginBottom:8}}><div style={{fontSize:fs-2,color:mt,marginBottom:2}}>{t[label]||field}{field==="birthDate"&&patAge?` (${patAge} ${t.age})`:""}</div><input type={type} value={pat[field]||""} onChange={e=>setPat(p=>({...p,[field]:e.target.value}))} placeholder={t[label]||field} style={{...IS,padding:"8px 10px"}}/></div>))}</div><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontWeight:700}}>{t.diag} / {t.lab}</span><button onClick={()=>setShowAddRec(true)} style={{...BP,padding:"6px 14px"}}>+ {t.add}</button></div>{records.map(r=>(<div key={r.id} style={CS}><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontWeight:700,color:ac}}>{t[r.type]||r.type}</span><span style={{fontSize:fs-2,color:mt}}>{r.date}</span></div><div style={{fontSize:fs-1,color:mt}}>{r.doctor} — {r.hospital}</div><div style={{marginTop:4}}>{r.content}</div><button onClick={()=>toTrash("record",r)} style={{background:"none",border:"none",color:dg,cursor:"pointer",fontSize:13,marginTop:4}}>🗑️ {t.del}</button></div>))}{showAddRec&&<div style={{...CS,border:`2px solid ${ac}`}}><select value={newRec.type} onChange={e=>setNewRec({...newRec,type:e.target.value})} style={{...IS,marginBottom:6}}>{["diag","xray","mri","ultra","lab","surg"].map(rt=><option key={rt} value={rt}>{t[rt]||rt}</option>)}</select><input placeholder={t.dr} value={newRec.doctor} onChange={e=>setNewRec({...newRec,doctor:e.target.value})} style={{...IS,marginBottom:6}}/><input placeholder={t.hosp} value={newRec.hospital} onChange={e=>setNewRec({...newRec,hospital:e.target.value})} style={{...IS,marginBottom:6}}/><input type="date" value={newRec.date} onChange={e=>setNewRec({...newRec,date:e.target.value})} style={{...IS,marginBottom:6}}/><textarea placeholder="İçerik / Sonuç" value={newRec.content} onChange={e=>setNewRec({...newRec,content:e.target.value})} onInput={autoResize} rows={3} style={{...IS,marginBottom:6,resize:"vertical"}}/><div style={{display:"flex",gap:6}}><button onClick={()=>{if(newRec.content){setRecords(p=>[...p,{id:Date.now(),...newRec}]);setNewRec({type:"diag",doctor:"",hospital:"",date:"",content:"",notes:""});setShowAddRec(false);}}} style={BP}>{t.save}</button><button onClick={()=>setShowAddRec(false)} style={{...BP,background:mt}}>{t.cancel}</button></div></div>}</div>);

const renderNotes=()=>{const sorted=[...notes].sort((a,b)=>(b.pinned?1:0)-(a.pinned?1:0));return(<div style={{display:"flex",flexDirection:"column",gap:10}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontWeight:700,fontSize:fs+2}}>📝 {t.notes}</span><button onClick={()=>setNotes(p=>[{id:Date.now(),title:"",content:"",color:NCOL[Math.floor(Math.random()*8)],pinned:false},...p])} style={{...BP,padding:"7px 14px"}}>+ {t.nNote}</button></div>{sorted.length===0&&<div style={{textAlign:"center",color:mt,padding:24}}>{t.noN}</div>}<div style={{display:"grid",gridTemplateColumns:"1fr",gap:8}}>{sorted.map(n=>(<div key={n.id} style={{background:dark?n.color+"18":n.color,borderRadius:12,padding:10,position:"relative",border:editNote===n.id?"2px solid "+ac:"1px solid "+bd}}>{n.pinned&&<span style={{position:"absolute",top:4,right:6,fontSize:14}}>📌</span>}{editNote===n.id?<div style={{display:"flex",flexDirection:"column",gap:4}}><input value={n.title} onChange={e=>setNotes(p=>p.map(x=>x.id===n.id?{...x,title:e.target.value}:x))} placeholder={t.nNote} style={{...IS,fontWeight:700,background:"transparent",border:"none",padding:0}}/><textarea value={n.content} onChange={e=>setNotes(p=>p.map(x=>x.id===n.id?{...x,content:e.target.value}:x))} rows={Math.max(4,Math.ceil((n.content||"").length/20))} style={{...IS,background:"transparent",border:"none",padding:0,resize:"vertical",minHeight:80,width:"100%",wordBreak:"break-word",overflowWrap:"break-word"}}/><div style={{display:"flex",gap:3,marginTop:4}}>{NCOL.map(c=><button key={c} onClick={()=>setNotes(p=>p.map(x=>x.id===n.id?{...x,color:c}:x))} style={{width:18,height:18,borderRadius:9,background:c,border:n.color===c?"2px solid "+ac:"2px solid transparent",cursor:"pointer"}}/>)}</div><button onClick={()=>{const note=notes.find(x=>x.id===n.id);if(note&&!note.title?.trim()&&!note.content?.trim()){setNotes(p=>p.filter(x=>x.id!==n.id));}setEditNote(null);}} style={{...BP,padding:"4px 10px",marginTop:4}}>✓</button></div>:<div onClick={()=>setEditNote(n.id)} style={{cursor:"pointer"}}><div style={{fontWeight:700,marginBottom:3,color:dark?tc:"#333"}}>{n.title||t.nNote}</div><div style={{fontSize:fs-2,color:dark?mt:"#555",whiteSpace:"pre-wrap"}}>{n.content}</div></div>}<div style={{display:"flex",gap:4,marginTop:6}}><button onClick={()=>setNotes(p=>p.map(x=>x.id===n.id?{...x,pinned:!x.pinned}:x))} style={{background:"none",border:"none",cursor:"pointer",fontSize:14}}>📌</button><button onClick={()=>copyTxt(n.content)} style={{background:"none",border:"none",cursor:"pointer",fontSize:14}}>📋</button><SpeakBtn text={n.content}/><button onClick={()=>toTrash("note",n)} style={{background:"none",border:"none",cursor:"pointer",fontSize:14,color:dg}}>🗑️</button></div></div>))}</div><div style={{fontWeight:700,marginTop:4}}>{t.extA}</div><div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{noteApps.map(a=><a key={a.name} href={a.url} target="_blank" rel="noopener noreferrer" style={{...CS,display:"flex",alignItems:"center",gap:6,textDecoration:"none",color:tc,padding:"8px 12px"}}><span style={{fontSize:18}}>{a.icon}</span><span style={{fontSize:fs-1}}>{a.name}</span></a>)}<button onClick={()=>setShowAddNApp(true)} style={{...CS,border:"2px dashed "+ac+"44",cursor:"pointer",padding:"8px 12px",color:ac}}>+ {t.addApp}</button></div>{showAddNApp&&<div style={{...CS,border:"2px solid "+ac}}><input placeholder="App Name" value={newNApp.name} onChange={e=>setNewNApp({...newNApp,name:e.target.value})} style={{...IS,marginBottom:6}}/><input placeholder="https://..." value={newNApp.url} onChange={e=>setNewNApp({...newNApp,url:e.target.value})} style={{...IS,marginBottom:6}}/><div style={{display:"flex",gap:6}}><button onClick={()=>{if(newNApp.name&&newNApp.url){setNoteApps(p=>[...p,newNApp]);setNewNApp({name:"",url:"",icon:"📱"});setShowAddNApp(false);}}} style={BP}>{t.save}</button><button onClick={()=>setShowAddNApp(false)} style={{...BP,background:mt}}>{t.cancel}</button></div></div>}</div>);};

const renderContacts=()=>{const filtered=catF==="all"?contacts:contacts.filter(c=>c.category===catF);return(<div style={{display:"flex",flexDirection:"column",gap:10}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontWeight:700,fontSize:fs+2}}>📞 {t.contacts}</span><button onClick={()=>setShowAddC(true)} style={{...BP,padding:"7px 14px"}}>+ {t.add}</button></div><div style={{display:"flex",gap:6}}>{["all","doctor","taxi","special","emergency"].map(k=><button key={k} onClick={()=>setCatF(k)} style={pill(catF===k)}>{k==="all"?"🏠":k==="doctor"?"👨‍⚕️":k==="taxi"?"🚕":k==="special"?"⭐":"🚨"}</button>)}</div><div style={{...CS,background:`${dg}08`,border:`1px solid ${dg}22`}}><div style={{fontWeight:700,color:dg,marginBottom:6}}>🚨 {t.emN}</div><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{emNums.slice(0,5).map(en=><a key={en.id} href={`tel:${en.number}`} style={{padding:"5px 10px",borderRadius:8,background:`${dg}15`,color:dg,fontWeight:700,textDecoration:"none",fontSize:fs}}>{en.icon} {en.number}</a>)}</div></div>{filtered.length===0&&<div style={{textAlign:"center",color:mt,padding:20}}>{t.noC}</div>}{filtered.map(c=>(<div key={c.id} style={{...CS,display:"flex",alignItems:"center",gap:10}}><div style={{width:40,height:40,borderRadius:"50%",background:`${ac}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:700,color:ac}}>{c.name[0]}</div><div style={{flex:1}}><div style={{fontWeight:700}}>{c.name}</div><div style={{fontSize:fs-2,color:mt}}>{c.phone}</div></div><a href={`tel:${c.phone}`} style={{fontSize:22,textDecoration:"none"}}>📞</a><button onClick={()=>toTrash("contact",c)} style={{background:"none",border:"none",color:dg,cursor:"pointer",fontSize:14}}>🗑️</button></div>))}{showAddC&&<div style={{...CS,border:`2px solid ${ac}`}}><input placeholder={t.nm} value={newC.name} onChange={e=>setNewC({...newC,name:e.target.value})} style={{...IS,marginBottom:6}}/><input placeholder="Phone" value={newC.phone} onChange={e=>setNewC({...newC,phone:e.target.value})} style={{...IS,marginBottom:6}}/><select value={newC.category} onChange={e=>setNewC({...newC,category:e.target.value})} style={{...IS,marginBottom:6}}><option value="doctor">👨‍⚕️</option><option value="taxi">🚕</option><option value="special">⭐</option><option value="emergency">🚨</option></select><div style={{display:"flex",gap:6}}><button onClick={()=>{if(newC.name&&newC.phone){setContacts(p=>[...p,{id:Date.now(),...newC}]);setNewC({name:"",phone:"",category:"doctor",note:""});setShowAddC(false);}}} style={BP}>{t.save}</button><button onClick={()=>setShowAddC(false)} style={{...BP,background:mt}}>{t.cancel}</button></div></div>}</div>);};

const renderCommunity=()=>(<div style={{display:"flex",flexDirection:"column",gap:10}}><span style={{fontWeight:700,fontSize:fs+2}}>👥 {t.community}</span><div style={{padding:"6px 12px",borderRadius:10,background:`${dg}08`,fontSize:fs-1,color:dg}}>{t.warn}</div><div style={{display:"flex",flexDirection:"column",gap:8,maxHeight:"none",overflowY:"visible"}}>{msgs.map(m=>(<div key={m.id} style={CS}><div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontWeight:700,color:ac}}>{m.user}</span><span style={{fontSize:fs-2,color:mt}}>{m.time}</span></div><div style={{marginBottom:6,wordBreak:"break-word",overflowWrap:"break-word"}}>{m.text}</div><div style={{display:"flex",gap:6}}><button onClick={()=>setMsgs(p=>p.map(x=>x.id===m.id?{...x,likes:[...(x.likes_arr||[]),pat.name||"Ben"].length}:x))} style={{background:"none",border:`1px solid ${bd}`,borderRadius:8,padding:"4px 8px",cursor:"pointer",color:tc}}>❤️ {m.likes}</button><button onClick={()=>copyTxt(m.text)} style={{background:"none",border:`1px solid ${bd}`,borderRadius:8,padding:"4px 8px",cursor:"pointer"}}>📋</button><SpeakBtn text={m.text}/>{(m.user===(pat.name||"Ben"))&&<><button onClick={()=>{const nv=prompt(lang==="tr"?"Mesajı düzenle:":"Edit message:",m.text);if(nv!==null)setMsgs(p=>p.map(x=>x.id===m.id?{...x,text:nv,edited:true}:x));}} style={{background:"none",border:`1px solid ${ac}33`,borderRadius:8,padding:"4px 8px",cursor:"pointer",fontSize:12,color:ac}}>✏️</button><button onClick={()=>setMsgs(p=>p.filter(x=>x.id!==m.id))} style={{background:"none",border:`1px solid ${dg}33`,borderRadius:8,padding:"4px 8px",cursor:"pointer",fontSize:12,color:dg}}>🗑️</button></>}</div></div>))}</div><div style={{display:"flex",gap:6,position:"relative"}}><MicBtn onResult={v=>setMsgIn(v)}/><button onClick={()=>setShowEmoji(!showEmoji)} style={{...BP,padding:"8px 12px",fontSize:18}}>😊</button><input value={msgIn} onChange={e=>setMsgIn(e.target.value)} placeholder={t.wr} style={{...IS,flex:1}} onKeyDown={e=>{if(e.key==="Enter"&&msgIn.trim()){setMsgs(p=>[...p,{id:Date.now(),user:pat.name||"Ben",text:msgIn,likes:0,time:now.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}]);setMsgIn("");}}}/><button onClick={()=>{if(msgIn.trim()){setMsgs(p=>[...p,{id:Date.now(),user:pat.name||"Ben",text:msgIn,likes:0,time:now.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}]);setMsgIn("");}}} style={BP}>{t.send}</button>{showEmoji&&<EmojiPicker onPick={e=>setMsgIn(p=>p+e)} onClose={()=>setShowEmoji(false)}/>}</div></div>);

const q1Dynamic=pat.name?`${pat.name.split(" ")[0]}, ${t.q1.toLowerCase()} ${lang==="tr"?"Umarım iyisindir 💙":"Hope you are well 💙"}`:t.q1;
const renderChat=()=>(<div style={{display:"flex",flexDirection:"column",gap:8,height:"100%"}}><div style={{display:"flex",gap:6,overflowX:"auto",flexShrink:0}}>{[q1Dynamic,t.q2,t.q3].map(q=><button key={q} onClick={()=>sendChat(q)} style={pill(false)}>{q}</button>)}</div><div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:8,minHeight:180}}>{chatM.length===0&&<div style={{...CS,background:`${ac}08`,textAlign:"center",padding:20}}><Avatar s={48}/><div style={{marginTop:8}}>{t.greet}</div></div>}{chatM.map((m,i)=>(<div key={i} style={{...CS,maxWidth:"85%",alignSelf:m.role==="user"?"flex-end":"flex-start",background:m.role==="user"?`linear-gradient(135deg,${ac},${a2})`:cd,color:m.role==="user"?"#fff":tc}}>{m.role==="assistant"&&<div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}><Avatar s={22}/><span style={{fontSize:fs-2,color:ac,fontWeight:700}}>AILVIE</span></div>}<div style={{whiteSpace:"pre-wrap",wordBreak:"break-word",overflowWrap:"break-word"}}>{m.text}</div><div style={{display:"flex",gap:6,marginTop:6}}>{m.role==="assistant"&&<><button onClick={()=>copyTxt(m.text)} style={{background:"none",border:`1px solid ${bd}`,borderRadius:8,padding:"4px 8px",cursor:"pointer",fontSize:12,color:tc}}>📋</button><SpeakBtn text={m.text}/></>}<button onClick={()=>setChatM(p=>p.filter((_,j)=>j!==i))} style={{background:"none",border:`1px solid ${dg}33`,borderRadius:8,padding:"4px 8px",cursor:"pointer",fontSize:12,color:dg}}>🗑️</button></div></div>))}{chatL&&<div style={{...CS,alignSelf:"flex-start"}}><span style={{animation:"pulse 1s infinite"}}>● </span><span style={{animation:"pulse 1s infinite .2s"}}>● </span><span style={{animation:"pulse 1s infinite .4s"}}>●</span></div>}</div><div style={{display:"flex",gap:6,flexShrink:0,position:"relative"}}><MicBtn onResult={v=>setChatIn(v)}/><button onClick={()=>setShowEmoji(!showEmoji)} style={{...BP,padding:"8px 12px",fontSize:18}}>😊</button><input value={chatIn} onChange={e=>setChatIn(e.target.value)} placeholder={t.wr} style={{...IS,flex:1}} onKeyDown={e=>{if(e.key==="Enter")sendChat();}}/><button onClick={()=>sendChat()} disabled={chatL} style={BP}>{t.send}</button>{showEmoji&&<EmojiPicker onPick={e=>setChatIn(p=>p+e)} onClose={()=>setShowEmoji(false)}/>}</div></div>);

// Privacy Policy page
const renderPrivacy=()=>(<div style={{display:"flex",flexDirection:"column",gap:10}}>
  <div style={{display:"flex",alignItems:"center",gap:8}}><button onClick={()=>goTo("settings")} style={{background:"none",border:"none",color:ac,cursor:"pointer",fontSize:20}}>←</button><span style={{fontWeight:700,fontSize:fs+2}}>📜 {t.privPolicy}</span></div>
  <div style={CS}><div style={{fontSize:fs-1,color:tc,lineHeight:1.6}}>
    <p style={{marginBottom:8}}><strong>AILVIE {t.privPolicy}</strong></p>
    <p style={{marginBottom:8}}>{lang==="tr"?"AILVIE, kullanıcı verilerini gizlilik ve güvenlik çerçevesinde işler. Kişisel sağlık bilgileriniz yalnızca cihazınızda saklanır ve üçüncü taraflarla paylaşılmaz.":"AILVIE processes user data within a privacy and security framework. Your personal health data is stored only on your device and is not shared with third parties."}</p>
    <p style={{marginBottom:8}}>{lang==="tr"?"• Verileriniz şifrelenerek saklanır\n• Üçüncü taraf veri paylaşımı yapılmaz\n• İstediğiniz zaman verilerinizi silebilirsiniz\n• AI sohbetleri sunucularda saklanmaz\n• Konum verisi yalnızca izninizle kullanılır":"• Your data is stored encrypted\n• No third-party data sharing\n• You can delete your data anytime\n• AI chats are not stored on servers\n• Location data used only with your permission"}</p>
    <p style={{marginBottom:8}}>{lang==="tr"?"Son güncelleme: Mart 2026":"Last updated: March 2026"}</p>
  </div></div>
</div>);

// Terms of Service page
const renderTerms=()=>(<div style={{display:"flex",flexDirection:"column",gap:10}}>
  <div style={{display:"flex",alignItems:"center",gap:8}}><button onClick={()=>goTo("settings")} style={{background:"none",border:"none",color:ac,cursor:"pointer",fontSize:20}}>←</button><span style={{fontWeight:700,fontSize:fs+2}}>📋 {t.terms}</span></div>
  <div style={CS}><div style={{fontSize:fs-1,color:tc,lineHeight:1.6}}>
    <p style={{marginBottom:8}}><strong>AILVIE {t.terms}</strong></p>
    <p style={{marginBottom:8}}>{lang==="tr"?"1. AILVIE bir tıbbi teşhis aracı değildir. Verilen bilgiler yalnızca bilgilendirme amaçlıdır.\n2. AI yanıtları hatalı olabilir. Sağlık kararları için mutlaka doktora danışın.\n3. Kullanıcı, girdiği verilerden sorumludur.\n4. AILVIE, AI kaynaklı hatalardan doğan zararlardan hukuken sorumlu tutulamaz.\n5. Uygulama, kullanıcı verilerini üçüncü taraflarla paylaşmaz.\n6. Abonelik iptali istediğiniz zaman yapılabilir.":"1. AILVIE is not a medical diagnosis tool.\n2. AI responses may contain errors. Consult a doctor.\n3. Users are responsible for data they enter.\n4. AILVIE is not legally liable for AI errors.\n5. The app does not share data with third parties.\n6. Subscription can be cancelled anytime."}</p>
    <p style={{marginBottom:8}}>{lang==="tr"?"Son güncelleme: Mart 2026":"Last updated: March 2026"}</p>
  </div></div>
</div>);

// About page
const renderAbout=()=>(<div style={{display:"flex",flexDirection:"column",gap:10}}>
  <div style={{display:"flex",alignItems:"center",gap:8}}><button onClick={()=>goTo("settings")} style={{background:"none",border:"none",color:ac,cursor:"pointer",fontSize:20}}>←</button><span style={{fontWeight:700,fontSize:fs+2}}>ℹ️ {t.about}</span></div>
  <div style={{...CS,textAlign:"center",padding:20}}>
    <img src="/avatar2.svg" alt="" style={{height:80,objectFit:"contain",marginTop:8}} />
    <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:32,color:"#e8a817",letterSpacing:4,WebkitTextStroke:"0.8px #e8a817",marginTop:10}}>AILVIE</div>
    <div style={{fontSize:fs-1,color:mt,marginTop:2}}>{t.sl}</div>
    <div style={{fontSize:fs-1,color:mt,marginTop:8}}>{t.version}: 9.0.0</div>
    <div style={{fontSize:fs-1,color:mt}}>© 2025-2026 AILVIE Health Technologies</div>
    <div style={{marginTop:12,padding:"8px 12px",borderRadius:8,background:`${ac}11`,fontSize:fs-2,color:ac}}>
      {lang==="tr"?"9 dil • 23 ilaç DB • AI sohbet • Hasta karnesi • KVKK/GDPR uyumlu • Her PRO = TEGV bağışı":"9 languages • 23 drug DB • AI chat • Patient card • GDPR compliant • Every PRO = TEGV donation"}
    </div>
  </div>
  <div style={CS}><div style={{fontSize:fs-1,color:tc,lineHeight:1.6}}>
    {lang==="tr"?"AILVIE, yapay zeka destekli kişisel sağlık asistanı uygulamasıdır. Hastaların günlük sağlık takibini kolaylaştırmak, ilaç hatırlatmaları yapmak ve sağlık bilgilerini güvenli şekilde saklamak amacıyla geliştirilmiştir.":"AILVIE is an AI-powered personal health assistant app designed to help patients manage their daily health, receive medication reminders, and securely store health information."}
  </div></div>
</div>);


// ═══ ADMIN SUPPORT CHANNEL ═══
const renderAdmin=()=>(<div style={{display:"flex",flexDirection:"column",gap:8,height:"100%"}}>
  <div style={{display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
    <div style={{width:36,height:36,borderRadius:12,background:`linear-gradient(135deg,#f59e0b,#f97316)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>💬</div>
    <div><div style={{fontWeight:700,fontSize:fs+1}}>{t.adminCh}</div><div style={{fontSize:fs-2,color:sc}}>● Online</div></div>
  </div>
  <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:8,minHeight:180}}>
    {adminMsgs.length===0&&<div style={{...CS,background:`${ac}08`,textAlign:"center",padding:20}}><span style={{fontSize:40}}>💬</span><div style={{marginTop:8,color:mt}}>{t.adminWelcome||"Merhaba! Size nasıl yardımcı olabilirim?"}</div></div>}
    {adminMsgs.map((m,i)=>(<div key={i} style={{...CS,maxWidth:"85%",alignSelf:m.from==="user"?"flex-end":"flex-start",background:m.from==="user"?`linear-gradient(135deg,#f59e0b,#f97316)`:cd,color:m.from==="user"?"#fff":tc,animation:"slideD .3s"}}><div style={{whiteSpace:"pre-wrap",wordBreak:"break-word",overflowWrap:"break-word",fontSize:fs}}>{m.text}{m.edited&&<span style={{fontSize:fs-4,color:mt,marginLeft:4}}>(düzenlendi)</span>}</div><div style={{display:"flex",gap:4,marginTop:3}}>{m.from==="user"&&<button onClick={()=>setAdminMsgs(p=>p.filter(x=>x!==m))} style={{background:"none",border:"none",fontSize:11,color:dg,cursor:"pointer",padding:0}}>🗑️</button>}</div><div style={{fontSize:fs-3,color:m.from==="user"?"rgba(255,255,255,.7)":mt,marginTop:4}}>{m.time}</div></div>))}
  </div>
  <div style={{display:"flex",gap:6,flexShrink:0}}>
    <textarea value={adminIn} onChange={e=>setAdminIn(e.target.value)} onInput={autoResize} placeholder={t.wr} style={{...IS,flex:1,minHeight:36,maxHeight:150,resize:"none",overflowY:"auto"}} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();if(adminIn.trim()){setAdminMsgs(p=>[...p,{from:"user",text:adminIn.trim(),time:now.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}]);const msg=adminIn.trim();setAdminIn("");setAdminMsgs(p=>[...p,{from:"system",text:(lang==="tr"?"✅ Mesajınız kaydedildi. AILVIE ekibi en kısa sürede yanıt verecektir.":"✅ Message saved. AILVIE team will respond shortly."),time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}]);}}}}/>
    <button onClick={()=>{if(adminIn.trim()){setAdminMsgs(p=>[...p,{from:"user",text:adminIn.trim(),time:now.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}]);const msg=adminIn.trim();setAdminIn("");setAdminMsgs(p=>[...p,{from:"system",text:(lang==="tr"?"✅ Mesajınız kaydedildi. AILVIE ekibi en kısa sürede yanıt verecektir.":"✅ Message saved. AILVIE team will respond shortly."),time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}]);}}} style={{...BP,background:`linear-gradient(135deg,#f59e0b,#f97316)`,padding:"8px 14px"}}>{t.send}</button>
  </div>
</div>);

const pages={home:renderHome,medTime:renderMedTime,admin:renderAdmin,meds:renderMeds,appts:renderAppts,health:renderHealth,pCard:renderPCard,notes:renderNotes,contacts:renderContacts,community:renderCommunity,chat:renderChat,settings:renderSettings,privacy:renderPrivacy,terms:renderTerms,about:renderAbout};

// ═══ RESTRUCTURED NAV — 2 rows only ═══
const nav1=[{key:"contacts",icon:"📞",label:t.contacts},{key:"meds",icon:"💊",label:t.meds},{key:"appts",icon:"📅",label:t.appts},{key:"health",icon:"📊",label:t.health}];
const nav2=[{key:"pCard",icon:"🪪",label:t.pCard},{key:"notes",icon:"📝",label:t.notes},{key:"community",icon:"👥",label:t.community},{key:"chat",icon:"🤖",label:t.chat},{key:"admin",icon:"💬",label:t.adminCh||"Destek"},{key:"settings",icon:"⚙️",label:t.settings,onNav:()=>setSettingsTab("all")}];

return (
  <div style={{width:"100%",maxWidth:480,margin:"0 auto",height:"100dvh",display:"flex",flexDirection:"column",overflow:"hidden",background:bg,fontSize:fs,color:tc,fontFamily:"'SF Pro Display',-apple-system,'Segoe UI',system-ui,sans-serif",direction:rtl?"rtl":"ltr",position:"relative"}}>
        {/* HEADER */}
        <div style={{background:`linear-gradient(135deg,${ac},${a2})`,padding:"2px 10px",paddingTop:"max(env(safe-area-inset-top),2px)",display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
          <div style={{display:"flex",alignItems:"flex-end",gap:6,flex:1,minWidth:0}}>
            <button onClick={()=>setShowMenu(true)} style={{background:"none",border:"none",color:"#fff",fontSize:22,cursor:"pointer",padding:0,flexShrink:0,alignSelf:"center"}}>☰</button>
            <img src="/avatar2.svg" alt="" style={{height:54,width:54,objectFit:"cover",flexShrink:0,borderRadius:6}} />
            <div style={{display:"flex",flexDirection:"column",justifyContent:"flex-end",lineHeight:1,minWidth:0}}>
              <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:22,color:"#e8a817",letterSpacing:3,WebkitTextStroke:"0.5px #e8a817",textShadow:"0 1px 4px rgba(0,0,0,0.3)"}}>AILVIE</div>
              <div style={{fontSize:9,color:"rgba(255,255,255,0.85)",letterSpacing:1,fontWeight:500,marginTop:1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{t.sl}</div>
            </div>
          </div>
          <div style={{display:"flex",gap:5,alignItems:"center",flexShrink:0}}>
            {/* Home button moved here */}
            <button onClick={goBack} style={{background:"none",border:"none",color:histIdx>0?"#e8a817":"#ffffff66",fontSize:16,cursor:"pointer",padding:0}}>◀</button>
            <button onClick={goFwd} style={{background:"none",border:"none",color:histIdx<pageHist.length-1?"#e8a817":"#ffffff66",fontSize:16,cursor:"pointer",padding:0}}>▶</button>
            <button onClick={()=>{const newState=!voiceActive;setVoiceActive(newState);
            if(newState){
              speak((t.voiceOn||"Sesli Diyalog")+" ON");
              setTimeout(()=>{if(page!=="chat")goTo("chat");setTimeout(()=>startVoice((txt)=>{setChatIn(txt);sendChat(txt);}),2000);},1000);
              setTimeout(()=>{if(!isListen)startVoice((transcript)=>{goTo("chat");sendChat(transcript);});},1500);
            }else{
              if(window.responsiveVoice)responsiveVoice.cancel();
              if(recRef.current)try{recRef.current.abort();}catch(e){}
              setIsListen(false);
            }}} style={{background:"none",border:"none",color:voiceActive?"#e8a817":"#e8a817",fontSize:20,cursor:"pointer",padding:0,animation:voiceActive?"micPulse 2s infinite":"none",opacity:voiceActive?1:0.8}}>🎙️</button>
            <button onClick={()=>goTo("home")} style={{background:"none",border:"none",color:"#fff",fontSize:20,cursor:"pointer",padding:0}}>🏠</button>
            <button onClick={()=>setDark(!dark)} style={{background:"none",border:"none",color:"#fff",fontSize:18,cursor:"pointer",padding:0}}>{dark?"🌙":"☀️"}</button>
            <button onClick={()=>setShowLangPicker(true)} style={{background:"none",border:"none",color:"#fff",fontSize:18,cursor:"pointer",padding:0,}}>🌏</button>
            <button onClick={()=>setShowNotif(!showNotif)} style={{background:"none",border:"none",color:"#fff",fontSize:18,cursor:"pointer",padding:0,position:"relative"}}>🔔{unread>0&&<span style={{position:"absolute",top:-4,right:-6,width:16,height:16,borderRadius:"50%",background:dg,color:"#fff",fontSize:10,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>{unread}</span>}</button>
          </div>
        </div>


        {/* ZOOM CONTROLS */}
        <div style={{position:"absolute",top:62,right:6,zIndex:90,display:"flex",flexDirection:"column",gap:2}}>
          <button onClick={()=>setFs(f=>Math.min(f+1,30))} style={{width:24,height:24,borderRadius:12,background:`${ac}22`,border:`1px solid ${bd}`,color:"#e8a817",fontSize:14,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
          <button onClick={()=>setFs(f=>Math.max(f-1,10))} style={{width:24,height:24,borderRadius:12,background:`${ac}22`,border:`1px solid ${bd}`,color:"#e8a817",fontSize:14,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
          {fs!==15&&<button onClick={()=>setFs(15)} style={{width:24,height:24,borderRadius:12,background:`${ac}44`,border:`1px solid ${bd}`,color:"#e8a817",fontSize:10,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>1x</button>}
        </div>

        {/* LEFT SIDE MENU */}
        {showMenu&&<>
          <div onClick={()=>setShowMenu(false)} style={{position:"absolute",inset:0,background:"rgba(0,0,0,.5)",zIndex:400}}/>
          <div style={{position:"absolute",top:0,left:0,bottom:80,width:"75%",background:cd,zIndex:450,padding:"60px 20px 20px",overflowY:"auto",borderRadius:"0 0 16px 0",boxShadow:"4px 0 20px rgba(0,0,0,.3)"}}>
            <button onClick={()=>setShowMenu(false)} style={{position:"absolute",top:16,right:16,background:"none",border:"none",color:tc,fontSize:22,cursor:"pointer"}}>✕</button>
            {/* Profile */}
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
              <img src="/avatar2.svg" alt="" style={{width:56,height:56,objectFit:"cover",borderRadius:8,flexShrink:0}} />
              <div>
                <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:24,color:"#e8a817",letterSpacing:3,WebkitTextStroke:"0.5px #e8a817",lineHeight:1}}>AILVIE</div>
                <div style={{fontSize:fs-1,color:mt}}>{pat.name||t.profile}</div>
                <div style={{fontSize:fs-2,color:isLoggedIn?sc:mt}}>{isLoggedIn?"● "+t.loggedIn:"○ "+t.loggedOut}</div>
              </div>
            </div>
            {/* Menu Items */}
            {[
              {icon:"👤",label:t.profile,action:()=>{goTo("pCard");setShowMenu(false);}},
              {icon:isLoggedIn?"🚪":"🔑",label:isLoggedIn?t.logout:t.login,action:()=>{setIsLoggedIn(!isLoggedIn);notify(isLoggedIn?t.loggedOut:t.loggedIn);setShowMenu(false);}},
              {icon:"🔒",label:t.permissions,action:()=>{setSettingsTab("perms");goTo("settings");setShowMenu(false);}},
              {icon:"💎",label:t.subscription,action:()=>{setSettingsTab("subs");goTo("settings");setShowMenu(false);}},
              {icon:"🗑️",label:t.trash,action:()=>{setSettingsTab("trash");goTo("settings");setShowMenu(false);}},
              {icon:"⚖️",label:t.legal,action:()=>{setSettingsTab("legal");goTo("settings");setShowMenu(false);}},
              {icon:"📜",label:t.privPolicy,action:()=>{goTo("privacy");setShowMenu(false);}},
              {icon:"📋",label:t.terms,action:()=>{goTo("terms");setShowMenu(false);}},
              {icon:"ℹ️",label:t.about+" — v6.0",action:()=>{goTo("about");setShowMenu(false);}},
              {icon:"⚙️",label:t.settings,action:()=>{setSettingsTab("all");goTo("settings");setShowMenu(false);}},
            ].map((item,idx)=>(
              <button key={idx} onClick={item.action} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 0",background:"none",border:"none",borderBottom:`1px solid ${bd}`,color:tc,cursor:"pointer",width:"100%",textAlign:"left",fontSize:fs}}>
                <span style={{fontSize:20}}>{item.icon}</span>
                <span style={{fontWeight:500}}>{item.label}</span>
              </button>
            ))}
          </div>
        </>}

        {/* Toast */}
        {toast&&<div style={{position:"absolute",top:100,left:"50%",transform:"translateX(-50%)",background:cd,color:tc,padding:"10px 20px",borderRadius:12,boxShadow:"0 6px 24px rgba(0,0,0,.3)",zIndex:300,maxWidth:300,border:`1px solid ${ac}`,fontSize:fs,animation:"slideD .3s ease-out",textAlign:"center"}}>{toast}</div>}

        {/* Content */}
        <div style={{flex:1,overflowY:"auto",overflowX:"hidden",padding:"10px 12px 8px",cursor:"default",WebkitOverflowScrolling:"touch"}} onClick={(e)=>{if(e.target===e.currentTarget){setEditNote(null);setNOpen(false);setShowAddMed(false);setShowAddAppt(false);setShowAddC(false);setShowWordLangPicker(false);setSelDate(null);}}}>{pages[page]?.()}</div>

        {/* Notif Panel */}
        {showNotif&&<div style={{position:"absolute",bottom:86,left:0,right:0,maxHeight:"50%",background:cd,borderRadius:"16px 16px 0 0",boxShadow:"0 -6px 24px rgba(0,0,0,.3)",zIndex:250,padding:"14px 16px",overflowY:"auto"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}><span style={{fontWeight:700}}>🔔 {t.notif}</span><div style={{display:"flex",gap:8}}><button onClick={()=>setNotifs(p=>p.map(n=>({...n,read:true})))} style={{fontSize:fs-2,color:ac,background:"none",border:"none",cursor:"pointer"}}>✓</button><button onClick={()=>setNotifs([])} style={{fontSize:fs-2,color:dg,background:"none",border:"none",cursor:"pointer"}}>✕</button><button onClick={()=>setShowNotif(false)} style={{background:"none",border:"none",fontSize:16,cursor:"pointer",color:tc}}>✕</button></div></div>{notifs.length===0&&<div style={{textAlign:"center",color:mt,padding:16}}>—</div>}{notifs.map(n=><div key={n.id} style={{padding:"6px 0",borderBottom:`1px solid ${bd}`,opacity:n.read?0.4:1}}><div>{n.text}</div><div style={{fontSize:fs-3,color:mt}}>{n.time}</div></div>)}</div>}

        {/* Emergency */}
        {showEmergency&&<div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.75)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setShowEmergency(false)}><div onClick={e=>e.stopPropagation()} style={{background:cd,borderRadius:20,padding:20,width:"85%",maxHeight:"80%",overflowY:"auto"}}><div style={{textAlign:"center",marginBottom:12}}><div style={{fontSize:44}}>🚨</div><h3 style={{margin:0,color:dg}}>{t.emergency}</h3></div>{emNums.map(en=>(<a key={en.id} href={`tel:${en.number}`} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 14px",borderRadius:12,background:`${dg}08`,border:`1px solid ${dg}22`,textDecoration:"none",color:tc,marginBottom:6}}><span style={{fontSize:26}}>{en.icon}</span><div style={{flex:1}}><div style={{fontWeight:700}}>{en.name}</div><div style={{fontSize:fs+2,color:dg,fontWeight:800}}>{en.number}</div></div><span style={{fontSize:22}}>📞</span></a>))}<button onClick={()=>setShowEmergency(false)} style={{...BP,width:"100%",marginTop:8,background:mt}}>{t.cancel}</button></div></div>}

        {/* Language Picker */}
        {showLangPicker&&<div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.4)",zIndex:350}} onClick={()=>setShowLangPicker(false)}><div onClick={e=>e.stopPropagation()} style={{position:"absolute",top:50,right:6,background:cd,borderRadius:14,padding:8,width:210,maxHeight:"80vh",overflowY:"auto",boxShadow:"0 8px 32px rgba(0,0,0,.5)",border:`1px solid ${bd}`}}>
          <div style={{marginBottom:8,fontWeight:700,fontSize:fs,color:ac}}>🌍 {t.lang}</div>
          {Object.entries(LL).map(([k,v])=><button key={k} onClick={()=>{setLang(k);try{localStorage.setItem("ailvie_lang",k);}catch(e){}setShowLangPicker(false);}} style={{display:"flex",alignItems:"center",gap:8,width:"100%",padding:"9px 12px",borderRadius:10,border:lang===k?`2px solid ${ac}`:`1px solid ${bd}`,background:lang===k?`${ac}12`:"transparent",marginBottom:4,cursor:"pointer",color:tc,fontSize:fs-1}}>
            <Flag code={k} size={22}/>
            <span style={{fontWeight:lang===k?700:400}}>{(LL_LOCAL[lang]||LL_LOCAL.en)[k]||v}</span>
            {lang===k&&<span style={{marginLeft:"auto",color:ac}}>✓</span>}
          </button>)}
        </div></div>}

        {/* BOTTOM NAV — compact 2 rows */}
        <div style={{flexShrink:0,background:cd,borderTop:`1px solid ${bd}`,paddingBottom:"max(env(safe-area-inset-bottom),0px)"}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)"}}>
            {nav1.map(n=>(<button key={n.key} onClick={()=>page===n.key?goTo("home"):goTo(n.key)} style={{background:"none",border:"none",padding:"6px 0 2px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:0,color:page===n.key?ac:mt,position:"relative"}}>{page===n.key&&<div style={{position:"absolute",top:0,left:"25%",right:"25%",height:2,borderRadius:1,background:ac}}/>}<span style={{fontSize:16}}>{n.icon}</span><span style={{fontSize:10,fontWeight:page===n.key?700:400}}>{n.label}</span></button>))}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",borderTop:`1px solid ${bd}`}}>
            {nav2.map(n=>(<button key={n.key} onClick={()=>{if(n.onNav)n.onNav();if(page===n.key)goTo("home");else goTo(n.key);}} style={{background:"none",border:"none",padding:"5px 0 4px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:0,color:page===n.key?ac:mt,position:"relative"}}>{page===n.key&&<div style={{position:"absolute",top:0,left:"20%",right:"20%",height:2,borderRadius:1,background:ac}}/>}<span style={{fontSize:16}}>{n.icon}</span><span style={{fontSize:10,fontWeight:page===n.key?700:400}}>{n.label}</span></button>))}
          </div>
        </div>

    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@600;700&display=swap');
      @keyframes pulse{0%,100%{opacity:.3}50%{opacity:1}}
      @keyframes slideD{from{transform:translateX(-50%) translateY(-10px);opacity:0}to{transform:translateX(-50%) translateY(0);opacity:1}}
      @keyframes micPulse{0%,100%{box-shadow:0 0 0 0 rgba(230,57,70,.5)}50%{box-shadow:0 0 0 10px rgba(230,57,70,0)}}
      @keyframes globeSpin{0%{transform:rotateY(0deg)}100%{transform:rotateY(360deg)}}
      textarea{min-height:36px;max-height:150px;overflow-y:auto;transition:height 0.1s}
      @keyframes scanLine{0%{top:10%}50%{top:85%}100%{top:10%}}
      *{box-sizing:border-box;-webkit-tap-highlight-color:transparent;-webkit-touch-callout:none}
      html{height:100%;height:100dvh}
      body{margin:0;padding:0;height:100%;height:100dvh;overflow:hidden;overscroll-behavior:none}
      #root{height:100%;height:100dvh}
      ::-webkit-scrollbar{width:3px}
      ::-webkit-scrollbar-track{background:transparent}
      ::-webkit-scrollbar-thumb{background:#33445544;border-radius:3px}
      input:focus,textarea:focus,select:focus{border-color:${ac}!important}
      button:active{transform:scale(.97)}
    `}</style>
  </div>
);
}
