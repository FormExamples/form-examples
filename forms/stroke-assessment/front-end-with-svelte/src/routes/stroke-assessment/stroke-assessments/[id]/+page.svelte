<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateNIHSS } from '$lib/engine/nihss-grader';
	import { detectAdditionalFlags } from '$lib/engine/flagged-issues';
	import { steps, TOTAL_STEPS } from '$lib/config/steps';
	import { sampleAssessments } from '$lib/data/sample-reports';

	import Form from '$lib/components/ui/Form.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Progress from '$lib/components/ui/Progress.svelte';
	import StepList from '$lib/components/ui/StepList.svelte';
	import StepListItem from '$lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '$lib/components/ui/ErrorSummary.svelte';

	import Step1Demographics from '$lib/components/steps/Step1Demographics.svelte';
	import Step2SymptomOnset from '$lib/components/steps/Step2SymptomOnset.svelte';
	import Step3LevelOfConsciousness from '$lib/components/steps/Step3LevelOfConsciousness.svelte';
	import Step4BestGazeVisual from '$lib/components/steps/Step4BestGazeVisual.svelte';
	import Step5FacialPalsyMotor from '$lib/components/steps/Step5FacialPalsyMotor.svelte';
	import Step6LimbAtaxiaSensory from '$lib/components/steps/Step6LimbAtaxiaSensory.svelte';
	import Step7LanguageDysarthria from '$lib/components/steps/Step7LanguageDysarthria.svelte';
	import Step8ExtinctionInattention from '$lib/components/steps/Step8ExtinctionInattention.svelte';
	import Step9RiskFactors from '$lib/components/steps/Step9RiskFactors.svelte';
	import Step10CurrentMedications from '$lib/components/steps/Step10CurrentMedications.svelte';

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
		const { nihssScore, nihssCategoryLabel, firedRules } = calculateNIHSS(assessment.data);
		assessment.result = {
			nihssScore,
			nihssCategory: nihssCategoryLabel,
			firedRules,
			additionalFlags: detectAdditionalFlags(assessment.data),
			timestamp: new Date().toISOString()
		};
		goto(`/stroke-assessment/stroke-assessments/${id}/report`);
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
		{isNew ? 'New stroke assessment' : `Stroke assessment ${id}`}
	</h1>
	<p class="mt-1 text-sm text-base-content/70">
		Complete the ten sections; the NIHSS score and stroke severity are computed on submit.
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

	<Form label="Stroke assessment" onsubmit={submit}>
		<Step1Demographics />
		<Step2SymptomOnset />
		<Step3LevelOfConsciousness />
		<Step4BestGazeVisual />
		<Step5FacialPalsyMotor />
		<Step6LimbAtaxiaSensory />
		<Step7LanguageDysarthria />
		<Step8ExtinctionInattention />
		<Step9RiskFactors />
		<Step10CurrentMedications />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Compute NIHSS &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
