

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.0DP2S_Kj.js","_app/immutable/chunks/CYaxtGL2.js"];
export const stylesheets = ["_app/immutable/assets/0.KwfPR30a.css"];
export const fonts = [];
