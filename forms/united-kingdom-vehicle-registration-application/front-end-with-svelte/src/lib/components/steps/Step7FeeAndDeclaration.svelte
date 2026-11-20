<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { TextAreaInput } from '@lilydesignsystem/svelte-headless';
  import Select from '#lib/components/ui/Select.svelte';
  import DateInput from '#lib/components/ui/DateInput.svelte';
  import NumberInput from '#lib/components/ui/NumberInput.svelte';

  const f = assessment.data.feeAndDeclaration;
</script>

<Fieldset legend="Step 7 of 7 — Fee and declaration">
  <p class="hint">
    The fee is 25 pounds for a V62 (waived with a new-keeper slip) and 55 pounds for a first
    registration. Send a cheque or postal order payable to DVLA, Swansea; never cash.
  </p>

  <Field label="Payment method" inputId="feeAndDeclaration-feePaymentMethod">
    <Select
      id="feeAndDeclaration-feePaymentMethod"
      label="Payment method"
      bind:value={f.feePaymentMethod}
    >
      <option value="">— Select —</option>
      <option value="cheque">Cheque payable to DVLA, Swansea</option>
      <option value="postal-order">Postal order payable to DVLA, Swansea</option>
      <option value="post-office-card">Card payment at a Post Office branch</option>
      <option value="online-card">Card payment online</option>
      <option value="none">No payment enclosed</option>
    </Select>
  </Field>

  <Field label="Amount paid (pence)" inputId="feeAndDeclaration-feePaidAsPence">
    <NumberInput
      id="feeAndDeclaration-feePaidAsPence"
      label="Amount paid (pence)"
      min={0}
      max={100000}
      bind:value={f.feePaidAsPence}
    />
  </Field>
  <p class="hint">For example 2500 for 25 pounds.</p>

  <Field label="Declaration signed?" inputId="feeAndDeclaration-declarationSigned">
    <Select
      id="feeAndDeclaration-declarationSigned"
      label="Declaration signed?"
      bind:value={f.declarationSigned}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field label="Declaration date" inputId="feeAndDeclaration-declarationDate">
    <DateInput
      id="feeAndDeclaration-declarationDate"
      label="Declaration date"
      bind:value={f.declarationDate}
    />
  </Field>

  <Field label="Note" inputId="feeAndDeclaration-applicantNote">
    <TextAreaInput
      id="feeAndDeclaration-applicantNote"
      label="Note"
      rows={3}
      bind:value={f.applicantNote}
    />
  </Field>
</Fieldset>
