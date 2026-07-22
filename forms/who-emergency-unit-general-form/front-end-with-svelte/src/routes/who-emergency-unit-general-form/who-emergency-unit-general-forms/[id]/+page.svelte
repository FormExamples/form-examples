<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { gradeEuGeneral } from '$lib/engine/eu-general-grader';
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
	import Step4Airway from '$lib/components/steps/Step4Airway.svelte';
	import Step5Breathing from '$lib/components/steps/Step5Breathing.svelte';
	import Step6Circulation from '$lib/components/steps/Step6Circulation.svelte';
	import Step7Disability from '$lib/components/steps/Step7Disability.svelte';
	import Step8HistoryOfPresentIllness from '$lib/components/steps/Step8HistoryOfPresentIllness.svelte';
	import Step9ReviewOfSystems from '$lib/components/steps/Step9ReviewOfSystems.svelte';
	import Step10PastMedicalHistory from '$lib/components/steps/Step10PastMedicalHistory.svelte';
	import Step11PhysicalExam from '$lib/components/steps/Step11PhysicalExam.svelte';
	import Step12Diagnostics from '$lib/components/steps/Step12Diagnostics.svelte';
	import Step13AdditionalInterventions from '$lib/components/steps/Step13AdditionalInterventions.svelte';
	import Step14AssessmentAndPlan from '$lib/components/steps/Step14AssessmentAndPlan.svelte';
	import Step15Reassessment from '$lib/components/steps/Step15Reassessment.svelte';
	import Step16Disposition from '$lib/components/steps/Step16Disposition.svelte';

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
		if (d.chiefComplaintAndVitals.chiefComplaint.trim() === '') {
			found.push({ id: 'chiefComplaint', message: 'Chief complaint is required.' });
		}
		if (d.disposition.emergencyUnitProvider.trim() === '') {
			found.push({
				id: 'emergencyUnitProvider',
				message: 'Emergency unit provider name / title is required.'
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
		assessment.result = gradeEuGeneral(assessment.data);
		goto(`/who-emergency-unit-general-form/who-emergency-unit-general-forms/${id}/report`);
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
		{isNew ? 'New emergency unit encounter' : `Emergency unit encounter ${id}`}
	</h1>
	<p class="mt-1 text-sm text-base-content/70">
		Complete the sixteen sections; completeness and flagged issues are computed on submit.
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

	<Form label="Emergency unit encounter" onsubmit={submit}>
		<Step1PatientRegistration />
		<Step2ChiefComplaintAndVitals />
		<Step3HighRiskSigns />
		<Step4Airway />
		<Step5Breathing />
		<Step6Circulation />
		<Step7Disability />
		<Step8HistoryOfPresentIllness />
		<Step9ReviewOfSystems />
		<Step10PastMedicalHistory />
		<Step11PhysicalExam />
		<Step12Diagnostics />
		<Step13AdditionalInterventions />
		<Step14AssessmentAndPlan />
		<Step15Reassessment />
		<Step16Disposition />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Check &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
