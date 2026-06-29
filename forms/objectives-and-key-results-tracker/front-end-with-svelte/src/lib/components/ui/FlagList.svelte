<script lang="ts">
  import type { FiredFlag } from '$engine/types';
  let { flags }: { flags: FiredFlag[] } = $props();
</script>

{#if flags.length}
  <ul class="mt-3 list-inside list-disc text-base-content/80">
    {#each flags as f (f.flagCode)}
      <li><span class="font-mono text-sm">[{f.priority}]</span> <strong>{f.flagCode}</strong>: {f.description}</li>
    {/each}
  </ul>
{:else}
  <p class="mt-3 text-base-content/60">(no flags)</p>
{/if}
