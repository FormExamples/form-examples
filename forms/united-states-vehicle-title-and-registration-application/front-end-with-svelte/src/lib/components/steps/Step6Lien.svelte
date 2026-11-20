<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { TextInput } from '@lilydesignsystem/svelte-headless';
  import Select from '#lib/components/ui/Select.svelte';

  const s = assessment.data.lien;
</script>

<Fieldset legend="Step 6 of 8 — Lienholder">
  <p class="hint">
    Whether anyone holds a security interest in the vehicle, and whether an existing lien has been
    released.
  </p>

  <Field label="Lien status" inputId="lien-lienStatus">
    <Select id="lien-lienStatus" label="Lien status" bind:value={s.lienStatus}>
      <option value="">— Select —</option>
      <option value="none">No lien</option>
      <option value="new-lien">New lien on this purchase (financed)</option>
      <option value="existing-lien-released">Existing lien, released</option>
      <option value="existing-lien-unreleased">Existing lien, not yet released</option>
    </Select>
  </Field>

  <Field
    label="Lienholder name"
    inputId="lien-lienholderName"
    description="Required for a new lien: the bank or finance company exactly as it should print on the title."
  >
    <TextInput id="lien-lienholderName" label="Lienholder name" bind:value={s.lienholderName} />
  </Field>

  <Field label="Electronic lien and title?" inputId="lien-lienElectronic">
    <Select
      id="lien-lienElectronic"
      label="Electronic lien and title?"
      bind:value={s.lienElectronic}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
</Fieldset>
