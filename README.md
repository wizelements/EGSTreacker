# ESGTracker

AI-powered ESG (Environmental, Social, Governance) compliance reports for solopreneurs and small businesses.

## Features

- 🚀 Generate audit-ready ESG reports in under 3 minutes
- 🤖 AI-powered analysis using GPT-4o (via Emergent Universal Key)
- 📄 Professional PDF exports
- 💳 Stripe subscription billing ($19/mo Starter, $49/mo Pro)
- 🔐 Supabase authentication (Email + Google OAuth)
- 🎨 Modern UI with Tailwind CSS and shadcn/ui
- ⚡ Next.js 15 App Router with TypeScript

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **Payments:** Stripe
- **AI:** OpenAI GPT-4o (via Emergent Universal Key)
- **Deployment:** Vercel

## Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/yourusername/esgtracker.git
cd esgtracker
npm install
```

### 2. Set Up Environment Variables

```bash
cp .env.example .env
```

Fill in your credentials:

```env
# Supabase (from supabase.com dashboard)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe (from stripe.com dashboard)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# AI Provider - Emergent Universal Key
EMERGENT_LLM_KEY=your-emergent-llm-key
# Works with OpenAI (GPT-4o), Anthropic (Claude), and Google (Gemini)

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the schema from `supabase/schema.sql`
3. Enable Email auth in Authentication > Providers
4. (Optional) Enable Google OAuth

### 4. Set Up Stripe

See [STRIPE_SETUP.md](./STRIPE_SETUP.md) for detailed instructions on creating products and prices.

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Auth pages (login, signup)
│   ├── api/             # API routes
│   │   ├── checkout/    # Stripe checkout
│   │   ├── generate/    # Report generation
│   │   ├── reports/     # Report CRUD
│   │   └── webhooks/    # Stripe webhooks
│   ├── dashboard/       # User dashboard
│   ├── generate/        # Report generation wizard
│   ├── report/[id]/     # Report view
│   └── page.tsx         # Landing page
├── components/
│   └── ui/              # shadcn/ui components
├── hooks/               # React hooks
└── lib/
    ├── ai.ts            # AI report generation
    ├── stripe.ts        # Stripe config
    ├── supabase/        # Supabase clients
    └── utils.ts         # Utility functions
```

## Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

Add all environment variables in Vercel dashboard.

### Manual

```bash
npm run build
npm start
```

## Stripe Webhook

Set up webhook endpoint in Stripe Dashboard:
- URL: `https://your-domain.com/api/webhooks/stripe`
- Events: `checkout.session.completed`, `customer.subscription.*`, `invoice.payment_failed`

## Legal Notices

This software generates AI-powered reports for informational purposes only. Reports do not constitute legal, financial, or professional advice. Always consult qualified professionals for compliance decisions.

## License

MIT License - see [LICENSE](./LICENSE)
