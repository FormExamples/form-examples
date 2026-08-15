<script lang="ts">
  import { store } from '#lib/stores/assessment.svelte.js';
  import TextField from '#lib/components/ui/TextField.svelte';
  import NumberField from '#lib/components/ui/NumberField.svelte';
  import SelectField from '#lib/components/ui/SelectField.svelte';
  import YesNoField from '#lib/components/ui/YesNoField.svelte';
</script>

<section>
  <h2 class="text-xl font-semibold mb-4">Step 7 — Cardiovascular fitness</h2>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <NumberField label="Resting systolic BP" unit="mmHg" min={50} max={260} bind:value={store.data.cardiovascular.restingSystolicBp} />
    <NumberField label="Resting diastolic BP" unit="mmHg" min={30} max={160} bind:value={store.data.cardiovascular.restingDiastolicBp} />
    <NumberField label="Resting heart rate" unit="bpm" min={20} max={220} bind:value={store.data.cardiovascular.restingHeartRate} />
    <SelectField
      label="NYHA class"
      bind:value={store.data.cardiovascular.nyhaClass}
      options={[
        { value: 'I', label: 'I — no symptoms' },
        { value: 'II', label: 'II — mild' },
        { value: 'III', label: 'III — marked' },
        { value: 'IV', label: 'IV — at rest' },
      ]}
    />
    <TextField label="Most recent MI date" type="date" bind:value={store.data.cardiovascular.recentMiDate} />
    <TextField label="Most recent stent date" type="date" bind:value={store.data.cardiovascular.recentStentDate} />
    <YesNoField label="On anticoagulant?" bind:value={store.data.cardiovascular.onAnticoagulant} />
    <YesNoField label="Pacemaker or ICD?" bind:value={store.data.cardiovascular.pacemakerOrIcd} />
    <NumberField label="Exercise tolerance on flat" unit="metres" min={0} bind:value={store.data.cardiovascular.exerciseToleranceMetres} />
    <YesNoField label="Unstable angina?" bind:value={store.data.cardiovascular.unstableAngina} />
  </div>
</section>
