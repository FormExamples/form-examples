<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateNEWS2 } from '$lib/engine/news2-calculator';
	import { detectFlaggedIssues } from '$lib/engine/flagged-issues';
	import { steps, TOTAL_STEPS } from '$lib/config/steps';
	import { sampleAssessments } from '$lib/data/sample-reports';

	import Form from '$lib/components/ui/Form.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Progress from '$lib/components/ui/Progress.svelte';
	import StepList from '$lib/components/ui/StepList.svelte';
	import StepListItem from '$lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '$lib/components/ui/ErrorSummary.svelte';

	import Step1Demographics from '$lib/components/steps/Step1Demographics.svelte';
	import Step2NextOfKinGP from '$lib/components/steps/Step2NextOfKinGP.svelte';
	import Step3ArrivalTriage from '$lib/components/steps/Step3ArrivalTriage.svelte';
	import Step4PresentingComplaint from '$lib/components/steps/Step4PresentingComplaint.svelte';
	import Step5PainAssessment from '$lib/components/steps/Step5PainAssessment.svelte';
	import Step6MedicalHistory from '$lib/components/steps/Step6MedicalHistory.svelte';
	import Step7VitalSigns from '$lib/components/steps/Step7VitalSigns.svelte';
	import Step8PrimarySurvey from '$lib/components/steps/Step8PrimarySurvey.svelte';
	import Step9ClinicalExamination from '$lib/components/steps/Step9ClinicalExamination.svelte';
	import Step10Investigations from '$lib/components/steps/Step10Investigations.svelte';
	import Step11Treatment from '$lib/components/steps/Step11Treatment.svelte';
	import Step12AssessmentPlan from '$lib/components/steps/Step12AssessmentPlan.svelte';
	import Step13Disposition from '$lib/components/steps/Step13Disposition.svelte';
	import Step14SafeguardingConsent from '$lib/components/steps/Step14SafeguardingConsent.svelte';

	let errors = $state<{ id: string; message: string }[]>([]);

	const id = $derived(page.params.id ?? 'new');
	const isNew = $derived(id === 'new');

	// Hydrate the wizard whenever the route id changes: a saved draft for that id
	// wins, otherwise seed from the matching sample card (existing id) or a blank
	// draft (new).
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
			found.push({ id: 'lastName', message: 'Patient last name is required.' });
		}
		if (d.demographics.dateOfBirth === '') {
			found.push({ id: 'dateOfBirth', message: 'Date of birth is required.' });
		}
		errors = found;
		return found.length === 0;
	}

	function submit() {
		if (!validate()) {
			document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		const news2 = calculateNEWS2(assessment.data.vitalSigns);
		assessment.result = {
			news2,
			flaggedIssues: detectFlaggedIssues(assessment.data, news2),
			timestamp: new Date().toISOString()
		};
		goto(`/casualty-card-form/casualty-cards/${id}/report`);
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
		{isNew ? 'New casualty card' : `Casualty card ${id}`}
	</h1>
	<p class="mt-1 text-sm text-base-content/70">
		Complete the fourteen sections; the NEWS2 score and clinical response are computed on submit.
	</p>
	<Progress label="Casualty card sections" value={TOTAL_STEPS} max={TOTAL_STEPS} />
	<StepList label="Casualty card sections" current={TOTAL_STEPS}>
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

	<Form label="Casualty card" onsubmit={submit}>
		<Step1Demographics />
		<Step2NextOfKinGP />
		<Step3ArrivalTriage />
		<Step4PresentingComplaint />
		<Step5PainAssessment />
		<Step6MedicalHistory />
		<Step7VitalSigns />
		<Step8PrimarySurvey />
		<Step9ClinicalExamination />
		<Step10Investigations />
		<Step11Treatment />
		<Step12AssessmentPlan />
		<Step13Disposition />
		<Step14SafeguardingConsent />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Compute NEWS2 &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
