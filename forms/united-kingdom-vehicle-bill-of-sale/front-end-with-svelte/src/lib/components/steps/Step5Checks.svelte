<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import Select from '#lib/components/ui/Select.svelte';
  import DateInput from '#lib/components/ui/DateInput.svelte';

  const p = assessment.data.checks;
</script>

<Fieldset legend="Step 5 of 9 — Checks: V5C, MOT, and finance">
  <p class="hint">
    The V5C log book, the MOT, and whether any finance is still owed on the vehicle.
  </p>

  <Field label="Does the seller have the V5C (log book)?" inputId="checks-v5cPresent">
    <Select
      id="checks-v5cPresent"
      label="Does the seller have the V5C (log book)?"
      bind:value={p.v5cPresent}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field
    label="Do the V5C details match the vehicle and the seller?"
    inputId="checks-v5cDetailsMatch"
  >
    <Select
      id="checks-v5cDetailsMatch"
      label="Do the V5C details match the vehicle and the seller?"
      bind:value={p.v5cDetailsMatch}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field label="MOT status" inputId="checks-motStatus">
    <Select id="checks-motStatus" label="MOT status" bind:value={p.motStatus}>
      <option value="">— Select —</option>
      <option value="valid">Valid MOT</option>
      <option value="expired">MOT expired</option>
      <option value="exempt">Exempt from MOT</option>
      <option value="none">No MOT</option>
    </Select>
  </Field>

  <Field label="MOT expiry date" inputId="checks-motExpiryDate">
    <DateInput id="checks-motExpiryDate" label="MOT expiry date" bind:value={p.motExpiryDate} />
  </Field>

  <Field label="Outstanding finance" inputId="checks-financeStatus">
    <Select id="checks-financeStatus" label="Outstanding finance" bind:value={p.financeStatus}>
      <option value="">— Select —</option>
      <option value="none">No outstanding finance (checked)</option>
      <option value="outstanding">Finance outstanding</option>
      <option value="unchecked">Not checked</option>
    </Select>
  </Field>

  <Field label="Date finance / vehicle history check was run" inputId="checks-financeCheckDate">
    <DateInput
      id="checks-financeCheckDate"
      label="Date finance / vehicle history check was run"
      bind:value={p.financeCheckDate}
    />
  </Field>
</Fieldset>
