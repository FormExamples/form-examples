<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import TextInput from '#lib/components/ui/TextInput.svelte';

  const rd = assessment.data.recipientDetails;
</script>

<Fieldset legend="Step 1 — Recipient Details">
  <p class="hint">
    Enter the details of the person acknowledging the code of conduct.
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
      placeholder="e.g. Dr Jane Smith"
      bind:value={rd.recipientName}
      required
    />
  </Field>
  <Field label="Recipient Role" inputId="rd-recipientRole" required>
    <TextInput
      id="rd-recipientRole"
      label="Recipient Role"
      placeholder="e.g. General Practitioner, Healthcare Assistant, Contractor"
      bind:value={rd.recipientRole}
      required
    />
  </Field>
  <Field label="Employee / Contractor ID (optional)" inputId="rd-recipientEmployeeId">
    <TextInput
      id="rd-recipientEmployeeId"
      label="Employee / Contractor ID"
      placeholder="e.g. 4827"
      bind:value={rd.recipientEmployeeId}
    />
  </Field>
</Fieldset>
