# Nexus AI — Premium Perplexity-Style Search & Research SaaS

Nexus AI is an ultra-premium, production-grade AI-powered search engine and research SaaS platform (Perplexity clone). Built using Next.js 16, React 19, Tailwind CSS v4, and Prisma SQLite, it features streaming answers, interactive timelines, citations, deep research stages, India-specific localization, and an elegant dark theme based on the Resend design system.

---

## 🚀 Key Features

### 🔍 Advanced AI Search & Citations
- **SSE Streaming Answers**: Real-time response generation utilizing Server-Sent Events (SSE).
- **Citations & Sources**: Live fetching of relevant web pages in parallel, displaying favicon-decorated interactive source chips and inline markdown citation links.
- **Deep Research Mode**: Multi-stage workflow (Query formulation → Source Gathering → Analysis → Writing) presenting document-style comprehensive reports.
- **Dynamic Follow-Ups**: Context-aware follow-up suggestion cards to dive deeper into queries.

### 🎨 Premium Resend UI/UX
- **Design System**: Strict adherence to a clean, typographic layout using custom CSS variables (`var(--ink)`, `var(--surface-card)`, etc.) and removing standard glassmorphism in favor of high-contrast cards and border styling.
- **Micro-Animations**: Fluid transitions, timeline pulse indicators, timelines (horizontal on desktop, vertical on mobile), and staggered lists driven by Framer Motion.
- **Fluid Layout**: Completely responsive navigation sidebar on desktop, bottom navigation on mobile, and collapsible mobile drawer menu.

### 💼 Production-Grade SaaS Capabilities
- **20+ Application Pages**: Interactive workspace dashboard, collections library, sharing configurations, historical searches, and API key manager.
- **Local Auth Simulation**: Interactive onboarding, login, signup with password strength checks, and forgot-password flows.
- **Indian Market Localization**: Built-in INR pricing tiers (₹499/mo Pro plan), support descriptions for UPI (GPay/PhonePe/Paytm), local test reviews (IIT/UPSC candidates), and DPDP Act 2023 compliance FAQ items.
- **Analytics & Admin Panel**: Custom CSS metrics charts, system monitoring, workspace team controls, role-based user management, and pricing controls.

---

## 🛠️ Technical Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router with dynamic server functions)
- **Frontend library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & Vanilla CSS variables
- **Database**: [Prisma ORM](https://www.prisma.io/) with a [SQLite](https://www.sqlite.org/) relational database
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) Radix primitives

---

## 📁 Repository Structure

```text
├── src/
│   ├── app/                 # Next.js App Router (pages, layouts, metadata)
│   │   ├── api/             # API routes (chat streaming, collections, search)
│   │   ├── globals.css      # Core Design System CSS variables & Tailwind directives
│   │   └── layout.tsx       # Root document layout
│   ├── components/
│   │   ├── ui/              # Radix UI low-level components
│   │   ├── landing/         # Marketing homepage sections (Hero, Features, Pricing, FAQ)
│   │   ├── auth/            # LoginPage, SignupPage, ForgotPasswordPage components
│   │   ├── app/             # Application dashboard & inner SaaS pages (AppShell, ChatPage)
│   │   └── ChatView.tsx     # Client-side Chat message streaming viewport
│   ├── store/               # Zustand global store configuration
│   ├── hooks/               # Custom React hooks (device viewport, UI handlers)
│   └── lib/                 # Database instances, search helpers, utilities
├── prisma/                  # Database schema definitions
├── db/                      # Local SQLite database files (git-ignored)
├── scripts/                 # Postbuild utility scripts
└── package.json             # Workspace dependencies & build tasks
```

---

## ⚙️ Quick Start

### 1. Prerequisites
- **Node.js**: `v18.18.0` or higher
- **Package Manager**: `npm` (default) or `bun` (recommended)

### 2. Installation
Clone this repository and install the dependencies:
```bash
git clone https://github.com/subhxroy/ai-search-saas.git
cd ai-search-saas
npm install
# or
bun install
```

### 3. Setup Environment variables
Copy the example environment template file to create your local `.env`:
```bash
cp .env.example .env
```
The default database URL points to your local SQLite database:
```env
DATABASE_URL="file:../db/custom.db"
```

### 4. Database Initialization
Run the Prisma command to create the local database file and apply schemas/tables:
```bash
npx prisma db push
# or
bunx prisma db push
```

### 5. Running the Application
Start the Next.js development server:
```bash
npm run dev
# or
bun dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 📦 Production Deployment

### Building Standalone Output
Next.js is configured for standalone production builds (`output: 'standalone'`). To compile the application:
```bash
npm run build
# or
bun run build
```
This compilation leverages a cross-platform postbuild script (`scripts/postbuild.js`) which automatically copies static files and public assets to the standalone directory, making it ready for cloud deployments (e.g., Docker, Vercel, AWS).

To start the production server:
```bash
npm run start
# or
bun run start
```
