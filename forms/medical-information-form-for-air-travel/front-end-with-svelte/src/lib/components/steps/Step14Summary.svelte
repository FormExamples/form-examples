<script lang="ts">
  import { store } from '#lib/stores/assessment.svelte.js';
  import { evaluateFitnessToFly } from '#lib/engine/composite-grader.js';
  import { fitnessBandColor, fitnessBandLabel, priorityColor } from '#lib/engine/utils.js';
  import TextField from '#lib/components/ui/TextField.svelte';
  import SelectField from '#lib/components/ui/SelectField.svelte';

  // Live preview: re-grade as the user edits earlier steps. The authoritative
  // result is computed on submit and shown on the report page.
  const r = $derived(evaluateFitnessToFly(store.data));
</script>

<section>
  <h2 class="text-xl font-semibold mb-4 text-base-content">Step 14 — Summary and physician sign-off</h2>

  <div class="border-l-4 {fitnessBandColor(r.fitnessBand)} p-4 my-4 rounded">
    <p class="font-semibold text-lg">Fitness band: {fitnessBandLabel(r.fitnessBand)}</p>
    <p class="text-sm mt-1">{r.deskRecommendation}</p>
    <p class="text-xs mt-2 opacity-80">Valid until: {r.validUntil || '—'}</p>
  </div>

  {#if r.safetyFlags.length > 0}
    <div class="bg-base-100 border border-base-300 rounded p-3 mb-4">
      <p class="font-semibold mb-2 text-base-content">Safety flags ({r.safetyFlags.length})</p>
      <ul class="list-disc list-inside text-sm space-y-1 text-base-content/80">
        {#each r.safetyFlags as f (f.flagId)}
          <li>
            <span class="font-medium uppercase text-xs rounded px-1.5 py-0.5 {priorityColor(f.priority)}">{f.priority}</span>
            {f.description} — <span class="text-base-content/60">{f.suggestedAction}</span>
          </li>
        {/each}
      </ul>
    </div>
  {/if}

  {#if r.firedRules.length > 0}
    <details class="mb-4">
      <summary class="cursor-pointer text-sm font-medium text-base-content">Fired rules ({r.firedRules.length})</summary>
      <ul class="list-disc list-inside text-sm mt-2 space-y-1 text-base-content/80">
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
      <span class="text-sm text-base-content/70">Additional notes for the airline medical desk</span>
      <textarea rows="3" class="text-area w-full" bind:value={store.data.signoff.additionalNotes}></textarea>
    </label>
  </div>
</section>
