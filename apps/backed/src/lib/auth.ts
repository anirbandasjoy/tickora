import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { getMongoClient } from '@repo/database';
import { config } from '../config/env';
import { sendEmail } from '../services/email/emailSender';

export async function initAuth() {
  const client = await getMongoClient(config.MONGO_URI);
  const db = client.db();

  return betterAuth({
    baseURL: config.BETTER_AUTH_URL,
    secret: config.BETTER_AUTH_SECRET,
    trustedOrigins: [config.CLIENT_URI],
    database: mongodbAdapter(db, {
      client,
      // Standalone local MongoDB has no replica set, so transactions
      // are unavailable. Set to true for Atlas / replica-set deployments.
      transaction: false,
    }),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
      minPasswordLength: 8,
      autoSignIn: true,
      resetPasswordTokenExpiresIn: 3600,
      revokeSessionsOnPasswordReset: true,
      sendResetPassword: async ({ user, url }) => {
        // Fire-and-forget to avoid timing attacks (official guidance).
        // .catch() is mandatory: an unhandled rejection crashes Node.
        void sendEmail({
          to: user.email,
          subject: 'Reset your password',
          text: `Reset your password: ${url}`,
          html: `<p>Reset your password: <a href="${url}">${url}</a></p>`,
        }).catch((err) => console.error('Reset email failed:', err));
      },
    },
    session: {
      cookieCache: {
        enabled: true,
        maxAge: 7 * 24 * 60 * 60,
      },
    },
    emailVerification: {
      sendOnSignUp: true,
      autoSignInAfterVerification: true,
      sendVerificationEmail: async ({ user, token }) => {
        // Build the frontend link (the default url points at the API origin).
        const url = `${config.CLIENT_URI}/verify-email?token=${token}&callbackURL=/dashboard`;
        // Fire-and-forget to avoid timing attacks (official guidance).
        // .catch() is mandatory: an unhandled rejection crashes Node.
        void sendEmail({
          to: user.email,
          subject: 'Verify your email address',
          text: `Verify your email: ${url}`,
          html: `<p>Verify your email: <a href="${url}">${url}</a></p>`,
        }).catch((err) => console.error('Verification email failed:', err));
      },
    },
    socialProviders: {
      google: {
        clientId: config.GOOGLE_CLIENT_ID,
        clientSecret: config.GOOGLE_CLIENT_SECRET,
        // Frontend origin: Next.js proxies /api/auth/* to Express.
        redirectURI:
          config.GOOGLE_REDIRECT_URI ?? `${config.CLIENT_URI}/api/auth/callback/google`,
      },
    },
  });
}

export type Auth = Awaited<ReturnType<typeof initAuth>>;
