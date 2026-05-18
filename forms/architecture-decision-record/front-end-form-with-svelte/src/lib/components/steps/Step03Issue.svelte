<script lang="ts">
  import { store } from '$lib/stores/adr.svelte.js';
</script>

<section>
  <h2 class="text-xl font-semibold mb-2">Step 3 — Issue</h2>
  <p class="text-sm text-slate-600 mb-4">
    Tyree &amp; Akerman §1: the architectural design issue being addressed; explain why now.
  </p>
  <textarea
    class="w-full border rounded px-2 py-1 font-mono text-sm"
    rows="6"
    placeholder="What is the architectural design issue? Why now?"
    bind:value={store.data.adr.issue}
  ></textarea>
</section>
