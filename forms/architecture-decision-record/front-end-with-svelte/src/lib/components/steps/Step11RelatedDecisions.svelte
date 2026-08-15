<script lang="ts">
  import { store } from '#lib/stores/adr.svelte.js';
</script>

<section>
  <h2 class="text-xl font-semibold mb-2">Step 11 — Related decisions</h2>
  <p class="text-sm text-base-content/70 mb-4">
    Tyree &amp; Akerman §10: other ADRs this depends on, supersedes, or is
    superseded by. One per line.
  </p>
  <textarea
    class="w-full border rounded px-2 py-1 font-mono text-sm"
    rows="5"
    placeholder="ADR 0017 — Use event sourcing&#10;ADR 0023 — Adopt CQRS for write path"
    bind:value={store.data.adr.relatedDecisions}
  ></textarea>
</section>
