

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.B3HgwH-0.js","_app/immutable/chunks/B6NgeR8s.js","_app/immutable/chunks/DkgCB71v.js","_app/immutable/chunks/ChrVbQS1.js"];
export const stylesheets = [];
export const fonts = [];
