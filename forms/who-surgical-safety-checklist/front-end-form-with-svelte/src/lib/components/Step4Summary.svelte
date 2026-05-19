<script lang="ts">
  import { store } from '$lib/stores/checklist.svelte.js';
  import FlagBanner from '$lib/components/ui/FlagBanner.svelte';
  import { buildPdfDoc } from '$lib/report/pdf-builder.js';

  const d = $derived(store.data);
  const flags = $derived(store.flags);
  const status = $derived(store.status);

  async function downloadPdf() {
    if (typeof window === 'undefined') return;
    // Dynamic import keeps pdfmake out of the SSR bundle.
    const pdfMakeModule = await import('pdfmake/build/pdfmake.js');
    const pdfFontsModule = await import('pdfmake/build/vfs_fonts.js');
    const pdfMake: any = (pdfMakeModule as any).default ?? pdfMakeModule;
    const pdfFonts: any = (pdfFontsModule as any).default ?? pdfFontsModule;
    if (pdfFonts?.pdfMake?.vfs) {
      pdfMake.vfs = pdfFonts.pdfMake.vfs;
    } else if (pdfFonts?.vfs) {
      pdfMake.vfs = pdfFonts.vfs;
    }
    const doc = buildPdfDoc(d, flags, status);
    pdfMake.createPdf(doc).download('who-surgical-safety-checklist.pdf');
  }

  function downloadJson() {
    if (typeof window === 'undefined') return;
    const blob = new Blob([JSON.stringify(d, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'who-surgical-safety-checklist.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  function resetAll() {
    if (confirm('Discard this draft and start over?')) store.reset();
  }
</script>

<section>
  <h2 class="text-xl font-semibold mb-1">Step 4 — Summary</h2>
  <p class="text-sm text-slate-600 mb-4">
    Lifecycle status, safety flags, and export.
  </p>

  <div class="bg-slate-100 p-4 rounded mb-4">
    <p>
      <strong>Status:</strong>
      <span class="uppercase font-mono text-sm">{status}</span>
    </p>
    <p><strong>Procedure:</strong> {d.plannedProcedure || '—'}</p>
    <p>
      <strong>Theatre:</strong> {d.siteName || '—'} · {d.operatingRoom || '—'}
    </p>
    <p>
      <strong>Urgency:</strong> {d.urgency || '—'} ·
      <strong>Laterality:</strong> {d.laterality || '—'}
    </p>
    <p>
      <strong>Sign In:</strong>
      {d.signInCompletedAt
        ? `${d.signInCoordinatorName} — ${d.signInCompletedAt}`
        : 'pending'}
    </p>
    <p>
      <strong>Time Out:</strong>
      {d.timeOutCompletedAt
        ? `${d.timeOutCoordinatorName} — ${d.timeOutCompletedAt}`
        : 'pending'}
    </p>
    <p>
      <strong>Sign Out:</strong>
      {d.signOutCompletedAt
        ? `${d.signOutCoordinatorName} — ${d.signOutCompletedAt}`
        : 'pending'}
    </p>
  </div>

  <FlagBanner {flags} />

  {#if d.teamMembers.length > 0}
    <h3 class="font-semibold mt-6 mb-2">Operating team roster</h3>
    <ul class="list-disc list-inside text-sm space-y-1">
      {#each d.teamMembers as m, i (i)}
        <li>
          {m.name || '—'} <span class="text-slate-600">({m.role || '—'})</span>
          — introduced: {m.introducedDuringTimeOut || '—'}
        </li>
      {/each}
    </ul>
  {/if}

  <div class="mt-8 flex flex-wrap gap-3">
    <button
      type="button"
      class="px-4 py-2 rounded bg-brand-600 text-white hover:bg-brand-700"
      onclick={downloadPdf}
    >
      Download PDF
    </button>
    <button
      type="button"
      class="px-4 py-2 rounded border border-slate-300 text-slate-700 hover:bg-slate-100"
      onclick={downloadJson}
    >
      Download JSON
    </button>
    <button
      type="button"
      class="px-4 py-2 rounded border border-red-300 text-red-700 hover:bg-red-50"
      onclick={resetAll}
    >
      Reset checklist
    </button>
  </div>
</section>
