<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { TextAreaInput, TextInput } from '@lilydesignsystem/svelte-headless';
  import Select from '#lib/components/ui/Select.svelte';
  import DateInput from '#lib/components/ui/DateInput.svelte';

  const a = assessment.data.applicant;
</script>

<Fieldset legend="Step 2 of 7 — Applicant">
  <p class="hint">
    The person making the application, and the documents that prove who they are and where they
    live.
  </p>

  <Field label="Applicant full name" inputId="applicant-name">
    <TextInput id="applicant-name" label="Applicant full name" bind:value={a.name} />
  </Field>

  <Field label="Date of birth" inputId="applicant-birthDate">
    <DateInput id="applicant-birthDate" label="Date of birth" bind:value={a.birthDate} />
  </Field>

  <Field label="Address" inputId="applicant-postalAddressAsFullText">
    <TextAreaInput
      id="applicant-postalAddressAsFullText"
      label="Address"
      rows={3}
      bind:value={a.postalAddressAsFullText}
    />
  </Field>

  <Field label="Postcode" inputId="applicant-postcode">
    <TextInput id="applicant-postcode" label="Postcode" bind:value={a.postcode} />
  </Field>

  <Field label="Email" inputId="applicant-email">
    <TextInput id="applicant-email" label="Email" bind:value={a.email} />
  </Field>

  <Field label="Phone" inputId="applicant-phone">
    <TextInput id="applicant-phone" label="Phone" bind:value={a.phone} />
  </Field>

  <Field label="Driving licence number" inputId="applicant-drivingLicenceNumber">
    <TextInput
      id="applicant-drivingLicenceNumber"
      label="Driving licence number"
      bind:value={a.drivingLicenceNumber}
    />
  </Field>
  <p class="hint">The 16-character number on a Great Britain photocard licence, if you have one.</p>

  <Field label="Proof of identity enclosed" inputId="applicant-identityDocumentType">
    <Select
      id="applicant-identityDocumentType"
      label="Proof of identity enclosed"
      bind:value={a.identityDocumentType}
    >
      <option value="">— Select —</option>
      <option value="photocard-driving-licence">Photocard driving licence (photocopy)</option>
      <option value="passport">Passport</option>
      <option value="other-name-document">Other document proving name</option>
      <option value="none">None supplied</option>
    </Select>
  </Field>
  <p class="hint">
    A photocopy of a photocard driving licence, or a copy of one document proving your name plus one
    proving your address.
  </p>

  <Field label="Proof of address enclosed" inputId="applicant-addressDocumentType">
    <Select
      id="applicant-addressDocumentType"
      label="Proof of address enclosed"
      bind:value={a.addressDocumentType}
    >
      <option value="">— Select —</option>
      <option value="photocard-driving-licence">Photocard driving licence (photocopy)</option>
      <option value="utility-bill">Recent utility bill</option>
      <option value="bank-statement">Bank or building society statement</option>
      <option value="council-tax-bill">Council tax bill</option>
      <option value="none">None supplied</option>
    </Select>
  </Field>
</Fieldset>
