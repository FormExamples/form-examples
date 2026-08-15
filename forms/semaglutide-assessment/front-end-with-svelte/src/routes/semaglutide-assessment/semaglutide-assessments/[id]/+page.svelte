<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { evaluateEligibility } from '#lib/engine/eligibility-grader.js';
	import { detectAdditionalFlags } from '#lib/engine/flagged-issues.js';
	import { steps, TOTAL_STEPS } from '#lib/config/steps.js';
	import { sampleAssessments } from '#lib/data/sample-reports.js';

	import Form from '#lib/components/ui/Form.svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import Progress from '#lib/components/ui/Progress.svelte';
	import StepList from '#lib/components/ui/StepList.svelte';
	import StepListItem from '#lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '#lib/components/ui/ErrorSummary.svelte';

	import Step1Demographics from '#lib/components/steps/Step1Demographics.svelte';
	import Step2IndicationGoals from '#lib/components/steps/Step2IndicationGoals.svelte';
	import Step3BodyComposition from '#lib/components/steps/Step3BodyComposition.svelte';
	import Step4MetabolicProfile from '#lib/components/steps/Step4MetabolicProfile.svelte';
	import Step5CardiovascularRisk from '#lib/components/steps/Step5CardiovascularRisk.svelte';
	import Step6ContraindicationsScreening from '#lib/components/steps/Step6ContraindicationsScreening.svelte';
	import Step7GastrointestinalHistory from '#lib/components/steps/Step7GastrointestinalHistory.svelte';
	import Step8CurrentMedications from '#lib/components/steps/Step8CurrentMedications.svelte';
	import Step9MentalHealthScreening from '#lib/components/steps/Step9MentalHealthScreening.svelte';
	import Step10TreatmentPlan from '#lib/components/steps/Step10TreatmentPlan.svelte';

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
			found.push({ id: 'lastName', message: 'Patient last name is required.' });
		}
		if (d.demographics.dob === '') {
			found.push({ id: 'dob', message: 'Date of birth is required.' });
		}
		errors = found;
		return found.length === 0;
	}

	function submit() {
		if (!validate()) {
			document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		const { eligibilityStatus, bmi, bmiCategoryLabel, absoluteContraindications, relativeContraindications } =
			evaluateEligibility(assessment.data);
		assessment.result = {
			eligibilityStatus,
			bmi,
			bmiCategory: bmiCategoryLabel,
			absoluteContraindications,
			relativeContraindications,
			monitoringFlags: detectAdditionalFlags(assessment.data),
			timestamp: new Date().toISOString()
		};
		goto(`/semaglutide-assessment/semaglutide-assessments/${id}/report`);
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
		{isNew ? 'New semaglutide assessment' : `Semaglutide assessment ${id}`}
	</h1>
	<p class="mt-1 text-sm text-base-content/70">
		Complete the ten sections; the eligibility status, BMI category, and flagged issues are computed
		on submit.
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

	<Form label="Semaglutide assessment" onsubmit={submit}>
		<Step1Demographics />
		<Step2IndicationGoals />
		<Step3BodyComposition />
		<Step4MetabolicProfile />
		<Step5CardiovascularRisk />
		<Step6ContraindicationsScreening />
		<Step7GastrointestinalHistory />
		<Step8CurrentMedications />
		<Step9MentalHealthScreening />
		<Step10TreatmentPlan />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Determine eligibility &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
