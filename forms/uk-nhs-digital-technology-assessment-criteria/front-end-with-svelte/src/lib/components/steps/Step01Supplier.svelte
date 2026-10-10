<script lang="ts">
  import { store } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { TextAreaInput, TextInput } from '@lilydesignsystem/svelte-headless';
</script>

<Fieldset legend="Step 1 — Supplier">
  <div class="field-grid">
    <Field label="Supplier name" inputId="step-1-supplier-name" error={store.errors['step-1-supplier-name']}>
      <TextInput
        id="step-1-supplier-name"
        label="Supplier name"
        bind:value={store.data.supplier.name}
        aria-invalid={store.errors['step-1-supplier-name'] ? 'true' : undefined}
      />
    </Field>
    <Field label="Trading name">
      <TextInput label="Trading name" bind:value={store.data.supplier.tradingName} />
    </Field>
    <Field label="Company registration number">
      <TextInput label="Company registration number" bind:value={store.data.supplier.companyRegistrationNumber} />
    </Field>
    <Field label="Country of registration">
      <TextInput label="Country of registration" bind:value={store.data.supplier.countryOfRegistration} />
    </Field>
    <Field label="ICO registration number">
      <TextInput label="ICO registration number" bind:value={store.data.supplier.icoRegistrationNumber} />
    </Field>
    <Field label="Website">
      <TextInput label="Website" bind:value={store.data.supplier.website} />
    </Field>
    <Field label="Postal address" class="field-span-2">
      <TextAreaInput label="Postal address" rows={2} bind:value={store.data.supplier.postalAddress} />
    </Field>
    <Field label="Postcode">
      <TextInput label="Postcode" bind:value={store.data.supplier.postcode} />
    </Field>
    <Field label="Contact name">
      <TextInput label="Contact name" bind:value={store.data.supplier.contactName} />
    </Field>
    <Field label="Contact email">
      <TextInput label="Contact email" bind:value={store.data.supplier.contactEmail} />
    </Field>
    <Field label="Contact phone">
      <TextInput label="Contact phone" bind:value={store.data.supplier.contactPhone} />
    </Field>
  </div>
</Fieldset>
