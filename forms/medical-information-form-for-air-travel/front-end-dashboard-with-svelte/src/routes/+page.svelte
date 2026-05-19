<script lang="ts">
  import Dashboard from '$lib/dashboard.svelte';
  import { SAMPLE_MEDIFS, type MedifRow } from '$lib/sample-data.js';

  let filterBand = $state<string>('');

  const filtered = $derived<MedifRow[]>(
    SAMPLE_MEDIFS.filter((r) => !filterBand || r.band === filterBand),
  );
</script>

<div class="flex gap-3 mb-4 items-end">
  <label>
    <span class="text-sm block">Fitness band</span>
    <select class="border rounded px-2 py-1" bind:value={filterBand}>
      <option value="">All</option>
      <option value="fit">Fit</option>
      <option value="fit-with-conditions">Fit with conditions</option>
      <option value="requires-review">Requires review</option>
      <option value="unfit-to-fly">Unfit to fly</option>
    </select>
  </label>
  <p class="text-sm text-slate-500 ml-auto">{filtered.length} of {SAMPLE_MEDIFS.length} MEDIFs</p>
</div>

<div class="bg-white rounded-lg shadow p-2">
  <Dashboard rows={filtered} />
</div>

<p class="text-xs text-slate-500 mt-4">
  Standalone fallback shows sample MEDIFs. In production, rows come from the
  Rust backend's <code>/api/medifs</code> endpoint.
</p>
