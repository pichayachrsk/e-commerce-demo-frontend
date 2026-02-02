# E-Commerce Demo Frontend

A modern, responsive e-commerce web application built with Next.js, Material UI, and TanStack Query.

## 🚀 Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **UI Library:** [Material UI (MUI) v7](https://mui.com/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) & Emotion
- **State Management & Data Fetching:** [TanStack Query v5](https://tanstack.com/query/latest)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Icons:** Material Icons

## ✨ Features

- **Authentication:**
    - User Registration with terms acceptance.
    - Login with session persistence.
    - **Auto Refresh Token:** Automatic handling of expired access tokens with retry logic and redirect loop prevention.
- **Product Management:**
    - Quantity controls for items.
    - Responsive product rows that adapt to mobile screens.
- **Order Management:**
    - Creating and managing orders.
    - Filtering orders.
- **Responsive Design:** Optimized for mobile, tablet, and desktop views.

## Getting Started

### Prerequisites

- Node.js (Latest LTS version recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd e-commerce-demo-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
   ```

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Folder Structure

- `src/app/`: Next.js App Router pages and layouts.
- `src/components/`: Reusable UI components.
- `src/hooks/`: Custom React hooks for business logic and data fetching.
- `src/lib/`: API client configurations, MUI theme, and utility functions.
- `src/providers/`: React Context providers (Auth, Query).
- `src/types/`: TypeScript interfaces and types.

## Authentication Logic

The application implements a robust authentication flow in `src/lib/api.ts` which includes:
- Intercepting 401 Unauthorized errors.
- Attempting to refresh the session via `/auth/refresh`.
- Retrying the original request after a successful refresh.
- Redirect loop protection if the refresh fails or the user is already on the login page.

## License

This project is for demonstration purposes.
