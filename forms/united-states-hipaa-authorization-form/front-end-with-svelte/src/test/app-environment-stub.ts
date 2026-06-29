// Test stub for SvelteKit's `$app/environment` module so the reactive store
// (which guards localStorage access with `browser`) can be imported under
// Vitest, where the SvelteKit virtual modules are not available.
export const browser = false;
export const dev = false;
export const building = false;
export const version = 'test';
