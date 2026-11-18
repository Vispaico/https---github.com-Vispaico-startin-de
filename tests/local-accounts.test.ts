import { afterAll, describe, expect, it } from 'vitest';
import { rm } from 'node:fs/promises';
import { createLocalAccount, validRegistration, verifyLocalAccount } from '../lib/auth/local-accounts';

const accountFile = process.env.LOCAL_ACCOUNT_STORE_PATH!;
const email = `candidate-${process.pid}@example.test`;
const password = 'a-local-test-password-42';

afterAll(async () => { await rm(accountFile, { force: true }); });

describe('local development account registration', () => {
  it('requires a valid email and a long password', () => {
    expect(validRegistration('not-an-email', password)).toBe(false);
    expect(validRegistration('candidate@example.test', 'short')).toBe(false);
    expect(validRegistration('candidate@example.test', 'long-enough-password')).toBe(true);
  });

  it('stores a password hash and verifies the candidate credentials', async () => {
    const created = await createLocalAccount(`  ${email.toUpperCase()} `, password);
    expect(created).toMatchObject({ email });
    expect(await verifyLocalAccount(email, password)).toEqual(created);
    expect(await verifyLocalAccount(email, 'incorrect-password')).toBeNull();
  });

  it('does not allow a duplicate email with different casing', async () => {
    expect(await createLocalAccount(email.toUpperCase(), password)).toBeNull();
  });
});
