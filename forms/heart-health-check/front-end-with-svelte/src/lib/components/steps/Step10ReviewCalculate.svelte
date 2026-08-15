<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import TextInput from '#lib/components/ui/TextInput.svelte';
  import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
  import DateInput from '#lib/components/ui/DateInput.svelte';
  import NumberInput from '#lib/components/ui/NumberInput.svelte';
  import Alert from '#lib/components/ui/Alert.svelte';

  const d = assessment.data.reviewCalculate;
</script>

<Fieldset legend="Step 10 \u2014 Review and calculate">
  <p class="hint">Clinician details and final review before risk calculation.</p>

  <div class="field-grid">
    <Field label="Clinician name" inputId="step-10-clinicianName">
      <TextInput id="step-10-clinicianName" label="Clinician name" bind:value={d.clinicianName} />
    </Field>
    <Field label="Review date" inputId="step-10-reviewDate">
      <DateInput id="step-10-reviewDate" label="Review date" bind:value={d.reviewDate} />
    </Field>
  </div>

  <Field label="Clinical notes" inputId="step-10-clinicalNotes">
    <TextAreaInput
      id="step-10-clinicalNotes"
      label="Clinical notes"
      rows={4}
      bind:value={d.clinicalNotes}
    />
  </Field>

  <Field label="AUDIT score" inputId="step-10-auditScore">
    <NumberInput
      id="step-10-auditScore"
      label="AUDIT score"
      min={0}
      max={40}
      bind:value={d.auditScore}
    />
  </Field>

  <Alert type="info" heading="Ready to calculate?">
    <p>Click "Submit and view report" below to calculate the 10-year CVD risk, heart age, and review any flagged issues.</p>
  </Alert>
</Fieldset>
