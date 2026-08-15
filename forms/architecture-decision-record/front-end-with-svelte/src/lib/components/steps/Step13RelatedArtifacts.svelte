<script lang="ts">
  import { store } from '#lib/stores/adr.svelte.js';
</script>

<section>
  <h2 class="text-xl font-semibold mb-2">Step 13 — Related artifacts</h2>
  <p class="text-sm text-base-content/70 mb-4">
    Tyree &amp; Akerman §12: designs, models, scope documents impacted.
    One per line.
  </p>
  <textarea
    class="w-full border rounded px-2 py-1 font-mono text-sm"
    rows="5"
    placeholder="C4 system context diagram&#10;OpenAPI spec for /v2 endpoints"
    bind:value={store.data.adr.relatedArtifacts}
  ></textarea>
</section>
