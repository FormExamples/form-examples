<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import SectionCard from '$lib/components/ui/SectionCard.svelte';
	import YesNoQuestion from '$lib/components/ui/YesNoQuestion.svelte';

	const d = assessment.data.diagnosisConfirmation;
</script>

<SectionCard
	title="Question 1 — Diagnosis Confirmation"
	description="Medical Questionnaire — Mental Health"
>
	<YesNoQuestion
		label="Have you been diagnosed with a mental health condition?"
		name="hasMentalHealthDiagnosis"
		bind:value={d.hasMentalHealthDiagnosis}
		required
	/>

	{#if d.hasMentalHealthDiagnosis === 'no'}
		<div
			class="mt-2 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900"
		>
			You answered <strong>No</strong>. The DVLA instructions ask you not to complete the
			rest of this form. You can still continue to the authorisation step to
			submit, or start over.
		</div>
	{/if}
</SectionCard>
