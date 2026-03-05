Team Structure & Responsibilities
text
USER
  ↓
PROJECT MANAGER (PM) - Single point of coordination
  ↓ Parallel Design Phase
├── SOFTWARE ARCHITECT     ├── UI/UX DESIGNER
│   ↓                      │   ↓ 
│   Backend structure,     │   Visual design, layouts,
│   APIs, data flows       │   responsive breakpoints
│                          │
└──────────────────────────┼─────────→ Merge specs
                           │
                           ↓
                    SOFTWARE ENGINEER
                          ↓
                    QA ENGINEER ──────┐
                          ↓           │
                    SECURITY         │ Parallel validation
                    REVIEWER ────────┤
                          ↓           │
                    DEVOPS           │
                    ENGINEER ◄───────┘
Agent Roles Summary
Agent	Input	Output	Success Criteria
PM	User requests	Task Briefs	All tasks complete, minimal user interruptions
Architect	PM Task Brief	Architecture spec (9 sections)	Scalable, realistic, implementable design
UI/UX	PM Task + Architect flows	Design spec + Nano Banana mockups	Mobile-first, Apple aesthetic, WCAG AA
Engineer	Architect + UI/UX specs	Working code + tests	Meets acceptance criteria, clean implementation
QA	Engineer output + specs	Test results + defects	High-risk paths pass, issues actionable
Security	All prior outputs	Security findings	No CRITICAL/HIGH blocks deployment
DevOps	Approved code	Deployed system	Live, monitored, passing smoke tests
Communication Protocol (MANDATORY)
All agents MUST:

Reference Task ID (PROJ-###) in every message

Use structured templates from their .md files

Route through PM except Engineer→Architect blockers

Escalate via PM using defined triggers only

text
Handoff Format:
Task ID: PROJ-###
Status: [Todo/In Progress/Blocked/Done]
[Structured output per agent spec]
Technology Stack & Conventions
text
FRONTEND:
├── Next.js 15 (App Router), TypeScript 5.4
├── Tailwind CSS 3.4 (UI/UX component library)
├── Framer Motion (subtle animations)
└── Vercel deployment (automatic previews)

BACKEND:  
├── Node.js 20 / Bun 1.1, TypeScript
├── Express.js / tRPC / Hono (framework flexible)
├── PostgreSQL 16 (primary), Upstash Redis (cache)
└── Railway / Fly.io deployment

SECURITY:
├── JWT (HS256), Clerk/Supabase Auth (optional)
├── Helmet (security headers), rate-limiter-flexible
├── Zod (input validation), tRPC (type safety)
└── Snyk/Dependabot (dependency scanning)

TESTING:
├── Vitest/Jest (unit), Playwright (E2E)
├── Testing Library (DOM testing)
└── 80%+ coverage on critical paths
Quality Gates (Deployment Blockers)
text
GATE 1: Design Complete
├── Architect spec approved (PM review)
└── UI/UX mockups + specs delivered

GATE 2: Implementation
├── Engineer: All acceptance criteria met
├── Tests: 80%+ high-risk path coverage
└── Code: Linting/formatting passes

GATE 3: Validation
├── QA: High-risk flows PASS
└── Security: No CRITICAL/HIGH findings

GATE 4: Deploy
├── DevOps: Staging smoke tests pass
├── Monitoring: Health checks green
└── PM: Final user approval (if needed)
Escalation Policy
text
IMMEDIATE (Blocker):
├── Security: CRITICAL severity findings
├── QA: High-risk flows FAIL
├── Architect: Fundamental design flaw
└── Engineer: Cannot meet acceptance criteria

URGENT (Within 1 cycle):
├── Security: 3+ HIGH findings
├── QA: Medium-risk flows FAIL  
├── PM: Scope clarification needed
└── Dependencies: External service down

SCHEDULED (Next sprint):
├── Security: MEDIUM/LOW findings
├── QA: Low-risk coverage gaps
├── Performance: Below targets but functional
└── Tech debt: Address before next major release
File Structure Expectations
text
├── .env                    # FAL_API_KEY, DB_URL, etc (NEVER commit)
├── AGENTS.md              # This file (shared context)
├── ProjectManager.md      # PM instructions
├── SoftwareArchitect.md   # Architecture spec template
├── UIUXDesigner.md        # Design + Nano Banana spec
├── SoftwareEngineer.md    # Implementation guidelines
├── QAEngineer.md          # Risk-based testing
├── SecurityReviewer.md    # OWASP/CWE checklist
├── DevOpsEngineer.md      # Deployment (TBD)
└── src/                   # Actual codebase
Shared Conventions
text
CODE STYLE:
├── Prettier + ESLint (enforced)
├── Commitizen conventional commits
├── 100 char line limit
└── README with setup/run/deploy instructions

BRANCHING:
├── main: Production
├── staging: QA/Security approved
├── feature/PROJ-###: Individual tasks
└── PRs: Required for all merges

SECRETS:
├── NEVER in code or .env committed to git
├── Use Doppler/Infisical for prod secrets
└── Local: .env.example with all required vars
Success Metrics (PM Tracks)
text
PROJECT VELOCITY:
├── Tasks completed per cycle: Target 3-5
├── Escalations to user: <10% of tasks
├── Rework cycles: <20% of tasks need revision

QUALITY:
├── QA pass rate: >90% high-risk flows
├── Security findings: 0 CRITICAL, <2 HIGH per sprint
├── Deployment success: 100% automated

USER SATISFACTION:
├── Requirements met: 95%+ first pass
└── Delivery time: MVP in 1-2 cycles