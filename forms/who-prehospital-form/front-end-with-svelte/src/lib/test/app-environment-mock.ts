// Test-only stub for SvelteKit's `$app/environment` module so engine unit tests
// can import the store (and its `createDefaultAssessment` factory) under plain
// Vitest, which does not provide SvelteKit's ambient `$app/*` modules.
export const browser = false;
export const building = false;
export const dev = false;
export const version = 'test';
