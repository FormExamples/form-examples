<script lang="ts">
  import { assessment } from '$lib/stores/assessment.svelte';
  import Fieldset from '$lib/components/ui/Fieldset.svelte';
  import Field from '$lib/components/ui/Field.svelte';
  import NumberInput from '$lib/components/ui/NumberInput.svelte';
  import Select from '$lib/components/ui/Select.svelte';
  import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

  const d = assessment.data.demographics;
</script>

<Fieldset legend="Step 2 \u2014 Demographics">
  <p class="hint">Age and sex are required for the Framingham calculation. Valid age range: 30\u201379.</p>

  <div class="field-grid">
    <Field
      label="Age (years)"
      inputId="step-2-age"
      required
      error={assessment.errors['step-2-age']}
    >
      <NumberInput
        id="step-2-age"
        label="Age (years)"
        min={1}
        max={120}
        bind:value={d.age}
        aria-invalid={assessment.errors['step-2-age'] ? 'true' : undefined}
      />
    </Field>
    <Field
      label="Sex"
      required
      error={assessment.errors['step-2-sex']}
    >
      <RadioGroup label="Sex">
        <label class="radio-input">
          <input type="radio" name="sex" value="male" bind:group={d.sex} /> Male
        </label>
        <label class="radio-input">
          <input type="radio" name="sex" value="female" bind:group={d.sex} /> Female
        </label>
      </RadioGroup>
    </Field>
  </div>

  <Field label="Ethnicity" inputId="step-2-ethnicity">
    <Select id="step-2-ethnicity" label="Ethnicity" bind:value={d.ethnicity}>
      <option value="">\u2014 Prefer not to say \u2014</option>
      <option value="whitebritish">White \u2014 British</option>
      <option value="whiteother">White \u2014 Other</option>
      <option value="asian">Asian or Asian British</option>
      <option value="black">Black or Black British</option>
      <option value="mixed">Mixed / Multiple</option>
      <option value="other">Other</option>
    </Select>
  </Field>

  <div class="field-grid">
    <Field label="Height (cm)" inputId="step-2-heightCm">
      <NumberInput
        id="step-2-heightCm"
        label="Height (cm)"
        step="0.1"
        min={50}
        max={250}
        bind:value={d.heightCm}
      />
    </Field>
    <Field label="Weight (kg)" inputId="step-2-weightKg">
      <NumberInput
        id="step-2-weightKg"
        label="Weight (kg)"
        step="0.1"
        min={20}
        max={300}
        bind:value={d.weightKg}
      />
    </Field>
  </div>
</Fieldset>
