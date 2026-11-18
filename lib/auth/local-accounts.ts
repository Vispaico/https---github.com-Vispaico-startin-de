import 'server-only';
import { randomBytes, randomUUID, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.join(process.cwd(), '.private-data');
const accountFile = process.env.LOCAL_ACCOUNT_STORE_PATH || path.join(root, 'local-accounts.json');
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
type LocalAccount = { id: string; email: string; passwordHash: string; createdAt: string };
type PublicLocalAccount = Pick<LocalAccount, 'id' | 'email'>;

function derive(password: string, salt: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scryptCallback(password, salt, 64, { N: 32_768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 }, (error, key) => {
      if (error) reject(error);
      else resolve(key as Buffer);
    });
  });
}

async function readAccounts(): Promise<LocalAccount[]> {
  try {
    const parsed: unknown = JSON.parse(await readFile(/*turbopackIgnore: true*/ accountFile, 'utf8'));
    if (!Array.isArray(parsed)) throw new Error('Local account store is invalid.');
    return parsed as LocalAccount[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return [];
    throw error;
  }
}

let writeQueue: Promise<void> = Promise.resolve();
async function persistAccounts(accounts: LocalAccount[]) {
  await mkdir(path.dirname(accountFile), { recursive: true, mode: 0o700 });
  const temporary = `${accountFile}.${randomUUID()}.tmp`;
  await writeFile(temporary, JSON.stringify(accounts), { mode: 0o600, flag: 'wx' });
  await rename(temporary, accountFile);
}

export function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export function validRegistration(email: string, password: string) {
  return email.length <= 254 && emailPattern.test(email) && password.length >= 12 && Buffer.byteLength(password, 'utf8') <= 1024;
}

export async function createLocalAccount(emailInput: string, password: string): Promise<PublicLocalAccount | null> {
  const email = normalizeEmail(emailInput);
  if (!validRegistration(email, password)) throw new Error('Registration details are invalid.');
  let result: PublicLocalAccount | null = null;
  const operation = writeQueue.then(async () => {
    const accounts = await readAccounts();
    if (accounts.some((account) => account.email === email)) return;
    const salt = randomBytes(16);
    const passwordHash = `scrypt$32768$${salt.toString('base64url')}$${(await derive(password, salt)).toString('base64url')}`;
    const account: LocalAccount = { id: randomUUID(), email, passwordHash, createdAt: new Date().toISOString() };
    await persistAccounts([...accounts, account]);
    result = { id: account.id, email: account.email };
  });
  writeQueue = operation.catch(() => undefined);
  await operation;
  return result;
}

export async function verifyLocalAccount(emailInput: string, password: string): Promise<PublicLocalAccount | null> {
  const email = normalizeEmail(emailInput);
  const account = (await readAccounts()).find((item) => item.email === email);
  if (!account) return null;
  const [algorithm, cost, saltText, hashText] = account.passwordHash.split('$');
  if (algorithm !== 'scrypt' || cost !== '32768' || !saltText || !hashText) return null;
  try {
    const expected = Buffer.from(hashText, 'base64url');
    const actual = await derive(password, Buffer.from(saltText, 'base64url'));
    if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;
    return { id: account.id, email: account.email };
  } catch {
    return null;
  }
}

