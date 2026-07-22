<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculatePercGrade } from '$lib/engine/perc-grader';
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
	import Step3Pretest from '$lib/components/steps/Step3Pretest.svelte';
	import Step4Vitals from '$lib/components/steps/Step4Vitals.svelte';
	import Step5Criteria from '$lib/components/steps/Step5Criteria.svelte';
	import Step6Result from '$lib/components/steps/Step6Result.svelte';

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
		if (d.context.clinicianName.trim() === '') {
			found.push({ id: 'context-clinicianName', message: 'Clinician name is required.' });
		}
		if (d.context.clinicianRole === '') {
			found.push({ id: 'context-clinicianRole', message: 'Clinician role is required.' });
		}
		if (d.identification.patientIdentifier.trim() === '') {
			found.push({
				id: 'identification-patientIdentifier',
				message: 'Patient identifier is required.'
			});
		}
		if (d.identification.age === null) {
			found.push({ id: 'identification-age', message: 'Patient age is required.' });
		}
		if (d.pretest.pretestProbability === '') {
			found.push({
				id: 'pretest-pretestProbability',
				message: 'Gestalt pre-test probability is required.'
			});
		}
		if (d.vitals.heartRate === null) {
			found.push({ id: 'vitals-heartRate', message: 'Heart rate is required.' });
		}
		if (d.vitals.oxygenSaturation === null) {
			found.push({ id: 'vitals-oxygenSaturation', message: 'Oxygen saturation is required.' });
		}
		errors = found;
		return found.length === 0;
	}

	function submit() {
		if (!validate()) {
			document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		assessment.result = calculatePercGrade(assessment.data);
		goto(`/pulmonary-embolism-rule-out-criteria/pulmonary-embolism-rule-out-criterias/${id}/report`);
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
		{isNew ? 'New PERC assessment' : `PERC assessment ${id}`}
	</h1>
	<p class="mt-1 text-sm text-base-content/70">
		Complete the six sections; the PERC classification is computed on submit. This is a status
		form — there is no numeric score.
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

	<Form label="PERC assessment" onsubmit={submit}>
		<Step1Context />
		<Step2Identification />
		<Step3Pretest />
		<Step4Vitals />
		<Step5Criteria />
		<Step6Result />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Classify &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
