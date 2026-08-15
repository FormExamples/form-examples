<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import TextInput from '#lib/components/ui/TextInput.svelte';
  import DateInput from '#lib/components/ui/DateInput.svelte';

  const rd = assessment.data.recipientDetails;
</script>

<Fieldset legend="Step 1 — Recipient Details">
  <p class="hint">
    Enter the details of the patient acknowledging the research and planning
    privacy notice.
  </p>

  <Field label="Organisation Name" inputId="rd-organisationName" required>
    <TextInput
      id="rd-organisationName"
      label="Organisation Name"
      placeholder="e.g. Riverside Medical Practice"
      bind:value={rd.organisationName}
      required
    />
  </Field>
  <Field label="Recipient Name" inputId="rd-recipientName" required>
    <TextInput
      id="rd-recipientName"
      label="Recipient Name"
      placeholder="e.g. Mrs Jane Smith"
      bind:value={rd.recipientName}
      required
    />
  </Field>
  <Field label="NHS Number (optional)" inputId="rd-recipientNhsNumber">
    <TextInput
      id="rd-recipientNhsNumber"
      label="NHS Number"
      placeholder="e.g. 943 476 5919"
      bind:value={rd.recipientNhsNumber}
    />
  </Field>
  <Field label="Date of Birth (optional)" inputId="rd-recipientDob">
    <DateInput
      id="rd-recipientDob"
      label="Date of Birth"
      bind:value={rd.recipientDob}
    />
  </Field>
</Fieldset>
