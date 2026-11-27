<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import Select from '#lib/components/ui/Select.svelte';
  import { DateInput, TextInput } from '@lilydesignsystem/svelte-headless';

  const d = assessment.data.donor;

  const sexOptions = [
    { value: 'female', label: 'Female' },
    { value: 'male', label: 'Male' },
    { value: 'other', label: 'Other' },
    { value: 'unknown', label: 'Unknown' }
  ];
</script>

<Fieldset legend="Step 1 of 7 · Donor">
  <p class="hint">
    Identify the living donor. The sample on this request is the donor's only; the recipient has a
    separate request.
  </p>

  <div class="field-grid">
    <Field label="Family name" required inputId="donor-familyName">
      <TextInput id="donor-familyName" label="Family name" required bind:value={d.familyName} />
    </Field>
    <Field label="Given names" inputId="donor-givenNames">
      <TextInput id="donor-givenNames" label="Given names" bind:value={d.givenNames} />
    </Field>
  </div>

  <div class="field-grid">
    <Field label="Date of birth" required inputId="donor-birthDate">
      <DateInput id="donor-birthDate" label="Date of birth" required bind:value={d.birthDate} />
    </Field>
    <Field label="Sex" inputId="donor-sex">
      <Select id="donor-sex" label="Sex" bind:value={d.sex}>
        <option value="">— Select —</option>
        {#each sexOptions as opt (opt.value)}
          <option value={opt.value}>{opt.label}</option>
        {/each}
      </Select>
    </Field>
  </div>

  <div class="field-grid">
    <Field label="National health identifier" inputId="donor-nationalHealthIdentifier">
      <TextInput
        id="donor-nationalHealthIdentifier"
        label="National health identifier"
        bind:value={d.nationalHealthIdentifier}
      />
    </Field>
    <Field label="Medical record number" inputId="donor-medicalRecordNumber">
      <TextInput
        id="donor-medicalRecordNumber"
        label="Medical record number"
        bind:value={d.medicalRecordNumber}
      />
    </Field>
  </div>

  <div class="field-grid">
    <Field label="Previous name" inputId="donor-previousName">
      <TextInput id="donor-previousName" label="Previous name" bind:value={d.previousName} />
    </Field>
    <Field label="Address (optional)" inputId="donor-address">
      <TextInput id="donor-address" label="Address (optional)" bind:value={d.address} />
    </Field>
  </div>

  <div class="field-grid">
    <Field label="Postcode (optional)" inputId="donor-postcode">
      <TextInput id="donor-postcode" label="Postcode (optional)" bind:value={d.postcode} />
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
