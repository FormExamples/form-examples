import "clsx";
function _layout($$renderer, $$props) {
  let { children } = $$props;
  $$renderer.push(`<div class="max-w-7xl mx-auto p-6"><header class="mb-4 pb-3 border-b"><h1 class="text-2xl font-bold text-brand-600">Agile Checklist Dashboard</h1> <p class="text-sm text-slate-600">Recent checklist submissions, composite maturity, and operational flags.</p></header> `);
  children($$renderer);
  $$renderer.push(`<!----></div>`);
}
export {
  _layout as default
};
