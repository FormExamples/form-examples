<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import NumberInput from '#lib/components/ui/NumberInput.svelte';
  import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

  const d = assessment.data.bloodPressure;
</script>

<Fieldset legend="Step 3 \u2014 Blood pressure">
  <p class="hint">Blood pressure readings and treatment status.</p>

  <div class="field-grid">
    <Field label="Systolic BP (mmHg)" inputId="step-3-systolicBP" required>
      <NumberInput id="step-3-systolicBP" label="Systolic BP" min={70} max={250} bind:value={d.systolicBP} />
    </Field>
    <Field label="Diastolic BP (mmHg)" inputId="step-3-diastolicBP">
      <NumberInput id="step-3-diastolicBP" label="Diastolic BP" min={40} max={150} bind:value={d.diastolicBP} />
    </Field>
  </div>

  <Field label="Systolic BP standard deviation (mmHg)" inputId="step-3-systolicBPSD">
    <NumberInput
      id="step-3-systolicBPSD"
      label="Systolic BP standard deviation"
      min={0}
      max={50}
      step="0.1"
      bind:value={d.systolicBPSD}
    />
  </Field>

  <Field label="On blood pressure treatment?">
    <RadioGroup label="On blood pressure treatment?">
      <label class="radio-input">
        <input type="radio" name="onBPTreatment" value="yes" bind:group={d.onBPTreatment} /> Yes
      </label>
      <label class="radio-input">
        <input type="radio" name="onBPTreatment" value="no" bind:group={d.onBPTreatment} /> No
      </label>
    </RadioGroup>
  </Field>

  {#if d.onBPTreatment === 'yes'}
    <Field label="Number of BP medications" inputId="step-3-numberOfBPMedications">
      <NumberInput
        id="step-3-numberOfBPMedications"
        label="Number of BP medications"
        min={1}
        max={10}
        bind:value={d.numberOfBPMedications}
      />
    </Field>
  {/if}
</Fieldset>
