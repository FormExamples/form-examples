<script lang="ts">
  import { store } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import NumberInput from '#lib/components/ui/NumberInput.svelte';
  import Select from '#lib/components/ui/Select.svelte';
</script>

<Fieldset legend="Step 6 — Respiratory">
  <div class="field-grid">
    <Field label="Asthma">
      <Select label="Asthma" bind:value={store.data.respiratory.asthma}>
        <option value="">—</option>
        <option value="none">None</option>
        <option value="controlled">Controlled</option>
        <option value="uncontrolled">Uncontrolled</option>
      </Select>
    </Field>
    <Field label="COPD">
      <Select label="COPD" bind:value={store.data.respiratory.copd}>
        <option value="">—</option>
        <option value="none">None</option>
        <option value="mild">Mild</option>
        <option value="moderate">Moderate</option>
        <option value="severe">Severe</option>
      </Select>
    </Field>
    <Field label="FEV1 (% predicted)">
      <NumberInput label="FEV1 (% predicted)" step="0.1" bind:value={store.data.respiratory.pftFev1PercentPredicted} />
    </Field>
    <Field label="Smoking status">
      <Select label="Smoking status" bind:value={store.data.respiratory.smokingStatus}>
        <option value="">—</option>
        <option value="never">Never</option>
        <option value="ex">Ex-smoker</option>
        <option value="current">Current</option>
      </Select>
    </Field>
    <Field label="Pack-years">
      <NumberInput label="Pack-years" step="0.1" bind:value={store.data.respiratory.packYears} />
    </Field>
    <Field label="COVID-19 history">
      <Select label="COVID-19 history" bind:value={store.data.respiratory.covidHistory}>
        <option value="">—</option>
        <option value="never">Never</option>
        <option value="recovered">Recovered</option>
        <option value="recent">Recent (&lt; 7 weeks)</option>
        <option value="long-covid">Long COVID</option>
      </Select>
    </Field>
    <Field label="Days since COVID">
      <NumberInput label="Days since COVID" bind:value={store.data.respiratory.daysSinceCovid} />
    </Field>
  </div>
</Fieldset>
