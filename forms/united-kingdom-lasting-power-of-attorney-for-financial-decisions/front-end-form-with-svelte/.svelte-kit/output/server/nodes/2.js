

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.CMBQncY5.js","_app/immutable/chunks/CIVlgTU4.js","_app/immutable/chunks/F2VREM2N.js","_app/immutable/chunks/6--zyWZu.js"];
export const stylesheets = [];
export const fonts = [];
