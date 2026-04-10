export const environment = {
  production: true,
  apiUrl:
    process.env['NX_API_URL'] || 'https://todo-list-5iqb.onrender.com/api',
  firebase: {
    apiKey: process.env['NX_FIREBASE_API_KEY'] || '',
    authDomain: process.env['NX_FIREBASE_AUTH_DOMAIN'] || '',
    projectId: process.env['NX_FIREBASE_PROJECT_ID'] || '',
    storageBucket: process.env['NX_FIREBASE_STORAGE_BUCKET'] || '',
    messagingSenderId: process.env['NX_FIREBASE_MESSAGING_SENDER_ID'] || '',
    appId: process.env['NX_FIREBASE_APP_ID'] || '',
  },
};
