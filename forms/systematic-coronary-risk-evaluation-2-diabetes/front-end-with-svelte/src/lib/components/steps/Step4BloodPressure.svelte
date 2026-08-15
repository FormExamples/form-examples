<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import NumberInput from '#lib/components/ui/NumberInput.svelte';
  import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

  const d = assessment.data.bloodPressure;
</script>

<Fieldset legend="Step 4 \u2014 Blood pressure">
  <div class="field-grid">
    <Field label="Systolic BP (mmHg)" inputId="step-4-systolicBp">
      <NumberInput id="step-4-systolicBp" label="Systolic BP" min={60} max={300} bind:value={d.systolicBp} />
    </Field>
    <Field label="Diastolic BP (mmHg)" inputId="step-4-diastolicBp">
      <NumberInput id="step-4-diastolicBp" label="Diastolic BP" min={30} max={200} bind:value={d.diastolicBp} />
    </Field>
  </div>

  <Field label="On antihypertensive medication">
    <RadioGroup label="On antihypertensive medication">
      <label class="radio-input">
        <input type="radio" name="onAntihypertensive" value="yes" bind:group={d.onAntihypertensive} /> Yes
      </label>
      <label class="radio-input">
        <input type="radio" name="onAntihypertensive" value="no" bind:group={d.onAntihypertensive} /> No
      </label>
    </RadioGroup>
  </Field>

  {#if d.onAntihypertensive === 'yes'}
    <Field label="Number of BP medications" inputId="step-4-numberOfBpMedications">
      <NumberInput
        id="step-4-numberOfBpMedications"
        label="Number of BP medications"
        min={1}
        max={10}
        bind:value={d.numberOfBpMedications}
      />
    </Field>
  {/if}

  <Field label="Blood pressure at target" description="Target: <130/80 mmHg for most diabetes patients (ESC 2023)">
    <RadioGroup label="Blood pressure at target">
      <label class="radio-input">
        <input type="radio" name="bpAtTarget" value="yes" bind:group={d.bpAtTarget} /> Yes
      </label>
      <label class="radio-input">
        <input type="radio" name="bpAtTarget" value="no" bind:group={d.bpAtTarget} /> No
      </label>
    </RadioGroup>
  </Field>

  <Field label="Home blood pressure monitoring">
    <RadioGroup label="Home blood pressure monitoring">
      <label class="radio-input">
        <input type="radio" name="homeBpMonitoring" value="yes" bind:group={d.homeBpMonitoring} /> Yes
      </label>
      <label class="radio-input">
        <input type="radio" name="homeBpMonitoring" value="no" bind:group={d.homeBpMonitoring} /> No
      </label>
    </RadioGroup>
  </Field>
</Fieldset>
