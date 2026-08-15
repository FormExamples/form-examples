<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { gradeAssessment } from '#lib/engine/composite-grader.js';
	import { steps, TOTAL_STEPS } from '#lib/config/steps.js';
	import { sampleAssessments } from '#lib/data/sample-reports.js';

	import Form from '#lib/components/ui/Form.svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import Progress from '#lib/components/ui/Progress.svelte';
	import StepList from '#lib/components/ui/StepList.svelte';
	import StepListItem from '#lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '#lib/components/ui/ErrorSummary.svelte';

	import Step1PatientDemographics from '#lib/components/steps/Step1PatientDemographics.svelte';
	import Step2PlannedSurgery from '#lib/components/steps/Step2PlannedSurgery.svelte';
	import Step3MedicalHistory from '#lib/components/steps/Step3MedicalHistory.svelte';
	import Step4Medications from '#lib/components/steps/Step4Medications.svelte';
	import Step5AllergiesAdverseReactions from '#lib/components/steps/Step5AllergiesAdverseReactions.svelte';
	import Step6PreviousAnaesthesiaHistory from '#lib/components/steps/Step6PreviousAnaesthesiaHistory.svelte';
	import Step7SocialHistory from '#lib/components/steps/Step7SocialHistory.svelte';
	import Step8VitalSignsExamination from '#lib/components/steps/Step8VitalSignsExamination.svelte';
	import Step9InvestigationsScoring from '#lib/components/steps/Step9InvestigationsScoring.svelte';
	import Step10AnaestheticPlanConsent from '#lib/components/steps/Step10AnaestheticPlanConsent.svelte';

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
		if (d.demographics.dateOfBirth === '') {
			found.push({ id: 'dob', message: 'Date of birth is required.' });
		}
		if (d.investigationsAndPlan.asaClass === '') {
			found.push({ id: 'asaClass', message: 'ASA Physical Status class is required.' });
		}
		errors = found;
		return found.length === 0;
	}

	function submit() {
		if (!validate()) {
			document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		assessment.result = gradeAssessment(assessment.data);
		goto(`/anesthesiology-assessment/anesthesiology-assessments/${id}/report`);
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
		{isNew ? 'New anaesthesiology assessment' : `Anaesthesiology assessment ${id}`}
	</h1>
	<p class="mt-1 text-sm text-base-content/70">
		Complete the ten sections; the composite perioperative risk and ASA / Mallampati / RCRI /
		STOP-BANG sub-scores are computed on submit.
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

	<Form label="Anaesthesiology assessment" onsubmit={submit}>
		<Step1PatientDemographics />
		<Step2PlannedSurgery />
		<Step3MedicalHistory />
		<Step4Medications />
		<Step5AllergiesAdverseReactions />
		<Step6PreviousAnaesthesiaHistory />
		<Step7SocialHistory />
		<Step8VitalSignsExamination />
		<Step9InvestigationsScoring />
		<Step10AnaestheticPlanConsent />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Compute risk &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
