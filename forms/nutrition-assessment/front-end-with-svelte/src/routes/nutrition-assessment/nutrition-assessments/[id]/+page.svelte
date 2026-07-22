<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateNutritionGrade } from '$lib/engine/nutrition-grader';
	import { steps, TOTAL_STEPS } from '$lib/config/steps';
	import { sampleAssessments } from '$lib/data/sample-reports';

	import Form from '$lib/components/ui/Form.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Progress from '$lib/components/ui/Progress.svelte';
	import StepList from '$lib/components/ui/StepList.svelte';
	import StepListItem from '$lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '$lib/components/ui/ErrorSummary.svelte';

	import Step1Demographics from '$lib/components/steps/Step1Demographics.svelte';
	import Step2AnthropometricMeasurements from '$lib/components/steps/Step2AnthropometricMeasurements.svelte';
	import Step3DietaryHistory from '$lib/components/steps/Step3DietaryHistory.svelte';
	import Step4NutritionalScreening from '$lib/components/steps/Step4NutritionalScreening.svelte';
	import Step5SwallowingOralHealth from '$lib/components/steps/Step5SwallowingOralHealth.svelte';
	import Step6GastrointestinalFunction from '$lib/components/steps/Step6GastrointestinalFunction.svelte';
	import Step7FoodAllergiesIntolerances from '$lib/components/steps/Step7FoodAllergiesIntolerances.svelte';
	import Step8NutritionalRequirements from '$lib/components/steps/Step8NutritionalRequirements.svelte';
	import Step9CurrentNutritionalSupport from '$lib/components/steps/Step9CurrentNutritionalSupport.svelte';
	import Step10CarePlanMonitoring from '$lib/components/steps/Step10CarePlanMonitoring.svelte';

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
		errors = found;
		return found.length === 0;
	}

	function submit() {
		if (!validate()) {
			document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		assessment.result = calculateNutritionGrade(assessment.data);
		goto(`/nutrition-assessment/nutrition-assessments/${id}/report`);
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
		{isNew ? 'New nutrition assessment' : `Nutrition assessment ${id}`}
	</h1>
	<p class="mt-1 text-sm text-base-content/70">
		Complete the ten sections; the MUST score and overall severity are computed on submit.
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

	<Form label="Nutrition assessment" onsubmit={submit}>
		<Step1Demographics />
		<Step2AnthropometricMeasurements />
		<Step3DietaryHistory />
		<Step4NutritionalScreening />
		<Step5SwallowingOralHealth />
		<Step6GastrointestinalFunction />
		<Step7FoodAllergiesIntolerances />
		<Step8NutritionalRequirements />
		<Step9CurrentNutritionalSupport />
		<Step10CarePlanMonitoring />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Compute score &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
