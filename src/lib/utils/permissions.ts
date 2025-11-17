// =====================================================
// Permission & Authorization Utilities
// =====================================================

export type UserRole = 'super_admin' | 'admin' | 'support' | 'customer';

export const PERMISSIONS = {
  super_admin: [
    'view_customers',
    'edit_customers',
    'delete_customers',
    'view_orders',
    'edit_orders',
    'refund_orders',
    'view_subscriptions',
    'edit_subscriptions',
    'view_analytics',
    'view_integrations',
    'manage_admins',
    'adjust_points',
  ],
  admin: [
    'view_customers',
    'edit_customers',
    'view_orders',
    'edit_orders',
    'refund_orders',
    'view_subscriptions',
    'edit_subscriptions',
    'view_analytics',
    'view_integrations',
    'adjust_points',
  ],
  support: [
    'view_customers',
    'view_orders',
    'view_subscriptions',
  ],
  customer: [],
} as const;

export function hasPermission(role: UserRole, permission: string): boolean {
  return PERMISSIONS[role].includes(permission as any);
}

export function canAccessAdmin(role: UserRole): boolean {
  return role !== 'customer';
}
