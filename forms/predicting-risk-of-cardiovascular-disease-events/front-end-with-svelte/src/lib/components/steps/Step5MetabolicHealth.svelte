<script lang="ts">
  import { assessment } from '$lib/stores/assessment.svelte';
  import Fieldset from '$lib/components/ui/Fieldset.svelte';
  import Field from '$lib/components/ui/Field.svelte';
  import NumberInput from '$lib/components/ui/NumberInput.svelte';
  import Select from '$lib/components/ui/Select.svelte';
  import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

  const mh = assessment.data.metabolicHealth;
</script>

<Fieldset legend="Step 5 \u2014 Metabolic health">
  <p class="hint">Diabetes status, HbA1c, glucose, BMI, and waist circumference.</p>

  <Field label="Has diabetes?" required>
    <RadioGroup label="Has diabetes?">
      <label class="radio-input">
        <input type="radio" name="hasDiabetes" value="yes" bind:group={mh.hasDiabetes} /> Yes
      </label>
      <label class="radio-input">
        <input type="radio" name="hasDiabetes" value="no" bind:group={mh.hasDiabetes} /> No
      </label>
    </RadioGroup>
  </Field>

  {#if mh.hasDiabetes === 'yes'}
    <Field label="Diabetes type" inputId="step-5-diabetesType">
      <Select id="step-5-diabetesType" label="Diabetes type" bind:value={mh.diabetesType}>
        <option value="">\u2014 Select \u2014</option>
        <option value="type1">Type 1</option>
        <option value="type2">Type 2</option>
        <option value="gestational">Gestational</option>
        <option value="other">Other</option>
      </Select>
    </Field>
  {/if}

  <div class="field-grid">
    <Field label="HbA1c value" inputId="step-5-hba1cValue">
      <NumberInput id="step-5-hba1cValue" label="HbA1c value" min={2} max={200} step="0.1" bind:value={mh.hba1cValue} />
    </Field>
    <Field label="HbA1c unit" inputId="step-5-hba1cUnit">
      <Select id="step-5-hba1cUnit" label="HbA1c unit" bind:value={mh.hba1cUnit}>
        <option value="">\u2014 Select \u2014</option>
        <option value="percent">% (NGSP/DCCT)</option>
        <option value="mmolMol">mmol/mol (IFCC)</option>
      </Select>
    </Field>
  </div>

  <Field label="Fasting glucose (mg/dL)" inputId="step-5-fastingGlucose">
    <NumberInput id="step-5-fastingGlucose" label="Fasting glucose" min={30} max={600} bind:value={mh.fastingGlucose} />
  </Field>

  <div class="field-grid">
    <Field label="BMI (kg/m\u00b2)" inputId="step-5-bmi">
      <NumberInput id="step-5-bmi" label="BMI" min={10} max={80} step="0.1" bind:value={mh.bmi} />
    </Field>
    <Field label="Waist circumference (cm)" inputId="step-5-waistCircumferenceCm">
      <NumberInput
        id="step-5-waistCircumferenceCm"
        label="Waist circumference (cm)"
        min={40}
        max={200}
        step="0.1"
        bind:value={mh.waistCircumferenceCm}
      />
    </Field>
  </div>
</Fieldset>
