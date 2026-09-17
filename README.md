<div align="center">

# 🩺 MediVoice AI

### AI-Powered Medical Voice & Clinical Intelligence Platform

> Connect with 11 specialist AI doctors via real-time voice and text, analyze lab reports, triage symptoms, and manage family health profiles seamlessly.

<img src="https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=nextdotjs&logoColor=white" />
<img src="https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
<img src="https://img.shields.io/badge/TailwindCSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
<br />

<img src="https://img.shields.io/badge/Drizzle_ORM-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black" />
<img src="https://img.shields.io/badge/Neon_Postgres-00E599?style=for-the-badge&logo=neon&logoColor=white" />
<img src="https://img.shields.io/badge/Clerk_Auth-6C47FF?style=for-the-badge&logo=clerk&logoColor=white" />
<img src="https://img.shields.io/badge/Vapi_Voice_AI-5B46E5?style=for-the-badge&logo=vapi&logoColor=white" />
<br />

<img src="https://img.shields.io/badge/Gemini_AI-4285F4?style=for-the-badge&logo=google&logoColor=white" />
<img src="https://img.shields.io/badge/OpenRouter-6566F1?style=for-the-badge&logo=openai&logoColor=white" />
<img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" />

<br /><br />

<a href="https://medi-voice-assistant.vercel.app/" target="_blank">
  <img src="https://img.shields.io/badge/🚀%20Live%20Demo-black?style=for-the-badge&logo=vercel&logoColor=white" />
</a>
<a href="https://github.com/Itssanthoshhere/Medi-Voice-AI" target="_blank">
  <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" />
</a>
<a href="https://santhosh-vs-portfolio.vercel.app" target="_blank">
  <img src="https://img.shields.io/badge/🌐%20Portfolio-000000?style=for-the-badge&logo=vercel&logoColor=white" />
</a>

</div>

---

# 📋 Table of Contents

