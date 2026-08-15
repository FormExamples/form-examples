<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import NumberInput from '#lib/components/ui/NumberInput.svelte';
  import Select from '#lib/components/ui/Select.svelte';
  import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

  const c = assessment.data.cholesterol;
</script>

<Fieldset legend="Step 5 \u2014 Cholesterol">
  <p class="hint">Total cholesterol and HDL are required for the Framingham calculation.</p>

  <Field label="Cholesterol unit" inputId="step-5-cholesterolUnit">
    <Select id="step-5-cholesterolUnit" label="Cholesterol unit" bind:value={c.cholesterolUnit}>
      <option value="mgDl">mg/dL</option>
      <option value="mmolL">mmol/L</option>
    </Select>
  </Field>

  <div class="field-grid">
    <Field label="Total cholesterol" inputId="step-5-totalCholesterol">
      <NumberInput
        id="step-5-totalCholesterol"
        label="Total cholesterol"
        step="0.1"
        min={0}
        bind:value={c.totalCholesterol}
      />
    </Field>
    <Field label="HDL cholesterol" inputId="step-5-hdlCholesterol">
      <NumberInput
        id="step-5-hdlCholesterol"
        label="HDL cholesterol"
        step="0.1"
        min={0}
        bind:value={c.hdlCholesterol}
      />
    </Field>
    <Field label="LDL cholesterol (optional)" inputId="step-5-ldlCholesterol">
      <NumberInput
        id="step-5-ldlCholesterol"
        label="LDL cholesterol"
        step="0.1"
        min={0}
        bind:value={c.ldlCholesterol}
      />
    </Field>
    <Field label="Triglycerides (optional)" inputId="step-5-triglycerides">
      <NumberInput
        id="step-5-triglycerides"
        label="Triglycerides"
        step="0.1"
        min={0}
        bind:value={c.triglycerides}
      />
    </Field>
  </div>

  <Field label="Fasting sample?">
    <RadioGroup label="Fasting sample?">
      <label class="radio-input">
        <input type="radio" name="fastingSample" value="yes" bind:group={c.fastingSample} /> Yes
      </label>
      <label class="radio-input">
        <input type="radio" name="fastingSample" value="no" bind:group={c.fastingSample} /> No
      </label>
    </RadioGroup>
  </Field>
</Fieldset>
