export const paths = {
  marketing: {
    home: "/",
  },
  auth: {
    login: "/login",
    signup: "/signup",
    forgotPassword: "/forgot-password",
    resetPassword: "/reset-password",
    verifyEmail: "/verify-email",
  },
  dashboard: {
    root: "/dashboard",
    settings: "/dashboard/settings",
  },
} as const;

type Leaf<T> = T extends string ? T : { [K in keyof T]: Leaf<T[K]> }[keyof T];

/** Union of every route leaf — use for typed hrefs and redirects. */
export type AppPath = Leaf<typeof paths>;
