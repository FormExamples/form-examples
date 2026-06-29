<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { gradePsychomotor } from '$lib/engine/psychomotor-grader';
	import { steps, TOTAL_STEPS } from '$lib/config/steps';
	import { sampleAssessments } from '$lib/data/sample-reports';

	import Form from '$lib/components/ui/Form.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Progress from '$lib/components/ui/Progress.svelte';
	import StepList from '$lib/components/ui/StepList.svelte';
	import StepListItem from '$lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '$lib/components/ui/ErrorSummary.svelte';

	import Step1CandidateExaminerScenario from '$lib/components/steps/Step1CandidateExaminerScenario.svelte';
	import Step2SceneSizeUp from '$lib/components/steps/Step2SceneSizeUp.svelte';
	import Step3PrimarySurvey from '$lib/components/steps/Step3PrimarySurvey.svelte';
	import Step4HistorySecondaryAssessment from '$lib/components/steps/Step4HistorySecondaryAssessment.svelte';
	import Step5Reassessment from '$lib/components/steps/Step5Reassessment.svelte';
	import Step6CriticalCriteriaReview from '$lib/components/steps/Step6CriticalCriteriaReview.svelte';

	const plural = 'emergency-medical-technician-psychomotor-examinations';

	let errors = $state<{ id: string; message: string }[]>([]);

	const id = $derived(page.params.id ?? 'new');
	const isNew = $derived(id === 'new');

	// Hydrate the wizard whenever the route id changes: a saved draft for that id
	// wins, otherwise seed from the matching sample examination (existing id) or a
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
		if (d.candidateExaminerScenario.candidateLastName.trim() === '') {
			found.push({ id: 'candidateLastName', message: 'Candidate last name is required.' });
		}
		if (d.candidateExaminerScenario.sessionDate === '') {
			found.push({ id: 'sessionDate', message: 'Session date is required.' });
		}
		errors = found;
		return found.length === 0;
	}

	function submit() {
		if (!validate()) {
			document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		assessment.result = gradePsychomotor(assessment.data);
		goto(`/${plural}/${id}/report`);
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
			{isNew ? 'New psychomotor examination' : `Psychomotor examination ${id}`}
		</h1>
		<p class="mt-1 text-sm text-base-content/70">
			Mark each of the six sections; the Pass / Fail outcome, points, and critical-criteria result
			are computed on submit.
		</p>
		<Progress label="Examination sections" value={TOTAL_STEPS} max={TOTAL_STEPS} />
		<StepList label="Examination sections" current={TOTAL_STEPS}>
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

	<Form label="Psychomotor examination" onsubmit={submit}>
		<Step1CandidateExaminerScenario />
		<Step2SceneSizeUp />
		<Step3PrimarySurvey />
		<Step4HistorySecondaryAssessment />
		<Step5Reassessment />
		<Step6CriticalCriteriaReview />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Compute result &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
