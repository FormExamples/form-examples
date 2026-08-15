<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
  import Select from '#lib/components/ui/Select.svelte';

  const d = assessment.data.riskAssessmentSummary;
</script>

<Fieldset legend="Step 10 \u2014 Risk assessment summary">
  <Field
    label="Risk region"
    description="Select the ESC cardiovascular risk region for the patient's country of origin"
    inputId="step-10-riskRegion"
  >
    <Select id="step-10-riskRegion" label="Risk region" bind:value={d.riskRegion}>
      <option value="">\u2014 Select \u2014</option>
      <option value="low">Low risk (e.g. France, Spain, Greece)</option>
      <option value="moderate">Moderate risk (e.g. Germany, UK, Netherlands)</option>
      <option value="high">High risk (e.g. Poland, Czech Republic)</option>
      <option value="veryHigh">Very high risk (e.g. Lithuania, Latvia, Russia)</option>
    </Select>
  </Field>

  <Field
    label="Additional risk factors"
    description="Note any risk factors not captured in previous steps"
    inputId="step-10-additionalRiskFactors"
  >
    <TextAreaInput
      id="step-10-additionalRiskFactors"
      label="Additional risk factors"
      rows={3}
      bind:value={d.additionalRiskFactors}
    />
  </Field>

  <Field label="Clinical notes" inputId="step-10-clinicalNotes">
    <TextAreaInput
      id="step-10-clinicalNotes"
      label="Clinical notes"
      rows={4}
      bind:value={d.clinicalNotes}
    />
  </Field>

  <Field
    label="Agreed treatment targets"
    description="Document shared decision-making treatment targets with the patient"
    inputId="step-10-agreedTreatmentTargets"
  >
    <TextAreaInput
      id="step-10-agreedTreatmentTargets"
      label="Agreed treatment targets"
      rows={3}
      bind:value={d.agreedTreatmentTargets}
    />
  </Field>

  <Field label="Follow-up interval" inputId="step-10-followUpInterval">
    <Select id="step-10-followUpInterval" label="Follow-up interval" bind:value={d.followUpInterval}>
      <option value="">\u2014 Select \u2014</option>
      <option value="3months">3 months</option>
      <option value="6months">6 months</option>
      <option value="12months">12 months</option>
    </Select>
  </Field>
</Fieldset>
