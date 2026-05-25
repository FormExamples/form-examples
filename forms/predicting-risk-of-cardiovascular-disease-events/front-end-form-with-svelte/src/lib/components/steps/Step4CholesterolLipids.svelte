<script lang="ts">
  import { assessment } from '$lib/stores/assessment.svelte';
  import Fieldset from '$lib/components/ui/Fieldset.svelte';
  import Field from '$lib/components/ui/Field.svelte';
  import NumberInput from '$lib/components/ui/NumberInput.svelte';
  import TextInput from '$lib/components/ui/TextInput.svelte';
  import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

  const cl = assessment.data.cholesterolLipids;
</script>

<Fieldset legend="Step 4 \u2014 Cholesterol and lipids">
  <p class="hint">Lipid panel values and statin treatment status.</p>

  <div class="field-grid">
    <Field label="Total cholesterol (mg/dL)" inputId="step-4-totalCholesterol">
      <NumberInput id="step-4-totalCholesterol" label="Total cholesterol" min={50} max={500} bind:value={cl.totalCholesterol} />
    </Field>
    <Field label="HDL cholesterol (mg/dL)" inputId="step-4-hdlCholesterol">
      <NumberInput id="step-4-hdlCholesterol" label="HDL cholesterol" min={10} max={200} bind:value={cl.hdlCholesterol} />
    </Field>
    <Field label="LDL cholesterol (mg/dL)" inputId="step-4-ldlCholesterol">
      <NumberInput id="step-4-ldlCholesterol" label="LDL cholesterol" min={10} max={400} bind:value={cl.ldlCholesterol} />
    </Field>
    <Field label="Triglycerides (mg/dL)" inputId="step-4-triglycerides">
      <NumberInput id="step-4-triglycerides" label="Triglycerides" min={10} max={1000} bind:value={cl.triglycerides} />
    </Field>
  </div>

  <Field label="Non-HDL cholesterol (mg/dL)" inputId="step-4-nonHdlCholesterol">
    <NumberInput
      id="step-4-nonHdlCholesterol"
      label="Non-HDL cholesterol"
      min={10}
      max={500}
      bind:value={cl.nonHdlCholesterol}
    />
  </Field>

  <Field label="On statin therapy?">
    <RadioGroup label="On statin therapy?">
      <label class="radio-input">
        <input type="radio" name="onStatin" value="yes" bind:group={cl.onStatin} /> Yes
      </label>
      <label class="radio-input">
        <input type="radio" name="onStatin" value="no" bind:group={cl.onStatin} /> No
      </label>
    </RadioGroup>
  </Field>

  {#if cl.onStatin === 'yes'}
    <Field label="Statin name" inputId="step-4-statinName">
      <TextInput id="step-4-statinName" label="Statin name" bind:value={cl.statinName} />
    </Field>
  {/if}
</Fieldset>
