<script lang="ts">
  import type { Address } from '#lib/types.js';
  import Field from './Field.svelte';
  import TextInput from './TextInput.svelte';

  let { address = $bindable() }: { address: Address } = $props();
</script>

<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
  <Field label="Address line 1">
    <TextInput bind:value={address.addressLine1} placeholder="House number and street" />
  </Field>
  <Field label="Address line 2">
    <TextInput bind:value={address.addressLine2} placeholder="Locality" />
  </Field>
  <Field label="Address line 3">
    <TextInput bind:value={address.addressLine3} placeholder="Town / city" />
  </Field>
  <Field label="Postcode">
    <TextInput bind:value={address.postcode} placeholder="e.g. SW1A 1AA" />
  </Field>
  <Field label="Country">
    <TextInput bind:value={address.countryAsIso3166_1Alpha2} placeholder="GB" />
  </Field>
</div>
