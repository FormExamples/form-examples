<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import Select from '#lib/components/ui/Select.svelte';
  import { TextAreaInput } from '@lilydesignsystem/svelte-headless';

  const d = assessment.data.request;

  const donorTypeOptions = [
    { value: 'matched-sibling', label: 'Matched sibling' },
    { value: 'haploidentical-relative', label: 'Haploidentical relative' },
    { value: 'other-relative', label: 'Other relative' },
    { value: 'unrelated-volunteer', label: 'Unrelated volunteer' },
    { value: 'unknown', label: 'Unknown' }
  ];

  const resolutionOptions = [
    { value: 'not-specified', label: 'Not specified' },
    { value: 'low', label: 'Low resolution' },
    { value: 'high', label: 'High resolution' }
  ];
</script>

<Fieldset legend="Step 3 of 8 · Clinical details">
  <p class="hint">
    The disease and the indication for transplant or donation. The laboratory vets the request
    against these details.
  </p>

  <Field
    label="Clinical details (disease, indication for HSCT or donor information)"
    inputId="request-clinicalDetails"
  >
    <TextAreaInput
      id="request-clinicalDetails"
      label="Clinical details (disease, indication for HSCT or donor information)"
      rows={4}
      bind:value={d.clinicalDetails}
    />
  </Field>

  <div class="field-grid">
    <Field label="Donor type (for a potential donor)" inputId="request-donorType">
      <Select
        id="request-donorType"
        label="Donor type (for a potential donor)"
        bind:value={d.donorType}
      >
        <option value="">— Select —</option>
        {#each donorTypeOptions as opt (opt.value)}
          <option value={opt.value}>{opt.label}</option>
        {/each}
      </Select>
    </Field>
    <Field label="HLA typing resolution (optional)" inputId="request-hlaTypingResolution">
      <Select
        id="request-hlaTypingResolution"
        label="HLA typing resolution (optional)"
        bind:value={d.hlaTypingResolution}
      >
        <option value="">— Select —</option>
        {#each resolutionOptions as opt (opt.value)}
          <option value={opt.value}>{opt.label}</option>
        {/each}
      </Select>
    </Field>
  </div>
</Fieldset>

<style>
  .field-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
  }
  @media (max-width: 640px) {
    .field-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
