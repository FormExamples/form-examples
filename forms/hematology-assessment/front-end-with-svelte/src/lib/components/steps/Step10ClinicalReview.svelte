<script lang="ts">
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';

	import { assessment } from '$lib/stores/assessment.svelte';

	const d = assessment.data.clinicalReview;
</script>

<Fieldset legend="Clinical Review">
	<p class="hint">Provide the clinical summary, diagnosis, and follow-up plan</p>
	<Field label="Clinical Summary" inputId="clinicalSummary"><TextAreaInput id="clinicalSummary" label="Clinical Summary" rows={4} placeholder="Summarise key clinical findings and their significance" bind:value={d.clinicalSummary} /></Field>
	<Field label="Diagnosis" inputId="diagnosis"><TextAreaInput id="diagnosis" label="Diagnosis" rows={2} placeholder="e.g. Iron deficiency anemia, chronic disease" bind:value={d.diagnosis} /></Field>
	<Field label="Follow-up Plan" inputId="followUpPlan"><TextAreaInput id="followUpPlan" label="Follow-up Plan" placeholder="e.g. Repeat CBC in 4 weeks, iron studies in 3 months" bind:value={d.followUpPlan} /></Field>

	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<Field label="Urgency Level (1-5)" inputId="urgencyLevel"><Select id="urgencyLevel" label="Urgency Level (1-5)" bind:value={d.urgencyLevel as unknown as string}><option value="">-- Select --</option>{#each [
				{ value: '1', label: '1 - Routine' },
				{ value: '2', label: '2 - Non-Urgent Follow-up' },
				{ value: '3', label: '3 - Semi-Urgent' },
				{ value: '4', label: '4 - Urgent' },
				{ value: '5', label: '5 - Critical/Emergency' }
			] as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}</Select></Field>
		<Field label="Reviewer Name" inputId="reviewerName"><TextInput id="reviewerName" label="Reviewer Name" placeholder="e.g. Dr Patel" bind:value={d.reviewerName} /></Field>
	</div>

	<Field label="Review Date" inputId="reviewDate"><DateInput id="reviewDate" label="Review Date" bind:value={d.reviewDate} /></Field>
	<Field label="Additional Notes" inputId="additionalNotes"><TextAreaInput id="additionalNotes" label="Additional Notes" placeholder="Any additional clinical notes or observations" bind:value={d.additionalNotes} /></Field>
</Fieldset>
