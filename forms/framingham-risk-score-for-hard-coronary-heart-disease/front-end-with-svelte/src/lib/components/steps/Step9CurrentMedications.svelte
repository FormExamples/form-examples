<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import TextInput from '#lib/components/ui/TextInput.svelte';
  import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
  import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

  const med = assessment.data.currentMedications;

  const yn = [
    { key: 'onStatin', label: 'Currently on statin therapy?' },
    { key: 'onAspirin', label: 'Currently on aspirin?' },
    { key: 'onAntihypertensive', label: 'Currently on antihypertensive?' }
  ] as const;
</script>

<Fieldset legend="Step 9 \u2014 Current medications">
  <p class="hint">Current medication use helps identify treatment gaps and informs clinical recommendations.</p>

  {#each yn as item (item.key)}
    <Field label={item.label}>
      <RadioGroup label={item.label}>
        <label class="radio-input">
          <input type="radio" name={item.key} value="yes" bind:group={med[item.key]} /> Yes
        </label>
        <label class="radio-input">
          <input type="radio" name={item.key} value="no" bind:group={med[item.key]} /> No
        </label>
      </RadioGroup>
    </Field>
  {/each}

  <div class="field-grid">
    <Field label="Statin name (if applicable)" inputId="step-9-statinName">
      <TextInput id="step-9-statinName" label="Statin name" bind:value={med.statinName} />
    </Field>
    <Field label="Antihypertensive name (if applicable)" inputId="step-9-antihypertensiveName">
      <TextInput
        id="step-9-antihypertensiveName"
        label="Antihypertensive name"
        bind:value={med.antihypertensiveName}
      />
    </Field>
  </div>

  <Field label="Other medications" inputId="step-9-otherMedications">
    <TextAreaInput
      id="step-9-otherMedications"
      label="Other medications"
      rows={3}
      bind:value={med.otherMedications}
    />
  </Field>
</Fieldset>
