import {
  getAuth, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  type User,
  type UserCredential
} from "firebase/auth";

import app from "./firebaseConfig";

export const auth = getAuth(app);
/**
 * Kirjautuminen sähköposti + salasana
 */
export const loginWithEmail = async (
  email: string,
  password: string
): Promise<User> => {
  const result: UserCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  return result.user;
};

/**
 * Käyttäjän rekisteröinti (Ei tässä tehtävässä välttämätön)
 */
export const registerWithEmail = async (
  email: string,
  password: string
): Promise<User> => {
  const result: UserCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  return result.user;
};

/**
 * Kirjautuminen ulos
 */
export const logout = async (): Promise<void> => {
  await signOut(auth);
};