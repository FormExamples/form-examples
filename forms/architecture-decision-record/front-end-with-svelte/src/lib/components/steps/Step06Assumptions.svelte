<script lang="ts">
  import { store } from '#lib/stores/adr.svelte.js';
</script>

<section>
  <h2 class="text-xl font-semibold mb-2">Step 6 — Assumptions</h2>
  <p class="text-sm text-base-content/70 mb-4">
    Tyree &amp; Akerman §5: environmental factors influencing the decision (cost, schedule, technology).
  </p>
  <textarea
    class="w-full border rounded px-2 py-1 font-mono text-sm"
    rows="6"
    placeholder="One assumption per line."
    bind:value={store.data.adr.assumptions}
  ></textarea>
</section>
