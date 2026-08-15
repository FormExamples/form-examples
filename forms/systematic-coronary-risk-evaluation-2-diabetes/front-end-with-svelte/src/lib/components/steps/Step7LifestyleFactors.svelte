<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import NumberInput from '#lib/components/ui/NumberInput.svelte';
  import Select from '#lib/components/ui/Select.svelte';
  import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

  const d = assessment.data.lifestyleFactors;
</script>

<Fieldset legend="Step 7 \u2014 Lifestyle factors">
  <Field label="Smoking status">
    <RadioGroup label="Smoking status">
      <label class="radio-input">
        <input type="radio" name="smokingStatus" value="never" bind:group={d.smokingStatus} /> Never
      </label>
      <label class="radio-input">
        <input type="radio" name="smokingStatus" value="former" bind:group={d.smokingStatus} /> Former
      </label>
      <label class="radio-input">
        <input type="radio" name="smokingStatus" value="current" bind:group={d.smokingStatus} /> Current
      </label>
    </RadioGroup>
  </Field>

  {#if d.smokingStatus === 'current'}
    <Field label="Cigarettes per day" inputId="step-7-cigarettesPerDay">
      <NumberInput
        id="step-7-cigarettesPerDay"
        label="Cigarettes per day"
        min={0}
        max={100}
        bind:value={d.cigarettesPerDay}
      />
    </Field>
  {/if}

  {#if d.smokingStatus === 'former'}
    <Field label="Years since quitting" inputId="step-7-yearsSinceQuit">
      <NumberInput
        id="step-7-yearsSinceQuit"
        label="Years since quitting"
        min={0}
        max={80}
        step="0.5"
        bind:value={d.yearsSinceQuit}
      />
    </Field>
  {/if}

  <Field
    label="Alcohol units per week"
    description="1 unit = 10ml pure alcohol"
    inputId="step-7-alcoholUnitsPerWeek"
  >
    <NumberInput
      id="step-7-alcoholUnitsPerWeek"
      label="Alcohol units per week"
      min={0}
      max={200}
      step="0.5"
      bind:value={d.alcoholUnitsPerWeek}
    />
  </Field>

  <Field label="Physical activity level" inputId="step-7-physicalActivity">
    <Select id="step-7-physicalActivity" label="Physical activity level" bind:value={d.physicalActivity}>
      <option value="">\u2014 Select \u2014</option>
      <option value="sedentary">Sedentary (&lt; 30 min/week)</option>
      <option value="lightlyActive">Lightly active (30\u2013149 min/week)</option>
      <option value="moderatelyActive">Moderately active (150\u2013300 min/week)</option>
      <option value="veryActive">Very active (&gt; 300 min/week)</option>
    </Select>
  </Field>

  <Field label="Diet quality" inputId="step-7-dietQuality">
    <Select id="step-7-dietQuality" label="Diet quality" bind:value={d.dietQuality}>
      <option value="">\u2014 Select \u2014</option>
      <option value="poor">Poor</option>
      <option value="fair">Fair</option>
      <option value="good">Good</option>
      <option value="excellent">Excellent</option>
    </Select>
  </Field>

  <div class="field-grid">
    <Field label="BMI (kg/m\u00b2)" inputId="step-7-bmi">
      <NumberInput id="step-7-bmi" label="BMI" min={10} max={80} step="0.1" bind:value={d.bmi} />
    </Field>
    <Field label="Waist circumference (cm)" inputId="step-7-waistCircumferenceCm">
      <NumberInput
        id="step-7-waistCircumferenceCm"
        label="Waist circumference"
        min={40}
        max={200}
        step="0.5"
        bind:value={d.waistCircumferenceCm}
      />
    </Field>
  </div>
</Fieldset>
