/**
 * Firebase web config template — copy to firebase-config.js (gitignored) for local dev,
 * or set GitHub secret FIREBASE_WEB_CONFIG (base64 of firebase-config.js) for CI / site deploy.
 */
window.GIW_FIREBASE_CONFIG = {
  apiKey: 'REPLACE_ME',
  authDomain: 'REPLACE_ME.firebaseapp.com',
  projectId: 'REPLACE_ME',
  storageBucket: 'REPLACE_ME.firebasestorage.app',
  messagingSenderId: 'REPLACE_ME',
  appId: 'REPLACE_ME'
};

/** OAuth 2.0 Web client ID — Authentication → Sign-in method → Google → Web SDK configuration */
window.GIW_FIREBASE_WEB_CLIENT_ID = 'REPLACE_ME.apps.googleusercontent.com';
