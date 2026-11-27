<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { DateInput, TextInput } from '@lilydesignsystem/svelte-headless';

  const d = assessment.data.recipient;
</script>

<Fieldset legend="Step 4 of 8 · Linked recipient">
  <p class="hint">
    For a potential donor: name the recipient and the relationship so the laboratory can pair the
    samples. Leave blank when sampling the recipient.
  </p>

  <div class="field-grid">
    <Field label="Recipient family name" inputId="recipient-recipientFamilyName">
      <TextInput
        id="recipient-recipientFamilyName"
        label="Recipient family name"
        bind:value={d.recipientFamilyName}
      />
    </Field>
    <Field label="Recipient given names" inputId="recipient-recipientGivenNames">
      <TextInput
        id="recipient-recipientGivenNames"
        label="Recipient given names"
        bind:value={d.recipientGivenNames}
      />
    </Field>
  </div>

  <div class="field-grid">
    <Field label="Recipient medical record number" inputId="recipient-recipientMedicalRecordNumber">
      <TextInput
        id="recipient-recipientMedicalRecordNumber"
        label="Recipient medical record number"
        bind:value={d.recipientMedicalRecordNumber}
      />
    </Field>
    <Field label="Recipient date of birth" inputId="recipient-recipientBirthDate">
      <DateInput
        id="recipient-recipientBirthDate"
        label="Recipient date of birth"
        bind:value={d.recipientBirthDate}
      />
    </Field>
  </div>

  <Field label="Relationship to recipient" inputId="recipient-relationshipToRecipient">
    <TextInput
      id="recipient-relationshipToRecipient"
      label="Relationship to recipient"
      bind:value={d.relationshipToRecipient}
    />
  </Field>
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
