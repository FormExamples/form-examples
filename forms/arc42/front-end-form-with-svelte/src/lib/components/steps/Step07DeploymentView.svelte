<script lang="ts">
  import { store } from '$lib/stores/documentation.svelte.js';
  import RepeatList from '$lib/components/ui/RepeatList.svelte';
</script>

<section>
  <h2 class="text-xl font-semibold mb-4">Step 7 — Deployment View</h2>

  <label class="block mb-4">
    <span class="text-sm text-slate-700">Deployment overview</span>
    <textarea rows="4" class="w-full border rounded px-2 py-1" bind:value={store.data.deploymentOverview}></textarea>
  </label>

  <RepeatList
    bind:items={store.data.deploymentNodes}
    title="Deployment nodes (max 10)"
    max={10}
    create={() => ({ ordinal: store.data.deploymentNodes.length + 1, environment: '', nodeName: '', responsibility: '' })}>
    {#snippet children(n, _i)}
      <div class="grid grid-cols-2 gap-2 mb-1">
        <select class="border rounded px-2 py-1" bind:value={n.environment}>
          <option value="">Environment —</option>
          <option value="development">Development</option>
          <option value="staging">Staging</option>
          <option value="production">Production</option>
          <option value="disaster-recovery">Disaster recovery</option>
          <option value="other">Other</option>
        </select>
        <input type="text" placeholder="Node name" class="border rounded px-2 py-1" bind:value={n.nodeName} />
      </div>
      <input type="text" placeholder="Responsibility" class="w-full border rounded px-2 py-1" bind:value={n.responsibility} />
    {/snippet}
  </RepeatList>
</section>
