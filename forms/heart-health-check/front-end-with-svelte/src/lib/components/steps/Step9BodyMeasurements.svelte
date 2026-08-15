<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import NumberInput from '#lib/components/ui/NumberInput.svelte';
  import Alert from '#lib/components/ui/Alert.svelte';
  import { calculateBMI } from '#lib/engine/utils.js';

  const d = assessment.data.bodyMeasurements;
  const autoBMI = $derived(d.bmi ?? calculateBMI(d.heightCm, d.weightKg));

  function bmiCategory(bmi: number): string {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal';
    if (bmi < 30) return 'Overweight';
    if (bmi < 40) return 'Obese';
    return 'Morbidly obese';
  }

  function bmiAlertType(bmi: number): 'success' | 'warning' | 'error' {
    if (bmi >= 18.5 && bmi < 25) return 'success';
    if (bmi < 30) return 'warning';
    return 'error';
  }
</script>

<Fieldset legend="Step 9 \u2014 Body measurements">
  <p class="hint">Height, weight, and waist circumference.</p>

  <div class="field-grid">
    <Field label="Height (cm)" inputId="step-9-heightCm">
      <NumberInput
        id="step-9-heightCm"
        label="Height (cm)"
        min={100}
        max={250}
        step="0.1"
        bind:value={d.heightCm}
      />
    </Field>
    <Field label="Weight (kg)" inputId="step-9-weightKg">
      <NumberInput
        id="step-9-weightKg"
        label="Weight (kg)"
        min={30}
        max={300}
        step="0.1"
        bind:value={d.weightKg}
      />
    </Field>
  </div>

  {#if autoBMI != null}
    <Alert type={bmiAlertType(autoBMI)}>
      <p><strong>BMI:</strong> {autoBMI} ({bmiCategory(autoBMI)})</p>
    </Alert>
  {/if}

  <Field label="BMI (override)" inputId="step-9-bmi">
    <NumberInput
      id="step-9-bmi"
      label="BMI"
      min={10}
      max={80}
      step="0.1"
      bind:value={d.bmi}
    />
  </Field>

  <Field label="Waist circumference (cm)" inputId="step-9-waistCircumferenceCm">
    <NumberInput
      id="step-9-waistCircumferenceCm"
      label="Waist circumference (cm)"
      min={40}
      max={200}
      step="0.1"
      bind:value={d.waistCircumferenceCm}
    />
  </Field>
</Fieldset>
