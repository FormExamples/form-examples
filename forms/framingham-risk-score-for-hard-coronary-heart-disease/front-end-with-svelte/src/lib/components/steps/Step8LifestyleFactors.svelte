<script lang="ts">
  import { assessment } from '$lib/stores/assessment.svelte';
  import Fieldset from '$lib/components/ui/Fieldset.svelte';
  import Field from '$lib/components/ui/Field.svelte';
  import NumberInput from '$lib/components/ui/NumberInput.svelte';
  import Select from '$lib/components/ui/Select.svelte';

  const l = assessment.data.lifestyleFactors;
</script>

<Fieldset legend="Step 8 \u2014 Lifestyle factors">
  <p class="hint">Lifestyle factors provide additional context for clinical decision-making beyond the core risk score.</p>

  <div class="field-grid">
    <Field label="Physical activity level" inputId="step-8-physicalActivity">
      <Select id="step-8-physicalActivity" label="Physical activity level" bind:value={l.physicalActivity}>
        <option value="">\u2014 Select \u2014</option>
        <option value="sedentary">Sedentary</option>
        <option value="light">Light</option>
        <option value="moderate">Moderate</option>
        <option value="vigorous">Vigorous</option>
      </Select>
    </Field>
    <Field label="Alcohol consumption" inputId="step-8-alcoholConsumption">
      <Select id="step-8-alcoholConsumption" label="Alcohol consumption" bind:value={l.alcoholConsumption}>
        <option value="">\u2014 Select \u2014</option>
        <option value="none">None</option>
        <option value="moderate">Moderate</option>
        <option value="heavy">Heavy</option>
      </Select>
    </Field>
    <Field label="Diet quality" inputId="step-8-dietQuality">
      <Select id="step-8-dietQuality" label="Diet quality" bind:value={l.dietQuality}>
        <option value="">\u2014 Select \u2014</option>
        <option value="poor">Poor</option>
        <option value="average">Average</option>
        <option value="good">Good</option>
        <option value="excellent">Excellent</option>
      </Select>
    </Field>
    <Field label="Stress level" inputId="step-8-stressLevel">
      <Select id="step-8-stressLevel" label="Stress level" bind:value={l.stressLevel}>
        <option value="">\u2014 Select \u2014</option>
        <option value="low">Low</option>
        <option value="moderate">Moderate</option>
        <option value="high">High</option>
      </Select>
    </Field>
    <Field label="BMI (if known)" inputId="step-8-bmi">
      <NumberInput
        id="step-8-bmi"
        label="BMI"
        step="0.1"
        min={10}
        max={80}
        bind:value={l.bmi}
      />
    </Field>
    <Field label="Waist circumference (cm)" inputId="step-8-waistCircumferenceCm">
      <NumberInput
        id="step-8-waistCircumferenceCm"
        label="Waist circumference (cm)"
        step="0.1"
        min={30}
        max={250}
        bind:value={l.waistCircumferenceCm}
      />
    </Field>
  </div>
</Fieldset>
