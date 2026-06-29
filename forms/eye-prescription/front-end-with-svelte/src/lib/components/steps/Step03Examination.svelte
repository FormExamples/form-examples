<script lang="ts">
  import { assessment } from '$lib/stores/assessment.svelte';
  import StepCard from '$lib/components/ui/StepCard.svelte';
  import FormField from '$lib/components/ui/FormField.svelte';
  const input = 'input w-full';

  function onExamBlur(): void {
    if (!assessment.data.examination.issueDate && assessment.data.examination.examinationDate) {
      assessment.data.examination.issueDate = assessment.data.examination.examinationDate;
    }
    assessment.maybeSuggestExpiry();
  }
  function onIssueBlur(): void {
    assessment.maybeSuggestExpiry();
  }
</script>

<StepCard step={3} title="Examination details"
  description="Sight test date, issue date, expiry (default issue + 2 years; 1 year if < 16 or ≥ 70).">
  <div class="grid grid-cols-1 md:grid-cols-2 gap-x-4">
    <FormField label="Examination date" required>
      <input id="examinationDate" class={input} type="date" bind:value={assessment.data.examination.examinationDate} onblur={onExamBlur} />
    </FormField>
    <FormField label="Examination time">
      <input class={input} type="time" bind:value={assessment.data.examination.examinationTime} />
    </FormField>
    <FormField label="Issue date" required>
      <input id="issueDate" class={input} type="date" bind:value={assessment.data.examination.issueDate} onblur={onIssueBlur} />
    </FormField>
    <FormField label="Expiry date" required hint="Auto-suggested from age + issue date.">
      <input class={input} type="date" bind:value={assessment.data.examination.expiryDate} />
    </FormField>
    <FormField label="Reason for sight test">
      <select class={input} bind:value={assessment.data.examination.reasonForSightTest}>
        <option value="">—</option>
        <option value="routine">Routine</option>
        <option value="symptoms">Symptoms</option>
        <option value="follow-up">Follow-up</option>
        <option value="pre-employment">Pre-employment</option>
        <option value="driving-licence">Driving licence</option>
        <option value="after-pathology">After pathology</option>
        <option value="second-opinion">Second opinion</option>
        <option value="other">Other</option>
      </select>
    </FormField>
    <FormField label="Prior prescription date (if on file)">
      <input class={input} type="date" bind:value={assessment.data.examination.priorPrescriptionDate} />
    </FormField>
    <FormField label="Prior right sphere (for change detection)">
      <input class={input} type="number" step="0.25" min="-30" max="30" bind:value={assessment.data.examination.priorSphereRight} />
    </FormField>
    <FormField label="Prior left sphere">
      <input class={input} type="number" step="0.25" min="-30" max="30" bind:value={assessment.data.examination.priorSphereLeft} />
    </FormField>
  </div>
  <FormField label="Notes">
    <textarea class={input} rows="2" bind:value={assessment.data.examination.notes}></textarea>
  </FormField>
</StepCard>
