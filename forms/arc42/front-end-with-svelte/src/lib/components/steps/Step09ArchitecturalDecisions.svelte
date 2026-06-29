<script lang="ts">
  import { store } from '$lib/stores/documentation.svelte.js';
  import RepeatList from '$lib/components/ui/RepeatList.svelte';
</script>

<section>
  <h2 class="text-xl font-semibold mb-4">Step 9 — Architectural Decisions</h2>

  <RepeatList
    bind:items={store.data.architecturalDecisions}
    title="Architectural decisions / ADRs (max 15)"
    max={15}
    create={() => ({
      ordinal: store.data.architecturalDecisions.length + 1,
      title: '',
      status: '',
      context: '',
      decision: '',
      consequences: '',
    })}>
    {#snippet children(adr, _i)}
      <div class="grid grid-cols-2 gap-2 mb-1">
        <input type="text" placeholder="Title" class="border rounded px-2 py-1" bind:value={adr.title} />
        <select class="border rounded px-2 py-1" bind:value={adr.status}>
          <option value="">Status —</option>
          <option value="draft">Draft</option>
          <option value="proposed">Proposed</option>
          <option value="accepted">Accepted</option>
          <option value="deprecated">Deprecated</option>
          <option value="superseded">Superseded</option>
        </select>
      </div>
      <textarea rows="2" placeholder="Context" class="w-full border rounded px-2 py-1 mb-1" bind:value={adr.context}></textarea>
      <textarea rows="2" placeholder="Decision" class="w-full border rounded px-2 py-1 mb-1" bind:value={adr.decision}></textarea>
      <textarea rows="2" placeholder="Consequences" class="w-full border rounded px-2 py-1" bind:value={adr.consequences}></textarea>
    {/snippet}
  </RepeatList>
</section>
