<script lang="ts">
  import { store } from '#lib/stores/adr.svelte.js';
</script>

<section>
  <h2 class="text-xl font-semibold mb-2">Step 9 — Argument</h2>
  <p class="text-sm text-base-content/70 mb-4">
    Tyree &amp; Akerman §8: rationale for the chosen position over the others
    (cost of implementation, ownership, time-to-market, resourcing).
  </p>
  <textarea
    class="w-full border rounded px-2 py-1 font-mono text-sm"
    rows="6"
    placeholder="Why this position over the others?"
    bind:value={store.data.adr.argument}
  ></textarea>
</section>
