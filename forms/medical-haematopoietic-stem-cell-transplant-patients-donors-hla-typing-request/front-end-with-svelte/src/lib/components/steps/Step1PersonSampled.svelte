<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import Select from '#lib/components/ui/Select.svelte';
  import { DateInput, TextInput } from '@lilydesignsystem/svelte-headless';

  const d = assessment.data.subject;
  const q = assessment.data.request;

  const sexOptions = [
    { value: 'female', label: 'Female' },
    { value: 'male', label: 'Male' },
    { value: 'other', label: 'Other' },
    { value: 'unknown', label: 'Unknown' }
  ];

  const subjectRoleOptions = [
    { value: 'hsct-recipient', label: 'HSCT recipient (patient)' },
    { value: 'potential-donor', label: 'Potential donor' }
  ];
</script>

<Fieldset legend="Step 1 of 8 · Person sampled">
  <p class="hint">
    One request is completed for each person sampled: the recipient, or each potential donor. Use at
    least three identifiers that also appear on the sample.
  </p>

  <Field label="Role" required inputId="request-subjectRole">
    <Select id="request-subjectRole" label="Role" required bind:value={q.subjectRole}>
      <option value="">— Select —</option>
      {#each subjectRoleOptions as opt (opt.value)}
        <option value={opt.value}>{opt.label}</option>
      {/each}
    </Select>
  </Field>

  <div class="field-grid">
    <Field label="Family name" required inputId="subject-familyName">
      <TextInput id="subject-familyName" label="Family name" required bind:value={d.familyName} />
    </Field>
    <Field label="Given names" inputId="subject-givenNames">
      <TextInput id="subject-givenNames" label="Given names" bind:value={d.givenNames} />
    </Field>
  </div>

  <div class="field-grid">
    <Field label="Date of birth" required inputId="subject-birthDate">
      <DateInput id="subject-birthDate" label="Date of birth" required bind:value={d.birthDate} />
    </Field>
    <Field label="Sex" inputId="subject-sex">
      <Select id="subject-sex" label="Sex" bind:value={d.sex}>
        <option value="">— Select —</option>
        {#each sexOptions as opt (opt.value)}
          <option value={opt.value}>{opt.label}</option>
        {/each}
      </Select>
    </Field>
  </div>

  <div class="field-grid">
    <Field label="National health identifier" inputId="subject-nationalHealthIdentifier">
      <TextInput
        id="subject-nationalHealthIdentifier"
        label="National health identifier"
        bind:value={d.nationalHealthIdentifier}
      />
    </Field>
    <Field label="Medical record number" inputId="subject-medicalRecordNumber">
      <TextInput
        id="subject-medicalRecordNumber"
        label="Medical record number"
        bind:value={d.medicalRecordNumber}
      />
    </Field>
  </div>

  <div class="field-grid">
    <Field label="Previous name" inputId="subject-previousName">
      <TextInput id="subject-previousName" label="Previous name" bind:value={d.previousName} />
    </Field>
    <Field label="Ethnicity" inputId="subject-ethnicity">
      <TextInput id="subject-ethnicity" label="Ethnicity" bind:value={d.ethnicity} />
    </Field>
  </div>

  <div class="field-grid">
    <Field label="Address (optional)" inputId="subject-address">
      <TextInput id="subject-address" label="Address (optional)" bind:value={d.address} />
    </Field>
    <Field label="Postcode (optional)" inputId="subject-postcode">
      <TextInput id="subject-postcode" label="Postcode (optional)" bind:value={d.postcode} />
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
