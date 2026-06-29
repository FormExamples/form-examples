<script lang="ts">
  import { assessment } from '$lib/stores/assessment.svelte';
  import Fieldset from '$lib/components/ui/Fieldset.svelte';
  import Field from '$lib/components/ui/Field.svelte';
  import TextInput from '$lib/components/ui/TextInput.svelte';
  import DateInput from '$lib/components/ui/DateInput.svelte';
  import CheckboxInput from '$lib/components/ui/CheckboxInput.svelte';

  const ack = assessment.data.acknowledgementSignature;

  if (!ack.recipientTypedDate) {
    ack.recipientTypedDate = new Date().toISOString().slice(0, 10);
  }
</script>

<Fieldset legend="Step 3 — Acknowledgement & Signature">
  <p class="hint">
    Please confirm you have read and understood the code of conduct.
  </p>

  <Field label="Acknowledgement" required>
    <label class="ack-label">
      <CheckboxInput
        id="ack-agreed"
        label="I have read and agree to uphold the Code of Conduct"
        bind:checked={ack.agreed}
      />
      I have read, understood, and agree to uphold the above Code of Conduct
      principles. I will abide by these principles in every professional
      interaction with patients and colleagues.
    </label>
  </Field>

  <Field label="Full Name" inputId="ack-recipientTypedFullName" required>
    <TextInput
      id="ack-recipientTypedFullName"
      label="Full Name"
      placeholder="Type your full name"
      bind:value={ack.recipientTypedFullName}
      required
    />
  </Field>
  <Field label="Today's Date" inputId="ack-recipientTypedDate" required>
    <DateInput
      id="ack-recipientTypedDate"
      label="Today's Date"
      bind:value={ack.recipientTypedDate}
      required
    />
  </Field>
</Fieldset>

<style>
  .ack-label {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    padding: 0.5rem 0;
    cursor: pointer;
  }
</style>
