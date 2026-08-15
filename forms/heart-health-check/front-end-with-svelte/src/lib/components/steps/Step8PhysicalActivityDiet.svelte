<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import NumberInput from '#lib/components/ui/NumberInput.svelte';
  import Select from '#lib/components/ui/Select.svelte';

  const d = assessment.data.physicalActivityDiet;
</script>

<Fieldset legend="Step 8 \u2014 Physical activity and diet">
  <p class="hint">Exercise and dietary habits.</p>

  <div class="field-grid">
    <Field label="Physical activity (minutes/week)" inputId="step-8-physicalActivityMinutesPerWeek">
      <NumberInput
        id="step-8-physicalActivityMinutesPerWeek"
        label="Physical activity"
        min={0}
        max={2000}
        bind:value={d.physicalActivityMinutesPerWeek}
      />
    </Field>
    <Field label="Activity intensity" inputId="step-8-activityIntensity">
      <Select id="step-8-activityIntensity" label="Activity intensity" bind:value={d.activityIntensity}>
        <option value="">\u2014 Select \u2014</option>
        <option value="light">Light (walking, yoga)</option>
        <option value="moderate">Moderate (brisk walking, cycling)</option>
        <option value="vigorous">Vigorous (running, sports)</option>
      </Select>
    </Field>
    <Field label="Fruit and vegetable portions per day" inputId="step-8-fruitVegPortionsPerDay">
      <NumberInput
        id="step-8-fruitVegPortionsPerDay"
        label="Fruit and vegetable portions per day"
        min={0}
        max={20}
        bind:value={d.fruitVegPortionsPerDay}
      />
    </Field>
    <Field label="Diet quality" inputId="step-8-dietQuality">
      <Select id="step-8-dietQuality" label="Diet quality" bind:value={d.dietQuality}>
        <option value="">\u2014 Select \u2014</option>
        <option value="poor">Poor</option>
        <option value="fair">Fair</option>
        <option value="good">Good</option>
        <option value="excellent">Excellent</option>
      </Select>
    </Field>
    <Field label="Salt intake" inputId="step-8-saltIntake">
      <Select id="step-8-saltIntake" label="Salt intake" bind:value={d.saltIntake}>
        <option value="">\u2014 Select \u2014</option>
        <option value="low">Low</option>
        <option value="moderate">Moderate</option>
        <option value="high">High</option>
      </Select>
    </Field>
  </div>
</Fieldset>
