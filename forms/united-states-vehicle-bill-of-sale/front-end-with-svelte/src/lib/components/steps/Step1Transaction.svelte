<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import Select from '#lib/components/ui/Select.svelte';
  import DateInput from '#lib/components/ui/DateInput.svelte';
  import NumberInput from '#lib/components/ui/NumberInput.svelte';
  import { STATE_OPTIONS } from '#lib/config/states.js';

  const p = assessment.data.transaction;
</script>

<Fieldset legend="Step 1 of 7 — Sale transaction">
  <p class="hint">
    The state whose rules apply, the date and price of the sale, how it was paid, and the sales-tax
    basis.
  </p>

  <Field label="State that will title the vehicle" inputId="transaction-state">
    <Select id="transaction-state" label="State that will title the vehicle" bind:value={p.state}>
      <option value="">— Select —</option>
      {#each STATE_OPTIONS as o (o.value)}
        <option value={o.value}>{o.label}</option>
      {/each}
    </Select>
  </Field>
  <p class="hint">
    State law varies; the state selects the notarization, release-of-liability, and title-transfer
    rules.
  </p>

  <Field label="Date of sale" inputId="transaction-saleDate">
    <DateInput id="transaction-saleDate" label="Date of sale" bind:value={p.saleDate} />
  </Field>

  <Field label="Sale price (US dollars)" inputId="transaction-salePriceAsUsd">
    <NumberInput
      id="transaction-salePriceAsUsd"
      label="Sale price (US dollars)"
      min={0}
      bind:value={p.salePriceAsUsd}
    />
  </Field>
  <p class="hint">Enter 0 for a gift.</p>

  <Field label="Payment method" inputId="transaction-paymentMethod">
    <Select id="transaction-paymentMethod" label="Payment method" bind:value={p.paymentMethod}>
      <option value="">— Select —</option>
      <option value="cash">Cash</option>
      <option value="check">Check</option>
      <option value="wire">Wire or electronic transfer</option>
      <option value="financing">Financing or loan</option>
      <option value="trade">Trade</option>
      <option value="gift">Gift (no payment)</option>
    </Select>
  </Field>

  <Field label="Sales-tax basis" inputId="transaction-taxBasis">
    <Select id="transaction-taxBasis" label="Sales-tax basis" bind:value={p.taxBasis}>
      <option value="">— Select —</option>
      <option value="purchase-price">Purchase price</option>
      <option value="standard-presumptive-value">State standard presumptive value</option>
      <option value="fair-market-value">Fair market value</option>
      <option value="exempt-gift">Exempt: gift</option>
      <option value="exempt-family">Exempt: family transfer</option>
    </Select>
  </Field>
  <p class="hint">The basis the buyer will use when paying sales or use tax at titling.</p>
</Fieldset>
