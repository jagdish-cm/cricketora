
# CricketOra Backend

This is the backend server for the CricketOra cricket scoring application. It provides APIs for match management, real-time scoring updates, and authentication.

## Technologies

- Node.js with Express
- TypeScript
- Firebase Firestore for database
- Socket.io for real-time updates

## Setup Instructions

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables**
   Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   NODE_ENV=development
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_PRIVATE_KEY=your-private-key
   FIREBASE_CLIENT_EMAIL=your-client-email
   CLIENT_URL=http://localhost:5173  # Your frontend URL
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   npm start
   ```

## API Documentation

### Authentication Endpoints

- `POST /api/auth/create-match` - Create a new match with scorer email
- `POST /api/auth/verify-otp` - Verify OTP for match access
- `POST /api/auth/resume-match` - Resume a match with ID and password
- `POST /api/auth/watch-match` - Watch a live match (public access)

### Match Management Endpoints

- `GET /api/matches/:id` - Get match details
- `PATCH /api/matches/:id` - Update match details
- `GET /api/matches/:id/live` - Get live match data (public view)
- `POST /api/matches/:id/events` - Record a ball event

## Socket.io Events

### Client Events
- `join-match` - Join a match room for real-time updates

### Server Events
- `score-update` - Real-time score updates
- `new-ball` - New ball event details
- `innings-complete` - Innings completion notification

## Firebase Setup

1. Create a Firebase project at https://console.firebase.google.com/
2. Set up Firestore database
3. Generate service account credentials
4. Add the credentials to your environment variables
