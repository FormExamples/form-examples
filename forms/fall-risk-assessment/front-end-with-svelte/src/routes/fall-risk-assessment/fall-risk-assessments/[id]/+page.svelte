<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateFallRiskGrade } from '$lib/engine/fall-risk-grader';
	import { steps, TOTAL_STEPS } from '$lib/config/steps';
	import { sampleAssessments } from '$lib/data/sample-reports';

	import Form from '$lib/components/ui/Form.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Progress from '$lib/components/ui/Progress.svelte';
	import StepList from '$lib/components/ui/StepList.svelte';
	import StepListItem from '$lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '$lib/components/ui/ErrorSummary.svelte';

	import Step1Demographics from '$lib/components/steps/Step1Demographics.svelte';
	import Step2FallHistory from '$lib/components/steps/Step2FallHistory.svelte';
	import Step3MorseFallScale from '$lib/components/steps/Step3MorseFallScale.svelte';
	import Step4MobilityGait from '$lib/components/steps/Step4MobilityGait.svelte';
	import Step5MedicationReview from '$lib/components/steps/Step5MedicationReview.svelte';
	import Step6VisionSensory from '$lib/components/steps/Step6VisionSensory.svelte';
	import Step7Environmental from '$lib/components/steps/Step7Environmental.svelte';
	import Step8Cognitive from '$lib/components/steps/Step8Cognitive.svelte';
	import Step9PreviousInterventions from '$lib/components/steps/Step9PreviousInterventions.svelte';
	import Step10FallPreventionPlan from '$lib/components/steps/Step10FallPreventionPlan.svelte';

	let errors = $state<{ id: string; message: string }[]>([]);

	const id = $derived(page.params.id ?? 'new');
	const isNew = $derived(id === 'new');

	// Hydrate the wizard whenever the route id changes: a saved draft for that id
	// wins, otherwise seed from the matching sample assessment (existing id) or a
	// blank draft (new).
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
		assessment.result = calculateFallRiskGrade(assessment.data);
		goto(`/fall-risk-assessment/fall-risk-assessments/${id}/report`);
	}

	function startOver() {
		const seed = sampleAssessments.find((s) => s.id === id)?.data;
		assessment.reset();
		assessment.loadForId(id, seed);
		errors = [];
	}
</script>

<main class="mx-auto max-w-3xl px-4 py-6">
	<header class="mb-6 no-print">
		<h1 class="text-2xl font-bold text-base-content">
			{isNew ? 'New fall-risk assessment' : `Fall-risk assessment ${id}`}
		</h1>
		<p class="mt-1 text-sm text-base-content/70">
			Complete the ten sections; the Morse Fall Scale total and risk level are computed on submit.
		</p>
		<Progress label="Assessment sections" value={TOTAL_STEPS} max={TOTAL_STEPS} />
		<StepList label="Assessment sections" current={TOTAL_STEPS}>
			{#each steps as step (step.number)}
				<StepListItem status="finished" label={step.title}>{step.shortTitle}</StepListItem>
			{/each}
		</StepList>
	</header>

	{#if errors.length > 0}
		<ErrorSummary title="Please fix the following before submitting" class="mb-6">
			<ul>
				{#each errors as e (e.id)}
					<li><a href={`#${e.id}`}>{e.message}</a></li>
				{/each}
			</ul>
		</ErrorSummary>
	{/if}

	<Form label="Fall-risk assessment" onsubmit={submit}>
		<Step1Demographics />
		<Step2FallHistory />
		<Step3MorseFallScale />
		<Step4MobilityGait />
		<Step5MedicationReview />
		<Step6VisionSensory />
		<Step7Environmental />
		<Step8Cognitive />
		<Step9PreviousInterventions />
		<Step10FallPreventionPlan />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Compute score &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
