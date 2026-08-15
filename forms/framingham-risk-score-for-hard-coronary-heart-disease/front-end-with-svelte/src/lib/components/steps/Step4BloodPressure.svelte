<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import NumberInput from '#lib/components/ui/NumberInput.svelte';
  import TextInput from '#lib/components/ui/TextInput.svelte';
  import Select from '#lib/components/ui/Select.svelte';
  import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

  const bp = assessment.data.bloodPressure;
</script>

<Fieldset legend="Step 4 \u2014 Blood pressure">
  <p class="hint">Blood pressure and treatment status affect the risk calculation.</p>

  <div class="field-grid">
    <Field label="Systolic BP (mmHg)" inputId="step-4-systolicBp">
      <NumberInput
        id="step-4-systolicBp"
        label="Systolic BP (mmHg)"
        min={60}
        max={300}
        bind:value={bp.systolicBp}
      />
    </Field>
    <Field label="Diastolic BP (mmHg)" inputId="step-4-diastolicBp">
      <NumberInput
        id="step-4-diastolicBp"
        label="Diastolic BP (mmHg)"
        min={30}
        max={200}
        bind:value={bp.diastolicBp}
      />
    </Field>
  </div>

  <Field label="Currently on blood pressure treatment?">
    <RadioGroup label="Currently on blood pressure treatment?">
      <label class="radio-input">
        <input type="radio" name="onBpTreatment" value="yes" bind:group={bp.onBpTreatment} /> Yes
      </label>
      <label class="radio-input">
        <input type="radio" name="onBpTreatment" value="no" bind:group={bp.onBpTreatment} /> No
      </label>
    </RadioGroup>
  </Field>

  <div class="field-grid">
    <Field label="BP medication name" inputId="step-4-bpMedicationName">
      <TextInput
        id="step-4-bpMedicationName"
        label="BP medication name"
        bind:value={bp.bpMedicationName}
      />
    </Field>
    <Field label="Measurement method" inputId="step-4-bpMeasurementMethod">
      <Select
        id="step-4-bpMeasurementMethod"
        label="Measurement method"
        bind:value={bp.bpMeasurementMethod}
      >
        <option value="">\u2014 Select \u2014</option>
        <option value="clinic">Clinic reading</option>
        <option value="ambulatory">Ambulatory (24h)</option>
        <option value="home">Home monitoring</option>
      </Select>
    </Field>
  </div>
</Fieldset>
