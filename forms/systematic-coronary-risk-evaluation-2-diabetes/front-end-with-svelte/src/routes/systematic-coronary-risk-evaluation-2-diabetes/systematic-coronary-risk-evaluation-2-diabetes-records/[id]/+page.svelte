<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { steps, TOTAL_STEPS } from '#lib/config/steps.js';
	import { sampleAssessments } from '#lib/data/sample-reports.js';

	import Form from '#lib/components/ui/Form.svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import Progress from '#lib/components/ui/Progress.svelte';
	import StepList from '#lib/components/ui/StepList.svelte';
	import StepListItem from '#lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '#lib/components/ui/ErrorSummary.svelte';

	import Step1 from '#lib/components/steps/Step1PatientDemographics.svelte';
	import Step2 from '#lib/components/steps/Step2DiabetesHistory.svelte';
	import Step3 from '#lib/components/steps/Step3CardiovascularHistory.svelte';
	import Step4 from '#lib/components/steps/Step4BloodPressure.svelte';
	import Step5 from '#lib/components/steps/Step5LipidProfile.svelte';
	import Step6 from '#lib/components/steps/Step6RenalFunction.svelte';
	import Step7 from '#lib/components/steps/Step7LifestyleFactors.svelte';
	import Step8 from '#lib/components/steps/Step8CurrentMedications.svelte';
	import Step9 from '#lib/components/steps/Step9ComplicationsScreening.svelte';
	import Step10 from '#lib/components/steps/Step10RiskAssessmentSummary.svelte';

	const plural = 'systematic-coronary-risk-evaluation-2-diabetes-records';
	const stepComponents = [Step1, Step2, Step3, Step4, Step5, Step6, Step7, Step8, Step9, Step10];

	const id = $derived(page.params.id ?? 'new');
	const isNew = $derived(id === 'new');

	// Hydrate the wizard whenever the route id changes: a saved draft for that id
	// wins, otherwise seed from the matching sample assessment (existing id) or a
	// blank draft (new).
	$effect(() => {
		const seed = sampleAssessments.find((s) => s.id === id)?.data;
		if (assessment.id !== id) {
			assessment.loadForId(id, seed);
		}
	});

	const errorEntries = $derived(Object.entries(assessment.errors));

	function validate(): boolean {
		const e: Record<string, string> = {};
		if (!assessment.data.patientDemographics.sex) {
			e['step-1-sex'] = 'Select the patient sex.';
		}
		if (!assessment.data.diabetesHistory.diabetesType) {
			e['step-2-diabetesType'] = 'Select the diabetes type.';
		}
		assessment.errors = e;
		return Object.keys(e).length === 0;
	}

	function submit() {
		if (!validate()) {
			document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		assessment.grade();
		goto(`/systematic-coronary-risk-evaluation-2-diabetes/${plural}/${id}/report`);
	}

	function startOver() {
		const seed = sampleAssessments.find((s) => s.id === id)?.data;
		assessment.reset();
		assessment.loadForId(id, seed);
	}
</script>

<main class="mx-16 px-4 py-6">
	<h1 class="text-2xl font-bold text-base-content">
		{isNew ? 'New SCORE2-Diabetes assessment' : `SCORE2-Diabetes assessment ${id}`}
	</h1>
	<p class="mt-1 text-sm text-base-content/70">
		Complete the ten sections; the 10-year cardiovascular risk category and clinical flags are
		computed on submit.
	</p>
	<Progress label="Assessment sections" value={TOTAL_STEPS} max={TOTAL_STEPS} />
	<StepList label="Assessment sections" current={TOTAL_STEPS}>
		{#each steps as step (step.number)}
			<StepListItem status="finished" label={step.title}>{step.title}</StepListItem>
		{/each}
	</StepList>

	{#if errorEntries.length > 0}
		<ErrorSummary title="Please fix the following before submitting" class="mb-6">
			<ul>
				{#each errorEntries as [eid, message] (eid)}
					<li><a href={`#${eid}`}>{message}</a></li>
				{/each}
			</ul>
		</ErrorSummary>
	{/if}

	<Form label="SCORE2-Diabetes assessment" onsubmit={submit}>
		{#each stepComponents as StepComponent, i (i)}
			<StepComponent />
		{/each}

		<div class="button-group">
			<Button type="submit" data-variant="primary">Compute risk &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
