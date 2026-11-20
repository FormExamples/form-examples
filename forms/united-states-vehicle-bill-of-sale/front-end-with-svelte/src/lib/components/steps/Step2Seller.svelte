<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { TextInput } from '@lilydesignsystem/svelte-headless';
  import Select from '#lib/components/ui/Select.svelte';
  import { STATE_OPTIONS } from '#lib/config/states.js';

  const p = assessment.data.seller;
</script>

<Fieldset legend="Step 2 of 7 — Seller (transferor)">
  <p class="hint">Who is selling the vehicle: printed name, current address, and signature.</p>

  <Field label="Seller printed name" inputId="seller-name">
    <TextInput
      id="seller-name"
      label="Seller printed name"
      placeholder="Full legal name"
      bind:value={p.name}
    />
  </Field>

  <Field label="Seller is" inputId="seller-type">
    <Select id="seller-type" label="Seller is" bind:value={p.type}>
      <option value="">— Select —</option>
      <option value="individual">Individual</option>
      <option value="business">Business</option>
    </Select>
  </Field>

  <Field label="Seller street address" inputId="seller-streetAddress">
    <TextInput
      id="seller-streetAddress"
      label="Seller street address"
      bind:value={p.streetAddress}
    />
  </Field>
  <p class="hint">The current address is required on the federal odometer disclosure.</p>

  <Field label="Seller city" inputId="seller-city">
    <TextInput id="seller-city" label="Seller city" bind:value={p.city} />
  </Field>

  <Field label="Seller state" inputId="seller-state">
    <Select id="seller-state" label="Seller state" bind:value={p.state}>
      <option value="">— Select —</option>
      {#each STATE_OPTIONS as o (o.value)}
        <option value={o.value}>{o.label}</option>
      {/each}
    </Select>
  </Field>

  <Field label="Seller ZIP code" inputId="seller-postalCode">
    <TextInput
      id="seller-postalCode"
      label="Seller ZIP code"
      placeholder="12345 or 12345-6789"
      bind:value={p.postalCode}
    />
  </Field>

  <Field label="Seller telephone" inputId="seller-phone">
    <TextInput id="seller-phone" label="Seller telephone" bind:value={p.phone} />
  </Field>

  <Field label="Seller has signed the bill of sale?" inputId="seller-signed">
    <Select id="seller-signed" label="Seller has signed the bill of sale?" bind:value={p.signed}>
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
</Fieldset>
