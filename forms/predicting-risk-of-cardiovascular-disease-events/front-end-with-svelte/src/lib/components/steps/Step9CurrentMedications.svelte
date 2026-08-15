<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
  import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

  const cm = assessment.data.currentMedications;

  const yn = [
    { key: 'onAntihypertensiveDetail', label: 'On antihypertensive medication?' },
    { key: 'onStatinDetail', label: 'On statin therapy?' },
    { key: 'onAspirin', label: 'On aspirin?' },
    { key: 'onAnticoagulant', label: 'On anticoagulant?' },
    { key: 'onDiabetesMedication', label: 'On diabetes medication?' }
  ] as const;
</script>

<Fieldset legend="Step 9 \u2014 Current medications">
  <p class="hint">Current cardiovascular and metabolic medications.</p>

  {#each yn as item (item.key)}
    <Field label={item.label}>
      <RadioGroup label={item.label}>
        <label class="radio-input">
          <input type="radio" name={item.key} value="yes" bind:group={cm[item.key]} /> Yes
        </label>
        <label class="radio-input">
          <input type="radio" name={item.key} value="no" bind:group={cm[item.key]} /> No
        </label>
      </RadioGroup>
    </Field>
  {/each}

  <Field label="Other medications" inputId="step-9-otherMedications">
    <TextAreaInput
      id="step-9-otherMedications"
      label="Other medications"
      rows={3}
      bind:value={cm.otherMedications}
    />
  </Field>
</Fieldset>
