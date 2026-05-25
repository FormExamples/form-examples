<script lang="ts">
  import { assessment } from '$lib/stores/assessment.svelte.js';
  import Fieldset from '$lib/components/ui/Fieldset.svelte';
  import Field from '$lib/components/ui/Field.svelte';
  import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
  import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

  const d = assessment.data.cardiovascularHistory;

  const yn = [
    { key: 'previousMi', label: 'Previous myocardial infarction (MI)' },
    { key: 'previousStroke', label: 'Previous stroke' },
    { key: 'previousTia', label: 'Previous transient ischaemic attack (TIA)' },
    { key: 'peripheralArterialDisease', label: 'Peripheral arterial disease' },
    { key: 'heartFailure', label: 'Heart failure' },
    { key: 'atrialFibrillation', label: 'Atrial fibrillation' },
    { key: 'currentChestPain', label: 'Current chest pain' },
    { key: 'currentDyspnoea', label: 'Current dyspnoea (breathlessness)' }
  ] as const;
</script>

<Fieldset legend="Step 3 \u2014 Cardiovascular history">
  <p class="hint">
    Indicate whether the patient has a history of any of the following cardiovascular conditions.
  </p>

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

  <Field
    label="Family history of premature CVD"
    description="First-degree relative with CVD before age 55 (male) or 65 (female)"
  >
    <RadioGroup label="Family history of premature CVD">
      <label class="radio-input">
        <input type="radio" name="familyCvdHistory" value="yes" bind:group={d.familyCvdHistory} /> Yes
      </label>
      <label class="radio-input">
        <input type="radio" name="familyCvdHistory" value="no" bind:group={d.familyCvdHistory} /> No
      </label>
    </RadioGroup>
  </Field>

  {#if d.familyCvdHistory === 'yes'}
    <Field label="Family CVD details" inputId="step-3-familyCvdDetails">
      <TextAreaInput
        id="step-3-familyCvdDetails"
        label="Family CVD details"
        rows={3}
        bind:value={d.familyCvdDetails}
      />
    </Field>
  {/if}
</Fieldset>
