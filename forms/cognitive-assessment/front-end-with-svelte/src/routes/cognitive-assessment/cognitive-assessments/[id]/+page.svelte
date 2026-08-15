<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { calculateMMSE } from '#lib/engine/mmse-grader.js';
	import { detectAdditionalFlags } from '#lib/engine/flagged-issues.js';
	import { steps, TOTAL_STEPS } from '#lib/config/steps.js';
	import { sampleAssessments } from '#lib/data/sample-reports.js';

	import Form from '#lib/components/ui/Form.svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import Progress from '#lib/components/ui/Progress.svelte';
	import StepList from '#lib/components/ui/StepList.svelte';
	import StepListItem from '#lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '#lib/components/ui/ErrorSummary.svelte';

	import Step1Demographics from '#lib/components/steps/Step1Demographics.svelte';
	import Step2ReferralInfo from '#lib/components/steps/Step2ReferralInfo.svelte';
	import Step3Orientation from '#lib/components/steps/Step3Orientation.svelte';
	import Step4Registration from '#lib/components/steps/Step4Registration.svelte';
	import Step5AttentionCalculation from '#lib/components/steps/Step5AttentionCalculation.svelte';
	import Step6Recall from '#lib/components/steps/Step6Recall.svelte';
	import Step7Language from '#lib/components/steps/Step7Language.svelte';
	import Step8RepetitionCommands from '#lib/components/steps/Step8RepetitionCommands.svelte';
	import Step9Visuospatial from '#lib/components/steps/Step9Visuospatial.svelte';
	import Step10FunctionalHistory from '#lib/components/steps/Step10FunctionalHistory.svelte';

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
		const { mmseScore, mmseCategoryLabel, firedRules } = calculateMMSE(assessment.data);
		assessment.result = {
			mmseScore,
			mmseCategory: mmseCategoryLabel,
			firedRules,
			additionalFlags: detectAdditionalFlags(assessment.data),
			timestamp: new Date().toISOString()
		};
		goto(`/cognitive-assessment/cognitive-assessments/${id}/report`);
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
		{isNew ? 'New cognitive assessment' : `Cognitive assessment ${id}`}
	</h1>
	<p class="mt-1 text-sm text-base-content/70">
		Complete the ten sections; the MMSE score and impairment category are computed on submit.
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

	<Form label="Cognitive assessment" onsubmit={submit}>
		<Step1Demographics />
		<Step2ReferralInfo />
		<Step3Orientation />
		<Step4Registration />
		<Step5AttentionCalculation />
		<Step6Recall />
		<Step7Language />
		<Step8RepetitionCommands />
		<Step9Visuospatial />
		<Step10FunctionalHistory />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Compute MMSE &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
