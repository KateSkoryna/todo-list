// This file can be replaced during build by using the `fileReplacements` array.
// When building for production, this file is replaced with `environment.prod.ts`.

export const environment = {
  production: false,
  apiUrl: process.env['NX_API_URL'] || 'http://localhost:3333/api',
  firebase: {
    apiKey: process.env['NX_FIREBASE_API_KEY'] || '',
    authDomain: process.env['NX_FIREBASE_AUTH_DOMAIN'] || '',
    projectId: process.env['NX_FIREBASE_PROJECT_ID'] || '',
    storageBucket: process.env['NX_FIREBASE_STORAGE_BUCKET'] || '',
    messagingSenderId: process.env['NX_FIREBASE_MESSAGING_SENDER_ID'] || '',
    appId: process.env['NX_FIREBASE_APP_ID'] || '',
  },
};
