<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { TextInput } from '@lilydesignsystem/svelte-headless';
  import Select from '#lib/components/ui/Select.svelte';
  import DateInput from '#lib/components/ui/DateInput.svelte';

  const i = assessment.data.importDetails;
</script>

<Fieldset legend="Step 6 of 7 — Imported vehicle">
  <p class="hint">
    Complete this step only for an imported vehicle. HMRC must be notified of the arrival (NOVA)
    within 14 days.
  </p>

  <Field label="Country of export" inputId="importDetails-countryOfExport">
    <TextInput
      id="importDetails-countryOfExport"
      label="Country of export"
      bind:value={i.countryOfExport}
    />
  </Field>

  <Field label="Date the vehicle arrived in Great Britain" inputId="importDetails-importDate">
    <DateInput
      id="importDetails-importDate"
      label="Date the vehicle arrived in Great Britain"
      bind:value={i.importDate}
    />
  </Field>

  <Field label="HMRC NOVA status" inputId="importDetails-novaStatus">
    <Select id="importDetails-novaStatus" label="HMRC NOVA status" bind:value={i.novaStatus}>
      <option value="">— Select —</option>
      <option value="notified">HMRC notified through NOVA</option>
      <option value="not-notified">HMRC not yet notified</option>
      <option value="not-applicable">Not applicable</option>
    </Select>
  </Field>

  <Field label="NOVA reference" inputId="importDetails-novaReference">
    <TextInput
      id="importDetails-novaReference"
      label="NOVA reference"
      bind:value={i.novaReference}
    />
  </Field>
</Fieldset>
