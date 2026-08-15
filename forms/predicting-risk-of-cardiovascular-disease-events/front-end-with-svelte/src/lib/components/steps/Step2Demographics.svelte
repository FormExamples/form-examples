<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import NumberInput from '#lib/components/ui/NumberInput.svelte';
  import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
  import Select from '#lib/components/ui/Select.svelte';
  import TextInput from '#lib/components/ui/TextInput.svelte';

  const d = assessment.data.demographics;
</script>

<Fieldset legend="Step 2 \u2014 Demographics">
  <p class="hint">Age, sex, and body measurements used in risk calculation.</p>

  <Field label="Age (years)" inputId="step-2-age" required error={assessment.errors['step-2-age']}>
    <NumberInput
      id="step-2-age"
      label="Age"
      min={18}
      max={120}
      bind:value={d.age}
      aria-invalid={assessment.errors['step-2-age'] ? 'true' : undefined}
    />
  </Field>

  <Field label="Sex" required error={assessment.errors['step-2-sex']}>
    <RadioGroup label="Sex" id="step-2-sex">
      <label class="radio-input">
        <input type="radio" name="sex" value="male" bind:group={d.sex} /> Male
      </label>
      <label class="radio-input">
        <input type="radio" name="sex" value="female" bind:group={d.sex} /> Female
      </label>
    </RadioGroup>
  </Field>

  <Field label="Ethnicity" inputId="step-2-ethnicity">
    <Select id="step-2-ethnicity" label="Ethnicity" bind:value={d.ethnicity}>
      <option value="">\u2014 Select \u2014</option>
      <option value="white">White</option>
      <option value="black">Black / African American</option>
      <option value="hispanic">Hispanic / Latino</option>
      <option value="asian">Asian</option>
      <option value="native">Native American / Pacific Islander</option>
      <option value="mixed">Mixed / Multiple</option>
      <option value="other">Other</option>
    </Select>
  </Field>

  <div class="field-grid">
    <Field label="Height (cm)" inputId="step-2-heightCm">
      <NumberInput id="step-2-heightCm" label="Height (cm)" min={50} max={250} step="0.1" bind:value={d.heightCm} />
    </Field>
    <Field label="Weight (kg)" inputId="step-2-weightKg">
      <NumberInput id="step-2-weightKg" label="Weight (kg)" min={20} max={400} step="0.1" bind:value={d.weightKg} />
    </Field>
  </div>

  <Field label="ZIP / postal code" inputId="step-2-zipCode">
    <TextInput id="step-2-zipCode" label="ZIP / postal code" bind:value={d.zipCode} />
  </Field>
</Fieldset>
