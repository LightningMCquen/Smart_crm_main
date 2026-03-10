# Smart PS-CRM — Project Memory

## Project Overview
Smart Public Service CRM (PS-CRM) — A full-stack governance platform for managing citizen complaints and public service requests via tickets.

## Technology Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS v3 + custom components
- **State Management**: Zustand v4 with `persist` middleware (localStorage)
- **Routing**: React Router DOM v6
- **Charts**: Recharts v3
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Utilities**: clsx, tailwind-merge (cn() helper)

## Key Architecture Decisions
- No backend — demo runs fully client-side using localStorage + Zustand persist
- Auth uses mock demo accounts (see below); new signups create in-memory users
- Ticket data stored in Zustand store with localStorage persistence
- Role-based routing via `ProtectedRoute` component in `src/App.tsx`

## Demo Accounts
| Email | Password | Role |
|---|---|---|
| citizen@demo.com | citizen123 | Citizen |
| admin@demo.com | admin123 | Administrator |
| manager@demo.com | manager123 | Department Manager |
| worker@demo.com | worker123 | Field Worker |

## User Roles & Routes
- **citizen** → `/dashboard`, `/submit-complaint`, `/my-complaints`, `/rewards`, `/transparency`
- **admin** → `/admin/command-center`, `/admin/complaints`, `/admin/map`, `/admin/analytics`, `/admin/departments`
- **department_manager** → `/provider/dashboard`, `/provider/complaints`, `/provider/workers`, `/provider/analytics`
- **field_worker** → `/worker/tasks`, `/worker/map`
- **Common** → `/notifications`, `/ticket/:id`, `/profile`, `/transparency`

## Project Structure
```
src/
├── App.tsx              # Root with BrowserRouter + ProtectedRoute
├── main.tsx             # Entry point
├── index.css            # Tailwind base + custom utility classes
├── types/index.ts       # All TypeScript types
├── store/
│   ├── authStore.ts     # Zustand auth store (login, signup, logout, notifications)
│   └── ticketStore.ts   # Zustand ticket store (CRUD, assign, escalate, status updates)
├── data/
│   ├── mockData.ts      # Mock users, tickets, analytics, departments, leaderboard
│   └── categories.ts    # Complaint categories, subcategories, departments
├── lib/utils.ts         # cn(), timeAgo(), formatDateTime() helpers
├── components/
│   ├── ui/index.tsx     # Reusable UI components (Card, Button, Input, Badge, etc.)
│   ├── charts/Charts.tsx # Chart wrapper components
│   └── tickets/TicketCard.tsx # Ticket display + timeline components
├── layouts/
│   ├── Navbar.tsx       # Top navigation with notifications, user menu
│   ├── Sidebar.tsx      # Role-based sidebar navigation
│   └── AppLayout.tsx    # Layout wrapper using React Router Outlet
└── pages/
    ├── Login.tsx
    ├── Signup.tsx
    ├── Notifications.tsx
    ├── TicketDetail.tsx
    ├── Profile.tsx
    ├── citizen/
    │   ├── CitizenDashboard.tsx
    │   ├── SubmitComplaint.tsx   # AI category detection, image upload, priority auto-detect
    │   ├── MyComplaints.tsx
    │   ├── Rewards.tsx           # Gamification, badges, leaderboard
    │   └── TransparencyPortal.tsx
    ├── admin/
    │   ├── CommandCenter.tsx     # Real-time command dashboard
    │   ├── AdminComplaints.tsx   # All complaints with bulk actions
    │   ├── AdminMap.tsx          # GIS hotspot map visualization
    │   ├── AdminAnalytics.tsx    # Analytics + predictive (3 tabs)
    │   └── DepartmentManagement.tsx
    └── provider/
        ├── ProviderDashboard.tsx
        ├── ComplaintManagement.tsx
        ├── Analytics.tsx         # exports ProviderAnalytics
        └── FieldWorker.tsx       # exports FieldWorkerTasks (used for both /provider/workers and /worker/tasks)
```

## Build Commands
```bash
npm install   # Install dependencies
npm run build # Production build
npm run dev   # Development server
```

## Important Notes
- All `src/pages/citizen/*.tsx`, `src/pages/admin/*.tsx`, `src/pages/provider/*.tsx` must use `'../../store/...'`, `'../../data/...'`, `'../../components/...'` (two levels up)
- `src/pages/*.tsx` (root pages) use `'../store/...'`, `'../data/...'`, `'../components/...'` (one level up)
- `src/pages/provider/Analytics.tsx` exports `ProviderAnalytics` (named)
- `src/pages/provider/FieldWorker.tsx` exports `FieldWorkerTasks` (named)
- `src/layouts/Sidebar.tsx` exports both `Sidebar` (mobile drawer) and `DesktopSidebar`

## Features Implemented
- ✅ Secure authentication with role-based redirects
- ✅ Citizen complaint submission with AI category detection, priority auto-detect, image upload
- ✅ Unique ticket ID generation (TKT-YYYY-XXXX format)
- ✅ Real-time ticket status tracking with timeline
- ✅ Complaint categories: Roads, Sanitation, Electricity, Water Supply, Infrastructure
- ✅ Subcategories for each category
- ✅ Admin command center with live stats
- ✅ GIS hotspot map visualization
- ✅ Department management with efficiency scoring
- ✅ Predictive analytics (3-tab view)
- ✅ Field worker task management
- ✅ Gamification: points, badges, leaderboard
- ✅ Transparency portal (public stats)
- ✅ Notifications system
- ✅ Crowd-sourced ticket merging (data model)
- ✅ Emergency SOS detection
- ✅ Image recognition simulation
- ✅ Voice-to-text complaint (simulated)
- ✅ Feedback/ratings after resolution
- ✅ Multi-department routing
- ✅ Bulk ticket management for admins
- ✅ Profile page with badges display
