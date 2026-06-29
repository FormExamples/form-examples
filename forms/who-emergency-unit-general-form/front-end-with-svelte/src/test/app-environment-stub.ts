// Minimal stub for SvelteKit's `$app/environment` module so the engine unit
// tests can import the store (which reads `browser`) under plain Vitest, where
// the SvelteKit module graph is not present. Tests run in a non-browser
// context, so `browser` is false.
export const browser = false;
export const building = false;
export const dev = false;
export const version = 'test';
