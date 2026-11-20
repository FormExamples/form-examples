<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { TextInput } from '@lilydesignsystem/svelte-headless';
  import Select from '#lib/components/ui/Select.svelte';
  import DateInput from '#lib/components/ui/DateInput.svelte';

  const p = assessment.data.sale;
</script>

<Fieldset legend="Step 1 of 9 — The sale">
  <p class="hint">
    When and where the sale took place, and whether the seller is a private individual or a trader.
  </p>

  <Field label="Date of sale" inputId="sale-saleDate">
    <DateInput id="sale-saleDate" label="Date of sale" bind:value={p.saleDate} />
  </Field>

  <Field label="Place of sale" inputId="sale-salePlace">
    <TextInput
      id="sale-salePlace"
      label="Place of sale"
      placeholder="e.g. Seller's home, Leeds"
      bind:value={p.salePlace}
    />
  </Field>

  <Field label="Seller is" inputId="sale-sellerCapacity">
    <Select id="sale-sellerCapacity" label="Seller is" bind:value={p.sellerCapacity}>
      <option value="">— Select —</option>
      <option value="private">Private individual</option>
      <option value="trader">Trader (selling in the course of a business)</option>
    </Select>
  </Field>
</Fieldset>
