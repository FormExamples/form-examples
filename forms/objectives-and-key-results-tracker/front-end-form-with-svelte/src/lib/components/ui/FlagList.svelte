<script lang="ts">
  import type { FiredFlag } from '$engine/types';
  let { flags }: { flags: FiredFlag[] } = $props();
</script>

{#if flags.length}
  <ul class="mt-3 list-disc list-inside">
    {#each flags as f}
      <li><span class="font-mono text-sm">[{f.priority}]</span> <strong>{f.flagCode}</strong>: {f.description}</li>
    {/each}
  </ul>
{:else}
  <p class="mt-3 text-gray-500">(no flags)</p>
{/if}
