<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateCamGrade } from '$lib/engine/cam-grader';
	import { steps, TOTAL_STEPS } from '$lib/config/steps';
	import { sampleAssessments } from '$lib/data/sample-reports';

	import Form from '$lib/components/ui/Form.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Progress from '$lib/components/ui/Progress.svelte';
	import StepList from '$lib/components/ui/StepList.svelte';
	import StepListItem from '$lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '$lib/components/ui/ErrorSummary.svelte';

	import Step1Context from '$lib/components/steps/Step1Context.svelte';
	import Step2Identification from '$lib/components/steps/Step2Identification.svelte';
	import Step3Feature1 from '$lib/components/steps/Step3Feature1.svelte';
	import Step4Feature2 from '$lib/components/steps/Step4Feature2.svelte';
	import Step5Feature3 from '$lib/components/steps/Step5Feature3.svelte';
	import Step6Feature4 from '$lib/components/steps/Step6Feature4.svelte';
	import Step7Observations from '$lib/components/steps/Step7Observations.svelte';
	import Step8Result from '$lib/components/steps/Step8Result.svelte';

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
		if (d.context.assessorName.trim() === '') {
			found.push({ id: 'context-assessorName', message: 'Assessor name is required.' });
		}
		if (d.context.camVariant === '') {
			found.push({ id: 'context-camVariant', message: 'Assessment variant is required.' });
		}
		if (d.identification.patientIdentifier.trim() === '') {
			found.push({
				id: 'identification-patientIdentifier',
				message: 'Patient identifier is required.'
			});
		}
		if (d.result.recommendedActions.trim() === '') {
			found.push({
				id: 'result-recommendedActions',
				message: 'Recommended actions and disposition is required.'
			});
		}
		errors = found;
		return found.length === 0;
	}

	function submit() {
		if (!validate()) {
			document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		assessment.result = calculateCamGrade(assessment.data);
		goto(`/confusion-assessment-method/confusion-assessment-methods/${id}/report`);
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
		{isNew ? 'New CAM assessment' : `CAM assessment ${id}`}
	</h1>
	<p class="mt-1 text-sm text-base-content/70">
		Complete the eight sections; the delirium classification is computed on submit. This is a
		status form — there is no numeric score.
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

	<Form label="CAM assessment" onsubmit={submit}>
		<Step1Context />
		<Step2Identification />
		<Step3Feature1 />
		<Step4Feature2 />
		<Step5Feature3 />
		<Step6Feature4 />
		<Step7Observations />
		<Step8Result />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Classify &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
