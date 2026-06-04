import { paths } from "./paths";

export type NavItem = {
  label: string;
  path: string;
};

export const privateNavItems: NavItem[] = [
  { label: "Dashboard", path: paths.dashboard },
];
