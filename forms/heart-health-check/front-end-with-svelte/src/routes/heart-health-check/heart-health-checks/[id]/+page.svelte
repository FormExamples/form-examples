<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { gradeAssessment } from '$lib/engine/risk-grader';
	import { steps, TOTAL_STEPS } from '$lib/config/steps';
	import { sampleAssessments } from '$lib/data/sample-reports';

	import Form from '$lib/components/ui/Form.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Progress from '$lib/components/ui/Progress.svelte';
	import StepList from '$lib/components/ui/StepList.svelte';
	import StepListItem from '$lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '$lib/components/ui/ErrorSummary.svelte';

	import Step1 from '$lib/components/steps/Step1PatientInformation.svelte';
	import Step2 from '$lib/components/steps/Step2DemographicsEthnicity.svelte';
	import Step3 from '$lib/components/steps/Step3BloodPressure.svelte';
	import Step4 from '$lib/components/steps/Step4Cholesterol.svelte';
	import Step5 from '$lib/components/steps/Step5MedicalConditions.svelte';
	import Step6 from '$lib/components/steps/Step6FamilyHistory.svelte';
	import Step7 from '$lib/components/steps/Step7SmokingAlcohol.svelte';
	import Step8 from '$lib/components/steps/Step8PhysicalActivityDiet.svelte';
	import Step9 from '$lib/components/steps/Step9BodyMeasurements.svelte';
	import Step10 from '$lib/components/steps/Step10ReviewCalculate.svelte';

	const id = $derived(page.params.id ?? 'new');
	const isNew = $derived(id === 'new');

	// Hydrate the wizard whenever the route id changes: a saved draft for that id
	// wins, otherwise seed from the matching sample check (existing id) or a blank
	// draft (new).
	$effect(() => {
		const seed = sampleAssessments.find((s) => s.id === id)?.data;
		if (assessment.id !== id) {
			assessment.loadForId(id, seed);
		}
	});

	const errorEntries = $derived(Object.entries(assessment.errors));

	function validate(): Record<string, string> {
		const e: Record<string, string> = {};
		if (assessment.data.demographicsEthnicity.age === null) {
			e['step-2-age'] = 'Enter the patient age';
		}
		if (!assessment.data.demographicsEthnicity.sex) {
			e['step-2-sex'] = 'Select the patient sex';
		}
		return e;
	}

	function submit() {
		const errors = validate();
		assessment.errors = errors;
		if (Object.keys(errors).length > 0) {
			document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		assessment.result = gradeAssessment(assessment.data);
		goto(`/heart-health-check/heart-health-checks/${id}/report`);
	}

	function startOver() {
		const seed = sampleAssessments.find((s) => s.id === id)?.data;
		assessment.reset();
		assessment.loadForId(id, seed);
	}
</script>

<main class="mx-auto max-w-3xl px-4 py-6">
	<header class="mb-6 no-print">
		<h1 class="text-2xl font-bold text-base-content">
			{isNew ? 'New heart health check' : `Heart health check ${id}`}
		</h1>
		<p class="mt-1 text-sm text-base-content/70">
			Complete the ten sections; the 10-year CVD risk, heart age, and risk category are computed on
			submit.
		</p>
		<Progress label="Check sections" value={TOTAL_STEPS} max={TOTAL_STEPS} />
		<StepList label="Check sections" current={TOTAL_STEPS}>
			{#each steps as step (step.number)}
				<StepListItem status="finished" label={step.title}>{step.shortTitle}</StepListItem>
			{/each}
		</StepList>
	</header>

	{#if errorEntries.length > 0}
		<ErrorSummary title="Please fix the following before submitting" class="mb-6">
			<ul>
				{#each errorEntries as [eid, message] (eid)}
					<li><a href={`#${eid}`}>{message}</a></li>
				{/each}
			</ul>
		</ErrorSummary>
	{/if}

	<Form label="Heart health check" onsubmit={submit}>
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
			<Button type="submit" data-variant="primary">Calculate &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
