<script lang="ts">
  import type { AdditionalFlag, CompositeRisk } from '#lib/engine/types.js';

  let { flags, risk }: { flags: AdditionalFlag[]; risk: CompositeRisk } = $props();

  const riskClass = $derived(
    risk === 'critical'
      ? 'bg-error/10 border-error text-error-content'
      : risk === 'high'
        ? 'bg-warning/10 border-warning text-warning-content'
        : risk === 'moderate'
          ? 'bg-warning/10 border-warning text-warning-content'
          : 'bg-success/10 border-success text-success-content',
  );
</script>

{#if flags.length > 0}
  <div class="border-l-4 {riskClass} p-4 my-4 rounded">
    <p class="font-semibold mb-2">Composite risk: {risk.toUpperCase()}</p>
    <ul class="list-disc list-inside text-sm space-y-1">
      {#each flags as f}
        <li>
          <span class="font-medium">[{f.priority.toUpperCase()}]</span>
          {f.description} — {f.suggestedAction}
        </li>
      {/each}
    </ul>
  </div>
{/if}
