<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import Select from '#lib/components/ui/Select.svelte';
  import { CheckboxInput, TextAreaInput, TextInput } from '@lilydesignsystem/svelte-headless';

  const d = assessment.data.clinical;

  const indicationOptions = [
    { value: 'suspected-disease', label: 'Suspected disease' },
    { value: 'pre-treatment-drug-hypersensitivity', label: 'Pre-treatment drug hypersensitivity' },
    { value: 'treatment-response', label: 'Treatment response' },
    { value: 'family-screening', label: 'Family screening' },
    { value: 'exclusion-of-disease', label: 'Exclusion of disease' },
    { value: 'other', label: 'Other' }
  ];
</script>

<Fieldset legend="Step 4 of 8 · Clinical details">
  <p class="hint">Why the test is needed. The laboratory vets the request against these details.</p>

  <Field label="Indication" inputId="clinical-indicationCategory">
    <Select id="clinical-indicationCategory" label="Indication" bind:value={d.indicationCategory}>
      <option value="">— Select —</option>
      {#each indicationOptions as opt (opt.value)}
        <option value={opt.value}>{opt.label}</option>
      {/each}
    </Select>
  </Field>

  <Field label="Clinical details and suspected condition" inputId="clinical-clinicalDetails">
    <TextAreaInput
      id="clinical-clinicalDetails"
      label="Clinical details and suspected condition"
      rows={4}
      bind:value={d.clinicalDetails}
    />
  </Field>

  <Field
    label="Planned drug (if the prescription depends on the result)"
    inputId="clinical-plannedDrug"
  >
    <TextInput
      id="clinical-plannedDrug"
      label="Planned drug (if the prescription depends on the result)"
      bind:value={d.plannedDrug}
    />
  </Field>

  <label class="bool-field">
    <CheckboxInput
      id="clinical-previousHlaTypingKnown"
      label="The patient has been HLA typed before"
      bind:checked={d.previousHlaTypingKnown}
    />
    <span>The patient has been HLA typed before</span>
  </label>
</Fieldset>

<style>
  .bool-field {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
</style>
