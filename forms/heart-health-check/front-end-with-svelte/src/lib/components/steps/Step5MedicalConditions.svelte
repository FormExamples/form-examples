<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import Select from '#lib/components/ui/Select.svelte';
  import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

  const d = assessment.data.medicalConditions;

  const yn = [
    { key: 'hasAtrialFibrillation', label: 'Atrial fibrillation?' },
    { key: 'hasRheumatoidArthritis', label: 'Rheumatoid arthritis?' },
    { key: 'hasChronicKidneyDisease', label: 'Chronic kidney disease (stage 3+)?' },
    { key: 'hasMigraine', label: 'Migraine?' },
    { key: 'hasSevereMentalIllness', label: 'Severe mental illness?' },
    { key: 'onAtypicalAntipsychotic', label: 'On atypical antipsychotic?' },
    { key: 'onCorticosteroids', label: 'On regular corticosteroids?' }
  ] as const;
</script>

<Fieldset legend="Step 5 \u2014 Medical conditions">
  <p class="hint">Existing diagnoses and medications relevant to cardiovascular risk.</p>

  <Field label="Diabetes" inputId="step-5-hasDiabetes">
    <Select id="step-5-hasDiabetes" label="Diabetes" bind:value={d.hasDiabetes}>
      <option value="">\u2014 Select \u2014</option>
      <option value="no">No diabetes</option>
      <option value="type1">Type 1 diabetes</option>
      <option value="type2">Type 2 diabetes</option>
    </Select>
  </Field>

  {#each yn as item (item.key)}
    <Field label={item.label}>
      <RadioGroup label={item.label}>
        <label class="radio-input">
          <input type="radio" name={item.key} value="yes" bind:group={d[item.key]} /> Yes
        </label>
        <label class="radio-input">
          <input type="radio" name={item.key} value="no" bind:group={d[item.key]} /> No
        </label>
      </RadioGroup>
    </Field>
  {/each}

  {#if assessment.data.demographicsEthnicity.sex === 'male'}
    <Field label="Erectile dysfunction?">
      <RadioGroup label="Erectile dysfunction?">
        <label class="radio-input">
          <input type="radio" name="hasErectileDysfunction" value="yes" bind:group={d.hasErectileDysfunction} /> Yes
        </label>
        <label class="radio-input">
          <input type="radio" name="hasErectileDysfunction" value="no" bind:group={d.hasErectileDysfunction} /> No
        </label>
      </RadioGroup>
    </Field>
  {/if}
</Fieldset>
