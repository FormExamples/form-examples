<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { TextInput } from '@lilydesignsystem/svelte-headless';
  import Select from '#lib/components/ui/Select.svelte';
  import DateInput from '#lib/components/ui/DateInput.svelte';

  const funeral = assessment.data.funeral;
</script>

<Fieldset legend="Step 9 of 11 — Funeral director and disposition">
  <p class="hint">
    The funeral director or person acting as such, the method and place of disposition, and when the
    certificate was filed.
  </p>

  <Field label="Funeral director: name" inputId="funeral-funeralDirectorName">
    <TextInput
      id="funeral-funeralDirectorName"
      label="Funeral director: name"
      placeholder="Name of the funeral director"
      bind:value={funeral.funeralDirectorName}
    />
  </Field>

  <Field
    label="Funeral director: state license number"
    inputId="funeral-funeralDirectorLicenseNumber"
  >
    <TextInput
      id="funeral-funeralDirectorLicenseNumber"
      label="Funeral director: state license number"
      bind:value={funeral.funeralDirectorLicenseNumber}
    />
  </Field>

  <Field label="Method of disposition" inputId="funeral-dispositionMethod">
    <Select
      id="funeral-dispositionMethod"
      label="Method of disposition"
      bind:value={funeral.dispositionMethod}
    >
      <option value="">— Select —</option>
      <option value="burial">Burial</option>
      <option value="cremation">Cremation</option>
      <option value="entombment">Entombment</option>
      <option value="donation">Donation</option>
      <option value="removal-from-state">Removal from state</option>
      <option value="other">Other</option>
    </Select>
  </Field>

  <Field label="Date of disposition" inputId="funeral-dispositionDate">
    <DateInput
      id="funeral-dispositionDate"
      label="Date of disposition"
      bind:value={funeral.dispositionDate}
    />
  </Field>

  <Field label="Place of disposition" inputId="funeral-dispositionPlace">
    <TextInput
      id="funeral-dispositionPlace"
      label="Place of disposition"
      placeholder="Cemetery, crematory, or other place"
      bind:value={funeral.dispositionPlace}
    />
  </Field>

  <Field label="Date filed with the registrar" inputId="funeral-filedDate">
    <DateInput
      id="funeral-filedDate"
      label="Date filed with the registrar"
      bind:value={funeral.filedDate}
    />
  </Field>
</Fieldset>
