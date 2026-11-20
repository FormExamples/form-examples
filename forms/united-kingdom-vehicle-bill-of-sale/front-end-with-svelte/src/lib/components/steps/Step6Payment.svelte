<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import Select from '#lib/components/ui/Select.svelte';
  import NumberInput from '#lib/components/ui/NumberInput.svelte';

  const p = assessment.data.payment;
</script>

<Fieldset legend="Step 6 of 9 — Price and payment">
  <p class="hint">
    The agreed price and how it is paid. Prefer a bank transfer and keep proof of payment.
  </p>

  <Field label="Price (£)" inputId="payment-priceAsGbp">
    <NumberInput id="payment-priceAsGbp" label="Price (£)" bind:value={p.priceAsGbp} />
  </Field>

  <Field label="Deposit paid (£)" inputId="payment-depositAsGbp">
    <NumberInput id="payment-depositAsGbp" label="Deposit paid (£)" bind:value={p.depositAsGbp} />
  </Field>

  <Field label="Payment method" inputId="payment-paymentMethod">
    <Select id="payment-paymentMethod" label="Payment method" bind:value={p.paymentMethod}>
      <option value="">— Select —</option>
      <option value="bank-transfer">Bank transfer</option>
      <option value="cash">Cash</option>
      <option value="cheque">Cheque</option>
      <option value="card">Card</option>
      <option value="other">Other</option>
    </Select>
  </Field>

  <Field label="Has the seller received cleared funds?" inputId="payment-paymentReceived">
    <Select
      id="payment-paymentReceived"
      label="Has the seller received cleared funds?"
      bind:value={p.paymentReceived}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
</Fieldset>
