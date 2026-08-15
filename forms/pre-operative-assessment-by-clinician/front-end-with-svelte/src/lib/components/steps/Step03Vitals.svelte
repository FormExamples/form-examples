<script lang="ts">
  import { store } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import NumberInput from '#lib/components/ui/NumberInput.svelte';
  import Select from '#lib/components/ui/Select.svelte';
</script>

<Fieldset legend="Step 3 — Vital signs and anthropometrics">
  <div class="field-grid field-grid-3">
    <Field label="Systolic BP (mmHg)">
      <NumberInput label="Systolic BP (mmHg)" bind:value={store.data.vitals.systolicBp} />
    </Field>
    <Field label="Diastolic BP (mmHg)">
      <NumberInput label="Diastolic BP (mmHg)" bind:value={store.data.vitals.diastolicBp} />
    </Field>
    <Field label="Heart rate (bpm)">
      <NumberInput label="Heart rate (bpm)" bind:value={store.data.vitals.heartRate} />
    </Field>
    <Field label="Respiratory rate">
      <NumberInput label="Respiratory rate" bind:value={store.data.vitals.respiratoryRate} />
    </Field>
    <Field label="SpO2 (%)">
      <NumberInput label="SpO2 (%)" step="0.1" bind:value={store.data.vitals.spo2Percent} />
    </Field>
    <Field label="Temperature (degC)">
      <NumberInput label="Temperature (degC)" step="0.1" bind:value={store.data.vitals.temperatureCelsius} />
    </Field>
    <Field label="On room air?">
      <Select label="On room air?" bind:value={store.data.vitals.onRoomAir}>
        <option value="">—</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </Select>
    </Field>
    <Field label="O2 flow (L/min)">
      <NumberInput label="O2 flow (L/min)" step="0.1" bind:value={store.data.vitals.supplementalOxygenLitres} />
    </Field>
    <Field label="Pain score 0-10">
      <NumberInput label="Pain score 0-10" min={0} max={10} bind:value={store.data.vitals.painScore010} />
    </Field>
  </div>
</Fieldset>
