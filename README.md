# HabitPulse - Daily Habit Tracker

A modern, minimalist habit tracking application built with Next.js 13, MongoDB, and TailwindCSS. Track your daily habits, visualize your progress, and build better routines.

## Features

- 🔐 Google Authentication
- 📊 Visual progress tracking
- 📅 Calendar view for habit completion
- 🎨 Customizable habit colors and emojis
- 📱 Responsive design
- 🌙 Dark mode
- 🔄 Real-time updates

## Tech Stack

- **Frontend**: Next.js 13, React, TailwindCSS, shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js
- **Deployment**: Vercel

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/SurajSakhare100/habit-pulse.git
   cd habit-pulse
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   MONGODB_URI=your_mongodb_uri
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser.

## Environment Variables

- `MONGODB_URI`: Your MongoDB connection string
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret
- `NEXTAUTH_URL`: Base URL of your application
- `NEXTAUTH_SECRET`: Random string for NextAuth.js session encryption

## Deployment

The easiest way to deploy this app is to use the [Vercel Platform](https://vercel.com/new) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
