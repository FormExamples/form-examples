<script lang="ts">
  import { store } from '$lib/stores/adr.svelte.js';
</script>

<section>
  <h2 class="text-xl font-semibold mb-2">Step 12 — Related requirements</h2>
  <p class="text-sm text-slate-600 mb-4">
    Tyree &amp; Akerman §11: business or functional requirements addressed.
    One per line.
  </p>
  <textarea
    class="w-full border rounded px-2 py-1 font-mono text-sm"
    rows="5"
    placeholder="REQ-101 — Sub-second p95 latency&#10;REQ-204 — GDPR-compliant data residency"
    bind:value={store.data.adr.relatedRequirements}
  ></textarea>
</section>
