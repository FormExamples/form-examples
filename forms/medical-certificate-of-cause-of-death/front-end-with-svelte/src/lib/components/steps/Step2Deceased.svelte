<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { TextInput } from '@lilydesignsystem/svelte-headless';
  import Select from '#lib/components/ui/Select.svelte';
  import DateInput from '#lib/components/ui/DateInput.svelte';
  import NumberInput from '#lib/components/ui/NumberInput.svelte';

  const p = assessment.data.deceased;
</script>

<Fieldset legend="Step 2 of 6 — Deceased identification">
  <p class="hint">Who has died, and how they are identified for registration.</p>

  <Field label="Deceased — full name" inputId="deceased-deceasedName">
    <TextInput
      id="deceased-deceasedName"
      label="Deceased — full name"
      placeholder="Full name of the deceased"
      bind:value={p.deceasedName}
    />
  </Field>

  <Field label="Sex" inputId="deceased-sex">
    <Select id="deceased-sex" label="Sex" bind:value={p.sex}>
      <option value="">— Select —</option>
      <option value="female">Female</option>
      <option value="male">Male</option>
      <option value="other">Other</option>
      <option value="unknown">Unknown</option>
    </Select>
  </Field>

  <Field label="Date of birth" inputId="deceased-dateOfBirth">
    <DateInput id="deceased-dateOfBirth" label="Date of birth" bind:value={p.dateOfBirth} />
  </Field>

  <Field label="Age at death (years)" inputId="deceased-ageYears">
    <NumberInput
      id="deceased-ageYears"
      label="Age at death (years)"
      min={0}
      max={130}
      bind:value={p.ageYears}
    />
  </Field>

  <Field label="Patient identifier (NHS number or local ID)" inputId="deceased-patientIdentifier">
    <TextInput
      id="deceased-patientIdentifier"
      label="Patient identifier (NHS number or local ID)"
      placeholder="NHS number or local identifier"
      bind:value={p.patientIdentifier}
    />
  </Field>
  <Field label="Ethnicity (self-declared)" inputId="deceased-ethnicity">
    <TextInput
      id="deceased-ethnicity"
      label="Ethnicity (self-declared)"
      placeholder="e.g. White British, or unknown"
      bind:value={p.ethnicity}
    />
  </Field>
  <p class="hint">
    Copy from the medical record. If not documented enter "unknown"; never guess or ask the
    bereaved.
  </p>

  <Field label="Pregnancy status" inputId="deceased-pregnancyStatus">
    <Select id="deceased-pregnancyStatus" label="Pregnancy status" bind:value={p.pregnancyStatus}>
      <option value="">— Select —</option>
      <option value="not-applicable">Not applicable</option>
      <option value="not-pregnant">Not pregnant in the 12 months before death</option>
      <option value="pregnant-at-death">Pregnant at the time of death</option>
      <option value="pregnant-within-12-months">Pregnant within the 12 months before death</option>
      <option value="unknown">Unknown</option>
    </Select>
  </Field>
</Fieldset>
