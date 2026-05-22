

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export const universal = {
  "prerender": true,
  "ssr": false
};
export const universal_id = "src/routes/+layout.ts";
export const imports = ["_app/immutable/nodes/0.DX0r1n-L.js","_app/immutable/chunks/CIVlgTU4.js","_app/immutable/chunks/DozwDwk6.js","_app/immutable/chunks/CGZcaLJv.js"];
export const stylesheets = ["_app/immutable/assets/0.BtPtRAiu.css"];
export const fonts = [];
