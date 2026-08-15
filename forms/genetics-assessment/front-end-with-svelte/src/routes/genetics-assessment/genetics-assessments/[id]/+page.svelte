<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { gradeGenetics } from '#lib/engine/genetics-grader.js';
	import { steps, TOTAL_STEPS } from '#lib/config/steps.js';
	import { sampleAssessments } from '#lib/data/sample-reports.js';

	import Form from '#lib/components/ui/Form.svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import Progress from '#lib/components/ui/Progress.svelte';
	import StepList from '#lib/components/ui/StepList.svelte';
	import StepListItem from '#lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '#lib/components/ui/ErrorSummary.svelte';

	import Step1ProbandDemographics from '#lib/components/steps/Step1ProbandDemographics.svelte';
	import Step2PresentingConcern from '#lib/components/steps/Step2PresentingConcern.svelte';
	import Step3PersonalMedicalHistory from '#lib/components/steps/Step3PersonalMedicalHistory.svelte';
	import Step4FamilyPedigree from '#lib/components/steps/Step4FamilyPedigree.svelte';
	import Step5ConsanguinityAncestry from '#lib/components/steps/Step5ConsanguinityAncestry.svelte';
	import Step6TargetedRiskScoring from '#lib/components/steps/Step6TargetedRiskScoring.svelte';
	import Step7PriorGeneticTesting from '#lib/components/steps/Step7PriorGeneticTesting.svelte';
	import Step8PatientUnderstandingConcerns from '#lib/components/steps/Step8PatientUnderstandingConcerns.svelte';
	import Step9RecommendationReferralPlan from '#lib/components/steps/Step9RecommendationReferralPlan.svelte';

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
		if (d.probandDemographics.firstName.trim() === '') {
			found.push({ id: 'firstName', message: 'Proband first name is required.' });
		}
		if (d.probandDemographics.lastName.trim() === '') {
			found.push({ id: 'lastName', message: 'Proband last name is required.' });
		}
		if (d.probandDemographics.dateOfBirth === '') {
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
		assessment.result = gradeGenetics(assessment.data);
		goto(`/genetics-assessment/genetics-assessments/${id}/report`);
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
		{isNew ? 'New genetics assessment' : `Genetics assessment ${id}`}
	</h1>
	<p class="mt-1 text-sm text-base-content/70">
		Complete the nine sections; the Manchester / Bethesda / PREMM5 scores and overall genetic risk
		are computed on submit.
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

	<Form label="Genetics assessment" onsubmit={submit}>
		<Step1ProbandDemographics />
		<Step2PresentingConcern />
		<Step3PersonalMedicalHistory />
		<Step4FamilyPedigree />
		<Step5ConsanguinityAncestry />
		<Step6TargetedRiskScoring />
		<Step7PriorGeneticTesting />
		<Step8PatientUnderstandingConcerns />
		<Step9RecommendationReferralPlan />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Compute risk &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
