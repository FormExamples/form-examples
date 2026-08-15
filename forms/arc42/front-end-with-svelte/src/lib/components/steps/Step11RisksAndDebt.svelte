<script lang="ts">
  import { store } from '#lib/stores/documentation.svelte.js';
  import RepeatList from '#lib/components/ui/RepeatList.svelte';
</script>

<section>
  <h2 class="text-xl font-semibold mb-4">Step 11 — Risks &amp; Technical Debt</h2>

  <RepeatList
    bind:items={store.data.riskItems}
    title="Risk items (max 10)"
    max={10}
    create={() => ({
      ordinal: store.data.riskItems.length + 1,
      kind: '',
      name: '',
      probability: '',
      impact: '',
      mitigation: '',
    })}>
    {#snippet children(r, _i)}
      <div class="grid grid-cols-2 gap-2 mb-1">
        <select class="border rounded px-2 py-1" bind:value={r.kind}>
          <option value="">Kind —</option>
          <option value="risk">Risk</option>
          <option value="technical-debt">Technical debt</option>
        </select>
        <input type="text" placeholder="Name" class="border rounded px-2 py-1" bind:value={r.name} />
        <select class="border rounded px-2 py-1" bind:value={r.probability}>
          <option value="">Probability —</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <select class="border rounded px-2 py-1" bind:value={r.impact}>
          <option value="">Impact —</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>
      <textarea rows="2" placeholder="Mitigation" class="w-full border rounded px-2 py-1" bind:value={r.mitigation}></textarea>
    {/snippet}
  </RepeatList>
</section>
