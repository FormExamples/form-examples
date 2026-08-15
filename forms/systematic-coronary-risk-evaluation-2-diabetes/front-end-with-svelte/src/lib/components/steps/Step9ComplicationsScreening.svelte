<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import NumberInput from '#lib/components/ui/NumberInput.svelte';
  import DateInput from '#lib/components/ui/DateInput.svelte';
  import Select from '#lib/components/ui/Select.svelte';
  import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

  const d = assessment.data.complicationsScreening;
</script>

<Fieldset legend="Step 9 \u2014 Complications screening">
  <div class="field-grid">
    <Field label="Retinopathy status" inputId="step-9-retinopathyStatus">
      <Select id="step-9-retinopathyStatus" label="Retinopathy status" bind:value={d.retinopathyStatus}>
        <option value="">\u2014 Select \u2014</option>
        <option value="none">None</option>
        <option value="background">Background (R1)</option>
        <option value="preProliferative">Pre-proliferative (R2)</option>
        <option value="proliferative">Proliferative (R3)</option>
        <option value="maculopathy">Maculopathy (M1)</option>
        <option value="notScreened">Not yet screened</option>
      </Select>
    </Field>
    <Field label="Last eye screening date" inputId="step-9-lastEyeScreeningDate">
      <DateInput
        id="step-9-lastEyeScreeningDate"
        label="Last eye screening date"
        bind:value={d.lastEyeScreeningDate}
      />
    </Field>
  </div>

  <Field
    label="Neuropathy symptoms"
    description="e.g. numbness, tingling, burning sensation in feet"
  >
    <RadioGroup label="Neuropathy symptoms">
      <label class="radio-input">
        <input type="radio" name="neuropathySymptoms" value="yes" bind:group={d.neuropathySymptoms} /> Yes
      </label>
      <label class="radio-input">
        <input type="radio" name="neuropathySymptoms" value="no" bind:group={d.neuropathySymptoms} /> No
      </label>
    </RadioGroup>
  </Field>

  <Field label="10g monofilament test" inputId="step-9-monofilamentTest">
    <Select id="step-9-monofilamentTest" label="10g monofilament test" bind:value={d.monofilamentTest}>
      <option value="">\u2014 Select \u2014</option>
      <option value="normal">Normal</option>
      <option value="abnormal">Abnormal</option>
      <option value="notDone">Not done</option>
    </Select>
  </Field>

  <div class="field-grid">
    <Field label="Foot pulses" inputId="step-9-footPulses">
      <Select id="step-9-footPulses" label="Foot pulses" bind:value={d.footPulses}>
        <option value="">\u2014 Select \u2014</option>
        <option value="normal">Normal (palpable bilaterally)</option>
        <option value="absent">Absent or diminished</option>
        <option value="notChecked">Not checked</option>
      </Select>
    </Field>
    <Field label="Ankle-Brachial Index (ABI)" inputId="step-9-ankleBrachialIndex">
      <NumberInput
        id="step-9-ankleBrachialIndex"
        label="Ankle-Brachial Index"
        min={0}
        max={2}
        step="0.01"
        bind:value={d.ankleBrachialIndex}
      />
    </Field>
  </div>

  <Field label="History of foot ulcer">
    <RadioGroup label="History of foot ulcer">
      <label class="radio-input">
        <input type="radio" name="footUlcerHistory" value="yes" bind:group={d.footUlcerHistory} /> Yes
      </label>
      <label class="radio-input">
        <input type="radio" name="footUlcerHistory" value="no" bind:group={d.footUlcerHistory} /> No
      </label>
    </RadioGroup>
  </Field>

  <Field label="Erectile dysfunction">
    <RadioGroup label="Erectile dysfunction">
      <label class="radio-input">
        <input type="radio" name="erectileDysfunction" value="yes" bind:group={d.erectileDysfunction} /> Yes
      </label>
      <label class="radio-input">
        <input type="radio" name="erectileDysfunction" value="no" bind:group={d.erectileDysfunction} /> No
      </label>
      <label class="radio-input">
        <input type="radio" name="erectileDysfunction" value="notApplicable" bind:group={d.erectileDysfunction} /> Not applicable
      </label>
    </RadioGroup>
  </Field>
</Fieldset>
