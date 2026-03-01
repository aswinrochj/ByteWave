# ByteWave - AI Skill Intelligence Platform

## Project Overview
ByteWave is a modern SaaS frontend prototype built with **Next.js 14**, **TypeScript**, and **Vanilla CSS** (using custom utility classes). It features a role-based access system for Students, HR, and Institutions.

## Features
- **Landing Page**: Animated neural wave background (Canvas).
- **Role Selection**: Glassmorphism cards for separate user flows.
- **Dashboards**:
  - **Student**: Skill DNA Radar, Growth Analysis, Gamification.
  - **HR**: Talent Intelligence, Pipeline Funnel, Candidate Comparison.
  - **Institution**: Class Performance Heatmap, Engagement Metrics.
- **Charts**: Interactive visualizations using `chart.js` and `react-chartjs-2`.
- **UI/UX**: Custom Glassmorphism design system, smooth animations with `framer-motion`.

## Getting Started

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure
- `src/app`: App Router pages (Landing, Role Selection, Dashboards).
- `src/components`: Reusable UI components and Charts.
- `src/app/utilities.css`: Custom utility classes (Tailwind-like syntax implementation).
- `src/app/globals.css`: Brand variables and global styles.

## Tech Stack
- Framework: Next.js 14 (App Router)
- Language: TypeScript
- Styling: Vanilla CSS (Custom Utilities + CSS Modules concepts)
- Animations: Framer Motion
- Charts: Chart.js
- Icons: Lucide React
