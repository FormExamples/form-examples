<script lang="ts">
  import { store } from '#lib/stores/assessment.svelte.js';
  import { ADVICE_OPTIONS } from '#lib/engine/utils.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import Select from '#lib/components/ui/Select.svelte';
</script>

<Fieldset legend="Step 4 of 8 — Fitness advice" id="step-4-legend">
  <p class="hint">Not fit for work, or may be fit for work with adjustments (rule R-03).</p>
  <Field label="Fitness advice" inputId="step-4-fitness-advice">
    <Select id="step-4-fitness-advice" label="Fitness advice" bind:value={store.data.fitnessAdvice}>
      <option value="">— Select —</option>
      {#each ADVICE_OPTIONS as o (o.value)}
        <option value={o.value}>{o.label}</option>
      {/each}
    </Select>
  </Field>
</Fieldset>
