<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { gradeEuTrauma } from '$lib/engine/eu-trauma-grader';
	import { steps, TOTAL_STEPS } from '$lib/config/steps';
	import { sampleAssessments } from '$lib/data/sample-reports';

	import Form from '$lib/components/ui/Form.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Progress from '$lib/components/ui/Progress.svelte';
	import StepList from '$lib/components/ui/StepList.svelte';
	import StepListItem from '$lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '$lib/components/ui/ErrorSummary.svelte';

	import Step1PatientRegistration from '$lib/components/steps/Step1PatientRegistration.svelte';
	import Step2ChiefComplaintAndVitals from '$lib/components/steps/Step2ChiefComplaintAndVitals.svelte';
	import Step3HighRiskSigns from '$lib/components/steps/Step3HighRiskSigns.svelte';
	import Step4Triage from '$lib/components/steps/Step4Triage.svelte';
	import Step5Airway from '$lib/components/steps/Step5Airway.svelte';
	import Step6Breathing from '$lib/components/steps/Step6Breathing.svelte';
	import Step7Circulation from '$lib/components/steps/Step7Circulation.svelte';
	import Step8Disability from '$lib/components/steps/Step8Disability.svelte';
	import Step9ExposureAndFast from '$lib/components/steps/Step9ExposureAndFast.svelte';
	import Step10InjuryHistory from '$lib/components/steps/Step10InjuryHistory.svelte';
	import Step11PastHistories from '$lib/components/steps/Step11PastHistories.svelte';
	import Step12PhysicalExam from '$lib/components/steps/Step12PhysicalExam.svelte';
	import Step13AssessmentAndPlan from '$lib/components/steps/Step13AssessmentAndPlan.svelte';
	import Step14Diagnostics from '$lib/components/steps/Step14Diagnostics.svelte';
	import Step15MedicationsAndProcedures from '$lib/components/steps/Step15MedicationsAndProcedures.svelte';
	import Step16Reassessment from '$lib/components/steps/Step16Reassessment.svelte';
	import Step17Disposition from '$lib/components/steps/Step17Disposition.svelte';

	let errors = $state<{ id: string; message: string }[]>([]);

	const id = $derived(page.params.id ?? 'new');
	const isNew = $derived(id === 'new');

	// Hydrate the wizard whenever the route id changes: a saved draft for that id
	// wins, otherwise seed from the matching sample encounter (existing id) or a
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
		if (d.patientRegistration.surname.trim() === '') {
			found.push({ id: 'surname', message: 'Patient surname is required.' });
		}
		if (d.patientRegistration.firstName.trim() === '') {
			found.push({ id: 'firstName', message: 'Patient first name is required.' });
		}
		if (d.disposition.emergencyUnitProvider.trim() === '') {
			found.push({
				id: 'emergencyUnitProvider',
				message: 'Emergency unit provider name is required.'
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
		assessment.result = gradeEuTrauma(assessment.data);
		goto(`/who-emergency-unit-trauma-form/who-emergency-unit-trauma-forms/${id}/report`);
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
		{isNew ? 'New emergency unit trauma encounter' : `Emergency unit trauma encounter ${id}`}
	</h1>
	<p class="mt-1 text-sm text-base-content/70">
		Complete the seventeen sections; triage classification, completeness, and flagged issues are
		computed on submit.
	</p>
	<Progress label="Encounter sections" value={TOTAL_STEPS} max={TOTAL_STEPS} />
	<StepList label="Encounter sections" current={TOTAL_STEPS}>
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

	<Form label="Emergency unit trauma encounter" onsubmit={submit}>
		<Step1PatientRegistration />
		<Step2ChiefComplaintAndVitals />
		<Step3HighRiskSigns />
		<Step4Triage />
		<Step5Airway />
		<Step6Breathing />
		<Step7Circulation />
		<Step8Disability />
		<Step9ExposureAndFast />
		<Step10InjuryHistory />
		<Step11PastHistories />
		<Step12PhysicalExam />
		<Step13AssessmentAndPlan />
		<Step14Diagnostics />
		<Step15MedicationsAndProcedures />
		<Step16Reassessment />
		<Step17Disposition />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Check &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
