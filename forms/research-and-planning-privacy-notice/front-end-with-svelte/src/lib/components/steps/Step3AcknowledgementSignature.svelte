<script lang="ts">
  import { assessment } from '$lib/stores/assessment.svelte';
  import Fieldset from '$lib/components/ui/Fieldset.svelte';
  import Field from '$lib/components/ui/Field.svelte';
  import TextInput from '$lib/components/ui/TextInput.svelte';
  import DateInput from '$lib/components/ui/DateInput.svelte';
  import CheckboxInput from '$lib/components/ui/CheckboxInput.svelte';
  import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

  const ack = assessment.data.acknowledgementSignature;

  if (!ack.recipientTypedDate) {
    ack.recipientTypedDate = new Date().toISOString().slice(0, 10);
  }
</script>

<Fieldset legend="Step 3 — Opt-Out Preference, Acknowledgement & Signature">
  <p class="hint">
    Record your Type 1 and National Data Opt-Out preferences, then
    acknowledge and sign.
  </p>

  <Field label="Type 1 opt-out (from this practice)">
    <RadioGroup label="Type 1 opt-out" id="ack-type1OptOut">
      <label>
        <input
          type="radio"
          class="radio-input"
          bind:group={ack.type1OptOut}
          value="opt-in"
        />
        Opt in — I consent to my information being used for research and
        planning purposes
      </label>
      <label>
        <input
          type="radio"
          class="radio-input"
          bind:group={ack.type1OptOut}
          value="opt-out"
        />
        Opt out — I do not want my identifiable information shared from this
        practice for research or planning
      </label>
    </RadioGroup>
  </Field>

  <Field label="NHS National Data Opt-Out">
    <RadioGroup label="NHS National Data Opt-Out" id="ack-nationalDataOptOut">
      <label>
        <input
          type="radio"
          class="radio-input"
          bind:group={ack.nationalDataOptOut}
          value="opt-in"
        />
        Opt in — I allow my confidential patient information to be used for
        research and planning across the NHS
      </label>
      <label>
        <input
          type="radio"
          class="radio-input"
          bind:group={ack.nationalDataOptOut}
          value="opt-out"
        />
        Opt out — I do not want my data used beyond my individual care and
        treatment
      </label>
    </RadioGroup>
  </Field>

  <Field label="Acknowledgement" required>
    <label class="ack-label">
      <CheckboxInput id="ack-agreed" label="I confirm I have read and understood the notice" bind:checked={ack.agreed} />
      I confirm I have read and understood the research and planning privacy
      notice and my opt-out choices above.
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
