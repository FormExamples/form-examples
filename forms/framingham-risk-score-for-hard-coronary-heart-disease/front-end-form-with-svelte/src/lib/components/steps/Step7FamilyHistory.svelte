<script lang="ts">
  import { assessment } from '$lib/stores/assessment.svelte';
  import Fieldset from '$lib/components/ui/Fieldset.svelte';
  import Field from '$lib/components/ui/Field.svelte';
  import TextInput from '$lib/components/ui/TextInput.svelte';
  import Select from '$lib/components/ui/Select.svelte';
  import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

  const f = assessment.data.familyHistory;
</script>

<Fieldset legend="Step 7 \u2014 Family history">
  <p class="hint">Family history of premature CHD is an important risk modifier not captured in the core Framingham equation.</p>

  <Field label="Family history of coronary heart disease?">
    <RadioGroup label="Family history of coronary heart disease?">
      <label class="radio-input">
        <input type="radio" name="familyChdHistory" value="yes" bind:group={f.familyChdHistory} /> Yes
      </label>
      <label class="radio-input">
        <input type="radio" name="familyChdHistory" value="no" bind:group={f.familyChdHistory} /> No
      </label>
    </RadioGroup>
  </Field>

  <div class="field-grid">
    <Field label="Age of onset in family member" inputId="step-7-familyChdAgeOnset">
      <Select
        id="step-7-familyChdAgeOnset"
        label="Age of onset in family member"
        bind:value={f.familyChdAgeOnset}
      >
        <option value="">\u2014 Select \u2014</option>
        <option value="under55">Under 55</option>
        <option value="55to65">55\u201365</option>
        <option value="over65">Over 65</option>
      </Select>
    </Field>
    <Field label="Relationship to patient" inputId="step-7-familyChdRelationship">
      <TextInput
        id="step-7-familyChdRelationship"
        label="Relationship to patient"
        bind:value={f.familyChdRelationship}
      />
    </Field>
  </div>

  <Field label="Family history of stroke?">
    <RadioGroup label="Family history of stroke?">
      <label class="radio-input">
        <input type="radio" name="familyStrokeHistory" value="yes" bind:group={f.familyStrokeHistory} /> Yes
      </label>
      <label class="radio-input">
        <input type="radio" name="familyStrokeHistory" value="no" bind:group={f.familyStrokeHistory} /> No
      </label>
    </RadioGroup>
  </Field>

  <Field label="Family history of diabetes?">
    <RadioGroup label="Family history of diabetes?">
      <label class="radio-input">
        <input type="radio" name="familyDiabetesHistory" value="yes" bind:group={f.familyDiabetesHistory} /> Yes
      </label>
      <label class="radio-input">
        <input type="radio" name="familyDiabetesHistory" value="no" bind:group={f.familyDiabetesHistory} /> No
      </label>
    </RadioGroup>
  </Field>
</Fieldset>
