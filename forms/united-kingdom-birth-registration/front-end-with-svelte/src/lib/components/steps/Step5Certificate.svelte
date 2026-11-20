<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { TextAreaInput } from '@lilydesignsystem/svelte-headless';
  import Select from '#lib/components/ui/Select.svelte';
  import NumberInput from '#lib/components/ui/NumberInput.svelte';

  const o = assessment.data.certificate;
</script>

<Fieldset legend="Step 5 of 5 — Birth certificate order">
  <p class="hint">
    Order certified copies from the General Register Office. A standard certificate costs 12.50
    pounds, priority 38.50 pounds.
  </p>

  <Field label="Number of certificates (0 if none)" inputId="certificate-certificatesRequested">
    <NumberInput
      id="certificate-certificatesRequested"
      label="Number of certificates (0 if none)"
      min={0}
      max={20}
      bind:value={o.certificatesRequested}
    />
  </Field>

  <Field label="Service level" inputId="certificate-serviceLevel">
    <Select id="certificate-serviceLevel" label="Service level" bind:value={o.serviceLevel}>
      <option value="">— Select —</option>
      <option value="standard">Standard</option>
      <option value="priority">Priority (next working day if ordered by 4pm)</option>
    </Select>
  </Field>

  <Field label="Delivery address" inputId="certificate-deliveryAddress">
    <TextAreaInput
      id="certificate-deliveryAddress"
      label="Delivery address"
      rows={3}
      bind:value={o.deliveryAddress}
    />
  </Field>

  <Field label="Payment by debit or credit card confirmed?" inputId="certificate-paymentConfirmed">
    <Select
      id="certificate-paymentConfirmed"
      label="Payment by debit or credit card confirmed?"
      bind:value={o.paymentConfirmed}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field label="Note to the registrar" inputId="certificate-applicantNote">
    <TextAreaInput
      id="certificate-applicantNote"
      label="Note to the registrar"
      rows={3}
      bind:value={o.applicantNote}
    />
  </Field>
</Fieldset>
