<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { calculateRisk } from '#lib/engine/risk-grader.js';
	import { steps, TOTAL_STEPS } from '#lib/config/steps.js';
	import { sampleAssessments } from '#lib/data/sample-reports.js';

	import Form from '#lib/components/ui/Form.svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import Progress from '#lib/components/ui/Progress.svelte';
	import StepList from '#lib/components/ui/StepList.svelte';
	import StepListItem from '#lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '#lib/components/ui/ErrorSummary.svelte';

	import Step1 from '#lib/components/steps/Step1PatientInformation.svelte';
	import Step2 from '#lib/components/steps/Step2Demographics.svelte';
	import Step3 from '#lib/components/steps/Step3BloodPressure.svelte';
	import Step4 from '#lib/components/steps/Step4CholesterolLipids.svelte';
	import Step5 from '#lib/components/steps/Step5MetabolicHealth.svelte';
	import Step6 from '#lib/components/steps/Step6RenalFunction.svelte';
	import Step7 from '#lib/components/steps/Step7SmokingHistory.svelte';
	import Step8 from '#lib/components/steps/Step8MedicalHistory.svelte';
	import Step9 from '#lib/components/steps/Step9CurrentMedications.svelte';
	import Step10 from '#lib/components/steps/Step10ReviewCalculate.svelte';

	const plural = 'predicting-risk-of-cardiovascular-disease-events-records';

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
		if (d.demographics.age === null) {
			found.push({ id: 'step-2-age', message: 'Patient age is required.' });
		}
		if (d.demographics.sex === '') {
			found.push({ id: 'step-2-sex', message: 'Patient sex is required.' });
		}
		errors = found;
		return found.length === 0;
	}

	function submit() {
		if (!validate()) {
			document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		assessment.result = calculateRisk(assessment.data);
		goto(`/predicting-risk-of-cardiovascular-disease-events/${plural}/${id}/report`);
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
		{isNew ? 'New CVD risk assessment' : `CVD risk assessment ${id}`}
	</h1>
	<p class="mt-1 text-sm text-base-content/70">
		Complete the ten sections; the PREVENT risk category and 10-/30-year risk are computed on submit.
	</p>
	<Progress label="Assessment sections" value={TOTAL_STEPS} max={TOTAL_STEPS} />
	<StepList label="Assessment sections" current={TOTAL_STEPS}>
		{#each steps as step (step.number)}
			<StepListItem status="finished" label={step.title}>{step.title}</StepListItem>
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

	<Form label="CVD risk assessment" onsubmit={submit}>
		<Step1 />
		<Step2 />
		<Step3 />
		<Step4 />
		<Step5 />
		<Step6 />
		<Step7 />
		<Step8 />
		<Step9 />
		<Step10 />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Compute risk &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
