<script lang="ts">
  import type { Flag, Outcome } from '#lib/engine/types.js';

  let { flags, outcome }: { flags: Flag[]; outcome: Outcome } = $props();

  const outcomeClass = $derived(
    outcome === 'does-not-meet'
      ? 'bg-error/10 border-error text-error-content'
      : outcome === 'conditional' || outcome === 'incomplete'
        ? 'bg-warning/10 border-warning text-warning-content'
        : 'bg-success/10 border-success text-success-content',
  );
</script>

{#if flags.length > 0}
  <div class="border-l-4 {outcomeClass} p-4 my-4 rounded">
    <p class="font-semibold mb-2">Flagged issues</p>
    <ul class="list-disc list-inside text-sm space-y-1">
      {#each flags as f (f.flagId)}
        <li>
          <span class="font-medium">[{f.severity.toUpperCase()}]</span>
          {f.message}
        </li>
      {/each}
    </ul>
  </div>
{/if}
