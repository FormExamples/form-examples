<script lang="ts">
  import type { GradingResult } from '$lib/types.js';

  let { result }: { result: GradingResult } = $props();

  function priorityClass(p: 'low' | 'medium' | 'high'): string {
    if (p === 'high') return 'bg-red-100 border-red-500 text-red-900';
    if (p === 'medium') return 'bg-yellow-100 border-yellow-500 text-yellow-900';
    return 'bg-green-100 border-green-500 text-green-900';
  }
</script>

<section
  class="border rounded-lg bg-white shadow-sm p-6 mt-6"
  aria-live="polite"
  aria-label="Computed fit-note grade and safety flags"
>
  <h2 class="text-xl font-semibold text-brand-700 mb-4">Computed grade</h2>
  <dl class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-6">
    <div>
      <dt class="text-slate-500">Fitness category</dt>
      <dd class="font-medium">{result.fitnessCategory || '—'}</dd>
    </div>
    <div>
      <dt class="text-slate-500">Adaptation intensity</dt>
      <dd class="font-medium">{result.adaptationIntensity || '—'} ({result.adaptationCount} ticked)</dd>
    </div>
    <div>
      <dt class="text-slate-500">Period (days)</dt>
      <dd class="font-medium">{result.periodDays ?? '—'}</dd>
    </div>
    <div>
      <dt class="text-slate-500">Period compliance</dt>
      <dd class="font-medium">{result.periodCompliance || '—'}</dd>
    </div>
    <div>
      <dt class="text-slate-500">Within first 6 months</dt>
      <dd class="font-medium">{result.isWithinFirstSixMonthsOfCondition || '—'}</dd>
    </div>
    <div>
      <dt class="text-slate-500">Valid</dt>
      <dd class="font-medium">{result.isValid}</dd>
    </div>
    <div class="sm:col-span-2">
      <dt class="text-slate-500">Recommendation</dt>
      <dd class="font-semibold text-brand-700">{result.recommendation || '—'}</dd>
    </div>
  </dl>

  {#if result.safetyFlags.length > 0}
    <h3 class="text-lg font-semibold mb-2">Safety flags ({result.safetyFlags.length})</h3>
    <ul class="space-y-2 mb-6">
      {#each result.safetyFlags as flag (flag.flagId)}
        <li class="border-l-4 {priorityClass(flag.priority)} p-3 rounded">
          <p class="font-medium">
            [{flag.priority.toUpperCase()}] {flag.category}
          </p>
          <p class="text-sm">{flag.description}</p>
          <p class="text-xs italic mt-1">Suggested: {flag.suggestedAction}</p>
        </li>
      {/each}
    </ul>
  {:else}
    <p class="text-sm text-slate-600 mb-6">No safety flags fired.</p>
  {/if}

  {#if result.firedRules.length > 0}
    <details class="text-sm">
      <summary class="cursor-pointer text-slate-600 font-medium">
        Fired rules ({result.firedRules.length})
      </summary>
      <ul class="mt-2 space-y-1">
        {#each result.firedRules as rule (rule.ruleId)}
          <li class="text-xs">
            <span class="font-mono text-slate-500">{rule.ruleId}</span>
            <span class="text-slate-500"> [{rule.ruleSet}/{rule.severity}]</span>
            — {rule.description}
          </li>
        {/each}
      </ul>
    </details>
  {/if}
</section>
