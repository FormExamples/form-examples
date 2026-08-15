<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
  import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

  const m = assessment.data.medicalHistory;

  const yn = [
    { key: 'hasDiabetes', label: 'Has diabetes?' },
    { key: 'hasPriorChd', label: 'Has prior coronary heart disease?' },
    { key: 'hasPeripheralVascularDisease', label: 'Has peripheral vascular disease?' },
    { key: 'hasCerebrovascularDisease', label: 'Has cerebrovascular disease?' },
    { key: 'hasHeartFailure', label: 'Has heart failure?' },
    { key: 'hasAtrialFibrillation', label: 'Has atrial fibrillation?' }
  ] as const;
</script>

<Fieldset legend="Step 6 \u2014 Medical history">
  <p class="hint">The Framingham score targets patients without diabetes or prior CHD; flag any pre-existing conditions.</p>

  {#each yn as item (item.key)}
    <Field label={item.label}>
      <RadioGroup label={item.label}>
        <label class="radio-input">
          <input
            type="radio"
            name={item.key}
            value="yes"
            bind:group={m[item.key]}
          /> Yes
        </label>
        <label class="radio-input">
          <input
            type="radio"
            name={item.key}
            value="no"
            bind:group={m[item.key]}
          /> No
        </label>
      </RadioGroup>
    </Field>
  {/each}

  <Field label="Other conditions" inputId="step-6-otherConditions">
    <TextAreaInput
      id="step-6-otherConditions"
      label="Other conditions"
      rows={3}
      bind:value={m.otherConditions}
    />
  </Field>
</Fieldset>
