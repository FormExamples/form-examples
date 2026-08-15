<script lang="ts">
  import { store } from '#lib/stores/adr.svelte.js';
</script>

<section>
  <h2 class="text-xl font-semibold mb-2">Step 10 — Implications</h2>
  <p class="text-sm text-base-content/70 mb-4">
    Tyree &amp; Akerman §9: consequences, follow-on decisions, scope/schedule
    impact, training requirements.
  </p>
  <textarea
    class="w-full border rounded px-2 py-1 font-mono text-sm"
    rows="6"
    placeholder="Consequences and follow-on impact."
    bind:value={store.data.adr.implications}
  ></textarea>
</section>
