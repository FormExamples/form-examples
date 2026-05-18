<script lang="ts">
  import { goto } from '$app/navigation';
  import { store } from '$lib/stores/adr.svelte.js';
  import { buildMarkdown } from '$lib/report/build-markdown.js';

  const md = $derived(buildMarkdown(store.data));
  const filename = $derived(
    (store.data.adr.number
      ? String(store.data.adr.number).padStart(4, '0')
      : 'NNNN') +
      '-' +
      (store.data.adr.slug || 'adr') +
      '.md'
  );

  function copyToClipboard() {
    if (navigator.clipboard) navigator.clipboard.writeText(md);
  }

  function download() {
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
</script>

<section class="bg-white p-6 rounded-lg shadow-sm">
  <div class="flex justify-between items-center mb-4">
    <h2 class="text-xl font-semibold">Markdown ADR</h2>
    <button
      type="button"
      class="text-sm text-brand-700 underline"
      onclick={() => goto('/')}
    >
      ← Back to wizard
    </button>
  </div>

  <p class="text-sm text-slate-600 mb-4">
    Copy the Markdown into your repo at
    <code>docs/adr/{filename}</code>.
  </p>

  <div class="flex gap-2 mb-4">
    <button
      type="button"
      class="px-3 py-1.5 rounded bg-brand-600 text-white text-sm hover:bg-brand-700"
      onclick={copyToClipboard}
    >
      Copy to clipboard
    </button>
    <button
      type="button"
      class="px-3 py-1.5 rounded bg-slate-200 text-slate-900 text-sm hover:bg-slate-300"
      onclick={download}
    >
      Download .md
    </button>
  </div>

  <pre
    class="bg-slate-900 text-slate-100 p-4 rounded text-xs overflow-x-auto whitespace-pre"
  >{md}</pre>
</section>
