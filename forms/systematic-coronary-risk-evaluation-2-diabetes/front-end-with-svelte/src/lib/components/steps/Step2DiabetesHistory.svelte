<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import NumberInput from '#lib/components/ui/NumberInput.svelte';
  import Select from '#lib/components/ui/Select.svelte';
  import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

  const d = assessment.data.diabetesHistory;
</script>

<Fieldset legend="Step 2 \u2014 Diabetes history">
  <div class="field-grid">
    <Field label="Diabetes type" inputId="step-2-diabetesType" required error={assessment.errors['step-2-diabetesType']}>
      <Select id="step-2-diabetesType" label="Diabetes type" bind:value={d.diabetesType}>
        <option value="">\u2014 Select \u2014</option>
        <option value="type1">Type 1</option>
        <option value="type2">Type 2</option>
        <option value="gestational">Gestational</option>
        <option value="other">Other</option>
      </Select>
    </Field>
    <Field label="Age at diagnosis (years)" inputId="step-2-ageAtDiagnosis">
      <NumberInput
        id="step-2-ageAtDiagnosis"
        label="Age at diagnosis"
        min={0}
        max={120}
        bind:value={d.ageAtDiagnosis}
      />
    </Field>
  </div>

  <Field label="Diabetes duration (years)" inputId="step-2-diabetesDurationYears">
    <NumberInput
      id="step-2-diabetesDurationYears"
      label="Diabetes duration"
      min={0}
      max={100}
      step="0.5"
      bind:value={d.diabetesDurationYears}
    />
  </Field>

  <div class="field-grid">
    <Field label="HbA1c value" inputId="step-2-hba1cValue">
      <NumberInput id="step-2-hba1cValue" label="HbA1c value" min={0} step="0.1" bind:value={d.hba1cValue} />
    </Field>
    <Field label="HbA1c unit">
      <RadioGroup label="HbA1c unit">
        <label class="radio-input">
          <input type="radio" name="hba1cUnit" value="mmolMol" bind:group={d.hba1cUnit} /> mmol/mol
        </label>
        <label class="radio-input">
          <input type="radio" name="hba1cUnit" value="percent" bind:group={d.hba1cUnit} /> %
        </label>
      </RadioGroup>
    </Field>
  </div>

  <Field label="Fasting glucose (mmol/L)" inputId="step-2-fastingGlucose">
    <NumberInput
      id="step-2-fastingGlucose"
      label="Fasting glucose"
      min={0}
      step="0.1"
      bind:value={d.fastingGlucose}
    />
  </Field>

  <Field label="Current diabetes treatment" inputId="step-2-diabetesTreatment">
    <Select id="step-2-diabetesTreatment" label="Current diabetes treatment" bind:value={d.diabetesTreatment}>
      <option value="">\u2014 Select \u2014</option>
      <option value="diet">Diet only</option>
      <option value="oral">Oral medication only</option>
      <option value="insulin">Insulin only</option>
      <option value="combined">Combined (oral + insulin)</option>
    </Select>
  </Field>

  {#if d.diabetesTreatment === 'insulin' || d.diabetesTreatment === 'combined'}
    <Field label="Duration on insulin (years)" inputId="step-2-insulinDurationYears">
      <NumberInput
        id="step-2-insulinDurationYears"
        label="Duration on insulin"
        min={0}
        max={100}
        step="0.5"
        bind:value={d.insulinDurationYears}
      />
    </Field>
  {/if}
</Fieldset>
