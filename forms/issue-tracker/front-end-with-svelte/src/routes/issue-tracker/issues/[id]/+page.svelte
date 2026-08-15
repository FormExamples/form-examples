<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { gradeIssue } from '#lib/engine/composite-grader.js';
	import { steps, TOTAL_STEPS } from '#lib/config/steps.js';
	import { sampleAssessments } from '#lib/data/sample-reports.js';

	import Form from '#lib/components/ui/Form.svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import Progress from '#lib/components/ui/Progress.svelte';
	import StepList from '#lib/components/ui/StepList.svelte';
	import StepListItem from '#lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '#lib/components/ui/ErrorSummary.svelte';

	import Step1ReporterMetadata from '#lib/components/steps/Step1ReporterMetadata.svelte';
	import Step2ChiefComplaint from '#lib/components/steps/Step2ChiefComplaint.svelte';
	import Step3Participants from '#lib/components/steps/Step3Participants.svelte';
	import Step4Symptoms from '#lib/components/steps/Step4Symptoms.svelte';
	import Step5Fractures from '#lib/components/steps/Step5Fractures.svelte';
	import Step6History from '#lib/components/steps/Step6History.svelte';
	import Step7Investigations from '#lib/components/steps/Step7Investigations.svelte';
	import Step8Diagnosis from '#lib/components/steps/Step8Diagnosis.svelte';
	import Step9TreatmentsPrognosis from '#lib/components/steps/Step9TreatmentsPrognosis.svelte';
	import Step10ScoresSignoff from '#lib/components/steps/Step10ScoresSignoff.svelte';

	let errors = $state<{ id: string; message: string }[]>([]);

	const id = $derived(page.params.id ?? 'new');
	const isNew = $derived(id === 'new');

	// Hydrate the wizard whenever the route id changes: a saved draft for that id
	// wins, otherwise seed from the matching sample issue (existing id) or a
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
		if (d.reporter.reporterName.trim() === '') {
			found.push({ id: 'reporterName', message: 'Reporter name is required.' });
		}
		if (d.cc.ccSummary.trim() === '') {
			found.push({ id: 'ccSummary', message: 'A one-line issue summary is required.' });
		}
		errors = found;
		return found.length === 0;
	}

	function submit() {
		if (!validate()) {
			document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		assessment.result = gradeIssue(assessment.data);
		goto(`/issue-tracker/issues/${id}/report`);
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
		{isNew ? 'New issue' : `Issue ${id}`}
	</h1>
	<p class="mt-1 text-sm text-base-content/70">
		Complete the ten sections; the composite priority and safety flags are computed on submit.
	</p>
	<Progress label="Issue sections" value={TOTAL_STEPS} max={TOTAL_STEPS} />
	<StepList label="Issue sections" current={TOTAL_STEPS}>
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

	<Form label="Issue report" onsubmit={submit}>
		<Step1ReporterMetadata />
		<Step2ChiefComplaint />
		<Step3Participants />
		<Step4Symptoms />
		<Step5Fractures />
		<Step6History />
		<Step7Investigations />
		<Step8Diagnosis />
		<Step9TreatmentsPrognosis />
		<Step10ScoresSignoff />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Compute priority &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
