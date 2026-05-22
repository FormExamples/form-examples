<script lang="ts">
  import type { Person } from '$lib/types.js';
  import Field from './Field.svelte';
  import TextInput from './TextInput.svelte';
  import DateInput from './DateInput.svelte';
  import CheckboxField from './CheckboxField.svelte';
  import AddressInput from './AddressInput.svelte';

  let {
    person = $bindable(),
    showTrustCorporation = false,
    showBankruptcyFlags = false,
    showEmail = true,
  }: {
    person: Person;
    showTrustCorporation?: boolean;
    showBankruptcyFlags?: boolean;
    showEmail?: boolean;
  } = $props();
</script>

<div class="border border-slate-200 rounded p-3 bg-slate-50/50 space-y-3">
  <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
    <Field label="Title">
      <TextInput bind:value={person.title} placeholder="Mr / Mrs / Mx / Dr" />
    </Field>
    <Field label="First names">
      <TextInput bind:value={person.firstNames} />
    </Field>
    <Field label="Last name">
      <TextInput bind:value={person.lastName} />
    </Field>
    <Field label="Other names known by">
      <TextInput bind:value={person.otherNames} />
    </Field>
    <Field label="Date of birth">
      <DateInput bind:value={person.dateOfBirth} />
    </Field>
    {#if showEmail}
      <Field label="Email">
        <TextInput type="email" bind:value={person.email} />
      </Field>
    {/if}
    <Field label="Phone">
      <TextInput type="tel" bind:value={person.phone} />
    </Field>
  </div>
  <AddressInput bind:address={person.address} />
  {#if showTrustCorporation}
    <CheckboxField label="This attorney is a trust corporation" bind:checked={person.isTrustCorporation} />
    {#if person.isTrustCorporation}
      <Field label="Trust corporation number">
        <TextInput bind:value={person.trustCorporationNumber} />
      </Field>
    {/if}
  {/if}
  {#if showBankruptcyFlags}
    <div class="space-y-1">
      <CheckboxField label="Currently bankrupt" bind:checked={person.isBankrupt} />
      <CheckboxField label="Subject to a debt relief order" bind:checked={person.hasDebtReliefOrder} />
    </div>
  {/if}
</div>
