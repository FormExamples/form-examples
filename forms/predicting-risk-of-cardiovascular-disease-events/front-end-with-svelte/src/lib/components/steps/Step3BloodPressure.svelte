<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import NumberInput from '#lib/components/ui/NumberInput.svelte';
  import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

  const bp = assessment.data.bloodPressure;
</script>

<Fieldset legend="Step 3 \u2014 Blood pressure">
  <p class="hint">Blood pressure readings and antihypertensive treatment status.</p>

  <div class="field-grid">
    <Field label="Systolic BP (mmHg)" inputId="step-3-systolicBp" required>
      <NumberInput id="step-3-systolicBp" label="Systolic BP" min={60} max={300} bind:value={bp.systolicBp} />
    </Field>
    <Field label="Diastolic BP (mmHg)" inputId="step-3-diastolicBp" required>
      <NumberInput id="step-3-diastolicBp" label="Diastolic BP" min={30} max={200} bind:value={bp.diastolicBp} />
    </Field>
  </div>

  <Field label="On antihypertensive medication?">
    <RadioGroup label="On antihypertensive medication?">
      <label class="radio-input">
        <input type="radio" name="onAntihypertensive" value="yes" bind:group={bp.onAntihypertensive} /> Yes
      </label>
      <label class="radio-input">
        <input type="radio" name="onAntihypertensive" value="no" bind:group={bp.onAntihypertensive} /> No
      </label>
    </RadioGroup>
  </Field>

  {#if bp.onAntihypertensive === 'yes'}
    <Field label="Number of BP medications" inputId="step-3-numberOfBpMedications">
      <NumberInput
        id="step-3-numberOfBpMedications"
        label="Number of BP medications"
        min={1}
        max={10}
        bind:value={bp.numberOfBpMedications}
      />
    </Field>
  {/if}

  <Field label="Blood pressure at target?">
    <RadioGroup label="Blood pressure at target?">
      <label class="radio-input">
        <input type="radio" name="bpAtTarget" value="yes" bind:group={bp.bpAtTarget} /> Yes
      </label>
      <label class="radio-input">
        <input type="radio" name="bpAtTarget" value="no" bind:group={bp.bpAtTarget} /> No
      </label>
      <label class="radio-input">
        <input type="radio" name="bpAtTarget" value="unknown" bind:group={bp.bpAtTarget} /> Unknown
      </label>
    </RadioGroup>
  </Field>
</Fieldset>
