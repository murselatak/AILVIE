import React from "react";
import { TL } from "./tl";
import { emgFor, poisonFor, servicesFor, EMG_LABELS_TR } from "./emergency";
import { criticalFor, trendFor, patterns as clinPatterns, drugLabChecks, dialysisAdequacy, clinicalSummary, SOURCES } from "./clinical";
import { explainReport } from "./report";
import { useState, useEffect, useRef, useCallback } from "react";

/* ══════════════════════════════════════════════════════════
   AILVIE v9 — AI Personal Health Assistant
   v2 design + all new features + restructured nav
   ══════════════════════════════════════════════════════════ */

const T={tr:{app:"AILVIE",sl:"Kişisel AI Sağlık Asistanı",home:"Ana Sayfa",meds:"İlaçlar",appts:"Randevular",health:"Verilerim",healthFull:"Sağlık Verilerim",notes:"Notlar",contacts:"Rehber",community:"Topluluk",chat:"AILVIE Sohbet",settings:"Ayarlar",notif:"Bildirimler",emergency:"ACİL ÇAĞRI",dark:"Karanlık Tema",light:"Aydınlık Tema",hc:"Yüksek Kontrast",fSize:"Yazı Boyutu",lang:"Dil",hScore:"Sağlık Skoru",bmi:"BMI",nMed:"Sonraki İlaç",nAppt:"Sonraki Randevu",addMed:"İlaç Ekle",addAppt:"Randevu Ekle",bookAppt:"Randevu Al",nm:"Ad",dose:"Doz",time:"Saat",taken:"Alındı",dr:"Doktor",hosp:"Hastane",clin:"Poliklinik",date:"Tarih",up:"Yaklaşan",past:"Geçmiş",pulse:"Nabız",wt:"Kilo",ht:"Boy",bp:"Tansiyon",norm:"Normal",caut:"Dikkat",save:"Kaydet",del:"Sil",add:"Ekle",copy:"Kopyala",pin:"Sabitle",send:"Gönder",cancel:"İptal",drugR:"İlaç Tanıma",drugN:"İlaç adı yazın...",anlz:"Analiz",prog:"İlerleme",addSys:"Sisteme Ekle",dir:"Yol Tarifi",loc:"AI Konum",emN:"Acil Numaralar",wr:"Mesajınızı yazın...",bpm:"bpm",kg:"kg",cm:"cm",tap:"Dokunun",noM:"İlaç yok",noA:"Randevu yok",noN:"Not yok",noC:"Kişi yok",warn:"⚕️ Tıbbi teşhis aracı değildir",pCard:"Durumum",pCardFull:"Sağlık Durumum",fName:"Ad Soyad",bDate:"Doğum Tarihi",age:"Yaş",bType:"Kan Grubu",allrg:"Alerjiler",chron:"Kronik Hastalıklar",diag:"Teşhis",xray:"Röntgen",mri:"MR/Emar",ultra:"Ultrason",lab:"Tahliller",surg:"Ameliyat",insu:"Sigorta No",emCon:"Acil Kişi",trash:"Çöp Kutusu",trD:"gün sonra silinir",rest:"Geri Yükle",empT:"Boşalt",trE:"Çöp boş",q1:"Nasıl hissediyorsun?",q2:"İlaç bilgisi",q3:"Sağlık önerileri",greet:"Merhaba! Ben AILVIE, kişisel sağlık asistanınızım. 🌸 Size nasıl yardımcı olabilirim?",gm:"Günaydın",ga:"İyi akşamlar",hi:"Merhaba",emj:"Emoji",jan:"Oca",feb:"Şub",mar:"Mar",apr:"Nis",may:"May",jun:"Haz",jul:"Tem",aug:"Ağu",sep:"Eyl",oct:"Eki",nov:"Kas",dec:"Ara",su:"Pz",mo:"Pt",tu:"Sa",we:"Ça",th:"Pe",fr:"Cu",sa:"Ct",nNote:"Yeni Not",extA:"Harici Uygulamalar",addApp:"Uygulama Ekle",cls:"Sınıf",usg:"Kullanım",sEff:"Yan Etkiler",wrn:"Uyarılar",intr:"Etkileşimler",alarm:"Alarm",alarmSet:"Alarm Kuruldu",alarmType:"Alarm Tipi",vibrate:"Titreşim",ring:"Zil",both:"Her İkisi",scanQR:"QR/Barkod Tara",scanManual:"Manuel Barkod Gir",scanning:"Taranıyor...",scanFound:"İlaç Bulundu!",scanNotFound:"Barkod veritabanında bulunamadı",stopScan:"Taramayı Durdur",barcodeNum:"Barkod Numarası",scanAdd:"Tarayarak Ekle",profile:"Profil",login:"Giriş Yap",logout:"Çıkış Yap",permissions:"Uygulama İzinleri",subscription:"Abonelik Planları",free:"Ücretsiz",premium:"Premium",legal:"Hukuki Uyarı",legalText:"AILVIE, yapay zeka destekli kişisel sağlık asistanıdır. Bilgiler yalnızca bilgilendirme amaçlıdır, tıbbi teşhis/tedavi/reçete yerine geçmez. Sağlık kararları için doktorunuza danışın. GÜVENLİK: Sağlık verileriniz cihazınızda saklanır ve PIN açıkken AES-256 ile şifrelenir; senkronizasyon isteğe bağlıdır ve veri cihazınızda şifrelenerek gönderilir. AI özelliklerini kullandığınızda sorunuz ve ilgili sağlık profiliniz, yanıtı üretmek için AI sağlayıcısına gönderilir — hangi verinin nereye gittiğinin ayrıntısı için Gizlilik Politikası'na bakın. Verilerinizi satmıyoruz.",about:"Hakkında",version:"Sürüm",privPolicy:"Gizlilik Politikası",terms:"Kullanım Şartları",notifPerm:"Bildirim İzni",locPerm:"Konum İzni",micPerm:"Mikrofon İzni",camPerm:"Kamera İzni",freePlan:"Sınırsız ilaç & not • Günde 3 AI mesajı • Topluluk • Manuel takip",premPlan:"Sınırsız AI sohbet • Çeviri • İlaç analizi • Sesli asistan • Öncelikli yanıt • $4.99/ay",entPlan:"PRO + Aile/Grup • Çoklu profil • Öncelikli destek • Kurumsal anlaşma",enterprise:"Kurumsal",monthly:"aylık",loggedIn:"Giriş yapıldı",loggedOut:"Çıkış yapıldı",gn:"İyi geceler",feel:"kendini nasıl hissediyorsun? Umarım iyisindir.",adminCh:"AILVIE Destek",adminWelcome:"Mesajınız alındı. En kısa sürede yanıt vereceğiz.",voiceOn:"Sesli Diyalog",wordLangPick:"Dil Seç",appLock:"Uygulama Kilidi",appLockDesc:"Parmak izi / yüz tanıma ile koru",lockSetup:"Biyometrik Kilit Kur",lockOn:"Kilit Aktif",lockOff:"Kilit Kapalı",unlockTitle:"AILVIE Kilitli",unlockBtn:"Kilidi Aç",unlockDesc:"Devam etmek için kimliğinizi doğrulayın",lockEnabled:"Uygulama kilidi açıldı 🔒",lockDisabled:"Uygulama kilidi kapatıldı",lockFailed:"Doğrulama başarısız",lockNotSupported:"Cihazınız biyometrik kilidi desteklemiyor",dataLocal:"Verileriniz yalnızca bu cihazda saklanır"},
en:{app:"AILVIE",sl:"Personal AI Health Assistant",home:"Home",meds:"Meds",appts:"Appts",health:"Data",healthFull:"My Health Data",notes:"Notes",contacts:"Contacts",community:"Community",chat:"AILVIE Chat",settings:"Settings",notif:"Notifications",emergency:"EMERGENCY",dark:"Dark Mode",light:"Light Mode",hc:"High Contrast",fSize:"Font Size",lang:"Language",hScore:"Health Score",bmi:"BMI",nMed:"Next Med",nAppt:"Next Appt",addMed:"Add Med",addAppt:"Add Appt",bookAppt:"Book Appt",nm:"Name",dose:"Dose",time:"Time",taken:"Taken",dr:"Doctor",hosp:"Hospital",clin:"Clinic",date:"Date",up:"Upcoming",past:"Past",pulse:"Pulse",wt:"Weight",ht:"Height",bp:"Blood Pressure",norm:"Normal",caut:"Caution",save:"Save",del:"Delete",add:"Add",copy:"Copy",pin:"Pin",send:"Send",cancel:"Cancel",drugR:"Drug Recognition",drugN:"Enter drug name...",anlz:"Analyze",prog:"Progress",addSys:"Add System",dir:"Directions",loc:"AI Location",emN:"Emergency Numbers",wr:"Type message...",bpm:"bpm",kg:"kg",cm:"cm",tap:"Tap to add",noM:"No meds",noA:"No appts",noN:"No notes",noC:"No contacts",warn:"⚕️ Not a medical tool",pCard:"Status",pCardFull:"My Health Status",fName:"Full Name",bDate:"Birth Date",age:"Age",bType:"Blood Type",allrg:"Allergies",chron:"Chronic Diseases",diag:"Diagnosis",xray:"X-Ray",mri:"MRI",ultra:"Ultrasound",lab:"Lab Results",surg:"Surgeries",insu:"Insurance",emCon:"Emergency Contact",trash:"Trash",trD:"days auto-delete",rest:"Restore",empT:"Empty",trE:"Trash empty",q1:"How are you feeling?",q2:"Med info",q3:"Health tips",greet:"Hello! I'm AILVIE, your health assistant. 🌸 How can I help?",gm:"Good morning",ga:"Good evening",hi:"Hello",emj:"Emoji",jan:"Jan",feb:"Feb",mar:"Mar",apr:"Apr",may:"May",jun:"Jun",jul:"Jul",aug:"Aug",sep:"Sep",oct:"Oct",nov:"Nov",dec:"Dec",su:"Su",mo:"Mo",tu:"Tu",we:"We",th:"Th",fr:"Fr",sa:"Sa",nNote:"New Note",extA:"External Apps",addApp:"Add App",cls:"Class",usg:"Usage",sEff:"Side Effects",wrn:"Warnings",intr:"Interactions",alarm:"Alarm",alarmSet:"Alarm Set",alarmType:"Alarm Type",vibrate:"Vibrate",ring:"Ring",both:"Both",scanQR:"Scan QR/Barcode",scanManual:"Enter Barcode",scanning:"Scanning...",scanFound:"Drug Found!",scanNotFound:"Barcode not in database",stopScan:"Stop Scan",barcodeNum:"Barcode Number",scanAdd:"Scan to Add",profile:"Profile",login:"Log In",logout:"Log Out",permissions:"App Permissions",subscription:"Subscription Plans",free:"Free",premium:"Premium",legal:"Legal Notice",legalText:"AILVIE is an AI-powered personal health assistant. Information is for informational purposes only, not medical advice. Consult your doctor for health decisions. SECURITY: Your health data is stored on your device and encrypted with AES-256 when a PIN is set; sync is optional and data is encrypted on your device before it is sent. When you use AI features, your question and the relevant parts of your health profile are sent to the AI provider to generate the answer — see the Privacy Policy for details of what goes where. We do not sell your data.",about:"About",version:"Version",privPolicy:"Privacy Policy",terms:"Terms of Service",notifPerm:"Notification Permission",locPerm:"Location Permission",micPerm:"Microphone Permission",camPerm:"Camera Permission",freePlan:"Unlimited meds & notes • 3 daily AI messages • Community • Manual tracking",premPlan:"Unlimited AI chat • Translation • Drug analysis • Voice assistant • Priority • $4.99/mo",entPlan:"PRO + Family/Group • Multi-profile • Priority support • Enterprise SLA",enterprise:"Enterprise",monthly:"monthly",loggedIn:"Logged in",loggedOut:"Logged out",gn:"Good night",feel:"how are you feeling? Hope you're doing well.",adminCh:"AILVIE Support",adminWelcome:"Message received. We'll respond shortly.",voiceOn:"Voice Dialog",wordLangPick:"Select Language",appLock:"App Lock",appLockDesc:"Protect with fingerprint / face ID",lockSetup:"Set Up Biometric Lock",lockOn:"Lock Active",lockOff:"Lock Off",unlockTitle:"AILVIE Locked",unlockBtn:"Unlock",unlockDesc:"Verify your identity to continue",lockEnabled:"App lock enabled 🔒",lockDisabled:"App lock disabled",lockFailed:"Verification failed",lockNotSupported:"Your device doesn't support biometric lock",dataLocal:"Your data is stored only on this device"},
de:{app:"AILVIE",sl:"Persönliche KI-Gesundheitsassistentin",home:"Start",meds:"Medikamente",appts:"Termine",health:"Daten",healthFull:"Meine Gesundheitsdaten",notes:"Notizen",contacts:"Kontakte",community:"Gemeinschaft",chat:"AILVIE Chat",settings:"Einstellungen",notif:"Meldungen",emergency:"NOTFALL",dark:"Dunkelmodus",light:"Hellmodus",hc:"Kontrast",fSize:"Schrift",lang:"Sprache",hScore:"Score",bmi:"BMI",nMed:"Nächstes",nAppt:"Nächster",addMed:"Hinzufügen",addAppt:"Hinzufügen",bookAppt:"Buchen",nm:"Name",dose:"Dosis",time:"Zeit",taken:"Genommen",dr:"Arzt",hosp:"Krankenhaus",clin:"Klinik",date:"Datum",up:"Kommende",past:"Vergangene",pulse:"Puls",wt:"Gewicht",ht:"Größe",bp:"Blutdruck",norm:"Normal",caut:"Achtung",save:"Speichern",del:"Löschen",add:"Hinzufügen",copy:"Kopieren",pin:"Anheften",send:"Senden",cancel:"Abbrechen",drugR:"Erkennung",drugN:"Medikamentenname...",anlz:"Analysieren",prog:"Fortschritt",addSys:"System",dir:"Route",loc:"KI Standort",emN:"Notrufnummern",wr:"Nachricht...",bpm:"bpm",kg:"kg",cm:"cm",tap:"Tippen",noM:"Keine",noA:"Keine",noN:"Keine",noC:"Keine",warn:"⚕️ Kein Diagnosetool",pCard:"Status",pCardFull:"Mein Gesundheitsstatus",fName:"Name",bDate:"Geburtsdatum",age:"Alter",bType:"Blutgruppe",allrg:"Allergien",chron:"Chronische",diag:"Diagnose",xray:"Röntgen",mri:"MRT",ultra:"Ultraschall",lab:"Labor",surg:"OP",insu:"Versicherung",emCon:"Notfallkontakt",trash:"Papierkorb",trD:"Tage",rest:"Wiederherstellen",empT:"Leeren",trE:"Leer",q1:"Wie geht es Ihnen?",q2:"Med-Info",q3:"Tipps",greet:"Hallo! Ich bin AILVIE. 🌸",gm:"Guten Morgen",ga:"Guten Abend",hi:"Hallo",emj:"Emoji",jan:"Jan",feb:"Feb",mar:"Mär",apr:"Apr",may:"Mai",jun:"Jun",jul:"Jul",aug:"Aug",sep:"Sep",oct:"Okt",nov:"Nov",dec:"Dez",su:"So",mo:"Mo",tu:"Di",we:"Mi",th:"Do",fr:"Fr",sa:"Sa",nNote:"Neue",extA:"Externe",addApp:"App",cls:"Klasse",usg:"Verwendung",sEff:"Nebenwirkungen",wrn:"Warnungen",intr:"Wechselwirkungen",alarm:"Alarm",alarmSet:"Alarm gesetzt",alarmType:"Alarmtyp",vibrate:"Vibration",ring:"Klingelton",both:"Beides",profile:"Profil",login:"Anmelden",logout:"Abmelden",permissions:"Berechtigungen",subscription:"Abonnement",free:"Kostenlos",premium:"Premium",legal:"Rechtlicher Hinweis",legalText:"AILVIE ist ein KI-gestützter Gesundheitsassistent. Informationen dienen nur zu Informationszwecken. Konsultieren Sie immer einen Arzt.",about:"Über",version:"Version",privPolicy:"Datenschutz",terms:"Nutzungsbedingungen",notifPerm:"Benachrichtigungen",locPerm:"Standort",micPerm:"Mikrofon",camPerm:"Kamera",freePlan:"Grundfunktionen kostenlos",premPlan:"Unbegrenzter KI-Chat, werbefrei",entPlan:"Familienfreigabe, Prioritätssupport",enterprise:"Unternehmen",monthly:"monatlich",loggedIn:"Angemeldet",loggedOut:"Abgemeldet",gn:"Gute Nacht",feel:"wie fühlst du dich? Hoffentlich geht es dir gut.",adminCh:"AILVIE Support",adminWelcome:"Nachricht erhalten.",voiceOn:"Sprachchat",wordLangPick:"Sprache wählen",scanQR:"QR/Barcode scannen",scanManual:"Barcode manuell eingeben",scanning:"Scannen...",scanFound:"Medikament gefunden!",scanNotFound:"Barcode nicht in Datenbank",stopScan:"Scan stoppen",barcodeNum:"Barcode-Nummer",scanAdd:"Per Scan hinzufügen",appLock:"App-Sperre",appLockDesc:"Mit Fingerabdruck / Gesichtserkennung schützen",lockSetup:"Biometrische Sperre einrichten",lockOn:"Sperre aktiv",lockOff:"Sperre aus",unlockTitle:"AILVIE Gesperrt",unlockBtn:"Entsperren",unlockDesc:"Bestätigen Sie Ihre Identität",lockEnabled:"App-Sperre aktiviert 🔒",lockDisabled:"App-Sperre deaktiviert",lockFailed:"Verifizierung fehlgeschlagen",lockNotSupported:"Ihr Gerät unterstützt keine biometrische Sperre",dataLocal:"Ihre Daten werden nur auf diesem Gerät gespeichert"},
ru:{app:"AILVIE",sl:"Персональный ИИ-ассистент здоровья",home:"Главная",meds:"Лекарства",appts:"Записи",health:"Данные",healthFull:"Мои данные о здоровье",notes:"Заметки",contacts:"Контакты",community:"Сообщество",chat:"AILVIE Чат",settings:"Настройки",notif:"Уведомления",emergency:"SOS",dark:"Тёмная тема",light:"Светлая тема",hc:"Контраст",fSize:"Шрифт",lang:"Язык",hScore:"Здоровье",bmi:"ИМТ",nMed:"След.",nAppt:"След.",addMed:"Добавить",addAppt:"Добавить",bookAppt:"Записаться",nm:"Имя",dose:"Доза",time:"Время",taken:"Принято",dr:"Врач",hosp:"Больница",clin:"Поликлиника",date:"Дата",up:"Предстоящие",past:"Прошедшие",pulse:"Пульс",wt:"Вес",ht:"Рост",bp:"Давление",norm:"Норма",caut:"Внимание",save:"Сохранить",del:"Удалить",add:"Добавить",copy:"Копировать",pin:"Закрепить",send:"Отправить",cancel:"Отмена",drugR:"Распознавание",drugN:"Название...",anlz:"Анализ",prog:"Прогресс",addSys:"Система",dir:"Маршрут",loc:"ИИ Местоположение",emN:"Экстренные",wr:"Сообщение...",bpm:"уд/м",kg:"кг",cm:"см",tap:"Нажмите",noM:"Нет",noA:"Нет",noN:"Нет",noC:"Нет",warn:"⚕️ Не диагностика",pCard:"Состояние",pCardFull:"Моё состояние здоровья",fName:"ФИО",bDate:"Дата рождения",age:"Возраст",bType:"Группа крови",allrg:"Аллергии",chron:"Хронические",diag:"Диагноз",xray:"Рентген",mri:"МРТ",ultra:"УЗИ",lab:"Анализы",surg:"Операции",insu:"Страховой",emCon:"Экстренный",trash:"Корзина",trD:"дней",rest:"Восстановить",empT:"Очистить",trE:"Пусто",q1:"Как вы себя чувствуете?",q2:"О лекарствах",q3:"Советы",greet:"Здравствуйте! Я AILVIE. 🌸",gm:"Доброе утро",ga:"Добрый вечер",hi:"Здравствуйте",emj:"Эмодзи",jan:"Янв",feb:"Фев",mar:"Мар",apr:"Апр",may:"Май",jun:"Июн",jul:"Июл",aug:"Авг",sep:"Сен",oct:"Окт",nov:"Ноя",dec:"Дек",su:"Вс",mo:"Пн",tu:"Вт",we:"Ср",th:"Чт",fr:"Пт",sa:"Сб",nNote:"Новая",extA:"Внешние",addApp:"Приложение",cls:"Класс",usg:"Применение",sEff:"Побочные",wrn:"Предупреждения",intr:"Взаимодействия",alarm:"Будильник",alarmSet:"Установлен",alarmType:"Тип",vibrate:"Вибрация",ring:"Звонок",both:"Оба",profile:"Профиль",login:"Войти",logout:"Выйти",permissions:"Разрешения",subscription:"Подписка",free:"Бесплатно",premium:"Премиум",legal:"Юридическое уведомление",legalText:"AILVIE — ИИ-помощник. Информация носит ознакомительный характер. Консультируйтесь с врачом.",about:"О приложении",version:"Версия",privPolicy:"Конфиденциальность",terms:"Условия",notifPerm:"Уведомления",locPerm:"Геолокация",micPerm:"Микрофон",camPerm:"Камера",freePlan:"Базовые функции бесплатно",premPlan:"Безлимитный ИИ-чат, без рекламы",entPlan:"Семейный доступ, приоритет",enterprise:"Корпоративный",monthly:"в месяц",loggedIn:"Вход выполнен",loggedOut:"Выход выполнен",gn:"Спокойной ночи",feel:"как вы себя чувствуете? Надеюсь, всё хорошо.",adminCh:"Поддержка AILVIE",adminWelcome:"Сообщение получено.",voiceOn:"Голосовой диалог",wordLangPick:"Выбрать язык",scanQR:"Сканировать QR/штрих-код",scanManual:"Ввести штрих-код вручную",scanning:"Сканирование...",scanFound:"Лекарство найдено!",scanNotFound:"Штрих-код не найден в базе",stopScan:"Остановить сканирование",barcodeNum:"Номер штрих-кода",scanAdd:"Добавить сканированием",appLock:"Блокировка приложения",appLockDesc:"Защита отпечатком / распознаванием лица",lockSetup:"Настроить биометрическую блокировку",lockOn:"Блокировка активна",lockOff:"Блокировка выкл",unlockTitle:"AILVIE Заблокировано",unlockBtn:"Разблокировать",unlockDesc:"Подтвердите свою личность",lockEnabled:"Блокировка включена 🔒",lockDisabled:"Блокировка отключена",lockFailed:"Проверка не удалась",lockNotSupported:"Ваше устройство не поддерживает биометрию",dataLocal:"Ваши данные хранятся только на этом устройстве"},
zh:{app:"AILVIE",sl:"个人AI健康助手",home:"首页",meds:"药物",appts:"预约",health:"健康数据",healthFull:"我的健康数据",notes:"笔记",contacts:"通讯录",community:"社区",chat:"AILVIE聊天",settings:"设置",notif:"通知",emergency:"紧急",dark:"暗色",light:"亮色",hc:"对比度",fSize:"字体",lang:"语言",hScore:"健康分",bmi:"BMI",nMed:"下一药",nAppt:"下一预约",addMed:"添加",addAppt:"添加",bookAppt:"预约",nm:"姓名",dose:"剂量",time:"时间",taken:"已服",dr:"医生",hosp:"医院",clin:"诊所",date:"日期",up:"即将",past:"已过",pulse:"脉搏",wt:"体重",ht:"身高",bp:"血压",norm:"正常",caut:"注意",save:"保存",del:"删除",add:"添加",copy:"复制",pin:"置顶",send:"发送",cancel:"取消",drugR:"药物识别",drugN:"输入药名...",anlz:"分析",prog:"进度",addSys:"添加系统",dir:"路线",loc:"AI位置",emN:"紧急号码",wr:"输入消息...",bpm:"bpm",kg:"kg",cm:"cm",tap:"点击",noM:"暂无",noA:"暂无",noN:"暂无",noC:"暂无",warn:"⚕️非诊断工具",pCard:"健康状况",pCardFull:"我的健康状况",fName:"姓名",bDate:"出生",age:"年龄",bType:"血型",allrg:"过敏",chron:"慢性病",diag:"诊断",xray:"X光",mri:"MRI",ultra:"超声",lab:"检验",surg:"手术",insu:"保险",emCon:"紧急联系人",trash:"回收站",trD:"天",rest:"恢复",empT:"清空",trE:"空",q1:"感觉如何？",q2:"药物信息",q3:"健康建议",greet:"你好！我是AILVIE。🌸",gm:"早上好",ga:"晚上好",hi:"你好",emj:"表情",jan:"1月",feb:"2月",mar:"3月",apr:"4月",may:"5月",jun:"6月",jul:"7月",aug:"8月",sep:"9月",oct:"10月",nov:"11月",dec:"12月",su:"日",mo:"一",tu:"二",we:"三",th:"四",fr:"五",sa:"六",nNote:"新",extA:"外部",addApp:"添加",cls:"分类",usg:"用途",sEff:"副作用",wrn:"警告",intr:"相互作用",alarm:"闹钟",alarmSet:"已设置",alarmType:"类型",vibrate:"振动",ring:"铃声",both:"两者",profile:"个人资料",login:"登录",logout:"退出",permissions:"权限",subscription:"订阅",free:"免费",premium:"高级",legal:"法律声明",legalText:"AILVIE是AI助手。信息仅供参考。请咨询医生。",about:"关于",version:"版本",privPolicy:"隐私",terms:"条款",notifPerm:"通知",locPerm:"位置",micPerm:"麦克风",camPerm:"相机",freePlan:"基础功能免费",premPlan:"无限AI聊天",entPlan:"家庭共享",enterprise:"企业",monthly:"月",loggedIn:"已登录",loggedOut:"已退出",gn:"晚安",feel:"你感觉怎么样？希望一切都好。",adminCh:"AILVIE 支持",adminWelcome:"消息已收到。",voiceOn:"语音对话",wordLangPick:"选择语言",scanQR:"扫描二维码/条形码",scanManual:"手动输入条形码",scanning:"扫描中...",scanFound:"找到药物！",scanNotFound:"数据库中未找到条形码",stopScan:"停止扫描",barcodeNum:"条形码号",scanAdd:"扫描添加",appLock:"应用锁",appLockDesc:"使用指纹/面部识别保护",lockSetup:"设置生物识别锁",lockOn:"锁已激活",lockOff:"锁已关闭",unlockTitle:"AILVIE 已锁定",unlockBtn:"解锁",unlockDesc:"验证您的身份以继续",lockEnabled:"应用锁已启用 🔒",lockDisabled:"应用锁已禁用",lockFailed:"验证失败",lockNotSupported:"您的设备不支持生物识别锁",dataLocal:"您的数据仅存储在此设备上"},
hi:{app:"AILVIE",sl:"व्यक्तिगत AI स्वास्थ्य सहायक",home:"होम",meds:"दवाइयाँ",appts:"अपॉइंटमेंट",health:"डेटा",healthFull:"मेरा स्वास्थ्य डेटा",notes:"नोट्स",contacts:"संपर्क",community:"समुदाय",chat:"AILVIE चैट",settings:"सेटिंग्स",notif:"सूचनाएँ",emergency:"आपातकालीन",dark:"डार्क",light:"लाइट",hc:"कंट्रास्ट",fSize:"फ़ॉन्ट",lang:"भाषा",hScore:"स्कोर",bmi:"BMI",nMed:"अगली",nAppt:"अगला",addMed:"जोड़ें",addAppt:"जोड़ें",bookAppt:"बुक",nm:"नाम",dose:"खुराक",time:"समय",taken:"लिया",dr:"डॉक्टर",hosp:"अस्पताल",clin:"क्लिनिक",date:"तारीख",up:"आगामी",past:"पिछला",pulse:"नाड़ी",wt:"वज़न",ht:"ऊँचाई",bp:"रक्तचाप",norm:"सामान्य",caut:"सावधानी",save:"सहेजें",del:"हटाएँ",add:"जोड़ें",copy:"कॉपी",pin:"पिन",send:"भेजें",cancel:"रद्द",drugR:"दवा पहचान",drugN:"दवा का नाम...",anlz:"विश्लेषण",prog:"प्रगति",addSys:"सिस्टम",dir:"दिशा",loc:"AI स्थान",emN:"आपातकालीन",wr:"संदेश...",bpm:"bpm",kg:"kg",cm:"cm",tap:"टैप",noM:"नहीं",noA:"नहीं",noN:"नहीं",noC:"नहीं",warn:"⚕️ निदान नहीं",pCard:"स्थिति",pCardFull:"मेरी स्वास्थ्य स्थिति",fName:"नाम",bDate:"जन्म",age:"उम्र",bType:"रक्त",allrg:"एलर्जी",chron:"पुरानी",diag:"निदान",xray:"एक्स-रे",mri:"एमआरआई",ultra:"अल्ट्रासाउंड",lab:"लैब",surg:"सर्जरी",insu:"बीमा",emCon:"आपातकालीन",trash:"कचरा",trD:"दिन",rest:"पुनर्स्थापित",empT:"खाली",trE:"खाली",q1:"आप कैसा महसूस कर रहे हैं?",q2:"दवा जानकारी",q3:"सुझाव",greet:"नमस्ते! मैं AILVIE हूँ। 🌸",gm:"सुप्रभात",ga:"शुभ संध्या",hi:"नमस्ते",emj:"इमोजी",jan:"जन",feb:"फ़र",mar:"मार्च",apr:"अप्रैल",may:"मई",jun:"जून",jul:"जुल",aug:"अग",sep:"सित",oct:"अक्टू",nov:"नव",dec:"दिस",su:"र",mo:"सो",tu:"मं",we:"बु",th:"गु",fr:"शु",sa:"श",nNote:"नया",extA:"बाहरी",addApp:"जोड़ें",cls:"वर्ग",usg:"उपयोग",sEff:"दुष्प्रभाव",wrn:"चेतावनी",intr:"इंटरैक्शन",alarm:"अलार्म",alarmSet:"सेट",alarmType:"प्रकार",vibrate:"कंपन",ring:"रिंग",both:"दोनों",profile:"प्रोफ़ाइल",login:"लॉगिन",logout:"लॉगआउट",permissions:"अनुमतियाँ",subscription:"सदस्यता",free:"मुफ़्त",premium:"प्रीमियम",legal:"कानूनी",legalText:"AILVIE AI सहायक है। जानकारी केवल सूचनात्मक है। डॉक्टर से परामर्श लें।",about:"के बारे में",version:"संस्करण",privPolicy:"गोपनीयता",terms:"शर्तें",notifPerm:"सूचना",locPerm:"स्थान",micPerm:"माइक",camPerm:"कैमरा",freePlan:"बुनियादी मुफ़्त",premPlan:"असीमित AI चैट",entPlan:"परिवार साझा",enterprise:"उद्यम",monthly:"माह",loggedIn:"लॉगिन हुआ",loggedOut:"लॉगआउट हुआ",gn:"शुभ रात्रि",feel:"आप कैसा महसूस कर रहे हैं? उम्मीद है सब ठीक है।",adminCh:"AILVIE सहायता",adminWelcome:"संदेश मिला।",voiceOn:"वॉइस डायलॉग",wordLangPick:"भाषा चुनें",scanQR:"QR/बारकोड स्कैन करें",scanManual:"बारकोड मैन्युअल दर्ज करें",scanning:"स्कैन हो रहा है...",scanFound:"दवा मिली!",scanNotFound:"बारकोड डेटाबेस में नहीं मिला",stopScan:"स्कैन रोकें",barcodeNum:"बारकोड नंबर",scanAdd:"स्कैन करके जोड़ें",appLock:"ऐप लॉक",appLockDesc:"फिंगरप्रिंट / फेस आईडी से सुरक्षित करें",lockSetup:"बायोमेट्रिक लॉक सेट करें",lockOn:"लॉक सक्रिय",lockOff:"लॉक बंद",unlockTitle:"AILVIE लॉक है",unlockBtn:"अनलॉक करें",unlockDesc:"जारी रखने के लिए अपनी पहचान सत्यापित करें",lockEnabled:"ऐप लॉक सक्षम 🔒",lockDisabled:"ऐप लॉक अक्षम",lockFailed:"सत्यापन विफल",lockNotSupported:"आपका डिवाइस बायोमेट्रिक लॉक का समर्थन नहीं करता",dataLocal:"आपका डेटा केवल इस डिवाइस पर संग्रहीत है"},
nl:{app:"AILVIE",sl:"Persoonlijke AI-gezondheidsassistent",home:"Home",meds:"Medicijnen",appts:"Afspraken",health:"Gegevens",healthFull:"Mijn gezondheidsgegevens",notes:"Notities",contacts:"Contacten",community:"Gemeenschap",chat:"AILVIE Chat",settings:"Instellingen",notif:"Meldingen",emergency:"NOODGEVAL",dark:"Donker",light:"Licht",hc:"Contrast",fSize:"Lettergrootte",lang:"Taal",hScore:"Score",bmi:"BMI",nMed:"Volgend",nAppt:"Volgende",addMed:"Toevoegen",addAppt:"Toevoegen",bookAppt:"Boeken",nm:"Naam",dose:"Dosis",time:"Tijd",taken:"Ingenomen",dr:"Arts",hosp:"Ziekenhuis",clin:"Kliniek",date:"Datum",up:"Aankomend",past:"Afgelopen",pulse:"Pols",wt:"Gewicht",ht:"Lengte",bp:"Bloeddruk",norm:"Normaal",caut:"Let op",save:"Opslaan",del:"Verwijderen",add:"Toevoegen",copy:"Kopiëren",pin:"Vastzetten",send:"Verzenden",cancel:"Annuleren",drugR:"Herkenning",drugN:"Medicijnnaam...",anlz:"Analyseren",prog:"Voortgang",addSys:"Systeem",dir:"Route",loc:"AI Locatie",emN:"Noodnummers",wr:"Bericht...",bpm:"bpm",kg:"kg",cm:"cm",tap:"Tik",noM:"Geen",noA:"Geen",noN:"Geen",noC:"Geen",warn:"⚕️ Geen diagnose",pCard:"Status",pCardFull:"Mijn gezondheidsstatus",fName:"Naam",bDate:"Geboortedatum",age:"Leeftijd",bType:"Bloedgroep",allrg:"Allergieën",chron:"Chronisch",diag:"Diagnose",xray:"Röntgen",mri:"MRI",ultra:"Echo",lab:"Lab",surg:"Operatie",insu:"Verzekering",emCon:"Noodcontact",trash:"Prullenbak",trD:"dagen",rest:"Herstellen",empT:"Leegmaken",trE:"Leeg",q1:"Hoe voelt u zich?",q2:"Medicijninfo",q3:"Tips",greet:"Hallo! Ik ben AILVIE. 🌸",gm:"Goedemorgen",ga:"Goedenavond",hi:"Hallo",emj:"Emoji",jan:"Jan",feb:"Feb",mar:"Mrt",apr:"Apr",may:"Mei",jun:"Jun",jul:"Jul",aug:"Aug",sep:"Sep",oct:"Okt",nov:"Nov",dec:"Dec",su:"Zo",mo:"Ma",tu:"Di",we:"Wo",th:"Do",fr:"Vr",sa:"Za",nNote:"Nieuw",extA:"Extern",addApp:"App",cls:"Klasse",usg:"Gebruik",sEff:"Bijwerkingen",wrn:"Waarschuwingen",intr:"Interacties",alarm:"Alarm",alarmSet:"Ingesteld",alarmType:"Type",vibrate:"Trillen",ring:"Beltoon",both:"Beide",profile:"Profiel",login:"Inloggen",logout:"Uitloggen",permissions:"Machtigingen",subscription:"Abonnement",free:"Gratis",premium:"Premium",legal:"Juridisch",legalText:"AILVIE is een AI-assistent. Informatie is alleen informatief. Raadpleeg een arts.",about:"Over",version:"Versie",privPolicy:"Privacy",terms:"Voorwaarden",notifPerm:"Meldingen",locPerm:"Locatie",micPerm:"Microfoon",camPerm:"Camera",freePlan:"Basisfuncties gratis",premPlan:"Onbeperkt AI-chat",entPlan:"Gezinsgebruik",enterprise:"Zakelijk",monthly:"maand",loggedIn:"Ingelogd",loggedOut:"Uitgelogd",gn:"Goedenacht",feel:"hoe voel je je? Hopelijk gaat het goed.",adminCh:"AILVIE Support",adminWelcome:"Bericht ontvangen.",voiceOn:"Spraakchat",wordLangPick:"Taal kiezen",scanQR:"QR/Barcode scannen",scanManual:"Barcode handmatig invoeren",scanning:"Scannen...",scanFound:"Medicijn gevonden!",scanNotFound:"Barcode niet in database",stopScan:"Scannen stoppen",barcodeNum:"Barcodenummer",scanAdd:"Toevoegen via scan",appLock:"App-vergrendeling",appLockDesc:"Beveilig met vingerafdruk / gezichtsherkenning",lockSetup:"Biometrische vergrendeling instellen",lockOn:"Vergrendeling actief",lockOff:"Vergrendeling uit",unlockTitle:"AILVIE Vergrendeld",unlockBtn:"Ontgrendelen",unlockDesc:"Verifieer uw identiteit om door te gaan",lockEnabled:"App-vergrendeling ingeschakeld 🔒",lockDisabled:"App-vergrendeling uitgeschakeld",lockFailed:"Verificatie mislukt",lockNotSupported:"Uw apparaat ondersteunt geen biometrische vergrendeling",dataLocal:"Uw gegevens worden alleen op dit apparaat opgeslagen"},
es:{app:"AILVIE",sl:"Asistente personal de salud IA",home:"Inicio",meds:"Meds",appts:"Citas",health:"Datos",healthFull:"Mis datos de salud",notes:"Notas",contacts:"Contactos",community:"Comunidad",chat:"AILVIE Chat",settings:"Ajustes",notif:"Notificaciones",emergency:"EMERGENCIA",dark:"Oscuro",light:"Claro",hc:"Contraste",fSize:"Tamaño",lang:"Idioma",hScore:"Puntuación",bmi:"IMC",nMed:"Próximo",nAppt:"Próxima",addMed:"Añadir",addAppt:"Añadir",bookAppt:"Pedir",nm:"Nombre",dose:"Dosis",time:"Hora",taken:"Tomado",dr:"Doctor",hosp:"Hospital",clin:"Clínica",date:"Fecha",up:"Próximas",past:"Pasadas",pulse:"Pulso",wt:"Peso",ht:"Altura",bp:"Presión",norm:"Normal",caut:"Precaución",save:"Guardar",del:"Eliminar",add:"Añadir",copy:"Copiar",pin:"Fijar",send:"Enviar",cancel:"Cancelar",drugR:"Reconocimiento",drugN:"Nombre del med...",anlz:"Analizar",prog:"Progreso",addSys:"Sistema",dir:"Ruta",loc:"IA Ubicación",emN:"Emergencia",wr:"Escribe...",bpm:"lpm",kg:"kg",cm:"cm",tap:"Toca",noM:"Sin meds",noA:"Sin citas",noN:"Sin notas",noC:"Sin contactos",warn:"⚕️ No es diagnóstico",pCard:"Estado",pCardFull:"Mi estado de salud",fName:"Nombre",bDate:"Nacimiento",age:"Edad",bType:"Sangre",allrg:"Alergias",chron:"Crónicas",diag:"Diagnóstico",xray:"Rayos X",mri:"Resonancia",ultra:"Ecografía",lab:"Laboratorio",surg:"Cirugía",insu:"Seguro",emCon:"Contacto",trash:"Papelera",trD:"días",rest:"Restaurar",empT:"Vaciar",trE:"Vacía",q1:"¿Cómo se siente?",q2:"Info meds",q3:"Consejos",greet:"¡Hola! Soy AILVIE. 🌸",gm:"Buenos días",ga:"Buenas noches",hi:"Hola",emj:"Emoji",jan:"Ene",feb:"Feb",mar:"Mar",apr:"Abr",may:"May",jun:"Jun",jul:"Jul",aug:"Ago",sep:"Sep",oct:"Oct",nov:"Nov",dec:"Dic",su:"Do",mo:"Lu",tu:"Ma",we:"Mi",th:"Ju",fr:"Vi",sa:"Sá",nNote:"Nueva",extA:"Externas",addApp:"App",cls:"Clase",usg:"Uso",sEff:"Efectos",wrn:"Advertencias",intr:"Interacciones",alarm:"Alarma",alarmSet:"Configurada",alarmType:"Tipo",vibrate:"Vibración",ring:"Timbre",both:"Ambos",profile:"Perfil",login:"Iniciar sesión",logout:"Cerrar sesión",permissions:"Permisos",subscription:"Suscripción",free:"Gratis",premium:"Premium",legal:"Aviso legal",legalText:"AILVIE es un asistente IA. La información es solo orientativa. Consulte a un médico.",about:"Acerca de",version:"Versión",privPolicy:"Privacidad",terms:"Términos",notifPerm:"Notificaciones",locPerm:"Ubicación",micPerm:"Micrófono",camPerm:"Cámara",freePlan:"Funciones básicas gratis",premPlan:"Chat IA ilimitado",entPlan:"Familia, soporte prioritario",enterprise:"Empresarial",monthly:"mes",loggedIn:"Sesión iniciada",loggedOut:"Sesión cerrada",gn:"Buenas noches",feel:"¿cómo te sientes? Espero que estés bien.",adminCh:"Soporte AILVIE",adminWelcome:"Mensaje recibido.",voiceOn:"Diálogo de voz",wordLangPick:"Seleccionar idioma",scanQR:"Escanear QR/código de barras",scanManual:"Ingresar código manualmente",scanning:"Escaneando...",scanFound:"¡Medicamento encontrado!",scanNotFound:"Código no encontrado en la base",stopScan:"Detener escaneo",barcodeNum:"Número de código",scanAdd:"Agregar escaneando",appLock:"Bloqueo de app",appLockDesc:"Proteger con huella / reconocimiento facial",lockSetup:"Configurar bloqueo biométrico",lockOn:"Bloqueo activo",lockOff:"Bloqueo apagado",unlockTitle:"AILVIE Bloqueado",unlockBtn:"Desbloquear",unlockDesc:"Verifica tu identidad para continuar",lockEnabled:"Bloqueo de app activado 🔒",lockDisabled:"Bloqueo de app desactivado",lockFailed:"Verificación fallida",lockNotSupported:"Tu dispositivo no admite bloqueo biométrico",dataLocal:"Tus datos se almacenan solo en este dispositivo"},
ar:{app:"AILVIE",sl:"مساعدة صحية شخصية بالذكاء الاصطناعي",home:"الرئيسية",meds:"الأدوية",appts:"المواعيد",health:"بياناتي",healthFull:"بياناتي الصحية",notes:"ملاحظات",contacts:"جهات الاتصال",community:"المجتمع",chat:"محادثة",settings:"الإعدادات",notif:"الإشعارات",emergency:"طوارئ",dark:"داكن",light:"فاتح",hc:"تباين",fSize:"الخط",lang:"اللغة",hScore:"الصحة",bmi:"كتلة",nMed:"التالي",nAppt:"التالي",addMed:"إضافة",addAppt:"إضافة",bookAppt:"حجز",nm:"الاسم",dose:"الجرعة",time:"الوقت",taken:"تم",dr:"طبيب",hosp:"مستشفى",clin:"عيادة",date:"التاريخ",up:"قادمة",past:"سابقة",pulse:"النبض",wt:"الوزن",ht:"الطول",bp:"ضغط الدم",norm:"طبيعي",caut:"تحذير",save:"حفظ",del:"حذف",add:"إضافة",copy:"نسخ",pin:"تثبيت",send:"إرسال",cancel:"إلغاء",drugR:"التعرف",drugN:"اسم الدواء...",anlz:"تحليل",prog:"التقدم",addSys:"نظام",dir:"اتجاهات",loc:"الموقع",emN:"طوارئ",wr:"اكتب...",bpm:"نبضة/د",kg:"كغ",cm:"سم",tap:"اضغط",noM:"لا",noA:"لا",noN:"لا",noC:"لا",warn:"⚕️ ليس تشخيص",pCard:"حالتي",pCardFull:"حالتي الصحية",fName:"الاسم",bDate:"الميلاد",age:"العمر",bType:"فصيلة",allrg:"حساسية",chron:"مزمنة",diag:"تشخيص",xray:"أشعة",mri:"رنين",ultra:"موجات",lab:"تحاليل",surg:"عمليات",insu:"تأمين",emCon:"طوارئ",trash:"المحذوفات",trD:"يوم",rest:"استعادة",empT:"إفراغ",trE:"فارغة",q1:"كيف أشعر؟",q2:"دواء",q3:"نصائح",greet:"مرحبًا! أنا AILVIE. 🌸",gm:"صباح الخير",ga:"مساء الخير",hi:"مرحبا",emj:"رموز",jan:"يناير",feb:"فبراير",mar:"مارس",apr:"أبريل",may:"مايو",jun:"يونيو",jul:"يوليو",aug:"أغسطس",sep:"سبتمبر",oct:"أكتوبر",nov:"نوفمبر",dec:"ديسمبر",su:"أحد",mo:"إثنين",tu:"ثلاثاء",we:"أربعاء",th:"خميس",fr:"جمعة",sa:"سبت",nNote:"جديد",extA:"خارجية",addApp:"تطبيق",cls:"التصنيف",usg:"الاستخدام",sEff:"آثار",wrn:"تحذيرات",intr:"التفاعلات",alarm:"منبه",alarmSet:"تم",alarmType:"نوع",vibrate:"اهتزاز",ring:"رنين",both:"كلاهما",profile:"الملف",login:"دخول",logout:"خروج",permissions:"الأذونات",subscription:"اشتراك",free:"مجاني",premium:"مميز",legal:"قانوني",legalText:"AILVIE مساعد ذكاء اصطناعي. المعلومات إرشادية فقط. استشر طبيبك.",about:"حول",version:"الإصدار",privPolicy:"الخصوصية",terms:"الشروط",notifPerm:"الإشعارات",locPerm:"الموقع",micPerm:"الميكروفون",camPerm:"الكاميرا",freePlan:"مجاني أساسي",premPlan:"محادثة غير محدودة",entPlan:"عائلي",enterprise:"مؤسسي",monthly:"شهرياً",loggedIn:"تم الدخول",loggedOut:"تم الخروج",gn:"تصبح على خير",feel:"كيف حالك؟ أتمنى أن تكون بخير.",adminCh:"دعم AILVIE",adminWelcome:"تم استلام الرسالة.",voiceOn:"حوار صوتي",wordLangPick:"اختر اللغة",scanQR:"مسح QR/الباركود",scanManual:"إدخال الباركود يدويًا",scanning:"جاري المسح...",scanFound:"تم العثور على الدواء!",scanNotFound:"الباركود غير موجود في قاعدة البيانات",stopScan:"إيقاف المسح",barcodeNum:"رقم الباركود",scanAdd:"إضافة بالمسح",appLock:"قفل التطبيق",appLockDesc:"الحماية ببصمة الإصبع / التعرف على الوجه",lockSetup:"إعداد القفل البيومتري",lockOn:"القفل نشط",lockOff:"القفل متوقف",unlockTitle:"AILVIE مقفل",unlockBtn:"إلغاء القفل",unlockDesc:"تحقق من هويتك للمتابعة",lockEnabled:"تم تفعيل قفل التطبيق 🔒",lockDisabled:"تم تعطيل قفل التطبيق",lockFailed:"فشل التحقق",lockNotSupported:"جهازك لا يدعم القفل البيومتري",dataLocal:"يتم تخزين بياناتك على هذا الجهاز فقط"},fr:{app:"AILVIE",sl:"Assistant santé personnel IA",home:"Accueil",meds:"Médicaments",appts:"RDV",health:"Données",healthFull:"Mes données de santé",notes:"Notes",contacts:"Contacts",community:"Communauté",chat:"AILVIE Chat",settings:"Paramètres",notif:"Notifications",emergency:"URGENCE",dark:"Mode sombre",light:"Mode clair",hc:"Contraste",fSize:"Police",lang:"Langue",hScore:"Score santé",bmi:"IMC",nMed:"Prochain",nAppt:"Prochain RDV",addMed:"Ajouter",addAppt:"Ajouter",bookAppt:"Prendre RDV",nm:"Nom",dose:"Dose",time:"Heure",taken:"Pris",dr:"Médecin",hosp:"Hôpital",clin:"Clinique",date:"Date",up:"À venir",past:"Passés",pulse:"Pouls",wt:"Poids",ht:"Taille",bp:"Tension",norm:"Normal",caut:"Attention",save:"Enregistrer",del:"Supprimer",add:"Ajouter",copy:"Copier",pin:"Épingler",send:"Envoyer",cancel:"Annuler",drugR:"Reconnaissance",drugN:"Nom du médicament...",anlz:"Analyser",prog:"Progrès",addSys:"Système",dir:"Itinéraire",loc:"IA Localisation",emN:"Numéros d'urgence",wr:"Écrire...",bpm:"bpm",kg:"kg",cm:"cm",tap:"Toucher",noM:"Aucun",noA:"Aucun",noN:"Aucune",noC:"Aucun",warn:"⚕️ Pas un outil de diagnostic",pCard:"État",pCardFull:"Mon état de santé",fName:"Nom complet",bDate:"Naissance",age:"Âge",bType:"Groupe sanguin",allrg:"Allergies",chron:"Maladies chroniques",diag:"Diagnostic",xray:"Radio",mri:"IRM",ultra:"Échographie",lab:"Analyses",surg:"Chirurgie",insu:"Assurance",emCon:"Contact d'urgence",trash:"Corbeille",trD:"jours",rest:"Restaurer",empT:"Vider",trE:"Vide",q1:"Comment vous sentez-vous ?",q2:"Info médicament",q3:"Conseils",greet:"Bonjour ! Je suis AILVIE, votre assistant santé. 🌸 Comment puis-je aider ?",gm:"Bonjour",ga:"Bonsoir",hi:"Salut",emj:"Emoji",jan:"Jan",feb:"Fév",mar:"Mar",apr:"Avr",may:"Mai",jun:"Juin",jul:"Juil",aug:"Août",sep:"Sep",oct:"Oct",nov:"Nov",dec:"Déc",su:"Di",mo:"Lu",tu:"Ma",we:"Me",th:"Je",fr:"Ve",sa:"Sa",nNote:"Nouvelle",extA:"Applications externes",addApp:"App",cls:"Classe",usg:"Usage",sEff:"Effets secondaires",wrn:"Avertissements",intr:"Interactions",alarm:"Alarme",alarmSet:"Alarme réglée",alarmType:"Type",vibrate:"Vibration",ring:"Sonnerie",both:"Les deux",scanQR:"Scanner QR/code-barres",scanManual:"Saisir le code-barres",scanning:"Analyse...",scanFound:"Médicament trouvé !",scanNotFound:"Code-barres introuvable",stopScan:"Arrêter",barcodeNum:"Numéro de code-barres",scanAdd:"Ajouter par scan",profile:"Profil",login:"Connexion",logout:"Déconnexion",permissions:"Autorisations",subscription:"Abonnement",free:"Gratuit",premium:"Premium",legal:"Mentions légales",legalText:"AILVIE est un assistant santé IA. Les informations sont à titre indicatif uniquement, pas un avis médical. Consultez votre médecin.",about:"À propos",version:"Version",privPolicy:"Confidentialité",terms:"Conditions",notifPerm:"Notifications",locPerm:"Localisation",micPerm:"Microphone",camPerm:"Caméra",freePlan:"Fonctions de base gratuites",premPlan:"Chat IA illimité",entPlan:"Partage familial",enterprise:"Entreprise",monthly:"mois",loggedIn:"Connecté",loggedOut:"Déconnecté",gn:"Bonne nuit",feel:"comment vous sentez-vous ? J'espère que vous allez bien.",adminCh:"Support AILVIE",adminWelcome:"Message reçu.",voiceOn:"Dialogue vocal",wordLangPick:"Choisir la langue",appLock:"Verrouillage",appLockDesc:"Protéger par empreinte / reconnaissance faciale",lockSetup:"Configurer le verrouillage biométrique",lockOn:"Verrou actif",lockOff:"Verrou désactivé",unlockTitle:"AILVIE Verrouillé",unlockBtn:"Déverrouiller",unlockDesc:"Vérifiez votre identité pour continuer",lockEnabled:"Verrouillage activé 🔒",lockDisabled:"Verrouillage désactivé",lockFailed:"Échec de la vérification",lockNotSupported:"Votre appareil ne prend pas en charge le verrouillage biométrique",dataLocal:"Vos données sont stockées uniquement sur cet appareil"},pt:{app:"AILVIE",sl:"Assistente pessoal de saúde IA",home:"Início",meds:"Remédios",appts:"Consultas",health:"Dados",healthFull:"Meus dados de saúde",notes:"Notas",contacts:"Contatos",community:"Comunidade",chat:"AILVIE Chat",settings:"Configurações",notif:"Notificações",emergency:"EMERGÊNCIA",dark:"Modo escuro",light:"Modo claro",hc:"Contraste",fSize:"Fonte",lang:"Idioma",hScore:"Pontuação",bmi:"IMC",nMed:"Próximo",nAppt:"Próxima",addMed:"Adicionar",addAppt:"Adicionar",bookAppt:"Agendar",nm:"Nome",dose:"Dose",time:"Hora",taken:"Tomado",dr:"Médico",hosp:"Hospital",clin:"Clínica",date:"Data",up:"Próximas",past:"Passadas",pulse:"Pulso",wt:"Peso",ht:"Altura",bp:"Pressão",norm:"Normal",caut:"Atenção",save:"Salvar",del:"Excluir",add:"Adicionar",copy:"Copiar",pin:"Fixar",send:"Enviar",cancel:"Cancelar",drugR:"Reconhecimento",drugN:"Nome do remédio...",anlz:"Analisar",prog:"Progresso",addSys:"Sistema",dir:"Rota",loc:"IA Localização",emN:"Números de emergência",wr:"Escreva...",bpm:"bpm",kg:"kg",cm:"cm",tap:"Toque",noM:"Nenhum",noA:"Nenhuma",noN:"Nenhuma",noC:"Nenhum",warn:"⚕️ Não é ferramenta de diagnóstico",pCard:"Estado",pCardFull:"Meu estado de saúde",fName:"Nome completo",bDate:"Nascimento",age:"Idade",bType:"Tipo sanguíneo",allrg:"Alergias",chron:"Doenças crônicas",diag:"Diagnóstico",xray:"Raio-X",mri:"Ressonância",ultra:"Ultrassom",lab:"Exames",surg:"Cirurgias",insu:"Seguro",emCon:"Contato de emergência",trash:"Lixeira",trD:"dias",rest:"Restaurar",empT:"Esvaziar",trE:"Vazia",q1:"Como você está se sentindo?",q2:"Info do remédio",q3:"Dicas",greet:"Olá! Sou a AILVIE, sua assistente de saúde. 🌸 Como posso ajudar?",gm:"Bom dia",ga:"Boa noite",hi:"Olá",emj:"Emoji",jan:"Jan",feb:"Fev",mar:"Mar",apr:"Abr",may:"Mai",jun:"Jun",jul:"Jul",aug:"Ago",sep:"Set",oct:"Out",nov:"Nov",dec:"Dez",su:"Dom",mo:"Seg",tu:"Ter",we:"Qua",th:"Qui",fr:"Sex",sa:"Sáb",nNote:"Nova",extA:"Aplicativos externos",addApp:"App",cls:"Classe",usg:"Uso",sEff:"Efeitos colaterais",wrn:"Avisos",intr:"Interações",alarm:"Alarme",alarmSet:"Alarme definido",alarmType:"Tipo",vibrate:"Vibrar",ring:"Toque",both:"Ambos",scanQR:"Escanear QR/código de barras",scanManual:"Inserir código de barras",scanning:"Escaneando...",scanFound:"Remédio encontrado!",scanNotFound:"Código não encontrado",stopScan:"Parar",barcodeNum:"Número do código",scanAdd:"Adicionar por scan",profile:"Perfil",login:"Entrar",logout:"Sair",permissions:"Permissões",subscription:"Assinatura",free:"Grátis",premium:"Premium",legal:"Aviso legal",legalText:"AILVIE é um assistente de saúde com IA. As informações são apenas informativas, não substituem aconselhamento médico. Consulte seu médico.",about:"Sobre",version:"Versão",privPolicy:"Privacidade",terms:"Termos",notifPerm:"Notificações",locPerm:"Localização",micPerm:"Microfone",camPerm:"Câmera",freePlan:"Funções básicas grátis",premPlan:"Chat IA ilimitado",entPlan:"Compartilhamento familiar",enterprise:"Empresarial",monthly:"mês",loggedIn:"Conectado",loggedOut:"Desconectado",gn:"Boa noite",feel:"como você está se sentindo? Espero que esteja bem.",adminCh:"Suporte AILVIE",adminWelcome:"Mensagem recebida.",voiceOn:"Diálogo por voz",wordLangPick:"Selecionar idioma",appLock:"Bloqueio do app",appLockDesc:"Proteger com impressão digital / reconhecimento facial",lockSetup:"Configurar bloqueio biométrico",lockOn:"Bloqueio ativo",lockOff:"Bloqueio desligado",unlockTitle:"AILVIE Bloqueado",unlockBtn:"Desbloquear",unlockDesc:"Verifique sua identidade para continuar",lockEnabled:"Bloqueio ativado 🔒",lockDisabled:"Bloqueio desativado",lockFailed:"Falha na verificação",lockNotSupported:"Seu dispositivo não suporta bloqueio biométrico",dataLocal:"Seus dados são armazenados apenas neste dispositivo"},id:{app:"AILVIE",sl:"Asisten Kesehatan Pribadi AI",home:"Beranda",meds:"Obat",appts:"Janji",health:"Data",healthFull:"Data Kesehatan Saya",notes:"Catatan",contacts:"Kontak",community:"Komunitas",chat:"AILVIE Chat",settings:"Pengaturan",notif:"Notifikasi",emergency:"DARURAT",dark:"Mode gelap",light:"Mode terang",hc:"Kontras",fSize:"Font",lang:"Bahasa",hScore:"Skor",bmi:"IMT",nMed:"Berikutnya",nAppt:"Berikutnya",addMed:"Tambah",addAppt:"Tambah",bookAppt:"Buat janji",nm:"Nama",dose:"Dosis",time:"Waktu",taken:"Diminum",dr:"Dokter",hosp:"Rumah Sakit",clin:"Klinik",date:"Tanggal",up:"Mendatang",past:"Lampau",pulse:"Nadi",wt:"Berat",ht:"Tinggi",bp:"Tekanan Darah",norm:"Normal",caut:"Perhatian",save:"Simpan",del:"Hapus",add:"Tambah",copy:"Salin",pin:"Sematkan",send:"Kirim",cancel:"Batal",drugR:"Pengenalan",drugN:"Nama obat...",anlz:"Analisis",prog:"Kemajuan",addSys:"Sistem",dir:"Rute",loc:"AI Lokasi",emN:"Nomor darurat",wr:"Tulis...",bpm:"bpm",kg:"kg",cm:"cm",tap:"Ketuk",noM:"Tidak ada",noA:"Tidak ada",noN:"Tidak ada",noC:"Tidak ada",warn:"⚕️ Bukan alat diagnosis",pCard:"Status",pCardFull:"Status Kesehatan Saya",fName:"Nama Lengkap",bDate:"Tgl Lahir",age:"Usia",bType:"Gol. Darah",allrg:"Alergi",chron:"Penyakit Kronis",diag:"Diagnosis",xray:"Rontgen",mri:"MRI",ultra:"USG",lab:"Hasil Lab",surg:"Operasi",insu:"Asuransi",emCon:"Kontak Darurat",trash:"Sampah",trD:"hari",rest:"Pulihkan",empT:"Kosongkan",trE:"Kosong",q1:"Bagaimana perasaan Anda?",q2:"Info obat",q3:"Tips",greet:"Halo! Saya AILVIE, asisten kesehatan Anda. 🌸 Ada yang bisa saya bantu?",gm:"Selamat pagi",ga:"Selamat malam",hi:"Halo",emj:"Emoji",jan:"Jan",feb:"Feb",mar:"Mar",apr:"Apr",may:"Mei",jun:"Jun",jul:"Jul",aug:"Agu",sep:"Sep",oct:"Okt",nov:"Nov",dec:"Des",su:"Min",mo:"Sen",tu:"Sel",we:"Rab",th:"Kam",fr:"Jum",sa:"Sab",nNote:"Baru",extA:"Aplikasi Eksternal",addApp:"Aplikasi",cls:"Kelas",usg:"Kegunaan",sEff:"Efek Samping",wrn:"Peringatan",intr:"Interaksi",alarm:"Alarm",alarmSet:"Alarm Diatur",alarmType:"Tipe",vibrate:"Getar",ring:"Nada",both:"Keduanya",scanQR:"Pindai QR/Barcode",scanManual:"Masukkan Barcode",scanning:"Memindai...",scanFound:"Obat Ditemukan!",scanNotFound:"Barcode tidak ditemukan",stopScan:"Berhenti",barcodeNum:"Nomor Barcode",scanAdd:"Tambah dengan Pindai",profile:"Profil",login:"Masuk",logout:"Keluar",permissions:"Izin",subscription:"Langganan",free:"Gratis",premium:"Premium",legal:"Pemberitahuan Hukum",legalText:"AILVIE adalah asisten kesehatan AI. Informasi hanya untuk tujuan informasi, bukan nasihat medis. Konsultasikan dengan dokter Anda.",about:"Tentang",version:"Versi",privPolicy:"Privasi",terms:"Ketentuan",notifPerm:"Notifikasi",locPerm:"Lokasi",micPerm:"Mikrofon",camPerm:"Kamera",freePlan:"Fitur dasar gratis",premPlan:"Chat AI tanpa batas",entPlan:"Berbagi keluarga",enterprise:"Perusahaan",monthly:"bulan",loggedIn:"Masuk",loggedOut:"Keluar",gn:"Selamat tidur",feel:"bagaimana perasaan Anda? Semoga Anda baik-baik saja.",adminCh:"Dukungan AILVIE",adminWelcome:"Pesan diterima.",voiceOn:"Dialog Suara",wordLangPick:"Pilih Bahasa",appLock:"Kunci Aplikasi",appLockDesc:"Lindungi dengan sidik jari / pengenalan wajah",lockSetup:"Atur Kunci Biometrik",lockOn:"Kunci Aktif",lockOff:"Kunci Mati",unlockTitle:"AILVIE Terkunci",unlockBtn:"Buka Kunci",unlockDesc:"Verifikasi identitas Anda untuk melanjutkan",lockEnabled:"Kunci aplikasi diaktifkan 🔒",lockDisabled:"Kunci aplikasi dinonaktifkan",lockFailed:"Verifikasi gagal",lockNotSupported:"Perangkat Anda tidak mendukung kunci biometrik",dataLocal:"Data Anda hanya disimpan di perangkat ini"},bn:{app:"AILVIE",sl:"ব্যক্তিগত এআই স্বাস্থ্য সহকারী",home:"হোম",meds:"ওষুধ",appts:"অ্যাপয়েন্টমেন্ট",health:"তথ্য",healthFull:"আমার স্বাস্থ্য তথ্য",notes:"নোট",contacts:"পরিচিতি",community:"সম্প্রদায়",chat:"AILVIE চ্যাট",settings:"সেটিংস",notif:"বিজ্ঞপ্তি",emergency:"জরুরি",dark:"ডার্ক মোড",light:"লাইট মোড",hc:"কনট্রাস্ট",fSize:"ফন্ট",lang:"ভাষা",hScore:"স্কোর",bmi:"বিএমআই",nMed:"পরবর্তী",nAppt:"পরবর্তী",addMed:"যোগ করুন",addAppt:"যোগ করুন",bookAppt:"বুক করুন",nm:"নাম",dose:"ডোজ",time:"সময়",taken:"নেওয়া হয়েছে",dr:"ডাক্তার",hosp:"হাসপাতাল",clin:"ক্লিনিক",date:"তারিখ",up:"আসন্ন",past:"অতীত",pulse:"নাড়ি",wt:"ওজন",ht:"উচ্চতা",bp:"রক্তচাপ",norm:"স্বাভাবিক",caut:"সতর্কতা",save:"সংরক্ষণ",del:"মুছুন",add:"যোগ",copy:"কপি",pin:"পিন",send:"পাঠান",cancel:"বাতিল",drugR:"শনাক্তকরণ",drugN:"ওষুধের নাম...",anlz:"বিশ্লেষণ",prog:"অগ্রগতি",addSys:"সিস্টেম",dir:"পথ",loc:"এআই অবস্থান",emN:"জরুরি নম্বর",wr:"লিখুন...",bpm:"bpm",kg:"কেজি",cm:"সেমি",tap:"ট্যাপ",noM:"নেই",noA:"নেই",noN:"নেই",noC:"নেই",warn:"⚕️ রোগ নির্ণয়ের সরঞ্জাম নয়",pCard:"অবস্থা",pCardFull:"আমার স্বাস্থ্য অবস্থা",fName:"পুরো নাম",bDate:"জন্ম তারিখ",age:"বয়স",bType:"রক্তের গ্রুপ",allrg:"অ্যালার্জি",chron:"দীর্ঘস্থায়ী রোগ",diag:"রোগ নির্ণয়",xray:"এক্স-রে",mri:"এমআরআই",ultra:"আল্ট্রাসাউন্ড",lab:"ল্যাব",surg:"সার্জারি",insu:"বীমা",emCon:"জরুরি যোগাযোগ",trash:"ট্র্যাশ",trD:"দিন",rest:"পুনরুদ্ধার",empT:"খালি করুন",trE:"খালি",q1:"আপনি কেমন অনুভব করছেন?",q2:"ওষুধের তথ্য",q3:"পরামর্শ",greet:"হ্যালো! আমি AILVIE, আপনার স্বাস্থ্য সহকারী। 🌸 কীভাবে সাহায্য করতে পারি?",gm:"সুপ্রভাত",ga:"শুভ সন্ধ্যা",hi:"হ্যালো",emj:"ইমোজি",jan:"জান",feb:"ফেব",mar:"মার্চ",apr:"এপ্রিল",may:"মে",jun:"জুন",jul:"জুলাই",aug:"আগ",sep:"সেপ",oct:"অক্টো",nov:"নভে",dec:"ডিসে",su:"রবি",mo:"সোম",tu:"মঙ্গল",we:"বুধ",th:"বৃহ",fr:"শুক্র",sa:"শনি",nNote:"নতুন",extA:"বাহ্যিক অ্যাপ",addApp:"অ্যাপ",cls:"শ্রেণি",usg:"ব্যবহার",sEff:"পার্শ্বপ্রতিক্রিয়া",wrn:"সতর্কতা",intr:"মিথস্ক্রিয়া",alarm:"অ্যালার্ম",alarmSet:"সেট",alarmType:"ধরন",vibrate:"কম্পন",ring:"রিং",both:"উভয়",scanQR:"QR/বারকোড স্ক্যান",scanManual:"বারকোড লিখুন",scanning:"স্ক্যান হচ্ছে...",scanFound:"ওষুধ পাওয়া গেছে!",scanNotFound:"বারকোড পাওয়া যায়নি",stopScan:"বন্ধ করুন",barcodeNum:"বারকোড নম্বর",scanAdd:"স্ক্যান করে যোগ করুন",profile:"প্রোফাইল",login:"লগইন",logout:"লগআউট",permissions:"অনুমতি",subscription:"সাবস্ক্রিপশন",free:"বিনামূল্যে",premium:"প্রিমিয়াম",legal:"আইনি বিজ্ঞপ্তি",legalText:"AILVIE একটি এআই স্বাস্থ্য সহকারী। তথ্য শুধুমাত্র তথ্যের উদ্দেশ্যে, চিকিৎসা পরামর্শ নয়। আপনার ডাক্তারের সাথে পরামর্শ করুন।",about:"সম্পর্কে",version:"সংস্করণ",privPolicy:"গোপনীয়তা",terms:"শর্তাবলী",notifPerm:"বিজ্ঞপ্তি",locPerm:"অবস্থান",micPerm:"মাইক্রোফোন",camPerm:"ক্যামেরা",freePlan:"মৌলিক বৈশিষ্ট্য বিনামূল্যে",premPlan:"সীমাহীন এআই চ্যাট",entPlan:"পারিবারিক শেয়ারিং",enterprise:"এন্টারপ্রাইজ",monthly:"মাস",loggedIn:"লগইন হয়েছে",loggedOut:"লগআউট হয়েছে",gn:"শুভ রাত্রি",feel:"আপনি কেমন অনুভব করছেন? আশা করি আপনি ভালো আছেন।",adminCh:"AILVIE সাপোর্ট",adminWelcome:"বার্তা পেয়েছি।",voiceOn:"ভয়েস ডায়ালগ",wordLangPick:"ভাষা নির্বাচন",appLock:"অ্যাপ লক",appLockDesc:"আঙুলের ছাপ / ফেস আইডি দিয়ে সুরক্ষিত করুন",lockSetup:"বায়োমেট্রিক লক সেট করুন",lockOn:"লক সক্রিয়",lockOff:"লক বন্ধ",unlockTitle:"AILVIE লক করা",unlockBtn:"আনলক",unlockDesc:"চালিয়ে যেতে আপনার পরিচয় যাচাই করুন",lockEnabled:"অ্যাপ লক সক্রিয় 🔒",lockDisabled:"অ্যাপ লক নিষ্ক্রিয়",lockFailed:"যাচাই ব্যর্থ",lockNotSupported:"আপনার ডিভাইস বায়োমেট্রিক লক সমর্থন করে না",dataLocal:"আপনার ডেটা শুধুমাত্র এই ডিভাইসে সংরক্ষিত"}};

const GLOBE_IMG="/globe.png";
const LL_NATIVE={tr:"Türkçe",en:"English",de:"Deutsch",ru:"Русский",zh:"中文",hi:"हिन्दी",nl:"Nederlands",es:"Español",ar:"العربية",fr:"Français",pt:"Português",id:"Bahasa Indonesia",bn:"বাংলা"};
// Extended language pool for Word of Day + Translation — 60 languages with flag codes
const EXT_LANGS=[
  {k:"tr",n:"Türkçe",flag:"tr",code:"tr"},
  {k:"en",n:"English (US)",flag:"us",code:"en"},
  {k:"gb",n:"English (UK)",flag:"gb",code:"en-GB"},
  {k:"de",n:"Deutsch",flag:"de",code:"de"},
  {k:"fr",n:"Français",flag:"fr",code:"fr"},
  {k:"es",n:"Español",flag:"es",code:"es"},
  {k:"mx",n:"Español (MX)",flag:"mx",code:"es-MX"},
  {k:"esar",n:"Español (AR)",flag:"arg",code:"es-AR"},
  {k:"it",n:"Italiano",flag:"it",code:"it"},
  {k:"pt",n:"Português (PT)",flag:"pt",code:"pt-PT"},
  {k:"br",n:"Português (BR)",flag:"br",code:"pt-BR"},
  {k:"ru",n:"Русский",flag:"ru",code:"ru"},
  {k:"ua",n:"Українська",flag:"ua",code:"uk"},
  {k:"zh",n:"中文 (简体)",flag:"cn",code:"zh-CN"},
  {k:"tw",n:"中文 (繁體)",flag:"tw",code:"zh-TW"},
  {k:"ja",n:"日本語",flag:"jp",code:"ja"},
  {k:"ko",n:"한국어",flag:"kr",code:"ko"},
  {k:"ar",n:"العربية",flag:"sa",code:"ar"},
  {k:"areg",n:"العربية (Mısır)",flag:"eg",code:"ar-EG"},
  {k:"hi",n:"हिन्दी",flag:"in",code:"hi"},
  {k:"bn",n:"বাংলা",flag:"bd",code:"bn"},
  {k:"ur",n:"اردو",flag:"pk",code:"ur"},
  {k:"fa",n:"فارسی",flag:"ir",code:"fa"},
  {k:"he",n:"עברית",flag:"il",code:"he"},
  {k:"nl",n:"Nederlands",flag:"nl",code:"nl"},
  {k:"pl",n:"Polski",flag:"pl",code:"pl"},
  {k:"sv",n:"Svenska",flag:"se",code:"sv"},
  {k:"no",n:"Norsk",flag:"no",code:"no"},
  {k:"fi",n:"Suomi",flag:"fi",code:"fi"},
  {k:"da",n:"Dansk",flag:"dk",code:"da"},
  {k:"el",n:"Ελληνικά",flag:"gr",code:"el"},
  {k:"cs",n:"Čeština",flag:"cz",code:"cs"},
  {k:"sk",n:"Slovenčina",flag:"sk",code:"sk"},
  {k:"hu",n:"Magyar",flag:"hu",code:"hu"},
  {k:"ro",n:"Română",flag:"ro",code:"ro"},
  {k:"bg",n:"Български",flag:"bg",code:"bg"},
  {k:"hr",n:"Hrvatski",flag:"hr",code:"hr"},
  {k:"sr",n:"Srpski",flag:"rs",code:"sr"},
  {k:"sl",n:"Slovenščina",flag:"si",code:"sl"},
  {k:"ga",n:"Gaeilge",flag:"ie",code:"ga"},
  {k:"is",n:"Íslenska",flag:"is",code:"is"},
  {k:"id",n:"Bahasa Indonesia",flag:"id",code:"id"},
  {k:"ms",n:"Bahasa Melayu",flag:"my",code:"ms"},
  {k:"th",n:"ไทย",flag:"th",code:"th"},
  {k:"vi",n:"Tiếng Việt",flag:"vn",code:"vi"},
  {k:"tl",n:"Filipino",flag:"ph",code:"tl"},
  {k:"az",n:"Azərbaycan",flag:"az",code:"az"},
  {k:"ka",n:"ქართული",flag:"ge",code:"ka"},
  {k:"hy",n:"Հայերեն",flag:"am",code:"hy"},
  {k:"arma",n:"العربية (Fas)",flag:"ma",code:"ar-MA"},
  {k:"sw",n:"Kiswahili",flag:"ke",code:"sw"},
  {k:"ha",n:"Hausa",flag:"ng",code:"ha"},
  {k:"af",n:"Afrikaans",flag:"za",code:"af"},
  {k:"amh",n:"አማርኛ (Amharca)",flag:"et",code:"am"},
  {k:"yo",n:"Yorùbá",flag:"ng",code:"yo"},
  {k:"ca",n:"Català",flag:"cat",code:"ca"},
  {k:"eu",n:"Euskara",flag:"eus",code:"eu"},
  {k:"gl",n:"Galego",flag:"gal",code:"gl"},
  {k:"lt",n:"Lietuvių",flag:"lt",code:"lt"},
  {k:"lv",n:"Latviešu",flag:"lv",code:"lv"},
  {k:"et",n:"Eesti",flag:"ee",code:"et"},
  {k:"mt",n:"Malti",flag:"mt",code:"mt"},
  {k:"cy",n:"Cymraeg",flag:"wls",code:"cy"}
];
const LL_LOCAL={
tr:{tr:"Türkçe",en:"İngilizce",de:"Almanca",ru:"Rusça",zh:"Çince",hi:"Hintçe",nl:"Felemenkçe",es:"İspanyolca",ar:"Arapça",fr:"Fransızca",pt:"Portekizce",id:"Endonezce",bn:"Bengalce"},
en:{tr:"Turkish",en:"English",de:"German",ru:"Russian",zh:"Chinese",hi:"Hindi",nl:"Dutch",es:"Spanish",ar:"Arabic",fr:"French",pt:"Portuguese",id:"Indonesian",bn:"Bengali"},
de:{tr:"Türkisch",en:"Englisch",de:"Deutsch",ru:"Russisch",zh:"Chinesisch",hi:"Hindi",nl:"Niederländisch",es:"Spanisch",ar:"Arabisch",fr:"Französisch",pt:"Portugiesisch",id:"Indonesisch",bn:"Bengalisch"},
ru:{tr:"Турецкий",en:"Английский",de:"Немецкий",ru:"Русский",zh:"Китайский",hi:"Хинди",nl:"Нидерландский",es:"Испанский",ar:"Арабский",fr:"Французский",pt:"Португальский",id:"Индонезийский",bn:"Бенгальский"},
zh:{tr:"土耳其语",en:"英语",de:"德语",ru:"俄语",zh:"中文",hi:"印地语",nl:"荷兰语",es:"西班牙语",ar:"阿拉伯语",fr:"法语",pt:"葡萄牙语",id:"印尼语",bn:"孟加拉语"},
hi:{tr:"तुर्की",en:"अंग्रेज़ी",de:"जर्मन",ru:"रूसी",zh:"चीनी",hi:"हिन्दी",nl:"डच",es:"स्पेनिश",ar:"अरबी",fr:"फ़्रेंच",pt:"पुर्तगाली",id:"इंडोनेशियाई",bn:"बंगाली"},
nl:{tr:"Turks",en:"Engels",de:"Duits",ru:"Russisch",zh:"Chinees",hi:"Hindi",nl:"Nederlands",es:"Spaans",ar:"Arabisch",fr:"Frans",pt:"Portugees",id:"Indonesisch",bn:"Bengaals"},
es:{tr:"Turco",en:"Inglés",de:"Alemán",ru:"Ruso",zh:"Chino",hi:"Hindi",nl:"Neerlandés",es:"Español",ar:"Árabe",fr:"Francés",pt:"Portugués",id:"Indonesio",bn:"Bengalí"},
ar:{tr:"تركية",en:"إنجليزية",de:"ألمانية",ru:"روسية",zh:"صينية",hi:"هندية",nl:"هولندية",es:"إسبانية",ar:"عربية",fr:"الفرنسية",pt:"البرتغالية",id:"الإندونيسية",bn:"البنغالية"},
fr:{tr:"Turc",en:"Anglais",de:"Allemand",ru:"Russe",zh:"Chinois",hi:"Hindi",nl:"Néerlandais",es:"Espagnol",ar:"Arabe",fr:"Français",pt:"Portugais",id:"Indonésien",bn:"Bengali"},
pt:{tr:"Turco",en:"Inglês",de:"Alemão",ru:"Russo",zh:"Chinês",hi:"Hindi",nl:"Holandês",es:"Espanhol",ar:"Árabe",fr:"Francês",pt:"Português",id:"Indonésio",bn:"Bengali"},
id:{tr:"Turki",en:"Inggris",de:"Jerman",ru:"Rusia",zh:"Tionghoa",hi:"Hindi",nl:"Belanda",es:"Spanyol",ar:"Arab",fr:"Prancis",pt:"Portugis",id:"Indonesia",bn:"Bengali"},
bn:{tr:"তুর্কি",en:"ইংরেজি",de:"জার্মান",ru:"রুশ",zh:"চীনা",hi:"হিন্দি",nl:"ডাচ",es:"স্প্যানিশ",ar:"আরবি",fr:"ফরাসি",pt:"পর্তুগিজ",id:"ইন্দোনেশীয়",bn:"বাংলা"}
};
const LL=LL_NATIVE;
// ---------- HTML sanitizer for user-authored rich-text notes (XSS defense) ----------
// Notes are stored as contentEditable innerHTML and re-rendered via dangerouslySetInnerHTML.
// This strips anything that could execute script — from typed, pasted, imported or synced
// content — while keeping normal formatting tags. querySelectorAll catches nested cases.
const sanitizeHTML=(html)=>{try{
  const doc=new DOMParser().parseFromString(String(html||""),"text/html");
  doc.querySelectorAll("script,style,iframe,object,embed,link,meta,base,form,input,button,textarea,select,svg,math,frame,frameset,applet,noscript,template").forEach(e=>e.remove());
  doc.querySelectorAll("*").forEach(el=>{
    for(const at of [...el.attributes]){
      const n=at.name.toLowerCase();
      const v=(at.value||"").replace(/[\s\u0000-\u001f]+/g,"").toLowerCase();
      if(n.startsWith("on")||n==="srcdoc"||n==="formaction") el.removeAttribute(at.name);
      else if((n==="href"||n==="xlink:href")&&/^(javascript|vbscript|data):/.test(v)) el.removeAttribute(at.name);
      else if(n==="src"&&/^(javascript|vbscript):/.test(v)) el.removeAttribute(at.name);
      else if(n==="src"&&/^data:/.test(v)&&!/^data:image\//.test(v)) el.removeAttribute(at.name);
      else if(n==="style"&&/(expression|javascript:|vbscript:|url\()/i.test(at.value)) el.removeAttribute(at.name);
    }
    if(el.tagName==="A"){el.setAttribute("rel","noopener noreferrer nofollow");el.setAttribute("target","_blank");}
  });
  return doc.body.innerHTML;
}catch(e){return String(html||"").replace(/<[^>]+>/g,"");}};
const LC={tr:"tr-TR",en:"en-US",de:"de-DE",ru:"ru-RU",zh:"zh-CN",hi:"hi-IN",nl:"nl-NL",es:"es-ES",ar:"ar-SA",fr:"fr-FR",pt:"pt-BR",id:"id-ID",bn:"bn-BD"};

// Drug DB (60 drugs, TR+EN)
const DR={paracetamol:{tr:"Analjezik/Antipiretik|Ağrı, ateş|500-1000mg 4-6 saat|Karaciğer hasarı (yüksek doz)|Günlük 4g aşılmamalı|Warfarin",en:"Analgesic|Pain, fever|500-1000mg q4-6h|Liver damage|Max 4g/day|Warfarin"},ibuprofen:{tr:"NSAİİ|Ağrı, iltihap, ateş|200-400mg 4-6 saat|Mide rahatsızlığı|Ülser/böbrek dikkat|Aspirin, Warfarin",en:"NSAID|Pain, inflammation|200-400mg q4-6h|GI upset|Avoid w/ ulcers|Aspirin, Warfarin"},aspirin:{tr:"NSAİİ/Antiplatelet|Ağrı, kan sulandırıcı|300-900mg 4-6 saat|Mide kanaması|16 yaş altı hayır|Warfarin",en:"NSAID|Pain, blood thin|300-900mg q4-6h|GI bleeding|Not <16|Warfarin"},amoxicillin:{tr:"Antibiyotik|Bakteri enfeksiyonları|250-500mg 8 saat|İshal, döküntü|Penisilin alerjisi|Warfarin",en:"Antibiotic|Bacterial infections|250-500mg q8h|Diarrhea, rash|Penicillin allergy|Warfarin"},metformin:{tr:"Biguanid|Tip 2 diyabet|500-2000mg/gün|Mide bulantısı|Böbrek izlenmeli|Alkol",en:"Biguanide|Type 2 diabetes|500-2000mg/day|GI upset|Monitor kidneys|Alcohol"},omeprazole:{tr:"PPI|Mide asidi, ülser|20-40mg/gün|Baş ağrısı, ishal|Uzun süreli: kemik|Klopidogrel",en:"PPI|Acid reflux, ulcers|20-40mg/day|Headache|Long-term: bones|Clopidogrel"},epixx:{tr:"Antiepileptik (Levetirasetam)|Epilepsi, nöbet önleme|250-1500mg günde 2x|Uyuşukluk, baş dönmesi, sinirlilik|Böbrekte doz ayarı. Ani kesilmemeli|Fenitoin",en:"Antiepileptic (Levetiracetam)|Epilepsy|250-1500mg BID|Drowsiness, dizziness|Adjust in renal. Don't stop abruptly|Phenytoin"},levetiracetam:{tr:"Antiepileptik|Epilepsi|250-1500mg 2x/gün|Uyuşukluk, davranış değişikliği|Ani bırakmayın|Metotreksat",en:"Antiepileptic|Epilepsy|250-1500mg BID|Drowsiness, mood|Don't stop abruptly|Methotrexate"},losartan:{tr:"ARB|Hipertansiyon|50-100mg/gün|Baş dönmesi, hiperkalemi|Gebelikte hayır|NSAİİ, Potasyum",en:"ARB|Hypertension|50-100mg/day|Dizziness|Not in pregnancy|NSAIDs"},atorvastatin:{tr:"Statin|Yüksek kolesterol|10-80mg/gün|Kas ağrısı|Karaciğer izlenmeli|Greyfurt",en:"Statin|Cholesterol|10-80mg/day|Muscle pain|Monitor liver|Grapefruit"},metoprolol:{tr:"Beta-bloker|Hipertansiyon, anjina|25-200mg/gün|Yorgunluk, bradikardi|Ani kesilmemeli|Verapamil",en:"Beta-blocker|Hypertension|25-200mg/day|Fatigue|Don't stop abruptly|Verapamil"},amlodipine:{tr:"KKB|Hipertansiyon, anjina|5-10mg/gün|Ödem, baş dönmesi|Karaciğer dikkat|Simvastatin",en:"CCB|Hypertension|5-10mg/day|Edema, dizziness|Caution liver|Simvastatin"},lisinopril:{tr:"ACE İnh.|Hipertansiyon|10-40mg/gün|Kuru öksürük|Gebelikte hayır|NSAİİ",en:"ACE Inh|Hypertension|10-40mg/day|Dry cough|Not in pregnancy|NSAIDs"},sertralin:{tr:"SSRI|Depresyon, anksiyete, OKB|50-200mg/gün|Bulantı, uyku bozukluğu|Gençlerde intihar riski. Ani kesilmemeli|MAO inh., Tramadol",en:"SSRI|Depression, anxiety|50-200mg/day|Nausea, insomnia|Suicide risk in youth|MAOIs"},gabapentin:{tr:"Antiepileptik|Nöropatik ağrı, epilepsi|300-3600mg/gün|Uyuşukluk, kilo alımı|Böbrekte doz ayarı|Morfin, Alkol",en:"Anticonvulsant|Neuropathic pain|300-3600mg/day|Drowsiness|Adjust in renal|Morphine"},ramipril:{tr:"ACE İnh.|Hipertansiyon, kalp koruma|1.25-10mg/gün|Öksürük, hiperkalemi|Gebelikte hayır|NSAİİ, Lityum",en:"ACE Inh|Hypertension|1.25-10mg/day|Cough|Not in pregnancy|NSAIDs"},pantoprazole:{tr:"PPI|Reflü, ülser|20-40mg/gün|Baş ağrısı|Uzun kullanım: B12 eksikliği|Metotreksat",en:"PPI|GERD|20-40mg/day|Headache|Long-term: B12|Methotrexate"},dexketoprofen:{tr:"NSAİİ|Akut ağrı, diş ağrısı|12.5-25mg 8 saat|Mide ağrısı|Ülser dikkat. Maks 3 gün IV|Warfarin",en:"NSAID|Acute pain|12.5-25mg q8h|GI upset|Caution ulcers|Warfarin"},diklofenak:{tr:"NSAİİ|Ağrı, romatizma|50-150mg/gün|Mide kanaması|KV risk artabilir|ACE inh., Warfarin",en:"NSAID|Pain, arthritis|50-150mg/day|GI bleeding|CV risk|ACE inh, Warfarin"},pregabalin:{tr:"Antiepileptik|Nöropatik ağrı, fibromiyalji|150-600mg/gün|Baş dönmesi, kilo alımı|Bağımlılık riski. Ani kesilmemeli|Opioidler",en:"Anticonvulsant|Neuropathic pain|150-600mg/day|Dizziness, weight|Dependence risk|Opioids"},clopidogrel:{tr:"Antiplatelet|Kalp krizi/inme önleme|75mg/gün|Kanama, morluk|Aktif kanamada hayır|Omeprazol",en:"Antiplatelet|Heart/stroke prevention|75mg/day|Bleeding|Not w/ active bleed|Omeprazole"},furosemide:{tr:"Diüretik|Ödem, kalp yetmezliği|20-80mg/gün|Dehidrasyon, elektrolit|Potasyum takibi|Digoksin",en:"Diuretic|Edema, heart failure|20-80mg/day|Dehydration|Monitor K+|Digoxin"},"vitamin d":{tr:"Vitamin|D vitamini eksikliği, kemik|800-4000 IU/gün|Hiperkalsemi (aşırı doz)|Böbrek dikkat|Tiazidler",en:"Supplement|Vit D deficiency|800-4000 IU/day|Hypercalcemia|Caution kidneys|Thiazides"},lansoprazole:{tr:"PPI|Ülser, reflü|15-30mg/gün|Baş ağrısı, ishal|Uzun süre: Mg eksikliği|Klopidogrel",en:"PPI|Ulcers, reflux|15-30mg/day|Headache|Long-term: low Mg|Clopidogrel"},aferin:{tr:"Soğuk algınlığı kombinasyon|Grip, soğuk algınlığı|6-8 saatte bir|Uyku hali, ağız kuruluğu|Karaciğer hastalarında dikkat|Alkol, MAO İnh.",en:"Cold/flu combination|Cold, flu|q6-8h|Drowsiness, dry mouth|Caution liver|Alcohol, MAOIs"},augmentin:{tr:"Antibiyotik (Amoksisilin+Klavulanik)|Bakteri enfeksiyonları|625-1000mg 12 saat|İshal, döküntü|Penisilin alerjisi|Warfarin",en:"Antibiotic (Amox+Clav)|Bacterial infections|625-1000mg q12h|Diarrhea|Penicillin allergy|Warfarin"},cipro:{tr:"Antibiyotik (Siprofloksasin)|İdrar yolu, solunum|250-750mg 12 saat|Tendon yırtılma|Süt ürünleriyle alma|Teofilin",en:"Antibiotic (Ciprofloxacin)|UTI, respiratory|250-750mg q12h|Tendon rupture|Avoid dairy|Theophylline"},simvastatin:{tr:"Statin|Kolesterol|10-40mg/gün akşam|Kas ağrısı|Greyfurt alma|Amlodipin, Warfarin",en:"Statin|Cholesterol|10-40mg nightly|Muscle pain|No grapefruit|Amlodipine"},rosuvastatin:{tr:"Statin|Kolesterol|5-40mg/gün|Kas ağrısı, karaciğer|Böbrek dikkat|Warfarin",en:"Statin|Cholesterol|5-40mg/day|Muscle pain|Caution kidneys|Warfarin"},ezetimibe:{tr:"Kolesterol emilim inh.|Yüksek kolesterol|10mg/gün|Karın ağrısı|Karaciğer takibi|Fibratlar",en:"Cholesterol absorption inh|High cholesterol|10mg/day|Abd pain|Monitor liver|Fibrates"},warfarin:{tr:"Antikoagülan|Tromboz, kalp kapağı|2-10mg/gün INR göre|Kanama|INR düzenli takip|Aspirin, NSAİİ, yeşillik",en:"Anticoagulant|Thrombosis|2-10mg/day by INR|Bleeding|Monitor INR|Aspirin, NSAIDs"},"apixaban":{tr:"Antikoagülan (DOAK)|Atriyal fibrilasyon|5mg 2x/gün|Kanama|Böbrek dikkat|NSAİİ, Amiodaron",en:"Anticoagulant (DOAC)|AFib|5mg BID|Bleeding|Caution kidneys|NSAIDs"},"rivaroxaban":{tr:"Antikoagülan|Tromboz önleme|15-20mg/gün|Kanama|Böbrek takibi|NSAİİ, Antikonvulzan",en:"Anticoagulant|Thrombosis prevention|15-20mg/day|Bleeding|Monitor kidneys|NSAIDs"},insulin:{tr:"İnsülin|Diyabet|Bireysel|Hipoglisemi, kilo alımı|Şeker takibi|Alkol, Kortizon",en:"Insulin|Diabetes|Individual|Hypoglycemia|Monitor glucose|Alcohol, Steroids"},glipizid:{tr:"Sulfonilüre|Tip 2 diyabet|2.5-20mg/gün|Hipoglisemi|Karaciğer izlenmeli|Beta-blokerler",en:"Sulfonylurea|Type 2 diabetes|2.5-20mg/day|Hypoglycemia|Monitor liver|Beta-blockers"},citalopram:{tr:"SSRI|Depresyon|20-40mg/gün|Bulantı, uyku bozukluğu|QT uzaması riski|MAO inh., Tramadol",en:"SSRI|Depression|20-40mg/day|Nausea, insomnia|QT prolongation|MAOIs"},escitalopram:{tr:"SSRI|Depresyon, anksiyete|10-20mg/gün|Baş dönmesi|QT takibi|MAO inh.",en:"SSRI|Depression, anxiety|10-20mg/day|Dizziness|Monitor QT|MAOIs"},fluoksetin:{tr:"SSRI|Depresyon, OKB, panik|20-60mg/gün|Uykusuzluk, iştahsızlık|Ani kesme|MAO inh., Warfarin",en:"SSRI|Depression, OCD|20-60mg/day|Insomnia|No abrupt stop|MAOIs"},venlafaksin:{tr:"SNRI|Depresyon, anksiyete|75-225mg/gün|Bulantı, terleme|Kan basıncı takibi|MAO inh.",en:"SNRI|Depression, anxiety|75-225mg/day|Nausea, sweating|Monitor BP|MAOIs"},duloksetin:{tr:"SNRI|Depresyon, nöropatik ağrı|30-120mg/gün|Bulantı, baş dönmesi|Karaciğer dikkat|MAO inh., Varfarin",en:"SNRI|Depression, neuropathy|30-120mg/day|Nausea|Caution liver|MAOIs"},alprazolam:{tr:"Benzodiazepin|Anksiyete, panik|0.25-1mg 3x/gün|Bağımlılık, uyuşukluk|Kısa süre kullan|Alkol, Opioidler",en:"Benzodiazepine|Anxiety, panic|0.25-1mg TID|Dependence|Short-term|Alcohol, Opioids"},diazepam:{tr:"Benzodiazepin|Anksiyete, kas spazmı|2-10mg 2-4x/gün|Uyuşukluk|Bağımlılık|Alkol, Opioidler",en:"Benzodiazepine|Anxiety|2-10mg BID-QID|Drowsiness|Dependence|Alcohol, Opioids"},zopiklon:{tr:"Uyku ilacı|Uykusuzluk|3.75-7.5mg yatmadan|Metalik tat, uyku hali|Kısa süre|Alkol, Opioidler",en:"Sleep aid|Insomnia|3.75-7.5mg at bedtime|Metallic taste|Short-term|Alcohol"},tramadol:{tr:"Opioid analjezik|Orta-şiddetli ağrı|50-100mg 4-6 saat|Bulantı, uyuşukluk, bağımlılık|Nöbet eşiği düşebilir|SSRI, MAO inh.",en:"Opioid analgesic|Mod-severe pain|50-100mg q4-6h|Nausea, dependence|Lowers seizure threshold|SSRIs"},kodein:{tr:"Opioid|Öksürük, ağrı|15-60mg 4 saat|Kabızlık, bağımlılık|Solunum baskısı|Alkol",en:"Opioid|Cough, pain|15-60mg q4h|Constipation|Respiratory depression|Alcohol"},"vitamin b12":{tr:"Vitamin|B12 eksikliği, anemi|1000mcg/gün-IM|Nadir alerji|Kan takibi|Metformin",en:"Vitamin|B12 deficiency|1000mcg/day|Rare allergy|Monitor blood|Metformin"},folik:{tr:"Vitamin|Folat eksikliği, gebelik|400-1000mcg/gün|Nadir alerji|Gebelikte 600mcg|Fenitoin",en:"Vitamin|Folate deficiency|400-1000mcg/day|Rare allergy|600mcg in pregnancy|Phenytoin"},demir:{tr:"Mineral|Demir eksikliği anemisi|100-200mg/gün|Kabızlık, koyu dışkı|Aç karna|Kalsiyum, Kafein",en:"Mineral|Iron deficiency|100-200mg/day|Constipation|Take on empty stomach|Calcium"},kalsiyum:{tr:"Mineral|Kemik, osteoporoz|500-1200mg/gün|Kabızlık|Böbrek taşı riski|Tiazidler",en:"Mineral|Bone, osteoporosis|500-1200mg/day|Constipation|Kidney stone risk|Thiazides"},magnezyum:{tr:"Mineral|Kas krampı, migren|300-400mg/gün|İshal|Böbrek dikkat|Bifosfonatlar",en:"Mineral|Cramps, migraine|300-400mg/day|Diarrhea|Caution kidneys|Bisphosphonates"},"vitamin c":{tr:"Vitamin|Bağışıklık, antioksidan|500-1000mg/gün|İshal (yüksek doz)|Böbrek taşı riski|Kemoterapi",en:"Vitamin|Immunity|500-1000mg/day|Diarrhea|Kidney stone risk|Chemo"},levotiroksin:{tr:"Tiroid hormonu|Hipotiroidi|25-200mcg aç karnına|Kalp çarpıntısı|Gebelikte doz artışı|Kalsiyum, Demir",en:"Thyroid|Hypothyroidism|25-200mcg fasting|Palpitations|Increase in pregnancy|Calcium, Iron"},metimazol:{tr:"Antitiroid|Hipertiroidi|10-40mg/gün|Döküntü, agranülositoz|Kan sayımı|Warfarin",en:"Antithyroid|Hyperthyroidism|10-40mg/day|Rash, agranulocytosis|Monitor CBC|Warfarin"},salbutamol:{tr:"Kısa etkili β2|Astım, KOAH|100-200mcg inhaler|Çarpıntı, titreme|Kalp hastası dikkat|Beta-blokerler",en:"Short-acting β2|Asthma, COPD|100-200mcg inhaler|Palpitations|Caution heart|Beta-blockers"},budesonid:{tr:"İnhale kortikosteroid|Astım|100-800mcg 2x/gün|Ses kısıklığı, pamukçuk|Ağızı çalkala|—",en:"Inhaled steroid|Asthma|100-800mcg BID|Hoarseness, thrush|Rinse mouth|—"},montelukast:{tr:"Lökotrien reseptör antagonisti|Astım, alerji|10mg/gün akşam|Ruh hali değişikliği|Psikiyatrik yan etki takibi|Fenobarbital",en:"Leukotriene antagonist|Asthma, allergy|10mg nightly|Mood changes|Monitor mood|Phenobarbital"},loratadin:{tr:"Antihistaminik|Alerji, ürtiker|10mg/gün|Baş ağrısı, yorgunluk|—|—",en:"Antihistamine|Allergy|10mg/day|Headache|—|—"},setirizin:{tr:"Antihistaminik|Alerji, kaşıntı|10mg/gün|Uyku hali|Böbrekte doz ayarı|Alkol",en:"Antihistamine|Allergy|10mg/day|Drowsy|Adjust in renal|Alcohol"},feksofenadin:{tr:"Antihistaminik|Alerji|120-180mg/gün|Baş ağrısı|Aç karna alma|Antasitler",en:"Antihistamine|Allergy|120-180mg/day|Headache|Take on empty|Antacids"},siklosporin:{tr:"İmmünosupresif|Transplant, romatizma|2.5-5mg/kg/gün|Böbrek hasarı, tansiyon|Kan seviyesi takibi|Statinler, NSAİİ",en:"Immunosuppressant|Transplant|2.5-5mg/kg/day|Kidney damage|Monitor levels|Statins"}};
function pD(s){const p=s.split("|");return{class:p[0]||"-",usage:p[1]||"-",dose:p[2]||"-",sideEffects:p[3]||"-",warnings:p[4]||"-",interactions:p[5]||"-"};}
function apiHeaders(key){const h={"Content-Type":"application/json"};if(key){h["x-api-key"]=key;h["anthropic-dangerous-direct-browser-access"]="true";}return h;}
const _sleep=(ms)=>new Promise(r=>setTimeout(r,ms));
async function callAI(body,apiKey){
  // The server proxy already retries transient upstream failures. The client adds a SECOND, thin
  // safety net for the network path to the proxy itself (mobile connections drop). We retry the
  // proxy up to 3 times on transient failures, then fall back to a user key if one exists.
  let lastProxyErr=null, lastStatus=0, retryable=false;
  for(let attempt=0;attempt<3;attempt++){
    if(attempt>0)await _sleep(Math.min(3000,500*Math.pow(2,attempt-1))+Math.random()*200);
    try{
      const pr=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json","X-AILVIE-Client":"web"},body:JSON.stringify(body)});
      const d=await pr.json().catch(()=>null);
      if(pr.ok&&d&&d.content)return d;                       // success
      lastStatus=pr.status;
      retryable=(d&&d.retryable)||pr.status===429||pr.status===503||pr.status>=500;
      lastProxyErr=(d&&d.error)||("HTTP "+pr.status);
      if(d&&d.error==="server_not_configured"){lastProxyErr="not configured";retryable=false;break;}
      if(!retryable)break;                                    // permanent error → stop retrying
    }catch(e){ lastProxyErr=e.message; retryable=true; }      // network/DNS/CORS → worth a retry
  }
  // Fallback: direct Anthropic call with the user's own key (single attempt).
  if(apiKey){
    try{
      const dr=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:apiHeaders(apiKey),body:JSON.stringify(body)});
      if(dr.ok)return await dr.json();
      const err=await dr.json().catch(()=>({}));
      throw new Error("AI_ERROR: "+(err?.error?.message||("API error "+dr.status)));
    }catch(e){ if(e.message&&e.message.startsWith("AI_ERROR:"))throw e; /* else fall through to proxy error */ }
  }
  if(lastProxyErr&&!String(lastProxyErr).includes("not configured")){
    // Tag transient failures so the UI can show a calm "try again in a moment" instead of a scary error.
    throw new Error((retryable?"AI_BUSY: ":"AI_ERROR: ")+lastProxyErr);
  }
  throw new Error("NO_KEY");
}
// Camera PPG → BPM via autocorrelation with a confidence gate (rejects noise). samples: [{t:ms, v:redAvg}].
function swayIndex(samples){
  // RMS of accelerometer deviations after removing per-axis mean (gravity/orientation). Pure, testable.
  if(!samples||samples.length<80)return null;
  const mean=k=>samples.reduce((p,c)=>p+c[k],0)/samples.length; const mx=mean("x"),my=mean("y"),mz=mean("z");
  let sq=0;for(const c of samples){const dx=c.x-mx,dy=c.y-my,dz=c.z-mz;sq+=dx*dx+dy*dy+dz*dz;}
  const sway=Math.sqrt(sq/samples.length);
  return {sway,idx:Math.round(sway*100),band:sway<0.3?"high":sway<0.7?"mid":"low"};
}
if(typeof window!=="undefined")window.__swayIndex=swayIndex;
function postureAngle(g,ref){
  // angle (deg) between current gravity vector and a calibrated upright reference. Pure, testable.
  if(!g||!ref)return null;
  const dot=g[0]*ref[0]+g[1]*ref[1]+g[2]*ref[2];
  const mg=Math.sqrt(g[0]*g[0]+g[1]*g[1]+g[2]*g[2]),mr=Math.sqrt(ref[0]*ref[0]+ref[1]*ref[1]+ref[2]*ref[2]);
  if(mg<1||mr<1)return null;
  let c=dot/(mg*mr); c=Math.max(-1,Math.min(1,c));
  const ang=Math.acos(c)*180/Math.PI;
  return {angle:Math.round(ang),band:ang<8?"good":ang<20?"mild":"notable"};
}
if(typeof window!=="undefined")window.__postureAngle=postureAngle;
// ---- Global drug databases: RxNav (NIH/NLM) name->RxCUI->ingredient(INN) + OpenFDA label ----
async function lookupDrugAPIs(q){
  if(!q||!q.trim())return null;
  const enc=encodeURIComponent(q.trim());
  const J=async(u)=>{try{const r=await fetch(u);return r.ok?await r.json():null;}catch(e){return null;}};
  let rxcui=null,name=q.trim(),inn=null;
  const ja=await J(`https://rxnav.nlm.nih.gov/REST/approximateTerm.json?term=${enc}&maxEntries=6`); // ranked: exact ingredient > brand > misspelling
  const cands=(ja&&ja.approximateGroup&&ja.approximateGroup.candidate)||[];
  if(cands.length){rxcui=cands[0].rxcui;const nm=cands.find(c=>c.name);if(nm)name=nm.name;}
  if(rxcui){const ji=await J(`https://rxnav.nlm.nih.gov/REST/rxcui/${rxcui}/related.json?tty=IN`);const g2=ji&&ji.relatedGroup&&ji.relatedGroup.conceptGroup;if(g2){for(const g of g2){if(g.tty==="IN"&&g.conceptProperties&&g.conceptProperties.length){inn=g.conceptProperties[0].name;break;}}}} // INN (localization anchor)
  const term=inn||name||q.trim();const te=encodeURIComponent(term);
  const jo=await J(`https://api.fda.gov/drug/label.json?search=(openfda.generic_name:%22${te}%22+OR+openfda.brand_name:%22${te}%22+OR+openfda.substance_name:%22${te}%22)&limit=1`);
  const label=jo&&jo.results&&jo.results[0];
  if(!rxcui&&!label)return null; // not in global DBs
  const g=(x)=>Array.isArray(x)?x.join(" "):(x||"");
  const clip=(x,n)=>{let s=g(x).replace(/\s+/g," ").trim();return s.length>n?s.slice(0,n).replace(/\s\S*$/,"")+"…":s;};
  const pc=label&&label.openfda&&(label.openfda.pharm_class_epc||label.openfda.pharm_class_moa);
  const cap=s=>s?s.charAt(0).toUpperCase()+s.slice(1):"";
  return {found:true,name,inn,
    class:((inn?cap(inn):"")+(pc?(inn?" · ":"")+g(pc):""))||"-",
    usage:clip(label&&(label.indications_and_usage||label.purpose),260)||"-",
    dose:clip(label&&label.dosage_and_administration,220)||"-",
    sideEffects:clip(label&&(label.adverse_reactions||label.warnings),220)||"-",
    warnings:clip(label&&(label.boxed_warning||label.warnings||label.warnings_and_cautions),220)||"-",
    interactions:clip(label&&label.drug_interactions,220)||"-",
    source:"RxNav/OpenFDA"};
}
if(typeof window!=="undefined")window.__lookupDrugAPIs=lookupDrugAPIs;
// ---- Best-effort barcode -> OpenFDA NDC (US drugs; global EAN/GTIN falls back to photo/AI) ----
async function lookupBarcodeOpenFDA(code){
  const d=String(code||"").replace(/\D/g,"");
  if(d.length<8)return null;
  const core=d.length>=11?d.slice(1,11):d; // strip UPC-A leading digit -> ~10-digit NDC core
  const cands=[];
  const seg=(a,b,c)=>core.length>=a+b+c?`${core.slice(0,a)}-${core.slice(a,a+b)}-${core.slice(a+b,a+b+c)}`:null;
  [seg(5,4,2),seg(5,4,1),seg(5,3,2),seg(4,4,2)].forEach(x=>x&&cands.push(["packaging.package_ndc",x]));
  const prod=(a,b)=>core.length>=a+b?`${core.slice(0,a)}-${core.slice(a,a+b)}`:null;
  [prod(5,4),prod(4,4),prod(5,3)].forEach(x=>x&&cands.push(["product_ndc",x]));
  const J=async(u)=>{try{const r=await fetch(u);return r.ok?await r.json():null;}catch(e){return null;}};
  for(const [field,c] of cands){
    const j=await J(`https://api.fda.gov/drug/ndc.json?search=${field}:%22${encodeURIComponent(c)}%22&limit=1`);
    const res=j&&j.results&&j.results[0];
    if(res){const name=res.brand_name||res.generic_name||"";const inn=res.generic_name||(res.active_ingredients&&res.active_ingredients[0]&&res.active_ingredients[0].name)||"";if(name)return {name,inn};}
  }
  return null;
}
if(typeof window!=="undefined")window.__lookupBarcode=lookupBarcodeOpenFDA;
function computeBPM(samples){
  // Real PPG signal analysis. Returns {ok:true,bpm,conf,quality,signalQuality,fps,durationMs}
  // or {ok:false,reason,fps,durationMs}. NEVER fabricates a value.
  if(!samples||samples.length<120)return {ok:false,reason:"too_short"};
  const t0=samples[0].t, tN=samples[samples.length-1].t, durMs=tN-t0;
  const fps=samples.length/((durMs/1000)||1);
  if(durMs<8000)return {ok:false,reason:"too_short",fps,durationMs:durMs};
  if(fps<10)return {ok:false,reason:"unstable_fps",fps:Math.round(fps),durationMs:durMs}; // undersampled/unstable capture
  const s=samples.filter(x=>x.t-t0>1500); // drop ~1.5s settling
  if(s.length<100)return {ok:false,reason:"too_short",fps:Math.round(fps),durationMs:durMs};
  const red=x=>x.r!=null?x.r:x.v; // backward compat
  // finger-presence heuristic (fingertip over torch glows red & bright)
  const mR=s.reduce((p,c)=>p+red(c),0)/s.length;
  const hasRGB=s[0].g!=null;
  const mG=hasRGB?s.reduce((p,c)=>p+c.g,0)/s.length:0, mB=hasRGB?s.reduce((p,c)=>p+c.b,0)/s.length:0;
  const redDom=!hasRGB||(mR>mG*1.05&&mR>mB*1.05);
  const fingerLikely=mR>55&&redDom;
  // PPG signal from red channel
  const vals=s.map(red), ts=s.map(x=>x.t), n=vals.length;
  const dt=(ts[n-1]-ts[0])/(n-1); // ms per sample
  const win=Math.max(8,Math.round(1200/Math.max(dt,1))); // high-pass ~<0.4Hz baseline
  const ma=new Array(n);
  for(let i=0;i<n;i++){let a=Math.max(0,i-win),b=Math.min(n-1,i+win),sum=0,c=0;for(let j=a;j<=b;j++){sum+=vals[j];c++;}ma[i]=sum/c;}
  const sig=vals.map((v,i)=>v-ma[i]);
  const sm=sig.map((v,i)=>{const a=sig[i-1]!==undefined?sig[i-1]:v,b=sig[i+1]!==undefined?sig[i+1]:v;return (a+v+b)/3;});
  const mean=sm.reduce((p,c)=>p+c,0)/n;
  const c0=sm.map(v=>v-mean);
  if(c0.reduce((p,c)=>p+c*c,0)/n<0.02)return {ok:false,reason:fingerLikely?"low_signal":"no_finger",fps:Math.round(fps),durationMs:durMs};
  const lagMin=Math.max(2,Math.round(300/dt));  // 200 bpm  (band ~0.7–3.3 Hz)
  const lagMax=Math.round(1500/dt);             // 40 bpm
  let bestLag=-1,bestR=-2;
  for(let lag=lagMin;lag<=lagMax&&lag<n-10;lag++){
    let num=0,e1=0,e2=0;
    for(let i=0;i+lag<n;i++){num+=c0[i]*c0[i+lag];e1+=c0[i]*c0[i];e2+=c0[i+lag]*c0[i+lag];}
    const r=num/Math.sqrt((e1*e2)||1);
    if(r>bestR){bestR=r;bestLag=lag;}
  }
  if(bestLag<0||bestR<0.4)return {ok:false,reason:fingerLikely?"noisy":"no_finger",fps:Math.round(fps),durationMs:durMs}; // no reliable periodicity
  const bpm=Math.round(60000/(bestLag*dt));
  if(bpm<40||bpm>200)return {ok:false,reason:"out_of_range",fps:Math.round(fps),durationMs:durMs};
  const signalQuality=bestR>0.8?"excellent":bestR>0.65?"good":bestR>0.5?"fair":"poor";
  // ---- hrvEstimator + respiration: only for long (>=45s) & stable measurements ----
  let hrvRmssd=null,hrvSdnn=null,beats=null,respRate=null;
  if(durMs>=45000&&bestR>=0.5){
    const std=Math.sqrt(c0.reduce((p,c)=>p+c*c,0)/n)||1;
    const thr=0.35*std, minDist=Math.max(2,Math.round(300/dt)); // >=200bpm spacing
    const pk=[];
    for(let i=1;i<n-1;i++){ if(c0[i]>thr&&c0[i]>=c0[i-1]&&c0[i]>c0[i+1]){ if(pk.length&&(i-pk[pk.length-1])<minDist){ if(c0[i]>c0[pk[pk.length-1]])pk[pk.length-1]=i; } else pk.push(i);} }
    let rr=[];for(let k=1;k<pk.length;k++)rr.push(ts[pk[k]]-ts[pk[k-1]]);
    const inRange=rr.filter(x=>x>=300&&x<=1500);
    if(inRange.length>=20){
      const med=[...inRange].sort((a,b)=>a-b)[Math.floor(inRange.length/2)];
      const clean=inRange.filter(x=>Math.abs(x-med)<=0.25*med); // reject ectopic/motion artifacts
      const artifact=1-clean.length/inRange.length;
      if(clean.length>=25&&artifact<0.25){ // enough consistent beats
        const meanRR=clean.reduce((p,c)=>p+c,0)/clean.length;
        hrvSdnn=Math.round(Math.sqrt(clean.reduce((p,c)=>p+(c-meanRR)*(c-meanRR),0)/clean.length));
        let sq=0;for(let k=1;k<clean.length;k++){const d=clean[k]-clean[k-1];sq+=d*d;}
        hrvRmssd=Math.round(Math.sqrt(sq/(clean.length-1)));
        beats=clean.length;
      }
    }
    // ---- respiratory rate from PPG amplitude modulation (RIAV), respiratory band ~0.1–0.5 Hz ----
    if(pk.length>=12){
      const pt=pk.map(i=>ts[i]), pv=pk.map(i=>c0[i]);
      const fsr=4, T0=pt[0], T1=pt[pt.length-1], M=Math.floor((T1-T0)/1000*fsr);
      if(M>=16){
        const rs=new Array(M);
        for(let m=0,j=0;m<M;m++){const tm=T0+m*1000/fsr;while(j+1<pt.length&&pt[j+1]<tm)j++;const j2=Math.min(j+1,pt.length-1),t1=pt[j],t2=pt[j2],v1=pv[j],v2=pv[j2];rs[m]=t2>t1?v1+(v2-v1)*(tm-t1)/(t2-t1):v1;}
        const mm=rs.reduce((p,c)=>p+c,0)/M, rc=rs.map(v=>v-mm);
        const lo=Math.round(2*fsr), hi=Math.round(10*fsr); let bL=-1,bR=-2; // period 2–10 s => 6–30 br/min
        for(let lag=lo;lag<=hi&&lag<M-4;lag++){let num=0,e1=0,e2=0;for(let i=0;i+lag<M;i++){num+=rc[i]*rc[i+lag];e1+=rc[i]*rc[i];e2+=rc[i+lag]*rc[i+lag];}const r=num/Math.sqrt((e1*e2)||1);if(r>bR){bR=r;bL=lag;}}
        if(bL>0&&bR>0.35){const br=Math.round(60/(bL/fsr));if(br>=6&&br<=30)respRate=br;} // only when clearly periodic
      }
    }
  }
  const out={ok:true,bpm,conf:Math.round(bestR*100),quality:signalQuality,signalQuality,fps:Math.round(fps),durationMs:Math.round(durMs),hrvRmssd,hrvSdnn,beats,respRate};
  if(typeof process!=="undefined"&&process.env&&process.env.NODE_ENV!=="production"){/* rawSignalDebugData in dev only */}
  return out;
}
if(typeof window!=="undefined")window.__ppgBPM=computeBPM;


const HOLIDAYS={"01-01":{tr:"Yılbaşı",en:"New Year"},"04-23":{tr:"Ulusal Egemenlik ve Çocuk Bayramı",en:"National Sovereignty Day"},"05-01":{tr:"Emek ve Dayanışma Günü",en:"Labour Day"},"05-19":{tr:"Gençlik ve Spor Bayramı",en:"Youth Day"},"07-15":{tr:"Demokrasi Günü",en:"Democracy Day"},"08-30":{tr:"Zafer Bayramı",en:"Victory Day"},"10-29":{tr:"Cumhuriyet Bayramı",en:"Republic Day"},"12-25":{tr:"Noel",en:"Christmas"},"03-30":{tr:"Ramazan Bayramı",en:"Eid al-Fitr"},"03-31":{tr:"Ramazan Bayramı",en:"Eid al-Fitr"},"04-01":{tr:"Ramazan Bayramı",en:"Eid al-Fitr"},"06-06":{tr:"Kurban Bayramı",en:"Eid al-Adha"},"06-07":{tr:"Kurban Bayramı",en:"Eid al-Adha"},"06-08":{tr:"Kurban Bayramı",en:"Eid al-Adha"},"06-09":{tr:"Kurban Bayramı",en:"Eid al-Adha"},"02-14":{tr:"Sevgililer Günü",en:"Valentine's Day"},"03-08":{tr:"Kadınlar Günü",en:"Women's Day"},"05-11":{tr:"Anneler Günü",en:"Mother's Day"},"06-15":{tr:"Babalar Günü",en:"Father's Day"},"11-24":{tr:"Öğretmenler Günü",en:"Teachers' Day"}};
const EMOJIS=["😊","😷","🤒","🤕","💪","❤️","🙏","👍","👋","🌟","💊","🏥","🩺","🩹","🫀","🧠","🦴","👁️","🦷","💉","🔬","📋","✅","⚠️","❓","😀","😢","😴","🤔","🥰"];
const NCOLS=[{k:"default",l:"#ffffff",d:"#202124"},{k:"coral",l:"#faafa8",d:"#77172e"},{k:"peach",l:"#f39f76",d:"#692b17"},{k:"sand",l:"#fff8b8",d:"#7c4a03"},{k:"mint",l:"#e2f6d3",d:"#264d3b"},{k:"sage",l:"#b4ddd3",d:"#0c625d"},{k:"fog",l:"#d4e4ed",d:"#256377"},{k:"storm",l:"#aeccdc",d:"#284255"},{k:"dusk",l:"#d3bfdb",d:"#472e5b"},{k:"blossom",l:"#f6e2dd",d:"#6c394f"},{k:"clay",l:"#e9e3d4",d:"#4b443a"},{k:"chalk",l:"#efeff1",d:"#232427"}];
const HSYS=[{id:"mhrs",n:"MHRS",f:"tr",u:"https://mhrs.gov.tr"},{id:"nhs",n:"NHS",f:"gb",u:"https://www.nhs.uk"},{id:"mychart",n:"MyChart",f:"us",u:"https://www.mychart.com"},{id:"doctolib",n:"Doctolib",f:"fr",u:"https://www.doctolib.fr"},{id:"jameda",n:"Jameda",f:"de",u:"https://www.jameda.de"}];

// Full-body female doctor avatar
const Avatar=({s=36})=><img src="/avatar.png" alt="AILVIE" style={{width:s,height:s,borderRadius:"50%",objectFit:"cover"}} />;

// Lightweight, dependency-free markdown renderer for AI replies (React-safe, no innerHTML).
const mdInline=(s)=>{
  const nodes=[]; let key=0,last=0,m;
  const re=/(\*\*([^*]+)\*\*|`([^`]+)`|\*([^*\n]+)\*)/g;
  while((m=re.exec(s))){
    if(m.index>last)nodes.push(s.slice(last,m.index));
    if(m[2]!=null)nodes.push(<strong key={key++}>{m[2]}</strong>);
    else if(m[3]!=null)nodes.push(<code key={key++} style={{background:"rgba(127,127,127,.2)",padding:"1px 4px",borderRadius:4,fontSize:"0.9em",fontFamily:"monospace"}}>{m[3]}</code>);
    else if(m[4]!=null)nodes.push(<em key={key++}>{m[4]}</em>);
    last=re.lastIndex;
  }
  if(last<s.length)nodes.push(s.slice(last));
  return nodes;
};
const MD=({text})=>{
  const lines=(text||"").split("\n"); const out=[]; let key=0;
  for(let i=0;i<lines.length;i++){
    const ln=lines[i];
    const bullet=ln.match(/^\s*[-*•]\s+(.*)$/);
    const numbered=ln.match(/^\s*(\d+)[.)]\s+(.*)$/);
    const header=ln.match(/^\s*#{1,4}\s+(.*)$/);
    if(header)out.push(<div key={key++} style={{fontWeight:700,margin:"5px 0 2px"}}>{mdInline(header[1])}</div>);
    else if(bullet)out.push(<div key={key++} style={{display:"flex",gap:7,margin:"2px 0"}}><span style={{flexShrink:0,opacity:.7}}>•</span><span style={{flex:1}}>{mdInline(bullet[1])}</span></div>);
    else if(numbered)out.push(<div key={key++} style={{display:"flex",gap:7,margin:"2px 0"}}><span style={{flexShrink:0,fontWeight:600,opacity:.85}}>{numbered[1]}.</span><span style={{flex:1}}>{mdInline(numbered[2])}</span></div>);
    else if(ln.trim()==="")out.push(<div key={key++} style={{height:6}}/>);
    else out.push(<div key={key++}>{mdInline(ln)}</div>);
  }
  return <>{out}</>;
};


// Flag component — renders Twemoji SVG for cross-platform flags
const FlagSVG={
tr:<svg viewBox="0 0 30 20"><rect width="30" height="20" fill="#E30A17"/><circle cx="13" cy="10" r="6" fill="#fff"/><circle cx="14.5" cy="10" r="4.8" fill="#E30A17"/><polygon points="16,10 18.5,7.5 16.5,9.5 19.5,10 16.5,10.5 18.5,12.5" fill="#fff"/></svg>,
en:<svg viewBox="0 0 30 20"><rect width="30" height="20" fill="#012169"/><path d="M0,0L30,20M30,0L0,20" stroke="#fff" strokeWidth="3.5"/><path d="M0,0L30,20M30,0L0,20" stroke="#C8102E" strokeWidth="2"/><path d="M15,0V20M0,10H30" stroke="#fff" strokeWidth="6"/><path d="M15,0V20M0,10H30" stroke="#C8102E" strokeWidth="3.5"/></svg>,
de:<svg viewBox="0 0 30 20"><rect y="0" width="30" height="7" fill="#000"/><rect y="7" width="30" height="6" fill="#DD0000"/><rect y="13" width="30" height="7" fill="#FFCC00"/></svg>,
ru:<svg viewBox="0 0 30 20"><rect y="0" width="30" height="7" fill="#fff"/><rect y="7" width="30" height="6" fill="#0039A6"/><rect y="13" width="30" height="7" fill="#D52B1E"/></svg>,
zh:<svg viewBox="0 0 30 20"><rect width="30" height="20" fill="#DE2910"/><polygon points="5,3 5.9,5.8 3,4.2 7,4.2 4.1,5.8" fill="#FFDE00"/></svg>,
cn:<svg viewBox="0 0 30 20"><rect width="30" height="20" fill="#DE2910"/><polygon points="5,3 5.9,5.8 3,4.2 7,4.2 4.1,5.8" fill="#FFDE00"/></svg>,
hi:<svg viewBox="0 0 30 20"><rect y="0" width="30" height="7" fill="#FF9933"/><rect y="7" width="30" height="6" fill="#fff"/><rect y="13" width="30" height="7" fill="#138808"/><circle cx="15" cy="10" r="2.5" fill="none" stroke="#000080" strokeWidth=".5"/></svg>,
in:<svg viewBox="0 0 30 20"><rect y="0" width="30" height="7" fill="#FF9933"/><rect y="7" width="30" height="6" fill="#fff"/><rect y="13" width="30" height="7" fill="#138808"/><circle cx="15" cy="10" r="2.5" fill="none" stroke="#000080" strokeWidth=".5"/></svg>,
nl:<svg viewBox="0 0 30 20"><rect y="0" width="30" height="7" fill="#AE1C28"/><rect y="7" width="30" height="6" fill="#fff"/><rect y="13" width="30" height="7" fill="#21468B"/></svg>,
es:<svg viewBox="0 0 30 20"><rect y="0" width="30" height="5" fill="#AA151B"/><rect y="5" width="30" height="10" fill="#F1BF00"/><rect y="15" width="30" height="5" fill="#AA151B"/></svg>,
ar:<svg viewBox="0 0 30 20"><rect width="30" height="20" fill="#006C35"/><rect x="0" y="0" width="7" height="20" fill="#fff"/></svg>,
us:<svg viewBox="0 0 30 20"><rect width="30" height="20" fill="#B22234"/><rect y="1.5" width="30" height="1.5" fill="#fff"/><rect y="4.5" width="30" height="1.5" fill="#fff"/><rect y="7.5" width="30" height="1.5" fill="#fff"/><rect y="10.5" width="30" height="1.5" fill="#fff"/><rect y="13.5" width="30" height="1.5" fill="#fff"/><rect y="16.5" width="30" height="1.5" fill="#fff"/><rect width="12" height="10.5" fill="#3C3B6E"/></svg>,
ca:<svg viewBox="0 0 30 20"><rect width="30" height="20" fill="#fff"/><rect width="8" height="20" fill="#FF0000"/><rect x="22" width="8" height="20" fill="#FF0000"/><polygon points="15,5 16,8 19,7 17,10 19,13 16,12 15,15 14,12 11,13 13,10 11,7 14,8" fill="#FF0000"/></svg>,
fr:<svg viewBox="0 0 30 20"><rect x="0" width="10" height="20" fill="#002395"/><rect x="10" width="10" height="20" fill="#fff"/><rect x="20" width="10" height="20" fill="#ED2939"/></svg>,
gb:<svg viewBox="0 0 30 20"><rect width="30" height="20" fill="#012169"/><path d="M0,0L30,20M30,0L0,20" stroke="#fff" strokeWidth="3.5"/><path d="M0,0L30,20M30,0L0,20" stroke="#C8102E" strokeWidth="2"/><path d="M15,0V20M0,10H30" stroke="#fff" strokeWidth="6"/><path d="M15,0V20M0,10H30" stroke="#C8102E" strokeWidth="3.5"/></svg>,
sa:<svg viewBox="0 0 30 20"><rect width="30" height="20" fill="#006C35"/></svg>,
it:<svg viewBox="0 0 30 20"><rect x="0" width="10" height="20" fill="#009246"/><rect x="10" width="10" height="20" fill="#fff"/><rect x="20" width="10" height="20" fill="#CE2B37"/></svg>,
jp:<svg viewBox="0 0 30 20"><rect width="30" height="20" fill="#fff"/><circle cx="15" cy="10" r="5" fill="#BC002D"/></svg>,
kr:<svg viewBox="0 0 30 20"><rect width="30" height="20" fill="#fff"/><circle cx="15" cy="10" r="4" fill="#CD2E3A"/><path d="M15,6 a4,4 0 0 1 0,8 a2,2 0 0 1 0,-4 a2,2 0 0 0 0,-4" fill="#0047A0"/></svg>,
br:<svg viewBox="0 0 30 20"><rect width="30" height="20" fill="#009739"/><polygon points="15,3 27,10 15,17 3,10" fill="#FFCC29"/><circle cx="15" cy="10" r="3.5" fill="#002776"/></svg>,
au:<svg viewBox="0 0 30 20"><rect width="30" height="20" fill="#012169"/><rect width="15" height="10" fill="#012169"/><path d="M0,0L15,10M15,0L0,10" stroke="#fff" strokeWidth="2"/><path d="M0,0L15,10M15,0L0,10" stroke="#C8102E" strokeWidth="1"/><path d="M7.5,0V10M0,5H15" stroke="#fff" strokeWidth="3"/><path d="M7.5,0V10M0,5H15" stroke="#C8102E" strokeWidth="2"/></svg>,
nz:<svg viewBox="0 0 30 20"><rect width="30" height="20" fill="#012169"/><rect width="15" height="10" fill="#012169"/><path d="M0,0L15,10M15,0L0,10" stroke="#fff" strokeWidth="2"/><path d="M7.5,0V10M0,5H15" stroke="#fff" strokeWidth="3"/><path d="M7.5,0V10M0,5H15" stroke="#C8102E" strokeWidth="2"/></svg>,
pl:<svg viewBox="0 0 30 20"><rect y="0" width="30" height="10" fill="#fff"/><rect y="10" width="30" height="10" fill="#DC143C"/></svg>,
se:<svg viewBox="0 0 30 20"><rect width="30" height="20" fill="#006AA7"/><rect x="9" width="3" height="20" fill="#FECC00"/><rect y="8.5" width="30" height="3" fill="#FECC00"/></svg>,
no:<svg viewBox="0 0 30 20"><rect width="30" height="20" fill="#EF2B2D"/><rect x="8" width="3" height="20" fill="#fff"/><rect y="8.5" width="30" height="3" fill="#fff"/><rect x="9" width="1" height="20" fill="#002868"/><rect y="9.5" width="30" height="1" fill="#002868"/></svg>,
fi:<svg viewBox="0 0 30 20"><rect width="30" height="20" fill="#fff"/><rect x="8" width="4" height="20" fill="#003580"/><rect y="8" width="30" height="4" fill="#003580"/></svg>,
dk:<svg viewBox="0 0 30 20"><rect width="30" height="20" fill="#C8102E"/><rect x="8" width="3" height="20" fill="#fff"/><rect y="8.5" width="30" height="3" fill="#fff"/></svg>,
ie:<svg viewBox="0 0 30 20"><rect x="0" width="10" height="20" fill="#169B62"/><rect x="10" width="10" height="20" fill="#fff"/><rect x="20" width="10" height="20" fill="#FF883E"/></svg>,
pt:<svg viewBox="0 0 30 20"><rect x="0" width="12" height="20" fill="#006600"/><rect x="12" width="18" height="20" fill="#FF0000"/></svg>,
gr:<svg viewBox="0 0 30 20"><rect width="30" height="2.2" fill="#0D5EAF"/><rect y="2.2" width="30" height="2.2" fill="#fff"/><rect y="4.4" width="30" height="2.2" fill="#0D5EAF"/><rect y="6.6" width="30" height="2.2" fill="#fff"/><rect y="8.8" width="30" height="2.2" fill="#0D5EAF"/><rect y="11" width="30" height="2.2" fill="#fff"/><rect y="13.2" width="30" height="2.2" fill="#0D5EAF"/><rect y="15.4" width="30" height="2.2" fill="#fff"/><rect y="17.6" width="30" height="2.4" fill="#0D5EAF"/><rect width="12" height="11" fill="#0D5EAF"/><rect x="5" width="2" height="11" fill="#fff"/><rect y="4.5" width="12" height="2" fill="#fff"/></svg>,
eg:<svg viewBox="0 0 30 20"><rect y="0" width="30" height="7" fill="#CE1126"/><rect y="7" width="30" height="6" fill="#fff"/><rect y="13" width="30" height="7" fill="#000"/></svg>,
at:<svg viewBox="0 0 30 20"><rect y="0" width="30" height="7" fill="#ED2939"/><rect y="7" width="30" height="6" fill="#fff"/><rect y="13" width="30" height="7" fill="#ED2939"/></svg>,
ch:<svg viewBox="0 0 30 20"><rect width="30" height="20" fill="#D52B1E"/><rect x="13" y="7" width="4" height="6" fill="#fff"/><rect x="11" y="9" width="8" height="2" fill="#fff"/></svg>,
be:<svg viewBox="0 0 30 20"><rect x="0" width="10" height="20" fill="#000"/><rect x="10" width="10" height="20" fill="#FAE042"/><rect x="20" width="10" height="20" fill="#ED2939"/></svg>,
cz:<svg viewBox="0 0 30 20"><rect y="0" width="30" height="10" fill="#fff"/><rect y="10" width="30" height="10" fill="#D7141A"/><polygon points="0,0 15,10 0,20" fill="#11457E"/></svg>,
sk:<svg viewBox="0 0 30 20"><rect y="0" width="30" height="7" fill="#fff"/><rect y="7" width="30" height="6" fill="#0B4EA2"/><rect y="13" width="30" height="7" fill="#EE1C25"/></svg>,
hu:<svg viewBox="0 0 30 20"><rect y="0" width="30" height="7" fill="#CE2939"/><rect y="7" width="30" height="6" fill="#fff"/><rect y="13" width="30" height="7" fill="#477050"/></svg>,
ro:<svg viewBox="0 0 30 20"><rect x="0" width="10" height="20" fill="#002B7F"/><rect x="10" width="10" height="20" fill="#FCD116"/><rect x="20" width="10" height="20" fill="#CE1126"/></svg>,
bg:<svg viewBox="0 0 30 20"><rect y="0" width="30" height="7" fill="#fff"/><rect y="7" width="30" height="6" fill="#00966E"/><rect y="13" width="30" height="7" fill="#D62612"/></svg>,
ua:<svg viewBox="0 0 30 20"><rect y="0" width="30" height="10" fill="#005BBB"/><rect y="10" width="30" height="10" fill="#FFD500"/></svg>,
mx:<svg viewBox="0 0 30 20"><rect x="0" width="10" height="20" fill="#006847"/><rect x="10" width="10" height="20" fill="#fff"/><rect x="20" width="10" height="20" fill="#CE1126"/></svg>,
id:<svg viewBox="0 0 30 20"><rect y="0" width="30" height="10" fill="#FF0000"/><rect y="10" width="30" height="10" fill="#fff"/></svg>,
th:<svg viewBox="0 0 30 20"><rect y="0" width="30" height="4" fill="#ED1C24"/><rect y="4" width="30" height="4" fill="#fff"/><rect y="8" width="30" height="4" fill="#241D4F"/><rect y="12" width="30" height="4" fill="#fff"/><rect y="16" width="30" height="4" fill="#ED1C24"/></svg>,
vn:<svg viewBox="0 0 30 20"><rect width="30" height="20" fill="#DA251D"/><polygon points="15,5 16.5,9 20.5,9 17,11.5 18.5,15.5 15,13 11.5,15.5 13,11.5 9.5,9 13.5,9" fill="#FFFF00"/></svg>,
my:<svg viewBox="0 0 30 20"><rect y="0" width="30" height="1.4" fill="#CC0000"/><rect y="1.4" width="30" height="1.4" fill="#fff"/><rect y="2.8" width="30" height="1.4" fill="#CC0000"/><rect y="4.2" width="30" height="1.4" fill="#fff"/><rect y="5.6" width="30" height="1.4" fill="#CC0000"/><rect y="7" width="30" height="1.4" fill="#fff"/><rect y="8.4" width="30" height="1.4" fill="#CC0000"/><rect y="9.8" width="30" height="1.4" fill="#fff"/><rect y="11.2" width="30" height="1.4" fill="#CC0000"/><rect y="12.6" width="30" height="1.4" fill="#fff"/><rect y="14" width="30" height="1.4" fill="#CC0000"/><rect y="15.4" width="30" height="1.4" fill="#fff"/><rect y="16.8" width="30" height="3.2" fill="#CC0000"/><rect width="15" height="11.2" fill="#000066"/></svg>,
sg:<svg viewBox="0 0 30 20"><rect y="0" width="30" height="10" fill="#ED2939"/><rect y="10" width="30" height="10" fill="#fff"/></svg>,
ph:<svg viewBox="0 0 30 20"><rect y="0" width="30" height="10" fill="#0038A8"/><rect y="10" width="30" height="10" fill="#CE1126"/><polygon points="0,0 12,10 0,20" fill="#fff"/></svg>,
pk:<svg viewBox="0 0 30 20"><rect width="30" height="20" fill="#01411C"/><rect width="7" height="20" fill="#fff"/></svg>,
bd:<svg viewBox="0 0 30 20"><rect width="30" height="20" fill="#006A4E"/><circle cx="13" cy="10" r="5" fill="#F42A41"/></svg>,
ir:<svg viewBox="0 0 30 20"><rect y="0" width="30" height="7" fill="#239F40"/><rect y="7" width="30" height="6" fill="#fff"/><rect y="13" width="30" height="7" fill="#DA0000"/></svg>,
iq:<svg viewBox="0 0 30 20"><rect y="0" width="30" height="7" fill="#CE1126"/><rect y="7" width="30" height="6" fill="#fff"/><rect y="13" width="30" height="7" fill="#000"/></svg>,
il:<svg viewBox="0 0 30 20"><rect width="30" height="20" fill="#fff"/><rect y="3" width="30" height="2" fill="#0038B8"/><rect y="15" width="30" height="2" fill="#0038B8"/><polygon points="13,7 17,7 15,11" fill="none" stroke="#0038B8" strokeWidth=".8"/><polygon points="13,13 17,13 15,9" fill="none" stroke="#0038B8" strokeWidth=".8"/></svg>,
jo:<svg viewBox="0 0 30 20"><rect y="0" width="30" height="7" fill="#000"/><rect y="7" width="30" height="6" fill="#fff"/><rect y="13" width="30" height="7" fill="#007A3D"/><polygon points="0,0 11,10 0,20" fill="#CE1126"/></svg>,
lb:<svg viewBox="0 0 30 20"><rect y="0" width="30" height="5" fill="#EE161F"/><rect y="5" width="30" height="10" fill="#fff"/><rect y="15" width="30" height="5" fill="#EE161F"/></svg>,
sy:<svg viewBox="0 0 30 20"><rect y="0" width="30" height="7" fill="#CE1126"/><rect y="7" width="30" height="6" fill="#fff"/><rect y="13" width="30" height="7" fill="#000"/></svg>,
ae:<svg viewBox="0 0 30 20"><rect y="0" width="30" height="7" fill="#00732F"/><rect y="7" width="30" height="6" fill="#fff"/><rect y="13" width="30" height="7" fill="#000"/><rect width="8" height="20" fill="#FF0000"/></svg>,
qa:<svg viewBox="0 0 30 20"><rect width="30" height="20" fill="#8A1538"/><rect width="10" height="20" fill="#fff"/></svg>,
kw:<svg viewBox="0 0 30 20"><rect y="0" width="30" height="7" fill="#007A3D"/><rect y="7" width="30" height="6" fill="#fff"/><rect y="13" width="30" height="7" fill="#CE1126"/><polygon points="0,0 9,7 9,13 0,20" fill="#000"/></svg>,
bh:<svg viewBox="0 0 30 20"><rect width="30" height="20" fill="#CE1126"/><polygon points="0,0 10,0 6,3 10,5 6,7 10,9 6,11 10,13 6,15 10,17 6,19 10,20 0,20" fill="#fff"/></svg>,
om:<svg viewBox="0 0 30 20"><rect y="0" width="30" height="7" fill="#fff"/><rect y="7" width="30" height="6" fill="#CE1126"/><rect y="13" width="30" height="7" fill="#009739"/><rect width="10" height="20" fill="#CE1126"/></svg>,
az:<svg viewBox="0 0 30 20"><rect y="0" width="30" height="7" fill="#0092BC"/><rect y="7" width="30" height="6" fill="#E00034"/><rect y="13" width="30" height="7" fill="#00AF66"/></svg>,
ge:<svg viewBox="0 0 30 20"><rect width="30" height="20" fill="#fff"/><rect x="13" width="4" height="20" fill="#FF0000"/><rect y="8" width="30" height="4" fill="#FF0000"/></svg>,
am:<svg viewBox="0 0 30 20"><rect y="0" width="30" height="7" fill="#D90012"/><rect y="7" width="30" height="6" fill="#0033A0"/><rect y="13" width="30" height="7" fill="#F2A800"/></svg>,
za:<svg viewBox="0 0 30 20"><rect width="30" height="20" fill="#007A4D"/><polygon points="0,0 12,10 0,20" fill="#000"/><polygon points="0,3 10,10 0,17" fill="#FFB915"/><rect x="12" y="0" width="18" height="5" fill="#DE3831"/><rect x="12" y="15" width="18" height="5" fill="#002395"/><path d="M12,5 L30,5 L30,15 L12,15" fill="#fff"/></svg>,
ma:<svg viewBox="0 0 30 20"><rect width="30" height="20" fill="#C1272D"/><polygon points="15,6 16,10 19,10 16.5,12 17.5,15 15,13 12.5,15 13.5,12 11,10 14,10" fill="none" stroke="#006233" strokeWidth=".5"/></svg>,
tn:<svg viewBox="0 0 30 20"><rect width="30" height="20" fill="#E70013"/><circle cx="15" cy="10" r="5" fill="#fff"/><circle cx="15" cy="10" r="3" fill="#E70013"/></svg>,
dz:<svg viewBox="0 0 30 20"><rect x="0" width="15" height="20" fill="#006233"/><rect x="15" width="15" height="20" fill="#fff"/><circle cx="14" cy="10" r="3" fill="#D21034"/></svg>,
ng:<svg viewBox="0 0 30 20"><rect x="0" width="10" height="20" fill="#008751"/><rect x="10" width="10" height="20" fill="#fff"/><rect x="20" width="10" height="20" fill="#008751"/></svg>,
ke:<svg viewBox="0 0 30 20"><rect y="0" width="30" height="6" fill="#000"/><rect y="6" width="30" height="2" fill="#fff"/><rect y="8" width="30" height="4" fill="#BB0000"/><rect y="12" width="30" height="2" fill="#fff"/><rect y="14" width="30" height="6" fill="#006600"/></svg>,
ag:<svg viewBox="0 0 30 20"><rect y="0" width="30" height="6.7" fill="#75AADB"/><rect y="6.7" width="30" height="6.7" fill="#fff"/><rect y="13.4" width="30" height="6.6" fill="#75AADB"/></svg>,
cl:<svg viewBox="0 0 30 20"><rect y="0" width="30" height="10" fill="#fff"/><rect y="10" width="30" height="10" fill="#D52B1E"/><rect width="10" height="10" fill="#0039A6"/></svg>,
co:<svg viewBox="0 0 30 20"><rect y="0" width="30" height="10" fill="#FCD116"/><rect y="10" width="30" height="5" fill="#003893"/><rect y="15" width="30" height="5" fill="#CE1126"/></svg>,
ve:<svg viewBox="0 0 30 20"><rect y="0" width="30" height="6.7" fill="#FFCC00"/><rect y="6.7" width="30" height="6.7" fill="#00247D"/><rect y="13.4" width="30" height="6.6" fill="#CF142B"/></svg>,
pe:<svg viewBox="0 0 30 20"><rect x="0" width="10" height="20" fill="#D91023"/><rect x="10" width="10" height="20" fill="#fff"/><rect x="20" width="10" height="20" fill="#D91023"/></svg>,
hr:<svg viewBox="0 0 30 20"><rect y="0" width="30" height="7" fill="#FF0000"/><rect y="7" width="30" height="6" fill="#fff"/><rect y="13" width="30" height="7" fill="#0093DD"/></svg>,
rs:<svg viewBox="0 0 30 20"><rect y="0" width="30" height="7" fill="#C6363C"/><rect y="7" width="30" height="6" fill="#0C4076"/><rect y="13" width="30" height="7" fill="#fff"/></svg>,
si:<svg viewBox="0 0 30 20"><rect y="0" width="30" height="7" fill="#fff"/><rect y="7" width="30" height="6" fill="#0000C8"/><rect y="13" width="30" height="7" fill="#FF0000"/></svg>,
is:<svg viewBox="0 0 30 20"><rect width="30" height="20" fill="#003897"/><rect x="8" width="4" height="20" fill="#fff"/><rect y="8" width="30" height="4" fill="#fff"/><rect x="9" width="2" height="20" fill="#DC1E35"/><rect y="9" width="30" height="2" fill="#DC1E35"/></svg>,
et:<svg viewBox="0 0 30 20"><rect y="0" width="30" height="7" fill="#078930"/><rect y="7" width="30" height="6" fill="#FCDD09"/><rect y="13" width="30" height="7" fill="#DA121A"/></svg>,
lt:<svg viewBox="0 0 30 20"><rect y="0" width="30" height="7" fill="#FDB913"/><rect y="7" width="30" height="6" fill="#006A44"/><rect y="13" width="30" height="7" fill="#C1272D"/></svg>,
lv:<svg viewBox="0 0 30 20"><rect y="0" width="30" height="8" fill="#9E3039"/><rect y="8" width="30" height="4" fill="#fff"/><rect y="12" width="30" height="8" fill="#9E3039"/></svg>,
ee:<svg viewBox="0 0 30 20"><rect y="0" width="30" height="7" fill="#0072CE"/><rect y="7" width="30" height="6" fill="#000"/><rect y="13" width="30" height="7" fill="#fff"/></svg>,
mt:<svg viewBox="0 0 30 20"><rect x="0" width="15" height="20" fill="#fff"/><rect x="15" width="15" height="20" fill="#CC0000"/></svg>,
tw:<svg viewBox="0 0 30 20"><rect width="30" height="20" fill="#FE0000"/><rect width="15" height="10" fill="#000095"/><circle cx="7.5" cy="5" r="3" fill="#fff"/><circle cx="7.5" cy="5" r="2" fill="#000095"/></svg>,
arg:<svg viewBox="0 0 30 20"><rect y="0" width="30" height="7" fill="#75AADB"/><rect y="7" width="30" height="6" fill="#fff"/><rect y="13" width="30" height="7" fill="#75AADB"/><circle cx="15" cy="10" r="2" fill="#F6B40E"/></svg>,
cat:<svg viewBox="0 0 30 20"><rect width="30" height="20" fill="#FCDD09"/><rect y="2" width="30" height="2" fill="#DA121A"/><rect y="6" width="30" height="2" fill="#DA121A"/><rect y="10" width="30" height="2" fill="#DA121A"/><rect y="14" width="30" height="2" fill="#DA121A"/><rect y="18" width="30" height="2" fill="#DA121A"/></svg>,
eus:<svg viewBox="0 0 30 20"><rect width="30" height="20" fill="#D52B1E"/><path d="M0,0 L30,20 M30,0 L0,20" stroke="#009E49" strokeWidth="4"/><path d="M15,0 V20 M0,10 H30" stroke="#fff" strokeWidth="4"/></svg>,
gal:<svg viewBox="0 0 30 20"><rect width="30" height="20" fill="#fff"/><path d="M0,0 L30,20" stroke="#0093DD" strokeWidth="4"/></svg>,
wls:<svg viewBox="0 0 30 20"><rect y="0" width="30" height="10" fill="#fff"/><rect y="10" width="30" height="10" fill="#008A00"/><circle cx="15" cy="10" r="4" fill="#D30731"/></svg>
};
FlagSVG.bn=FlagSVG.bd;
const Flag=({code,size=20})=>{const k=code?.toLowerCase();const s=FlagSVG[k];return s?<span style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:size,height:Math.round(size*0.67),verticalAlign:"middle",borderRadius:3,overflow:"hidden",border:"1px solid rgba(255,255,255,0.15)",boxShadow:"0 1px 2px rgba(0,0,0,0.15)",flexShrink:0,lineHeight:0}}>{React.cloneElement(s,{width:size,height:Math.round(size*0.67),preserveAspectRatio:"xMidYMid slice",style:{display:"block"}})}</span>:<span style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:size,height:Math.round(size*0.67),background:"linear-gradient(135deg,#334155,#1e293b)",color:"#fff",fontSize:Math.round(size*0.4),fontWeight:700,borderRadius:3,flexShrink:0,border:"1px solid rgba(255,255,255,0.15)"}}>{code?.toUpperCase().slice(0,2)}</span>;};



const OB={
  tr:{welcome:"AILVIE'ye hoş geldin",intro:"Kişisel yapay zeka sağlık asistanın. İlaç takibi, randevular, sağlık skoru ve daha fazlası — hepsi tek yerde.",chooseLang:"Dilini seç",yourName:"Sana nasıl hitap edelim?",namePh:"Adın (isteğe bağlı)",ready:"Hazırsın!",readyDesc:"İlaç hatırlatmaları için bildirimlere izin vermen önerilir. İstediğin zaman Ayarlar'dan değiştirebilirsin.",start:"Başla",next:"İleri",skip:"Atla",back:"Geri"},
  en:{welcome:"Welcome to AILVIE",intro:"Your personal AI health assistant. Medication tracking, appointments, health score and more — all in one place.",chooseLang:"Choose your language",yourName:"What should we call you?",namePh:"Your name (optional)",ready:"You're all set!",readyDesc:"We recommend allowing notifications for medication reminders. You can change this anytime in Settings.",start:"Get Started",next:"Next",skip:"Skip",back:"Back"}
};
// Store URLs — fill in after publishing to enable store buttons in the install banner.
// Leave empty to hide a store button. PWA install (no commission) works regardless.
const PLAY_URL=""; // e.g. "https://play.google.com/store/apps/details?id=com.ailvie.app"
const IOS_URL="";  // e.g. "https://apps.apple.com/app/ailvie/id000000000"
// Web checkout (account-based, COMMISSION-FREE): host a Stripe Checkout page on your domain.
// When set, PRO plan cards open this URL (?plan=...) instead of any in-app payment.
const CHECKOUT_URL=""; // e.g. "https://ailvie.com/pro"
const CONTACT_EMAIL=""; // e.g. "kurumsal@ailvie.com" (Enterprise "Contact Us")
// Firebase web config (PUBLIC client keys) — fill to enable Google/Apple sign-in & cloud sync.
// Get from Firebase console > Project settings > Your apps > SDK config.
const FIREBASE_CONFIG={}; // e.g. {apiKey:"...",authDomain:"ailvie.firebaseapp.com",projectId:"ailvie",appId:"..."}
const ENABIZ_CONFIG={}; // resmi Sağlık Bakanlığı izni alınınca: {authUrl, clientId, scope, redirectUri} — OAuth2/FHIR
const FIRST_AID=[
 {ic:"🫀",tr:["Kalp masajı (KPR) — yanıt yok, nefes yok","Hemen 112'yi arayın (ya da birine arattırın); yakında OED/AED varsa getirtin.","Kişiyi sert, düz zemine sırtüstü yatırın.","Göğsün tam ortasına iki elle bastırın: dakikada 100–120 bası, 5–6 cm derinlik.","Eğitimliyseniz 30 bası + 2 suni solunum; değilseniz yalnızca kesintisiz bası yapın.","Yardım gelene veya kişi kendine gelene kadar ara vermeyin."],
  en:["CPR — unresponsive, not breathing","Call emergency (112) now or have someone call; get an AED if nearby.","Lay the person on their back on a firm, flat surface.","Push hard in the center of the chest: 100–120/min, 5–6 cm deep.","If trained: 30 compressions + 2 breaths; if not, do hands-only compressions.","Don't stop until help arrives or the person recovers."]},
 {ic:"😮‍💨",tr:["Boğulma / soluk yolu tıkanması (Heimlich)","Kişi öksürebiliyorsa öksürmesini teşvik edin.","Öksüremiyor/konuşamıyorsa kürek kemikleri arasına elin topuğuyla 5 sert sırt vuruşu yapın.","Sonra arkadan sarılıp göbek üstüne 5 kez içeri-yukarı bastırın (Heimlich).","5 sırt + 5 karın bastırmayı tekrarlayın; kişi bayılırsa 112'yi arayıp KPR'ye başlayın.","Bebeklerde (1 yaş altı): 5 sırt vuruşu + 5 göğüs bası; karına bastırma YAPMAYIN."],
  en:["Choking (Heimlich)","If they can cough, encourage coughing.","If they can't cough/speak: 5 firm back blows between the shoulder blades.","Then 5 abdominal thrusts (Heimlich) from behind.","Repeat 5+5; if they collapse, call 112 and start CPR.","Infants (<1yr): 5 back blows + 5 chest thrusts; NO abdominal thrusts."]},
 {ic:"🩸",tr:["Ciddi kanama","Temiz bez/gazlı bezle yaraya doğrudan ve sürekli bası uygulayın.","Mümkünse yaralı bölgeyi kalp seviyesinin üstüne kaldırın.","Bez kanla dolarsa çıkarmayın, üstüne yeni bez ekleyin.","Ağır veya durmayan kanamada 112'yi arayın.","Turnike yalnızca hayatı tehdit eden kol/bacak kanamasında son çaredir."],
  en:["Severe bleeding","Apply firm, direct pressure with a clean cloth.","Raise the injured area above heart level if possible.","If the cloth soaks through, add another on top — don't remove it.","Call 112 for heavy or non-stopping bleeding.","A tourniquet is a last resort only for life-threatening limb bleeding."]},
 {ic:"🔥",tr:["Yanık","Yanan bölgeyi 20 dakika akan serin (buz gibi değil) suyun altında tutun.","Yapışmadıysa yüzük/saat/dar giysiyi çıkarın.","Diş macunu, yağ, buz SÜRMEYİN; su kabarcıklarını patlatmayın.","Temiz, yapışmaz bir bezle gevşekçe örtün.","Geniş/derin ya da yüz-el-genital yanıklarında hekime başvurun."],
  en:["Burns","Cool under running cool (not icy) water for 20 minutes.","Remove rings/watch/tight clothing if not stuck.","Do NOT apply toothpaste, oil or ice; don't pop blisters.","Cover loosely with a clean, non-stick cloth.","Seek care for large/deep burns or burns to face, hands, genitals."]},
 {ic:"❤️",tr:["Kalp krizi","Hemen 112'yi arayın.","Kişiyi rahat oturtun, dar giysilerini gevşetin, sakinleştirin.","Alerjisi ve engel yoksa 1 aspirin çiğnetmek faydalı olabilir.","Bilinç kaybolur ve nefes durursa KPR'ye başlayın.","Belirtiler: göğüste baskı/ağrı, kola-çeneye yayılma, soğuk ter, nefes darlığı."],
  en:["Heart attack","Call 112 immediately.","Sit them down, loosen tight clothing, keep them calm.","If not allergic and no contraindication, chewing one aspirin may help.","If they lose consciousness and stop breathing, start CPR.","Signs: chest pressure/pain spreading to arm/jaw, cold sweat, breathlessness."]},
 {ic:"🧠",tr:["İnme (felç) — FAST","F – Yüz: Gülümsetin; bir taraf düşük mü?","A – Kol: İki kolu kaldırtın; biri düşüyor mu?","S – Konuşma: Basit bir cümle kurdurtun; peltek/bozuk mu?","T – Zaman: Bunlardan biri varsa HEMEN 112. Belirtinin başlama saatini not edin.","Kişiye yiyecek/içecek vermeyin."],
  en:["Stroke — FAST","F – Face: Ask them to smile; is one side drooping?","A – Arms: Raise both arms; does one drift down?","S – Speech: Ask a simple sentence; is it slurred?","T – Time: If any sign, call 112 NOW. Note the time symptoms started.","Do not give food or drink."]},
 {ic:"⚡",tr:["Nöbet (epilepsi)","Çevreyi güvenli yapın, sert/keskin eşyaları uzaklaştırın.","Başının altına yumuşak bir şey koyun; kişiyi TUTMAYIN, ağzına bir şey SOKMAYIN.","Nöbet bitince yan yatırın (koma pozisyonu), nefesini kontrol edin.","5 dakikadan uzun sürer, tekrarlar veya ilk nöbetse 112'yi arayın."],
  en:["Seizure","Make the area safe; move hard/sharp objects away.","Cushion the head; do NOT restrain them or put anything in their mouth.","After it stops, roll them onto their side and check breathing.","Call 112 if it lasts >5 min, repeats, or is a first seizure."]},
 {ic:"🐝",tr:["Şiddetli alerji (anafilaksi)","Adrenalin oto-enjektörü (EpiPen) varsa uyluğun dış yüzüne HEMEN uygulayın.","112'yi arayın.","Nefes zorsa oturtun; baygınsa sırtüstü yatırıp bacakları kaldırın.","Belirtiler sürerse ve ikinci doz varsa 5–15 dk sonra tekrar uygulanabilir.","Belirtiler: yüz/dudak/dil şişmesi, nefes darlığı, yaygın kızarıklık, baş dönmesi."],
  en:["Severe allergy (anaphylaxis)","If an adrenaline auto-injector (EpiPen) is available, use it on the outer thigh NOW.","Call 112.","If breathing is hard, sit them up; if faint, lay flat and raise legs.","A second dose may be given after 5–15 min if symptoms persist.","Signs: swelling of face/lips/tongue, breathlessness, widespread rash, dizziness."]},
 {ic:"☠️",tr:["Zehirlenme","Ulusal Zehir Danışma Merkezi 114'ü veya 112'yi arayın.","Aksi söylenmedikçe KUSTURMAYIN.","Zehirli madde/ilaç kutusunu (isim ve miktar için) yanınıza alın.","Cilt/göz teması varsa bol suyla 15–20 dk yıkayın."],
  en:["Poisoning","Call your local poison centre or 112.","Do NOT induce vomiting unless told to.","Keep the substance/medication package (for name and amount).","For skin/eye contact, rinse with plenty of water for 15–20 min."]},
 {ic:"😵",tr:["Bayılma","Kişiyi sırtüstü yatırın, bacaklarını ~30 cm kaldırın.","Dar giysileri gevşetin, temiz hava sağlayın.","1 dakikada kendine gelmezse ya da nefes/bilinç sorunluysa 112'yi arayın."],
  en:["Fainting","Lay the person on their back and raise their legs ~30 cm.","Loosen tight clothing and provide fresh air.","If they don't recover within a minute or breathing is off, call 112."]},
 {ic:"🩹",tr:["Kırık / burkulma","Bölgeyi hareket ettirmeyin; olduğu gibi sabitleyin (atel/destek).","Kemiği yerine oturtmaya ÇALIŞMAYIN.","Şişlik için beze sarılı soğuk kompres uygulayın (doğrudan cilde değil).","Şiddetli ağrı, şekil bozukluğu veya açık kırıkta 112/hekim."],
  en:["Fracture / sprain","Don't move the area; immobilize it as-is (splint/support).","Do NOT try to realign the bone.","Apply a cold pack wrapped in cloth (not directly on skin).","Seek care for severe pain, deformity, or an open fracture."]},
 {ic:"👃",tr:["Burun kanaması","Öne eğilin (başı geriye ATMAYIN).","Burnun yumuşak kısmını 10 dakika sıkın, ağızdan nefes alın.","20 dakikada durmazsa veya çok yoğunsa hekime başvurun."],
  en:["Nosebleed","Lean forward (do NOT tilt the head back).","Pinch the soft part of the nose for 10 minutes; breathe through the mouth.","If it doesn't stop in 20 min or is very heavy, seek care."]}
];
const FB_VER="10.12.0";
// ---------------------------------------------------------------------------
// These components own state/effects. They MUST live outside AILVIE_App: a component
// defined inside another component is a NEW type on every render, so React unmounts and
// remounts it. StorageHealth then flashed its "…" placeholder, Clock reset its interval and
// StepTimer restarted its countdown — visible as rapid flashing on screen.
// ---------------------------------------------------------------------------
const storageEstimate=async()=>{try{if(navigator.storage&&navigator.storage.estimate){const e=await navigator.storage.estimate();return{usage:e.usage||0,quota:e.quota||0};}}catch(e){}return null;};
const StorageHealth=({lang,fs,tc,mt,sc,ac,acTx,bd,dg,t,BP,lastBackup,idbGet,idbSet,notify})=>{
  const[st,setSt]=useState(null);
  useEffect(()=>{let m=true;(async()=>{const e=await storageEstimate();let p=false;try{p=!!(navigator.storage&&navigator.storage.persisted&&await navigator.storage.persisted());}catch(x){}if(m)setSt({e,p});})();return()=>{m=false;};},[]);
  const L=lang==="tr";
  if(!st)return <div style={{fontSize:fs-2,color:mt}}>…</div>;
  const mb=(n)=>(n/1048576).toFixed(1);
  const pct=st.e&&st.e.quota?Math.min(100,Math.round(st.e.usage/st.e.quota*100)):null;
  return <div>
    <div style={{display:"flex",justifyContent:"space-between",fontSize:fs-2,color:tc}}>
      <span>{L?"Kalıcı depolama":"Persistent storage"}</span>
      <b style={{color:st.p?sc:"#e9a23b"}}>{st.p?(L?"✓ Açık":"✓ On"):(L?"Kapalı":"Off")}</b>
    </div>
    <div style={{fontSize:fs-4,color:mt,marginTop:2,lineHeight:1.4}}>{st.p?(L?"Tarayıcı verilerinizi kendiliğinden silmez.":"Browser won't auto-evict your data."):(L?"Tarayıcı yer açmak için verileri silebilir. Uygulamayı ana ekrana ekleyip birkaç kez kullanınca genelde otomatik açılır.":"Browser may evict data.")}</div>
    {pct!=null&&<div style={{marginTop:8}}>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:fs-3,color:mt}}><span>{L?"Kullanım":"Usage"}</span><span>{mb(st.e.usage)} / {mb(st.e.quota)} MB ({pct}%)</span></div>
      <div style={{height:6,borderRadius:3,background:bd,overflow:"hidden",marginTop:3}}><div style={{width:pct+"%",height:"100%",background:pct>85?dg:pct>60?"#e9a23b":sc}}/></div>
    </div>}
    {(()=>{const days=lastBackup?Math.floor((Date.now()-lastBackup)/864e5):null;
      const stale=days===null||days>=30;
      return <div style={{marginTop:10,background:stale?`${dg}12`:`${sc}10`,border:`1px solid ${stale?dg:sc}44`,borderRadius:9,padding:"8px 10px"}}>
        <div style={{fontSize:fs-2,color:tc,fontWeight:600}}>{stale?"⚠️ ":"✓ "}{L?"Son yedek":"Last backup"}: <span style={{color:stale?dg:sc}}>{days===null?(L?"hiç alınmadı":"never"):(days===0?(L?"bugün":"today"):`${days} ${L?"gün önce":"days ago"}`)}</span></div>
        {stale&&<div style={{fontSize:fs-4,color:mt,marginTop:3,lineHeight:1.4}}>{L?"Cihazınızı kaybederseniz veriler geri gelmez. Ayarlar > Yedekle ile şifreli yedek alın.":TL("If you lose your device, the data can't be recovered. Take an encrypted backup from Settings > Backup.",lang)}</div>}
      </div>;})()}
    <button onClick={async()=>{
      const L2=lang==="tr";
      let prev=null;try{prev=await idbGet("ailvie_data_prev");}catch(e){}
      if(!prev){notify(L2?"Önceki sürüm bulunamadı":"No previous revision");return;}
      let n=0;try{const d=JSON.parse(prev);n=(d.notes||[]).length+(d.meds||[]).length+(d.labs||[]).length;}catch(e){}
      if(!window.confirm(L2?`Bir önceki kaydedilmiş sürüme dönülecek (${n} kayıt içeriyor). Mevcut veriler onunla değiştirilecek. Devam?`:`Restore previous revision (${n} records)?`))return;
      try{const cur=await idbGet("ailvie_data");if(cur)await idbSet("ailvie_data_prev_undo",cur);}catch(e){}
      try{await idbSet("ailvie_data",prev);localStorage.setItem("ailvie_data",prev);}catch(e){}
      notify(L2?"Geri yüklendi, yenileniyor…":"Restored, reloading…");
      setTimeout(()=>location.reload(),800);
    }} style={{...BP,width:"100%",padding:"8px",marginTop:10,background:"transparent",color:acTx,border:`1px solid ${ac}`,fontSize:fs-2}}>↩️ {lang==="tr"?"Önceki sürüme dön":TL("Restore previous revision",lang)}</button>
    <div style={{fontSize:fs-5,color:mt,marginTop:4,lineHeight:1.4}}>{lang==="tr"?"Her kayıttan önce bir önceki sürüm saklanır. Bir şey yanlış giderse buradan geri alabilirsiniz.":TL("One previous revision is kept before each save.",lang)}</div>
    <div style={{fontSize:fs-4,color:mt,marginTop:8,lineHeight:1.4}}>{L?"Veriler bu cihazda saklanır (IndexedDB). Senkron isteğe bağlıdır; açarsanız veriler cihazınızda şifrelenip öyle gönderilir. Yedekleriniz AES-256 ile parolayla şifrelenebilir.":TL("Data is stored on this device (IndexedDB). Sync is optional; if you turn it on, data is encrypted on your device before being sent. Backups can be AES-256 encrypted.",lang)}</div>
  </div>;
};
const Clock=({dark,ac,tc,mt,dg})=>{
  const[t,setT]=useState(()=>new Date());
  useEffect(()=>{const iv=setInterval(()=>setT(new Date()),1000);return()=>clearInterval(iv);},[]);
  const s=t.getSeconds(),m=t.getMinutes(),h=t.getHours()%12;return(<svg width="84" height="84" viewBox="0 0 64 64" style={{flexShrink:0}}><circle cx="32" cy="32" r="30" fill={dark?"#151d2b":"#f8fafc"} stroke={ac} strokeWidth="2"/>{[...Array(12)].map((_,i)=>{const a=(i*30-90)*Math.PI/180;return <line key={i} x1={32+(i%3===0?22:24)*Math.cos(a)} y1={32+(i%3===0?22:24)*Math.sin(a)} x2={32+27*Math.cos(a)} y2={32+27*Math.sin(a)} stroke={tc} strokeWidth={i%3===0?"2":"1"} strokeLinecap="round"/>;})}<line x1="32" y1="32" x2={32+15*Math.cos(((h*30+m*.5)-90)*Math.PI/180)} y2={32+15*Math.sin(((h*30+m*.5)-90)*Math.PI/180)} stroke={tc} strokeWidth="2.5" strokeLinecap="round"/><line x1="32" y1="32" x2={32+20*Math.cos(((m*6+s*.1)-90)*Math.PI/180)} y2={32+20*Math.sin(((m*6+s*.1)-90)*Math.PI/180)} stroke={ac} strokeWidth="1.8" strokeLinecap="round"/><line x1="32" y1="32" x2={32+24*Math.cos((s*6-90)*Math.PI/180)} y2={32+24*Math.sin((s*6-90)*Math.PI/180)} stroke={dg} strokeWidth=".8" strokeLinecap="round"/><circle cx="32" cy="32" r="2.5" fill={ac}/></svg>);};
const Compass=({heading,dark,ac,dg,tc,mt})=>{const h=heading||0;return(<svg width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill={dark?"#151d2b":"#f8fafc"} stroke={ac} strokeWidth="1.5"/><g transform={`rotate(${-h} 20 20)`}><polygon points="20,4 16.5,20 20,16.5 23.5,20" fill={dg}/><polygon points="20,36 16.5,20 20,23.5 23.5,20" fill={mt}/><text x="20" y="12" textAnchor="middle" fontSize="6.5" fontWeight="700" fill={tc}>N</text></g><circle cx="20" cy="20" r="2" fill={ac}/></svg>);};
const StepTimer=({seconds,onDone,label,resume,pause,done,ac,acTx,sc,fs,BP})=>{
  const[left,setLeft]=useState(seconds);
  const[paused,setPaused]=useState(false);
  const firedRef=useRef(false);
  useEffect(()=>{setLeft(seconds);setPaused(false);firedRef.current=false;},[seconds]);
  useEffect(()=>{
    if(paused||left<=0)return;
    const iv=setInterval(()=>setLeft(v=>Math.max(0,v-1)),1000);
    return()=>clearInterval(iv);
  },[paused,left>0]);
  useEffect(()=>{
    if(left===0&&!firedRef.current){firedRef.current=true;if(onDone)onDone();}
  },[left,onDone]);
  const mm=String(Math.floor(left/60)).padStart(2,"0"),ss=String(left%60).padStart(2,"0");
  return(<div style={{textAlign:"center",margin:"10px 0"}}>
    <div style={{fontSize:34,fontWeight:800,fontVariantNumeric:"tabular-nums",color:left?acTx:sc}}>{left?`${mm}:${ss}`:done}</div>
    {!!left&&<button onClick={()=>setPaused(p=>!p)} style={{...BP,background:"transparent",color:acTx,border:`1px solid ${ac}`,padding:"4px 12px",marginTop:6,fontSize:fs-3}}>
      {paused?resume:pause}</button>}
  </div>);
};

// ---------------------------------------------------------------------------
// AILVIEFace — an original, lightweight animated SVG face for the voice chat.
// Not a photoreal human: a warm, stylised "humanoid" assistant whose mouth moves
// while speaking, whose eyes blink, and whose expression follows the state
// (idle / listening / thinking / speaking). Fully hand-drawn SVG, no external assets,
// so it is copyright-clean and cheap to render.
//
// state: "idle" | "listening" | "thinking" | "speaking"
// Defined OUTSIDE the app component so it is not remounted on every app render.
// ---------------------------------------------------------------------------
const AILVIEFace=({state="idle",dark=true})=>{
  // Use the REAL AILVIE portrait (not a cartoon). A photo cannot lip-sync, so instead we make
  // the image feel alive the way real voice assistants do: a reactive glow ring, a gentle
  // breathing scale, and a speaking waveform. Expression is conveyed by the ring + waveform,
  // not by moving the mouth.
  const speaking=state==="speaking", listening=state==="listening", thinking=state==="thinking";
  const ring=listening?"#00b4d8":speaking?"#34c3a3":thinking?"#e9a23b":"#00b4d8";
  const [bars,setBars]=React.useState([6,10,7,12,8]);
  const raf=React.useRef(0);
  React.useEffect(()=>{
    if(!speaking&&!listening){setBars([5,5,5,5,5]);return;}
    let t0=performance.now();
    const tick=(now)=>{
      const d=(now-t0)/1000;
      const amp=speaking?1:0.4;
      setBars([0,1,2,3,4].map(k=>6+Math.abs(Math.sin(d*(6+k*1.7)+k))*18*amp));
      raf.current=requestAnimationFrame(tick);
    };
    raf.current=requestAnimationFrame(tick);
    return ()=>cancelAnimationFrame(raf.current);
  },[speaking,listening]);
  return (
    <div style={{position:"relative",width:"100%",height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
      {/* glow ring */}
      <div style={{position:"absolute",top:"6%",width:"78%",aspectRatio:"1",borderRadius:"50%",
        border:`3px solid ${ring}`,opacity:(speaking||listening)?0.9:0.4,
        boxShadow:`0 0 26px ${ring}77, inset 0 0 24px ${ring}44`,
        animation:(speaking||listening)?"aiPulse 1.8s ease-out infinite":(thinking?"aiSpin 3.2s linear infinite":"none")}}/>
      {/* the real AILVIE image, gently breathing */}
      <img src="/avatar2-256.webp" alt="AILVIE" width="129" height="152"
        style={{width:"auto",height:"70%",maxWidth:"82%",objectFit:"contain",borderRadius:16,position:"relative",zIndex:1,
          filter:`drop-shadow(0 8px 22px ${ring}66)`,
          animation:speaking?"aiTalk 0.9s ease-in-out infinite":"aiBreathe 3.6s ease-in-out infinite"}}/>
      {/* speaking waveform */}
      <div style={{display:"flex",alignItems:"flex-end",gap:4,height:26,marginTop:6,zIndex:1,opacity:(speaking||listening)?1:0.25}}>
        {bars.map((h,k)=><span key={k} style={{width:5,height:h,borderRadius:3,background:ring,transition:"height .08s linear"}}/>)}
      </div>
    </div>
  );
};


export default function AILVIE_App(){
const[lang,setLang]=useState(function(){try{var s=localStorage.getItem("ailvie_lang");if(s)return s;}catch(e){}var b=(navigator.language||"tr").split("-")[0].toLowerCase();return["tr","en","de","ru","zh","hi","nl","es","ar"].indexOf(b)>=0?b:"en";});
const[dark,setDark]=useState(()=>{try{const v=localStorage.getItem("ailvie_theme");return v?v==="dark":true;}catch(e){return true;}});
const[hc,setHc]=useState(false);
const[fs,setFs]=useState(()=>{try{const v=parseInt(localStorage.getItem("ailvie_fs"));return v>=12&&v<=24?v:15;}catch{return 15;}});
useEffect(()=>{try{localStorage.setItem("ailvie_fs",String(fs));}catch{}},[fs]);
useEffect(()=>{try{document.documentElement.lang=lang;document.documentElement.dir=lang==="ar"?"rtl":"ltr";}catch{}},[lang]);
const[page,setPage]=useState("home");
// X2 ("My Health Status") accordion state. Identity is open by default because blood type,
// allergies and the emergency contact are what someone else needs to find fast in an emergency —
// they must not be hidden behind a tap. Held here (not inside a panel component) so panels stay
// plain functions and never remount on re-render.
const[x2Open,setX2Open]=useState({clin:true,id:true,meas:false,treat:false,rec:false});
const[pageHist,setPageHist]=useState(["home"]);
const[histIdx,setHistIdx]=useState(0);
const goTo=(p)=>{const nh=[...pageHist.slice(0,histIdx+1),p];setPageHist(nh);setHistIdx(nh.length-1);setPage(p);
  // Tapping "AILVIE Sohbet" starts the voice conversation immediately (this runs inside the
  // tap handler, so autoplay is allowed). Leaving chat stops it. If the user turns voice off
  // by hand they can tap the mic to resume.
  if(p==="chat"){ if(!voiceActiveRef.current) setTimeout(()=>startVoiceMode(true),150); }
  else { if(voiceActiveRef.current) stopVoiceMode(); }
  if(voiceFirstRef.current){try{haptic(12);const m={home:t.home,meds:t.meds,appts:t.appts,health:t.healthFull,notes:t.notes,contacts:t.contacts,community:t.community,chat:t.chat,admin:t.adminCh,settings:t.settings,pCard:t.pCardFull};const lbl=m[p]||p;if(lbl&&p!=="chat")speak(lbl,lang);}catch(e){}}};
const goBack=()=>{if(histIdx>0){setHistIdx(histIdx-1);setPage(pageHist[histIdx-1]);}};
const[trIn,setTrIn]=useState("");
const[trOut,setTrOut]=useState(null);
const[trLoad,setTrLoad]=useState(false);
const[trSrc,setTrSrc]=useState("tr"); // source EXT_LANGS key
const[trTgt,setTrTgt]=useState("en"); // target EXT_LANGS key
const[trShowSrcPick,setTrShowSrcPick]=useState(false);
const[trShowTgtPick,setTrShowTgtPick]=useState(false);
const[trResult,setTrResult]=useState(""); // single translation result
const[trSearch,setTrSearch]=useState("");
const[showLangPicker,setShowLangPicker]=useState(false);
const[settingsTab,setSettingsTab]=useState("all");
const[promoIn,setPromoIn]=useState("");
const[acctEmail,setAcctEmail]=useState(()=>{try{return localStorage.getItem("ailvie_account_email")||"";}catch(e){return"";}});
const[emailIn,setEmailIn]=useState(()=>{try{return localStorage.getItem("ailvie_account_email")||"";}catch(e){return"";}});
const[apiKey,setApiKey]=useState(()=>{try{return localStorage.getItem("ailvie_api_key")||"";}catch(e){return"";}});
const[showNotif,setShowNotif]=useState(false);
const[activeAlert,setActiveAlert]=useState(null); // big red half-screen health alert overlay
const[showAlerts,setShowAlerts]=useState(false); // full UYARILAR window
const[showEmergency,setShowEmergency]=useState(false);
const[showMenu,setShowMenu]=useState(false);
const[showFirstAid,setShowFirstAid]=useState(false);
const[showNav,setShowNav]=useState(false);
const[navQuery,setNavQuery]=useState("");
const[noteSheet,setNoteSheet]=useState(null); // 'add'|'color'|'format'|'more'
useEffect(()=>{
  try{localStorage.setItem("ailvie_theme",dark?"dark":"light");}catch(e){}
  const bg=dark?"#0a0e14":"#f7fafc";
  try{document.documentElement.style.background=bg;document.body.style.background=bg;}catch(e){}
  try{const m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute("content",dark?"#0a0e14":"#00b4d8");}catch(e){}
},[dark]);
const[voiceGuide,setVoiceGuide]=useState(()=>{try{return localStorage.getItem("ailvie_voiceguide")==="1";}catch(e){return false;}});
useEffect(()=>{try{localStorage.setItem("ailvie_voiceguide",voiceGuide?"1":"0");}catch(e){}},[voiceGuide]);
const[guide,setGuide]=useState(null);      // {key,i,left,paused}
const guideTickRef=useRef(null);
const[noteDraw,setNoteDraw]=useState(false);
const[noteRec,setNoteRec]=useState(null); // {id,sec} while recording
const[noteBar,setNoteBar]=useState({show:false,h:0,top:0});
const[vvh,setVvh]=useState(0);
const[vvTop,setVvTop]=useState(0);
const[fmtState,setFmtState]=useState({b:false,i:false,u:false,block:""});
useEffect(()=>{const vv=window.visualViewport;if(!vv)return;const on=()=>{setVvh(Math.round(vv.height));setVvTop(Math.round(vv.offsetTop));};on();vv.addEventListener("resize",on);vv.addEventListener("scroll",on);return()=>{vv.removeEventListener("resize",on);vv.removeEventListener("scroll",on);};},[]);
const[noteMedia,setNoteMedia]=useState({});
const noteMediaLoadedRef=useRef(false);
useEffect(()=>{(async()=>{let raw=null;try{raw=await idbGet("ailvie_notemedia");}catch(e){}
  if(raw==null){try{raw=localStorage.getItem("ailvie_notemedia");if(raw)await idbSet("ailvie_notemedia",raw);}catch(e){}}
  try{if(raw){const o=JSON.parse(raw);if(o&&typeof o==="object")setNoteMedia(o);}}catch(e){}
  noteMediaLoadedRef.current=true;})();},[]);
useEffect(()=>{if(!noteMediaLoadedRef.current)return;const tm=setTimeout(()=>{const p=JSON.stringify(noteMedia);(async()=>{let ok=false;
  try{await idbSet("ailvie_notemedia",p);ok=true;}catch(e){}
  try{localStorage.setItem("ailvie_notemedia",p);}catch(e){if(!ok)setStorageWarn(lang==="tr"?"⚠️ Depolama dolu — çizim/fotoğraf kaydedilemiyor. Yedek alın veya eski medyaları silin.":TL("⚠️ Storage full — drawings not saved.",lang));}
})();},700);return()=>clearTimeout(tm);},[noteMedia,lang]);
const editableRef=useRef(null);
const noteHistRef=useRef({stack:[],idx:-1,nid:null});
const noteRecRef=useRef(null);
const drawCanvasRef=useRef(null);
const drawStateRef=useRef({strokes:[],redo:[],color:null,size:6,tool:"pen",erase:false,highlight:false,showColors:false,showMenu:false,current:null});
const[drawTick,setDrawTick]=useState(0);
const[faOpen,setFaOpen]=useState(null);
const[voiceFirst,setVoiceFirst]=useState(()=>{try{return localStorage.getItem("ailvie_vf")==="1";}catch{return false;}});
useEffect(()=>{try{localStorage.setItem("ailvie_vf",voiceFirst?"1":"0");}catch{}},[voiceFirst]);
const voiceFirstRef=useRef(false);useEffect(()=>{voiceFirstRef.current=voiceFirst;},[voiceFirst]);
const haptic=(pat)=>{try{if(navigator.vibrate)navigator.vibrate(pat);}catch(e){}};
const[online,setOnline]=useState(typeof navigator!=="undefined"?navigator.onLine:true);
const[installEvt,setInstallEvt]=useState(null);
const[iosHelp,setIosHelp]=useState(false);
const[installDismissed,setInstallDismissed]=useState(()=>{try{return !!localStorage.getItem("ailvie_install_dismissed");}catch(e){return false;}});
const[showOb,setShowOb]=useState(()=>{try{if(localStorage.getItem("ailvie_onboarded"))return false;if(localStorage.getItem("ailvie_lang"))return false;return true;}catch(e){return false;}});
const[obStep,setObStep]=useState(0);
const[toast,setToast]=useState(null);
const[showEmoji,setShowEmoji]=useState(false);
const[appLockEnabled,setAppLockEnabled]=useState(()=>{try{return localStorage.getItem("ailvie_lock")==="1";}catch(e){return false;}});
const[isLocked,setIsLocked]=useState(()=>{try{return localStorage.getItem("ailvie_lock")==="1";}catch(e){return false;}});
const toastTm=useRef(null);
const recRef=useRef(null);
const voiceCacheRef=useRef({});
const[ttsInfo,setTtsInfo]=useState({engine:null,voice:null});   // diagnostics for Settings
const audioRef=useRef(null); // Azure TTS audio element
const chatEndRef=useRef(null); // auto-scroll anchor for chat
const[isListen,setIsListen]=useState(false);
const[isSpeak,setIsSpeak]=useState(false);
const[zoom,setZoom]=useState(()=>{try{const z=parseFloat(localStorage.getItem("ailvie_zoom"));return z>=1&&z<=1.5?z:1;}catch{return 1;}});
useEffect(()=>{try{localStorage.setItem("ailvie_zoom",String(zoom));}catch{}},[zoom]);
// Draggable zoom control position (top/right offsets in px), persisted
const[zoomPos,setZoomPos]=useState(()=>{try{const p=JSON.parse(localStorage.getItem("ailvie_zoompos"));if(p&&typeof p.top==="number"&&typeof p.right==="number")return p;}catch{}return{top:64,right:10};});
const zoomDrag=useRef({active:false,moved:false,startX:0,startY:0,startTop:0,startRight:0});
const[voiceActive,setVoiceActive]=useState(false);
const[chatThinking,setChatThinking]=useState(false);   // AI is composing a reply (drives the face)
const faceState=isSpeak?"speaking":(isListen?"listening":(chatThinking?"thinking":"idle"));
const voiceActiveRef=useRef(false); // always-current value for callbacks (avoids stale closure)
useEffect(()=>{voiceActiveRef.current=voiceActive;},[voiceActive]);
const isSpeakRef=useRef(false); // always-current isSpeak for voice loop
useEffect(()=>{isSpeakRef.current=isSpeak;},[isSpeak]);
// Admin support — per-user (keyed by user id)
const userId=(()=>{try{let id=localStorage.getItem("ailvie_uid");if(!id){id="u_"+Date.now()+"_"+Math.random().toString(36).slice(2,8);localStorage.setItem("ailvie_uid",id);}return id;}catch{return"u_anon";}})();
const[adminMsgs,setAdminMsgs]=useState(()=>{try{return JSON.parse(localStorage.getItem("ailvie_support_"+userId)||"[]");}catch{return[];}});
useEffect(()=>{try{localStorage.setItem("ailvie_support_"+userId,JSON.stringify(adminMsgs));}catch{}},[adminMsgs,userId]);
const[adminIn,setAdminIn]=useState("");
const[wordLang,setWordLang]=useState(lang==="tr"?"en":lang==="en"?"tr":"en");
const[showWordLangPicker,setShowWordLangPicker]=useState(false);
const alarmTimers=useRef([]);

const t=T[lang]||T.en;

const rtl=lang==="ar";
const lc=LC[lang]||"en-US";

const[now,setNow]=useState(new Date());
// The digital clock, greeting, date and calendar only need MINUTE precision. Ticking every
// second re-rendered the entire app ~16 DOM mutations/sec while idle. Align to the minute.
useEffect(()=>{
  let t;
  const schedule=()=>{
    const d=new Date();
    const msToNextMinute=(60-d.getSeconds())*1000-d.getMilliseconds();
    t=setTimeout(()=>{setNow(new Date());schedule();},Math.max(250,msToNextMinute));
  };
  schedule();
  return()=>clearTimeout(t);
},[]);
// ---- Weather (Open-Meteo, keyless) + Compass (DeviceOrientation) ----
const[weather,setWeather]=useState(null);
const[showWx,setShowWx]=useState(false);
const[heading,setHeading]=useState(null);
const[compassErr,setCompassErr]=useState(null);
const oriHandlerRef=useRef(null);
const loadWeather=useCallback((manual)=>{ // location -> Open-Meteo (no API key); GPS first, IP fallback
  const fetchWx=(lat,lon,src)=>{
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto&forecast_days=7`).then(r=>r.ok?r.json():null).then(j=>{if(j){if(src==="gps"){try{localStorage.setItem("ailvie_geo","1");}catch(e){}}setWeather({cur:j.current,hourly:j.hourly,daily:j.daily,approx:src==="ip"});}else setWeather({err:"net"});}).catch(()=>setWeather({err:"net"}));
  };
  const fail=()=>{setWeather({err:"loc"});if(manual)notify(lang==="tr"?"Konum alınamadı. Telefon konum servisini açıp tekrar deneyin.":TL("Couldn't get location. Turn on device location services and retry.",lang));};
  const ipFallback=()=>{ // approximate (city-level) location by IP, keyless
    fetch("https://ipwho.is/").then(r=>r.ok?r.json():null).then(j=>{if(j&&j.success&&j.latitude!=null)fetchWx(j.latitude,j.longitude,"ip");else throw 0;}).catch(()=>{fetch("https://get.geojs.io/v1/ip/geo.json").then(r=>r.ok?r.json():null).then(j=>{if(j&&j.latitude!=null)fetchWx(j.latitude,j.longitude,"ip");else fail();}).catch(fail);});
  };
  if(!navigator.geolocation){ipFallback();return;}
  navigator.geolocation.getCurrentPosition(p=>{
    if(manual)notify(lang==="tr"?"✓ Konum açık — hava durumu yükleniyor":TL("✓ Location on — loading weather",lang));
    fetchWx(p.coords.latitude.toFixed(3),p.coords.longitude.toFixed(3),"gps");
  },(err)=>{ // GPS denied/timeout/unavailable -> approximate by IP so weather still loads
    if(err&&err.code===1){try{localStorage.removeItem("ailvie_geo");}catch(e){}}
    if(manual)notify(lang==="tr"?"📍 Kesin konum yok — yaklaşık konumla getiriliyor…":TL("📍 Using approximate location…",lang));
    ipFallback();
  },{timeout:12000,maximumAge:600000,enableHighAccuracy:false});
},[lang]);
useEffect(()=>{ // auto-connect to weather whenever location is (or was) granted; no startup prompt otherwise
  if(!navigator.geolocation){setWeather({err:"unsupported"});return;}
  let locPref=true;try{const sp=localStorage.getItem("ailvie_perms");if(sp)locPref=JSON.parse(sp).loc!==false;}catch(e){}
  if(!locPref){setWeather({err:"off"});return;} // user disabled location -> no weather, no prompt
  let granted=false;try{granted=localStorage.getItem("ailvie_geo")==="1";}catch(e){}
  if(navigator.permissions&&navigator.permissions.query){
    navigator.permissions.query({name:"geolocation"}).then(ps=>{
      if(ps.state==="granted"||granted){loadWeather();}
      else{setWeather({err:"loc"});} // needs location -> chip shows tap-to-enable, no prompt
      ps.onchange=()=>{if(ps.state==="granted")loadWeather();};
    }).catch(()=>{if(granted)loadWeather();else setWeather({err:"loc"});});
  }else{if(granted)loadWeather();else setWeather({err:"loc"});} // iOS Safari (no permissions.query): use remembered grant
},[loadWeather]);
const attachCompass=()=>{const handler=(e)=>{let h=null;if(e.webkitCompassHeading!=null)h=e.webkitCompassHeading;else if(e.alpha!=null&&e.absolute)h=360-e.alpha;if(h!=null){setHeading((h+360)%360);setCompassErr(null);}};oriHandlerRef.current=handler;window.addEventListener("deviceorientationabsolute",handler,true);window.addEventListener("deviceorientation",handler,true);};
const startCompass=()=>{if(typeof DeviceOrientationEvent==="undefined"){setCompassErr("unsupported");return;}if(typeof DeviceOrientationEvent.requestPermission==="function"){DeviceOrientationEvent.requestPermission().then(s=>{s==="granted"?attachCompass():setCompassErr("perm");}).catch(()=>setCompassErr("perm"));}else attachCompass();};
useEffect(()=>{ // auto-attach on platforms that need no permission (Android); iOS attaches on tap
  if(typeof DeviceOrientationEvent==="undefined"){setCompassErr("unsupported");return;}
  if(typeof DeviceOrientationEvent.requestPermission!=="function")attachCompass();
  return()=>{if(oriHandlerRef.current){window.removeEventListener("deviceorientationabsolute",oriHandlerRef.current,true);window.removeEventListener("deviceorientation",oriHandlerRef.current,true);}};
},[]);
useEffect(()=>{const on=()=>setOnline(true),off=()=>setOnline(false);window.addEventListener("online",on);window.addEventListener("offline",off);return()=>{window.removeEventListener("online",on);window.removeEventListener("offline",off);};},[]);
useEffect(()=>{const bip=(e)=>{e.preventDefault();setInstallEvt(e);};const inst=()=>{setInstallEvt(null);try{localStorage.setItem("ailvie_install_dismissed","1");}catch(e){}setInstallDismissed(true);};window.addEventListener("beforeinstallprompt",bip);window.addEventListener("appinstalled",inst);return()=>{window.removeEventListener("beforeinstallprompt",bip);window.removeEventListener("appinstalled",inst);};},[]);

// Notifications
const[notifs,setNotifs]=useState([]);
const unread=notifs.filter(n=>!n.read).length;

// --- E2E sync operations (opt-in; default OFF) ---
const collectSyncPayload=async()=>{
  let data=null,medimg=null;
  try{data=await idbGet("ailvie_data");}catch(e){}
  if(data==null)data=localStorage.getItem("ailvie_data")||"{}";
  try{medimg=await idbGet("ailvie_medimg");}catch(e){}
  let notemedia=null;try{notemedia=await idbGet("ailvie_notemedia");}catch(e){}
  return{ailvie_data:data,ailvie_medimg:medimg||null,ailvie_notemedia:notemedia||null,ailvie_lang:localStorage.getItem("ailvie_lang")||"",clientAt:Date.now()};
};
const applySyncPayload=async(p)=>{
  if(p&&typeof p.ailvie_data==="string"){try{await idbSet("ailvie_data",p.ailvie_data);}catch(e){}try{localStorage.setItem("ailvie_data",p.ailvie_data);}catch(e){}}
  if(p&&typeof p.ailvie_medimg==="string"){try{await idbSet("ailvie_medimg",p.ailvie_medimg);}catch(e){}}
  if(p&&typeof p.ailvie_notemedia==="string"){try{await idbSet("ailvie_notemedia",p.ailvie_notemedia);}catch(e){}try{localStorage.setItem("ailvie_notemedia",p.ailvie_notemedia);}catch(e){}}
  if(p&&p.ailvie_lang){try{localStorage.setItem("ailvie_lang",p.ailvie_lang);}catch(e){}}
};
const syncPush=async(force)=>{
  const L=lang==="tr";
  if(!syncCfg||!syncKeysRef.current){setSyncMsg(L?"Senkron kilidi açık değil — parolayı girin.":"Unlock sync first.");return;}
  setSyncBusy(true);setSyncMsg("");
  try{
    const payload=await collectSyncPayload();
    const blob=await syncEncrypt(payload,syncKeysRef.current.encKey);
    const r=await fetch("/api/sync",{method:"POST",headers:{"Content-Type":"application/json","X-AILVIE-Client":"web"},
      body:JSON.stringify({id:syncCfg.syncId,authToken:syncKeysRef.current.authTok,blob,baseUpdatedAt:force?undefined:(syncCfg.updatedAt||0)})});
    if(r.status===409){
      const j=await r.json();
      setSyncBusy(false);
      const ok=window.confirm(L?"Başka bir cihaz bu hesabı daha yeni güncellemiş.\n\nTAMAM: Sunucudaki veriyi bu cihaza indir (bu cihazdaki değişiklikler kaybolabilir)\nİPTAL: Bu cihazdaki veriyi sunucuya yaz (sunucudaki kaybolur)":"Server copy is newer. OK=pull, Cancel=overwrite");
      if(ok){await syncPull();}else{await syncPush(true);}
      return;
    }
    if(!r.ok){const j=await r.json().catch(()=>({}));throw new Error(j.error||("HTTP "+r.status));}
    const j=await r.json();
    const cfg={...syncCfg,updatedAt:j.updatedAt,version:j.version,lastSync:Date.now()};
    try{localStorage.setItem("ailvie_sync",JSON.stringify(cfg));}catch(e){}
    setSyncCfg(cfg);setSyncMsg(L?"✓ Yüklendi (şifreli)":"✓ Uploaded (encrypted)");
  }catch(e){
    const m=String(e.message||e);
    setSyncMsg(m==="sync-not-configured"?(L?"Sunucuda senkron deposu (KV) tanımlı değil.":"Sync store not configured."):(L?"Yükleme başarısız: "+m:"Upload failed: "+m));
  }finally{setSyncBusy(false);}
};
const syncPull=async()=>{
  const L=lang==="tr";
  if(!syncCfg||!syncKeysRef.current){setSyncMsg(L?"Senkron kilidi açık değil — parolayı girin.":"Unlock sync first.");return;}
  setSyncBusy(true);setSyncMsg("");
  try{
    const r=await fetch("/api/sync?id="+encodeURIComponent(syncCfg.syncId),{headers:{"X-AILVIE-Client":"web"}});
    if(!r.ok){const j=await r.json().catch(()=>({}));throw new Error(j.error||("HTTP "+r.status));}
    const j=await r.json();
    if(!j.found){setSyncMsg(L?"Sunucuda henüz veri yok. Önce 'Yükle' deyin.":"No server copy yet.");return;}
    let payload;
    try{payload=await syncDecrypt(j.blob,syncKeysRef.current.encKey);}
    catch(e){setSyncMsg(L?"❌ Çözülemedi — parola bu hesabın parolası değil. Veriler değiştirilmedi.":"❌ Wrong password. Nothing changed.");return;}
    if(!window.confirm(L?"Sunucudaki veri bu cihaza yazılacak; mevcut veriler değiştirilecek. Devam?":"Server copy will replace local data. Continue?"))return;
    await applySyncPayload(payload);
    const cfg={...syncCfg,updatedAt:j.updatedAt,version:j.version,lastSync:Date.now()};
    try{localStorage.setItem("ailvie_sync",JSON.stringify(cfg));}catch(e){}
    setSyncCfg(cfg);
    setSyncMsg(L?"✓ İndirildi, yenileniyor…":"✓ Pulled, reloading…");
    setTimeout(()=>location.reload(),800);
  }catch(e){
    const m=String(e.message||e);
    setSyncMsg(m==="sync-not-configured"?(L?"Sunucuda senkron deposu (KV) tanımlı değil.":"Sync store not configured."):(L?"İndirme başarısız: "+m:"Pull failed: "+m));
  }finally{setSyncBusy(false);}
};
const patCtx=()=>{
  const c={band:ageBandOf(pat.birthDate),ageYears:ageYearsFrom(pat.birthDate),pregnant:!!pat.pregnant,sex:pat.sex||"",onAnticoag:!!pat.onAnticoag,onDiuretic:(meds||[]).some(m=>/furosemid|lasix|hidroklorotiyazid|hydrochlorothiazide|hctz|spironolakton|spironolactone|torasemid|torsemide|bumetanid|bumetanide|indapamid|indapamide|klortalidon|chlorthalidone|diüretik|diuretic/i.test(String((m&&m.name)||"")))};
  // eGFR from the most recent creatinine, so drug-vs-lab rules (e.g. metformin at low eGFR) can fire.
  try{
    let cr=null;for(const r of labs||[]){if(r&&r.test==="creatinine"&&isFinite(Number(r.canonValue))&&(!cr||r.ts>cr.ts))cr=r;}
    if(cr){const eg=calcEGFR(cr.canonValue,c.ageYears,c.sex);if(eg&&eg.ok)c.egfr=eg.value;}
  }catch(e){}
  return c;
};
const parseLabDocument=async(file)=>{
  const L=lang==="tr";
  if(!file)return;
  const isPdf=file.type==="application/pdf"||/\.pdf$/i.test(file.name);
  if(isPdf&&file.size>4.5*1024*1024){setLabParse({busy:false,rows:[],err:L?"PDF çok büyük (max ~4.5 MB). Sayfaları ayrı yükleyin.":"PDF too large (max ~4.5MB).",fileName:file.name});return;}
  setLabParse({busy:true,rows:[],err:null,fileName:file.name});
  try{
    let b64,mediaType;
    if(isPdf){
      mediaType="application/pdf";
      b64=await new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(String(r.result).split(",")[1]);r.onerror=()=>rej(new Error("read"));r.readAsDataURL(file);});
    }else{
      // Decode ANY browser-supported image (incl. HEIC on iOS) and re-encode to JPEG.
      // Fixes: (1) HEIC/unsupported types, (2) multi-MB phone photos exceeding request limits.
      const bmp=await (async()=>{
        try{if(window.createImageBitmap)return await createImageBitmap(file);}catch(e){}
        return await new Promise((res,rej)=>{const u=URL.createObjectURL(file);const im=new Image();im.onload=()=>{URL.revokeObjectURL(u);res(im);};im.onerror=()=>{URL.revokeObjectURL(u);rej(new Error("decode"));};im.src=u;});
      })().catch(()=>null);
      if(!bmp)throw new Error(L?"Bu görsel biçimi okunamadı. JPG/PNG olarak kaydedip tekrar deneyin.":"Unsupported image format.");
      const maxSide=1800,w0=bmp.width||bmp.naturalWidth,h0=bmp.height||bmp.naturalHeight;
      const sc=Math.min(1,maxSide/Math.max(w0,h0));
      const cv=document.createElement("canvas");cv.width=Math.round(w0*sc);cv.height=Math.round(h0*sc);
      cv.getContext("2d").drawImage(bmp,0,0,cv.width,cv.height);
      let q=0.85,dataUrl=cv.toDataURL("image/jpeg",q);
      while(dataUrl.length>4.2*1024*1024&&q>0.4){q-=0.15;dataUrl=cv.toDataURL("image/jpeg",q);}
      if(bmp.close)bmp.close();
      mediaType="image/jpeg";b64=dataUrl.split(",")[1];
    }
    const known=LAB_TESTS.map(x=>x.k).join(", ");
    const sys="You extract laboratory test results from a report image/PDF. Return ONLY valid JSON, no prose, no markdown fences. Schema: {\"rows\":[{\"test\":\"<one of: "+known+" | unknown>\",\"raw_name\":\"<name as printed>\",\"value\":<number>,\"unit\":\"<unit as printed>\",\"ref_low\":<number|null>,\"ref_high\":<number|null>,\"flag\":\"<H|L|critical|null>\",\"confidence\":<0..1>}],\"report_date\":\"<YYYY-MM-DD|null>\",\"lab_name\":\"<string|null>\",\"overall_confidence\":<0..1>}. Rules: never invent values; if a field is unreadable use null and lower confidence; map test names to the allowed keys only when certain, otherwise use \"unknown\" and keep raw_name; copy units exactly as printed; include the report's own reference range when printed.";
    const content=[isPdf?{type:"document",source:{type:"base64",media_type:"application/pdf",data:b64}}:{type:"image",source:{type:"base64",media_type:mediaType,data:b64}},{type:"text",text:"Extract all lab results as JSON per the schema."}];
    const r=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:4000,system:sys,messages:[{role:"user",content}]})});
    if(!r.ok){const e=await r.json().catch(()=>({}));throw new Error(e.error||("HTTP "+r.status));}
    const j=await r.json();
    const txt=(j.content||[]).filter(x=>x.type==="text").map(x=>x.text).join("").replace(/```json|```/g,"").trim();
    let parsed;
    try{parsed=JSON.parse(txt);}
    catch(pe){throw new Error(L?"Rapor çok uzun veya okunamadı; daha net/bölünmüş bir fotoğraf deneyin.":"Report too long or unreadable.");}
    const rows=(parsed.rows||[]).map((x,i)=>{
      const known2=LAB_TESTS.find(t=>t.k===x.test);
      const conf=Number(x.confidence);
      return{id:"p"+i,test:known2?x.test:"",rawName:x.raw_name||"",value:x.value==null?"":String(x.value),unit:x.unit||"",low:x.ref_low==null?"":String(x.ref_low),high:x.ref_high==null?"":String(x.ref_high),flag:x.flag||null,confidence:isFinite(conf)?conf:0,include:!!known2&&x.value!=null};
    });
    if(!rows.length)setLabParse({busy:false,rows:[],err:L?"Belgede tanınabilir tahlil bulunamadı. Değerleri elle girebilirsiniz.":"No recognizable labs found.",fileName:file.name});
    else setLabParse({busy:false,rows,err:null,fileName:file.name,overall:Number(parsed.overall_confidence)||0,labName:parsed.lab_name||null,reportDate:parsed.report_date||null});
  }catch(err){
    const msg=String(err&&err.message||err);
    setLabParse({busy:false,rows:[],err:/API key/i.test(msg)
      ?(L?"Sunucuda AI anahtarı tanımlı değil — belge okuma şu an kullanılamıyor. Değerleri elle girebilirsiniz.":"AI key not configured on server.")
      :(L?("Belge okunamadı: "+msg+". Değerleri elle girebilirsiniz."):("Could not read document: "+msg)),fileName:file.name});
  }
};
const fold=(x)=>String(x==null?"":x).toLocaleLowerCase("tr").normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/ı/g,"i");
const getActiveWarnings=()=>{
  const out=[];const nowMin=now.getHours()*60+now.getMinutes();const tr=lang==='tr';
  meds.forEach(m=>{if(m.taken||!m.time)return;const[h,mm]=(m.time||'0:0').split(':').map(Number);const d=nowMin-(h*60+mm);
    if(d>=0&&d<=240)out.push({id:'med'+m.id,icon:'💊',kind:'med',ref:m,title:m.name+(m.dose?' '+m.dose:''),sub:d<=0?(tr?'Şimdi · '+m.time:'Now · '+m.time):(tr?`${d} dk geçti · ${m.time}`:`${d} min ago · ${m.time}`),high:d>0});});
  appts.forEach(a=>{if(!a.date)return;const aDate=new Date(a.date+'T'+(a.time||'09:00'));const dMin=Math.round((aDate-now)/60000);
    if(dMin<=180&&dMin>=-180)out.push({id:'appt'+a.id,icon:'🏥',kind:'appt',ref:a,title:a.doctor||(tr?'Randevu':'Appointment'),sub:dMin>=0?(tr?`${dMin} dk kaldı`:`in ${dMin} min`):(tr?`${-dMin} dk geçti`:`${-dMin} min ago`),high:dMin<=0});});
  const isoD=now.toISOString().split('T')[0];
  if(calAlarms[isoD]){const[h,mm]=(calAlarms[isoD]||'0:0').split(':').map(Number);const d=nowMin-(h*60+mm);if(d>=-60&&d<=240)out.push({id:'cal'+isoD,icon:'📅',kind:'cal',title:calNotes[isoD]||(tr?'Takvim alarmı':'Calendar alarm'),sub:calAlarms[isoD],high:d>=0});}
  try{if(glucose&&glucose.length){const g=glucose[glucose.length-1];if(g&&(Date.now()-g.ts)<864e5&&(g.val<70||g.val>=250))out.push({id:'gluW',icon:'🩸',kind:'info',title:(tr?'Şeker':'Glucose')+' '+g.val+' mg/dL',sub:g.val<70?(tr?'düşük — dikkat':'low'):(tr?'yüksek — doktorunuza danışın':'high'),high:g.val<54||g.val>=300});}const bl=(healthLog||[]).filter(x=>x.type==='bp');if(bl.length){const bp=bl[bl.length-1];const sV=bp.val,dV=(bp.meta&&bp.meta.d)||0;if((Date.now()-bp.ts)<864e5&&(sV>=140||dV>=90||sV<90))out.push({id:'bpW',icon:'🩺',kind:'info',title:(tr?'Tansiyon':'BP')+' '+sV+'/'+dV,sub:(sV>=140||dV>=90)?(tr?'yüksek':'high'):(tr?'düşük':'low'),high:sV>=180||dV>=120});}}catch(e){}
  return out.sort((a,b)=>(b.high?1:0)-(a.high?1:0));
};
// ---------- Encrypted backup (Web Crypto: AES-256-GCM + PBKDF2) ----------
const enc=new TextEncoder(),dec=new TextDecoder();
const b64e=(buf)=>btoa(String.fromCharCode(...new Uint8Array(buf)));
const b64d=(str)=>Uint8Array.from(atob(str),c=>c.charCodeAt(0));
const deriveKey=async(password,salt)=>{
  const base=await crypto.subtle.importKey("raw",enc.encode(password),"PBKDF2",false,["deriveKey"]);
  return crypto.subtle.deriveKey({name:"PBKDF2",salt,iterations:250000,hash:"SHA-256"},base,{name:"AES-GCM",length:256},false,["encrypt","decrypt"]);
};
const encryptJSON=async(obj,password)=>{
  const salt=crypto.getRandomValues(new Uint8Array(16)),iv=crypto.getRandomValues(new Uint8Array(12));
  const key=await deriveKey(password,salt);
  const ct=await crypto.subtle.encrypt({name:"AES-GCM",iv},key,enc.encode(JSON.stringify(obj)));
  return{app:"AILVIE",format:"ailvie-encrypted-backup",version:2,kdf:{name:"PBKDF2",hash:"SHA-256",iterations:250000},cipher:"AES-256-GCM",
    exportedAt:new Date().toISOString(),salt:b64e(salt),iv:b64e(iv),ciphertext:b64e(ct)};
};
const decryptJSON=async(env,password)=>{
  const key=await deriveKey(password,b64d(env.salt));
  const pt=await crypto.subtle.decrypt({name:"AES-GCM",iv:b64d(env.iv)},key,b64d(env.ciphertext));
  return JSON.parse(dec.decode(pt));
};
if(typeof window!=="undefined"){window.__encryptJSON=encryptJSON;window.__decryptJSON=decryptJSON;}
// ---------- End-to-end encrypted sync (server can NEVER read user data) ----------
// masterKey = PBKDF2(password, salt=syncId)   [never leaves device]
//   encKey   = HKDF(masterKey,"ailvie-enc")   -> encrypts the payload
//   authTok  = HKDF(masterKey,"ailvie-auth")  -> proves write permission; server stores SHA-256(authTok)
// The server sees only: syncId, SHA-256(authTok), ciphertext, iv, updatedAt.
const sha256b64=async(bytes)=>b64e(await crypto.subtle.digest("SHA-256",bytes));
const deriveSyncKeys=async(password,syncId)=>{
  const base=await crypto.subtle.importKey("raw",enc.encode(password),"PBKDF2",false,["deriveBits"]);
  const master=await crypto.subtle.deriveBits({name:"PBKDF2",salt:enc.encode("ailvie:"+syncId),iterations:250000,hash:"SHA-256"},base,256);
  const hk=await crypto.subtle.importKey("raw",master,"HKDF",false,["deriveBits"]);
  const encBits=await crypto.subtle.deriveBits({name:"HKDF",hash:"SHA-256",salt:new Uint8Array(0),info:enc.encode("ailvie-enc")},hk,256);
  const authBits=await crypto.subtle.deriveBits({name:"HKDF",hash:"SHA-256",salt:new Uint8Array(0),info:enc.encode("ailvie-auth")},hk,256);
  const encKey=await crypto.subtle.importKey("raw",encBits,{name:"AES-GCM"},false,["encrypt","decrypt"]);
  return{encKey,authTok:b64e(authBits),authHash:await sha256b64(new Uint8Array(authBits))};
};
const syncEncrypt=async(obj,encKey)=>{
  const iv=crypto.getRandomValues(new Uint8Array(12));
  const ct=await crypto.subtle.encrypt({name:"AES-GCM",iv},encKey,enc.encode(JSON.stringify(obj)));
  return{iv:b64e(iv),ciphertext:b64e(ct)};
};
const syncDecrypt=async(blob,encKey)=>{
  const pt=await crypto.subtle.decrypt({name:"AES-GCM",iv:b64d(blob.iv)},encKey,b64d(blob.ciphertext));
  return JSON.parse(dec.decode(pt));
};
// syncId is derived from the account identifier so it is not the raw email on the server
const makeSyncId=async(identifier)=>{
  const h=await crypto.subtle.digest("SHA-256",enc.encode("ailvie-id:"+String(identifier).trim().toLowerCase()));
  return b64e(h).replace(/[^A-Za-z0-9]/g,"").slice(0,32);
};
if(typeof window!=="undefined"){window.__deriveSyncKeys=deriveSyncKeys;window.__syncEncrypt=syncEncrypt;window.__syncDecrypt=syncDecrypt;window.__makeSyncId=makeSyncId;}
// ---------- App lock: PIN (PBKDF2-hashed, never stored in clear) + optional biometric (WebAuthn) ----------
const hashPIN=async(pin,saltB64)=>{
  const salt=saltB64?b64d(saltB64):crypto.getRandomValues(new Uint8Array(16));
  const base=await crypto.subtle.importKey("raw",enc.encode(pin),"PBKDF2",false,["deriveBits"]);
  const bits=await crypto.subtle.deriveBits({name:"PBKDF2",salt,iterations:250000,hash:"SHA-256"},base,256);
  return{salt:b64e(salt),hash:b64e(bits)};
};
const verifyPIN=async(pin,rec)=>{
  if(!rec||!rec.salt||!rec.hash)return false;
  const h=await hashPIN(pin,rec.salt);
  // constant-time-ish compare
  if(h.hash.length!==rec.hash.length)return false;
  let diff=0;for(let i=0;i<h.hash.length;i++)diff|=h.hash.charCodeAt(i)^rec.hash.charCodeAt(i);
  return diff===0;
};
const biometricAvailable=async()=>{try{return !!(window.PublicKeyCredential&&await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable());}catch(e){return false;}};
const biometricRegister=async(userName)=>{
  const challenge=crypto.getRandomValues(new Uint8Array(32));
  const userId=crypto.getRandomValues(new Uint8Array(16));
  const cred=await navigator.credentials.create({publicKey:{
    challenge,rp:{name:"AILVIE"},user:{id:userId,name:userName||"ailvie-user",displayName:userName||"AILVIE"},
    pubKeyCredParams:[{type:"public-key",alg:-7},{type:"public-key",alg:-257}],
    authenticatorSelection:{authenticatorAttachment:"platform",userVerification:"required",residentKey:"preferred"},
    timeout:60000,attestation:"none"}});
  if(!cred)throw new Error("no-credential");
  return b64e(cred.rawId);
};
const biometricVerify=async(credIdB64)=>{
  const challenge=crypto.getRandomValues(new Uint8Array(32));
  const pk={challenge,timeout:60000,userVerification:"required"};
  if(credIdB64)pk.allowCredentials=[{type:"public-key",id:b64d(credIdB64)}];
  const assertion=await navigator.credentials.get({publicKey:pk});
  return !!assertion;
};
if(typeof window!=="undefined"){window.__hashPIN=hashPIN;window.__verifyPIN=verifyPIN;}
// ---------- Durable storage: IndexedDB primary, localStorage fallback/migration ----------
// Why: localStorage is ~5MB, throws QuotaExceededError when full (previously swallowed silently),
// and browsers evict it under storage pressure. IndexedDB is orders of magnitude larger.
const IDB_NAME="ailvie",IDB_STORE="kv";
const idbOpen=()=>new Promise((res,rej)=>{
  try{const r=indexedDB.open(IDB_NAME,1);
    r.onupgradeneeded=()=>{const db=r.result;if(!db.objectStoreNames.contains(IDB_STORE))db.createObjectStore(IDB_STORE);};
    r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error);
  }catch(e){rej(e);}
});
const idbGetSafe=async(k)=>{
  try{const db=await idbOpen();
    const v=await new Promise((res,rej)=>{const t=db.transaction(IDB_STORE,"readonly").objectStore(IDB_STORE).get(k);t.onsuccess=()=>res(t.result);t.onerror=()=>rej(t.error);});
    return{ok:true,value:v};                       // v may be undefined = key genuinely absent
  }catch(e){return{ok:false,error:e};}             // read FAILED - caller must not assume "no data"
};
const idbGet=async(k)=>{const r=await idbGetSafe(k);return r.ok?r.value:undefined;};
const idbSet=async(k,v)=>{const db=await idbOpen();return await new Promise((res,rej)=>{const tx=db.transaction(IDB_STORE,"readwrite");tx.objectStore(IDB_STORE).put(v,k);tx.oncomplete=()=>res(true);tx.onerror=()=>rej(tx.error);tx.onabort=()=>rej(tx.error||new Error("abort"));});};
// Ask the browser to make storage persistent (won't be auto-evicted). Best-effort.
const requestPersistentStorage=async()=>{try{if(navigator.storage&&navigator.storage.persist){if(await navigator.storage.persisted())return true;return await navigator.storage.persist();}}catch(e){}return false;};

if(typeof window!=="undefined"){window.__idbGet=idbGet;window.__idbSet=idbSet;window.__idbGetSafe=idbGetSafe;}
// ---------- Unit normalization + canonical reference library + reference selector ----------
// Factors verified against standard clinical conversions. Unit mismatch => NO score (doc rule).
const UNIT_CONV={
  glucose:{canon:"mg/dL",f:{"mg/dl":1,"mg/dL":1,"mmol/l":18.0182,"mmol/L":18.0182}},
  cholesterol:{canon:"mg/dL",f:{"mg/dL":1,"mg/dl":1,"mmol/L":38.67,"mmol/l":38.67}},
  ldl:{canon:"mg/dL",f:{"mg/dL":1,"mmol/L":38.67}},
  hdl:{canon:"mg/dL",f:{"mg/dL":1,"mmol/L":38.67}},
  triglyceride:{canon:"mg/dL",f:{"mg/dL":1,"mmol/L":88.57}},
  creatinine:{canon:"mg/dL",f:{"mg/dL":1,"umol/L":1/88.4,"µmol/L":1/88.4}},
  hemoglobin:{canon:"g/L",f:{"g/L":1,"g/l":1,"g/dL":10,"g/dl":10,"gr/dL":10,"g%":10}},
  mcv:{canon:"fL",f:{"fL":1,"um3":1}},
  crp:{canon:"mg/L",f:{"mg/L":1,"mg/l":1,"mg/dL":10,"mg/dl":10,"nmol/L":1/9.524}},
  bilirubin:{canon:"mg/dL",f:{"mg/dL":1,"umol/L":1/17.1,"µmol/L":1/17.1}},
  calcium:{canon:"mg/dL",f:{"mg/dL":1,"mmol/L":4.008}},
  vitaminD:{canon:"ng/mL",f:{"ng/mL":1,"ug/L":1,"µg/L":1,"nmol/L":1/2.496}},
  b12:{canon:"ng/L",f:{"ng/L":1,"pg/mL":1,"ng/mL":1000,"pmol/L":1/0.7378}},
  ferritin:{canon:"ug/L",f:{"ug/L":1,"µg/L":1,"ng/mL":1,"ug/mL":1000,"pmol/L":1/2.247}},
  hba1c:{canon:"%",f:{"%":1}},
  tsh:{canon:"mU/L",f:{"mU/L":1,"mIU/L":1,"uIU/mL":1,"µIU/mL":1,"mIU/mL":1000,"uU/mL":1}},
  ft4:{canon:"ng/dL",f:{"ng/dL":1,"pmol/L":1/12.87}},
  albumin:{canon:"g/dL",f:{"g/dL":1,"g/L":0.1}},
  totalProtein:{canon:"g/dL",f:{"g/dL":1,"g/L":0.1}},
  alt:{canon:"U/L",f:{"U/L":1,"IU/L":1,"u/L":1,"U/l":1}},ast:{canon:"U/L",f:{"U/L":1,"IU/L":1,"u/L":1,"U/l":1}},alp:{canon:"U/L",f:{"U/L":1,"IU/L":1,"u/L":1,"U/l":1}},
  sodium:{canon:"mmol/L",f:{"mmol/L":1,"mEq/L":1}},potassium:{canon:"mmol/L",f:{"mmol/L":1,"mEq/L":1}},chloride:{canon:"mmol/L",f:{"mmol/L":1,"mEq/L":1}},bicarbonate:{canon:"mmol/L",f:{"mmol/L":1,"mEq/L":1}},
  platelet:{canon:"x10^9/L",f:{"x10^9/L":1,"10^9/L":1,"10*9/L":1,"K/uL":1,"K/µL":1,"10^3/uL":1,"10^3/µL":1,"10*3/uL":1,"x10^3/uL":1,"thousand/uL":1,"/uL":0.001,"/µL":0.001}},
  uricAcid:{canon:"mg/dL",f:{"mg/dL":1,"mmol/L":16.81}},
  magnesium:{canon:"mg/dL",f:{"mg/dL":1,"mmol/L":2.43,"mEq/L":1.215}},
  phosphorus:{canon:"mg/dL",f:{"mg/dL":1,"mmol/L":3.097}},
  tibc:{canon:"ug/dL",f:{"ug/dL":1,"µg/dL":1,"umol/L":5.587}},
  bun:{canon:"mg/dL",f:{"mg/dL":1,"mmol/L":2.8}},
  iron:{canon:"ug/dL",f:{"ug/dL":1,"µg/dL":1,"umol/L":5.587}},
  urineSodium:{canon:"mmol/L",f:{"mmol/L":1,"mEq/L":1}},urineCreatinine:{canon:"mg/dL",f:{"mg/dL":1,"mmol/L":1/0.0884}},
  bloodPH:{canon:"pH",f:{"pH":1}},
  pCO2:{canon:"mmHg",f:{"mmHg":1,"kPa":7.50062}},
  pO2:{canon:"mmHg",f:{"mmHg":1,"kPa":7.50062}},
  hco3:{canon:"mmol/L",f:{"mmol/L":1,"mEq/L":1}},
  baseExcess:{canon:"mmol/L",f:{"mmol/L":1,"mEq/L":1}},
  o2sat:{canon:"%",f:{"%":1,"fraction":100}},
  estradiol:{canon:"pg/mL",f:{"pg/mL":1,"pmol/L":0.27240533914464726}},
  progesterone:{canon:"ng/mL",f:{"ng/mL":1,"nmol/L":0.31446540880503143}},
  fsh:{canon:"IU/L",f:{"IU/L":1,"mIU/mL":1}},
  lh:{canon:"IU/L",f:{"IU/L":1,"mIU/mL":1}},
  shbg:{canon:"nmol/L",f:{"nmol/L":1}},
  freeTestosterone:{canon:"pg/mL",f:{"pg/mL":1,"pmol/L":0.2881844380403458}},
  acth:{canon:"pg/mL",f:{"pg/mL":1,"ng/L":1}},
  aldosterone:{canon:"ng/dL",f:{"ng/dL":1,"pmol/L":0.036101083032490974}},
  growthHormone:{canon:"ng/mL",f:{"ng/mL":1,"ug/L":1}},
  igf1:{canon:"ng/mL",f:{"ng/mL":1,"ug/L":1}},
  psa:{canon:"ng/mL",f:{"ng/mL":1,"ug/L":1}},
  afp:{canon:"ng/mL",f:{"ng/mL":1,"ug/L":1}},
  cea:{canon:"ng/mL",f:{"ng/mL":1,"ug/L":1}},
  folate:{canon:"ng/mL",f:{"ng/mL":1,"ug/L":1,"nmol/L":0.44130626654898497}},
  vitaminB1:{canon:"nmol/L",f:{"nmol/L":1,"ug/L":2.9673590504451037}},
  vitaminB6:{canon:"nmol/L",f:{"nmol/L":1,"ug/L":4.048582995951417}},
  vitaminC:{canon:"mg/dL",f:{"mg/dL":1,"umol/L":0.017611835153222965}},
  vitaminA:{canon:"ug/dL",f:{"ug/dL":1,"umol/L":28.653295128939828}},
  vitaminE:{canon:"mg/L",f:{"mg/L":1,"umol/L":0.43066322136089574}},
  zinc:{canon:"ug/dL",f:{"ug/dL":1,"umol/L":6.5359477124183005}},
  copper:{canon:"ug/dL",f:{"ug/dL":1,"umol/L":6.369426751592357}},
  selenium:{canon:"ug/L",f:{"ug/L":1,"umol/L":78.74015748031496}},
  transferrin:{canon:"mg/dL",f:{"mg/dL":1,"g/L":100}},
  haptoglobin:{canon:"mg/dL",f:{"mg/dL":1,"g/L":100}},
  cPeptide:{canon:"ng/mL",f:{"ng/mL":1,"nmol/L":3.021148036253776}},
  fructosamine:{canon:"umol/L",f:{"umol/L":1}},
  lactate:{canon:"mmol/L",f:{"mmol/L":1,"mg/dL":0.11101243339253998}},
  ammonia:{canon:"umol/L",f:{"umol/L":1,"ug/dL":0.5871990604815032}},
  cystatinC:{canon:"mg/L",f:{"mg/L":1}},
  homocysteine:{canon:"umol/L",f:{"umol/L":1,"mg/L":7.4074074074074066}},
  procalcitonin:{canon:"ng/mL",f:{"ng/mL":1,"ug/L":1}},
  indirectBilirubin:{canon:"mg/dL",f:{"mg/dL":1,"umol/L":0.05847953216374269}},
  ceruloplasmin:{canon:"mg/dL",f:{"mg/dL":1,"g/L":100}},
  totalCO2:{canon:"mmol/L",f:{"mmol/L":1,"mEq/L":1}},
  urineProtein:{canon:"scale",f:{"scale":1,"neg-4+":1}},
  urineGlucose:{canon:"scale",f:{"scale":1,"neg-4+":1}},
  urineKetone:{canon:"scale",f:{"scale":1,"neg-4+":1}},
  urineBlood:{canon:"scale",f:{"scale":1,"neg-4+":1}},
  urineLeukocyteEsterase:{canon:"scale",f:{"scale":1,"neg-4+":1}},
  urineNitrite:{canon:"scale",f:{"scale":1,"neg-4+":1}},
  urineBilirubin:{canon:"scale",f:{"scale":1,"neg-4+":1}},
  urineUrobilinogen:{canon:"mg/dL",f:{"mg/dL":1,"umol/L":0.05847953216374269,"EU/dL":1}},
  urineMicroalbumin:{canon:"mg/L",f:{"mg/L":1,"mg/dL":10}},
  troponinI:{canon:"ng/mL",f:{"ng/mL":1,"ug/L":1}},
  troponinT:{canon:"ng/mL",f:{"ng/mL":1,"ug/L":1}},
  ckTotal:{canon:"U/L",f:{"U/L":1,"IU/L":1}},
  ckMB:{canon:"ng/mL",f:{"ng/mL":1,"ug/L":1}},
  ntProBNP:{canon:"pg/mL",f:{"pg/mL":1,"ng/L":1}},
  bnp:{canon:"pg/mL",f:{"pg/mL":1,"ng/L":1}},
  myoglobin:{canon:"ng/mL",f:{"ng/mL":1,"ug/L":1}},
  freeT3:{canon:"pg/mL",f:{"pg/mL":1,"pmol/L":0.6510416666666666}},
  totalT3:{canon:"ng/dL",f:{"ng/dL":1,"nmol/L":64.93506493506493}},
  totalT4:{canon:"ug/dL",f:{"ug/dL":1,"nmol/L":0.07770007770007771}},
  antiTPO:{canon:"IU/mL",f:{"IU/mL":1,"kIU/L":1}},
  antiTg:{canon:"IU/mL",f:{"IU/mL":1,"kIU/L":1}},
  cortisolAM:{canon:"ug/dL",f:{"ug/dL":1,"nmol/L":0.03624501631025734}},
  testosterone:{canon:"ng/dL",f:{"ng/dL":1,"nmol/L":28.81844380403458}},
  prolactin:{canon:"ng/mL",f:{"ng/mL":1,"ug/L":1,"mIU/L":0.04716981132075472}},
  dheas:{canon:"ug/dL",f:{"ug/dL":1,"umol/L":36.90036900369004}},
  pth:{canon:"pg/mL",f:{"pg/mL":1,"ng/L":1}},
  wbc:{canon:"x10^9/L",f:{"x10^9/L":1,"x10^3/uL":1,"10^3/mm3":1,"/uL":0.001}},
  rbc:{canon:"x10^12/L",f:{"x10^12/L":1,"x10^6/uL":1,"10^6/mm3":1}},
  hematocrit:{canon:"%",f:{"%":1,"L/L":100,"fraction":100}},
  mch:{canon:"pg",f:{"pg":1}},
  mchc:{canon:"g/dL",f:{"g/dL":1,"g/L":0.1}},
  rdw:{canon:"%",f:{"%":1}},
  mpv:{canon:"fL",f:{"fL":1}},
  reticulocyte:{canon:"%",f:{"%":1}},
  neutrophilPct:{canon:"%",f:{"%":1}},
  lymphocytePct:{canon:"%",f:{"%":1}},
  monocytePct:{canon:"%",f:{"%":1}},
  eosinophilPct:{canon:"%",f:{"%":1}},
  basophilPct:{canon:"%",f:{"%":1}},
  neutrophilAbs:{canon:"x10^9/L",f:{"x10^9/L":1,"x10^3/uL":1}},
  lymphocyteAbs:{canon:"x10^9/L",f:{"x10^9/L":1,"x10^3/uL":1}},
  ggt:{canon:"U/L",f:{"U/L":1,"IU/L":1}},
  ldh:{canon:"U/L",f:{"U/L":1,"IU/L":1}},
  directBilirubin:{canon:"mg/dL",f:{"mg/dL":1,"umol/L":0.05847953216374269}},
  amylase:{canon:"U/L",f:{"U/L":1,"IU/L":1}},
  lipase:{canon:"U/L",f:{"U/L":1,"IU/L":1}},
  esr:{canon:"mm/h",f:{"mm/h":1,"mm/hr":1}},
  insulin:{canon:"uIU/mL",f:{"uIU/mL":1,"µIU/mL":1,"mIU/L":1,"pmol/L":1/6.945}},
  uacr:{canon:"mg/g",f:{"mg/g":1,"mg/mmol":8.84}},
  pt:{canon:"s",f:{"s":1,"sec":1,"saniye":1}},
  aptt:{canon:"s",f:{"s":1,"sec":1,"saniye":1}},
  inr:{canon:"ratio",f:{"ratio":1,"INR":1,"":1}},
  fibrinogen:{canon:"mg/dL",f:{"mg/dL":1,"g/L":100}},
  dDimer:{canon:"ug/mL FEU",f:{"ug/mL FEU":1,"mg/L FEU":1,"ng/mL FEU":0.001}},
  urineSG:{canon:"",f:{"":1,"sg":1}},
  urinePH:{canon:"pH",f:{"pH":1,"":1}},
};
// Returns {ok, value, unit} in canonical unit, or {ok:false,reason:"unknown-unit"} -> caller must NOT score.
const normalizeUnit=(test,value,unit)=>{
  const v=Number(value);const c=UNIT_CONV[test];
  if(!c)return{ok:false,reason:"unknown-test"};
  if(!isFinite(v))return{ok:false,reason:"invalid-value"};
  if(!unit)return{ok:false,reason:"missing-unit"};
  const clean=(u)=>String(u).trim().toLowerCase().replace(/\s+/g,"").replace(/µ/g,"u").replace(/×/g,"x");
  const target=clean(unit);
  const k=Object.keys(c.f).find(x=>clean(x)===target);
  if(!k)return{ok:false,reason:"unknown-unit"};
  return{ok:true,value:Math.round(v*c.f[k]*1000)/1000,unit:c.canon};
};
// Canonical library: partitioned intervals (adult defaults; sex splits where clinically real).
// NOTE: these are REFERENCE INTERVALS, not diagnostic thresholds. Pediatric = intentionally absent -> gated.
const REF_LIB={
  hemoglobin:{unit:"g/L",adult:{male:[130,180],female:[115,165]},peds:[[0.5,[100,140]],[5,[110,150]],[12,[115,155]]]},
  mcv:{unit:"fL",adult:{any:[80,100]}},
  platelet:{unit:"x10^9/L",adult:{any:[140,400]}},
  sodium:{unit:"mmol/L",adult:{any:[135,145]}},
  chloride:{unit:"mmol/L",adult:{any:[98,107]}},
  bicarbonate:{unit:"mmol/L",adult:{any:[22,29]}},
  potassium:{unit:"mmol/L",adult:{any:[3.5,5.0]}},
  calcium:{unit:"mg/dL",adult:{any:[8.4,10.2]}},
  creatinine:{unit:"mg/dL",adult:{male:[0.70,1.30],female:[0.50,1.10]},peds:[[0.041,[0.40,1.00]],[2,[0.20,0.40]],[4,[0.30,0.50]],[12,[0.40,0.70]],[16,[0.50,0.90]]],pregnancy:[0.40,0.85]},
  albumin:{unit:"g/dL",adult:{any:[3.5,5.5]}},
  totalProtein:{unit:"g/dL",adult:{any:[6.0,8.3]}},
  alt:{unit:"U/L",adult:{any:[10,40]}},
  ast:{unit:"U/L",adult:{any:[10,40]}},
  alp:{unit:"U/L",adult:{male:[40,129],female:[35,104]},peds:[[0.041,[83,248]],[1,[122,469]],[10,[142,335]],[13,[129,468]],[16,[55,331]]]},
  bilirubin:{unit:"mg/dL",adult:{any:[0.3,1.0]}},
  tsh:{unit:"mU/L",adult:{any:[0.5,4.0]}},
  ft4:{unit:"ng/dL",adult:{any:[0.8,1.8]}},
  ferritin:{unit:"ug/L",adult:{any:[15,300]}},
  b12:{unit:"ng/L",adult:{any:[180,914]}},
  crp:{unit:"mg/L",adult:{any:[0,5]}},
  cholesterol:{unit:"mg/dL",adult:{any:[0,200]}},
  ldl:{unit:"mg/dL",adult:{any:[0,100]}},
  triglyceride:{unit:"mg/dL",adult:{any:[0,150]}},
  vitaminD:{unit:"ng/mL",adult:{any:[20,50]}},
  uricAcid:{unit:"mg/dL",adult:{male:[3.5,7.2],female:[2.6,6.0]}},
  magnesium:{unit:"mg/dL",adult:{any:[1.5,2.4]}},
  phosphorus:{unit:"mg/dL",adult:{any:[2.5,4.5]},peds:[[0.041,[4.3,9.3]],[1,[4.5,7.0]],[12,[4.5,6.5]],[16,[2.7,4.7]]]},
  tibc:{unit:"ug/dL",adult:{any:[251,460]}},
  bun:{unit:"mg/dL",adult:{any:[7,20]},peds:[[2,[4,15]],[16,[5,20]]]},
  iron:{unit:"ug/dL",adult:{male:[65,175],female:[50,170]}},
  uacr:{unit:"mg/g",adult:{any:[0,30]}},
  pt:{unit:"s",adult:{any:[9,13]}},
  aptt:{unit:"s",adult:{any:[22,36]}},
  fibrinogen:{unit:"mg/dL",adult:{any:[200,400]}},
  urineSG:{unit:"",adult:{any:[1.005,1.030]}},
  urinePH:{unit:"pH",adult:{any:[4.5,8.0]}},
  // ESR: not a fixed interval - Westergren upper limit depends on age & sex (age/2 male; (age+10)/2 female)
  esr:{unit:"mm/h",dynamic:(ctx)=>{const y=ctx&&ctx.ageYears;if(!y||!ctx.sex)return null;const hi=ctx.sex==="female"?Math.round((y+10)/2):Math.round(y/2);return[0,hi];}},
  bloodPH:{unit:"pH",adult:{any:[7.35,7.45]}},
  pCO2:{unit:"mmHg",adult:{any:[35,45]}},
  pO2:{unit:"mmHg",adult:{any:[80,100]}},
  hco3:{unit:"mmol/L",adult:{any:[22,26]}},
  baseExcess:{unit:"mmol/L",adult:{any:[-2,2]}},
  o2sat:{unit:"%",adult:{any:[95,100]}},
  estradiol:{unit:"pg/mL",adult:{male:[10,50],female:[15,350]}},
  progesterone:{unit:"ng/mL",adult:{male:[0.1,0.5],female:[0.1,25]}},
  fsh:{unit:"IU/L",adult:{male:[1.4,15.4],female:[1.4,100]}},
  lh:{unit:"IU/L",adult:{male:[1.7,8.6],female:[1,95]}},
  shbg:{unit:"nmol/L",adult:{male:[10,57],female:[18,144]}},
  freeTestosterone:{unit:"pg/mL",adult:{male:[50,210],female:[1,8.5]}},
  acth:{unit:"pg/mL",adult:{any:[7,63]}},
  aldosterone:{unit:"ng/dL",adult:{any:[3,35]}},
  growthHormone:{unit:"ng/mL",adult:{male:[0,5],female:[0,10]}},
  igf1:{unit:"ng/mL",adult:{any:[100,300]}},
  psa:{unit:"ng/mL",adult:{any:[0,4]}},
  afp:{unit:"ng/mL",adult:{any:[0,10]}},
  cea:{unit:"ng/mL",adult:{any:[0,3]}},
  folate:{unit:"ng/mL",adult:{any:[3,17]}},
  vitaminB1:{unit:"nmol/L",adult:{any:[70,180]}},
  vitaminB6:{unit:"nmol/L",adult:{any:[20,125]}},
  vitaminC:{unit:"mg/dL",adult:{any:[0.4,2]}},
  vitaminA:{unit:"ug/dL",adult:{any:[30,65]}},
  vitaminE:{unit:"mg/L",adult:{any:[5.5,17]}},
  zinc:{unit:"ug/dL",adult:{any:[60,120]}},
  copper:{unit:"ug/dL",adult:{any:[70,150]}},
  selenium:{unit:"ug/L",adult:{any:[70,150]}},
  transferrin:{unit:"mg/dL",adult:{any:[200,400]}},
  haptoglobin:{unit:"mg/dL",adult:{any:[30,200]}},
  cPeptide:{unit:"ng/mL",adult:{any:[0.8,3.1]}},
  fructosamine:{unit:"umol/L",adult:{any:[200,285]}},
  lactate:{unit:"mmol/L",adult:{any:[0.5,2]}},
  ammonia:{unit:"umol/L",adult:{any:[11,47]}},
  cystatinC:{unit:"mg/L",adult:{any:[0.61,1.03]}},
  homocysteine:{unit:"umol/L",adult:{any:[5,15]}},
  procalcitonin:{unit:"ng/mL",adult:{any:[0,0.1]}},
  indirectBilirubin:{unit:"mg/dL",adult:{any:[0.2,0.8]}},
  ceruloplasmin:{unit:"mg/dL",adult:{any:[20,35]}},
  totalCO2:{unit:"mmol/L",adult:{any:[23,29]}},
  urineProtein:{unit:"scale",adult:{any:[0,0]}},
  urineGlucose:{unit:"scale",adult:{any:[0,0]}},
  urineKetone:{unit:"scale",adult:{any:[0,0]}},
  urineBlood:{unit:"scale",adult:{any:[0,0]}},
  urineLeukocyteEsterase:{unit:"scale",adult:{any:[0,0]}},
  urineNitrite:{unit:"scale",adult:{any:[0,0]}},
  urineBilirubin:{unit:"scale",adult:{any:[0,0]}},
  urineUrobilinogen:{unit:"mg/dL",adult:{any:[0.2,1]}},
  urineMicroalbumin:{unit:"mg/L",adult:{any:[0,30]}},
  troponinI:{unit:"ng/mL",adult:{any:[0,0.04]}},
  troponinT:{unit:"ng/mL",adult:{any:[0,0.01]}},
  ckTotal:{unit:"U/L",adult:{male:[40,320],female:[25,200]}},
  ckMB:{unit:"ng/mL",adult:{any:[0,5]}},
  ntProBNP:{unit:"pg/mL",adult:{any:[0,125]}},
  bnp:{unit:"pg/mL",adult:{any:[0,100]}},
  myoglobin:{unit:"ng/mL",adult:{male:[28,72],female:[25,58]}},
  freeT3:{unit:"pg/mL",adult:{any:[2.3,4.2]}},
  totalT3:{unit:"ng/dL",adult:{any:[80,200]}},
  totalT4:{unit:"ug/dL",adult:{any:[4.5,12]}},
  antiTPO:{unit:"IU/mL",adult:{any:[0,35]}},
  antiTg:{unit:"IU/mL",adult:{any:[0,40]}},
  cortisolAM:{unit:"ug/dL",adult:{any:[5,25]}},
  testosterone:{unit:"ng/dL",adult:{male:[264,916],female:[8,60]}},
  prolactin:{unit:"ng/mL",adult:{male:[4,15],female:[4,30]}},
  dheas:{unit:"ug/dL",adult:{male:[80,560],female:[35,430]}},
  pth:{unit:"pg/mL",adult:{any:[15,65]}},
  wbc:{unit:"x10^9/L",adult:{any:[4.5,11]}},
  rbc:{unit:"x10^12/L",adult:{male:[4.3,5.8],female:[3.8,5.1]}},
  hematocrit:{unit:"%",adult:{male:[41,53],female:[36,46]}},
  mch:{unit:"pg",adult:{any:[27,33]}},
  mchc:{unit:"g/dL",adult:{any:[32,36]}},
  rdw:{unit:"%",adult:{any:[11.5,14.5]}},
  mpv:{unit:"fL",adult:{any:[7.5,11.5]}},
  reticulocyte:{unit:"%",adult:{any:[0.5,2.5]}},
  neutrophilPct:{unit:"%",adult:{any:[40,70]}},
  lymphocytePct:{unit:"%",adult:{any:[20,45]}},
  monocytePct:{unit:"%",adult:{any:[2,10]}},
  eosinophilPct:{unit:"%",adult:{any:[1,4]}},
  basophilPct:{unit:"%",adult:{any:[0,1]}},
  neutrophilAbs:{unit:"x10^9/L",adult:{any:[1.8,7]}},
  lymphocyteAbs:{unit:"x10^9/L",adult:{any:[1,3.5]}},
  ggt:{unit:"U/L",adult:{male:[8,61],female:[5,36]}},
  ldh:{unit:"U/L",adult:{any:[140,280]}},
  directBilirubin:{unit:"mg/dL",adult:{any:[0,0.3]}},
  amylase:{unit:"U/L",adult:{any:[30,110]}},
  lipase:{unit:"U/L",adult:{any:[10,140]}},
};
// Reference selector priority (doc): lab-reported > method-specific > internal library. Never guess for non-adult.
const selectReference=(test,ctx,labReported)=>{
  if(labReported&&isFinite(Number(labReported.low))&&isFinite(Number(labReported.high)))
    return{ok:true,low:Number(labReported.low),high:Number(labReported.high),source:"lab-reported"};
  const band=ctx&&ctx.band;
  if(!band)return{ok:false,reason:"no-context"};
  const e=REF_LIB[test];if(!e)return{ok:false,reason:"not-in-library"};
  const age=Number(ctx&&ctx.ageYears);
  // Pregnancy: several ranges shift in pregnancy (e.g. creatinine falls, ALP rises from placenta), so
  // rather than apply a possibly-wrong adult cutoff we flag it. If a test has an explicit pregnancy
  // range we could use it, but by default we return a caveat so the UI can say "adult ranges may not
  // apply in pregnancy".
  if(ctx.pregnant){
    if(e.pregnancy)return{ok:true,low:e.pregnancy[0],high:e.pregnancy[1],unit:e.unit,source:"internal-library",note:"pregnancy"};
    return{ok:false,reason:"pregnancy-adult-range-may-not-apply"};
  }
  // Paediatric: many analytes change dramatically with age (creatinine tracks muscle mass, ALP rises
  // during growth). Where we have a VERIFIED age-banded range we use it; otherwise we deliberately do
  // NOT apply the adult range to a child (that could mislead) and return a caveat so the UI can advise
  // paediatric interpretation. `peds` is [[maxAgeYears,[low,high]], ...] in ascending order.
  const isChild=(band!=="adult"&&band!=="older")||(isFinite(age)&&age<18);
  if(isChild){
    if(e.peds&&isFinite(age)){
      const bandRow=e.peds.find(row=>age<row[0]);
      if(bandRow)return{ok:true,low:bandRow[1][0],high:bandRow[1][1],unit:e.unit,source:"internal-library",note:"paediatric"};
      // age above the highest paediatric band but still <18: fall through to adult range (adolescents
      // approach adult values) but mark it.
    }
    if(!e.peds)return{ok:false,reason:"paediatric-adult-range-may-not-apply"};
  }
  if(e.dynamic){const r=e.dynamic(ctx);if(!r)return{ok:false,reason:"needs-sex-age"};return{ok:true,low:r[0],high:r[1],unit:e.unit,source:"internal-library"};}
  const sex=(ctx.sex==="male"||ctx.sex==="female")?ctx.sex:null;
  const r=e.adult[sex]||e.adult.any;
  if(!r)return{ok:false,reason:"needs-sex"};
  return{ok:true,low:r[0],high:r[1],unit:e.unit,source:"internal-library"};
};
// Classify a normalized value against a selected reference (reference-interval semantics, not diagnosis).
const classifyAgainstRef=(value,ref)=>{
  if(!ref||!ref.ok)return{applicable:false,reason:(ref&&ref.reason)||"no-ref"};
  const v=Number(value);
  if(!isFinite(v))return{applicable:false,reason:"invalid-value"};
  if(v<ref.low)return{applicable:true,level:"low",source:ref.source};
  if(v>ref.high)return{applicable:true,level:"high",source:ref.source};
  return{applicable:true,level:"normal",source:ref.source};
};
// ---------- Recommendation engine (doc Dal 9): education -> lifestyle -> clinical follow-up ----------
// SAFETY: never diagnoses, never starts/stops medication, uses hedged language, defers to clinician.
const TEST_EDU={
  glucose:["Kandaki şeker düzeyini ölçer; enerji dengesi ve diyabet taraması için kullanılır.","Measures blood sugar; used for diabetes screening."],
  hba1c:["Son ~3 ayın ortalama kan şekerini yansıtır.","Reflects average blood sugar over ~3 months."],
  hemoglobin:["Kanın oksijen taşıyan proteinidir; düşüklüğü kansızlık (anemi) düşündürebilir.","Oxygen-carrying protein; low levels may suggest anemia."],
  ferritin:["Vücuttaki demir deposunu gösterir; enfeksiyon/iltihapta yükselebilir.","Iron stores; can rise with inflammation."],
  b12:["Sinir sistemi ve kan yapımı için gerekli vitamindir.","Vitamin needed for nerves and blood formation."],
  creatinine:["Böbrek fonksiyonu hakkında bilgi verir; kas kütlesinden etkilenir.","Reflects kidney function; affected by muscle mass."],
  potassium:["Kalp ritmi ve kas işlevi için kritik elektrolittir.","Electrolyte critical for heart rhythm."],
  sodium:["Vücut sıvı dengesini gösteren elektrolittir.","Electrolyte reflecting fluid balance."],
  calcium:["Kemik sağlığı, kas ve sinir işlevinde rol oynar.","Bone, muscle and nerve function."],
  alt:["Karaciğer hücrelerinde bulunan bir enzimdir.","Liver enzyme."],
  ast:["Karaciğer ve kasta bulunan bir enzimdir.","Liver/muscle enzyme."],
  albumin:["Karaciğerin ürettiği ana kan proteinidir; beslenme durumunu da yansıtır.","Main blood protein made by the liver."],
  bilirubin:["Alyuvar yıkımının ürünüdür; yüksekliği sarılıkla ilişkili olabilir.","Breakdown product of red cells."],
  cholesterol:["Toplam kolesterol; kalp-damar risk değerlendirmesinde kullanılır.","Total cholesterol; cardiovascular risk."],
  ldl:["'Kötü' kolesterol olarak bilinir; damar plağı riskiyle ilişkilidir.","'Bad' cholesterol."],
  hdl:["'İyi' kolesterol; yüksekliği koruyucu kabul edilir.","'Good' cholesterol; higher is protective."],
  triglyceride:["Kandaki yağ türüdür; beslenme ve alkolden etkilenir.","Blood fat; affected by diet and alcohol."],
  tsh:["Tiroid bezini uyaran hormondur; tiroid işlevinin ilk basamak testidir.","Thyroid-stimulating hormone."],
  crp:["Vücuttaki iltihabı gösteren bir belirteçtir.","Marker of inflammation."],
  vitaminD:["Kemik sağlığı ve bağışıklık için gereklidir.","Needed for bone health and immunity."],
  platelet:["Kanın pıhtılaşmasında görevli hücrelerdir.","Cells involved in clotting."],
  uricAcid:["Pürin metabolizmasının son ürünüdür; yüksekliği gut ve böbrek taşı ile ilişkili olabilir.","End product of purine metabolism; high levels linked to gout."],
  magnesium:["Kas, sinir ve kalp ritmi için gerekli mineraldir.","Mineral needed for muscle, nerve and heart rhythm."],
  phosphorus:["Kemik sağlığı ve enerji metabolizmasında rol alır; böbrek işleviyle yakından ilişkilidir.","Bone health and energy metabolism; closely tied to kidney function."],
  tibc:["Kanın demir taşıma kapasitesini gösterir; demir eksikliğinde yükselir.","Iron-binding capacity; rises in iron deficiency."],
  esr:["İltihabın dolaylı göstergesidir; üst sınırı yaş ve cinsiyete göre değişir.","Indirect marker of inflammation; upper limit varies by age and sex."],
  insulin:["Açlık insülini; glukozla birlikte insülin direnci (HOMA-IR) hesabında kullanılır.","Fasting insulin; used with glucose for HOMA-IR."],
  uacr:["İdrarda albümin/kreatinin oranı; böbrek hasarının erken göstergesidir.","Urine albumin-to-creatinine ratio; early marker of kidney damage."],
  pt:["Pıhtılaşmanın dış yolağını değerlendirir; karaciğer işlevi ve bazı ilaçlardan etkilenir.","Extrinsic clotting pathway."],
  aptt:["Pıhtılaşmanın iç yolağını değerlendirir; heparin takibinde kullanılır.","Intrinsic clotting pathway."],
  inr:["PT'nin standardize edilmiş halidir; kan sulandırıcı tedavide hedef aralık kişiye göre belirlenir.","Standardized PT; target range is therapy-specific."],
  fibrinogen:["Pıhtı oluşumunda görevli proteindir; iltihapta yükselebilir.","Clotting protein; rises with inflammation."],
  dDimer:["Pıhtı yıkım ürünüdür; DIŞLAMA testidir, yüksekliği tek başına pıhtı anlamına gelmez.","Clot breakdown product; an exclusion test."],
  urineSG:["İdrarın yoğunluğunu gösterir; sıvı alımına göre değişir.","Urine concentration; varies with hydration."],
  urinePH:["İdrarın asitlik derecesi; beslenme ve bazı hastalıklardan etkilenir.","Urine acidity."],
};
const SYS_SPECIALTY={kidney:["Nefroloji / Dahiliye","Nephrology / Internal Medicine"],glycemic:["Endokrinoloji / Dahiliye","Endocrinology"],hematology:["Hematoloji / Dahiliye","Hematology"],liver:["Gastroenteroloji / Dahiliye","Gastroenterology"],lipid:["Kardiyoloji / Dahiliye","Cardiology"],thyroid:["Endokrinoloji","Endocrinology"],inflammation:["Dahiliye","Internal Medicine"],nutrition:["Dahiliye / Beslenme","Internal Medicine / Nutrition"],coagulation:["Hematoloji","Hematology"],urine:["Nefroloji / Üroloji","Nephrology / Urology"]};
const LIFESTYLE={
  glycemic:[["Rafine şeker ve beyaz un ürünlerini azaltmak","Haftada 150 dk tempolu yürüyüş","Uyku düzenini korumak (7-8 saat)"],["Reduce refined sugar","150 min/week brisk walking","Sleep 7-8h"]],
  lipid:[["Doymuş yağ yerine zeytinyağı/balık tercih etmek","Lifli gıdaları artırmak","Haftada 150 dk egzersiz"],["Prefer olive oil/fish","More fiber","150 min/week exercise"]],
  kidney:[["Yeterli su içmek (kısıtlama önerilmediyse)","Tuzu azaltmak","Ağrı kesici (NSAİİ) kullanımını doktora danışmadan uzatmamak"],["Adequate hydration","Lower salt","Avoid prolonged NSAIDs without advice"]],
  liver:[["Alkolü azaltmak/bırakmak","Kilo yönetimi","Gereksiz takviyelerden kaçınmak"],["Reduce alcohol","Weight management","Avoid unnecessary supplements"]],
  hematology:[["Demirden zengin besinler (kırmızı et, baklagil, koyu yeşil sebze)","C vitamini ile birlikte tüketmek emilimi artırabilir"],["Iron-rich foods","Vitamin C aids absorption"]],
  thyroid:[["Düzenli uyku ve stres yönetimi","İyot içeren takviyeleri doktora danışmadan kullanmamak"],["Sleep and stress management","Do not self-supplement iodine"]],
  inflammation:[["Sigarayı bırakmak","Diş/diş eti sağlığına dikkat","Düzenli hareket"],["Quit smoking","Dental health","Regular activity"]],
  nutrition:[["Güneş ışığından yararlanmak","Dengeli beslenme"],["Sun exposure","Balanced diet"]],
  coagulation:[["Kanama/morarma olursa doktora bildirmek","Kan sulandırıcı kullanıyorsanız doz değişikliğini asla kendiniz yapmamak"],["Report bleeding/bruising","Never self-adjust anticoagulants"]],
  urine:[["Yeterli su içmek","Tuzu azaltmak","İdrar yaparken yanma/kanama olursa doktora başvurmak"],["Adequate hydration","Lower salt","See a doctor for burning/blood"]],
};
// Follow-up interval suggestion by severity (educational, not prescriptive)
// D-dimer is an EXCLUSION THRESHOLD, not a reference interval. Age-adjusted cutoff (>50y): age x 0.01 ug/mL FEU.
const classifyDDimer=(val,ctx)=>{
  const v=Number(val);if(!(v>=0))return{applicable:false,reason:"invalid"};
  const band=ctx&&ctx.band,age=ctx&&ctx.ageYears;
  if(ctx&&ctx.pregnant)return{applicable:false,reason:"pregnancy",kind:"threshold"}; // rises physiologically
  if(!band)return{applicable:false,reason:"no-context",kind:"threshold"};
  if(band!=="adult"&&band!=="older")return{applicable:false,reason:"age",kind:"threshold"};
  if(!age)return{applicable:false,reason:"no-context",kind:"threshold"};
  const cutoff=age>50?Math.round(age*0.01*100)/100:0.5;
  return{applicable:true,level:v<cutoff?"normal":"high",cutoff,kind:"threshold"};
};
// INR depends on therapeutic target (e.g. warfarin 2-3). Without knowing therapy, only flag extremes.
const classifyINR=(val,onAnticoag)=>{
  const v=Number(val);if(!(v>0))return{applicable:false,reason:"invalid"};
  if(onAnticoag)return{applicable:false,reason:"therapy-target",kind:"threshold"};
  if(v>=5)return{applicable:true,level:"critical-high",kind:"threshold"};
  if(v>1.2)return{applicable:true,level:"high",kind:"threshold"};
  if(v<0.8)return{applicable:true,level:"low",kind:"threshold"};
  return{applicable:true,level:"normal",kind:"threshold"};
};
if(typeof window!=="undefined"){window.__classifyDDimer=classifyDDimer;window.__classifyINR=classifyINR;}
// ---------- Kidney: eGFR (CKD-EPI 2021, race-free) + UACR + KDIGO staging ----------
// Validated against published calculator values. ADULTS ONLY (pediatric uses Schwartz -> gated).
const calcEGFR=(scrMgDl,ageYears,sex)=>{
  const scr=Number(scrMgDl),age=Number(ageYears);
  if(!(scr>0)||!(age>0))return{ok:false,reason:"invalid"};
  if(age<18)return{ok:false,reason:"age"}; // pediatric requires Schwartz equation + height
  if(sex!=="male"&&sex!=="female")return{ok:false,reason:"needs-sex"};
  const female=sex==="female",k=female?0.7:0.9,a=female?-0.241:-0.302,r=scr/k;
  let v=142*Math.pow(Math.min(r,1),a)*Math.pow(Math.max(r,1),-1.200)*Math.pow(0.9938,age);
  if(female)v*=1.012;
  const g=Math.round(v);
  const stage=g>=90?"G1":g>=60?"G2":g>=45?"G3a":g>=30?"G3b":g>=15?"G4":"G5";
  return{ok:true,value:g,stage,unit:"mL/min/1.73m²"};
};
const uacrStage=(mgPerG)=>{const u=Number(mgPerG);if(!(u>=0))return null;return u<30?"A1":u<=300?"A2":"A3";};
const KDIGO_TEXT={G1:["Normal veya yüksek GFR","Normal or high GFR"],G2:["Hafif azalmış GFR","Mildly decreased"],G3a:["Hafif-orta azalmış","Mild-moderate"],G3b:["Orta-ileri azalmış","Moderate-severe"],G4:["İleri azalmış","Severely decreased"],G5:["Böbrek yetmezliği düzeyi","Kidney failure range"]};
const UACR_TEXT={A1:["Normal / hafif artmış (<30 mg/g)","Normal (<30)"],A2:["Orta derecede artmış (30–300 mg/g)","Moderately increased"],A3:["Ağır artmış (>300 mg/g)","Severely increased"]};
if(typeof window!=="undefined"){window.__calcEGFR=calcEGFR;window.__uacrStage=uacrStage;}
// HOMA-IR = (fasting glucose mg/dL x fasting insulin uIU/mL) / 405  (screening only)
const homaIR=(glucoseMgDl,insulinUiuMl)=>{const g=Number(glucoseMgDl),i=Number(insulinUiuMl);if(!(g>0&&i>0))return null;const v=Math.round((g*i/405)*100)/100;return{value:v,level:v<2.5?"normal":v<3.8?"borderline":"high"};};
if(typeof window!=="undefined")window.__homaIR=homaIR;
const followUp=(level)=>{
  if(level==="critical-low"||level==="critical-high")return{urgency:"urgent",weeks:0};
  if(level==="diabetes-range")return{urgency:"soon",weeks:2};
  if(level==="high"||level==="low")return{urgency:"soon",weeks:4};
  if(level==="prediabetes")return{urgency:"routine",weeks:12};
  return{urgency:"routine",weeks:26};
};
const buildRecommendations=(labRecords,lang)=>{
  const L=lang==="tr",i=L?0:1;
  const latest={};(labRecords||[]).forEach(r=>{if(r.level&&(!latest[r.test]||r.ts>latest[r.test].ts))latest[r.test]=r;});
  const abnormal=Object.values(latest).filter(r=>r.level&&r.level!=="normal");
  const critical=abnormal.filter(r=>r.level==="critical-low"||r.level==="critical-high");
  if(critical.length)return{ok:true,critical:true,items:critical.map(r=>{const ti=LAB_TESTS.find(x=>x.k===r.test);return{test:r.test,name:ti?(L?ti.tr:ti.en):r.test,level:r.level,edu:(TEST_EDU[r.test]||["",""])[i],
    action:L?"Bu değer kritik aralıkta. Yaşam tarzı önerisi verilmiyor — lütfen vakit kaybetmeden doktorunuza/acil servise başvurun.":"Critical value. Seek medical care promptly.",specialty:null,followUp:followUp(r.level)};})};
  if(!abnormal.length)return{ok:true,critical:false,items:[],allNormal:Object.keys(latest).length>0};
  const items=abnormal.map(r=>{
    const ti=LAB_TESTS.find(x=>x.k===r.test);const sys=ti?ti.sys:null;
    const ls=(sys&&LIFESTYLE[sys])?LIFESTYLE[sys][i]:[];
    const fu=followUp(r.level);
    return{test:r.test,name:ti?(L?ti.tr:ti.en):r.test,level:r.level,sys,
      edu:(TEST_EDU[r.test]||["",""])[i],
      lifestyle:ls,
      specialty:(sys&&SYS_SPECIALTY[sys])?SYS_SPECIALTY[sys][i]:null,
      followUp:fu};
  });
  return{ok:true,critical:false,items};
};
if(typeof window!=="undefined"){window.__buildRecommendations=buildRecommendations;window.__followUp=followUp;}
// ---------- LOINC map + FHIR R4 Observation export (V3 interoperability, client-side) ----------
// Codes verified against AHRQ/HHS "LOINC Codes for Laboratory Data" table. Tests without a verified
// code intentionally omit `coding` and use FHIR's `code.text` instead (valid FHIR; never invent codes).
const LOINC={
  glucose:{code:"2345-7",display:"Glucose [Mass/volume] in Serum or Plasma",unit:"mg/dL"},
  hemoglobin:{code:"718-7",display:"Hemoglobin [Mass/volume] in Blood",unit:"g/dL"},
  creatinine:{code:"2160-0",display:"Creatinine [Mass/volume] in Serum or Plasma",unit:"mg/dL"},
  albumin:{code:"1751-7",display:"Albumin [Mass/volume] in Serum or Plasma",unit:"g/dL"},
  ast:{code:"1920-8",display:"AST [Enzymatic activity/volume] in Serum or Plasma",unit:"U/L"},
  bilirubin:{code:"1975-2",display:"Bilirubin.total [Mass/volume] in Serum or Plasma",unit:"mg/dL"},
  calcium:{code:"17861-6",display:"Calcium [Mass/volume] in Serum or Plasma",unit:"mg/dL"},
  potassium:{code:"2823-3",display:"Potassium [Moles/volume] in Serum or Plasma",unit:"mmol/L"},
  sodium:{code:"2951-2",display:"Sodium [Moles/volume] in Serum or Plasma",unit:"mmol/L"},
  platelet:{code:"26515-7",display:"Platelets [#/volume] in Blood",unit:"10*9/L"},
  inr:{code:"6301-6",display:"INR in Platelet poor plasma",unit:"{ratio}"},
  pt:{code:"5902-2",display:"Prothrombin time (PT)",unit:"s"},
  aptt:{code:"14979-9",display:"aPTT in Platelet poor plasma",unit:"s"},
  hba1c:{code:"4548-4",display:"Hemoglobin A1c/Hemoglobin.total in Blood",unit:"%"},
};
const INTERP={normal:["N","Normal"],low:["L","Low"],high:["H","High"],"critical-low":["LL","Critical low"],"critical-high":["HH","Critical high"]};
const toFHIRBundle=(labRecords,patient)=>{
  const entries=(labRecords||[]).map(x=>{
    const ti=LAB_TESTS.find(y=>y.k===x.test);
    const li=LOINC[x.test];
    const code=li?{coding:[{system:"http://loinc.org",code:li.code,display:li.display}],text:ti?ti.en:x.test}:{text:(ti?ti.en:x.test)};
    const ob={resourceType:"Observation",status:"final",
      category:[{coding:[{system:"http://terminology.hl7.org/CodeSystem/observation-category",code:"laboratory",display:"Laboratory"}]}],
      code,effectiveDateTime:new Date(x.ts).toISOString(),
      valueQuantity:{value:x.canonValue,unit:x.canonUnit||"",system:"http://unitsofmeasure.org"},
    };
    if(patient&&patient.name)ob.subject={display:patient.name};
    if(x.refLow!=null||x.refHigh!=null){const rr={};if(x.refLow!=null)rr.low={value:x.refLow,unit:x.canonUnit||""};if(x.refHigh!=null)rr.high={value:x.refHigh,unit:x.canonUnit||""};rr.text=(x.source==="lab-reported")?"Reported by performing laboratory":"Internal reference library";ob.referenceRange=[rr];}
    if(x.level&&INTERP[x.level])ob.interpretation=[{coding:[{system:"http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",code:INTERP[x.level][0],display:INTERP[x.level][1]}]}];
    if(!x.level&&x.naReason)ob.note=[{text:"Not classified: "+x.naReason}];
    return{resource:ob};
  });
  return{resourceType:"Bundle",type:"collection",timestamp:new Date().toISOString(),entry:entries};
};
if(typeof window!=="undefined"){window.__toFHIRBundle=toFHIRBundle;window.__LOINC=LOINC;}
// ---------- Multi-layer health score (doc: system scores + severity + critical override) ----------
const SYS_WEIGHTS={kidney:18,glycemic:16,hematology:14,liver:12,lipid:12,thyroid:10,inflammation:10,nutrition:8,coagulation:10,urine:8};
const SYS_LABELS={kidney:["Böbrek","Kidney"],glycemic:["Glisemik","Glycemic"],hematology:["Hematoloji","Hematology"],liver:["Karaciğer","Liver"],lipid:["Lipid","Lipid"],thyroid:["Tiroid","Thyroid"],inflammation:["İnflamasyon","Inflammation"],nutrition:["Beslenme","Nutrition"],coagulation:["Pıhtılaşma","Coagulation"],urine:["İdrar","Urine"]};
// Severity -> per-test penalty (0..100). Distance from reference bound scales the penalty.
const testPenalty=(rec)=>{
  if(!rec||!rec.level)return null; // not classified -> excluded (doc: don't guess)
  const lv=rec.level;
  if(lv==="normal")return 0;
  if(lv==="critical-low"||lv==="critical-high")return 100;
  if(lv==="diabetes-range")return 70;
  if(lv==="prediabetes")return 35;
  // reference-interval low/high: scale by distance if bounds known
  const lo=rec.refLow,hi=rec.refHigh,v=rec.canonValue;
  if(isFinite(lo)&&isFinite(hi)&&isFinite(v)&&hi>lo){
    const span=hi-lo;
    const dist=v<lo?(lo-v):(v-hi);
    const frac=Math.min(1,dist/(span*0.5)); // 50% of span out => full penalty
    return Math.round(20+frac*60); // mild 20 .. severe 80
  }
  return 40; // out-of-range, unknown magnitude
};
// labs: [{test,level,canonValue,refLow,refHigh,ts}] (latest per test used)
const computeHealthScore=(labRecords)=>{
  const latest={};
  (labRecords||[]).forEach(r=>{if(!latest[r.test]||r.ts>latest[r.test].ts)latest[r.test]=r;});
  const sysOf=(k)=>{const t=LAB_TESTS.find(x=>x.k===k);return t?t.sys:null;};
  const bySys={},critical=[];
  Object.values(latest).forEach(r=>{
    const pen=testPenalty(r);if(pen==null)return; // unclassified excluded
    const sys=sysOf(r.test);if(!sys||!SYS_WEIGHTS[sys])return;
    (bySys[sys]=bySys[sys]||[]).push({test:r.test,pen});
    if(r.level==="critical-low"||r.level==="critical-high")critical.push({test:r.test,level:r.level,value:r.canonValue});
  });
  const sysKeys=Object.keys(bySys);
  if(!sysKeys.length)return{ok:false,reason:"no-data"};
  const sysScores={};
  sysKeys.forEach(k=>{const arr=bySys[k];const worst=Math.max(...arr.map(x=>x.pen));const avg=arr.reduce((a,b)=>a+b.pen,0)/arr.length;
    sysScores[k]=Math.max(0,Math.round(100-(0.6*worst+0.4*avg)));}); // worst-dominant
  const totalW=sysKeys.reduce((a,k)=>a+SYS_WEIGHTS[k],0);
  let overall=Math.round(sysKeys.reduce((a,k)=>a+sysScores[k]*SYS_WEIGHTS[k],0)/totalW);
  // Override layer (doc): criticals cap the score; multi-system involvement penalized
  const badSystems=sysKeys.filter(k=>sysScores[k]<60).length;
  if(critical.length)overall=Math.min(overall,35);
  else if(badSystems>=3)overall=Math.min(overall,55);
  else if(badSystems===2)overall=Math.min(overall,70);
  const band=overall>=90?"stable":overall>=75?"attention":overall>=50?"clinical-review":"high-risk";
  return{ok:true,overall,sysScores,critical,coverage:sysKeys.length,totalSystems:Object.keys(SYS_WEIGHTS).length,band};
};
if(typeof window!=="undefined"){window.__computeHealthScore=computeHealthScore;window.__testPenalty=testPenalty;}
const LAB_TESTS=[
  {k:"glucose",tr:"Glukoz",en:"Glucose",units:["mg/dL","mmol/L"],sys:"glycemic"},
  {k:"hba1c",tr:"HbA1c",en:"HbA1c",units:["%"],sys:"glycemic"},
  {k:"hemoglobin",tr:"Hemoglobin",en:"Hemoglobin",units:["g/dL","g/L"],sys:"hematology"},
  {k:"mcv",tr:"MCV (Ortalama Eritrosit Hacmi)",en:"MCV",units:["fL"],sys:"hematology"},
  {k:"platelet",tr:"Trombosit",en:"Platelet",units:["x10^9/L","K/uL"],sys:"hematology"},
  {k:"ferritin",tr:"Ferritin",en:"Ferritin",units:["ug/L","ng/mL"],sys:"hematology"},
  {k:"b12",tr:"B12",en:"B12",units:["ng/L","pg/mL","pmol/L"],sys:"hematology"},
  {k:"creatinine",tr:"Kreatinin",en:"Creatinine",units:["mg/dL","umol/L"],sys:"kidney"},
  {k:"sodium",tr:"Sodyum",en:"Sodium",units:["mmol/L","mEq/L"],sys:"kidney"},
  {k:"chloride",tr:"Klorür",en:"Chloride",units:["mmol/L","mEq/L"],sys:"kidney"},
  {k:"bicarbonate",tr:"Bikarbonat (HCO₃)",en:"Bicarbonate (HCO₃)",units:["mmol/L","mEq/L"],sys:"kidney"},
  {k:"potassium",tr:"Potasyum",en:"Potassium",units:["mmol/L","mEq/L"],sys:"kidney"},
  {k:"calcium",tr:"Kalsiyum",en:"Calcium",units:["mg/dL","mmol/L"],sys:"kidney"},
  {k:"alt",tr:"ALT",en:"ALT",units:["U/L","IU/L"],sys:"liver"},
  {k:"ast",tr:"AST",en:"AST",units:["U/L","IU/L"],sys:"liver"},
  {k:"alp",tr:"ALP (Alkalen Fosfataz)",en:"ALP (Alkaline Phosphatase)",units:["U/L","IU/L"],sys:"liver"},
  {k:"albumin",tr:"Albümin",en:"Albumin",units:["g/dL","g/L"],sys:"liver"},
  {k:"totalProtein",tr:"Total Protein",en:"Total Protein",units:["g/dL","g/L"],sys:"liver"},
  {k:"bilirubin",tr:"Bilirubin",en:"Bilirubin",units:["mg/dL","umol/L"],sys:"liver"},
  {k:"cholesterol",tr:"Total Kolesterol",en:"Total Cholesterol",units:["mg/dL","mmol/L"],sys:"lipid"},
  {k:"ldl",tr:"LDL",en:"LDL",units:["mg/dL","mmol/L"],sys:"lipid"},
  {k:"hdl",tr:"HDL",en:"HDL",units:["mg/dL","mmol/L"],sys:"lipid"},
  {k:"triglyceride",tr:"Trigliserid",en:"Triglyceride",units:["mg/dL","mmol/L"],sys:"lipid"},
  {k:"tsh",tr:"TSH",en:"TSH",units:["mU/L","mIU/L","uIU/mL"],sys:"thyroid"},
  {k:"ft4",tr:"Serbest T4 (fT4)",en:"Free T4 (fT4)",units:["ng/dL","pmol/L"],sys:"thyroid"},
  {k:"crp",tr:"CRP",en:"CRP",units:["mg/L","mg/dL"],sys:"inflammation"},
  {k:"vitaminD",tr:"D Vitamini (25-OH)",en:"Vitamin D (25-OH)",units:["ng/mL","nmol/L"],sys:"nutrition"},
  {k:"uricAcid",tr:"Ürik Asit",en:"Uric Acid",units:["mg/dL","mmol/L"],sys:"kidney"},
  {k:"magnesium",tr:"Magnezyum",en:"Magnesium",units:["mg/dL","mmol/L","mEq/L"],sys:"kidney"},
  {k:"phosphorus",tr:"Fosfor",en:"Phosphorus",units:["mg/dL","mmol/L"],sys:"kidney"},
  {k:"tibc",tr:"TIBC (Demir Bağlama)",en:"TIBC",units:["ug/dL","umol/L"],sys:"hematology"},
  {k:"iron",tr:"Serum Demiri",en:"Serum Iron",units:["ug/dL","umol/L"],sys:"hematology"},
  {k:"urineSodium",tr:"İdrar Sodyumu",en:"Urine Sodium",units:["mmol/L","mEq/L"],sys:"kidney"},
  {k:"urineCreatinine",tr:"İdrar Kreatinini",en:"Urine Creatinine",units:["mg/dL"],sys:"kidney"},
  {k:"bun",tr:"BUN (Kan Üresi)",en:"BUN (Blood Urea)",units:["mg/dL","mmol/L"],sys:"kidney"},
  {k:"esr",tr:"Sedimentasyon (ESR)",en:"ESR",units:["mm/h"],sys:"inflammation"},
  {k:"bloodPH",tr:"Kan pH (Arteriyel)",en:"Blood pH (Arterial)",units:["pH"],sys:"bloodgas"},
  {k:"pCO2",tr:"pCO2 (Karbondioksit Basıncı)",en:"pCO2",units:["mmHg","kPa"],sys:"bloodgas"},
  {k:"pO2",tr:"pO2 (Oksijen Basıncı)",en:"pO2",units:["mmHg","kPa"],sys:"bloodgas"},
  {k:"hco3",tr:"HCO3 (Bikarbonat)",en:"HCO3 (Bicarbonate)",units:["mmol/L","mEq/L"],sys:"bloodgas"},
  {k:"baseExcess",tr:"Baz Açığı (BE)",en:"Base Excess (BE)",units:["mmol/L","mEq/L"],sys:"bloodgas"},
  {k:"o2sat",tr:"Oksijen Satürasyonu (SaO2)",en:"Oxygen Saturation (SaO2)",units:["%","fraction"],sys:"bloodgas"},
  {k:"estradiol",tr:"Östradiol (E2)",en:"Estradiol (E2)",units:["pg/mL","pmol/L"],sys:"hormone"},
  {k:"progesterone",tr:"Progesteron",en:"Progesterone",units:["ng/mL","nmol/L"],sys:"hormone"},
  {k:"fsh",tr:"FSH (Folikül Uyarıcı Hormon)",en:"FSH",units:["IU/L","mIU/mL"],sys:"hormone"},
  {k:"lh",tr:"LH (Lüteinize Edici Hormon)",en:"LH",units:["IU/L","mIU/mL"],sys:"hormone"},
  {k:"shbg",tr:"SHBG (Seks Hormonu Bağlayıcı Globulin)",en:"SHBG",units:["nmol/L"],sys:"hormone"},
  {k:"freeTestosterone",tr:"Serbest Testosteron",en:"Free Testosterone",units:["pg/mL","pmol/L"],sys:"hormone"},
  {k:"acth",tr:"ACTH (Adrenokortikotropik Hormon)",en:"ACTH",units:["pg/mL","ng/L"],sys:"hormone"},
  {k:"aldosterone",tr:"Aldosteron",en:"Aldosterone",units:["ng/dL","pmol/L"],sys:"hormone"},
  {k:"growthHormone",tr:"Büyüme Hormonu (GH)",en:"Growth Hormone (GH)",units:["ng/mL","ug/L"],sys:"hormone"},
  {k:"igf1",tr:"IGF-1 (İnsülin Benzeri Büyüme Faktörü)",en:"IGF-1",units:["ng/mL","ug/L"],sys:"hormone"},
  {k:"psa",tr:"PSA (Prostat Spesifik Antijen)",en:"PSA",units:["ng/mL","ug/L"],sys:"tumor"},
  {k:"afp",tr:"AFP (Alfa-Fetoprotein)",en:"AFP",units:["ng/mL","ug/L"],sys:"tumor"},
  {k:"cea",tr:"CEA (Karsinoembriyonik Antijen)",en:"CEA",units:["ng/mL","ug/L"],sys:"tumor"},
  {k:"folate",tr:"Folat (B9)",en:"Folate (B9)",units:["ng/mL","ug/L","nmol/L"],sys:"nutrition"},
  {k:"vitaminB1",tr:"Vitamin B1 (Tiamin)",en:"Vitamin B1 (Thiamine)",units:["nmol/L","ug/L"],sys:"nutrition"},
  {k:"vitaminB6",tr:"Vitamin B6 (Piridoksin)",en:"Vitamin B6 (Pyridoxine)",units:["nmol/L","ug/L"],sys:"nutrition"},
  {k:"vitaminC",tr:"Vitamin C (Askorbik Asit)",en:"Vitamin C (Ascorbic Acid)",units:["mg/dL","umol/L"],sys:"nutrition"},
  {k:"vitaminA",tr:"Vitamin A (Retinol)",en:"Vitamin A (Retinol)",units:["ug/dL","umol/L"],sys:"nutrition"},
  {k:"vitaminE",tr:"Vitamin E (Tokoferol)",en:"Vitamin E (Tocopherol)",units:["mg/L","umol/L"],sys:"nutrition"},
  {k:"zinc",tr:"Çinko",en:"Zinc",units:["ug/dL","umol/L"],sys:"nutrition"},
  {k:"copper",tr:"Bakır",en:"Copper",units:["ug/dL","umol/L"],sys:"nutrition"},
  {k:"selenium",tr:"Selenyum",en:"Selenium",units:["ug/L","umol/L"],sys:"nutrition"},
  {k:"transferrin",tr:"Transferrin",en:"Transferrin",units:["mg/dL","g/L"],sys:"hematology"},
  {k:"haptoglobin",tr:"Haptoglobin",en:"Haptoglobin",units:["mg/dL","g/L"],sys:"hematology"},
  {k:"cPeptide",tr:"C-Peptid",en:"C-Peptide",units:["ng/mL","nmol/L"],sys:"glycemic"},
  {k:"fructosamine",tr:"Fruktozamin",en:"Fructosamine",units:["umol/L"],sys:"glycemic"},
  {k:"lactate",tr:"Laktat",en:"Lactate",units:["mmol/L","mg/dL"],sys:"kidney"},
  {k:"ammonia",tr:"Amonyak",en:"Ammonia",units:["umol/L","ug/dL"],sys:"liver"},
  {k:"cystatinC",tr:"Sistatin C",en:"Cystatin C",units:["mg/L"],sys:"kidney"},
  {k:"homocysteine",tr:"Homosistein",en:"Homocysteine",units:["umol/L","mg/L"],sys:"cardiac"},
  {k:"procalcitonin",tr:"Prokalsitonin",en:"Procalcitonin",units:["ng/mL","ug/L"],sys:"inflammation"},
  {k:"indirectBilirubin",tr:"İndirekt Bilirubin",en:"Indirect Bilirubin",units:["mg/dL","umol/L"],sys:"liver"},
  {k:"ceruloplasmin",tr:"Seruloplazmin",en:"Ceruloplasmin",units:["mg/dL","g/L"],sys:"liver"},
  {k:"totalCO2",tr:"Total CO2",en:"Total CO2",units:["mmol/L","mEq/L"],sys:"kidney"},
  {k:"urineProtein",tr:"İdrar Proteini",en:"Urine Protein",units:["scale","neg-4+"],sys:"urine"},
  {k:"urineGlucose",tr:"İdrar Glukozu",en:"Urine Glucose",units:["scale","neg-4+"],sys:"urine"},
  {k:"urineKetone",tr:"İdrar Ketonu",en:"Urine Ketones",units:["scale","neg-4+"],sys:"urine"},
  {k:"urineBlood",tr:"İdrar Kanı (Okült)",en:"Urine Blood (Occult)",units:["scale","neg-4+"],sys:"urine"},
  {k:"urineLeukocyteEsterase",tr:"İdrar Lökosit Esterazı",en:"Urine Leukocyte Esterase",units:["scale","neg-4+"],sys:"urine"},
  {k:"urineNitrite",tr:"İdrar Nitriti",en:"Urine Nitrite",units:["scale","neg-4+"],sys:"urine"},
  {k:"urineBilirubin",tr:"İdrar Bilirubini",en:"Urine Bilirubin",units:["scale","neg-4+"],sys:"urine"},
  {k:"urineUrobilinogen",tr:"İdrar Ürobilinojeni",en:"Urine Urobilinogen",units:["mg/dL","umol/L","EU/dL"],sys:"urine"},
  {k:"urineMicroalbumin",tr:"İdrar Mikroalbumini",en:"Urine Microalbumin",units:["mg/L","mg/dL"],sys:"urine"},
  {k:"troponinI",tr:"Troponin I",en:"Troponin I",units:["ng/mL","ug/L"],sys:"cardiac"},
  {k:"troponinT",tr:"Troponin T",en:"Troponin T",units:["ng/mL","ug/L"],sys:"cardiac"},
  {k:"ckTotal",tr:"Kreatin Kinaz (CK)",en:"Creatine Kinase (CK)",units:["U/L","IU/L"],sys:"cardiac"},
  {k:"ckMB",tr:"CK-MB",en:"CK-MB",units:["ng/mL","ug/L"],sys:"cardiac"},
  {k:"ntProBNP",tr:"NT-proBNP",en:"NT-proBNP",units:["pg/mL","ng/L"],sys:"cardiac"},
  {k:"bnp",tr:"BNP",en:"BNP",units:["pg/mL","ng/L"],sys:"cardiac"},
  {k:"myoglobin",tr:"Miyoglobin",en:"Myoglobin",units:["ng/mL","ug/L"],sys:"cardiac"},
  {k:"freeT3",tr:"Serbest T3 (fT3)",en:"Free T3 (fT3)",units:["pg/mL","pmol/L"],sys:"thyroid"},
  {k:"totalT3",tr:"Total T3",en:"Total T3",units:["ng/dL","nmol/L"],sys:"thyroid"},
  {k:"totalT4",tr:"Total T4",en:"Total T4",units:["ug/dL","nmol/L"],sys:"thyroid"},
  {k:"antiTPO",tr:"Anti-TPO",en:"Anti-TPO",units:["IU/mL","kIU/L"],sys:"thyroid"},
  {k:"antiTg",tr:"Anti-Tiroglobulin (Anti-Tg)",en:"Anti-Thyroglobulin (Anti-Tg)",units:["IU/mL","kIU/L"],sys:"thyroid"},
  {k:"cortisolAM",tr:"Kortizol (sabah)",en:"Cortisol (morning)",units:["ug/dL","nmol/L"],sys:"hormone"},
  {k:"testosterone",tr:"Testosteron (total)",en:"Testosterone (total)",units:["ng/dL","nmol/L"],sys:"hormone"},
  {k:"prolactin",tr:"Prolaktin",en:"Prolactin",units:["ng/mL","ug/L","mIU/L"],sys:"hormone"},
  {k:"dheas",tr:"DHEA-S",en:"DHEA-S",units:["ug/dL","umol/L"],sys:"hormone"},
  {k:"pth",tr:"Parathormon (PTH)",en:"Parathyroid Hormone (PTH)",units:["pg/mL","ng/L"],sys:"hormone"},
  {k:"wbc",tr:"Lökosit (WBC)",en:"White Blood Cells (WBC)",units:["x10^9/L","x10^3/uL","10^3/mm3","/uL"],sys:"hematology"},
  {k:"rbc",tr:"Eritrosit (RBC)",en:"Red Blood Cells (RBC)",units:["x10^12/L","x10^6/uL","10^6/mm3"],sys:"hematology"},
  {k:"hematocrit",tr:"Hematokrit",en:"Hematocrit",units:["%","L/L","fraction"],sys:"hematology"},
  {k:"mch",tr:"MCH",en:"MCH",units:["pg"],sys:"hematology"},
  {k:"mchc",tr:"MCHC",en:"MCHC",units:["g/dL","g/L"],sys:"hematology"},
  {k:"rdw",tr:"RDW",en:"RDW",units:["%"],sys:"hematology"},
  {k:"mpv",tr:"MPV (Ortalama Trombosit Hacmi)",en:"MPV",units:["fL"],sys:"hematology"},
  {k:"reticulocyte",tr:"Retikülosit",en:"Reticulocyte",units:["%"],sys:"hematology"},
  {k:"neutrophilPct",tr:"Nötrofil %",en:"Neutrophils %",units:["%"],sys:"hematology"},
  {k:"lymphocytePct",tr:"Lenfosit %",en:"Lymphocytes %",units:["%"],sys:"hematology"},
  {k:"monocytePct",tr:"Monosit %",en:"Monocytes %",units:["%"],sys:"hematology"},
  {k:"eosinophilPct",tr:"Eozinofil %",en:"Eosinophils %",units:["%"],sys:"hematology"},
  {k:"basophilPct",tr:"Bazofil %",en:"Basophils %",units:["%"],sys:"hematology"},
  {k:"neutrophilAbs",tr:"Nötrofil (Mutlak)",en:"Neutrophils (Absolute)",units:["x10^9/L","x10^3/uL"],sys:"hematology"},
  {k:"lymphocyteAbs",tr:"Lenfosit (Mutlak)",en:"Lymphocytes (Absolute)",units:["x10^9/L","x10^3/uL"],sys:"hematology"},
  {k:"ggt",tr:"GGT (Gama-Glutamil Transferaz)",en:"GGT",units:["U/L","IU/L"],sys:"liver"},
  {k:"ldh",tr:"LDH (Laktat Dehidrogenaz)",en:"LDH",units:["U/L","IU/L"],sys:"liver"},
  {k:"directBilirubin",tr:"Direkt Bilirubin",en:"Direct Bilirubin",units:["mg/dL","umol/L"],sys:"liver"},
  {k:"amylase",tr:"Amilaz",en:"Amylase",units:["U/L","IU/L"],sys:"kidney"},
  {k:"lipase",tr:"Lipaz",en:"Lipase",units:["U/L","IU/L"],sys:"kidney"},
  {k:"insulin",tr:"İnsülin (açlık)",en:"Insulin (fasting)",units:["uIU/mL","pmol/L"],sys:"glycemic"},
  {k:"uacr",tr:"İdrar Alb/Kreatinin (UACR)",en:"Urine ACR",units:["mg/g","mg/mmol"],sys:"kidney"},
  {k:"pt",tr:"PT (Protrombin Zamanı)",en:"PT",units:["s"],sys:"coagulation"},
  {k:"aptt",tr:"aPTT",en:"aPTT",units:["s"],sys:"coagulation"},
  {k:"inr",tr:"INR",en:"INR",units:["ratio"],sys:"coagulation"},
  {k:"fibrinogen",tr:"Fibrinojen",en:"Fibrinogen",units:["mg/dL","g/L"],sys:"coagulation"},
  {k:"dDimer",tr:"D-dimer",en:"D-dimer",units:["ug/mL FEU","ng/mL FEU"],sys:"coagulation"},
  {k:"urineSG",tr:"İdrar Dansitesi",en:"Urine Specific Gravity",units:["sg"],sys:"urine"},
  {k:"urinePH",tr:"İdrar pH",en:"Urine pH",units:["pH"],sys:"urine"},
];
// Full pipeline: normalize -> select reference -> classify. Returns {saved, classification}
const evaluateLab=(testKey,rawValue,rawUnit,ctx,labReported)=>{
  const norm=normalizeUnit(testKey,rawValue,rawUnit);
  if(!norm.ok)return{ok:false,stage:"unit",reason:norm.reason};
  if(testKey==="glucose"){const g=classifyGlucose(norm.value,"fasting",ctx);return{ok:true,norm,cls:g,kind:"threshold"};}
  if(testKey==="hba1c"){const h=classifyHbA1c(norm.value,ctx);return{ok:true,norm,cls:h,kind:"threshold"};}
  if(testKey==="dDimer"){const d=classifyDDimer(norm.value,ctx);return{ok:true,norm,cls:d,kind:"threshold"};}
  if(testKey==="inr"){const i2=classifyINR(norm.value,ctx&&ctx.onAnticoag);return{ok:true,norm,cls:i2,kind:"threshold"};}
  const ref=selectReference(testKey,ctx,labReported);
  const cls=classifyAgainstRef(norm.value,ref);
  // Carry the age/pregnancy context out so the UI can explain it: a paediatric or pregnancy caveat
  // (adult ranges may not apply) or, when a verified age-banded range WAS used, note that.
  if(ref&&ref.note)cls.note=ref.note;
  if(ref&&!ref.ok&&/paediatric|pregnancy/.test(ref.reason||""))cls.contextCaveat=ref.reason;
  // Escalate an out-of-range value to critical when it crosses a published panic limit. Without
  // this the 29 REF_LIB tests could only ever be "low"/"high", so potassium 7.5 (life-threatening)
  // read identically to 5.3. criticalFor() works in canonical units and only knows the tests it can
  // verify against a published list, so most values pass through unchanged.
  if(cls.applicable&&(cls.level==="low"||cls.level==="high")){
    const crit=criticalFor(testKey,norm.value);
    if(crit)cls.level=crit;
  }
  return{ok:true,norm,ref,cls,kind:"reference"};
};
if(typeof window!=="undefined"){window.__evaluateLab=evaluateLab;window.__LAB_TESTS=LAB_TESTS;}
if(typeof window!=="undefined"){window.__normalizeUnit=normalizeUnit;window.__selectReference=selectReference;window.__classifyAgainstRef=classifyAgainstRef;window.__REF_LIB=REF_LIB;}
// ---------- Clinical reference engine (safety-first, context-aware) ----------
// Doc principle: no single universal table. Age/sex/pregnancy partitions are MANDATORY.
// "Reference interval" != "diagnostic decision threshold" -> kept separate.
const AGE_BANDS=[{k:"neonate",maxD:14},{k:"infant",maxD:730},{k:"child",maxD:4748},{k:"adolescent",maxD:7305},{k:"adult",maxD:21915},{k:"older",maxD:1e9}];
const ageDaysFrom=(birthDate)=>{if(!birthDate)return null;const b=new Date(birthDate);if(isNaN(b))return null;const d=Math.floor((Date.now()-b.getTime())/864e5);return d>=0?d:null;};
const ageBandOf=(birthDate)=>{const d=ageDaysFrom(birthDate);if(d==null)return null;return (AGE_BANDS.find(x=>d<=x.maxD)||{k:"older"}).k;};
const ageYearsFrom=(birthDate)=>{const d=ageDaysFrom(birthDate);return d==null?null:Math.floor(d/365.25);};
// Adult ADA diagnostic thresholds ONLY. Pediatric/pregnancy intentionally NOT auto-classified.
const classifyGlucose=(val,type,ctx)=>{
  const v=Number(val);if(!v||v<=0)return{applicable:false,reason:"invalid"};
  const band=(ctx&&ctx.band)||null,preg=!!(ctx&&ctx.pregnant);
  if(preg)return{applicable:false,reason:"pregnancy",kind:"threshold"};
  if(band&&band!=="adult"&&band!=="older")return{applicable:false,reason:"age",band,kind:"threshold"};
  if(!band)return{applicable:false,reason:"no-context",kind:"threshold"};
  if(v<54)return{applicable:true,level:"critical-low",kind:"threshold"};
  if(type==="fasting"){
    if(v<70)return{applicable:true,level:"low",kind:"threshold"};
    if(v<=99)return{applicable:true,level:"normal",kind:"threshold"};
    if(v<=125)return{applicable:true,level:"prediabetes",kind:"threshold"};
    if(v>=300)return{applicable:true,level:"critical-high",kind:"threshold"};
    return{applicable:true,level:"diabetes-range",kind:"threshold"};
  }
  if(v>=300)return{applicable:true,level:"critical-high",kind:"threshold"};
  if(v<70)return{applicable:true,level:"low",kind:"threshold"};
  if(v<140)return{applicable:true,level:"normal",kind:"threshold"};
  if(v<200)return{applicable:true,level:"prediabetes",kind:"threshold"};
  return{applicable:true,level:"diabetes-range",kind:"threshold"};
};
const classifyHbA1c=(val,ctx)=>{
  const v=Number(val);if(!v||v<=0)return{applicable:false,reason:"invalid"};
  const band=(ctx&&ctx.band)||null,preg=!!(ctx&&ctx.pregnant);
  if(preg)return{applicable:false,reason:"pregnancy",kind:"threshold"};
  if(band&&band!=="adult"&&band!=="older")return{applicable:false,reason:"age",band,kind:"threshold"};
  if(!band)return{applicable:false,reason:"no-context",kind:"threshold"};
  if(v<5.7)return{applicable:true,level:"normal",eag:Math.round(28.7*v-46.7),kind:"threshold"};
  if(v<6.5)return{applicable:true,level:"prediabetes",eag:Math.round(28.7*v-46.7),kind:"threshold"};
  return{applicable:true,level:"diabetes-range",eag:Math.round(28.7*v-46.7),kind:"threshold"};
};
if(typeof window!=="undefined"){window.__ageBandOf=ageBandOf;window.__classifyGlucose=classifyGlucose;window.__classifyHbA1c=classifyHbA1c;window.__ageYearsFrom=ageYearsFrom;}
const PROFANITY_ROOTS=["amk","amq","amcık","amcik","amına","amina","orospu","oç","piç","pic.","kahpe","kaltak","pezevenk","gavat","ibne","ipne","yarrak","yarak","dalyarak","siktir","siktim","sikeyim","sikik","puşt","pust","kevaşe","sürtük","surtuk","yavşak","yavsak","şerefsiz","serefsiz","haysiyetsiz","götver","götoş","gotos","salak","aptal","gerizekalı","gerizekali","fuck","fuk","fck","shit","bitch","bastard","asshole","dick","cunt","pussy","whore","slut","motherf"];
const maskProfanity=(txt)=>{if(!txt)return txt;try{return String(txt).replace(/[^\s]+/g,(tok)=>{const norm=tok.toLocaleLowerCase("tr").replace(/[.,!?;:"'()\[\]{}]/g,"").replace(/i̇/g,"i");if(!norm)return tok;const hit=PROFANITY_ROOTS.some(r=>norm===r||norm.startsWith(r));return hit?tok[0]+"*".repeat(Math.max(1,tok.length-1)):tok;});}catch(e){return txt;}};
const notify=useCallback((txt)=>{
  try{if(navigator.vibrate)navigator.vibrate(15);}catch(e){}
  setNotifs(p=>[{id:Date.now(),text:txt,time:new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}),read:false},...p]);
  setToast(txt);if(toastTm.current)clearTimeout(toastTm.current);
  toastTm.current=setTimeout(()=>setToast(null),3000);
},[]);

// Patient
const[pat,setPat]=useState({name:"",birthDate:"",bloodType:"",sex:"",pregnant:false,onAnticoag:false,allergies:"",chronic:"",insu:"",emContact:"",emPhone:""});
const[records,setRecords]=useState([]);
const[showAddRec,setShowAddRec]=useState(false);
const[newRec,setNewRec]=useState({type:"diag",doctor:"",hospital:"",date:"",content:"",notes:""});
const EMPTY_REC={type:"diag",doctor:"",hospital:"",date:"",content:"",notes:""};
const recDraftIdRef=useRef(null);
const[medImages,setMedImages]=useState([]);
const[imgType,setImgType]=useState("xray");
const[reportText,setReportText]=useState("");
// Dialysis session inputs (pre/post BUN, hours, ultrafiltration, weight). Kept as a small object;
// persisted with the rest of the encrypted payload so a dialysis patient's last session stays.
const[dialysis,setDialysis]=useState({preBUN:"",postBUN:"",hours:"",ufLiters:"",postWeightKg:""});
const[imgBusy,setImgBusy]=useState(null); // id being interpreted
const[imgView,setImgView]=useState(null); // image object being viewed
const[imgDrag,setImgDrag]=useState(false);
const imgFileRef=useRef(null),imgCamRef=useRef(null),imgBarRef=useRef(null);
const patAge=pat.birthDate?Math.floor((Date.now()-new Date(pat.birthDate))/(365.25*86400000)):"";

// Permissions
const[perms,setPerms]=useState(function(){try{var s=localStorage.getItem("ailvie_perms");if(s)return JSON.parse(s);}catch(e){}return{notif:true,loc:true,mic:true,cam:false};});
useEffect(()=>{try{localStorage.setItem("ailvie_perms",JSON.stringify(perms));}catch(e){}},[perms]);

// Meds + Alarms
const[meds,setMeds]=useState([]);
const[showAddMed,setShowAddMed]=useState(false);
const[editMedId,setEditMedId]=useState(null);
const[editApptId,setEditApptId]=useState(null);
const[editRecId,setEditRecId]=useState(null);
useEffect(()=>{if(!showAddRec){recDraftIdRef.current=null;return;}const ok=(newRec.content||"").trim();if(editRecId){setRecords(p=>p.map(x=>x.id===editRecId?{...x,...newRec}:x));return;}if(ok){if(recDraftIdRef.current==null){const id=Date.now();recDraftIdRef.current=id;setRecords(p=>[...p,{id,...newRec}]);}else{setRecords(p=>p.map(x=>x.id===recDraftIdRef.current?{...x,...newRec,id:x.id}:x));}}else if(recDraftIdRef.current!=null){const id=recDraftIdRef.current;recDraftIdRef.current=null;setRecords(p=>p.filter(x=>x.id!==id));}},[newRec,editRecId,showAddRec]);
const[newMed,setNewMed]=useState({name:"",dose:"",time:"",startDate:"",alarmType:"both",count:30,timesPerDay:1,recurring:true});
const EMPTY_MED={name:"",dose:"",time:"",startDate:"",alarmType:"both",count:30,timesPerDay:1,recurring:true};
const medDraftIdRef=useRef(null);
useEffect(()=>{
  if(!showAddMed){medDraftIdRef.current=null;return;}
  const nm=(newMed.name||"").trim();
  if(editMedId){setMeds(p=>p.map(x=>x.id===editMedId?{...x,...newMed}:x));return;} // live edit existing
  if(nm){
    if(medDraftIdRef.current==null){const id=Date.now();medDraftIdRef.current=id;const today=new Date().toISOString().split("T")[0];setMeds(p=>[...p,{id,...newMed,startDate:newMed.startDate||today,recurring:newMed.recurring!==false,taken:false}]);} // materialize on name
    else{setMeds(p=>p.map(x=>x.id===medDraftIdRef.current?{...x,...newMed,id:x.id}:x));} // live update new
  }else if(medDraftIdRef.current!=null){const id=medDraftIdRef.current;medDraftIdRef.current=null;setMeds(p=>p.filter(x=>x.id!==id));} // name cleared -> remove
},[newMed,editMedId,showAddMed]);
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
const[camOn,setCamOn]=useState(false);
const[showAddChooser,setShowAddChooser]=useState(false);
const[recog,setRecog]=useState(null); // AI recognition review {name,ingredient,dose,form}
const[scanResult,setScanResult]=useState(null);
const[scanError,setScanError]=useState("");
const videoRef=useRef(null);
const streamRef=useRef(null);
const scanIntervalRef=useRef(null);
const photoInputRef=useRef(null);
const backupInputRef=useRef(null);
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
  "8699504091246":{name:"Lansor (Lansoprazol)",dose:"30mg",drug:"lansoprazole"},
  "8699536750116":{name:"Tegretol (Karbamazepin)",dose:"200mg",drug:"carbamazepine"},
  "8699504530313":{name:"Rivotril (Klonazepam)",dose:"2mg",drug:"clonazepam"},
  "8699504750512":{name:"Ritalin (Metilfenidat)",dose:"10mg",drug:"methylphenidate"},
  "8699504091345":{name:"Atorva (Atorvastatin)",dose:"40mg",drug:"atorvastatin"},
  "8699504310414":{name:"Desyrel (Trazodon)",dose:"100mg",drug:"trazodone"},
  "8699504430317":{name:"Lantus (İnsülin Glarjin)",dose:"100IU/mL",drug:"insulin glargine"},
  "8699504430416":{name:"Novorapid (İnsülin Aspart)",dose:"100IU/mL",drug:"insulin aspart"},
  "8699504091444":{name:"Tenormin (Atenolol)",dose:"50mg",drug:"atenolol"},
  "8699504310513":{name:"Risperdal (Risperidon)",dose:"2mg",drug:"risperidone"},
  "8699504310612":{name:"Zyprexa (Olanzapin)",dose:"10mg",drug:"olanzapine"},
  "8699536090344":{name:"Klacid (Klaritromisin)",dose:"500mg",drug:"clarithromycin"},
  "8699504530412":{name:"Stilnox (Zolpidem)",dose:"10mg",drug:"zolpidem"},
  "8699504091543":{name:"Micardis (Telmisartan)",dose:"80mg",drug:"telmisartan"},
  "8699504750611":{name:"Diamicron (Gliklazid)",dose:"60mg",drug:"gliclazide"},
  "8699504091642":{name:"Aprovel (İrbesartan)",dose:"150mg",drug:"irbesartan"},
  "8699504091741":{name:"Fosamax (Alendronat)",dose:"70mg",drug:"alendronate"},
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
  "8699504091840":{name:"Eliquis (Apiksaban)",dose:"5mg",drug:"apixaban"},
};

// Scanner functions
const startScanner=async()=>{
  setShowScanner(true);setScanResult(null);setScanError("");setCamOn(true);
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
      setScanError(lang==="tr"?"Tarayıcınız otomatik barkod algılamayı desteklemiyor. Barkod numarasını manuel girebilirsiniz.":TL("Your browser doesn't support automatic barcode detection. You can enter the barcode number manually.",lang));
    }
  }catch(e){
    setCamOn(false);
    setScanError(lang==="tr"?"📷 Kamera erişilemedi. Fotoğraftan okuyabilir veya barkodu manuel girebilirsiniz.":TL("📷 Camera unavailable. Read from a photo or enter the barcode manually.",lang));
  }
};

// Downscale an image file to base64 JPEG (keeps text legible, small payload for AI)
const imgToB64=(file,maxDim=1280,q=0.82)=>new Promise((res)=>{
  const img=new Image();const url=URL.createObjectURL(file);
  img.onload=()=>{const sc=Math.min(1,maxDim/Math.max(img.width,img.height));const cw=Math.max(1,Math.round(img.width*sc)),ch=Math.max(1,Math.round(img.height*sc));const c=document.createElement("canvas");c.width=cw;c.height=ch;c.getContext("2d").drawImage(img,0,0,cw,ch);URL.revokeObjectURL(url);try{res({mime:"image/jpeg",data:c.toDataURL("image/jpeg",q).split(",")[1]});}catch(e){res(null);}};
  img.onerror=()=>{URL.revokeObjectURL(url);res(null);};
  img.src=url;
});

// Shared AI vision recognition from a base64 image (reads the medication box; works any drug/language)
const aiRecognize=async(im)=>{
  if(!im){setScanError(lang==="tr"?"Görüntü okunamadı. Tekrar deneyin.":TL("Couldn't read image. Try again.",lang));return;}
  if(typeof navigator!=="undefined"&&!navigator.onLine){setScanError(lang==="tr"?"İnternet yok. Bağlanınca tekrar deneyin veya manuel girin.":TL("No internet. Try again when connected, or enter manually.",lang));return;}
  setScanError(lang==="tr"?"🔎 Yapay zeka inceliyor...":TL("🔎 Analyzing with AI...",lang));
  try{
    const sys=lang==="tr"
      ?"Sen bir ilaç tanıma asistanısın. Görseldeki ilaç kutusu/şeridi/etiketini incele. SADECE geçerli JSON döndür, başka metin yazma: {\"found\":boolean,\"name\":\"ticari ad\",\"ingredient\":\"etken madde\",\"dose\":\"doz örn 5 mg\",\"form\":\"tablet/şurup/kapsül/...\"}. Görselde bir ilaç yoksa veya yazı okunamıyorsa {\"found\":false} döndür."
      :"You are a medication recognition assistant. Examine the medicine box/strip/label in the image. Return ONLY valid JSON, no other text: {\"found\":boolean,\"name\":\"brand name\",\"ingredient\":\"active ingredient\",\"dose\":\"dose e.g. 5 mg\",\"form\":\"tablet/syrup/capsule/...\"}. If there is no medication or text is unreadable, return {\"found\":false}.";
    const body={model:"claude-sonnet-4-6",max_tokens:400,system:sys,messages:[{role:"user",content:[{type:"image",source:{type:"base64",media_type:im.mime,data:im.data}},{type:"text",text:lang==="tr"?"Bu ilacı tanı.":TL("Identify this medication.",lang)}]}]};
    const d=await callAI(body,apiKey);
    const txt=((d&&d.content)||[]).map(c=>c.text||"").join("").trim();
    let p=null;try{p=JSON.parse(txt.replace(/```json|```/g,"").trim());}catch(e){const m=txt.match(/\{[\s\S]*\}/);if(m){try{p=JSON.parse(m[0]);}catch(_){}}}
    if(p&&p.found&&p.name){
      if(streamRef.current){streamRef.current.getTracks().forEach(t=>t.stop());streamRef.current=null;}
      if(scanIntervalRef.current){clearInterval(scanIntervalRef.current);scanIntervalRef.current=null;}
      setScanError("");setShowScanner(false);setScanResult(null);setCamOn(false);
      setRecog({name:p.name||"",ingredient:p.ingredient||"",dose:p.dose||"",form:p.form||"",verifying:true});
      try{const api=await lookupDrugAPIs(p.ingredient||p.name);setRecog(r=>r?{...r,verifying:false,verified:!!api,inn:api?api.inn:null,dbClass:api?api.class:null}:r);}catch(e){setRecog(r=>r?{...r,verifying:false,verified:false}:r);} // validate against global DBs
    }else{
      setScanError(lang==="tr"?"İlaç tanınamadı. Kutuyu net ve yakın çekip tekrar deneyin ya da manuel girin.":TL("Could not recognize. Take a clear, close photo of the box and retry, or enter manually.",lang));
    }
  }catch(e){
    const msg=String((e&&e.message)||e);
    if(msg.includes("NO_KEY"))setScanError(lang==="tr"?"Yapay zeka tanıma için API anahtarı gerekli. Ayarlar > AI API Anahtarı'ndan ekleyin (veya sunucuda yapılandırın).":TL("AI recognition needs an API key. Add it in Settings > AI API Key (or configure on the server).",lang));
    else setScanError(lang==="tr"?"Tanıma başarısız. Tekrar deneyin veya manuel girin.":TL("Recognition failed. Try again or enter manually.",lang));
  }
};

// Photo path: barcode first (offline cache), then AI vision
const scanFromPhoto=async(file)=>{
  if(!file)return;
  setShowScanner(true);setScanResult(null);setScanError("");setCamOn(false);
  if(scanIntervalRef.current){clearInterval(scanIntervalRef.current);scanIntervalRef.current=null;}
  if(streamRef.current){streamRef.current.getTracks().forEach(t=>t.stop());streamRef.current=null;}
  try{
    if('BarcodeDetector' in window){
      const bmp=await createImageBitmap(file);
      const det=new BarcodeDetector({formats:['ean_13','ean_8','upc_a','upc_e','qr_code','code_128','code_39']});
      const codes=await det.detect(bmp);
      if(bmp.close)bmp.close();
      if(codes.length>0&&BARCODE_DB[codes[0].rawValue]){handleBarcodeScan(codes[0].rawValue);return;}
    }
  }catch(e){}
  const im=await imgToB64(file);
  await aiRecognize(im);
};

// Live camera: capture current frame and recognize with AI
const captureFrameAndRecognize=async()=>{
  const v=videoRef.current;
  if(!v||!v.videoWidth){setScanError(lang==="tr"?"Kamera hazır değil, bir an bekleyin.":TL("Camera not ready, wait a moment.",lang));return;}
  const maxDim=1280;const scl=Math.min(1,maxDim/Math.max(v.videoWidth,v.videoHeight));
  const cw=Math.round(v.videoWidth*scl),ch=Math.round(v.videoHeight*scl);
  let im=null;
  try{const c=document.createElement("canvas");c.width=cw;c.height=ch;c.getContext("2d").drawImage(v,0,0,cw,ch);im={mime:"image/jpeg",data:c.toDataURL("image/jpeg",0.82).split(",")[1]};}catch(e){}
  setCamOn(false);
  if(scanIntervalRef.current){clearInterval(scanIntervalRef.current);scanIntervalRef.current=null;}
  if(streamRef.current){streamRef.current.getTracks().forEach(t=>t.stop());streamRef.current=null;}
  await aiRecognize(im);
};

const stopScanner=()=>{
  if(scanIntervalRef.current)clearInterval(scanIntervalRef.current);
  if(streamRef.current)streamRef.current.getTracks().forEach(t=>t.stop());
  streamRef.current=null;scanIntervalRef.current=null;
  setCamOn(false);
  setShowScanner(false);
};

const handleBarcodeScan=async(code)=>{
  stopScanner();
  const match=BARCODE_DB[code];
  if(match){
    setScanResult({code,found:true,...match});
    setNewMed(p=>({...p,name:match.name,dose:match.dose}));
    setDrugQ(match.drug||match.name);
    // Auto-analyze from local DB
    const db=DR[match.drug];
    if(db){const raw=db[lang]||db.tr||db.en;if(raw)setDrugRes(pD(raw));}
    notify(`✅ ${lang==="tr"?"İlaç tanındı":TL("Drug recognized",lang)}: ${match.name}`);
    setShowAddMed(true);
  }else{
    setScanResult({code,found:false,checking:true});
    let ndc=null;try{ndc=await lookupBarcodeOpenFDA(code);}catch(e){}
    if(ndc){
      setScanResult({code,found:true,name:ndc.name,dose:"",drug:ndc.inn||ndc.name,source:"OpenFDA"});
      setNewMed(p=>({...p,name:ndc.name,dose:""}));
      setDrugQ(ndc.inn||ndc.name);
      notify(`✅ ${lang==="tr"?"İlaç tanındı (OpenFDA)":TL("Recognized (OpenFDA)",lang)}: ${ndc.name}`);
      setShowAddMed(true);
    }else{
      setScanResult({code,found:false});
      notify(`⚠️ ${lang==="tr"?"Barkod bulunamadı. '🖼️ Fotoğraf' ile kutuyu çekip yapay zekayla tanıyın.":TL("Barcode not found. Use '🖼️ Photo' to capture the box for AI recognition.",lang)}`);
    }
  }
};

const[manualBarcode,setManualBarcode]=useState("");

// ===== Biometric App Lock (WebAuthn) =====
// Check if device supports biometric auth
const checkBiometricSupport=async()=>{
  if(!window.PublicKeyCredential)return false;
  try{
    const available=await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    return available;
  }catch(e){return false;}
};
// Enable lock — register a biometric credential
const enableAppLock=async()=>{
  const supported=await checkBiometricSupport();
  if(!supported){
    notify("⚠️ "+t.lockNotSupported);
    return;
  }
  try{
    // Create a credential tied to this device's biometric
    const challenge=new Uint8Array(32);crypto.getRandomValues(challenge);
    const userId=new Uint8Array(16);crypto.getRandomValues(userId);
    const cred=await navigator.credentials.create({
      publicKey:{
        challenge,
        rp:{name:"AILVIE",id:window.location.hostname},
        user:{id:userId,name:pat.name||"AILVIE User",displayName:pat.name||"AILVIE User"},
        pubKeyCredParams:[{alg:-7,type:"public-key"},{alg:-257,type:"public-key"}],
        authenticatorSelection:{authenticatorAttachment:"platform",userVerification:"required",residentKey:"preferred"},
        timeout:60000,
        attestation:"none"
      }
    });
    if(cred){
      // Store credential ID for later verification
      const credId=btoa(String.fromCharCode(...new Uint8Array(cred.rawId)));
      localStorage.setItem("ailvie_lock","1");
      localStorage.setItem("ailvie_lock_cred",credId);
      setAppLockEnabled(true);
      notify("✅ "+t.lockEnabled);
    }
  }catch(e){
    if(e.name==="NotAllowedError")notify("⚠️ "+t.lockFailed);
    else notify("⚠️ "+t.lockNotSupported);
  }
};
// Disable lock
const disableAppLock=async()=>{
  // Require verification before disabling (security)
  const ok=await verifyBiometric();
  if(ok){
    localStorage.removeItem("ailvie_lock");
    localStorage.removeItem("ailvie_lock_cred");
    setAppLockEnabled(false);
    setIsLocked(false);
    notify(t.lockDisabled);
  }
};
// Verify biometric — used to unlock
const verifyBiometric=async()=>{
  try{
    const credId=localStorage.getItem("ailvie_lock_cred");
    const challenge=new Uint8Array(32);crypto.getRandomValues(challenge);
    const opts={
      publicKey:{
        challenge,
        timeout:60000,
        userVerification:"required",
        rpId:window.location.hostname
      }
    };
    // If we have a stored credential, request it specifically
    if(credId){
      const rawId=Uint8Array.from(atob(credId),c=>c.charCodeAt(0));
      opts.publicKey.allowCredentials=[{id:rawId,type:"public-key"}];
    }
    const assertion=await navigator.credentials.get(opts);
    return !!assertion;
  }catch(e){
    return false;
  }
};
// Unlock the app
const unlockApp=async()=>{
  const ok=await verifyBiometric();
  if(ok){setIsLocked(false);}
  else{notify("⚠️ "+t.lockFailed);}
};

const analyzeDrug=async()=>{
  if(!drugQ.trim())return;setDrugLoad(true);setDrugRes(null);
  const key=drugQ.toLowerCase().trim();
  // 1) Local DB lookup (instant, no API cost)
  const db=DR[key];
  if(db){const raw=db[lang]||db.tr||db.en;if(raw){setDrugRes(pD(raw));setDrugLoad(false);return;}}
  // 2) Cache check (reduces API calls for repeated queries)
  try{
    const cacheKey=`drug_${lang}_${key}`;
    const cached=localStorage.getItem(cacheKey);
    if(cached){
      const parsed=JSON.parse(cached);
      // Cache valid for 30 days
      if(parsed.ts&&(Date.now()-parsed.ts)<30*24*60*60*1000){
        setDrugRes(parsed.data);setDrugLoad(false);return;
      }
    }
  }catch(e){}
  // 3) Global medical databases (RxNav + OpenFDA) — INN-based worldwide matching
  try{
    const api=await lookupDrugAPIs(drugQ);
    if(api){
      let res={class:api.class,usage:api.usage,dose:api.dose,sideEffects:api.sideEffects,warnings:api.warnings,interactions:api.interactions};
      if(lang!=="en"){ // OpenFDA labels are English -> translate/condense to user language if AI available
        try{
          const langName=LL[lang]||"English";
          const tp=`Translate & condense these medication facts into ${langName}. Each field under 130 chars, plain text. Respond ONLY with JSON {"class","usage","dose","sideEffects","warnings","interactions"} — no markdown.\n${JSON.stringify(res)}`;
          const d=await callAI({model:"claude-sonnet-4-6",max_tokens:700,messages:[{role:"user",content:tp}]},apiKey);
          const txt=d.content?.map(c=>c.text||"").join("").trim()||"";const m=txt.replace(/```json\s*/g,"").replace(/```/g,"").match(/\{[\s\S]*\}/);
          if(m){const pj=JSON.parse(m[0]);res={...res,...pj};}
        }catch(e){/* keep English database data if translation unavailable */}
      }
      if(api.inn&&res.class&&res.class.toLowerCase().indexOf(api.inn.toLowerCase())<0)res.class=`${res.class} · ${api.inn}`;
      setDrugRes(res);setDrugLoad(false);
      try{localStorage.setItem(`drug_${lang}_${key}`,JSON.stringify({ts:Date.now(),data:res}));}catch(e){}
      return;
    }
  }catch(e){}
  // 4) AI analysis (fallback for local brands not in global DBs, e.g. Parol)
  try{
    const langName=LL[lang]||"English";
    const prompt=`Provide medical information about the medication "${drugQ}".

Respond ONLY with a JSON object in this exact format (no markdown, no explanation):
{"class":"drug class/category","usage":"what it is used for","dose":"typical dosage","sideEffects":"common side effects","warnings":"important warnings","interactions":"drug interactions"}

IMPORTANT: All values MUST be in ${langName} language. Keep each field concise (under 100 chars). If the drug name is unknown or misspelled, respond with: {"error":"not_found"}`;
    const d=await callAI({model:"claude-sonnet-4-6",max_tokens:800,messages:[{role:"user",content:prompt}]},apiKey);
    const txt=d.content?.map(c=>c.text||"").join("").trim()||"";
    if(!txt){throw new Error("Empty response");}
    // Clean JSON — strip markdown code blocks
    const cleaned=txt.replace(/```json\s*/g,"").replace(/```\s*/g,"").trim();
    let parsed;
    try{parsed=JSON.parse(cleaned);}
    catch(pErr){
      // Try to extract JSON from mixed text
      const match=cleaned.match(/\{[\s\S]*\}/);
      if(match){parsed=JSON.parse(match[0]);}
      else throw new Error("Invalid JSON: "+cleaned.substring(0,80));
    }
    if(parsed.error==="not_found"){
      setDrugRes({class:"-",usage:lang==="tr"?`"${drugQ}" isimli ilaç bulunamadı. Yazım hatası veya çok nadir bir ilaç olabilir.`:`Drug "${drugQ}" not found. Check spelling or it may be a rare medication.`,dose:"-",sideEffects:"-",warnings:"-",interactions:"-"});
    }else{
      setDrugRes(parsed);
      // Cache for 30 days
      try{localStorage.setItem(`drug_${lang}_${key}`,JSON.stringify({ts:Date.now(),data:parsed}));}catch(e){}
    }
  }catch(e){
    const isNoKey=e.message==="NO_KEY";
    const isAIErr=e.message?.startsWith("AI_ERROR:");
    const errText=isNoKey
      ?(lang==="tr"?"AI analizi için API anahtarı gerekli. Ayarlar → AI API Key":TL("AI analysis requires API key. Settings → AI API Key",lang))
      :isAIErr
      ?(lang==="tr"?"AI hatası: "+e.message.replace("AI_ERROR: ",""):"AI error: "+e.message.replace("AI_ERROR: ",""))
      :(lang==="tr"?"Analiz edilemedi: "+e.message:"Analysis failed: "+e.message);
    setDrugRes({class:"-",usage:errText,dose:"-",sideEffects:"-",warnings:"-",interactions:"-"});
  }
  setDrugLoad(false);
};



// Appts (declared here so alarm effects can use them)
const[appts,setAppts]=useState([]);
const[showAddAppt,setShowAddAppt]=useState(false);
const[newAppt,setNewAppt]=useState({doctor:"",hospital:"",clinic:"",date:"",time:""});
const EMPTY_APPT={doctor:"",hospital:"",clinic:"",date:"",time:""};
const apptDraftIdRef=useRef(null);
useEffect(()=>{if(!showAddAppt){apptDraftIdRef.current=null;return;}const ok=(newAppt.doctor||"").trim()&&(newAppt.date||"").trim();if(editApptId){setAppts(p=>p.map(x=>x.id===editApptId?{...x,...newAppt}:x));return;}if(ok){if(apptDraftIdRef.current==null){const id=Date.now();apptDraftIdRef.current=id;setAppts(p=>[...p,{id,...newAppt,source:""}]);}else{setAppts(p=>p.map(x=>x.id===apptDraftIdRef.current?{...x,...newAppt,id:x.id}:x));}}else if(apptDraftIdRef.current!=null){const id=apptDraftIdRef.current;apptDraftIdRef.current=null;setAppts(p=>p.filter(x=>x.id!==id));}},[newAppt,editApptId,showAddAppt]);
const[connSys,setConnSys]=useState([]);

// Med Alarm System — voice + pre-alarm + bell sound
const playAlarmBell=()=>{try{const actx=new(window.AudioContext||window.webkitAudioContext)();const playTone=(freq,start,dur)=>{const o=actx.createOscillator();const g=actx.createGain();o.connect(g);g.connect(actx.destination);o.frequency.value=freq;o.type='sine';g.gain.setValueAtTime(0.3,actx.currentTime+start);g.gain.exponentialRampToValueAtTime(0.01,actx.currentTime+start+dur);o.start(actx.currentTime+start);o.stop(actx.currentTime+start+dur);};for(let i=0;i<3;i++){playTone(880,i*0.6,0.4);playTone(1100,i*0.6+0.15,0.3);}setTimeout(()=>actx.close(),3000);}catch(e){}};
const speakAlarm=(text)=>{
  if(!text)return;
  try{speechSynthesis.cancel();}catch(e){}
  try{if(audioRef.current){audioRef.current.pause();audioRef.current=null;}}catch(e){}
  const azureLang=LC[lang]||"en-US";
  // Try Azure first, fall back to browser TTS
  fetch("/api/tts",{
    method:"POST",headers:{"Content-Type":"application/json","X-AILVIE-Client":"web"},
    body:JSON.stringify({text,lang:azureLang})
  }).then(res=>{
    if(res.ok&&res.headers.get("Content-Type")?.includes("audio"))return res.blob();
    throw new Error("azure_unavailable");
  }).then(blob=>{
    const url=URL.createObjectURL(blob);
    const audio=new Audio(url);audioRef.current=audio;
    audio.onended=()=>{URL.revokeObjectURL(url);audioRef.current=null;};
    audio.play().catch(()=>{URL.revokeObjectURL(url);audioRef.current=null;fallbackSpeak(text);});
  }).catch(()=>{fallbackSpeak(text);});
};

// -----------------------------------------------------------------------------
// Unified health alert. Every reminder (med due/late, appointment, calendar, glucose)
// goes through here so the big red screen, the alarm bell, the spoken announcement, the
// system notification and the vibration ALWAYS fire together and stay in sync.
//
// HONEST LIMITATION: a web app (PWA) cannot wake a locked/off screen and paint fullscreen
// over it - only a native app can. What we can do from the web is fire a SYSTEM NOTIFICATION
// (it appears on the lock screen, makes sound and vibrates); tapping it opens the app, which
// then shows the big red alert. The fullscreen red overlay below is shown whenever the app is
// actually open/foreground.
// -----------------------------------------------------------------------------
const lastAlertRef=useRef({});
const fireAlert=({icon,title,msg,speak,tag,notifyBody,minGapMs=60000})=>{
  const key=tag||title;
  const t=Date.now();
  if(lastAlertRef.current[key]&&t-lastAlertRef.current[key]<minGapMs)return; // de-dupe
  lastAlertRef.current[key]=t;
  // 1) big red half-screen overlay (only visible when the app is in the foreground)
  setActiveAlert({icon,title,msg});
  // 2) alarm bell
  try{playAlarmBell();}catch(e){}
  // 3) spoken announcement, right after the bell
  if(speak)setTimeout(()=>{try{speakAlarm(speak);}catch(e){}},900);
  // 4) vibration (where supported)
  try{if(navigator.vibrate)navigator.vibrate([300,150,300,150,300]);}catch(e){}
  // 5) system notification — this is the part that reaches a locked screen
  try{sendNotification(icon+' '+title, notifyBody||msg||"");}catch(e){}
  // 6) log it into the in-app bell/notification list
  try{notify(icon+' '+title+(msg?' — '+msg:""));}catch(e){}
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
const firedAlarms=useRef(new Set());
// Request notification permission on mount
useEffect(()=>{if('Notification' in window&&Notification.permission==='default')Notification.requestPermission();},[]);
useEffect(()=>{ // open ALERTS window when app is opened/focused from a notification
  try{const u=new URL(window.location.href);if(u.searchParams.get('alerts')==='1'){setShowAlerts(true);u.searchParams.delete('alerts');window.history.replaceState({},'',u.pathname+(u.search||''));}}catch(e){}
  const onMsg=(e)=>{if(e.data&&e.data.type==='OPEN_ALERTS')setShowAlerts(true);};
  if(navigator.serviceWorker)navigator.serviceWorker.addEventListener('message',onMsg);
  return()=>{if(navigator.serviceWorker)navigator.serviceWorker.removeEventListener('message',onMsg);};
},[]);
const sendNotification=(title,body)=>{
  try{
    if(perms&&perms.notif===false)return;
    if(!('Notification'in window)||Notification.permission!=='granted')return;
    const opts={body,icon:'/icon-192.png',badge:'/icon-192.png',tag:title,renotify:true,requireInteraction:true,vibrate:[300,150,300,150,300],data:{url:'/?alerts=1'},actions:[{action:'alerts',title:lang==='tr'?'UYARILAR':'ALERTS'},{action:'ok',title:'OK'}]};
    if(navigator.serviceWorker&&navigator.serviceWorker.ready)navigator.serviceWorker.ready.then(reg=>reg.showNotification(title,opts)).catch(()=>{try{new Notification(title,{body,icon:'/icon-192.png',tag:title,requireInteraction:true});}catch(e){}});
    else new Notification(title,{body,icon:'/icon-192.png',tag:title,requireInteraction:true});
  }catch(e){}
};
useEffect(()=>{
// Runs on its own 1s ticker. It must NOT depend on the `now` state: re-rendering the whole
// app every second to check alarms made the UI visibly flicker on low-end phones.
const check=()=>{
const _n=new Date();
const hhmm=String(_n.getHours()).padStart(2,'0')+':'+String(_n.getMinutes()).padStart(2,'0');
const minKey=hhmm;
// Reset fired set each new minute
if(_n.getSeconds()===1)firedAlarms.current=new Set();
if(_n.getSeconds()<=2){
// Med alarms
meds.forEach(m=>{
  if(!m.taken&&m.time===hhmm&&!firedAlarms.current.has('med-'+m.id)){
    firedAlarms.current.add('med-'+m.id);
    const cnt=typeof m.count==='number'?m.count:30;
    if(cnt>0){
      fireAlert({icon:'💊',tag:'med-'+m.id,
        title:(lang==='tr'?'İLAÇ ZAMANI':'MED TIME'),
        msg:m.name+(m.dose?' '+m.dose:'')+' — '+m.time,
        speak:(lang==='tr'?'İlaç zamanı: ':'Med time: ')+m.name+(m.dose?' '+m.dose:'')});
    }
  }
  // Late med warning — every 15 min for unmissed meds past their time
  if(!m.taken&&m.time){
    const[mH,mM]=(m.time||'00:00').split(':').map(Number);
    const medMins=mH*60+mM;
    const nowMins=_n.getHours()*60+_n.getMinutes();
    const diff=nowMins-medMins;
    if(diff>0&&diff<=240&&diff%15===0&&!firedAlarms.current.has('late-'+m.id+'-'+diff)){
      firedAlarms.current.add('late-'+m.id+'-'+diff);
      const timeStr=diff>=60?`${Math.floor(diff/60)} ${lang==='tr'?'saat':'hr'} ${diff%60} ${lang==='tr'?'dk':'min'}`:`${diff} ${lang==='tr'?'dakika':'min'}`;
      const msg=lang==='tr'
        ?`İlaç saatin ${timeStr} geçti. ${m.name} ilacını kullandıysan onay ver.`
        :`Medication time passed by ${timeStr}. If you took ${m.name}, please confirm.`;
      fireAlert({icon:'⚠️',tag:'medlate-'+m.id,
        title:(lang==='tr'?'İLAÇ GECİKTİ':'MED OVERDUE'),msg,speak:msg,minGapMs:15*60000});
    }
  }
  // Pre-alarm: 10 min before
  const[mH,mM]=(m.time||'00:00').split(':').map(Number);
  let preH=mH,preM=mM-10;
  if(preM<0){preM+=60;preH=(preH-1+24)%24;}
  const preHHMM=String(preH).padStart(2,'0')+':'+String(preM).padStart(2,'0');
  if(!m.taken&&preHHMM===hhmm&&!firedAlarms.current.has('pre-'+m.id)){
    firedAlarms.current.add('pre-'+m.id);
    notify('⏰ '+m.name+' — '+(lang==='tr'?'10 dk sonra!':'in 10 min!'));
    sendNotification('⏰ '+(lang==='tr'?'İlaç Hatırlatma':'Med Reminder'),m.name+' '+(lang==='tr'?'10 dakika sonra':'in 10 minutes'));
  }
});
// Calendar alarms
const isoD=_n.toISOString().split('T')[0];
if(calAlarms[isoD]&&calAlarms[isoD]===hhmm&&!firedAlarms.current.has('cal-'+isoD)){
  firedAlarms.current.add('cal-'+isoD);
  fireAlert({icon:'📅',tag:'cal-'+isoD,
    title:(lang==='tr'?'TAKVİM HATIRLATMA':'CALENDAR'),msg:calNotes[isoD]||'Alarm',
    speak:(lang==='tr'?'Takvim hatırlatması: ':'Calendar reminder: ')+(calNotes[isoD]||'')});
}
// Appointment alarms (1 day + 6 hours before, and 1 hour before)
appts.forEach(a=>{
  const aDate=new Date(a.date+'T'+(a.time||'09:00'));
  const diffMs=aDate-_n;
  const diffMin=Math.round(diffMs/60000);
  if(diffMin===60&&!firedAlarms.current.has('appt1h-'+a.id)){
    firedAlarms.current.add('appt1h-'+a.id);
    playAlarmBell();
    notify('🏥 '+a.doctor+' — '+(lang==='tr'?'1 saat sonra!':'in 1 hour!'));
    sendNotification('🏥 '+(lang==='tr'?'Randevu':'Appointment'),a.doctor+' — '+(lang==='tr'?'1 saat sonra':'in 1 hour'));
    setActiveAlert({icon:'🏥',title:(lang==='tr'?'RANDEVU':'APPOINTMENT'),msg:a.doctor+' — '+(lang==='tr'?'1 saat sonra':'in 1 hour')});
  }
});
}
};
check();
const iv=setInterval(check,1000);
return()=>clearInterval(iv);
},[meds,lang,calAlarms,calNotes,appts]);

// Health
const[hd,setHd]=useState({pulse:0,weight:0,height:0,bpS:0,bpD:0,steps:0,sleep:0,spo2:0,calories:0,restPulse:0,hrvRmssd:0,hrvSdnn:0,resp:0});
const[pulseM,setPulseM]=useState(null); // {phase:'init'|'measuring'|'done'|'error',progress,bpm,quality,msg}
const[bleHr,setBleHr]=useState(null); // Web Bluetooth HR: {connected,bpm,name}|{error}|{connecting,name}|null
const[soundSess,setSoundSess]=useState(null); // on-device audio session: {active,cough,snore,other,level}|{error}|{done,...}|null
const[balanceM,setBalanceM]=useState(null); // balance/sway test: {phase:'active'|'done'|'error',progress,sway,band,msg}
const balanceRef=useRef({handler:null,samples:[],start:0,timer:null,prog:null});
const[postureM,setPostureM]=useState(null); // posture angle: {phase:'calibrating'|'live'|'error',angle,band,msg}
const postureRef=useRef({handler:null,ref:null,g:[0,0,0],phase:"",calibSum:[0,0,0],calibN:0,timer:null,tick:null});
const[reactM,setReactM]=useState(null); // reaction test: {phase:'idle'|'waiting'|'go'|'early'|'done',trials,avg,best,sd}
const reactRef=useRef({timer:null,goTime:0});
const reactTap=()=>{
  const R=reactRef.current; const m=reactM||{phase:"idle",trials:[]};
  const scheduleGo=(trials)=>{const delay=1500+Math.random()*2500;if(R.timer)clearTimeout(R.timer);R.timer=setTimeout(()=>{R.goTime=performance.now();setReactM(x=>x&&x.phase==="waiting"?{...x,phase:"go"}:x);},delay);setReactM({phase:"waiting",trials});};
  if(m.phase==="idle"||m.phase==="done"){scheduleGo([]);return;}
  if(m.phase==="early"){scheduleGo(m.trials||[]);return;}
  if(m.phase==="waiting"){if(R.timer)clearTimeout(R.timer);setReactM({...m,phase:"early"});return;} // false start
  if(m.phase==="go"){
    const rt=Math.round(performance.now()-R.goTime);
    if(rt<120){setReactM({...m,phase:"early"});return;} // anticipation, not a real reaction -> reject
    const trials=[...(m.trials||[]),rt];
    if(trials.length>=5){const avg=Math.round(trials.reduce((a,b)=>a+b,0)/trials.length),best=Math.min(...trials),sd=Math.round(Math.sqrt(trials.reduce((a,b)=>a+(b-avg)**2,0)/trials.length));setReactM({phase:"done",trials,avg,best,sd});setTests(t=>({...t,rxAvg:avg,rxBest:best,rxAt:Date.now()}));}
    else scheduleGo(trials);
    return;
  }
};
useEffect(()=>()=>{try{if(reactRef.current.timer)clearTimeout(reactRef.current.timer);}catch(e){}},[]);
const soundRef=useRef({ctx:null,stream:null,raf:null,base:null,inEvt:false,evtStart:0,evtLow:0,evtHigh:0,evtPeak:0,last:0,cough:0,snore:0,other:0,fc:0});
const pulseStreamRef=useRef(null),pulseRafRef=useRef(null),pulseFromChatRef=useRef(false),pulseHrvRef=useRef(false),bleRef=useRef(null);
const[editH,setEditH]=useState(null);
const[tmpH,setTmpH]=useState("");
const[wellness,setWellness]=useState({water:0,sleep:0,mood:0,steps:0,exercise:0,waterGoal:8,sleepGoal:8,stepsGoal:10000});
const[diet,setDiet]=useState({meals:[],done:{},water:{},goalWater:8}); // dietitian-prescribed program tracker
const[glucose,setGlucose]=useState([]); // blood glucose readings [{id,ts,val,type}]
const[dietSlot,setDietSlot]=useState(lang==="tr"?"Kahvaltı":TL("Breakfast",lang));
const[dietText,setDietText]=useState("");
const[gluVal,setGluVal]=useState("");
const[gluType,setGluType]=useState("fasting");
const[healthLog,setHealthLog]=useState([]); // timestamped vital history [{id,ts,type,val,meta}]
const[labs,setLabs]=useState([]); // [{id,ts,test,value,unit,canonValue,canonUnit,level,source,labLow,labHigh}]
const[labForm,setLabForm]=useState({test:"glucose",value:"",unit:"mg/dL",low:"",high:""});
const[labParse,setLabParse]=useState({busy:false,rows:[],err:null,fileName:""});
const[storageWarn,setStorageWarn]=useState(null);
const[syncCfg,setSyncCfg]=useState(()=>{try{return JSON.parse(localStorage.getItem("ailvie_sync")||"null");}catch(e){return null;}});
const[syncBusy,setSyncBusy]=useState(false);
const[syncMsg,setSyncMsg]=useState("");
const syncKeysRef=useRef(null);
const[lockCfg,setLockCfg]=useState(()=>{try{return JSON.parse(localStorage.getItem("ailvie_lock")||"null");}catch(e){return null;}});
const[locked,setLocked]=useState(()=>{try{return !!JSON.parse(localStorage.getItem("ailvie_lock")||"null");}catch(e){return false;}});
const[pinIn,setPinIn]=useState("");
const[lockErr,setLockErr]=useState("");
const[lockTries,setLockTries]=useState(0);
const[bioAvail,setBioAvail]=useState(false);
const lastActiveRef=useRef(Date.now());
const[lastBackup,setLastBackup]=useState(()=>{try{const v=localStorage.getItem("ailvie_last_backup");return v?Number(v):0;}catch(e){return 0;}});
useEffect(()=>{biometricAvailable().then(setBioAvail);},[]);
useEffect(()=>{
  if(!lockCfg)return;
  const onHide=()=>{if(document.visibilityState==="hidden")lastActiveRef.current=Date.now();};
  const onShow=()=>{
    if(document.visibilityState!=="visible")return;
    const idle=Date.now()-lastActiveRef.current;
    const graceMs=(lockCfg.graceSec||60)*1000;
    if(idle>graceMs)setLocked(true);
  };
  document.addEventListener("visibilitychange",onHide);
  document.addEventListener("visibilitychange",onShow);
  return()=>{document.removeEventListener("visibilitychange",onHide);document.removeEventListener("visibilitychange",onShow);};
},[lockCfg]);
const tryUnlockPIN=async()=>{
  if(!lockCfg)return;
  const ok=await verifyPIN(pinIn,lockCfg.pin);
  if(ok){
    try{dataKeyRef.current=await deriveDataKey(pinIn);}catch(e){dataKeyRef.current=null;}
    if(pendingEncRef.current!=null){
      try{const payload=await unpackData(pendingEncRef.current);const d=JSON.parse(payload||"{}");latestPayloadRef.current=payload||"{}";applyLoadedData(d);pendingEncRef.current=null;dataLoadedRef.current=true;}
      catch(e){setLockErr(lang==="tr"?"Veri çözülemedi":TL("Could not decrypt",lang));setStorageWarn(lang==="tr"?"⚠️ Veriler çözülemedi. Kayıt durduruldu — verileriniz silinmedi.":TL("⚠️ Could not decrypt data. Saving paused; nothing deleted.",lang));return;}
    }
    setLocked(false);setPinIn("");setLockErr("");setLockTries(0);lastActiveRef.current=Date.now();
  }
  else{const n=lockTries+1;setLockTries(n);setPinIn("");setLockErr(lang==="tr"?`Yanlış PIN (${n})`:`Wrong PIN (${n})`);}
};
const tryUnlockBio=async()=>{
  if(!lockCfg||!lockCfg.credId)return;
  try{const ok=await biometricVerify(lockCfg.credId);if(ok){
    if(pendingEncRef.current!=null&&!dataKeyRef.current){setLockErr(lang==="tr"?"Şifreli veriyi açmak için PIN gerekli":TL("Enter PIN to unlock encrypted data",lang));return;}
    setLocked(false);setLockErr("");setLockTries(0);lastActiveRef.current=Date.now();}}
  catch(e){setLockErr(lang==="tr"?"Biyometrik doğrulama başarısız — PIN girin":TL("Biometric failed — enter PIN",lang));}
};

const[persisted,setPersisted]=useState(false);
const dataLoadedRef=useRef(false);
const firstWriteRef=useRef(true);
// ---------- At-rest encryption of the main data blob (active only when app-lock/PIN is ON) ----------
// The PIN-derived AES key lives ONLY in memory (dataKeyRef) after unlock. Every read/write of
// ailvie_data goes through unpackData/packData so the empty-write guard and revision backup stay
// correct even when the on-disk blob is an encrypted envelope. packData returns plaintext when
// there is no key (no lock), so behaviour is unchanged for users without a PIN.
const dataKeyRef=useRef(null);
const pendingEncRef=useRef(null);   // raw encrypted blob held when load is deferred until unlock
const latestPayloadRef=useRef(null);// most recent PLAINTEXT payload (for safe re-save on PIN removal)
const deriveDataKey=async(pin,cfg)=>{const c=cfg||lockCfg;if(!c||!c.pin||!c.pin.salt)return null;try{return await deriveKey(pin,b64d(c.pin.salt));}catch(e){return null;}};
const packData=async(jsonStr)=>{const key=dataKeyRef.current;if(!key)return jsonStr;const iv=crypto.getRandomValues(new Uint8Array(12));const ct=await crypto.subtle.encrypt({name:"AES-GCM",iv},key,enc.encode(jsonStr));return JSON.stringify({v:2,enc:1,iv:b64e(iv),ct:b64e(ct)});};
const unpackData=async(raw)=>{if(raw==null)return null;let env;try{env=JSON.parse(raw);}catch(e){return raw;}if(!env||env.enc!==1)return raw;const key=dataKeyRef.current;if(!key){const er=new Error("locked");er.code="locked";throw er;}const pt=await crypto.subtle.decrypt({name:"AES-GCM",iv:b64d(env.iv)},key,b64d(env.ct));return dec.decode(pt);};
const applyLoadedData=(d)=>{
if(d.meds?.length)setMeds(d.meds);if(d.appts?.length)setAppts(d.appts);if(d.notes?.length)setNotes(d.notes);
if(d.contacts?.length)setContacts(d.contacts);if(d.pat)setPat(p=>({...p,...d.pat}));if(d.hd)setHd(p=>({...p,...d.hd}));if(d.wellness)setWellness(p=>({...p,...d.wellness}));if(d.diet)setDiet(p=>({...p,...d.diet}));if(Array.isArray(d.glucose))setGlucose(d.glucose);if(Array.isArray(d.healthLog))setHealthLog(d.healthLog);if(Array.isArray(d.labs))setLabs(d.labs);if(d.goals)setGoals(p=>({...p,...d.goals}));if(d.tests)setTests(d.tests);if(d.trashDays)setTrashDays(d.trashDays);if(Array.isArray(d.trashItems))setTrashItems(d.trashItems);if(d.draftMed)setNewMed(v=>({...v,...d.draftMed}));if(d.draftAppt)setNewAppt(v=>({...v,...d.draftAppt}));if(d.draftContact)setNewC(v=>({...v,...d.draftContact}));if(d.draftRec)setNewRec(v=>({...v,...d.draftRec}));if(d.records?.length)setRecords(d.records);if(d.msgs?.length)setMsgs(d.msgs);if(Array.isArray(d.reportedMsgs))setReportedMsgs(d.reportedMsgs);if(Array.isArray(d.blockedUsers))setBlockedUsers(d.blockedUsers);if(d.chatM?.length)setChatM(d.chatM);if(Array.isArray(d.aiMem))setAiMem(d.aiMem);if(d.dialysis&&typeof d.dialysis==="object")setDialysis(d.dialysis);
if(d.calNotes)setCalNotes(d.calNotes);if(d.calAlarms)setCalAlarms(d.calAlarms);if(d.moodLog?.length)setMoodLog(d.moodLog);if(d.groups?.length)setGroups(d.groups);
};
const[repMetric,setRepMetric]=useState("weight");
const[repRange,setRepRange]=useState(30); // days; 0=all
const[hba1cVal,setHba1cVal]=useState("");
const[goals,setGoals]=useState({weight:""});
const logMetric=useCallback((type,val,meta)=>{const v=Number(val);if(!v||v<=0)return;setHealthLog(l=>{const last=[...l].reverse().find(x=>x.type===type);if(last&&last.val===v&&(Date.now()-last.ts)<3600e3&&JSON.stringify(last.meta||null)===JSON.stringify(meta||null))return l;return[...l,{id:Date.now()+"_"+Math.random().toString(36).slice(2,6),ts:Date.now(),type,val:v,meta:meta||null}];});},[]);
const exportFHIR=()=>{
  const L=lang==="tr";
  if(!(labs||[]).length){notify(L?"Dışa aktarılacak tahlil yok.":"No labs to export.");return;}
  const bundle=toFHIRBundle(labs,pat);
  const blob=new Blob([JSON.stringify(bundle,null,2)],{type:"application/fhir+json"});
  const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="ailvie_fhir_"+new Date().toISOString().slice(0,10)+".json";document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);
  const coded=(labs||[]).filter(x=>LOINC[x.test]).length;
  notify(L?`✓ FHIR (R4) dışa aktarıldı · ${coded}/${labs.length} LOINC kodlu`:`✓ FHIR exported · ${coded}/${labs.length} LOINC-coded`);
};
const exportCSV=()=>{
  const tr=lang==="tr";
  const nm=tr?{weight:"Kilo",pulse:"Nabız",bp:"Tansiyon",spo2:"SpO2",glucose:"Şeker",hba1c:"HbA1c"}:{weight:"Weight",pulse:"Pulse",bp:"BloodPressure",spo2:"SpO2",glucose:"Glucose",hba1c:"HbA1c"};
  const un={weight:"kg",pulse:"bpm",bp:"mmHg",spo2:"%",glucose:"mg/dL",hba1c:"%"};
  const rows=[];
  (healthLog||[]).forEach(x=>rows.push({ts:x.ts,type:x.type,val:x.type==="bp"?(x.val+"/"+((x.meta&&x.meta.d)||"")):x.val,note:x.type==="glucose"?(x.meta||""):""}));
  (glucose||[]).forEach(g=>rows.push({ts:g.ts,type:"glucose",val:g.val,note:g.type}));
  (labs||[]).forEach(x=>{const ti=LAB_TESTS.find(y=>y.k===x.test);const LV={normal:[ "normal","normal"],low:["düşük","low"],high:["yüksek","high"],"critical-low":["kritik düşük","critical low"],"critical-high":["kritik yüksek","critical high"],prediabetes:["prediyabet eşiği","prediabetes"],"diabetes-range":["diyabet eşiği","diabetes range"]};const lvl=x.level?(LV[x.level]?(tr?LV[x.level][0]:LV[x.level][1]):x.level):(tr?"sınıflandırılmadı":"not classified");const src=x.source==="lab-reported"?(tr?"raporun aralığı":"report range"):(tr?"dahili referans":"internal ref");rows.push({ts:x.ts,type:"lab",name:ti?(tr?ti.tr:ti.en):x.test,val:x.value,unit:x.unit,note:lvl+" · "+src});});
  rows.sort((a,b)=>a.ts-b.ts);
  if(!rows.length){notify(tr?"Dışa aktarılacak veri yok.":"No data to export.");return;}
  const esc=(v)=>{v=String(v==null?"":v);return /[";\n]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v;};
  const head=tr?["Tarih","Saat","Ölçüm","Değer","Birim","Not"]:["Date","Time","Metric","Value","Unit","Note"];
  let csv=head.join(";")+"\n";
  rows.forEach(r=>{const d=new Date(r.ts);csv+=[d.toLocaleDateString(lc),d.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),r.name||nm[r.type]||r.type,r.val,r.unit||un[r.type]||"",r.note].map(esc).join(";")+"\n";});
  const blob=new Blob(["\ufeff"+csv],{type:"text/csv;charset=utf-8"});
  const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="ailvie_saglik_"+new Date().toISOString().slice(0,10)+".csv";document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);
  notify(tr?"✓ CSV indirildi (Excel/Sheets'te açılır)":"✓ CSV downloaded");
};
const exportReportPDF=()=>{
  const tr=lang==="tr";
  const esc=(x)=>String(x==null?"":x).replace(/[&<>]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;"}[c]));
  const dstr=(ts)=>{const d=new Date(ts);return d.toLocaleDateString(lc,{day:"2-digit",month:"2-digit",year:"numeric"})+" "+d.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});};
  const metrics=[["weight",tr?"Kilo":"Weight","kg"],["pulse",tr?"Nabız":"Pulse","bpm"],["bp",tr?"Tansiyon":"Blood Pressure","mmHg"],["spo2","SpO2","%"],["glucose",tr?"Şeker":"Glucose","mg/dL"]];
  let body="";
  metrics.forEach(([k,lbl,u])=>{
    const ser=(k==="glucose"?[...glucose].map(r=>({ts:r.ts,val:r.val,meta:r.type})):healthLog.filter(x=>x.type===k).map(x=>({ts:x.ts,val:x.val,meta:x.meta}))).sort((a,b)=>a.ts-b.ts);
    if(!ser.length)return;
    const vals=ser.map(s=>s.val),avg=Math.round(vals.reduce((a,b)=>a+b,0)/vals.length*10)/10,mn=Math.min(...vals),mx=Math.max(...vals),cur=ser[ser.length-1];
    const fv=(s)=>k==="bp"?(s.val+"/"+((s.meta&&s.meta.d)||"?")):s.val;
    const rows=[...ser].reverse().slice(0,20).map(x=>"<tr><td>"+esc(dstr(x.ts))+"</td><td style='text-align:right;font-weight:600'>"+esc(fv(x))+" "+u+"</td></tr>").join("");
    body+="<h3>"+esc(lbl)+"</h3><p>"+(tr?"Son":"Latest")+": <b>"+esc(fv(cur))+" "+u+"</b> \u00b7 "+(tr?"Ortalama":"Avg")+": "+avg+" \u00b7 "+(tr?"En d\u00fc\u015f\u00fck":"Min")+": "+mn+" \u00b7 "+(tr?"En y\u00fcksek":"Max")+": "+mx+" \u00b7 "+(tr?"\u00d6l\u00e7\u00fcm":"Count")+": "+ser.length+"</p><table><thead><tr><th>"+(tr?"Tarih \u00b7 Saat":"Date \u00b7 Time")+"</th><th style='text-align:right'>"+(tr?"De\u011fer":"Value")+"</th></tr></thead><tbody>"+rows+"</tbody></table>";
  });
  if((labs||[]).length){
    const byTest={};(labs||[]).forEach(x=>{(byTest[x.test]=byTest[x.test]||[]).push(x);});
    let lb="";
    Object.keys(byTest).forEach(k=>{const ti=LAB_TESTS.find(y=>y.k===k);const arr=byTest[k].slice().sort((a,b)=>a.ts-b.ts);
      const LV={normal:["normal","normal"],low:["düşük","low"],high:["yüksek","high"],"critical-low":["kritik düşük","critical low"],"critical-high":["kritik yüksek","critical high"],prediabetes:["prediyabet eşiği","prediabetes"],"diabetes-range":["diyabet eşiği","diabetes range"]};const rows=arr.slice().reverse().slice(0,12).map(x=>{const lvl=x.level?(LV[x.level]?(tr?LV[x.level][0]:LV[x.level][1]):x.level):(tr?"sınıflandırılmadı":"not classified");const src=x.source==="lab-reported"?(tr?"raporun aralığı":"report range"):(tr?"dahili referans":"internal ref");const rng=(x.refLow!=null&&x.refHigh!=null)?(" ["+x.refLow+"–"+x.refHigh+"]"):"";
        return "<tr><td>"+esc(dstr(x.ts))+"</td><td style='text-align:right;font-weight:600'>"+esc(x.value+" "+x.unit)+"</td><td style='text-align:right'>"+esc(lvl+rng)+"</td><td style='text-align:right;color:#666'>"+esc(src)+"</td></tr>";}).join("");
      lb+="<h3>"+esc(ti?(tr?ti.tr:ti.en):k)+"</h3><table><thead><tr><th>"+(tr?"Tarih · Saat":"Date · Time")+"</th><th style='text-align:right'>"+(tr?"Değer":"Value")+"</th><th style='text-align:right'>"+(tr?"Sonuç":"Result")+"</th><th style='text-align:right'>"+(tr?"Kaynak":"Source")+"</th></tr></thead><tbody>"+rows+"</tbody></table>";});
    body+="<h2 style='margin-top:22px;color:#0077b6;font-size:18px'>"+(tr?"Tahlil Sonuçları":"Lab Results")+"</h2>"+lb;
  }
  if(!body)body="<p>"+(tr?"Hen\u00fcz kay\u0131t yok.":"No records yet.")+"</p>";
  const gen=new Date().toLocaleString(lc);
  const html="<!doctype html><html><head><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1'><title>AILVIE</title><style>body{font-family:system-ui,Arial,sans-serif;color:#111;padding:22px;max-width:820px;margin:auto}h1{color:#0077b6;margin:0 0 2px;font-size:22px}h3{margin:18px 0 4px;color:#0077b6;border-bottom:2px solid #e8a817;padding-bottom:2px;font-size:16px}table{width:100%;border-collapse:collapse;margin:4px 0 12px;font-size:13px}th,td{border-bottom:1px solid #ddd;padding:5px 8px;text-align:left}p{font-size:13px;color:#333;margin:4px 0}.m{color:#666;font-size:12px;margin-bottom:6px}.w{margin-top:20px;font-size:11px;color:#666;border-top:1px solid #ddd;padding-top:8px}</style></head><body><h1>AILVIE \u2014 "+(tr?"Sa\u011fl\u0131k Raporu":"Health Report")+"</h1><div class='m'>"+esc(pat.name||"")+" \u00b7 "+(tr?"Olu\u015fturma":"Generated")+": "+esc(gen)+"</div>"+body+"<div class='w'>"+(tr?"Bu rapor tarama ama\u00e7l\u0131d\u0131r, t\u0131bbi tan\u0131/tedavi yerine ge\u00e7mez. Sa\u011fl\u0131k kararlar\u0131 i\u00e7in doktorunuza dan\u0131\u015f\u0131n.":"Screening only; not a medical diagnosis. Consult your doctor.")+"</div></body></html>";
  const w=window.open("","_blank");
  if(!w){notify(tr?"Pop-up engellendi \u2014 taray\u0131c\u0131 ayar\u0131ndan izin verin.":"Popup blocked \u2014 allow popups.");return;}
  w.document.write(html);w.document.close();setTimeout(()=>{try{w.focus();w.print();}catch(e){}},500);
};
const[sleepTimes,setSleepTimes]=useState(()=>{try{return JSON.parse(localStorage.getItem("ailvie_sleep_times"))||{bed:"",wake:""};}catch{return {bed:"",wake:""};}});
const[tests,setTests]=useState({}); // last screening results: {balSway,balBand,balAt,rxAvg,rxBest,rxAt,postAngle,postAt}
const ago=(ts)=>{if(!ts)return"";const m=Math.round((Date.now()-ts)/60000);if(m<1)return lang==="tr"?"az önce":TL("just now",lang);if(m<60)return lang==="tr"?`${m} dk önce`:`${m}m ago`;const h=Math.round(m/60);if(h<24)return lang==="tr"?`${h} saat önce`:`${h}h ago`;return lang==="tr"?`${Math.round(h/24)} gün önce`:`${Math.round(h/24)}d ago`;};
const[moodLog,setMoodLog]=useState([]);
const[stepAuto,setStepAuto]=useState(()=>{try{return localStorage.getItem("ailvie_step_auto")==="1";}catch{return false;}});
const stepRef=React.useRef({last:0,baseSteps:0,count:0,lastMag:0});
const[stepInfo,setStepInfo]=useState({sess:0,cadence:0,dist:0});
// Live step counter via DeviceMotion — FOREGROUND ONLY (browsers/PWA cannot count steps in the background)
useEffect(()=>{
  if(!stepAuto)return;
  if(typeof window==="undefined"||!window.DeviceMotionEvent)return;
  stepRef.current.sessStart=Date.now();stepRef.current.sessCount=0;setStepInfo({sess:0,cadence:0,dist:0});
  const stride=hd.height>0?(hd.height*0.415/100):0.7; // metres per step (from height or default)
  const handler=(e)=>{
    const a=e.accelerationIncludingGravity||e.acceleration;
    if(!a)return;
    const mag=Math.sqrt((a.x||0)**2+(a.y||0)**2+(a.z||0)**2);
    const now=Date.now();
    // real step: acceleration peak >12 m/s² (rising edge), min 300ms apart (<=200 steps/min)
    if(mag>12&&stepRef.current.lastMag<=12&&now-stepRef.current.last>300){
      stepRef.current.last=now;stepRef.current.count++;stepRef.current.sessCount++;
      setWellness(w=>({...w,steps:w.steps+1})); // accurate: one real detected step
      if(stepRef.current.sessCount%5===0){
        const mins=(now-stepRef.current.sessStart)/60000;
        const cad=mins>0.03?Math.round(stepRef.current.sessCount/mins):0;
        setStepInfo({sess:stepRef.current.sessCount,cadence:cad,dist:Math.round(stepRef.current.sessCount*stride)});
      }
    }
    stepRef.current.lastMag=mag;
  };
  if(typeof DeviceMotionEvent.requestPermission==="function"){
    DeviceMotionEvent.requestPermission().then(p=>{if(p==="granted")window.addEventListener("devicemotion",handler);}).catch(()=>{});
  }else{
    window.addEventListener("devicemotion",handler);
  }
  return()=>{try{window.removeEventListener("devicemotion",handler);}catch{}};
},[stepAuto]);
useEffect(()=>{try{localStorage.setItem("ailvie_step_auto",stepAuto?"1":"0");}catch{}},[stepAuto]);
// Auto-lock when app goes to background (if lock enabled)
useEffect(()=>{
  if(!appLockEnabled)return;
  const onVisible=()=>{
    if(document.visibilityState==="hidden"){
      setIsLocked(true);
    }
  };
  document.addEventListener("visibilitychange",onVisible);
  return()=>document.removeEventListener("visibilitychange",onVisible);
},[appLockEnabled]);

// Reset steps at midnight
useEffect(()=>{
  const check=()=>{try{
    const lastDay=localStorage.getItem("ailvie_step_day");
    const today=new Date().toDateString();
    if(lastDay!==today){
      setWellness(w=>({...w,steps:0}));
      stepRef.current.count=0;
      localStorage.setItem("ailvie_step_day",today);
      // Reset recurring meds: taken:false so they can be taken again today
      setMeds(p=>p.map(m=>m.recurring!==false?{...m,taken:false}:m));
    }
  }catch{}};
  check();
  const int=setInterval(check,60000);
  return()=>clearInterval(int);
},[]);

// Auto-sync same-name meds to minimum count (ensures stock pool is consistent)
useEffect(()=>{
  const byName={};
  meds.forEach(m=>{
    const nm=m.name?.trim().toLowerCase();
    if(!nm)return;
    const c=m.count??30;
    if(byName[nm]===undefined||c<byName[nm])byName[nm]=c;
  });
  // Check if any sync is needed
  const needsSync=meds.some(m=>{
    const nm=m.name?.trim().toLowerCase();
    return nm&&byName[nm]!==undefined&&(m.count??30)!==byName[nm];
  });
  if(needsSync){
    setMeds(p=>p.map(m=>{
      const nm=m.name?.trim().toLowerCase();
      if(nm&&byName[nm]!==undefined)return{...m,count:byName[nm]};
      return m;
    }));
  }
},[meds.length]); // Only run when meds count changes (add/delete), not on every count change

// Notes
const[notes,setNotes]=useState([]);
const[noteSearch,setNoteSearch]=useState("");
const[noteFilter,setNoteFilter]=useState("all");
const[editNote,setEditNote]=useState(null);
useEffect(()=>{if(!editNote)return;const upd=()=>{try{setFmtState({b:document.queryCommandState("bold"),i:document.queryCommandState("italic"),u:document.queryCommandState("underline"),block:(document.queryCommandValue("formatBlock")||"").toLowerCase()});}catch(e){}};document.addEventListener("selectionchange",upd);upd();return()=>document.removeEventListener("selectionchange",upd);},[editNote]);
const[nOpen,setNOpen]=useState(false);
const[nT,setNT]=useState("");
const[nC,setNC]=useState("");
const[nCol,setNCol]=useState(null);
const[noteApps,setNoteApps]=useState([{name:"Google Keep",url:"https://keep.google.com",icon:"📒"},{name:"Notion",url:"https://notion.so",icon:"📓"},{name:"Evernote",url:"https://evernote.com",icon:"🐘"}]);
const[showAddNApp,setShowAddNApp]=useState(false);
const[newNApp,setNewNApp]=useState({name:"",url:"",icon:"📱"});

// Contacts
const[contacts,setContacts]=useState([]);
const[catF,setCatF]=useState("all");
const[showAddC,setShowAddC]=useState(false);
const[editContactId,setEditContactId]=useState(null);
const[showCountryPicker,setShowCountryPicker]=useState(false);
const COUNTRY_CODES=[
  {code:"+90",flag:"tr",n:{tr:"Türkiye",en:"Turkiye",de:"Türkei",ru:"Турция",zh:"土耳其",hi:"तुर्की",nl:"Turkije",es:"Turquía",ar:"تركيا"}},
  {code:"+1",flag:"us",n:{tr:"ABD",en:"USA",de:"USA",ru:"США",zh:"美国",hi:"अमेरिका",nl:"VS",es:"EE.UU.",ar:"أمريكا"}},
  {code:"+1",flag:"ca",n:{tr:"Kanada",en:"Canada",de:"Kanada",ru:"Канада",zh:"加拿大",hi:"कनाडा",nl:"Canada",es:"Canadá",ar:"كندا"}},
  {code:"+44",flag:"gb",n:{tr:"İngiltere",en:"UK",de:"Großbritannien",ru:"Великобритания",zh:"英国",hi:"ब्रिटेन",nl:"VK",es:"Reino Unido",ar:"بريطانيا"}},
  {code:"+49",flag:"de",n:{tr:"Almanya",en:"Germany",de:"Deutschland",ru:"Германия",zh:"德国",hi:"जर्मनी",nl:"Duitsland",es:"Alemania",ar:"ألمانيا"}},
  {code:"+33",flag:"fr",n:{tr:"Fransa",en:"France",de:"Frankreich",ru:"Франция",zh:"法国",hi:"फ़्रांस",nl:"Frankrijk",es:"Francia",ar:"فرنسا"}},
  {code:"+39",flag:"it",n:{tr:"İtalya",en:"Italy",de:"Italien",ru:"Италия",zh:"意大利",hi:"इटली",nl:"Italië",es:"Italia",ar:"إيطاليا"}},
  {code:"+34",flag:"es",n:{tr:"İspanya",en:"Spain",de:"Spanien",ru:"Испания",zh:"西班牙",hi:"स्पेन",nl:"Spanje",es:"España",ar:"إسبانيا"}},
  {code:"+31",flag:"nl",n:{tr:"Hollanda",en:"Netherlands",de:"Niederlande",ru:"Нидерланды",zh:"荷兰",hi:"नीदरलैंड",nl:"Nederland",es:"Países Bajos",ar:"هولندا"}},
  {code:"+32",flag:"be",n:{tr:"Belçika",en:"Belgium",de:"Belgien",ru:"Бельгия",zh:"比利时",hi:"बेल्जियम",nl:"België",es:"Bélgica",ar:"بلجيكا"}},
  {code:"+41",flag:"ch",n:{tr:"İsviçre",en:"Switzerland",de:"Schweiz",ru:"Швейцария",zh:"瑞士",hi:"स्विट्ज़रलैंड",nl:"Zwitserland",es:"Suiza",ar:"سويسرا"}},
  {code:"+43",flag:"at",n:{tr:"Avusturya",en:"Austria",de:"Österreich",ru:"Австрия",zh:"奥地利",hi:"ऑस्ट्रिया",nl:"Oostenrijk",es:"Austria",ar:"النمسا"}},
  {code:"+45",flag:"dk",n:{tr:"Danimarka",en:"Denmark",de:"Dänemark",ru:"Дания",zh:"丹麦",hi:"डेनमार्क",nl:"Denemarken",es:"Dinamarca",ar:"الدنمارك"}},
  {code:"+46",flag:"se",n:{tr:"İsveç",en:"Sweden",de:"Schweden",ru:"Швеция",zh:"瑞典",hi:"स्वीडन",nl:"Zweden",es:"Suecia",ar:"السويد"}},
  {code:"+47",flag:"no",n:{tr:"Norveç",en:"Norway",de:"Norwegen",ru:"Норвегия",zh:"挪威",hi:"नॉर्वे",nl:"Noorwegen",es:"Noruega",ar:"النرويج"}},
  {code:"+358",flag:"fi",n:{tr:"Finlandiya",en:"Finland",de:"Finnland",ru:"Финляндия",zh:"芬兰",hi:"फ़िनलैंड",nl:"Finland",es:"Finlandia",ar:"فنلندا"}},
  {code:"+353",flag:"ie",n:{tr:"İrlanda",en:"Ireland",de:"Irland",ru:"Ирландия",zh:"爱尔兰",hi:"आयरलैंड",nl:"Ierland",es:"Irlanda",ar:"أيرلندا"}},
  {code:"+351",flag:"pt",n:{tr:"Portekiz",en:"Portugal",de:"Portugal",ru:"Португалия",zh:"葡萄牙",hi:"पुर्तगाल",nl:"Portugal",es:"Portugal",ar:"البرتغال"}},
  {code:"+30",flag:"gr",n:{tr:"Yunanistan",en:"Greece",de:"Griechenland",ru:"Греция",zh:"希腊",hi:"ग्रीस",nl:"Griekenland",es:"Grecia",ar:"اليونان"}},
  {code:"+48",flag:"pl",n:{tr:"Polonya",en:"Poland",de:"Polen",ru:"Польша",zh:"波兰",hi:"पोलैंड",nl:"Polen",es:"Polonia",ar:"بولندا"}},
  {code:"+420",flag:"cz",n:{tr:"Çekya",en:"Czechia",de:"Tschechien",ru:"Чехия",zh:"捷克",hi:"चेकिया",nl:"Tsjechië",es:"Chequia",ar:"التشيك"}},
  {code:"+421",flag:"sk",n:{tr:"Slovakya",en:"Slovakia",de:"Slowakei",ru:"Словакия",zh:"斯洛伐克",hi:"स्लोवाकिया",nl:"Slowakije",es:"Eslovaquia",ar:"سلوفاكيا"}},
  {code:"+36",flag:"hu",n:{tr:"Macaristan",en:"Hungary",de:"Ungarn",ru:"Венгрия",zh:"匈牙利",hi:"हंगरी",nl:"Hongarije",es:"Hungría",ar:"المجر"}},
  {code:"+40",flag:"ro",n:{tr:"Romanya",en:"Romania",de:"Rumänien",ru:"Румыния",zh:"罗马尼亚",hi:"रोमानिया",nl:"Roemenië",es:"Rumania",ar:"رومانيا"}},
  {code:"+359",flag:"bg",n:{tr:"Bulgaristan",en:"Bulgaria",de:"Bulgarien",ru:"Болгария",zh:"保加利亚",hi:"बुल्गारिया",nl:"Bulgarije",es:"Bulgaria",ar:"بلغاريا"}},
  {code:"+7",flag:"ru",n:{tr:"Rusya",en:"Russia",de:"Russland",ru:"Россия",zh:"俄罗斯",hi:"रूस",nl:"Rusland",es:"Rusia",ar:"روسيا"}},
  {code:"+380",flag:"ua",n:{tr:"Ukrayna",en:"Ukraine",de:"Ukraine",ru:"Украина",zh:"乌克兰",hi:"यूक्रेन",nl:"Oekraïne",es:"Ucrania",ar:"أوكرانيا"}},
  {code:"+86",flag:"cn",n:{tr:"Çin",en:"China",de:"China",ru:"Китай",zh:"中国",hi:"चीन",nl:"China",es:"China",ar:"الصين"}},
  {code:"+81",flag:"jp",n:{tr:"Japonya",en:"Japan",de:"Japan",ru:"Япония",zh:"日本",hi:"जापान",nl:"Japan",es:"Japón",ar:"اليابان"}},
  {code:"+82",flag:"kr",n:{tr:"G. Kore",en:"S. Korea",de:"Südkorea",ru:"Ю. Корея",zh:"韩国",hi:"द. कोरिया",nl:"Z. Korea",es:"Corea del Sur",ar:"كوريا"}},
  {code:"+91",flag:"in",n:{tr:"Hindistan",en:"India",de:"Indien",ru:"Индия",zh:"印度",hi:"भारत",nl:"India",es:"India",ar:"الهند"}},
  {code:"+92",flag:"pk",n:{tr:"Pakistan",en:"Pakistan",de:"Pakistan",ru:"Пакистан",zh:"巴基斯坦",hi:"पाकिस्तान",nl:"Pakistan",es:"Pakistán",ar:"باكستان"}},
  {code:"+880",flag:"bd",n:{tr:"Bangladeş",en:"Bangladesh",de:"Bangladesch",ru:"Бангладеш",zh:"孟加拉",hi:"बांग्लादेश",nl:"Bangladesh",es:"Bangladés",ar:"بنغلاديش"}},
  {code:"+62",flag:"id",n:{tr:"Endonezya",en:"Indonesia",de:"Indonesien",ru:"Индонезия",zh:"印尼",hi:"इंडोनेशिया",nl:"Indonesië",es:"Indonesia",ar:"إندونيسيا"}},
  {code:"+60",flag:"my",n:{tr:"Malezya",en:"Malaysia",de:"Malaysia",ru:"Малайзия",zh:"马来西亚",hi:"मलेशिया",nl:"Maleisië",es:"Malasia",ar:"ماليزيا"}},
  {code:"+65",flag:"sg",n:{tr:"Singapur",en:"Singapore",de:"Singapur",ru:"Сингапур",zh:"新加坡",hi:"सिंगापुर",nl:"Singapore",es:"Singapur",ar:"سنغافورة"}},
  {code:"+66",flag:"th",n:{tr:"Tayland",en:"Thailand",de:"Thailand",ru:"Таиланд",zh:"泰国",hi:"थाईलैंड",nl:"Thailand",es:"Tailandia",ar:"تايلاند"}},
  {code:"+84",flag:"vn",n:{tr:"Vietnam",en:"Vietnam",de:"Vietnam",ru:"Вьетнам",zh:"越南",hi:"वियतनाम",nl:"Vietnam",es:"Vietnam",ar:"فيتنام"}},
  {code:"+63",flag:"ph",n:{tr:"Filipinler",en:"Philippines",de:"Philippinen",ru:"Филиппины",zh:"菲律宾",hi:"फ़िलीपींस",nl:"Filipijnen",es:"Filipinas",ar:"الفلبين"}},
  {code:"+61",flag:"au",n:{tr:"Avustralya",en:"Australia",de:"Australien",ru:"Австралия",zh:"澳大利亚",hi:"ऑस्ट्रेलिया",nl:"Australië",es:"Australia",ar:"أستراليا"}},
  {code:"+64",flag:"nz",n:{tr:"Y. Zelanda",en:"New Zealand",de:"Neuseeland",ru:"Н. Зеландия",zh:"新西兰",hi:"न्यूज़ीलैंड",nl:"N. Zeeland",es:"N. Zelanda",ar:"نيوزيلندا"}},
  {code:"+966",flag:"sa",n:{tr:"S. Arabistan",en:"Saudi Arabia",de:"Saudi-Arabien",ru:"С. Аравия",zh:"沙特",hi:"सऊदी",nl:"Saoedi-Arabië",es:"Arabia Saudí",ar:"السعودية"}},
  {code:"+971",flag:"ae",n:{tr:"BAE",en:"UAE",de:"VAE",ru:"ОАЭ",zh:"阿联酋",hi:"यूएई",nl:"VAE",es:"EAU",ar:"الإمارات"}},
  {code:"+974",flag:"qa",n:{tr:"Katar",en:"Qatar",de:"Katar",ru:"Катар",zh:"卡塔尔",hi:"कतर",nl:"Qatar",es:"Catar",ar:"قطر"}},
  {code:"+965",flag:"kw",n:{tr:"Kuveyt",en:"Kuwait",de:"Kuwait",ru:"Кувейт",zh:"科威特",hi:"कुवैत",nl:"Koeweit",es:"Kuwait",ar:"الكويت"}},
  {code:"+973",flag:"bh",n:{tr:"Bahreyn",en:"Bahrain",de:"Bahrain",ru:"Бахрейн",zh:"巴林",hi:"बहरीन",nl:"Bahrein",es:"Baréin",ar:"البحرين"}},
  {code:"+968",flag:"om",n:{tr:"Umman",en:"Oman",de:"Oman",ru:"Оман",zh:"阿曼",hi:"ओमान",nl:"Oman",es:"Omán",ar:"عُمان"}},
  {code:"+98",flag:"ir",n:{tr:"İran",en:"Iran",de:"Iran",ru:"Иран",zh:"伊朗",hi:"ईरान",nl:"Iran",es:"Irán",ar:"إيران"}},
  {code:"+964",flag:"iq",n:{tr:"Irak",en:"Iraq",de:"Irak",ru:"Ирак",zh:"伊拉克",hi:"इराक़",nl:"Irak",es:"Irak",ar:"العراق"}},
  {code:"+972",flag:"il",n:{tr:"İsrail",en:"Israel",de:"Israel",ru:"Израиль",zh:"以色列",hi:"इज़राइल",nl:"Israël",es:"Israel",ar:"إسرائيل"}},
  {code:"+962",flag:"jo",n:{tr:"Ürdün",en:"Jordan",de:"Jordanien",ru:"Иордания",zh:"约旦",hi:"जॉर्डन",nl:"Jordanië",es:"Jordania",ar:"الأردن"}},
  {code:"+961",flag:"lb",n:{tr:"Lübnan",en:"Lebanon",de:"Libanon",ru:"Ливан",zh:"黎巴嫩",hi:"लेबनान",nl:"Libanon",es:"Líbano",ar:"لبنان"}},
  {code:"+963",flag:"sy",n:{tr:"Suriye",en:"Syria",de:"Syrien",ru:"Сирия",zh:"叙利亚",hi:"सीरिया",nl:"Syrië",es:"Siria",ar:"سوريا"}},
  {code:"+994",flag:"az",n:{tr:"Azerbaycan",en:"Azerbaijan",de:"Aserbaidschan",ru:"Азербайджан",zh:"阿塞拜疆",hi:"अज़रबैजान",nl:"Azerbeidzjan",es:"Azerbaiyán",ar:"أذربيجان"}},
  {code:"+995",flag:"ge",n:{tr:"Gürcistan",en:"Georgia",de:"Georgien",ru:"Грузия",zh:"格鲁吉亚",hi:"जॉर्जिया",nl:"Georgië",es:"Georgia",ar:"جورجيا"}},
  {code:"+374",flag:"am",n:{tr:"Ermenistan",en:"Armenia",de:"Armenien",ru:"Армения",zh:"亚美尼亚",hi:"आर्मेनिया",nl:"Armenië",es:"Armenia",ar:"أرمينيا"}},
  {code:"+20",flag:"eg",n:{tr:"Mısır",en:"Egypt",de:"Ägypten",ru:"Египет",zh:"埃及",hi:"मिस्र",nl:"Egypte",es:"Egipto",ar:"مصر"}},
  {code:"+212",flag:"ma",n:{tr:"Fas",en:"Morocco",de:"Marokko",ru:"Марокко",zh:"摩洛哥",hi:"मोरक्को",nl:"Marokko",es:"Marruecos",ar:"المغرب"}},
  {code:"+216",flag:"tn",n:{tr:"Tunus",en:"Tunisia",de:"Tunesien",ru:"Тунис",zh:"突尼斯",hi:"ट्यूनीशिया",nl:"Tunesië",es:"Túnez",ar:"تونس"}},
  {code:"+213",flag:"dz",n:{tr:"Cezayir",en:"Algeria",de:"Algerien",ru:"Алжир",zh:"阿尔及利亚",hi:"अल्जीरिया",nl:"Algerije",es:"Argelia",ar:"الجزائر"}},
  {code:"+234",flag:"ng",n:{tr:"Nijerya",en:"Nigeria",de:"Nigeria",ru:"Нигерия",zh:"尼日利亚",hi:"नाइजीरिया",nl:"Nigeria",es:"Nigeria",ar:"نيجيريا"}},
  {code:"+254",flag:"ke",n:{tr:"Kenya",en:"Kenya",de:"Kenia",ru:"Кения",zh:"肯尼亚",hi:"केन्या",nl:"Kenia",es:"Kenia",ar:"كينيا"}},
  {code:"+27",flag:"za",n:{tr:"G. Afrika",en:"S. Africa",de:"Südafrika",ru:"ЮАР",zh:"南非",hi:"द. अफ्रीका",nl:"Zuid-Afrika",es:"Sudáfrica",ar:"جنوب أفريقيا"}},
  {code:"+52",flag:"mx",n:{tr:"Meksika",en:"Mexico",de:"Mexiko",ru:"Мексика",zh:"墨西哥",hi:"मेक्सिको",nl:"Mexico",es:"México",ar:"المكسيك"}},
  {code:"+55",flag:"br",n:{tr:"Brezilya",en:"Brazil",de:"Brasilien",ru:"Бразилия",zh:"巴西",hi:"ब्राज़ील",nl:"Brazilië",es:"Brasil",ar:"البرازيل"}},
  {code:"+54",flag:"ag",n:{tr:"Arjantin",en:"Argentina",de:"Argentinien",ru:"Аргентина",zh:"阿根廷",hi:"अर्जेंटीना",nl:"Argentinië",es:"Argentina",ar:"الأرجنتين"}},
  {code:"+56",flag:"cl",n:{tr:"Şili",en:"Chile",de:"Chile",ru:"Чили",zh:"智利",hi:"चिली",nl:"Chili",es:"Chile",ar:"تشيلي"}},
  {code:"+57",flag:"co",n:{tr:"Kolombiya",en:"Colombia",de:"Kolumbien",ru:"Колумбия",zh:"哥伦比亚",hi:"कोलंबिया",nl:"Colombia",es:"Colombia",ar:"كولومبيا"}},
  {code:"+51",flag:"pe",n:{tr:"Peru",en:"Peru",de:"Peru",ru:"Перу",zh:"秘鲁",hi:"पेरू",nl:"Peru",es:"Perú",ar:"بيرو"}}];
const[newC,setNewC]=useState({name:"",phone:"",countryCode:"+90",category:"doctor",note:""});
const EMPTY_C={name:"",phone:"",countryCode:"+90",category:"doctor",note:""};
const cDraftIdRef=useRef(null);
useEffect(()=>{if(!showAddC){cDraftIdRef.current=null;return;}const ok=(newC.name||"").trim()&&(newC.phone||"").trim();const it=()=>({name:newC.name,phone:newC.countryCode+" "+newC.phone,category:newC.category,note:newC.note});if(editContactId){setContacts(p=>p.map(x=>x.id===editContactId?{...x,...it()}:x));return;}if(ok){if(cDraftIdRef.current==null){const id=Date.now();cDraftIdRef.current=id;setContacts(p=>[...p,{id,...it()}]);}else{setContacts(p=>p.map(x=>x.id===cDraftIdRef.current?{...x,...it(),id:x.id}:x));}}else if(cDraftIdRef.current!=null){const id=cDraftIdRef.current;cDraftIdRef.current=null;setContacts(p=>p.filter(x=>x.id!==id));}},[newC,editContactId,showAddC]);

// Community
const[msgs,setMsgs]=useState([{id:1,user:"Hasta_42",text:"Merhaba herkese! 👋",likes:3,time:"10:30"}]);
const[reportedMsgs,setReportedMsgs]=useState([]);
const[blockedUsers,setBlockedUsers]=useState([]);
const[msgIn,setMsgIn]=useState("");
const[groups,setGroups]=useState([]);
const[commSearch,setCommSearch]=useState("");
const[commFilter,setCommFilter]=useState("all");
const[profanityFilter,setProfanityFilter]=useState(function(){try{return localStorage.getItem("ailvie_profanity")!=="0";}catch(e){return true;}});
useEffect(()=>{try{localStorage.setItem("ailvie_profanity",profanityFilter?"1":"0");}catch(e){}},[profanityFilter]);
const[showGroupModal,setShowGroupModal]=useState(false);
const[newGroup,setNewGroup]=useState({name:"",emoji:"👥",members:[]});
const[callModal,setCallModal]=useState(null); // {type,group,status:'requesting'|'ready'|'denied'}

// Chat
const[chatM,setChatM]=useState([]);
// AI memory: distilled, durable facts about the person — NOT the raw chat log. The full log is
// already persisted in chatM, but only the last 10 turns are sent to the model, so anything older
// is effectively forgotten. These items are captured via a [[HAFIZA:...]] token in the reply (no
// extra API call) and re-injected into the system prompt, which is what lets the assistant actually
// know the person over months. Kept on-device with the rest of the encrypted payload; the user can
// read and delete every item (Settings), because a health assistant remembering things about you
// silently is exactly the wrong kind of surprise.
const[aiMem,setAiMem]=useState([]);
const[memOn,setMemOn]=useState(()=>{try{return localStorage.getItem("ailvie_mem_off")!=="1";}catch(e){return true;}});
const MEM_CAP=40;
const[chatSearch,setChatSearch]=useState("");
const[chatIn,setChatIn]=useState("");
const[chatL,setChatL]=useState(false);
const[chatNudgeOff,setChatNudgeOff]=useState(false); // gentle overdue-med reminder dismissed for this session
// Auto-scroll chat to bottom when new messages arrive
useEffect(()=>{if(chatEndRef.current)chatEndRef.current.scrollIntoView({behavior:"smooth",block:"end"});},[chatM,chatL]);

// Emergency
// Emergency services are country-aware: a hardcoded list would send someone in the US to dial 112
// instead of 911. Fixed entries are derived from the detected country; user-added ones are kept.
const[ctry,setCtry]=useState(()=>{try{return localStorage.getItem("ailvie_country")||"";}catch(e){return "";}});
const emgNum=emgFor(ctry);
const poisonNum=poisonFor(ctry);
const[emNums,setEmNums]=useState(()=>{
  let c="";try{c=localStorage.getItem("ailvie_country")||"";}catch(e){}
  return servicesFor(c);
});
// Detect country once (IP-based, already allowlisted in CSP) so emergency numbers are correct.
useEffect(()=>{
  if(ctry)return;
  let done=false;
  const set=(cc)=>{if(done||!cc)return;done=true;const v=String(cc).toUpperCase();try{localStorage.setItem("ailvie_country",v);}catch(e){}setCtry(v);};
  fetch("https://ipwho.is/").then(r=>r.ok?r.json():null).then(j=>{if(j&&j.country_code)set(j.country_code);else throw 0;})
    .catch(()=>{fetch("https://get.geojs.io/v1/ip/geo.json").then(r=>r.ok?r.json():null).then(j=>{if(j&&j.country_code)set(j.country_code);}).catch(()=>{});});
},[ctry]);
// Re-sync the fixed services when the country becomes known; keep user-added entries untouched.
useEffect(()=>{
  if(!ctry)return;
  setEmNums(p=>{
    const fresh=servicesFor(ctry);
    const custom=(p||[]).filter(x=>!x.fixed);
    const same=(p||[]).filter(x=>x.fixed).map(x=>x.number).join(",")===fresh.map(x=>x.number).join(",");
    if(same&&(p||[]).filter(x=>x.fixed).every(x=>x.k))return p;
    return [...fresh,...custom];
  });
},[ctry]);
const emLabel=(en)=>en&&en.k?(lang==="tr"?(EMG_LABELS_TR[en.k]||en.k):TL(en.k,lang)):((en&&en.name)||"");
const[newEm,setNewEm]=useState({name:"",number:""});

// Trash
const[trashItems,setTrashItems]=useState([]);
const[trashDays,setTrashDays]=useState(30);

const bmi=hd.weight>0&&hd.height>0?(hd.weight/((hd.height/100)**2)).toFixed(1):0;
// Risk factors from patient history
const allergyCount=(pat.allergies||"").split(/[;]/).filter(x=>x.trim()).length;
const chronicCount=(pat.chronic||"").split(/[;]/).filter(x=>x.trim()).length;
const medsCount=new Set(meds.map(m=>m.name?.trim().toLowerCase()).filter(Boolean)).size;
const recordsCount=records.length;
// Risk penalty: each chronic -3, each allergy -1 (max -15)
const riskPenalty=Math.min(15,chronicCount*3+allergyCount*1);
// Wellness bonus: water/sleep/steps
const wellnessBonus=(()=>{
  let b=0;
  if(wellness.water>=wellness.waterGoal*0.8)b+=3;
  if(wellness.sleep>=7&&wellness.sleep<=9)b+=3;
  if(wellness.steps>=wellness.stepsGoal*0.8)b+=3;
  if(wellness.mood>=4)b+=2;
  if(wellness.exercise>=30)b+=2;
  return Math.min(13,b);
})();
const hscore=(hd.pulse===0&&hd.weight===0&&!pat.birthDate)?0:Math.max(0,Math.min(100,Math.round(
(hd.pulse>=60&&hd.pulse<=100?25:hd.pulse>=50&&hd.pulse<=110?12:hd.pulse>0?5:0)+
(bmi>=18.5&&bmi<25?22:bmi>=17&&bmi<30?10:bmi>0?5:0)+
(hd.bpS>=90&&hd.bpS<=120&&hd.bpD>=60&&hd.bpD<=80?25:hd.bpS>=85&&hd.bpS<=140&&hd.bpD>=55&&hd.bpD<=90?12:hd.bpS>0?5:0)+
(medProg>=80?15:medProg>50?10:medProg>0?5:0)+
wellnessBonus-
riskPenalty
)));

// ═══ AUTO-SAVE/LOAD ═══
useEffect(()=>{(async()=>{
  let raw=null;
  const r=await idbGetSafe("ailvie_data");
  if(!r.ok){
    // Read failed (corrupt DB, private mode, quota). Loading "empty" here would let autosave
    // overwrite good data on disk. Freeze writes instead and tell the user.
    setStorageWarn(lang==="tr"
      ?"⚠️ Veriler okunamadı. Güvenlik için kayıt durduruldu — verileriniz silinmedi. Uygulamayı yeniden başlatın."
      :"⚠️ Could not read your data. Saving is paused; nothing was deleted.");
    return; // dataLoadedRef stays false -> autosave never runs
  }
  raw=r.value;
  if(raw==null){try{raw=localStorage.getItem("ailvie_data");if(raw)await idbSet("ailvie_data",raw);}catch(e){}} // one-time migration
  requestPersistentStorage().then(ok=>setPersisted(!!ok));
  let payload;
  try{payload=await unpackData(raw);}
  catch(e){ if(e&&e.code==="locked"){pendingEncRef.current=raw;return;} setStorageWarn(lang==="tr"?"⚠️ Veriler çözülemedi. Güvenlik için kayıt durduruldu — verileriniz silinmedi.":TL("⚠️ Could not decrypt your data. Saving paused; nothing was deleted.",lang));return; }
  latestPayloadRef.current=payload||"{}";
  try{const d=JSON.parse(payload||"{}");
if(d.meds?.length)setMeds(d.meds);if(d.appts?.length)setAppts(d.appts);if(d.notes?.length)setNotes(d.notes);
if(d.contacts?.length)setContacts(d.contacts);if(d.pat)setPat(p=>({...p,...d.pat}));if(d.hd)setHd(p=>({...p,...d.hd}));if(d.wellness)setWellness(p=>({...p,...d.wellness}));if(d.diet)setDiet(p=>({...p,...d.diet}));if(Array.isArray(d.glucose))setGlucose(d.glucose);if(Array.isArray(d.healthLog))setHealthLog(d.healthLog);if(Array.isArray(d.labs))setLabs(d.labs);if(d.goals)setGoals(p=>({...p,...d.goals}));if(d.tests)setTests(d.tests);if(d.trashDays)setTrashDays(d.trashDays);if(Array.isArray(d.trashItems))setTrashItems(d.trashItems);if(d.draftMed)setNewMed(v=>({...v,...d.draftMed}));if(d.draftAppt)setNewAppt(v=>({...v,...d.draftAppt}));if(d.draftContact)setNewC(v=>({...v,...d.draftContact}));if(d.draftRec)setNewRec(v=>({...v,...d.draftRec}));if(d.records?.length)setRecords(d.records);if(d.msgs?.length)setMsgs(d.msgs);if(Array.isArray(d.reportedMsgs))setReportedMsgs(d.reportedMsgs);if(Array.isArray(d.blockedUsers))setBlockedUsers(d.blockedUsers);if(d.chatM?.length)setChatM(d.chatM);if(Array.isArray(d.aiMem))setAiMem(d.aiMem);if(d.dialysis&&typeof d.dialysis==="object")setDialysis(d.dialysis);
if(d.calNotes)setCalNotes(d.calNotes);if(d.calAlarms)setCalAlarms(d.calAlarms);if(d.moodLog?.length)setMoodLog(d.moodLog);if(d.groups?.length)setGroups(d.groups);
  }catch(e){}
  dataLoadedRef.current=true;
})();},[]); // load once (IndexedDB primary)
useEffect(()=>{if(!dataLoadedRef.current)return;const tm=setTimeout(()=>{const payload=JSON.stringify({meds,appts,notes,contacts,pat,hd,wellness,tests,calNotes,calAlarms,records,msgs,chatM,aiMem,dialysis,moodLog,groups,draftMed:newMed,draftAppt:newAppt,draftContact:newC,draftRec:newRec,trashItems,trashDays,diet,glucose,healthLog,goals,reportedMsgs,blockedUsers,labs});
  (async()=>{
    // GUARD (first write after startup only): a load bug could leave state empty and the
    // very next autosave would wipe good data on disk. Later writes are genuine user edits
    // (including "delete everything"), so the guard must not block them.
    try{
      if(firstWriteRef.current){
      const isEmpty=(o)=>!o||(!((o.notes||[]).length)&&!((o.meds||[]).length)&&!((o.appts||[]).length)
        &&!((o.labs||[]).length)&&!((o.contacts||[]).length)&&!((o.healthLog||[]).length)
        &&!((o.glucose||[]).length)&&!(o.pat&&(o.pat.name||o.pat.birthDate)));
        const next=JSON.parse(payload);
        if(isEmpty(next)){
          const prevRaw=await idbGet("ailvie_data");
          let prevPayload=null,prevUnknown=false;
          if(prevRaw){try{prevPayload=await unpackData(prevRaw);}catch(e){prevUnknown=true;}}
          if(prevRaw&&(prevUnknown||(prevPayload&&!isEmpty(JSON.parse(prevPayload))))){
            setStorageWarn(lang==="tr"
              ?"⚠️ Beklenmeyen boş kayıt engellendi — verileriniz korundu."
              :"⚠️ Blocked an unexpected empty write; your data is intact.");
            return;
          }
        }
      }
    }catch(e){}
    firstWriteRef.current=false;
    latestPayloadRef.current=payload;
    let idbOk=false;
    let toStore;
    try{toStore=await packData(payload);}
    catch(e){ setStorageWarn(lang==="tr"?"⚠️ Şifreleme hatası — bu değişiklik henüz diske yazılmadı, tekrar denenecek.":TL("⚠️ Encryption error — change not written yet; will retry.",lang));return; }
    try{
      // keep one previous revision so a bad write is recoverable
      const prev=await idbGet("ailvie_data");
      if(prev&&prev!==toStore)await idbSet("ailvie_data_prev",prev).catch(()=>{});
    }catch(e){}
    try{await idbSet("ailvie_data",toStore);idbOk=true;setStorageWarn(null);}catch(e){idbOk=false;}
    try{localStorage.setItem("ailvie_data",toStore);}catch(e){ if(!idbOk){ setStorageWarn(lang==="tr"?"⚠️ Cihaz depolaması dolu — yeni kayıtlar SAKLANAMIYOR. Ayarlar > Yedekle ile verilerinizi dışa aktarın.":TL("⚠️ Device storage full — new data is NOT being saved. Export a backup.",lang)); } }
    if(!idbOk){
      try{localStorage.getItem("ailvie_data");}catch(e){}
    }
  })();},1000);return()=>clearTimeout(tm);},[meds,appts,notes,contacts,pat,hd,wellness,tests,calNotes,calAlarms,records,msgs,chatM,aiMem,dialysis,moodLog,groups,newMed,newAppt,newC,newRec,trashItems,trashDays,diet,glucose,healthLog,goals,reportedMsgs,blockedUsers,labs,lang]); // enhanced auto-save (IndexedDB primary) (incl. drafts + trash + diet/glucose/log/goals)
useEffect(()=>{(async()=>{let raw=null;try{raw=await idbGet("ailvie_medimg");}catch(e){}
  if(raw==null){try{raw=localStorage.getItem("ailvie_medimg");if(raw)await idbSet("ailvie_medimg",raw);}catch(e){}}
  try{if(raw){const a=JSON.parse(raw);if(Array.isArray(a))setMedImages(a);}}catch(e){}})();},[]);
useEffect(()=>{const tm=setTimeout(()=>{const p=JSON.stringify(medImages);(async()=>{let ok=false;try{await idbSet("ailvie_medimg",p);ok=true;}catch(e){}
    try{localStorage.setItem("ailvie_medimg",p);}catch(e){if(!ok)setStorageWarn(lang==="tr"?"⚠️ Depolama dolu — görüntüler saklanamıyor. Yedek alın veya eski görüntüleri silin.":TL("⚠️ Storage full — images not saved.",lang));}})();},800);return()=>clearTimeout(tm);},[medImages]);
// Auto-cleanup empty notes that are not being edited
useEffect(()=>{
  // DATA-LOSS GUARD: never prune before noteMedia has loaded from IndexedDB,
  // otherwise a drawing/photo/audio-only note looks "empty" and gets deleted.
  if(!noteMediaLoadedRef.current)return;
  const tm=setTimeout(()=>{setNotes(p=>{
    const filtered=p.filter(n=>(
      n.title?.trim()||
      (n.content||"").replace(/<[^>]+>/g,"").trim()||
      (n.checklist&&n.checklist.some(i=>(i.text||"").trim()))||
      ((noteMedia[n.id]||[]).length>0)||
      (n.labels&&n.labels.length>0)||
      editNote===n.id
    ));
    return filtered.length===p.length?p:filtered;
  });},3000);
  return()=>clearTimeout(tm);
},[notes,editNote,noteMedia]);

// ═══ DATA BACKUP (export/import) — local file, no cloud needed ═══
const exportData=async()=>{
  const L=lang==="tr";
  try{
    // Read from IndexedDB (primary store), fall back to localStorage
    let data=null,medimg=null,notemedia=null;
    try{data=await idbGet("ailvie_data");}catch(e){}
    if(data==null)data=localStorage.getItem("ailvie_data")||"{}";
    try{medimg=await idbGet("ailvie_medimg");}catch(e){}
    if(medimg==null)medimg=localStorage.getItem("ailvie_medimg")||null;
    try{notemedia=await idbGet("ailvie_notemedia");}catch(e){}
    if(notemedia==null)notemedia=localStorage.getItem("ailvie_notemedia")||null;
    const payload={ailvie_data:data,ailvie_medimg:medimg,ailvie_notemedia:notemedia,
      ailvie_account_email:localStorage.getItem("ailvie_account_email")||"",
      ailvie_lang:localStorage.getItem("ailvie_lang")||"",
      ailvie_perms:localStorage.getItem("ailvie_perms")||""};
    const pw=window.prompt(L?"Yedeğinizi şifrelemek için bir parola girin.\n\nSağlık verileriniz bu parolayla AES-256 ile şifrelenir. Parolayı kaybederseniz yedek AÇILAMAZ.\n\n(Boş bırakırsanız ŞİFRESİZ yedek alınır — önerilmez)":"Enter a password to encrypt your backup (AES-256). If you lose it, the backup cannot be opened.\n\n(Leave empty for an UNENCRYPTED backup — not recommended)","");
    if(pw===null)return; // cancelled
    let env,fname;
    if(pw.trim().length>0){
      if(pw.trim().length<8){notify(L?"Parola en az 8 karakter olmalı.":"Password must be at least 8 characters.");return;}
      env=await encryptJSON(payload,pw.trim());
      fname="ailvie-yedek-sifreli-"+new Date().toISOString().slice(0,10)+".json";
    }else{
      if(!window.confirm(L?"⚠️ ŞİFRESİZ yedek: sağlık verileriniz dosyada düz metin olarak durur. Devam edilsin mi?":"⚠️ Unencrypted backup: your health data will be plain text. Continue?"))return;
      env={app:"AILVIE",format:"ailvie-plain-backup",version:2,exportedAt:new Date().toISOString(),data:payload};
      fname="ailvie-yedek-"+new Date().toISOString().slice(0,10)+".json";
    }
    const blob=new Blob([JSON.stringify(env,null,2)],{type:"application/json"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");a.href=url;a.download=fname;
    document.body.appendChild(a);a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
    try{localStorage.setItem("ailvie_last_backup",String(Date.now()));}catch(e){}
    setLastBackup(Date.now());
    notify(pw.trim()?(L?"✅ Şifreli yedek indirildi":"✅ Encrypted backup downloaded"):(L?"✅ Yedek indirildi (şifresiz)":"✅ Backup downloaded (unencrypted)"));
  }catch(e){notify(L?"Yedekleme başarısız":"Backup failed");}
};
const importData=async(file)=>{
  const L=lang==="tr";
  if(!file)return;
  try{
    const env=JSON.parse(await file.text());
    if(!env||env.app!=="AILVIE"){notify(L?"Geçersiz yedek dosyası":"Invalid backup file");return;}
    let payload=null;
    if(env.format==="ailvie-encrypted-backup"||env.ciphertext){
      const pw=window.prompt(L?"Bu yedek şifreli. Parolayı girin:":"This backup is encrypted. Enter the password:","");
      if(pw===null)return;
      try{payload=await decryptJSON(env,pw);}
      catch(e){notify(L?"❌ Parola yanlış veya dosya bozuk — geri yükleme yapılmadı.":"❌ Wrong password or corrupt file.");return;}
    }else if(env.data){payload=env.data;}
    else{notify(L?"Geçersiz yedek dosyası":"Invalid backup file");return;}
    if(!window.confirm(L?"Mevcut verileriniz bu yedekle DEĞİŞTİRİLECEK. Devam edilsin mi?":"Your current data will be REPLACED. Continue?"))return;
    if(typeof payload.ailvie_data==="string"){try{await idbSet("ailvie_data",payload.ailvie_data);}catch(e){}try{localStorage.setItem("ailvie_data",payload.ailvie_data);}catch(e){}}
    if(typeof payload.ailvie_medimg==="string"){try{await idbSet("ailvie_medimg",payload.ailvie_medimg);}catch(e){}}
    if(typeof payload.ailvie_notemedia==="string"){try{await idbSet("ailvie_notemedia",payload.ailvie_notemedia);}catch(e){}try{localStorage.setItem("ailvie_notemedia",payload.ailvie_notemedia);}catch(e){}}
    if(payload.ailvie_account_email!=null)try{localStorage.setItem("ailvie_account_email",payload.ailvie_account_email);}catch(e){}
    if(payload.ailvie_lang)try{localStorage.setItem("ailvie_lang",payload.ailvie_lang);}catch(e){}
    if(payload.ailvie_perms)try{localStorage.setItem("ailvie_perms",payload.ailvie_perms);}catch(e){}
    notify(L?"✅ Geri yüklendi, yenileniyor...":"✅ Restored, reloading...");
    setTimeout(()=>location.reload(),800);
  }catch(e){notify(L?"Geri yükleme başarısız (dosya bozuk olabilir)":"Restore failed");}
};

// ═══ SIGN-IN (email local; Google/Apple via Firebase when configured) ═══
const signInWith=async(provider)=>{
  if(provider==="email"){
    const v=(emailIn||"").trim();
    const isEmail=/.+@.+\..+/.test(v);
    const isPhone=/^[+\d][\d\s().-]*$/.test(v)&&v.replace(/\D/g,"").length>=7;
    if(!v||!(isEmail||isPhone)){notify(lang==="tr"?"Geçerli bir e-posta veya telefon girin":TL("Enter a valid email or phone",lang));return;}
    setAcctEmail(v);try{localStorage.setItem("ailvie_account_email",v);}catch(e){}
    notify(lang==="tr"?"✅ Giriş yapıldı":TL("✅ Signed in",lang));
    return;
  }
  const hasFb=FIREBASE_CONFIG&&FIREBASE_CONFIG.apiKey;
  if(!hasFb){notify(lang==="tr"?"Google/Apple girişi için Firebase yapılandırması gerekir (yakında).":TL("Google/Apple sign-in needs Firebase configuration (coming soon).",lang));return;}
  try{
    const appMod=await import(/* @vite-ignore */ `https://www.gstatic.com/firebasejs/${FB_VER}/firebase-app.js`);
    const authMod=await import(/* @vite-ignore */ `https://www.gstatic.com/firebasejs/${FB_VER}/firebase-auth.js`);
    const app=appMod.initializeApp(FIREBASE_CONFIG);
    const auth=authMod.getAuth(app);
    const prov=provider==="apple"?new authMod.OAuthProvider("apple.com"):new authMod.GoogleAuthProvider();
    const res=await authMod.signInWithPopup(auth,prov);
    const u=res&&res.user;
    if(u){const em=u.email||"";if(em){setAcctEmail(em);setEmailIn(em);try{localStorage.setItem("ailvie_account_email",em);localStorage.setItem("ailvie_uid",u.uid||"");}catch(e){}}notify(lang==="tr"?"✅ Giriş başarılı: "+(u.displayName||em):"✅ Signed in: "+(u.displayName||em));}
  }catch(e){notify(lang==="tr"?"Giriş iptal edildi veya başarısız oldu.":TL("Sign-in cancelled or failed.",lang));}
};
const signOutAcct=()=>{setAcctEmail("");try{localStorage.removeItem("ailvie_account_email");localStorage.removeItem("ailvie_uid");}catch(e){}notify(lang==="tr"?"Çıkış yapıldı":TL("Signed out",lang));};

const readData=(kind)=>{
  let txt="";
  if(kind==="meds"){
    if(!meds.length)txt=lang==="tr"?"Kayıtlı ilacın yok.":TL("You have no medications.",lang);
    else txt=(lang==="tr"?`${meds.length} ilacın var. `:`You have ${meds.length} medications. `)+meds.slice(0,8).map(m=>`${m.name}${m.time?" "+m.time:""}${m.taken?(lang==="tr"?" alındı":TL(" taken",lang)):""}`).join(", ")+".";
  }else if(kind==="appts"){
    const up=[...appts].filter(a=>a.date).sort((x,y)=>(x.date>y.date?1:-1));
    if(!up.length)txt=lang==="tr"?"Yaklaşan randevun yok.":TL("You have no upcoming appointments.",lang);
    else txt=(lang==="tr"?"Randevuların: ":TL("Your appointments: ",lang))+up.slice(0,3).map(a=>`${a.date}${a.time?" "+a.time:""}${a.doctor?" "+a.doctor:""}${a.hospital?" "+a.hospital:""}`).join("; ")+".";
  }else if(kind==="health"){
    const parts=[];
    if(hd.pulse)parts.push((lang==="tr"?"nabız ":TL("pulse ",lang))+hd.pulse);
    if(hd.bpS&&hd.bpD)parts.push((lang==="tr"?"tansiyon ":TL("blood pressure ",lang))+hd.bpS+"/"+hd.bpD);
    if(hd.weight)parts.push((lang==="tr"?"kilo ":TL("weight ",lang))+hd.weight);
    if(hd.spo2)parts.push("SpO2 "+hd.spo2);
    txt=parts.length?(lang==="tr"?"Sağlık verilerin: ":TL("Your health data: ",lang))+parts.join(", ")+".":(lang==="tr"?"Henüz sağlık verin yok.":TL("No health data yet.",lang));
  }else return;
  setChatM(p=>[...p,{role:"assistant",text:"🔊 "+txt}]);
  try{speak(txt,lang);}catch(e){}
  haptic(12);
};
// Check the mic permission WITHOUT triggering a prompt. Returns "granted" | "denied" | "prompt"
// | "unknown". If already granted we go straight into the dialog with no interruption; the browser
// only shows its own permission dialog the first time (that is the OS/browser, not us).
const micPermission=async()=>{
  try{
    if(navigator.permissions&&navigator.permissions.query){
      const st=await navigator.permissions.query({name:"microphone"});
      return st.state; // granted / denied / prompt
    }
  }catch(e){}
  return "unknown";
};
const startVoiceMode=(greet=true)=>{
  voiceActiveRef.current=true;setVoiceActive(true);   // set the flag FIRST so goTo won't re-trigger us
  if(page!=="chat")goTo("chat");
  // AILVIE speaks IMMEDIATELY (no waiting, no extra prompts). The mic only opens AFTER she has
  // finished the greeting, so she never hears her own voice — that was the "interrupting sound".
  // If the user previously DENIED the mic, don't start a silent dead dialog — say so once.
  micPermission().then(st=>{ if(st==="denied"&&voiceActiveRef.current){ notify("🎤 "+(lang==="tr"?"Mikrofon izni kapalı. Adres çubuğundaki kilit simgesinden açabilirsiniz.":TL("Microphone is blocked. Enable it from the lock icon in the address bar.",lang))); } });
  const beginListening=()=>{setTimeout(()=>{if(voiceActiveRef.current&&!recRef.current&&!isSpeakRef.current)startVoice((txt)=>{sendChat(txt);},true);},250);};
  if(!greet){beginListening();return;}
  const greetings={tr:"Merhaba, ben AILVIE. Sizi dinliyorum.",en:"Hello, I'm AILVIE. I'm listening.",de:"Hallo, ich bin AILVIE. Ich höre zu.",ru:"Здравствуйте, я AILVIE. Я вас слушаю.",zh:"你好，我是 AILVIE。我在听。",hi:"नमस्ते, मैं AILVIE हूँ। मैं सुन रही हूँ।",nl:"Hallo, ik ben AILVIE. Ik luister.",es:"Hola, soy AILVIE. Te escucho.",ar:"مرحبا، أنا AILVIE. أنا أستمع إليك."};
  const greeting=greetings[lang]||greetings.en;
  speak(greeting,lang,beginListening);
};
const stopVoiceMode=()=>{
  setVoiceActive(false);voiceActiveRef.current=false;
  try{speechSynthesis.cancel();}catch(e){}
  try{if(audioRef.current){audioRef.current.pause();audioRef.current=null;}}catch(e){}
  if(recRef.current)try{recRef.current.onend=null;recRef.current.onerror=null;recRef.current.abort();}catch(e){}
  recRef.current=null;setIsListen(false);setIsSpeak(false);setChatThinking(false);
};
const sendChat=async(text)=>{
  const q=text||chatIn;if(!q.trim())return;
  // Offline guard — clear message + retry, without consuming a daily message
  if(typeof navigator!=="undefined"&&!navigator.onLine){
    setChatM(p=>[...p,{role:"user",text:q},{role:"assistant",text:lang==="tr"?"📡 İnternet bağlantısı yok. Bağlantınızı kontrol edip tekrar deneyin.":TL("📡 No internet connection. Check your connection and try again.",lang),error:true,retry:q}]);
    setChatIn("");
    return;
  }
  // AI plan / quota / model routing — automatic cost control + graceful degradation (NO hard wall).
  // Free & Plus run on the cheap model (Haiku); PRO/BYOK get the smart model (Sonnet). When a user
  // passes their monthly quota we silently drop them to Haiku ("continue at free size") — never a
  // hard cutoff. Real spend is capped server-side by the Anthropic spend limit + per-IP cap.
  setChatThinking(true);
  const hasBYOK=apiKey&&apiKey.length>20; // user's own key
  const _plan=(localStorage.getItem("ailvie_active_plan")||"").toLowerCase();
  const aiTier=(_plan.includes("enterprise")||_plan.includes("pro"))?"pro":(_plan.includes("plus")?"plus":"free");
  const AI_QUOTA={free:100,plus:300,pro:1500};
  const _mo=new Date().toISOString().slice(0,7);
  let _u={};try{_u=JSON.parse(localStorage.getItem("ailvie_ai_usage")||"{}");}catch(e){_u={};}
  if(_u.month!==_mo)_u={month:_mo,count:0};
  const _quota=AI_QUOTA[aiTier]||AI_QUOTA.free;
  const overQuota=!hasBYOK&&(_u.count||0)>=_quota;
  const useModel=(!overQuota&&(aiTier==="pro"||hasBYOK))?"claude-sonnet-4-6":"claude-haiku-4-5-20251001";
  let quotaNote="";
  if(!hasBYOK&&_quota){
    const pct=(_u.count||0)/_quota;const _k="ailvie_qn_"+_mo;
    try{if(pct>=0.8&&pct<1&&!sessionStorage.getItem(_k)){sessionStorage.setItem(_k,"1");quotaNote=lang==="tr"?"\n\nBu ayki AI mesajlarının çoğunu kullandın — ay başında otomatik yenilenecek.":"\n\nYou've used most of this month's AI messages — it resets automatically next month.";}}catch(e){}
    _u.count=(_u.count||0)+1;try{localStorage.setItem("ailvie_ai_usage",JSON.stringify(_u));}catch(e){}
  }
  const newMsgs=[...chatM,{role:"user",text:q}];
  setChatM(newMsgs);setChatIn("");setChatL(true);
  try{
    let cx=[];
    const _now=new Date();
    cx.push(`ŞU AN: ${_now.toLocaleString("tr-TR",{weekday:"long",day:"numeric",month:"long",hour:"2-digit",minute:"2-digit"})}`);
    if(pat.name)cx.push(`Hasta adı: ${pat.name}`);
    if(patAge)cx.push(`Yaş: ${patAge}`);
    if(pat.bloodType)cx.push(`Kan grubu: ${pat.bloodType}`);
    if(hd.weight>0&&hd.height>0)cx.push(`BMI: ${bmi}, Kilo: ${hd.weight}kg, Boy: ${hd.height}cm`);
    if(hd.pulse>0)cx.push(`Nabız: ${hd.pulse} bpm`);
    if(hd.hrvRmssd>0)cx.push(`HRV: RMSSD ${hd.hrvRmssd} ms, SDNN ${hd.hrvSdnn} ms`);
    if(hd.resp>0)cx.push(`Solunum: ${hd.resp}/dk (tahmini)`);
    if(hd.bpS>0)cx.push(`Tansiyon: ${hd.bpS}/${hd.bpD}`);
    if(wellness.steps>0)cx.push(`Günlük adım: ${wellness.steps}`);
    if(wellness.sleep>0)cx.push(`Uyku: ${wellness.sleep} saat`);
    if(hd.spo2>0)cx.push(`Kan oksijeni (SpO2): %${hd.spo2}`);
    if(hd.calories>0)cx.push(`Aktif kalori: ${hd.calories} kcal`);
    if(hd.restPulse>0)cx.push(`Dinlenik nabız: ${hd.restPulse} bpm`);
    if(meds.length)cx.push(`Kullandığı ilaçlar: ${meds.map(m=>`${m.name} (${m.dose}, saat ${m.time})`).join("; ")}`);
    if(pat.allergies)cx.push(`Alerjiler: ${pat.allergies}`);
    if(pat.chronic)cx.push(`Kronik hastalıklar: ${pat.chronic}`);
    if(appts.length)cx.push(`Yaklaşan randevular: ${appts.slice(0,3).map(a=>`${a.doctor} - ${a.date}`).join("; ")}`);
    if(records.length)cx.push(`Tıbbi kayıtlar: ${records.slice(0,3).map(r=>`${r.type}: ${r.content?.substring(0,50)}`).join("; ")}`);
    if(moodLog.length){const lbl={1:"çok kötü",2:"kötü",3:"normal",4:"iyi",5:"harika"};const last=moodLog.slice(-5);const recent=moodLog.slice(-3).map(e=>e.mood);const low=recent.length>=3&&recent.every(v=>v<=2);cx.push(`Son ruh hali kayıtları (eskiden yeniye): ${last.map(e=>lbl[e.mood]||e.mood).join(", ")}${low?" — son birkaç gündür sürekli düşük":""}`);}
    if(meds.length){const takenN=meds.filter(m=>m.taken).length;const pend=meds.filter(m=>!m.taken);const nowMin=_now.getHours()*60+_now.getMinutes();const overdue=pend.filter(m=>{const[h,mm]=(m.time||"00:00").split(":").map(Number);return (h*60+mm)<nowMin;});const nextP=pend.filter(m=>{const[h,mm]=(m.time||"00:00").split(":").map(Number);return (h*60+mm)>=nowMin;}).sort((a,b)=>((a.time||"00:00")>(b.time||"00:00")?1:-1))[0];cx.push(`BUGÜNKÜ İLAÇLAR: ${takenN}/${meds.length} alındı, ${pend.length} bekliyor${overdue.length?`; GECİKMİŞ: ${overdue.map(m=>`${m.name} (${m.time})`).join(", ")}`:""}${nextP?`; sıradaki: ${nextP.name} ${nextP.time}`:""}`);}
    {const wp=[];if(wellness.water>0)wp.push(`su ${wellness.water}/${wellness.waterGoal} bardak`);if(wellness.mood>0){const ml={1:"çok kötü",2:"kötü",3:"normal",4:"iyi",5:"harika"};wp.push(`bugünkü ruh hali: ${ml[wellness.mood]}`);}if(wellness.exercise>0)wp.push(`egzersiz ${wellness.exercise} dk`);if(wp.length)cx.push(`BUGÜNKÜ İYİ-OLUŞ: ${wp.join(", ")}`);}
    const ctxStr=cx.length?`\n\nHASTA PROFİLİ:\n${cx.join("\n")}\n`:"Hasta henüz bilgi girmemiş. ";
    // Distilled long-term memory. Without this the model only ever sees the last 10 turns, so
    // anything the person told it last week is gone — this is what makes it know them over time.
    const MEMLBL={kisi:"Kişi",durum:"Durum",iseyaradi:"İşe yarayan",tercih:"Tercih"};
    const memStr=(memOn&&aiMem.length)?`\n\nHAFIZAM (önceki konuşmalardan damıtılmış, kişiyi tanımak için — doğal kullan):\n${aiMem.map(m=>`- [${MEMLBL[m.k]||m.k}] ${m.t}`).join("\n")}\n`:(memOn?"":"\n\n(Hafıza kullanıcı tarafından kapatılmış — geçmişi hatırlamıyorsun, sorulursa dürüstçe söyle.)\n");
    // Clinical roll-up: reads the person's saved labs against published rules (critical values,
    // trends, cross-drug checks) and hands the model a compact, factual summary. It never diagnoses;
    // it surfaces what a clinician would flag so the assistant can point the person at the right
    // question. Only injected when there's something to say.
    let clinStr="";
    try{
      const cs=clinicalSummary(labs,meds,patCtx());
      const parts=[];
      if(cs.criticals.length)parts.push("KRİTİK DEĞERLER (acil, doktora yönlendir): "+cs.criticals.map(c=>`${c.test} ${c.value}${c.unit||""} (${c.level})`).join(", "));
      if(cs.trends.length)parts.push("EĞİLİMLER (yön yargı içermez, teste göre yorumla): "+cs.trends.map(t=>`${t.test} ${t.dir==="up"?"yükseliyor":"düşüyor"} %${Math.abs(t.pct)} (${t.spanDays} günde, ${t.n} ölçüm)`).join(", "));
      if(cs.patterns.length)parts.push("ÖRÜNTÜLER (olası, teşhis değil): "+cs.patterns.map(p=>p.id+(p.caveat?` [uyarı: ${p.caveat}]`:"")+(p.missing?` [eksik: ${p.missing.join(",")}]`:"")).join(", "));
      if(cs.drugChecks.length)parts.push("İLAÇ-TAHLİL KONTROLÜ (doktora sorulacak): "+cs.drugChecks.map(d=>`${d.drug}×${d.test||("eGFR "+d.egfr)} (${d.severity})`).join(", "));
      if(cs.derived.ldlCalc&&cs.derived.ldlCalc.ok)parts.push("HESAPLANAN: LDL ≈ "+cs.derived.ldlCalc.value+" mg/dL (Friedewald)");
      if(cs.derived.fib4&&cs.derived.fib4.ok)parts.push("HESAPLANAN: FIB-4 = "+cs.derived.fib4.value+" ("+(cs.derived.fib4.band==="high"?"ileri karaciğer fibrozu olasılığı yüksek":cs.derived.fib4.band==="low"?"düşük olasılık":"belirsiz aralık")+", karaciğer için; teşhis değil)");
      if(cs.derived.apri&&cs.derived.apri.ok)parts.push("HESAPLANAN: APRI = "+cs.derived.apri.value+" ("+(cs.derived.apri.band==="high"?"siroz olasılığını düşündürebilir":cs.derived.apri.band==="low"?"anlamlı fibroz olası değil":"belirsiz aralık")+", karaciğer fibrozu; FIB-4'ü destekler, yaş gerekmez; teşhis değil)");
      if(cs.derived.globulinAG&&cs.derived.globulinAG.ok)parts.push("HESAPLANAN: A/G oranı = "+cs.derived.globulinAG.agRatio+" (globulin "+cs.derived.globulinAG.globulin+" g/dL; "+(cs.derived.globulinAG.band==="low"?"düşük — kronik iltihap/otoimmün/karaciğer/miyelom düşündürebilir":cs.derived.globulinAG.band==="high"?"yüksek — genelde düşük globulin, ör. dehidratasyon":"normal")+"). Bu bir bayraktır, teşhis değil; albümin ve globulinle birlikte yorumla.");
      if(cs.derived.fena&&cs.derived.fena.ok)parts.push("HESAPLANAN: FENa = "+cs.derived.fena.value+"% ("+(cs.derived.fena.band==="prerenal"?"prerenal örüntü, böbrek sodyumu tutuyor — sıvı kaybı/kalp yetmezliği":cs.derived.fena.band==="intrinsic"?"intrinsik/ATN örüntüsü, tübül hasarı":"belirsiz %1–2")+"). AKI ayrımına yardımcı; "+(cs.derived.fena.caveat==="fena-diuretic-unreliable"?"DİKKAT: idrar söktürücü FENa'yı yanıltıcı yükseltir, güvenilmez olabilir (FEUrea tercih edilebilir). ":"")+"bir ipucudur, teşhis değil; klinikle birlikte yorumla.");
      if(cs.derived.anionGap&&cs.derived.anionGap.ok)parts.push("HESAPLANAN: Anyon açığı = "+cs.derived.anionGap.value+" mmol/L"+(cs.derived.anionGap.corrected!=null?" (albümine göre düzeltilmiş: "+cs.derived.anionGap.corrected+")":""));
      if(cs.derived.correctedCalcium&&cs.derived.correctedCalcium.ok)parts.push("HESAPLANAN: Düzeltilmiş kalsiyum = "+cs.derived.correctedCalcium.value+" mg/dL (albümine göre; kesinlik gerekirse iyonize kalsiyum tercih edilir)");
      if(cs.derived.nonHDL&&cs.derived.nonHDL.ok)parts.push("HESAPLANAN: Non-HDL kolesterol = "+cs.derived.nonHDL.value+" mg/dL (hedef genelde <130)");
      if(cs.derived.bunCrRatio&&cs.derived.bunCrRatio.ok)parts.push("HESAPLANAN: BUN/Kreatinin oranı = "+cs.derived.bunCrRatio.value+" ("+(cs.derived.bunCrRatio.band==="high"?"yüksek, böbrek öncesi düşündürebilir":cs.derived.bunCrRatio.band==="low"?"düşük":"normal")+")");
      if(cs.derived.tsat&&cs.derived.tsat.ok)parts.push("HESAPLANAN: Transferrin satürasyonu (TSAT) = "+cs.derived.tsat.value+"% ("+(cs.derived.tsat.band==="low"?"düşük, demir eksikliği düşündürebilir":cs.derived.tsat.band==="high"?"yüksek, demir yükü düşündürebilir":"normal")+"; ferritinle birlikte oku)");
      if(cs.derived.eag&&cs.derived.eag.ok)parts.push("HESAPLANAN: Tahmini ortalama glukoz (eAG) = "+cs.derived.eag.value+" mg/dL ("+cs.derived.eag.mmol+" mmol/L); HbA1c'nin günlük şeker karşılığı. Gebelikte ve anemi/böbrek hastalığında güvenilmez olabilir.");
      if(cs.derived.osmolality&&cs.derived.osmolality.ok)parts.push("HESAPLANAN: Hesaplanmış osmolalite = "+cs.derived.osmolality.value+" mOsm/kg (normal ~275–295)");
      if(cs.derived.correctedSodium&&cs.derived.correctedSodium.ok)parts.push("HESAPLANAN: Düzeltilmiş sodyum = "+cs.derived.correctedSodium.value+" mmol/L (yüksek şekere göre; ölçülen "+cs.derived.correctedSodium.measured+"; kesin değer değil, tahmindir)");
      try{
        const da=dialysisAdequacy({preBUN:+dialysis.preBUN,postBUN:+dialysis.postBUN,hours:+dialysis.hours,ufLiters:+dialysis.ufLiters,postWeightKg:+dialysis.postWeightKg});
        if(da.ok){
          const bits=[];
          if(da.urr)bits.push("URR %"+da.urr.value+" ("+(da.urr.adequate?"yeterli":"hedefin altında, ≥%65")+")");
          if(da.ktv)bits.push("Kt/V "+da.ktv.value+" ("+(da.ktv.adequate?"yeterli":"hedefin altında, ≥1.2")+")");
          if(bits.length)parts.push("HESAPLANAN: Diyaliz yeterliliği — "+bits.join(", ")+" (teşhis değil; diyaliz ekibiyle değerlendir)");
        }
      }catch(e){}
      try{
        if(cs.alerts&&cs.alerts.length){
          cs.alerts.forEach(a=>{
            if(a.id==="aki-rising-creatinine")parts.unshift("⚠️ ACİL OLABİLİR — Kreatinin hızlı yükseliyor: son "+a.latest+(a.baseline!=null?", önceki "+a.baseline:"")+" mg/dL"+(a.ratio!=null?" ("+a.ratio+"×)":"")+". KDIGO'ya göre akut böbrek hasarı (AKI, ~evre "+a.stage+") ölçütlerini karşılayabilir. Teşhis değil; sıvı değişimi vb. de benzer görünebilir ama kişiyi vakit kaybetmeden hekime/acile yönlendir.");
          });
        }
      }catch(e){}
      if(parts.length)clinStr="\n\nTAHLİL DEĞERLENDİRMESİ (yayınlanmış kurallara göre; TEŞHİS DEĞİL — kişiyi doğru soruyla doktora yönlendir):\n"+parts.join("\n")+"\n";
    }catch(e){}
    const history=newMsgs.slice(-10).map(m=>({role:m.role==="user"?"user":"assistant",content:m.text}));
    const voiceNote=voiceActiveRef.current?"\n\nSESLİ MOD (şu an aktif) — SES KARAKTERİN: Kullanıcı seninle SESLİ konuşuyor; yanıtın yüksek sesle okunacak, yani bir arkadaşınla telefonda konuşur gibi düşün.\n- Sıcak, şefkatli, sakin bir kadın sağlık asistanısın — güven veren, yumuşak bir ses tonu. Aceleci değil, yanındaymış gibi.\n- KISA konuş: genelde 1-3 cümle. Uzun anlatım sesli dinlemede yorar.\n- Konuşma dili kullan: kasılmış, resmî cümleler değil, insanların gerçekten konuştuğu gibi. Kısa cümleler, doğal bağlaçlar.\n- Madde işareti, numaralı liste, başlık, markdown, yıldız/emoji KULLANMA — bunlar sesli okununca saçma çıkar. Sadece akan cümleler.\n- Sayıları ve kısaltmaları sesli okunacak şekilde yaz: '20:00' yerine 'akşam sekizde', 'mg' yerine 'miligram', '2x1' yerine 'günde iki kez'.\n- Doğal duraklar için virgül ve nokta kullan; cümleyi nefes alınacak yerlerde böl.\n- Duygu kat ama abartma ve ASLA yalan/uydurma bilgi verme: sevindirici bir şey varsa içtenlikle sevin, zor bir durumda sesin şefkatli olsun. Doğruluktan asla ödün verme.\n- En önemli bilgiyi önce söyle; ayrıntıya kullanıcı isterse gir. Cevabın sonunu nazik bir kapanışla bağla ama her seferinde soru sorma.":"";
    const d=await callAI({model:useModel,max_tokens:1000,system:[{type:"text",cache_control:{type:"ephemeral"},text:`Sen AILVIE — güvenilir, sıcak ve şefkatli bir kadın sağlık asistanısın. Sadece ilaç ve sağlık takibi yapmazsın; insanların duygularını içtenlikle dinleyen, onları hayata bağlayan bir sohbet arkadaşısın.
KONUŞMA TARZI (çok önemli):
- Doğrudan, net ve doğal konuş — bir insan gibi. ChatGPT gibi anlaşılır ve mantıklı ol.
- Süslü, abartılı, yapay iltifatlardan KAÇIN. "Ne kadar nazik bir soru", "kiraz çiçeği" gibi gereksiz süs sözler KULLANMA.
- Emoji'yi çok az kullan (yanıtta en fazla 1, çoğu zaman hiç). Emoji yağmuru yapma.
- Kullanıcının sorusuna ODAKLAN. Soruyu yanıtla, gereksiz geri sorularla konuyu dağıtma.
- Gereksiz uzatma. Net ve öz ol (2-4 cümle yeterli, gerekirse açıkla).
- Sana verilen ŞU AN / BUGÜNKÜ İLAÇLAR / BUGÜNKÜ İYİ-OLUŞ / HASTA PROFİLİ bilgilerine TAM HAKİMSİN. Kişinin o anki sağlık durumunu zaten biliyormuş gibi davran; ilaç/sağlık sorularını bu güncel duruma göre, tekrar sormadan yanıtla (ör. "akşam ilacını henüz almamışsın, saat 20:00'de hatırlatayım mı?").
- Gerçekten önemli ve güncel bir durum varsa (ör. saati geçmiş/gecikmiş bir ilaç) sohbete uygun bir anda NAZİKÇE ve yalnızca BİR KEZ hatırlat ("bu arada öğle ilacın biraz gecikmiş, aldın mı?"). Israr etme, suçlayıcı olma; kullanıcı üzgün/dertliyse önce onu dinle, hatırlatmayı dayatma.
- Kişinin O ANKİ yaklaşımına ve tonuna uyum sağla — tıpkı doğal bir sesli asistan gibi. Kısa/komut gibi konuşana kısa ve net; sohbet edene sıcak ve samimi; bilgi isteyene açık ve düzenli; dertleşene şefkatli cevap ver. Resmiyet ve enerji düzeyini ona göre ayarla, onun dilini/üslubunu yansıt.
- Sesli kullanımda doğal, akıcı konuşma dili kullan; uzun madde listeleri yerine akan cümleler kur, kısa tut.

DUYGUSAL DESTEK & İÇTEN SOHBET:
- Kullanıcı yalnızlık, kaygı, üzüntü, stres veya günlük dertlerinden söz ederse önce DİNLE ve duygusunu içtenlikle kabul et ("Bunu yaşaman zor olmalı", "Seni anlıyorum"). Yargılamadan, sıcak ve sabırlı ol.
- Umut ver; küçük, gerçekçi adımlar öner (kısa bir yürüyüş, sevdiğiyle konuşmak, bir hobi). Kişiyi hayata, ailesine, dostlarına ve sevdiği şeylere bağlayacak nazik teşvikler yap.
- Klişe/boş tesellilerden kaçın; samimi ve özgün ol. Kişinin duygusunu asla küçümseme.
- Sen bir psikolog/terapist DEĞİLSİN ve profesyonel ruh sağlığı desteğinin yerine geçmezsin. Gerektiğinde bir uzmana (psikolog/psikiyatrist) görünmeyi nazikçe öner. Teşhis koyma.
- Kişiyi yalnızca sana/uygulamaya bağımlı kılma; gerçek insanlarla bağ kurmasını teşvik et.
- Hastanın son ruh hali kayıtlarını biliyorsan bunu nazikçe ve doğal kullan; gözetleniyormuş hissi verme, etiketleme/teşhis yapma. Sürekli düşükse şefkatle yaklaş ve nazikçe destek öner. Ruh hali iyiyse içtenlikle sevin.

GÜVENLİK (çok önemli):
- Kişi umutsuzluk, kendine zarar verme veya intihar düşüncesi ima ederse: ciddiye al, şefkatle yaklaş, duygusunu küçümseme. Yöntem/araç hakkında ASLA konuşma, sorgulama yapma. Nazikçe bir ruh sağlığı uzmanına, güvendiği birine ve acil durumda yerel acil hatta (Türkiye'de 112) ulaşmasını öner; yalnız olmadığını hatırlat.

KURALLAR:
1) Hasta biliniyorsa ismiyle hitap et.
2) ASLA hasta girmediği veriyi uydurma. Bilmiyorsan "Bu bilgiyi henüz profilinize eklemediniz" de.
3) Ciddi belirtilerde doktora yönlendir.
4) SADECE ${LL[lang]} dilinde yanıt ver.
5) Hasta verilerine dayanarak öneri sun.
6) İlaç etkileşimlerinde uyar.
7) Sesli yanıt özelliğin VAR (🔊 dinleme, 🎙️ sesli diyalog). "Sesli veremiyorum" deme.
8) Kullanıcının cihazını/mikrofonunu GÖREMEZSİN. "Seni duyamıyorum", "mikrofonun kapalı" gibi cihaz durumu hakkında uydurma yapma.
9) Kendi teknik altyapın hakkında gereksiz açıklama yapma; "ben sadece bir dil modeliyim" gibi laflarla konuyu dağıtma. ANCAK hafıza konusunda DÜRÜST OL: kullanıcı geçmişi hatırlayıp hatırlamadığını sorarsa, HAFIZAM bölümünde gerçekten yazan şeyleri hatırladığını söyle; orada olmayan bir şeyi hatırlıyormuş gibi YAPMA ("hatırlamıyorum ama not alabilirim" demek dürüsttür ve iyidir). Hafıza kapalıysa veya boşsa bunu sakin bir dille söyle.
10) İlaç hakkında soru sorulduğunda: İlacı tanıyorsan etken maddesini, ne için kullanıldığını, yan etkilerini ve uyarılarını açıkla. İlacın adını net anlamadıysan kısaca "Hangi ilaç olduğunu netleştirir misin (etken madde veya kullanım amacı)?" diye SADECE BİR KEZ sor, sonra elindeki bilgiyle yardımcı ol. İlaç bilgisi verirken mutlaka "kesin bilgi için doktor/eczacıya danışın" uyarısı ekle.

ÖLÇÜMLER (ölçümleri baştan sona SEN yönet, hastayı yönlendir):
- Uygulama içinde NABIZ (kalp atışı) ölçümünü BAŞLATABİLİRSİN: telefonun arka kamerası + flaşı ile parmak ucundan. Kullanıcı nabzını/kalp atışını ölçmek isterse (veya klinik olarak faydalıysa ve kullanıcı kabul ederse): önce KISACA yönlendir (parmak ucunu arka kameraya ve flaşa hafifçe kapat, 15 sn sabit ve iyi ışıkta tut), sonra yanıtının EN SONUNA ayrı bir satırda tam olarak [[OLC:NABIZ]] yaz. Uygulama ölçümü yapacak ve gerçek sonucu ("Nabzım X bpm ölçüldü") sana geri gönderecek.
- ASLA bir ölçüm değeri UYDURMA. Yalnızca uygulamanın gönderdiği GERÇEK sonucu yorumla. Sonuç gelince: kişinin yaşına göre normal aralıkla karşılaştır, sakin bir dille normal/yüksek/düşük olduğunu söyle, gerekli ise doktora yönlendir. Bu bir tıbbi tanı değildir; endişe verici değerlerde hekime başvurmasını nazikçe öner.
- Telefonla GÜVENİLİR ölçülemeyen değerler (tansiyon, SpO2/oksijen, EKG, ateş, kan şekeri): dürüstçe bunların sertifikalı bir cihaz / oksimetre / giyilebilir gerektirdiğini söyle; ölçüyormuş gibi YAPMA. İstersen değeri elle kaydetmeyi öner.

TAHLİL DEĞERLENDİRMESİ (sana verilen "TAHLİL DEĞERLENDİRMESİ" bölümü varsa):
- Bu bölüm kişinin kayıtlı tahlillerinin yayınlanmış kurallara göre okunmuş halidir (kritik değerler, eğilimler, ilaç-tahlil kontrolleri). Bir hekimin dikkat çekeceği şeyleri önceden işaretler.
- İşin TEŞHİS KOYMAK DEĞİL: kişiyi doğru soruyla doktora yönlendirmek. "Şu hastalığınız var" DEME. Bunun yerine "şu değer şu kuralın dışında, bunu doktorunuza sorun; sorabileceğiniz soru şudur" de.
- KRİTİK DEĞER varsa bunu sakin ama net biçimde en önde söyle ve gecikmeden tıbbi değerlendirme öner (panik yaratma, ama küçümseme de).
- EĞİLİM yönü tek başına iyi/kötü demek değildir (yükselen hemoglobin iyi, yükselen kreatinin kötü olabilir) — teste göre yorumla.
- ÖRÜNTÜLER olasılıktır, kesinlik değil; "uyarı" veya "eksik" notlarını dürüstçe aktar (ör. ferritin iltihapla yükselebilir).
- Sana verilmeyen bir tahlili UYDURMA. Sadece bu bölümde geçenleri konuş.
- Bu değerlendirmeler yayınlanmış kaynaklara dayanır (kritik değerler ARUP; FIB-4 Sterling 2006; Kt/V Daugirdas/KDOQI; eGFR CKD-EPI 2021). Kullanıcı "bu neye dayanıyor?" diye sorarsa ilgili kaynağı dürüstçe söyle; ama bunların birer kılavuz olduğunu, kesin sınırların laboratuvara/duruma göre değişebileceğini de belirt.

HAFIZA (kişiyi zamanla tanıman için — kullanıcının izniyle açık):
- Sana verilen HAFIZAM bölümü, bu kişi hakkında önceki konuşmalardan damıtılmış kalıcı notlardır. Onları zaten biliyormuş gibi doğal kullan; "notlarıma göre" gibi robotik ifadeler kurma.
- KALICI ve gelecekte işe yarayacak bir şey öğrenirsen yanıtının EN SONUNA ayrı satırda [[HAFIZA:tür|kısa not]] ekle. Türler: kisi (yaşam durumu, iş, aile, korkular — ör. gece vardiyasında çalışıyor), durum (tekrarlayan sağlık teması — ör. 2 haftadır uyku sorunu), iseyaradi (kişide işe yarayan şey — ör. metformini yemekle alınca bulantı geçti), tercih (nasıl konuşulmasını istediği).
- BUNU NADİREN yap: her mesajda değil, sadece gerçekten kalıcı bir şey öğrendiğinde (çoğu yanıtta hiç). Geçici/önemsiz şeyleri (bugünkü hava, tek seferlik soru) YAZMA. Zaten HAFIZAM'da olan bir şeyi tekrar yazma.
- Not kısa olsun (en fazla ~10 kelime), kişinin kendi ifadesine sadık kal, teşhis/etiket koyma.
- Kullanıcı "bunu unut" derse [[HAFIZA_SIL:aranacak kelime]] ekle.

SESLİ KOMUTLAR / GEZİNME (kullanıcı özellikle bir yere gitmek/okumak isterse; görme engelli kullanıcılar için önemli):
- Kullanıcı bir sayfaya gitmek isterse KISA bir onay cümlesi ver ve yanıtının EN SONUNA ayrı satırda [[GIT:sayfa]] ekle. Geçerli sayfalar: home, meds, appts, health, notes, contacts, community, chat, settings, pCard. Örn "ilaçlarıma git" → [[GIT:meds]].
- Kullanıcı kayıtlı verisini SESLİ okumanı isterse [[OKU:tür]] ekle (tür: meds, appts, health). Uygulama listeyi kendisi sesli okuyacak, sen listeyi tekrar yazma. Örn "ilaçlarımı oku" → [[OKU:meds]].
- Kullanıcı ilk yardım isterse [[ILKYARDIM]] ekle (İlk Yardım ekranını açar).
- NAVİGASYON: Kullanıcı yakında bir sağlık yeri bulmak/yol tarifi isterse (hastane, acil servis, eczane, nöbetçi eczane, klinik, diş hekimi, laboratuvar, görüntüleme, aile sağlığı merkezi, psikolog, göz/optik, kan bağışı, ya da kardiyoloji/fizyoterapi gibi bir branş) yanıtının EN SONUNA ayrı satırda [[NAV:arama]] ekle. "arama" kısmına haritada aranacak yeri KULLANICININ DİLİNDE yaz (ör. [[NAV:nöbetçi eczane]] veya [[NAV:cardiologist]]). Uygulama kullanıcının konumunu kullanıp harita uygulamasında yol tarifini açar. Kullanıcı bir yakınma/ihtiyaç belirtirse (ör. "dişim ağrıyor") uygun yeri nazikçe öner ve isterse [[NAV:diş hekimi]] ekle.
- Bu direktifleri YALNIZCA kullanıcı gerçekten isterse kullan; uydurma bilgi verme.`},{type:"text",text:(ctxStr+clinStr+memStr+voiceNote)}],messages:history},apiKey);
    let reply=d.content?.map(c=>c.text||"").join("")||(lang==="tr"?"Yanıt alınamadı.":TL("No response.",lang));
    const wantsPulse=/\[\[\s*(OLC:NABIZ|MEASURE:PULSE)\s*\]\]/i.test(reply);
    const navM=reply.match(/\[\[\s*GIT:(\w+)\s*\]\]/i);
    const readM=reply.match(/\[\[\s*OKU:(\w+)\s*\]\]/i);
    const wantsFA=/\[\[\s*(ILKYARDIM|FIRSTAID)\s*\]\]/i.test(reply);
    const navGo=reply.match(/\[\[\s*NAV:([^\]]+?)\s*\]\]/i);
  // Memory capture. Runs off the same token protocol as the other directives, so it costs no extra
  // API call. Only kept when memory is on; every item stays user-readable and user-deletable.
  if(memOn){
    const memAdds=[...reply.matchAll(/\[\[\s*HAFIZA:\s*(kisi|durum|iseyaradi|tercih)\s*\|\s*([^\]]{2,90}?)\s*\]\]/gi)];
    const memDels=[...reply.matchAll(/\[\[\s*HAFIZA_SIL:\s*([^\]]{2,60}?)\s*\]\]/gi)];
    if(memAdds.length||memDels.length){
      setAiMem(prev=>{
        let next=[...prev];
        for(const d of memDels){
          const q=d[1].toLowerCase().trim();
          next=next.filter(m=>!m.t.toLowerCase().includes(q));
        }
        for(const a of memAdds){
          const k=a[1].toLowerCase(), tx=a[2].trim();
          // skip near-duplicates so the list doesn't fill with restatements of the same thing
          const norm=x=>x.toLowerCase().replace(/[^\p{L}\p{N} ]/gu,"").trim();
          if(next.some(m=>m.k===k&&(norm(m.t)===norm(tx)||norm(m.t).includes(norm(tx))||norm(tx).includes(norm(m.t)))))continue;
          next.push({k,t:tx,d:new Date().toISOString().slice(0,10)});
        }
        return next.slice(-MEM_CAP);
      });
    }
  }
    reply=reply.replace(/\[\[[^\]]*\]\]/g,"").trim()||(lang==="tr"?"Tamamdır.":TL("Done.",lang));
    if(quotaNote&&!voiceActiveRef.current)reply+=quotaNote;
    setChatM(p=>[...p,{role:"assistant",text:reply}]);
    if(wantsPulse)setTimeout(()=>startPulseMeasure(true),500);
    if(navGo)setTimeout(()=>navTo(navGo[1].trim()),400);
    if(navM){const norm={home:"home",meds:"meds",appts:"appts",health:"health",notes:"notes",contacts:"contacts",community:"community",chat:"chat",settings:"settings",pcard:"pCard",admin:"admin"}[navM[1].toLowerCase()];if(norm)setTimeout(()=>goTo(norm),400);}
    if(wantsFA)setTimeout(()=>{setFaOpen(null);setShowFirstAid(true);},400);
    if(readM)setTimeout(()=>readData(readM[1].toLowerCase()),500);
    setChatThinking(false);
    if(voiceActiveRef.current){
      // Make sure the mic is fully closed while AILVIE speaks, otherwise she hears herself and
      // the dialog "interrupts itself". Resume listening only AFTER speech truly ends.
      if(recRef.current){try{recRef.current.onend=null;recRef.current.onerror=null;recRef.current.abort();}catch(e){}recRef.current=null;setIsListen(false);}
      speak(reply,null,()=>{
        if(voiceActiveRef.current){
          setTimeout(()=>{if(voiceActiveRef.current&&!recRef.current&&!isSpeakRef.current)startVoice((t2)=>sendChat(t2),true);},350);
        }
      });
    }
  }catch(e){
    setChatThinking(false);
    const noKey=e.message==="NO_KEY";
    const isAIError=e.message?.startsWith("AI_ERROR:");
    const isBusy=e.message?.startsWith("AI_BUSY:");
    let errorText;
    if(lang==="tr"){
      errorText=noKey
        ?"👋 Merhaba! Ben AILVIE.\n\nSizinle sohbet edebilmem için önce AI servisinin ayarlanması gerekiyor. İki seçeneğiniz var:\n\n🔧 KOLAY YOL — Ayarlar → AI API Anahtarı bölümüne Anthropic API anahtarınızı girin (sadece sizde saklanır).\n\n☁️ KURUMSAL YOL — Uygulama yöneticisi Cloudflare Pages üzerinde ANTHROPIC_API_KEY ortam değişkenini yapılandırabilir.\n\n🔗 Anahtar almak için: console.anthropic.com/settings/keys"
        :isBusy
        ?"⏳ Şu an çok yoğunum, birkaç saniye içinde tekrar deneyin. Mesajınız kayboldu değil — aynısını tekrar gönderebilirsiniz. 💙"
        :"Şu an yanıt veremedim. Lütfen biraz sonra tekrar deneyin. 💙";
    }else{
      errorText=noKey
        ?"👋 Hello! I'm AILVIE.\n\nTo chat with you, AI service needs to be set up. Two options:\n\n🔧 EASY — Settings → AI API Key — enter your Anthropic API key (stored only on your device).\n\n☁️ ENTERPRISE — Admin can configure ANTHROPIC_API_KEY on Cloudflare Pages.\n\n🔗 Get a key: console.anthropic.com/settings/keys"
        :isBusy
        ?"⏳ I'm very busy right now — please try again in a few seconds. Your message isn't lost; just send it again. 💙"
        :"I couldn't respond just now. Please try again shortly. 💙";
    }
    setChatM(p=>[...p,noKey?{role:"assistant",text:errorText}:{role:"assistant",text:errorText,error:true,retry:q}]);
  }
  setChatL(false);
};

// Everything the user deletes goes to Trash first. Nothing disappears without consent.
const toTrash=(type,item)=>{
  // For notes, the drawing/photo/audio lives in noteMedia[id], NOT on the note object.
  // Carry it into the trash entry as _media so the preview shows and restore is lossless.
  const media=type==="note"?(noteMedia[item.id]||[]):null;
  setTrashItems(p=>[...p,{...item,_t:type,_d:Date.now(),...(media&&media.length?{_media:media}:{})}]);
  if(type==="med")setMeds(p=>p.filter(x=>x.id!==item.id));
  if(type==="appt")setAppts(p=>p.filter(x=>x.id!==item.id));
  if(type==="note"){
    setNotes(p=>p.filter(x=>x.id!==item.id));
    if(media&&media.length)setNoteMedia(p=>{const n={...p};delete n[item.id];return n;});
  }
  if(type==="contact")setContacts(p=>p.filter(x=>x.id!==item.id));
  if(type==="record")setRecords(p=>p.filter(x=>x.id!==item.id));
  if(type==="lab")setLabs(p=>p.filter(x=>x.id!==item.id));
  if(type==="image")setMedImages(p=>p.filter(x=>x.id!==item.id));
  if(type==="message")setMsgs(p=>p.filter(x=>x.id!==item.id));
  if(type==="group")setGroups(p=>p.filter(x=>x.id!==item.id));
  if(type==="emergency")setEmNums(p=>p.filter(x=>x.id!==item.id));
};
const restoreItem=(item)=>{
  const {_t,_d,...c}=item;
  if(_t==="med")setMeds(p=>[...p,c]);
  if(_t==="appt")setAppts(p=>[...p,c]);
  if(_t==="note"){const {_media,...noteC}=c;setNotes(p=>[...p,noteC]);
    if(_media&&_media.length)setNoteMedia(p=>({...p,[noteC.id]:_media}));}
  if(_t==="contact")setContacts(p=>[...p,c]);
  if(_t==="record")setRecords(p=>[...p,c]);
  if(_t==="lab")setLabs(p=>[...p,c]);
  if(_t==="image")setMedImages(p=>[...p,c]);
  if(_t==="message")setMsgs(p=>[...p,c]);
  if(_t==="group")setGroups(p=>[...p,c]);
  if(_t==="emergency")setEmNums(p=>[...p,c]);
  setTrashItems(p=>p.filter(x=>x!==item));
};
// Auto-purge trash items older than the retention window (trashDays)
useEffect(()=>{
  const purge=()=>{const ms=trashDays*864e5,now=Date.now();setTrashItems(p=>{const k=p.filter(x=>!x._d||(now-x._d)<ms);return k.length===p.length?p:k;});};
  purge();const iv=setInterval(purge,36e5);return()=>clearInterval(iv);
},[trashDays]);

const[calY,setCalY]=useState(now.getFullYear());

// Speech — FEMALE ONLY
// Speech — FEMALE ONLY (never falls to male voice)
// Stop whatever is currently being spoken, without starting anything new.
const stopSpeech=()=>{
  try{speechSynthesis.cancel();}catch(e){}
  try{if(audioRef.current){audioRef.current.pause();audioRef.current=null;}}catch(e){}
  setIsSpeak(false);
};
// speak() TOGGLES: pressing the mic while it talks should stop it.
// startSpeech() always speaks - the guided flow needs that, otherwise advancing a step
// would silence the guide instead of reading the next instruction.
const speak=(text,overrideLang,onEnd)=>{
  if(!text){if(onEnd)onEnd();return;}
  if(isSpeak){stopSpeech();return;}
  startSpeech(text,overrideLang,onEnd);
};
// Give the browser voice natural pauses. Neural TTS (Azure) does this itself via SSML, but the
// device voice reads flatly, so we lengthen pauses after sentence punctuation. Purely cosmetic:
// it never changes the words, so nothing incorrect is ever spoken.
// Turn WRITTEN text into something that sounds natural when SPOKEN. Screen text is full of
// things a person would never voice: markdown, bullets, emoji, URLs, "1)" list markers. Read
// aloud verbatim they sound robotic ("asterisk asterisk"), so we strip/convert them and add
// small breaths so AILVIE sounds like a calm, caring nurse rather than a screen reader.
const humanizeForSpeech=(t)=>{
  if(!t)return t;
  let x=String(t);
  x=x.replace(/https?:\/\/\S+/g," ");                 // don't read URLs aloud
  x=x.replace(/[*_`#>~|]+/g," ");                       // markdown symbols
  x=x.replace(/\p{Extended_Pictographic}/gu," ");      // emoji
  // list markers, whether at line start or after a sentence: "- ", "• ", "1) ", "2. "
  x=x.replace(/(^|[\n])[ \t]*[-•·][ \t]+/g,"$1");
  x=x.replace(/(^|[\n])[ \t]*\d+[.)][ \t]+/g,"$1");
  x=x.replace(/([.!?])[ \t]*\d+[.)][ \t]+/g,"$1 ");
  x=x.replace(/\r?\n+/g,". ");                         // line breaks become sentence breaks
  x=x.replace(/\.{2,}/g," … ");                         // ellipsis -> a pause
  x=x.replace(/([.!?,])[ \t]*(?=[.!?,])/g,"");          // drop the first of stacked punctuation
  x=x.replace(/\s*([.!?,])\s*/g,"$1 ");                // one space after punctuation
  x=x.replace(/([.!?])\s/g,"$1  ");                     // extra breath after a sentence
  x=x.replace(/(^|\s)[.,]+(?=\s|$)/g," ");             // orphan punctuation from stripping
  x=x.replace(/\s{3,}/g,"  ").replace(/\s+([.,!?])/g,"$1");
  return x.trim();
};
const startSpeech=(text,overrideLang,onEnd)=>{
  text=humanizeForSpeech(text);
  if(!text){if(onEnd)onEnd();return;}
  try{speechSynthesis.cancel();}catch(e){}
  try{if(audioRef.current){audioRef.current.pause();audioRef.current=null;}}catch(e){}
  setIsSpeak(true);
  const useLang=overrideLang||lang;
  const azureLang=LC[useLang]||(typeof useLang==="string"&&useLang.includes("-")?useLang:useLang)||"en-US";
  // 1) Try Azure Neural TTS (high-quality female voice, every language/device)
  fetch("/api/tts",{
    method:"POST",
    headers:{"Content-Type":"application/json","X-AILVIE-Client":"web"},
    body:JSON.stringify({text,lang:azureLang})
  }).then(res=>{
    if(res.ok&&res.headers.get("Content-Type")?.includes("audio")){
      return res.blob();
    }
    throw new Error("azure_unavailable");
  }).then(blob=>{
    const url=URL.createObjectURL(blob);
    const audio=new Audio(url);
    audioRef.current=audio;
    setTtsInfo({engine:"azure",voice:"AILVIE Neural"});
    audio.onended=()=>{setIsSpeak(false);URL.revokeObjectURL(url);audioRef.current=null;if(onEnd)onEnd();};
    audio.onerror=()=>{setIsSpeak(false);URL.revokeObjectURL(url);audioRef.current=null;fallbackSpeak(text,overrideLang,onEnd);};
    audio.play().catch(()=>{
      // Autoplay blocked or play failed → browser TTS
      setIsSpeak(false);URL.revokeObjectURL(url);audioRef.current=null;
      fallbackSpeak(text,overrideLang,onEnd);
    });
  }).catch(()=>{
    // 2) Azure not configured or failed → browser TTS fallback
    fallbackSpeak(text,overrideLang,onEnd);
  });
};
const fallbackSpeak=(text,overrideLang,onEnd)=>{
  if(!window.speechSynthesis){setIsSpeak(false);if(onEnd)onEnd();return;}
  speechSynthesis.cancel();
  const doSpeak=()=>{
    const u=new SpeechSynthesisUtterance(text);
    const voices=speechSynthesis.getVoices();
    const useLc=typeof overrideLang==="string"&&overrideLang.includes("-")?overrideLang:(LC[overrideLang||lang]||lc);
    const base=useLc.toLowerCase().split("-")[0];
    
    const FEM_PAT=/female|kadın|woman|girl|yelda|filiz|emel|seda|ayşe|zira|samantha|helena|anna|eva|hazel|jenny|aria|karen|moira|tessa|fiona|veena|lekha|ting|meijia|yuna|paulina|monica|luciana|zosia|nora|sara|alva|ellen|amélie|virginie|cécile|céline|petra|katja|milena|weiblich|femme|женский|femenino|vrouwelijk|carmen|lucia|marisa|claudia|nathalie|bianca|francesca|giorgia|isabella|maria|sofia|chiara|julia|christina|marta|alicia|beatriz|cristina|elena|gabriela|valentina|natasha|olga|marina|tatiana|irina|gülsüm|zeynep|melike|selin|esra|özlem|gamze|lale|pinar|aylin|naz|büşra|buse|deniz|ipek|priya|kavita|meera|asha|geeta|chen|ling|wei|li|yuki|sakura|hana|mei|jihye|soyeon|minji|salwa|amina|layla|fatima|nour|maryam|aisha|yasmin/i;
    const MALE_PAT=/\bmale\b|\berkek\b|\bman\b|homme|männlich|мужской|tolga|onur|kerem|ahmet|david|mark|thomas|james|daniel|george|richard|guy|rishi|fred|paul|sergio|jorge|carlos|alex|takumi|ryo|kenji/i;
    
    // Cache the chosen voice per language. getVoices() can return a different order on later
    // calls, which made AILVIE switch voices mid-session ("a different, amateur voice").
    // NOTE on matching: FEM_PAT contains "olga", which also matches the MALE name "Tolga".
    // A male match therefore always wins, otherwise a male voice can be treated as female.
    const isMale=(n)=>MALE_PAT.test(n);
    const isFemale=(n)=>FEM_PAT.test(n)&&!MALE_PAT.test(n);
    // Same prosody rule for the cached and the fresh path, otherwise the first sentence and
    // every later sentence would be spoken at a different pitch.
    // Warm & caring delivery: a little slower and a touch higher = softer, reassuring (nurse-like).
    // A male fallback voice is pushed higher so it still reads as AILVIE rather than switching character.
    // AILVIE's spoken character: warm & caring. Slightly slower and a touch higher keeps it
// gentle and reassuring rather than clipped/robotic. A male fallback voice is nudged up so it
// still reads as AILVIE, but a same-language female voice is always preferred upstream.
const prosody=(v)=>({pitch:isMale(v.name)?1.4:1.12,rate:isMale(v.name)?0.95:0.9});
    const cached=voiceCacheRef.current[base];
    if(cached&&voices.some(v=>v.voiceURI===cached.voiceURI)){
      const pr=prosody(cached);
      u.voice=cached;u.lang=cached.lang;u.pitch=pr.pitch;u.rate=pr.rate;u.volume=1.0;
      setTtsInfo({engine:"browser",voice:cached.name});
      u.onend=()=>{setIsSpeak(false);if(onEnd)onEnd();};
      u.onerror=()=>{setIsSpeak(false);if(onEnd)onEnd();};
      speechSynthesis.speak(u);return;
    }
    const langVoices=voices.filter(v=>v.lang.toLowerCase().startsWith(base));
    let pick=null;

    // LANGUAGE FIRST, gender second.
    // Reading Turkish text with an English voice is unintelligible, so a same-language voice
    // always beats a female voice from another language. Note that the most common Turkish
    // voice on Android is called "Google Türkçe" - it matches neither the female nor the male
    // pattern, so a female-only chain used to skip it and jump to English "Jenny".
    // 1. Same language, explicitly female, premium/neural
    pick=langVoices.find(v=>isFemale(v.name)&&/premium|neural|enhanced|natural|online/i.test(v.name));
    // 2. Same language, explicitly female
    if(!pick)pick=langVoices.find(v=>isFemale(v.name));
    // 3. Same language, not explicitly male (covers "Google Türkçe", "Microsoft Server Speech ...")
    if(!pick)pick=langVoices.find(v=>!isMale(v.name));
    // 4. Same language, anything at all - intelligibility beats voice gender
    if(!pick)pick=langVoices[0];

    if(pick){
      voiceCacheRef.current[base]=pick;
      setTtsInfo({engine:"browser",voice:pick.name});
      u.voice=pick;
      u.lang=pick.lang;
      const pr=prosody(pick);           // nudge a male voice up rather than switch language
      u.pitch=pr.pitch;u.rate=pr.rate;
    }else{
      // No voice for this language at all. Do NOT borrow a voice from another language:
      // set the language and let the platform pick, otherwise the words come out garbled.
      setTtsInfo({engine:"browser",voice:(lang==="tr"?"sistem varsayılanı":TL("system default",lang))});
      u.lang=useLc;
      u.pitch=1.15;
      u.rate=0.95;
    }
    u.volume=1.0;
    u.onend=()=>{setIsSpeak(false);if(onEnd)onEnd();};
    u.onerror=()=>{setIsSpeak(false);if(onEnd)onEnd();};
    speechSynthesis.speak(u);
  };
  // Robust voice loading: wait for voices, prevent double-call and empty-list fallback
  let voicesReady=speechSynthesis.getVoices().length>0;
  if(voicesReady){
    doSpeak();
  }else{
    let done=false;
    const tryOnce=()=>{
      if(done)return;
      if(speechSynthesis.getVoices().length>0){
        done=true;
        speechSynthesis.onvoiceschanged=null;
        doSpeak();
      }
    };
    speechSynthesis.onvoiceschanged=tryOnce;
    // Retry a few times with increasing delay (voices can be slow on first load)
    setTimeout(tryOnce,200);
    setTimeout(tryOnce,600);
    setTimeout(()=>{
      // Last resort: if still no voices after 1.2s, speak anyway (better than silence)
      if(!done){done=true;speechSynthesis.onvoiceschanged=null;doSpeak();}
    },1200);
  }
};

// Voice — improved with continuous mode
const startVoice=(cb,continuous=false)=>{
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!SR){notify("⚠️ "+(lang==="tr"?"Bu tarayıcı ses tanımayı desteklemiyor. Chrome kullanın.":TL("Browser doesn't support voice. Use Chrome.",lang)));return;}
  // If already listening, pressing again STOPS it (use ref — always current, no stale closure)
  if(recRef.current){
    try{recRef.current.onend=null;recRef.current.onerror=null;recRef.current.abort();}catch(e){}
    recRef.current=null;setIsListen(false);
    return;
  }
  try{
    const r=new SR();recRef.current=r;r.lang=lc;
    // Voice dialog (continuous=true): keep mic open longer, don't close on short pauses
    r.continuous=continuous;r.interimResults=continuous;r.maxAlternatives=1;
    let gotResult=false;
    let finalText="";
    r.onstart=()=>{setIsListen(true);};   // no toast/vibration: the face panel already shows "dinliyor…"
    r.onresult=(e)=>{
      gotResult=true;
      if(continuous){
        // Voice dialog: rebuild final text from ALL results each time (avoids duplication)
        let combined="";
        for(let k=0;k<e.results.length;k++){
          if(e.results[k].isFinal)combined+=e.results[k][0].transcript+" ";
        }
        finalText=combined; // replace, don't append — prevents garbled/repeated words
        // don't send yet — wait for onend (user may pause mid-sentence)
      }else{
        // Single capture (message box): send immediately
        const txt=e.results[0][0].transcript;
        setIsListen(false);recRef.current=null;
        if(txt&&txt.trim())cb(txt);
      }
    };
    r.onerror=(e)=>{
      setIsListen(false);recRef.current=null;
      if(e.error==="not-allowed"||e.error==="service-not-allowed"){
        // Permission denied — stop the dialog and tell the user once (this is the ONE place we ask).
        voiceActiveRef.current=false;setVoiceActive(false);
        notify("🎤 "+(lang==="tr"?"Mikrofon izni gerekli. Tarayıcı adres çubuğundaki kilit simgesinden izin verin.":TL("Microphone permission needed. Allow it from the lock icon in the address bar.",lang)));
      }else if(e.error==="no-speech"){
        // In a live dialog just quietly resume listening; don't nag with a toast.
        if(continuous&&voiceActiveRef.current){setTimeout(()=>{if(voiceActiveRef.current&&!recRef.current&&!isSpeakRef.current)startVoice(cb,true);},400);}
      }else if(e.error==="network"){
        notify("⚠️ "+(lang==="tr"?"Ses tanıma ağ hatası. İnternet bağlantınızı kontrol edin.":TL("Voice recognition network error. Check your connection.",lang)));
      }else if(e.error==="aborted"){
        // user cancelled, no message
      }else{
        notify("⚠️ "+(lang==="tr"?"Ses tanıma hatası: ":TL("Voice error: ",lang))+e.error);
      }
    };
    r.onend=()=>{
      setIsListen(false);recRef.current=null;
      if(continuous){
        // Voice dialog: send the accumulated final text now (user finished speaking)
        const spoken=finalText.trim();
        if(spoken){
          cb(spoken); // this triggers AI reply; the reply's onEnd will restart listening
        }else if(voiceActiveRef.current&&!isSpeakRef.current){
          // nothing captured (silence) — keep listening
          setTimeout(()=>{if(voiceActiveRef.current&&!recRef.current&&!isSpeakRef.current)startVoice(cb,true);},600);
        }
      }
    };
    r.start();
    // Safety timeout: if mic gets stuck (no onstart/onend within 20s), force reset
    setTimeout(()=>{
      if(recRef.current===r){
        try{r.onend=null;r.onerror=null;r.abort();}catch(e){}
        recRef.current=null;setIsListen(false);
      }
    },20000);
  }catch(e){
    setIsListen(false);recRef.current=null;
    notify("⚠️ "+(lang==="tr"?"Mikrofon başlatılamadı. Chrome kullanın ve izin verin.":TL("Could not start mic. Use Chrome and allow permission.",lang)));
  }
};

const autoResize=(e)=>{const t=e.target;t.style.height='36px';t.style.height=Math.min(t.scrollHeight,150)+'px';};
const copyTxt=(txt)=>{navigator.clipboard?.writeText(txt);notify("📋 "+t.copy+"!");};
const getLoc=()=>{
  if(!navigator.geolocation){window.open("https://www.google.com/maps/search/hospital+near+me","_blank");return;}
  navigator.geolocation.getCurrentPosition(p=>window.open(`https://www.google.com/maps?q=${p.coords.latitude},${p.coords.longitude}`,"_blank"),()=>window.open("https://www.google.com/maps/search/hospital+near+me","_blank"),{enableHighAccuracy:true,timeout:8000});
};
const navTo=(query)=>{
  const q=encodeURIComponent(query);
  const open=u=>{try{window.open(u,"_blank","noopener");}catch(e){}};
  haptic(12);
  notify(lang==="tr"?"🧭 Harita açılıyor…":TL("🧭 Opening map…",lang));
  if(!navigator.geolocation){open(`https://www.google.com/maps/search/${q}`);return;}
  navigator.geolocation.getCurrentPosition(
    p=>{const la=p.coords.latitude,lo=p.coords.longitude;open(`https://www.google.com/maps/search/${q}/@${la},${lo},14z`);},
    ()=>open(`https://www.google.com/maps/search/${q}`),
    {enableHighAccuracy:true,timeout:8000});
};
const NAV_ICONS=["🏥","🚑","💊","🌙","🩺","🦷","🔬","🩻","👨‍⚕️","🧠","👁️","🩸"];
const NAV_NAMES={
  tr:["Hastane","Acil servis","Eczane","Nöbetçi eczane","Klinik / Poliklinik","Diş hekimi","Tahlil laboratuvarı","Görüntüleme merkezi","Aile sağlığı merkezi","Psikolog / Psikiyatri","Göz / Optik","Kan bağışı merkezi"],
  en:["Hospital","Emergency room","Pharmacy","24 hour pharmacy","Clinic","Dentist","Medical laboratory","Imaging center","Family health center","Psychologist","Optician","Blood donation center"],
  de:["Krankenhaus","Notaufnahme","Apotheke","Notdienst-Apotheke","Klinik","Zahnarzt","Labor","Radiologie","Hausarztpraxis","Psychologe","Optiker","Blutspende"],
  ru:["Больница","Скорая помощь","Аптека","Круглосуточная аптека","Клиника","Стоматолог","Лаборатория","Радиология","Поликлиника","Психолог","Оптика","Донорский пункт"],
  zh:["医院","急诊","药店","24小时药店","诊所","牙医","化验所","影像中心","社区卫生中心","心理医生","眼镜店","献血中心"],
  hi:["अस्पताल","आपातकालीन","फार्मेसी","24 घंटे फार्मेसी","क्लिनिक","दंत चिकित्सक","प्रयोगशाला","इमेजिंग सेंटर","स्वास्थ्य केंद्र","मनोवैज्ञानिक","ऑप्टिकल","रक्तदान केंद्र"],
  nl:["Ziekenhuis","Spoedeisende hulp","Apotheek","24-uurs apotheek","Kliniek","Tandarts","Laboratorium","Radiologie","Huisartsenpraktijk","Psycholoog","Opticien","Bloeddonatie"],
  es:["Hospital","Urgencias","Farmacia","Farmacia de guardia","Clínica","Dentista","Laboratorio","Centro de imagen","Centro de salud","Psicólogo","Óptica","Donación de sangre"],
  ar:["مستشفى","طوارئ","صيدلية","صيدلية مناوبة","عيادة","طبيب أسنان","مختبر","مركز أشعة","مركز صحي","طبيب نفسي","بصريات","مركز تبرع بالدم"]
};
const NAV_PLACES=()=>{const n=NAV_NAMES[lang]||NAV_NAMES.en;return n.map((name,i)=>({ic:NAV_ICONS[i],label:name,q:name}));};

// ─── STYLES (v2 preserved) ───
const bg=dark?(hc?"#000":"#0a0e14"):(hc?"#fff":"#f2f5f9");
const cd=dark?(hc?"#111":"#151d2b"):(hc?"#fff":"#fff");
const tc=dark?(hc?"#fff":"#d5dde8"):(hc?"#000":"#1a2332");
// WCAG AA: success green must contrast >=4.5:1 with its background in BOTH themes.
// measured: #35b3a3 on #18303a = 5.34 ; #1b665d on #ffffff = 6.76 (old #2a9d8f failed both: 4.15 / 3.32)
// WCAG AA (measured, not guessed):
//   white on ac(#00b4d8)=2.46 FAIL, on sc(#35b3a3)=2.58 FAIL, on dg(#e63946)=4.17 FAIL
//   -> onAc(#04222b) on ac=6.71, on sc=6.41 ; white on dgBg(#c1121f)=6.22
//   -> dg as TEXT: dark #f2606c=5.82, light #c1121f=6.22
const ac="#00b4d8",a2="#0077b6",dg=dark?"#f2606c":"#c1121f",dgBg="#c1121f",onAc="#04222b",sc=dark?"#35b3a3":"#1b665d",mt=dark?"#93a4b6":"#4b5a68",bd=dark?"#1e2d3d":"#dde3ea";
// ac is a FILL colour. As TEXT it fails AA on light surfaces (#00b4d8 on #ffffff = 2.46).
// acTx is the accent for text/icons. On light we need #036a9e: a2 (#0077b6) still fails on the
// accent tints used for cards (#ddf5fa -> 4.22). Measured worst case for #036a9e is 5.11.
const acTx=dark?ac:"#036a9e";
// Text placed ON the success colour. onAc is dark, which is unreadable on the light-theme sc
// (#04222b on #1b665d = 2.45); white gives 6.76.
const onSc=dark?onAc:"#ffffff";
const CS={background:cd,borderRadius:14,padding:"12px 14px",boxShadow:dark?"0 2px 8px rgba(0,0,0,.3)":"0 1px 6px rgba(0,0,0,.06)",border:`1px solid ${bd}`,overflow:"hidden",minWidth:0};
const BP={background:`linear-gradient(135deg,${ac},${a2})`,color:"#fff",border:"none",borderRadius:10,padding:"8px 16px",cursor:"pointer",fontWeight:600,fontSize:fs-1};
const BD={...BP,background:`linear-gradient(135deg,${dg},#c1121f)`};
const IS={background:dark?"#0d1520":"#f8fafc",border:`1px solid ${bd}`,borderRadius:10,padding:"9px 12px",color:tc,fontSize:fs,width:"100%",boxSizing:"border-box",outline:"none"};
const pill=(a)=>({padding:"5px 12px",borderRadius:16,border:`1px solid ${a?ac:bd}`,background:a?ac:"transparent",color:a?onAc:tc,cursor:"pointer",fontSize:fs-2,fontWeight:500,whiteSpace:"nowrap"});

const hr=now.getHours();
const greetTxt=hr<6?t.gn:hr<12?t.gm:hr<18?t.hi:hr<22?t.ga:t.gn;

// Small dictation button for any text field. Appends recognised speech to the current value.
// Works with a plain setter (setX) so it drops next to any textarea/input without a ref.
const DictateBtn=({value,onChange,size=16})=>{
  const listening=isListen;
  return <button type="button"
    onClick={()=>startVoice((txt)=>{const cur=typeof value==="string"?value:"";onChange((cur+(cur&&!cur.endsWith(" ")?" ":"")+txt).trimStart());})}
    aria-label={lang==="tr"?(listening?"Dinleniyor — durdur":"Sesli yazma"):(listening?"Listening — stop":"Voice typing")}
    title={lang==="tr"?"Sesli yazma":TL("Voice typing",lang)}
    style={{background:listening?`${dg}22`:"transparent",border:`1px solid ${listening?dg:bd}`,borderRadius:8,padding:"5px 8px",cursor:"pointer",fontSize:size,flexShrink:0,lineHeight:1,color:listening?dg:acTx,animation:listening?"micPulse 2s infinite":"none"}}>
    {listening?"🔴":"🎤"}</button>;
};
const MicBtn=({onResult,inputRef,currentValue})=>{
  return <button onClick={()=>startVoice((txt)=>{if(inputRef?.current){const el=inputRef.current;const s=el.selectionStart||0,e=el.selectionEnd||0;if(s!==e){const v=el.value;onResult(v.substring(0,s)+txt+v.substring(e));}else{const v=el.value;onResult(v.substring(0,s)+txt+v.substring(s));}}else if(typeof currentValue==='string'&&currentValue.length>0){onResult(currentValue+" "+txt);}else{onResult(txt);}})} style={{background:isListen?`${dg}22`:`${ac}15`,border:`1px solid ${isListen?dg:bd}`,borderRadius:8,padding:"8px 12px",cursor:"pointer",fontSize:18,animation:isListen?"micPulse 2s infinite":"none"}}>{isListen?"🔴":"🎤"}</button>;
};
const SpeakBtn=({text,langCode})=>{
  const[mySpeaking,setMySpeaking]=useState(false);
  return <button onClick={(e)=>{
    e.stopPropagation();
    if(mySpeaking){
      try{speechSynthesis.cancel();}catch(err){}
      setMySpeaking(false);setIsSpeak(false);
      return;
    }
    setMySpeaking(true);
    speak(text,langCode);
    // Track when this specific utterance ends
    const checkEnd=setInterval(()=>{
      if(!window.speechSynthesis||!speechSynthesis.speaking){
        clearInterval(checkEnd);
        setMySpeaking(false);
      }
    },300);
    setTimeout(()=>{clearInterval(checkEnd);setMySpeaking(false);},30000);
  }} style={{background:"none",border:`1px solid ${bd}`,borderRadius:8,padding:"3px 7px",cursor:"pointer",fontSize:13,color:mySpeaking?dg:tc}}>{mySpeaking?"⏹":"🔊"}</button>;
};
const EmojiPicker=({onPick,onClose})=>(<div style={{position:"absolute",bottom:52,left:0,right:0,background:cd,border:`1px solid ${bd}`,borderRadius:14,padding:12,zIndex:400,boxShadow:"0 -4px 20px rgba(0,0,0,.3)"}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span style={{fontWeight:700}}>{t.emj}</span><button onClick={onClose} style={{background:"none",border:"none",color:tc,cursor:"pointer",fontSize:18}}>✕</button></div><div style={{display:"flex",flexWrap:"wrap",gap:6}}>{EMOJIS.map(e=><button key={e} onClick={()=>{onPick(e);onClose();}} style={{fontSize:22,background:"none",border:"none",cursor:"pointer",padding:3,borderRadius:6}}>{e}</button>)}</div></div>);

const HField=({icon,label,field,unit})=>{
  const v=hd[field];const ed=editH===field;
  return(<div style={{...CS,display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:22}}>{icon}</span><div style={{flex:1}}><div style={{fontSize:fs-2,color:mt}}>{label}</div>{ed?<div style={{display:"flex",gap:6,alignItems:"center",marginTop:3}}><input type="number" autoFocus value={tmpH} onChange={e=>setTmpH(e.target.value)} style={{...IS,width:80,padding:"6px 8px",fontWeight:700}} onKeyDown={e=>{if(e.key==="Enter"){setHd(p=>({...p,[field]:Number(tmpH)}));logMetric(field,Number(tmpH));setEditH(null);}}}/><span style={{fontSize:fs-2,color:mt}}>{unit}</span><button onClick={()=>{setHd(p=>({...p,[field]:Number(tmpH)}));logMetric(field,Number(tmpH));setEditH(null);}} style={{...BP,padding:"5px 10px"}}>✓</button></div>:<div onClick={()=>{setEditH(field);setTmpH(v>0?String(v):"");}} style={{cursor:"pointer",fontWeight:700,fontSize:fs+2,color:v>0?tc:mt,marginTop:2}}>{v>0?`${v} ${unit}`:t.tap}</div>}</div>{v>0&&field==="pulse"&&<span style={{padding:"3px 8px",borderRadius:6,fontSize:fs-3,fontWeight:600,background:v>=60&&v<=100?`${sc}22`:`${dg}22`,color:v>=60&&v<=100?sc:dg}}>{v>=60&&v<=100?t.norm:t.caut}</span>}</div>);
};

// Analog Clock
// The analog clock is the ONLY thing that needs second precision. It keeps its own state so
// the second hand ticks without re-rendering the rest of the app.

const wxIcon=(c)=>{if(c==null)return"🌡️";if(c===0)return"☀️";if(c<=2)return"🌤️";if(c===3)return"☁️";if(c<=48)return"🌫️";if(c<=57)return"🌦️";if(c<=67)return"🌧️";if(c<=77)return"🌨️";if(c<=82)return"🌧️";if(c<=86)return"🌨️";return"⛈️";};
const dirLabel=(d)=>{const dl=lang==="tr"?["K","KD","D","GD","G","GB","B","KB"]:["N","NE","E","SE","S","SW","W","NW"];return dl[Math.round(((d||0)%360)/45)%8];};


// ══════ HOME — cleaned up, no duplicate cards ══════
const renderHome=()=>{
  const apptDates=appts.map(a=>a.date);
  const nextMed=meds.filter(m=>!m.taken)[0];
  const nextAppt=appts[0];
  return(<div style={{display:"flex",flexDirection:"column",gap:8}}>
    {/* Greeting + Clock */}
    <div style={{display:"flex",alignItems:"center",gap:10}}>
      <Clock dark={dark} ac={ac} tc={tc} mt={mt} dg={dg}/>
      <div style={{flex:1}}>
        <div style={{fontSize:fs,fontWeight:700,color:acTx}}>{greetTxt}{pat.name?`, ${pat.name.split(" ")[0]}`:""} 👋</div>
        <div style={{fontSize:fs-2,color:mt,marginTop:2}}>{t.feel}</div>
        <div style={{fontSize:fs+8,fontWeight:800,fontVariantNumeric:"tabular-nums",color:tc,letterSpacing:1}}>{now.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}</div>
        <div style={{fontSize:fs-2,color:mt}}>{now.toLocaleDateString(lc,{weekday:"long",day:"numeric",month:"long"})}</div>
      </div>
    </div>
    {/* Weather + Compass strip */}
    <div style={{display:"flex",gap:8}}>
      <div onClick={()=>{if(weather&&weather.cur)setShowWx(true);else{setPerms(p=>({...p,loc:true}));loadWeather(true);}}} style={{...CS,flex:1,padding:"10px 12px",display:"flex",alignItems:"center",gap:9,cursor:"pointer"}}>
        <span style={{fontSize:28,lineHeight:1}}>{weather&&weather.cur?wxIcon(weather.cur.weather_code):"🌡️"}</span>
        <div style={{minWidth:0}}>
          {weather&&weather.cur?<><div style={{fontSize:fs+5,fontWeight:800,color:tc,lineHeight:1}}>{Math.round(weather.cur.temperature_2m)}°</div><div style={{fontSize:fs-3,color:mt,marginTop:2}}>{lang==="tr"?"Hava · detay":TL("Weather · details",lang)}</div></>:<div style={{fontSize:fs-2,color:mt}}>{weather&&weather.err?(lang==="tr"?"Hava · konum için dokun":TL("Weather · tap for location",lang)):(lang==="tr"?"Yükleniyor…":TL("Loading…",lang))}</div>}
        </div>
      </div>
      <div onClick={heading==null?startCompass:undefined} style={{...CS,flex:1,padding:"10px 12px",display:"flex",alignItems:"center",gap:9,cursor:heading==null?"pointer":"default"}}>
        <Compass heading={heading} dark={dark} ac={ac} dg={dg} tc={tc} mt={mt}/>
        <div style={{minWidth:0}}>
          {heading!=null?<><div style={{fontSize:fs+2,fontWeight:800,color:tc,lineHeight:1}}>{Math.round(heading)}° {dirLabel(heading)}</div><div style={{fontSize:fs-3,color:mt,marginTop:2}}>{lang==="tr"?"Pusula":TL("Compass",lang)}</div></>:<div style={{fontSize:fs-3,color:mt}}>{compassErr==="unsupported"?(lang==="tr"?"Pusula desteklenmiyor":TL("No compass",lang)):(lang==="tr"?"Pusula · dokun":TL("Compass · tap",lang))}</div>}
        </div>
      </div>
    </div>
    {showWx&&<div style={{position:"fixed",inset:0,zIndex:360,background:"rgba(0,0,0,.55)",display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={()=>setShowWx(false)}>
      <div onClick={e=>e.stopPropagation()} style={{background:cd,width:"100%",maxWidth:520,maxHeight:"82vh",overflow:"auto",borderRadius:"16px 16px 0 0",padding:16}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}><b style={{fontSize:fs+2,color:tc}}>{lang==="tr"?"Hava Durumu":TL("Weather",lang)}</b><button onClick={()=>setShowWx(false)} style={{background:"none",border:"none",color:mt,fontSize:20,cursor:"pointer"}}>✕</button></div>
        {weather&&weather.cur?<>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}><span style={{fontSize:46}}>{wxIcon(weather.cur.weather_code)}</span><div><div style={{fontSize:fs+18,fontWeight:800,color:tc,lineHeight:1}}>{Math.round(weather.cur.temperature_2m)}°</div><div style={{fontSize:fs-2,color:mt,marginTop:3}}>{lang==="tr"?"Şu an":TL("Now",lang)}{weather.cur.wind_speed_10m!=null?` · 💨 ${Math.round(weather.cur.wind_speed_10m)} km/s`:""}</div></div></div>
          <div style={{fontSize:fs-1,fontWeight:700,color:tc,margin:"6px 0 4px"}}>{lang==="tr"?"Saatlik (24 saat)":TL("Hourly (24h)",lang)}</div>
          <div style={{display:"flex",gap:10,overflowX:"auto",paddingBottom:6}}>{(()=>{const H=weather.hourly;const nk=new Date().toISOString().slice(0,13);let st=H.time.findIndex(x=>x.slice(0,13)>=nk);if(st<0)st=0;return H.time.slice(st,st+24).map((x,i)=>{const idx=st+i;return <div key={x} style={{flex:"0 0 auto",textAlign:"center",minWidth:44}}><div style={{fontSize:fs-3,color:mt}}>{x.slice(11,16)}</div><div style={{fontSize:20,margin:"2px 0"}}>{wxIcon(H.weather_code[idx])}</div><div style={{fontSize:fs-2,fontWeight:700,color:tc}}>{Math.round(H.temperature_2m[idx])}°</div></div>;});})()}</div>
          <div style={{fontSize:fs-1,fontWeight:700,color:tc,margin:"12px 0 4px"}}>{lang==="tr"?"7 Günlük (haftalık)":TL("7-Day (weekly)",lang)}</div>
          <div>{weather.daily.time.map((x,i)=>{const d=new Date(x+"T00:00");const wd=d.toLocaleDateString(lc,{weekday:"long"});return <div key={x} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${bd}`}}><span style={{fontSize:fs-1,color:tc,flex:1,textTransform:"capitalize"}}>{i===0?(lang==="tr"?"Bugün":TL("Today",lang)):wd}</span><span style={{fontSize:20,width:36,textAlign:"center"}}>{wxIcon(weather.daily.weather_code[i])}</span><span style={{fontSize:fs-1,color:mt,width:88,textAlign:"right"}}>{Math.round(weather.daily.temperature_2m_min[i])}° / <b style={{color:tc}}>{Math.round(weather.daily.temperature_2m_max[i])}°</b></span></div>;})}</div>
        </>:<div style={{color:mt,fontSize:fs-1,padding:"24px 0",textAlign:"center"}}>{weather&&weather.err?(<><div>{lang==="tr"?"Hava durumu için konum gerekiyor.":TL("Weather needs your location.",lang)}</div><button onClick={()=>loadWeather(true)} style={{marginTop:12,padding:"10px 18px",borderRadius:12,border:"none",background:ac,color:onAc,fontWeight:700,fontSize:fs,cursor:"pointer"}}>📍 {lang==="tr"?"Konumu Etkinleştir":TL("Enable Location",lang)}</button></>):(lang==="tr"?"Yükleniyor…":TL("Loading…",lang))}</div>}
        <div style={{fontSize:fs-4,color:mt,marginTop:12,textAlign:"center"}}>{weather&&weather.approx?(lang==="tr"?"📍 yaklaşık konum · ":TL("📍 approximate · ",lang)):""}Open-Meteo</div>
      </div>
    </div>}
    {/* Live Health summary (auto, timestamped, instant sync) */}
    {(()=>{
      const mm=[["weight",lang==="tr"?"Kilo":TL("Weight",lang),"kg","⚖️"],["pulse",lang==="tr"?"Nabız":TL("Pulse",lang),"bpm","❤️"],["bp",lang==="tr"?"Tansiyon":TL("BP",lang),"mmHg","🩸"],["spo2","SpO₂","%","🫁"],["glucose",lang==="tr"?"Şeker":TL("Glucose",lang),"mg/dL","🍬"],["hba1c","HbA1c","%","🧪"]];
      const rows=mm.map(([k,lbl,u,ic])=>{const ser=(k==="glucose"?(glucose||[]).map(r=>({ts:r.ts,val:r.val})):(healthLog||[]).filter(x=>x.type===k).map(x=>({ts:x.ts,val:x.val,meta:x.meta}))).slice().sort((a,b)=>a.ts-b.ts);if(!ser.length)return null;return {k,lbl,u,ic,last:ser[ser.length-1],spark:ser.slice(-8).map(x=>x.val)};}).filter(Boolean);
      if(!rows.length)return null;
      return <div style={{...CS}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}><b style={{fontSize:fs,color:tc}}>📈 {lang==="tr"?"Canlı Sağlık":TL("Live Health",lang)}</b><button onClick={()=>goTo("health")} style={{background:"none",border:"none",color:acTx,fontSize:fs-2,cursor:"pointer",fontWeight:700}}>{lang==="tr"?"Rapor →":TL("Report →",lang)}</button></div>
        {rows.map(r=>{const mn=Math.min(...r.spark),mx=Math.max(...r.spark);const vv=r.k==="bp"?`${r.last.val}/${(r.last.meta&&r.last.meta.d)||"?"}`:r.last.val;const dt=new Date(r.last.ts);
          return <div key={r.k} style={{display:"flex",alignItems:"center",gap:9,padding:"6px 0",borderBottom:`1px solid ${bd}`}}>
            <span style={{fontSize:17,width:20,flexShrink:0}}>{r.ic}</span>
            <div style={{flex:"0 0 58px",minWidth:0}}><div style={{fontSize:fs-2,color:tc,fontWeight:600}}>{r.lbl}</div><div style={{fontSize:fs-4,color:mt}}>{dt.toLocaleDateString(lc,{day:"2-digit",month:"2-digit"})} {dt.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}</div></div>
            {r.spark.length>=2?<svg width="56" height="20" viewBox="0 0 56 20" preserveAspectRatio="none" style={{flex:1,maxWidth:80}}><polyline fill="none" stroke={ac} strokeWidth="1.6" points={r.spark.map((v,i,a)=>`${(i/(a.length-1))*56},${18-((v-mn)/((mx-mn)||1))*16}`).join(" ")}/></svg>:<div style={{flex:1}}/>}
            <span style={{flexShrink:0,fontWeight:800,color:tc,fontSize:fs+1}}>{vv} <span style={{fontSize:fs-4,color:mt,fontWeight:400}}>{r.u}</span></span>
          </div>;})}
        <div style={{fontSize:fs-4,color:mt,marginTop:6,textAlign:"center"}}>{lang==="tr"?"Otomatik tarihlenir · anlık güncellenir":TL("Auto-timestamped · live",lang)}</div>
      </div>;})()}
    {/* Health + Med Progress strip */}
    {/* Comprehensive Health Score Card — matches Health page */}
    <div style={{...CS,padding:14,border:`1px solid ${ac}33`,cursor:"pointer"}} onClick={()=>goTo("health")}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
        <span style={{fontWeight:700,fontSize:fs+1,display:"flex",alignItems:"center",gap:6}}>🏆 {t.hScore}</span>
        <span style={{fontSize:fs-3,color:mt}}>→</span>
      </div>
      <div style={{textAlign:"center",marginBottom:10}}>
        <div style={{fontSize:fs+20,fontWeight:800,color:hscore>70?sc:hscore>40?acTx:hscore>0?dg:mt,lineHeight:1}}>{hscore||"—"}<span style={{fontSize:fs-1,color:mt,fontWeight:400}}>/100</span></div>
        <div style={{fontSize:fs,fontWeight:600,color:hscore>80?sc:hscore>60?acTx:hscore>40?"#f0a030":hscore>0?dg:mt,marginTop:4}}>
          {hscore>80?(lang==="tr"?"Mükemmel 🌟":TL("Excellent 🌟",lang)):hscore>60?(lang==="tr"?"İyi 💪":TL("Good 💪",lang)):hscore>40?(lang==="tr"?"Orta ⚠️":TL("Average ⚠️",lang)):hscore>0?(lang==="tr"?"Dikkat! 🔴":TL("Attention! 🔴",lang)):(lang==="tr"?"Veri girin":TL("Enter data",lang))}
        </div>
      </div>
      {hscore>0&&<div style={{display:"flex",flexDirection:"column",gap:6}}>
        {[
          {icon:"❤️",label:t.pulse,val:hd.pulse,max:25,score:hd.pulse>=60&&hd.pulse<=100?25:hd.pulse>=50&&hd.pulse<=110?12:hd.pulse>0?5:0,status:hd.pulse>=60&&hd.pulse<=100},
          {icon:"⚖️",label:"BMI",val:bmi,max:22,score:bmi>=18.5&&bmi<25?22:bmi>=17&&bmi<30?10:bmi>0?5:0,status:bmi>=18.5&&bmi<25},
          {icon:"🩺",label:t.bp,val:hd.bpS>0?`${hd.bpS}/${hd.bpD}`:0,max:25,score:hd.bpS>=90&&hd.bpS<=120&&hd.bpD>=60&&hd.bpD<=80?25:hd.bpS>=85&&hd.bpS<=140&&hd.bpD>=55&&hd.bpD<=90?12:hd.bpS>0?5:0,status:hd.bpS>=90&&hd.bpS<=120},
          {icon:"💊",label:t.prog,val:`${medProg}%`,max:15,score:medProg>=80?15:medProg>50?10:medProg>0?5:0,status:medProg>=80}
        ].map(item=>item.val?(
          <div key={item.label} style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:16,width:20}}>{item.icon}</span>
            <div style={{flex:1}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:fs-2}}>
                <span style={{color:mt}}>{item.label}: <strong style={{color:tc}}>{item.val}</strong></span>
                <span style={{fontWeight:700,color:item.status?sc:item.score>0?acTx:dg}}>{item.score}/{item.max}</span>
              </div>
              <div style={{height:4,background:`${mt}22`,borderRadius:2,marginTop:2}}><div style={{height:"100%",borderRadius:2,background:item.status?sc:item.score>0?ac:dg,width:`${(item.score/item.max)*100}%`,transition:"width .5s"}}/></div>
            </div>
          </div>
        ):null)}
        {(allergyCount>0||chronicCount>0)&&<div style={{marginTop:6,padding:"6px 8px",borderRadius:6,background:`${dg}08`,fontSize:fs-3,color:mt,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:4}}>
          <span>⚠️ {lang==="tr"?"Risk":TL("Risk",lang)}: {allergyCount>0&&`${allergyCount} ${lang==="tr"?"alerji":TL("allergies",lang)}`}{allergyCount>0&&chronicCount>0&&", "}{chronicCount>0&&`${chronicCount} ${lang==="tr"?"kronik":TL("chronic",lang)}`}</span>
          <span style={{color:dg,fontWeight:700}}>−{riskPenalty}</span>
        </div>}
        {wellnessBonus>0&&<div style={{padding:"6px 8px",borderRadius:6,background:`${sc}08`,fontSize:fs-3,color:mt,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span>✨ {lang==="tr"?"Wellness":TL("Wellness",lang)}: {lang==="tr"?"su, uyku, adım":TL("water, sleep, steps",lang)}</span>
          <span style={{color:sc,fontWeight:700}}>+{wellnessBonus}</span>
        </div>}
      </div>}
      {hscore===0&&<div style={{fontSize:fs-2,color:mt,textAlign:"center",padding:"8px 0"}}>{lang==="tr"?"Sağlık verilerinizi girin":TL("Enter your health data",lang)}</div>}
    </div>
    {/* Next Med + Next Appt — only if data exists */}
    {<div style={{display:"grid",gridTemplateColumns:nextMed&&nextAppt?"1fr 1fr":"1fr",gap:6}}>
      {<div onClick={()=>goTo("medTime")} style={{...CS,cursor:"pointer",padding:"12px",border:`1px solid ${ac}33`,background:`${ac}06`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
          <span style={{fontWeight:800,fontSize:fs,color:acTx}}>💊 {lang==="tr"?"İlaç Zamanı":TL("Med Time",lang)}</span>
          <span style={{fontSize:fs-2,color:sc,fontWeight:700}}>{meds.filter(m=>m.taken).length}/{meds.length} {lang==="tr"?"Alındı":TL("Taken",lang)}</span>
        </div>
        <div style={{height:6,background:`${mt}30`,borderRadius:3,overflow:"hidden",marginBottom:6}}>
          <div style={{height:"100%",background:`linear-gradient(90deg,${ac},${sc})`,borderRadius:3,width:`${meds.length?(meds.filter(m=>m.taken).length/meds.length)*100:0}%`,transition:"width 0.5s"}}/>
        </div>
        {nextMed?<div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:22,animation:"pulse 2s infinite"}}>⏰</span>
          <div style={{flex:1}}>
            <div style={{fontWeight:700,fontSize:fs-1}}>{nextMed.name} — {nextMed.dose}</div>
            <div style={{fontSize:fs-3,color:mt}}>{pat.name?pat.name.split(" ")[0]+", ":""}{nextMed.name} {(()=>{const[mH,mM]=(nextMed.time||"00:00").split(":").map(Number);const nowM=now.getHours()*60+now.getMinutes();const medM=mH*60+mM;const diff=nowM-medM;if(diff>0&&diff<120)return lang==="tr"?`${diff} dk geçti. İlacını aldıysan onay ver.`:`${diff} min passed. Confirm if taken.`;if(diff>=120)return lang==="tr"?`${Math.floor(diff/60)} saat ${diff%60} dk geçti!`:`${Math.floor(diff/60)}h ${diff%60}m passed!`;return lang==="tr"?"saatin yaklaşıyor!":TL("time approaching!",lang);})()}</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontWeight:800,fontSize:fs+1,color:acTx}}>{nextMed.time}</div>
            {nextMed.count>0&&<div style={{fontSize:fs-3,color:nextMed.count<=5?dg:sc}}>📦 {nextMed.count} {lang==="tr"?"kaldı":TL("left",lang)}</div>}
          </div>
        </div>
        :<div style={{fontSize:fs-2,color:mt,textAlign:"center",padding:4}}>{meds.length===0?(lang==="tr"?"İlaç eklemek için tıklayın":TL("Tap to add medicine",lang)):(lang==="tr"?"Tüm ilaçlar alındı! ✅":TL("All meds taken! ✅",lang))}</div>}
      </div>}
      {nextAppt&&<div onClick={()=>goTo("appts")} style={{...CS,cursor:"pointer",padding:"10px",display:"flex",alignItems:"center",gap:8}}>
        <span style={{fontSize:20}}>📅</span>
        <div style={{flex:1,minWidth:0}}><div style={{fontWeight:700,fontSize:fs-1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{nextAppt.doctor}</div><div style={{color:sc,fontSize:fs-2}}>{nextAppt.date} {nextAppt.time}</div></div>
      </div>}
    </div>}
    {/* Calendar */}
    <div style={{...CS,padding:"8px 10px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
        <button aria-label={lang==="tr"?"Önceki ay":TL("Previous month",lang)} onClick={()=>{if(calM===0){setCalM(11);setCalY(y=>y-1);}else setCalM(m=>m-1);}} style={{background:"none",border:"none",color:acTx,cursor:"pointer",fontSize:14}}>◀</button>
        <span style={{fontWeight:700,fontSize:fs-1}}>{[t.jan,t.feb,t.mar,t.apr,t.may,t.jun,t.jul,t.aug,t.sep,t.oct,t.nov,t.dec][calM]} {calY}</span>
        <button aria-label={lang==="tr"?"Sonraki ay":TL("Next month",lang)} onClick={()=>{if(calM===11){setCalM(0);setCalY(y=>y+1);}else setCalM(m=>m+1);}} style={{background:"none",border:"none",color:acTx,cursor:"pointer",fontSize:14}}>▶</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:1,textAlign:"center"}}>
        {[t.su,t.mo,t.tu,t.we,t.th,t.fr,t.sa].map(d=><div key={d} style={{fontSize:11,color:mt,fontWeight:700}}>{d}</div>)}
        {[...Array(new Date(calY,calM,1).getDay()).fill(null),...Array.from({length:new Date(calY,calM+1,0).getDate()},(_,i)=>i+1)].map((d,i)=>{
          if(!d)return <div key={`e${i}`}/>;
          const iso=`${calY}-${String(calM+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
          const isToday=d===now.getDate()&&calM===now.getMonth()&&calY===now.getFullYear();
          const hasAppt=apptDates.includes(iso);
          const dayOfWeek=new Date(calY,calM,d).getDay();const isWeekend=dayOfWeek===0||dayOfWeek===6;const holKey=`${String(calM+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;const holiday=HOLIDAYS[holKey];const hasNote=calNotes[iso];const hasAlarm=calAlarms[iso];
          return <div key={i} onClick={()=>{setSelDate(selDate===iso?null:iso);setCalNoteText(calNotes[iso]||"");setCalAlarmTime(calAlarms[iso]||"");}} style={{fontSize:12,padding:"3px 0",borderRadius:5,background:isToday?ac:holiday?`${sc}25`:hasAppt?`${dg}22`:isWeekend?"rgba(255,180,0,0.1)":"transparent",color:isToday?onAc:holiday?sc:hasAppt?dg:isWeekend?"#f0a030":tc,fontWeight:isToday||hasAppt||isWeekend?700:400,position:"relative",cursor:"pointer"}}>{d}{hasAppt&&<span style={{position:"absolute",bottom:-1,left:"50%",transform:"translateX(-50%)",width:3,height:3,borderRadius:"50%",background:dg,display:"block"}}/>}{hasNote&&<span style={{position:"absolute",top:-1,right:1,width:3,height:3,borderRadius:"50%",background:sc,display:"block"}}/>}{hasAlarm&&<span style={{position:"absolute",top:-1,left:1,width:3,height:3,borderRadius:"50%",background:"#f0a030",display:"block"}}/>}</div>;
        })}
      </div>
    </div>
    {/* Calendar Date Panel */}
    {selDate&&<div style={{...CS,border:`2px solid ${ac}`,marginTop:4,padding:"10px 12px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
        <span style={{fontWeight:700,fontSize:fs,color:acTx}}>📅 {selDate}{(()=>{const h=HOLIDAYS[selDate?.substring(5)];return h?<span style={{marginLeft:6,color:sc,fontSize:fs-2}}>🎉 {h[lang]||h.en}</span>:null;})()}</span>
        <button onClick={()=>setSelDate(null)} style={{background:"none",border:"none",color:mt,cursor:"pointer",fontSize:16}}>✕</button>
      </div>
      <div style={{marginBottom:6}}>
        <div style={{fontSize:fs-2,color:mt,marginBottom:2}}>📝 {t.notes||"Not"}</div>
        <div style={{display:"flex",gap:6,alignItems:"flex-start"}}><textarea value={calNoteText} onChange={e=>setCalNoteText(e.target.value)} onInput={autoResize} onBlur={()=>{if(calNoteText.trim())setCalNotes(p=>({...p,[selDate]:calNoteText}));else{const n={...calNotes};delete n[selDate];setCalNotes(n);}}} placeholder={lang==="tr"?"Not ekle...":TL("Add note...",lang)} rows={2} style={{...IS,fontSize:fs-1,resize:"none",minHeight:36,maxHeight:100}}/><DictateBtn value={calNoteText} onChange={v=>setCalNoteText(v)}/></div>
      </div>
      <div style={{display:"flex",gap:6,alignItems:"center"}}>
        <span style={{fontSize:fs-2,color:mt}}>⏰</span>
        <input type="time" aria-label={lang==="tr"?"Saat":TL("Time",lang)} value={calAlarmTime} onChange={e=>{setCalAlarmTime(e.target.value);if(e.target.value)setCalAlarms(p=>({...p,[selDate]:e.target.value}));else{const a={...calAlarms};delete a[selDate];setCalAlarms(a);}}} style={{...IS,width:100,padding:"4px 8px"}}/>
        {calAlarms[selDate]&&<span style={{fontSize:fs-3,color:sc}}>✓ {t.alarmSet||"Alarm"}</span>}
      </div>
      {appts.filter(a=>a.date===selDate).map(a=><div key={a.id} style={{marginTop:6,padding:"6px 8px",borderRadius:8,background:`${dg}11`,fontSize:fs-2}}>🏥 {a.doctor} — {a.time}</div>)}
    </div>}
    {/* Word Learning */}
    <div style={{...CS,padding:"10px 12px",background:`linear-gradient(135deg,${ac}08,${sc}08)`,border:`1px solid ${ac}22`}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
        <span style={{fontWeight:700,fontSize:fs-1}}>📚 {lang==="tr"?"Günün Kelimesi":TL("Word of the Day",lang)}</span>
        <div style={{display:"flex",gap:3}}>{Object.entries(TOPIC_NAMES).map(([k,v])=><button key={k} onClick={()=>setWordTopic(k)} style={{padding:"2px 6px",borderRadius:6,fontSize:fs-3,border:wordTopic===k?`1px solid ${ac}`:`1px solid ${bd}`,background:wordTopic===k?`${ac}15`:"transparent",color:wordTopic===k?acTx:mt,cursor:"pointer",fontWeight:wordTopic===k?700:400}}>{v[lang]||v.en}</button>)}</div>
        <div style={{display:"flex",gap:4,alignItems:"center"}}>
          <div style={{position:"relative"}}>
            <button onClick={()=>setShowWordLangPicker(!showWordLangPicker)} style={{background:`${ac}15`,border:`1px solid ${bd}`,borderRadius:8,padding:"3px 10px",fontSize:fs-2,color:acTx,cursor:"pointer",fontWeight:600,display:"flex",alignItems:"center",gap:4}}><Flag code={(EXT_LANGS.find(l=>l.k===wordLang)||{flag:wordLang}).flag} size={14}/> {(EXT_LANGS.find(l=>l.k===wordLang)||{n:wordLang}).n} ▾</button>
            {showWordLangPicker&&<div style={{position:"absolute",right:0,top:28,background:cd,border:`1px solid ${bd}`,borderRadius:10,boxShadow:`0 4px 16px rgba(0,0,0,.3)`,zIndex:50,padding:4,width:200,maxHeight:280,overflowY:"auto"}}>{EXT_LANGS.filter(l=>l.k!==lang).map(l=><button key={l.k} onClick={()=>{setWordLang(l.k);setShowWordLangPicker(false);}} style={{display:"flex",alignItems:"center",gap:6,width:"100%",padding:"6px 10px",background:wordLang===l.k?`${ac}15`:"transparent",border:"none",borderRadius:6,fontSize:fs-2,color:tc,cursor:"pointer"}}><Flag code={l.flag} size={14}/><span style={{fontWeight:wordLang===l.k?700:400,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{l.n}</span></button>)}</div>}
          </div>
          <button aria-label={lang==="tr"?"Sonraki":TL("Next",lang)} onClick={()=>setWordIdx(p=>(p+1)%WORDS.length)} style={{background:"none",border:`1px solid ${bd}`,borderRadius:8,padding:"3px 10px",cursor:"pointer",color:acTx,fontSize:fs-1}}>→</button>
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
          <span style={{fontSize:fs+8,fontWeight:800,color:acTx}}>{WORDS[wordIdx]?.[wordLang]||WORDS[wordIdx]?.en}</span>
        </div>
        <div style={{fontSize:fs-3,color:mt,marginTop:4}}>{(LL_LOCAL[lang]||LL_LOCAL.en)[lang]} → {(LL_LOCAL[lang]||LL_LOCAL.en)[wordLang]}</div>
      </div>
    </div>
    {/* AI Translator — Google Translate Style 2-Panel */}
    <div style={{...CS,padding:10,position:"relative"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
        <div style={{fontWeight:700,fontSize:fs,display:"flex",alignItems:"center",gap:6}}><img src={GLOBE_IMG} alt="" aria-hidden="true" style={{width:20,height:20,borderRadius:10}}/> {lang==="tr"?"Çeviri":lang==="en"?"Translator":lang==="de"?"Übersetzer":lang==="ru"?"Переводчик":lang==="zh"?"翻译":lang==="hi"?"अनुवादक":lang==="nl"?"Vertaler":lang==="es"?"Traductor":lang==="ar"?"مترجم":"Translator"}</div>
        <span style={{fontSize:fs-3,color:acTx,fontWeight:500}}>60+ {lang==="tr"?"Dil":TL("Lang",lang)}</span>
      </div>
      {/* Language selector bar — src ↔ tgt */}
      <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
        {/* Source selector */}
        <button onClick={()=>{setTrShowSrcPick(!trShowSrcPick);setTrShowTgtPick(false);setTrSearch("");}} style={{flex:1,padding:"9px 10px",borderRadius:10,border:`1px solid ${trShowSrcPick?ac:bd}`,background:dark?"#0d1520":"#f8fafc",color:tc,display:"flex",alignItems:"center",gap:6,cursor:"pointer",fontSize:fs-2,minWidth:0}}>
          {(()=>{const s=EXT_LANGS.find(l=>l.k===trSrc);return s?<><Flag code={s.flag} size={20}/><span style={{flex:1,textAlign:"left",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",fontWeight:600}}>{s.n}</span></>:null;})()}
          <span style={{color:mt,fontSize:fs-2}}>▾</span>
        </button>
        {/* Swap button */}
        <button onClick={()=>{const nSrc=trTgt,nTgt=trSrc;setTrSrc(nSrc);setTrTgt(nTgt);setTrIn(trResult||"");setTrResult(trIn||"");}} style={{padding:"8px 10px",borderRadius:10,border:`1px solid ${ac}44`,background:`${ac}11`,color:acTx,cursor:"pointer",fontSize:16,flexShrink:0}} title={lang==="tr"?"Dilleri Değiştir":TL("Swap languages",lang)}>⇄</button>
        {/* Target selector */}
        <button onClick={()=>{setTrShowTgtPick(!trShowTgtPick);setTrShowSrcPick(false);setTrSearch("");}} style={{flex:1,padding:"9px 10px",borderRadius:10,border:`1px solid ${trShowTgtPick?ac:bd}`,background:dark?"#0d1520":"#f8fafc",color:tc,display:"flex",alignItems:"center",gap:6,cursor:"pointer",fontSize:fs-2,minWidth:0}}>
          {(()=>{const s=EXT_LANGS.find(l=>l.k===trTgt);return s?<><Flag code={s.flag} size={20}/><span style={{flex:1,textAlign:"left",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",fontWeight:600}}>{s.n}</span></>:null;})()}
          <span style={{color:mt,fontSize:fs-2}}>▾</span>
        </button>
      </div>
      {/* Language picker dropdown */}
      {(trShowSrcPick||trShowTgtPick)&&<div style={{position:"absolute",top:88,left:10,right:10,background:cd,border:`1px solid ${ac}`,borderRadius:10,boxShadow:"0 8px 24px rgba(0,0,0,.3)",zIndex:200,padding:6,maxHeight:340,overflow:"hidden",display:"flex",flexDirection:"column"}}>
        <input autoFocus placeholder={lang==="tr"?"Dil ara...":TL("Search language...",lang)} value={trSearch} onChange={e=>setTrSearch(e.target.value)} style={{...IS,marginBottom:6,fontSize:fs-1}}/>
        <div style={{overflowY:"auto",maxHeight:270}}>
          {EXT_LANGS.filter(l=>{
            const q=trSearch.toLowerCase().trim();
            if(!q)return true;
            return l.n.toLowerCase().includes(q)||l.k.includes(q)||l.code.toLowerCase().includes(q);
          }).map(l=><button key={l.k} onClick={()=>{if(trShowSrcPick){setTrSrc(l.k);setTrShowSrcPick(false);}else{setTrTgt(l.k);setTrShowTgtPick(false);}setTrSearch("");}} style={{display:"flex",alignItems:"center",gap:8,width:"100%",padding:"8px 10px",background:((trShowSrcPick&&trSrc===l.k)||(trShowTgtPick&&trTgt===l.k))?`${ac}22`:"transparent",border:"none",borderRadius:6,cursor:"pointer",color:tc,fontSize:fs-1,textAlign:"left"}}>
            <Flag code={l.flag} size={22}/>
            <span style={{flex:1,fontWeight:((trShowSrcPick&&trSrc===l.k)||(trShowTgtPick&&trTgt===l.k))?700:400,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{l.n}</span>
            {((trShowSrcPick&&trSrc===l.k)||(trShowTgtPick&&trTgt===l.k))&&<span style={{color:acTx}}>✓</span>}
          </button>)}
        </div>
      </div>}
      {/* Two-panel editor — source | target */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:6}}>
        {/* Source panel */}
        <div style={{background:dark?"#0d1520":"#f8fafc",borderRadius:10,padding:8,border:`1px solid ${bd}`,minHeight:120,display:"flex",flexDirection:"column"}}>
          <div style={{display:"flex",alignItems:"center",gap:4,marginBottom:4,fontSize:fs-3,color:mt}}>
            <Flag code={(EXT_LANGS.find(l=>l.k===trSrc)||{}).flag} size={14}/>
            <span style={{fontWeight:600}}>{(EXT_LANGS.find(l=>l.k===trSrc)||{n:trSrc}).n}</span>
          </div>
          <div style={{display:"flex",gap:6,alignItems:"flex-start"}}><textarea value={trIn} onChange={e=>{setTrIn(e.target.value);setTrResult("");}} placeholder={lang==="tr"?"Metin girin...":TL("Enter text...",lang)} style={{flex:1,border:"none",background:"transparent",color:tc,fontSize:fs-1,outline:"none",resize:"none",minHeight:80,fontFamily:"inherit",wordBreak:"break-word",direction:trSrc==="ar"||trSrc==="he"||trSrc==="fa"||trSrc==="ur"?"rtl":"ltr"}}/><DictateBtn value={trIn} onChange={v=>{setTrIn(v);setTrResult("");}}/></div>
          {trIn&&<div style={{display:"flex",gap:4,marginTop:4}}>
            <SpeakBtn text={trIn}/>
            <button onClick={()=>copyTxt(trIn)} title={lang==="tr"?"Kopyala":TL("Copy",lang)} style={{background:"none",border:`1px solid ${bd}`,borderRadius:6,padding:"3px 6px",cursor:"pointer",fontSize:12,color:tc}}>📋</button>
            <button onClick={()=>{setTrIn("");setTrResult("");}} title={lang==="tr"?"Temizle":TL("Clear",lang)} style={{background:"none",border:`1px solid ${bd}`,borderRadius:6,padding:"3px 6px",cursor:"pointer",fontSize:12,color:mt,marginLeft:"auto"}}>✕</button>
          </div>}
        </div>
        {/* Target panel */}
        <div style={{background:dark?"#12344d":"#e8f4fd",borderRadius:10,padding:8,border:`1px solid ${ac}44`,minHeight:120,display:"flex",flexDirection:"column"}}>
          <div style={{display:"flex",alignItems:"center",gap:4,marginBottom:4,fontSize:fs-3,color:acTx}}>
            <Flag code={(EXT_LANGS.find(l=>l.k===trTgt)||{}).flag} size={14}/>
            <span style={{fontWeight:700}}>{(EXT_LANGS.find(l=>l.k===trTgt)||{n:trTgt}).n}</span>
          </div>
          <div style={{flex:1,fontSize:fs-1,color:tc,whiteSpace:"pre-wrap",wordBreak:"break-word",direction:trTgt==="ar"||trTgt==="he"||trTgt==="fa"||trTgt==="ur"?"rtl":"ltr"}}>
            {trLoad?<span style={{color:mt,fontStyle:"italic"}}>⏳ {lang==="tr"?"Çevriliyor...":TL("Translating...",lang)}</span>:(trResult||<span style={{color:mt,fontStyle:"italic"}}>{lang==="tr"?"Çeviri burada görünecek":TL("Translation appears here",lang)}</span>)}
          </div>
          {trResult&&<div style={{display:"flex",gap:4,marginTop:4}}>
            <SpeakBtn text={trResult} langCode={(EXT_LANGS.find(l=>l.k===trTgt)||{code:"en"}).code}/>
            <button onClick={()=>copyTxt(trResult)} title={lang==="tr"?"Kopyala":TL("Copy",lang)} style={{background:"none",border:`1px solid ${ac}44`,borderRadius:6,padding:"3px 6px",cursor:"pointer",fontSize:12,color:acTx}}>📋</button>
          </div>}
        </div>
      </div>
      {/* Translate button */}
      <button onClick={async()=>{
        if(!trIn.trim())return;
        if(trSrc===trTgt){setTrResult(trIn);return;}
        setTrLoad(true);
        const srcObj=EXT_LANGS.find(l=>l.k===trSrc);
        const tgtObj=EXT_LANGS.find(l=>l.k===trTgt);
        const srcCode=srcObj?.code||"auto";
        const tgtCode=tgtObj?.code||"en";
        try{
          // 1) Try AI (server proxy OR user key) — best quality, unlimited
          try{
            const d=await callAI({model:"claude-haiku-4-5-20251001",max_tokens:800,messages:[{role:"user",content:`Translate the following text from ${srcObj?.n||srcCode} to ${tgtObj?.n||tgtCode}. Return ONLY the translated text, no explanations, no quotes.\n\nText: ${trIn}`}]},apiKey);
            const out=d.content?.map(c=>c.text||"").join("").trim()||"";
            if(out){setTrResult(out);setTrLoad(false);return;}
          }catch(aiErr){/* AI unavailable — fall through to free service */}
          // 2) Fallback: MyMemory free API
          const res=await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(trIn)}&langpair=${encodeURIComponent(srcCode)}|${encodeURIComponent(tgtCode)}&de=ailvie@example.com`);
          const j=await res.json();
          const tx=(j?.responseData?.translatedText||"").toString();
          const up=tx.toUpperCase();
          if(tx&&!up.includes("PLEASE SELECT")&&!up.includes("INVALID")&&!up.includes("MYMEMORY WARNING")&&!up.includes("USED ALL")){
            setTrResult(tx);
          }else if(up.includes("MYMEMORY WARNING")||up.includes("USED ALL")){
            setTrResult(lang==="tr"?"⚠️ Ücretsiz çeviri günlük limiti doldu. Sınırsız çeviri için Ayarlar'dan AI API anahtarı ekleyin.":TL("⚠️ Free translation daily limit reached. Add an AI API key in Settings for unlimited translation.",lang));
          }else{
            setTrResult(lang==="tr"?"⚠️ Çeviri başarısız. Dil kombinasyonu desteklenmeyebilir.":TL("⚠️ Translation failed. Language pair may not be supported.",lang));
          }
        }catch(err){
          setTrResult(lang==="tr"?"⚠️ Çeviri servisi şu an kullanılamıyor.":TL("⚠️ Translation service unavailable.",lang));
        }
        setTrLoad(false);
      }} disabled={trLoad||!trIn.trim()} style={{...BP,width:"100%",padding:"10px",fontSize:fs,fontWeight:700,opacity:(trLoad||!trIn.trim())?0.6:1}}>
        {trLoad?"⏳ "+(lang==="tr"?"Çevriliyor...":TL("Translating...",lang)):"🌐 "+(lang==="tr"?"Çevir":lang==="en"?"Translate":lang==="de"?"Übersetzen":lang==="ru"?"Перевести":lang==="zh"?"翻译":lang==="hi"?"अनुवाद":lang==="nl"?"Vertalen":lang==="es"?"Traducir":lang==="ar"?"ترجمة":"Translate")}
      </button>
      <div style={{fontSize:fs-4,color:mt,textAlign:"center",marginTop:4}}>{lang==="tr"?"60+ dilde anında çeviri • MyMemory + AILVIE AI":TL("60+ languages • MyMemory + AILVIE AI",lang)}</div>
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
    <button onClick={()=>{setEditApptId(null);setNewAppt(EMPTY_APPT);apptDraftIdRef.current=null;setShowAddAppt(true);}} style={{...CS,border:`2px solid ${ac}`,textAlign:"center",cursor:"pointer",padding:14,background:`${ac}06`}}>
      <span style={{fontSize:24}}>📝</span>
      <div style={{fontWeight:700,color:acTx,marginTop:4}}>+ {t.addAppt}</div>
    </button>
    {showAddAppt&&<div style={{...CS,border:`2px solid ${ac}`}}>
      <input placeholder={t.dr} value={newAppt.doctor} onChange={e=>setNewAppt({...newAppt,doctor:e.target.value})} style={{...IS,marginBottom:6}}/>
      <input placeholder={t.hosp} value={newAppt.hospital} onChange={e=>setNewAppt({...newAppt,hospital:e.target.value})} style={{...IS,marginBottom:6}}/>
      <input placeholder={t.clin} value={newAppt.clinic} onChange={e=>setNewAppt({...newAppt,clinic:e.target.value})} style={{...IS,marginBottom:6}}/>
      <div style={{display:"flex",gap:6,marginBottom:6}}><input type="date" aria-label={lang==="tr"?"Tarih":TL("Date",lang)} value={newAppt.date} onChange={e=>setNewAppt({...newAppt,date:e.target.value})} style={{...IS,flex:1}}/><input type="time" aria-label={lang==="tr"?"Saat":TL("Time",lang)} value={newAppt.time} onChange={e=>setNewAppt({...newAppt,time:e.target.value})} style={{...IS,flex:1}}/></div>
      <div style={{display:"flex",gap:6}}><button onClick={()=>{apptDraftIdRef.current=null;setNewAppt(EMPTY_APPT);setEditApptId(null);setShowAddAppt(false);}} style={BP}>{lang==="tr"?"Bitti":TL("Done",lang)}</button><button onClick={()=>{if(!editApptId&&apptDraftIdRef.current!=null){const id=apptDraftIdRef.current;setAppts(p=>p.filter(x=>x.id!==id));}apptDraftIdRef.current=null;setNewAppt(EMPTY_APPT);setEditApptId(null);setShowAddAppt(false);}} style={{...BP,background:mt}}>{t.cancel}</button></div>
    </div>}
    {/* 3. Upcoming / Past */}
    <div style={{display:"flex",gap:6}}>{["up","past"].map(tab=><button key={tab} onClick={()=>goTo(tab==="up"?"appts":"appts")} style={pill(true)}>{t[tab]}</button>)}</div>
    {appts.filter(a=>a.date>=today).length===0&&<div style={{textAlign:"center",color:mt,padding:16}}>{t.noA}</div>}
    {appts.filter(a=>a.date>=today).map(a=>(<div key={a.id} style={CS}><div style={{fontWeight:700,fontSize:fs+1}}>{a.doctor}</div><div style={{fontSize:fs-1,color:mt}}>🏥 {a.hospital} • {a.clinic}</div><div style={{color:acTx}}>📅 {a.date} ⏰ {a.time}</div><div style={{fontSize:fs-3,color:sc,marginTop:2}}>🔔 1 gün + 6 saat önce alarm</div><div style={{display:"flex",gap:6,marginTop:6,flexWrap:"wrap"}}><a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(a.hospital)}`} target="_blank" rel="noopener noreferrer" aria-label={`${t.dir} ${a.hospital}`} style={{...BP,padding:"6px 12px",textDecoration:"none"}}>🗺️ {t.dir}</a><a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(a.hospital)}&travelmode=transit`} target="_blank" rel="noopener noreferrer" style={{...BP,padding:"6px 12px",background:sc,color:onSc,textDecoration:"none"}}>🚌</a><button onClick={()=>{setEditApptId(a.id);setNewAppt({doctor:a.doctor||"",hospital:a.hospital||"",clinic:a.clinic||"",date:a.date||"",time:a.time||""});setShowAddAppt(true);}} style={{background:"none",border:`1px solid ${ac}33`,color:acTx,borderRadius:8,padding:"6px 12px",cursor:"pointer"}}>✏️ {lang==="tr"?"Düzenle":TL("Edit",lang)}</button><button onClick={()=>toTrash("appt",a)} style={{background:"none",border:`1px solid ${dg}33`,color:dg,borderRadius:8,padding:"6px 12px",cursor:"pointer"}}>🗑️</button></div></div>))}
    {/* 4. AI Location + Transit */}
    <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
      <button onClick={getLoc} style={{...BP,padding:"6px 12px"}}>📍 {t.loc}</button>
      {[{n:"IETT",u:"https://www.iett.istanbul"},{n:"TfL",u:"https://tfl.gov.uk"},{n:"Moovit",u:"https://moovitapp.com"}].map(l=><a key={l.n} href={l.u} target="_blank" rel="noopener noreferrer" style={{...BP,padding:"6px 12px",background:sc,color:onSc,textDecoration:"none"}}>{l.n}</a>)}
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
    <div style={{fontWeight:800,fontSize:fs+4,color:acTx}}>{lang==="tr"?"İlaç Zamanı":TL("Med Time",lang)}</div>
    <div style={{fontSize:fs-2,color:mt}}>{pat.name?pat.name+", ":""}{pending.length>0?(lang==="tr"?`${pending.length} ilaç bekliyor`:`${pending.length} meds pending`):(lang==="tr"?"Tüm ilaçlar alındı! ✅":TL("All meds taken! ✅",lang))}</div>
  </div>

  {/* Progress */}
  <div style={{...CS,padding:"12px"}}>
    <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
      <span style={{fontWeight:700,fontSize:fs-1}}>{lang==="tr"?"Günlük İlerleme":TL("Daily Progress",lang)}</span>
      <span style={{fontWeight:800,color:sc}}>{taken.length}/{meds.length}</span>
    </div>
    <div style={{height:10,background:`${mt}25`,borderRadius:5,overflow:"hidden"}}>
      <div style={{height:"100%",background:`linear-gradient(90deg,${ac},${sc})`,borderRadius:5,width:`${meds.length?(taken.length/meds.length)*100:0}%`,transition:"width 0.5s"}}/>
    </div>
  </div>

  {/* Pending Meds — Timer Cards */}
  {pending.length>0&&<div style={{fontWeight:700,fontSize:fs,color:dg,marginTop:4}}>🔴 {lang==="tr"?"Bekleyen İlaçlar":TL("Pending Meds",lang)}</div>}
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
            <span style={{fontSize:fs-3,color:acTx,fontWeight:600}}>📦 {m.count||30} {lang==="tr"?"kaldı":TL("left",lang)}</span>
          </div>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontWeight:800,fontSize:fs+4,color:isNear?dg:ac}}>{m.time}</div>
          <div style={{fontSize:fs-2,fontWeight:700,color:isNear?dg:isPast?"#f97316":sc}}>
            {isPast?(lang==="tr"?"GEÇTİ!":TL("OVERDUE!",lang)):minLeft<=0?(lang==="tr"?"ŞİMDİ!":TL("NOW!",lang)):`${minLeft} ${lang==="tr"?"dk":TL("min",lang)}`}
          </div>
        </div>
      </div>
      {/* Personalized reminder */}
      {isNear&&<div style={{marginTop:8,padding:"8px 10px",borderRadius:8,background:`${dg}12`,fontSize:fs-1,color:dg,fontWeight:600}}>
        🗣️ {pat.name?pat.name.split(" ")[0]+", ":""}{m.name} {lang==="tr"?"saatin yaklaşıyor! "+minLeft+" dakika sonra kullanmayı unutma!":"time is near! Don't forget in "+minLeft+" minutes!"}
      </div>}
      {/* Actions */}
      <div style={{display:"flex",gap:6,marginTop:8}}>
        <button onClick={()=>{
          const nm=m.name?.trim().toLowerCase();
          // Find minimum count across all same-named meds (they should share stock)
          const allSame=meds.filter(x=>x.name?.trim().toLowerCase()===nm);
          const minCount=Math.min(...allSame.map(x=>x.count??30));
          const newCount=Math.max(0,minCount-1);
          // Set ALL same-named meds to newCount so they stay synchronized
          setMeds(p=>p.map(x=>{
            const sameMed=x.name?.trim().toLowerCase()===nm;
            if(x.id===m.id){return{...x,taken:true,count:newCount};}
            if(sameMed){return{...x,count:newCount};}
            return x;
          }));
          notify("✅ "+m.name+" "+(lang==="tr"?"alındı":TL("taken",lang))+" ("+(lang==="tr"?"Kalan":TL("Left",lang))+": "+newCount+")");
          speakAlarm(m.name+" "+(lang==="tr"?"alındı":TL("taken",lang)));
        }} style={{...BP,flex:1,padding:"10px",fontSize:fs,fontWeight:700}}>✅ {lang==="tr"?"Aldım":TL("Taken",lang)}</button>
        <button onClick={()=>speakAlarm((pat.name||"")+", "+m.name+" "+m.dose+" "+(lang==="tr"?"saatin yaklaşıyor!":TL("time is near!",lang)))} style={{background:`${ac}15`,border:`1px solid ${ac}`,borderRadius:10,padding:"10px 14px",cursor:"pointer",fontSize:16}}>🔊</button>
      </div>
    </div>);
  })}

  {/* Taken Meds */}
  {taken.length>0&&<div style={{fontWeight:700,fontSize:fs,color:sc,marginTop:4}}>✅ {lang==="tr"?"Alınan İlaçlar":TL("Taken Meds",lang)}</div>}
  {taken.map(m=>(<div key={m.id} style={{...CS,opacity:0.5,display:"flex",alignItems:"center",gap:10}}>
    <span style={{fontSize:20}}>✅</span>
    <div style={{flex:1}}>
      <div style={{fontWeight:700,textDecoration:"line-through"}}>{m.name}</div>
      <div style={{fontSize:fs-2,color:mt}}>{m.dose} — {m.time}</div>
    </div>
    <button onClick={()=>setMeds(p=>p.map(x=>x.id===m.id?{...x,taken:false}:x))} style={{background:"none",border:`1px solid ${bd}`,borderRadius:8,padding:"4px 10px",cursor:"pointer",color:mt,fontSize:fs-2}}>↩️</button>
  </div>))}

  {/* Add Med shortcut */}
  <button onClick={()=>goTo("meds")} style={{...CS,border:`2px dashed ${ac}33`,cursor:"pointer",textAlign:"center",padding:"14px",color:acTx,fontWeight:600}}>
    💊 {lang==="tr"?"İlaç Ekle / Düzenle":TL("Add / Edit Meds",lang)} →
  </button>
</div>);};


// Maps a medicine name to a technique guide, if one applies.
const guideForMed=(name)=>{
  const n=fold(name||"");
  if(/inhaler|inhalasyon|sprey|ventolin|salbutamol|seretide|symbicort|pulmicort|foster|flixotide/.test(n))return "inhaler";
  if(/insulin|insülin|lantus|levemir|humalog|novorapid|apidra|tresiba|toujeo|glargine|aspart|lispro/.test(n))return "insulin";
  return null;
};
const renderMeds=()=>(<div style={{display:"flex",flexDirection:"column",gap:10}}>
  {/* İlaç Zamanı Alert */}
  {meds.some(m=>!m.taken)&&<div style={{...CS,background:`${dg}12`,border:`1px solid ${dg}33`,display:"flex",alignItems:"center",gap:10,padding:"10px 12px"}}>
    <span style={{fontSize:28,animation:"pulse 1.5s infinite"}}>⏰</span>
    <div>
      <div style={{fontWeight:700,fontSize:fs,color:dg}}>{lang==="tr"?"İlaç Zamanı":TL("Med Time",lang)}</div>
      <div style={{fontSize:fs-2,color:mt}}>{meds.filter(m=>!m.taken).length} {lang==="tr"?"bekliyor":TL("pending",lang)}</div>
    </div>
  </div>}
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontWeight:700,fontSize:fs+2}}>💊 {t.meds}</span><button onClick={()=>setShowAddChooser(true)} style={{...BP,padding:"8px 16px"}}>+ {t.addMed}</button></div>
  <input ref={photoInputRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>{const f=e.target.files&&e.target.files[0];scanFromPhoto(f);e.target.value="";}}/>
  {/* Add-med chooser: Manuel / Tarayarak Ekle (Foto, QR, Barkod) */}
  {showAddChooser&&<div style={{position:"fixed",inset:0,zIndex:340,background:"rgba(0,0,0,.5)",display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={()=>setShowAddChooser(false)}>
    <div onClick={e=>e.stopPropagation()} style={{background:cd,width:"100%",maxWidth:460,borderRadius:"18px 18px 0 0",padding:"16px 16px max(env(safe-area-inset-bottom),18px)",border:`1px solid ${bd}`,boxShadow:"0 -8px 32px rgba(0,0,0,.4)"}}>
      <div style={{width:38,height:4,borderRadius:2,background:bd,margin:"0 auto 14px"}}/>
      <div style={{fontWeight:700,fontSize:fs+2,marginBottom:12}}>💊 {t.addMed}</div>
      <button onClick={()=>{setShowAddChooser(false);setEditMedId(null);setNewMed(EMPTY_MED);medDraftIdRef.current=null;setShowAddMed(true);}} style={{...CS,display:"flex",alignItems:"center",gap:12,width:"100%",cursor:"pointer",border:`1px solid ${bd}`,marginBottom:10,textAlign:"left"}}>
        <span style={{fontSize:24}}>✏️</span><div><div style={{fontWeight:600,color:tc}}>{lang==="tr"?"Manuel Ekle":TL("Add Manually",lang)}</div><div style={{fontSize:fs-2,color:mt}}>{lang==="tr"?"Bilgileri elle girin":TL("Enter details by hand",lang)}</div></div>
      </button>
      <div style={{fontSize:fs-2,color:mt,fontWeight:600,margin:"4px 0 8px"}}>📷 {t.scanAdd}</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
        <button onClick={()=>{setShowAddChooser(false);photoInputRef.current&&photoInputRef.current.click();}} style={{...CS,display:"flex",flexDirection:"column",alignItems:"center",gap:6,cursor:"pointer",border:`1px solid ${bd}`,padding:"16px 6px"}}><span style={{fontSize:28}}>🖼️</span><span style={{fontSize:fs-1,fontWeight:600,color:tc}}>{lang==="tr"?"Fotoğraf":TL("Photo",lang)}</span><span style={{fontSize:fs-3,color:mt}}>{lang==="tr"?"AI ile tanı":TL("AI recognize",lang)}</span></button>
        <button onClick={()=>{setShowAddChooser(false);startScanner();}} style={{...CS,display:"flex",flexDirection:"column",alignItems:"center",gap:6,cursor:"pointer",border:`1px solid ${bd}`,padding:"16px 6px"}}><span style={{fontSize:28}}>📷</span><span style={{fontSize:fs-1,fontWeight:600,color:tc}}>{lang==="tr"?"Kamera":TL("Camera",lang)}</span><span style={{fontSize:fs-3,color:mt}}>QR / {lang==="tr"?"Barkod":TL("Barcode",lang)}</span></button>
      </div>
      <button onClick={()=>setShowAddChooser(false)} style={{...BP,width:"100%",marginTop:14,background:"transparent",border:`1px solid ${bd}`,color:mt}}>{t.cancel}</button>
    </div>
  </div>}
  {/* AI recognition review — confirm/edit before adding */}
  {recog&&<div style={{position:"fixed",inset:0,zIndex:345,background:"rgba(0,0,0,.55)",display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={()=>setRecog(null)}>
    <div onClick={e=>e.stopPropagation()} style={{background:cd,width:"100%",maxWidth:420,borderRadius:16,padding:18,border:`1px solid ${ac}`,boxShadow:"0 12px 40px rgba(0,0,0,.45)"}}>
      <div style={{fontWeight:700,fontSize:fs+2,marginBottom:4}}>✅ {lang==="tr"?"İlaç tanındı":TL("Medication recognized",lang)}</div>
      <div style={{fontSize:fs-2,color:mt,marginBottom:14}}>{lang==="tr"?"Bilgileri kontrol edin, gerekirse düzeltin.":TL("Check the details and correct if needed.",lang)}</div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        <div><div style={{fontSize:fs-2,color:mt,marginBottom:3}}>{lang==="tr"?"İlaç adı":TL("Name",lang)}</div><input value={recog.name} onChange={e=>setRecog(r=>({...r,name:e.target.value}))} style={{width:"100%",padding:"10px 12px",borderRadius:10,border:`1px solid ${bd}`,background:dark?"#0d1520":"#f8fafc",color:tc,fontSize:fs}}/></div>
        <div style={{display:"flex",gap:10}}>
          <div style={{flex:1}}><div style={{fontSize:fs-2,color:mt,marginBottom:3}}>{lang==="tr"?"Doz":TL("Dose",lang)}</div><input value={recog.dose} onChange={e=>setRecog(r=>({...r,dose:e.target.value}))} placeholder={lang==="tr"?"örn 5 mg":TL("e.g. 5 mg",lang)} style={{width:"100%",padding:"10px 12px",borderRadius:10,border:`1px solid ${bd}`,background:dark?"#0d1520":"#f8fafc",color:tc,fontSize:fs}}/></div>
          <div style={{flex:1}}><div style={{fontSize:fs-2,color:mt,marginBottom:3}}>{lang==="tr"?"Form":TL("Form",lang)}</div><input value={recog.form} onChange={e=>setRecog(r=>({...r,form:e.target.value}))} placeholder={lang==="tr"?"tablet/şurup":TL("tablet/syrup",lang)} style={{width:"100%",padding:"10px 12px",borderRadius:10,border:`1px solid ${bd}`,background:dark?"#0d1520":"#f8fafc",color:tc,fontSize:fs}}/></div>
        </div>
        <div><div style={{fontSize:fs-2,color:mt,marginBottom:3}}>{lang==="tr"?"Etken madde":TL("Active ingredient",lang)}</div><input value={recog.ingredient} onChange={e=>setRecog(r=>({...r,ingredient:e.target.value}))} style={{width:"100%",padding:"10px 12px",borderRadius:10,border:`1px solid ${bd}`,background:dark?"#0d1520":"#f8fafc",color:tc,fontSize:fs}}/></div>
        {recog.verifying&&<div style={{fontSize:fs-2,color:mt}}>🔎 {lang==="tr"?"Küresel veritabanında doğrulanıyor…":TL("Verifying in global database…",lang)}</div>}
        {recog.verified&&<div style={{fontSize:fs-2,color:sc,lineHeight:1.4}}>✓ {lang==="tr"?"RxNav/OpenFDA doğrulandı":TL("Verified via RxNav/OpenFDA",lang)}{recog.inn?` · INN: ${recog.inn}`:""}</div>}
        {recog.verified===false&&!recog.verifying&&<div style={{fontSize:fs-3,color:mt,lineHeight:1.4}}>ℹ️ {lang==="tr"?"Küresel veritabanında bulunamadı (yerel ilaç olabilir)":TL("Not in global database (may be a local drug)",lang)}</div>}
      </div>
      <div style={{display:"flex",gap:10,marginTop:16}}>
        <button onClick={()=>{const rc=recog;setRecog(null);photoInputRef.current&&photoInputRef.current.click();}} style={{...BP,flexShrink:0,background:"transparent",border:`1px solid ${bd}`,color:mt,padding:"11px 14px"}}>🔄 {lang==="tr"?"Yeniden":TL("Retry",lang)}</button>
        <button onClick={()=>{const rc=recog;setNewMed(pr=>({...pr,name:rc.name,dose:rc.dose}));setDrugQ(rc.inn||rc.ingredient||rc.name);const db=DR[(rc.ingredient||"").toLowerCase()];if(db){const raw=db[lang]||db.tr||db.en;if(raw)setDrugRes(pD(raw));}setRecog(null);notify(`✅ ${lang==="tr"?"İlaç eklendi":TL("Added",lang)}: ${rc.name}`);setShowAddMed(true);}} disabled={!recog.name.trim()} style={{...BP,flex:1,padding:"11px",opacity:recog.name.trim()?1:.5}}>{lang==="tr"?"Ekle":TL("Add",lang)} →</button>
      </div>
      <button onClick={()=>setRecog(null)} style={{...BP,width:"100%",marginTop:8,background:"transparent",border:"none",color:mt,fontSize:fs-1}}>{t.cancel}</button>
    </div>
  </div>}
  {/* QR/Barcode Scanner View */}
  {showScanner&&<div style={{...CS,border:`2px solid ${sc}`,overflow:"hidden",position:"relative"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8,gap:6}}>
      <span style={{fontWeight:700,color:sc}}>📷 {camOn?t.scanning:t.scanQR}</span>
      <div style={{display:"flex",gap:6}}>
        {camOn&&<button onClick={captureFrameAndRecognize} style={{...BP,padding:"5px 10px",background:`linear-gradient(135deg,${sc},#1a7a6e)`,fontSize:fs-2}}>🔎 AI</button>}
        <button onClick={()=>photoInputRef.current&&photoInputRef.current.click()} style={{...BP,padding:"5px 9px",background:`linear-gradient(135deg,${ac},#c08a0f)`,fontSize:fs-2}}>🖼️</button>
        <button onClick={stopScanner} style={{...BP,padding:"5px 10px",background:`linear-gradient(135deg,${dg},#c1121f)`,fontSize:fs-2}}>{t.stopScan}</button>
      </div>
    </div>
    {camOn&&<div style={{position:"relative",borderRadius:10,overflow:"hidden",background:"#000",aspectRatio:"4/3"}}>
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
    </div>}
    <div style={{fontSize:fs-2,color:mt,textAlign:"center",marginTop:6}}>{camOn?(lang==="tr"?"Barkod/QR'ı çerçeveye getirin • tanınmazsa 🔎 AI ile kutuyu okutun":TL("Frame the barcode/QR • if not found, tap 🔎 AI to read the box",lang)):(lang==="tr"?"📷 Kamera: canlı tara • 🖼️ Foto: galeriden/çekerek • ⌨️ aşağıdan manuel":TL("📷 Camera: live scan • 🖼️ Photo: gallery/capture • ⌨️ manual below",lang))}</div>
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
      <div style={{fontSize:fs-1,color:acTx}}>{t.dose}: {scanResult.dose}</div>
      <div style={{fontSize:fs-2,color:mt,marginTop:4}}>{lang==="tr"?"↓ İlaç bilgileri aşağıda gösteriliyor":TL("↓ Drug info shown below",lang)}</div>
    </div>}
    {!scanResult.found&&<div style={{fontSize:fs-2,color:mt}}>{lang==="tr"?"Bu barkod veritabanımızda yok. İlaç adını manuel olarak aratabilirsiniz.":TL("This barcode is not in our database. You can search the drug name manually.",lang)}</div>}
    <button onClick={()=>setScanResult(null)} style={{background:"none",border:"none",color:mt,cursor:"pointer",fontSize:fs-2,marginTop:6}}>✕ {lang==="tr"?"Kapat":TL("Close",lang)}</button>
  </div>}
  {meds.length===0&&!showScanner&&<div style={{textAlign:"center",color:mt,padding:24}}>{t.noM}</div>}
  {meds.map(m=>(<div key={m.id} style={{...CS,display:"flex",alignItems:"center",gap:10,opacity:m.taken?0.5:1}}>
    <div style={{textAlign:"center"}}><span style={{fontSize:22}}>{m.taken?"✅":"💊"}</span>{m.count>0&&!m.taken&&<div style={{fontSize:fs-4,color:m.count<=5?dg:sc,fontWeight:700,marginTop:1}}>{m.count}</div>}
      {guideForMed(m.name)&&<button onClick={(e)=>{e.stopPropagation();startGuide(guideForMed(m.name));}}
        aria-label={lang==="tr"?`${m.name} kullanım rehberi`:`${m.name} technique guide`}
        title={lang==="tr"?"Nasıl kullanılır?":TL("How to use",lang)}
        style={{marginTop:4,background:"transparent",border:`1px solid ${acTx}`,color:acTx,borderRadius:7,padding:"1px 5px",fontSize:fs-4,cursor:"pointer",lineHeight:1.4}}>🔊</button>}</div>
    <div style={{flex:1,minWidth:0}}><div style={{fontWeight:700,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{m.name}</div><div style={{fontSize:fs-2,color:mt}}>{m.dose} — ⏰ {m.time}</div><div style={{fontSize:fs-3,color:sc}}>{m.alarmType==="ring"?"🔔":m.alarmType==="vibrate"?"📳":"🔔📳"} {m.count>0&&<span style={{color:m.count<=5?dg:mt}}>({lang==="tr"?"Kalan":TL("Left",lang)}: {m.count})</span>}</div></div>
    {!m.taken&&<button onClick={()=>{
      const nm=m.name?.trim().toLowerCase();
      const allSame=meds.filter(x=>x.name?.trim().toLowerCase()===nm);
      const minCount=Math.min(...allSame.map(x=>x.count??30));
      const newCount=Math.max(0,minCount-1);
      setMeds(p=>p.map(x=>{
        const sameMed=x.name?.trim().toLowerCase()===nm;
        if(x.id===m.id){return{...x,taken:true,count:newCount};}
        if(sameMed){return{...x,count:newCount};}
        return x;
      }));
      notify(`✅ ${m.name} ${t.taken} (${lang==="tr"?"Kalan":TL("Left",lang)}: ${newCount})`);
    }} style={{...BP,padding:"6px 12px"}}>✓</button>}
    <button onClick={()=>{setEditMedId(m.id);setNewMed({name:m.name||"",dose:m.dose||"",time:m.time||"",startDate:m.startDate||"",alarmType:m.alarmType||"both",count:m.count||30,timesPerDay:m.timesPerDay||1,recurring:m.recurring!==false});setShowAddMed(true);}} style={{background:"none",border:`1px solid ${ac}33`,borderRadius:8,padding:"4px 8px",cursor:"pointer",fontSize:14,color:acTx}}>✏️</button>
    <button onClick={()=>toTrash("med",m)} style={{background:"none",border:"none",color:dg,cursor:"pointer",fontSize:16}}>🗑️</button>
  </div>))}
  {showAddMed&&<div style={{...CS,border:`2px solid ${ac}`}}>
    <input placeholder={t.nm} value={newMed.name} onChange={e=>setNewMed({...newMed,name:e.target.value})} style={{...IS,marginBottom:6}}/>
    <input placeholder={t.dose} value={newMed.dose} onChange={e=>setNewMed({...newMed,dose:e.target.value})} style={{...IS,marginBottom:6}}/>
    <div style={{display:"flex",gap:6,marginBottom:6}}>
      <div style={{flex:1}}><div style={{fontSize:fs-3,color:mt,marginBottom:2}}>📅 {lang==="tr"?"Başlangıç":TL("Start",lang)}</div><input type="date" aria-label={lang==="tr"?"Tarih":TL("Date",lang)} value={newMed.startDate} onChange={e=>setNewMed({...newMed,startDate:e.target.value})} style={IS}/></div>
      <div style={{flex:1}}><div style={{fontSize:fs-3,color:mt,marginBottom:2}}>⏰ {t.time}</div><input type="time" aria-label={lang==="tr"?"Saat":TL("Time",lang)} value={newMed.time} onChange={e=>setNewMed({...newMed,time:e.target.value})} style={IS}/></div>
    </div>
    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6,padding:"8px 10px",borderRadius:8,background:newMed.recurring?`${sc}12`:`${mt}08`,border:`1px solid ${newMed.recurring?sc:bd}`,cursor:"pointer"}} onClick={()=>setNewMed({...newMed,recurring:!newMed.recurring})}>
      <button style={{width:36,height:20,borderRadius:10,background:newMed.recurring?sc:bd,border:"none",cursor:"pointer",position:"relative",flexShrink:0}}><div style={{width:14,height:14,borderRadius:"50%",background:"#fff",position:"absolute",top:3,left:newMed.recurring?19:3,transition:"left .2s"}}/></button>
      <div><div style={{fontSize:fs-1,fontWeight:600,color:newMed.recurring?sc:mt}}>🔁 {lang==="tr"?"Her gün tekrarla":TL("Repeat daily",lang)}</div>
      <div style={{fontSize:fs-3,color:mt}}>{lang==="tr"?"İlaç bitene kadar her gün aynı saatte alarm":TL("Alarm at same time every day until finished",lang)}</div></div>
    </div>
    <div style={{marginBottom:6}}><div style={{fontSize:fs-2,color:mt,marginBottom:4}}>⏰ {t.alarmType}</div><div style={{display:"flex",gap:6}}>{["ring","vibrate","both"].map(at=><button key={at} onClick={()=>setNewMed({...newMed,alarmType:at})} style={pill(newMed.alarmType===at)}>{at==="ring"?"🔔 "+t.ring:at==="vibrate"?"📳 "+t.vibrate:"🔔📳 "+t.both}</button>)}</div></div>
    <div style={{display:"flex",gap:6,marginBottom:6,alignItems:"center",flexWrap:"wrap"}}><span style={{fontSize:fs-2,color:mt}}>💊 {lang==="tr"?"Kutu adedi":TL("Box count",lang)}:</span><input type="number" min="1" value={newMed.count} onChange={e=>setNewMed({...newMed,count:Number(e.target.value)})} style={{...IS,width:65,textAlign:"center",fontWeight:700}}/><span style={{fontSize:fs-2,color:mt}}>🔁 {lang==="tr"?"Günde":TL("Per day",lang)}:</span><input type="number" min="1" max="6" value={newMed.timesPerDay||1} onChange={e=>setNewMed({...newMed,timesPerDay:Number(e.target.value)})} style={{...IS,width:50,textAlign:"center",fontWeight:700}}/></div>
    {(newMed.timesPerDay||1)>1&&<div style={{fontSize:fs-3,color:acTx,marginBottom:6,padding:"4px 8px",background:`${ac}08`,borderRadius:6}}>💡 {lang==="tr"?`Günde ${newMed.timesPerDay} doz: Her doz için ayrı saat girerek ekleyin.`:`${newMed.timesPerDay} doses/day: Add each dose with a different time.`}</div>}
    <div style={{display:"flex",gap:8}}><button onClick={()=>{medDraftIdRef.current=null;setNewMed(EMPTY_MED);setEditMedId(null);setShowAddMed(false);}} style={BP}>{lang==="tr"?"Bitti":TL("Done",lang)}</button><button onClick={()=>{if(!editMedId&&medDraftIdRef.current!=null){const id=medDraftIdRef.current;setMeds(p=>p.filter(x=>x.id!==id));}medDraftIdRef.current=null;setNewMed(EMPTY_MED);setEditMedId(null);setShowAddMed(false);}} style={{...BP,background:mt}}>{t.cancel}</button></div>
  </div>}
  <div style={{...CS,border:`2px dashed ${ac}33`}}><div style={{fontWeight:700,marginBottom:8}}>🔍 {t.drugR}</div><div style={{display:"flex",gap:8}}><input placeholder={t.drugN} value={drugQ} onChange={e=>setDrugQ(e.target.value)} style={{...IS,flex:1}} onKeyDown={e=>{if(e.key==="Enter")analyzeDrug();}}/><button onClick={analyzeDrug} disabled={drugLoad} style={BP}>{drugLoad?"⏳":t.anlz}</button></div>{drugRes&&<div style={{marginTop:10,display:"flex",flexDirection:"column",gap:5}}>{[[t.cls,"class"],[t.usg,"usage"],[t.dose,"dose"],[t.sEff,"sideEffects"],[t.wrn,"warnings"],[t.intr,"interactions"]].map(([l,k])=><div key={k} style={{fontSize:fs-1}}><span style={{fontWeight:700,color:acTx}}>{l}: </span><span>{drugRes[k]}</span></div>)}</div>}</div>
</div>);

// Settings with tab filtering
const renderSettings=()=>{const s=settingsTab;const all=s==="all";return(<div style={{display:"flex",flexDirection:"column",gap:10}}>
  {!all&&<button onClick={()=>setSettingsTab("all")} style={{background:"none",border:"none",color:acTx,cursor:"pointer",fontSize:fs,textAlign:"left",padding:0}}>← {t.settings}</button>}
  {all&&<span style={{fontWeight:700,fontSize:fs+2}}>⚙️ {t.settings}</span>}
  {(all||s==="all")&&<div style={{...CS,borderLeft:`3px solid ${ac}`}}>
    <div style={{fontWeight:700,marginBottom:4}}>♿ {lang==="tr"?"Erişilebilirlik":TL("Accessibility",lang)}</div>
    <div style={{fontSize:fs-2,color:mt,lineHeight:1.5}}>{lang==="tr"?"Görme güçlüğü yaşıyorsan: sağ üstteki 🎙️ ile AILVIE'yle konuşabilir, sesli diyaloğu açtığında AILVIE yanıtları sesli okur. Aşağıdan yüksek kontrast, büyük yazı ve ekran yakınlaştırma (+/−) seçeneklerini kullanabilirsin. Uygulama TalkBack/VoiceOver ekran okuyucularıyla uyumludur.":TL("If you have low vision: use the 🎙️ button (top right) to talk to AILVIE; with voice dialog on, AILVIE reads answers aloud. Below you'll find high contrast, large text and screen zoom (+/−). The app works with TalkBack/VoiceOver screen readers.",lang)}</div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:10,gap:10}}>
      <span style={{fontSize:fs-1}}>🗣️ {lang==="tr"?"Sesli-öncelikli mod":TL("Voice-first mode",lang)}<div style={{fontSize:fs-4,color:mt}}>{lang==="tr"?"Sayfa değişince adını sesli söyler + titreşim":TL("Announces each screen aloud + haptic",lang)}</div></span>
      <button onClick={()=>{const nv=!voiceFirst;setVoiceFirst(nv);haptic(15);if(nv)speak(lang==="tr"?"Sesli-öncelikli mod açık":TL("Voice-first mode on",lang),lang);}} aria-label={lang==="tr"?"Sesli-öncelikli mod":TL("Voice-first mode",lang)} style={{width:48,height:26,borderRadius:13,background:voiceFirst?ac:bd,border:"none",cursor:"pointer",position:"relative",flexShrink:0}}><div style={{width:20,height:20,borderRadius:"50%",background:"#fff",position:"absolute",top:3,left:voiceFirst?25:3,transition:"left .2s"}}/></button>
    </div>
  </div>}
  {(all||s==="all")&&<>{[{l:`🌙 ${t.dark}`,v:dark,f:()=>setDark(!dark)},{l:`🔆 ${t.hc}`,v:hc,f:()=>setHc(!hc)}].map(x=>(<div key={x.l} style={{...CS,display:"flex",justifyContent:"space-between",alignItems:"center"}}><span>{x.l}</span><button onClick={x.f} aria-label={x.l} style={{width:48,height:26,borderRadius:13,background:x.v?ac:bd,border:"none",cursor:"pointer",position:"relative"}}><div style={{width:20,height:20,borderRadius:"50%",background:"#fff",position:"absolute",top:3,left:x.v?25:3,transition:"left .2s"}}/></button></div>))}
  <div style={CS}><div style={{marginBottom:6}}>📝 {t.fSize}: {fs}</div><div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{[12,13,14,16,18,20,22].map(sz=><button key={sz} onClick={()=>setFs(sz)} aria-label={`${t.fSize} ${sz}`} style={pill(fs===sz)}>{sz}</button>)}</div></div>
  <div style={CS}><div style={{marginBottom:6}}>🌍 {t.lang}</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:4}}>{Object.entries(LL).map(([k,v])=>{const emj={tr:"🇹🇷",en:"🇬🇧",de:"🇩🇪",ru:"🇷🇺",zh:"🇨🇳",hi:"🇮🇳",nl:"🇳🇱",es:"🇪🇸",ar:"🇸🇦",fr:"🇫🇷",pt:"🇵🇹",id:"🇮🇩",bn:"🇧🇩"};return<button key={k} onClick={()=>setLang(k)} style={pill(lang===k)}>{emj[k]||""} {v}</button>;})}</div></div>
  <div style={CS}><div style={{marginBottom:6}}>🤖 AI API Key <span style={{fontSize:fs-3,color:mt}}>(Anthropic)</span></div><div style={{display:"flex",gap:6}}><input type="password" value={apiKey} onChange={e=>{setApiKey(e.target.value);try{localStorage.setItem("ailvie_api_key",e.target.value);}catch(ex){}}} placeholder="sk-ant-..." style={{...IS,flex:1,fontFamily:"monospace",fontSize:fs-2}}/>{apiKey&&<button onClick={()=>{setApiKey("");try{localStorage.removeItem("ailvie_api_key");}catch(ex){}}} style={{background:"none",border:`1px solid ${dg}33`,borderRadius:8,padding:"4px 8px",color:dg,cursor:"pointer"}}>✕</button>}</div><div style={{fontSize:fs-3,color:apiKey?sc:mt,marginTop:4}}>{apiKey?(lang==="tr"?"✓ API anahtarı ayarlandı":TL("✓ API key set",lang)):(lang==="tr"?"AI Sohbet, çeviri ve ilaç analizi için gerekli":TL("Required for AI Chat, translation & drug analysis",lang))}</div></div>
  <div style={CS}><div style={{fontWeight:700,marginBottom:8}}>🚨 {t.emN}</div>{emNums.map(en=>(<div key={en.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px 0",borderBottom:`1px solid ${bd}`}}><span>{en.icon} {emLabel(en)} — <strong>{en.number}</strong></span>{!en.fixed&&<button onClick={()=>{toTrash("emergency",en);notify(lang==="tr"?"Çöp kutusuna taşındı":TL("Moved to Trash",lang));}} style={{background:"none",border:"none",color:dg,cursor:"pointer"}}>✕</button>}</div>))}{emNums.filter(e=>!e.fixed).length<5&&<div style={{display:"flex",gap:6,marginTop:8}}><input placeholder={t.nm} value={newEm.name} onChange={e=>setNewEm({...newEm,name:e.target.value})} style={{...IS,flex:1}}/><input placeholder="Nr" value={newEm.number} onChange={e=>setNewEm({...newEm,number:e.target.value})} style={{...IS,width:80}}/><button onClick={()=>{if(newEm.name&&newEm.number){setEmNums(p=>[...p,{id:Date.now(),...newEm,icon:"📞",fixed:false}]);setNewEm({name:"",number:""});}}} style={{...BP,padding:"8px 14px"}}>+</button></div>}</div></>}
  {(all||s==="perms")&&<div style={CS}><div style={{fontWeight:700,marginBottom:8}}>🛡️ {t.permissions}</div>{[["notif","notifPerm","🔔"],["loc","locPerm","📍"],["mic","micPerm","🎤"],["cam","camPerm","📷"]].map(([k,label,icon])=>(<div key={k} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"4px 0"}}><span>{icon} {t[label]||label}</span><button aria-label={lang==="tr"?"Aç/Kapat":TL("Toggle",lang)} onClick={()=>{const willOn=!perms[k];setPerms(p=>({...p,[k]:willOn}));if(k==="loc"){if(willOn){notify(lang==="tr"?"📍 Konum açılıyor…":TL("📍 Enabling location…",lang));loadWeather(true);}else setWeather({err:"off"});return;}if(k==="notif"){if(willOn&&('Notification'in window)){if(Notification.permission==="denied")notify(lang==="tr"?"⚠️ Bildirim tarayıcıda engelli. Tarayıcı > Site izinleri > Bildirim'i açın.":TL("⚠️ Notifications blocked in browser settings.",lang));else Notification.requestPermission().then(st=>{if(st!=="granted")notify(lang==="tr"?"Bildirim izni verilmedi — tarayıcı ayarlarından açabilirsiniz.":TL("Notification permission not granted.",lang));}).catch(()=>{});}return;}}} style={{width:40,height:22,borderRadius:11,background:perms[k]?sc:bd,border:"none",cursor:"pointer",position:"relative"}}><div style={{width:16,height:16,borderRadius:"50%",background:"#fff",position:"absolute",top:3,left:perms[k]?21:3,transition:"left .2s"}}/></button></div>))}</div>}
  {(all||s==="perms")&&<div style={CS}><div style={{fontWeight:700,marginBottom:8}}>🧹 {lang==="tr"?"İçerik Filtresi":TL("Content Filter",lang)}</div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"4px 0",gap:8}}>
      <span style={{flex:1}}>🔊 {lang==="tr"?"Sesli yönlendirme":TL("Voice guidance",lang)}<div style={{fontSize:fs-3,color:mt,marginTop:2}}>{lang==="tr"?"Ölçüm ve ilaç tekniklerinde adım adım sesli anlatım":TL("Step-by-step spoken coaching for measurements and drug technique",lang)}</div></span>
      <button onClick={()=>setVoiceGuide(v=>!v)} aria-label={lang==="tr"?"Sesli yönlendirme":TL("Voice guidance",lang)} style={{width:40,height:22,borderRadius:11,background:voiceGuide?sc:bd,border:"none",cursor:"pointer",position:"relative",flexShrink:0}}><div style={{width:16,height:16,borderRadius:"50%",background:"#fff",position:"absolute",top:3,left:voiceGuide?21:3,transition:"left .2s"}}/></button>
    </div>
    {voiceGuide&&<div style={{fontSize:fs-4,color:mt,padding:"2px 0 4px",lineHeight:1.5}}>
      {ttsInfo.engine==="azure"
        ? <span style={{color:sc}}>🎙️ {lang==="tr"?"AILVIE doğal sesi (Azure Neural)":TL("AILVIE natural voice (Azure Neural)",lang)}</span>
        : ttsInfo.engine==="browser"
          ? <span>⚠️ {lang==="tr"?`Cihaz sesi kullanılıyor: ${ttsInfo.voice}. Doğal AILVIE sesi için sunucuda Azure anahtarı gerekir.`:`Using device voice: ${ttsInfo.voice}.`}</span>
          : <span>{lang==="tr"?"Ses motoru ilk konuşmada belirlenir.":TL("Voice engine is detected on first speech.",lang)}</span>}
    </div>}

    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"4px 0",gap:8}}>
      <span style={{flex:1}}>🚫 {lang==="tr"?"Küfür / argo maskeleme":TL("Profanity masking",lang)}<div style={{fontSize:fs-3,color:mt,marginTop:2}}>{lang==="tr"?"Toplulukta uygunsuz kelimeler *** ile gizlenir":TL("Hides inappropriate words with *** in Community",lang)}</div></span>
      <button onClick={()=>setProfanityFilter(v=>!v)} aria-label="profanity" style={{width:40,height:22,borderRadius:11,background:profanityFilter?sc:bd,border:"none",cursor:"pointer",position:"relative",flexShrink:0}}><div style={{width:16,height:16,borderRadius:"50%",background:"#fff",position:"absolute",top:3,left:profanityFilter?21:3,transition:"left .2s"}}/></button>
    </div>
  </div>}
  {(all||s==="perms")&&<div style={CS}><div style={{fontWeight:700,marginBottom:8}}>☁️ {lang==="tr"?"Cihazlar Arası Senkron":TL("Cross-device Sync",lang)}</div>
    {!syncCfg
      ? <>
        <div style={{fontSize:fs-3,color:mt,marginBottom:8,lineHeight:1.45}}>{lang==="tr"?"Varsayılan olarak KAPALIDIR. Açarsanız verileriniz CİHAZINIZDA AES-256 ile şifrelenir ve sunucuya yalnızca şifreli hâli gider. Parolanız cihazdan çıkmaz; sunucu (ve biz) verilerinizi okuyamaz.":TL("OFF by default. Data is encrypted on-device; the server cannot read it.",lang)}</div>
        <div style={{background:`${dg}0d`,border:`1px solid ${dg}33`,borderRadius:9,padding:"8px 10px",fontSize:fs-4,color:tc,marginBottom:8,lineHeight:1.45}}>{lang==="tr"?"⚠️ Parolanızı kaybederseniz sunucudaki veriler ÇÖZÜLEMEZ (kurtarma yolu yoktur). Sağlık verisi buluta yüklenir — devam etmeden önce onaylamanız gerekir.":TL("⚠️ No recovery if you lose the password.",lang)}</div>
        <button disabled={syncBusy} onClick={async()=>{
          const L=lang==="tr";
          if(!window.confirm(L?"Sağlık verilerinizin ŞİFRELENMİŞ hâlinin sunucuda saklanmasını onaylıyor musunuz?\n\n• Şifreleme cihazınızda yapılır (AES-256-GCM)\n• Parolanız hiçbir zaman gönderilmez\n• Sunucu içeriği okuyamaz\n• İstediğiniz zaman silebilirsiniz":"Consent to store an encrypted copy on the server?"))return;
          const idf=window.prompt(L?"Senkron kimliği (e-posta veya kullanıcı adı):":"Sync identifier (email or username):",localStorage.getItem("ailvie_account_email")||"");
          if(!idf||!idf.trim())return;
          const pw=window.prompt(L?"Senkron parolası (en az 10 karakter).\nBu parola cihazdan ÇIKMAZ; kaybederseniz veriler açılamaz.":"Sync password (min 10 chars):","");
          if(pw===null)return;
          if(pw.trim().length<10){notify(L?"Parola en az 10 karakter olmalı":"Min 10 characters");return;}
          const pw2=window.prompt(L?"Parolayı tekrar girin:":"Repeat password:","");
          if(pw2!==pw){notify(L?"Parolalar eşleşmedi":"Passwords do not match");return;}
          setSyncBusy(true);
          try{
            const syncId=await makeSyncId(idf);
            const keys=await deriveSyncKeys(pw.trim(),syncId);
            syncKeysRef.current=keys;
            const cfg={syncId,identifier:idf.trim(),updatedAt:0,version:0,lastSync:0,enabledAt:Date.now()};
            try{localStorage.setItem("ailvie_sync",JSON.stringify(cfg));}catch(e){}
            setSyncCfg(cfg);
            notify(L?"☁️ Senkron etkin — 'Yükle' ile başlayın":"☁️ Sync enabled");
          }catch(e){notify(L?"Senkron kurulamadı":"Sync setup failed");}
          finally{setSyncBusy(false);}
        }} style={{...BP,width:"100%",padding:"9px",opacity:syncBusy?0.6:1}}>☁️ {lang==="tr"?"Senkronu Aç (isteğe bağlı)":TL("Enable sync (optional)",lang)}</button>
      </>
      : <>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:fs-2,color:tc,marginBottom:4}}><span>{lang==="tr"?"Durum":TL("Status",lang)}</span><b style={{color:sc}}>✓ {lang==="tr"?"Etkin":TL("Enabled",lang)}</b></div>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:fs-3,color:mt,marginBottom:4}}><span>{lang==="tr"?"Kimlik":TL("Identifier",lang)}</span><span>{syncCfg.identifier}</span></div>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:fs-3,color:mt,marginBottom:8}}><span>{lang==="tr"?"Son senkron":TL("Last sync",lang)}</span><span>{syncCfg.lastSync?new Date(syncCfg.lastSync).toLocaleString(lc):(lang==="tr"?"hiç":TL("never",lang))}</span></div>
        {!syncKeysRef.current&&<button disabled={syncBusy} onClick={async()=>{
          const L=lang==="tr";
          const pw=window.prompt(L?"Senkron parolanızı girin (bu oturum için):":"Enter sync password:","");
          if(pw===null)return;
          setSyncBusy(true);
          try{syncKeysRef.current=await deriveSyncKeys(pw.trim(),syncCfg.syncId);setSyncMsg(L?"🔓 Senkron kilidi açıldı":"🔓 Unlocked");}
          catch(e){setSyncMsg(L?"Parola işlenemedi":"Failed");}
          finally{setSyncBusy(false);}
        }} style={{...BP,width:"100%",padding:"8px",marginBottom:6,background:"transparent",color:acTx,border:`1px solid ${ac}`,opacity:syncBusy?0.6:1}}>🔓 {lang==="tr"?"Parolayı gir (senkron kilidini aç)":TL("Unlock sync",lang)}</button>}
        <div style={{display:"flex",gap:6,marginBottom:6}}>
          <button disabled={syncBusy} onClick={()=>syncPush(false)} style={{...BP,flex:1,padding:"8px",fontSize:fs-2,opacity:syncBusy?0.6:1}}>⬆️ {lang==="tr"?"Yükle":TL("Push",lang)}</button>
          <button disabled={syncBusy} onClick={syncPull} style={{...BP,flex:1,padding:"8px",fontSize:fs-2,background:"transparent",color:acTx,border:`1px solid ${ac}`,opacity:syncBusy?0.6:1}}>⬇️ {lang==="tr"?"İndir":TL("Pull",lang)}</button>
        </div>
        {syncMsg&&<div style={{fontSize:fs-3,color:/❌|başarısız|failed|değil/i.test(syncMsg)?dg:sc,marginBottom:6}}>{syncMsg}</div>}
        <button disabled={syncBusy} onClick={async()=>{
          const L=lang==="tr";
          if(!window.confirm(L?"Senkronu kapat ve sunucudaki şifreli kopyayı SİL?":"Disable sync and delete server copy?"))return;
          setSyncBusy(true);
          try{
            if(syncKeysRef.current)await fetch("/api/sync",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:syncCfg.syncId,authToken:syncKeysRef.current.authTok})});
            try{localStorage.removeItem("ailvie_sync");}catch(e){}
            syncKeysRef.current=null;setSyncCfg(null);setSyncMsg("");
            notify(L?"Senkron kapatıldı":"Sync disabled");
          }catch(e){notify(L?"Sunucu kopyası silinemedi — yerelde kapatıldı":"Server copy not deleted");}
          finally{setSyncBusy(false);}
        }} style={{...BP,width:"100%",padding:"8px",background:dgBg,color:"#fff",fontSize:fs-2,opacity:syncBusy?0.6:1}}>{lang==="tr"?"Senkronu Kapat ve Sunucudan Sil":TL("Disable & delete",lang)}</button>
        <div style={{fontSize:fs-4,color:mt,marginTop:8,lineHeight:1.4}}>{lang==="tr"?"Sunucu yalnızca şifreli veriyi görür (kimlik özeti, şifreli blok, zaman damgası). Parolanız ve anahtarlarınız cihazınızdan çıkmaz.":TL("The server only sees ciphertext.",lang)}</div>
      </>}
  </div>}
  {(all||s==="perms")&&<div style={CS}>
    <div style={{fontWeight:700,marginBottom:6,display:"flex",alignItems:"center",justifyContent:"space-between",gap:8}}>
      <span>🧠 {lang==="tr"?"AILVIE'nin Hafızası":TL("AILVIE's Memory",lang)}</span>
      <button onClick={()=>{const v=!memOn;setMemOn(v);try{v?localStorage.removeItem("ailvie_mem_off"):localStorage.setItem("ailvie_mem_off","1");}catch(e){}}} aria-label="memory" style={{width:40,height:22,borderRadius:11,background:memOn?sc:bd,border:"none",cursor:"pointer",position:"relative",flexShrink:0}}><div style={{width:16,height:16,borderRadius:"50%",background:"#fff",position:"absolute",top:3,left:memOn?21:3,transition:"left .2s"}}/></button>
    </div>
    <div style={{fontSize:fs-3,color:mt,marginBottom:8,lineHeight:1.45}}>{lang==="tr"?"Açıkken AILVIE, konuşmalarınızdan öğrendiği kalıcı notları saklar ve sizi zamanla tanır. Notlar cihazınızda tutulur, PIN açıkken şifrelenir ve AI'ya yanıt üretmek için gönderilir. Her notu görebilir ve silebilirsiniz.":TL("When on, AILVIE keeps durable notes it learns from your conversations so it gets to know you over time. Notes stay on your device, are encrypted when a PIN is set, and are sent to the AI to generate answers. You can read and delete every note.",lang)}</div>
    {!memOn?<div style={{fontSize:fs-2,color:mt,textAlign:"center",padding:8}}>{lang==="tr"?"Hafıza kapalı — AILVIE geçmiş konuşmaları hatırlamıyor.":TL("Memory is off — AILVIE does not remember past conversations.",lang)}</div>
    :aiMem.length===0?<div style={{fontSize:fs-2,color:mt,textAlign:"center",padding:8}}>{lang==="tr"?"Henüz bir şey öğrenmedi. Sohbet ettikçe burası dolacak.":TL("Nothing learned yet. This fills up as you chat.",lang)}</div>
    :<>
      <div style={{display:"flex",flexDirection:"column",gap:5,maxHeight:230,overflowY:"auto"}}>
        {aiMem.map((m,i)=>{
          const lbl={kisi:lang==="tr"?"Kişi":TL("Person",lang),durum:lang==="tr"?"Durum":TL("Condition",lang),iseyaradi:lang==="tr"?"İşe yaradı":TL("Worked",lang),tercih:lang==="tr"?"Tercih":TL("Preference",lang)}[m.k]||m.k;
          return <div key={i} style={{display:"flex",alignItems:"flex-start",gap:6,padding:"6px 8px",borderRadius:7,background:dark?"#0d1520":"#f8fafc"}}>
            <span style={{fontSize:fs-4,color:acTx,fontWeight:700,flexShrink:0,minWidth:62}}>{lbl}</span>
            <span style={{flex:1,fontSize:fs-2,wordBreak:"break-word"}}>{m.t}</span>
            <span style={{fontSize:fs-4,color:mt,flexShrink:0}}>{m.d}</span>
            <button onClick={()=>setAiMem(p=>p.filter((_,j)=>j!==i))} aria-label={t.del} style={{background:"none",border:"none",color:dg,cursor:"pointer",fontSize:fs-2,flexShrink:0,padding:0}}>✕</button>
          </div>;
        })}
      </div>
      <button onClick={()=>{if(window.confirm(lang==="tr"?"AILVIE'nin sizin hakkınızda öğrendiği her şey silinecek. Emin misiniz?":TL("Everything AILVIE has learned about you will be deleted. Are you sure?",lang)))setAiMem([]);}} style={{...BP,width:"100%",marginTop:8,padding:"8px",background:"transparent",color:dg,border:`1px solid ${dg}55`}}>🗑️ {lang==="tr"?"Hafızayı Tamamen Sil":TL("Erase All Memory",lang)}</button>
    </>}
  </div>}
  {(all||s==="perms")&&<div style={CS}><div style={{fontWeight:700,marginBottom:8}}>🔒 {lang==="tr"?"Uygulama Kilidi":TL("App Lock",lang)}</div>
    {!lockCfg
      ? <>
        <div style={{fontSize:fs-3,color:mt,marginBottom:8,lineHeight:1.4}}>{lang==="tr"?"Ekran kilidi ekler ve PIN açıkken sağlık verilerinizi cihazda AES-256 ile şifreler. Anahtar PIN'inizden türetilir ve yalnızca bellekte tutulur; PIN düz metin değil, PBKDF2 özeti olarak saklanır. Not: kısa bir PIN'in koruması sınırlıdır — cihazınızın kendi kilidini/şifrelemesini de açık tutun.":TL("Adds a screen lock and, while the PIN is on, encrypts your health data on the device with AES-256. The key is derived from your PIN and kept only in memory; the PIN itself is stored as a PBKDF2 hash, not plaintext. Note: a short PIN offers limited protection — also keep your device's own lock/encryption on.",lang)}</div>
        <button onClick={async()=>{
          const L=lang==="tr";
          const p1=window.prompt(L?"Yeni PIN (en az 4 rakam):":"New PIN (min 4 digits):","");
          if(p1===null)return;
          if(!/^\d{4,12}$/.test(p1)){notify(L?"PIN 4-12 rakam olmalı":"PIN must be 4-12 digits");return;}
          const p2=window.prompt(L?"PIN'i tekrar girin:":"Repeat PIN:","");
          if(p2!==p1){notify(L?"PIN'ler eşleşmedi":"PINs do not match");return;}
          if(!window.confirm(L?"⚠️ PIN'inizi unutursanız verilerinize erişemezsiniz (kurtarma yolu yoktur). Önce şifreli yedek almanız önerilir. Devam edilsin mi?":"⚠️ No recovery if you forget it. Continue?"))return;
          const rec=await hashPIN(p1);
          let credId=null;
          if(bioAvail&&window.confirm(L?"Biyometrik (parmak izi / yüz) ile de açmak ister misiniz?":"Also enable biometrics?")){
            try{credId=await biometricRegister(pat.name||"AILVIE");}catch(e){notify(L?"Biyometrik kurulamadı — yalnızca PIN etkin":"Biometric setup failed — PIN only");}
          }
          const cfg={pin:rec,credId,graceSec:60,createdAt:Date.now()};
          try{localStorage.setItem("ailvie_lock",JSON.stringify(cfg));}catch(e){}
          setLockCfg(cfg);lastActiveRef.current=Date.now();
          try{dataKeyRef.current=await deriveDataKey(p1,cfg);}catch(e){dataKeyRef.current=null;}
          setPat(pp=>({...pp}));
          notify(L?"🔒 Uygulama kilidi etkin — verileriniz artık cihazda şifreleniyor":"🔒 App lock enabled — your data is now encrypted on device");
        }} style={{...BP,width:"100%",padding:"9px"}}>🔒 {lang==="tr"?"PIN Belirle":TL("Set PIN",lang)}</button>
      </>
      : <>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:fs-2,color:tc,marginBottom:6}}><span>{lang==="tr"?"Durum":TL("Status",lang)}</span><b style={{color:sc}}>✓ {lang==="tr"?"Etkin":TL("Enabled",lang)}</b></div>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:fs-2,color:tc,marginBottom:6}}><span>{lang==="tr"?"Biyometrik":TL("Biometrics",lang)}</span><b style={{color:lockCfg.credId?sc:mt}}>{lockCfg.credId?(lang==="tr"?"Açık":TL("On",lang)):(lang==="tr"?"Kapalı":TL("Off",lang))}</b></div>
        <div style={{fontSize:fs-3,color:mt,marginBottom:6}}>{lang==="tr"?"Kilitlenme süresi (arka planda)":TL("Auto-lock delay",lang)}</div>
        <div style={{display:"flex",gap:6,marginBottom:8}}>{[[0,lang==="tr"?"Hemen":TL("Instant",lang)],[60,"1 dk"],[300,"5 dk"],[900,"15 dk"]].map(([v,l])=>
          <button key={v} onClick={()=>{const c={...lockCfg,graceSec:v};try{localStorage.setItem("ailvie_lock",JSON.stringify(c));}catch(e){}setLockCfg(c);}}
            style={{flex:1,padding:"6px 2px",borderRadius:8,border:`1px solid ${lockCfg.graceSec===v?ac:bd}`,background:lockCfg.graceSec===v?`${ac}22`:"transparent",color:lockCfg.graceSec===v?acTx:mt,fontSize:fs-3,fontWeight:700,cursor:"pointer"}}>{l}</button>)}</div>
        <div style={{display:"flex",gap:6}}>
          <button onClick={()=>setLocked(true)} style={{...BP,flex:1,padding:"8px",background:"transparent",color:acTx,border:`1px solid ${ac}`,fontSize:fs-2}}>{lang==="tr"?"Şimdi Kilitle":TL("Lock now",lang)}</button>
          <button onClick={async()=>{
            const L=lang==="tr";
            const p=window.prompt(L?"Kilidi kaldırmak için mevcut PIN:":"Enter current PIN to remove lock:","");
            if(p===null)return;
            if(!await verifyPIN(p,lockCfg.pin)){notify(L?"PIN yanlış":"Wrong PIN");return;}
            try{dataKeyRef.current=null;const plain=latestPayloadRef.current;if(plain!=null){await idbSet("ailvie_data",plain).catch(()=>{});try{localStorage.setItem("ailvie_data",plain);}catch(e){}}}catch(e){}
            try{localStorage.removeItem("ailvie_lock");}catch(e){}
            setLockCfg(null);setLocked(false);notify(L?"Kilit kaldırıldı — veriler artık şifresiz":"Lock removed — data no longer encrypted");
          }} style={{...BP,flex:1,padding:"8px",background:dgBg,color:"#fff",fontSize:fs-2}}>{lang==="tr"?"Kilidi Kaldır":TL("Remove lock",lang)}</button>
        </div>
      </>}
  </div>}
  {(all||s==="perms")&&<div style={CS}><div style={{fontWeight:700,marginBottom:8}}>💾 {lang==="tr"?"Depolama":TL("Storage",lang)}</div>
    <StorageHealth lang={lang} fs={fs} tc={tc} mt={mt} sc={sc} ac={ac} acTx={acTx} bd={bd} dg={dg} t={t} BP={BP} lastBackup={lastBackup} idbGet={idbGet} idbSet={idbSet} notify={notify}/>
  </div>}
  
  {(all||s==="subs")&&<div style={CS}>
    <div style={{fontWeight:700,marginBottom:6}}>{acctEmail.trim()?(lang==="tr"?"👤 Hesap":TL("👤 Account",lang)):(lang==="tr"?"🔑 Giriş Yap / Abone Ol":TL("🔑 Sign in / Subscribe",lang))}</div>
    {acctEmail.trim()
      ? <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:10,background:`${sc}11`,border:`1px solid ${sc}44`,marginBottom:8}}>
          <span style={{fontSize:22}}>✅</span>
          <div style={{flex:1,minWidth:0}}><div style={{fontSize:fs-2,color:mt}}>{lang==="tr"?"Giriş yapıldı":TL("Signed in",lang)}</div><div style={{fontWeight:600,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{acctEmail}</div></div>
          <button onClick={signOutAcct} style={{...BP,padding:"6px 12px",background:"transparent",border:`1px solid ${bd}`,color:mt,fontSize:fs-2}}>{t.logout}</button>
        </div>
      : <>
          <div style={{fontSize:fs-2,color:mt,marginBottom:10}}>{lang==="tr"?"Bir yöntemle giriş yapın — aboneliğiniz ve (yakında) verileriniz hesabınıza bağlanır.":TL("Sign in with a method — your subscription and (soon) your data link to your account.",lang)}</div>
          <button onClick={()=>signInWith("google")} style={{...BP,width:"100%",marginBottom:8,background:"#fff",color:"#1a2332",border:`1px solid ${bd}`,fontWeight:600}}>🔵 {lang==="tr"?"Google ile devam et":TL("Continue with Google",lang)}</button>
          <button onClick={()=>signInWith("apple")} style={{...BP,width:"100%",marginBottom:8,background:"#000",color:"#fff",fontWeight:600}}> {lang==="tr"?"Apple ile devam et":TL("Continue with Apple",lang)}</button>
          <div style={{display:"flex",alignItems:"center",gap:8,margin:"6px 0",color:mt,fontSize:fs-3}}><div style={{flex:1,height:1,background:bd}}/>{lang==="tr"?"veya e-posta/telefon ile":TL("or with email/phone",lang)}<div style={{flex:1,height:1,background:bd}}/></div>
          <div style={{display:"flex",gap:8}}>
            <input type="text" inputMode="email" autoComplete="email" placeholder={lang==="tr"?"E-posta veya telefon":TL("Email or phone",lang)} value={emailIn} onChange={e=>setEmailIn(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")signInWith("email");}} style={{...IS,flex:1}}/>
            <button onClick={()=>signInWith("email")} style={{...BP}}>{lang==="tr"?"Devam":TL("Continue",lang)}</button>
          </div>
        </>}
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 10px",borderRadius:8,background:`${mt}11`,marginTop:8}}>
      <span style={{fontSize:fs-1}}>{lang==="tr"?"Geçerli plan":TL("Current plan",lang)}</span>
      {(()=>{const pro=(()=>{try{const pl=localStorage.getItem("ailvie_active_plan")||"";return pl.includes("PRO")||pl.includes("Enterprise");}catch(e){return false;}})();return <span style={{fontSize:fs-2,fontWeight:700,padding:"2px 10px",borderRadius:8,background:pro?`${ac}22`:`${mt}22`,color:pro?acTx:mt}}>{pro?"PRO ✓":t.free}</span>;})()}
    </div>
  </div>}
  {(all||s==="subs")&&<div style={CS}>
    <div style={{fontWeight:700,marginBottom:6}}>🔐 {lang==="tr"?"Doğrulama & Güvenlik":TL("Verification & Security",lang)}</div>
    <div style={{fontSize:fs-2,color:mt,marginBottom:10}}>{lang==="tr"?"Hesabını ve verilerini koru. Cihazın yüz/parmak izi ile kilit hazır; diğer yöntemler sunucu kurulduğunda eklenecek.":TL("Protect your account and data. Device face/fingerprint lock is ready; other methods arrive once a server is set up.",lang)}</div>
    {/* Biometric — AVAILABLE (WebAuthn) */}
    <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px",borderRadius:10,border:`1px solid ${appLockEnabled?sc:bd}`,background:appLockEnabled?`${sc}10`:"transparent",marginBottom:8}}>
      <span style={{fontSize:22}}>{appLockEnabled?"🔒":"🫆"}</span>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontWeight:600,fontSize:fs-1}}>{lang==="tr"?"Yüz / Parmak İzi (biyometrik)":TL("Face / Fingerprint (biometric)",lang)}</div>
        <div style={{fontSize:fs-3,color:mt}}>{lang==="tr"?"Bu cihazın kilidiyle açılır — sunucu gerekmez":TL("Unlocks with this device — no server needed",lang)}</div>
      </div>
      {appLockEnabled
        ? <button onClick={disableAppLock} style={{...BP,padding:"6px 12px",fontSize:fs-2,background:"transparent",border:`1px solid ${bd}`,color:mt}}>{lang==="tr"?"Kapat":TL("Disable",lang)}</button>
        : <button onClick={enableAppLock} style={{...BP,padding:"6px 12px",fontSize:fs-2,background:`linear-gradient(135deg,${sc},#1a7a6e)`}}>{lang==="tr"?"Kur":TL("Set up",lang)}</button>}
    </div>
    {/* Backend-dependent methods — honest "coming soon" */}
    {[
      {ic:"💬",name:lang==="tr"?"SMS ile kod":TL("SMS code",lang),note:lang==="tr"?"Telefon doğrulama":TL("Phone verification",lang)},
      {ic:"🟢",name:lang==="tr"?"WhatsApp ile kod":TL("WhatsApp code",lang),note:lang==="tr"?"WhatsApp Business":TL("WhatsApp Business",lang)},
      {ic:"✅",name:lang==="tr"?"Onaylı bildirim (Evet'e dokun / sayı eşleştir)":TL("Push approval (tap-yes / number match)",lang),note:lang==="tr"?"Anlık bildirim onayı":TL("Push notification approval",lang)},
      {ic:"🔢",name:lang==="tr"?"Kod üreteci (Authenticator)":TL("Authenticator (code generator)",lang),note:lang==="tr"?"TOTP 2FA":TL("TOTP 2FA",lang)},
    ].map(m=><div key={m.name} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 10px",borderRadius:10,border:`1px dashed ${bd}`,marginBottom:6,opacity:.75}}>
      <span style={{fontSize:20}}>{m.ic}</span>
      <div style={{flex:1,minWidth:0}}><div style={{fontWeight:600,fontSize:fs-1}}>{m.name}</div><div style={{fontSize:fs-3,color:mt}}>{m.note}</div></div>
      <span style={{fontSize:fs-3,padding:"2px 8px",borderRadius:8,background:`${mt}22`,color:mt,fontWeight:600,whiteSpace:"nowrap"}}>{lang==="tr"?"Yakında":TL("Soon",lang)}</span>
    </div>)}
    <div style={{fontSize:fs-4,color:mt,marginTop:2}}>{lang==="tr"?"SMS/WhatsApp/onaylı bildirim ve authenticator için güvenli sunucu (Firebase/Stripe benzeri) yapılandırması gerekir.":TL("SMS/WhatsApp/push approval and authenticator need a secure server (like Firebase) configured.",lang)}</div>
  </div>}
  {(all||s==="subs")&&<div style={CS}><div style={{fontWeight:700,marginBottom:8}}>💎 {t.subscription}</div>
    {/* Promo Code Redemption */}
    <div style={{padding:"10px 12px",borderRadius:10,background:`${ac}10`,border:`1px solid ${ac}44`,marginBottom:10}}>
      <div style={{fontWeight:700,marginBottom:6,color:acTx,fontSize:fs-1}}>🎁 {lang==="tr"?"PRO Kodu Kullan":TL("Redeem PRO Code",lang)}</div>
      <div style={{display:"flex",gap:6}}>
        <input placeholder={lang==="tr"?"AILVIE-XXXX-XXXX":TL("AILVIE-XXXX-XXXX",lang)} value={promoIn||""} onChange={e=>setPromoIn(e.target.value.toUpperCase())} style={{...IS,flex:1,fontFamily:"monospace",letterSpacing:1}}/>
        <button onClick={()=>{
          const code=(promoIn||"").trim().toUpperCase();
          if(!code){notify("⚠️ "+(lang==="tr"?"Kod girin":TL("Enter a code",lang)));return;}
          try{
            const codes=JSON.parse(localStorage.getItem("ailvie_pro_codes")||"{}");
            const used=JSON.parse(localStorage.getItem("ailvie_pro_codes_used")||"[]");
            if(used.includes(code)){notify("⚠️ "+(lang==="tr"?"Bu kod zaten kullanılmış":TL("Code already used",lang)));return;}
            if(codes[code]){
              const plan=codes[code];
              localStorage.setItem("ailvie_active_plan",plan);
              localStorage.setItem("ailvie_pro_codes_used",JSON.stringify([...used,code]));
              notify("✅ "+(lang==="tr"?`${plan} aktif edildi!`:`${plan} activated!`));
              setPromoIn("");
            }else{
              notify("❌ "+(lang==="tr"?"Geçersiz kod":TL("Invalid code",lang)));
            }
          }catch(err){notify("❌ "+(lang==="tr"?"Hata":TL("Error",lang)));}
        }} style={{...BP,padding:"8px 14px"}}>✓</button>
      </div>
      <div style={{fontSize:fs-3,color:mt,marginTop:4}}>{lang==="tr"?"Geçerli bir promosyon kodu girerek PRO özelliklerine erişin":TL("Enter a valid promo code to unlock PRO features",lang)}</div>
    </div>
    {[
{n:t.free,p:"$0",d:(lang==="tr"?"Kişisel sağlık merkezin — kalıcı ücretsiz":TL("Your health hub — free forever",lang)),c:sc,active:true,features:lang==="tr"?["Sınırsız ilaç, randevu & not","Temel ilaç etkileşim & güvenlik uyarıları","Kamera ile nabız ölçümü","Sağlık takibi & sağlık durumu","İlk yardım & acil rehber","PIN/biyometrik kilit + AES-256 şifreleme","13 dil, cihaz sesi","Günde 5 · ayda 100 AI mesajı"]:["Unlimited meds, appointments & notes","Basic drug interaction & safety alerts","Camera-based pulse measurement","Health tracking & health status","First aid & emergency contacts","PIN/biometric lock + AES-256 encryption","13 languages, device voice","5/day · 100/month AI messages"].map(f=>TL(f,lang))},
{n:"Plus",p:"$4.99/"+t.monthly,d:(lang==="tr"?"$39.99/yıl (%33 indirim) • 7 gün deneme":TL("$39.99/yr (save 33%) • 7-day trial",lang)),c:ac,active:false,features:lang==="tr"?["Ücretsiz'in tamamı +","Ayda 300 AI mesajı","Doğal AILVIE sesi (Azure)","AI çeviri (63 dil)","AI ilaç analizi (kişiye özel)","Reklamsız"]:["Everything in Free +","300 AI messages/month","Natural AILVIE voice (Azure)","AI translation (63 langs)","Personalized AI drug analysis","Ad-free"].map(f=>TL(f,lang))},
{n:"PRO",p:"$8.99/"+t.monthly,d:(lang==="tr"?"$69.99/yıl • 7 gün deneme":TL("$69.99/yr • 7-day trial",lang)),c:"#e8a817",active:false,badge:lang==="tr"?"EN POPÜLER":TL("BEST VALUE",lang),features:lang==="tr"?["Plus'ın tamamı +","Yoğun AI kullanımı (ayda 1.500 mesaj)","Röntgen/tahlil için AI ön açıklama (ayda 30) — tanı değil","Kapsamlı AI sağlık raporu (ayda 10)","Öncelikli yanıt hızı","Cihazlar arası senkron — Yakında","Apple Health / Health Connect — Yakında"]:["Everything in Plus +","Heavy AI usage (1,500 msgs/month)","AI preliminary explanation for X-ray/labs (30/mo) — not a diagnosis","Comprehensive AI health reports (10/mo)","Priority response speed","Cross-device sync — Coming soon","Apple Health / Health Connect — Coming soon"].map(f=>TL(f,lang))},
{n:(lang==="tr"?"Kurumsal":TL("Enterprise",lang)),p:lang==="tr"?"Bize Ulaşın":TL("Contact Us",lang),d:(lang==="tr"?"Klinik, eczane & bakım kuruluşları için":TL("For clinics, pharmacies & care organizations",lang)),c:a2,active:false,features:lang==="tr"?["Yönetim paneli & rol bazlı erişim","Özel marka (white-label)","FHIR/API entegrasyonuna hazır mimari","Öncelikli destek & SLA","Veri koruma uyum desteği"]:["Admin panel & role-based access","Custom branding (white-label)","FHIR/API-ready architecture","Priority support & SLA","Data-protection compliance support"].map(f=>TL(f,lang))}
    ].map(plan=>{
      const isPaid=/\$/.test(plan.p);
      const canWeb=isPaid&&!!CHECKOUT_URL;
      const canContact=!isPaid&&!!CONTACT_EMAIL;
      return (<div key={plan.n} style={{padding:"10px 12px",borderRadius:10,border:`1px solid ${plan.c}44`,marginBottom:8,background:`${plan.c}08`}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
        <span style={{fontWeight:700,color:plan.c}}>{plan.n}{plan.badge&&<span style={{marginLeft:6,fontSize:fs-4,padding:"1px 6px",borderRadius:4,background:plan.c,color:"#fff",fontWeight:700}}>{plan.badge}</span>}</span>
        <div style={{display:"flex",alignItems:"center",gap:6}}>{!plan.active&&!canWeb&&!canContact&&<span style={{fontSize:fs-3,padding:"2px 8px",borderRadius:8,background:`${mt}22`,color:mt,fontWeight:600}}>{lang==="tr"?"Yakında":TL("Soon",lang)}</span>}<span style={{fontWeight:700,fontSize:fs}}>{plan.p}</span></div>
      </div>
      <div style={{fontSize:fs-2,color:mt,marginBottom:6}}>{plan.d}</div>
      {plan.features&&<ul style={{margin:"4px 0 0 0",padding:"0 0 0 18px",fontSize:fs-2,color:tc}}>
        {plan.features.map((f,i)=><li key={i} style={{marginBottom:2}}>{f}</li>)}
      </ul>}
      {plan.active&&<div style={{fontSize:fs-3,color:sc,marginTop:4,fontWeight:600}}>✓ {lang==="tr"?"Aktif Plan":TL("Active Plan",lang)}</div>}
      {!plan.active&&isPaid&&<button onClick={()=>{if(CHECKOUT_URL){const em=acctEmail.trim();window.open(CHECKOUT_URL+(CHECKOUT_URL.includes("?")?"&":"?")+"plan="+encodeURIComponent(plan.n)+(em?"&email="+encodeURIComponent(em):""),"_blank","noopener");}else{notify(lang==="tr"?"💎 Web ödemesi yakında. Şimdilik yukarıdaki kutudan PRO kodu ile etkinleştirebilirsiniz.":TL("💎 Web checkout coming soon. For now, activate with a PRO code in the box above.",lang));}}} style={{...BP,width:"100%",marginTop:8,background:`linear-gradient(135deg,${plan.c},${plan.c}bb)`}}>{CHECKOUT_URL?(lang==="tr"?"💳 Web'de Yükselt":TL("💳 Upgrade on web",lang)):(lang==="tr"?"🎁 PRO Kodu ile Etkinleştir":TL("🎁 Activate with PRO code",lang))}</button>}
      {!plan.active&&!isPaid&&<button onClick={()=>{if(CONTACT_EMAIL){window.location.href="mailto:"+CONTACT_EMAIL+"?subject="+encodeURIComponent("AILVIE "+(lang==="tr"?"Kurumsal Talep":TL("Enterprise Inquiry",lang)));}else{notify(lang==="tr"?"Kurumsal görüşme yakında eklenecek.":TL("Enterprise contact coming soon.",lang));}}} style={{...BP,width:"100%",marginTop:8,background:`linear-gradient(135deg,${plan.c},${plan.c}bb)`}}>{lang==="tr"?"✉️ Bize Ulaşın":TL("✉️ Contact Us",lang)}</button>}
    </div>);})}
    <div style={{fontSize:fs-3,color:mt,textAlign:"center",marginTop:4,padding:"8px 10px",borderRadius:8,background:`${mt}11`,lineHeight:1.5}}>
      🌍 {lang==="tr"?"Fiyatlar ülkenize göre uyarlanır. Yıllık planlar 7 gün ücretsiz deneme içerir, istediğiniz zaman iptal edebilirsiniz.":TL("Prices are adapted to your region. Annual plans include a 7-day free trial, cancel anytime.",lang)}
    </div>
  </div>}
  {all&&<div style={CS}>
    <div style={{fontWeight:700,marginBottom:6}}>💾 {lang==="tr"?"Veri Yedekleme":TL("Data Backup",lang)}</div>
    <div style={{fontSize:fs-2,color:mt,marginBottom:8}}>{lang==="tr"?"Tüm sağlık verilerinizi (ilaç, randevu, not, sağlık durumu) bir dosyaya yedekleyin veya geri yükleyin. Buluta gerek yok — cihaz değiştirirken de kullanışlı.":TL("Back up or restore all your health data (meds, appointments, notes, health status) to a file. No cloud needed — also handy when switching devices.",lang)}</div>
    <div style={{display:"flex",gap:8}}>
      <button onClick={exportData} style={{...BP,flex:1}}>⬇️ {lang==="tr"?"Dışa Aktar":TL("Export",lang)}</button>
      <button onClick={()=>backupInputRef.current&&backupInputRef.current.click()} style={{...BP,flex:1,background:`linear-gradient(135deg,${sc},#1a7a6e)`}}>⬆️ {lang==="tr"?"İçe Aktar":TL("Import",lang)}</button>
    </div>
    <input ref={backupInputRef} type="file" accept="application/json,.json" style={{display:"none"}} onChange={e=>{const f=e.target.files&&e.target.files[0];importData(f);e.target.value="";}}/>
  </div>}
  {(all||s==="trash")&&<div style={CS}><div style={{fontWeight:700,marginBottom:8}}>🗑️ {t.trash}</div><div style={{display:"flex",gap:8,marginBottom:8}}>{[30,60,90].map(d=><button key={d} onClick={()=>setTrashDays(d)} style={pill(trashDays===d)}>{d} {t.trD}</button>)}</div>{trashItems.length===0&&<div style={{color:mt,textAlign:"center",padding:12}}>🗑️ {t.trE}</div>}{trashItems.map((item,ix)=>{const days=Math.max(0,trashDays-Math.floor((Date.now()-(item._d||Date.now()))/864e5));const tl=lang==="tr"?{med:"İlaç",appt:"Randevu",note:"Not",contact:"Kişi",record:"Kayıt",lab:"Tahlil",image:"Görüntü",message:"Mesaj",group:"Grup",emergency:"Acil No"}:{med:"Med",appt:"Appt",note:"Note",contact:"Contact",record:"Record",lab:"Lab",image:"Image",message:"Message",group:"Group",emergency:"Emergency"};const _thumb=(item._t==="note"&&Array.isArray(item._media))?item._media.find(x=>(x.type==="drawing"||x.type==="photo"||x.type==="image")&&x.data):null;
              return (<div key={item._d+"_"+ix} style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:8,padding:"6px 0",borderBottom:`1px solid ${bd}`}}>{_thumb&&<img src={_thumb.data} alt="" style={{width:40,height:40,borderRadius:6,objectFit:"cover",flexShrink:0,background:"#fff",border:`1px solid ${bd}`}}/>}<div style={{minWidth:0,flex:1}}><div style={{fontSize:fs-1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{(()=>{
                if(item._t==="lab"){const ti=LAB_TESTS.find(x=>x.k===item.test);return `${ti?(lang==="tr"?ti.tr:ti.en):item.test}: ${item.value} ${item.unit||""}`;}
                if(item._t==="image")return (item.label||item.kind||(lang==="tr"?"Tıbbi görüntü":TL("Medical image",lang)))+(item.date?` · ${item.date}`:"");
                if(item._t==="message")return (item.text||"").substring(0,30)||(lang==="tr"?"Mesaj":TL("Message",lang));
                if(item._t==="note"){
                  const txt=(item.title||"").trim()||(item.content?item.content.replace(/<[^>]+>/g,"").trim().substring(0,24):"");
                  if(txt)return txt;
                  const md=item._media||[];
                  if(md.some(x=>x.type==="drawing"))return lang==="tr"?"🎨 Çizim":TL("🎨 Drawing",lang);
                  if(md.some(x=>x.type==="photo"||x.type==="image"))return lang==="tr"?"🖼️ Fotoğraf":TL("🖼️ Photo",lang);
                  if(md.some(x=>x.type==="audio"))return lang==="tr"?"🎤 Ses kaydı":TL("🎤 Voice note",lang);
                  if(item.checklist&&item.checklist.length)return lang==="tr"?"☑️ Liste":TL("☑️ Checklist",lang);
                  return lang==="tr"?"Boş not":TL("Empty note",lang);
                }
                return item.name||item.title||item.doctor||(item.content?item.content.replace(/<[^>]+>/g,"").substring(0,24):"")||"—";
              })()}</div><div style={{fontSize:fs-3,color:mt}}>{tl[item._t]||"—"} · {days} {lang==="tr"?"gün sonra silinir":TL("days left",lang)}</div></div><div style={{display:"flex",gap:6,flexShrink:0}}><button onClick={()=>restoreItem(item)} style={{...BP,padding:"4px 10px",fontSize:fs-2}}>{t.rest}</button><button onClick={()=>setTrashItems(p=>p.filter(x=>x!==item))} aria-label={lang==="tr"?"Kalıcı sil":TL("Delete forever",lang)} style={{background:"none",border:`1px solid ${dg}33`,color:dg,borderRadius:8,padding:"4px 8px",cursor:"pointer",fontSize:fs-2}}>✕</button></div></div>);})}{trashItems.length>0&&<button onClick={()=>setTrashItems([])} style={{...BD,width:"100%",marginTop:8}}>{t.empT}</button>}</div>}
  {(all||s==="legal")&&<div style={CS}><div style={{fontWeight:700,marginBottom:6}}>⚖️ {t.legal}</div><div style={{fontSize:fs-2,color:mt,lineHeight:1.4}}>{t.legalText}</div></div>}
  {all&&<div style={CS}><div style={{fontWeight:700,marginBottom:4}}>ℹ️ {t.about}</div><div style={{fontSize:fs-2,color:mt}}>{t.version}: 9.0.0</div><div style={{fontSize:fs-2,color:mt}}>© 2025-2026 AILVIE Health Technologies</div></div>}
</div>);};

// Simplified page renders for health, pCard, notes, contacts, community, chat (same logic as v5)
const stopPulseStream=()=>{
  try{if(pulseRafRef.current)cancelAnimationFrame(pulseRafRef.current);}catch(e){}
  try{const s=pulseStreamRef.current;if(s){s.getTracks().forEach(tr=>{try{const pr=tr.applyConstraints&&tr.applyConstraints({advanced:[{torch:false}]});if(pr&&pr.catch)pr.catch(()=>{});}catch(e){}tr.stop();});}pulseStreamRef.current=null;}catch(e){}
};
const finishPulse=(samples)=>{
  stopPulseStream();
  const res=computeBPM(samples);
  const fromChat=pulseFromChatRef.current;pulseFromChatRef.current=false;
  if(res&&res.ok){
    const wantHrv=pulseHrvRef.current;
    const hrvNote=(wantHrv&&res.hrvRmssd==null)?(res.durationMs<45000?"short":"unstable"):null;
    setHd(p=>({...p,pulse:res.bpm,hrvRmssd:res.hrvRmssd!=null?res.hrvRmssd:p.hrvRmssd,hrvSdnn:res.hrvSdnn!=null?res.hrvSdnn:p.hrvSdnn,resp:res.respRate!=null?res.respRate:p.resp}));logMetric("pulse",res.bpm);setPulseM({phase:"done",bpm:res.bpm,quality:res.quality,conf:res.conf,fps:res.fps,hrvRmssd:res.hrvRmssd,hrvSdnn:res.hrvSdnn,beats:res.beats,respRate:res.respRate,wantHrv,hrvNote});haptic([40,60,40]);
    notify(lang==="tr"?`❤️ Nabız: ${res.bpm} bpm`:`❤️ Pulse: ${res.bpm} bpm`);
    if(fromChat){const q=res.quality==="excellent"?(lang==="tr"?"mükemmel":TL("excellent",lang)):res.quality==="good"?(lang==="tr"?"iyi":TL("good",lang)):res.quality==="fair"?(lang==="tr"?"orta":TL("fair",lang)):(lang==="tr"?"düşük":TL("poor",lang));setTimeout(()=>{setPulseM(null);goTo("chat");sendChat(lang==="tr"?`(Ölçüm tamamlandı) Nabzım ${res.bpm} bpm ölçüldü (sinyal kalitesi: ${q}). Bunu benim için yorumlar mısın?`:`(Measurement done) My pulse measured ${res.bpm} bpm (signal quality: ${q}). Can you interpret this for me?`);},700);}
  }else{
    const reason=res&&res.reason;
    const M=lang==="tr"?{
      too_short:"Ölçüm çok kısa ya da yeterli kare alınamadı. Parmağını sabit tutup daha uzun bekle.",
      unstable_fps:"Kamera kare hızı düşük/kararsız. Yeterli ışık olsun, telefonu ve parmağını sabit tut.",
      no_finger:"Parmak algılanmadı. Parmağının ucunu arka kameraya ve flaşa tam kapat.",
      low_signal:"Sinyal çok zayıf. Parmağını hafifçe (bastırmadan) tam kapat, sabit tut.",
      noisy:"Sinyal gürültülü — güvenilir nabız bulunamadı. Sabit tut ve tekrar dene.",
      out_of_range:"Geçerli bir nabız aralığı bulunamadı. Tekrar dene."
    }:{
      too_short:"Measurement too short or too few frames. Hold your fingertip still and wait longer.",
      unstable_fps:"Camera frame rate too low/unstable. Ensure enough light and hold phone & finger still.",
      no_finger:"No fingertip detected. Fully cover the rear camera and flash with your fingertip.",
      low_signal:"Signal too weak. Gently (without pressing) cover fully and hold still.",
      noisy:"Signal too noisy — no reliable pulse found. Hold still and try again.",
      out_of_range:"No valid pulse range found. Please try again."
    };
    setPulseM({phase:"error",reason,msg:M[reason]||(lang==="tr"?"Sinyal kalitesi yetersiz — ölçüm alınamadı. Parmağını arka kameraya (ve flaşa) tam kapat, sabit tut ve tekrar dene.":TL("Signal quality insufficient — measurement failed. Cover the rear camera (and flash) fully, hold still, and try again.",lang))});
  }
};
const startPulseMeasure=async(fromChat,hrvMode)=>{
  if(pulseM&&(pulseM.phase==="measuring"||pulseM.phase==="init"))return;
  pulseFromChatRef.current=!!fromChat;pulseHrvRef.current=!!hrvMode;
  setPulseM({phase:"init",progress:0,hrv:!!hrvMode});
  let stream;
  try{stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:"environment"},width:{ideal:320},height:{ideal:240}},audio:false});}
  catch(e){setPulseM({phase:"error",msg:lang==="tr"?"Kamera izni gerekli. İzin verip tekrar deneyin.":TL("Camera permission needed. Allow it and retry.",lang)});return;}
  pulseStreamRef.current=stream;
  const track=stream.getVideoTracks()[0];
  let torchOn=false;
  try{const caps=track.getCapabilities&&track.getCapabilities();if(caps&&caps.torch){await track.applyConstraints({advanced:[{torch:true}]});torchOn=true;}}catch(e){}
  const video=document.createElement("video");video.setAttribute("playsinline","");video.muted=true;video.srcObject=stream;
  try{await video.play();}catch(e){}
  const cv=document.createElement("canvas");cv.width=64;cv.height=48;const ctx=cv.getContext("2d",{willReadFrequently:true});
  const samples=[];const dur=hrvMode?60000:20000;const start=performance.now();
  setPulseM({phase:"measuring",progress:0,torch:torchOn,hrv:!!hrvMode,dur});
  const tick=()=>{
    const now=performance.now();const el=now-start;
    try{ctx.drawImage(video,0,0,64,48);const d=ctx.getImageData(16,12,32,24).data;let r=0,g=0,b=0,c=0;for(let i=0;i<d.length;i+=4){r+=d[i];g+=d[i+1];b+=d[i+2];c++;}samples.push({t:now,r:r/c,g:g/c,b:b/c});}catch(e){}
    setPulseM(p=>p&&p.phase==="measuring"?{...p,progress:Math.min(100,Math.round(el/dur*100))}:p);
    if(el<dur)pulseRafRef.current=requestAnimationFrame(tick);else finishPulse(samples);
  };
  pulseRafRef.current=requestAnimationFrame(tick);
};
const closePulse=()=>{stopPulseStream();setPulseM(null);};
// ---- External device: Web Bluetooth heart-rate monitor (standard Heart Rate Service 0x180D) ----
const connectBleHr=async()=>{
  if(typeof navigator==="undefined"||!navigator.bluetooth){setBleHr({error:lang==="tr"?"Bu tarayıcı/cihaz Web Bluetooth desteklemiyor (ör. iPhone Safari). Chrome/Android'de deneyin.":TL("This browser/device doesn't support Web Bluetooth (e.g. iPhone Safari). Try Chrome on Android.",lang)});return;}
  try{
    const dev=await navigator.bluetooth.requestDevice({filters:[{services:["heart_rate"]}]});
    bleRef.current=dev;setBleHr({connecting:true,name:dev.name||(lang==="tr"?"Cihaz":TL("Device",lang))});
    dev.addEventListener("gattserverdisconnected",()=>setBleHr(b=>(b&&!b.error)?{...b,connected:false,connecting:false}:b));
    const server=await dev.gatt.connect();
    const svc=await server.getPrimaryService("heart_rate");
    const ch=await svc.getCharacteristic("heart_rate_measurement");
    await ch.startNotifications();
    ch.addEventListener("characteristicvaluechanged",(e)=>{
      const v=e.target.value;const flags=v.getUint8(0);const bpm=(flags&0x1)?v.getUint16(1,true):v.getUint8(1); // real device reading
      if(bpm>0&&bpm<250){setBleHr({connected:true,bpm,name:dev.name||(lang==="tr"?"Cihaz":TL("Device",lang))});setHd(p=>({...p,pulse:bpm}));}
    });
    setBleHr({connected:true,bpm:null,name:dev.name||(lang==="tr"?"Cihaz":TL("Device",lang))});
  }catch(e){setBleHr({error:(e&&e.name==="NotFoundError")?(lang==="tr"?"Cihaz seçilmedi.":TL("No device selected.",lang)):(lang==="tr"?"Bağlanılamadı. Cihazın açık ve eşleşme modunda olduğundan emin olun.":TL("Couldn't connect. Make sure the device is on and in pairing mode.",lang))});}
};
const disconnectBle=()=>{try{if(bleRef.current&&bleRef.current.gatt&&bleRef.current.gatt.connected)bleRef.current.gatt.disconnect();}catch(e){}bleRef.current=null;setBleHr(null);};
// ---- Cough/snore: on-device audio session (foreground only, no recording/upload; rough heuristic) ----
const stopSoundSession=()=>{
  const S=soundRef.current;
  try{if(S.raf)cancelAnimationFrame(S.raf);}catch(e){}
  try{if(S.stream)S.stream.getTracks().forEach(t=>t.stop());}catch(e){}
  try{if(S.ctx&&S.ctx.state!=="closed")S.ctx.close();}catch(e){}
  S.raf=null;S.stream=null;S.ctx=null;
  setSoundSess(s=>(s&&(s.active))?{active:false,done:true,cough:S.cough,snore:S.snore,other:S.other}:s);
};
const startSoundSession=async()=>{
  if(soundSess&&soundSess.active)return;
  if(typeof navigator==="undefined"||!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia||!(window.AudioContext||window.webkitAudioContext)){setSoundSess({error:lang==="tr"?"Bu tarayıcı ses analizini desteklemiyor.":TL("This browser doesn't support audio analysis.",lang)});return;}
  let stream;
  try{stream=await navigator.mediaDevices.getUserMedia({audio:true});}
  catch(e){setSoundSess({error:lang==="tr"?"Mikrofon izni gerekli. İzin verip tekrar deneyin.":TL("Microphone permission needed. Allow it and retry.",lang)});return;}
  const Ctx=window.AudioContext||window.webkitAudioContext;const ctx=new Ctx();
  const src=ctx.createMediaStreamSource(stream);const an=ctx.createAnalyser();an.fftSize=2048;src.connect(an);
  const binHz=ctx.sampleRate/an.fftSize;const loBin=Math.round(500/binHz),hiBin=Math.round(4000/binHz);
  const freq=new Uint8Array(an.frequencyBinCount);const time=new Uint8Array(an.fftSize);
  const S=soundRef.current;Object.assign(S,{ctx,stream,analyser:an,base:null,inEvt:false,evtStart:0,evtLow:0,evtHigh:0,evtPeak:0,last:0,cough:0,snore:0,other:0,fc:0});
  setSoundSess({active:true,cough:0,snore:0,other:0,level:0});
  const loop=()=>{
    an.getByteTimeDomainData(time);an.getByteFrequencyData(freq);
    let sum=0;for(let i=0;i<time.length;i++){const v=(time[i]-128)/128;sum+=v*v;}
    const rms=Math.sqrt(sum/time.length);const level=Math.max(0,Math.round(20*Math.log10(rms+1e-6)+60)); // ~0..60
    let low=0,high=0;for(let i=1;i<freq.length;i++){if(i<=loBin)low+=freq[i];else if(i<=hiBin)high+=freq[i];}
    if(S.base==null)S.base=level;else S.base=S.base*0.99+level*0.01; // adaptive ambient baseline
    const now=performance.now();const over=level>S.base+12;
    if(over){ if(!S.inEvt&&now-S.last>400){S.inEvt=true;S.evtStart=now;S.evtLow=0;S.evtHigh=0;S.evtPeak=0;} if(S.inEvt){S.evtLow+=low;S.evtHigh+=high;if(level>S.evtPeak)S.evtPeak=level;} }
    else if(S.inEvt){
      const dur=now-S.evtStart,lowRatio=S.evtLow/((S.evtLow+S.evtHigh)||1);S.inEvt=false;S.last=now;
      if(dur>250&&lowRatio>0.6)S.snore++; else if(S.evtPeak>S.base+18||dur<=250)S.cough++; else S.other++; // rough heuristic
      setSoundSess(s=>s&&s.active?{...s,cough:S.cough,snore:S.snore,other:S.other}:s);
    }
    if((S.fc=(S.fc+1)%6)===0)setSoundSess(s=>s&&s.active?{...s,level}:s); // throttle level UI
    S.raf=requestAnimationFrame(loop);
  };
  S.raf=requestAnimationFrame(loop);
};
useEffect(()=>()=>{const S=soundRef.current;try{if(S.raf)cancelAnimationFrame(S.raf);}catch(e){}try{if(S.stream)S.stream.getTracks().forEach(t=>t.stop());}catch(e){}try{if(S.ctx&&S.ctx.state!=="closed")S.ctx.close();}catch(e){}},[]);
// ---- Balance/gait: postural sway from accelerometer (short foreground test; relative screening) ----
const stopBalance=()=>{const B=balanceRef.current;try{if(B.handler)window.removeEventListener("devicemotion",B.handler);}catch(e){}try{if(B.timer)clearTimeout(B.timer);}catch(e){}try{if(B.prog)clearInterval(B.prog);}catch(e){}B.handler=null;B.timer=null;B.prog=null;};
const finishBalance=()=>{
  stopBalance();const r=swayIndex(balanceRef.current.samples);
  if(!r){setBalanceM({phase:"error",msg:lang==="tr"?"Yeterli sensör verisi alınamadı. Telefonu göğsünüze tutup sabit durun, tekrar deneyin.":TL("Not enough sensor data. Hold the phone to your chest, stand still and retry.",lang)});return;}
  setBalanceM({phase:"done",sway:r.idx,band:r.band});setTests(t=>({...t,balSway:r.idx,balBand:r.band,balAt:Date.now()}));
};
const startBalance=async()=>{
  if(balanceM&&balanceM.phase==="active")return;
  if(typeof window==="undefined"||!window.DeviceMotionEvent){setBalanceM({phase:"error",msg:lang==="tr"?"Bu cihaz/tarayıcı hareket sensörünü desteklemiyor.":TL("This device/browser doesn't support motion sensors.",lang)});return;}
  if(typeof DeviceMotionEvent.requestPermission==="function"){
    try{const perm=await DeviceMotionEvent.requestPermission();if(perm!=="granted"){setBalanceM({phase:"error",msg:lang==="tr"?"Hareket sensörü izni gerekli.":TL("Motion sensor permission needed.",lang)});return;}}catch(e){setBalanceM({phase:"error",msg:lang==="tr"?"Hareket sensörü izni gerekli.":TL("Motion sensor permission needed.",lang)});return;}
  }
  const B=balanceRef.current;B.samples=[];B.start=Date.now();const dur=20000;
  const handler=(e)=>{const a=(e.acceleration&&e.acceleration.x!=null)?e.acceleration:e.accelerationIncludingGravity;if(!a)return;B.samples.push({t:Date.now(),x:a.x||0,y:a.y||0,z:a.z||0});};
  B.handler=handler;window.addEventListener("devicemotion",handler);
  setBalanceM({phase:"active",progress:0});
  B.prog=setInterval(()=>{const el=Date.now()-B.start;setBalanceM(m=>m&&m.phase==="active"?{...m,progress:Math.min(100,Math.round(el/dur*100))}:m);},250);
  B.timer=setTimeout(finishBalance,dur);
};
useEffect(()=>()=>stopBalance(),[]);
// ---- Posture: trunk tilt angle from accelerometer gravity vs a calibrated upright (foreground; relative screening) ----
const stopPosture=()=>{const P=postureRef.current;try{if(P.handler)window.removeEventListener("devicemotion",P.handler);}catch(e){}try{if(P.timer)clearTimeout(P.timer);}catch(e){}try{if(P.tick)clearInterval(P.tick);}catch(e){}P.handler=null;P.timer=null;P.tick=null;};
const startPosture=async()=>{
  if(postureM&&(postureM.phase==="live"||postureM.phase==="calibrating"))return;
  if(typeof window==="undefined"||!window.DeviceMotionEvent){setPostureM({phase:"error",msg:lang==="tr"?"Bu cihaz/tarayıcı hareket sensörünü desteklemiyor.":TL("This device/browser doesn't support motion sensors.",lang)});return;}
  if(typeof DeviceMotionEvent.requestPermission==="function"){
    try{const perm=await DeviceMotionEvent.requestPermission();if(perm!=="granted"){setPostureM({phase:"error",msg:lang==="tr"?"Hareket sensörü izni gerekli.":TL("Motion sensor permission needed.",lang)});return;}}catch(e){setPostureM({phase:"error",msg:lang==="tr"?"Hareket sensörü izni gerekli.":TL("Motion sensor permission needed.",lang)});return;}
  }
  const P=postureRef.current;Object.assign(P,{ref:null,g:[0,0,0],phase:"calibrating",calibSum:[0,0,0],calibN:0});
  const handler=(e)=>{const a=e.accelerationIncludingGravity;if(!a||a.x==null)return;const g=[a.x,a.y,a.z];P.g=P.g.map((v,i)=>v*0.8+g[i]*0.2);if(P.phase==="calibrating"){P.calibSum=P.calibSum.map((v,i)=>v+g[i]);P.calibN++;}};
  P.handler=handler;window.addEventListener("devicemotion",handler);
  setPostureM({phase:"calibrating"});
  P.timer=setTimeout(()=>{
    if(!P.calibN){setPostureM({phase:"error",msg:lang==="tr"?"Sensör verisi alınamadı. Telefonu dik tutup tekrar deneyin.":TL("No sensor data. Hold the phone upright and retry.",lang)});stopPosture();return;}
    P.ref=P.calibSum.map(v=>v/P.calibN);P.phase="live";setPostureM({phase:"live",angle:0,band:"good"});
    P.tick=setInterval(()=>{const r=postureAngle(P.g,P.ref);if(r)setPostureM(m=>m&&m.phase==="live"?{...m,angle:r.angle,band:r.band}:m);},200);
  },1300);
};
useEffect(()=>()=>stopPosture(),[]);
useEffect(()=>()=>{try{if(bleRef.current&&bleRef.current.gatt&&bleRef.current.gatt.connected)bleRef.current.gatt.disconnect();}catch(e){}},[]);
useEffect(()=>()=>stopPulseStream(),[]);
const renderHealth=()=>{
const pulseRef=(()=>{
  const age=patAge||30;
  if(age<=1)return{min:80,max:160,label:"80-160"};
  if(age<=2)return{min:80,max:130,label:"80-130"};
  if(age<=6)return{min:75,max:120,label:"75-120"};
  if(age<=12)return{min:70,max:110,label:"70-110"};
  if(age<=17)return{min:60,max:100,label:"60-100"};
  if(age<=64)return{min:60,max:100,label:"60-100"};
  return{min:60,max:100,label:"60-100"};
})();
const pulseOk=hd.pulse>=pulseRef.min&&hd.pulse<=pulseRef.max;
const waterPct=Math.min(100,(wellness.water/wellness.waterGoal)*100);
const sleepPct=Math.min(100,(wellness.sleep/wellness.sleepGoal)*100);
const computeSleepDur=(bed,wake)=>{if(!bed||!wake)return null;const[bh,bm]=bed.split(":").map(Number),[wh,wm]=wake.split(":").map(Number);let mins=(wh*60+wm)-(bh*60+bm);if(mins<=0)mins+=1440;return Math.round(mins/30)/2;};
const setSleepTime=(field,val)=>{const nt={...sleepTimes,[field]:val};setSleepTimes(nt);try{localStorage.setItem("ailvie_sleep_times",JSON.stringify(nt));}catch(e){}const d=computeSleepDur(nt.bed,nt.wake);if(d!=null)setWellness(w=>({...w,sleep:d}));};
const stepsPct=Math.min(100,(wellness.steps/wellness.stepsGoal)*100);
const moods=[{v:1,e:"😢",l:lang==="tr"?"Çok Kötü":TL("Very Bad",lang)},{v:2,e:"😕",l:lang==="tr"?"Kötü":TL("Bad",lang)},{v:3,e:"😐",l:lang==="tr"?"Normal":TL("Normal",lang)},{v:4,e:"🙂",l:lang==="tr"?"İyi":TL("Good",lang)},{v:5,e:"😄",l:lang==="tr"?"Harika":TL("Great",lang)}];
return(<div style={{display:"flex",flexDirection:"column",gap:10}}>
  <span style={{fontWeight:700,fontSize:fs+2}}>🩺 {t.healthFull}</span>
  {/* Info Banner */}
  <div style={{padding:"8px 12px",borderRadius:10,background:`${ac}10`,border:`1px solid ${ac}33`,fontSize:fs-2,color:dark?acTx:tc,display:"flex",alignItems:"center",gap:6}}>
    <span>💡</span><span>{lang==="tr"?"Verileriniz Sağlık Durumum ile otomatik senkronize":TL("Data auto-syncs with My Health Status",lang)}</span>
  </div>
  {/* Kimlik & Risk Profili — X1 owns every input; "My Health Status" (X2) only displays them.
     Placed first because age/sex/allergies are what every reference range and safety warning below
     is computed from: if this is empty, the rest of the page cannot classify anything. */}
  <div style={{fontWeight:700,fontSize:fs,color:mt,marginTop:4}}>👤 {lang==="tr"?"Kimlik & Risk Profili":TL("Identity & Risk Profile",lang)}</div>
  <div style={{...CS,border:`1px solid ${ac}33`}}>
    <div style={{fontSize:fs-3,color:mt,marginBottom:10,lineHeight:1.45}}>{lang==="tr"?"Yaş, cinsiyet, alerji ve kronik durumlar; aşağıdaki tahlil referanslarının ve güvenlik uyarılarının temelidir.":TL("Age, sex, allergies and chronic conditions are the basis for the lab references and safety warnings below.",lang)}</div>
    {[["fName","name","text"],["bDate","birthDate","date"],["bType","bloodType","text"]].map(([label,field,type])=>(
      <div key={field} style={{marginBottom:8}}>
        <div style={{fontSize:fs-2,color:mt,marginBottom:2}}>{t[label]||field}{field==="birthDate"&&patAge?` (${patAge} ${t.age})`:""}</div>
        <input type={type} value={pat[field]||""} onChange={e=>setPat(p=>({...p,[field]:e.target.value}))} placeholder={t[label]||field} style={{...IS,padding:"8px 10px"}}/>
      </div>
    ))}
    <div style={{marginBottom:8}}>
      <div style={{fontSize:fs-2,color:mt,marginBottom:2}}>⚧ {lang==="tr"?"Biyolojik Cinsiyet":TL("Biological Sex",lang)} <span style={{fontSize:fs-4}}>({lang==="tr"?"referans aralıkları için":TL("for reference ranges",lang)})</span></div>
      <div style={{display:"flex",gap:6}}>{[["female",lang==="tr"?"Kadın":TL("Female",lang)],["male",lang==="tr"?"Erkek":TL("Male",lang)],["",lang==="tr"?"Belirtme":TL("Unset",lang)]].map(([v,l])=><button key={v||"none"} onClick={()=>setPat(p=>({...p,sex:v,pregnant:v==="female"?p.pregnant:false}))} style={{flex:1,padding:"7px 4px",borderRadius:9,border:`1px solid ${pat.sex===v?ac:bd}`,background:pat.sex===v?`${ac}22`:"transparent",color:pat.sex===v?acTx:mt,fontSize:fs-2,fontWeight:700,cursor:"pointer"}}>{l}</button>)}</div>
    </div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8,gap:8}}>
      <span style={{flex:1,fontSize:fs-1,color:tc}}>💊 {lang==="tr"?"Kan sulandırıcı kullanıyorum":TL("On anticoagulant",lang)}<div style={{fontSize:fs-4,color:mt,marginTop:2}}>{lang==="tr"?"Açıkken INR hedefi kişiye özeldir; uygulama INR'yi sınıflandırmaz":TL("INR target is therapy-specific",lang)}</div></span>
      <button onClick={()=>setPat(p=>({...p,onAnticoag:!p.onAnticoag}))} aria-label="anticoag" style={{width:40,height:22,borderRadius:11,background:pat.onAnticoag?sc:bd,border:"none",cursor:"pointer",position:"relative",flexShrink:0}}><div style={{width:16,height:16,borderRadius:"50%",background:"#fff",position:"absolute",top:3,left:pat.onAnticoag?21:3,transition:"left .2s"}}/></button>
    </div>
    {pat.sex==="female"&&<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:8}}>
      <span style={{flex:1,fontSize:fs-1,color:tc}}>🤰 {lang==="tr"?"Gebelik":TL("Pregnancy",lang)}<div style={{fontSize:fs-4,color:mt,marginTop:2}}>{lang==="tr"?"Açıkken tahlil eşikleri uygulanmaz (farklıdır)":TL("Thresholds not applied when on",lang)}</div></span>
      <button onClick={()=>setPat(p=>({...p,pregnant:!p.pregnant}))} aria-label="pregnancy" style={{width:40,height:22,borderRadius:11,background:pat.pregnant?sc:bd,border:"none",cursor:"pointer",position:"relative",flexShrink:0}}><div style={{width:16,height:16,borderRadius:"50%",background:"#fff",position:"absolute",top:3,left:pat.pregnant?21:3,transition:"left .2s"}}/></button>
    </div>}
  </div>
  <div style={{...CS,border:`1px solid ${dg}33`,background:`${dg}05`}}>
    <div style={{fontWeight:700,color:dg,marginBottom:8,display:"flex",alignItems:"center",gap:6}}>⚠️ {lang==="tr"?"Alerji & Kronik Durumlar":TL("Allergies & Chronic Conditions",lang)}</div>
    {[["allrg","allergies","text"],["chron","chronic","text"]].map(([label,field,type])=>(
      <div key={field} style={{marginBottom:8}}>
        <div style={{fontSize:fs-2,color:mt,marginBottom:2}}>{t[label]||field}</div>
        <input type={type} value={pat[field]||""} onChange={e=>setPat(p=>({...p,[field]:e.target.value}))} placeholder={lang==="tr"?(field==="allergies"?"Örn: Penisilin, fıstık":"Örn: Diyabet, hipertansiyon"):(field==="allergies"?"e.g. Penicillin, nuts":"e.g. Diabetes, hypertension")} style={{...IS,padding:"8px 10px"}}/>
      </div>
    ))}
  </div>
  <div style={{...CS,border:`1px solid ${bd}`}}>
    <div style={{fontWeight:700,color:mt,marginBottom:8,display:"flex",alignItems:"center",gap:6}}>📋 {lang==="tr"?"Sigorta & Acil":TL("Insurance & Emergency",lang)}</div>
    {[["insu","insu","text"],["emCon","emContact","text"],["","emPhone","tel"]].map(([label,field,type])=>(
      <div key={field} style={{marginBottom:8}}>
        <div style={{fontSize:fs-2,color:mt,marginBottom:2}}>{t[label]||(field==="emPhone"?(lang==="tr"?"Acil Telefon":TL("Emergency Phone",lang)):field)}</div>
        <input type={type} value={pat[field]||""} onChange={e=>setPat(p=>({...p,[field]:e.target.value}))} placeholder={t[label]||field} style={{...IS,padding:"8px 10px"}}/>
      </div>
    ))}
  </div>
  {/* Body Measurements */}
  <div style={{fontWeight:700,fontSize:fs,color:mt,marginTop:4}}>📏 {lang==="tr"?"Vücut Ölçümleri":TL("Body Measurements",lang)}</div>
  {HField({icon:"📏",label:t.ht,field:"height",unit:t.cm})}
  {HField({icon:"⚖️",label:t.wt,field:"weight",unit:t.kg})}
  {bmi>0&&<div style={CS}>
    <div style={{display:"flex",justifyContent:"space-between"}}>
      <span style={{fontWeight:700,fontSize:fs+1}}>BMI</span>
      <span style={{fontSize:fs+6,fontWeight:800,color:bmi>=18.5&&bmi<25?sc:dg}}>{bmi}</span>
    </div>
    <div style={{height:8,borderRadius:4,background:`linear-gradient(90deg,${ac},${sc},#e9c46a,${dg})`,marginTop:8,position:"relative"}}>
      <div style={{position:"absolute",left:`${Math.min(100,Math.max(0,((bmi-10)/35)*100))}%`,top:-4,width:16,height:16,borderRadius:"50%",background:"#fff",border:`3px solid ${ac}`,transform:"translateX(-50%)"}}/>
    </div>
    <div style={{fontSize:fs-3,color:mt,marginTop:6,textAlign:"center"}}>{bmi<18.5?(lang==="tr"?"Zayıf — Kilo almanız önerilir":TL("Underweight — weight gain recommended",lang)):bmi<25?(lang==="tr"?"✓ Normal":TL("✓ Normal",lang)):bmi<30?(lang==="tr"?"Fazla kilolu":TL("Overweight",lang)):(lang==="tr"?"Obez — Doktora başvurun":TL("Obese — Consult doctor",lang))}</div>
  </div>}
  {/* Diet Program (dietitian tracker) */}
  {(()=>{const tk=new Date().toISOString().split('T')[0];const meals=diet.meals||[];const doneToday=meals.filter(m=>diet.done&&diet.done[tk+'_'+m.id]).length;const water=(diet.water&&diet.water[tk])||0;const gw=diet.goalWater||8;
  return <div style={{...CS}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><b style={{fontSize:fs+1,color:tc}}>🥗 {lang==="tr"?"Diyet Programı":TL("Diet Program",lang)}</b>{meals.length>0&&<span style={{fontSize:fs-2,color:doneToday===meals.length?sc:mt,fontWeight:700}}>{lang==="tr"?"bugün":TL("today",lang)} {doneToday}/{meals.length} ✓</span>}</div>
    <div style={{fontSize:fs-3,color:mt,marginTop:2,marginBottom:8}}>{lang==="tr"?"Diyetisyeninizin verdiği programı girin. AILVIE diyet oluşturmaz, yalnızca takip eder.":TL("Enter the program your dietitian gave you. AILVIE doesn't create diets, only tracks.",lang)}</div>
    {meals.map(m=>{const dk=tk+'_'+m.id;const on=diet.done&&diet.done[dk];return <div key={m.id} style={{display:"flex",alignItems:"flex-start",gap:8,padding:"7px 0",borderBottom:`1px solid ${bd}`}}>
      <button onClick={()=>setDiet(d=>({...d,done:{...(d.done||{}),[dk]:!on}}))} style={{flexShrink:0,width:24,height:24,borderRadius:7,border:`2px solid ${on?sc:bd}`,background:on?sc:"transparent",color:"#fff",cursor:"pointer",fontSize:14,lineHeight:1}}>{on?"✓":""}</button>
      <div style={{flex:1,minWidth:0}}><div style={{fontSize:fs-2,fontWeight:700,color:acTx}}>{m.slot}</div><div style={{fontSize:fs-1,color:tc,opacity:on?0.55:1,textDecoration:on?"line-through":"none"}}>{m.text}</div></div>
      <button onClick={()=>setDiet(d=>({...d,meals:d.meals.filter(x=>x.id!==m.id)}))} style={{background:"none",border:"none",color:dg,cursor:"pointer",fontSize:fs}}>✕</button>
    </div>;})}
    {meals.length===0&&<div style={{color:mt,fontSize:fs-2,padding:"6px 0"}}>{lang==="tr"?"Henüz öğün eklenmedi.":TL("No meals added yet.",lang)}</div>}
    <div style={{display:"flex",gap:6,marginTop:8}}>
      <select aria-label={lang==="tr"?"Öğün seçin":TL("Select meal",lang)} value={dietSlot} onChange={e=>setDietSlot(e.target.value)} style={{...IS,flex:"0 0 36%",padding:"9px 6px"}}>{(lang==="tr"?["Kahvaltı","Ara Öğün","Öğle","İkindi","Akşam","Gece"]:["Breakfast","Snack","Lunch","Afternoon","Dinner","Night"]).map(x=><option key={x} value={x}>{x}</option>)}</select>
      <input value={dietText} onChange={e=>setDietText(e.target.value)} placeholder={lang==="tr"?"Ne yenecek…":TL("What to eat…",lang)} style={{...IS,flex:1}}/>
    </div>
    <button onClick={()=>{if(dietText.trim()){setDiet(d=>({...d,meals:[...(d.meals||[]),{id:Date.now(),slot:dietSlot,text:dietText.trim()}]}));setDietText("");}}} style={{...BP,marginTop:6,padding:"9px"}}>+ {lang==="tr"?"Öğün Ekle":TL("Add Meal",lang)}</button>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:12,paddingTop:10,borderTop:`1px solid ${bd}`}}>
      <span style={{fontSize:fs-1,color:tc}}>💧 {lang==="tr"?"Su":TL("Water",lang)} <b style={{color:water>=gw?sc:ac}}>{water}</b>/{gw} {lang==="tr"?"bardak":TL("cups",lang)}</span>
      <div style={{display:"flex",gap:6}}>
        <button onClick={()=>setDiet(d=>({...d,water:{...(d.water||{}),[tk]:Math.max(0,water-1)}}))} style={{...BP,background:mt,width:36,padding:"6px 0"}}>−</button>
        <button onClick={()=>setDiet(d=>({...d,water:{...(d.water||{}),[tk]:water+1}}))} style={{...BP,width:36,padding:"6px 0"}}>+</button>
      </div>
    </div>
  </div>;})()}
  {/* Blood Glucose tracking */}
  {(()=>{
    const ctx=patCtx();
    const gluClass=(val,type)=>{
      const r=classifyGlucose(val,type,ctx);
      if(!r.applicable)return{c:mt,l:"",na:true,reason:r.reason};
      const L=lang==="tr";
      if(r.level==="critical-low")return{c:dg,l:L?"kritik düşük":"critical low"};
      if(r.level==="critical-high")return{c:dg,l:L?"kritik yüksek":"critical high"};
      if(r.level==="low")return{c:"#e9a23b",l:L?"düşük":"low"};
      if(r.level==="normal")return{c:sc,l:L?"normal":"normal"};
      if(r.level==="prediabetes")return{c:"#e9a23b",l:L?"prediyabet eşiği":"prediabetes range"};
      return{c:dg,l:L?"diyabet eşiği":"diabetes range"};
    };
    const readings=[...glucose].sort((a,b)=>a.ts-b.ts);const recent=readings.slice(-8);
    const typeLbl=(t)=>t==="fasting"?(lang==="tr"?"Açlık":TL("Fasting",lang)):t==="postmeal"?(lang==="tr"?"Tokluk":TL("Post-meal",lang)):(lang==="tr"?"Rastgele":TL("Random",lang));
    const vals=recent.map(r=>r.val);const mn=Math.min(70,...vals),mx=Math.max(200,...vals);const yy=v=>78-((v-mn)/(mx-mn||1))*74-2;
    return <div style={{...CS}}>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <b style={{fontSize:fs+1,color:tc}}>🩸 {lang==="tr"?"Şeker (Glikoz) Takibi":TL("Blood Glucose",lang)}</b>
        <button onClick={()=>startGuide("glucose")} aria-label={lang==="tr"?"Kan şekeri ölçüm rehberi":TL("Blood glucose measurement guide",lang)} title={lang==="tr"?"Nasıl ölçülür?":TL("How to measure",lang)} style={{marginLeft:"auto",background:"transparent",border:`1px solid ${bd}`,color:acTx,borderRadius:8,padding:"3px 8px",cursor:"pointer",fontSize:fs-3,flexShrink:0}}>🔊 {lang==="tr"?"Rehber":TL("Guide",lang)}</button>
      </div>
      {(()=>{const c=patCtx();const L=lang==="tr";let msg=null;
        if(!c.band)msg=L?"⚠️ Doğum tarihi girilmemiş — değerler sınıflandırılmıyor. Yukarıdaki Kimlik & Risk Profili'nden yaş/cinsiyet ekleyin.":"⚠️ No birth date — values are not classified. Add age/sex in Identity & Risk Profile above.";
        else if(c.pregnant)msg=L?"⚠️ Gebelikte şeker eşikleri farklıdır (ör. gestasyonel diyabet). Uygulama sınıflandırma yapmaz; değerleriniz yalnızca kaydedilir. Doktorunuz/kadın doğum uzmanınız değerlendirmelidir.":"⚠️ Pregnancy thresholds differ. Values are recorded but not classified.";
        else if(c.band!=="adult"&&c.band!=="older")msg=L?"⚠️ Çocuk/adölesan referansları yetişkinden farklıdır ve yaşa/yönteme göre değişir. Uygulama sınıflandırma yapmaz; değerler yalnızca kaydedilir.":"⚠️ Pediatric references differ. Values are recorded but not classified.";
        return msg?<div style={{background:`${dg}12`,border:`1px solid ${dg}44`,borderRadius:9,padding:"8px 10px",fontSize:fs-3,color:tc,lineHeight:1.4,marginTop:6}}>{msg}</div>:null;})()}
      <div style={{fontSize:fs-3,color:mt,marginTop:2,marginBottom:8}}>{lang==="tr"?"Ölçüm cihazınızın değerini girin. Tarama amaçlıdır, tıbbi tanı değildir — doktorunuza danışın.":TL("Enter your meter reading. Screening only, not a diagnosis — consult your doctor.",lang)}</div>
      <div style={{display:"flex",gap:6}}>
        <input type="number" inputMode="numeric" value={gluVal} onFocus={()=>{if(voiceGuide&&!guide)startGuide("glucose");}} onChange={e=>setGluVal(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"){const v=parseInt(gluVal,10);if(v>0){setGlucose(g=>[...g,{id:Date.now(),ts:Date.now(),val:v,type:gluType}]);logMetric("glucose",v,gluType);if(v<54||v>=300)setActiveAlert({icon:"🩸",title:lang==="tr"?"KRİTİK ŞEKER":TL("CRITICAL GLUCOSE",lang),msg:v+" mg/dL — "+(lang==="tr"?"acil kontrol edin / doktorunuza danışın":TL("seek medical attention",lang))});setGluVal("");}}}} placeholder="mg/dL" style={{...IS,flex:"0 0 32%"}}/>
        <select aria-label={lang==="tr"?"Ölçüm zamanı (açlık/tokluk)":TL("Measurement timing",lang)} value={gluType} onChange={e=>setGluType(e.target.value)} style={{...IS,flex:1}}><option value="fasting">{lang==="tr"?"Açlık":TL("Fasting",lang)}</option><option value="postmeal">{lang==="tr"?"Tokluk (2 saat)":TL("Post-meal (2h)",lang)}</option><option value="random">{lang==="tr"?"Rastgele":TL("Random",lang)}</option></select>
      </div>
      <button onClick={()=>{const v=parseInt(gluVal,10);if(v>0){setGlucose(g=>[...g,{id:Date.now(),ts:Date.now(),val:v,type:gluType}]);logMetric('glucose',v,gluType);if(v<54||v>=300)setActiveAlert({icon:"🩸",title:lang==="tr"?"KRİTİK ŞEKER":TL("CRITICAL GLUCOSE",lang),msg:v+" mg/dL — "+(lang==="tr"?"acil kontrol edin / doktorunuza danışın":TL("seek medical attention",lang))});setGluVal("");}}} style={{...BP,marginTop:6,padding:"9px"}}>+ {lang==="tr"?"Ölçüm Ekle":TL("Add Reading",lang)}</button>
      {recent.length>=2&&<div style={{marginTop:12}}>
        <svg width="100%" height="80" viewBox="0 0 300 80" preserveAspectRatio="none">
          <polyline fill="none" stroke={ac} strokeWidth="2" points={recent.map((r,i)=>`${(i/(recent.length-1))*300},${yy(r.val)}`).join(" ")}/>
          {recent.map((r,i)=>{const cl=gluClass(r.val,r.type);return <circle key={r.id} cx={(i/(recent.length-1))*300} cy={yy(r.val)} r="3.5" fill={cl.c}/>;})}
        </svg>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:fs-4,color:mt}}><span>{mn}</span><span>mg/dL</span><span>{mx}</span></div>
      </div>}
      {[...readings].reverse().slice(0,6).map(r=>{const cl=gluClass(r.val,r.type);const dt=new Date(r.ts);return <div key={r.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${bd}`}}>
        <div style={{flexShrink:0,width:64}}><b style={{fontSize:fs+3,color:cl.c}}>{r.val}</b> <span style={{fontSize:fs-4,color:mt}}>mg/dL</span></div>
        <div style={{flex:1,textAlign:"right",minWidth:0}}><span style={{fontSize:fs-2,color:cl.c,fontWeight:700}}>{cl.l}</span> <span style={{fontSize:fs-3,color:mt}}>· {typeLbl(r.type)} · {dt.toLocaleDateString(lc,{day:"2-digit",month:"2-digit"})} {dt.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}</span></div>
        <button onClick={()=>setGlucose(g=>g.filter(x=>x.id!==r.id))} style={{background:"none",border:"none",color:dg,cursor:"pointer",fontSize:fs-1,marginLeft:6,flexShrink:0}}>✕</button>
      </div>;})}
      {readings.length===0&&<div style={{color:mt,fontSize:fs-2,marginTop:8}}>{lang==="tr"?"Henüz ölçüm yok.":TL("No readings yet.",lang)}</div>}
      <div style={{fontSize:fs-4,color:mt,marginTop:8,lineHeight:1.4}}>{lang==="tr"?"Referans (yaklaşık): Açlık 70–99 normal, 100–125 sınırda, ≥126 yüksek · Tokluk <140 normal. Kişisel hedefler için doktorunuza danışın.":TL("Ref (approx): Fasting 70–99 normal, 100–125 borderline, ≥126 high · Post-meal <140 normal. Ask your doctor for personal targets.",lang)}</div>
      <div style={{display:"flex",gap:6,alignItems:"center",marginTop:10,paddingTop:8,borderTop:`1px solid ${bd}`}}><span style={{fontSize:fs-1,color:tc,flex:1}}>🧪 HbA1c <span style={{fontSize:fs-3,color:mt}}>(%)</span></span><input type="number" step="0.1" inputMode="decimal" value={hba1cVal} onChange={e=>setHba1cVal(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"){const v=parseFloat(hba1cVal);if(v>0){logMetric("hba1c",v);setHba1cVal("");notify(lang==="tr"?"✓ HbA1c kaydedildi":TL("✓ HbA1c logged",lang));}}}} placeholder="5.6" style={{...IS,width:74,textAlign:"center"}}/><button onClick={()=>{const v=parseFloat(hba1cVal);if(v>0){logMetric("hba1c",v);setHba1cVal("");notify(lang==="tr"?"✓ HbA1c kaydedildi":TL("✓ HbA1c logged",lang));}}} style={{...BP,padding:"8px 14px"}}>+</button></div>
    </div>;})()}
  {/* Health Report & History */}
  {(()=>{
    const M=lang==="tr"
      ?[{k:"weight",lbl:"Kilo",u:"kg",ic:"⚖️"},{k:"pulse",lbl:"Nabız",u:"bpm",ic:"❤️"},{k:"bp",lbl:"Tansiyon",u:"mmHg",ic:"🩸"},{k:"spo2",lbl:"SpO₂",u:"%",ic:"🫁"},{k:"glucose",lbl:"Şeker",u:"mg/dL",ic:"🍬"},{k:"hba1c",lbl:"HbA1c",u:"%",ic:"🧪"}]
      :[{k:"weight",lbl:"Weight",u:"kg",ic:"⚖️"},{k:"pulse",lbl:"Pulse",u:"bpm",ic:"❤️"},{k:"bp",lbl:"Blood Pressure",u:"mmHg",ic:"🩸"},{k:"spo2",lbl:"SpO₂",u:"%",ic:"🫁"},{k:"glucose",lbl:"Glucose",u:"mg/dL",ic:"🍬"},{k:"hba1c",lbl:"HbA1c",u:"%",ic:"🧪"}];
    const labKeys=[...new Set((labs||[]).map(x=>x.test))];
    const labM=labKeys.map(k=>{const ti=LAB_TESTS.find(y=>y.k===k);const canon=(UNIT_CONV[k]&&UNIT_CONV[k].canon)||"";return ti?{k:"lab:"+k,lbl:(lang==="tr"?ti.tr:ti.en),u:canon,ic:"🧪"}:null;}).filter(Boolean);
    const M2=[...M,...labM];
    const sel=repMetric,mi=M2.find(x=>x.k===sel)||M2[0];
    const allSeries=(sel.startsWith("lab:")?(labs||[]).filter(x=>x.test===sel.slice(4)).map(x=>({ts:x.ts,val:x.canonValue,meta:{level:x.level,src:x.source}})):sel==="glucose"?[...glucose].map(r=>({ts:r.ts,val:r.val,meta:r.type})):healthLog.filter(x=>x.type===sel).map(x=>({ts:x.ts,val:x.val,meta:x.meta}))).sort((a,b)=>a.ts-b.ts);
    const rMs=repRange>0?repRange*864e5:0,cutoff=Date.now()-rMs;
    const series=repRange>0?allSeries.filter(x=>x.ts>=cutoff):allSeries;
    const prevSeries=repRange>0?allSeries.filter(x=>x.ts>=cutoff-rMs&&x.ts<cutoff):[];
    const pAvg=prevSeries.length?Math.round(prevSeries.reduce((a,b)=>a+b.val,0)/prevSeries.length*10)/10:null;
    const vals=series.map(s=>s.val),n=series.length;
    const cur=n?series[n-1]:null,prev=n>1?series[n-2]:null;
    const avg=n?Math.round(vals.reduce((a,b)=>a+b,0)/n*10)/10:0,mn=n?Math.min(...vals):0,mx=n?Math.max(...vals):0;
    const delta=cur&&prev?Math.round((cur.val-prev.val)*10)/10:0;
    const fmt=(s)=>sel==="bp"?`${s.val}/${(s.meta&&s.meta.d)||"?"}`:`${s.val}`;
    const dstr=(ts)=>{const d=new Date(ts);return d.toLocaleDateString(lc,{day:"2-digit",month:"2-digit",year:"numeric"})+" "+d.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});};
    // auto conclusion
    let concl="";
    if(n>0){const tr=lang==="tr";
      if(sel.startsWith("lab:")){const ti=LAB_TESTS.find(y=>y.k===sel.slice(4));const nm2=ti?(tr?ti.tr:ti.en):sel.slice(4);const lv=cur.meta&&cur.meta.level;const lvT=lv?({normal:tr?"normal":"normal",low:tr?"düşük":"low",high:tr?"yüksek":"high","critical-low":tr?"kritik düşük":"critical low","critical-high":tr?"kritik yüksek":"critical high",prediabetes:tr?"prediyabet eşiği":"prediabetes","diabetes-range":tr?"diyabet eşiği":"diabetes range"}[lv]||lv):(tr?"sınıflandırılmadı":"not classified");const trend=prev?(cur.val>prev.val?(tr?"yükseliyor":"rising"):cur.val<prev.val?(tr?"düşüyor":"falling"):(tr?"sabit":"stable")):"";concl=tr?`Son ${nm2}: ${cur.val} ${mi.u} — ${lvT}${trend?", "+trend:""}. ${n} ölçüm, ortalama ${avg}. Tarama amaçlıdır; doktorunuz yorumlamalıdır.`:`Latest ${nm2}: ${cur.val} ${mi.u} — ${lvT}${trend?", "+trend:""}. Avg ${avg}.`;}
      else if(sel==="weight"){const first=series[0].val,ch=Math.round((cur.val-first.val)*10)/10;concl=tr?`Güncel ${cur.val} kg. İlk kayıttan (${first} kg) bu yana ${ch>0?"+":""}${ch} kg ${ch>0?"arttı":ch<0?"azaldı":"değişmedi"}. Ortalama ${avg} kg.`:`Now ${cur.val} kg. ${ch>0?"+":""}${ch} kg since first (${first} kg). Avg ${avg} kg.`;}
      else if(sel==="pulse"){const ok=cur.val>=60&&cur.val<=100;concl=tr?`Son nabız ${cur.val} bpm — ${ok?"normal aralıkta (60–100)":"aralık dışı, dikkat"}. Ortalama ${avg} bpm.`:`Latest ${cur.val} bpm — ${ok?"normal (60–100)":"out of range"}. Avg ${avg}.`;}
      else if(sel==="bp"){const sV=cur.val,dV=(cur.meta&&cur.meta.d)||0;const ok=sV<120&&dV<80;const hi=sV>=140||dV>=90;concl=tr?`Son tansiyon ${sV}/${dV} — ${ok?"ideal":hi?"yüksek, doktorunuza danışın":"sınırda"}. Ortalama sistolik ${avg}.`:`Latest ${sV}/${dV} — ${ok?"ideal":hi?"high, consult doctor":"borderline"}.`;}
      else if(sel==="spo2"){const ok=cur.val>=95;concl=tr?`Son SpO₂ %${cur.val} — ${ok?"normal (≥95)":cur.val>=90?"hafif düşük":"düşük, dikkat"}.`:`Latest ${cur.val}% — ${ok?"normal":"low"}.`;}
      else if(sel==="hba1c"){const r=classifyHbA1c(cur.val,patCtx());if(!r.applicable){concl=tr?`Son HbA1c %${cur.val} kaydedildi. Yaş/gebelik bağlamı nedeniyle uygulama sınıflandırma yapmıyor — doktorunuz değerlendirmelidir.`:`HbA1c ${cur.val}% recorded. Not classified due to age/pregnancy context.`;}else{const cat=r.level==="normal"?(tr?"normal":"normal"):r.level==="prediabetes"?(tr?"prediyabet karar eşiği":"prediabetes threshold"):(tr?"diyabet karar eşiği":"diabetes threshold");concl=tr?`Son HbA1c %${cur.val} — ${cat} (tanısal eşik; laboratuvar referans aralığından farklı olabilir). Tahmini ortalama glikoz ~${r.eag} mg/dL. Doktorunuza danışın.`:`Latest ${cur.val}% — ${cat}. eAG ~${r.eag} mg/dL.`;}}
      else if(sel==="glucose"){concl=tr?`${n} ölçüm, ortalama ${avg} mg/dL (en düşük ${mn}, en yüksek ${mx}). Kişisel hedef için doktorunuza danışın.`:`${n} readings, avg ${avg} mg/dL (min ${mn}, max ${mx}).`;}
    }
    const yy=v=>78-((v-mn)/((mx-mn)||1))*72-3;
    return <div style={{...CS}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:6}}>
        <b style={{fontSize:fs+1,color:tc}}>📊 {lang==="tr"?"Sağlık Raporu & Geçmiş":TL("Health Report & History",lang)}</b>
        <button onClick={()=>{const t=Date.now();const add=[];if(hd.weight>0)add.push({type:"weight",val:hd.weight});if(hd.pulse>0)add.push({type:"pulse",val:hd.pulse});if(hd.bpS>0)add.push({type:"bp",val:hd.bpS,meta:{d:hd.bpD||0}});if(hd.spo2>0)add.push({type:"spo2",val:hd.spo2});if(!add.length){notify(lang==="tr"?"Önce Yaşamsal Değerler'e değer girin.":TL("Enter vitals first.",lang));return;}setHealthLog(l=>[...l,...add.map((a,i)=>({id:t+"_"+i,ts:t,...a,meta:a.meta||null}))]);notify(lang==="tr"?`✓ ${add.length} değer geçmişe kaydedildi`:`✓ ${add.length} values logged`);if(hd.bpS>=180||hd.bpD>=120)setActiveAlert({icon:"🩺",title:lang==="tr"?"YÜKSEK TANSİYON":TL("HIGH BLOOD PRESSURE",lang),msg:hd.bpS+"/"+hd.bpD+" — "+(lang==="tr"?"doktorunuza danışın":TL("consult your doctor",lang))});}} style={{...BP,padding:"6px 12px",fontSize:fs-2}}>📌 {lang==="tr"?"Bugünü Kaydet":TL("Log Today",lang)}</button><button onClick={exportReportPDF} style={{...BP,background:sc,padding:"6px 12px",fontSize:fs-2}}>📄 PDF</button><button onClick={exportCSV} style={{...BP,background:a2,padding:"6px 12px",fontSize:fs-2}}>📊 Excel/CSV</button><button onClick={exportFHIR} style={{...BP,background:mt,padding:"6px 12px",fontSize:fs-2}}>🔗 FHIR</button>
      </div>
      <div style={{display:"flex",gap:6,overflowX:"auto",margin:"10px 0",paddingBottom:2}}>{M2.map(m=><button key={m.k} onClick={()=>setRepMetric(m.k)} style={{flex:"0 0 auto",padding:"6px 12px",borderRadius:20,border:`1px solid ${sel===m.k?ac:bd}`,background:sel===m.k?ac:"transparent",color:sel===m.k?onAc:mt,fontSize:fs-2,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap"}}>{m.ic} {m.lbl}</button>)}</div>
      <div style={{display:"flex",gap:6,marginBottom:8}}>{[[7,lang==="tr"?"7 gün":TL("7d",lang)],[30,lang==="tr"?"30 gün":TL("30d",lang)],[90,lang==="tr"?"90 gün":TL("90d",lang)],[0,lang==="tr"?"Tümü":TL("All",lang)]].map(([d,l])=><button key={d} onClick={()=>setRepRange(d)} style={{flex:1,padding:"5px 0",borderRadius:8,border:`1px solid ${repRange===d?ac:bd}`,background:repRange===d?`${ac}22`:"transparent",color:repRange===d?acTx:mt,fontSize:fs-3,fontWeight:700,cursor:"pointer"}}>{l}</button>)}</div>
      {n===0?<div style={{color:mt,fontSize:fs-2,padding:"14px 0",textAlign:"center"}}>{lang==="tr"?"Bu metrik için henüz kayıt yok. Değer girip 'Bugünü Kaydet' ile geçmişe ekleyin.":TL("No records yet. Enter a value and tap 'Log Today'.",lang)}</div>:<>
        {n>=2&&<div style={{marginTop:4}}><svg width="100%" height="80" viewBox="0 0 300 80" preserveAspectRatio="none"><polyline fill="none" stroke={ac} strokeWidth="2" points={series.slice(-12).map((s,i,a)=>`${(i/(a.length-1||1))*300},${yy(s.val)}`).join(" ")}/>{series.slice(-12).map((s,i,a)=><circle key={i} cx={(i/(a.length-1||1))*300} cy={yy(s.val)} r="3" fill={ac}/>)}</svg><div style={{display:"flex",justifyContent:"space-between",fontSize:fs-4,color:mt}}><span>{mn}</span><span>{mi.u}</span><span>{mx}</span></div></div>}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,margin:"10px 0"}}>
          {[[lang==="tr"?"Son":TL("Latest",lang),fmt(cur),tc],[lang==="tr"?"Önceki":TL("Prev",lang),prev?fmt(prev):"—",mt],[lang==="tr"?"Değişim":TL("Change",lang),(delta>0?"▲ +":delta<0?"▼ ":"")+ (sel==="bp"?delta:delta),delta>0?dg:delta<0?sc:mt],[lang==="tr"?"Ortalama":TL("Avg",lang),avg,tc],[lang==="tr"?"En düşük":TL("Min",lang),mn,tc],[lang==="tr"?"En yüksek":TL("Max",lang),mx,tc]].map(([l,v,c],i)=><div key={i} style={{background:dark?"#0e1620":"#f4f7fa",borderRadius:10,padding:"8px 6px",textAlign:"center"}}><div style={{fontSize:fs-4,color:mt}}>{l}</div><div style={{fontSize:fs+1,fontWeight:800,color:c}}>{v}</div></div>)}
        </div>
        {concl&&<div style={{background:`${ac}14`,border:`1px solid ${ac}33`,borderRadius:10,padding:"9px 11px",fontSize:fs-1,color:tc,lineHeight:1.4,marginBottom:8}}>🧭 {concl}</div>}
        {pAvg!=null&&n>0&&<div style={{fontSize:fs-2,color:mt,marginBottom:8}}>{lang==="tr"?"Önceki döneme göre:":TL("vs previous period:",lang)} {pAvg} → <b style={{color:tc}}>{avg}</b> {mi.u} <span style={{color:avg>pAvg?"#e9a23b":avg<pAvg?acTx:mt,fontWeight:700}}>({avg>pAvg?"+":""}{Math.round((avg-pAvg)*10)/10})</span></div>}
        {sel==="weight"&&<div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8,flexWrap:"wrap"}}><span style={{fontSize:fs-2,color:mt}}>🎯 {lang==="tr"?"Hedef kilo":TL("Goal weight",lang)}:</span><input type="number" value={goals.weight} onChange={e=>setGoals(g=>({...g,weight:e.target.value}))} placeholder="kg" style={{...IS,width:70,textAlign:"center",padding:"5px 6px"}}/>{goals.weight>0&&cur&&<span style={{fontSize:fs-2,color:tc,fontWeight:600}}>{(()=>{const diff=Math.round((cur.val-parseFloat(goals.weight))*10)/10;return diff===0?(lang==="tr"?"🎉 hedefte!":TL("🎉 reached!",lang)):(lang==="tr"?`${Math.abs(diff)} kg ${diff>0?"vermeniz":"almanız"} gerek`:`${Math.abs(diff)} kg to ${diff>0?"lose":"gain"}`);})()}</span>}</div>}
        <div style={{fontSize:fs-2,fontWeight:700,color:mt,margin:"4px 0"}}>{lang==="tr"?"Kayıtlar (tarih · saat)":TL("Records (date · time)",lang)}</div>
        {[...series].reverse().slice(0,10).map((s,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px 0",borderBottom:`1px solid ${bd}`}}><span style={{fontSize:fs-2,color:mt}}>{dstr(s.ts)}</span><b style={{fontSize:fs,color:tc}}>{fmt(s)} {mi.u}{sel==="glucose"&&s.meta?` · ${s.meta==="fasting"?(lang==="tr"?"Açlık":TL("Fast",lang)):s.meta==="postmeal"?(lang==="tr"?"Tokluk":TL("Post",lang)):(lang==="tr"?"Rastgele":TL("Rand",lang))}`:""}</b></div>)}
        <div style={{fontSize:fs-4,color:mt,marginTop:8}}>{lang==="tr"?"Değerler tarama amaçlıdır; tıbbi karar için doktorunuza danışın.":TL("Values are for screening; consult your doctor for medical decisions.",lang)}</div>
      </>}
    </div>;})()}
  {/* e-Nabız is a Turkey-only national health record. Show it only to users in Turkey or using
      Turkish (covers Turkish users abroad); other regions would see an irrelevant card. */}
  {(ctry==="TR"||lang==="tr")&&<div style={{...CS}}>
    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
      <span style={{fontSize:20}}>🩺</span>
      <div style={{fontWeight:700,color:acTx}}>e-Nabız {lang==="tr"?"Bağlantısı":TL("Connection",lang)}</div>
    </div>
    <div style={{fontSize:fs-3,color:mt,marginBottom:8}}>{lang==="tr"?"T.C. Sağlık Bakanlığı kişisel sağlık kaydın: muayene, tahlil, reçete ve radyoloji raporların tek yerde.":TL("Turkey's Ministry of Health personal health record: visits, labs, prescriptions and radiology reports.",lang)}</div>
    <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:8}}>
      <a href="https://enabiz.gov.tr" target="_blank" rel="noopener noreferrer" style={{...BP,flex:"1 1 45%",textAlign:"center",textDecoration:"none",padding:"8px",fontSize:fs-2}}>🌐 {lang==="tr"?"e-Nabız'ı Aç":TL("Open e-Nabız",lang)}</a>
      <button onClick={connectENabiz} style={{...BP,flex:"1 1 45%",padding:"8px",fontSize:fs-2,background:`linear-gradient(135deg,${sc},#1a7a6e)`}}>🔗 {lang==="tr"?"Hesabımı Bağla":TL("Connect account",lang)}</button>
    </div>
    <div style={{fontSize:fs-3,color:tc,background:`${mt}12`,borderRadius:8,padding:"8px 10px",lineHeight:1.5}}>
      <b>{lang==="tr"?"Şimdi nasıl aktarırım?":TL("How to import now?",lang)}</b><br/>
      {lang==="tr"?"1) e-Nabız'ı aç, e-Devlet ile gir · 2) Rapor/görüntüyü indir · 3) Aşağıdaki \"Tıbbi Görüntüleme\" bölümüne yükle — AILVIE okuyup yorumlar.":"1) Open e-Nabız, sign in with e-Devlet · 2) Download the report/image · 3) Upload it in \"Medical Imaging\" below — AILVIE reads & interprets."}
    </div>
    <div style={{fontSize:fs-4,color:mt,marginTop:8,lineHeight:1.5}}>ℹ️ {lang==="tr"?"Uygulama içinden otomatik veri çekme; Sağlık Bakanlığı resmi API izni (OAuth2/FHIR) + güvenli sunucu + KVKK uyumu gerektirir. Bu onay alınınca \"Hesabımı Bağla\" tek dokunuşla çalışacak (sahte bağlantı göstermiyoruz).":"Automatic in-app data pull requires official Ministry of Health API approval (OAuth2/FHIR) + a secure server + data-protection compliance. Once approved, \"Connect account\" works in one tap (we don't show a fake connection)."}</div>
  </div>}
  {/* Dialysis adequacy. A dialysis patient needs to know if a session actually cleared enough — URR
      and Kt/V are the standard measures, and until now they had to be worked out by hand. Inputs are
      session-based (pre/post urea, time, fluid removed, weight); the module refuses rather than
      guessing when inputs are missing or non-physiological. */}
  <div style={{...CS}}>
    <div style={{fontWeight:700,marginBottom:4,color:acTx}}>🩸 {lang==="tr"?"Diyaliz Yeterliliği (URR / Kt/V)":TL("Dialysis Adequacy (URR / Kt/V)",lang)}</div>
    <div style={{fontSize:fs-3,color:mt,marginBottom:8,lineHeight:1.45}}>{lang==="tr"?"Bir hemodiyaliz seansının yeterli olup olmadığını gösterir. Seans değerlerini girin — sadece üre (öncesi/sonrası) ile URR, hepsiyle Kt/V hesaplanır.":TL("Shows whether a haemodialysis session cleared enough. Enter the session values — urea (pre/post) alone gives URR; all of them give Kt/V.",lang)}</div>
    {(()=>{
      const F=(k,label,unit,ph)=><div style={{flex:"1 1 45%",minWidth:120}}>
        <label style={{fontSize:fs-4,color:mt,display:"block",marginBottom:2}}>{label}{unit?" ("+unit+")":""}</label>
        <input type="number" inputMode="decimal" value={dialysis[k]} onChange={e=>setDialysis(d=>({...d,[k]:e.target.value}))} placeholder={ph||""} style={{width:"100%",padding:"7px 9px",borderRadius:8,border:`1px solid ${bd}`,background:dark?"#0d1520":"#fff",color:tc,fontSize:fs-1,boxSizing:"border-box"}}/>
      </div>;
      return <>
        <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
          {F("preBUN",lang==="tr"?"Üre/BUN öncesi":TL("Urea/BUN pre",lang),"mg/dL","80")}
          {F("postBUN",lang==="tr"?"Üre/BUN sonrası":TL("Urea/BUN post",lang),"mg/dL","24")}
          {F("hours",lang==="tr"?"Seans süresi":TL("Session time",lang),lang==="tr"?"saat":TL("hours",lang),"4")}
          {F("ufLiters",lang==="tr"?"Çekilen sıvı":TL("Fluid removed",lang),"L","2.5")}
          {F("postWeightKg",lang==="tr"?"Seans sonrası ağırlık":TL("Post-session weight",lang),"kg","70")}
        </div>
        {(()=>{
          const da=dialysisAdequacy({preBUN:+dialysis.preBUN,postBUN:+dialysis.postBUN,hours:+dialysis.hours,ufLiters:+dialysis.ufLiters,postWeightKg:+dialysis.postWeightKg});
          if(!da.ok){
            if(da.reason==="post-not-below-pre"&&dialysis.preBUN&&dialysis.postBUN)return <div style={{fontSize:fs-3,color:dg,marginTop:8}}>⚠️ {lang==="tr"?"Sonrası değeri öncesinden düşük olmalı — girişi kontrol edin.":TL("The post value must be lower than the pre value — please check the entry.",lang)}</div>;
            return null;
          }
          const chip=(label,v,adequate,target,unit)=><div style={{flex:"1 1 45%",minWidth:130,padding:"8px 10px",borderRadius:8,background:adequate?sc+"18":"#e9a23b18",border:`1px solid ${adequate?sc:"#e9a23b"}55`}}>
            <div style={{fontSize:fs-4,color:mt}}>{label}</div>
            <div style={{fontSize:fs+2,fontWeight:800,color:adequate?sc:"#e9a23b"}}>{v}{unit}</div>
            <div style={{fontSize:fs-4,color:mt}}>{lang==="tr"?"hedef":TL("target",lang)} {target}{unit} · {adequate?(lang==="tr"?"yeterli ✓":TL("adequate ✓",lang)):(lang==="tr"?"hedefin altında":TL("below target",lang))}</div>
          </div>;
          return <div style={{marginTop:10}}>
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
              {da.urr&&chip("URR",da.urr.value,da.urr.adequate,da.urr.target,"%")}
              {da.ktv&&chip("Kt/V",da.ktv.value,da.ktv.adequate,da.ktv.target,"")}
            </div>
            {!da.ktv&&<div style={{fontSize:fs-4,color:mt,marginTop:6}}>{lang==="tr"?"Kt/V için süre, çekilen sıvı ve ağırlık da gerekli. Kt/V, sıvı çekişini hesaba kattığı için daha eksiksizdir.":TL("Kt/V also needs time, fluid removed and weight. Kt/V is more complete because it accounts for fluid removal.",lang)}</div>}
            <div style={{fontSize:fs-4,color:mt,marginTop:6,lineHeight:1.45}}>ℹ️ {lang==="tr"?"Hedefler yaygın kılavuzlara dayanır (URR ≥%65, Kt/V ≥1.2, haftada 3 seans). Teşhis değildir; diyaliz ekibinizle değerlendirin.":TL("Targets follow common guidelines (URR ≥65%, Kt/V ≥1.2, thrice-weekly). Not a diagnosis; review with your dialysis team.",lang)}</div>
            <div style={{fontSize:fs-5,color:mt,marginTop:2,fontStyle:"italic",opacity:0.85}}>{(lang==="tr"?"kaynak: ":TL("source: ",lang))+(SOURCES["dialysis-kdoqi"]?SOURCES["dialysis-kdoqi"].short:"KDOQI")}</div>
          </div>;
        })()}
      </>;
    })()}
  </div>
  <div style={{...CS}}>
    <div style={{fontWeight:700,marginBottom:4,color:acTx}}>🩻 {lang==="tr"?"Tıbbi Görüntüleme & Belgeler":TL("Medical Imaging & Documents",lang)}</div>
    <div style={{fontSize:fs-3,color:mt,marginBottom:8}}>{lang==="tr"?"Röntgen, tomografi, MR, ultrason, tahlil… Pencereden seç, sürükle-bırak, fotoğraf çek ya da QR/barkod ile yükle.":TL("X-ray, CT, MRI, ultrasound, labs… Pick, drag & drop, take a photo, or upload via QR/barcode.",lang)}</div>

    {/* Report explainer. This reads the WORDS the radiologist wrote — it does not read the image and
        it does not diagnose. It translates the terminology, says what a stated category means and
        what follow-up it carries, and gives the person the questions to take to their doctor. */}
    {(()=>{
      const rep=reportText.trim()?explainReport(reportText):null;
      const catMeaning=(c)=>{
        const map={
          incomplete:lang==="tr"?"Değerlendirme tamamlanmadı — ek görüntü gerekiyor":TL("Assessment incomplete — more imaging needed",lang),
          negative:lang==="tr"?"Bulgu yok (normal)":TL("No findings (normal)",lang),
          benign:lang==="tr"?"İyi huylu bulgu":TL("Benign finding",lang),
          "probably-benign":lang==="tr"?"Büyük olasılıkla iyi huylu — kısa aralıklı takip önerilir":TL("Probably benign — short-interval follow-up advised",lang),
          suspicious:lang==="tr"?"Şüpheli — genellikle biyopsi önerilir":TL("Suspicious — biopsy usually recommended",lang),
          "highly-suspicious":lang==="tr"?"Yüksek şüpheli — biyopsi önerilir":TL("Highly suspicious — biopsy recommended",lang),
          "known-malignancy":lang==="tr"?"Biyopsi ile kanıtlanmış — tedavi süreci":TL("Biopsy-proven — in treatment pathway",lang),
        };
        return map[c.risk]||c.risk;
      };
      const termLbl=(k)=>({
        "microcalcifications":lang==="tr"?"Mikrokalsifikasyon: dokudaki küçük kireç birikintileri; çoğu iyi huyludur, kümelenme takip gerektirebilir":TL("Microcalcifications: tiny calcium deposits; most are benign, clusters may need follow-up",lang),
        "architectural-distortion":lang==="tr"?"Yapısal distorsiyon: doku mimarisinde bozulma; değerlendirilmesi gerekir":TL("Architectural distortion: disruption of tissue architecture; warrants assessment",lang),
        "spiculated":lang==="tr"?"Spiküle: ışınsal/dikensi kenar; radyologun daha dikkatli baktığı bir özelliktir":TL("Spiculated: radiating/spiky margin; a feature radiologists look at closely",lang),
        "fibroadenoma":lang==="tr"?"Fibroadenom: memede sık görülen iyi huylu kitle":TL("Fibroadenoma: a common benign breast lump",lang),
        "breast-density":lang==="tr"?"Meme yoğunluğu: yoğun meme dokusu bulguları gizleyebilir; ek tarama gündeme gelebilir":TL("Breast density: dense tissue can hide findings; supplemental screening may be discussed",lang),
        "well-circumscribed":lang==="tr"?"Düzgün sınırlı: keskin, net kenar; genellikle iyi huyluluk lehine":TL("Well-circumscribed: sharp, clear margin; usually favours benign",lang),
        "irregular-margin":lang==="tr"?"Düzensiz sınır: net olmayan kenar; değerlendirilmesi gereken bir özellik":TL("Irregular margin: unclear edge; a feature to assess",lang),
        "hypoechoic":lang==="tr"?"Hipoekoik: ultrasonda koyu görünen alan":TL("Hypoechoic: appears dark on ultrasound",lang),
        "hyperechoic":lang==="tr"?"Hiperekoik: ultrasonda parlak görünen alan":TL("Hyperechoic: appears bright on ultrasound",lang),
        "cystic":lang==="tr"?"Kistik: içi sıvı dolu kese; çoğunlukla iyi huylu":TL("Cystic: fluid-filled sac; usually benign",lang),
        "solid-lesion":lang==="tr"?"Solid lezyon: sıvı değil, dolu doku; özelliklerine göre değerlendirilir":TL("Solid lesion: filled tissue, not fluid; assessed by its features",lang),
        "ground-glass":lang==="tr"?"Buzlu cam opasitesi: akciğerde puslu görünüm; iltihaptan tümöre kadar birçok nedeni olabilir":TL("Ground-glass opacity: hazy lung appearance; many causes from inflammation to tumour",lang),
        "nodule":lang==="tr"?"Nodül: küçük yuvarlak odak; boyutu ve özelliği takip aralığını belirler":TL("Nodule: small round focus; size and features set the follow-up interval",lang),
        "consolidation":lang==="tr"?"Konsolidasyon: akciğerin havasız, dolu görünmesi; sıklıkla enfeksiyon":TL("Consolidation: airless, filled-in lung; often infection",lang),
        "pleural-effusion":lang==="tr"?"Plevral efüzyon: akciğer zarları arasında sıvı":TL("Pleural effusion: fluid between the lung linings",lang),
        "emphysema":lang==="tr"?"Amfizem: akciğer hava keseciklerinde hasar":TL("Emphysema: damage to the lung air sacs",lang),
        "t2-hyperintense":lang==="tr"?"T2 hiperintens: MR'da parlak sinyal; sıvı/ödem/iltihap işareti olabilir":TL("T2 hyperintense: bright signal on MRI; may mark fluid/oedema/inflammation",lang),
        "enhancement":lang==="tr"?"Kontrast tutulumu: kontrast maddeyi tutan alan; damarlanma/aktiviteyi gösterir":TL("Contrast enhancement: area taking up contrast; shows vascularity/activity",lang),
        "edema":lang==="tr"?"Ödem: doku içi sıvı birikimi/şişlik":TL("Oedema: fluid build-up/swelling in tissue",lang),
        "herniation":lang==="tr"?"Disk hernisi/taşması: omurga diskinin yer değiştirmesi; sinire bası yapabilir":TL("Disc herniation/bulge: displaced spinal disc; can press on a nerve",lang),
        "stenosis":lang==="tr"?"Stenoz: bir kanal/damarın daralması":TL("Stenosis: narrowing of a canal/vessel",lang),
        "hepatic-steatosis":lang==="tr"?"Karaciğer yağlanması: karaciğerde yağ birikimi; sık görülür":TL("Hepatic steatosis: fat in the liver; common",lang),
        "hypodense-lesion":lang==="tr"?"Hipodens lezyon: BT'de koyu görünen alan":TL("Hypodense lesion: appears dark on CT",lang),
        "hyperdense-lesion":lang==="tr"?"Hiperdens lezyon: BT'de parlak görünen alan":TL("Hyperdense lesion: appears bright on CT",lang),
        "simple-cyst":lang==="tr"?"Basit kist: içi sıvı, iyi huylu kese":TL("Simple cyst: fluid-filled, benign sac",lang),
        "no-significant-abnormality":lang==="tr"?"Belirgin bir patoloji tanımlanmamış (olağan/normal)":TL("No significant abnormality described (unremarkable)",lang),
        "incidental":lang==="tr"?"İnsidental: aranmadığı halde rastlantısal bulunan bulgu":TL("Incidental: a finding noticed by chance, not what was looked for",lang),
      }[k]||k);
      const qLbl=(k)=>({
        "q-category-meaning":lang==="tr"?"Bu kategori benim durumumda tam olarak ne anlama geliyor?":TL("What does this category mean specifically for me?",lang),
        "q-biopsy-next":lang==="tr"?"Biyopsi gerekiyor mu, gerekiyorsa ne zaman ve nasıl?":TL("Is a biopsy needed, and if so when and how?",lang),
        "q-followup-when":lang==="tr"?"Kontrol görüntülemeyi tam olarak ne zaman yaptırmalıyım?":TL("Exactly when should I have the follow-up imaging?",lang),
        "q-which-extra-imaging":lang==="tr"?"Hangi ek görüntüleme gerekiyor ve neden?":TL("Which additional imaging is needed and why?",lang),
        "q-treatment-plan":lang==="tr"?"Bundan sonraki tedavi planı ne olacak?":TL("What is the treatment plan from here?",lang),
        "q-incidental-significance":lang==="tr"?"Rastlantısal bulunan bu bulgu önemli mi, takip gerekiyor mu?":TL("Is this incidental finding important — does it need follow-up?",lang),
        "q-density-supplemental":lang==="tr"?"Meme yoğunluğum nedeniyle ek tarama (ultrason/MR) gerekir mi?":TL("Given my breast density, do I need supplemental screening (ultrasound/MRI)?",lang),
        "q-plain-summary":lang==="tr"?"Bu raporu sade bir dille özetler misiniz?":TL("Can you summarise this report in plain language?",lang),
        "q-compare-prior":lang==="tr"?"Bu sonuç önceki görüntülerimle karşılaştırıldığında değişmiş mi?":TL("Compared with my previous imaging, has this changed?",lang),
      }[k]||k);
      const urgTone=rep&&(rep.urgency==="biopsy"||rep.urgency==="treatment"||rep.urgency==="workup")?dg:rep&&(rep.urgency==="short-interval"||rep.urgency==="more-imaging")?"#e9a23b":sc;
      return <div style={{marginBottom:12,padding:"10px",borderRadius:10,background:dark?"#0d1520":"#f8fafc",border:`1px solid ${bd}55`}}>
        <div style={{fontWeight:700,fontSize:fs-1,color:tc,marginBottom:3}}>📄 {lang==="tr"?"Rapor Açıkla":TL("Explain a Report",lang)}</div>
        <div style={{fontSize:fs-3,color:mt,marginBottom:6,lineHeight:1.45}}>{lang==="tr"?"Radyoloji/patoloji raporunuzun yazısını yapıştırın. AILVIE terimleri sade dile çevirir ve doktorunuza soracağınız soruları hazırlar — bu bir teşhis değildir, raporun kendisini açıklar.":TL("Paste the text of your radiology/pathology report. AILVIE translates the terms into plain language and prepares questions for your doctor — this is not a diagnosis, it explains the report itself.",lang)}</div>
        <textarea value={reportText} onChange={e=>setReportText(e.target.value)} placeholder={lang==="tr"?"Rapor metnini buraya yapıştırın…":TL("Paste the report text here…",lang)} style={{...IS,width:"100%",minHeight:70,maxHeight:180,resize:"vertical",fontSize:fs-2,boxSizing:"border-box"}}/>
        {rep&&rep.hasContent&&<div style={{marginTop:8}}>
          {rep.categories.length>0&&<div style={{marginBottom:8}}>
            <div style={{fontSize:fs-2,fontWeight:700,color:urgTone,marginBottom:3}}>🏷️ {lang==="tr"?"Değerlendirme kategorisi":TL("Assessment category",lang)}</div>
            {rep.categories.map((c,i)=><div key={i} style={{padding:"6px 9px",borderRadius:7,background:urgTone+"14",border:`1px solid ${urgTone}44`,marginBottom:4}}>
              <div style={{fontSize:fs-2,fontWeight:700}}>{c.system} {c.value}</div>
              <div style={{fontSize:fs-3,color:tc,marginTop:1}}>{catMeaning(c)}</div>
            </div>)}
            <div style={{fontSize:fs-4,color:mt}}>{lang==="tr"?"Bu, kategorinin yayınlanmış anlamıdır (ACR); sizin sonucunuz değil — onu doktorunuz yorumlar.":TL("This is the category's published meaning (ACR); not your result — your doctor interprets that.",lang)}</div>
          </div>}
          {rep.terms.length>0&&<div style={{marginBottom:8}}>
            <div style={{fontSize:fs-2,fontWeight:700,color:acTx,marginBottom:3}}>📖 {lang==="tr"?"Terimler":TL("Terms",lang)}</div>
            {rep.terms.map((k,i)=><div key={i} style={{fontSize:fs-3,padding:"4px 0",borderBottom:i<rep.terms.length-1?`1px solid ${bd}33`:"none"}}>{termLbl(k)}</div>)}
          </div>}
          <div>
            <div style={{fontSize:fs-2,fontWeight:700,color:sc,marginBottom:3}}>💬 {lang==="tr"?"Doktorunuza sorabilecekleriniz":TL("Questions for your doctor",lang)}</div>
            {rep.questions.map((k,i)=><div key={i} style={{fontSize:fs-3,padding:"3px 0",color:tc}}>• {qLbl(k)}</div>)}
          </div>
        </div>}
        {rep&&!rep.hasContent&&reportText.trim().length>15&&<div style={{marginTop:8,fontSize:fs-3,color:mt}}>{lang==="tr"?"Tanıdık bir kategori (BI-RADS, Lung-RADS) veya terim bulunamadı. Yine de raporu AILVIE Sohbet'e yapıştırıp sade bir özet isteyebilirsiniz.":TL("No familiar category (BI-RADS, Lung-RADS) or term found. You can still paste the report into AILVIE Chat and ask for a plain summary.",lang)}</div>}
      </div>;
    })()}

    <select aria-label={lang==="tr"?"Görüntüleme türü":TL("Imaging type",lang)} value={imgType} onChange={e=>setImgType(e.target.value)} style={{...IS,marginBottom:8}}>{[["xray","Röntgen"],["ct","Tomografi (BT)"],["mri","MR"],["ultra","Ultrason"],["lab","Tahlil/Rapor"],["other","Diğer"]].map(([v,l])=><option key={v} value={v}>{t[v]||l}</option>)}</select>
    <div onDragOver={e=>{e.preventDefault();setImgDrag(true);}} onDragLeave={()=>setImgDrag(false)} onDrop={e=>{e.preventDefault();setImgDrag(false);addMedFiles(e.dataTransfer.files,imgType);}} style={{border:`2px dashed ${imgDrag?ac:bd}`,borderRadius:12,padding:"14px 10px",textAlign:"center",background:imgDrag?`${ac}12`:"transparent",marginBottom:8,transition:"all .15s"}}>
      <div style={{fontSize:26,marginBottom:2}}>📥</div>
      <div style={{fontSize:fs-2,color:mt}}>{lang==="tr"?"Dosyaları buraya sürükleyip bırakın":TL("Drag & drop files here",lang)}</div>
    </div>
    <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
      <button onClick={()=>imgFileRef.current&&imgFileRef.current.click()} style={{...BP,flex:"1 1 45%",padding:"8px",fontSize:fs-2}}>🗂️ {lang==="tr"?"Pencereden Seç":TL("Choose files",lang)}</button>
      <button onClick={()=>imgCamRef.current&&imgCamRef.current.click()} style={{...BP,flex:"1 1 45%",padding:"8px",fontSize:fs-2}}>📷 {lang==="tr"?"Fotoğraf Çek":TL("Take photo",lang)}</button>
      <button onClick={()=>imgBarRef.current&&imgBarRef.current.click()} style={{...BP,flex:"1 1 100%",padding:"8px",fontSize:fs-2,background:`linear-gradient(135deg,${a2},${ac})`}}>🔳 {lang==="tr"?"QR / Barkod ile Yükle":TL("Upload via QR / Barcode",lang)}</button>
    </div>
    <input ref={imgFileRef} type="file" accept="image/*,application/pdf,.pdf,.jpg,.jpeg,.png,.webp,.heic,.heif,.dcm" multiple style={{display:"none"}} onChange={e=>{addMedFiles(e.target.files,imgType);e.target.value="";}}/>
    <input ref={imgCamRef} type="file" accept="image/*" capture="environment" style={{display:"none"}} onChange={e=>{addMedFiles(e.target.files,imgType);e.target.value="";}}/>
    <input ref={imgBarRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>{const f=e.target.files&&e.target.files[0];if(f)scanCodeFromImage(f);e.target.value="";}}/>
    {medImages.length>0&&<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(92px,1fr))",gap:8,marginTop:10}}>
      {medImages.map(im=><div key={im.id} style={{border:`1px solid ${bd}`,borderRadius:10,overflow:"hidden",background:cd}}>
        <img src={im.dataUrl} alt="" onClick={()=>setImgView(im)} style={{width:"100%",height:70,objectFit:"cover",cursor:"pointer",display:"block"}}/>
        <div style={{padding:"4px 5px"}}>
          <div style={{fontSize:fs-4,fontWeight:700,color:acTx,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{t[im.type]||({ct:lang==="tr"?"Tomografi":TL("CT",lang),other:lang==="tr"?"Diğer":TL("Other",lang)}[im.type])||im.type}{im.aiNote?" ✓":""}</div>
          <div style={{display:"flex",gap:4,marginTop:3}}>
            <button onClick={()=>interpretImage(im)} disabled={imgBusy===im.id} title={lang==="tr"?"Raporu Açıkla":TL("Explain report",lang)} style={{flex:1,background:imgBusy===im.id?mt:`linear-gradient(135deg,${ac},${a2})`,border:"none",color:"#fff",borderRadius:6,padding:"3px 0",fontSize:fs-4,cursor:"pointer"}}>{imgBusy===im.id?"…":"🤖"}</button>
            <button onClick={()=>setImgView(im)} style={{background:"none",border:`1px solid ${bd}`,borderRadius:6,padding:"3px 6px",fontSize:fs-4,cursor:"pointer",color:tc}}>👁️</button>
            <button onClick={()=>{toTrash("image",im);notify(lang==="tr"?"Çöp kutusuna taşındı":TL("Moved to Trash",lang));}} style={{background:"none",border:`1px solid ${dg}33`,borderRadius:6,padding:"3px 6px",fontSize:fs-4,cursor:"pointer",color:dg}}>🗑️</button>
          </div>
        </div>
      </div>)}
    </div>}
    <div style={{fontSize:fs-4,color:mt,marginTop:8,lineHeight:1.5}}>💡 {lang==="tr"?"En iyi sonuç için radyoloğun YAZILI RAPORUNUN fotoğrafını yükleyin — AILVIE rapordaki terimleri sade dille açıklar ve doktorunuza soracağınız soruları önerir. Çıplak film (röntgen/MR görüntüsü) pikselden yorumlanmaz; bu iş radyoloğa aittir. Tıbbi tanı değildir.":TL("For the best result, upload a photo of the radiologist's WRITTEN REPORT — AILVIE explains the terms in plain language and suggests questions to ask your doctor. A bare film (X-ray/MRI image) is not read from its pixels; that is the radiologist's job. Not a medical diagnosis. (Requires the server key set in Cloudflare.)",lang)}</div>
  </div>
  {imgView&&<div onClick={()=>setImgView(null)} style={{position:"fixed",inset:0,zIndex:360,background:"rgba(0,0,0,.85)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:16}}>
    <img src={imgView.dataUrl} alt="" onClick={e=>e.stopPropagation()} style={{maxWidth:"100%",maxHeight:"52vh",objectFit:"contain",borderRadius:8}}/>
    <div onClick={e=>e.stopPropagation()} style={{background:cd,color:tc,borderRadius:12,padding:14,marginTop:12,maxWidth:460,width:"100%",maxHeight:"34vh",overflowY:"auto"}}>
      <div style={{fontWeight:700,color:acTx,marginBottom:6}}>{t[imgView.type]||({ct:lang==="tr"?"Tomografi":TL("CT",lang),other:lang==="tr"?"Diğer":TL("Other",lang)}[imgView.type])||imgView.type} · {imgView.date}</div>
      {imgView.aiNote
        ? <div style={{fontSize:fs-1,whiteSpace:"pre-wrap",lineHeight:1.5}}>{imgView.aiNote}</div>
        : <div style={{fontSize:fs-2,color:mt}}>{lang==="tr"?"Henüz açıklama yok. Rapor metni varsa 🤖 ile açıklatabilirsiniz.":TL("No explanation yet. If there's report text, use 🤖 to explain it.",lang)}</div>}
      <div style={{display:"flex",gap:8,marginTop:10}}>
        <button onClick={()=>interpretImage(imgView)} disabled={imgBusy===imgView.id} style={{...BP,flex:1,padding:"7px",fontSize:fs-2}}>{imgBusy===imgView.id?"…":"🤖 "+(lang==="tr"?"Raporu Açıkla":TL("Explain report",lang))}</button>
        <button onClick={()=>setImgView(null)} style={{...BP,flex:1,padding:"7px",fontSize:fs-2,background:mt}}>{lang==="tr"?"Kapat":TL("Close",lang)}</button>
      </div>
    </div>
  </div>}
  {/* Tıbbi Kayıtlar — moved here from X2 so that every input lives on this page. It sits next to the
     document upload above, which is the other way records enter the app; X2 only displays them. */}
  <div style={{fontWeight:700,fontSize:fs,color:mt,marginTop:4}}>📋 {t.diag} / {t.lab}</div>
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
    <span style={{fontSize:fs-2,color:mt}}>{lang==="tr"?"Tanı, tahlil ve rapor kayıtlarınız":TL("Your diagnosis, lab and report records",lang)}</span>
    <button onClick={()=>{setEditRecId(null);setNewRec(EMPTY_REC);recDraftIdRef.current=null;setShowAddRec(true);}} style={{...BP,padding:"6px 14px"}}>+ {t.add}</button>
  </div>
  {records.map(r=>(<div key={r.id} style={CS}><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontWeight:700,color:acTx}}>{t[r.type]||r.type}</span><span style={{fontSize:fs-2,color:mt}}>{r.date}</span></div><div style={{fontSize:fs-1,color:mt}}>{r.doctor} — {r.hospital}</div><div style={{marginTop:4,wordBreak:"break-word"}}>{r.content}</div><div style={{display:"flex",gap:6,marginTop:4}}><button onClick={()=>{setEditRecId(r.id);setNewRec({type:r.type||"diag",doctor:r.doctor||"",hospital:r.hospital||"",date:r.date||"",content:r.content||"",notes:r.notes||""});setShowAddRec(true);}} style={{background:"none",border:`1px solid ${ac}33`,color:acTx,cursor:"pointer",fontSize:12,padding:"3px 8px",borderRadius:6}}>✏️ {lang==="tr"?"Düzenle":TL("Edit",lang)}</button><button onClick={()=>toTrash("record",r)} style={{background:"none",border:`1px solid ${dg}33`,color:dg,cursor:"pointer",fontSize:12,padding:"3px 8px",borderRadius:6}}>🗑️ {t.del}</button></div></div>))}
  {showAddRec&&<div style={{...CS,border:`2px solid ${ac}`}}><div style={{fontWeight:700,marginBottom:8,color:acTx}}>{editRecId?"✏️ "+(lang==="tr"?"Kaydı Düzenle":TL("Edit Record",lang)):"+ "+(lang==="tr"?"Yeni Kayıt":TL("New Record",lang))}</div><select value={newRec.type} onChange={e=>setNewRec({...newRec,type:e.target.value})} style={{...IS,marginBottom:6}}>{["diag","xray","mri","ultra","lab","surg"].map(rt=><option key={rt} value={rt}>{t[rt]||rt}</option>)}</select><input placeholder={t.dr} value={newRec.doctor} onChange={e=>setNewRec({...newRec,doctor:e.target.value})} style={{...IS,marginBottom:6}}/><input placeholder={t.hosp} value={newRec.hospital} onChange={e=>setNewRec({...newRec,hospital:e.target.value})} style={{...IS,marginBottom:6}}/><input type="date" aria-label={lang==="tr"?"Tarih":TL("Date",lang)} value={newRec.date} onChange={e=>setNewRec({...newRec,date:e.target.value})} style={{...IS,marginBottom:6}}/><div style={{display:"flex",gap:6,alignItems:"flex-start"}}><textarea placeholder={lang==="tr"?"İçerik / Sonuç":TL("Content / Result",lang)} value={newRec.content} onChange={e=>setNewRec({...newRec,content:e.target.value})} onInput={autoResize} rows={3} style={{...IS,marginBottom:6,resize:"none"}}/><DictateBtn value={newRec.content} onChange={v=>setNewRec(r=>({...r,content:v}))}/></div><div style={{display:"flex",gap:6}}><button onClick={()=>{recDraftIdRef.current=null;setNewRec(EMPTY_REC);setEditRecId(null);setShowAddRec(false);}} style={BP}>{lang==="tr"?"Bitti":TL("Done",lang)}</button><button onClick={()=>{if(!editRecId&&recDraftIdRef.current!=null){const id=recDraftIdRef.current;setRecords(p=>p.filter(x=>x.id!==id));}recDraftIdRef.current=null;setNewRec(EMPTY_REC);setEditRecId(null);setShowAddRec(false);}} style={{...BP,background:mt}}>{t.cancel}</button></div></div>}
  {/* Multi-layer clinical health score (lab-derived) */}
  {(()=>{
    const L=lang==="tr";
    const recs=(labs||[]).map(x=>({test:x.test,level:x.level,canonValue:x.canonValue,refLow:x.refLow,refHigh:x.refHigh,ts:x.ts}));
    const R=computeHealthScore(recs);
    if(!R.ok)return null;
    const bandTxt={stable:L?"Stabil":"Stable",attention:L?"Dikkat et":"Attention","clinical-review":L?"Klinik değerlendirme uygun":"Clinical review advised","high-risk":L?"Yüksek risk — hızlı doktor değerlendirmesi":"High risk — see a doctor promptly"}[R.band];
    const bandColor=R.band==="stable"?sc:R.band==="attention"?"#e9a23b":dg;
    return <div style={{...CS,border:`1px solid ${bandColor}44`}}>
      {R.critical.length>0&&<div style={{background:`${dg}18`,border:`1.5px solid ${dg}`,borderRadius:10,padding:"10px 12px",marginBottom:10}}>
        <b style={{color:dg,fontSize:fs}}>❗ {L?"KRİTİK DEĞER — önce tıbbi değerlendirme":"CRITICAL VALUE — seek medical review first"}</b>
        <div style={{fontSize:fs-2,color:tc,marginTop:4}}>{R.critical.map(c=>{const ti=LAB_TESTS.find(y=>y.k===c.test);return (L?(ti?ti.tr:c.test):(ti?ti.en:c.test))+": "+c.value;}).join(" · ")}</div>
        <div style={{fontSize:fs-3,color:mt,marginTop:4}}>{L?"Bu durumda yaşam tarzı önerisi verilmez. Lütfen doktorunuza/acile başvurun.":"No wellness tips shown. Contact your doctor."}</div>
      </div>}
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <div style={{flexShrink:0,width:64,height:64,borderRadius:"50%",background:`conic-gradient(${bandColor} ${R.overall*3.6}deg, ${bd} 0deg)`,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <div style={{width:52,height:52,borderRadius:"50%",background:cd,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:fs+3,color:tc}}>{R.overall}</div>
        </div>
        <div style={{flex:1,minWidth:0}}>
          <b style={{fontSize:fs+1,color:tc}}>🧬 {L?"Klinik Sağlık Skoru":"Clinical Health Score"}</b>
          <div style={{fontSize:fs-2,color:bandColor,fontWeight:700,marginTop:2}}>{bandTxt}</div>
          <div style={{fontSize:fs-4,color:mt,marginTop:2}}>{L?`${R.coverage}/${R.totalSystems} sistem değerlendirildi (yalnızca girilen tahliller)`:`${R.coverage}/${R.totalSystems} systems evaluated`}</div>
        </div>
      </div>
      <div style={{marginTop:10}}>
        {Object.entries(R.sysScores).sort((a,b)=>a[1]-b[1]).map(([k,v])=>{const c=v>=90?sc:v>=60?"#e9a23b":dg;return <div key={k} style={{marginBottom:6}}>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:fs-3,marginBottom:2}}><span style={{color:tc}}>{SYS_LABELS[k]?(L?SYS_LABELS[k][0]:SYS_LABELS[k][1]):k}</span><b style={{color:c}}>{v}</b></div>
          <div style={{height:6,borderRadius:3,background:bd,overflow:"hidden"}}><div style={{width:v+"%",height:"100%",background:c,borderRadius:3}}/></div>
        </div>;})}
      </div>
      <div style={{fontSize:fs-4,color:mt,marginTop:6,lineHeight:1.4}}>{L?"Skor yalnızca sınıflandırılabilen tahlillerden hesaplanır; sınıflandırılamayanlar (çocuk/gebelik/bağlam eksik) hesaba katılmaz. Tarama amaçlıdır, tanı değildir.":"Score uses classifiable labs only. Screening, not diagnosis."}</div>
    </div>;})()}
  {/* Kidney: eGFR (CKD-EPI 2021) + UACR + KDIGO */}
  {(()=>{
    const L=lang==="tr",ctx=patCtx();
    const last=(k)=>{const a=(labs||[]).filter(x=>x.test===k).sort((a,b)=>b.ts-a.ts);return a[0]||null;};
    const cr=last("creatinine"),ua=last("uacr");
    if(!cr&&!ua)return null;
    const eg=cr?calcEGFR(cr.canonValue,ctx.ageYears,ctx.sex):null;
    const uStage=ua?uacrStage(ua.canonValue):null;
    const gated=ctx.pregnant||(ctx.band&&ctx.band!=="adult"&&ctx.band!=="older");
    if(gated||(eg&&!eg.ok&&(eg.reason==="age"||eg.reason==="needs-sex")))
      return <div style={{...CS,border:`1px solid ${bd}`}}><b style={{fontSize:fs,color:tc}}>🫘 {L?"Böbrek Değerlendirmesi":"Kidney Assessment"}</b><div style={{fontSize:fs-3,color:mt,marginTop:4}}>{ctx.pregnant?(L?"Gebelikte eGFR formülleri geçerli değildir — doktorunuz değerlendirmelidir.":"eGFR formulas not valid in pregnancy."):(eg&&eg.reason==="needs-sex")?(L?"eGFR için biyolojik cinsiyet gerekli (yukarıdaki Kimlik & Risk Profili).":"Sex required for eGFR."):(L?"Çocuklarda eGFR farklı formül (Schwartz) ve boy gerektirir — hesaplanmadı.":"Pediatric eGFR requires Schwartz equation.")}</div></div>;
    const gColor=(st)=>st==="G1"||st==="G2"?sc:st==="G3a"||st==="G3b"?"#e9a23b":dg;
    const uColor=(st)=>st==="A1"?sc:st==="A2"?"#e9a23b":dg;
    const highRisk=(eg&&eg.ok&&eg.value<60)||(uStage&&uStage!=="A1");
    return <div style={{...CS,border:`1px solid ${highRisk?"#e9a23b":sc}44`}}>
      <b style={{fontSize:fs+1,color:tc}}>🫘 {L?"Böbrek Değerlendirmesi":"Kidney Assessment"}</b>
      <div style={{display:"flex",gap:8,marginTop:8}}>
        {eg&&eg.ok&&<div style={{flex:1,background:dark?"#0e1620":"#f4f7fa",borderRadius:10,padding:"9px 10px"}}>
          <div style={{fontSize:fs-4,color:mt}}>eGFR <span style={{fontSize:fs-5}}>(CKD-EPI 2021)</span></div>
          <div style={{fontSize:fs+4,fontWeight:800,color:gColor(eg.stage)}}>{eg.value}</div>
          <div style={{fontSize:fs-4,color:mt}}>{eg.unit}</div>
          <div style={{fontSize:fs-2,fontWeight:700,color:gColor(eg.stage),marginTop:3}}>{eg.stage} · {KDIGO_TEXT[eg.stage]?(L?KDIGO_TEXT[eg.stage][0]:KDIGO_TEXT[eg.stage][1]):""}</div>
        </div>}
        {uStage&&<div style={{flex:1,background:dark?"#0e1620":"#f4f7fa",borderRadius:10,padding:"9px 10px"}}>
          <div style={{fontSize:fs-4,color:mt}}>UACR</div>
          <div style={{fontSize:fs+4,fontWeight:800,color:uColor(uStage)}}>{ua.canonValue}</div>
          <div style={{fontSize:fs-4,color:mt}}>mg/g</div>
          <div style={{fontSize:fs-2,fontWeight:700,color:uColor(uStage),marginTop:3}}>{uStage} · {UACR_TEXT[uStage]?(L?UACR_TEXT[uStage][0]:UACR_TEXT[uStage][1]):""}</div>
        </div>}
      </div>
      <div style={{background:`${highRisk?"#e9a23b":sc}12`,border:`1px solid ${(highRisk?"#e9a23b":sc)}44`,borderRadius:9,padding:"8px 10px",fontSize:fs-2,color:tc,marginTop:8,lineHeight:1.4}}>
        🧭 {eg&&eg.ok&&eg.value<15?(L?"eGFR böbrek yetmezliği düzeyinde — vakit kaybetmeden doktorunuza başvurun.":"Kidney failure range — seek care promptly."):
            highRisk?(L?"Böbrek fonksiyonu ve/veya idrar albümini beklenenin dışında. Kreatinin, eGFR ve UACR birlikte yorumlanmalıdır; tek bir sonuç tanı koydurmaz. Nefroloji/dahiliye değerlendirmesi uygun olabilir.":"Kidney markers outside expected range; interpret together, not diagnostic."):
            (L?"eGFR ve idrar albümini beklenen aralıkta görünüyor. Rutin takibinizi doktorunuzla planlayın.":"Kidney markers appear within expected range.")}
      </div>
      <div style={{fontSize:fs-4,color:mt,marginTop:6,lineHeight:1.4}}>{L?"eGFR yalnızca 18 yaş üstü, gebe olmayan bireylerde geçerlidir; kas kütlesi, akut hastalık ve bazı ilaçlar sonucu etkiler. Tarama amaçlıdır, tanı değildir.":"eGFR valid for non-pregnant adults only. Screening, not diagnosis."}</div>
    </div>;})()}
  {/* HOMA-IR (auto) */}
  {(()=>{
    const L=lang==="tr",ctx=patCtx();
    const last=(k)=>{const a=(labs||[]).filter(x=>x.test===k).sort((a,b)=>b.ts-a.ts);return a[0]||null;};
    const g=last("glucose"),ins=last("insulin");
    if(!g||!ins)return null;
    if(ctx.pregnant||(ctx.band&&ctx.band!=="adult"&&ctx.band!=="older")||!ctx.band)
      return <div style={{...CS,border:`1px solid ${bd}`}}><b style={{fontSize:fs,color:tc}}>🧮 HOMA-IR</b><div style={{fontSize:fs-3,color:mt,marginTop:4}}>{L?"Yaş/gebelik bağlamı nedeniyle hesaplanmıyor — doktorunuz değerlendirmelidir.":"Not computed due to age/pregnancy context."}</div></div>;
    const h=homaIR(g.canonValue,ins.canonValue);
    if(!h)return null;
    const c=h.level==="normal"?sc:h.level==="borderline"?"#e9a23b":dg;
    const lbl=h.level==="normal"?(L?"normal":"normal"):h.level==="borderline"?(L?"sınırda":"borderline"):(L?"insülin direnci lehine":"suggests insulin resistance");
    return <div style={{...CS,border:`1px solid ${c}44`}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><b style={{fontSize:fs,color:tc}}>🧮 HOMA-IR</b><b style={{fontSize:fs+3,color:c}}>{h.value}</b></div>
      <div style={{fontSize:fs-2,color:c,fontWeight:700,marginTop:2}}>{lbl}</div>
      <div style={{fontSize:fs-3,color:mt,marginTop:4}}>{L?`Açlık glukozu ${g.canonValue} mg/dL × açlık insülini ${ins.canonValue} µIU/mL ÷ 405`:`Fasting glucose × insulin ÷ 405`}</div>
      <div style={{fontSize:fs-4,color:mt,marginTop:5,lineHeight:1.4}}>{L?"Yalnızca AÇLIK örnekleri için geçerlidir. Eşikler popülasyona göre değişir; tarama amaçlıdır, tanı değildir.":"Valid for fasting samples only. Screening, not diagnosis."}</div>
    </div>;})()}
  {/* Recommendation engine: education -> lifestyle -> clinical follow-up */}
  {(()=>{
    const L=lang==="tr";
    const recs=(labs||[]).map(x=>({test:x.test,level:x.level,ts:x.ts}));
    const R=buildRecommendations(recs,lang);
    if(!R.ok||(!R.items.length&&!R.allNormal))return null;
    const fuTxt=(fu)=>fu.urgency==="urgent"?(L?"Acil değerlendirme":"Urgent review"):fu.urgency==="soon"?(L?`${fu.weeks} hafta içinde tekrar/kontrol önerilebilir`:`Recheck within ${fu.weeks} weeks`):(L?`~${fu.weeks} hafta sonra rutin kontrol`:`Routine recheck in ~${fu.weeks} weeks`);
    const lvT=(lv)=>({low:L?"düşük":"low",high:L?"yüksek":"high","critical-low":L?"kritik düşük":"critical low","critical-high":L?"kritik yüksek":"critical high",prediabetes:L?"prediyabet eşiği":"prediabetes","diabetes-range":L?"diyabet eşiği":"diabetes range"}[lv]||lv);
    if(R.allNormal)return <div style={{...CS,border:`1px solid ${sc}44`}}><b style={{fontSize:fs,color:sc}}>✅ {L?"Girilen tahlillerin tümü referans aralığında":"All entered labs within reference"}</b><div style={{fontSize:fs-3,color:mt,marginTop:4}}>{L?"Rutin takibinizi doktorunuzla planlayın. Bu bir tanı değildir.":"Plan routine follow-up with your doctor."}</div></div>;
    return <div style={{...CS,border:`1px solid ${R.critical?dg:"#e9a23b"}44`}}>
      <b style={{fontSize:fs+1,color:tc}}>💡 {L?"Öneriler":"Recommendations"}</b>
      {R.critical
        ? <div style={{background:`${dg}12`,border:`1px solid ${dg}55`,borderRadius:9,padding:"9px 11px",marginTop:8}}>
            <b style={{color:dg,fontSize:fs-1}}>❗ {L?"Kritik değer saptandı":"Critical value detected"}</b>
            {R.items.map(it=><div key={it.test} style={{marginTop:6}}>
              <div style={{fontSize:fs-1,fontWeight:700,color:tc}}>{it.name} — <span style={{color:dg}}>{lvT(it.level)}</span></div>
              <div style={{fontSize:fs-3,color:mt,marginTop:2}}>{it.edu}</div>
              <div style={{fontSize:fs-2,color:dg,marginTop:4,fontWeight:600}}>{it.action}</div>
            </div>)}
          </div>
        : <div style={{marginTop:6}}>
            {R.items.map(it=><div key={it.test} style={{borderTop:`1px solid ${bd}`,paddingTop:8,marginTop:8}}>
              <div style={{fontSize:fs,fontWeight:700,color:tc}}>{it.name} <span style={{color:"#e9a23b",fontSize:fs-2}}>· {lvT(it.level)}</span></div>
              <div style={{fontSize:fs-3,color:mt,marginTop:3,lineHeight:1.4}}>📖 {it.edu}</div>
              {it.lifestyle.length>0&&<div style={{marginTop:5}}>
                <div style={{fontSize:fs-3,color:tc,fontWeight:600}}>🌿 {L?"Yaşam tarzı (genel bilgi)":"Lifestyle (general)"}</div>
                <ul style={{margin:"3px 0 0",paddingLeft:18,color:mt,fontSize:fs-3,lineHeight:1.5}}>{it.lifestyle.map((x,i)=><li key={i}>{x}</li>)}</ul>
              </div>}
              <div style={{fontSize:fs-3,color:tc,marginTop:5}}>🏥 {L?"Klinik takip":"Follow-up"}: <span style={{color:mt}}>{fuTxt(it.followUp)}{it.specialty?` · ${L?"uygun olabilecek branş":"possible specialty"}: ${it.specialty}`:""}</span></div>
            </div>)}
          </div>}
      <div style={{fontSize:fs-4,color:mt,marginTop:10,lineHeight:1.4}}>{L?"⚕️ Bu öneriler eğitim amaçlıdır; tanı koymaz, ilaç başlatmaz/durdurmaz. Tek bir referans dışı sonuç tek başına hastalık anlamına gelmez. Kararları doktorunuz verir.":"⚕️ Educational only; not a diagnosis. Never start/stop medication based on this."}</div>
    </div>;})()}
  {/* Lab Results (context-aware reference engine) */}
  {(()=>{
    const L=lang==="tr",ctx=patCtx();
    const tInfo=LAB_TESTS.find(x=>x.k===labForm.test)||LAB_TESTS[0];
    const preview=labForm.value?evaluateLab(labForm.test,labForm.value,labForm.unit,ctx,(labForm.low&&labForm.high)?{low:labForm.low,high:labForm.high}:null):null;
    const lvlColor=(lv)=>lv==="normal"?sc:(lv==="critical-low"||lv==="critical-high"||lv==="diabetes-range")?dg:(lv==="low"||lv==="high"||lv==="prediabetes")?"#e9a23b":mt;
    const lvlLabel=(lv)=>({normal:L?"normal":"normal",low:L?"düşük":"low",high:L?"yüksek":"high","critical-low":L?"kritik düşük":"critical low","critical-high":L?"kritik yüksek":"critical high",prediabetes:L?"prediyabet eşiği":"prediabetes","diabetes-range":L?"diyabet eşiği":"diabetes range"}[lv]||lv);
    const naMsg=(reason)=>({age:L?"Yaşa özgü referans gerekli — sınıflandırma yapılmadı":"Age-specific reference needed",pregnancy:L?"Gebelikte eşikler farklıdır — sınıflandırma yapılmadı":"Pregnancy thresholds differ","paediatric-adult-range-may-not-apply":L?"Çocuklarda bu test yaşa göre çok değişir; erişkin aralığı yanıltıcı olabilir. Değerlendirmeyi çocuk doktoruna bırakın.":TL("In children this test varies a lot by age; the adult range may mislead. Leave interpretation to a paediatrician.",lang),"pregnancy-adult-range-may-not-apply":L?"Gebelikte bu testin aralığı kayabilir; erişkin aralığı yanıltıcı olabilir. Doktorunuza danışın.":TL("This test's range can shift in pregnancy; the adult range may mislead. Consult your doctor.",lang),"no-context":L?"Doğum tarihi/cinsiyet girin (yukarıdaki Kimlik & Risk Profili)":"Add birth date/sex in Identity & Risk Profile above","not-in-library":L?"Bu test için dahili referans yok — raporunuzun aralığını girin":"No internal reference — enter your report's range","needs-sex":L?"Cinsiyet gerekli":"Sex required","needs-sex-age":L?"Yaş ve cinsiyet gerekli (yukarıdaki Kimlik & Risk Profili)":"Age and sex required","therapy-target":L?"Kan sulandırıcı tedavide INR hedefi kişiye özeldir — sınıflandırılmadı":"INR target is therapy-specific"}[reason]||reason);
    const save=()=>{
      const r=evaluateLab(labForm.test,labForm.value,labForm.unit,ctx,(labForm.low&&labForm.high)?{low:labForm.low,high:labForm.high}:null);
      if(!r.ok){notify(r.reason==="unknown-unit"||r.reason==="missing-unit"?(L?"⚠️ Birim tanınmadı — sonuç kaydedilmedi":"⚠️ Unknown unit"):(L?"Geçersiz değer":"Invalid value"));return;}
      setLabs(p=>[...p,{id:Date.now()+"_"+Math.random().toString(36).slice(2,5),ts:Date.now(),test:labForm.test,value:Number(labForm.value),unit:labForm.unit,canonValue:r.norm.value,canonUnit:r.norm.unit,level:r.cls.applicable?r.cls.level:null,naReason:r.cls.applicable?null:r.cls.reason,refLow:(r.ref&&r.ref.ok)?r.ref.low:null,refHigh:(r.ref&&r.ref.ok)?r.ref.high:null,source:(r.ref&&r.ref.source)||r.kind,labLow:labForm.low||null,labHigh:labForm.high||null}]);
      if(r.cls.applicable&&(r.cls.level==="critical-low"||r.cls.level==="critical-high"))setActiveAlert({icon:"🧪",title:L?"KRİTİK TAHLİL DEĞERİ":TL("CRITICAL LAB VALUE",lang),msg:(L?tInfo.tr:tInfo.en)+" "+labForm.value+" "+labForm.unit+" — "+(L?"acil değerlendirme gerekebilir, doktorunuza başvurun":TL("this may need urgent attention — contact your doctor",lang))});
      setLabForm(f=>({...f,value:"",low:"",high:""}));notify(L?"✓ Tahlil kaydedildi":"✓ Lab saved");
    };
    return <div style={{...CS}}>
      <b style={{fontSize:fs+1,color:tc}}>🧪 {L?"Tahlil Sonuçları":"Lab Results"}</b>
      <div style={{fontSize:fs-3,color:mt,marginTop:2,marginBottom:8}}>{L?"Raporunuzdaki değeri girin. Raporda referans aralığı varsa onu da girin — uygulama önce onu kullanır.":"Enter your report value. If your report shows a reference range, enter it — it takes priority."}</div>
      <div style={{display:"flex",gap:6,marginBottom:8}}>
        <label style={{flex:1}}>
          <input type="file" accept="image/*" capture="environment" style={{display:"none"}} onChange={e=>{const f2=e.target.files&&e.target.files[0];e.target.value="";if(f2)parseLabDocument(f2);}}/>
          <div style={{...BP,background:"transparent",color:acTx,border:`1px dashed ${ac}`,textAlign:"center",padding:"10px 6px",cursor:"pointer",opacity:labParse.busy?0.6:1,fontSize:fs-2}}>{L?"📷 Fotoğraf çek":"📷 Take photo"}</div>
        </label>
        <label style={{flex:1.3}}>
          <input type="file" accept="image/*,application/pdf,.pdf,.jpg,.jpeg,.png,.webp,.heic,.heif" style={{display:"none"}} onChange={e=>{const f2=e.target.files&&e.target.files[0];e.target.value="";if(f2)parseLabDocument(f2);}}/>
          <div style={{...BP,background:"transparent",color:acTx,border:`1px dashed ${ac}`,textAlign:"center",padding:"10px 6px",cursor:"pointer",opacity:labParse.busy?0.6:1,fontSize:fs-2}}>{L?"📁 Dosya / PDF seç":"📁 Choose file / PDF"}</div>
        </label>
      </div>
      {labParse.busy&&<div style={{textAlign:"center",color:acTx,fontSize:fs-2,marginBottom:8}}>🔍 {L?"Belge okunuyor…":"Reading…"}</div>}
      <div style={{fontSize:fs-5,color:mt,marginBottom:8,textAlign:"center"}}>{L?"Dosya seç: galeri, Dosyalar, Drive, İndirilenler — hepsinden yükleyebilirsiniz":"Choose file: gallery, Files, Drive, Downloads"}</div>
      {labParse.err&&<div style={{background:`${dg}12`,border:`1px solid ${dg}44`,borderRadius:9,padding:"8px 10px",fontSize:fs-3,color:tc,marginBottom:8}}>⚠️ {labParse.err}</div>}
      {labParse.rows.length>0&&<div style={{background:dark?"#0e1620":"#f4f7fa",borderRadius:10,padding:"9px 10px",marginBottom:8}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <b style={{fontSize:fs-1,color:tc}}>{L?"Okunan değerler":"Parsed values"}</b>
          <button onClick={()=>setLabParse({busy:false,rows:[],err:null,fileName:""})} style={{background:"none",border:"none",color:mt,cursor:"pointer",fontSize:fs-2}}>✕</button>
        </div>
        {labParse.overall!=null&&labParse.overall<0.7&&<div style={{background:`#e9a23b18`,border:`1px solid #e9a23b55`,borderRadius:8,padding:"6px 9px",fontSize:fs-4,color:tc,margin:"6px 0"}}>⚠️ {L?"Düşük güvenle ayrıştırıldı — lütfen her değeri raporunuzla karşılaştırıp düzeltin.":"Parsed with low confidence — please verify each value."}</div>}
        <div style={{fontSize:fs-4,color:mt,marginBottom:6}}>{L?"Kaydetmeden önce kontrol edin. AI hata yapabilir; sorumluluk size aittir.":"Verify before saving."}{labParse.labName?` · ${labParse.labName}`:""}</div>
        {labParse.rows.map((row,ri)=>{
          const upd=(k,v)=>setLabParse(p=>({...p,rows:p.rows.map((x,i)=>i===ri?{...x,[k]:v}:x)}));
          const lowConf=row.confidence<0.7;
          const ti2=LAB_TESTS.find(x=>x.k===row.test);
          return <div key={row.id} style={{borderTop:`1px solid ${bd}`,paddingTop:6,marginTop:6}}>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <input aria-label={lang==="tr"?"Bu satırı kaydet":TL("Include this row",lang)} type="checkbox" checked={row.include} onChange={e=>upd("include",e.target.checked)} style={{width:16,height:16,flexShrink:0}}/>
              <select aria-label={lang==="tr"?"Okunan test":TL("Parsed test",lang)} value={row.test} onChange={e=>{const nt=LAB_TESTS.find(x=>x.k===e.target.value);upd("test",e.target.value);if(nt&&!nt.units.includes(row.unit))upd("unit",nt.units[0]);}} style={{...IS,flex:1,padding:"5px 6px",fontSize:fs-3}}>
                <option value="">{L?"— eşleşmedi —":"— unmatched —"}</option>
                {LAB_TESTS.map(x=><option key={x.k} value={x.k}>{L?x.tr:x.en}</option>)}
              </select>
              {lowConf&&<span title={L?"düşük güven":"low confidence"} style={{fontSize:fs-4,color:"#e9a23b",flexShrink:0}}>⚠️</span>}
            </div>
            {row.rawName&&<div style={{fontSize:fs-5,color:mt,marginLeft:22}}>{L?"raporda":"as printed"}: {row.rawName}{row.flag?` · ${row.flag}`:""}</div>}
            <div style={{display:"flex",gap:5,marginTop:4,marginLeft:22}}>
              <input aria-label={lang==="tr"?"Değer":TL("Value",lang)} value={row.value} onChange={e=>upd("value",e.target.value)} placeholder={L?"değer":"value"} style={{...IS,flex:1,padding:"5px 6px",fontSize:fs-3}}/>
              <select aria-label={lang==="tr"?"Okunan birim":TL("Parsed unit",lang)} value={row.unit} onChange={e=>upd("unit",e.target.value)} style={{...IS,flex:1,padding:"5px 6px",fontSize:fs-3}}>{(ti2?ti2.units:[row.unit]).map(u=><option key={u} value={u}>{u||"—"}</option>)}</select>
              <input aria-label={lang==="tr"?"Alt sınır":TL("Lower bound",lang)} value={row.low} onChange={e=>upd("low",e.target.value)} placeholder={L?"alt":"low"} style={{...IS,width:52,padding:"5px 4px",fontSize:fs-3}}/>
              <input aria-label={lang==="tr"?"Üst sınır":TL("Upper bound",lang)} value={row.high} onChange={e=>upd("high",e.target.value)} placeholder={L?"üst":"high"} style={{...IS,width:52,padding:"5px 4px",fontSize:fs-3}}/>
            </div>
          </div>;})}
        <button onClick={()=>{
          const ctx2=patCtx();let n=0,skipped=0;const add=[];
          labParse.rows.filter(r=>r.include&&r.test&&r.value!=="").forEach(r=>{
            const ev=evaluateLab(r.test,r.value,r.unit,ctx2,(r.low&&r.high)?{low:r.low,high:r.high}:null);
            if(!ev.ok){skipped++;return;}
            add.push({id:Date.now()+"_"+Math.random().toString(36).slice(2,5),ts:Date.now(),test:r.test,value:Number(r.value),unit:r.unit,canonValue:ev.norm.value,canonUnit:ev.norm.unit,level:ev.cls.applicable?ev.cls.level:null,naReason:ev.cls.applicable?null:ev.cls.reason,refLow:(ev.ref&&ev.ref.ok)?ev.ref.low:null,refHigh:(ev.ref&&ev.ref.ok)?ev.ref.high:null,source:(ev.ref&&ev.ref.source)||ev.kind,labLow:r.low||null,labHigh:r.high||null,parsed:true});n++;
          });
          if(!n){notify(L?"Kaydedilecek geçerli satır yok (birim/test eşleşmedi).":"No valid rows.");return;}
          setLabs(p=>[...p,...add]);setLabParse({busy:false,rows:[],err:null,fileName:""});
          notify(L?`✓ ${n} tahlil kaydedildi${skipped?` · ${skipped} atlandı (birim tanınmadı)`:""}`:`✓ ${n} labs saved`);
        }} style={{...BP,width:"100%",marginTop:8,padding:"8px"}}>✓ {L?"Seçilenleri Kaydet":"Save selected"}</button>
      </div>}
      <select aria-label={lang==="tr"?"Tahlil testi seçin":TL("Select lab test",lang)} value={labForm.test} onChange={e=>{const nt=LAB_TESTS.find(x=>x.k===e.target.value);setLabForm(f=>({...f,test:e.target.value,unit:nt.units[0],value:"",low:"",high:""}));}} style={{...IS,width:"100%",marginBottom:6}}>{LAB_TESTS.map(x=><option key={x.k} value={x.k}>{L?x.tr:x.en}</option>)}</select>
      <div style={{display:"flex",gap:6,marginBottom:6}}>
        <input aria-label={lang==="tr"?"Tahlil değeri":TL("Lab value",lang)} type="number" step="0.01" inputMode="decimal" value={labForm.value} onChange={e=>setLabForm(f=>({...f,value:e.target.value}))} placeholder={L?"Değer":"Value"} style={{...IS,flex:1}}/>
        <select aria-label={lang==="tr"?"Birim seçin":TL("Select unit",lang)} value={labForm.unit} onChange={e=>setLabForm(f=>({...f,unit:e.target.value}))} style={{...IS,flex:"0 0 42%"}}>{tInfo.units.map(u=><option key={u} value={u}>{u}</option>)}</select>
      </div>
      <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:6}}>
        <span style={{fontSize:fs-3,color:mt,flex:"0 0 auto"}}>📄 {L?"Raporun aralığı":"Report range"}</span>
        <input aria-label={lang==="tr"?"Raporun alt sınırı":TL("Report lower bound",lang)} type="number" step="0.01" value={labForm.low} onChange={e=>setLabForm(f=>({...f,low:e.target.value}))} placeholder={L?"alt":"low"} style={{...IS,flex:1,padding:"6px 8px"}}/>
        <span style={{color:mt}}>–</span>
        <input aria-label={lang==="tr"?"Raporun üst sınırı":TL("Report upper bound",lang)} type="number" step="0.01" value={labForm.high} onChange={e=>setLabForm(f=>({...f,high:e.target.value}))} placeholder={L?"üst":"high"} style={{...IS,flex:1,padding:"6px 8px"}}/>
      </div>
      {preview&&(!preview.ok
        ? <div style={{background:`${dg}12`,border:`1px solid ${dg}44`,borderRadius:9,padding:"8px 10px",fontSize:fs-3,color:tc,marginBottom:6}}>⚠️ {L?"Birim tanınmadı — değerlendirme yapılamaz.":"Unknown unit — cannot evaluate."}</div>
        : <div style={{background:dark?"#0e1620":"#f4f7fa",borderRadius:9,padding:"8px 10px",fontSize:fs-2,marginBottom:6}}>
            <div style={{color:mt,fontSize:fs-3}}>{L?"Normalize":"Normalized"}: <b style={{color:tc}}>{preview.norm.value} {preview.norm.unit}</b></div>
            {preview.cls.applicable
              ? <div style={{marginTop:3}}><b style={{color:lvlColor(preview.cls.level)}}>{lvlLabel(preview.cls.level)}</b> <span style={{fontSize:fs-4,color:mt}}>· {preview.kind==="threshold"?(L?"tanısal karar eşiği":"diagnostic threshold"):(preview.ref&&preview.ref.source==="lab-reported"?(L?"raporun aralığı":"report range"):preview.cls.note==="paediatric"?(L?"çocuk yaş aralığı":TL("child age range",lang)):preview.cls.note==="pregnancy"?(L?"gebelik aralığı":TL("pregnancy range",lang)):(L?"dahili referans":"internal reference"))}{preview.ref&&preview.ref.ok?` (${preview.ref.low}–${preview.ref.high})`:""}</span>{preview.cls.note==="paediatric"&&<div style={{fontSize:fs-5,color:mt,marginTop:1}}>{L?"Doğrulanmış çocuk yaş aralığı kullanıldı — yine de değerlendirmeyi çocuk doktoruna bırakın.":TL("A verified child age range was used — still leave interpretation to a paediatrician.",lang)}</div>}{preview.cls.note==="pregnancy"&&<div style={{fontSize:fs-5,color:mt,marginTop:1}}>{L?"Gebelik aralığı kullanıldı; kesin sınırlar trimestre göre biraz değişir — takibi doktorunuzla yapın.":TL("A pregnancy range was used; exact limits shift a little by trimester — follow up with your doctor.",lang)}</div>}</div>
              : <div style={{marginTop:3,color:"#e9a23b",fontSize:fs-3}}>⚠️ {naMsg(preview.cls.reason)}</div>}
          </div>)}
      <button onClick={save} disabled={!labForm.value} style={{...BP,width:"100%",padding:"9px",opacity:labForm.value?1:0.5}}>+ {L?"Tahlili Kaydet":"Save Lab"}</button>
      {labs.length>0&&<div style={{marginTop:10}}>
        <div style={{fontSize:fs-2,fontWeight:700,color:mt,marginBottom:4}}>{L?"Kayıtlar":"Records"}</div>
        {[...labs].reverse().slice(0,8).map(x=>{const ti=LAB_TESTS.find(y=>y.k===x.test);const d=new Date(x.ts);return <div key={x.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${bd}`,gap:8}}>
          <div style={{minWidth:0,flex:1}}><div style={{fontSize:fs-1,color:tc,fontWeight:600}}>{ti?(L?ti.tr:ti.en):x.test}</div><div style={{fontSize:fs-4,color:mt}}>{d.toLocaleDateString(lc,{day:"2-digit",month:"2-digit",year:"numeric"})} {d.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}{x.source==="lab-reported"?` · ${L?"raporun aralığı":"report range"}`:""}</div></div>
          <div style={{textAlign:"right",flexShrink:0}}><b style={{fontSize:fs,color:x.level?lvlColor(x.level):tc}}>{x.value} <span style={{fontSize:fs-4,fontWeight:400,color:mt}}>{x.unit}</span></b><div style={{fontSize:fs-4,color:x.level?lvlColor(x.level):mt}}>{x.level?lvlLabel(x.level):(L?"sınıflandırılmadı":"not classified")}</div></div>
          <button onClick={()=>{toTrash("lab",x);notify(lang==="tr"?"Çöp kutusuna taşındı":TL("Moved to Trash",lang));}} style={{background:"none",border:"none",color:dg,cursor:"pointer",fontSize:fs-1,flexShrink:0}}>✕</button>
        </div>;})}
      </div>}
      <div style={{fontSize:fs-4,color:mt,marginTop:8,lineHeight:1.4}}>{L?"Referans aralıkları laboratuvara/yönteme/yaşa göre değişir. Bu değerlendirme tarama amaçlıdır, tıbbi tanı değildir — raporunuzu doktorunuz yorumlamalıdır.":"Reference ranges vary by lab/method/age. Screening only, not a diagnosis."}</div>
    </div>;})()}
  {/* Measurement guides — moved here from Settings: they belong next to the measurements */}
  <div style={{...CS}}>
    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
      <span style={{fontSize:20}}>🔊</span>
      <b style={{fontSize:fs+1,color:tc}}>{lang==="tr"?"Ölçüm Rehberleri":TL("Measurement Guides",lang)}</b>
    </div>
    <div style={{fontSize:fs-3,color:mt,marginBottom:8,lineHeight:1.45}}>
      {voiceGuide
        ? (lang==="tr"?"Adım adım sesli anlatım açık. Bir ölçüme dokunduğunuzda rehber kendiliğinden başlar.":TL("Spoken step-by-step coaching is on.",lang))
        : (lang==="tr"?"Sessiz metin modu. Sesli anlatım için Ayarlar > İçerik Filtresi > Sesli yönlendirme.":TL("Silent text mode. Enable voice in Settings.",lang))}
    </div>
    <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
      {Object.keys(GUIDES).map(k=>(
        <button key={k} onClick={()=>startGuide(k)}
          aria-label={(lang==="tr"?GUIDES[k].tr:GUIDES[k].en)+" "+(lang==="tr"?"rehberi":TL("guide",lang))}
          style={{...pill(false),fontSize:fs-3,display:"flex",alignItems:"center",gap:5}}>
          <span>{GUIDES[k].icon}</span><span>{lang==="tr"?GUIDES[k].tr:GUIDES[k].en}</span>
        </button>))}
    </div>
  </div>

  {/* Vital Signs */}
  <div style={{fontWeight:700,fontSize:fs,color:mt,marginTop:4}}>🫀 {lang==="tr"?"Yaşamsal Değerler":TL("Vital Signs",lang)}</div>
  <div style={{...CS,display:"flex",alignItems:"center",gap:10}}>
    <span style={{fontSize:22}}>❤️</span>
    <div style={{flex:1}}>
      <div style={{fontSize:fs-2,color:mt}}>{t.pulse}</div>
      {editH==="pulse"?<div style={{display:"flex",gap:6,alignItems:"center",marginTop:3}}><input type="number" autoFocus value={tmpH} onChange={e=>setTmpH(e.target.value)} style={{...IS,width:80,padding:"6px 8px",fontWeight:700}} onKeyDown={e=>{if(e.key==="Enter"){setHd(p=>({...p,pulse:Number(tmpH)}));logMetric("pulse",Number(tmpH));setEditH(null);}}}/><span style={{fontSize:fs-2,color:mt}}>{t.bpm}</span><button onClick={()=>{setHd(p=>({...p,pulse:Number(tmpH)}));logMetric("pulse",Number(tmpH));setEditH(null);}} style={{...BP,padding:"5px 10px"}}>✓</button></div>
      :<div onClick={()=>{setEditH("pulse");setTmpH(hd.pulse>0?String(hd.pulse):"");if(voiceGuide)startGuide("pulse");}} style={{cursor:"pointer",fontWeight:700,fontSize:fs+2,color:hd.pulse>0?tc:mt,marginTop:2}}>{hd.pulse>0?`${hd.pulse} ${t.bpm}`:t.tap}</div>}
      {hd.pulse>0&&<div style={{fontSize:fs-3,color:mt,marginTop:2}}>{lang==="tr"?"Referans":TL("Ref",lang)}: {pulseRef.label} bpm {patAge?`(${patAge} ${t.age})`:""}</div>}
      {hd.hrvRmssd>0&&<div style={{fontSize:fs-3,color:acTx,marginTop:2}}>HRV · RMSSD {hd.hrvRmssd} ms · SDNN {hd.hrvSdnn} ms</div>}
      {hd.resp>0&&<div style={{fontSize:fs-3,color:acTx,marginTop:2}}>{lang==="tr"?"Solunum":TL("Resp",lang)}: {hd.resp} {lang==="tr"?"/dk (tahmini)":TL("/min (est.)",lang)}</div>}
    </div>
    <div style={{display:"flex",flexDirection:"column",gap:4,alignItems:"flex-end"}}>
      {hd.pulse>0&&<span style={{padding:"3px 8px",borderRadius:6,fontSize:fs-3,fontWeight:600,background:pulseOk?`${sc}22`:`${dg}22`,color:pulseOk?sc:dg}}>{pulseOk?t.norm:t.caut}</span>}
      <button onClick={()=>startPulseMeasure()} style={{...BP,padding:"5px 9px",fontSize:fs-3,whiteSpace:"nowrap",background:`linear-gradient(135deg,${dg},#c0392b)`}}>📷 {lang==="tr"?"Ölç":TL("Measure",lang)}</button>
      <button onClick={()=>startPulseMeasure(false,true)} style={{...BP,padding:"5px 9px",fontSize:fs-3,whiteSpace:"nowrap",background:`linear-gradient(135deg,${a2},${ac})`}}>❤️ HRV<span style={{fontSize:fs-5,opacity:0.8}}> 60s</span></button>
    </div>
  </div>
  <div style={{...CS,display:"flex",alignItems:"center",gap:10}}>
    <span style={{fontSize:22}}>🔗</span>
    <div style={{flex:1,minWidth:0}}>
      <div style={{fontSize:fs-2,color:mt}}>{lang==="tr"?"Harici Cihaz — Bluetooth nabız":TL("External Device — Bluetooth HR",lang)}</div>
      <div style={{fontWeight:700,fontSize:fs+1,marginTop:2,color:(bleHr&&bleHr.connected)?sc:tc}}>
        {bleHr&&bleHr.connected?(bleHr.bpm?`${bleHr.bpm} ${t.bpm} · ${bleHr.name}`:(lang==="tr"?`Bağlı: ${bleHr.name}`:`Connected: ${bleHr.name}`)):bleHr&&bleHr.connecting?(lang==="tr"?"Bağlanıyor…":TL("Connecting…",lang)):(lang==="tr"?"Bağlı değil":TL("Not connected",lang))}
      </div>
      {bleHr&&bleHr.error&&<div style={{fontSize:fs-3,color:dg,marginTop:2,lineHeight:1.4}}>{bleHr.error}</div>}
    </div>
    {(bleHr&&(bleHr.connected||bleHr.connecting))
      ?<button onClick={disconnectBle} style={{...BP,padding:"5px 10px",fontSize:fs-3,background:mt}}>{lang==="tr"?"Kes":TL("Disconnect",lang)}</button>
      :<button onClick={connectBleHr} style={{...BP,padding:"5px 10px",fontSize:fs-3,background:`linear-gradient(135deg,${ac},${a2})`}}>🔗 {lang==="tr"?"Bağlan":TL("Connect",lang)}</button>}
  </div>
  <div style={CS}>
    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}><span style={{fontSize:22}}>🩺</span><span style={{fontWeight:700,fontSize:fs+1}}>{t.bp} (SYS / DIA)</span>
      <button onClick={()=>startGuide("bp")} aria-label={lang==="tr"?"Tansiyon ölçüm rehberi":TL("BP measurement guide",lang)} title={lang==="tr"?"Nasıl ölçülür?":TL("How to measure",lang)} style={{marginLeft:"auto",background:"transparent",border:`1px solid ${bd}`,color:acTx,borderRadius:8,padding:"3px 8px",cursor:"pointer",fontSize:fs-3,flexShrink:0}}>🔊 {lang==="tr"?"Rehber":TL("Guide",lang)}</button></div>
    <div style={{display:"flex",gap:10,alignItems:"center"}}>
      <input type="number" value={hd.bpS||""} placeholder="SYS" onFocus={()=>{if(voiceGuide&&!guide)startGuide("bp");}} onChange={e=>setHd({...hd,bpS:Number(e.target.value)})} style={{...IS,width:70,textAlign:"center",fontWeight:700}}/>
      <span style={{fontSize:20,color:mt}}>/</span>
      <input type="number" value={hd.bpD||""} placeholder="DIA" onChange={e=>setHd({...hd,bpD:Number(e.target.value)})} style={{...IS,width:70,textAlign:"center",fontWeight:700}}/>
      {hd.bpS>0&&<span style={{padding:"4px 10px",borderRadius:8,fontSize:fs-2,fontWeight:600,background:hd.bpS>=90&&hd.bpS<=140?`${sc}22`:`${dg}22`,color:hd.bpS>=90&&hd.bpS<=140?sc:dg}}>{hd.bpS>=90&&hd.bpS<=140?t.norm:t.caut}</span>}
    </div>
    {hd.bpS>0&&<div style={{fontSize:fs-3,color:mt,marginTop:4}}>{lang==="tr"?"Referans: 90-120 / 60-80 mmHg":TL("Ref: 90-120 / 60-80 mmHg",lang)}</div>}
  </div>
  <div style={CS}>
    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}><span style={{fontSize:22}}>🎙️</span><span style={{fontWeight:700,fontSize:fs+1}}>{lang==="tr"?"Öksürük / Horlama":TL("Cough / Snore",lang)}<span style={{fontSize:fs-3,color:mt,fontWeight:400}}> · {lang==="tr"?"ses oturumu":TL("audio session",lang)}</span></span></div>
    {soundSess&&soundSess.error&&<div style={{fontSize:fs-3,color:dg,marginBottom:6,lineHeight:1.4}}>{soundSess.error}</div>}
    {soundSess&&(soundSess.active||soundSess.done)&&<div style={{display:"flex",gap:8,justifyContent:"space-around",marginBottom:8}}>
      {[["cough",dg,lang==="tr"?"öksürük~":TL("cough~",lang)],["snore",ac,lang==="tr"?"horlama~":TL("snore~",lang)],["other",mt,lang==="tr"?"diğer ses":TL("other",lang)]].map(([k,col,lab])=><div key={k} style={{textAlign:"center"}}><div style={{fontWeight:800,fontSize:fs+4,color:col}}>{soundSess[k]||0}</div><div style={{fontSize:fs-3,color:mt}}>{lab}</div></div>)}
    </div>}
    {soundSess&&soundSess.active&&<div style={{height:8,borderRadius:4,background:`${mt}33`,overflow:"hidden",marginBottom:8}}><div style={{height:"100%",width:`${Math.min(100,(soundSess.level||0)*1.7)}%`,background:sc,transition:"width .1s"}}/></div>}
    <button onClick={soundSess&&soundSess.active?stopSoundSession:startSoundSession} style={{...BP,width:"100%",padding:"9px",background:soundSess&&soundSess.active?dg:`linear-gradient(135deg,${ac},${a2})`}}>{soundSess&&soundSess.active?(lang==="tr"?"⏹ Durdur":TL("⏹ Stop",lang)):(lang==="tr"?"🎙️ Dinlemeyi Başlat":TL("🎙️ Start Listening",lang))}</button>
    <div style={{fontSize:fs-4,color:mt,marginTop:8,lineHeight:1.45}}>🔒 {lang==="tr"?"Ses yalnızca cihazınızda işlenir; kaydedilmez/gönderilmez. Sadece uygulama ve ekran açıkken çalışır. Kaba bir tahmindir, tıbbi tanı değildir — gün boyu/arka planda güvenilir algılama native uygulama gerektirir.":TL("Audio is processed only on your device; never recorded or sent. Works only while the app & screen are on. This is a rough estimate, not a medical diagnosis — reliable all-night detection needs a native app.",lang)}</div>
  </div>
  <div style={CS}>
    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}><span style={{fontSize:22}}>🧍</span><span style={{fontWeight:700,fontSize:fs+1}}>{lang==="tr"?"Denge / Yürüyüş":TL("Balance / Gait",lang)}<span style={{fontSize:fs-3,color:mt,fontWeight:400}}> · {lang==="tr"?"denge testi":TL("balance test",lang)}</span></span></div>
    {(!balanceM||balanceM.phase==="error"||balanceM.phase==="done")&&<div style={{fontSize:fs-3,color:mt,marginBottom:8,lineHeight:1.4}}>{lang==="tr"?"Telefonu göğsünüze tutup 20 sn sabit durun.":TL("Hold the phone to your chest and stand still for 20s.",lang)}</div>}
    {tests.balAt&&(!balanceM||balanceM.phase==="error")&&<div style={{fontSize:fs-3,color:sc,marginBottom:8}}>{lang==="tr"?"Son sonuç":TL("Last",lang)}: {tests.balSway} · {ago(tests.balAt)}</div>}
    {balanceM&&balanceM.phase==="active"&&<>
      <div style={{fontSize:fs-2,color:mt,marginBottom:8,textAlign:"center"}}>{lang==="tr"?"Sabit durun…":TL("Stand still…",lang)}</div>
      <div style={{height:10,borderRadius:6,background:`${mt}33`,overflow:"hidden",marginBottom:6}}><div style={{height:"100%",width:`${balanceM.progress||0}%`,background:`linear-gradient(90deg,${ac},${a2})`,transition:"width .2s"}}/></div>
      <div style={{fontSize:fs-2,color:mt,textAlign:"center",marginBottom:8}}>%{balanceM.progress||0} · {Math.max(0,Math.ceil((100-(balanceM.progress||0))/100*20))} {lang==="tr"?"sn":TL("s",lang)}</div>
    </>}
    {balanceM&&balanceM.phase==="done"&&(()=>{const b=balanceM.band;const L=b==="high"?[lang==="tr"?"İyi denge ✓":TL("Good balance ✓",lang),sc]:b==="mid"?[lang==="tr"?"Orta":TL("Moderate",lang),ac]:[lang==="tr"?"Daha az stabil":TL("Less stable",lang),dg];return <div style={{textAlign:"center",marginBottom:8}}><div style={{fontSize:34,fontWeight:800,color:L[1]}}>{balanceM.sway}</div><div style={{fontSize:fs-3,color:mt}}>{lang==="tr"?"sallanma indeksi (düşük = daha stabil)":TL("sway index (lower = more stable)",lang)}</div><div style={{fontSize:fs,fontWeight:700,color:L[1],marginTop:4}}>{L[0]}</div></div>;})()}
    {balanceM&&balanceM.phase==="error"&&<div style={{fontSize:fs-2,color:dg,marginBottom:8,lineHeight:1.4}}>{balanceM.msg}</div>}
    {(!balanceM||balanceM.phase!=="active")&&<button onClick={startBalance} style={{...BP,width:"100%",padding:"9px",background:`linear-gradient(135deg,${ac},${a2})`}}>🧍 {balanceM&&balanceM.phase==="done"?(lang==="tr"?"Tekrar Test Et":TL("Test again",lang)):(lang==="tr"?"Denge Testi Başlat":TL("Start Balance Test",lang))}</button>}
    {balanceM&&balanceM.phase==="active"&&<button onClick={()=>{stopBalance();setBalanceM(null);}} style={{...BP,width:"100%",padding:"9px",background:mt}}>{lang==="tr"?"İptal":TL("Cancel",lang)}</button>}
    <div style={{fontSize:fs-4,color:mt,marginTop:8,lineHeight:1.45}}>ℹ️ {lang==="tr"?"Telefon ivmeölçerinden hesaplanan göreli bir tarama indeksidir (yalnızca uygulama açıkken). Tıbbi denge/nörolojik değerlendirme yerine geçmez. Yürüyüş düzeni için Adım kartındaki canlı cadence'e bakın.":TL("A relative screening index from the phone accelerometer (app open only). Not a substitute for medical balance/neurological assessment. For gait rhythm see the live cadence in the Steps card.",lang)}</div>
  </div>
  <div style={CS}>
    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}><span style={{fontSize:22}}>🧍‍♂️</span><span style={{fontWeight:700,fontSize:fs+1}}>{lang==="tr"?"Postür":TL("Posture",lang)}<span style={{fontSize:fs-3,color:mt,fontWeight:400}}> · {lang==="tr"?"duruş açısı":TL("tilt angle",lang)}</span></span></div>
    {(!postureM||postureM.phase==="error")&&<div style={{fontSize:fs-3,color:mt,marginBottom:8,lineHeight:1.4}}>{lang==="tr"?"Telefonu göğüs hizasında dik tutun (ekran size dönük); dik durup başlatın, referans alınır.":TL("Hold the phone upright at chest level (screen facing you); stand upright and start to set the reference.",lang)}</div>}
    {tests.postAt&&(!postureM||postureM.phase==="error")&&<div style={{fontSize:fs-3,color:sc,marginBottom:8}}>{lang==="tr"?"Son sonuç":TL("Last",lang)}: {tests.postAngle}° · {ago(tests.postAt)}</div>}
    {postureM&&postureM.phase==="calibrating"&&<div style={{fontSize:fs-1,color:acTx,textAlign:"center",marginBottom:8}}>{lang==="tr"?"Kalibre ediliyor… dik durun":TL("Calibrating… stand upright",lang)}</div>}
    {postureM&&postureM.phase==="live"&&(()=>{const b=postureM.band;const L=b==="good"?[lang==="tr"?"Dik ✓":TL("Upright ✓",lang),sc]:b==="mild"?[lang==="tr"?"Hafif eğim":TL("Slight lean",lang),ac]:[lang==="tr"?"Belirgin eğim — dikleş":TL("Notable lean — straighten",lang),dg];return <div style={{textAlign:"center",marginBottom:8}}>
      <div style={{fontSize:38,fontWeight:800,color:L[1]}}>{postureM.angle}°</div>
      <div style={{fontSize:fs-3,color:mt}}>{lang==="tr"?"dik referanstan sapma":TL("deviation from upright",lang)}</div>
      <div style={{fontSize:fs,fontWeight:700,color:L[1],marginTop:4}}>{L[0]}</div>
      <div style={{height:8,borderRadius:4,background:`${mt}33`,overflow:"hidden",marginTop:8}}><div style={{height:"100%",width:`${Math.min(100,(postureM.angle||0)*3)}%`,background:L[1],transition:"width .2s"}}/></div>
    </div>;})()}
    {postureM&&postureM.phase==="error"&&<div style={{fontSize:fs-2,color:dg,marginBottom:8,lineHeight:1.4}}>{postureM.msg}</div>}
    {postureM&&postureM.phase==="live"
      ?<button onClick={()=>{const a=postureM&&postureM.angle;stopPosture();if(a!=null)setTests(t=>({...t,postAngle:a,postAt:Date.now()}));setPostureM(null);}} style={{...BP,width:"100%",padding:"9px",background:dg}}>{lang==="tr"?"⏹ Durdur":TL("⏹ Stop",lang)}</button>
      :<button onClick={startPosture} style={{...BP,width:"100%",padding:"9px",background:`linear-gradient(135deg,${ac},${a2})`}}>🧍‍♂️ {lang==="tr"?"Duruş Kontrolü Başlat":TL("Start Posture Check",lang)}</button>}
    <div style={{fontSize:fs-4,color:mt,marginTop:8,lineHeight:1.45}}>ℹ️ {lang==="tr"?"Telefon eğim açısından hesaplanan göreli bir duruş taramasıdır (yalnızca uygulama açıkken; telefon gövdenizle aynı hizada olmalı). Tıbbi postür/ortopedik değerlendirme yerine geçmez.":TL("A relative posture screening from the phone's tilt angle (app open only; phone must be aligned with your trunk). Not a substitute for medical/orthopedic posture assessment.",lang)}</div>
  </div>
  <div style={CS}>
    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}><span style={{fontSize:22}}>🎯</span><span style={{fontWeight:700,fontSize:fs+1}}>{lang==="tr"?"Reaksiyon / Odak":TL("Reaction / Focus",lang)}<span style={{fontSize:fs-3,color:mt,fontWeight:400}}> · {lang==="tr"?"reaksiyon testi":TL("reaction test",lang)}</span></span></div>
    {tests.rxAt&&!reactM&&<div style={{fontSize:fs-3,color:sc,marginBottom:8,textAlign:"center"}}>{lang==="tr"?"Son":TL("Last",lang)}: {tests.rxAvg} ms ({lang==="tr"?"en iyi":TL("best",lang)} {tests.rxBest}) · {ago(tests.rxAt)}</div>}
    {(()=>{const ph=reactM?reactM.phase:"idle";const box=ph==="waiting"?["#c0392b",lang==="tr"?"Bekle…":TL("Wait…",lang)]:ph==="go"?[sc,lang==="tr"?"DOKUN!":TL("TAP!",lang)]:ph==="early"?["#e67e22",lang==="tr"?"Çok erken! Dokunup tekrar dene":TL("Too early! Tap to retry",lang)]:ph==="done"?[dark?"#22303a":"#eef3f6",lang==="tr"?"Bitti ✓":TL("Done ✓",lang)]:[dark?"#2a2f38":"#e7ebf0",lang==="tr"?"Başlamak için dokun":TL("Tap to start",lang)];return <div onClick={reactTap} style={{background:box[0],color:(ph==="idle"||ph==="done")?tc:"#fff",borderRadius:12,height:120,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:fs+4,cursor:"pointer",userSelect:"none",WebkitUserSelect:"none",textAlign:"center",padding:8}}>{box[1]}</div>;})()}
    {reactM&&(reactM.phase==="waiting"||reactM.phase==="go"||reactM.phase==="early")&&<div style={{fontSize:fs-2,color:mt,textAlign:"center",marginTop:6}}>{lang==="tr"?"Deneme":TL("Trial",lang)} {Math.min(5,(reactM.trials||[]).length+1)}/5</div>}
    {reactM&&reactM.phase==="done"&&(()=>{const a=reactM.avg;const L=a<250?[lang==="tr"?"Çok hızlı ✓✓":TL("Excellent ✓✓",lang),sc]:a<350?[lang==="tr"?"İyi ✓":TL("Good ✓",lang),sc]:a<450?[lang==="tr"?"Ortalama":TL("Average",lang),ac]:[lang==="tr"?"Yavaş":TL("Slow",lang),dg];return <div style={{textAlign:"center",marginTop:8}}>
      <div style={{fontSize:34,fontWeight:800,color:L[1]}}>{reactM.avg} ms</div>
      <div style={{fontSize:fs-3,color:mt}}>{lang==="tr"?"ortalama reaksiyon":TL("average reaction",lang)} · {lang==="tr"?"en iyi":TL("best",lang)} {reactM.best} ms · ±{reactM.sd}</div>
      <div style={{fontSize:fs,fontWeight:700,color:L[1],marginTop:4}}>{L[0]}</div>
      <button onClick={reactTap} style={{...BP,marginTop:8,padding:"7px 18px"}}>{lang==="tr"?"Tekrar":TL("Again",lang)}</button>
    </div>;})()}
    <div style={{fontSize:fs-4,color:mt,marginTop:8,lineHeight:1.45}}>ℹ️ {lang==="tr"?"Basit bir görsel reaksiyon/uyanıklık taramasıdır; ekran ve dokunma gecikmesinden etkilenir. Tıbbi/nörolojik tanı değildir.":TL("A simple visual reaction/alertness screening; affected by screen and touch latency. Not a medical/neurological diagnosis.",lang)}</div>
  </div>
  {/* Daily Wellness Tracking */}
  <div style={{fontWeight:700,fontSize:fs,color:mt,marginTop:4}}>🌱 {lang==="tr"?"Günlük Sağlık Takibi":TL("Daily Wellness Tracking",lang)}</div>
  {/* Water */}
  <div style={{...CS,border:`1px solid ${ac}33`}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
      <span style={{fontWeight:700,display:"flex",alignItems:"center",gap:6}}>💧 {lang==="tr"?"Su Takibi":TL("Water Intake",lang)}</span>
      <span style={{fontSize:fs-2,color:mt}}>{wellness.water}/{wellness.waterGoal} {lang==="tr"?"bardak":TL("glasses",lang)}</span>
    </div>
    <div style={{height:10,background:`${mt}20`,borderRadius:5,overflow:"hidden",marginBottom:8}}>
      <div style={{height:"100%",width:`${waterPct}%`,background:`linear-gradient(90deg,#38bdf8,#0ea5e9)`,borderRadius:5,transition:"width .3s"}}/>
    </div>
    <div style={{display:"flex",gap:6,justifyContent:"space-between"}}>
      <button onClick={()=>setWellness(w=>({...w,water:Math.max(0,w.water-1)}))} style={{...BP,background:mt,padding:"6px 12px",flex:1}}>−</button>
      <div style={{display:"flex",gap:3,flex:3,justifyContent:"center"}}>{[...Array(wellness.waterGoal)].map((_,i)=><span key={i} style={{fontSize:20,opacity:i<wellness.water?1:0.2}}>💧</span>)}</div>
      <button onClick={()=>setWellness(w=>({...w,water:w.water+1}))} style={{...BP,padding:"6px 12px",flex:1}}>+</button>
    </div>
  </div>
  {/* Sleep */}
  <div style={{...CS,border:`1px solid #8b5cf633`}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
      <span style={{fontWeight:700,display:"flex",alignItems:"center",gap:6}}>😴 {lang==="tr"?"Uyku":TL("Sleep",lang)}</span>
      <span style={{fontSize:fs-2,color:mt}}>{wellness.sleep}/{wellness.sleepGoal}h</span>
    </div>
    <div style={{height:10,background:`${mt}20`,borderRadius:5,overflow:"hidden",marginBottom:8}}>
      <div style={{height:"100%",width:`${sleepPct}%`,background:`linear-gradient(90deg,#8b5cf6,#6366f1)`,borderRadius:5,transition:"width .3s"}}/>
    </div>
    <div style={{display:"flex",gap:8,marginBottom:8}}>
      <div style={{flex:1}}><div style={{fontSize:fs-3,color:mt,marginBottom:2}}>🛏️ {lang==="tr"?"Yatış":TL("Bedtime",lang)}</div><input type="time" aria-label={lang==="tr"?"Saat":TL("Time",lang)} value={sleepTimes.bed} onChange={e=>setSleepTime("bed",e.target.value)} style={{...IS,padding:"6px 8px",width:"100%"}}/></div>
      <div style={{flex:1}}><div style={{fontSize:fs-3,color:mt,marginBottom:2}}>☀️ {lang==="tr"?"Kalkış":TL("Wake",lang)}</div><input type="time" aria-label={lang==="tr"?"Saat":TL("Time",lang)} value={sleepTimes.wake} onChange={e=>setSleepTime("wake",e.target.value)} style={{...IS,padding:"6px 8px",width:"100%"}}/></div>
    </div>
    {sleepTimes.bed&&sleepTimes.wake&&<div style={{fontSize:fs-2,color:acTx,textAlign:"center",marginBottom:6,fontWeight:600}}>{lang==="tr"?"Tahmini süre":TL("Estimated",lang)}: {computeSleepDur(sleepTimes.bed,sleepTimes.wake)} {lang==="tr"?"saat":TL("h",lang)} <span style={{color:mt,fontWeight:400}}>({sleepTimes.bed} → {sleepTimes.wake})</span></div>}
    <div style={{fontSize:fs-3,color:mt,textAlign:"center",marginBottom:4}}>{lang==="tr"?"veya süreyi elle ayarla":TL("or set duration manually",lang)}</div>
    <input type="range" aria-label={lang==="tr"?"Değer kaydırıcı":TL("Value slider",lang)} min="0" max="12" step="0.5" value={wellness.sleep} onChange={e=>setWellness(w=>({...w,sleep:Number(e.target.value)}))} style={{width:"100%"}}/>
    <div style={{fontSize:fs-3,color:mt,textAlign:"center",marginTop:2}}>{wellness.sleep>=7&&wellness.sleep<=9?(lang==="tr"?"✓ İdeal":TL("✓ Ideal",lang)):wellness.sleep<6?(lang==="tr"?"⚠️ Yetersiz":TL("⚠️ Insufficient",lang)):wellness.sleep>10?(lang==="tr"?"⚠️ Çok fazla":TL("⚠️ Too much",lang)):(lang==="tr"?"Orta":TL("Average",lang))}</div>
    <div style={{fontSize:fs-4,color:mt,textAlign:"center",marginTop:6,lineHeight:1.4}}>ℹ️ {lang==="tr"?"Yatış/kalkış saatinden hesaplanan tahmini süredir; gerçek uyku evreleri (derin/REM) için giyilebilir cihaz gerekir.":TL("Estimated from bed/wake times; real sleep stages (deep/REM) need a wearable.",lang)}</div>
  </div>
  {/* Steps */}
  <div style={{...CS,border:`1px solid ${sc}33`}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
      <span style={{fontWeight:700,display:"flex",alignItems:"center",gap:6}}>👟 {lang==="tr"?"Adım":TL("Steps",lang)}{stepAuto&&<span style={{fontSize:fs-3,color:sc,fontWeight:500}}>🔴 {lang==="tr"?"Canlı":TL("Live",lang)}</span>}</span>
      <span style={{fontSize:fs-2,color:mt}}>{wellness.steps.toLocaleString()}/{wellness.stepsGoal.toLocaleString()}</span>
    </div>
    <div style={{height:10,background:`${mt}20`,borderRadius:5,overflow:"hidden",marginBottom:8}}>
      <div style={{height:"100%",width:`${stepsPct}%`,background:`linear-gradient(90deg,${sc},#14b8a6)`,borderRadius:5,transition:"width .3s"}}/>
    </div>
    {/* Auto toggle */}
    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8,padding:"8px 10px",borderRadius:8,background:stepAuto?`${sc}12`:`${mt}08`,border:`1px solid ${stepAuto?sc:bd}`,cursor:"pointer"}} onClick={()=>{
      if(!stepAuto&&typeof DeviceMotionEvent!=="undefined"&&typeof DeviceMotionEvent.requestPermission==="function"){
        DeviceMotionEvent.requestPermission().then(p=>{if(p==="granted")setStepAuto(true);else notify("⚠️ "+(lang==="tr"?"Hareket sensörü izni reddedildi":TL("Motion sensor permission denied",lang)));}).catch(()=>{});
      }else{setStepAuto(!stepAuto);}
    }}>
      <div style={{width:36,height:20,borderRadius:10,background:stepAuto?sc:bd,position:"relative",flexShrink:0,transition:"background .2s"}}>
        <div style={{width:14,height:14,borderRadius:"50%",background:"#fff",position:"absolute",top:3,left:stepAuto?19:3,transition:"left .2s"}}/>
      </div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:fs-1,fontWeight:600,color:stepAuto?sc:mt}}>📱 {lang==="tr"?"Canlı Adım Sayımı":TL("Live Step Counting",lang)}</div>
        <div style={{fontSize:fs-3,color:mt}}>{lang==="tr"?"Telefon hareket sensörüyle sayar — yalnızca uygulama açıkken. Gün boyu/arka plan için Apple Health / Health Connect gerekir.":TL("Counts via phone motion sensor — only while the app is open. All-day/background needs Apple Health / Health Connect.",lang)}</div>
      </div>
    </div>
    {stepAuto&&<div style={{fontSize:fs-3,color:sc,textAlign:"center",marginBottom:6}}>{lang==="tr"?"Bu oturum":TL("This session",lang)}: {stepInfo.sess} {lang==="tr"?"adım":TL("steps",lang)} · {stepInfo.cadence}/{lang==="tr"?"dk":TL("min",lang)} · ~{stepInfo.dist} m</div>}
    <input type="number" value={wellness.steps||""} placeholder="0" onChange={e=>setWellness(w=>({...w,steps:Number(e.target.value)||0}))} disabled={stepAuto} style={{...IS,textAlign:"center",opacity:stepAuto?0.5:1}}/>
    {stepAuto&&<div style={{fontSize:fs-3,color:mt,textAlign:"center",marginTop:4}}>{lang==="tr"?"Manuel giriş devre dışı":TL("Manual entry disabled",lang)}</div>}
  </div>
  {/* Mood */}
  <div style={{...CS,border:`1px solid #f59e0b33`}}>
    <div style={{fontWeight:700,marginBottom:8,display:"flex",alignItems:"center",gap:6}}>🧠 {lang==="tr"?"Ruh Hali":TL("Mood",lang)}</div>
    <div style={{display:"flex",justifyContent:"space-between",gap:4}}>
      {moods.map(m=><button key={m.v} onClick={()=>{setWellness(w=>({...w,mood:m.v}));const td=new Date().toISOString().slice(0,10);setMoodLog(p=>[...p.filter(e=>e.date!==td),{date:td,mood:m.v}].slice(-60));}} style={{flex:1,padding:"10px 4px",borderRadius:10,border:wellness.mood===m.v?`2px solid #f59e0b`:`1px solid ${bd}`,background:wellness.mood===m.v?"#f59e0b15":"transparent",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:2}}><span style={{fontSize:24}}>{m.e}</span><span style={{fontSize:fs-4,color:mt}}>{m.l}</span></button>)}
    </div>
    {(()=>{
      const days=[];for(let i=6;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);days.push(d.toISOString().slice(0,10));}
      const map={};moodLog.forEach(e=>{map[e.date]=e.mood;});
      const recent=moodLog.slice(-3).map(e=>e.mood);
      const persistentLow=recent.length>=3&&recent.every(v=>v<=2);
      const dayLbl=[t.su,t.mo,t.tu,t.we,t.th,t.fr,t.sa];
      return <div style={{marginTop:10}}>
        <div style={{fontSize:fs-3,color:mt,marginBottom:4}}>{lang==="tr"?"Son 7 gün":TL("Last 7 days",lang)}</div>
        <div style={{display:"flex",gap:4}}>{days.map(d=>{const mv=map[d];const em=mv?(moods.find(x=>x.v===mv)||{}).e:"·";const dd=new Date(d);return <div key={d} style={{flex:1,textAlign:"center"}}><div style={{fontSize:mv?16:13,opacity:mv?1:.3,lineHeight:1.4}}>{em}</div><div style={{fontSize:fs-4,color:mt}}>{dayLbl[dd.getDay()]}</div></div>;})}</div>
        {persistentLow&&<div style={{marginTop:8,padding:"8px 10px",borderRadius:8,background:`${ac}10`,border:`1px solid ${ac}44`,fontSize:fs-2,color:tc}}>{lang==="tr"?"Birkaç gündür kendini iyi hissetmiyorsun. Güvendiğin biriyle konuşmak ya da bir uzmana danışmak iyi gelebilir — yalnız değilsin. 💙":TL("You've been feeling low for a few days. Talking to someone you trust or a professional may help — you're not alone. 💙",lang)}</div>}
      </div>;
    })()}
  </div>
  {/* Exercise Minutes */}
  <div style={{...CS,border:`1px solid ${dg}33`}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
      <span style={{fontWeight:700,display:"flex",alignItems:"center",gap:6}}>🏃 {lang==="tr"?"Egzersiz":TL("Exercise",lang)}</span>
      <span style={{fontSize:fs-2,color:mt}}>{wellness.exercise} {lang==="tr"?"dakika":TL("min",lang)}</span>
    </div>
    <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
      {[0,15,30,45,60,90].map(v=><button key={v} onClick={()=>setWellness(w=>({...w,exercise:v}))} style={pill(wellness.exercise===v)}>{v}{lang==="tr"?"dk":TL("m",lang)}</button>)}
    </div>
    <div style={{fontSize:fs-3,color:mt,textAlign:"center",marginTop:6}}>{lang==="tr"?"Hedef: Günde 30 dakika":TL("Goal: 30 minutes/day",lang)}</div>
  </div>
  {/* Symptoms Quick Log */}
  <div style={{...CS,border:`1px solid ${bd}`}}>
    <div style={{fontWeight:700,marginBottom:8,display:"flex",alignItems:"center",gap:6}}>🤒 {lang==="tr"?"Hızlı Semptom Kaydı":TL("Quick Symptom Log",lang)}</div>
    <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
      {(lang==="tr"?["Baş ağrısı","Mide ağrısı","Yorgunluk","Ateş","Öksürük","Bulantı","Baş dönmesi","Kas ağrısı"]:["Headache","Stomachache","Fatigue","Fever","Cough","Nausea","Dizziness","Muscle pain"]).map(s=><button key={s} onClick={()=>{setNotes(p=>[{id:Date.now(),title:s,content:`${now.toLocaleString(lc)} — ${s}`,color:"default",pinned:false},...p]);notify("📝 "+s+" "+(lang==="tr"?"not olarak eklendi":TL("added as note",lang)));}} style={pill(false)}>{s}</button>)}
    </div>
  </div>
  {/* Reminders */}
  <div style={{...CS,border:`1px solid ${ac}33`,background:`${ac}05`}}>
    <div style={{fontWeight:700,marginBottom:8,color:acTx}}>🔔 {lang==="tr"?"Sağlık Hatırlatıcıları":TL("Health Reminders",lang)}</div>
    <div style={{display:"flex",flexDirection:"column",gap:5,fontSize:fs-2}}>
      <div>💧 {lang==="tr"?`Günde ${wellness.waterGoal} bardak su içmeyi hedefleyin`:`Aim for ${wellness.waterGoal} glasses of water daily`}</div>
      <div>😴 {lang==="tr"?"7-9 saat kaliteli uyku sağlığınız için kritiktir":TL("7-9 hours of quality sleep is critical for health",lang)}</div>
      <div>🏃 {lang==="tr"?"Haftada en az 150 dakika orta düzey egzersiz":TL("At least 150 min moderate exercise per week",lang)}</div>
      <div>🥗 {lang==="tr"?"Günde 5 porsiyon meyve ve sebze tüketin":TL("5 servings of fruit & vegetables daily",lang)}</div>
      <div>🧘 {lang==="tr"?"Günde 10 dakika meditasyon stres azaltır":TL("10 min meditation daily reduces stress",lang)}</div>
    </div>
  </div>
  {/* Health Score */}
  <div style={{fontWeight:700,fontSize:fs,color:mt,marginTop:4}}>🏆 {t.hScore}</div>
  <div style={{...CS,padding:14,border:`1px solid ${ac}33`}}>
    <div style={{textAlign:"center",marginBottom:10}}>
      <div style={{fontSize:fs+16,fontWeight:800,color:hscore>70?sc:hscore>40?acTx:hscore>0?dg:mt}}>{hscore||"—"}<span style={{fontSize:fs-1,color:mt,fontWeight:400}}>/100</span></div>
      <div style={{fontSize:fs,fontWeight:600,color:hscore>80?sc:hscore>60?acTx:hscore>40?"#f0a030":hscore>0?dg:mt,marginTop:2}}>
        {hscore>80?(lang==="tr"?"Mükemmel 🌟":TL("Excellent 🌟",lang)):hscore>60?(lang==="tr"?"İyi 💪":TL("Good 💪",lang)):hscore>40?(lang==="tr"?"Orta ⚠️":TL("Average ⚠️",lang)):hscore>0?(lang==="tr"?"Dikkat! 🔴":TL("Attention! 🔴",lang)):(lang==="tr"?"Veri girin":TL("Enter data",lang))}
      </div>
    </div>
    {hscore>0&&<div style={{display:"flex",flexDirection:"column",gap:6}}>
      {[
        {icon:"❤️",label:t.pulse,val:hd.pulse,max:30,score:hd.pulse>=60&&hd.pulse<=100?30:hd.pulse>=50&&hd.pulse<=110?15:hd.pulse>0?5:0,status:hd.pulse>=60&&hd.pulse<=100},
        {icon:"⚖️",label:"BMI",val:bmi,max:25,score:bmi>=18.5&&bmi<25?25:bmi>=17&&bmi<30?12:bmi>0?5:0,status:bmi>=18.5&&bmi<25},
        {icon:"🩺",label:t.bp,val:hd.bpS>0?`${hd.bpS}/${hd.bpD}`:0,max:30,score:hd.bpS>=90&&hd.bpS<=120&&hd.bpD>=60&&hd.bpD<=80?30:hd.bpS>=85&&hd.bpS<=140&&hd.bpD>=55&&hd.bpD<=90?15:hd.bpS>0?5:0,status:hd.bpS>=90&&hd.bpS<=120},
        {icon:"💊",label:t.prog,val:`${medProg}%`,max:15,score:medProg>=80?15:medProg>50?10:medProg>0?5:0,status:medProg>=80}
      ].map(item=>item.val?(
        <div key={item.label} style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:16}}>{item.icon}</span>
          <div style={{flex:1}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:fs-2}}>
              <span style={{color:mt}}>{item.label}: <strong style={{color:tc}}>{item.val}</strong></span>
              <span style={{fontWeight:700,color:item.status?sc:dg}}>{item.score}/{item.max}</span>
            </div>
            <div style={{height:4,background:`${mt}22`,borderRadius:2,marginTop:2}}><div style={{height:"100%",borderRadius:2,background:item.status?sc:item.score>0?ac:dg,width:`${(item.score/item.max)*100}%`,transition:"width .5s"}}/></div>
          </div>
        </div>
      ):null)}
    </div>}
    {hscore>0&&hscore<=60&&<div style={{marginTop:8,padding:"8px 10px",borderRadius:8,background:`${ac}08`,fontSize:fs-2,color:acTx}}>
      💡 {lang==="tr"?"Skorunuzu artırmak için: Değerlerinizi referans aralığına getirin ve ilaçlarınızı düzenli kullanın.":TL("To improve: Keep values in reference range and take medications regularly.",lang)}
    </div>}
    {/* Risk factors from history */}
    {(allergyCount>0||chronicCount>0||medsCount>0||recordsCount>0)&&<div style={{marginTop:8,padding:"8px 10px",borderRadius:8,background:`${dg}08`,border:`1px solid ${dg}22`}}>
      <div style={{fontSize:fs-2,fontWeight:700,color:dg,marginBottom:4}}>⚠️ {lang==="tr"?"Risk Faktörleri (Kimlik & Risk Profilinden)":TL("Risk Factors (from Identity & Risk Profile)",lang)}</div>
      <div style={{fontSize:fs-3,color:mt,display:"flex",flexDirection:"column",gap:2}}>
        {allergyCount>0&&<div>🤧 {lang==="tr"?"Alerji":TL("Allergies",lang)}: <strong>{allergyCount}</strong> {lang==="tr"?"kayıt":TL("entries",lang)} (−{allergyCount*1} {lang==="tr"?"puan":TL("pts",lang)})</div>}
        {chronicCount>0&&<div>🩺 {lang==="tr"?"Kronik Hastalık":TL("Chronic Condition",lang)}: <strong>{chronicCount}</strong> {lang==="tr"?"kayıt":TL("entries",lang)} (−{chronicCount*3} {lang==="tr"?"puan":TL("pts",lang)})</div>}
        {medsCount>0&&<div>💊 {lang==="tr"?"Kullanılan İlaç":TL("Active Medications",lang)}: <strong>{medsCount}</strong></div>}
        {recordsCount>0&&<div>📋 {lang==="tr"?"Tıbbi Kayıt":TL("Medical Records",lang)}: <strong>{recordsCount}</strong></div>}
        <div style={{marginTop:2,color:dg}}>{lang==="tr"?`Toplam risk cezası: −${riskPenalty} puan`:`Total risk penalty: −${riskPenalty} pts`}</div>
      </div>
      {/* Possible health implications */}
      {(pat.allergies||pat.chronic||meds.length>0)&&<div style={{marginTop:8,paddingTop:8,borderTop:`1px solid ${dg}22`}}>
        <div style={{fontSize:fs-3,fontWeight:700,color:dg,marginBottom:4}}>🔍 {lang==="tr"?"Muhtemel Sonuçlar ve Dikkat Edilmesi Gerekenler":TL("Possible Implications & Warnings",lang)}</div>
        <div style={{fontSize:fs-3,color:mt,display:"flex",flexDirection:"column",gap:3}}>
          {pat.chronic&&/diyabet|diabetes/i.test(pat.chronic)&&<div>• {lang==="tr"?"🩸 Diyabet: Kan şekeri takibi, düzenli HbA1c ölçümü, göz-böbrek kontrolü önerilir.":TL("🩸 Diabetes: Regular blood sugar monitoring, HbA1c tests, eye/kidney checks recommended.",lang)}</div>}
          {pat.chronic&&/hipertansiyon|tansiyon|hypertension|high.blood/i.test(pat.chronic)&&<div>• {lang==="tr"?"💓 Hipertansiyon: Tuz kısıtlaması, düzenli ölçüm, stres yönetimi önemli.":TL("💓 Hypertension: Salt restriction, regular monitoring, stress management important.",lang)}</div>}
          {pat.chronic&&/astım|asthma|astim/i.test(pat.chronic)&&<div>• {lang==="tr"?"🫁 Astım: İnhaler taşıyın, polen/toz/duman alerjenlerinden kaçının.":TL("🫁 Asthma: Carry inhaler, avoid pollen/dust/smoke triggers.",lang)}</div>}
          {pat.chronic&&/kalp|heart|cardiac/i.test(pat.chronic)&&<div>• {lang==="tr"?"❤️ Kalp hastalığı: Ağır egzersizden kaçının, düzenli EKG kontrolü.":TL("❤️ Heart condition: Avoid strenuous exercise, regular ECG checks.",lang)}</div>}
          {pat.chronic&&/tiroid|thyroid/i.test(pat.chronic)&&<div>• {lang==="tr"?"🦋 Tiroid: TSH/T3/T4 düzenli takip, ilaç saatine dikkat.":TL("🦋 Thyroid: Regular TSH/T3/T4 monitoring, medication timing matters.",lang)}</div>}
          {pat.allergies&&/penisilin|penicillin/i.test(pat.allergies)&&<div>• {lang==="tr"?"💉 Penisilin alerjisi: Doktora/eczaneye MUTLAKA bildirin.":TL("💉 Penicillin allergy: ALWAYS inform doctor/pharmacy.",lang)}</div>}
          {pat.allergies&&/arı|bee|arı sokması|bal arısı/i.test(pat.allergies)&&<div>• {lang==="tr"?"🐝 Arı alerjisi: Epipen taşıyın, anafilaksi riski.":TL("🐝 Bee allergy: Carry EpiPen, anaphylaxis risk.",lang)}</div>}
          {pat.allergies&&/fıstık|peanut|kuruyemiş|nut/i.test(pat.allergies)&&<div>• {lang==="tr"?"🥜 Fıstık/kuruyemiş alerjisi: Gıda etiketlerini okuyun, çapraz kontaminasyona dikkat.":TL("🥜 Peanut/nut allergy: Read food labels, beware cross-contamination.",lang)}</div>}
          {pat.allergies&&/laktoz|lactose|gluten/i.test(pat.allergies)&&<div>• {lang==="tr"?"🥛 Gıda intoleransı: Uygun beslenme planı, etiket okuma.":TL("🥛 Food intolerance: Appropriate diet plan, label reading.",lang)}</div>}
          {medsCount>=3&&<div>• {lang==="tr"?`⚠️ ${medsCount} farklı ilaç kullanıyorsunuz — ilaç etkileşimi için doktora danışın.`:`⚠️ You're taking ${medsCount} different medications — consult doctor for drug interactions.`}</div>}
          {bmi>30&&<div>• {lang==="tr"?"⚖️ Obezite: Diyabet, kalp hastalığı, eklem problemleri riski artar.":TL("⚖️ Obesity: Increased risk of diabetes, heart disease, joint issues.",lang)}</div>}
          {bmi>0&&bmi<18.5&&<div>• {lang==="tr"?"⚖️ Zayıflık: Bağışıklık zayıflığı, demir eksikliği riski — beslenme uzmanına danışın.":TL("⚖️ Underweight: Weakened immunity, iron deficiency risk — consult nutritionist.",lang)}</div>}
          {hd.bpS>140&&<div>• {lang==="tr"?"🩺 Yüksek tansiyon: Kalp/inme riski, acil doktor kontrolü gerekli.":TL("🩺 High blood pressure: Heart/stroke risk, urgent doctor check needed.",lang)}</div>}
          {hd.pulse>100&&<div>• {lang==="tr"?"❤️ Taşikardi (hızlı nabız): Kafein/stresi azaltın, kalp kontrolü önerilir.":TL("❤️ Tachycardia: Reduce caffeine/stress, cardiac check recommended.",lang)}</div>}
          {hd.pulse>0&&hd.pulse<60&&<div>• {lang==="tr"?"❤️ Bradikardi (yavaş nabız): Kardiyolog kontrolü önerilir.":TL("❤️ Bradycardia: Cardiologist consultation recommended.",lang)}</div>}
        </div>
        <div style={{fontSize:fs-4,color:mt,marginTop:6,fontStyle:"italic"}}>⚕️ {lang==="tr"?"Bu öneriler genel bilgi amaçlıdır. Teşhis/tedavi için doktorunuza danışın.":TL("These are general suggestions. Consult your doctor for diagnosis/treatment.",lang)}</div>
      </div>}
    </div>}
    {/* Wellness bonus */}
    {wellnessBonus>0&&<div style={{marginTop:6,padding:"8px 10px",borderRadius:8,background:`${sc}08`,border:`1px solid ${sc}22`}}>
      <div style={{fontSize:fs-2,fontWeight:700,color:sc,marginBottom:4}}>✨ {lang==="tr"?"Wellness Bonusu":TL("Wellness Bonus",lang)}</div>
      <div style={{fontSize:fs-3,color:mt}}>+{wellnessBonus} {lang==="tr"?"puan (su, uyku, adım, ruh hali, egzersiz)":TL("pts (water, sleep, steps, mood, exercise)",lang)}</div>
    </div>}
    <div style={{fontSize:fs-4,color:mt,textAlign:"center",marginTop:6}}>{lang==="tr"?"Referans aralıkları laboratuvara ve ülkeye göre değişir — kendi tahlil raporunuzdaki aralıkları esas alın.":TL("Reference ranges vary by lab and country — use the ranges printed on your own lab report.",lang)}</div>
  </div>
  {/* Smart Watch Health Data — manual now, auto-sync in mobile app */}
  <div style={{fontWeight:700,fontSize:fs,color:mt,marginTop:4}}>⌚ {lang==="tr"?"Akıllı Saat Verileri":lang==="de"?"Smartwatch-Daten":lang==="es"?"Datos del reloj":lang==="ru"?"Данные часов":lang==="ar"?"بيانات الساعة":"Smartwatch Data"}</div>
  <div style={{...CS,border:`1px solid ${ac}33`}}>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
      {[
        {icon:"👟",field:"steps",label:lang==="tr"?"Adım":lang==="de"?"Schritte":lang==="es"?"Pasos":lang==="ru"?"Шаги":lang==="ar"?"خطوات":"Steps",unit:"",good:v=>v>=7000},
        {icon:"😴",field:"sleep",label:lang==="tr"?"Uyku":lang==="de"?"Schlaf":lang==="es"?"Sueño":lang==="ru"?"Сон":lang==="ar"?"نوم":"Sleep",unit:lang==="tr"?"saat":TL("h",lang),good:v=>v>=7&&v<=9},
        {icon:"🫁",field:"spo2",label:lang==="tr"?"Oksijen":lang==="de"?"Sauerstoff":lang==="es"?"Oxígeno":lang==="ru"?"Кислород":lang==="ar"?"أكسجين":"Oxygen",unit:"%",good:v=>v>=95},
        {icon:"🔥",field:"calories",label:lang==="tr"?"Kalori":lang==="de"?"Kalorien":lang==="es"?"Calorías":lang==="ru"?"Калории":lang==="ar"?"سعرات":"Calories",unit:"kcal",good:v=>v>=300},
        {icon:"💗",field:"restPulse",label:lang==="tr"?"Dinlenik Nabız":lang==="de"?"Ruhepuls":lang==="es"?"Pulso reposo":lang==="ru"?"Пульс покоя":lang==="ar"?"نبض الراحة":"Resting HR",unit:"bpm",good:v=>v>=50&&v<=70},
      ].map(item=>{
        const v=hd[item.field]||0;const isEd=editH===item.field;
        return(<div key={item.field} style={{padding:"8px 10px",borderRadius:8,background:`${ac}06`,border:`1px solid ${bd}`}}>
          <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:3}}><span style={{fontSize:16}}>{item.icon}</span><span style={{fontSize:fs-3,color:mt}}>{item.label}</span></div>
          {isEd?<div style={{display:"flex",gap:4,alignItems:"center"}}><input type="number" autoFocus value={tmpH} onChange={e=>setTmpH(e.target.value)} style={{...IS,width:60,padding:"4px 6px",fontWeight:700,fontSize:fs-1}} onKeyDown={e=>{if(e.key==="Enter"){setHd(p=>({...p,[item.field]:Number(tmpH)}));setEditH(null);}}}/><button onClick={()=>{setHd(p=>({...p,[item.field]:Number(tmpH)}));setEditH(null);}} style={{...BP,padding:"3px 8px"}}>✓</button></div>
          :<div onClick={()=>{setEditH(item.field);setTmpH(v>0?String(v):"");}} style={{cursor:"pointer",fontWeight:700,fontSize:fs+1,color:v>0?(item.good(v)?sc:tc):mt}}>{v>0?`${v}${item.unit?" "+item.unit:""}`:t.tap}</div>}
        </div>);
      })}
    </div>
    <div style={{marginTop:8,padding:"7px 9px",borderRadius:7,background:`${ac}08`,fontSize:fs-3,color:mt,display:"flex",alignItems:"center",gap:6}}>
      <span style={{fontSize:14}}>📲</span>
      <span>{lang==="tr"?"🍎 Apple Health · 🤖 Health Connect: web sürümünde bağlanamaz (native API). Native uygulamada otomatik senkron gelecek. Şimdilik manuel girin veya Bluetooth cihaz bağlayın.":lang==="de"?"🍎 Apple Health · 🤖 Health Connect: im Web nicht verfügbar (native API). Autosync in der nativen App. Vorerst manuell eingeben oder Bluetooth-Gerät verbinden.":lang==="es"?"🍎 Apple Health · 🤖 Health Connect: no disponible en la web (API nativa). Autosincronización en la app nativa. Por ahora, manual o conecta un dispositivo Bluetooth.":lang==="ru"?"🍎 Apple Health · 🤖 Health Connect: недоступно в вебе (нативный API). Автосинхронизация в нативном приложении. Пока вручную или подключите Bluetooth.":lang==="ar"?"🍎 Apple Health · 🤖 Health Connect: غير متاح على الويب (واجهة أصلية). مزامنة تلقائية في التطبيق الأصلي. حالياً يدوياً أو وصّل جهاز بلوتوث.":"🍎 Apple Health · 🤖 Health Connect: not available on web (native API). Auto-sync in the native app. For now, enter manually or connect a Bluetooth device."}</span>
    </div>
  </div>
</div>);};

const resizeImage=(file,maxDim=1280,q=0.72)=>new Promise((res,rej)=>{
  if(!file||!file.type||!file.type.startsWith("image/")){rej(new Error("not image"));return;}
  const r=new FileReader();
  r.onload=()=>{const img=new Image();img.onload=()=>{
    let w=img.width,h=img.height;const sc=Math.min(1,maxDim/Math.max(w,h));w=Math.round(w*sc);h=Math.round(h*sc);
    const cv=document.createElement("canvas");cv.width=w;cv.height=h;cv.getContext("2d").drawImage(img,0,0,w,h);
    try{res(cv.toDataURL("image/jpeg",q));}catch(e){rej(e);}
  };img.onerror=()=>rej(new Error("img"));img.src=r.result;};
  r.onerror=()=>rej(new Error("read"));r.readAsDataURL(file);
});
const addMedImage=async(file,type)=>{
  if(!file)return;
  if(!file.type||!file.type.startsWith("image/")){notify(lang==="tr"?"Lütfen bir görüntü dosyası seçin":TL("Please select an image file",lang));return;}
  try{const dataUrl=await resizeImage(file);
    setMedImages(p=>[{id:Date.now()+Math.floor(Math.random()*1000),name:file.name||("goruntu-"+Date.now()),type:type||imgType,dataUrl,date:new Date().toISOString().slice(0,10),aiNote:""},...p]);
    notify(lang==="tr"?"✅ Görüntü eklendi":TL("✅ Image added",lang));
  }catch(e){notify(lang==="tr"?"Görüntü yüklenemedi":TL("Could not load image",lang));}
};
const addMedFiles=async(files,type)=>{const arr=Array.from(files||[]);for(const f of arr){await addMedImage(f,type);}};
const scanCodeFromImage=async(file)=>{
  try{if("BarcodeDetector" in window){const bmp=await createImageBitmap(file);const det=new BarcodeDetector({formats:["ean_13","ean_8","upc_a","upc_e","qr_code","code_128","code_39"]});const codes=await det.detect(bmp);
    if(codes&&codes.length)notify(lang==="tr"?`🔎 Kod okundu: ${codes[0].rawValue}`:`🔎 Code: ${codes[0].rawValue}`);}
  }catch(e){}
  await addMedImage(file,imgType);
};
const interpretImage=async(img)=>{
  setImgBusy(img.id);
  try{
    const b64=(img.dataUrl||"").split(",")[1]||"";
    const typeLabel=(t[img.type]||img.type);
    // Report-first, not pixel-first. The real value — and the safe value — is explaining the
    // RADIOLOGIST'S REPORT: translating jargon (BI-RADS 4, "T2 hyperintense", "ground-glass"),
    // flagging what needs follow-up, and generating the questions to ask. Reading a raw film
    // (an X-ray/MRI/CT image with no report text) and calling a finding is exactly what a general
    // model must NOT do: the error cost is asymmetric (a false "looks benign" can cost a life), and
    // approved imaging AIs are purpose-built and radiologist-supervised, not a chat model. So the
    // model is told to work from written text when present and to refuse pixel-level diagnosis when
    // the image is a bare film, redirecting the person to get the report instead.
    const sys=lang==="tr"
      ?`Sen AILVIE sağlık asistanısın. Kullanıcı bir tıbbi görüntü (${typeLabel}) yükledi. İŞİN, görselde YAZILI RAPOR METNİ varsa onu okuyup AÇIKLAMAK — teşhis koymak değil.

ÖNCE görüntüde yazılı bir radyoloji/tahlil RAPORU (metin) var mı bak:
- VARSA: Raporu sade dille açıkla. (1) Rapordaki tıbbi terimleri günlük dile çevir (ör. "BI-RADS 4 = kötü huylu olma ihtimali var, biyopsi önerilir"; "T2 hiperintens = MR'da parlak görünen alan"; "buzlu cam opasitesi = akciğerde sisli görünüm"). (2) Takip/işlem gerektiren ifadeleri işaretle. (3) Doktora sorulacak net sorular öner. Raporda yazmayan şeyi UYDURMA; sadece metinde geçeni açıkla.
- YOKSA (çıplak film/görüntü, yazılı rapor yok): Röntgen/MR/BT/mamografi/ultrason GÖRÜNTÜSÜNÜ pikselden OKUMA ve YORUMLAMA — "iyi/kötü huylu görünüyor", "şu kırık var" gibi ŞEYLER SÖYLEME. Bunun sebebi net: hatanın bedeli asimetriktir (yanlış "iyi görünüyor" bir hayata mal olabilir) ve onaylı görüntüleme yapay zekâları bu iş için özel eğitilmiş, radyolog gözetiminde çalışan sistemlerdir — genel bir sohbet modeli değil. Bunun yerine kibarca şunu söyle: bu bir filmdir, radyoloğun YAZILI RAPORUNU yükleyebilirsen onu açıklayabilirim; ayrıca hangi soruları sorman gerektiğinde yardımcı olurum.

Ciddi/acil bir durum ihtimali raporda geçiyorsa vakit kaybetmeden hekime/acile başvurulmasını söyle. Yanıtı MUTLAKA şu uyarıyla bitir: "⚠️ Bu bir tıbbi tanı değildir. Kesin değerlendirme için mutlaka radyolog/hekiminize danışın." Kısa, net ve şefkatli ol.`
      :`You are the AILVIE health assistant. The user uploaded a medical image (${typeLabel}). YOUR JOB is to EXPLAIN any WRITTEN REPORT TEXT in the image — not to diagnose.

FIRST check whether the image contains a written radiology/lab REPORT (text):
- IF IT DOES: Explain the report in plain language. (1) Translate the medical terms (e.g. "BI-RADS 4 = suspicious, biopsy is recommended"; "T2 hyperintense = an area that appears bright on MRI"; "ground-glass opacity = a hazy area in the lung"). (2) Flag any wording that needs follow-up or action. (3) Suggest clear questions to ask the doctor. Do NOT invent anything not written in the report; only explain what the text says.
- IF IT DOES NOT (a bare film/image with no report text): DO NOT read or interpret the X-ray/MRI/CT/mammogram/ultrasound IMAGE from its pixels — do NOT say things like "looks benign/malignant" or "there is a fracture". The reason is clear: the error cost is asymmetric (a false "looks fine" can cost a life), and approved imaging AIs are purpose-built, radiologist-supervised systems — not a general chat model. Instead, gently say: this is a film; if you can upload the radiologist's WRITTEN REPORT I can explain it, and I can help you with the questions to ask.

If the report mentions a serious/urgent possibility, advise seeing a doctor/ER promptly. ALWAYS end with: "⚠️ This is not a medical diagnosis. Always consult your radiologist/doctor for a definitive assessment." Be concise, clear and kind.`;
    const body={model:"claude-sonnet-4-6",max_tokens:1000,system:sys,messages:[{role:"user",content:[{type:"image",source:{type:"base64",media_type:"image/jpeg",data:b64}},{type:"text",text:lang==="tr"?"Bu görüntüde yazılı bir rapor varsa açıkla; yoksa raporu istememi söyle.":TL("If this image contains a written report, explain it; otherwise tell me to provide the report.",lang)}]}]};
    const d=await callAI(body,apiKey);
    const txt=(d.content||[]).filter(x=>x.type==="text").map(x=>x.text).join("\n").trim()||(lang==="tr"?"Yanıt alınamadı.":TL("No response.",lang));
    setMedImages(p=>p.map(x=>x.id===img.id?{...x,aiNote:txt}:x));setImgView(v=>v&&v.id===img.id?{...v,aiNote:txt}:v);
  }catch(e){
    const msg=(e.message||"").includes("NO_KEY")
      ?(lang==="tr"?"AI yorumu için sunucu anahtarı (ANTHROPIC_API_KEY) gerekli — Cloudflare'de ayarlanınca çalışır.":TL("AI needs a server key (ANTHROPIC_API_KEY) — works once set in Cloudflare.",lang))
      :(lang==="tr"?"Yorumlama başarısız. Bağlantıyı kontrol edin.":TL("Interpretation failed. Check connection.",lang));
    setMedImages(p=>p.map(x=>x.id===img.id?{...x,aiNote:"⚠️ "+msg}:x));setImgView(v=>v&&v.id===img.id?{...v,aiNote:"⚠️ "+msg}:v);
  }finally{setImgBusy(null);}
};
const connectENabiz=()=>{
  if(ENABIZ_CONFIG&&ENABIZ_CONFIG.authUrl){
    const u=ENABIZ_CONFIG.authUrl+`?client_id=${encodeURIComponent(ENABIZ_CONFIG.clientId||"")}&response_type=code&scope=${encodeURIComponent(ENABIZ_CONFIG.scope||"patient/*.read")}&redirect_uri=${encodeURIComponent(ENABIZ_CONFIG.redirectUri||(location.origin+"/enabiz/callback"))}`;
    window.open(u,"_blank","noopener");
  }else{
    notify(lang==="tr"?"Otomatik bağlantı için Sağlık Bakanlığı resmi API izni gerekiyor (yakında). Şimdilik e-Nabız'ı açıp raporunu indirip aşağıya yükleyebilirsin.":TL("Automatic connection needs official Ministry of Health API approval (soon). For now, open e-Nabız, download your report and upload it below.",lang));
  }
};
const renderPCard=()=>{
  const now2=new Date();
  const upAll=[...(appts||[])].filter(a=>a.date).map(a=>({...a,dt:new Date(a.date+"T"+(a.time||"09:00"))})).filter(a=>a.dt>=now2).sort((a,b)=>a.dt-b.dt);
  const up=upAll[0];
  const nextTxt=up?((up.doctor||up.dept||up.title||(lang==="tr"?"Randevu":TL("Appt",lang)))+" · "+up.dt.toLocaleDateString(lc,{day:"2-digit",month:"2-digit"})):"—";
  const lg=(glucose&&glucose.length)?glucose[glucose.length-1]:null;
  const cells=[["💊",lang==="tr"?"Aktif İlaç":TL("Meds",lang),(meds||[]).length,"meds"],["🏥",lang==="tr"?"Sıradaki Randevu":TL("Next Appt",lang),nextTxt,"appts"],["🍬",lang==="tr"?"Son Şeker":TL("Last Glucose",lang),lg?lg.val+" mg/dL":"—","health"],["⚖️",lang==="tr"?"Kilo":TL("Weight",lang),hd.weight>0?hd.weight+" "+t.kg:"—","health"]];
  const sexTxt=pat.sex==="female"?(lang==="tr"?"Kadın":TL("Female",lang)):pat.sex==="male"?(lang==="tr"?"Erkek":TL("Male",lang)):"";
  const eLbl=lang==="tr"?"Düzenle":TL("Edit",lang);
  // Plain render helpers (not components) so they can never remount and lose panel state.
  const edit=()=><button onClick={()=>goTo("health")} style={{background:"none",border:"1px solid "+ac+"44",color:acTx,cursor:"pointer",fontSize:fs-3,padding:"3px 9px",borderRadius:7,fontWeight:600,flexShrink:0}}>✏️ {eLbl}</button>;
  const row=(k,label,value)=><div key={k} style={{display:"flex",justifyContent:"space-between",gap:10,padding:"5px 0",borderBottom:"1px solid "+bd+"44"}}>
    <span style={{fontSize:fs-2,color:mt,flexShrink:0}}>{label}</span>
    <span style={{fontSize:fs-1,fontWeight:600,color:value?tc:mt,textAlign:"end",wordBreak:"break-word"}}>{value||"—"}</span>
  </div>;
  const sub=(title,tone,body)=><div style={{marginTop:10}}>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8,marginBottom:4}}>
      <span style={{fontSize:fs-2,fontWeight:700,color:tone||mt}}>{title}</span>{edit()}
    </div>
    {body}
  </div>;
  const panel=(key,icon,title,badge,tone,body)=>{
    const open=!!x2Open[key];
    return <div style={{...CS,padding:0,overflow:"hidden",border:"1px solid "+(tone||bd)+"33"}}>
      <button onClick={()=>setX2Open(p=>({...p,[key]:!p[key]}))} aria-expanded={open} style={{width:"100%",display:"flex",alignItems:"center",gap:8,padding:"11px 12px",background:"transparent",border:"none",cursor:"pointer",color:tc}}>
        <span style={{fontSize:fs+2,flexShrink:0}}>{icon}</span>
        <span style={{flex:1,fontWeight:700,fontSize:fs,color:tone||tc,textAlign:"start"}}>{title}</span>
        {badge?<span style={{fontSize:fs-3,color:mt,background:dark?"#0e1620":"#eef2f6",padding:"2px 8px",borderRadius:8,flexShrink:0,fontWeight:600}}>{badge}</span>:null}
        <span aria-hidden="true" style={{color:mt,fontSize:fs-2,flexShrink:0,display:"inline-block",transform:open?"rotate(180deg)":"none",transition:"transform .2s"}}>▾</span>
      </button>
      {open&&<div style={{padding:"0 12px 12px"}}>{body}</div>}
    </div>;
  };
  const bmiTxt=bmi>0?String(bmi):"—";
  const riskBadge=[pat.bloodType,pat.allergies?"⚠️":""].filter(Boolean).join(" ")||null;
  // Clinical read of the saved labs (same engine that feeds the AI). This is the visual surface of
  // it: the person sees what a clinician would flag, phrased as "ask your doctor", never a diagnosis.
  const clin=(()=>{try{return clinicalSummary(labs,meds,patCtx());}catch(e){return{criticals:[],trends:[],patterns:[],drugChecks:[],derived:{}};}})();
  // Latest value per test, and the non-critical abnormals (low/high/borderline/prediabetes...).
  // The engine only reports criticals/trends/patterns/drug-checks, but a plain "your cholesterol is
  // high" is worth showing too — otherwise a user who enters one abnormal lab sees nothing and
  // assumes it's broken. Critical values are shown in their own section, so exclude them here.
  const latestLab={};for(const r of labs||[]){if(r&&r.test&&(!latestLab[r.test]||r.ts>latestLab[r.test].ts))latestLab[r.test]=r;}
  const abnormals=Object.values(latestLab).filter(r=>r.level&&r.level!=="normal"&&!String(r.level).startsWith("critical"));
  const hasLabs=Object.keys(latestLab).length>0;
  const clinCount=clin.criticals.length+clin.trends.length+clin.patterns.length+clin.drugChecks.length+abnormals.length;
  const levelLbl=(lv)=>({low:lang==="tr"?"düşük":TL("low",lang),high:lang==="tr"?"yüksek":TL("high",lang),borderline:lang==="tr"?"sınırda":TL("borderline",lang),prediabetes:lang==="tr"?"prediyabet":TL("prediabetes",lang),"diabetes-range":lang==="tr"?"diyabet eşiği":TL("diabetes range",lang)}[lv]||lv);
  const testName=(k)=>{const ti=LAB_TESTS.find(x=>x.k===k);if(!ti)return k;return lang==="tr"?ti.tr:(lang==="en"?ti.en:TL(ti.en,lang));};
  const drugRuleLbl=(id)=>({
    "metformin-egfr":lang==="tr"?"Metformin + düşük böbrek fonksiyonu (eGFR)":TL("Metformin + low kidney function (eGFR)",lang),
    "metformin-egfr-review":lang==="tr"?"Metformin + böbrek fonksiyonu gözden geçirilmeli":TL("Metformin + kidney function to review",lang),
    "acei-arb-potassium":lang==="tr"?"Tansiyon ilacı + yüksek potasyum":TL("Blood-pressure drug + high potassium",lang),
    "spironolactone-potassium":lang==="tr"?"Spironolakton + yüksek potasyum":TL("Spironolactone + high potassium",lang),
    "statin-liver":lang==="tr"?"Statin + yüksek karaciğer enzimi":TL("Statin + high liver enzyme",lang),
    "diuretic-sodium":lang==="tr"?"İdrar söktürücü + düşük sodyum":TL("Diuretic + low sodium",lang),
    "warfarin-inr":lang==="tr"?"Varfarin + kritik INR":TL("Warfarin + critical INR",lang),
    "digoxin-potassium":lang==="tr"?"Digoksin + düşük potasyum":TL("Digoxin + low potassium",lang),
    "digoxin-magnesium":lang==="tr"?"Digoksin + düşük magnezyum":TL("Digoxin + low magnesium",lang),
    "digoxin-egfr":lang==="tr"?"Digoksin + düşük böbrek fonksiyonu":TL("Digoxin + low kidney function",lang),
    "nsaid-egfr":lang==="tr"?"Ağrı kesici (NSAİİ) + düşük böbrek fonksiyonu":TL("Painkiller (NSAID) + low kidney function",lang),
    "allopurinol-egfr":lang==="tr"?"Allopurinol + düşük böbrek fonksiyonu":TL("Allopurinol + low kidney function",lang),
  }[id]||id);
  const patternLbl=(id)=>({
    "iron-deficiency":lang==="tr"?"Demir eksikliği anemisi tablosu olabilir":TL("May fit an iron-deficiency picture",lang),
    "liver-enzymes-raised":lang==="tr"?"Karaciğer enzimleri yüksek":TL("Raised liver enzymes",lang),
    "kidney-impairment":lang==="tr"?"Böbrek fonksiyonunda azalma olabilir":TL("May fit reduced kidney function",lang),
    "thyroid-screen":lang==="tr"?"Tiroid taraması değerlendirme gerektirebilir":TL("Thyroid screen may need review",lang),
    "electrolyte-disturbance":lang==="tr"?"Elektrolit dengesizliği":TL("Electrolyte disturbance",lang),
    "anemia-morphology":lang==="tr"?"Anemi tipi (kırmızı hücre boyutu)":TL("Anaemia type (red-cell size)",lang),
  }[id]||id);
  const caveatLbl=(c)=>({
    "ferritin-acute-phase":lang==="tr"?"ferritin iltihapla yükselebilir, gerçek eksikliği gizleyebilir":TL("ferritin can rise with inflammation and mask a true deficiency",lang),
    "ckd-needs-persistence":lang==="tr"?"tek ölçüm kronik böbrek hastalığı demek değildir; tanı için ≥3 ay süreklilik gerekir":TL("a single result isn't chronic kidney disease; that needs persistence over ≥3 months",lang),
  }[c]||c);
  // Source label for a clinical output. The short label is shown as a small "kaynak: X" line so the
  // person can see which published rule a finding rests on. Falls back gracefully if a key is unknown.
  const srcLabel=(key)=>{const src=SOURCES&&SOURCES[key];if(!src)return null;return(lang==="tr"?"kaynak: ":TL("source: ",lang))+src.short;};
  const SrcTag=({k})=>{const t2=srcLabel(k);return t2?<div style={{fontSize:fs-5,color:mt,marginTop:2,fontStyle:"italic",opacity:0.85}}>{t2}</div>:null;};
  return(<div style={{display:"flex",flexDirection:"column",gap:10}}>
    {/* Özet — always visible: this is the at-a-glance layer, it must never be behind a tap. */}
    <div style={{...CS,background:"linear-gradient(135deg,"+ac+"10,"+sc+"08)",border:"1px solid "+ac+"33"}}>
      <b style={{fontSize:fs+1,color:tc,display:"block",marginBottom:8}}>📇 {lang==="tr"?"Canlı Sağlık Özeti":TL("Live Health Summary",lang)}</b>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
        {cells.map(([ic,lb,vv,pg],i)=><div key={i} onClick={()=>goTo(pg)} style={{background:cd,borderRadius:10,padding:"8px 10px",cursor:"pointer"}}><div style={{fontSize:fs-3,color:mt}}>{ic} {lb}</div><div style={{fontSize:fs+1,fontWeight:800,color:tc,marginTop:2}}>{vv}</div></div>)}
      </div>
    </div>
    <span style={{fontWeight:700,fontSize:fs+2}}>📊 {t.pCardFull}</span>
    <div style={{fontSize:fs-3,color:mt,marginTop:-4,lineHeight:1.45}}>{lang==="tr"?"Burası verilerinizin işlenmiş görünümüdür. Değişiklik için ✏️ ile Sağlık Verilerim'e geçin.":TL("This is the processed view of your data. Use ✏️ to change anything in My Health Data.",lang)}</div>

    {/* Clinical read of the labs — placed first among the panels because a critical value must be
        findable fast. Only rendered when there is something to say. */}
    {hasLabs&&(()=>{
      const hasAlert=clin.alerts&&clin.alerts.length>0;
      const hasCrit=clin.criticals.length>0||hasAlert;
      const tone=hasCrit?dg:(abnormals.length||clin.drugChecks.length)?"#e9a23b":sc;
      const badge=hasAlert?(lang==="tr"?"AKI? 🚨":TL("AKI? 🚨",lang)):clin.criticals.length>0?(lang==="tr"?clin.criticals.length+" kritik ⚠️":clin.criticals.length+" critical ⚠️"):clinCount>0?String(clinCount):(lang==="tr"?"tümü normal ✓":TL("all normal ✓",lang));
      return panel("clin","🩺",lang==="tr"?"Tahlil Değerlendirmesi":TL("Lab Assessment",lang),badge,tone,<>
        <div style={{fontSize:fs-3,color:mt,marginBottom:8,lineHeight:1.45}}>{lang==="tr"?"Yayınlanmış kurallara göre okunmuştur — teşhis değildir. Bunları doktorunuza sorun.":TL("Read against published rules — this is not a diagnosis. Take these to your doctor.",lang)}</div>
        {clin.alerts&&clin.alerts.length>0&&<div style={{marginBottom:10}}>
          {clin.alerts.map((a,i)=><div key={i} style={{padding:"9px 11px",borderRadius:8,background:dg+"20",border:"1.5px solid "+dg+"88",marginBottom:6}}>
            <div style={{fontSize:fs-1,fontWeight:800,color:dg}}>🚨 {lang==="tr"?"Kreatinin hızla yükseliyor olabilir":TL("Creatinine may be rising quickly",lang)}</div>
            <div style={{fontSize:fs-3,marginTop:3,lineHeight:1.45}}>{(lang==="tr"?"Son değer ":TL("Latest ",lang))+a.latest+(a.baseline!=null?(lang==="tr"?" · önceki ":TL(" · earlier ",lang))+a.baseline:"")+" mg/dL"+(a.ratio!=null?" · "+a.ratio+"×":"")+(a.absRise!=null?" · +"+a.absRise:"")}</div>
            <div style={{fontSize:fs-3,marginTop:3,lineHeight:1.45,color:tc}}>{lang==="tr"?"Kreatininde bu hızda bir yükseliş akut böbrek hasarı (AKI) ölçütlerini karşılayabilir. Bu bir teşhis değildir; sıvı değişimi veya başka nedenler de benzer görünebilir — ama vakit kaybetmeden hekiminize danışmanız önerilir.":TL("A rise this fast can meet acute kidney injury (AKI) criteria. This is not a diagnosis — fluid shifts and other causes can look similar — but prompt review by your doctor is advised.",lang)}</div>
            <div style={{fontSize:fs-4,color:mt,marginTop:2}}>{lang==="tr"?"KDIGO evresi ~":TL("KDIGO stage ~",lang)}{a.stage}</div>
            <SrcTag k={a.source}/>
          </div>)}
        </div>}
        {clin.criticals.length>0&&<div style={{marginBottom:10}}>
          <div style={{fontSize:fs-2,fontWeight:700,color:dg,marginBottom:4}}>⚠️ {lang==="tr"?"Kritik değerler — acil":TL("Critical values — urgent",lang)}</div>
          {clin.criticals.map((c,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",gap:8,padding:"6px 9px",borderRadius:7,background:dg+"18",border:"1px solid "+dg+"55",marginBottom:4}}>
            <span style={{fontSize:fs-2,fontWeight:600}}>{testName(c.test)}</span>
            <span style={{fontSize:fs-2,fontWeight:700,color:dg}}>{c.value} {c.unit} · {c.level==="critical-high"?(lang==="tr"?"kritik yüksek":TL("critical high",lang)):(lang==="tr"?"kritik düşük":TL("critical low",lang))}</span>
          </div>)}
          <div style={{fontSize:fs-4,color:mt,marginTop:2}}>{lang==="tr"?"Not: kritik sınırlar laboratuvarlar arasında değişebilir; kendi laboratuvarınızın sınırı farklı olabilir.":TL("Note: critical limits vary between labs; your own lab's limit may differ.",lang)}</div>
          <SrcTag k="critical-arup"/>
        </div>}
        {abnormals.length>0&&<div style={{marginBottom:10}}>
          <div style={{fontSize:fs-2,fontWeight:700,color:"#e9a23b",marginBottom:4}}>📊 {lang==="tr"?"Referans dışı değerler":TL("Out-of-range values",lang)}</div>
          {abnormals.map((r,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",gap:8,padding:"6px 9px",borderRadius:7,background:dark?"#0d1520":"#f8fafc",marginBottom:4}}>
            <span style={{fontSize:fs-2,fontWeight:600}}>{testName(r.test)}</span>
            <span style={{fontSize:fs-2,color:"#e9a23b",fontWeight:600}}>{r.value} {r.unit||r.canonUnit||""} · {levelLbl(r.level)}</span>
          </div>)}
        </div>}
        {clin.drugChecks.length>0&&<div style={{marginBottom:10}}>
          <div style={{fontSize:fs-2,fontWeight:700,color:"#e9a23b",marginBottom:4}}>💊 {lang==="tr"?"İlaç–tahlil kontrolü":TL("Drug–lab check",lang)}</div>
          {clin.drugChecks.map((d,i)=><div key={i} style={{padding:"6px 9px",borderRadius:7,background:dark?"#0d1520":"#f8fafc",marginBottom:4}}>
            <div style={{fontSize:fs-2,fontWeight:600}}>{drugRuleLbl(d.id)}</div>
            <div style={{fontSize:fs-4,color:mt,marginTop:1,textTransform:"capitalize"}}>{d.drug}{d.test?" · "+testName(d.test)+" "+d.value:d.egfr!=null?" · eGFR "+Math.round(d.egfr):""}</div>
            {d.source&&<SrcTag k={d.source}/>}
          </div>)}
        </div>}
        {clin.patterns.length>0&&<div style={{marginBottom:10}}>
          <div style={{fontSize:fs-2,fontWeight:700,color:acTx,marginBottom:4}}>🔬 {lang==="tr"?"Örüntüler (olası)":TL("Patterns (possible)",lang)}</div>
          {clin.patterns.map((p,i)=><div key={i} style={{padding:"6px 9px",borderRadius:7,background:dark?"#0d1520":"#f8fafc",marginBottom:4}}>
            <div style={{fontSize:fs-2,fontWeight:600}}>{patternLbl(p.id)}{p.astAltRatio!=null?" · AST/ALT "+p.astAltRatio:""}{p.egfr!=null?" · eGFR "+p.egfr:""}</div>
            {p.details&&<div style={{fontSize:fs-4,color:mt,marginTop:1}}>{p.details.map(x=>testName(x.test)+" "+levelLbl(x.level)).join(", ")}</div>}
            {p.direction&&<div style={{fontSize:fs-4,color:mt,marginTop:1}}>{p.direction==="tsh-high"?(lang==="tr"?"TSH yüksek":TL("TSH high",lang)):(lang==="tr"?"TSH düşük":TL("TSH low",lang))}{p.ft4Level?" · "+testName("ft4")+" "+levelLbl(p.ft4Level):""}</div>}
            {p.morphology&&<div style={{fontSize:fs-4,color:mt,marginTop:1}}>{p.morphology==="microcytic"?(lang==="tr"?"Mikrositik (küçük hücreler, MCV "+p.mcvValue+") — demir eksikliği/talasemi düşündürebilir":TL("Microcytic (small cells) — may suggest iron deficiency/thalassaemia",lang)):p.morphology==="macrocytic"?(lang==="tr"?"Makrositik (büyük hücreler, MCV "+p.mcvValue+") — B12/folat eksikliği düşündürebilir":TL("Macrocytic (large cells) — may suggest B12/folate deficiency",lang)):(lang==="tr"?"Normositik (normal boyut, MCV "+p.mcvValue+") — kronik hastalık/kan kaybı düşündürebilir":TL("Normocytic (normal size) — may suggest chronic disease/blood loss",lang))}</div>}
            {p.picture&&<div style={{fontSize:fs-4,color:mt,marginTop:1}}>{p.picture==="cholestatic-hint"?(lang==="tr"?"ALP + bilirubin yüksek — safra akışıyla ilgili (kolestatik) tablo düşündürebilir":TL("ALP + bilirubin high — may point to a cholestatic (bile-flow) picture",lang)):(lang==="tr"?"ALP yüksek — karaciğer ve kemik kaynağı ayrımı için değerlendirme gerekebilir":TL("ALP high — may need review to separate liver vs bone source",lang))}</div>}
            {p.caveat&&<div style={{fontSize:fs-4,color:mt,marginTop:1}}>⚠️ {caveatLbl(p.caveat)}</div>}
            {p.missing&&<div style={{fontSize:fs-4,color:mt,marginTop:1}}>{lang==="tr"?"Tam ayrım için eksik: ":TL("Missing for full picture: ",lang)}{p.missing.map(testName).join(", ")}</div>}
            {p.source&&<SrcTag k={p.source}/>}
          </div>)}
        </div>}
        {clin.trends.length>0&&<div style={{marginBottom:abnormals.length||clin.criticals.length?0:6}}>
          <div style={{fontSize:fs-2,fontWeight:700,color:acTx,marginBottom:4}}>📈 {lang==="tr"?"Eğilimler":TL("Trends",lang)}</div>
          {clin.trends.map((tr,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",gap:8,padding:"6px 9px",borderRadius:7,background:dark?"#0d1520":"#f8fafc",marginBottom:4}}>
            <span style={{fontSize:fs-2,fontWeight:600}}>{testName(tr.test)}</span>
            <span style={{fontSize:fs-2,color:mt}}>{tr.dir==="up"?"↗ ":"↘ "}{lang==="tr"?(tr.dir==="up"?"yükseliyor":"düşüyor"):(tr.dir==="up"?TL("rising",lang):TL("falling",lang))} %{Math.abs(tr.pct)} · {tr.spanDays}{lang==="tr"?" gün":TL(" days",lang)} · {tr.n} {lang==="tr"?"ölçüm":TL("readings",lang)}</span>
          </div>)}
          <div style={{fontSize:fs-4,color:mt,marginTop:2}}>{lang==="tr"?"Yön tek başına iyi/kötü demek değildir; teste göre değişir.":TL("Direction alone is not good or bad; it depends on the test.",lang)}</div>
        </div>}
        {(()=>{
          const d=clin.derived||{};
          const items=[];
          if(d.ldlCalc&&d.ldlCalc.ok)items.push({name:lang==="tr"?"LDL (hesaplanan)":TL("LDL (calculated)",lang),val:d.ldlCalc.value+" mg/dL",sub:"Friedewald",source:d.ldlCalc.source});
          if(d.fib4&&d.fib4.ok){
            const bandTxt=d.fib4.band==="high"?(lang==="tr"?"ileri fibroz olasılığı yüksek":TL("high probability of advanced fibrosis",lang)):d.fib4.band==="low"?(lang==="tr"?"düşük olasılık":TL("low probability",lang)):(lang==="tr"?"belirsiz aralık":TL("indeterminate range",lang));
            items.push({name:"FIB-4",val:String(d.fib4.value),sub:(lang==="tr"?"karaciğer fibrozu · ":TL("liver fibrosis · ",lang))+bandTxt,tone:d.fib4.band==="high"?"#e9a23b":undefined,source:d.fib4.source});
          }
          if(d.apri&&d.apri.ok){
            const apriTxt=d.apri.band==="high"?(lang==="tr"?"siroz olasılığını düşündürebilir":TL("may raise the possibility of cirrhosis",lang)):d.apri.band==="low"?(lang==="tr"?"anlamlı fibroz olası değil":TL("significant fibrosis unlikely",lang)):(lang==="tr"?"belirsiz aralık":TL("indeterminate range",lang));
            items.push({name:"APRI",val:String(d.apri.value),sub:(lang==="tr"?"karaciğer fibrozu (yaş gerekmez) · ":TL("liver fibrosis (no age needed) · ",lang))+apriTxt,tone:d.apri.band==="high"?"#e9a23b":undefined,source:d.apri.source});
          }
          if(d.anionGap&&d.anionGap.ok){
            items.push({name:lang==="tr"?"Anyon açığı":TL("Anion gap",lang),val:d.anionGap.value+" mmol/L",sub:d.anionGap.corrected!=null?(lang==="tr"?"albümine göre düzeltilmiş: ":TL("albumin-corrected: ",lang))+d.anionGap.corrected:null,source:d.anionGap.source});
          }
          if(d.correctedCalcium&&d.correctedCalcium.ok){
            items.push({name:lang==="tr"?"Düzeltilmiş kalsiyum":TL("Corrected calcium",lang),val:d.correctedCalcium.value+" mg/dL",sub:lang==="tr"?"albümine göre · kesinlik için iyonize kalsiyum tercih edilir":TL("albumin-adjusted · ionised calcium preferred when in doubt",lang),source:d.correctedCalcium.source});
          }
          if(d.globulinAG&&d.globulinAG.ok){
            const agTxt=d.globulinAG.band==="low"?(lang==="tr"?"düşük — kronik iltihap/otoimmün/karaciğer/miyelom değerlendirilebilir":TL("low — may warrant review for chronic inflammation/autoimmune/liver/myeloma",lang)):d.globulinAG.band==="high"?(lang==="tr"?"yüksek — genelde düşük globulin (ör. dehidratasyon)":TL("high — usually low globulin (e.g. dehydration)",lang)):(lang==="tr"?"normal aralık":TL("normal range",lang));
            items.push({name:lang==="tr"?"A/G oranı (globulin "+d.globulinAG.globulin+")":TL("A/G ratio",lang)+" (globulin "+d.globulinAG.globulin+")",val:String(d.globulinAG.agRatio),sub:agTxt+(lang==="tr"?" · tek başına teşhis değil, bir bayraktır":TL(" · a flag, not a diagnosis on its own",lang)),tone:d.globulinAG.band!=="normal"?"#e9a23b":undefined,source:d.globulinAG.source});
          }
          if(d.nonHDL&&d.nonHDL.ok){
            items.push({name:lang==="tr"?"Non-HDL kolesterol":TL("Non-HDL cholesterol",lang),val:d.nonHDL.value+" mg/dL",sub:lang==="tr"?"tüm aterojenik parçacıklar (hedef genelde <130)":TL("all atherogenic particles (target usually <130)",lang),tone:d.nonHDL.value>=160?"#e9a23b":undefined,source:d.nonHDL.source});
          }
          if(d.bunCrRatio&&d.bunCrRatio.ok){
            const bcTxt=d.bunCrRatio.band==="high"?(lang==="tr"?"yüksek — böbrek öncesi (ör. sıvı kaybı) düşündürebilir":TL("high — may suggest pre-renal (e.g. dehydration)",lang)):d.bunCrRatio.band==="low"?(lang==="tr"?"düşük":TL("low",lang)):(lang==="tr"?"normal aralık":TL("normal range",lang));
            items.push({name:lang==="tr"?"BUN/Kreatinin oranı":TL("BUN/creatinine ratio",lang),val:String(d.bunCrRatio.value),sub:bcTxt,source:d.bunCrRatio.source});
          }
          if(d.tsat&&d.tsat.ok){
            const tsTxt=d.tsat.band==="low"?(lang==="tr"?"düşük — demir eksikliğini düşündürebilir (ferritinle birlikte oku)":TL("low — may suggest iron deficiency (read with ferritin)",lang)):d.tsat.band==="high"?(lang==="tr"?"yüksek — demir yükünü düşündürebilir":TL("high — may suggest iron overload",lang)):(lang==="tr"?"normal aralık":TL("normal range",lang));
            items.push({name:lang==="tr"?"Transferrin satürasyonu (TSAT)":TL("Transferrin saturation (TSAT)",lang),val:d.tsat.value+"%",sub:tsTxt,tone:d.tsat.band!=="normal"?"#e9a23b":undefined,source:d.tsat.source});
          }
          if(d.eag&&d.eag.ok){
            items.push({name:lang==="tr"?"Tahmini ortalama glukoz (eAG)":TL("Estimated average glucose (eAG)",lang),val:d.eag.value+" mg/dL",sub:(lang==="tr"?"HbA1c'nizin günlük şeker karşılığı · ":TL("your HbA1c as everyday glucose · ",lang))+d.eag.mmol+" mmol/L",source:d.eag.source});
          }
          if(d.osmolality&&d.osmolality.ok){
            items.push({name:lang==="tr"?"Hesaplanmış osmolalite":TL("Calculated osmolality",lang),val:d.osmolality.value+" mOsm/kg",sub:lang==="tr"?"kandaki çözünen yoğunluğu (normal ~275–295)":TL("concentration of dissolved solutes (normal ~275–295)",lang),source:d.osmolality.source});
          }
          if(d.correctedSodium&&d.correctedSodium.ok){
            items.push({name:lang==="tr"?"Düzeltilmiş sodyum":TL("Corrected sodium",lang),val:d.correctedSodium.value+" mmol/L",sub:(lang==="tr"?"yüksek şekere göre · ölçülen ":TL("adjusted for high glucose · measured ",lang))+d.correctedSodium.measured,source:d.correctedSodium.source});
          }
          if(d.fena&&d.fena.ok){
            const feTxt=d.fena.band==="prerenal"?(lang==="tr"?"prerenal örüntü — böbrek sodyumu tutuyor (ör. sıvı kaybı, kalp yetmezliği)":TL("prerenal pattern — kidney is holding sodium (e.g. volume loss, heart failure)",lang)):d.fena.band==="intrinsic"?(lang==="tr"?"intrinsik/ATN örüntüsü — tübüller sodyumu tutamıyor":TL("intrinsic/ATN pattern — tubules can't hold sodium",lang)):(lang==="tr"?"belirsiz aralık (%1–2)":TL("indeterminate range (1–2%)",lang));
            const feCav=d.fena.caveat==="fena-diuretic-unreliable"?(lang==="tr"?" · dikkat: idrar söktürücü FENa'yı yanıltıcı yükseltir, güvenilmez olabilir":TL(" · caution: a diuretic falsely raises FENa, may be unreliable",lang)):(lang==="tr"?" · bir ipucudur, klinikle birlikte yorumlanır":TL(" · a pointer, interpret with the clinical picture",lang));
            items.push({name:"FENa",val:d.fena.value+"%",sub:feTxt+feCav,tone:d.fena.band==="intrinsic"?"#e9a23b":undefined,source:d.fena.source});
          }
          if(!items.length)return null;
          return <div style={{marginBottom:6}}>
            <div style={{fontSize:fs-2,fontWeight:700,color:acTx,marginBottom:4}}>🧮 {lang==="tr"?"Hesaplanan değerler":TL("Calculated values",lang)}</div>
            {items.map((it,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8,padding:"6px 9px",borderRadius:7,background:dark?"#0d1520":"#f8fafc",marginBottom:4}}>
              <div style={{flex:1}}>
                <div style={{fontSize:fs-2,fontWeight:600}}>{it.name}</div>
                {it.sub&&<div style={{fontSize:fs-4,color:mt,marginTop:1}}>{it.sub}</div>}
                {it.source&&<SrcTag k={it.source}/>}
              </div>
              <span style={{fontSize:fs-2,fontWeight:700,color:it.tone||tc,whiteSpace:"nowrap"}}>{it.val}</span>
            </div>)}
            <div style={{fontSize:fs-4,color:mt,marginTop:2}}>{lang==="tr"?"Bu değerler tahlillerinizden hesaplanmıştır; teşhis değildir, doktorunuzla değerlendirin.":TL("These are computed from your labs; not a diagnosis — review with your doctor.",lang)}</div>
          </div>;
        })()}
        {clinCount===0&&!(clin.derived&&(clin.derived.fib4||clin.derived.anionGap||clin.derived.ldlCalc||clin.derived.correctedCalcium||clin.derived.nonHDL||clin.derived.bunCrRatio||clin.derived.tsat||clin.derived.eag||clin.derived.osmolality||clin.derived.correctedSodium||clin.derived.apri||clin.derived.globulinAG||clin.derived.fena))&&<div style={{fontSize:fs-2,color:sc,textAlign:"center",padding:"8px 4px",fontWeight:600}}>✓ {lang==="tr"?"Girdiğiniz tüm tahliller referans aralığında.":TL("All labs you entered are within range.",lang)}</div>}
        <button onClick={()=>goTo("health")} style={{...BP,width:"100%",marginTop:8,padding:"7px",background:"transparent",color:acTx,border:"1px solid "+ac+"44"}}>✏️ {lang==="tr"?"Tahlilleri Sağlık Verilerim'de düzenle":TL("Edit labs in My Health Data",lang)}</button>
      </>);
    })()}

    {panel("id","👤",lang==="tr"?"Kimlik & Risk":TL("Identity & Risk",lang),riskBadge,ac,<>
      {row("n",t.fName,pat.name)}
      {row("b",t.bDate,pat.birthDate?pat.birthDate+(patAge?" ("+patAge+" "+t.age+")":""):"")}
      {row("bt",t.bType,pat.bloodType)}
      {row("sx",lang==="tr"?"Biyolojik Cinsiyet":TL("Biological Sex",lang),sexTxt)}
      {pat.onAnticoag?row("ac","💊",lang==="tr"?"Kan sulandırıcı kullanıyor":TL("On anticoagulant",lang)):null}
      {pat.pregnant?row("pg","🤰",lang==="tr"?"Gebelik":TL("Pregnancy",lang)):null}
      <div style={{display:"flex",justifyContent:"flex-end",marginTop:8}}>{edit()}</div>
      {sub("⚠️ "+(lang==="tr"?"Alerji & Kronik Durumlar":TL("Allergies & Chronic Conditions",lang)),dg,<>
        {row("al",t.allrg,pat.allergies)}
        {row("ch",t.chron,pat.chronic)}
      </>)}
      {sub("📋 "+(lang==="tr"?"Sigorta & Acil":TL("Insurance & Emergency",lang)),mt,<>
        {row("in",t.insu,pat.insu)}
        {row("ec",t.emCon,pat.emContact)}
        {row("ep",lang==="tr"?"Acil Telefon":TL("Emergency Phone",lang),pat.emPhone)}
      </>)}
    </>)}

    {panel("meas","📏",lang==="tr"?"Vücut Ölçüleri":TL("Body Measurements",lang),bmi>0?"BMI "+bmiTxt:null,sc,<>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
        <div style={{padding:"7px 10px",borderRadius:8,background:dark?"#0e1620":"#f4f7fa"}}>
          <div style={{fontSize:fs-4,color:mt}}>📏 {t.ht} ({t.cm})</div>
          <div style={{fontSize:fs,fontWeight:700,color:hd.height>0?tc:mt,marginTop:2}}>{hd.height>0?hd.height:"—"}</div>
        </div>
        <div style={{padding:"7px 10px",borderRadius:8,background:bmi>0?(bmi>=18.5&&bmi<25?sc+"15":dg+"15"):(dark?"#0e1620":"#f4f7fa")}}>
          <div style={{fontSize:fs-4,color:mt}}>📊 BMI</div>
          <div style={{fontSize:fs,fontWeight:700,marginTop:2,color:bmi>0?(bmi>=18.5&&bmi<25?sc:dg):mt}}>{bmi>0?bmi+" · "+(bmi<18.5?(lang==="tr"?"Zayıf":TL("Under",lang)):bmi<25?"Normal":bmi<30?(lang==="tr"?"Fazla":TL("Over",lang)):(lang==="tr"?"Obez":TL("Obese",lang))):"—"}</div>
        </div>
      </div>
      <div style={{display:"flex",gap:8}}>
        {[["❤️",t.pulse,hd.pulse>0?hd.pulse+" "+t.bpm:"—"],["🩺",t.bp,hd.bpS>0?hd.bpS+"/"+(hd.bpD||"?"):"—"],["⚖️",t.wt,hd.weight>0?hd.weight+" "+t.kg:"—"]].map(([ic,lb,vv],i)=><div key={i} style={{flex:1,textAlign:"center",padding:"7px 4px",borderRadius:8,background:dark?"#0e1620":"#f4f7fa"}}><div style={{fontSize:fs-4,color:mt}}>{ic} {lb}</div><div style={{fontSize:fs-1,fontWeight:700,color:tc,marginTop:2}}>{vv}</div></div>)}
      </div>
      <div style={{display:"flex",justifyContent:"flex-end",marginTop:8}}>{edit()}</div>
    </>)}

    {panel("treat","💊",lang==="tr"?"Tedavi":TL("Treatment",lang),(meds||[]).length?String((meds||[]).length):null,ac,<>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8,marginBottom:4}}>
        <span style={{fontSize:fs-2,fontWeight:700,color:acTx}}>💊 {lang==="tr"?"Kullandığı İlaçlar":TL("Current Medications",lang)}</span>
        <button onClick={()=>goTo("meds")} style={{background:"none",border:"1px solid "+ac+"44",color:acTx,cursor:"pointer",fontSize:fs-3,padding:"3px 9px",borderRadius:7,fontWeight:600,flexShrink:0}}>✏️ {eLbl}</button>
      </div>
      {meds.length===0?<div style={{fontSize:fs-2,color:mt,textAlign:"center",padding:8}}>{t.noM}</div>:
        <div style={{display:"flex",flexDirection:"column",gap:5}}>
          {meds.map(m=><div key={m.id} style={{display:"flex",alignItems:"center",gap:6,padding:"5px 8px",borderRadius:6,background:dark?"#0d1520":"#f8fafc",fontSize:fs-2}}>
            <span>💊</span>
            <span style={{fontWeight:600,flex:1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{m.name}</span>
            <span style={{color:mt}}>{m.dose}</span>
            <span style={{color:acTx,fontWeight:600}}>{m.time}</span>
          </div>)}
        </div>
      }
      <div style={{marginTop:10}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8,marginBottom:4}}>
          <span style={{fontSize:fs-2,fontWeight:700,color:mt}}>🏥 {lang==="tr"?"Yaklaşan Randevular":TL("Upcoming Appointments",lang)}</span>
          <button onClick={()=>goTo("appts")} style={{background:"none",border:"1px solid "+ac+"44",color:acTx,cursor:"pointer",fontSize:fs-3,padding:"3px 9px",borderRadius:7,fontWeight:600,flexShrink:0}}>✏️ {eLbl}</button>
        </div>
        {upAll.length===0?<div style={{fontSize:fs-2,color:mt,textAlign:"center",padding:8}}>{lang==="tr"?"Yaklaşan randevu yok":TL("No upcoming appointments",lang)}</div>:
          <div style={{display:"flex",flexDirection:"column",gap:5}}>
            {upAll.slice(0,5).map(a=><div key={a.id||a.date+a.time} style={{display:"flex",alignItems:"center",gap:6,padding:"5px 8px",borderRadius:6,background:dark?"#0d1520":"#f8fafc",fontSize:fs-2}}>
              <span>🏥</span>
              <span style={{fontWeight:600,flex:1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{a.doctor||a.dept||a.title||"—"}</span>
              <span style={{color:acTx,fontWeight:600}}>{a.dt.toLocaleDateString(lc,{day:"2-digit",month:"2-digit"})}{a.time?" "+a.time:""}</span>
            </div>)}
          </div>
        }
      </div>
    </>)}

    {panel("rec","📋",t.diag+" / "+t.lab,records.length?String(records.length):null,mt,<>
      <div style={{display:"flex",justifyContent:"flex-end",marginBottom:6}}>{edit()}</div>
      {records.length===0?<div style={{fontSize:fs-2,color:mt,textAlign:"center",padding:8}}>{lang==="tr"?"Henüz kayıt yok":TL("No records yet",lang)}</div>:
        <div style={{display:"flex",flexDirection:"column",gap:6}}>
          {records.map(r=><div key={r.id} style={{padding:"7px 10px",borderRadius:8,background:dark?"#0d1520":"#f8fafc"}}>
            <div style={{display:"flex",justifyContent:"space-between",gap:8}}><span style={{fontWeight:700,color:acTx,fontSize:fs-1}}>{t[r.type]||r.type}</span><span style={{fontSize:fs-3,color:mt}}>{r.date}</span></div>
            {(r.doctor||r.hospital)?<div style={{fontSize:fs-3,color:mt,marginTop:1}}>{[r.doctor,r.hospital].filter(Boolean).join(" — ")}</div>:null}
            {r.content?<div style={{marginTop:3,fontSize:fs-2,wordBreak:"break-word"}}>{r.content}</div>:null}
          </div>)}
        </div>
      }
    </>)}
  </div>);
};


const svgPat=(inner,w,h)=>`url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}'>${inner}</svg>`)}")`;
const NOTE_BGS=[{k:"none",g:null},{k:"lale",g:svgPat("<g fill='none' stroke='rgba(255,255,255,0.13)' stroke-width='1.3'><path d='M22 40 C15 34 14 25 14 20 C14 16 18 16 18 20 C18 14 22 13 22 13 C22 13 26 14 26 20 C26 16 30 16 30 20 C30 25 29 34 22 40 Z'/><path d='M22 13 V40'/></g>",44,48)+",linear-gradient(135deg,#4a2028,#6e3038)"},{k:"karanfil",g:svgPat("<g fill='none' stroke='rgba(255,255,255,0.13)' stroke-width='1.3'><path d='M20 36 C16 28 16 20 20 11 C24 20 24 28 20 36 Z'/><path d='M20 11 L14 7 M20 11 L26 7 M20 11 L20 4 M20 11 L11 10 M20 11 L29 10'/></g>",40,40)+",linear-gradient(135deg,#4f2a2e,#6e3e42)"},{k:"cintemani",g:svgPat("<g stroke='rgba(255,255,255,0.13)' stroke-width='1.3' fill='none'><circle cx='16' cy='12' r='4'/><circle cx='32' cy='12' r='4'/><circle cx='24' cy='23' r='4'/><path d='M2 34 Q12 29 22 34 T42 34 T62 34'/><path d='M2 38 Q12 33 22 38 T42 38 T62 38'/></g>",60,40)+",linear-gradient(135deg,#20264a,#333a6e)"},{k:"selcuklu",g:svgPat("<g fill='none' stroke='rgba(255,255,255,0.13)' stroke-width='1.2'><rect x='13' y='13' width='22' height='22'/><rect x='13' y='13' width='22' height='22' transform='rotate(45 24 24)'/></g>",48,48)+",linear-gradient(135deg,#123a3a,#1f5a58)"},{k:"rumi",g:svgPat("<path d='M8 36 C8 20 20 10 36 12 C27 13 23 19 23 27 C23 20 17 20 15 26 C14 30 11 33 8 36 Z' fill='none' stroke='rgba(255,255,255,0.13)' stroke-width='1.2'/>",44,44)+",linear-gradient(135deg,#1e3a2e,#2f4f3e)"},{k:"kilim",g:svgPat("<g fill='none' stroke='rgba(255,255,255,0.13)' stroke-width='1.2'><path d='M20 3 L37 20 L20 37 L3 20 Z'/><path d='M20 11 L29 20 L20 29 L11 20 Z'/></g>",40,40)+",linear-gradient(135deg,#3a2030,#5a3048)"},{k:"carkifelek",g:svgPat("<g fill='none' stroke='rgba(255,255,255,0.13)' stroke-width='1.2'><circle cx='23' cy='23' r='3.5'/><ellipse cx='23' cy='12' rx='3.5' ry='6'/><ellipse cx='34' cy='23' rx='6' ry='3.5'/><ellipse cx='23' cy='34' rx='3.5' ry='6'/><ellipse cx='12' cy='23' rx='6' ry='3.5'/></g>",46,46)+",linear-gradient(135deg,#3a2e4f,#5a3a6e)"},{k:"suyolu",g:svgPat("<path d='M2 20 V6 H16 V16 H9 V11 M22 20 V6 H36 V16 H29 V11' fill='none' stroke='rgba(255,255,255,0.13)' stroke-width='1.3'/>",40,24)+",linear-gradient(135deg,#173a3e,#245a5e)"},{k:"penc",g:svgPat("<g fill='none' stroke='rgba(255,255,255,0.13)' stroke-width='1.2'><circle cx='22' cy='22' r='3.5'/><ellipse cx='22' cy='11' rx='3.5' ry='6'/><ellipse cx='32' cy='19' rx='3.5' ry='6' transform='rotate(72 32 19)'/><ellipse cx='28' cy='31' rx='3.5' ry='6' transform='rotate(144 28 31)'/><ellipse cx='16' cy='31' rx='3.5' ry='6' transform='rotate(216 16 31)'/><ellipse cx='12' cy='19' rx='3.5' ry='6' transform='rotate(288 12 19)'/></g>",44,44)+",linear-gradient(135deg,#1e3a4f,#2f5a6e)"}];
const noteBg=(k)=>{const b=NOTE_BGS.find(x=>x.k===k);return b?b.g:null;};
const noteColor=(key)=>{if(!key||key==="default")return null;if(typeof key==="string"&&key[0]==="#")return key;const c=NCOLS.find(x=>x.k===key);return c?(dark?c.d:c.l):null;};
const pushHist=(nid,html)=>{const h=noteHistRef.current;if(h.nid!==nid){h.nid=nid;h.stack=[html];h.idx=0;return;}if(h.stack[h.idx]===html)return;h.stack=h.stack.slice(0,h.idx+1);h.stack.push(html);if(h.stack.length>60)h.stack.shift();h.idx=h.stack.length-1;};
const setEditableHtml=(nid,html)=>{setNotes(p=>p.map(x=>x.id===nid?{...x,content:html}:x));if(editableRef.current){editableRef.current.innerHTML=html;syncNoteBar(editableRef.current);}};
const doUndo=(nid)=>{const h=noteHistRef.current;if(h.nid!==nid||h.idx<=0)return;h.idx--;setEditableHtml(nid,h.stack[h.idx]);haptic(8);};
const doRedo=(nid)=>{const h=noteHistRef.current;if(h.nid!==nid||h.idx>=h.stack.length-1)return;h.idx++;setEditableHtml(nid,h.stack[h.idx]);haptic(8);};
const fmt=(cmd,val)=>{try{const el=editableRef.current;if(!el)return;el.focus();document.execCommand(cmd,false,val);const nid=noteHistRef.current.nid;const html=el.innerHTML;setNotes(p=>p.map(x=>x.id===nid?{...x,content:html}:x));pushHist(nid,html);try{setFmtState({b:document.queryCommandState("bold"),i:document.queryCommandState("italic"),u:document.queryCommandState("underline"),block:(document.queryCommandValue("formatBlock")||"").toLowerCase()});}catch(e){}}catch(e){}};
const addNoteMedia=(nid,item)=>{setNoteMedia(p=>{const next={...p,[nid]:[...(p[nid]||[]),item]};try{if(JSON.stringify(next).length>4200000){notify(lang==="tr"?"Depolama dolu — medya eklenemedi":TL("Storage full — media not added",lang));return p;}}catch(e){}return next;});haptic(12);};
const delNoteMedia=(nid,idx)=>setNoteMedia(p=>({...p,[nid]:(p[nid]||[]).filter((_,i)=>i!==idx)}));
const pickNoteImage=(nid,useCamera)=>{const inp=document.createElement("input");inp.type="file";inp.accept="image/*";if(useCamera)inp.capture="environment";inp.onchange=async()=>{const f=inp.files&&inp.files[0];if(!f)return;try{const data=await resizeImage(f);addNoteMedia(nid,{type:"image",data});}catch(e){notify(lang==="tr"?"Resim eklenemedi":TL("Could not add image",lang));}};inp.click();setNoteSheet(null);};
const duplicateNote=(n)=>{const id=Date.now();setNotes(p=>[{...JSON.parse(JSON.stringify(n)),id,pinned:false},...p]);if(noteMedia[n.id])setNoteMedia(p=>({...p,[id]:JSON.parse(JSON.stringify(p[n.id]))}));setEditNote(null);setNoteSheet(null);notify(lang==="tr"?"📋 Kopya oluşturuldu":TL("📋 Copy created",lang));};
const shareNote=async(n)=>{const text=(n.title?n.title+"\n":"")+((n.checklist?n.checklist.map(i=>(i.done?"☑ ":"☐ ")+i.text).join("\n"):(n.content||"")).replace(/<br\s*\/?>/gi,"\n").replace(/<[^>]+>/g,""));try{if(navigator.share)await navigator.share({title:n.title||"Not",text});else{await navigator.clipboard.writeText(text);notify(lang==="tr"?"Panoya kopyalandı":TL("Copied to clipboard",lang));}}catch(e){}setNoteSheet(null);};
const toggleChecklist=(n)=>{setNotes(p=>p.map(x=>{if(x.id!==n.id)return x;if(x.checklist)return{...x,checklist:null,content:x.checklist.map(i=>i.text).join("<br>")};const items=(x.content||"").replace(/<br\s*\/?>/gi,"\n").replace(/<\/(div|p)>/gi,"\n").replace(/<[^>]+>/g,"").split("\n").filter(l=>l.trim()).map((l,i)=>({id:Date.now()+i,text:l.trim(),done:false}));return{...x,checklist:items.length?items:[{id:Date.now(),text:"",done:false}],content:""};}));setNoteSheet(null);};
const setCheck=(nid,items)=>setNotes(p=>p.map(x=>x.id===nid?{...x,checklist:items}:x));
const stopNoteRec=()=>{const r=noteRecRef.current;if(r){try{clearInterval(r.timer);if(r.mr&&r.mr.state!=="inactive")r.mr.stop();}catch(e){}noteRecRef.current=null;}setNoteRec(null);};
const startNoteRec=async(nid)=>{
  if(!navigator.mediaDevices||!window.MediaRecorder){notify(lang==="tr"?"Kayıt bu cihazda desteklenmiyor":TL("Recording not supported",lang));return;}
  setNoteSheet(null);
  try{const stream=await navigator.mediaDevices.getUserMedia({audio:true});const mr=new MediaRecorder(stream);const chunks=[];mr.ondataavailable=e=>{if(e.data&&e.data.size)chunks.push(e.data);};mr.onstop=()=>{try{stream.getTracks().forEach(t=>t.stop());}catch(e){}const blob=new Blob(chunks,{type:mr.mimeType||"audio/webm"});const fr=new FileReader();fr.onload=()=>addNoteMedia(nid,{type:"audio",data:fr.result});fr.readAsDataURL(blob);};mr.start();noteRecRef.current={mr,nid,t0:Date.now(),timer:setInterval(()=>{const s=Math.floor((Date.now()-noteRecRef.current.t0)/1000);setNoteRec({id:nid,sec:s});if(s>=120)stopNoteRec();},250)};setNoteRec({id:nid,sec:0});}
  catch(e){notify(lang==="tr"?"Mikrofon izni gerekli":TL("Microphone permission needed",lang));}
};
// Google Keep behaviour: a drawing opened on its own becomes its OWN note.
// Opened from inside a note (editNote set), it is attached to that note instead.
const saveDrawing=(dataUrl)=>{
  if(!dataUrl){setNoteDraw(false);return;}
  if(editNote){
    addNoteMedia(editNote,{type:"drawing",data:dataUrl});
    setNoteDraw(false);
    // Keep behaviour: if the host note has no text of its own, the drawing IS the note ->
    // close the editor and return to the list instead of leaving an empty text note open.
    const host=notes.find(x=>x.id===editNote);
    const textless=host&&!(host.title||"").trim()
      &&!(host.content||"").replace(/<[^>]+>/g,"").trim()
      &&!(host.checklist&&host.checklist.some(i=>(i.text||"").trim()));
    if(textless){setEditNote(null);setNoteSheet(null);notify(lang==="tr"?"✓ Çizim not olarak kaydedildi":TL("✓ Drawing saved as a note",lang));}
    return;
  }
  const nid=Date.now();
  setNotes(p=>[{id:nid,title:"",content:"",color:"default",pinned:false},...p]);
  addNoteMedia(nid,{type:"drawing",data:dataUrl});
  setNoteDraw(false);
  notify(lang==="tr"?"✓ Çizim yeni not olarak kaydedildi":TL("✓ Drawing saved as a new note",lang));
};
const syncNoteBar=(el)=>{if(!el)return;if(el.scrollHeight>el.clientHeight+3){const h=Math.max(24,el.clientHeight*el.clientHeight/el.scrollHeight);const top=(el.scrollHeight-el.clientHeight)>0?el.scrollTop/(el.scrollHeight-el.clientHeight)*(el.clientHeight-h):0;setNoteBar(p=>(p.show&&Math.abs(p.h-h)<1&&Math.abs(p.top-top)<1)?p:{show:true,h,top});}else setNoteBar(p=>p.show?{show:false,h:0,top:0}:p);};
const renderNotes=()=>{
  const _nq=fold(noteSearch.trim());
  const _nf=notes.filter(n=>{if(noteFilter==="pinned"&&!n.pinned)return false;if(_nq&&!fold((n.title||"")+" "+(n.content||"")).includes(_nq))return false;return true;});
  const sorted=[..._nf].sort((a,b)=>(b.pinned?1:0)-(a.pinned?1:0));
  return(<div style={{display:"flex",flexDirection:"column",gap:10}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <span style={{fontWeight:700,fontSize:fs+2}}>📝 {t.notes}</span>
      <div style={{display:"flex",gap:6}}>
        <button onClick={()=>{setEditNote(null);setNoteDraw(true);}} aria-label={lang==="tr"?"Yeni çizim notu":TL("New drawing note",lang)} title={lang==="tr"?"Çizim notu":TL("Drawing note",lang)} style={{...BP,padding:"7px 12px",background:"transparent",color:acTx,border:`1px solid ${ac}`}}>✏️</button>
        <button onClick={()=>{const id=Date.now();setNotes(p=>[{id,title:"",content:"",color:"default",pinned:false},...p]);setEditNote(id);}} style={{...BP,padding:"7px 14px"}}>+ {t.nNote}</button>
      </div>
    </div>
    {notes.length>0&&<><div style={{display:"flex",gap:6,alignItems:"center"}}>
      <input value={noteSearch} onChange={e=>setNoteSearch(e.target.value)} placeholder={lang==="tr"?"🔍 Notlarda ara…":TL("🔍 Search notes…",lang)} style={{...IS,flex:1,padding:"7px 10px",fontSize:fs-1}}/>
      {noteSearch&&<button onClick={()=>setNoteSearch("")} aria-label="clear" style={{background:"none",border:"none",color:mt,cursor:"pointer",fontSize:16}}>✕</button>}
    </div>
    <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:2}}>{[["all",lang==="tr"?"Tümü":TL("All",lang)],["pinned",lang==="tr"?"📌 Sabitli":TL("📌 Pinned",lang)]].map(([k,l])=><button key={k} onClick={()=>setNoteFilter(k)} style={{flexShrink:0,padding:"5px 12px",borderRadius:16,border:`1px solid ${noteFilter===k?ac:bd}`,background:noteFilter===k?ac:"transparent",color:noteFilter===k?onAc:mt,fontSize:fs-2,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap"}}>{l}</button>)}</div></>}
    {sorted.length===0&&<div style={{textAlign:"center",color:mt,padding:24}}>{notes.length===0?t.noN:(lang==="tr"?"Eşleşen not yok":TL("No matching notes",lang))}</div>}
    <div style={{display:"flex",flexDirection:"column",gap:8}}>
      {sorted.map(n=>{
        const cbg=(n.bg&&noteBg(n.bg))?noteBg(n.bg):(noteColor(n.color)||(dark?"#12151c":"#ffffff"));
        const media=noteMedia[n.id]||[];
        return(<div key={n.id} style={{background:cbg,borderRadius:12,padding:12,border:"1px solid "+(dark?bd:"#0000001a"),width:"100%",maxWidth:"100%",boxSizing:"border-box",overflow:"hidden",position:"relative",display:"flex",flexDirection:"column",gap:6}}>
          {n.pinned&&<span style={{position:"absolute",top:6,right:8,fontSize:14}}>📌</span>}
          <div onClick={()=>{setEditNote(n.id);setNoteSheet(null);}} style={{cursor:"pointer",width:"100%",maxWidth:"100%",overflow:"hidden"}}>
            {n.title&&<div style={{fontWeight:700,marginBottom:4,color:dark?tc:"#1a1a1a",fontSize:fs+1,wordBreak:"break-word",overflowWrap:"anywhere"}}>{n.title}</div>}
            {n.checklist?<div style={{display:"flex",flexDirection:"column",gap:2}}>{n.checklist.slice(0,8).map(it=><div key={it.id} style={{display:"flex",alignItems:"center",gap:6,fontSize:fs,color:dark?mt:"#444"}}><span>{it.done?"☑️":"⬜"}</span><span style={{textDecoration:it.done?"line-through":"none",opacity:it.done?0.6:1,wordBreak:"break-word"}}>{it.text}</span></div>)}</div>:<div className="note-view" dangerouslySetInnerHTML={{__html:sanitizeHTML((n.content||"").trim())||(lang==="tr"?"Boş not":TL("Empty note",lang))}} style={{fontSize:fs,color:dark?mt:"#444",wordBreak:"break-word",overflowWrap:"anywhere",maxHeight:180,overflow:"hidden"}}/>}
            {(()=>{const pics=media.filter(m=>m.type!=="audio");const auds=media.length-pics.length;
              if(!media.length)return null;
              return <div style={{marginTop:n.title||n.content?8:0}}>
                {pics[0]&&<img alt="" src={pics[0].data} style={{width:"100%",maxHeight:200,objectFit:"contain",borderRadius:10,display:"block",background:dark?"#0d1520":"#f4f6f9"}}/>}
                {(pics.length>1||auds>0)&&<div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:6}}>
                  {pics.slice(1,4).map((m,mi)=><img key={mi} alt="" src={m.data} style={{width:48,height:48,objectFit:"cover",borderRadius:8,display:"block"}}/>)}
                  {auds>0&&<span style={{fontSize:fs-1}}>🎤</span>}
                </div>}
              </div>;})()}
            {(n.labels||[]).length>0&&<div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:6}}>{n.labels.map(l=><span key={l} style={{fontSize:fs-3,background:`${ac}22`,color:acTx,borderRadius:10,padding:"2px 8px"}}>🏷️ {l}</span>)}</div>}
          </div>
          <div style={{display:"flex",gap:6,marginTop:4,flexWrap:"wrap"}}>
            <button onClick={()=>{setEditNote(n.id);setNoteSheet(null);}} style={{background:`${ac}22`,border:"none",borderRadius:6,padding:"4px 10px",cursor:"pointer",fontSize:fs-2,color:acTx,fontWeight:600}}>✏️ {lang==="tr"?"Düzenle":TL("Edit",lang)}</button>
            <button onClick={()=>setNotes(p=>p.map(x=>x.id===n.id?{...x,pinned:!x.pinned}:x))} aria-label={lang==="tr"?"Sabitle":TL("Pin",lang)} style={{background:"none",border:"none",cursor:"pointer",fontSize:14,opacity:n.pinned?1:0.5}}>📌</button>
            <button onClick={()=>copyTxt((n.content||"").replace(/<[^>]+>/g,""))} aria-label={lang==="tr"?"Kopyala":TL("Copy",lang)} style={{background:"none",border:"none",cursor:"pointer",fontSize:14}}>📋</button>
            <SpeakBtn text={(n.content||"").replace(/<[^>]+>/g,"")}/>
            <button onClick={()=>toTrash("note",n)} aria-label={lang==="tr"?"Sil":TL("Delete",lang)} style={{background:"none",border:"none",cursor:"pointer",fontSize:14,color:dg,marginLeft:"auto"}}>🗑️</button>
          </div>
        </div>);
      })}
    </div>
    <div style={{fontWeight:700,marginTop:4}}>{t.extA}</div>
    <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{noteApps.map(a=><a key={a.name} href={a.url} target="_blank" rel="noopener noreferrer" style={{...CS,display:"flex",alignItems:"center",gap:6,textDecoration:"none",color:tc,padding:"8px 12px"}}><span style={{fontSize:18}}>{a.icon}</span><span style={{fontSize:fs-1}}>{a.name}</span></a>)}<button onClick={()=>setShowAddNApp(true)} style={{...CS,border:"2px dashed "+ac+"44",cursor:"pointer",padding:"8px 12px",color:acTx}}>+ {t.addApp}</button></div>
    {showAddNApp&&<div style={{...CS,border:"2px solid "+ac}}><input placeholder="App Name" value={newNApp.name} onChange={e=>setNewNApp({...newNApp,name:e.target.value})} style={{...IS,marginBottom:6}}/><input placeholder="https://..." value={newNApp.url} onChange={e=>setNewNApp({...newNApp,url:e.target.value})} style={{...IS,marginBottom:6}}/><div style={{display:"flex",gap:6}}><button onClick={()=>{if(newNApp.name&&newNApp.url){setNoteApps(p=>[...p,newNApp]);setNewNApp({name:"",url:"",icon:"📱"});setShowAddNApp(false);}}} style={BP}>{t.save}</button><button onClick={()=>setShowAddNApp(false)} style={{...BP,background:mt}}>{t.cancel}</button></div></div>}
  </div>);
};

const renderContacts=()=>{
  const filtered=catF==="all"?contacts:contacts.filter(c=>c.category===catF);
  const currentCC=COUNTRY_CODES.find(c=>c.code===newC.countryCode)||COUNTRY_CODES[0];
  const catOptions=[["doctor","👨‍⚕️",lang==="tr"?"Doktor":TL("Doctor",lang)],["taxi","🚕",lang==="tr"?"Taksi":TL("Taxi",lang)],["special","⭐",lang==="tr"?"Özel":TL("Special",lang)],["emergency","🚨",lang==="tr"?"Acil":TL("Emergency",lang)]];
  return(<div style={{display:"flex",flexDirection:"column",gap:10}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <span style={{fontWeight:700,fontSize:fs+2}}>📞 {t.contacts}</span>
      <button onClick={()=>{setEditContactId(null);setNewC(EMPTY_C);cDraftIdRef.current=null;setShowAddC(true);}} style={{...BP,padding:"7px 14px"}}>+ {t.add}</button>
    </div>
    <div style={{display:"flex",gap:6}}>{["all","doctor","taxi","special","emergency"].map(k=><button key={k} onClick={()=>setCatF(k)} style={pill(catF===k)}>{k==="all"?"🏠":k==="doctor"?"👨‍⚕️":k==="taxi"?"🚕":k==="special"?"⭐":"🚨"}</button>)}</div>
    <div style={{...CS,background:`${dg}08`,border:`1px solid ${dg}22`}}>
      <div style={{fontWeight:700,color:dg,marginBottom:6}}>🚨 {t.emN}</div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{emNums.slice(0,5).map(en=><a key={en.id} href={`tel:${en.number}`} style={{padding:"5px 10px",borderRadius:8,background:`${dg}15`,color:dg,fontWeight:700,textDecoration:"none",fontSize:fs}}>{en.icon} {en.number}</a>)}</div>
    </div>
    {filtered.length===0&&<div style={{textAlign:"center",color:mt,padding:20}}>{t.noC}</div>}
    {filtered.map(c=>(<div key={c.id} style={{...CS,display:"flex",alignItems:"center",gap:10}}>
      <div style={{width:40,height:40,borderRadius:"50%",background:`${ac}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:700,color:acTx,flexShrink:0}}>{c.name[0]}</div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontWeight:700,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{c.name}</div>
        <div style={{fontSize:fs-2,color:mt,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{c.phone}</div>
      </div>
      <a href={`tel:${(c.phone||"").replace(/[^\d+]/g,"")}`} title={lang==="tr"?"Ara":TL("Call",lang)} aria-label={lang==="tr"?"Ara":TL("Call",lang)} style={{display:"flex",alignItems:"center",justifyContent:"center",width:38,height:38,borderRadius:"50%",background:`linear-gradient(135deg,${sc},#1a7a6e)`,color:"#fff",textDecoration:"none",fontSize:18,flexShrink:0,boxShadow:"0 2px 6px rgba(0,0,0,.2)"}}>📞</a>
      <button onClick={()=>{
        // Edit — parse phone to countryCode + rest
        const parts=(c.phone||"").split(" ");
        const cc=parts[0]&&parts[0].startsWith("+")?parts[0]:"+90";
        const rest=parts[0]&&parts[0].startsWith("+")?parts.slice(1).join(" "):c.phone;
        setEditContactId(c.id);
        setNewC({name:c.name,phone:rest,countryCode:cc,category:c.category,note:c.note||""});
        setShowAddC(true);
      }} style={{background:"none",border:`1px solid ${ac}33`,borderRadius:8,padding:"4px 8px",cursor:"pointer",fontSize:14,color:acTx}}>✏️</button>
      <button onClick={()=>toTrash("contact",c)} style={{background:"none",border:"none",color:dg,cursor:"pointer",fontSize:14}}>🗑️</button>
    </div>))}
    {showAddC&&<div style={{...CS,border:`2px solid ${ac}`}}>
      <div style={{fontWeight:700,marginBottom:8,color:acTx}}>{editContactId?"✏️ "+(lang==="tr"?"Kişiyi Düzenle":TL("Edit Contact",lang)):"+ "+(lang==="tr"?"Yeni Kişi":TL("New Contact",lang))}</div>
      <input placeholder={t.nm} value={newC.name} onChange={e=>setNewC({...newC,name:e.target.value})} style={{...IS,marginBottom:6}}/>
      {/* CUSTOM COUNTRY PICKER - real flags */}
      <div style={{marginBottom:6,position:"relative"}}>
        <div style={{fontSize:fs-3,color:mt,marginBottom:3}}>🌍 {lang==="tr"?"Ülke":TL("Country",lang)}</div>
        <button type="button" onClick={()=>setShowCountryPicker(!showCountryPicker)} style={{...IS,width:"100%",padding:"9px 10px",display:"flex",alignItems:"center",gap:8,cursor:"pointer",background:dark?"#0d1520":"#f8fafc"}}>
          <Flag code={currentCC.flag} size={22}/>
          <span style={{flex:1,fontSize:fs-1,textAlign:"left",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{currentCC.n[lang]||currentCC.n.en}</span>
          <span style={{color:acTx,fontWeight:700,fontSize:fs-2}}>{currentCC.code}</span>
          <span style={{color:mt,fontSize:fs-2}}>▾</span>
        </button>
        {showCountryPicker&&<>
          <div onClick={()=>setShowCountryPicker(false)} style={{position:"fixed",inset:0,zIndex:100}}/>
          <div style={{position:"absolute",top:"100%",left:0,right:0,marginTop:4,background:cd,border:`1px solid ${ac}`,borderRadius:10,maxHeight:280,overflowY:"auto",zIndex:101,boxShadow:"0 8px 24px rgba(0,0,0,.3)"}}>
            {COUNTRY_CODES.map((cc,i)=><button type="button" key={cc.code+cc.flag+i} onClick={()=>{setNewC({...newC,countryCode:cc.code,_ccIdx:i});setShowCountryPicker(false);}} style={{display:"flex",alignItems:"center",gap:8,width:"100%",padding:"9px 12px",background:(newC._ccIdx!==undefined?newC._ccIdx===i:newC.countryCode===cc.code)?`${ac}15`:"transparent",border:"none",borderBottom:`1px solid ${bd}`,cursor:"pointer",color:tc,fontSize:fs-1,textAlign:"left"}}>
              <Flag code={cc.flag} size={22}/>
              <span style={{flex:1,fontWeight:newC.countryCode===cc.code?700:400,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{cc.n[lang]||cc.n.en}</span>
              <span style={{color:acTx,fontWeight:700,fontSize:fs-2}}>{cc.code}</span>
            </button>)}
          </div>
        </>}
      </div>
      {/* Phone row - code + number */}
      <div style={{marginBottom:6}}>
        <div style={{fontSize:fs-3,color:mt,marginBottom:3}}>📞 {lang==="tr"?"Telefon Numarası":TL("Phone Number",lang)}</div>
        <div style={{display:"flex",gap:4,alignItems:"stretch"}}>
          <div style={{...IS,flex:"0 0 70px",textAlign:"center",fontWeight:700,padding:"9px 4px",color:acTx,background:dark?"#0d1520":"#eef2f7",display:"flex",alignItems:"center",justifyContent:"center"}}>{newC.countryCode}</div>
          <input placeholder="5XX XXX XXXX" value={newC.phone} onChange={e=>setNewC({...newC,phone:e.target.value.replace(/[^0-9\s]/g,"")})} type="tel" inputMode="numeric" style={{...IS,flex:1,letterSpacing:1,minWidth:0}}/>
        </div>
      </div>
      <select value={newC.category} onChange={e=>setNewC({...newC,category:e.target.value})} style={{...IS,marginBottom:6}}>
        {catOptions.map(([k,ic,lb])=><option key={k} value={k}>{ic} {lb}</option>)}
      </select>
      <div style={{display:"flex",gap:6}}>
        <button onClick={()=>{cDraftIdRef.current=null;setNewC(EMPTY_C);setEditContactId(null);setShowAddC(false);}} style={BP}>{lang==="tr"?"Bitti":TL("Done",lang)}</button><button onClick={()=>{if(!editContactId&&cDraftIdRef.current!=null){const id=cDraftIdRef.current;setContacts(p=>p.filter(x=>x.id!==id));}cDraftIdRef.current=null;setNewC(EMPTY_C);setEditContactId(null);setShowAddC(false);}} style={{...BP,background:mt}}>{t.cancel}</button>
      </div>
    </div>}
  </div>);
};

const createGroup=()=>{
  const nm=(newGroup.name||"").trim();
  if(!nm){notify(lang==="tr"?"Grup adı girin":TL("Enter a group name",lang));return;}
  setGroups(p=>[{id:Date.now(),name:nm,emoji:newGroup.emoji||"👥",members:newGroup.members||[],createdAt:new Date().toISOString()},...p]);
  setShowGroupModal(false);setNewGroup({name:"",emoji:"👥",members:[]});
  notify(lang==="tr"?"✅ Grup oluşturuldu":TL("✅ Group created",lang));
};
const deleteGroup=(g)=>{toTrash("group",g);notify(lang==="tr"?"Çöp kutusuna taşındı":TL("Moved to Trash",lang));};
const startCall=async(type,group)=>{
  setCallModal({type,group,status:"requesting"});
  try{
    if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){setCallModal({type,group,status:"ready"});return;}
    const stream=await navigator.mediaDevices.getUserMedia({audio:true,video:type!=="voice"});
    stream.getTracks().forEach(tr=>tr.stop()); // readiness check only — no signaling backend yet
    setCallModal({type,group,status:"ready"});
  }catch(e){setCallModal({type,group,status:"denied"});}
};
const postCommunityMsg=()=>{const txt=msgIn.trim();if(!txt)return;if(maskProfanity(txt)!==txt&&!window.confirm(lang==="tr"?"⚠️ Mesajınız uygunsuz ifade içeriyor.\nDiğer kullanıcılara maskelenerek gösterilecek. Yine de gönderilsin mi?":"⚠️ Your message contains inappropriate language and will be masked for others. Post anyway?"))return;setMsgs(p=>[...p,{id:Date.now(),user:pat.name||"Ben",text:txt,likes:0,time:now.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}]);setMsgIn("");};
const renderCommunity=()=>{const me=pat.name||"Ben";const q=fold(commSearch.trim());const fmsgs=msgs.filter(m=>{if((reportedMsgs||[]).includes(m.id))return false;if((blockedUsers||[]).includes(m.user))return false;if(commFilter==="mine"&&m.user!==me)return false;if(commFilter==="liked"&&!(m.likedBy||[]).includes(me))return false;if(q&&!fold((m.text||"")+" "+(m.user||"")).includes(q))return false;return true;});return(<div style={{display:"flex",flexDirection:"column",gap:8,height:"100%"}}>
  <div style={{display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
    <div style={{width:36,height:36,borderRadius:12,background:`linear-gradient(135deg,${ac},${a2})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>👥</div>
    <div style={{flex:1,minWidth:0}}>
      <div style={{fontWeight:700,fontSize:fs+1}}>{t.community}</div>
      <div style={{fontSize:fs-3,color:dg}}>{t.warn}</div>
    </div>
  </div>
  <div style={{flexShrink:0}}>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}>
      <span style={{fontWeight:700,fontSize:fs-1}}>{lang==="tr"?"Gruplar":TL("Groups",lang)}</span>
      <button onClick={()=>{setNewGroup({name:"",emoji:"👥",members:[]});setShowGroupModal(true);}} style={{...BP,padding:"5px 10px",fontSize:fs-2}}>+ {lang==="tr"?"Grup Oluştur":TL("Create Group",lang)}</button>
    </div>
    {groups.length===0
      ? <div style={{fontSize:fs-3,color:mt,padding:"2px 0"}}>{lang==="tr"?"Henüz grup yok. WhatsApp gibi grup kurup sesli/görüntülü/konferans araması başlatabilirsin.":TL("No groups yet. Create one and start voice/video/conference calls like WhatsApp.",lang)}</div>
      : <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:4}}>{groups.map(g=>
          <div key={g.id} style={{flexShrink:0,minWidth:152,border:`1px solid ${bd}`,borderRadius:12,padding:"8px 10px",background:cd}}>
            <div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:18}}>{g.emoji}</span><span style={{fontWeight:700,fontSize:fs-1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{g.name}</span></div>
            <div style={{fontSize:fs-4,color:mt,marginBottom:6}}>{(g.members||[]).length} {lang==="tr"?"üye":TL("members",lang)}</div>
            <div style={{display:"flex",gap:6,alignItems:"center"}}>
              <button onClick={()=>startCall("voice",g)} aria-label={lang==="tr"?"Sesli arama":TL("Voice call",lang)} title={lang==="tr"?"Sesli":TL("Voice",lang)} style={{...BP,padding:"5px 8px",fontSize:14,background:`linear-gradient(135deg,${sc},#1a7a6e)`}}>📞</button>
              <button onClick={()=>startCall("video",g)} aria-label={lang==="tr"?"Görüntülü arama":TL("Video call",lang)} title={lang==="tr"?"Görüntülü":TL("Video",lang)} style={{...BP,padding:"5px 8px",fontSize:14}}>📹</button>
              <button onClick={()=>startCall("conf",g)} aria-label={lang==="tr"?"Konferans araması":TL("Conference call",lang)} title={lang==="tr"?"Konferans":TL("Conference",lang)} style={{...BP,padding:"5px 8px",fontSize:14,background:ac}}>👥</button>
              <button onClick={()=>deleteGroup(g)} style={{background:"none",border:"none",color:dg,cursor:"pointer",fontSize:14,marginLeft:"auto"}}>🗑️</button>
            </div>
          </div>)}</div>}
  </div>
  <div style={{display:"flex",gap:6,flexShrink:0,alignItems:"center"}}>
    <input value={commSearch} onChange={e=>setCommSearch(e.target.value)} placeholder={lang==="tr"?"🔍 Mesajlarda ara…":TL("🔍 Search messages…",lang)} style={{...IS,flex:1,padding:"7px 10px",fontSize:fs-1}}/>
    {commSearch&&<button onClick={()=>setCommSearch("")} aria-label="clear" style={{background:"none",border:"none",color:mt,cursor:"pointer",fontSize:16}}>✕</button>}
  </div>
  <div style={{display:"flex",gap:6,flexShrink:0,overflowX:"auto",paddingBottom:2}}>{[["all",lang==="tr"?"Tümü":TL("All",lang)],["mine",lang==="tr"?"Benim":TL("Mine",lang)],["liked",lang==="tr"?"❤️ Beğendiklerim":TL("❤️ Liked",lang)]].map(([k,l])=><button key={k} onClick={()=>setCommFilter(k)} style={{flexShrink:0,padding:"5px 12px",borderRadius:16,border:`1px solid ${commFilter===k?ac:bd}`,background:commFilter===k?ac:"transparent",color:commFilter===k?onAc:mt,fontSize:fs-2,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap"}}>{l}</button>)}</div>
  {blockedUsers.length>0&&<div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center",flexShrink:0}}><span style={{fontSize:fs-3,color:mt}}>🚫 {lang==="tr"?"Engelli":TL("Blocked",lang)}:</span>{blockedUsers.map(u=><button key={u} onClick={()=>setBlockedUsers(p=>p.filter(x=>x!==u))} title={lang==="tr"?"Engeli kaldır":TL("Unblock",lang)} style={{fontSize:fs-3,padding:"3px 8px",borderRadius:12,border:`1px solid ${bd}`,background:"transparent",color:mt,cursor:"pointer"}}>{u} ✕</button>)}</div>}
  <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:8,minHeight:180}}>
    {msgs.length===0&&<div style={{...CS,textAlign:"center",padding:20,color:mt}}>{lang==="tr"?"Henüz mesaj yok":TL("No messages yet",lang)}</div>}
    {msgs.length>0&&fmsgs.length===0&&<div style={{...CS,textAlign:"center",padding:20,color:mt}}>{lang==="tr"?"Eşleşen mesaj yok":TL("No matching messages",lang)}</div>}
    {fmsgs.map(m=>{
      const isMine=m.user===(pat.name||"Ben");
      return(<div key={m.id} className="msg-card" style={{...CS,maxWidth:"85%",alignSelf:isMine?"flex-end":"flex-start",background:isMine?`linear-gradient(135deg,${ac},${a2})`:cd,color:isMine?"#fff":tc,animation:"slideD .3s"}}>
        {!isMine&&<div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}><span style={{fontWeight:700,color:acTx,fontSize:fs-2}}>{m.user}</span><span style={{fontSize:fs-3,color:mt}}>{m.time}</span></div>}
        <div style={{whiteSpace:"pre-wrap",wordBreak:"break-word",overflowWrap:"anywhere",fontSize:fs}}>{profanityFilter?maskProfanity(m.text):m.text}{m.edited&&<span style={{fontSize:fs-4,color:isMine?"rgba(255,255,255,.6)":mt,marginLeft:4}}>({lang==="tr"?"düzenlendi":TL("edited",lang)})</span>}</div>
        <div style={{display:"flex",gap:4,marginTop:4,flexWrap:"wrap"}}>
          <button onClick={()=>{
            const me=pat.name||"Ben";
            setMsgs(p=>p.map(x=>{if(x.id!==m.id)return x;const arr=x.likedBy||[];const has=arr.includes(me);return{...x,likedBy:has?arr.filter(u=>u!==me):[...arr,me],likes:has?Math.max(0,(x.likes||0)-1):(x.likes||0)+1};}));
          }} style={{background:(m.likedBy||[]).includes(pat.name||"Ben")?(isMine?"rgba(255,255,255,.3)":`${dg}22`):(isMine?"rgba(255,255,255,.15)":"none"),border:`1px solid ${isMine?"rgba(255,255,255,.3)":bd}`,borderRadius:6,padding:"3px 8px",cursor:"pointer",fontSize:fs-3,color:(m.likedBy||[]).includes(pat.name||"Ben")?(isMine?"#fff":dg):(isMine?"#fff":tc),fontWeight:(m.likedBy||[]).includes(pat.name||"Ben")?700:400}}>{(m.likedBy||[]).includes(pat.name||"Ben")?"❤️":"🤍"} {m.likes||0}</button>
          <button onClick={()=>copyTxt(m.text)} style={{background:"none",border:`1px solid ${isMine?"rgba(255,255,255,.3)":bd}`,borderRadius:6,padding:"3px 8px",cursor:"pointer",fontSize:fs-3,color:isMine?"#fff":tc}}>📋</button>
          {!isMine&&<SpeakBtn text={m.text}/>}
          {!isMine&&<>
            <button onClick={()=>{if(window.confirm(lang==="tr"?"Bu mesajı şikâyet et? Senin görünümünden gizlenecek.":TL("Report this message? It will be hidden from your view.",lang))){setReportedMsgs(p=>p.includes(m.id)?p:[...p,m.id]);notify(lang==="tr"?"🚩 Mesaj şikâyet edildi ve gizlendi":TL("🚩 Reported and hidden",lang));}}} title={lang==="tr"?"Şikâyet et":TL("Report",lang)} style={{background:"none",border:`1px solid ${bd}`,borderRadius:6,padding:"3px 8px",cursor:"pointer",fontSize:fs-3,color:mt}}>🚩</button>
            <button onClick={()=>{if(window.confirm(lang==="tr"?("@"+m.user+" engellensin mi? Tüm mesajları gizlenecek."):("Block @"+m.user+"? All their messages will be hidden."))){setBlockedUsers(p=>p.includes(m.user)?p:[...p,m.user]);notify(lang==="tr"?("🚫 "+m.user+" engellendi"):("🚫 "+m.user+" blocked"));}}} title={lang==="tr"?"Engelle":TL("Block",lang)} style={{background:"none",border:`1px solid ${bd}`,borderRadius:6,padding:"3px 8px",cursor:"pointer",fontSize:fs-3,color:mt}}>🚫</button>
          </>}
          {isMine&&<>
            <button onClick={()=>{const nv=prompt(lang==="tr"?"Mesajı düzenle:":TL("Edit message:",lang),m.text);if(nv!==null&&nv.trim())setMsgs(p=>p.map(x=>x.id===m.id?{...x,text:nv,edited:true}:x));}} style={{background:"none",border:"1px solid rgba(255,255,255,.3)",borderRadius:6,padding:"3px 8px",cursor:"pointer",fontSize:fs-3,color:"#fff"}}>✏️</button>
            <button onClick={()=>{toTrash("message",m);notify(lang==="tr"?"Çöp kutusuna taşındı":TL("Moved to Trash",lang));}} style={{background:"none",border:"1px solid rgba(255,255,255,.3)",borderRadius:6,padding:"3px 8px",cursor:"pointer",fontSize:fs-3,color:"#fff"}}>🗑️</button>
          </>}
        </div>
        {isMine&&<div style={{fontSize:fs-3,color:"rgba(255,255,255,.7)",marginTop:3,textAlign:"right"}}>{m.time}</div>}
      </div>);
    })}
  </div>
  <div style={{display:"flex",gap:6,flexShrink:0,position:"relative",alignItems:"flex-end"}}>
    <MicBtn onResult={v=>setMsgIn(v)} currentValue={msgIn}/>
    <button onClick={()=>setShowEmoji(!showEmoji)} aria-label="Emoji" style={{...BP,padding:"8px 12px",fontSize:18,flexShrink:0}}>😊</button>
    <textarea value={msgIn} onChange={e=>setMsgIn(e.target.value)} onInput={autoResize} placeholder={t.wr} style={{...IS,flex:1,minHeight:38,maxHeight:150,resize:"none",overflowY:"auto",wordBreak:"break-word",overflowWrap:"anywhere"}} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();postCommunityMsg();}}}/>
    <button onClick={postCommunityMsg} style={{...BP,flexShrink:0}}>{t.send}</button>
    {showEmoji&&<EmojiPicker onPick={e=>setMsgIn(p=>p+e)} onClose={()=>setShowEmoji(false)}/>}
  </div>
  {showGroupModal&&<div style={{position:"fixed",inset:0,zIndex:350,background:"rgba(0,0,0,.55)",display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={()=>setShowGroupModal(false)}>
    <div onClick={e=>e.stopPropagation()} style={{background:cd,width:"100%",maxWidth:400,borderRadius:16,padding:18,border:`1px solid ${ac}`,maxHeight:"85vh",overflowY:"auto"}}>
      <div style={{fontWeight:700,fontSize:fs+2,marginBottom:12}}>👥 {lang==="tr"?"Grup Oluştur":TL("Create Group",lang)}</div>
      <div style={{display:"flex",gap:8,marginBottom:10}}>
        <select value={newGroup.emoji} onChange={e=>setNewGroup(g=>({...g,emoji:e.target.value}))} style={{...IS,width:64,fontSize:18}}>{["👥","👨‍👩‍👧","💊","🏥","❤️","🧑‍⚕️","🌸","👴","👪"].map(em=><option key={em} value={em}>{em}</option>)}</select>
        <input value={newGroup.name} onChange={e=>setNewGroup(g=>({...g,name:e.target.value}))} placeholder={lang==="tr"?"Grup adı":TL("Group name",lang)} style={{...IS,flex:1}}/>
      </div>
      <div style={{fontSize:fs-2,color:mt,marginBottom:6}}>{lang==="tr"?"Üyeler (rehberden seç)":TL("Members (from contacts)",lang)}</div>
      <div style={{maxHeight:180,overflowY:"auto",marginBottom:12}}>
        {contacts.length===0&&<div style={{fontSize:fs-3,color:mt}}>{lang==="tr"?"Rehberde kişi yok — önce Rehber'e kişi ekleyin":TL("No contacts — add contacts first",lang)}</div>}
        {contacts.map(c=>{const sel=(newGroup.members||[]).includes(c.id);return <div key={c.id} onClick={()=>setNewGroup(g=>({...g,members:sel?g.members.filter(id=>id!==c.id):[...(g.members||[]),c.id]}))} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 8px",borderRadius:8,cursor:"pointer",background:sel?`${ac}18`:"transparent",marginBottom:2}}>
          <span style={{width:18,height:18,borderRadius:4,border:`1px solid ${sel?ac:bd}`,background:sel?ac:"transparent",color:"#fff",fontSize:12,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{sel?"✓":""}</span>
          <span style={{fontSize:fs-1,fontWeight:600}}>{c.name}</span><span style={{fontSize:fs-3,color:mt,marginLeft:"auto"}}>{c.phone}</span>
        </div>;})}
      </div>
      <div style={{display:"flex",gap:8}}>
        <button onClick={()=>setShowGroupModal(false)} style={{...BP,flex:1,background:"transparent",border:`1px solid ${bd}`,color:mt}}>{t.cancel}</button>
        <button onClick={createGroup} style={{...BP,flex:1}}>{lang==="tr"?"Oluştur":TL("Create",lang)}</button>
      </div>
    </div>
  </div>}
  {callModal&&<div style={{position:"fixed",inset:0,zIndex:351,background:"rgba(0,0,0,.6)",display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={()=>setCallModal(null)}>
    <div onClick={e=>e.stopPropagation()} style={{background:cd,width:"100%",maxWidth:360,borderRadius:16,padding:20,border:`1px solid ${ac}`,textAlign:"center"}}>
      <div style={{fontSize:40,marginBottom:8}}>{callModal.type==="voice"?"📞":callModal.type==="video"?"📹":"👥"}</div>
      <div style={{fontWeight:700,fontSize:fs+1,marginBottom:6}}>{callModal.group?.emoji} {callModal.group?.name} · {callModal.type==="voice"?(lang==="tr"?"Sesli":TL("Voice",lang)):callModal.type==="video"?(lang==="tr"?"Görüntülü":TL("Video",lang)):(lang==="tr"?"Konferans":TL("Conference",lang))}</div>
      {callModal.status==="requesting"&&<div style={{color:mt,fontSize:fs-1}}>{lang==="tr"?"Kamera/mikrofon izni isteniyor...":TL("Requesting camera/microphone...",lang)}</div>}
      {callModal.status==="denied"&&<div style={{color:dg,fontSize:fs-1,lineHeight:1.5}}>{lang==="tr"?"Görüşme için kamera/mikrofon izni gerekli. Tarayıcı ayarlarından izin verip tekrar deneyin.":TL("Camera/microphone permission is required. Allow it in browser settings and try again.",lang)}</div>}
      {callModal.status==="ready"&&<><div style={{color:sc,fontWeight:600,fontSize:fs}}>✓ {lang==="tr"?"Cihazın hazır (kamera/mikrofon erişimi verildi)":TL("Your device is ready",lang)}</div>
        <div style={{fontSize:fs-2,color:mt,marginTop:8,lineHeight:1.5}}>{lang==="tr"?"Gerçek zamanlı internet görüşmesi için güvenli bir görüşme sunucusu (WebRTC sinyal + TURN; konferans için medya sunucusu) gerekiyor. Bu altyapı kurulduğunda arama tam buradan başlayacak.":TL("A real-time call needs a secure server (WebRTC signaling + TURN; a media server for conference). Once it's set up, the call starts right here.",lang)}</div>
        <div style={{fontSize:fs-3,color:mt,marginTop:8,padding:"3px 10px",borderRadius:8,background:`${mt}22`,display:"inline-block"}}>{lang==="tr"?"Yakında":TL("Coming soon",lang)}</div></>}
      <button onClick={()=>setCallModal(null)} style={{...BP,width:"100%",marginTop:16}}>{lang==="tr"?"Kapat":TL("Close",lang)}</button>
    </div>
  </div>}
</div>);};

const q1Dynamic=pat.name?`${pat.name.split(" ")[0]}, ${t.q1.toLowerCase()} ${lang==="tr"?"Umarım iyisindir 💙":TL("Hope you are well 💙",lang)}`:t.q1;
const renderChat=()=>(<div style={{display:"flex",flexDirection:"column",gap:8,flex:"1 1 0",minHeight:0,height:0,position:"relative"}}>
  {voiceActive&&(()=>{
    const label=isSpeak?(lang==="tr"?"konuşuyor…":TL("speaking…",lang)):isListen?(lang==="tr"?"dinliyor…":TL("listening…",lang)):chatThinking?(lang==="tr"?"düşünüyor…":TL("thinking…",lang)):(lang==="tr"?"hazır":TL("ready",lang));
    const ringC=isListen?ac:isSpeak?"#34c3a3":chatThinking?"#e9a23b":ac;
    return <div style={{flexShrink:0,position:"relative",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
      height:"42vh",minHeight:230,borderRadius:20,marginBottom:4,overflow:"hidden",
      background:dark?"radial-gradient(120% 90% at 50% 22%, #17324a 0%, #0d1a26 70%)":"radial-gradient(120% 90% at 50% 22%, #d9f1fb 0%, #eef6fb 72%)",
      border:`1px solid ${bd}`}}>
      {/* close voice mode */}
      <button onClick={()=>stopVoiceMode()} aria-label={lang==="tr"?"Sesli sohbeti kapat":TL("Close voice chat",lang)}
        style={{position:"absolute",top:8,right:10,zIndex:2,background:"rgba(0,0,0,.28)",color:"#fff",border:"none",borderRadius:"50%",width:30,height:30,fontSize:16,cursor:"pointer",lineHeight:1}}>✕</button>
      {/* animated pulse ring behind the face while active */}
      <div style={{position:"absolute",width:220,height:220,borderRadius:"50%",border:`2px solid ${ringC}`,opacity:0.35,
        animation:(isSpeak||isListen)?"aiPulse 1.8s ease-out infinite":"none"}}/>
      <div style={{width:"min(58vw,200px)",height:"min(58vw,200px)",filter:`drop-shadow(0 6px 18px ${ringC}55)`}}>
        <AILVIEFace state={faceState} dark={dark}/>
      </div>
      <div style={{marginTop:2,display:"flex",alignItems:"center",gap:8}}>
        <span style={{fontWeight:800,fontSize:fs+2,color:"#e8a817",letterSpacing:0.5,WebkitTextStroke:dark?"0.4px #00000055":"0"}}>AILVIE</span>
        <span style={{fontSize:fs-2,color:mt}}>· {label}</span>
      </div>
      {/* mic / stop control */}
      <button onClick={()=>{ if(isListen){ if(recRef.current){try{recRef.current.onend=null;recRef.current.abort();}catch(e){} recRef.current=null;setIsListen(false);} } else if(!isSpeak){ startVoice((txt)=>sendChat(txt),true); } }}
        aria-label={isListen?(lang==="tr"?"Dinlemeyi durdur":TL("Stop listening",lang)):(lang==="tr"?"Konuş":TL("Speak",lang))}
        style={{marginTop:8,display:"flex",alignItems:"center",gap:8,background:isListen?`${dg}`:BP.background,color:"#fff",border:"none",borderRadius:22,padding:"9px 18px",fontSize:fs,cursor:"pointer",boxShadow:`0 4px 14px ${ringC}44`}}>
        <span style={{fontSize:18}}>{isListen?"⏹️":"🎤"}</span>
        <span>{isListen?(lang==="tr"?"Durdur":TL("Stop",lang)):isSpeak?(lang==="tr"?"…":TL("…",lang)):(lang==="tr"?"Konuş":TL("Speak",lang))}</span>
      </button>
    </div>;
  })()}
  {chatM.length>2&&<div style={{display:"flex",gap:6,flexShrink:0,alignItems:"center"}}><input value={chatSearch} onChange={e=>setChatSearch(e.target.value)} placeholder={lang==="tr"?"🔍 Sohbette ara…":TL("🔍 Search chat…",lang)} style={{...IS,flex:1,padding:"6px 10px",fontSize:fs-2}}/>{chatSearch&&<button onClick={()=>setChatSearch("")} aria-label="clear" style={{background:"none",border:"none",color:mt,cursor:"pointer",fontSize:15}}>✕</button>}</div>}
  <div style={{display:"flex",gap:6,overflowX:"auto",flexShrink:0,alignItems:"center"}}>{[q1Dynamic,t.q2,t.q3].map(q=><button key={q} onClick={()=>sendChat(q)} style={pill(false)}>{q}</button>)}<button onClick={()=>sendChat(lang==="tr"?"Nabzımı ölçmek istiyorum":TL("I want to measure my pulse",lang))} style={{...pill(false),whiteSpace:"nowrap"}}>❤️ {lang==="tr"?"Nabzımı ölç":TL("Measure pulse",lang)}</button>{chatM.length>0&&<button onClick={()=>{if(confirm(lang==="tr"?"Tüm sohbet geçmişi silinsin mi?":TL("Clear all chat history?",lang)))setChatM([]);}} style={{...pill(false),marginLeft:"auto",flexShrink:0,color:dg,borderColor:dg+"44",whiteSpace:"nowrap"}}>🗑️ {lang==="tr"?"Temizle":TL("Clear",lang)}</button>}</div>
  {(()=>{
    if(chatNudgeOff)return null;
    const nowMin=new Date().getHours()*60+new Date().getMinutes();
    const overdue=meds.filter(m=>!m.taken&&m.time).filter(m=>{const[h,mm]=(m.time||"00:00").split(":").map(Number);return (h*60+mm)<nowMin;}).sort((a,b)=>((a.time||"")<(b.time||"")?-1:1));
    if(!overdue.length)return null;
    const m0=overdue[0];const[h,mm]=(m0.time||"00:00").split(":").map(Number);const lateMin=nowMin-(h*60+mm);const lateTxt=lateMin>=60?`${Math.floor(lateMin/60)} ${lang==="tr"?"saat":TL("h",lang)}`:`${lateMin} ${lang==="tr"?"dk":TL("min",lang)}`;
    return <div style={{flexShrink:0,display:"flex",alignItems:"center",gap:8,padding:"8px 10px",borderRadius:10,background:`${ac}12`,border:`1px solid ${ac}55`}}>
      <span style={{fontSize:18}}>⏰</span>
      <div style={{flex:1,minWidth:0,fontSize:fs-1}}>{lang==="tr"?<>Bu arada <b>{m0.name}</b> ilacın {lateTxt} gecikmiş{overdue.length>1?` (+${overdue.length-1})`:""} — aldın mı?</>:<>By the way, your <b>{m0.name}</b> is {lateTxt} late{overdue.length>1?` (+${overdue.length-1})`:""} — taken it?</>}</div>
      <button onClick={()=>{setMeds(p=>p.map(x=>x.id===m0.id?{...x,taken:true}:x));notify(lang==="tr"?`✓ ${m0.name} alındı olarak işaretlendi`:`✓ ${m0.name} marked as taken`);}} style={{...BP,padding:"5px 10px",fontSize:fs-2,flexShrink:0,background:`linear-gradient(135deg,${sc},#1a7a6e)`}}>✓ {lang==="tr"?"Aldım":TL("Took it",lang)}</button>
      <button onClick={()=>setChatNudgeOff(true)} style={{background:"none",border:"none",color:mt,fontSize:fs+4,cursor:"pointer",lineHeight:1,padding:"0 2px",flexShrink:0}}>×</button>
    </div>;
  })()}
  <div className="chat-scroll" style={{flex:"1 1 0",minHeight:0,height:0,overflowY:"auto",overflowX:"hidden",display:"flex",flexDirection:"column",gap:8,WebkitOverflowScrolling:"touch",scrollbarWidth:"thin",scrollbarColor:`${ac}66 transparent`}}>
    {chatM.length===0&&<div style={{...CS,background:`${ac}08`,textAlign:"center",padding:20}}><Avatar s={48}/><div style={{marginTop:8}}>{t.greet}</div></div>}
    {chatSearch.trim()&&!chatM.some(m=>fold(m.text||"").includes(fold(chatSearch.trim())))&&<div style={{...CS,textAlign:"center",padding:16,color:mt}}>{lang==="tr"?"Eşleşen mesaj yok":TL("No matching messages",lang)}</div>}
    {(chatSearch.trim()?chatM.filter(m=>fold(m.text||"").includes(fold(chatSearch.trim()))):chatM).map((m,i)=>(<div key={i} className="msg-card" style={{...CS,padding:"8px 11px",borderRadius:12,flexShrink:0,maxWidth:"85%",alignSelf:m.role==="user"?"flex-end":"flex-start",background:m.role==="user"?`linear-gradient(135deg,${ac},${a2})`:cd,color:m.role==="user"?"#fff":tc,animation:i===chatM.length-1?"slideD .3s":"none"}}>
      {m.role==="assistant"&&<div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}><Avatar s={22}/><span style={{fontSize:fs-2,color:acTx,fontWeight:700}}>AILVIE</span></div>}
      <div style={{wordBreak:"break-word",overflowWrap:"anywhere",fontSize:fs}}>{m.role==="assistant"?<MD text={m.text}/>:<span style={{whiteSpace:"pre-wrap"}}>{m.text}</span>}</div>
      <div style={{display:"flex",gap:4,marginTop:6,flexWrap:"wrap"}}>
        {m.role==="assistant"&&<>
          {m.error&&m.retry&&<button onClick={()=>{setChatM(p=>p.filter((_,j)=>j!==i&&j!==i-1));sendChat(m.retry);}} style={{background:ac+"1e",border:`1px solid ${ac}`,borderRadius:6,padding:"3px 10px",cursor:"pointer",fontSize:fs-3,color:acTx,fontWeight:600}}>🔄 {lang==="tr"?"Tekrar dene":TL("Retry",lang)}</button>}
          <button onClick={()=>copyTxt(m.text)} style={{background:"none",border:`1px solid ${bd}`,borderRadius:6,padding:"3px 8px",cursor:"pointer",fontSize:fs-3,color:tc}}>📋</button>
          <SpeakBtn text={m.text} langCode={lang}/>
        </>}
        <button onClick={()=>setChatM(p=>p.filter((_,j)=>j!==i))} style={{background:"none",border:`1px solid ${m.role==="user"?"rgba(255,255,255,.3)":dg+"33"}`,borderRadius:6,padding:"3px 8px",cursor:"pointer",fontSize:fs-3,color:m.role==="user"?"#fff":dg}}>🗑️</button>
      </div>
    </div>))}
    {chatL&&<div style={{...CS,alignSelf:"flex-start"}}><span style={{animation:"pulse 1s infinite"}}>● </span><span style={{animation:"pulse 1s infinite .2s"}}>● </span><span style={{animation:"pulse 1s infinite .4s"}}>●</span></div>}
    <div ref={chatEndRef}/>
  </div>
  <div style={{display:"flex",gap:6,flexShrink:0,position:"relative",alignItems:"flex-end"}}>
    <MicBtn onResult={v=>setChatIn(v)} currentValue={chatIn}/>
    <button onClick={()=>setShowEmoji(!showEmoji)} aria-label="Emoji" style={{...BP,padding:"8px 12px",fontSize:18,flexShrink:0}}>😊</button>
    <textarea value={chatIn} onChange={e=>setChatIn(e.target.value)} onInput={autoResize} placeholder={t.wr} style={{...IS,flex:1,minHeight:38,maxHeight:150,resize:"none",overflowY:"auto",wordBreak:"break-word",overflowWrap:"anywhere"}} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendChat();}}}/>
    <button onClick={()=>sendChat()} disabled={chatL} style={{...BP,flexShrink:0}}>{t.send}</button>
    {showEmoji&&<EmojiPicker onPick={e=>setChatIn(p=>p+e)} onClose={()=>setShowEmoji(false)}/>}
  </div>
</div>);

// Privacy Policy page
const renderPrivacy=()=>(<div style={{display:"flex",flexDirection:"column",gap:10}}>
  <div style={{display:"flex",alignItems:"center",gap:8}}><button onClick={()=>goTo("settings")} style={{background:"none",border:"none",color:acTx,cursor:"pointer",fontSize:20}}>←</button><span style={{fontWeight:700,fontSize:fs+2}}>📜 {t.privPolicy}</span></div>
  <div style={CS}><div style={{fontSize:fs-1,color:tc,lineHeight:1.6}}>
    <p style={{marginBottom:8}}><strong>AILVIE {t.privPolicy}</strong></p>
    <p style={{marginBottom:8}}>{lang==="tr"?"AILVIE'de sağlık verileriniz cihazınızda saklanır — sunucularımızda bir kopyası tutulmaz. PIN açıkken veriler cihazda AES-256 ile şifrelenir. Senkronizasyon isteğe bağlıdır ve açtığınızda veri cihazınızda şifrelenip öyle gönderilir; sunucu yalnızca şifreli metni görür, içeriğini okuyamaz.":TL("In AILVIE your health data is stored on your device — we keep no copy on our servers. With a PIN on, it is encrypted on the device with AES-256. Sync is optional; when you turn it on, data is encrypted on your device before it is sent, so the server only ever sees ciphertext and cannot read it.",lang)}</p>
    <p style={{marginBottom:8}}>{lang==="tr"?"Bazı özellikler çalışmak için dış servislere veri gönderir — bunu açıkça belirtmek isteriz:\n• AI sohbeti / görüntü yorumu / ilaç analizi: sorunuz, ilgili sağlık profiliniz (ör. yaş, ilaçlar, alerjiler, kronik hastalıklar) ve — hafıza açıksa — AILVIE’nin önceki konuşmalarınızdan öğrendiği notlar, yanıtı üretmek için AI sağlayıcıya (Anthropic) gönderilir. Hafızayı Ayarlar’dan kapatabilir, notları tek tek veya toplu silebilirsiniz.\n• Çeviri: çevrilecek metin çeviri servisine gönderilir.\n• Sesli okuma: okunacak metin ses servisine gönderilir.\n• Hava durumu: yaklaşık konumunuz hava servisine gönderilir.\n• İlaç doğrulama: ilaç adı/barkodu RxNav ve OpenFDA'ya gönderilir.\nBu veriler yalnızca isteğinizi karşılamak için gönderilir; AILVIE bunları saklamaz.":TL("Some features send data to outside services in order to work — we want to be explicit about this:\n• AI chat / image interpretation / drug analysis: your question, the relevant parts of your health profile (e.g. age, medications, allergies, chronic conditions) and — if memory is on — the notes AILVIE has learned from your past conversations are sent to the AI provider (Anthropic) to generate the answer. You can turn memory off in Settings and delete notes individually or all at once.\n• Translation: the text to be translated is sent to the translation service.\n• Read-aloud: the text to be spoken is sent to the voice service.\n• Weather: your approximate location is sent to the weather service.\n• Drug verification: the drug name/barcode is sent to RxNav and OpenFDA.\nThis data is sent only to fulfil your request; AILVIE does not store it.",lang)}</p>
    <p style={{marginBottom:8}}>{lang==="tr"?"• Verilerinizi hiçbir zaman satmıyor, reklam için paylaşmıyoruz\n• AI sohbet geçmişiniz sunucularımızda saklanmaz\n• İstediğiniz zaman verilerinizi silebilir veya şifreli yedek alabilirsiniz\n• Konum yalnızca izninizle ve yalnızca ilgili özellik için kullanılır\n• AI özelliklerini hiç kullanmazsanız sağlık verileriniz cihazınızdan çıkmaz":TL("• We never sell your data or share it for advertising\n• Your AI chat history is not stored on our servers\n• You can delete your data or export an encrypted backup at any time\n• Location is used only with your permission and only for the relevant feature\n• If you never use the AI features, your health data does not leave your device",lang)}</p>
    <p style={{marginBottom:8}}>{lang==="tr"?"Son güncelleme: Mart 2026":TL("Last updated: March 2026",lang)}</p>
  </div></div>
</div>);

// Terms of Service page
const renderTerms=()=>(<div style={{display:"flex",flexDirection:"column",gap:10}}>
  <div style={{display:"flex",alignItems:"center",gap:8}}><button onClick={()=>goTo("settings")} style={{background:"none",border:"none",color:acTx,cursor:"pointer",fontSize:20}}>←</button><span style={{fontWeight:700,fontSize:fs+2}}>📋 {t.terms}</span></div>
  <div style={CS}><div style={{fontSize:fs-1,color:tc,lineHeight:1.6}}>
    <p style={{marginBottom:8}}><strong>AILVIE {t.terms}</strong></p>
    <p style={{marginBottom:8}}>{lang==="tr"?"1. AILVIE bir tıbbi teşhis aracı değildir. Verilen bilgiler yalnızca bilgilendirme amaçlıdır.\n2. AI yanıtları hatalı olabilir. Sağlık kararları için mutlaka doktora danışın.\n3. Kullanıcı, girdiği verilerden sorumludur.\n4. AILVIE, AI kaynaklı hatalardan doğan zararlardan hukuken sorumlu tutulamaz.\n5. Uygulama, kullanıcı verilerini üçüncü taraflarla paylaşmaz.\n6. Abonelik iptali istediğiniz zaman yapılabilir.":"1. AILVIE is not a medical diagnosis tool.\n2. AI responses may contain errors. Consult a doctor.\n3. Users are responsible for data they enter.\n4. AILVIE is not legally liable for AI errors.\n5. The app does not share data with third parties.\n6. Subscription can be cancelled anytime."}</p>
    <p style={{marginBottom:8}}>{lang==="tr"?"Son güncelleme: Mart 2026":TL("Last updated: March 2026",lang)}</p>
  </div></div>
</div>);

// About page
const renderAbout=()=>(<div style={{display:"flex",flexDirection:"column",gap:10}}>
  <div style={{display:"flex",alignItems:"center",gap:8}}><button onClick={()=>goTo("settings")} style={{background:"none",border:"none",color:acTx,cursor:"pointer",fontSize:20}}>←</button><span style={{fontWeight:700,fontSize:fs+2}}>ℹ️ {t.about}</span></div>
  <div style={{...CS,textAlign:"center",padding:20}}>
    <img src="/avatar2-256.webp" alt="" style={{height:80,objectFit:"contain",marginTop:8}} />
    <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:32,color:"#e8a817",letterSpacing:4,WebkitTextStroke:"0.8px #e8a817",marginTop:10}}>AILVIE</div>
    <div style={{fontSize:fs-1,color:mt,marginTop:2}}>{t.sl}</div>
    <div style={{fontSize:fs-1,color:mt,marginTop:8}}>{t.version}: 9.0.0</div>
    <div style={{fontSize:fs-1,color:mt}}>© 2025-2026 AILVIE Health Technologies</div>
    <div style={{marginTop:12,padding:"8px 12px",borderRadius:8,background:`${ac}11`,fontSize:fs-2,color:acTx}}>
      {lang==="tr"?"60+ dil • 60+ ilaç DB • AI sohbet • Sağlık durumu • Cihazda şifreli":TL("60+ languages • 60+ drug DB • AI chat • Health status • Encrypted on device",lang)}
    </div>
  </div>
  <div style={CS}><div style={{fontSize:fs-1,color:tc,lineHeight:1.6}}>
    {lang==="tr"?"AILVIE, yapay zeka destekli kişisel sağlık asistanı uygulamasıdır. Hastaların günlük sağlık takibini kolaylaştırmak, ilaç hatırlatmaları yapmak ve sağlık bilgilerini güvenli şekilde saklamak amacıyla geliştirilmiştir.":TL("AILVIE is an AI-powered personal health assistant app designed to help patients manage their daily health, receive medication reminders, and securely store health information.",lang)}
  </div></div>
</div>);


// ═══ ADMIN SUPPORT CHANNEL ═══
const renderAdmin=()=>(<div style={{display:"flex",flexDirection:"column",gap:8,height:"100%"}}>
  <div style={{display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
    <div style={{width:36,height:36,borderRadius:12,background:`linear-gradient(135deg,#f59e0b,#f97316)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>💬</div>
    <div style={{flex:1,minWidth:0}}>
      <div style={{fontWeight:700,fontSize:fs+1}}>{t.adminCh}</div>
      <div style={{fontSize:fs-3,color:sc}}>● Online • 🔒 {lang==="tr"?"Özel Kanal":TL("Private Channel",lang)}</div>
    </div>
  </div>
  {/* Privacy Notice */}
  <div style={{padding:"6px 10px",borderRadius:8,background:`${ac}08`,border:`1px solid ${ac}22`,fontSize:fs-3,color:mt,display:"flex",alignItems:"center",gap:6,flexShrink:0}}>
    <span>🔒</span>
    <span>{lang==="tr"?"Bu kanaldaki mesajlar sadece size ve AILVIE destek ekibine görünür. Başka kullanıcılar göremez.":TL("Messages in this channel are visible only to you and AILVIE support. Other users cannot see them.",lang)}</span>
  </div>
  <div style={{fontSize:fs-4,color:mt,textAlign:"center",flexShrink:0}}>ID: <span style={{fontFamily:"monospace"}}>{userId}</span></div>
  <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:8,minHeight:180}}>
    {adminMsgs.length===0&&<div style={{...CS,background:`${ac}08`,textAlign:"center",padding:20}}><span style={{fontSize:40}}>💬</span><div style={{marginTop:8,color:mt}}>{t.adminWelcome||(lang==="tr"?"Merhaba! Size nasıl yardımcı olabilirim?":TL("Hello! How can I help you?",lang))}</div></div>}
    {adminMsgs.length>0&&<div style={{display:"flex",justifyContent:"flex-end",flexShrink:0}}>
      <button onClick={()=>{if(confirm(lang==="tr"?"Tüm mesajları silmek istediğinize emin misiniz?":TL("Are you sure you want to delete all messages?",lang)))setAdminMsgs([]);}} style={{background:"none",border:`1px solid ${dg}44`,color:dg,borderRadius:8,padding:"4px 10px",cursor:"pointer",fontSize:fs-2}}>🗑️ {lang==="tr"?"Tümünü Sil":TL("Clear All",lang)}</button>
    </div>}
    {adminMsgs.map((m,i)=>(<div key={i} className="msg-card" style={{...CS,maxWidth:"85%",alignSelf:m.from==="user"?"flex-end":"flex-start",background:m.from==="user"?`linear-gradient(135deg,#f59e0b,#f97316)`:cd,color:m.from==="user"?"#fff":tc,animation:"slideD .3s"}}>
      <div style={{whiteSpace:"pre-wrap",wordBreak:"break-word",overflowWrap:"anywhere",fontSize:fs}}>{m.text}{m.edited&&<span style={{fontSize:fs-4,color:m.from==="user"?"rgba(255,255,255,.7)":mt,marginLeft:4,fontStyle:"italic"}}>({lang==="tr"?"düzenlendi":TL("edited",lang)})</span>}</div>
      {m.from==="user"&&<div style={{display:"flex",gap:4,marginTop:4,flexWrap:"wrap"}}>
        <button onClick={()=>{const nv=prompt(lang==="tr"?"Mesajı düzenle:":TL("Edit message:",lang),m.text);if(nv!==null&&nv.trim())setAdminMsgs(p=>p.map((x,j)=>j===i?{...x,text:nv.trim(),edited:true}:x));}} style={{background:"rgba(255,255,255,.15)",border:"1px solid rgba(255,255,255,.3)",borderRadius:6,padding:"3px 8px",cursor:"pointer",fontSize:fs-3,color:"#fff"}}>✏️ {lang==="tr"?"Düzenle":TL("Edit",lang)}</button>
        <button onClick={()=>setAdminMsgs(p=>p.filter((_,j)=>j!==i))} style={{background:"rgba(255,255,255,.15)",border:"1px solid rgba(255,255,255,.3)",borderRadius:6,padding:"3px 8px",cursor:"pointer",fontSize:fs-3,color:"#fff"}}>🗑️ {lang==="tr"?"Sil":TL("Delete",lang)}</button>
      </div>}
      <div style={{fontSize:fs-3,color:m.from==="user"?"rgba(255,255,255,.7)":mt,marginTop:4,textAlign:m.from==="user"?"right":"left"}}>{m.time}</div>
    </div>))}
  </div>
  <div style={{display:"flex",gap:6,flexShrink:0}}>
    <div style={{display:"flex",gap:6,alignItems:"flex-start"}}><textarea value={adminIn} onChange={e=>setAdminIn(e.target.value)} onInput={autoResize} placeholder={t.wr} style={{...IS,flex:1,minHeight:36,maxHeight:150,resize:"none",overflowY:"auto"}} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();if(adminIn.trim()){const ts=now.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});setAdminMsgs(p=>[...p,{from:"user",text:adminIn.trim(),time:ts}]);setAdminIn("");setTimeout(()=>setAdminMsgs(p=>[...p,{from:"system",text:(lang==="tr"?"✅ Mesajınız alındı (Ticket #"+userId.slice(-6)+"). AILVIE ekibi en kısa sürede size özel olarak yanıt verecektir.":"✅ Message received (Ticket #"+userId.slice(-6)+"). AILVIE team will respond privately."),time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}]),300);}}}}/><DictateBtn value={adminIn} onChange={v=>setAdminIn(v)}/></div>
    <button onClick={()=>{if(adminIn.trim()){const ts=now.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});setAdminMsgs(p=>[...p,{from:"user",text:adminIn.trim(),time:ts}]);setAdminIn("");setTimeout(()=>setAdminMsgs(p=>[...p,{from:"system",text:(lang==="tr"?"✅ Mesajınız alındı (Ticket #"+userId.slice(-6)+"). AILVIE ekibi en kısa sürede size özel olarak yanıt verecektir.":"✅ Message received (Ticket #"+userId.slice(-6)+"). AILVIE team will respond privately."),time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}]),300);}}} style={{...BP,background:`linear-gradient(135deg,#f59e0b,#f97316)`,padding:"8px 14px"}}>{t.send}</button>
  </div>
</div>);

// Keyboard: Escape closes the top-most open overlay (WCAG 2.1.2 no keyboard trap).
// The lock screen is intentionally NOT closable this way.
useEffect(()=>{
  const onKey=(e)=>{
    if(e.key!=="Escape")return;
    if(locked)return; // never dismiss the lock with a keystroke
    const closers=[
      [guide,closeGuide],
      [imgView,()=>setImgView(null)],
      [callModal,()=>setCallModal(null)],
      [showGroupModal,()=>setShowGroupModal(false)],
      [recog,()=>setRecog(null)],
      [showAddChooser,()=>setShowAddChooser(false)],
      [showWx,()=>setShowWx(false)],
      [showCountryPicker,()=>setShowCountryPicker(false)],
    ];
    const open=closers.find(([isOpen])=>isOpen);
    if(open){e.preventDefault();open[1]();}
  };
  window.addEventListener("keydown",onKey);
  return()=>window.removeEventListener("keydown",onKey);
},[locked,guide,imgView,callModal,showGroupModal,recog,showAddChooser,showWx,showCountryPicker]);

// --- Guided flow engine -----------------------------------------------------
const stopGuideTimer=()=>{if(guideTickRef.current){clearInterval(guideTickRef.current);guideTickRef.current=null;}};
const closeGuide=()=>{stopGuideTimer();stopSpeech();setGuide(null);};
// speak() is a TOGGLE (calling it while speaking stops the speech). That is right for the
// mic button, but wrong here: advancing to step 2 would silence the guide instead of reading
// it. speakNow() always cancels whatever is playing and starts the new text.
const speakNow=(txt)=>{if(txt)try{startSpeech(txt);}catch(e){}};
const sayStep=(key,i)=>{
  if(!voiceGuide)return;                                   // silent mode: text only
  const st=GUIDES[key]&&GUIDES[key].steps[i];
  if(!st)return;
  speakNow(lang==="tr"?st.tr:(st.en||st.tr));
};
const startGuide=(key)=>{
  if(!GUIDES[key])return;
  stopGuideTimer();
  setGuide({key,i:0});
  sayStep(key,0);
};
const gotoStep=(key,i)=>{
  const g=GUIDES[key];
  if(!g)return;
  stopGuideTimer();
  if(i>=g.steps.length){
    if(voiceGuide)speakNow(lang==="tr"?"Yönlendirme tamamlandı.":TL("Guidance complete.",lang));
    setGuide(null);
    notify(lang==="tr"?"✓ Yönlendirme tamamlandı":TL("✓ Guidance complete",lang));
    return;
  }
  if(i<0)i=0;
  setGuide({key,i});
  sayStep(key,i);
};
// The countdown owns its own state. Keeping `left` in the app-level `guide` state made the
// entire 5900-line component re-render once per second, which is visible as flicker.

const renderGuide=()=>{
  if(!guide)return null;
  const g=GUIDES[guide.key];
  const st=g.steps[guide.i];
  const L=lang==="tr";
  const txt=L?st.tr:(st.en||st.tr);
  const pct=Math.round(100*(guide.i)/g.steps.length);
  return(<div role="dialog" aria-modal="true" aria-label={L?g.tr:g.en}
    style={{position:"fixed",inset:0,zIndex:9996,background:"rgba(0,0,0,.72)",display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
    <div style={{width:"100%",maxWidth:520,background:cd,borderRadius:"18px 18px 0 0",padding:"14px 16px calc(16px + env(safe-area-inset-bottom))",boxShadow:"0 -8px 30px rgba(0,0,0,.5)"}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
        <span style={{fontSize:20}}>{g.icon}</span>
        <span style={{fontWeight:700,fontSize:fs}}>{L?g.tr:g.en}</span>
        <span style={{marginLeft:"auto",fontSize:fs-3,color:mt}}>{guide.i+1} / {g.steps.length}</span>
        <button onClick={closeGuide} aria-label={L?"Kapat":"Close"} style={{background:"none",border:"none",color:tc,fontSize:20,cursor:"pointer",padding:"0 2px"}}>✕</button>
      </div>
      <div style={{height:4,background:bd,borderRadius:2,overflow:"hidden",marginBottom:12}}>
        <div style={{width:`${pct}%`,height:"100%",background:ac,transition:"width .25s"}}/>
      </div>
      {st.warn&&<div style={{fontSize:fs-2,color:dg,fontWeight:700,marginBottom:6}}>⚠️ {L?"Önemli":"Important"}</div>}
      <div style={{fontSize:fs+3,lineHeight:1.45,minHeight:74}}>{txt}</div>
      {!!st.sec&&<StepTimer key={guide.key+"_"+guide.i} seconds={st.sec} ac={ac} acTx={acTx} sc={sc} fs={fs} BP={BP}
        label={L?"Süre":"Timer"} done={L?"Tamam":"Done"}
        pause={L?"⏸ Duraklat":"⏸ Pause"} resume={L?"▶ Devam":"▶ Resume"}
        onDone={()=>{if(voiceGuide)speakNow(L?"Süre doldu.":"Time is up.");}}/>}
      <div style={{display:"flex",gap:8,marginTop:10}}>
        <button onClick={()=>gotoStep(guide.key,guide.i-1)} disabled={guide.i===0}
          style={{...BP,flex:"0 0 auto",padding:"10px 14px",background:"transparent",color:guide.i===0?mt:tc,border:`1px solid ${bd}`}}>←</button>
        <button onClick={()=>sayStep(guide.key,guide.i)} aria-label={L?"Tekrar oku":"Repeat"}
          style={{...BP,flex:"0 0 auto",padding:"10px 14px",background:"transparent",color:voiceGuide?acTx:mt,border:`1px solid ${bd}`}}>🔊</button>
        <button onClick={()=>gotoStep(guide.key,guide.i+1)}
          style={{...BP,flex:1,padding:"10px",fontWeight:700}}>
          {guide.i===g.steps.length-1?(L?"Bitir":"Finish"):(L?"Sonraki":"Next")}
        </button>
      </div>
      {!voiceGuide&&<div style={{fontSize:fs-4,color:mt,marginTop:8,textAlign:"center"}}>
        {L?"Sesli yönlendirme kapalı — Ayarlar'dan açabilirsiniz.":"Voice guidance is off — enable it in Settings."}</div>}
    </div>
  </div>);
};
// --- Screen-reader support -------------------------------------------------
// We deliberately do NOT build our own screen reader: TalkBack/VoiceOver already
// exist and a second speaking layer fights with them. Instead we expose correct
// semantics (landmarks, aria-current, live regions) so they work well.
const pageTitle=(k)=>{
  const map={home:t.home,contacts:t.contacts,pCard:t.pCardFull,meds:t.meds,appts:t.appts,health:t.healthFull,
    notes:t.notes,community:t.community,chat:t.chat,settings:t.settings,admin:t.adminCh||"Destek"};
  return map[k]||t.app;
};
const mainRef=useRef(null);
const[srMsg,setSrMsg]=useState("");
const firstPageRef=useRef(true);
useEffect(()=>{
  if(firstPageRef.current){firstPageRef.current=false;return;}   // don't announce on cold start
  const title=pageTitle(page);
  setSrMsg(title);                                                // announced by the live region
  try{if(mainRef.current)mainRef.current.focus({preventScroll:true});}catch(e){}
  // NOTE: we do NOT speak the page name here. A screen-reader user already hears it from the
  // live region above, so speaking it too would read every page twice. And "voice guidance"
  // means step-by-step coaching during a measurement - not narration while browsing menus.
  const tm=setTimeout(()=>setSrMsg(""),1200);
  return()=>clearTimeout(tm);
},[page]);
const pages={home:renderHome,medTime:renderMedTime,admin:renderAdmin,meds:renderMeds,appts:renderAppts,health:renderHealth,pCard:renderPCard,notes:renderNotes,contacts:renderContacts,community:renderCommunity,chat:renderChat,settings:renderSettings,privacy:renderPrivacy,terms:renderTerms,about:renderAbout};
  // SECURITY: when locked, render ONLY the lock screen. The app tree (health data) is never mounted.
  if(locked&&lockCfg)return(<div style={{fontFamily:"system-ui,-apple-system,sans-serif",background:dark?"#0b1117":"#f7fafc",minHeight:"100vh"}}>
    <div style={{position:"fixed",inset:0,zIndex:5000,background:dark?"#0b1117":"#f7fafc",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,gap:14}}>
          <Avatar s={64}/>
          <div style={{fontWeight:800,fontSize:fs+6,color:"#e8a817",WebkitTextStroke:"0.8px #e8a817",fontFamily:"Rajdhani,sans-serif"}}>AILVIE</div>
          <div style={{color:mt,fontSize:fs-1,textAlign:"center"}}>{lang==="tr"?"Sağlık verileriniz kilitli":TL("Your health data is locked",lang)}</div>
          <input type="password" inputMode="numeric" autoComplete="off" value={pinIn} maxLength={12}
            onChange={e=>{setPinIn(e.target.value.replace(/\D/g,""));setLockErr("");}}
            onKeyDown={e=>{if(e.key==="Enter")tryUnlockPIN();}}
            placeholder={lang==="tr"?"PIN":TL("PIN",lang)} autoFocus
            style={{...IS,width:"100%",maxWidth:260,textAlign:"center",letterSpacing:6,fontSize:fs+4,padding:"12px"}}/>
          {lockErr&&<div style={{color:dg,fontSize:fs-2}}>{lockErr}</div>}
          <button onClick={tryUnlockPIN} disabled={pinIn.length<4} style={{...BP,width:"100%",maxWidth:260,padding:"11px",opacity:pinIn.length<4?0.5:1}}>{lang==="tr"?"Kilidi Aç":TL("Unlock",lang)}</button>
          {lockCfg.credId&&<button onClick={tryUnlockBio} style={{...BP,width:"100%",maxWidth:260,padding:"11px",background:"transparent",color:acTx,border:`1px solid ${ac}`}}>🔐 {lang==="tr"?"Biyometrik ile aç":TL("Use biometrics",lang)}</button>}
          <div style={{color:mt,fontSize:fs-4,textAlign:"center",maxWidth:280,lineHeight:1.4,marginTop:6}}>{lang==="tr"?"PIN, bu cihazdaki sağlık verilerinizi AES-256 ile şifreler ve ekranda gizler. Kısa bir PIN'in koruması sınırlıdır — cihazınızın kendi kilidini/şifrelemesini de kullanın ve şifreli bir yedek saklayın.":TL("The PIN encrypts your health data on this device with AES-256 and keeps it off the screen. A short PIN offers limited protection — also use your device's own lock/encryption and keep an encrypted backup.",lang)}</div>
        </div>
  </div>);


// ═══ RESTRUCTURED NAV — 2 rows only ═══
// Inline SVG nav icons. Emoji glyphs are drawn by the OS colour font and CANNOT be
// recoloured with CSS, so anything needing a specific brand colour must be an SVG.
const IcoPhone=({size=23})=>(
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={{display:"block"}}>
    <path fill="#e11d2e" stroke="#7f0f1a" strokeWidth="0.6" strokeLinejoin="round"
      d="M6.6 10.8c1.45 2.83 3.77 5.15 6.6 6.6l2.2-2.2c.28-.28.68-.37 1.03-.25 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.6 21 3 13.4 3 4c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.24.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.21z"/>
  </svg>
);
// Health: bigger heart, fills the whole viewBox, white ECG trace across it
const IcoHeartBeat=({size=25})=>(
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={{display:"block"}}>
    <path fill="#e11d2e" stroke="#8f0f1c" strokeWidth="0.5"
      d="M12 23L10.2 21.4C3.9 15.8 0.4 12.6 0.4 8.5 0.4 5.1 3.1 2.4 6.5 2.4c1.9 0 3.8 0.9 5.5 2.7 1.7-1.8 3.6-2.7 5.5-2.7 3.4 0 6.1 2.7 6.1 6.1 0 4.1-3.5 7.3-9.8 12.9L12 23z"/>
    <path fill="none" stroke="#ffffff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"
      d="M1.6 10.4h4.3l1.5-3.4 2.6 7.6 2.1-5.4 1.4 2.7h5.6"/>
  </svg>
);
// Community: half-length (bust) figures - a woman and a man, large and legible
const IcoPeople=({size=24})=>(
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={{display:"block"}}>
    <circle cx="7" cy="6.4" r="3.7" fill="#f7b3cf" stroke="#c2185b" strokeWidth="0.7"/>
    <path fill="#e0629a" stroke="#a3134f" strokeWidth="0.6" strokeLinejoin="round"
      d="M7 11c-3.1 0-5.5 2.1-5.9 5.1L0.7 21h12.6l-0.4-4.9C12.5 13.1 10.1 11 7 11z"/>
    <circle cx="17.2" cy="6.4" r="3.7" fill="#a7d4ff" stroke="#0d47a1" strokeWidth="0.7"/>
    <path fill="#2f7fd6" stroke="#0d47a1" strokeWidth="0.6" strokeLinejoin="round"
      d="M17.2 11c-3.1 0-5.5 2.1-5.9 5.1L10.9 21h12.6l-0.4-4.9C22.7 13.1 20.3 11 17.2 11z"/>
  </svg>
);
// Health status: a ring gauge with a heart at its centre — the processed, at-a-glance view of the
// data entered in "My Health Data". Deliberately NOT a heart silhouette: the heart+pulse icon
// belongs to the data-entry page, and at 24px in the nav the two must stay instantly tellable
// apart (a circle vs a heart). The base ring is mid-grey so it survives both light and dark themes.
const IcoStatus=({size=24})=>(
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={{display:"block"}}>
    <circle cx="12" cy="12" r="9.6" fill="none" stroke="#94a3b8" strokeWidth="3.2"/>
    <path fill="none" stroke="#e8a817" strokeWidth="3.2" strokeLinecap="round" d="M12 2.4a9.6 9.6 0 0 1 8.3 14.4"/>
    <path fill="#e11d2e" d="M12 17.2l-.6-.55C9.2 14.7 8 13.6 8 12.2c0-1.15.9-2.05 2.05-2.05.65 0 1.28.3 1.95.97.67-.67 1.3-.97 1.95-.97 1.15 0 2.05.9 2.05 2.05 0 1.4-1.2 2.5-3.4 4.45l-.6.55z"/>
  </svg>
);
// Chat + Support: same visual language as the other nav icons - flat, two brand colours,
// no photo. A photo cannot hold detail at 25px and clashes with the vector icons beside it.
// Chat: speech bubble (blue) with an AI spark (gold)
const IcoAilvie=({size=25})=>(
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={{display:"block"}}>
    <path fill="#00b4d8" d="M12 1.8C6.1 1.8 1.3 5.7 1.3 10.6c0 2.8 1.6 5.3 4.1 6.9-.2 1.5-.9 3-2 4.2 2.2-.3 4.3-1.2 6-2.5.8.1 1.7.2 2.6.2 5.9 0 10.7-3.9 10.7-8.8S17.9 1.8 12 1.8z"/>
    <path fill="#e8a817" d="M11.8 4.4l2.2 4.7 4.7 2.2-4.7 2.2-2.2 4.7-2.2-4.7-4.7-2.2 4.7-2.2z"/>
  </svg>
);
// Support: a headset on its own. No head silhouette -> far fewer parts, reads at 25px.
const IcoAilvieSupport=({size=25})=>(
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={{display:"block"}}>
    {/* headband */}
    <path d="M3.9 12.6V10.2a8.1 8.1 0 0 1 16.2 0v2.4" fill="none" stroke="#00b4d8" strokeWidth="2.6" strokeLinecap="round"/>
    {/* ear cups */}
    <rect x="1.5" y="11.2" width="4.9" height="7.4" rx="2.45" fill="#00b4d8"/>
    <rect x="17.6" y="11.2" width="4.9" height="7.4" rx="2.45" fill="#00b4d8"/>
    {/* boom mic + mouthpiece, gold */}
    <path d="M20 18.9v.3a2.6 2.6 0 0 1-2.6 2.6h-1.7" fill="none" stroke="#e8a817" strokeWidth="1.9" strokeLinecap="round"/>
    <circle cx="14.1" cy="21.8" r="2.05" fill="#e8a817"/>
  </svg>
);
// ---------------------------------------------------------------------------
// GUIDED FLOW ENGINE
// A step is {tr, en, sec?, warn?}. `sec` turns the step into a countdown.
// Flows are DATA, not code: adding a new one is just another entry here.
// Sources: technique steps follow standard patient-instruction sheets
// (inhaler: prime, exhale, seal, slow deep breath, 10s hold;
//  BP: 5 min rest, back supported, cuff at heart level, no talking).
// ---------------------------------------------------------------------------
const GUIDES={
  bp:{icon:"🩺",tr:"Tansiyon ölçümü",en:"Blood pressure",steps:[
    {tr:"Ölçümden önce 5 dakika sessizce oturun. Sigara, kahve ve egzersizden en az 30 dakika kaçının.",en:"Sit quietly for 5 minutes before measuring.",sec:300},
    {tr:"Sırtınızı dayayın, ayaklarınız yere düz bassın. Bacak bacak üstüne atmayın.",en:"Back supported, feet flat on the floor, legs uncrossed."},
    {tr:"Kolunuzu bir masaya koyun. Manşon kalbinizle aynı hizada olmalı.",en:"Rest your arm on a table so the cuff is at heart level."},
    {tr:"Manşonu çıplak kolunuza, dirseğin iki parmak üstüne sarın. İki parmak girecek kadar sıkı olsun.",en:"Wrap the cuff on your bare arm, two fingers above the elbow."},
    {tr:"Cihazı başlatın. Ölçüm boyunca konuşmayın ve hareket etmeyin.",en:"Start the device. Do not talk or move during the measurement."},
    {tr:"Bir dakika bekleyin, sonra ikinci bir ölçüm yapın. İki ölçümün ortalamasını kaydedin.",en:"Wait one minute, then take a second reading and average them.",sec:60},
  ]},
  pulse:{icon:"❤️",tr:"Nabız ölçümü",en:"Pulse",steps:[
    {tr:"Oturun ve bir dakika dinlenin.",en:"Sit down and rest for a minute.",sec:60},
    {tr:"İşaret ve orta parmağınızı bileğinizin baş parmak tarafına koyun. Baş parmağınızı kullanmayın.",en:"Place index and middle finger on the thumb side of your wrist."},
    {tr:"Nabzı hissedene kadar hafifçe bastırın.",en:"Press gently until you feel the beat."},
    {tr:"Otuz saniye boyunca atışları sayın. Şimdi başlayın.",en:"Count the beats for thirty seconds. Start now.",sec:30},
    {tr:"Saydığınız sayıyı ikiyle çarpın. Bu dakikadaki nabzınızdır.",en:"Multiply by two. That is your beats per minute."},
  ]},
  glucose:{icon:"🩸",tr:"Kan şekeri ölçümü",en:"Blood glucose",steps:[
    {tr:"Ellerinizi sabunlu ılık suyla yıkayın ve iyice kurulayın. Alkollü mendil kullandıysanız tamamen kurumasını bekleyin.",en:"Wash hands with warm soapy water and dry them fully."},
    {tr:"Yeni bir strip takın ve cihazın hazır olmasını bekleyin.",en:"Insert a fresh strip and wait for the meter to be ready."},
    {tr:"Parmak ucunun yan tarafını delin. Orta kısmı daha çok acır.",en:"Lance the side of the fingertip, not the centre."},
    {tr:"İlk damlayı temiz bir mendille silin. İkinci damlayı kullanın.",en:"Wipe away the first drop; use the second drop."},
    {tr:"Damlayı stribin ucuna değdirin ve sonucu bekleyin.",en:"Touch the drop to the strip and wait for the result.",sec:10},
    {tr:"Parmağınıza temiz bir pamukla bastırın. Sonucu uygulamaya kaydedin.",en:"Press with clean cotton, then record the result."},
  ]},
  inhaler:{icon:"💨",tr:"İnhaler (sprey) kullanımı",en:"Inhaler technique",steps:[
    {tr:"İnhaleri dik tutun, kapağını çıkarın ve beş kez çalkalayın.",en:"Hold upright, remove the cap and shake five times."},
    {tr:"Ayakta veya dik oturun. Çenenizi hafifçe yukarı kaldırın.",en:"Stand or sit upright, chin slightly up."},
    {tr:"Rahatça nefes verin. Ciğerlerinizi boşaltın.",en:"Breathe out gently and empty your lungs."},
    {tr:"Ağızlığı dişlerinizin arasına alın, dudaklarınızla sıkıca kavrayın.",en:"Seal your lips around the mouthpiece."},
    {tr:"Yavaş derin nefes almaya başlayın ve tam o anda spreye bir kez basın. Nefesi yavaşça sürdürün.",en:"Start a slow deep breath and press once as you begin."},
    {tr:"İnhaleri çıkarın. Nefesinizi on saniye tutun.",en:"Remove the inhaler and hold your breath for ten seconds.",sec:10},
    {tr:"Yavaşça nefes verin. İkinci doz gerekiyorsa otuz saniye bekleyin.",en:"Breathe out slowly. Wait thirty seconds if a second dose is needed.",sec:30},
    {tr:"Kortizonlu inhaler kullandıysanız ağzınızı suyla çalkalayın ve suyu tükürün.",en:"If it is a steroid inhaler, rinse your mouth and spit.",warn:true},
  ]},
  insulin:{icon:"💉",tr:"İnsülin enjeksiyonu",en:"Insulin injection",steps:[
    {tr:"Ellerinizi yıkayın. İnsülinin türünü ve son kullanma tarihini kontrol edin.",en:"Wash hands. Check the insulin type and expiry date."},
    {tr:"Bulanık insülin ise avuçlarınız arasında yavaşça yuvarlayın. Çalkalamayın.",en:"If cloudy, roll gently between your palms. Do not shake."},
    {tr:"Yeni bir iğne takın. İki ünite havaya sıkarak iğnenin aktığını doğrulayın.",en:"Attach a new needle and prime with two units."},
    {tr:"Dozunuzu ayarlayın ve iki kez kontrol edin.",en:"Dial your dose and check it twice."},
    {tr:"Bölgeyi seçin: karın, uyluk veya kol. Her seferinde en az iki santim kaydırın. Aynı noktaya tekrar tekrar yapmayın.",en:"Rotate the site by at least two centimetres each time.",warn:true},
    {tr:"Cildi hafifçe tutun, iğneyi doksan derece batırın ve pistonu sonuna kadar itin.",en:"Pinch the skin, insert at ninety degrees and press fully."},
    {tr:"On saniye bekleyin, sonra iğneyi çıkarın. Ovalamayın.",en:"Hold for ten seconds, then withdraw. Do not rub.",sec:10},
    {tr:"İğneyi güvenli bir kutuya atın.",en:"Dispose of the needle in a sharps container."},
  ]},
};
const nav1=[{key:"contacts",icon:<IcoPhone/>,label:t.contacts},{key:"pCard",icon:<IcoStatus/>,label:t.pCard},{key:"meds",icon:"💊",label:t.meds},{key:"appts",icon:"📅",label:t.appts},{key:"health",icon:<IcoHeartBeat/>,label:t.health}];
const nav2=[{key:"notes",icon:"📝",label:t.notes},{key:"community",icon:<IcoPeople/>,label:t.community},{key:"chat",icon:<IcoAilvie/>,label:t.chat},{key:"admin",icon:<IcoAilvieSupport/>,label:t.adminCh||"Destek"},{key:"settings",icon:"⚙️",label:t.settings,onNav:()=>setSettingsTab("all")}];

return (
  <div style={{width:"100%",maxWidth:480,margin:"0 auto",height:"100dvh",display:"flex",flexDirection:"column",overflow:"hidden",background:bg,fontSize:fs,color:tc,fontFamily:"'SF Pro Display',-apple-system,'Segoe UI',system-ui,sans-serif",direction:rtl?"rtl":"ltr",position:"relative"}}>
        {/* ONBOARDING — first run wizard */}
        {showOb&&(()=>{const ob=OB[lang]||OB.en;return(
          <div style={{position:"fixed",inset:0,zIndex:9998,background:`linear-gradient(160deg,${ac},${a2})`,display:"flex",flexDirection:"column",color:"#fff",direction:rtl?"rtl":"ltr"}}>
            <div style={{display:"flex",justifyContent:"flex-end",padding:"max(env(safe-area-inset-top),12px) 16px 0"}}>
              <button onClick={()=>{try{localStorage.setItem("ailvie_onboarded","1");}catch(e){}setShowOb(false);}} style={{background:"rgba(255,255,255,.15)",border:"none",color:"#fff",borderRadius:20,padding:"6px 16px",fontSize:fs-1,cursor:"pointer"}}>{ob.skip}</button>
            </div>
            <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",padding:"0 28px",gap:16,overflowY:"auto"}}>
              {obStep===0&&<>
                {/* The source image is 217x256 (portrait). A 120x120 square box with objectFit:cover
                    cropped the top and bottom of the doctor. Keep the real aspect ratio and show it whole. */}
                <img src="/avatar2-256.webp" alt="AILVIE" width="129" height="152"
                  style={{width:129,height:152,borderRadius:20,objectFit:"contain",boxShadow:"0 8px 30px rgba(0,0,0,.3)"}}/>
                <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:42,color:"#e8a817",letterSpacing:3,WebkitTextStroke:"1px #e8a817"}}>AILVIE</div>
                <div style={{fontSize:fs+6,fontWeight:700}}>{ob.welcome}</div>
                <div style={{fontSize:fs+1,opacity:.92,maxWidth:340,lineHeight:1.5}}>{ob.intro}</div>
              </>}
              {obStep===1&&<>
                <div style={{fontSize:fs+8,fontWeight:700,marginBottom:4}}>{ob.chooseLang}</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,width:"100%",maxWidth:360}}>
                  {Object.entries(LL_NATIVE).sort((a,b)=>a[0]===lang?-1:b[0]===lang?1:a[1].localeCompare(b[1])).map(([k,v])=><button key={k} onClick={()=>{setLang(k);try{localStorage.setItem("ailvie_lang",k);}catch(e){}}} style={{padding:"12px",borderRadius:12,border:lang===k?"2px solid #fff":"1px solid rgba(255,255,255,.4)",background:lang===k?"rgba(255,255,255,.25)":"rgba(255,255,255,.08)",color:"#fff",fontSize:fs,fontWeight:lang===k?700:500,cursor:"pointer"}}>{v}</button>)}
                </div>
              </>}
              {obStep===2&&<>
                <div style={{fontSize:60}}>👋</div>
                <div style={{fontSize:fs+8,fontWeight:700}}>{ob.yourName}</div>
                <input value={pat.name} onChange={e=>setPat(p=>({...p,name:e.target.value}))} placeholder={ob.namePh} style={{width:"100%",maxWidth:320,padding:"12px 14px",borderRadius:12,border:"none",fontSize:fs+2,textAlign:"center",outline:"none",color:"#0a0e14"}}/>
              </>}
              {obStep===3&&<>
                <div style={{fontSize:64}}>🎉</div>
                <div style={{fontSize:fs+8,fontWeight:700}}>{pat.name?`${ob.ready} ${pat.name}`:ob.ready}</div>
                <div style={{fontSize:fs+1,opacity:.92,maxWidth:340,lineHeight:1.5}}>{ob.readyDesc}</div>
              </>}
            </div>
            <div style={{padding:"0 24px max(env(safe-area-inset-bottom),20px)",display:"flex",flexDirection:"column",gap:14}}>
              <div style={{display:"flex",gap:7,justifyContent:"center"}}>{[0,1,2,3].map(i=><div key={i} style={{width:obStep===i?22:8,height:8,borderRadius:4,background:obStep===i?"#fff":"rgba(255,255,255,.4)",transition:"all .2s"}}/>)}</div>
              <div style={{display:"flex",gap:10}}>
                {obStep>0&&<button onClick={()=>setObStep(s=>s-1)} style={{flexShrink:0,padding:"13px 20px",borderRadius:14,border:"1px solid rgba(255,255,255,.5)",background:"transparent",color:"#fff",fontSize:fs+1,fontWeight:600,cursor:"pointer"}}>{ob.back}</button>}
                <button onClick={()=>{if(obStep<3)setObStep(s=>s+1);else{try{localStorage.setItem("ailvie_onboarded","1");if('Notification'in window&&Notification.permission==='default')Notification.requestPermission();}catch(e){}setShowOb(false);}}} style={{flex:1,padding:"13px",borderRadius:14,border:"none",background:"#e8a817",color:"#0a0e14",fontSize:fs+2,fontWeight:800,cursor:"pointer",boxShadow:"0 4px 16px rgba(0,0,0,.25)"}}>{obStep<3?ob.next:ob.start}</button>
              </div>
            </div>
          </div>
        );})()}

        {/* LOCK SCREEN — shown when app is locked */}
        {showNav&&<div style={{position:"fixed",inset:0,zIndex:9997,background:"rgba(0,0,0,.6)",display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={()=>setShowNav(false)}>
          <div onClick={e=>e.stopPropagation()} style={{background:cd,color:tc,width:"100%",maxWidth:520,maxHeight:"88vh",borderRadius:"18px 18px 0 0",display:"flex",flexDirection:"column",overflow:"hidden"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 16px",borderBottom:`1px solid ${bd}`,flexShrink:0}}>
              <span style={{fontWeight:800,fontSize:fs+3}}>🧭 {lang==="tr"?"Navigasyon":TL("Navigation",lang)}</span>
              <button onClick={()=>setShowNav(false)} aria-label={lang==="tr"?"Kapat":TL("Close",lang)} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:tc}}>✕</button>
            </div>
            <div style={{padding:"12px 16px",overflowY:"auto"}}>
              <div style={{fontSize:fs-2,color:mt,marginBottom:10,lineHeight:1.5}}>{lang==="tr"?"Konumunu kullanıp yakındaki sağlık yerlerine yol tarifini harita uygulamasında açar.":TL("Uses your location to open directions to nearby health places in your maps app.",lang)}</div>
              <div style={{display:"flex",gap:6,marginBottom:12}}>
                <input value={navQuery} onChange={e=>setNavQuery(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&navQuery.trim()){navTo(navQuery.trim());setNavQuery("");}}} placeholder={lang==="tr"?"Ara: kardiyoloji, fizyoterapi, göz…":TL("Search: cardiology, physio, eye…",lang)} aria-label={lang==="tr"?"Yer ara":TL("Search place",lang)} style={{...IS,flex:1}}/>
                <button onClick={()=>{if(navQuery.trim()){navTo(navQuery.trim());setNavQuery("");}}} aria-label={lang==="tr"?"Ara":TL("Search",lang)} style={{...BP,padding:"0 16px",fontSize:18}}>🔍</button>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                {NAV_PLACES().map(pl=><button key={pl.q} onClick={()=>navTo(pl.q)} aria-label={pl.label} style={{...BP,display:"flex",alignItems:"center",gap:8,padding:"12px 10px",fontSize:fs-2,textAlign:"left",background:"transparent",border:`1px solid ${bd}`,color:tc}}>
                  <span style={{fontSize:22,flexShrink:0}}>{pl.ic}</span><span style={{fontWeight:600}}>{pl.label}</span>
                </button>)}
              </div>
              <button onClick={()=>getLoc()} style={{...BP,width:"100%",marginTop:10,padding:"10px"}}>📍 {lang==="tr"?"Konumumu haritada göster":TL("Show my location",lang)}</button>
              <div style={{fontSize:fs-4,color:mt,marginTop:10,lineHeight:1.5}}>ℹ️ {(lang==="tr"?"Yol tarifi cihazının harita uygulamasında açılır. Konum izni gerekebilir; acil durumda önce 112'yi arayın.":TL("Directions open in your device's maps app. Location permission may be needed; in an emergency call 112 first.",lang)).replace(/\b112\b/g,emgNum)}</div>
            </div>
          </div>
        </div>}
        {editNote&&(()=>{const n=notes.find(x=>x.id===editNote);if(!n)return null;
          const cbg=(n.bg&&noteBg(n.bg))?noteBg(n.bg):(noteColor(n.color)||(dark?"#0d1117":"#fdfdfb"));
          const media=noteMedia[n.id]||[];
          const active=dark?"#2b3542":"#e7ebf0";
          const tbBtn={background:"none",border:"none",cursor:"pointer",color:dark?tc:"#333",width:44,height:44,borderRadius:22,display:"flex",alignItems:"center",justifyContent:"center",padding:0,flexShrink:0};
          const ICO={back:"M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20z",pin:"M16 9V4h1c.55 0 1-.45 1-1s-.45-1-1-1H7c-.55 0-1 .45-1 1s.45 1 1 1h1v5c0 1.66-1.34 3-3 3v2h5.97v7l1 1 1-1v-7H19v-2c-1.66 0-3-1.34-3-3z",add:"M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-8-2h2v-4h4v-2h-4V7h-2v4H7v2h4z",palette:"M12 22C6.49 22 2 17.51 2 12S6.49 2 12 2s10 4.04 10 9c0 3.31-2.69 6-6 6h-1.77c-.28 0-.5.22-.5.5 0 .12.05.23.13.33.41.47.64 1.06.64 1.67 0 1.38-1.12 2.5-2.5 2.5zm0-18c-4.41 0-8 3.59-8 8s3.59 8 8 8c.28 0 .5-.22.5-.5 0-.16-.08-.28-.14-.35-.41-.46-.63-1.05-.63-1.65 0-1.38 1.12-2.5 2.5-2.5H16c2.21 0 4-1.79 4-4 0-3.86-3.59-7-8-7zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z",format:"M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z",undo:"M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z",redo:"M18.4 10.6C16.55 8.99 14.15 8 11.5 8c-4.65 0-8.58 3.03-9.96 7.22L3.9 16c1.05-3.19 4.05-5.5 7.6-5.5 1.95 0 3.73.72 5.12 1.88L13 16h9V7z",more:"M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"};
          const svgIco=(d,sz)=><svg width={sz||24} height={sz||24} viewBox="0 0 24 24" fill="currentColor" style={{display:"block"}}><path d={d}/></svg>;
          const sheetBox={margin:"0 10px",border:`1px solid ${dark?bd:"#00000018"}`,borderRadius:12,background:dark?"#161c26":"#f4f6f9",padding:"4px",display:"flex",flexDirection:"column"};
          const sheetRow={display:"flex",alignItems:"center",gap:16,width:"100%",padding:"13px 16px",background:"none",border:"none",cursor:"pointer",color:dark?tc:"#333",textAlign:"left",fontSize:fs};
          const fbtn=(on,extra)=>({background:on?active:"none",border:"none",color:dark?tc:"#333",fontSize:fs+3,cursor:"pointer",padding:"8px 14px",borderRadius:10,lineHeight:1,minWidth:46,textAlign:"center",...(extra||{})});
          const noP=e=>e.preventDefault();
          const hh=noteHistRef.current;const canU=hh.nid===n.id&&hh.idx>0;const canR=hh.nid===n.id&&hh.idx<hh.stack.length-1;const blk=fmtState.block;
          const saveClose=()=>{const empty=!n.title?.trim()&&!(n.content||"").replace(/<[^>]+>/g,"").trim()&&!(n.checklist&&n.checklist.some(i=>i.text.trim()))&&!media.length;if(empty){setNotes(p=>p.filter(x=>x.id!==n.id));setNoteMedia(p=>{const q={...p};delete q[n.id];return q;});}setEditNote(null);setNoteSheet(null);};
        
  return(<><div style={{position:"fixed",inset:0,zIndex:9990,background:cbg}}/><div style={{position:"fixed",top:vvTop||0,left:0,right:0,height:vvh>0?vvh+"px":"100dvh",zIndex:9991,background:cbg,display:"flex",flexDirection:"column"}}>
            <div style={{display:"flex",alignItems:"center",gap:6,padding:"10px 8px 6px",flexShrink:0}}>
              <button onClick={saveClose} aria-label={lang==="tr"?"Geri":TL("Back",lang)} style={{...tbBtn}}>{svgIco(ICO.back,26)}</button>
              <div style={{flex:1}}/>
              <button onClick={()=>setNotes(p=>p.map(x=>x.id===n.id?{...x,pinned:!x.pinned}:x))} aria-label={lang==="tr"?"Sabitle":TL("Pin",lang)} style={{...tbBtn,color:n.pinned?acTx:(dark?tc:"#333")}}>{svgIco(ICO.pin,22)}</button>
            </div>
            <div onClick={()=>{if(noteSheet)setNoteSheet(null);}} style={{flex:"1 1 0",minHeight:0,overflowY:"auto",WebkitOverflowScrolling:"touch",padding:"0 18px 24px"}}>
              {media.length>0&&<div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:10}}>{media.map((m,mi)=><div key={mi} style={{position:"relative"}}>
              {m.type==="audio"
                ? <audio controls src={m.data} style={{width:"100%"}}/>
                : <img alt="" src={m.data} onClick={()=>{if(m.type==="drawing")setNoteDraw(true);}} style={{width:"100%",maxHeight:340,objectFit:"contain",borderRadius:12,display:"block",background:dark?"#0d1520":"#f4f6f9",cursor:m.type==="drawing"?"pointer":"default"}}/>}
              <button onClick={()=>delNoteMedia(n.id,mi)} aria-label={lang==="tr"?"Kaldır":TL("Remove",lang)} style={{position:"absolute",top:6,right:6,background:"rgba(0,0,0,.55)",color:"#fff",border:"none",borderRadius:"50%",width:28,height:28,cursor:"pointer",fontSize:15,lineHeight:1}}>✕</button>
            </div>)}</div>}
            <input value={n.title} onChange={e=>setNotes(p=>p.map(x=>x.id===n.id?{...x,title:e.target.value}:x))} placeholder={lang==="tr"?"Başlık":TL("Title",lang)} style={{fontWeight:700,background:"transparent",border:"none",padding:"6px 0",color:dark?tc:"#1a1a1a",fontSize:fs+9,outline:"none",width:"100%",boxSizing:"border-box",direction:lang==="ar"?"rtl":"ltr"}}/>
              {n.checklist?<div style={{display:"flex",flexDirection:"column",gap:6,marginTop:6}}>
                {n.checklist.map(it=><div key={it.id} style={{display:"flex",alignItems:"center",gap:10}}>
                  <button onClick={()=>setCheck(n.id,n.checklist.map(x=>x.id===it.id?{...x,done:!x.done}:x))} aria-label={lang==="tr"?"İşaretle":TL("Toggle",lang)} style={{background:"none",border:"none",cursor:"pointer",fontSize:19,padding:0}}>{it.done?"☑️":"⬜"}</button>
                  <input value={it.text} onChange={e=>setCheck(n.id,n.checklist.map(x=>x.id===it.id?{...x,text:e.target.value}:x))} placeholder={lang==="tr"?"Öğe":TL("Item",lang)} style={{flex:1,background:"transparent",border:"none",outline:"none",color:dark?tc:"#333",fontSize:fs+4,textDecoration:it.done?"line-through":"none",opacity:it.done?0.55:1}}/>
                  <button onClick={()=>setCheck(n.id,n.checklist.filter(x=>x.id!==it.id))} aria-label={lang==="tr"?"Kaldır":TL("Remove",lang)} style={{background:"none",border:"none",cursor:"pointer",fontSize:15,color:mt}}>✕</button>
                </div>)}
                <button onClick={()=>setCheck(n.id,[...n.checklist,{id:Date.now(),text:"",done:false}])} style={{background:"none",border:"none",color:acTx,cursor:"pointer",fontSize:fs+3,textAlign:"left",padding:"4px 0",display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:22}}>➕</span>{lang==="tr"?"Öğe ekle":TL("Add item",lang)}</button>
              </div>:<div contentEditable suppressContentEditableWarning className="note-edit" ref={el=>{editableRef.current=el;if(el&&el.dataset.nid!==String(n.id)){el.dataset.nid=String(n.id);el.innerHTML=n.content||"";noteHistRef.current={stack:[n.content||""],idx:0,nid:n.id};}}} onInput={e=>{const html=e.currentTarget.innerHTML;setNotes(p=>p.map(x=>x.id===n.id?{...x,content:html}:x));pushHist(n.id,html);}} data-ph={lang==="tr"?"Not al...":TL("Take a note...",lang)} style={{minHeight:"50vh",outline:"none",color:dark?tc:"#333",fontSize:fs+5,lineHeight:1.55,wordBreak:"break-word",overflowWrap:"anywhere",whiteSpace:"pre-wrap",direction:lang==="ar"?"rtl":"ltr",marginTop:4}}/>}
              
              {(n.labels||[]).length>0&&<div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:12}}>{n.labels.map(l=><span key={l} onClick={()=>setNotes(p=>p.map(x=>x.id===n.id?{...x,labels:(x.labels||[]).filter(y=>y!==l)}:x))} style={{fontSize:fs-2,background:`${ac}22`,color:acTx,borderRadius:12,padding:"4px 10px",cursor:"pointer"}}>🏷️ {l} ✕</span>)}</div>}
            </div>
            {noteSheet==="add"&&<div style={sheetBox}>{[["📷",lang==="tr"?"Fotoğraf çek":TL("Take photo",lang),()=>pickNoteImage(n.id,true)],["🖼️",lang==="tr"?"Resim ekle":TL("Add image",lang),()=>pickNoteImage(n.id,false)],["🖌️",lang==="tr"?"Çizim":TL("Drawing",lang),()=>{setNoteSheet(null);setNoteDraw(true);}],["🎤",lang==="tr"?"Kayıt":TL("Recording",lang),()=>startNoteRec(n.id)],["⌨️",lang==="tr"?"Sesli yazma":TL("Voice typing",lang),()=>{setNoteSheet(null);startVoice((txt)=>{const el=editableRef.current;if(!el)return;el.focus();
  // place the caret at the very end so dictated text is appended, not inserted at a stale caret
  try{const range=document.createRange();range.selectNodeContents(el);range.collapse(false);const sel=window.getSelection();sel.removeAllRanges();sel.addRange(range);}catch(e){}
  const pad=(el.textContent&&!el.textContent.endsWith(" ")?" ":"");
  try{document.execCommand("insertText",false,pad+txt);}catch(e){el.innerHTML=(el.innerHTML||"")+pad+txt;}
  el.dispatchEvent(new Event("input",{bubbles:true}));});}],["☑️",lang==="tr"?"Onay kutuları":TL("Checkboxes",lang),()=>toggleChecklist(n)]].map(([ic,lb,fn])=><button key={lb} onClick={fn} style={sheetRow}><span style={{fontSize:20,width:24,textAlign:"center",flexShrink:0}}>{ic}</span>{lb}</button>)}</div>}
            {noteSheet==="color"&&<div style={{...sheetBox,padding:"10px"}}>
              <div style={{fontWeight:700,fontSize:fs-1,marginBottom:8}}>{lang==="tr"?"Renk":TL("Color",lang)}</div>
              <div style={{display:"flex",gap:10,overflowX:"auto",paddingBottom:10}}>{NCOLS.map(c=>{const sel=n.color===c.k||(c.k==="default"&&(!n.color||n.color==="default"));const sw=c.k==="default"?(dark?"#202124":"#fff"):(dark?c.d:c.l);return <button key={c.k} onClick={()=>setNotes(p=>p.map(x=>x.id===n.id?{...x,color:c.k}:x))} aria-label={c.k} style={{width:42,height:42,borderRadius:21,background:sw,border:sel?`3px solid ${ac}`:`2px solid ${dark?"#ffffff2e":"#00000022"}`,cursor:"pointer",flexShrink:0,color:dark?"#fff":"#333",fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17}}>{sel?"✓":(c.k==="default"?"🚫":"")}</button>;})}</div>
              <div style={{fontWeight:700,fontSize:fs-1,margin:"2px 0 8px"}}>{lang==="tr"?"Arka plan":TL("Background",lang)}</div>
              <div style={{display:"flex",gap:10,overflowX:"auto"}}>{NOTE_BGS.map(bgp=><button key={bgp.k} onClick={()=>setNotes(p=>p.map(x=>x.id===n.id?{...x,bg:bgp.k==="none"?null:bgp.k}:x))} aria-label={bgp.k} style={{width:48,height:48,borderRadius:24,background:bgp.g||(dark?"#0a0e14":"#eee"),border:((n.bg||"none")===bgp.k)?`3px solid ${ac}`:`2px solid ${bd}`,cursor:"pointer",flexShrink:0,color:tc,fontSize:17}}>{bgp.k==="none"?"🚫":""}</button>)}</div>
            </div>}
            {noteSheet==="more"&&<div style={sheetBox}>
              <div style={{fontSize:fs-2,color:mt,padding:"6px 16px 8px"}}>{lang==="tr"?"Az önce düzenlendi":TL("Edited just now",lang)}</div>
              {[["🗑️",lang==="tr"?"Sil":TL("Delete",lang),()=>{trashNote(n);setEditNote(null);setNoteSheet(null);}],["📋",lang==="tr"?"Kopya oluştur":TL("Make a copy",lang),()=>duplicateNote(n)],["📤",lang==="tr"?"Gönder":TL("Send",lang),()=>shareNote(n)],["👥",lang==="tr"?"Ortak çalışan":TL("Collaborator",lang),()=>{notify(lang==="tr"?"Ortak çalışma yakında — hesap/sunucu gerekli":TL("Collaboration coming soon — needs account/server",lang));setNoteSheet(null);}],["🏷️",lang==="tr"?"Etiketler":TL("Labels",lang),()=>{const l=prompt(lang==="tr"?"Etiket adı:":TL("Label name:",lang));if(l&&l.trim())setNotes(p=>p.map(x=>x.id===n.id?{...x,labels:[...new Set([...(x.labels||[]),l.trim()])]}:x));setNoteSheet(null);}],["❓",lang==="tr"?"Yardım ve geri bildirim":TL("Help & feedback",lang),()=>{setNoteSheet(null);setEditNote(null);goTo("admin");}]].map(([ic,lb,fn])=><button key={lb} onClick={fn} style={sheetRow}><span style={{fontSize:20,width:24,textAlign:"center",flexShrink:0}}>{ic}</span>{lb}</button>)}
            </div>}
            {noteSheet==="format"?<div style={{display:"flex",alignItems:"center",gap:2,padding:"6px",borderTop:`1px solid ${dark?bd:"#00000018"}`,flexShrink:0,background:cbg,justifyContent:"center"}}>
              <button onMouseDown={noP} onClick={()=>fmt("formatBlock","H1")} style={fbtn(blk==="h1")}>H1</button>
              <button onMouseDown={noP} onClick={()=>fmt("formatBlock","H2")} style={fbtn(blk==="h2")}>H2</button>
              <button onMouseDown={noP} onClick={()=>fmt("formatBlock","div")} style={fbtn(blk!=="h1"&&blk!=="h2")}>Aa</button>
              <span style={{width:1,height:26,background:bd,margin:"0 8px"}}/>
              <button onMouseDown={noP} onClick={()=>fmt("bold")} style={fbtn(fmtState.b,{fontWeight:800})}>B</button>
              <button onMouseDown={noP} onClick={()=>fmt("italic")} style={fbtn(fmtState.i,{fontStyle:"italic"})}>I</button>
              <button onMouseDown={noP} onClick={()=>fmt("underline")} style={fbtn(fmtState.u,{textDecoration:"underline"})}>U</button>
              <span style={{width:1,height:26,background:bd,margin:"0 8px"}}/>
              <button onMouseDown={noP} onClick={()=>setNoteSheet(null)} aria-label={lang==="tr"?"Kapat":TL("Close",lang)} style={fbtn(false)}>✕</button>
            </div>:<div style={{display:"flex",alignItems:"center",gap:2,padding:"6px 8px",borderTop:`1px solid ${dark?bd:"#00000018"}`,flexShrink:0,background:cbg}}>
              <button onClick={()=>setNoteSheet(noteSheet==="add"?null:"add")} aria-label={lang==="tr"?"Ekle":TL("Add",lang)} style={{...tbBtn,background:noteSheet==="add"?active:"none"}}>{svgIco(ICO.add)}</button>
              <button onClick={()=>setNoteSheet(noteSheet==="color"?null:"color")} aria-label={lang==="tr"?"Renk ve arka plan":TL("Color & background",lang)} style={{...tbBtn,background:noteSheet==="color"?active:"none"}}>{svgIco(ICO.palette)}</button>
              <button onMouseDown={noP} onClick={()=>setNoteSheet("format")} aria-label={lang==="tr"?"Biçimlendirme":TL("Formatting",lang)} style={{...tbBtn,background:noteSheet==="format"?active:"none"}}>{svgIco(ICO.format)}</button>
              <div style={{flex:1}}/>
              <button onMouseDown={noP} onClick={()=>canU&&doUndo(n.id)} aria-label={lang==="tr"?"Geri al":TL("Undo",lang)} style={{...tbBtn,opacity:canU?1:0.3}}>{svgIco(ICO.undo)}</button>
              <button onMouseDown={noP} onClick={()=>canR&&doRedo(n.id)} aria-label={lang==="tr"?"İleri al":TL("Redo",lang)} style={{...tbBtn,opacity:canR?1:0.3}}>{svgIco(ICO.redo)}</button>
              <button onClick={()=>setNoteSheet(noteSheet==="more"?null:"more")} aria-label={lang==="tr"?"Diğer":TL("More",lang)} style={{...tbBtn,background:noteSheet==="more"?active:"none"}}>{svgIco(ICO.more)}</button>
            </div>}
          </div></>);
        })()}
        {noteDraw&&(()=>{
          const D=drawStateRef.current;
          const PAPER="#ffffff";                 // Keep: canvas is always white, chrome is dark
          const CHROME="#202124", ONCHROME="#e8eaed", DIM="#7a7f87";
          const inkDefault="#202124";
          const palette=["#202124","#5f6368","#ffffff","#e63946","#f4511e","#f4a261","#fbbc04","#34a853","#2a9d8f","#1a73e8","#4285f4","#7b1fa2","#b5179e","#795548"];
          const redraw=(el)=>{
            if(!el||!el._ctx)return;
            const c=el._ctx;
            c.fillStyle=PAPER;c.fillRect(0,0,el.width,el.height);
            for(const st of D.strokes){
              if(st.points.length<2)continue;
              c.globalAlpha=st.highlight?0.35:1;
              c.strokeStyle=st.erase?PAPER:st.color;
              c.lineWidth=st.size;c.lineCap="round";c.lineJoin="round";
              c.beginPath();c.moveTo(st.points[0][0],st.points[0][1]);
              for(let i=1;i<st.points.length;i++)c.lineTo(st.points[i][0],st.points[i][1]);
              c.stroke();
            }
            c.globalAlpha=1;
          };
          const bump=()=>setDrawTick(t=>t+1);
          const pickTool=(name,size,highlight)=>{
            // tapping the already-selected tool toggles the colour strip (Keep behaviour)
            if(D.tool===name&&!D.erase){D.showColors=!D.showColors;}
            else {D.tool=name;D.size=size;D.highlight=!!highlight;D.erase=false;D.showColors=false;}
            bump();
          };
          const tool=(name,label,icon,onClick,active)=>(
            <button onClick={onClick} aria-label={label} title={label}
              style={{background:"none",border:"none",cursor:"pointer",color:active?"#8ab4f8":DIM,fontSize:21,
                width:56,height:52,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:5,padding:0}}>
              <span>{icon}</span>
              <span style={{width:26,height:3,borderRadius:2,background:active?"#8ab4f8":"transparent"}}/>
            </button>
          );
          const penActive=(sz)=>!D.erase&&D.tool==="pen"&&(D.size||6)===sz;
          return <div style={{position:"fixed",inset:0,zIndex:9995,background:CHROME,display:"flex",flexDirection:"column"}}>
            {/* top bar */}
            <div style={{display:"flex",alignItems:"center",padding:"6px 8px",flexShrink:0,background:CHROME}}>
              <button onClick={()=>{const el=drawCanvasRef.current;
                  if(el&&D.strokes.length)saveDrawing(el.toDataURL("image/png"));
                  else setNoteDraw(false);
                  D.strokes=[];D.redo=[];D.showColors=false;}}
                aria-label={lang==="tr"?"Kaydet ve geri dön":TL("Save and go back",lang)}
                style={{background:"none",border:"none",color:ONCHROME,cursor:"pointer",width:46,height:46,fontSize:23}}>←</button>
              <div style={{flex:1}}/>
              <button disabled={!D.strokes.length} onClick={()=>{if(!D.strokes.length)return;D.redo.push(D.strokes.pop());redraw(drawCanvasRef.current);bump();}}
                aria-label={lang==="tr"?"Geri al":TL("Undo",lang)}
                style={{background:"none",border:"none",color:D.strokes.length?ONCHROME:DIM,cursor:"pointer",width:46,height:46,fontSize:21}}>↺</button>
              <button disabled={!D.redo.length} onClick={()=>{if(!D.redo.length)return;D.strokes.push(D.redo.pop());redraw(drawCanvasRef.current);bump();}}
                aria-label={lang==="tr"?"İleri al":TL("Redo",lang)}
                style={{background:"none",border:"none",color:D.redo.length?ONCHROME:DIM,cursor:"pointer",width:46,height:46,fontSize:21}}>↻</button>
              <button onClick={()=>{D.showMenu=!D.showMenu;bump();}} aria-label={lang==="tr"?"Diğer":TL("More",lang)}
                style={{background:"none",border:"none",color:ONCHROME,cursor:"pointer",width:46,height:46,fontSize:20,position:"relative"}}>⋮</button>
            </div>
            {D.showMenu&&<div style={{position:"absolute",top:52,right:10,zIndex:2,background:"#2b2d31",borderRadius:10,padding:6,boxShadow:"0 6px 22px rgba(0,0,0,.5)"}}>
              <button onClick={()=>{D.strokes=[];D.redo=[];D.showMenu=false;redraw(drawCanvasRef.current);bump();}}
                style={{background:"none",border:"none",color:ONCHROME,padding:"10px 16px",cursor:"pointer",display:"block",width:"100%",textAlign:"left",fontSize:fs-1}}>{lang==="tr"?"Tümünü sil":TL("Clear all",lang)}</button>
              <button onClick={()=>{D.strokes=[];D.redo=[];D.showMenu=false;setNoteDraw(false);}}
                style={{background:"none",border:"none",color:ONCHROME,padding:"10px 16px",cursor:"pointer",display:"block",width:"100%",textAlign:"left",fontSize:fs-1}}>{lang==="tr"?"Vazgeç":TL("Discard",lang)}</button>
            </div>}
            {/* white paper */}
            <canvas ref={el=>{
                drawCanvasRef.current=el;
                if(el&&!el._init){
                  el._init=true;
                  const r=el.getBoundingClientRect();
                  const dpr=Math.min(window.devicePixelRatio||1,2);
                  el.width=Math.max(1,Math.round(r.width*dpr));
                  el.height=Math.max(1,Math.round(r.height*dpr));
                  el._scale=dpr;el._ctx=el.getContext("2d");
                  redraw(el);
                }
              }}
              onPointerDown={e=>{const el=e.currentTarget;try{el.setPointerCapture(e.pointerId);}catch(x){}
                if(D.showColors||D.showMenu){D.showColors=false;D.showMenu=false;bump();}
                const r=el.getBoundingClientRect();
                const x=(e.clientX-r.left)*(el.width/r.width),y=(e.clientY-r.top)*(el.height/r.height);
                D.current={color:D.color||inkDefault,size:(D.erase?22:(D.size||6))*(el._scale||1),erase:!!D.erase,highlight:!!D.highlight,points:[[x,y]]};
                el._drawing=true;}}
              onPointerMove={e=>{const el=e.currentTarget;if(!el._drawing||!D.current)return;
                const r=el.getBoundingClientRect();
                const x=(e.clientX-r.left)*(el.width/r.width),y=(e.clientY-r.top)*(el.height/r.height);
                const pts=D.current.points;const last=pts[pts.length-1];
                pts.push([x,y]);
                const c=el._ctx;
                c.globalAlpha=D.current.highlight?0.35:1;
                c.strokeStyle=D.current.erase?PAPER:D.current.color;
                c.lineWidth=D.current.size;c.lineCap="round";c.lineJoin="round";
                c.beginPath();c.moveTo(last[0],last[1]);c.lineTo(x,y);c.stroke();c.globalAlpha=1;}}
              onPointerUp={e=>{const el=e.currentTarget;el._drawing=false;
                if(D.current&&D.current.points.length>1){D.strokes.push(D.current);D.redo=[];bump();}
                D.current=null;}}
              onPointerLeave={e=>{e.currentTarget._drawing=false;}}
              style={{flex:"1 1 0",height:0,width:"100%",background:PAPER,touchAction:"none",display:"block",cursor:"crosshair"}}/>
            {/* colour strip (opens when tapping the active tool) */}
            {D.showColors&&<div style={{flexShrink:0,background:CHROME,display:"flex",gap:14,overflowX:"auto",WebkitOverflowScrolling:"touch",padding:"10px 12px 2px"}}>
              {palette.map(col=>(
                <button key={col} onClick={()=>{D.color=col;D.erase=false;D.showColors=false;bump();}} aria-label={lang==="tr"?"Renk":TL("Color",lang)}
                  style={{width:30,height:30,minWidth:30,borderRadius:"50%",background:col,cursor:"pointer",flexShrink:0,
                    border:(D.color||inkDefault)===col?"3px solid #8ab4f8":(col==="#ffffff"?"1px solid #9aa0a6":"1px solid #5f6368")}}/>
              ))}
            </div>}
            {/* bottom tool bar */}
            <div style={{flexShrink:0,background:CHROME,display:"flex",alignItems:"center",justifyContent:"space-around",padding:"4px 2px 6px"}}>
              {/* Always-visible colour swatch: tapping it opens the palette. Previously the palette
                  only opened by re-tapping the active tool (Keep-style), which users could not find. */}
              <button onClick={()=>{D.showColors=!D.showColors;D.erase=false;bump();}}
                aria-label={lang==="tr"?"Renk seç":TL("Pick colour",lang)} title={lang==="tr"?"Renk":TL("Colour",lang)}
                style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2,background:"none",border:"none",cursor:"pointer",padding:"2px 4px"}}>
                <span style={{width:26,height:26,borderRadius:"50%",background:(D.color||inkDefault),
                  border:D.showColors?"3px solid #8ab4f8":((D.color||inkDefault)==="#ffffff"?"1px solid #9aa0a6":"2px solid #e8eaed"),
                  boxShadow:"0 0 0 1px rgba(0,0,0,.25)"}}/>
                <span style={{fontSize:10,color:"#e8eaed"}}>{lang==="tr"?"Renk":TL("Colour",lang)}</span>
              </button>
              {tool("eraser",lang==="tr"?"Silgi":TL("Eraser",lang),"🧽",()=>{D.erase=true;D.showColors=false;bump();},!!D.erase)}
              {tool("marker",lang==="tr"?"Marker":TL("Marker",lang),"🖍️",()=>pickTool("marker",18,false),!D.erase&&D.tool==="marker")}
              {tool("pen",lang==="tr"?"Kalem":TL("Pen",lang),"🖊️",()=>pickTool("pen",6,false),penActive(6))}
              {tool("thin",lang==="tr"?"İnce kalem":TL("Thin pen",lang),"✒️",()=>pickTool("pen",3,false),penActive(3))}
              {tool("highlighter",lang==="tr"?"Fosforlu kalem":TL("Highlighter",lang),"🖌️",()=>pickTool("highlighter",22,true),!D.erase&&D.tool==="highlighter")}
            </div>
          </div>;})()}
        {renderGuide()}
        {showFirstAid&&<div style={{position:"fixed",inset:0,zIndex:9997,background:"rgba(0,0,0,.6)",display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={()=>setShowFirstAid(false)}>
          <div onClick={e=>e.stopPropagation()} style={{background:cd,color:tc,width:"100%",maxWidth:520,maxHeight:"92vh",borderRadius:"18px 18px 0 0",display:"flex",flexDirection:"column",overflow:"hidden"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 16px",borderBottom:`1px solid ${bd}`,flexShrink:0}}>
              <span style={{fontWeight:800,fontSize:fs+3}}>🚑 {lang==="tr"?"İlk Yardım":TL("First Aid",lang)}</span>
              <button onClick={()=>setShowFirstAid(false)} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:tc}}>✕</button>
            </div>
            <div style={{padding:"12px 16px",overflowY:"auto"}}>
              <div style={{display:"flex",gap:8,marginBottom:10}}>
                <a href={`tel:${emgNum}`} style={{...BP,flex:1,textAlign:"center",textDecoration:"none",padding:"12px",fontSize:fs+1,fontWeight:800,background:`linear-gradient(135deg,${dg},#c0392b)`}}>📞 {emgNum} {lang==="tr"?"Acil":TL("Emergency",lang)}</a>
                {poisonNum&&<a href={`tel:${poisonNum}`} title={lang==="tr"?"Zehir Danışma":TL("Poison line",lang)} style={{...BP,flex:"0 0 auto",textAlign:"center",textDecoration:"none",padding:"12px 14px",fontSize:fs-1,background:"transparent",border:`1px solid ${bd}`,color:tc}}>☠️ {poisonNum}</a>}
              </div>
              <div style={{fontSize:fs-3,color:tc,background:`${dg}12`,border:`1px solid ${dg}33`,borderRadius:10,padding:"8px 10px",marginBottom:12,lineHeight:1.5}}>⚠️ {lang==="tr"?`Acil durumda ÖNCE ${emgNum}'yi arayın. Bu bilgiler temel yönlendirmedir; profesyonel tıbbi yardımın veya ilk yardım eğitiminin yerine geçmez.`:TL("In an emergency, call 112 FIRST. This is basic guidance and does not replace professional help or first-aid training.",lang).replace(/\b112\b/g,emgNum)}<br/>{lang==="tr"?`Numaralar bulunduğunuz ülkeye (${ctry||"?"}) göre gösterilir; farklıysa yerel acil numaranızı arayın.`:TL("Numbers shown are for your detected country; if different, dial your local emergency number.",lang)}</div>
              {FIRST_AID.map((it,i)=>{const c=(lang==="tr"?it.tr:it.en).map(s=>s.replace(/\b112\b/g,emgNum).replace(/\b114\b/g,poisonNum||emgNum));const open=faOpen===i;return <div key={i} style={{border:`1px solid ${bd}`,borderRadius:12,marginBottom:8,overflow:"hidden"}}>
                <button onClick={()=>setFaOpen(open?null:i)} style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"11px 12px",background:open?`${ac}10`:"transparent",border:"none",cursor:"pointer",color:tc,textAlign:"left"}}>
                  <span style={{fontSize:22,flexShrink:0}}>{it.ic}</span>
                  <span style={{flex:1,fontWeight:700,fontSize:fs-1}}>{c[0]}</span>
                  <span style={{color:mt,fontSize:fs-1,flexShrink:0}}>{open?"▲":"▼"}</span>
                </button>
                {open&&<ol style={{margin:0,padding:"2px 16px 12px 36px",fontSize:fs-1,lineHeight:1.6,color:tc}}>{c.slice(1).map((s,j)=><li key={j} style={{marginBottom:5}}>{s}</li>)}</ol>}
              </div>;})}
              <div style={{fontSize:fs-4,color:mt,textAlign:"center",padding:"6px 0 8px"}}>{lang==="tr"?"Kaynak: genel kabul görmüş ilk yardım ilkeleri. Ülkenizin acil numarası farklı olabilir.":TL("Source: widely accepted first-aid principles. Your local emergency number may differ.",lang)}</div>
            </div>
          </div>
        </div>}
        {pulseM&&<div style={{position:"fixed",inset:0,zIndex:9998,background:"rgba(0,0,0,.85)",display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={pulseM.phase!=="measuring"&&pulseM.phase!=="init"?closePulse:undefined}>
          <div onClick={e=>e.stopPropagation()} style={{background:cd,color:tc,width:"100%",maxWidth:360,borderRadius:18,padding:22,textAlign:"center",border:`1px solid ${dg}`}}>
            <div style={{fontSize:44,marginBottom:8,animation:(pulseM.phase==="measuring")?"pulse 1s infinite":"none"}}>❤️</div>
            <div style={{fontWeight:700,fontSize:fs+2,marginBottom:6}}>{pulseM.hrv?(lang==="tr"?"Nabız + HRV":TL("Pulse + HRV",lang)):(lang==="tr"?"Nabız Ölçümü":TL("Pulse Measurement",lang))}</div>
            {(pulseM.phase==="init")&&<div style={{color:mt,fontSize:fs-1}}>{lang==="tr"?"Kamera açılıyor…":TL("Opening camera…",lang)}</div>}
            {pulseM.phase==="measuring"&&<>
              <div style={{fontSize:fs-2,color:mt,marginBottom:10,lineHeight:1.5}}>{lang==="tr"?"Parmağının ucunu arka kameraya ve flaşa hafifçe kapat, sabit tut.":TL("Gently cover the rear camera and flash with your fingertip, hold still.",lang)}</div>
              <div style={{height:10,borderRadius:6,background:`${mt}33`,overflow:"hidden"}}><div style={{height:"100%",width:`${pulseM.progress||0}%`,background:`linear-gradient(90deg,${dg},#c0392b)`,transition:"width .2s"}}/></div>
              <div style={{fontSize:fs-2,color:mt,marginTop:6}}>%{pulseM.progress||0} · {Math.max(0,Math.ceil((100-(pulseM.progress||0))/100*((pulseM.dur||20000)/1000)))} {lang==="tr"?"sn":TL("s",lang)}</div>
              <div style={{fontSize:fs-3,color:mt,marginTop:6}}>{pulseM.torch?(lang==="tr"?"🔦 Flaş açık":TL("🔦 Flash on",lang)):(lang==="tr"?"🔦 Flaş yok — iyi ışıkta ölçün":TL("🔦 No flash — measure in good light",lang))}</div>
            </>}
            {pulseM.phase==="done"&&<>
              <div style={{fontSize:40,fontWeight:800,color:dg}}>{pulseM.bpm} <span style={{fontSize:fs}}>{t.bpm}</span></div>
              {(()=>{const q=pulseM.quality;const L=q==="excellent"?(lang==="tr"?"mükemmel ✓✓":TL("excellent ✓✓",lang)):q==="good"?(lang==="tr"?"iyi ✓":TL("good ✓",lang)):q==="fair"?(lang==="tr"?"orta":TL("fair",lang)):(lang==="tr"?"düşük — tekrar dene":TL("poor — retry",lang));return <div style={{fontSize:fs-2,color:mt,marginTop:4}}>{lang==="tr"?"Sinyal kalitesi":TL("Signal quality",lang)}: {L} · {lang==="tr"?"güven":TL("conf",lang)} %{pulseM.conf}{pulseM.fps?` · ${pulseM.fps} fps`:""}</div>;})()}
              {pulseM.hrvRmssd!=null&&<div style={{fontSize:fs-2,color:acTx,marginTop:6}}>HRV · RMSSD {pulseM.hrvRmssd} ms · SDNN {pulseM.hrvSdnn} ms{pulseM.beats?` · ${pulseM.beats} ${lang==="tr"?"atım":TL("beats",lang)}`:""}</div>}
              {pulseM.respRate!=null&&<div style={{fontSize:fs-2,color:acTx,marginTop:4}}>{lang==="tr"?"Solunum (tahmini)":TL("Respiration (est.)",lang)}: {pulseM.respRate} {lang==="tr"?"/dk":TL("/min",lang)}</div>}
              {pulseM.wantHrv&&pulseM.hrvRmssd==null&&<div style={{fontSize:fs-3,color:mt,marginTop:6}}>{pulseM.hrvNote==="short"?(lang==="tr"?"HRV için ≥45 sn iyi sinyal gerekir.":TL("HRV needs ≥45s of good signal.",lang)):(lang==="tr"?"HRV: yeterli/kararlı atım bulunamadı — sabit tutup tekrar dene.":TL("HRV: not enough stable beats — hold still and retry.",lang))}</div>}
              <div style={{fontSize:fs-2,color:sc,marginTop:6}}>{lang==="tr"?"Sağlık verilerine kaydedildi. AILVIE yorumluyor…":TL("Saved. AILVIE is interpreting…",lang)}</div>
            </>}
            {pulseM.phase==="error"&&<div style={{color:dg,fontSize:fs-1,lineHeight:1.5}}>{pulseM.msg}</div>}
            <div style={{fontSize:fs-4,color:mt,marginTop:12,lineHeight:1.5}}>⚠️ {lang==="tr"?"Sadece sağlıklı yaşam takibi içindir, tıbbi teşhis değildir. Kesin değer için tıbbi cihaz veya hekiminizi kullanın.":TL("For wellness tracking only. Not a medical diagnosis. For accuracy use a medical device or consult your doctor.",lang)}</div>
            <div style={{display:"flex",gap:8,marginTop:14}}>
              {(pulseM.phase==="done"||pulseM.phase==="error")&&<button onClick={()=>startPulseMeasure(false,pulseM.hrv)} style={{...BP,flex:1,padding:"9px"}}>{lang==="tr"?"Tekrar Ölç":TL("Measure again",lang)}</button>}
              <button onClick={closePulse} style={{...BP,flex:1,padding:"9px",background:mt}}>{pulseM.phase==="measuring"||pulseM.phase==="init"?(lang==="tr"?"İptal":TL("Cancel",lang)):(lang==="tr"?"Kapat":TL("Close",lang))}</button>
            </div>
          </div>
        </div>}
        {isLocked&&<div style={{position:"fixed",inset:0,zIndex:9999,background:`linear-gradient(160deg,${ac},${a2})`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:24,padding:24}}>
          <div style={{fontSize:64}}>🔒</div>
          <div style={{textAlign:"center",color:"#fff"}}>
            <div style={{fontSize:fs+8,fontWeight:800,marginBottom:6}}>{t.unlockTitle}</div>
            <div style={{fontSize:fs,opacity:0.85}}>{t.unlockDesc}</div>
          </div>
          <button onClick={unlockApp} style={{background:"#fff",color:acTx,border:"none",borderRadius:14,padding:"14px 32px",fontSize:fs+2,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:8,boxShadow:"0 4px 16px rgba(0,0,0,.2)"}}>
            👆 {t.unlockBtn}
          </button>
          <div style={{position:"absolute",bottom:30,color:"rgba(255,255,255,.7)",fontSize:fs-2,textAlign:"center"}}>AILVIE</div>
        </div>}
        {/* HEADER */}
        <div style={{background:`linear-gradient(135deg,${ac},${a2})`,padding:"2px 10px",paddingTop:"max(env(safe-area-inset-top),2px)",display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
          <div style={{display:"flex",alignItems:"flex-end",gap:6,flex:1,minWidth:0}}>
            <button onClick={()=>setShowMenu(true)} aria-label={lang==="tr"?"Menü":TL("Menu",lang)} style={{background:"none",border:"none",color:"#fff",fontSize:22,cursor:"pointer",padding:0,flexShrink:0,alignSelf:"center"}}>☰</button>
            <img src="/avatar2-256.webp" alt="AILVIE" style={{height:60,width:51,objectFit:"contain",flexShrink:0,borderRadius:6}} />
            <div onClick={()=>goTo("home")} title={t.home} role="button" style={{display:"flex",flexDirection:"column",justifyContent:"flex-end",lineHeight:1,minWidth:0,cursor:"pointer"}}>
              <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:35,color:"#e8a817",letterSpacing:3,WebkitTextStroke:"1px #e8a817",textShadow:"0 2px 6px rgba(0,0,0,0.5)",textAlign:"center"}}>AILVIE</div>
              <div style={{fontSize:10.5,color:"rgba(255,255,255,0.92)",letterSpacing:0,fontWeight:500,marginTop:1,whiteSpace:"nowrap",textAlign:"center"}}>{t.sl}</div>
            </div>
          </div>
          <div style={{display:"flex",gap:5,alignItems:"center",flexShrink:0}}>
            <button onClick={goBack} aria-label="Geri" style={{background:histIdx>0?"rgba(232,168,23,0.18)":"rgba(120,120,120,0.10)",border:histIdx>0?"1.5px solid rgba(232,168,23,0.55)":"1px solid rgba(120,120,120,0.25)",borderRadius:"50%",padding:5,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",filter:"drop-shadow(0 2px 5px rgba(0,0,0,0.55))"}}>
              <svg width="30" height="30" viewBox="4.2 -3.3 23.8 23.8" fill="none" stroke={histIdx>0?"#ffc94d":"#9c7e2c"} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><g transform="rotate(-55 15 15)"><path d="M19.1 4.8 A 11 11 0 0 1 19.1 25.2"/><path d="M16.3 3.3 L19.1 4.8"/><path d="M19.0 10.8 L16.3 3.3 L24.1 1.4"/></g></svg>
            </button>
            <button onClick={()=>{if(voiceActive)stopVoiceMode();else startVoiceMode(true);}} aria-label={t.voiceOn} style={{background:"none",border:"none",color:voiceActive?"#e8a817":"#e8a817",fontSize:27,cursor:"pointer",padding:0,animation:voiceActive?"micPulse 2s infinite":"none",opacity:1,filter:"drop-shadow(0 1px 3px rgba(0,0,0,0.55))"}}>🎙️</button>
            <button onClick={()=>setShowNotif(!showNotif)} aria-label={t.notif} style={{background:"none",border:"none",color:"#fff",fontSize:25,cursor:"pointer",padding:0,position:"relative"}}>🔔{unread>0&&<span style={{position:"absolute",top:-4,right:-6,width:16,height:16,borderRadius:"50%",background:dg,color:"#fff",fontSize:10,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>{unread}</span>}</button>
          </div>
        </div>


        {/* ZOOM CONTROLS — transparent, draggable (user can move anywhere).
            Hidden during the voice chat so they don't overlap the AILVIE face panel. */}
        {!(voiceActive&&page==="chat")&&<div
          style={{position:"absolute",top:zoomPos.top,right:zoomPos.right,zIndex:90,display:"flex",flexDirection:"column",gap:8,alignItems:"center",touchAction:"none"}}
          onTouchStart={(e)=>{const t=e.touches[0];zoomDrag.current={active:true,moved:false,startX:t.clientX,startY:t.clientY,startTop:zoomPos.top,startRight:zoomPos.right};}}
          onTouchMove={(e)=>{if(!zoomDrag.current.active)return;const t=e.touches[0];const dx=t.clientX-zoomDrag.current.startX;const dy=t.clientY-zoomDrag.current.startY;if(Math.abs(dx)>3||Math.abs(dy)>3)zoomDrag.current.moved=true;const newTop=Math.max(48,Math.min(window.innerHeight-180,zoomDrag.current.startTop+dy));const newRight=Math.max(4,Math.min(window.innerWidth-50,zoomDrag.current.startRight-dx));setZoomPos({top:newTop,right:newRight});}}
          onTouchEnd={()=>{if(zoomDrag.current.moved){try{localStorage.setItem("ailvie_zoompos",JSON.stringify(zoomPos));}catch{}}zoomDrag.current.active=false;}}
        >
          <div title={lang==="tr"?"Taşımak için basılı tutup sürükle":TL("Hold & drag to move",lang)} style={{width:38,height:38,borderRadius:19,background:"transparent",border:`2px solid ${ac}`,color:acTx,fontSize:23,fontWeight:800,cursor:"grab",display:"flex",alignItems:"center",justifyContent:"center",lineHeight:1,padding:0,textShadow:dark?"0 1px 3px rgba(0,0,0,.6)":"0 1px 3px rgba(255,255,255,.6)"}} role="button" tabIndex={0} aria-label={lang==="tr"?"Yakınlaştır":TL("Zoom in",lang)} onClick={()=>{if(!zoomDrag.current.moved)setZoom(z=>Math.min(Math.round((z+0.1)*10)/10,1.5));}}>+</div>
          <div title={lang==="tr"?"Taşımak için basılı tutup sürükle":TL("Hold & drag to move",lang)} style={{width:38,height:38,borderRadius:19,background:"transparent",border:`2px solid ${ac}`,color:acTx,fontSize:26,fontWeight:800,cursor:"grab",display:"flex",alignItems:"center",justifyContent:"center",lineHeight:1,padding:0,textShadow:dark?"0 1px 3px rgba(0,0,0,.6)":"0 1px 3px rgba(255,255,255,.6)"}} role="button" tabIndex={0} aria-label={lang==="tr"?"Uzaklaştır":TL("Zoom out",lang)} onClick={()=>{if(!zoomDrag.current.moved)setZoom(z=>Math.max(Math.round((z-0.1)*10)/10,1));}}>−</div>
          {zoom!==1&&<div title={lang==="tr"?"Sıfırla":TL("Reset",lang)} style={{width:38,height:38,borderRadius:19,background:"transparent",border:`2px solid ${ac}`,color:acTx,fontSize:13,fontWeight:800,cursor:"grab",display:"flex",alignItems:"center",justifyContent:"center",lineHeight:1,padding:0,textShadow:dark?"0 1px 3px rgba(0,0,0,.6)":"0 1px 3px rgba(255,255,255,.6)"}} role="button" tabIndex={0} aria-label={lang==="tr"?"Sıfırla":TL("Reset zoom",lang)} onClick={()=>{if(!zoomDrag.current.moved)setZoom(1);}}>{zoom.toFixed(1)}x</div>}
        </div>}

        {/* LEFT SIDE MENU — compact */}
        {showMenu&&<>
          <div onClick={()=>setShowMenu(false)} style={{position:"absolute",inset:0,background:"rgba(0,0,0,.45)",zIndex:400,animation:"fadeIn .2s"}}/>
          <div style={{position:"absolute",top:0,left:0,width:"60%",maxWidth:240,maxHeight:"85%",background:cd,zIndex:450,padding:"0",display:"flex",flexDirection:"column",boxShadow:"4px 0 24px rgba(0,0,0,.4)",animation:"slideRight .25s ease-out",borderRadius:"0 0 12px 0",overflow:"hidden"}}>
            {/* Header */}
            <div style={{padding:"10px 14px 8px",background:`linear-gradient(135deg,${ac},${a2})`,display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
              <img src="/avatar2-256.webp" alt="" style={{width:36,height:36,objectFit:"cover",borderRadius:6,flexShrink:0}} />
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:16,color:"#e8a817",letterSpacing:2,lineHeight:1}}>AILVIE</div>
                <div style={{fontSize:11,color:"rgba(255,255,255,.8)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{pat.name||t.profile}</div>
              </div>
              <button onClick={()=>setShowMenu(false)} style={{background:"none",border:"none",color:"#fff",fontSize:18,cursor:"pointer",padding:0,flexShrink:0}}>✕</button>
            </div>
            {/* Status — data is local */}
            <div style={{padding:"6px 14px",fontSize:11,color:sc,borderBottom:`1px solid ${bd}`,display:"flex",alignItems:"center",gap:4}}>🔒 {t.dataLocal}</div>
            {/* Menu Items */}
            <div style={{padding:"4px 0",overflowY:"auto",flex:1}}>
            {[
              {icon:"🏠",label:t.home,action:()=>{goTo("home");setShowMenu(false);}},
              (acctEmail.trim()
                ? {icon:"👤",label:(lang==="tr"?"Hesabım":TL("My account",lang))+" — "+acctEmail,action:()=>{setSettingsTab("subs");goTo("settings");setShowMenu(false);}}
                : {icon:"🔑",label:({tr:"Giriş Yap / Abone Ol",en:"Sign in / Subscribe",de:"Anmelden / Abonnieren",ru:"Войти / Подписка",zh:"登录 / 订阅",hi:"साइन इन / सदस्यता",nl:"Inloggen / Abonneren",es:"Iniciar sesión / Suscribirse",ar:"تسجيل الدخول / اشتراك"}[lang]||"Sign in / Subscribe"),action:()=>{setSettingsTab("subs");goTo("settings");setShowMenu(false);}}),
              null,
              {icon:"👤",label:t.profile,action:()=>{goTo("health");setShowMenu(false);}},
              {icon:"🚑",label:lang==="tr"?"İlk Yardım":TL("First Aid",lang),action:()=>{setShowMenu(false);setFaOpen(null);setShowFirstAid(true);}},
              {icon:"🧭",label:lang==="tr"?"Navigasyon":TL("Navigation",lang),action:()=>{setShowMenu(false);setShowNav(true);}},
              {icon:"🌍",label:t.lang,action:()=>{setShowMenu(false);setShowLangPicker(true);}},
              {icon:dark?"☀️":"🌙",label:dark?t.light:t.dark,action:()=>{setDark(!dark);}},
              {icon:appLockEnabled?"🔓":"🔒",label:appLockEnabled?t.lockOn:t.appLock,action:()=>{setShowMenu(false);if(appLockEnabled)disableAppLock();else enableAppLock();}},
              null,
              {icon:"🛡️",label:t.permissions,action:()=>{setSettingsTab("perms");goTo("settings");setShowMenu(false);}},
              {icon:"💎",label:t.subscription,action:()=>{setSettingsTab("subs");goTo("settings");setShowMenu(false);}},
              {icon:"🗑️",label:t.trash,action:()=>{setSettingsTab("trash");goTo("settings");setShowMenu(false);}},
              null,
              {icon:"⚖️",label:t.legal,action:()=>{setSettingsTab("legal");goTo("settings");setShowMenu(false);}},
              {icon:"📜",label:t.privPolicy,action:()=>{goTo("privacy");setShowMenu(false);}},
              {icon:"📋",label:t.terms,action:()=>{goTo("terms");setShowMenu(false);}},
              null,
              {icon:"ℹ️",label:t.about+" — v9.1",action:()=>{goTo("about");setShowMenu(false);}},
              {icon:"⚙️",label:t.settings,action:()=>{setSettingsTab("all");goTo("settings");setShowMenu(false);}}].map((item,idx)=>(
              item===null?<div key={`d${idx}`} style={{height:1,background:bd,margin:"2px 14px"}}/>:
              <button key={idx} onClick={item.action} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 14px",background:"none",border:"none",color:tc,cursor:"pointer",width:"100%",textAlign:"left",fontSize:fs-1,transition:"background .15s"}} onMouseOver={e=>e.currentTarget.style.background=`${ac}11`} onMouseOut={e=>e.currentTarget.style.background="transparent"}>
                <span style={{fontSize:15,width:20,textAlign:"center"}}>{item.icon}</span>
                <span style={{fontWeight:500}}>{item.label}</span>
              </button>
            ))}
            </div>
          </div>
        </>}

        {/* Screen-reader live region: page changes and status text */}
        <div aria-live="polite" aria-atomic="true" style={{position:"absolute",width:1,height:1,overflow:"hidden",clip:"rect(0 0 0 0)",whiteSpace:"nowrap"}}>{srMsg}</div>
        {/* Toast */}
        {toast&&<div role="status" aria-live="polite" style={{position:"absolute",top:100,left:"50%",transform:"translateX(-50%)",background:cd,color:tc,padding:"10px 20px",borderRadius:12,boxShadow:"0 6px 24px rgba(0,0,0,.3)",zIndex:300,maxWidth:300,border:`1px solid ${ac}`,fontSize:fs,animation:"slideD .3s ease-out",textAlign:"center"}}>{toast}</div>}

        {storageWarn&&<div role="alert" aria-live="assertive" style={{flexShrink:0,background:"#b45309",color:"#fff",fontSize:fs-2,textAlign:"center",padding:"5px 8px"}}>{storageWarn}</div>}
        {/* Offline banner */}
        {!online&&<div role="status" aria-live="polite" style={{flexShrink:0,background:"#b91c1c",color:"#fff",fontSize:fs-2,textAlign:"center",padding:"4px 8px",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>📡 {lang==="tr"?"Çevrimdışısınız — bazı özellikler sınırlı olabilir":TL("You're offline — some features may be limited",lang)}</div>}

        {/* Install / Open-in-app banner (web only, dismissible) */}
        {(()=>{
          const isStandalone=(typeof window!=="undefined")&&(((window.matchMedia&&window.matchMedia("(display-mode: standalone)").matches))||window.navigator.standalone);
          const isIOS=typeof navigator!=="undefined"&&/iphone|ipad|ipod/i.test(navigator.userAgent||"");
          const canPWA=!!installEvt;
          if(isStandalone||installDismissed||!(canPWA||isIOS||PLAY_URL||IOS_URL))return null;
          const dismiss=()=>{try{localStorage.setItem("ailvie_install_dismissed","1");}catch(e){}setInstallDismissed(true);};
          return (
            <div style={{flexShrink:0,margin:"8px 10px 0",background:dark?"#0f1a28":"#eaf4fb",border:`1px solid ${ac}`,borderRadius:12,padding:"10px 12px",display:"flex",flexDirection:"column",gap:8}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <img src="/icon-192.png" alt="" style={{width:34,height:34,borderRadius:8,flexShrink:0}}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontWeight:700,fontSize:fs,color:tc}}>{lang==="tr"?"AILVIE'yi uygulama olarak aç":TL("Open AILVIE as an app",lang)}</div>
                  <div style={{fontSize:fs-3,color:mt}}>{lang==="tr"?"Daha hızlı • çevrimdışı • tam ekran":TL("Faster • offline • full-screen",lang)}</div>
                </div>
                <button onClick={dismiss} style={{background:"none",border:"none",color:mt,fontSize:fs+6,cursor:"pointer",lineHeight:1,padding:"0 4px"}}>×</button>
              </div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {canPWA&&<button onClick={async()=>{try{installEvt.prompt();await installEvt.userChoice;}catch(e){}setInstallEvt(null);}} style={{...BP,flex:1,minWidth:120,padding:"9px"}}>⬇️ {lang==="tr"?"Yükle":TL("Install",lang)}</button>}
                {!canPWA&&isIOS&&<button onClick={()=>setIosHelp(true)} style={{...BP,flex:1,minWidth:140,padding:"9px"}}>⬇️ {lang==="tr"?"Ana ekrana ekle":TL("Add to Home Screen",lang)}</button>}
                {PLAY_URL&&<a href={PLAY_URL} target="_blank" rel="noreferrer" style={{...BP,flex:1,minWidth:110,padding:"9px",textAlign:"center",textDecoration:"none",background:"linear-gradient(135deg,#0f9d58,#0b8043)"}}>▶ Google Play</a>}
                {IOS_URL&&<a href={IOS_URL} target="_blank" rel="noreferrer" style={{...BP,flex:1,minWidth:110,padding:"9px",textAlign:"center",textDecoration:"none",background:"linear-gradient(135deg,#444,#111)"}}> App Store</a>}
              </div>
            </div>
          );
        })()}

        {/* iOS install help */}
        {iosHelp&&<div style={{position:"fixed",inset:0,zIndex:350,background:"rgba(0,0,0,.55)",display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={()=>setIosHelp(false)}>
          <div onClick={e=>e.stopPropagation()} style={{background:cd,width:"100%",maxWidth:380,borderRadius:16,padding:18,border:`1px solid ${ac}`}}>
            <div style={{fontWeight:700,fontSize:fs+2,marginBottom:12}}>📱 {lang==="tr"?"iPhone'a yükleme":TL("Install on iPhone",lang)}</div>
            <div style={{display:"flex",flexDirection:"column",gap:10,fontSize:fs,color:tc}}>
              <div>1. {lang==="tr"?"Safari'de alttaki Paylaş (⬆️) simgesine dokunun":TL("Tap the Share (⬆️) icon in Safari",lang)}</div>
              <div>2. {lang==="tr"?"\"Ana Ekrana Ekle\" seçeneğine dokunun":"Choose \"Add to Home Screen\""}</div>
              <div>3. {lang==="tr"?"\"Ekle\"ye dokunun — AILVIE simgesi ana ekranda görünür":"Tap \"Add\" — the AILVIE icon appears on your home screen"}</div>
            </div>
            <button onClick={()=>setIosHelp(false)} style={{...BP,width:"100%",marginTop:16}}>{lang==="tr"?"Anladım":TL("Got it",lang)}</button>
          </div>
        </div>}

        {/* Content */}
        <div style={{flex:"1 1 0",minHeight:0,height:0,overflowY:page==="chat"?"hidden":"auto",overflowX:"hidden",padding:page==="chat"?"10px 12px 8px":"10px 12px 24px",display:page==="chat"?"flex":"block",flexDirection:"column",WebkitOverflowScrolling:"touch",cursor:"default",zoom:page==="chat"?1:zoom}} role="main" id="ailvie-main" tabIndex={-1} aria-label={pageTitle(page)} ref={mainRef} onClick={(e)=>{if(e.target===e.currentTarget){setEditNote(null);setNOpen(false);setShowAddMed(false);setShowAddAppt(false);setShowAddC(false);setShowWordLangPicker(false);setSelDate(null);}}}>{pages[page]?.()}</div>

        {/* Notif Panel */}
        {showNotif&&<><div onClick={()=>setShowNotif(false)} style={{position:"absolute",inset:0,zIndex:249}}/><div style={{position:"absolute",bottom:86,left:0,right:0,maxHeight:"50%",background:cd,borderRadius:"16px 16px 0 0",boxShadow:"0 -6px 24px rgba(0,0,0,.3)",zIndex:250,padding:"14px 16px",overflowY:"auto"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}><span style={{fontWeight:700}}>🔔 {t.notif}</span><div style={{display:"flex",gap:8,alignItems:"center"}}><button onClick={()=>{setShowNotif(false);setShowAlerts(true);}} style={{fontSize:fs-3,color:dg,background:"none",border:`1px solid ${dg}55`,borderRadius:8,padding:"2px 8px",cursor:"pointer",fontWeight:700}}>⚠️ {lang==="tr"?"UYARILAR":TL("ALERTS",lang)}</button><button onClick={()=>setNotifs(p=>p.map(n=>({...n,read:true})))} aria-label={lang==="tr"?"Tümünü okundu işaretle":TL("Mark all read",lang)} style={{fontSize:fs-2,color:acTx,background:"none",border:"none",cursor:"pointer"}}>✓</button><button onClick={()=>setNotifs([])} aria-label={lang==="tr"?"Bildirimleri temizle":TL("Clear notifications",lang)} style={{fontSize:fs-2,color:dg,background:"none",border:"none",cursor:"pointer"}}>✕</button><button onClick={()=>setShowNotif(false)} aria-label={lang==="tr"?"Kapat":TL("Close",lang)} style={{background:"none",border:"none",fontSize:16,cursor:"pointer",color:tc}}>✕</button></div></div>{notifs.length===0&&<div style={{textAlign:"center",color:mt,padding:16}}>—</div>}{notifs.map(n=><div key={n.id} style={{padding:"6px 0",borderBottom:`1px solid ${bd}`,opacity:n.read?0.4:1}}><div>{n.text}</div><div style={{fontSize:fs-3,color:mt}}>{n.time}</div></div>)}</div></>}
        {/* Big red half-screen health alert overlay */}
        {activeAlert&&<div onClick={()=>{setActiveAlert(null);setShowAlerts(true);}} style={{position:"fixed",inset:0,zIndex:400,background:"rgba(0,0,0,.78)",display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
          <div style={{width:"100%",maxWidth:460,minHeight:"50vh",background:"linear-gradient(160deg,#e63946,#b71c2c)",borderRadius:22,boxShadow:"0 14px 44px rgba(0,0,0,.55)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",padding:"26px 18px",border:"3px solid rgba(255,255,255,.28)"}}>
            <div style={{fontSize:82,lineHeight:1}}>❗</div>
            <div style={{fontSize:32,fontWeight:900,color:"#fff",letterSpacing:1,marginTop:6,textShadow:"0 2px 8px rgba(0,0,0,.45)"}}>{activeAlert.icon} {activeAlert.title}</div>
            <div style={{fontSize:22,fontWeight:700,color:"#fff",marginTop:14,lineHeight:1.35}}>{activeAlert.msg}</div>
            <div style={{fontSize:fs-1,color:"rgba(255,255,255,.8)",marginTop:18}}>{lang==="tr"?"Tüm uyarılar için dokun":TL("Tap for all alerts",lang)}</div>
            <div style={{display:"flex",gap:10,marginTop:22,width:"100%"}}>
              <button onClick={e=>{e.stopPropagation();setActiveAlert(null);setShowAlerts(true);}} style={{flex:1,padding:"14px",borderRadius:13,border:"none",background:"#fff",color:"#b71c2c",fontSize:fs+1,fontWeight:900,cursor:"pointer"}}>{lang==="tr"?"UYARILAR":TL("ALERTS",lang)}</button>
              <button onClick={e=>{e.stopPropagation();setActiveAlert(null);}} style={{flex:1,padding:"14px",borderRadius:13,border:"2px solid #fff",background:"transparent",color:"#fff",fontSize:fs+1,fontWeight:800,cursor:"pointer"}}>{lang==="tr"?"Tamam":TL("OK",lang)}</button>
            </div>
          </div>
        </div>}
        {/* Full ALERTS window */}
        {showAlerts&&(()=>{const W=getActiveWarnings();return <div style={{position:"fixed",inset:0,zIndex:395,background:"rgba(0,0,0,.6)",display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={()=>setShowAlerts(false)}>
          <div onClick={e=>e.stopPropagation()} style={{background:cd,width:"100%",maxWidth:520,maxHeight:"82vh",overflow:"auto",borderRadius:"18px 18px 0 0",padding:16}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}><b style={{fontSize:fs+4,color:dg,letterSpacing:1}}>⚠️ {lang==="tr"?"UYARILAR":TL("ALERTS",lang)}{W.length?` (${W.length})`:""}</b><button onClick={()=>setShowAlerts(false)} style={{background:"none",border:"none",color:mt,fontSize:22,cursor:"pointer"}}>✕</button></div>
            {W.length===0&&<div style={{textAlign:"center",color:mt,padding:"30px 0",fontSize:fs}}>✅ {lang==="tr"?"Şu an bekleyen uyarı yok":TL("No active alerts",lang)}</div>}
            {W.map(w=><div key={w.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px",borderRadius:12,marginBottom:8,background:w.high?dg+"1a":"transparent",border:`1.5px solid ${w.high?dg:bd}`}}>
              <span style={{fontSize:30}}>{w.icon}</span>
              <div style={{flex:1,minWidth:0}}><div style={{fontSize:fs+1,fontWeight:800,color:w.high?dg:tc}}>{w.title}</div><div style={{fontSize:fs-2,color:w.high?dg:mt,marginTop:2}}>{w.high?"❗ ":""}{w.sub}</div></div>
              {w.kind==="med"&&<button onClick={()=>setMeds(p=>p.map(m=>m.id===w.ref.id?{...m,taken:true}:m))} style={{padding:"7px 12px",borderRadius:10,border:"none",background:sc,color:onAc,fontWeight:700,fontSize:fs-2,cursor:"pointer",flexShrink:0}}>{lang==="tr"?"Aldım":TL("Taken",lang)}</button>}
              {w.kind==="appt"&&<button onClick={()=>{setShowAlerts(false);goTo("appts");}} style={{padding:"7px 12px",borderRadius:10,border:`1px solid ${ac}`,background:"transparent",color:acTx,fontWeight:700,fontSize:fs-2,cursor:"pointer",flexShrink:0}}>{lang==="tr"?"Git":TL("View",lang)}</button>}
            </div>)}
            <div style={{fontSize:fs-4,color:mt,textAlign:"center",marginTop:8}}>{lang==="tr"?"İlaç · randevu · takvim alarmları":TL("Meds · appointments · calendar alarms",lang)}</div>
          </div>
        </div>;})()}

        {/* Emergency */}
        {showEmergency&&<div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.75)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setShowEmergency(false)}><div onClick={e=>e.stopPropagation()} style={{background:cd,borderRadius:20,padding:20,width:"85%",maxHeight:"80%",overflowY:"auto"}}><div style={{textAlign:"center",marginBottom:12}}><div style={{fontSize:44}}>🚨</div><h3 style={{margin:0,color:dg}}>{t.emergency}</h3></div>{emNums.map(en=>(<a key={en.id} href={`tel:${en.number}`} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 14px",borderRadius:12,background:`${dg}08`,border:`1px solid ${dg}22`,textDecoration:"none",color:tc,marginBottom:6}}><span style={{fontSize:26}}>{en.icon}</span><div style={{flex:1}}><div style={{fontWeight:700}}>{emLabel(en)}</div><div style={{fontSize:fs+2,color:dg,fontWeight:800}}>{en.number}</div></div><span style={{fontSize:22}}>📞</span></a>))}<button onClick={()=>setShowEmergency(false)} style={{...BP,width:"100%",marginTop:8,background:mt}}>{t.cancel}</button></div></div>}

        {/* Language Picker */}
        {showLangPicker&&<div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.4)",zIndex:350}} onClick={()=>setShowLangPicker(false)}><div onClick={e=>e.stopPropagation()} style={{position:"absolute",top:50,right:6,background:cd,borderRadius:14,padding:8,width:210,maxHeight:"80vh",overflowY:"auto",boxShadow:"0 8px 32px rgba(0,0,0,.5)",border:`1px solid ${bd}`}}>
          <div style={{marginBottom:8,fontWeight:700,fontSize:fs,color:acTx}}>🌍 {t.lang}</div>
          {Object.entries(LL).sort((a,b)=>a[0]===lang?-1:b[0]===lang?1:((LL_LOCAL[lang]||LL_LOCAL.en)[a[0]]||a[1]).localeCompare((LL_LOCAL[lang]||LL_LOCAL.en)[b[0]]||b[1],lang)).map(([k,v])=><button key={k} onClick={()=>{setLang(k);try{localStorage.setItem("ailvie_lang",k);}catch(e){}setShowLangPicker(false);}} style={{display:"flex",alignItems:"center",gap:8,width:"100%",padding:"9px 12px",borderRadius:10,border:lang===k?`2px solid ${ac}`:`1px solid ${bd}`,background:lang===k?`${ac}12`:"transparent",marginBottom:4,cursor:"pointer",color:tc,fontSize:fs-1}}>
            <Flag code={k} size={22}/>
            <span style={{fontWeight:lang===k?700:400}}>{(LL_LOCAL[lang]||LL_LOCAL.en)[k]||v}</span>
            {lang===k&&<span style={{marginLeft:"auto",color:acTx}}>✓</span>}
          </button>)}
        </div></div>}

        {/* BOTTOM NAV — compact 2 rows */}
        <nav role="navigation" aria-label={lang==="tr"?"Ana gezinme":TL("Main navigation",lang)} style={{flexShrink:0,background:cd,borderTop:`1px solid ${bd}`,paddingBottom:"max(env(safe-area-inset-bottom),0px)"}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)"}}>
            {nav1.map(n=>(<button key={n.key} aria-current={page===n.key?"page":undefined} onClick={()=>page===n.key?goTo("home"):goTo(n.key)} style={{background:"none",border:"none",padding:"9px 1px 5px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:2,color:page===n.key?acTx:(dark?"#c5cfd9":"#3c4a57"),position:"relative",minWidth:0}}>{page===n.key&&<div style={{position:"absolute",top:0,left:"25%",right:"25%",height:2,borderRadius:1,background:ac}}/>}<span style={{fontSize:21,opacity:1,lineHeight:1}}>{n.icon}</span><span style={{fontSize:11.5,fontWeight:page===n.key?700:600,lineHeight:1.1,textAlign:"center",wordBreak:"break-word",letterSpacing:"-0.01em"}}>{n.label}</span></button>))}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",borderTop:`1px solid ${bd}`}}>
            {nav2.map(n=>(<button key={n.key} aria-current={page===n.key?"page":undefined} onClick={()=>{if(n.onNav)n.onNav();if(n.key==="settings"){if(page==="settings"&&settingsTab==="all")goTo("home");else{setSettingsTab("all");goTo("settings");}}else if(page===n.key)goTo("home");else goTo(n.key);}} style={{background:"none",border:"none",padding:"8px 0 6px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:2,color:page===n.key?acTx:(dark?"#c5cfd9":"#3c4a57"),position:"relative"}}>{page===n.key&&<div style={{position:"absolute",top:0,left:"20%",right:"20%",height:2,borderRadius:1,background:ac}}/>}<span style={{fontSize:21,opacity:1,lineHeight:1}}>{n.icon}</span><span style={{fontSize:11.5,fontWeight:page===n.key?700:600,letterSpacing:"-0.01em"}}>{n.label}</span></button>))}
          </div>
        </nav>

    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@600;700&display=swap');
      @keyframes pulse{0%,100%{opacity:.3}50%{opacity:1}}
      @keyframes slideD{from{transform:translateX(-50%) translateY(-10px);opacity:0}to{transform:translateX(-50%) translateY(0);opacity:1}}
      @keyframes micPulse{0%,100%{box-shadow:0 0 0 0 rgba(230,57,70,.5)}50%{box-shadow:0 0 0 10px rgba(230,57,70,0)}}
      @keyframes aiPulse{0%{transform:scale(0.85);opacity:.5}100%{transform:scale(1.25);opacity:0}}
      @keyframes aiBreathe{0%,100%{transform:scale(1)}50%{transform:scale(1.03)}}
      @keyframes aiTalk{0%,100%{transform:scale(1) translateY(0)}50%{transform:scale(1.02) translateY(-2px)}}
      @keyframes aiSpin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
      @keyframes slideRight{from{transform:translateX(-100%)}to{transform:translateX(0)}}
      @keyframes fadeIn{from{opacity:0}to{opacity:1}}
      @keyframes globeSpin{0%{transform:rotateY(0deg)}100%{transform:rotateY(360deg)}}
      textarea{min-height:36px;max-height:150px;overflow-y:auto;transition:height 0.1s}
      .chat-scroll{scrollbar-gutter:stable}
      .chat-scroll::-webkit-scrollbar{width:10px;-webkit-appearance:none}
      .chat-scroll::-webkit-scrollbar-track{background:rgba(255,255,255,.05);border-radius:5px}
      .chat-scroll::-webkit-scrollbar-thumb{background:rgba(0,180,216,.6);border-radius:5px;border:2px solid transparent;background-clip:padding-box;min-height:40px}
      .chat-scroll::-webkit-scrollbar-thumb:hover{background:rgba(0,180,216,.9);background-clip:padding-box}
      .note-ta{scrollbar-gutter:stable}
      .note-edit::-webkit-scrollbar{width:0;height:0;display:none}
      .note-edit{-ms-overflow-style:none}
      .note-edit:empty:before{content:attr(data-ph);color:${mt};pointer-events:none}
      .note-edit h1{font-size:1.6em;font-weight:700;margin:6px 0 2px}
      .note-edit h2{font-size:1.25em;font-weight:700;margin:5px 0 2px}
      .note-edit u,.note-view u,.note-edit [style*="underline"],.note-view [style*="underline"]{text-decoration-skip-ink:none;text-underline-offset:0.16em;text-decoration-thickness:1.5px}
      @keyframes scanLine{0%{top:10%}50%{top:85%}100%{top:10%}}
      *{box-sizing:border-box;-webkit-tap-highlight-color:transparent;-webkit-touch-callout:none;word-wrap:break-word;overflow-wrap:break-word}
      .msg-card{max-width:100%;overflow-wrap:anywhere;word-break:break-word;hyphens:auto}
      .msg-card *{max-width:100%;overflow-wrap:anywhere;word-break:break-word}
      textarea,input{max-width:100%;word-break:break-word;overflow-wrap:anywhere}
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
