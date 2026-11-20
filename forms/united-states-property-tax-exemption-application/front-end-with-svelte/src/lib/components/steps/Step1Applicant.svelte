<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { TextAreaInput, TextInput } from '@lilydesignsystem/svelte-headless';
  import DateInput from '#lib/components/ui/DateInput.svelte';
  import NumberInput from '#lib/components/ui/NumberInput.svelte';

  const s = assessment.data.applicant;
</script>

<Fieldset legend="Step 1 of 8 — Applicant">
  <p class="hint">The property owner applying. Age is measured on the assessment date.</p>

  <Field label="Applicant full legal name" inputId="applicant-applicantName">
    <TextInput
      id="applicant-applicantName"
      label="Applicant full legal name"
      bind:value={s.applicantName}
    />
  </Field>

  <Field label="Date of birth" inputId="applicant-dateOfBirth">
    <DateInput id="applicant-dateOfBirth" label="Date of birth" bind:value={s.dateOfBirth} />
  </Field>

  <Field label="Age on the assessment date" inputId="applicant-ageOnAssessmentDate">
    <NumberInput
      id="applicant-ageOnAssessmentDate"
      label="Age on the assessment date"
      bind:value={s.ageOnAssessmentDate}
    />
  </Field>
  <p class="hint">Whole years on the assessment (lien) date, usually January 1.</p>

  <Field label="Mailing address" inputId="applicant-mailingAddress">
    <TextAreaInput
      id="applicant-mailingAddress"
      label="Mailing address"
      rows={2}
      bind:value={s.mailingAddress}
    />
  </Field>
  <p class="hint">Where the assessor sends notices.</p>
</Fieldset>
