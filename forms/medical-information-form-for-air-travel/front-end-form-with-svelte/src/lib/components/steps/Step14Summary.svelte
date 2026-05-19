<script lang="ts">
  import { store } from '$lib/stores/assessment.svelte.js';
  import TextField from '$lib/components/ui/TextField.svelte';
  import SelectField from '$lib/components/ui/SelectField.svelte';

  const r = $derived(store.result);

  const bandClass = $derived(
    r.fitnessBand === 'unfit-to-fly'
      ? 'bg-red-100 border-red-500 text-red-900'
      : r.fitnessBand === 'requires-review'
        ? 'bg-orange-100 border-orange-500 text-orange-900'
        : r.fitnessBand === 'fit-with-conditions'
          ? 'bg-yellow-100 border-yellow-500 text-yellow-900'
          : 'bg-green-100 border-green-500 text-green-900',
  );
</script>

<section>
  <h2 class="text-xl font-semibold mb-4">Step 14 — Summary and physician sign-off</h2>

  <div class="border-l-4 {bandClass} p-4 my-4 rounded">
    <p class="font-semibold text-lg">Fitness band: {r.fitnessBand.toUpperCase()}</p>
    <p class="text-sm mt-1">{r.deskRecommendation}</p>
    <p class="text-xs mt-2 text-slate-700">Valid until: {r.validUntil || '—'}</p>
  </div>

  {#if r.safetyFlags.length > 0}
    <div class="bg-white border rounded p-3 mb-4">
      <p class="font-semibold mb-2">Safety flags ({r.safetyFlags.length})</p>
      <ul class="list-disc list-inside text-sm space-y-1">
        {#each r.safetyFlags as f (f.flagId)}
          <li>
            <span class="font-medium uppercase text-xs">[{f.priority}]</span>
            {f.description} — <span class="text-slate-700">{f.suggestedAction}</span>
          </li>
        {/each}
      </ul>
    </div>
  {/if}

  {#if r.firedRules.length > 0}
    <details class="mb-4">
      <summary class="cursor-pointer text-sm font-medium">Fired rules ({r.firedRules.length})</summary>
      <ul class="list-disc list-inside text-sm mt-2 space-y-1">
        {#each r.firedRules as fr (fr.ruleId)}
          <li><code>{fr.ruleId}</code> [{fr.category}] {fr.band} — {fr.description}</li>
        {/each}
      </ul>
    </details>
  {/if}

  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <SelectField
      label="Physician declaration"
      bind:value={store.data.signoff.physicianDeclaration}
      options={[
        { value: 'fit', label: 'Fit to fly' },
        { value: 'fit-with-conditions', label: 'Fit with conditions' },
        { value: 'unfit', label: 'Unfit' },
        { value: 'unable-to-determine', label: 'Unable to determine' },
      ]}
    />
    <TextField label="Physician signature name" bind:value={store.data.signoff.physicianSignatureName} />
    <TextField label="Physician signature date" type="date" bind:value={store.data.signoff.physicianSignatureDate} />
    <TextField label="Valid until date" type="date" bind:value={store.data.signoff.validUntilDate} />
    <label class="block md:col-span-2">
      <span class="text-sm text-slate-700">Additional notes for the airline medical desk</span>
      <textarea rows="3" class="w-full border rounded px-2 py-1" bind:value={store.data.signoff.additionalNotes}></textarea>
    </label>
  </div>
</section>
