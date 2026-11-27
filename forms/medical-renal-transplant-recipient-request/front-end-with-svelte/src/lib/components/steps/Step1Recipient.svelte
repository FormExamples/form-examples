<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import Select from '#lib/components/ui/Select.svelte';
  import { DateInput, TextInput } from '@lilydesignsystem/svelte-headless';

  const d = assessment.data.recipient;

  const sexOptions = [
    { value: 'female', label: 'Female' },
    { value: 'male', label: 'Male' },
    { value: 'other', label: 'Other' },
    { value: 'unknown', label: 'Unknown' }
  ];
</script>

<Fieldset legend="Step 1 of 7 · Recipient">
  <p class="hint">
    Identify the transplant recipient. A separate request is completed for each person.
  </p>

  <div class="field-grid">
    <Field label="Family name" required inputId="recipient-familyName">
      <TextInput id="recipient-familyName" label="Family name" required bind:value={d.familyName} />
    </Field>
    <Field label="Given names" inputId="recipient-givenNames">
      <TextInput id="recipient-givenNames" label="Given names" bind:value={d.givenNames} />
    </Field>
  </div>

  <div class="field-grid">
    <Field label="Date of birth" required inputId="recipient-birthDate">
      <DateInput id="recipient-birthDate" label="Date of birth" required bind:value={d.birthDate} />
    </Field>
    <Field label="Sex" inputId="recipient-sex">
      <Select id="recipient-sex" label="Sex" bind:value={d.sex}>
        <option value="">— Select —</option>
        {#each sexOptions as opt (opt.value)}
          <option value={opt.value}>{opt.label}</option>
        {/each}
      </Select>
    </Field>
  </div>

  <div class="field-grid">
    <Field label="National health identifier" inputId="recipient-nationalHealthIdentifier">
      <TextInput
        id="recipient-nationalHealthIdentifier"
        label="National health identifier"
        bind:value={d.nationalHealthIdentifier}
      />
    </Field>
    <Field label="Medical record number" inputId="recipient-medicalRecordNumber">
      <TextInput
        id="recipient-medicalRecordNumber"
        label="Medical record number"
        bind:value={d.medicalRecordNumber}
      />
    </Field>
  </div>

  <div class="field-grid">
    <Field label="Previous name" inputId="recipient-previousName">
      <TextInput id="recipient-previousName" label="Previous name" bind:value={d.previousName} />
    </Field>
    <Field label="Ethnicity" inputId="recipient-ethnicity">
      <TextInput id="recipient-ethnicity" label="Ethnicity" bind:value={d.ethnicity} />
    </Field>
  </div>

  <div class="field-grid">
    <Field label="Address (optional)" inputId="recipient-address">
      <TextInput id="recipient-address" label="Address (optional)" bind:value={d.address} />
    </Field>
    <Field label="Postcode (optional)" inputId="recipient-postcode">
      <TextInput id="recipient-postcode" label="Postcode (optional)" bind:value={d.postcode} />
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
