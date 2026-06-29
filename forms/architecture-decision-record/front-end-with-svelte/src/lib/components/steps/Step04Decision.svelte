<script lang="ts">
  import { store } from '$lib/stores/adr.svelte.js';
</script>

<section>
  <h2 class="text-xl font-semibold mb-2">Step 4 — Decision</h2>
  <p class="text-sm text-base-content/70 mb-4">Tyree &amp; Akerman §2: the position chosen, stated clearly.</p>
  <textarea
    id="adr-decision"
    class="w-full border rounded px-2 py-1 font-mono text-sm"
    rows="6"
    placeholder="State the chosen position clearly."
    bind:value={store.data.adr.decision}
  ></textarea>
</section>
