<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import Select from '#lib/components/ui/Select.svelte';
  import { DateInput, TextInput } from '@lilydesignsystem/svelte-headless';

  const d = assessment.data.patient;

  const sexOptions = [
    { value: 'female', label: 'Female' },
    { value: 'male', label: 'Male' },
    { value: 'other', label: 'Other' },
    { value: 'unknown', label: 'Unknown' }
  ];
</script>

<Fieldset legend="Step 1 of 8 · Patient">
  <p class="hint">
    Identify the patient. Use at least three identifiers that also appear on the sample.
  </p>

  <div class="field-grid">
    <Field label="Family name" required inputId="patient-familyName">
      <TextInput id="patient-familyName" label="Family name" required bind:value={d.familyName} />
    </Field>
    <Field label="Given names" inputId="patient-givenNames">
      <TextInput id="patient-givenNames" label="Given names" bind:value={d.givenNames} />
    </Field>
  </div>

  <div class="field-grid">
    <Field label="Date of birth" required inputId="patient-birthDate">
      <DateInput id="patient-birthDate" label="Date of birth" required bind:value={d.birthDate} />
    </Field>
    <Field label="Sex" inputId="patient-sex">
      <Select id="patient-sex" label="Sex" bind:value={d.sex}>
        <option value="">— Select —</option>
        {#each sexOptions as opt (opt.value)}
          <option value={opt.value}>{opt.label}</option>
        {/each}
      </Select>
    </Field>
  </div>

  <div class="field-grid">
    <Field label="National health identifier" inputId="patient-nationalHealthIdentifier">
      <TextInput
        id="patient-nationalHealthIdentifier"
        label="National health identifier"
        bind:value={d.nationalHealthIdentifier}
      />
    </Field>
    <Field label="Medical record number" inputId="patient-medicalRecordNumber">
      <TextInput
        id="patient-medicalRecordNumber"
        label="Medical record number"
        bind:value={d.medicalRecordNumber}
      />
    </Field>
  </div>

  <div class="field-grid">
    <Field label="Previous name" inputId="patient-previousName">
      <TextInput id="patient-previousName" label="Previous name" bind:value={d.previousName} />
    </Field>
    <Field label="Ethnicity" inputId="patient-ethnicity">
      <TextInput id="patient-ethnicity" label="Ethnicity" bind:value={d.ethnicity} />
    </Field>
  </div>

  <div class="field-grid">
    <Field label="Address (optional)" inputId="patient-address">
      <TextInput id="patient-address" label="Address (optional)" bind:value={d.address} />
    </Field>
    <Field label="Postcode (optional)" inputId="patient-postcode">
      <TextInput id="patient-postcode" label="Postcode (optional)" bind:value={d.postcode} />
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
