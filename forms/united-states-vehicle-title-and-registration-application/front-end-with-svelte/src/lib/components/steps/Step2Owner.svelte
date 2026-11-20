<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { TextAreaInput, TextInput } from '@lilydesignsystem/svelte-headless';
  import Select from '#lib/components/ui/Select.svelte';

  const s = assessment.data.owner;
</script>

<Fieldset legend="Step 2 of 8 — Owner identification">
  <p class="hint">Who will be named on the title, how they are identified, and who has signed.</p>

  <Field label="Owner type" inputId="owner-ownerType">
    <Select id="owner-ownerType" label="Owner type" bind:value={s.ownerType}>
      <option value="">— Select —</option>
      <option value="individual">Individual</option>
      <option value="business">Business or organization</option>
    </Select>
  </Field>

  <Field label="Owner — full legal name" inputId="owner-ownerName">
    <TextInput
      id="owner-ownerName"
      label="Owner — full legal name"
      placeholder="As shown on the identification"
      bind:value={s.ownerName}
    />
  </Field>

  <Field label="Co-owner — full legal name (if any)" inputId="owner-coOwnerName">
    <TextInput
      id="owner-coOwnerName"
      label="Co-owner — full legal name (if any)"
      bind:value={s.coOwnerName}
    />
  </Field>

  <Field
    label="AND or OR between the owners"
    inputId="owner-coOwnerConjunction"
    description="Required when there is a co-owner; it controls who may sell and survivorship."
  >
    <Select
      id="owner-coOwnerConjunction"
      label="AND or OR between the owners"
      bind:value={s.coOwnerConjunction}
    >
      <option value="">— Select —</option>
      <option value="and">AND (both owners must sign to sell)</option>
      <option value="or">OR (either owner may sign to sell)</option>
    </Select>
  </Field>

  <Field label="Identification type" inputId="owner-identificationType">
    <Select
      id="owner-identificationType"
      label="Identification type"
      bind:value={s.identificationType}
    >
      <option value="">— Select —</option>
      <option value="drivers-license">Driver license number</option>
      <option value="state-id">State identification card number</option>
      <option value="passport">Passport number</option>
      <option value="fein">Federal employer identification number (FEIN)</option>
      <option value="other">Other</option>
    </Select>
  </Field>

  <Field label="Identification number" inputId="owner-identificationNumber">
    <TextInput
      id="owner-identificationNumber"
      label="Identification number"
      bind:value={s.identificationNumber}
    />
  </Field>

  <Field label="Mailing address" inputId="owner-mailingAddress">
    <TextAreaInput
      id="owner-mailingAddress"
      label="Mailing address"
      rows={3}
      bind:value={s.mailingAddress}
    />
  </Field>

  <Field label="Owner has signed the application?" inputId="owner-ownerSigned">
    <Select
      id="owner-ownerSigned"
      label="Owner has signed the application?"
      bind:value={s.ownerSigned}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field label="Co-owner has signed the application?" inputId="owner-coOwnerSigned">
    <Select
      id="owner-coOwnerSigned"
      label="Co-owner has signed the application?"
      bind:value={s.coOwnerSigned}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
</Fieldset>
