<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import Select from '#lib/components/ui/Select.svelte';
  import DateInput from '#lib/components/ui/DateInput.svelte';

  const s = assessment.data.compliance;
</script>

<Fieldset legend="Step 7 of 8 — Insurance and inspections">
  <p class="hint">
    Proof of insurance, emissions and safety inspections, and the VIN verification an out-of-state
    vehicle needs.
  </p>

  <Field label="Proof of insurance" inputId="compliance-insuranceProof">
    <Select id="compliance-insuranceProof" label="Proof of insurance" bind:value={s.insuranceProof}>
      <option value="">— Select —</option>
      <option value="provided">Proof of insurance provided</option>
      <option value="not-provided">Not provided</option>
    </Select>
  </Field>

  <Field label="Insurance expiry date" inputId="compliance-insuranceExpiryDate">
    <DateInput
      id="compliance-insuranceExpiryDate"
      label="Insurance expiry date"
      bind:value={s.insuranceExpiryDate}
    />
  </Field>

  <Field label="Emissions (smog) inspection" inputId="compliance-emissionsInspection">
    <Select
      id="compliance-emissionsInspection"
      label="Emissions (smog) inspection"
      bind:value={s.emissionsInspection}
    >
      <option value="">— Select —</option>
      <option value="passed">Passed</option>
      <option value="not-done">Not done</option>
      <option value="exempt">Exempt</option>
      <option value="not-required">Not required</option>
    </Select>
  </Field>

  <Field label="Safety inspection" inputId="compliance-safetyInspection">
    <Select
      id="compliance-safetyInspection"
      label="Safety inspection"
      bind:value={s.safetyInspection}
    >
      <option value="">— Select —</option>
      <option value="passed">Passed</option>
      <option value="not-done">Not done</option>
      <option value="exempt">Exempt</option>
      <option value="not-required">Not required</option>
    </Select>
  </Field>

  <Field label="Out-of-state VIN verification" inputId="compliance-vinVerification">
    <Select
      id="compliance-vinVerification"
      label="Out-of-state VIN verification"
      bind:value={s.vinVerification}
    >
      <option value="">— Select —</option>
      <option value="done">Done (form attached)</option>
      <option value="not-done">Not done</option>
      <option value="not-required">Not required</option>
    </Select>
  </Field>
</Fieldset>
