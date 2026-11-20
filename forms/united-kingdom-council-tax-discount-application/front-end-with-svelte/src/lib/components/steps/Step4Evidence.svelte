<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { TextAreaInput } from '@lilydesignsystem/svelte-headless';
  import Select from '#lib/components/ui/Select.svelte';
  import NumberInput from '#lib/components/ui/NumberInput.svelte';

  const e = assessment.data.evidence;
</script>

<Fieldset legend="Step 4 of 5 — Evidence">
  <p class="hint">
    Answer the questions for the claim you chose. The council may ask for the documents themselves.
  </p>

  <Field
    label="Severe mental impairment: certificate from a registered medical practitioner held?"
    inputId="evidence-smiCertificate"
  >
    <Select
      id="evidence-smiCertificate"
      label="Severe mental impairment: certificate from a registered medical practitioner held?"
      bind:value={e.smiCertificate}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
  <Field
    label="Severe mental impairment: does the person receive a qualifying benefit?"
    inputId="evidence-qualifyingBenefit"
  >
    <Select
      id="evidence-qualifyingBenefit"
      label="Severe mental impairment: does the person receive a qualifying benefit?"
      bind:value={e.qualifyingBenefit}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
  <Field
    label="Students: certificate from the course provider held?"
    inputId="evidence-studentCertificate"
  >
    <Select
      id="evidence-studentCertificate"
      label="Students: certificate from the course provider held?"
      bind:value={e.studentCertificate}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
  <Field label="Student course length (months)" inputId="evidence-studentCourseMonths">
    <NumberInput
      id="evidence-studentCourseMonths"
      label="Student course length (months)"
      min={0}
      max={120}
      bind:value={e.studentCourseMonths}
    />
  </Field>
  <Field label="Student study hours a week" inputId="evidence-studentHoursPerWeek">
    <NumberInput
      id="evidence-studentHoursPerWeek"
      label="Student study hours a week"
      min={0}
      max={80}
      bind:value={e.studentHoursPerWeek}
    />
  </Field>
  <Field
    label="Disabled band reduction: which adaptation or extra space applies?"
    inputId="evidence-disabilityAdaptation"
  >
    <Select
      id="evidence-disabilityAdaptation"
      label="Disabled band reduction: which adaptation or extra space applies?"
      bind:value={e.disabilityAdaptation}
    >
      <option value="">— Select —</option>
      <option value="extra-bathroom">Extra bathroom</option>
      <option value="extra-kitchen">Extra kitchen</option>
      <option value="extra-room">Extra room needed by the disabled person</option>
      <option value="wheelchair-space">Extra indoor space for a wheelchair</option>
      <option value="none">No qualifying adaptation</option>
    </Select>
  </Field>
  <Field
    label="Disabled band reduction: is this the main home of a disabled person?"
    inputId="evidence-disabledPersonMainHome"
  >
    <Select
      id="evidence-disabledPersonMainHome"
      label="Disabled band reduction: is this the main home of a disabled person?"
      bind:value={e.disabledPersonMainHome}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
  <Field label="Apprentices: employer declaration held?" inputId="evidence-apprenticeDeclaration">
    <Select
      id="evidence-apprenticeDeclaration"
      label="Apprentices: employer declaration held?"
      bind:value={e.apprenticeDeclaration}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
  <Field
    label="Care leavers: proof from the local authority that looked after you held?"
    inputId="evidence-careLeaverProof"
  >
    <Select
      id="evidence-careLeaverProof"
      label="Care leavers: proof from the local authority that looked after you held?"
      bind:value={e.careLeaverProof}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
  <Field label="Care leaver age (years)" inputId="evidence-careLeaverAgeYears">
    <NumberInput
      id="evidence-careLeaverAgeYears"
      label="Care leaver age (years)"
      min={0}
      max={120}
      bind:value={e.careLeaverAgeYears}
    />
  </Field>
  <Field label="Supporting documents" inputId="evidence-notes">
    <TextAreaInput
      id="evidence-notes"
      label="Supporting documents"
      placeholder="List the documents you will send."
      bind:value={e.notes}
    />
  </Field>
</Fieldset>
