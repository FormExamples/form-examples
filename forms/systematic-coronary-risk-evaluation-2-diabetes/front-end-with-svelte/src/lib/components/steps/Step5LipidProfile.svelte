<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import NumberInput from '#lib/components/ui/NumberInput.svelte';
  import TextInput from '#lib/components/ui/TextInput.svelte';
  import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

  const d = assessment.data.lipidProfile;
</script>

<Fieldset legend="Step 5 \u2014 Lipid profile">
  <p class="hint">Enter the most recent fasting lipid profile results.</p>

  <div class="field-grid">
    <Field label="Total cholesterol (mmol/L)" inputId="step-5-totalCholesterol">
      <NumberInput id="step-5-totalCholesterol" label="Total cholesterol" min={0} max={20} step="0.01" bind:value={d.totalCholesterol} />
    </Field>
    <Field label="HDL cholesterol (mmol/L)" inputId="step-5-hdlCholesterol">
      <NumberInput id="step-5-hdlCholesterol" label="HDL cholesterol" min={0} max={10} step="0.01" bind:value={d.hdlCholesterol} />
    </Field>
    <Field label="LDL cholesterol (mmol/L)" inputId="step-5-ldlCholesterol">
      <NumberInput id="step-5-ldlCholesterol" label="LDL cholesterol" min={0} max={15} step="0.01" bind:value={d.ldlCholesterol} />
    </Field>
    <Field label="Triglycerides (mmol/L)" inputId="step-5-triglycerides">
      <NumberInput id="step-5-triglycerides" label="Triglycerides" min={0} max={30} step="0.01" bind:value={d.triglycerides} />
    </Field>
  </div>

  <Field
    label="Non-HDL cholesterol (mmol/L)"
    description="Calculated as Total Cholesterol minus HDL Cholesterol"
    inputId="step-5-nonHdlCholesterol"
  >
    <NumberInput
      id="step-5-nonHdlCholesterol"
      label="Non-HDL cholesterol"
      min={0}
      max={20}
      step="0.01"
      bind:value={d.nonHdlCholesterol}
    />
  </Field>

  <Field label="On statin therapy">
    <RadioGroup label="On statin therapy">
      <label class="radio-input">
        <input type="radio" name="onStatin" value="yes" bind:group={d.onStatin} /> Yes
      </label>
      <label class="radio-input">
        <input type="radio" name="onStatin" value="no" bind:group={d.onStatin} /> No
      </label>
    </RadioGroup>
  </Field>

  {#if d.onStatin === 'yes'}
    <Field label="Statin name and dose" inputId="step-5-statinName">
      <TextInput id="step-5-statinName" label="Statin name and dose" bind:value={d.statinName} />
    </Field>
  {/if}

  <Field
    label="On other lipid-lowering therapy"
    description="e.g. Ezetimibe, PCSK9 inhibitor, fibrate"
  >
    <RadioGroup label="On other lipid-lowering therapy">
      <label class="radio-input">
        <input type="radio" name="onOtherLipidTherapy" value="yes" bind:group={d.onOtherLipidTherapy} /> Yes
      </label>
      <label class="radio-input">
        <input type="radio" name="onOtherLipidTherapy" value="no" bind:group={d.onOtherLipidTherapy} /> No
      </label>
    </RadioGroup>
  </Field>
</Fieldset>
