<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import Select from '#lib/components/ui/Select.svelte';
  import DateInput from '#lib/components/ui/DateInput.svelte';

  const p = assessment.data.medical;
</script>

<Fieldset legend="Step 2 of 6 — Medical certificate and medical examiner">
  <p class="hint">
    A doctor completes the medical certificate of cause of death (MCCD); the medical examiner’s
    office must then confirm that the death can be registered. The 5-day clock starts at that
    confirmation.
  </p>

  <Field label="Has the register office received the MCCD?" inputId="medical-mccdReceived">
    <Select
      id="medical-mccdReceived"
      label="Has the register office received the MCCD?"
      bind:value={p.mccdReceived}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
  <Field label="Medical examiner status" inputId="medical-medicalExaminerStatus">
    <Select
      id="medical-medicalExaminerStatus"
      label="Medical examiner status"
      bind:value={p.medicalExaminerStatus}
    >
      <option value="">— Select —</option>
      <option value="confirmed">Confirmed - the death can be registered</option>
      <option value="pending">Awaiting the medical examiner</option>
    </Select>
  </Field>
  <Field
    label="Date the medical examiner confirmed"
    inputId="medical-medicalExaminerConfirmationDate"
  >
    <DateInput
      id="medical-medicalExaminerConfirmationDate"
      label="Date the medical examiner confirmed"
      bind:value={p.medicalExaminerConfirmationDate}
    />
  </Field>
  <p class="hint">
    The death must be registered within 5 days of this date, counting weekends and bank holidays.
  </p>
</Fieldset>
