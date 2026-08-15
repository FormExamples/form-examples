<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import TextInput from '#lib/components/ui/TextInput.svelte';
  import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
  import DateInput from '#lib/components/ui/DateInput.svelte';
  import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

  const r = assessment.data.reviewCalculate;
  const data = assessment.data;
</script>

<Fieldset legend="Step 10 \u2014 Review and calculate">
  <p class="hint">Review the assessment and provide clinician details before calculating the Framingham Risk Score.</p>

  <div class="field-grid">
    <Field label="Clinician name" inputId="step-10-clinicianName">
      <TextInput id="step-10-clinicianName" label="Clinician name" bind:value={r.clinicianName} />
    </Field>
    <Field label="Review date" inputId="step-10-reviewDate">
      <DateInput id="step-10-reviewDate" label="Review date" bind:value={r.reviewDate} />
    </Field>
  </div>

  <Field label="Clinical notes" inputId="step-10-clinicalNotes">
    <TextAreaInput
      id="step-10-clinicalNotes"
      label="Clinical notes"
      rows={4}
      bind:value={r.clinicalNotes}
    />
  </Field>

  <Field label="Patient consent obtained?">
    <RadioGroup label="Patient consent obtained?">
      <label class="radio-input">
        <input type="radio" name="patientConsent" value="yes" bind:group={r.patientConsent} /> Yes
      </label>
      <label class="radio-input">
        <input type="radio" name="patientConsent" value="no" bind:group={r.patientConsent} /> No
      </label>
    </RadioGroup>
  </Field>

  <div class="summary-box">
    <p><strong>Key inputs summary</strong></p>
    <p><strong>Age:</strong> {data.demographics.age ?? 'Not set'}</p>
    <p><strong>Sex:</strong> {data.demographics.sex || 'Not set'}</p>
    <p><strong>Smoking:</strong> {data.smokingHistory.smokingStatus || 'Not set'}</p>
    <p><strong>BP treatment:</strong> {data.bloodPressure.onBpTreatment || 'Not set'}</p>
    <p><strong>Systolic BP:</strong> {data.bloodPressure.systolicBp ?? 'Not set'}</p>
    <p><strong>Total cholesterol:</strong> {data.cholesterol.totalCholesterol ?? 'Not set'}</p>
    <p><strong>HDL:</strong> {data.cholesterol.hdlCholesterol ?? 'Not set'}</p>
    <p><strong>Diabetes:</strong> {data.medicalHistory.hasDiabetes || 'Not set'}</p>
  </div>
</Fieldset>
