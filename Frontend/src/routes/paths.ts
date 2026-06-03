export const paths = {
  home: "/",
  login: "/login",
  register: "/register",
  dashboard: "/dashboard",
} as const;

export type AppPath = (typeof paths)[keyof typeof paths];
