<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateConcern } from '$lib/engine/fertility-grader';
	import { steps, TOTAL_STEPS } from '$lib/config/steps';
	import { sampleAssessments } from '$lib/data/sample-reports';

	import Form from '$lib/components/ui/Form.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Progress from '$lib/components/ui/Progress.svelte';
	import StepList from '$lib/components/ui/StepList.svelte';
	import StepListItem from '$lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '$lib/components/ui/ErrorSummary.svelte';

	import Step1Demographics from '$lib/components/steps/Step1Demographics.svelte';
	import Step2ReproductiveHistory from '$lib/components/steps/Step2ReproductiveHistory.svelte';
	import Step3MenstrualCycleHistory from '$lib/components/steps/Step3MenstrualCycleHistory.svelte';
	import Step4MedicalSurgicalHistory from '$lib/components/steps/Step4MedicalSurgicalHistory.svelte';
	import Step5LifestyleFactors from '$lib/components/steps/Step5LifestyleFactors.svelte';
	import Step6MedicationsSupplements from '$lib/components/steps/Step6MedicationsSupplements.svelte';
	import Step7PartnerSemenAnalysis from '$lib/components/steps/Step7PartnerSemenAnalysis.svelte';
	import Step8HormoneProfile from '$lib/components/steps/Step8HormoneProfile.svelte';
	import Step9Investigations from '$lib/components/steps/Step9Investigations.svelte';
	import Step10ClinicalRecommendation from '$lib/components/steps/Step10ClinicalRecommendation.svelte';

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
		if (d.demographics.patientLastName.trim() === '') {
			found.push({ id: 'demographics-patientLastName', message: 'Patient last name is required.' });
		}
		if (d.demographics.patientDateOfBirth === '') {
			found.push({ id: 'demographics-patientDateOfBirth', message: 'Date of birth is required.' });
		}
		errors = found;
		return found.length === 0;
	}

	function submit() {
		if (!validate()) {
			document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		assessment.result = calculateConcern(assessment.data);
		goto(`/fertility-assessments/${id}/report`);
	}

	function startOver() {
		const seed = sampleAssessments.find((s) => s.id === id)?.data;
		assessment.reset();
		assessment.loadForId(id, seed);
		errors = [];
	}
</script>

<main class="mx-auto max-w-3xl px-4 py-6">
	<header class="mb-6 no-print">
		<h1 class="text-2xl font-bold text-base-content">
			{isNew ? 'New fertility assessment' : `Fertility assessment ${id}`}
		</h1>
		<p class="mt-1 text-sm text-base-content/70">
			Complete the ten sections; the NICE CG156 concern level and score are computed on submit.
		</p>
		<Progress label="Assessment sections" value={TOTAL_STEPS} max={TOTAL_STEPS} />
		<StepList label="Assessment sections" current={TOTAL_STEPS}>
			{#each steps as step (step.number)}
				<StepListItem status="finished" label={step.title}>{step.shortTitle}</StepListItem>
			{/each}
		</StepList>
	</header>

	{#if errors.length > 0}
		<ErrorSummary title="Please fix the following before submitting" class="mb-6">
			<ul>
				{#each errors as e (e.id)}
					<li><a href={`#${e.id}`}>{e.message}</a></li>
				{/each}
			</ul>
		</ErrorSummary>
	{/if}

	<Form label="Fertility assessment" onsubmit={submit}>
		<Step1Demographics />
		<Step2ReproductiveHistory />
		<Step3MenstrualCycleHistory />
		<Step4MedicalSurgicalHistory />
		<Step5LifestyleFactors />
		<Step6MedicationsSupplements />
		<Step7PartnerSemenAnalysis />
		<Step8HormoneProfile />
		<Step9Investigations />
		<Step10ClinicalRecommendation />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Compute concern &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
