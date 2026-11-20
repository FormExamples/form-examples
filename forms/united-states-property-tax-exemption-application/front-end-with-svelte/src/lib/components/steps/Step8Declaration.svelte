<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import Select from '#lib/components/ui/Select.svelte';
  import DateInput from '#lib/components/ui/DateInput.svelte';

  const s = assessment.data.declaration;
</script>

<Fieldset legend="Step 8 of 8 — Declaration">
  <p class="hint">
    A false statement on this application can lead to back taxes, penalties and prosecution.
  </p>

  <Field
    label="I understand the penalty for knowingly making a false statement"
    inputId="declaration-penaltyAcknowledged"
  >
    <Select
      id="declaration-penaltyAcknowledged"
      label="I understand the penalty for knowingly making a false statement"
      bind:value={s.penaltyAcknowledged}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field
    label="I declare under penalty of perjury that the information is true and complete"
    inputId="declaration-signedByApplicant"
  >
    <Select
      id="declaration-signedByApplicant"
      label="I declare under penalty of perjury that the information is true and complete"
      bind:value={s.signedByApplicant}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field label="Date signed" inputId="declaration-signatureDate">
    <DateInput id="declaration-signatureDate" label="Date signed" bind:value={s.signatureDate} />
  </Field>
</Fieldset>
