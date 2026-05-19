<script lang="ts">
  import type { SafetyFlag } from '$lib/checklist/types.js';

  let { flags }: { flags: SafetyFlag[] } = $props();

  const highCount = $derived(flags.filter((f) => f.priority === 'high').length);
  const headerClass = $derived(
    highCount > 0
      ? 'bg-red-100 border-red-500 text-red-900'
      : flags.length > 0
        ? 'bg-yellow-100 border-yellow-500 text-yellow-900'
        : 'bg-green-100 border-green-500 text-green-900',
  );
</script>

{#if flags.length > 0}
  <div class="border-l-4 {headerClass} p-4 my-4 rounded">
    <p class="font-semibold mb-2">
      Safety flags ({flags.length}{#if highCount > 0}, {highCount} high priority{/if})
    </p>
    <ul class="list-disc list-inside text-sm space-y-1">
      {#each flags as f (f.flag)}
        <li>
          <span class="font-medium">[{f.priority.toUpperCase()}]</span>
          {f.message}
        </li>
      {/each}
    </ul>
  </div>
{:else}
  <div class="border-l-4 border-green-500 bg-green-50 text-green-900 p-4 my-4 rounded">
    <p class="font-semibold">No safety flags raised.</p>
  </div>
{/if}
