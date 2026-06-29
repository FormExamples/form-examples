<script lang="ts">
  import { assessment } from '$lib/stores/assessment.svelte';
  import Fieldset from '$lib/components/ui/Fieldset.svelte';
  import Field from '$lib/components/ui/Field.svelte';
  import NumberInput from '$lib/components/ui/NumberInput.svelte';
  import Select from '$lib/components/ui/Select.svelte';
  import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

  const d = assessment.data.demographicsEthnicity;
</script>

<Fieldset legend="Step 2 \u2014 Demographics and ethnicity">
  <p class="hint">Required for QRISK3 risk calculation.</p>

  <div class="field-grid">
    <Field label="Age (years)" inputId="step-2-age" required error={assessment.errors['step-2-age']}>
      <NumberInput
        id="step-2-age"
        label="Age"
        min={18}
        max={100}
        bind:value={d.age}
        aria-invalid={assessment.errors['step-2-age'] ? 'true' : undefined}
      />
    </Field>
    <Field label="Townsend deprivation score" inputId="step-2-townsend">
      <NumberInput
        id="step-2-townsend"
        label="Townsend deprivation score"
        step="0.1"
        min={-8}
        max={12}
        bind:value={d.townsendDeprivation}
      />
    </Field>
  </div>

  <Field label="Sex" required error={assessment.errors['step-2-sex']}>
    <RadioGroup label="Sex">
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
      <option value="white">White or not stated</option>
      <option value="indian">Indian</option>
      <option value="pakistani">Pakistani</option>
      <option value="bangladeshi">Bangladeshi</option>
      <option value="other-asian">Other Asian</option>
      <option value="black-caribbean">Black Caribbean</option>
      <option value="black-african">Black African</option>
      <option value="chinese">Chinese</option>
      <option value="other">Other ethnic group</option>
    </Select>
  </Field>
</Fieldset>
