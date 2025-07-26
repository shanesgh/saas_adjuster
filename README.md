# ZenAssess

A digital claims form application for motor vehicle assessment.

## Project Structure

This project is split into two parts:

- `frontend/`: React application deployed to Cloudflare Pages
- `backend/`: API server deployed to Cloudflare Workers

## Development

### Prerequisites

- Node.js 18+
- npm 8+

### Setup

1. Clone the repository
2. Install dependencies:

```bash
npm install
cd frontend && npm install
cd ../backend && npm install
```

3. Create `.env` files:

```bash
# In frontend/.env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

# In backend/.env
NEON_DATABASE_URL=your_neon_db_url
CLERK_SECRET_KEY=your_clerk_secret_key
```

### Running Locally

```bash
# Run both frontend and backend
npm run dev

# Run only frontend
npm run dev:frontend

# Run only backend
npm run dev:backend
```

## Deployment

### Environment Variables

Set these in Cloudflare Pages and Workers:

- Frontend (Pages):
  - `VITE_CLERK_PUBLISHABLE_KEY`

- Backend (Workers):
  - `NEON_DATABASE_URL`
  - `CLERK_SECRET_KEY`

### Deploy

```bash
# Deploy everything
npm run deploy

# Deploy only frontend
npm run deploy:frontend

# Deploy only backend
npm run deploy:backend
```

## Database Migrations

```bash
cd backend
npm run db:migrate
```