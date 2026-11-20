<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { TextAreaInput, TextInput } from '@lilydesignsystem/svelte-headless';
  import Select from '#lib/components/ui/Select.svelte';

  const p = assessment.data.parties;
</script>

<Fieldset legend="Step 4 of 7 — The parties and service address">
  <p class="hint">
    Full names and addresses. For a sole application the court must be able to serve the papers on
    your spouse.
  </p>

  <Field label="Your full name" inputId="parties-applicantName">
    <TextInput id="parties-applicantName" label="Your full name" bind:value={p.applicantName} />
  </Field>
  <p class="hint">As on the marriage certificate.</p>

  <Field label="Your address" inputId="parties-applicantAddress">
    <TextAreaInput
      id="parties-applicantAddress"
      label="Your address"
      rows={3}
      bind:value={p.applicantAddress}
    />
  </Field>

  <Field label="Your email address" inputId="parties-applicantEmail">
    <TextInput
      id="parties-applicantEmail"
      label="Your email address"
      bind:value={p.applicantEmail}
    />
  </Field>

  <Field label="Spouse or civil partner - full name" inputId="parties-respondentName">
    <TextInput
      id="parties-respondentName"
      label="Spouse or civil partner - full name"
      bind:value={p.respondentName}
    />
  </Field>

  <Field
    label="Do you know your spouse’s current address?"
    inputId="parties-respondentAddressKnown"
  >
    <Select
      id="parties-respondentAddressKnown"
      label="Do you know your spouse’s current address?"
      bind:value={p.respondentAddressKnown}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field
    label="Spouse or civil partner - address (service address)"
    inputId="parties-respondentAddress"
  >
    <TextAreaInput
      id="parties-respondentAddress"
      label="Spouse or civil partner - address (service address)"
      rows={3}
      bind:value={p.respondentAddress}
    />
  </Field>

  <Field label="Spouse or civil partner - email address" inputId="parties-respondentEmail">
    <TextInput
      id="parties-respondentEmail"
      label="Spouse or civil partner - email address"
      bind:value={p.respondentEmail}
    />
  </Field>
  <p class="hint">If given, the papers are sent online; otherwise by post.</p>

  <Field label="How will the application be served?" inputId="parties-serviceMethod">
    <Select
      id="parties-serviceMethod"
      label="How will the application be served?"
      bind:value={p.serviceMethod}
    >
      <option value="">— Select —</option>
      <option value="email">By email</option>
      <option value="post">By post</option>
      <option value="alternative-service">Alternative service (court order needed)</option>
    </Select>
  </Field>
</Fieldset>
