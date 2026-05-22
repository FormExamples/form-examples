<script lang="ts">
  import { store } from '$lib/stores/lpa.svelte.js';
  const result = $derived(store.result);

  function riskClass(risk: string): string {
    if (risk === 'critical') return 'bg-red-100 text-red-900 border-red-300';
    if (risk === 'high') return 'bg-orange-100 text-orange-900 border-orange-300';
    if (risk === 'moderate') return 'bg-yellow-100 text-yellow-900 border-yellow-300';
    return 'bg-green-100 text-green-900 border-green-300';
  }
</script>

<aside
  class="border rounded p-4 sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto {riskClass(
    result.compositeRisk,
  )}"
>
  <h3 class="text-sm font-bold uppercase tracking-wide">Validation</h3>
  <p class="text-xs mt-1">
    Validity band: <span class="font-mono">{result.validityBand}</span>
  </p>
  <p class="text-xs">
    Composite risk: <span class="font-mono">{result.compositeRisk}</span>
  </p>
  {#if result.firedRules.length > 0}
    <div class="mt-3">
      <h4 class="text-xs font-bold uppercase">Statutory blockers ({result.firedRules.length})</h4>
      <ul class="mt-1 space-y-2">
        {#each result.firedRules as r (r.ruleId)}
          <li class="text-xs">
            <p class="font-semibold">{r.ruleId}</p>
            <p class="opacity-80">{r.message}</p>
            <p class="opacity-60 italic">{r.citation}</p>
            <p class="opacity-80">{r.remediation}</p>
          </li>
        {/each}
      </ul>
    </div>
  {/if}
  {#if result.additionalFlags.length > 0}
    <div class="mt-3">
      <h4 class="text-xs font-bold uppercase">Flags ({result.additionalFlags.length})</h4>
      <ul class="mt-1 space-y-2">
        {#each result.additionalFlags as f (f.ruleId)}
          <li class="text-xs">
            <p class="font-semibold">{f.ruleId} ({f.priority})</p>
            <p class="opacity-80">{f.message}</p>
            <p class="opacity-80">{f.remediation}</p>
          </li>
        {/each}
      </ul>
    </div>
  {/if}
  {#if result.firedRules.length === 0 && result.additionalFlags.length === 0}
    <p class="text-xs mt-3">No issues detected.</p>
  {/if}
</aside>
