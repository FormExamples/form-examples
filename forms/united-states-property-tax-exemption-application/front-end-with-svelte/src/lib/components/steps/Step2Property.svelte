<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { TextAreaInput, TextInput } from '@lilydesignsystem/svelte-headless';
  import Select from '#lib/components/ui/Select.svelte';
  import DateInput from '#lib/components/ui/DateInput.svelte';

  const s = assessment.data.property;
</script>

<Fieldset legend="Step 2 of 8 — Property and occupancy">
  <p class="hint">
    The parcel, how you hold title, and your ownership and occupancy as of the assessment date.
  </p>

  <Field label="State" inputId="property-state">
    <Select id="property-state" label="State" bind:value={s.state}>
      <option value="">— Select —</option>
      <option value="CA">CA - California</option>
      <option value="NY">NY - New York</option>
      <option value="TX">TX - Texas</option>
      <option value="FL">FL - Florida</option>
      <option value="IL">IL - Illinois</option>
      <option value="PA">PA - Pennsylvania</option>
      <option value="OH">OH - Ohio</option>
      <option value="WA">WA - Washington</option>
    </Select>
  </Field>
  <p class="hint">
    The state selects the rule set. States outside the list use a default rule and raise a verify
    flag.
  </p>

  <Field label="County" inputId="property-county">
    <TextInput id="property-county" label="County" bind:value={s.county} />
  </Field>

  <Field label="Parcel number (APN or account number)" inputId="property-parcelNumber">
    <TextInput
      id="property-parcelNumber"
      label="Parcel number (APN or account number)"
      bind:value={s.parcelNumber}
    />
  </Field>

  <Field label="Property address" inputId="property-propertyAddress">
    <TextAreaInput
      id="property-propertyAddress"
      label="Property address"
      rows={2}
      bind:value={s.propertyAddress}
    />
  </Field>

  <Field label="Property type" inputId="property-propertyType">
    <Select id="property-propertyType" label="Property type" bind:value={s.propertyType}>
      <option value="">— Select —</option>
      <option value="single-family">Single-family home</option>
      <option value="condominium">Condominium</option>
      <option value="manufactured-home">Manufactured home</option>
      <option value="multi-unit">Multi-unit building</option>
      <option value="other">Other</option>
    </Select>
  </Field>

  <Field label="How you hold title" inputId="property-ownershipType">
    <Select id="property-ownershipType" label="How you hold title" bind:value={s.ownershipType}>
      <option value="">— Select —</option>
      <option value="sole">Sole owner</option>
      <option value="joint">Joint owners</option>
      <option value="trust">Held in a trust</option>
      <option value="life-estate">Life estate</option>
      <option value="contract-buyer">Contract buyer</option>
      <option value="other">Other</option>
    </Select>
  </Field>

  <Field
    label="Did you own the property on the assessment date?"
    inputId="property-ownerOnAssessmentDate"
  >
    <Select
      id="property-ownerOnAssessmentDate"
      label="Did you own the property on the assessment date?"
      bind:value={s.ownerOnAssessmentDate}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field
    label="Was it your primary residence on the assessment date?"
    inputId="property-occupiedAsPrimaryResidence"
  >
    <Select
      id="property-occupiedAsPrimaryResidence"
      label="Was it your primary residence on the assessment date?"
      bind:value={s.occupiedAsPrimaryResidence}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field
    label="Date you began living there as your primary residence"
    inputId="property-occupancyStartDate"
  >
    <DateInput
      id="property-occupancyStartDate"
      label="Date you began living there as your primary residence"
      bind:value={s.occupancyStartDate}
    />
  </Field>

  <Field
    label="Do you claim a homestead exemption on any other property?"
    inputId="property-otherHomesteadClaimed"
  >
    <Select
      id="property-otherHomesteadClaimed"
      label="Do you claim a homestead exemption on any other property?"
      bind:value={s.otherHomesteadClaimed}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
  <p class="hint">Only one primary residence may carry a homestead exemption.</p>
</Fieldset>
