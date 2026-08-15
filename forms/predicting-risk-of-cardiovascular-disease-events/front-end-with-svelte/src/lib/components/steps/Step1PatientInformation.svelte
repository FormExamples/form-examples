<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import TextInput from '#lib/components/ui/TextInput.svelte';
  import DateInput from '#lib/components/ui/DateInput.svelte';
  import EmailInput from '#lib/components/ui/EmailInput.svelte';
  import TelInput from '#lib/components/ui/TelInput.svelte';

  const p = assessment.data.patientInformation;
</script>

<Fieldset legend="Step 1 \u2014 Patient information">
  <p class="hint">Basic patient identification details.</p>

  <Field label="Full name" inputId="step-1-fullName" required>
    <TextInput id="step-1-fullName" label="Full name" bind:value={p.fullName} />
  </Field>

  <Field label="Date of birth" inputId="step-1-dateOfBirth" required>
    <DateInput id="step-1-dateOfBirth" label="Date of birth" bind:value={p.dateOfBirth} />
  </Field>

  <Field label="NHS number" inputId="step-1-nhsNumber">
    <TextInput id="step-1-nhsNumber" label="NHS number" bind:value={p.nhsNumber} />
  </Field>

  <Field label="Address" inputId="step-1-address">
    <TextInput id="step-1-address" label="Address" bind:value={p.address} />
  </Field>

  <div class="field-grid">
    <Field label="Telephone" inputId="step-1-telephone">
      <TelInput id="step-1-telephone" label="Telephone" bind:value={p.telephone} />
    </Field>
    <Field label="Email" inputId="step-1-email">
      <EmailInput id="step-1-email" label="Email" bind:value={p.email} />
    </Field>
  </div>

  <div class="field-grid">
    <Field label="GP name" inputId="step-1-gpName">
      <TextInput id="step-1-gpName" label="GP name" bind:value={p.gpName} />
    </Field>
    <Field label="GP practice" inputId="step-1-gpPractice">
      <TextInput id="step-1-gpPractice" label="GP practice" bind:value={p.gpPractice} />
    </Field>
  </div>
</Fieldset>
