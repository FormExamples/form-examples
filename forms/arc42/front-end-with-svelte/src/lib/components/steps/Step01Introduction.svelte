<script lang="ts">
  import { store } from '#lib/stores/documentation.svelte.js';
  import RepeatList from '#lib/components/ui/RepeatList.svelte';
</script>

<section>
  <h2 class="text-xl font-semibold mb-4">Step 1 — Introduction &amp; Goals</h2>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
    <label class="block">
      <span class="text-sm text-base-content/80">Architecture name</span>
      <input id="architectureName" type="text" class="w-full border rounded px-2 py-1" bind:value={store.data.architecture.name} />
    </label>
    <label class="block">
      <span class="text-sm text-base-content/80">Version</span>
      <input type="text" class="w-full border rounded px-2 py-1" bind:value={store.data.architecture.version} />
    </label>
    <label class="block">
      <span class="text-sm text-base-content/80">Owner</span>
      <input type="text" class="w-full border rounded px-2 py-1" bind:value={store.data.architecture.owner} />
    </label>
    <label class="block">
      <span class="text-sm text-base-content/80">Status</span>
      <select class="w-full border rounded px-2 py-1" bind:value={store.data.architecture.status}>
        <option value="">—</option>
        <option value="draft">Draft</option>
        <option value="active">Active</option>
        <option value="archived">Archived</option>
      </select>
    </label>
    <label class="block md:col-span-2">
      <span class="text-sm text-base-content/80">Description</span>
      <textarea rows="2" class="w-full border rounded px-2 py-1" bind:value={store.data.architecture.description}></textarea>
    </label>
    <label class="block">
      <span class="text-sm text-base-content/80">Author name</span>
      <input type="text" class="w-full border rounded px-2 py-1" bind:value={store.data.authorName} />
    </label>
    <label class="block">
      <span class="text-sm text-base-content/80">Author role</span>
      <input type="text" class="w-full border rounded px-2 py-1" bind:value={store.data.authorRole} />
    </label>
    <label class="block">
      <span class="text-sm text-base-content/80">Document date</span>
      <input type="date" class="w-full border rounded px-2 py-1" bind:value={store.data.documentDate} />
    </label>
    <label class="block md:col-span-2">
      <span class="text-sm text-base-content/80">Introduction</span>
      <textarea rows="4" class="w-full border rounded px-2 py-1" bind:value={store.data.introduction}></textarea>
    </label>
  </div>

  <RepeatList
    bind:items={store.data.businessGoals}
    title="Business goals (max 5)"
    max={5}
    create={() => ({ ordinal: store.data.businessGoals.length + 1, name: '', description: '' })}>
    {#snippet children(g, _i)}
      <input type="text" placeholder="Goal name" class="w-full border rounded px-2 py-1 mb-1" bind:value={g.name} />
      <textarea rows="2" placeholder="Description" class="w-full border rounded px-2 py-1" bind:value={g.description}></textarea>
    {/snippet}
  </RepeatList>

  <RepeatList
    bind:items={store.data.qualityGoals}
    title="Quality goals (max 5)"
    max={5}
    create={() => ({ ordinal: store.data.qualityGoals.length + 1, name: '', priority: '', scenario: '' })}>
    {#snippet children(g, _i)}
      <input type="text" placeholder="Goal name" class="w-full border rounded px-2 py-1 mb-1" bind:value={g.name} />
      <select class="w-full border rounded px-2 py-1 mb-1" bind:value={g.priority}>
        <option value="">Priority —</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
      <textarea rows="2" placeholder="Scenario" class="w-full border rounded px-2 py-1" bind:value={g.scenario}></textarea>
    {/snippet}
  </RepeatList>

  <RepeatList
    bind:items={store.data.stakeholders}
    title="Stakeholders (max 8)"
    max={8}
    create={() => ({ ordinal: store.data.stakeholders.length + 1, name: '', role: '', concerns: '' })}>
    {#snippet children(s, _i)}
      <div class="grid grid-cols-2 gap-2 mb-1">
        <input type="text" placeholder="Name" class="border rounded px-2 py-1" bind:value={s.name} />
        <input type="text" placeholder="Role" class="border rounded px-2 py-1" bind:value={s.role} />
      </div>
      <textarea rows="2" placeholder="Concerns" class="w-full border rounded px-2 py-1" bind:value={s.concerns}></textarea>
    {/snippet}
  </RepeatList>
</section>
