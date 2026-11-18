process.env.LOCAL_DEV_AUTH = 'true';
process.env.LOCAL_DEV_SECRET = 'unit-test-secret-value-with-more-than-32-characters';
process.env.LOCAL_ACCOUNT_STORE_PATH = `/tmp/startinde-local-accounts-vitest-${process.pid}.json`;
