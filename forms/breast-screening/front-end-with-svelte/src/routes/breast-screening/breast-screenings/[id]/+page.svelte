<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { calculateGrade } from '#lib/engine/breast-screening-grader.js';
	import { steps, TOTAL_STEPS } from '#lib/config/steps.js';
	import { sampleAssessments } from '#lib/data/sample-reports.js';

	import Form from '#lib/components/ui/Form.svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import Progress from '#lib/components/ui/Progress.svelte';
	import StepList from '#lib/components/ui/StepList.svelte';
	import StepListItem from '#lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '#lib/components/ui/ErrorSummary.svelte';

	import Step1Context from '#lib/components/steps/Step1Context.svelte';
	import Step2Identification from '#lib/components/steps/Step2Identification.svelte';
	import Step3Eligibility from '#lib/components/steps/Step3Eligibility.svelte';
	import Step4Mammogram from '#lib/components/steps/Step4Mammogram.svelte';
	import Step5Reading from '#lib/components/steps/Step5Reading.svelte';
	import Step6Assessment from '#lib/components/steps/Step6Assessment.svelte';
	import Step7Summary from '#lib/components/steps/Step7Summary.svelte';

	let errors = $state<{ id: string; message: string }[]>([]);

	const id = $derived(page.params.id ?? 'new');
	const isNew = $derived(id === 'new');

	// Hydrate the wizard whenever the route id changes: a saved draft for that id
	// wins, otherwise seed from the matching sample record (existing id) or a
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
		if (d.context.clinicianName.trim() === '') {
			found.push({ id: 'context-clinicianName', message: 'Reporting clinician name is required.' });
		}
		if (d.context.episodeType === '') {
			found.push({ id: 'context-episodeType', message: 'Episode type is required.' });
		}
		if (d.identification.patientIdentifier.trim() === '') {
			found.push({
				id: 'identification-patientIdentifier',
				message: 'Patient identifier is required.'
			});
		}
		if (d.eligibility.symptomatic === '') {
			found.push({
				id: 'eligibility-symptomatic',
				message: 'Whether a breast symptom is reported is required.'
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
		assessment.result = calculateGrade(assessment.data);
		goto(`/breast-screening/breast-screenings/${id}/report`);
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
		{isNew ? 'New breast screening record' : `Breast screening record ${id}`}
	</h1>
	<p class="mt-1 text-sm text-base-content/70">
		Complete the seven sections; the screening outcome is computed on submit. This is a
		classification form — there is no numeric score.
	</p>
	<Progress label="Record sections" value={TOTAL_STEPS} max={TOTAL_STEPS} />
	<StepList label="Record sections" current={TOTAL_STEPS}>
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

	<Form label="Breast screening record" onsubmit={submit}>
		<Step1Context />
		<Step2Identification />
		<Step3Eligibility />
		<Step4Mammogram />
		<Step5Reading />
		<Step6Assessment />
		<Step7Summary />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Classify &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
