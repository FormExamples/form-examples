<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateAQ10 } from '$lib/engine/aq10-grader';
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
	import Step2ScreeningPurpose from '$lib/components/steps/Step2ScreeningPurpose.svelte';
	import Step3AQ10Questionnaire from '$lib/components/steps/Step3AQ10Questionnaire.svelte';
	import Step4SocialCommunication from '$lib/components/steps/Step4SocialCommunication.svelte';
	import Step5RepetitiveBehaviors from '$lib/components/steps/Step5RepetitiveBehaviors.svelte';
	import Step6SensoryProfile from '$lib/components/steps/Step6SensoryProfile.svelte';
	import Step7DevelopmentalHistory from '$lib/components/steps/Step7DevelopmentalHistory.svelte';
	import Step8CurrentSupport from '$lib/components/steps/Step8CurrentSupport.svelte';
	import Step9FamilyHistory from '$lib/components/steps/Step9FamilyHistory.svelte';

	let errors = $state<{ id: string; message: string }[]>([]);

	const id = $derived(page.params.id ?? 'new');
	const isNew = $derived(id === 'new');

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
		const { aq10Score, aq10CategoryLabel, firedRules } = calculateAQ10(assessment.data);
		assessment.result = {
			aq10Score,
			aq10Category: aq10CategoryLabel,
			firedRules,
			additionalFlags: detectAdditionalFlags(assessment.data),
			timestamp: new Date().toISOString()
		};
		goto(`/autism-assessment/autism-assessments/${id}/report`);
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
		{isNew ? 'New autism assessment' : `Autism assessment ${id}`}
	</h1>
	<p class="mt-1 text-sm text-base-content/70">
		Complete the nine sections; the AQ-10 score and screening category are computed on submit.
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

	<Form label="Autism assessment" onsubmit={submit}>
		<Step1Demographics />
		<Step2ScreeningPurpose />
		<Step3AQ10Questionnaire />
		<Step4SocialCommunication />
		<Step5RepetitiveBehaviors />
		<Step6SensoryProfile />
		<Step7DevelopmentalHistory />
		<Step8CurrentSupport />
		<Step9FamilyHistory />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Compute score &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