- [📖 About The Project](#-about-the-project)
- [🎯 Problem It Solves](#-problem-it-solves)
- [✨ Key Features](#-key-features)
- [👨‍⚕️ AI Specialist Doctor Roster](#-ai-specialist-doctor-roster)
- [🧠 Core AI & Voice Workflow](#-core-ai--voice-workflow)
- [🏗️ Architecture & Resilience Layer](#️-architecture--resilience-layer)
- [⚙️ Tech Stack](#️-tech-stack)
- [📂 Project Structure](#-project-structure)
- [🗄️ Database Schema](#️-database-schema)
- [🔌 API Reference](#-api-reference)
- [🚀 Getting Started](#-getting-started)
- [🔐 Environment Variables](#-environment-variables)
- [🛤️ Development Roadmap](#️-development-roadmap)
- [🧪 Future Improvements](#-future-improvements)
- [🤝 Contributing](#-contributing)
- [👨‍💻 Author](#-author)
- [📜 License](#-license)

---

# 📖 About The Project

**MediVoice AI** is a production-grade, AI-first clinical consultation platform designed to revolutionize primary healthcare access. It connects users with **11 specialized AI doctors** through low-latency real-time voice (powered by Vapi) and intelligent text chat fallback (powered by OpenRouter & Google Gemini).

The platform transforms raw patient consultations into structured clinical **SOAP notes** (Subjective, Objective, Assessment, Plan), extracts biomarker anomalies from uploaded lab reports, calculates dynamic personal health scores, triages urgent symptoms, and manages multi-member family health timelines—all within a modern, responsive user experience.

---

# 🎯 Problem It Solves

Traditional primary care access suffers from long wait times, fragmented medical history tracking, expensive specialist consultations, and difficult-to-understand lab test reports.

MediVoice AI bridges this gap by providing:

- 🎙️ **Immediate 24/7 Voice Consultations**: Talk naturally with domain-specialized AI doctors trained in distinct clinical communication styles.
- 📋 **Automated Clinical SOAP Summaries**: Convert spoken dialogues into structured medical records with diagnosis hypotheses and actionable next steps.
- 🧪 **AI Medical Report Vault**: Upload PDF or image lab reports to auto-extract biomarkers, spot out-of-range metrics, and visualize historical health trends.
- 🩺 **Smart Symptom Triage Widget**: Evaluate symptom severity (Emergency, Urgent, Routine) instantly with red-flag detection.
- 👨‍👩‍👧‍👦 **Family Health Profiles**: Manage consultations, lab reports, and timelines for dependents (Spouse, Child, Parent) under a single primary account.

---

# ✨ Key Features

### 🎙️ 1. Real-Time Voice Consultation Engine
- Powered by **Vapi WebRTC SDK** with specialist-tailored voice models (Elliot, Savannah, Clara, Layla, Emma, Sid, Nico, Neil, Naina, Kai, Maya).
- Live transcript stream with real-time speech indicator waveforms.
- Instant fallback to text chat powered by a resilient multi-provider LLM chain.

### 📄 2. AI SOAP Report & Clinical Note Generator
- Automatically generates formatted medical notes following the universal **SOAP framework**:
  - **Subjective**: Patient symptoms, onset, and severity.
  - **Objective**: Reported vitals and physical signs.
  - **Assessment**: Differential diagnoses with probability indicators.
  - **Plan**: Recommended diagnostic tests, lifestyle modifications, and medication advice.
- Includes PDF generation, print summary, and 1-click shareable links.

### 🧪 3. Medical Report Vault & Biomarker Extraction
- Intelligent OCR & LLM analysis of lab test PDFs/images.
- Extracts key health parameters, reference ranges, and flags abnormalities (e.g. elevated HbA1c, low Vitamin D).
- Provides actionable patient-friendly explanations and suggested specialist follow-ups.

### 📈 4. Longitudinal Health Timeline & Health Score
- Aggregates consultations, lab reports, and triage logs into a interactive chronological health timeline.
- Computes a dynamic **MediVoice Health Index Score (0–100)** based on recent symptoms, biomarker stability, and consultation recency.

### 🚨 5. Mental Health Crisis Protocol & Triage
- Automated detection of crisis keywords (self-harm, depression, severe distress).
- Triggers a immediate **Mental Health Crisis Modal** displaying nationwide helpline numbers (988 Crisis Lifeline, Tele-MANAS, Crisis Text Line) alongside dedicated consultation with **Dr. Maya** (Mental Health Counsellor).

### 👨‍👩‍👧‍👦 6. Family Profiles & Dependent Care (Phase 4)
- Multi-member profile switcher for primary user and dependents (`Self`, `Spouse`, `Child`, `Parent`, `Sibling`).
- Scopes consultation histories, lab vaults, and health timelines per family member.

---

# 👨‍⚕️ AI Specialist Doctor Roster

MediVoice AI features **11 domain-specific AI Doctors**, each equipped with dedicated clinical prompt instructions, specialized voice synthesis personas, and custom avatars:

| Avatar | Doctor Name | Specialization | Voice Persona | Key Focus Area |
| :---: | :--- | :--- | :--- | :--- |
| 👨‍⚕️ | **Dr. Elliot** | General Physician | Elliot (Warm Male) | Primary care, routine symptoms, preventative health |
| 👩‍⚕️ | **Dr. Savannah** | Pediatrician | Savannah (Gentle Female) | Infant & child care, growth, pediatric fever |
| 👩‍⚕️ | **Dr. Clara** | Dermatologist | Clara (Empathetic Female) | Skin rashes, lesions, acne, hair & nail disorders |
| 👩‍⚕️ | **Dr. Layla** | Psychologist | Layla (Calming Female) | Mental wellness, stress, anxiety, emotional care |
| 👩‍⚕️ | **Dr. Emma** | Nutritionist | Emma (Upbeat Female) | Diet plans, metabolic health, vitamin deficiencies |
| 👨‍⚕️ | **Dr. Sid** | Cardiologist | Sid (Authoritative Male) | Heart health, blood pressure, cholesterol, ECGs |
| 👨‍⚕️ | **Dr. Nico** | ENT Specialist | Nico (Reassuring Male) | Throat infections, ear pain, sinus, rhinitis |
| 👨‍⚕️ | **Dr. Neil** | Orthopedic Specialist | Neil (Structured Male) | Joint pain, posture, fractures, sports injuries |
| 👩‍⚕️ | **Dr. Naina** | Gynecologist | Naina (Compassionate Female) | Women's reproductive health, PCOS, maternal care |
| 👨‍⚕️ | **Dr. Kai** | Dentist | Kai (Friendly Male) | Oral hygiene, tooth pain, gum disease, dental care |
| 👩‍⚕️ | **Dr. Maya** | Mental Health Counsellor | Maya (Serene Female) | Crisis intervention, trauma support, heavy distress |

---

# 🧠 Core AI & Voice Workflow

```mermaid
sequenceDiagram
    autonumber
    actor Patient as 👤 Patient
    participant UI as 📱 Next.js Frontend
    participant Vapi as 🎙️ Vapi Voice WebRTC
    participant API as ⚡ API Route (/api/session-chat)
    participant LLM as 🧠 LLM Engine (OpenRouter / Gemini)
    participant DB as 🗄️ Neon Postgres DB

    Patient->>UI: Selects Doctor & Starts Voice Session
    UI->>Vapi: Initialize WebRTC Stream (Doctor Assistant ID)
    Vapi-->>Patient: Interactive Voice Consultation
    Vapi->>UI: Real-Time Audio & Transcript Callback
    Patient->>UI: End Consultation / View Summary
    UI->>API: POST /api/session-chat (Conversation Transcript)
    API->>LLM: Multi-model prompt (Extract SOAP + Vitals + Tests)
    LLM-->>API: Returns Structured SOAP JSON
    API->>DB: Save Session Record & Update User Health Score
    DB-->>UI: Return Finalized Medical Report Page
```

---

# 🏗️ Architecture & Resilience Layer

MediVoice AI is built with a resilient, multi-tiered architecture that guarantees 99.9% uptime even if an upstream AI provider experiences outages.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Next.js 16 Client (App Router)                   │
├───────────────────────────────────────┬────────────────────────────────┤
│   🎙️ Real-Time Voice (Vapi SDK)       │   💬 Text Fallback Chat UI     │
└───────────────────┬───────────────────┴────────────────┬───────────────┘
                    │                                    │
                    ▼                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        Next.js Server API Routes                        │
├───────────────────┬────────────────────┬───────────────────────────────┤
│ /api/session-chat │ /api/suggest-doctors│ /api/analyze-report           │
└─────────┬─────────┴─────────┬──────────┴───────────────┬───────────────┘
          │                   │                          │
          ▼                   ▼                          ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        Multi-Model LLM Resilience Chain                 │
│                                                                        │
│   Primary: OpenRouter (DeepSeek R1 / Llama 3.3 70B / Mistral Large)    │
│      └─────► Secondary Fallback: Google Gemini 2.5 / 1.5 Flash        │
│                └─────► Tertiary Fallback: Structured Rule Engine       │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                  Neon Serverless PostgreSQL (Drizzle ORM)               │
│   (Users, Family Members, Session Chats, Medical Reports, Appointments)│
└────────────────────────────────────────────────────────────────────────┘
```

---

# ⚙️ Tech Stack

### Frontend & Core
- **Framework**: [Next.js 16.3](https://nextjs.org/) (App Router, Server Actions, Turbopack)
- **Library**: [React 19.2](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: Vanilla CSS3 + TailwindCSS v4 + Glassmorphism Tokens
- **Icons**: Lucide React
- **Animations**: Framer Motion & CSS Micro-Interactions

### AI & Voice Services
- **Voice Agent Engine**: [Vapi AI](https://vapi.ai) WebRTC SDK
- **Primary LLM Router**: [OpenRouter API](https://openrouter.ai/) (DeepSeek R1, Meta Llama 3.3 70B Instruct)
- **Vision & Multimodal AI**: [Google Gemini API](https://ai.google.dev/) (`gemini-2.5-flash` / `gemini-1.5-flash`)

### Database & Auth
- **Database**: [Neon Postgres](https://neon.tech/) (Serverless PostgreSQL)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication**: [Clerk Auth](https://clerk.com/) (Google OAuth + Email magic links)

---

# 📂 Project Structure

```
medi-voice-ai/
├── app/
│   ├── (auth)/
│   │   ├── sign-in/[[...sign-in]]/       # Clerk Sign-in Page
│   │   └── sign-up/[[...sign-up]]/       # Clerk Sign-up Page
│   ├── (routes)/
│   │   ├── dashboard/                    # Main Patient Dashboard
│   │   │   ├── medical-agent/
│   │   │   │   ├── page.tsx              # Specialist Doctor Selection
│   │   │   │   └── [sessionId]/page.tsx  # Active Consultation Session
│   │   │   ├── _components/              # HistoryList, DoctorList, ScoreCard
│   │   │   └── page.tsx
│   │   ├── family/                       # Family Profiles Management (Phase 4)
│   │   ├── vault/                        # Medical Report Vault & OCR Analysis
│   │   ├── timeline/                     # Longitudinal Patient Timeline
│   │   ├── profile/                      # User Profile & Medical Info
│   │   └── billing/                      # Plan Credits & Subscription
│   ├── api/                              # REST API Route Handlers
│   │   ├── ai-chat/                      # Streaming Text Chat Consultation
│   │   ├── analyze-report/               # Medical Lab Report Biomarker Extractor
│   │   ├── compare-reports/              # Multi-Report Trend Comparison
│   │   ├── family-members/               # Family Member CRUD API
│   │   ├── health-timeline/              # Unified Timeline Data Extractor
│   │   ├── report-vault/                 # Vault Persistence API
│   │   ├── session-chat/                 # SOAP Summary Generator
│   │   ├── suggest-doctors/              # AI Doctor Recommendation Engine
│   │   ├── symptom-triage/               # Triage & Emergency Red Flag Evaluator
│   │   └── users/                        # User Account & Credits API
│   ├── globals.css                       # Design Tokens, Glassmorphism Styles
│   ├── layout.tsx                        # Root Layout with Clerk Provider
│   └── page.tsx                          # Hero Landing Page & Features
├── components/                           # Shared UI Components
│   ├── AppHeader.tsx                     # Header Navigation & Profile Switcher
│   ├── FamilyProfileSwitcher.tsx        # Active Family Member Dropdown
│   ├── SymptomTriageWidget.tsx           # Triage Floating Widget
│   └── AiDoctorMatcherWidget.tsx         # AI Doctor Matcher Modal
├── config/
│   ├── db.ts                             # Drizzle ORM Neon Client
│   └── schema.ts                         # PostgreSQL Database Schema
├── shared/
│   └── DoctorList.tsx                    # 11 Specialist Doctor Profiles & Prompts
├── public/                               # Static Assets & Doctor Avatars
└── README.md                             # Project Documentation
```

---

# 🗄️ Database Schema

MediVoice AI utilizes a PostgreSQL database managed via **Drizzle ORM**.

```typescript
// 1. Users Table
export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  credits: integer().default(10),
  plan: varchar({ length: 50 }).default("free"),
  bloodGroup: varchar({ length: 20 }).default("O+"),
  allergies: text().default("None"),
  emergencyContact: varchar({ length: 100 }).default(""),
  preferredVoice: varchar({ length: 100 }).default("Elliot (Male - Warm)"),
});

// 2. Family Members Table (Phase 4)
export const familyMembersTable = pgTable("familyMembersTable", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  memberId: varchar({ length: 100 }).notNull().unique(),
  primaryUserEmail: varchar({ length: 255 }).notNull().references(() => usersTable.email),
  name: varchar({ length: 255 }).notNull(),
  relationship: varchar({ length: 50 }).notNull().default("Self"),
  age: integer(),
  gender: varchar({ length: 50 }),
  bloodGroup: varchar({ length: 20 }).default("O+"),
  allergies: text().default("None"),
  medicalHistory: text().default("None"),
  createdAt: varchar({ length: 100 }),
});

// 3. Consultation Sessions Table
export const SessionChatTable = pgTable("sessionChatTable", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  sessionId: varchar().notNull(),
  notes: text(),
  selectedDoctor: json(),
  conversation: json(),
  report: json(), // SOAP Report JSON
  createdBy: varchar().references(() => usersTable.email),
  createdOn: varchar(),
  familyMemberId: varchar({ length: 100 }),
});

// 4. Medical Reports Table
export const medicalReportsTable = pgTable("medicalReportsTable", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  reportId: varchar({ length: 100 }).notNull().unique(),
  userEmail: varchar({ length: 255 }).notNull().references(() => usersTable.email),
  fileName: varchar({ length: 255 }),
  reportTitle: varchar({ length: 255 }).notNull(),
  testDate: varchar({ length: 100 }),
  patientSummary: text(),
  parameters: json(),
  deficienciesOrAbnormalities: json(),
  suggestedNextSteps: json(),
  rawText: text(),
  createdAt: varchar({ length: 100 }),
  familyMemberId: varchar({ length: 100 }),
});
```

---

# 🔌 API Reference

### 💬 Consultations & Chat
| Endpoint | Method | Description |
| :--- | :---: | :--- |
| `/api/session-chat` | `POST` | Generate SOAP report from consultation transcript |
| `/api/session-chat?sessionId={id}` | `GET` | Retrieve session details and SOAP report |
| `/api/session-chat?userEmail={email}` | `GET` | Retrieve all past consultation sessions |
| `/api/ai-chat` | `POST` | Process text chat fallback message with multi-model LLM |

### 🧪 Medical Vault & Triage
| Endpoint | Method | Description |
| :--- | :---: | :--- |
| `/api/analyze-report` | `POST` | Extract parameters and deficiencies from lab report PDF/Image |
| `/api/report-vault` | `POST` | Save analyzed medical report to patient vault |
| `/api/report-vault?userEmail={email}` | `GET` | Fetch all stored lab reports |
| `/api/symptom-triage` | `POST` | Evaluate symptoms and return triage level (Emergency/Urgent/Routine) |
| `/api/suggest-doctors` | `POST` | Recommend top specialist doctors based on patient symptoms |
| `/api/health-timeline` | `GET` | Aggregates user consultations & reports into chronological timeline |
| `/api/family-members` | `GET/POST/DEL` | Manage dependent family member profiles |

---

# 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: `v18.17.0` or higher
- **npm** or **yarn** or **pnpm**
- **Neon PostgreSQL** database account

---

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Itssanthoshhere/Medi-Voice-AI.git
   cd Medi-Voice-AI
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file in the project root:
   ```env
   # Database (Neon Postgres)
   NEXT_PUBLIC_DATABASE_URL=postgresql://user:password@ep-cool-db.neon.tech/neondb?sslmode=require

   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...

   # Vapi Voice AI
   NEXT_PUBLIC_VAPI_PUBLIC_KEY=your_vapi_public_key

   # AI LLM Providers
   OPENROUTER_API_KEY=sk-or-v1-...
   NEXT_PUBLIC_GEMINI_API_KEY=AIzaSy...
   ```

4. **Sync Database Schema**:
   ```bash
   npx drizzle-kit push
   ```

5. **Start Development Server**:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

# 🔐 Environment Variables

| Variable Key | Required | Purpose |
| :--- | :---: | :--- |
| `NEXT_PUBLIC_DATABASE_URL` | Yes | Neon Serverless PostgreSQL connection string |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Yes | Clerk authentication public API key |
| `CLERK_SECRET_KEY` | Yes | Clerk authentication secret key |
| `NEXT_PUBLIC_VAPI_PUBLIC_KEY` | Yes | Vapi WebRTC Voice SDK client key |
| `OPENROUTER_API_KEY` | Yes | Primary OpenRouter LLM API key |
| `NEXT_PUBLIC_GEMINI_API_KEY` | Yes | Google Gemini Vision & Multimodal API key |

---

# 🛤️ Development Roadmap

| Phase | Feature | Status |
| :--- | :--- | :---: |
| **Phase 1** | Medical Report Vault (PDF & Image OCR) | ✅ Shipped |
| **Phase 2** | Dynamic Health Index Score (0–100) | ✅ Shipped |
| **Phase 3** | Smart Symptom Triage Widget & Doctor Matcher | ✅ Shipped |
| **Phase 4** | Family Health Profiles & Dependent Care | ✅ Shipped |
| **Phase 5** | Doctor Availability & Appointment Scheduler | ✅ Shipped |
| **Phase 6** | Prescription & Medication Tracker | ✅ Shipped |
| **Phase 7** | Real-Time Health Monitoring & Vitals Tracker | ✅ Shipped |
| **Phase 8** | Multi-Language Support (i18n) | 📋 Planned |

---

# 🧪 Future Improvements

- [ ] EHR / FHIR integration for hospital data interoperability
- [ ] Automated SMS & Email appointment reminders
- [ ] Offline audio voice recorder with local transcription fallback
- [ ] Wearable biometric integration (Apple HealthKit / Google Fit)
- [ ] Multi-lingual speech synthesis for regional languages

---

# 🤝 Contributing

Contributions are welcome!

```bash
1. Fork the repository
2. Create your feature branch (git checkout -b feature/amazing-feature)
3. Commit your changes (git commit -m 'feat: add amazing feature')
4. Push to the branch (git push origin feature/amazing-feature)
5. Open a Pull Request
```

---

# 👨‍💻 Author

## V S Santhosh

- 🌐 Portfolio: [https://santhosh-vs-portfolio.vercel.app](https://santhosh-vs-portfolio.vercel.app)
- 💼 LinkedIn: [https://linkedin.com/in/thesanthoshvs](https://linkedin.com/in/thesanthoshvs)
- 🐙 GitHub: [https://github.com/Itssanthoshhere](https://github.com/Itssanthoshhere)

---

# 📜 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

<div align="center">

### ⭐ If you found this project interesting, consider giving it a star on GitHub!

Built with ❤️ by [Itssanthoshhere](https://github.com/Itssanthoshhere)

</div>
