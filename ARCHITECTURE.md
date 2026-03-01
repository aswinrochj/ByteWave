# Architecture & File Structure

This document outlines the proposed file structure for the Skill Intelligence Platform, mapping the Unified Master Root Flow to a Next.js App Router structure.

## Directory Structure

```plaintext
/
├── app/                        # Main Application Logic
│   ├── (auth)/                 # Authentication Group
│   │   ├── login/              # Identity Manager Login
│   │   ├── signup/             # Identity Manager Signup
│   │   └── layout.tsx          # Auth Layout
│   │
│   ├── (dashboard)/            # Protected Intelligence Shell
│   │   ├── student/            # Student Intelligence Branch
│   │   │   ├── dashboard/      # Dashboard Engine
│   │   │   ├── arena/          # Coding Arena
│   │   │   ├── analysis/       # AI Analyzer Output
│   │   │   ├── skill-dna/      # Skill DNA System
│   │   │   └── learning/       # Adaptive Learning Brain
│   │   │
│   │   ├── recruiter/          # Recruiter Intelligence Branch
│   │   │   ├── talent/         # Talent Dashboard
│   │   │   ├── filter/         # Skill Filter Engine
│   │   │   └── candidate/      # Candidate Intelligence Viewer
│   │   │
│   │   └── institution/        # Institution Intelligence Branch
│   │       ├── assessments/    # Assessment Generator
│   │       └── analytics/      # Performance Analytics
│   │
│   ├── api/                    # API Routes (Backend Logic)
│   │   ├── auth/               # Auth endpoints
│   │   ├── analyzer/           # AI Analyzer Logic
│   │   ├── assessment/         # Assessment Module
│   │   └── webhooks/           # Global Data Loop inputs
│   │
│   ├── layout.tsx              # Root Layout
│   └── page.tsx                # Landing System (Value Engine, Trust Builder)
│
├── components/                 # Shared Components
│   ├── ui/                     # Basic UI Elements (Buttons, Inputs)
│   ├── shared/                 # Shared Logic Components
│   ├── landing/                # Landing Page Components
│   ├── student/                # Student-specific Components
│   ├── recruiter/              # Recruiter-specific Components
│   └── institution/            # Institution-specific Components
│
├── lib/                        # Utilities & Helper Functions
│   ├── ai-analyzer/            # Core AI Logic
│   ├── skill-dna/              # Skill DNA Algorithm
│   ├── adaptive-brain/         # Learning Path Logic
│   └── db/                     # Database Connection
│
├── types/                      # TypeScript Interfaces
│   ├── user.ts                 # User Roles & Profiles
│   ├── skill.ts                # Skill Metrics & DNA
│   └── assessment.ts           # Test Structures
│
└── public/                     # Static Assets
```

## Component Mapping

### 1. Landing System
*   **Value Engine**: `app/page.tsx` + `components/landing/ValueEngine.tsx`
*   **Trust Builder**: `components/landing/TrustBuilder.tsx`
*   **Conversion Trigger**: `components/landing/ConversionTrigger.tsx`

### 2. Authentication Root
*   **Identity Manager**: `app/(auth)/...` + `lib/auth.ts`
*   **Role Classifier**: Middleware or `lib/auth/roles.ts`
*   **Session Controller**: `lib/auth/session.ts`

### 3. Student Intelligence Branch
*   **Dashboard Engine**: `app/(dashboard)/student/dashboard/page.tsx`
*   **Coding Arena**: `app/(dashboard)/student/arena/page.tsx`
*   **AI Analyzer**: `lib/ai-analyzer/` + `app/api/analyzer/route.ts`
*   **Skill DNA System**: `lib/skill-dna/` + `app/(dashboard)/student/skill-dna/page.tsx`
*   **Adaptive Learning Brain**: `lib/adaptive-brain/` + `app/(dashboard)/student/learning/page.tsx`

### 4. Recruiter Intelligence Branch
*   **Talent Dashboard**: `app/(dashboard)/recruiter/talent/page.tsx`
*   **Skill Filter Engine**: `components/recruiter/SkillFilter.tsx`

### 5. Institution Intelligence Branch
*   **Assessment Generator**: `app/(dashboard)/institution/assessments/page.tsx`
*   **Performance Analytics**: `app/(dashboard)/institution/analytics/page.tsx`

## Next Steps
1.  Initialize Next.js project.
2.  Set up Tailwind CSS configuration.
3.  Implement folder structure.
4.  Begin with Landing System implementation.
