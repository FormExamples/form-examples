<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { CheckboxInput, TextInput } from '@lilydesignsystem/svelte-headless';

  const d = assessment.data.requester;
</script>

<Fieldset legend="Step 6 of 8 · Requester and consent">
  <p class="hint">
    The requester is responsible for informed consent (including for genetic testing) and identity
    verification.
  </p>

  <Field label="Signed at" inputId="requester-requestedBySignedAt">
    <TextInput
      id="requester-requestedBySignedAt"
      label="Signed at"
      type="datetime-local"
      bind:value={d.requestedBySignedAt}
    />
  </Field>

  <label class="bool-field">
    <CheckboxInput
      id="requester-consentAndIdentityConfirmed"
      label="I confirm informed consent was obtained and identity verified"
      bind:checked={d.consentAndIdentityConfirmed}
    />
    <span>I confirm informed consent was obtained and identity verified</span>
  </label>
</Fieldset>

<style>
  .bool-field {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
</style>
