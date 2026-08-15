<script lang="ts">
  import { store } from '#lib/stores/adr.svelte.js';
</script>

<section>
  <h2 class="text-xl font-semibold mb-2">Step 14 — Related principles</h2>
  <p class="text-sm text-base-content/70 mb-4">
    Tyree &amp; Akerman §13: enterprise principles this aligns with or breaks.
    One per line.
  </p>
  <textarea
    class="w-full border rounded px-2 py-1 font-mono text-sm"
    rows="5"
    placeholder="P-01 — Prefer managed services&#10;P-04 — Defence in depth"
    bind:value={store.data.adr.relatedPrinciples}
  ></textarea>
</section>
