import { createAuthClient } from "better-auth/react";

// Same-origin: Next.js proxies /api/* to Express, so no baseURL needed.
export const authClient = createAuthClient();

export const useSession: typeof authClient.useSession = authClient.useSession;
export const signIn: typeof authClient.signIn = authClient.signIn;
export const signUp: typeof authClient.signUp = authClient.signUp;
export const signOut: typeof authClient.signOut = authClient.signOut;

export type Session = typeof authClient.$Infer.Session;
