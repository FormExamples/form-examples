<script lang="ts">
  import { lpaStore } from '$lib/stores/lpa.svelte.js';

  const validity = $derived(lpaStore.validity);
  const fatal = $derived(validity.firedRules.filter((r) => r.severity === 'fatal'));
  const high = $derived(validity.firedRules.filter((r) => r.severity === 'high'));
  const medium = $derived(validity.firedRules.filter((r) => r.severity === 'medium'));
  const info = $derived(validity.firedRules.filter((r) => r.severity === 'informational'));

  const exportJson = $derived(JSON.stringify(lpaStore.application, null, 2));

  function copyJson() {
    navigator.clipboard?.writeText(exportJson);
  }
</script>

<div class="space-y-6">
  <header class="flex items-baseline justify-between">
    <h3 class="text-lg font-semibold text-slate-900">Validity summary</h3>
    <span
      class="rounded px-3 py-1 text-sm font-medium {validity.validityStatus === 'ready-to-register'
        ? 'bg-green-100 text-green-800'
        : validity.validityStatus === 'needs-correction'
          ? 'bg-amber-100 text-amber-800'
          : 'bg-red-100 text-red-800'}"
    >
      {validity.validityStatus || '—'}
    </span>
  </header>

  <dl class="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
    <dt class="text-slate-600">Completeness</dt>
    <dd class="font-medium text-slate-900">{validity.completenessScore}%</dd>
    <dt class="text-slate-600">Effective date</dt>
    <dd class="font-medium text-slate-900">{validity.effectiveDate ?? '—'}</dd>
    <dt class="text-slate-600">Engine version</dt>
    <dd class="font-mono text-xs text-slate-700">{validity.engineVersion}</dd>
    <dt class="text-slate-600">Computed at</dt>
    <dd class="font-mono text-xs text-slate-700">{validity.computedAt}</dd>
  </dl>

  {#if fatal.length > 0}
    <section>
      <h4 class="mb-2 text-sm font-semibold text-red-800">Fatal — invalidates the LPA</h4>
      <ul class="space-y-1 text-sm">
        {#each fatal as r (r.ruleId)}
          <li class="rounded border-l-4 border-red-500 bg-red-50 p-2">
            <span class="font-mono text-xs text-red-700">{r.ruleId}</span>
            — {r.description}
            <p class="text-xs text-slate-600">{r.suggestedCorrection}</p>
          </li>
        {/each}
      </ul>
    </section>
  {/if}

  {#if high.length > 0}
    <section>
      <h4 class="mb-2 text-sm font-semibold text-amber-800">High — needs correction</h4>
      <ul class="space-y-1 text-sm">
        {#each high as r (r.ruleId)}
          <li class="rounded border-l-4 border-amber-500 bg-amber-50 p-2">
            <span class="font-mono text-xs text-amber-700">{r.ruleId}</span>
            — {r.description}
          </li>
        {/each}
      </ul>
    </section>
  {/if}

  {#if medium.length > 0 || info.length > 0}
    <section>
      <h4 class="mb-2 text-sm font-semibold text-slate-700">Notes</h4>
      <ul class="space-y-1 text-sm">
        {#each [...medium, ...info] as r (r.ruleId)}
          <li class="rounded bg-slate-50 p-2">
            <span class="font-mono text-xs text-slate-600">{r.ruleId}</span>
            — {r.description}
          </li>
        {/each}
      </ul>
    </section>
  {/if}

  {#if validity.additionalFlags.length > 0}
    <section>
      <h4 class="mb-2 text-sm font-semibold text-slate-700">Ambiguity / risk flags</h4>
      <ul class="space-y-1 text-sm">
        {#each validity.additionalFlags as f (f.flagId)}
          <li class="rounded border-l-4 border-slate-400 bg-slate-50 p-2">
            <span class="font-mono text-xs text-slate-600">{f.category}</span>
            — {f.description}
            <p class="text-xs text-slate-500">{f.suggestedAction}</p>
          </li>
        {/each}
      </ul>
    </section>
  {/if}

  <section class="space-y-2">
    <div class="flex items-center justify-between">
      <h4 class="text-sm font-semibold text-slate-700">JSON export</h4>
      <button
        type="button"
        onclick={copyJson}
        class="rounded border border-brand-500 px-3 py-1 text-xs font-medium text-brand-700 hover:bg-brand-50"
      >
        Copy
      </button>
    </div>
    <pre class="max-h-64 overflow-auto rounded bg-slate-900 p-3 text-xs text-slate-100">{exportJson}</pre>
  </section>
</div>
