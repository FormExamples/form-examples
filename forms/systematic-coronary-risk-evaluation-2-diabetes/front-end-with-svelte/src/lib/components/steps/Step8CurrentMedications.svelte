<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
  import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

  const d = assessment.data.currentMedications;

  const yn = [
    { key: 'metformin', label: 'Metformin' },
    { key: 'sglt2Inhibitor', label: 'SGLT2 inhibitor' },
    { key: 'glp1Agonist', label: 'GLP-1 receptor agonist' },
    { key: 'sulfonylurea', label: 'Sulfonylurea' },
    { key: 'dpp4Inhibitor', label: 'DPP-4 inhibitor' },
    { key: 'insulin', label: 'Insulin' },
    { key: 'aceInhibitorOrArb', label: 'ACE inhibitor or ARB' },
    { key: 'antiplatelet', label: 'Antiplatelet agent' },
    { key: 'anticoagulant', label: 'Anticoagulant' }
  ] as const;
</script>

<Fieldset legend="Step 8 \u2014 Current medications">
  <p class="hint">Indicate whether the patient is currently taking any of the following.</p>

  {#each yn as item (item.key)}
    <Field label={item.label}>
      <RadioGroup label={item.label}>
        <label class="radio-input">
          <input type="radio" name={item.key} value="yes" bind:group={d[item.key]} /> Yes
        </label>
        <label class="radio-input">
          <input type="radio" name={item.key} value="no" bind:group={d[item.key]} /> No
        </label>
      </RadioGroup>
    </Field>
  {/each}

  <Field label="Other medications" inputId="step-8-otherMedications">
    <TextAreaInput
      id="step-8-otherMedications"
      label="Other medications"
      rows={3}
      bind:value={d.otherMedications}
    />
  </Field>
</Fieldset>
