/** Navigation tab in the portal */
export interface PortalTab {
  id: string;
  label: string;
  href: string;
  active: boolean;
}

/** User role for RBAC */
export type UserRole = "investor" | "admin" | "consumer" | "b2b";

/** Portal configuration */
export interface PortalConfig {
  appName: string;
  appUrl: string;
  roles: UserRole[];
}
