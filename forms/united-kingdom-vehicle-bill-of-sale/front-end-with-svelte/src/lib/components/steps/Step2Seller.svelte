<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { TextAreaInput, TextInput } from '@lilydesignsystem/svelte-headless';
  import Select from '#lib/components/ui/Select.svelte';

  const p = assessment.data.seller;
</script>

<Fieldset legend="Step 2 of 9 — Seller">
  <p class="hint">The person selling the vehicle.</p>

  <Field label="Seller — full name" inputId="seller-name">
    <TextInput
      id="seller-name"
      label="Seller — full name"
      placeholder="As shown on the V5C"
      bind:value={p.name}
    />
  </Field>

  <Field label="Seller — address" inputId="seller-address">
    <TextAreaInput id="seller-address" label="Seller — address" rows={3} bind:value={p.address} />
  </Field>

  <Field label="Seller — postcode" inputId="seller-postcode">
    <TextInput
      id="seller-postcode"
      label="Seller — postcode"
      placeholder="e.g. LS1 4AP"
      bind:value={p.postcode}
    />
  </Field>

  <Field label="Seller — phone" inputId="seller-phone">
    <TextInput id="seller-phone" label="Seller — phone" bind:value={p.phone} />
  </Field>

  <Field label="Seller — email" inputId="seller-email">
    <TextInput id="seller-email" label="Seller — email" bind:value={p.email} />
  </Field>

  <Field
    label="Is the seller the registered keeper named on the V5C?"
    inputId="seller-isRegisteredKeeper"
  >
    <Select
      id="seller-isRegisteredKeeper"
      label="Is the seller the registered keeper named on the V5C?"
      bind:value={p.isRegisteredKeeper}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
</Fieldset>
