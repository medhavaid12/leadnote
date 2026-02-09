import React, { useState, useEffect } from 'react';
import Notes from './pages/Notes';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [useFirebase, setUseFirebase] = useState(false);

  // Try to load Firebase if configured
  useEffect(() => {
    const tryFirebaseAuth = async () => {
      try {
        const { auth } = await import('./firebase');
        const { onAuthStateChanged } = await import('firebase/auth');
        
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          if (currentUser) {
            setUser(currentUser);
            setUseFirebase(true);
            console.log('✓ Firebase user signed in:', currentUser.email);
          }
        });
        return unsubscribe;
      } catch (error) {
        console.log('Firebase not available, using demo mode:', error.message);
        // Check if user was previously logged in with demo auth
        const savedUser = localStorage.getItem('demoUser');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      }
    };

    let unsubscribe;
    tryFirebaseAuth().then(unsub => {
      unsubscribe = unsub;
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      console.log('1️⃣ Importing Firebase modules...');
      const { auth, googleProvider } = await import('./firebase');
      const { signInWithPopup } = await import('firebase/auth');
      
      console.log('2️⃣ Firebase modules loaded successfully');
      console.log('3️⃣ Auth object:', auth);
      console.log('4️⃣ Google Provider:', googleProvider);
      console.log('5️⃣ Attempting Firebase Google Sign-in pop-up...');
      
      const result = await signInWithPopup(auth, googleProvider);
      console.log('✅ Firebase Login Successful:', result.user.email);
      setUseFirebase(true);
    } catch (error) {
      console.error('❌ FIREBASE ERROR:');
      console.error('Error Code:', error.code);
      console.error('Error Message:', error.message);
      console.error('Full Error:', error);
      
      // Show different messages based on error code
      let userMessage = 'Firebase Sign-in failed';
      
      if (error.code === 'auth/invalid-api-key') {
        userMessage = '⚠️ Invalid API Key! Check your Firebase config.';
      } else if (error.code === 'auth/app-not-authorized') {
        userMessage = '⚠️ App not authorized. Enable Google signin in Firebase Console.';
      } else if (error.code === 'auth/operation-not-supported-in-this-environment') {
        userMessage = '⚠️ Pop-ups blocked or not supported.';
      } else if (error.code === 'auth/popup-closed-by-user') {
        userMessage = '⚠️ You closed the sign-in popup.';
      } else if (error.code === 'auth/cancelled-popup-request') {
        userMessage = '⚠️ Sign-in was cancelled.';
      }
      
      alert(userMessage + '\n\nError: ' + error.message + '\n\nCheck browser console for details.');
      
      // Don't auto-fallback, let user choose
    }
  };

  const handleDemoSignIn = () => {
    if (!email.trim()) {
      alert('Please enter an email');
      return;
    }

    const demoUser = {
      uid: 'demo-user-' + Date.now(),
      email: email,
      displayName: email.split('@')[0],
      isDemo: true
    };

    setUser(demoUser);
    localStorage.setItem('demoUser', JSON.stringify(demoUser));
    setEmail('');
  };

  const handleSignOut = async () => {
    try {
      if (useFirebase) {
        const { auth } = await import('./firebase');
        const { signOut } = await import('firebase/auth');
        await signOut(auth);
      }
    } catch (error) {
      console.error('Sign-out error:', error);
    }

    setUser(null);
    setUseFirebase(false);
    localStorage.removeItem('demoUser');
  };

  if (!user) {
    return (
      <div className="auth-container">
        <div className="auth-box">
          <h1>📌 Lead Notes</h1>
          <p>Sign in to manage your notes</p>

          <button onClick={handleGoogleSignIn} className="google-btn">
            <span>🔐</span> Sign in with Google
          </button>

          <div className="divider">OR</div>

          <div className="demo-signin">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email (demo mode)"
              className="demo-input"
              onKeyPress={e => e.key === 'Enter' && handleDemoSignIn()}
            />
            <button onClick={handleDemoSignIn} className="demo-btn">
              ✓ Continue as Demo User
            </button>
          </div>


        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <h1>📌 Lead Notes</h1>
        <div className="user-info">
          <span>Welcome, {user.displayName || user.email}</span>
          {user.isDemo && <span className="demo-badge">Demo Mode</span>}
          <button onClick={handleSignOut} className="signout-btn">Sign Out</button>
        </div>
      </div>
      <Notes user={user} />
    </div>
  );
}

export default App;

