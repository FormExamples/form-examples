<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { validateCounterReferral } from '$lib/engine/counter-referral-validator';
	import { detectFlaggedIssues } from '$lib/engine/flagged-issues';
	import { steps, TOTAL_STEPS } from '$lib/config/steps';
	import { sampleAssessments } from '$lib/data/sample-reports';

	import Form from '$lib/components/ui/Form.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Progress from '$lib/components/ui/Progress.svelte';
	import StepList from '$lib/components/ui/StepList.svelte';
	import StepListItem from '$lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '$lib/components/ui/ErrorSummary.svelte';

	import Step1PatientIdentification from '$lib/components/steps/Step1PatientIdentification.svelte';
	import Step2FacilityDetails from '$lib/components/steps/Step2FacilityDetails.svelte';
	import Step3Situation from '$lib/components/steps/Step3Situation.svelte';
	import Step4Background from '$lib/components/steps/Step4Background.svelte';
	import Step5Assessment from '$lib/components/steps/Step5Assessment.svelte';
	import Step6Recommendations from '$lib/components/steps/Step6Recommendations.svelte';
	import Step7ProviderSignoff from '$lib/components/steps/Step7ProviderSignoff.svelte';

	let errors = $state<{ id: string; message: string }[]>([]);

	const id = $derived(page.params.id ?? 'new');
	const isNew = $derived(id === 'new');

	// Hydrate the wizard whenever the route id changes: a saved draft for that id
	// wins, otherwise seed from the matching sample (existing id) or a blank draft
	// (new).
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
		if (d.patientIdentification.patientName.trim() === '') {
			found.push({ id: 'patientName', message: 'Patient name is required.' });
		}
		if (d.patientIdentification.dateOfBirth === '') {
			found.push({ id: 'dateOfBirth', message: 'Date of birth is required.' });
		}
		errors = found;
		return found.length === 0;
	}

	function submit() {
		if (!validate()) {
			document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		assessment.validation = validateCounterReferral(assessment.data);
		assessment.flags = detectFlaggedIssues(assessment.data);
		goto(`/who-counter-referral-form/who-counter-referral-forms/${id}/report`);
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
			{isNew ? 'New counter-referral' : `Counter-referral ${id}`}
		</h1>
		<p class="mt-1 text-sm text-base-content/70">
			Complete the seven SBAR sections; the completeness summary and flagged issues are computed on
			submit.
		</p>
		<Progress label="Form sections" value={TOTAL_STEPS} max={TOTAL_STEPS} />
		<StepList label="Form sections" current={TOTAL_STEPS}>
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

	<Form label="WHO Counter-Referral Form" onsubmit={submit}>
		<Step1PatientIdentification />
		<Step2FacilityDetails />
		<Step3Situation />
		<Step4Background />
		<Step5Assessment />
		<Step6Recommendations />
		<Step7ProviderSignoff />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Check form &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
