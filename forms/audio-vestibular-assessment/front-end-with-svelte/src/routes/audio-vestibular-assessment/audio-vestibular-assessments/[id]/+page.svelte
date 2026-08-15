<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { grade } from '#lib/engine/audio-vestibular-grader.js';
	import { steps, TOTAL_STEPS } from '#lib/config/steps.js';
	import { sampleAssessments } from '#lib/data/sample-reports.js';

	import Form from '#lib/components/ui/Form.svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import Progress from '#lib/components/ui/Progress.svelte';
	import StepList from '#lib/components/ui/StepList.svelte';
	import StepListItem from '#lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '#lib/components/ui/ErrorSummary.svelte';

	import Step1Demographics from '#lib/components/steps/Step1Demographics.svelte';
	import Step2PresentingSymptoms from '#lib/components/steps/Step2PresentingSymptoms.svelte';
	import Step3OtoscopicExamination from '#lib/components/steps/Step3OtoscopicExamination.svelte';
	import Step4PureToneAudiometry from '#lib/components/steps/Step4PureToneAudiometry.svelte';
	import Step5SpeechAudiometry from '#lib/components/steps/Step5SpeechAudiometry.svelte';
	import Step6TympanometryAcousticReflexes from '#lib/components/steps/Step6TympanometryAcousticReflexes.svelte';
	import Step7VestibularScreening from '#lib/components/steps/Step7VestibularScreening.svelte';
	import Step8DizzinessHandicapInventory from '#lib/components/steps/Step8DizzinessHandicapInventory.svelte';
	import Step9ClinicalImpressionReferral from '#lib/components/steps/Step9ClinicalImpressionReferral.svelte';

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
		assessment.result = grade(assessment.data);
		goto(`/audio-vestibular-assessment/audio-vestibular-assessments/${id}/report`);
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
		{isNew ? 'New audio-vestibular assessment' : `Audio-vestibular assessment ${id}`}
	</h1>
	<p class="mt-1 text-sm text-base-content/70">
		Complete the nine sections; the WHO hearing-loss grade and DHI handicap level are computed on
		submit.
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

	<Form label="Audio-vestibular assessment" onsubmit={submit}>
		<Step1Demographics />
		<Step2PresentingSymptoms />
		<Step3OtoscopicExamination />
		<Step4PureToneAudiometry />
		<Step5SpeechAudiometry />
		<Step6TympanometryAcousticReflexes />
		<Step7VestibularScreening />
		<Step8DizzinessHandicapInventory />
		<Step9ClinicalImpressionReferral />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Compute grade &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
