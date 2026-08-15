<script lang="ts">
  import Field from '#lib/components/ui/Field.svelte';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import NumberInput from '#lib/components/ui/NumberInput.svelte';
  import Select from '#lib/components/ui/Select.svelte';
  import TextInput from '#lib/components/ui/TextInput.svelte';

  import { store } from '#lib/stores/assessment.svelte.js';

  const a = store.data.airwayExamProforma;
  const v = store.data.vitalsProforma;
  const g = store.data.generalExaminationProforma;

  const airwayItems = [
    ['mouthOpening', 'Mouth opening'],
    ['looseTeeth', 'Loose teeth'],
    ['dentureMissing', 'Denture missing'],
    ['micrognathia', 'Micrognathia'],
    ['tmDistanceOver65', 'T-M distance (> 6.5)'],
    ['moDistance', 'M-O distance'],
    ['tmJoint', 'TM joint'],
    ['shortNeckRom', 'Short neck / neck RoM'],
    ['difficultAirway', 'Difficult airway'],
    ['obesityScoring', 'Obesity scoring'],
    ['spineBack', 'Spine & back'],
    ['scoliosis', 'Scoliosis'],
    ['vitalsExamination', 'Vitals examination'],
  ] as const;

  const generalExamItems = [
    ['pallor', 'Pallor'],
    ['icterus', 'Icterus'],
    ['cyanosis', 'Cyanosis'],
    ['clubbing', 'Clubbing'],
    ['koilonychia', 'Koilonychia'],
    ['lymphadenopathy', 'Lymphadenopathy'],
    ['edema', 'Edema'],
    ['jvp', 'JVP'],
  ] as const;
</script>

<Fieldset legend="Step 19 — Airway, vitals and general examination">
  <h3 class="step-subhead">Airway</h3>
  <div class="field-grid field-grid-3">
    {#each airwayItems as [key, label]}
      <label class="checkbox-label"><input type="checkbox" class="checkbox-input" bind:checked={a[key]} /> {label}</label>
    {/each}
  </div>
  <Field label="MP grade" inputId="mpGrade">
    <Select id="mpGrade" label="MP grade" bind:value={a.mpGrade}>
      <option value="">-- Select --</option>
      <option value="1">Class 1</option>
      <option value="2">Class 2</option>
      <option value="3">Class 3</option>
      <option value="4">Class 4</option>
    </Select>
  </Field>

  <h3 class="step-subhead">Vitals</h3>
  <div class="field-grid field-grid-3">
    <Field label="Height (cm)"><NumberInput label="Height (cm)" step="0.1" bind:value={v.heightCm} /></Field>
    <Field label="Weight (kg)"><NumberInput label="Weight (kg)" step="0.1" bind:value={v.weightKg} /></Field>
    <Field label="BMI"><NumberInput label="BMI" step="0.1" bind:value={v.bmi} /></Field>
    <Field label="HR"><NumberInput label="HR" bind:value={v.hr} /></Field>
    <Field label="BP" inputId="bp"><TextInput id="bp" label="BP" bind:value={v.bp} /></Field>
    <Field label="Resp rate"><NumberInput label="Resp rate" bind:value={v.respRate} /></Field>
    <Field label="SpO2"><NumberInput label="SpO2" bind:value={v.spo2} /></Field>
    <Field label="Temp"><NumberInput label="Temp" step="0.1" bind:value={v.temp} /></Field>
  </div>

  <h3 class="step-subhead">General examination</h3>
  <div class="field-grid field-grid-3">
    {#each generalExamItems as [key, label]}
      <label class="checkbox-label"><input type="checkbox" class="checkbox-input" bind:checked={g[key]} /> {label}</label>
    {/each}
  </div>
</Fieldset>
