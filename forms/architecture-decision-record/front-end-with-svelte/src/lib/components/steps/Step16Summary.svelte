<script lang="ts">
  import { store } from '$lib/stores/adr.svelte.js';
</script>

<section>
  <h2 class="text-xl font-semibold mb-2">Step 16 — Summary &amp; sign-off</h2>
  <p class="text-sm text-base-content/70 mb-4">
    Confirm sign-off. The next button generates the Markdown ADR.
  </p>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <label class="block">
      <span class="text-sm text-base-content">Signed off by</span>
      <input type="text" class="w-full border rounded px-2 py-1" bind:value={store.data.adr.signedOffBy} />
    </label>
    <label class="block">
      <span class="text-sm text-base-content">Signed off at (ISO timestamp)</span>
      <input type="text" class="w-full border rounded px-2 py-1" placeholder="2026-05-08T10:00:00Z" bind:value={store.data.adr.signedOffAt} />
    </label>
  </div>
</section>
