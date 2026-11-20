<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { TextInput, TextAreaInput } from '@lilydesignsystem/svelte-headless';
  import Select from '#lib/components/ui/Select.svelte';
  import DateInput from '#lib/components/ui/DateInput.svelte';

  const a = assessment.data.applicant;
  const p = assessment.data.property;
</script>

<Fieldset legend="Step 2 of 5 — Applicant and property">
  <p class="hint">The person who pays the Council Tax and the property the bill is for.</p>

  <Field label="Your full name" inputId="applicant-name">
    <TextInput
      id="applicant-name"
      label="Your full name"
      placeholder="Name on the Council Tax bill"
      bind:value={a.name}
    />
  </Field>
  <Field label="Your date of birth" inputId="applicant-birthDate">
    <DateInput id="applicant-birthDate" label="Your date of birth" bind:value={a.birthDate} />
  </Field>
  <Field label="Email" inputId="applicant-email">
    <TextInput id="applicant-email" label="Email" bind:value={a.email} />
  </Field>
  <Field label="Phone" inputId="applicant-phone">
    <TextInput id="applicant-phone" label="Phone" bind:value={a.phone} />
  </Field>
  <Field label="Your own status" inputId="applicant-status">
    <Select id="applicant-status" label="Your own status" bind:value={a.status}>
      <option value="">— Select —</option>
      <option value="counted-adult">Adult (counts)</option>
      <option value="full-time-student">Full-time student</option>
      <option value="severely-mentally-impaired">Severely mentally impaired</option>
      <option value="under-18">Under 18</option>
      <option value="apprentice">Apprentice</option>
      <option value="education-18-19">Aged 18 or 19 in full-time education</option>
      <option value="live-in-carer">Live-in carer</option>
      <option value="care-leaver">Care leaver</option>
      <option value="other-disregarded">Other disregarded person</option>
    </Select>
  </Field>
  <Field label="Property address" inputId="property-addressAsFullText">
    <TextAreaInput
      id="property-addressAsFullText"
      label="Property address"
      placeholder="Address the Council Tax bill is for"
      bind:value={p.addressAsFullText}
    />
  </Field>
  <Field label="Property postcode" inputId="property-postcode">
    <TextInput
      id="property-postcode"
      label="Property postcode"
      placeholder="e.g. LS1 1UR"
      bind:value={p.postcode}
    />
  </Field>
  <Field label="Council Tax band" inputId="property-band">
    <Select id="property-band" label="Council Tax band" bind:value={p.band}>
      <option value="">— Select —</option>
      <option value="A">Band A</option>
      <option value="B">Band B</option>
      <option value="C">Band C</option>
      <option value="D">Band D</option>
      <option value="E">Band E</option>
      <option value="F">Band F</option>
      <option value="G">Band G</option>
      <option value="H">Band H</option>
    </Select>
  </Field>
  <Field label="Is this your main home?" inputId="property-mainResidence">
    <Select
      id="property-mainResidence"
      label="Is this your main home?"
      bind:value={p.mainResidence}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
  <Field label="Your role in paying the Council Tax" inputId="property-liableRole">
    <Select
      id="property-liableRole"
      label="Your role in paying the Council Tax"
      bind:value={p.liableRole}
    >
      <option value="">— Select —</option>
      <option value="owner-occupier">Owner-occupier</option>
      <option value="tenant">Tenant</option>
      <option value="landlord">Landlord</option>
      <option value="other">Other</option>
    </Select>
  </Field>
</Fieldset>
