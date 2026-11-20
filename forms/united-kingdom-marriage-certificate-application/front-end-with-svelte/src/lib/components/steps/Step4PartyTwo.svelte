<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { TextInput } from '@lilydesignsystem/svelte-headless';
  import Select from '#lib/components/ui/Select.svelte';
  import DateInput from '#lib/components/ui/DateInput.svelte';
  import NumberInput from '#lib/components/ui/NumberInput.svelte';

  const v = assessment.data.partyTwo;
</script>

<Fieldset legend="Step 4 of 6 — Second party">
  <p class="hint">
    Identity, residence, previous relationships and immigration evidence for the second party. At
    least 7 days in the district, and 18 or over on the ceremony date.
  </p>

  <Field label="Second party — full name" inputId="partyTwo-name">
    <TextInput
      id="partyTwo-name"
      label="Second party — full name"
      placeholder="As on identity documents"
      bind:value={v.name}
    />
  </Field>

  <Field label="Date of birth" inputId="partyTwo-dateOfBirth">
    <DateInput id="partyTwo-dateOfBirth" label="Date of birth" bind:value={v.dateOfBirth} />
  </Field>

  <Field label="Days lived in the registration district" inputId="partyTwo-daysResidentInDistrict">
    <NumberInput
      id="partyTwo-daysResidentInDistrict"
      label="Days lived in the registration district"
      min={0}
      bind:value={v.daysResidentInDistrict}
    />
  </Field>

  <Field label="Nationality or immigration route" inputId="partyTwo-nationalityStatus">
    <Select
      id="partyTwo-nationalityStatus"
      label="Nationality or immigration route"
      bind:value={v.nationalityStatus}
    >
      <option value="">— Select —</option>
      <option value="british-or-irish">British or Irish citizen</option>
      <option value="eu-settlement-scheme"
        >EU Settlement Scheme (settled or pre-settled status)</option
      >
      <option value="other">Other (from outside the UK and Ireland)</option>
    </Select>
  </Field>

  <Field label="Marital or civil partnership status" inputId="partyTwo-maritalStatus">
    <Select
      id="partyTwo-maritalStatus"
      label="Marital or civil partnership status"
      bind:value={v.maritalStatus}
    >
      <option value="">— Select —</option>
      <option value="never-married">Never married or in a civil partnership</option>
      <option value="divorced">Divorced</option>
      <option value="widowed">Widowed</option>
      <option value="dissolved-civil-partnership">Civil partnership dissolved</option>
      <option value="annulled">Marriage or civil partnership annulled</option>
      <option value="currently-married-or-civil-partnered"
        >Currently married or in a civil partnership</option
      >
    </Select>
  </Field>

  <Field label="Original photographic identity available?" inputId="partyTwo-identityProvided">
    <Select
      id="partyTwo-identityProvided"
      label="Original photographic identity available?"
      bind:value={v.identityProvided}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field label="Original proof of home address available?" inputId="partyTwo-addressProofProvided">
    <Select
      id="partyTwo-addressProofProvided"
      label="Original proof of home address available?"
      bind:value={v.addressProofProvided}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field
    label="Evidence the previous marriage or civil partnership ended?"
    inputId="partyTwo-priorEndEvidenceProvided"
  >
    <Select
      id="partyTwo-priorEndEvidenceProvided"
      label="Evidence the previous marriage or civil partnership ended?"
      bind:value={v.priorEndEvidenceProvided}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
      <option value="not-applicable">Not applicable</option>
    </Select>
  </Field>

  <Field label="Immigration evidence available?" inputId="partyTwo-immigrationEvidenceProvided">
    <Select
      id="partyTwo-immigrationEvidenceProvided"
      label="Immigration evidence available?"
      bind:value={v.immigrationEvidenceProvided}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
      <option value="not-applicable">Not applicable</option>
    </Select>
  </Field>
</Fieldset>
