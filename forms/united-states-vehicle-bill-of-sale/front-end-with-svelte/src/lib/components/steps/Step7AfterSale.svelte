<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import Select from '#lib/components/ui/Select.svelte';
  import DateInput from '#lib/components/ui/DateInput.svelte';

  const p = assessment.data.afterSale;
</script>

<Fieldset legend="Step 7 of 7 — After the sale">
  <p class="hint">The seller release of liability, plates, and the buyer title application.</p>

  <Field
    label="Seller filed the release of liability or notice of transfer?"
    inputId="afterSale-releaseOfLiabilityFiled"
  >
    <Select
      id="afterSale-releaseOfLiabilityFiled"
      label="Seller filed the release of liability or notice of transfer?"
      bind:value={p.releaseOfLiabilityFiled}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field label="Date the release of liability was filed" inputId="afterSale-releaseFiledDate">
    <DateInput
      id="afterSale-releaseFiledDate"
      label="Date the release of liability was filed"
      bind:value={p.releaseFiledDate}
    />
  </Field>

  <Field label="Seller removed the license plates?" inputId="afterSale-platesRemoved">
    <Select
      id="afterSale-platesRemoved"
      label="Seller removed the license plates?"
      bind:value={p.platesRemoved}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field
    label="Date the buyer applied to title and register"
    inputId="afterSale-buyerTitleApplicationDate"
  >
    <DateInput
      id="afterSale-buyerTitleApplicationDate"
      label="Date the buyer applied to title and register"
      bind:value={p.buyerTitleApplicationDate}
    />
  </Field>
</Fieldset>
