<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { gradeDyslexia } from '$lib/engine/dyslexia-grader';
	import { steps, TOTAL_STEPS } from '$lib/config/steps';
	import { sampleAssessments } from '$lib/data/sample-reports';

	import Form from '$lib/components/ui/Form.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Progress from '$lib/components/ui/Progress.svelte';
	import StepList from '$lib/components/ui/StepList.svelte';
	import StepListItem from '$lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '$lib/components/ui/ErrorSummary.svelte';

	import Step1Demographics from '$lib/components/steps/Step1Demographics.svelte';
	import Step2DevelopmentalHistory from '$lib/components/steps/Step2DevelopmentalHistory.svelte';
	import Step3EducationalBackground from '$lib/components/steps/Step3EducationalBackground.svelte';
	import Step4ReadingAssessment from '$lib/components/steps/Step4ReadingAssessment.svelte';
	import Step5WritingSpelling from '$lib/components/steps/Step5WritingSpelling.svelte';
	import Step6PhonologicalProcessing from '$lib/components/steps/Step6PhonologicalProcessing.svelte';
	import Step7WorkingMemoryProcessingSpeed from '$lib/components/steps/Step7WorkingMemoryProcessingSpeed.svelte';
	import Step8EmotionalBehavioural from '$lib/components/steps/Step8EmotionalBehavioural.svelte';
	import Step9PreviousSupport from '$lib/components/steps/Step9PreviousSupport.svelte';
	import Step10RecommendationsSupportPlan from '$lib/components/steps/Step10RecommendationsSupportPlan.svelte';

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
		if (d.demographics.firstName.trim() === '') {
			found.push({ id: 'firstName', message: 'Patient first name is required.' });
		}
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
		assessment.result = gradeDyslexia(assessment.data);
		goto(`/dyslexia-assessment/dyslexia-assessments/${id}/report`);
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
		{isNew ? 'New dyslexia assessment' : `Dyslexia assessment ${id}`}
	</h1>
	<p class="mt-1 text-sm text-base-content/70">
		Complete the ten sections; the overall severity and per-domain scores are computed on submit.
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

	<Form label="Dyslexia assessment" onsubmit={submit}>
		<Step1Demographics />
		<Step2DevelopmentalHistory />
		<Step3EducationalBackground />
		<Step4ReadingAssessment />
		<Step5WritingSpelling />
		<Step6PhonologicalProcessing />
		<Step7WorkingMemoryProcessingSpeed />
		<Step8EmotionalBehavioural />
		<Step9PreviousSupport />
		<Step10RecommendationsSupportPlan />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Compute severity &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
