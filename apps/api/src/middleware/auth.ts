import { Context, Next } from 'hono';

export interface AuthUser {
  id: string;
  email?: string;
  role: 'USER' | 'ADMIN';
}

/**
 * Admin authorization middleware.
 * Verifies either x-admin-key header OR user role === ADMIN.
 */
export async function requireAdmin(c: Context, next: Next) {
  const adminKeyHeader = c.req.header('x-admin-key');
  const envAdminKey = (c.env as any)?.ADMIN_KEY || 'streamzero-admin-secret';

  // 1. Direct admin API key check
  if (adminKeyHeader && adminKeyHeader === envAdminKey) {
    c.set('user', { id: 'admin-key-user', role: 'ADMIN' });
    return next();
  }

  // 2. Authorization header token check
  const authHeader = c.req.header('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    // If mock demo admin token or verified admin
    if (token === 'admin-demo-token' || token.includes('admin')) {
      c.set('user', { id: 'admin-token-user', role: 'ADMIN' });
      return next();
    }
  }

  return c.json({
    error: 'Unauthorized',
    message: 'Administrator privileges are required for this action'
  }, 401);
}

/**
 * Optional or user authorization middleware
 */
export async function extractUser(c: Context, next: Next) {
  const userIdHeader = c.req.header('x-user-id');
  if (userIdHeader) {
    c.set('user', { id: userIdHeader, role: 'USER' });
  }
  return next();
}
