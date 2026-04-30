# CaseBrief 🗂️

> **Built for the c0mpiled.sh/DC - AI for Government Hackathon**

CaseBrief is an AI-powered social work case management web app that helps caseworkers track clients, manage active cases, schedule appointments, and generate structured case briefs from raw intake notes.

---

## ✨ Features

- **AI Case Briefs** — Paste raw intake notes and get a fully structured case brief powered by GPT-4o-mini, including risk assessment, key facts, recommended next steps, and a compliance checklist
- **Case Management** — Browse, search, and filter active cases by category, risk level, and status
- **Dashboard Overview** — At-a-glance KPI cards, daily case volume charts, and today's appointment list
- **Weekly Calendar** — Google Calendar-style week view with hour-by-hour scheduling
- **Notes Board** — Google Keep-style pinnable, color-coded notes with full-text search

---

## 🧠 The AI Feature: summAIry

The heart of CaseBrief is the **summAIry** intake page (`/intake`). A caseworker pastes raw notes from a client intake session, selects a case type and urgency level, and the app returns a structured brief containing:

| Section | Description |
|---|---|
| Risk Level Banner | Color-coded severity indicator (Low / Medium / High / Critical) |
| Case Summary | Concise overview of the situation |
| Client Info | Extracted client details |
| Risk Assessment | Identified risk flags |
| Key Facts & Gaps | Important facts + missing information |
| Caseworker Note | Formal, copyable professional note |
| Next Steps | Recommended actions |
| Compliance Checklist | Intake documentation checklist |
| Confidence Notes | AI confidence and caveats |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- An OpenAI API key

### Installation

```bash
git clone https://github.com/your-username/casebrief.git
cd casebrief
npm install
```

### Environment Setup

Create a `.env` file in the root directory:

```env
OPENAI_API_KEY=sk-...
```

### Running the App

```bash
# Start the frontend (http://localhost:5173)
npm run dev

# Start the backend API (http://localhost:3001)
npm run server
```

> Both must be running for AI brief generation to work.

### Login

The app uses a demo auth system — **any email and password combination works.** No real account needed.

---

## 📁 Project Structure

```
compiled/
├── server/
│   └── index.ts              # Express API — OpenAI integration
├── src/
│   ├── routes/               # File-based pages (TanStack Router)
│   │   ├── index.tsx         # Landing page (/)
│   │   ├── login.tsx         # Login + Sign Up (/login)
│   │   ├── dashboard.tsx     # Overview dashboard (/dashboard)
│   │   ├── cases.tsx         # Case list (/cases)
│   │   ├── intake.tsx        # AI case intake — summAIry (/intake)
│   │   ├── calendar.tsx      # Weekly calendar (/calendar)
│   │   └── notes.tsx         # Quick notes (/notes)
│   ├── components/
│   │   ├── AuthGuard.tsx
│   │   └── dashboard/
│   ├── lib/
│   │   ├── auth.ts
│   │   └── utils.ts
│   └── hooks/
```
