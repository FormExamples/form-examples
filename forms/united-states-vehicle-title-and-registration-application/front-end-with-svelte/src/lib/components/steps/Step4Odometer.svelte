<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import Select from '#lib/components/ui/Select.svelte';
  import NumberInput from '#lib/components/ui/NumberInput.svelte';

  const s = assessment.data.odometer;
</script>

<Fieldset legend="Step 4 of 8 — Odometer disclosure">
  <p class="hint">
    The federal written odometer disclosure (49 CFR Part 580). Vehicles over 16,000 pounds GVWR, and
    older vehicles (10 years for model year 2010 or earlier, 20 years for 2011 or later), are
    exempt.
  </p>

  <Field label="Odometer reading (miles, no tenths)" inputId="odometer-odometerReading">
    <NumberInput
      id="odometer-odometerReading"
      label="Odometer reading (miles, no tenths)"
      min={0}
      max={9999999}
      bind:value={s.odometerReading}
    />
  </Field>

  <Field label="Odometer status" inputId="odometer-odometerStatus">
    <Select id="odometer-odometerStatus" label="Odometer status" bind:value={s.odometerStatus}>
      <option value="">— Select —</option>
      <option value="actual">Actual mileage</option>
      <option value="exceeds-mechanical-limits">Exceeds the odometer's mechanical limits</option>
      <option value="not-actual">Not the actual mileage (warning: odometer discrepancy)</option>
    </Select>
  </Field>

  <Field
    label="Seller has signed the odometer statement?"
    inputId="odometer-sellerOdometerStatement"
  >
    <Select
      id="odometer-sellerOdometerStatement"
      label="Seller has signed the odometer statement?"
      bind:value={s.sellerOdometerStatement}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field
    label="Buyer has acknowledged the odometer statement?"
    inputId="odometer-buyerOdometerAcknowledged"
  >
    <Select
      id="odometer-buyerOdometerAcknowledged"
      label="Buyer has acknowledged the odometer statement?"
      bind:value={s.buyerOdometerAcknowledged}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
</Fieldset>
