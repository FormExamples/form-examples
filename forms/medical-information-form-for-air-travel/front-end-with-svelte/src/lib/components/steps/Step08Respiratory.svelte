<script lang="ts">
  import { store } from '#lib/stores/assessment.svelte.js';
  import TextField from '#lib/components/ui/TextField.svelte';
  import NumberField from '#lib/components/ui/NumberField.svelte';
  import SelectField from '#lib/components/ui/SelectField.svelte';
</script>

<section>
  <h2 class="text-xl font-semibold mb-4">Step 8 — Respiratory fitness</h2>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <NumberField label="Resting SpO₂ on room air" unit="%" min={50} max={100} step={0.1} bind:value={store.data.respiratory.restingSpo2Percent} />
    <NumberField label="Predicted in-flight SpO₂" unit="%" min={50} max={100} step={0.1} bind:value={store.data.respiratory.predictedInflightSpo2Percent} />
    <SelectField
      label="Hypoxic challenge result"
      bind:value={store.data.respiratory.hypoxicChallengeResult}
      options={[
        { value: 'pass', label: 'Pass' },
        { value: 'borderline', label: 'Borderline' },
        { value: 'fail', label: 'Fail' },
        { value: 'not-performed', label: 'Not performed' },
      ]}
    />
    <TextField label="Most recent pneumothorax date" type="date" bind:value={store.data.respiratory.recentPneumothoraxDate} />
    <SelectField
      label="Asthma severity"
      bind:value={store.data.respiratory.asthmaSeverity}
      options={[
        { value: 'none', label: 'None' },
        { value: 'mild-controlled', label: 'Mild controlled' },
        { value: 'moderate', label: 'Moderate' },
        { value: 'severe-uncontrolled', label: 'Severe uncontrolled' },
      ]}
    />
    <SelectField
      label="COPD severity"
      bind:value={store.data.respiratory.copdSeverity}
      options={[
        { value: 'none', label: 'None' },
        { value: 'mild', label: 'Mild' },
        { value: 'moderate', label: 'Moderate' },
        { value: 'severe', label: 'Severe' },
      ]}
    />
    <SelectField
      label="CPAP / BiPAP at home"
      bind:value={store.data.respiratory.cpapOrBipapUse}
      options={[
        { value: 'none', label: 'None' },
        { value: 'cpap', label: 'CPAP' },
        { value: 'bipap', label: 'BiPAP' },
        { value: 'both', label: 'Both' },
      ]}
    />
    <TextField label="Most recent PE date" type="date" bind:value={store.data.respiratory.recentPulmonaryEmbolismDate} />
  </div>
</section>
