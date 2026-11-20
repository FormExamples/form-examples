<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { TextInput } from '@lilydesignsystem/svelte-headless';
  import Select from '#lib/components/ui/Select.svelte';
  import DateInput from '#lib/components/ui/DateInput.svelte';
  import NumberInput from '#lib/components/ui/NumberInput.svelte';

  const v = assessment.data.partyOne;
</script>

<Fieldset legend="Step 3 of 6 — First party">
  <p class="hint">
    Identity, residence, previous relationships and immigration evidence for the first party. At
    least 7 days in the district, and 18 or over on the ceremony date.
  </p>

  <Field label="First party — full name" inputId="partyOne-name">
    <TextInput
      id="partyOne-name"
      label="First party — full name"
      placeholder="As on identity documents"
      bind:value={v.name}
    />
  </Field>

  <Field label="Date of birth" inputId="partyOne-dateOfBirth">
    <DateInput id="partyOne-dateOfBirth" label="Date of birth" bind:value={v.dateOfBirth} />
  </Field>

  <Field label="Days lived in the registration district" inputId="partyOne-daysResidentInDistrict">
    <NumberInput
      id="partyOne-daysResidentInDistrict"
      label="Days lived in the registration district"
      min={0}
      bind:value={v.daysResidentInDistrict}
    />
  </Field>

  <Field label="Nationality or immigration route" inputId="partyOne-nationalityStatus">
    <Select
      id="partyOne-nationalityStatus"
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

  <Field label="Marital or civil partnership status" inputId="partyOne-maritalStatus">
    <Select
      id="partyOne-maritalStatus"
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

  <Field label="Original photographic identity available?" inputId="partyOne-identityProvided">
    <Select
      id="partyOne-identityProvided"
      label="Original photographic identity available?"
      bind:value={v.identityProvided}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field label="Original proof of home address available?" inputId="partyOne-addressProofProvided">
    <Select
      id="partyOne-addressProofProvided"
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
    inputId="partyOne-priorEndEvidenceProvided"
  >
    <Select
      id="partyOne-priorEndEvidenceProvided"
      label="Evidence the previous marriage or civil partnership ended?"
      bind:value={v.priorEndEvidenceProvided}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
      <option value="not-applicable">Not applicable</option>
    </Select>
  </Field>

  <Field label="Immigration evidence available?" inputId="partyOne-immigrationEvidenceProvided">
    <Select
      id="partyOne-immigrationEvidenceProvided"
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
