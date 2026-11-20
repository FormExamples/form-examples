<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { TextInput } from '@lilydesignsystem/svelte-headless';
  import Select from '#lib/components/ui/Select.svelte';
  import DateInput from '#lib/components/ui/DateInput.svelte';

  const p = assessment.data.parentage;
</script>

<Fieldset legend="Step 3 of 5 — Parentage and the second parent">
  <p class="hint">
    Whether a father or second parent is recorded, and on what basis. Unmarried parents need a
    specific route.
  </p>

  <Field label="Parents' relationship" inputId="parentage-parentsRelationship">
    <Select
      id="parentage-parentsRelationship"
      label="Parents' relationship"
      bind:value={p.parentsRelationship}
    >
      <option value="">— Select —</option>
      <option value="married-or-civil-partners"
        >Married or civil partners (at the birth or conception)</option
      >
      <option value="unmarried">Not married or civil partners (mother and father)</option>
      <option value="female-couple-married">Female couple, married or civil partners</option>
      <option value="female-couple-unmarried">Female couple, not married or civil partners</option>
      <option value="male-couple">Male couple</option>
      <option value="mother-only">Mother only (no second parent)</option>
    </Select>
  </Field>

  <Field label="Date of marriage or civil partnership" inputId="parentage-marriageDate">
    <DateInput
      id="parentage-marriageDate"
      label="Date of marriage or civil partnership"
      bind:value={p.marriageDate}
    />
  </Field>

  <Field
    label="Record a second parent (father or female parent)?"
    inputId="parentage-secondParentIncluded"
  >
    <Select
      id="parentage-secondParentIncluded"
      label="Record a second parent (father or female parent)?"
      bind:value={p.secondParentIncluded}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field label="Second parent's full name" inputId="parentage-secondParentName">
    <TextInput
      id="parentage-secondParentName"
      label="Second parent's full name"
      bind:value={p.secondParentName}
    />
  </Field>

  <Field label="Second parent's date of birth" inputId="parentage-secondParentDateOfBirth">
    <DateInput
      id="parentage-secondParentDateOfBirth"
      label="Second parent's date of birth"
      bind:value={p.secondParentDateOfBirth}
    />
  </Field>

  <Field label="Second parent's place of birth" inputId="parentage-secondParentPlaceOfBirth">
    <TextInput
      id="parentage-secondParentPlaceOfBirth"
      label="Second parent's place of birth"
      placeholder="Town and country"
      bind:value={p.secondParentPlaceOfBirth}
    />
  </Field>

  <Field label="Second parent's occupation" inputId="parentage-secondParentOccupation">
    <TextInput
      id="parentage-secondParentOccupation"
      label="Second parent's occupation"
      bind:value={p.secondParentOccupation}
    />
  </Field>

  <Field label="Basis for recording the second parent" inputId="parentage-paternityBasis">
    <Select
      id="parentage-paternityBasis"
      label="Basis for recording the second parent"
      bind:value={p.paternityBasis}
    >
      <option value="">— Select —</option>
      <option value="married-or-civil-partners">Parents married or civil partners</option>
      <option value="joint-registration">Both parents register together</option>
      <option value="statutory-declaration">Signed statutory declaration of parentage</option>
      <option value="court-order-parental-responsibility"
        >Court document giving parental responsibility</option
      >
      <option value="parental-order">Parental order from the court</option>
      <option value="none">None</option>
    </Select>
  </Field>

  <Field
    label="Is the signed form or court document in hand?"
    inputId="parentage-paternityEvidenceHeld"
  >
    <Select
      id="parentage-paternityEvidenceHeld"
      label="Is the signed form or court document in hand?"
      bind:value={p.paternityEvidenceHeld}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field
    label="Female couple not married: treated together at a UK licensed clinic?"
    inputId="parentage-licensedClinicTreatment"
  >
    <Select
      id="parentage-licensedClinicTreatment"
      label="Female couple not married: treated together at a UK licensed clinic?"
      bind:value={p.licensedClinicTreatment}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
</Fieldset>
