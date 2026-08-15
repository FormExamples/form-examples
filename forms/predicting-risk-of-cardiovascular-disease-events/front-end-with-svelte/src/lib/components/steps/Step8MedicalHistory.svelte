<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
  import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

  const mh = assessment.data.medicalHistory;
</script>

<Fieldset legend="Step 8 \u2014 Medical history">
  <p class="hint">Existing cardiovascular conditions and family history.</p>

  <Field label="Has known cardiovascular disease?" required>
    <RadioGroup label="Has known cardiovascular disease?">
      <label class="radio-input">
        <input type="radio" name="hasKnownCvd" value="yes" bind:group={mh.hasKnownCvd} /> Yes
      </label>
      <label class="radio-input">
        <input type="radio" name="hasKnownCvd" value="no" bind:group={mh.hasKnownCvd} /> No
      </label>
    </RadioGroup>
  </Field>

  {#if mh.hasKnownCvd === 'yes'}
    <Field label="Previous myocardial infarction (MI)?">
      <RadioGroup label="Previous myocardial infarction (MI)?">
        <label class="radio-input">
          <input type="radio" name="previousMi" value="yes" bind:group={mh.previousMi} /> Yes
        </label>
        <label class="radio-input">
          <input type="radio" name="previousMi" value="no" bind:group={mh.previousMi} /> No
        </label>
      </RadioGroup>
    </Field>
    <Field label="Previous stroke?">
      <RadioGroup label="Previous stroke?">
        <label class="radio-input">
          <input type="radio" name="previousStroke" value="yes" bind:group={mh.previousStroke} /> Yes
        </label>
        <label class="radio-input">
          <input type="radio" name="previousStroke" value="no" bind:group={mh.previousStroke} /> No
        </label>
      </RadioGroup>
    </Field>
    <Field label="Heart failure?">
      <RadioGroup label="Heart failure?">
        <label class="radio-input">
          <input type="radio" name="heartFailure" value="yes" bind:group={mh.heartFailure} /> Yes
        </label>
        <label class="radio-input">
          <input type="radio" name="heartFailure" value="no" bind:group={mh.heartFailure} /> No
        </label>
      </RadioGroup>
    </Field>
    <Field label="Peripheral arterial disease?">
      <RadioGroup label="Peripheral arterial disease?">
        <label class="radio-input">
          <input type="radio" name="peripheralArterialDisease" value="yes" bind:group={mh.peripheralArterialDisease} /> Yes
        </label>
        <label class="radio-input">
          <input type="radio" name="peripheralArterialDisease" value="no" bind:group={mh.peripheralArterialDisease} /> No
        </label>
      </RadioGroup>
    </Field>
  {/if}

  <Field label="Atrial fibrillation?">
    <RadioGroup label="Atrial fibrillation?">
      <label class="radio-input">
        <input type="radio" name="atrialFibrillation" value="yes" bind:group={mh.atrialFibrillation} /> Yes
      </label>
      <label class="radio-input">
        <input type="radio" name="atrialFibrillation" value="no" bind:group={mh.atrialFibrillation} /> No
      </label>
    </RadioGroup>
  </Field>

  <Field label="Family history of premature CVD?">
    <RadioGroup label="Family history of premature CVD?">
      <label class="radio-input">
        <input type="radio" name="familyCvdHistory" value="yes" bind:group={mh.familyCvdHistory} /> Yes
      </label>
      <label class="radio-input">
        <input type="radio" name="familyCvdHistory" value="no" bind:group={mh.familyCvdHistory} /> No
      </label>
    </RadioGroup>
  </Field>

  {#if mh.familyCvdHistory === 'yes'}
    <Field label="Family CVD details" inputId="step-8-familyCvdDetails">
      <TextAreaInput
        id="step-8-familyCvdDetails"
        label="Family CVD details"
        rows={3}
        bind:value={mh.familyCvdDetails}
      />
    </Field>
  {/if}
</Fieldset>
