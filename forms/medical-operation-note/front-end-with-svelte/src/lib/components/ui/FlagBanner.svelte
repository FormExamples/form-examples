<script lang="ts">
  import type { AdditionalFlag, CompositeRisk } from '#lib/engine/types.js';

  let { flags, risk }: { flags: AdditionalFlag[]; risk: CompositeRisk } = $props();

  const riskClass = $derived(
    risk === 'critical'
      ? 'bg-error text-error-content border-error'
      : risk === 'high-risk'
        ? 'bg-error text-error-content border-error'
        : risk === 'complicated'
          ? 'bg-warning text-warning-content border-warning'
          : 'bg-success text-success-content border-success',
  );
</script>

{#if flags.length > 0}
  <div class="border-l-4 {riskClass} p-4 my-4 rounded">
    <p class="font-semibold mb-2">Composite risk: {risk.toUpperCase()}</p>
    <ul class="list-disc list-inside text-sm space-y-1">
      {#each flags as f (f.flagId)}
        <li>
          <span class="font-medium">[{f.priority.toUpperCase()}]</span>
          {f.description} — {f.suggestedAction}
        </li>
      {/each}
    </ul>
  </div>
{/if}
