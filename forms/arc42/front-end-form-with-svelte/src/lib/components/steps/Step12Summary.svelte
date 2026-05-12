<script lang="ts">
  import { store } from '$lib/stores/documentation.svelte.js';
  import { calculateMaturity } from '$lib/grading/maturity-grader.js';
  import FlagBanner from '$lib/components/ui/FlagBanner.svelte';
  import RepeatList from '$lib/components/ui/RepeatList.svelte';

  const result = $derived(calculateMaturity(store.data));
</script>

<section>
  <h2 class="text-xl font-semibold mb-4">Step 12 — Summary, Maturity &amp; Sign-off</h2>

  <RepeatList
    bind:items={store.data.glossaryTerms}
    title="Glossary terms (max 25)"
    max={25}
    create={() => ({ ordinal: store.data.glossaryTerms.length + 1, term: '', definition: '' })}>
    {#snippet children(gt, _i)}
      <div class="grid grid-cols-2 gap-2 mb-1">
        <input type="text" placeholder="Term" class="border rounded px-2 py-1" bind:value={gt.term} />
        <input type="text" placeholder="Definition" class="border rounded px-2 py-1" bind:value={gt.definition} />
      </div>
    {/snippet}
  </RepeatList>

  <!-- Maturity preview -->
  <div class="bg-slate-50 border border-slate-200 rounded p-4 mb-6">
    <h3 class="text-md font-semibold text-slate-700 mb-3">Maturity assessment</h3>

    <div class="grid grid-cols-2 gap-4 mb-3">
      <div>
        <span class="text-xs text-slate-500 uppercase tracking-wide">Computed maturity</span>
        <p class="font-semibold text-lg capitalize">{result.computedMaturity || '—'}</p>
      </div>
      <div>
        <span class="text-xs text-slate-500 uppercase tracking-wide">Final maturity</span>
        <p class="font-semibold text-lg capitalize">{result.finalMaturity || '—'}</p>
      </div>
    </div>

    <h4 class="text-sm font-semibold text-slate-600 mb-2">Completeness by section</h4>
    <ul class="grid grid-cols-2 md:grid-cols-3 gap-1 mb-3 text-sm">
      {#each Object.entries(result.completenessBySection) as [n, c]}
        <li class="flex gap-1">
          <span class="text-slate-500">§{n}</span>
          <span class="capitalize font-medium {c === 'complete' ? 'text-green-700' : c === 'partial' ? 'text-yellow-700' : 'text-red-700'}">{c}</span>
        </li>
      {/each}
    </ul>

    {#if result.firedRules.length > 0}
      <h4 class="text-sm font-semibold text-slate-600 mb-2">Fired rules</h4>
      <ul class="text-sm mb-3 space-y-1">
        {#each result.firedRules as rule}
          <li><span class="font-mono text-xs text-slate-500">{rule.ruleId}</span> — {rule.description}</li>
        {/each}
      </ul>
    {/if}

    {#if result.additionalFlags.length > 0}
      <h4 class="text-sm font-semibold text-slate-600 mb-2">Flags</h4>
      <FlagBanner flags={result.additionalFlags} />
    {/if}
  </div>

  <!-- Override and sign-off -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
    <label class="block">
      <span class="text-sm text-slate-700">Maturity override</span>
      <select class="w-full border rounded px-2 py-1" bind:value={store.data.finalMaturityOverride}>
        <option value="">None (use computed)</option>
        <option value="draft">Draft</option>
        <option value="reviewable">Reviewable</option>
        <option value="ready">Ready</option>
        <option value="mature">Mature</option>
      </select>
    </label>
    <label class="block">
      <span class="text-sm text-slate-700">Recommendation</span>
      <select class="w-full border rounded px-2 py-1" bind:value={store.data.recommendation}>
        <option value="">—</option>
        <option value="proceed">Proceed</option>
        <option value="revise-first">Revise first</option>
        <option value="block">Block</option>
      </select>
    </label>
    <label class="block md:col-span-2">
      <span class="text-sm text-slate-700">Override reason</span>
      <textarea rows="2" class="w-full border rounded px-2 py-1" bind:value={store.data.finalMaturityOverrideReason}></textarea>
    </label>
    <label class="block md:col-span-2">
      <span class="text-sm text-slate-700">Additional notes</span>
      <textarea rows="3" class="w-full border rounded px-2 py-1" bind:value={store.data.additionalNotes}></textarea>
    </label>
    <label class="block">
      <span class="text-sm text-slate-700">Signed by</span>
      <input type="text" class="w-full border rounded px-2 py-1" bind:value={store.data.signedBy} />
    </label>
    <label class="block">
      <span class="text-sm text-slate-700">Signed at</span>
      <input type="datetime-local" class="w-full border rounded px-2 py-1" bind:value={store.data.signedAt} />
    </label>
  </div>
</section>
