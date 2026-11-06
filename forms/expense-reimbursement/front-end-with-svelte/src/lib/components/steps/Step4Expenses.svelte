<script lang="ts">
  import Field from '#lib/components/ui/Field.svelte';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Select from '#lib/components/ui/Select.svelte';
  import { createDefaultItem, EXPENSE_CATEGORIES } from '#lib/engine/defaults.js';
  import { claimTotals } from '#lib/engine/rules.js';
  import { formatMoney } from '#lib/engine/utils.js';
  import {
    Button,
    CheckboxGroup,
    CheckboxInput,
    DateInput,
    NumberInput,
    TextInput
  } from '@lilydesignsystem/svelte-headless';
  import { claimStore } from '#lib/stores/result.svelte.js';

  const totals = $derived(claimTotals(claimStore.data));
  const currency = $derived(claimStore.data.claim.currency || 'GBP');

  function addItem() {
    claimStore.data.items.push(createDefaultItem(claimStore.data.items.length + 1));
  }

  function removeItem(lineNumber: number) {
    claimStore.data.items = claimStore.data.items.filter((i) => i.lineNumber !== lineNumber);
    claimStore.data.items.forEach((i, idx) => (i.lineNumber = idx + 1));
  }
</script>

<Fieldset legend="4. Expenses">
  <p class="hint">One entry per receipt or purchase you paid for yourself.</p>

  {#each claimStore.data.items as item (item.lineNumber)}
    {@const n = item.lineNumber}
    <div class="mb-4 rounded-lg border border-base-300 p-4" data-line={n}>
      <div class="flex items-center justify-between gap-4">
        <h3 class="font-semibold">Expense {n}</h3>
        {#if claimStore.data.items.length > 1}
          <Button data-variant="secondary" onclick={() => removeItem(n)}>Remove expense {n}</Button>
        {/if}
      </div>

      <Field label="Date" inputId="item{n}Date">
        <DateInput id="item{n}Date" label="Date" bind:value={item.expenseDate} />
      </Field>

      <Field label="Category" inputId="item{n}Category">
        <Select id="item{n}Category" label="Category" bind:value={item.category}>
          <option value="">Select…</option>
          {#each EXPENSE_CATEGORIES as [value, text] (value)}
            <option {value}>{text}</option>
          {/each}
        </Select>
      </Field>

      <Field label="Description" inputId="item{n}Description">
        <TextInput id="item{n}Description" label="Description" bind:value={item.description} />
      </Field>

      <Field label="Merchant / supplier" inputId="item{n}Merchant">
        <TextInput id="item{n}Merchant" label="Merchant / supplier" bind:value={item.merchant} />
      </Field>

      <Field label="Amount (including VAT)" inputId="item{n}Amount">
        <NumberInput
          id="item{n}Amount"
          label="Amount (including VAT)"
          min={0}
          step={0.01}
          bind:value={() => item.amount ?? undefined, (v) => (item.amount = v ?? null)}
        />
      </Field>

      <Field label="VAT included" inputId="item{n}Vat">
        <NumberInput
          id="item{n}Vat"
          label="VAT included"
          min={0}
          step={0.01}
          bind:value={() => item.vatAmount ?? undefined, (v) => (item.vatAmount = v ?? null)}
        />
      </Field>

      <Field label="Currency paid in" inputId="item{n}Currency">
        <Select id="item{n}Currency" label="Currency paid in" bind:value={item.currency}>
          {#each ['GBP', 'EUR', 'USD', 'CHF', 'AUD', 'CAD'] as c (c)}
            <option value={c}>{c}</option>
          {/each}
        </Select>
      </Field>

      <Field label="Exchange rate to claim currency" inputId="item{n}ExchangeRate">
        <NumberInput
          id="item{n}ExchangeRate"
          label="Exchange rate to claim currency"
          min={0}
          step={0.000001}
          bind:value={() => item.exchangeRate ?? undefined, (v) => (item.exchangeRate = v ?? null)}
        />
      </Field>

      <Field label="How you paid" inputId="item{n}PaymentMethod">
        <Select id="item{n}PaymentMethod" label="How you paid" bind:value={item.paymentMethod}>
          <option value="">Select…</option>
          <option value="personal-credit-card">Personal credit card</option>
          <option value="personal-debit-card">Personal debit card</option>
          <option value="cash">Cash</option>
          <option value="other">Other</option>
        </Select>
      </Field>

      <Field label="Mileage (miles)" inputId="item{n}Mileage">
        <NumberInput
          id="item{n}Mileage"
          label="Mileage (miles)"
          min={0}
          step={0.1}
          bind:value={
            () => item.mileageDistanceMiles ?? undefined,
            (v) => (item.mileageDistanceMiles = v ?? null)
          }
        />
      </Field>

      <Field label="Receipt reference" inputId="item{n}ReceiptReference">
        <TextInput
          id="item{n}ReceiptReference"
          label="Receipt reference"
          bind:value={item.receiptReference}
        />
      </Field>

      <Field label="If there is no receipt, why not?" inputId="item{n}ReceiptMissingReason">
        <TextInput
          id="item{n}ReceiptMissingReason"
          label="If there is no receipt, why not?"
          bind:value={item.receiptMissingReason}
        />
      </Field>

      <CheckboxGroup label="Receipt and approval">
        <label
          ><CheckboxInput label="Receipt attached" bind:checked={item.receiptAttached} /> Receipt attached</label
        >
        <label
          ><CheckboxInput
            label="My manager approved this in advance"
            bind:checked={item.priorApprovalObtained}
          /> My manager approved this in advance</label
        >
      </CheckboxGroup>
    </div>
  {/each}

  <Button data-variant="secondary" onclick={addItem}>Add another expense</Button>

  <p class="hint mt-4" aria-live="polite">
    Total {formatMoney(totals.total, currency)} (VAT {formatMoney(totals.vat, currency)}) · advance
    {formatMoney(totals.advance, currency)} · to repay {formatMoney(totals.amountToRepay, currency)}
  </p>
</Fieldset>
