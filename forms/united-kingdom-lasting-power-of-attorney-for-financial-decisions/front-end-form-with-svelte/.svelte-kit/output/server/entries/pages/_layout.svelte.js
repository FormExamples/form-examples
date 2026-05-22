import "clsx";
function _layout($$renderer, $$props) {
  let { children } = $$props;
  $$renderer.push(`<div class="min-h-screen flex flex-col"><header class="bg-brand-900 text-white"><div class="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between"><a href="/" class="flex flex-col"><span class="text-xs uppercase tracking-wide opacity-80">Office of the Public Guardian</span> <span class="text-lg font-semibold">Lasting Power of Attorney — Property and Financial Affairs (LP1F)</span></a> <nav class="text-sm"><a href="/" class="hover:underline">Home</a></nav></div></header> <main class="flex-1 max-w-6xl mx-auto w-full px-4 py-6">`);
  children($$renderer);
  $$renderer.push(`<!----></main> <footer class="bg-slate-100 border-t border-slate-200"><div class="max-w-6xl mx-auto px-4 py-4 text-xs text-slate-600 space-y-1"><p>Office of the Public Guardian, PO Box 16185, Birmingham B2 2WH · Telephone
        0300 456 0300 · Welsh language 0300 456 3105.</p> <p>This is a non-official reference implementation of the LP1F form. Always use the
        official form at <a class="underline" href="https://www.gov.uk/power-of-attorney">gov.uk/power-of-attorney</a> for a real application.</p></div></footer></div>`);
}
export {
  _layout as default
};
