<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import NumberInput from '#lib/components/ui/NumberInput.svelte';
  import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
  import Alert from '#lib/components/ui/Alert.svelte';
  import { calculateTcHdlRatio } from '#lib/engine/utils.js';

  const d = assessment.data.cholesterol;

  const autoRatio = $derived(
    d.totalHDLRatio ?? calculateTcHdlRatio(d.totalCholesterol, d.hdlCholesterol)
  );
</script>

<Fieldset legend="Step 4 \u2014 Cholesterol">
  <p class="hint">Lipid profile and statin status.</p>

  <div class="field-grid">
    <Field label="Total cholesterol (mmol/L)" inputId="step-4-totalCholesterol">
      <NumberInput
        id="step-4-totalCholesterol"
        label="Total cholesterol"
        min={1}
        max={15}
        step="0.1"
        bind:value={d.totalCholesterol}
      />
    </Field>
    <Field label="HDL cholesterol (mmol/L)" inputId="step-4-hdlCholesterol">
      <NumberInput
        id="step-4-hdlCholesterol"
        label="HDL cholesterol"
        min={0.2}
        max={5}
        step="0.1"
        bind:value={d.hdlCholesterol}
      />
    </Field>
  </div>

  {#if autoRatio != null}
    <Alert type="info">
      <p><strong>TC/HDL ratio:</strong> {autoRatio}</p>
    </Alert>
  {/if}

  <Field label="TC/HDL ratio (override)" inputId="step-4-totalHDLRatio">
    <NumberInput
      id="step-4-totalHDLRatio"
      label="TC/HDL ratio"
      min={1}
      max={20}
      step="0.1"
      bind:value={d.totalHDLRatio}
    />
  </Field>

  <Field label="Currently on statin?">
    <RadioGroup label="Currently on statin?">
      <label class="radio-input">
        <input type="radio" name="onStatin" value="yes" bind:group={d.onStatin} /> Yes
      </label>
      <label class="radio-input">
        <input type="radio" name="onStatin" value="no" bind:group={d.onStatin} /> No
      </label>
    </RadioGroup>
  </Field>
</Fieldset>
