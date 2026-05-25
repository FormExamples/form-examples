<script lang="ts">
  import { assessment } from '$lib/stores/assessment.svelte';
  import Fieldset from '$lib/components/ui/Fieldset.svelte';
  import Field from '$lib/components/ui/Field.svelte';
  import Select from '$lib/components/ui/Select.svelte';
  import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

  const d = assessment.data.familyHistory;
</script>

<Fieldset legend="Step 6 \u2014 Family history">
  <p class="hint">Cardiovascular and diabetes family history.</p>

  <Field label="First-degree relative with CVD under age 60?">
    <RadioGroup label="First-degree relative with CVD under age 60?">
      <label class="radio-input">
        <input type="radio" name="familyCVDUnder60" value="yes" bind:group={d.familyCVDUnder60} /> Yes
      </label>
      <label class="radio-input">
        <input type="radio" name="familyCVDUnder60" value="no" bind:group={d.familyCVDUnder60} /> No
      </label>
    </RadioGroup>
  </Field>

  {#if d.familyCVDUnder60 === 'yes'}
    <Field label="Relationship" inputId="step-6-familyCVDRelationship">
      <Select id="step-6-familyCVDRelationship" label="Relationship" bind:value={d.familyCVDRelationship}>
        <option value="">\u2014 Select \u2014</option>
        <option value="parent">Parent</option>
        <option value="sibling">Sibling</option>
        <option value="child">Child</option>
        <option value="multiple">Multiple relatives</option>
      </Select>
    </Field>
  {/if}

  <Field label="Family history of diabetes?">
    <RadioGroup label="Family history of diabetes?">
      <label class="radio-input">
        <input type="radio" name="familyDiabetesHistory" value="yes" bind:group={d.familyDiabetesHistory} /> Yes
      </label>
      <label class="radio-input">
        <input type="radio" name="familyDiabetesHistory" value="no" bind:group={d.familyDiabetesHistory} /> No
      </label>
    </RadioGroup>
  </Field>
</Fieldset>
