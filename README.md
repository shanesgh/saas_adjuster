# ZenAssess

A digital claims form application for motor vehicle assessment built with React and Hono.

## Tech Stack

- **Frontend**: React + Vite + TanStack Router + Tailwind CSS
- **Backend**: Hono + Node.js
- **Database**: Neon PostgreSQL
- **Authentication**: Clerk
- **UI Components**: Custom components with Radix UI primitives

## Development

### Prerequisites

- Node.js 18+
- npm 8+
- Neon Database account

### Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

Then update `.env` with your actual values:
- `NEON_DATABASE_URL`: Your Neon database connection string
- `CLERK_SECRET_KEY`: Your Clerk secret key
- `CLERK_PUBLISHABLE_KEY`: Your Clerk publishable key

3. Run database migrations:
```bash
npm run db:push
```

### Running the Application

**Option 1: Run both frontend and backend together (recommended):**
```bash
npm run dev:full
```

**Option 2: Run separately:**

Frontend only:
```bash
npm run dev
```

Backend only:
```bash
npm run dev:server
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8888

## Database Management

Generate migrations:
```bash
npm run db:generate
```

Push schema changes:
```bash
npm run db:push
```

Open Drizzle Studio:
```bash
npm run db:studio
```

## Project Structure

```
├── src/                          # Frontend React application
│   ├── components/              # Reusable UI components
│   ├── routes/                  # TanStack Router routes
│   ├── lib/                     # Utilities and API client
│   └── store/                   # Zustand state management
├── worker/                      # Backend API (Hono)
│   ├── routes/                  # API route handlers
│   ├── db/                      # Database schema and migrations
│   └── lib/                     # Backend utilities
└── server.js                   # Node.js server entry point
```

## API Endpoints

- `GET /health` - Health check
- `POST /api/users` - Create user
- `GET /api/users/profile` - Get user profile
- `POST /api/users/generate-pin` - Generate PIN for new users
- `POST /api/users/validate-pin` - Validate PIN
- `GET /api/claims` - Get all claims
- `POST /api/claims` - Create new claim
- `GET /api/claims/:id` - Get specific claim
- `PUT /api/claims/:id` - Update claim
- `PUT /api/claims/:id/status` - Update claim status
- `POST /api/company` - Create company
- `GET /api/reports` - Get reports
- `POST /api/reports/generate/:claimId` - Generate report

## Features

- 🔐 **Authentication**: Clerk-based user management
- 📋 **Claims Management**: Digital motor vehicle assessment forms
- 📊 **Analytics**: Dashboard with charts and metrics
- 📄 **PDF Generation**: Automated report generation
- 🏢 **Multi-tenant**: Company-based user organization
- 📱 **Responsive**: Mobile-first design
- 🎨 **Modern UI**: Tailwind CSS with custom components

## Environment Variables

Create a `.env` file with the following variables:

```bash
# Database
NEON_DATABASE_URL=your_neon_database_url

# Authentication
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

# Server
PORT=8888
NODE_ENV=development
```

## Development Tips

1. **Database Changes**: Always run `npm run db:generate` after schema changes
2. **API Testing**: Use the health endpoint at http://localhost:8888/health
3. **Frontend Proxy**: Vite automatically proxies `/api` requests to the backend
4. **Hot Reload**: Both frontend and backend support hot reloading

## Troubleshooting

**Database Connection Issues:**
- Verify your `NEON_DATABASE_URL` is correct
- Check if your Neon database is active
- Run `npm run db:push` to ensure schema is up to date

**Authentication Issues:**
- Verify Clerk keys are set correctly
- Check that `VITE_CLERK_PUBLISHABLE_KEY` is set for frontend
- Ensure `CLERK_SECRET_KEY` is set for backend

**CORS Issues:**
- Backend is configured to accept requests from localhost:5173
- If using different ports, update CORS settings in `worker/index.ts`

## Building for Production

```bash
npm run build
```

This creates a `dist/` folder with the built frontend application.