<script lang="ts">
  import type { AdditionalFlag } from '$lib/grading/types.js';

  let { flags }: { flags: AdditionalFlag[] } = $props();

  function priorityClass(priority: 'high' | 'medium' | 'low'): string {
    if (priority === 'high') return 'bg-red-100 border-red-500 text-red-900';
    if (priority === 'medium') return 'bg-yellow-100 border-yellow-500 text-yellow-900';
    return 'bg-slate-100 border-slate-400 text-slate-800';
  }
</script>

{#each flags as flag}
  <div class="border-l-4 {priorityClass(flag.priority)} p-3 my-2 rounded text-sm">
    <span class="font-semibold">[{flag.priority.toUpperCase()}]</span>
    {flag.description}
  </div>
{/each}
