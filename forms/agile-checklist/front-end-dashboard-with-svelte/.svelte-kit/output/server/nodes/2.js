

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.DsRur3uH.js","_app/immutable/chunks/CYaxtGL2.js","_app/immutable/chunks/DGlywEG5.js"];
export const stylesheets = [];
export const fonts = [];
