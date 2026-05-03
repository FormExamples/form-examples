<script lang="ts">
  import { categories } from '$lib/data/categories';
</script>

<div class="my-6 overflow-x-auto">
  <table class="w-full border-collapse text-sm">
    <thead>
      <tr class="border-b border-slate-200 dark:border-slate-700">
        <th class="px-3 py-2 text-left font-semibold">Category</th>
        <th class="px-3 py-2 text-left font-semibold">Examples</th>
      </tr>
    </thead>
    <tbody>
      {#each categories as cat}
        <tr class="border-b border-slate-100 dark:border-slate-800">
          <td class="px-3 py-2 font-medium">{cat.name}</td>
          <td class="px-3 py-2 text-slate-600 dark:text-slate-400">{cat.examples}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
