<script lang="ts">
  import { assessment } from '$lib/stores/assessment.svelte';
  import Fieldset from '$lib/components/ui/Fieldset.svelte';
  import Field from '$lib/components/ui/Field.svelte';
  import TextInput from '$lib/components/ui/TextInput.svelte';
  import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
  import DateInput from '$lib/components/ui/DateInput.svelte';
  import Select from '$lib/components/ui/Select.svelte';

  const rc = assessment.data.reviewCalculate;
  const data = assessment.data;
</script>

<Fieldset legend="Step 10 \u2014 Review and calculate">
  <p class="hint">Review the assessment summary and submit for risk calculation.</p>

  <Field label="PREVENT model type" inputId="step-10-modelType">
    <Select id="step-10-modelType" label="PREVENT model type" bind:value={rc.modelType}>
      <option value="">\u2014 Select \u2014</option>
      <option value="base">Base model (without HbA1c/uACR)</option>
      <option value="full">Full model (with HbA1c and uACR)</option>
    </Select>
  </Field>

  <Field label="Clinician name" inputId="step-10-clinicianName">
    <TextInput id="step-10-clinicianName" label="Clinician name" bind:value={rc.clinicianName} />
  </Field>

  <Field label="Review date" inputId="step-10-reviewDate">
    <DateInput id="step-10-reviewDate" label="Review date" bind:value={rc.reviewDate} />
  </Field>

  <Field label="Clinical notes" inputId="step-10-clinicalNotes">
    <TextAreaInput id="step-10-clinicalNotes" label="Clinical notes" rows={4} bind:value={rc.clinicalNotes} />
  </Field>

  <div class="summary-box">
    <p><strong>Assessment summary</strong></p>
    <p><strong>Patient:</strong> {data.patientInformation.fullName || 'Not provided'}</p>
    <p><strong>Age / sex:</strong> {data.demographics.age ?? 'N/A'} / {data.demographics.sex || 'N/A'}</p>
    <p><strong>Systolic BP:</strong> {data.bloodPressure.systolicBp ?? 'N/A'}</p>
    <p><strong>Total cholesterol:</strong> {data.cholesterolLipids.totalCholesterol ?? 'N/A'}</p>
    <p><strong>Diabetes:</strong> {data.metabolicHealth.hasDiabetes || 'N/A'}</p>
    <p><strong>Smoking:</strong> {data.smokingHistory.smokingStatus || 'N/A'}</p>
    <p><strong>eGFR:</strong> {data.renalFunction.egfr ?? 'N/A'}</p>
    <p><strong>Known CVD:</strong> {data.medicalHistory.hasKnownCvd || 'N/A'}</p>
  </div>
</Fieldset>
