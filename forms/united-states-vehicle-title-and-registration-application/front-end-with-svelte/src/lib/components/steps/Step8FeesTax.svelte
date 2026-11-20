<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { TextAreaInput, TextInput } from '@lilydesignsystem/svelte-headless';
  import Select from '#lib/components/ui/Select.svelte';
  import NumberInput from '#lib/components/ui/NumberInput.svelte';

  const s = assessment.data.feesTax;
</script>

<Fieldset legend="Step 8 of 8 — Fees and tax">
  <p class="hint">
    The purchase price, the sales or use tax, and the title and registration fees. Fee amounts
    change every legislative session, so check the agency's fee schedule.
  </p>

  <Field label="Purchase price (US dollars)" inputId="feesTax-purchasePriceUsd">
    <NumberInput
      id="feesTax-purchasePriceUsd"
      label="Purchase price (US dollars)"
      min={0}
      bind:value={s.purchasePriceUsd}
    />
  </Field>

  <Field label="Sales or use tax status" inputId="feesTax-salesTaxStatus">
    <Select
      id="feesTax-salesTaxStatus"
      label="Sales or use tax status"
      bind:value={s.salesTaxStatus}
    >
      <option value="">— Select —</option>
      <option value="paid-to-dealer">Paid to the dealer</option>
      <option value="due-at-title">Due when titling</option>
      <option value="exempt">Exempt</option>
      <option value="not-calculated">Not calculated yet</option>
    </Select>
  </Field>

  <Field label="Tax rate entered (percent)" inputId="feesTax-salesTaxRatePercent">
    <NumberInput
      id="feesTax-salesTaxRatePercent"
      label="Tax rate entered (percent)"
      min={0}
      max={20}
      bind:value={s.salesTaxRatePercent}
    />
  </Field>

  <Field label="Tax amount (US dollars)" inputId="feesTax-salesTaxAmountUsd">
    <NumberInput
      id="feesTax-salesTaxAmountUsd"
      label="Tax amount (US dollars)"
      min={0}
      bind:value={s.salesTaxAmountUsd}
    />
  </Field>

  <Field label="Tax exemption reason" inputId="feesTax-taxExemptionReason">
    <TextInput
      id="feesTax-taxExemptionReason"
      label="Tax exemption reason"
      placeholder="e.g. gift between family members"
      bind:value={s.taxExemptionReason}
    />
  </Field>

  <Field label="Title fee (US dollars)" inputId="feesTax-titleFeeUsd">
    <NumberInput
      id="feesTax-titleFeeUsd"
      label="Title fee (US dollars)"
      min={0}
      bind:value={s.titleFeeUsd}
    />
  </Field>

  <Field label="Registration fee (US dollars)" inputId="feesTax-registrationFeeUsd">
    <NumberInput
      id="feesTax-registrationFeeUsd"
      label="Registration fee (US dollars)"
      min={0}
      bind:value={s.registrationFeeUsd}
    />
  </Field>

  <Field label="Fees tendered with the application?" inputId="feesTax-feesTendered">
    <Select
      id="feesTax-feesTendered"
      label="Fees tendered with the application?"
      bind:value={s.feesTendered}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field label="Applicant note" inputId="feesTax-applicantNote">
    <TextAreaInput
      id="feesTax-applicantNote"
      label="Applicant note"
      rows={3}
      placeholder="Anything the clerk should know."
      bind:value={s.applicantNote}
    />
  </Field>
</Fieldset>
