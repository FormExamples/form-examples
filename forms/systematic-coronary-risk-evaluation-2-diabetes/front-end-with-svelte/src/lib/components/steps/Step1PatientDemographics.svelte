<script lang="ts">
  import { assessment } from '$lib/stores/assessment.svelte.js';
  import Fieldset from '$lib/components/ui/Fieldset.svelte';
  import Field from '$lib/components/ui/Field.svelte';
  import TextInput from '$lib/components/ui/TextInput.svelte';
  import DateInput from '$lib/components/ui/DateInput.svelte';
  import NumberInput from '$lib/components/ui/NumberInput.svelte';
  import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
  import Select from '$lib/components/ui/Select.svelte';

  const d = assessment.data.patientDemographics;
</script>

<Fieldset legend="Step 1 \u2014 Patient demographics">
  <Field label="Full name" inputId="step-1-fullName" required>
    <TextInput id="step-1-fullName" label="Full name" bind:value={d.fullName} />
  </Field>

  <div class="field-grid">
    <Field label="Date of birth" inputId="step-1-dateOfBirth">
      <DateInput id="step-1-dateOfBirth" label="Date of birth" bind:value={d.dateOfBirth} />
    </Field>
    <Field label="Sex" required error={assessment.errors['step-1-sex']}>
      <RadioGroup label="Sex" id="step-1-sex">
        <label class="radio-input">
          <input type="radio" name="sex" value="male" bind:group={d.sex} /> Male
        </label>
        <label class="radio-input">
          <input type="radio" name="sex" value="female" bind:group={d.sex} /> Female
        </label>
      </RadioGroup>
    </Field>
  </div>

  <Field label="NHS number" inputId="step-1-nhsNumber">
    <TextInput id="step-1-nhsNumber" label="NHS number" bind:value={d.nhsNumber} />
  </Field>

  <div class="field-grid">
    <Field label="Height (cm)" inputId="step-1-heightCm">
      <NumberInput id="step-1-heightCm" label="Height (cm)" min={50} max={250} step="0.1" bind:value={d.heightCm} />
    </Field>
    <Field label="Weight (kg)" inputId="step-1-weightKg">
      <NumberInput id="step-1-weightKg" label="Weight (kg)" min={20} max={300} step="0.1" bind:value={d.weightKg} />
    </Field>
  </div>

  <Field label="Ethnicity" inputId="step-1-ethnicity">
    <Select id="step-1-ethnicity" label="Ethnicity" bind:value={d.ethnicity}>
      <option value="">\u2014 Select \u2014</option>
      <option value="white">White</option>
      <option value="mixedOrMultiple">Mixed or Multiple ethnic groups</option>
      <option value="asian">Asian or Asian British</option>
      <option value="black">Black, African, Caribbean or Black British</option>
      <option value="arab">Arab</option>
      <option value="other">Other ethnic group</option>
      <option value="preferNotToSay">Prefer not to say</option>
    </Select>
  </Field>
</Fieldset>
