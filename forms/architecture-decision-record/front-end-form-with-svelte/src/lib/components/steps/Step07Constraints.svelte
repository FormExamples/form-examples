<script lang="ts">
  import { store } from '$lib/stores/adr.svelte.js';
</script>

<section>
  <h2 class="text-xl font-semibold mb-2">Step 7 — Constraints</h2>
  <p class="text-sm text-slate-600 mb-4">
    Tyree &amp; Akerman §6: environmental limits imposed by the decision.
  </p>
  <textarea
    class="w-full border rounded px-2 py-1 font-mono text-sm"
    rows="6"
    placeholder="One constraint per line."
    bind:value={store.data.adr.constraints}
  ></textarea>
</section>
