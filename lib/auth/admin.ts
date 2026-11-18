import 'server-only';
import { getSessionUser } from './session';

export async function requireCandidate() {
  const user = await getSessionUser();
  if (!user || user.role !== 'candidate') return null;
  return user;
}

export async function requireStaff() {
  const user = await getSessionUser();
  if (!user || !['admin', 'advisor'].includes(user.role)) return null;
  return user;
}
