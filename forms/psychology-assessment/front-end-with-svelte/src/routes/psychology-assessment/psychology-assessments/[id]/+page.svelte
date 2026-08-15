<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { calculateDass21 } from '#lib/engine/dass21-grader.js';
	import { detectAdditionalFlags } from '#lib/engine/flagged-issues.js';
	import { steps, TOTAL_STEPS } from '#lib/config/steps.js';
	import { sampleAssessments } from '#lib/data/sample-reports.js';

	import Form from '#lib/components/ui/Form.svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import Alert from '#lib/components/ui/Alert.svelte';
	import Progress from '#lib/components/ui/Progress.svelte';
	import StepList from '#lib/components/ui/StepList.svelte';
	import StepListItem from '#lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '#lib/components/ui/ErrorSummary.svelte';

	import Step1Demographics from '#lib/components/steps/Step1Demographics.svelte';
	import Step2ReasonForAssessment from '#lib/components/steps/Step2ReasonForAssessment.svelte';
	import Step3DassDepression from '#lib/components/steps/Step3DassDepression.svelte';
	import Step4DassAnxiety from '#lib/components/steps/Step4DassAnxiety.svelte';
	import Step5DassStress from '#lib/components/steps/Step5DassStress.svelte';
	import Step6FunctionalImpact from '#lib/components/steps/Step6FunctionalImpact.svelte';
	import Step7RiskScreen from '#lib/components/steps/Step7RiskScreen.svelte';
	import Step8SupportAndHistory from '#lib/components/steps/Step8SupportAndHistory.svelte';

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
		const { depression, anxiety, stress, firedRules } = calculateDass21(assessment.data);
		const additionalFlags = detectAdditionalFlags(assessment.data, depression, anxiety, stress);
		assessment.result = {
			depression,
			anxiety,
			stress,
			firedRules,
			additionalFlags,
			timestamp: new Date().toISOString()
		};
		goto(`/psychology-assessment/psychology-assessments/${id}/report`);
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
		{isNew ? 'New psychology assessment' : `Psychology assessment ${id}`}
	</h1>
	<p class="mt-1 text-sm text-base-content/70">
		Complete the eight sections; the DASS-21 subscale severities and safety flags are computed on
		submit.
	</p>
	<Progress label="Assessment sections" value={TOTAL_STEPS} max={TOTAL_STEPS} />
	<StepList label="Assessment sections" current={TOTAL_STEPS}>
		{#each steps as step (step.number)}
			<StepListItem status="finished" label={step.title}>{step.shortTitle}</StepListItem>
		{/each}
	</StepList>

	<Alert type="info">
		This single-page questionnaire collects your demographics, the DASS-21 (a validated screen of
		depression, anxiety, and stress), and a brief safety screen. Your responses generate a clinical
		report; if any urgent concerns are flagged, your clinician will be alerted.
	</Alert>

	{#if errors.length > 0}
		<ErrorSummary title="Please fix the following before submitting" class="mb-6">
			<ul>
				{#each errors as e (e.id)}
					<li><a href={`#${e.id}`}>{e.message}</a></li>
				{/each}
			</ul>
		</ErrorSummary>
	{/if}

	<Form label="Psychology assessment" onsubmit={submit}>
		<Step1Demographics />
		<Step2ReasonForAssessment />
		<Step3DassDepression />
		<Step4DassAnxiety />
		<Step5DassStress />
		<Step6FunctionalImpact />
		<Step7RiskScreen />
		<Step8SupportAndHistory />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Compute scores &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
