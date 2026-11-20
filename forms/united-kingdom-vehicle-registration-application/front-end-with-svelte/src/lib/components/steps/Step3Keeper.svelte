<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { TextInput } from '@lilydesignsystem/svelte-headless';
  import Select from '#lib/components/ui/Select.svelte';

  const k = assessment.data.keeper;
</script>

<Fieldset legend="Step 3 of 7 — Registered keeper and owner">
  <p class="hint">
    The keeper is the person or organization responsible for the vehicle; the owner may be someone
    else.
  </p>

  <Field label="Registered keeper name" inputId="keeper-keeperName">
    <TextInput id="keeper-keeperName" label="Registered keeper name" bind:value={k.keeperName} />
  </Field>

  <Field label="Keeper type" inputId="keeper-keeperType">
    <Select id="keeper-keeperType" label="Keeper type" bind:value={k.keeperType}>
      <option value="">— Select —</option>
      <option value="individual">Individual</option>
      <option value="company">Company</option>
      <option value="organization">Organization</option>
      <option value="trade">Motor trade</option>
      <option value="other">Other</option>
    </Select>
  </Field>

  {#if k.keeperType === 'company'}
    <Field label="Companies House registration number" inputId="keeper-companyRegistrationNumber">
      <TextInput
        id="keeper-companyRegistrationNumber"
        label="Companies House registration number"
        bind:value={k.companyRegistrationNumber}
      />
    </Field>
  {/if}

  <Field label="Is the owner different from the keeper?" inputId="keeper-ownerDiffersFromKeeper">
    <Select
      id="keeper-ownerDiffersFromKeeper"
      label="Is the owner different from the keeper?"
      bind:value={k.ownerDiffersFromKeeper}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  {#if k.ownerDiffersFromKeeper === 'yes'}
    <Field label="Owner name" inputId="keeper-ownerName">
      <TextInput id="keeper-ownerName" label="Owner name" bind:value={k.ownerName} />
    </Field>
  {/if}

  <Field
    label="Is the keeper address in Northern Ireland?"
    inputId="keeper-keeperAddressInNorthernIreland"
  >
    <Select
      id="keeper-keeperAddressInNorthernIreland"
      label="Is the keeper address in Northern Ireland?"
      bind:value={k.keeperAddressInNorthernIreland}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
  <p class="hint">
    A Northern Ireland address needs an insurance certificate, and the MOT threshold is 4 years.
  </p>
</Fieldset>
