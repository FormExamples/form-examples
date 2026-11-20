<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { TextAreaInput, TextInput } from '@lilydesignsystem/svelte-headless';
  import DateInput from '#lib/components/ui/DateInput.svelte';

  const a = assessment.data.applicant;
</script>

<Fieldset legend="Step 1 of 6 — Applicant">
  <p class="hint">The person completing and signing this request for a certified copy.</p>

  <Field label="Your full legal name" inputId="applicant-applicantName">
    <TextInput
      id="applicant-applicantName"
      label="Your full legal name"
      placeholder="Full legal name"
      bind:value={a.applicantName}
    />
  </Field>

  <Field label="Your date of birth" inputId="applicant-dateOfBirth">
    <DateInput id="applicant-dateOfBirth" label="Your date of birth" bind:value={a.dateOfBirth} />
  </Field>

  <Field label="Email address" inputId="applicant-email">
    <TextInput
      id="applicant-email"
      label="Email address"
      placeholder="name@example.org"
      bind:value={a.email}
    />
  </Field>

  <Field label="Phone number" inputId="applicant-phone">
    <TextInput id="applicant-phone" label="Phone number" bind:value={a.phone} />
  </Field>

  <Field label="Mailing address for delivery" inputId="applicant-postalAddress">
    <TextAreaInput
      id="applicant-postalAddress"
      label="Mailing address for delivery"
      rows={3}
      bind:value={a.postalAddress}
    />
  </Field>
</Fieldset>
