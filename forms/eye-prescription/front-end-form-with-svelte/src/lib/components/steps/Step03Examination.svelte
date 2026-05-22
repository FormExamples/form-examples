<script lang="ts">
  import { store } from '$lib/stores/prescription.svelte.js';
  import StepCard from '$lib/components/ui/StepCard.svelte';
  import FormField from '$lib/components/ui/FormField.svelte';
  const input = 'block w-full rounded border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500';

  function onExamBlur(): void {
    if (!store.data.examination.issueDate && store.data.examination.examinationDate) {
      store.data.examination.issueDate = store.data.examination.examinationDate;
    }
    store.maybeSuggestExpiry();
  }
  function onIssueBlur(): void {
    store.maybeSuggestExpiry();
  }
</script>

<StepCard step={3} title="Examination details"
  description="Sight test date, issue date, expiry (default issue + 2 years; 1 year if < 16 or ≥ 70).">
  <div class="grid grid-cols-1 md:grid-cols-2 gap-x-4">
    <FormField label="Examination date" required>
      <input class={input} type="date" bind:value={store.data.examination.examinationDate} onblur={onExamBlur} />
    </FormField>
    <FormField label="Examination time">
      <input class={input} type="time" bind:value={store.data.examination.examinationTime} />
    </FormField>
    <FormField label="Issue date" required>
      <input class={input} type="date" bind:value={store.data.examination.issueDate} onblur={onIssueBlur} />
    </FormField>
    <FormField label="Expiry date" required hint="Auto-suggested from age + issue date.">
      <input class={input} type="date" bind:value={store.data.examination.expiryDate} />
    </FormField>
    <FormField label="Reason for sight test">
      <select class={input} bind:value={store.data.examination.reasonForSightTest}>
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
      <input class={input} type="date" bind:value={store.data.examination.priorPrescriptionDate} />
    </FormField>
    <FormField label="Prior right sphere (for change detection)">
      <input class={input} type="number" step="0.25" min="-30" max="30" bind:value={store.data.examination.priorSphereRight} />
    </FormField>
    <FormField label="Prior left sphere">
      <input class={input} type="number" step="0.25" min="-30" max="30" bind:value={store.data.examination.priorSphereLeft} />
    </FormField>
  </div>
  <FormField label="Notes">
    <textarea class={input} rows="2" bind:value={store.data.examination.notes}></textarea>
  </FormField>
</StepCard>
