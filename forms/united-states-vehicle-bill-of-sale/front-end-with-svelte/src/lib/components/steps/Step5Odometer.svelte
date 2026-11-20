<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import Select from '#lib/components/ui/Select.svelte';
  import NumberInput from '#lib/components/ui/NumberInput.svelte';

  const p = assessment.data.odometer;
</script>

<Fieldset legend="Step 5 of 7 — Odometer disclosure (49 CFR 580)">
  <p class="hint">
    The federal odometer disclosure statement. Federal law requires the seller to state the mileage;
    false statements may bring fines or imprisonment.
  </p>

  <Field label="Odometer reading (miles)" inputId="odometer-readingMiles">
    <NumberInput
      id="odometer-readingMiles"
      label="Odometer reading (miles)"
      min={0}
      bind:value={p.readingMiles}
    />
  </Field>
  <p class="hint">Whole miles, without tenths.</p>

  <Field label="Seller certification" inputId="odometer-status">
    <Select id="odometer-status" label="Seller certification" bind:value={p.status}>
      <option value="">— Select —</option>
      <option value="actual">Reflects the actual mileage</option>
      <option value="exceeds-mechanical-limits">Exceeds the odometer mechanical limits</option>
      <option value="not-actual">NOT the actual mileage (warning: odometer discrepancy)</option>
    </Select>
  </Field>
  <p class="hint">Choose the one statement the seller can truthfully make.</p>

  <Field label="Seller has signed the odometer disclosure?" inputId="odometer-sellerCertified">
    <Select
      id="odometer-sellerCertified"
      label="Seller has signed the odometer disclosure?"
      bind:value={p.sellerCertified}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field label="Buyer has signed the acknowledgement?" inputId="odometer-buyerAcknowledged">
    <Select
      id="odometer-buyerAcknowledged"
      label="Buyer has signed the acknowledgement?"
      bind:value={p.buyerAcknowledged}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
</Fieldset>
