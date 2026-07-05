/**
 * Platform user profile document.
 * Supabase table: `platform_users` (row id === Supabase Auth user id).
 *
 * This is distinct from Supabase Auth's own user record — it stores the
 * app-specific profile (which business the person owns/works for, role, etc).
 */

export type PlatformUserRole = 'owner' | 'staff';

export interface PlatformUser {
  uid: string;
  name: string;
  email: string;
  businessId: string;
  role: PlatformUserRole;
  createdAt: string;
}
