<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateDLQI } from '$lib/engine/dlqi-grader';
	import { detectAdditionalFlags } from '$lib/engine/flagged-issues';
	import { steps, TOTAL_STEPS } from '$lib/config/steps';
	import { sampleAssessments } from '$lib/data/sample-reports';

	import Form from '$lib/components/ui/Form.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Progress from '$lib/components/ui/Progress.svelte';
	import StepList from '$lib/components/ui/StepList.svelte';
	import StepListItem from '$lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '$lib/components/ui/ErrorSummary.svelte';

	import Step1Demographics from '$lib/components/steps/Step1Demographics.svelte';
	import Step2ChiefComplaint from '$lib/components/steps/Step2ChiefComplaint.svelte';
	import Step3DLQIQuestionnaire from '$lib/components/steps/Step3DLQIQuestionnaire.svelte';
	import Step4LesionCharacteristics from '$lib/components/steps/Step4LesionCharacteristics.svelte';
	import Step5MedicalHistory from '$lib/components/steps/Step5MedicalHistory.svelte';
	import Step6CurrentMedications from '$lib/components/steps/Step6CurrentMedications.svelte';
	import Step7Allergies from '$lib/components/steps/Step7Allergies.svelte';
	import Step8FamilyHistory from '$lib/components/steps/Step8FamilyHistory.svelte';
	import Step9SocialHistory from '$lib/components/steps/Step9SocialHistory.svelte';

	let errors = $state<{ id: string; message: string }[]>([]);

	const id = $derived(page.params.id ?? 'new');
	const isNew = $derived(id === 'new');

	$effect(() => {
		const seed = sampleAssessments.find((s) => s.id === id)?.data;
		if (assessment.id !== id) {
			assessment.loadForId(id, seed);
			errors = [];
		}
	});

	function validate(): boolean {
		const d = assessment.data;
		const found: { id: string; message: string }[] = [];
		if (d.demographics.lastName.trim() === '') {
			found.push({ id: 'lastName', message: 'Patient last name is required.' });
		}
		if (d.demographics.dateOfBirth === '') {
			found.push({ id: 'dob', message: 'Date of birth is required.' });
		}
		errors = found;
		return found.length === 0;
	}

	function submit() {
		if (!validate()) {
			document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		const { dlqiScore, dlqiCategoryLabel, firedRules } = calculateDLQI(assessment.data);
		assessment.result = {
			dlqiScore,
			dlqiCategory: dlqiCategoryLabel,
			firedRules,
			additionalFlags: detectAdditionalFlags(assessment.data),
			timestamp: new Date().toISOString()
		};
		goto(`/dermatology-assessment/dermatology-assessments/${id}/report`);
	}

	function startOver() {
		const seed = sampleAssessments.find((s) => s.id === id)?.data;
		assessment.reset();
		assessment.loadForId(id, seed);
		errors = [];
	}
</script>

<main class="mx-16 px-4 py-6">
	<h1 class="text-2xl font-bold text-base-content">
		{isNew ? 'New dermatology assessment' : `Dermatology assessment ${id}`}
	</h1>
	<p class="mt-1 text-sm text-base-content/70">
		Complete the nine sections; the DLQI score and impact category are computed on submit.
	</p>
	<Progress label="Assessment sections" value={TOTAL_STEPS} max={TOTAL_STEPS} />
	<StepList label="Assessment sections" current={TOTAL_STEPS}>
		{#each steps as step (step.number)}
			<StepListItem status="finished" label={step.title}>{step.shortTitle}</StepListItem>
		{/each}
	</StepList>

	{#if errors.length > 0}
		<ErrorSummary title="Please fix the following before submitting" class="mb-6">
			<ul>
				{#each errors as e (e.id)}
					<li><a href={`#${e.id}`}>{e.message}</a></li>
				{/each}
			</ul>
		</ErrorSummary>
	{/if}

	<Form label="Dermatology assessment" onsubmit={submit}>
		<Step1Demographics />
		<Step2ChiefComplaint />
		<Step3DLQIQuestionnaire />
		<Step4LesionCharacteristics />
		<Step5MedicalHistory />
		<Step6CurrentMedications />
		<Step7Allergies />
		<Step8FamilyHistory />
		<Step9SocialHistory />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Compute DLQI &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
