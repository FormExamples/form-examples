<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { gradeAssessment } from '$lib/engine/reba-grader';
	import { steps } from '$lib/config/steps';
	import { sampleAssessments } from '$lib/data/sample-reports';

	import Form from '$lib/components/ui/Form.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Progress from '$lib/components/ui/Progress.svelte';
	import StepList from '$lib/components/ui/StepList.svelte';
	import StepListItem from '$lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '$lib/components/ui/ErrorSummary.svelte';

	import Step1Demographics from '$lib/components/steps/Step1Demographics.svelte';
	import Step2WorkstationSetup from '$lib/components/steps/Step2WorkstationSetup.svelte';
	import Step3PostureAssessment from '$lib/components/steps/Step3PostureAssessment.svelte';
	import Step4RepetitiveTasks from '$lib/components/steps/Step4RepetitiveTasks.svelte';
	import Step5ManualHandling from '$lib/components/steps/Step5ManualHandling.svelte';
	import Step6CurrentSymptoms from '$lib/components/steps/Step6CurrentSymptoms.svelte';

	// Only the six implemented sections are rendered as the wizard.
	const wizardSteps = steps.slice(0, 6);
	const stepCount = wizardSteps.length;

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
			found.push({ id: 'lastName', message: 'Worker last name is required.' });
		}
		if (d.demographics.dateOfBirth === '') {
			found.push({ id: 'dob', message: 'Date of birth is required.' });
		}
		if (d.demographics.jobTitle.trim() === '') {
			found.push({ id: 'jobTitle', message: 'Job title is required.' });
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
		goto(`/ergonomic-assessment/ergonomic-assessments/${id}/report`);
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
			{isNew ? 'New ergonomic assessment' : `Ergonomic assessment ${id}`}
		</h1>
		<p class="mt-1 text-sm text-base-content/70">
			Complete the {stepCount} sections; the REBA score and risk level are computed on submit.
		</p>
		<Progress label="Assessment sections" value={stepCount} max={stepCount} />
		<StepList label="Assessment sections" current={stepCount}>
			{#each wizardSteps as step (step.number)}
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

	<Form label="Ergonomic assessment" onsubmit={submit}>
		<Step1Demographics />
		<Step2WorkstationSetup />
		<Step3PostureAssessment />
		<Step4RepetitiveTasks />
		<Step5ManualHandling />
		<Step6CurrentSymptoms />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Compute score &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
