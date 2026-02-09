# LeadNotes - Full Stack Application

A modern note-taking application with Google Sign-in authentication and Firebase integration.

## Features

✨ **User Authentication**: Google Sign-in via Firebase
📝 **Create, Read, Delete Notes**: Full CRUD operations
🔐 **Firebase Token Verification**: Secure backend routes
🎨 **Beautiful UI**: Modern, responsive design
💾 **MongoDB Integration**: Persistent data storage (optional)

## Project Structure

```
LeadNotes_FullStack_Internship/
├── backend/
│   ├── src/
│   │   ├── index.js              # Server entry point
│   │   ├── models/
│   │   │   └── Note.js           # MongoDB Note schema
│   │   ├── routes/
│   │   │   └── noteRoutes.js     # Note API routes
│   │   └── middleware/
│   │       └── authMiddleware.js # Firebase token verification
│   ├── .env                      # Environment variables
│   └── package.json              # Dependencies
│
└── frontend/
    ├── src/
    │   ├── App.jsx              # Main app component with auth
    │   ├── App.css              # Global styles
    │   ├── firebase.js          # Firebase configuration
    │   ├── firebaseConfig.js    # Firebase credentials
    │   ├── index.js             # React entry point
    │   └── pages/
    │       └── Notes.jsx        # Notes component
    ├── public/
    │   └── index.html           # HTML template
    └── package.json             # Dependencies
```

## Prerequisites

- Node.js (v14+)
- npm or yarn
- Firebase account (for Google Sign-in)
- MongoDB (optional, app works without it)

## Setup Instructions

### 1. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Google Sign-in:
   - Go to **Authentication** → **Sign-in method**
   - Enable **Google**
4. Get your web app credentials:
   - Go to **Project Settings** → **Your apps** → **Web**
   - Copy the configuration

### 1b. Firebase Admin (backend token verification)

To enable backend verification of Firebase ID tokens you must provide a Firebase service account to the backend. There are two ways:

- Set the environment variable `FIREBASE_SERVICE_ACCOUNT` to the JSON contents of the service account (not recommended for production but OK for local testing). Example in `.env`:

```
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"..."}
```

- Or set `GOOGLE_APPLICATION_CREDENTIALS` to the path of the service account JSON file and ensure the backend process can read it:

```
GOOGLE_APPLICATION_CREDENTIALS=C:\path\to\serviceAccountKey.json
```

When the backend finds a service account it will enforce token verification and return `401` for requests without a valid Firebase ID token. If no service account is configured the backend runs in demo mode and accepts requests without tokens.

### 2. Frontend Setup

1. Update Firebase credentials:
   ```bash
   # Edit frontend/src/firebaseConfig.js
   # Replace with your Firebase credentials
   ```

2. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

3. Start development server:
   ```bash
   npm start
   ```
   - Opens at `http://localhost:3000`

### 3. Backend Setup

1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Create `.env` file:
   ```bash
   MONGO_URI=mongodb://localhost:27017/leadnotes
   PORT=5000
   NODE_ENV=development
   # Optional: Add Firebase Admin SDK service account
   # FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}
   ```

3. Start development server:
   ```bash
   npm start
   ```
   - Runs at `http://localhost:5000`

## API Endpoints

### Notes Endpoints

All endpoints are protected with Firebase token verification.

#### GET `/notes`
- Retrieve all notes
- **Headers**: `Authorization: Bearer {firebaseToken}`
- **Response**: Array of notes

#### POST `/notes`
- Create a new note
- **Headers**: `Authorization: Bearer {firebaseToken}`
- **Body**: `{ "text": "Note content", "userId": "firebase-uid" }`
- **Response**: Created note object

#### DELETE `/notes/:id`
- Delete a note by ID
- **Headers**: `Authorization: Bearer {firebaseToken}`
- **Response**: `{ "message": "Note deleted" }`

#### GET `/health`
- Check if backend is running
- **Response**: `{ "status": "Backend is running" }`

## Environment Variables

### Backend (.env)
```
MONGO_URI=mongodb://localhost:27017/leadnotes
PORT=5000
NODE_ENV=development
FIREBASE_SERVICE_ACCOUNT=<optional>
```

### Frontend (firebaseConfig.js)
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

## Development

### Running Both Servers

In two separate terminal windows:

```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm start
```

### Using In-Memory Storage

The app works without MongoDB by using in-memory storage. Notes will be cleared on server restart.

### With MongoDB (Optional)

1. Install MongoDB locally or use MongoDB Atlas
2. Update `MONGO_URI` in backend `.env`
3. Notes will persist across server restarts

## Features Explained

### 1. Google Sign-In
- Click "Sign in with Google" on the login page
- Requires Firebase configuration
- Redirects to notes app after authentication

### 2. Note Management
- Add notes by typing and clicking "Add" or pressing Enter
- Each note shows creation timestamp
- Delete notes with the delete button
- Notes are filtered by user

### 3. Firebase Authentication
- Frontend obtains ID token from Firebase
- Sends token in Authorization header
- Backend verifies token (if Firebase Admin configured)
- Gracefully degrades if verification fails

### 4. Responsive Design
- Works on desktop and mobile
- Beautiful gradient backgrounds
- Smooth animations and transitions

## Troubleshooting

### "Site can't be reached"
- Ensure both backend and frontend servers are running
- Check ports: Frontend=3000, Backend=5000
- Clear browser cache and refresh

### "Failed to fetch notes"
- Backend is not running
- Check backend logs: `npm start` should show "Server running on port 5000"
- Ensure MongoDB connection (if using)

### "Sign-in failed"
- Firebase credentials not configured
- Update `firebaseConfig.js` with your credentials
- Enable Google sign-in in Firebase Console

### "Notes not persisting"
- You're using in-memory storage
- Configure MongoDB in `.env` and restart server

## Production Deployment

### Frontend (Vercel/Netlify)
1. Build the app: `npm run build`
2. Deploy the `build` folder
3. Update Firebase authorized domains

### Backend (Heroku/Railway)
1. Set environment variables
2. Deploy `backend` folder
3. Ensure MongoDB URI is accessible

## Technologies Used

### Frontend
- React
- Axios (HTTP client)
- Firebase Authentication
- CSS3

### Backend
- Node.js
- Express
- MongoDB & Mongoose
- Firebase Admin SDK
- CORS

## License

This project is part of the LeadNotes Full Stack Internship Program.

## Support

For issues or questions:
1. Check Firebase console configuration
2. Verify environment variables
3. Check browser console for errors
4. Check backend logs for API errors
