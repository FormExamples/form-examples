<script lang="ts">
  import { onMount } from 'svelte';
  import { loadObjectives, type Objective } from '$data/sample';
  import Sidebar from '$components/Sidebar.svelte';
  import Grid from '$components/Grid.svelte';
  import DetailPanel from '$components/DetailPanel.svelte';

  let all: Objective[] = $state([]);
  let filters = $state({ level: '', rag: '', owner: '' });
  let selectedId: string | null = $state(null);

  onMount(async () => { all = await loadObjectives(); });

  const filtered = $derived(
    all.filter((o) =>
      (!filters.level || o.level === filters.level) &&
      (!filters.rag || o.rag === filters.rag) &&
      (!filters.owner || o.dri.toLowerCase().includes(filters.owner.toLowerCase()))
    ),
  );
  const selected = $derived(all.find((o) => o.id === selectedId) ?? null);
</script>

<div class="flex h-screen">
  <Sidebar bind:filters />
  <main class="flex-1 overflow-auto p-4">
    <h1 class="text-2xl font-bold mb-3">OKR Dashboard</h1>
    <Grid data={filtered} {selectedId} onSelect={(id) => (selectedId = id)} />
  </main>
  <DetailPanel obj={selected} onClose={() => (selectedId = null)} />
</div>
