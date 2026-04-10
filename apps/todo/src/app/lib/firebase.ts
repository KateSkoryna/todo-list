import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  connectAuthEmulator,
} from 'firebase/auth';
import { environment } from '../../environments/environment';

const firebaseApp = initializeApp(environment.firebase);

export const auth = getAuth(firebaseApp);
export const googleProvider = new GoogleAuthProvider();

if (!environment.production) {
  connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
}
