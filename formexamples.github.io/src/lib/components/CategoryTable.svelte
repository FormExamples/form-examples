<script lang="ts">
  import { categories } from '$lib/data/categories';
</script>

<div class="my-6 overflow-x-auto">
  <table class="w-full border-collapse text-sm">
    <thead>
      <tr class="border-b border-base-300">
        <th class="px-3 py-2 text-left font-semibold">Category</th>
        <th class="px-3 py-2 text-left font-semibold">Examples</th>
      </tr>
    </thead>
    <tbody>
      {#each categories as cat}
        <tr class="border-b border-base-200">
          <td class="px-3 py-2 font-medium">{cat.name}</td>
          <td class="px-3 py-2 text-muted">{cat.examples}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
