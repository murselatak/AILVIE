# AILVIE — AI Personal Health Assistant

<div align="center">

**AI Kişisel Sağlık Asistanı**

🌍 9 Languages • 💊 Medication Management • 📅 Appointments • 🤖 AI Chat • 📊 Health Tracking

[![Live](https://img.shields.io/badge/Live-ailvie.com-00b4d8)](https://ailvie.com)
[![Cloudflare Pages](https://img.shields.io/badge/Hosted-Cloudflare%20Pages-F38020)](https://ailvie.pages.dev)

</div>

## Features

- **9 Languages**: TR, EN, DE, RU, ZH, HI, NL, ES, AR (auto-detect)
- **Medication Management**: 23 drug database, QR/barcode scanner, pill count, voice alarms
- **Appointment Booking**: MHRS integration, calendar with holidays
- **AI Chat**: Claude Sonnet API powered health assistant
- **Health Tracking**: Pulse, weight, BMI, blood pressure
- **Patient Card**: Medical records, allergies, insurance
- **Notes**: Google Keep-style with color coding
- **Voice Assistant**: Female voice (ResponsiveVoice), speech recognition
- **PWA Ready**: Install as native app
- **KVKK + GDPR**: Privacy compliant
- **TEGV Donation**: Every PRO subscription = $1/month to TEGV education fund

## Subscription Plans

| | Free | PRO | Enterprise |
|---|---|---|---|
| Monthly | $0 | $4.99 | $12.99 |
| Yearly | $0 | $12.99 | $59.99 |
| Ads | Yes | **None** | **None** |
| TEGV | - | $1/mo, $2.99/yr | Included |

## Tech Stack

- React 18 + Vite
- Claude Sonnet API
- ResponsiveVoice.js
- Web Speech API
- localStorage persistence
- Cloudflare Pages

## Development

```bash
npm install
npm run dev        # localhost:5173
npm run build      # production build
npm run preview    # preview production build
```

## Deploy

Cloudflare Pages auto-deploys on push to `main`.

- Build command: `npm run build`
- Output directory: `dist`

## Security

- KVKK (Turkish data protection) compliant
- EU GDPR compliant
- Stripe PCI DSS certified payments
- Data stored locally on device
- AI chat data not persisted

---

© 2025-2026 AILVIE Health Technologies
