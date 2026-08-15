<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { calculateASA } from '#lib/engine/asa-grader.js';
	import { detectAdditionalFlags } from '#lib/engine/flagged-issues.js';
	import { steps, getVisibleSteps } from '#lib/config/steps.js';
	import { sampleAssessments } from '#lib/data/sample-reports.js';

	import Form from '#lib/components/ui/Form.svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import Progress from '#lib/components/ui/Progress.svelte';
	import StepList from '#lib/components/ui/StepList.svelte';
	import StepListItem from '#lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '#lib/components/ui/ErrorSummary.svelte';

	import Step1Demographics from '#lib/components/steps/Step1Demographics.svelte';
	import Step2Cardiovascular from '#lib/components/steps/Step2Cardiovascular.svelte';
	import Step3Respiratory from '#lib/components/steps/Step3Respiratory.svelte';
	import Step4Renal from '#lib/components/steps/Step4Renal.svelte';
	import Step5Hepatic from '#lib/components/steps/Step5Hepatic.svelte';
	import Step6Endocrine from '#lib/components/steps/Step6Endocrine.svelte';
	import Step7Neurological from '#lib/components/steps/Step7Neurological.svelte';
	import Step8Haematological from '#lib/components/steps/Step8Haematological.svelte';
	import Step9MusculoskeletalAirway from '#lib/components/steps/Step9MusculoskeletalAirway.svelte';
	import Step10Gastrointestinal from '#lib/components/steps/Step10Gastrointestinal.svelte';
	import Step11Medications from '#lib/components/steps/Step11Medications.svelte';
	import Step12Allergies from '#lib/components/steps/Step12Allergies.svelte';
	import Step13PreviousAnaesthesia from '#lib/components/steps/Step13PreviousAnaesthesia.svelte';
	import Step14SocialHistory from '#lib/components/steps/Step14SocialHistory.svelte';
	import Step15FunctionalCapacity from '#lib/components/steps/Step15FunctionalCapacity.svelte';
	import Step16Pregnancy from '#lib/components/steps/Step16Pregnancy.svelte';
	import Step17CognitiveMentalHealth from '#lib/components/steps/Step17CognitiveMentalHealth.svelte';

	let errors = $state<{ id: string; message: string }[]>([]);

	const id = $derived(page.params.id ?? 'new');
	const isNew = $derived(id === 'new');

	// The pregnancy step is conditional; only render it when applicable.
	const showPregnancy = $derived(
		getVisibleSteps(assessment.data).some((s) => s.number === 16)
	);
	const visibleStepCount = $derived(getVisibleSteps(assessment.data).length);

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
		if (d.demographics.plannedProcedure.trim() === '') {
			found.push({ id: 'procedure', message: 'Planned procedure is required.' });
		}
		errors = found;
		return found.length === 0;
	}

	function submit() {
		if (!validate()) {
			document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		const { asaGrade, firedRules } = calculateASA(assessment.data);
		assessment.result = {
			asaGrade,
			firedRules,
			additionalFlags: detectAdditionalFlags(assessment.data),
			timestamp: new Date().toISOString()
		};
		goto(`/pre-operative-assessment-by-patient/pre-operative-assessments-by-patient/${id}/report`);
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
		{isNew ? 'New pre-operative assessment' : `Pre-operative assessment ${id}`}
	</h1>
	<p class="mt-1 text-sm text-base-content/70">
		Complete each section; the ASA Physical Status grade and safety flags are computed on submit.
	</p>
	<Progress label="Assessment sections" value={visibleStepCount} max={visibleStepCount} />
	<StepList label="Assessment sections" current={visibleStepCount}>
		{#each steps as step (step.number)}
			{#if step.number !== 16 || showPregnancy}
				<StepListItem status="finished" label={step.title}>{step.shortTitle}</StepListItem>
			{/if}
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

	<Form label="Pre-operative assessment" onsubmit={submit}>
		<Step1Demographics />
		<Step2Cardiovascular />
		<Step3Respiratory />
		<Step4Renal />
		<Step5Hepatic />
		<Step6Endocrine />
		<Step7Neurological />
		<Step8Haematological />
		<Step9MusculoskeletalAirway />
		<Step10Gastrointestinal />
		<Step11Medications />
		<Step12Allergies />
		<Step13PreviousAnaesthesia />
		<Step14SocialHistory />
		<Step15FunctionalCapacity />
		{#if showPregnancy}
			<Step16Pregnancy />
		{/if}
		<Step17CognitiveMentalHealth />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Compute ASA grade &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
