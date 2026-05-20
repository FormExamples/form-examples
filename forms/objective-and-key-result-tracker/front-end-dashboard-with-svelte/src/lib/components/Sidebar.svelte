<script lang="ts">
  let { filters = $bindable() }: { filters: { level: string; rag: string; owner: string } } = $props();
</script>

<aside class="w-56 p-4 border-r space-y-3 bg-gray-50">
  <h2 class="font-semibold mb-2">Filters</h2>
  <label class="block">Level
    <select class="w-full border p-1 mt-1" bind:value={filters.level}>
      <option value="">all</option>
      <option>individual</option>
      <option>team</option>
      <option>department</option>
      <option>company</option>
    </select>
  </label>
  <label class="block">RAG
    <select class="w-full border p-1 mt-1" bind:value={filters.rag}>
      <option value="">all</option>
      <option>green</option>
      <option>amber</option>
      <option>red</option>
    </select>
  </label>
  <label class="block">Owner
    <input class="w-full border p-1 mt-1" placeholder="search…" bind:value={filters.owner} />
  </label>
</aside>
