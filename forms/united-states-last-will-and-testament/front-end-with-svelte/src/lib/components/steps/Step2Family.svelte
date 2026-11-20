<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { TextInput } from '@lilydesignsystem/svelte-headless';
  import Select from '#lib/components/ui/Select.svelte';
  import NumberInput from '#lib/components/ui/NumberInput.svelte';

  const p = assessment.data.family;
</script>

<Fieldset legend="Step 2 of 6 — Family and spouse">
  <p class="hint">
    A surviving spouse may have a right to elect against the will (the elective share), except in
    community property states, where the spouse already owns half of community property.
  </p>

  <Field label="Spouse — name" inputId="family-spouseName">
    <TextInput
      id="family-spouseName"
      label="Spouse — name"
      placeholder="Required if married"
      bind:value={p.spouseName}
    />
  </Field>

  <Field label="Value left to the spouse (US dollars)" inputId="family-spouseInheritanceValue">
    <NumberInput
      id="family-spouseInheritanceValue"
      label="Value left to the spouse (US dollars)"
      min={0}
      step={1000}
      bind:value={p.spouseInheritanceValue}
    />
  </Field>

  <Field
    label="Has the spouse waived the elective share in writing?"
    inputId="family-spouseWaivedElectiveShare"
  >
    <Select
      id="family-spouseWaivedElectiveShare"
      label="Has the spouse waived the elective share in writing?"
      bind:value={p.spouseWaivedElectiveShare}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field label="Does the testator have minor children?" inputId="family-hasMinorChildren">
    <Select
      id="family-hasMinorChildren"
      label="Does the testator have minor children?"
      bind:value={p.hasMinorChildren}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field label="Guardian for minor children — name" inputId="family-guardianForMinorsName">
    <TextInput
      id="family-guardianForMinorsName"
      label="Guardian for minor children — name"
      placeholder="Nominated guardian"
      bind:value={p.guardianForMinorsName}
    />
  </Field>

  <Field label="Does the will leave a child out?" inputId="family-disinheritsChild">
    <Select
      id="family-disinheritsChild"
      label="Does the will leave a child out?"
      bind:value={p.disinheritsChild}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field label="Is the omitted child named in the will?" inputId="family-disinheritedChildNamed">
    <Select
      id="family-disinheritedChildNamed"
      label="Is the omitted child named in the will?"
      bind:value={p.disinheritedChildNamed}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
</Fieldset>
