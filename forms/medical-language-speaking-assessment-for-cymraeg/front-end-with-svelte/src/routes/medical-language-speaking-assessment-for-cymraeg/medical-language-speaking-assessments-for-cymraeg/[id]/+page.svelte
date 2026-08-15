<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { gradeAssessment } from '#lib/engine/oet-grader.js';
	import { steps, TOTAL_STEPS } from '#lib/config/steps.js';
	import { sampleAssessments } from '#lib/data/sample-reports.js';

	import Form from '#lib/components/ui/Form.svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import Progress from '#lib/components/ui/Progress.svelte';
	import StepList from '#lib/components/ui/StepList.svelte';
	import StepListItem from '#lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '#lib/components/ui/ErrorSummary.svelte';

	import Step1CandidateDetails from '#lib/components/steps/Step1CandidateDetails.svelte';
	import Step2RolePlay1 from '#lib/components/steps/Step2RolePlay1.svelte';
	import Step3RolePlay2 from '#lib/components/steps/Step3RolePlay2.svelte';
	import Step4AssessmentCriteria from '#lib/components/steps/Step4AssessmentCriteria.svelte';
	import Step5OverallFeedback from '#lib/components/steps/Step5OverallFeedback.svelte';

	const plural = 'medical-language-speaking-assessments-for-cymraeg';

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
		if (d.candidate.candidateId.trim() === '') {
			found.push({ id: 'candidateId', message: 'Candidate ID is required.' });
		}
		if (d.candidate.candidateName.trim() === '') {
			found.push({ id: 'candidateName', message: 'Candidate name is required.' });
		}
		if (d.candidate.examinerName.trim() === '') {
			found.push({ id: 'examinerName', message: 'Examiner name is required.' });
		}
		if (d.candidate.testDate === '') {
			found.push({ id: 'testDate', message: 'Test date is required.' });
		}
		if (d.rolePlay1.scenarioTitle.trim() === '') {
			found.push({ id: 'rp1ScenarioTitle', message: 'Role-play 1 scenario title is required.' });
		}
		if (d.rolePlay2.scenarioTitle.trim() === '') {
			found.push({ id: 'rp2ScenarioTitle', message: 'Role-play 2 scenario title is required.' });
		}
		errors = found;
		return found.length === 0;
	}

	function submit() {
		if (!validate()) {
			document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		assessment.result = gradeAssessment(assessment.data);
		goto(`/medical-language-speaking-assessment-for-cymraeg/${plural}/${id}/report`);
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
		{isNew ? 'New Cymraeg clinical-speaking assessment' : `Cymraeg assessment ${id}`}
	</h1>
	<p class="mt-1 text-sm text-base-content/70">
		Complete the five sections; the CEFR-mapped grade and scaled score are computed on submit.
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

	<Form label="Cymraeg clinical-speaking assessment" onsubmit={submit}>
		<Step1CandidateDetails />
		<Step2RolePlay1 />
		<Step3RolePlay2 />
		<Step4AssessmentCriteria />
		<Step5OverallFeedback />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Compute grade &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
