<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import Select from '#lib/components/ui/Select.svelte';

  const f = assessment.data.finances;
</script>

<Fieldset legend="Step 6 of 7 — Money, property and the fee">
  <p class="hint">
    A financial order is separate from the divorce. Apply for it before the final order if you want
    a legally binding settlement.
  </p>

  <Field
    label="Do you intend to apply for a financial order?"
    inputId="finances-financialOrderIntended"
  >
    <Select
      id="finances-financialOrderIntended"
      label="Do you intend to apply for a financial order?"
      bind:value={f.financialOrderIntended}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes, I intend to apply for a financial order</option>
      <option value="no">No financial order intended</option>
      <option value="undecided">Undecided</option>
    </Select>
  </Field>

  <Field label="Has a financial order been applied for?" inputId="finances-financialOrderApplied">
    <Select
      id="finances-financialOrderApplied"
      label="Has a financial order been applied for?"
      bind:value={f.financialOrderApplied}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field label="Court fee status" inputId="finances-feeStatus">
    <Select id="finances-feeStatus" label="Court fee status" bind:value={f.feeStatus}>
      <option value="">— Select —</option>
      <option value="paid">Paid</option>
      <option value="help-with-fees-approved">Help with Fees approved</option>
      <option value="help-with-fees-pending">Help with Fees pending</option>
      <option value="unpaid">Not paid</option>
    </Select>
  </Field>
  <p class="hint">
    The application fee is GBP 628 and is not refunded once issued. Help with Fees may be available.
  </p>
</Fieldset>
