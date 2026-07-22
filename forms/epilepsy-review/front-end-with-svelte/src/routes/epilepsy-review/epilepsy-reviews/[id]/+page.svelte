<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { review } from '$lib/engine/epilepsy-review-grader';
	import { steps, TOTAL_STEPS } from '$lib/config/steps';
	import { sampleAssessments } from '$lib/data/sample-reports';

	import Form from '$lib/components/ui/Form.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Progress from '$lib/components/ui/Progress.svelte';
	import StepList from '$lib/components/ui/StepList.svelte';
	import StepListItem from '$lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '$lib/components/ui/ErrorSummary.svelte';

	import Step1Context from '$lib/components/steps/Step1Context.svelte';
	import Step2Profile from '$lib/components/steps/Step2Profile.svelte';
	import Step3Seizures from '$lib/components/steps/Step3Seizures.svelte';
	import Step4Medication from '$lib/components/steps/Step4Medication.svelte';
	import Step5Triggers from '$lib/components/steps/Step5Triggers.svelte';
	import Step6Sudep from '$lib/components/steps/Step6Sudep.svelte';
	import Step7Injuries from '$lib/components/steps/Step7Injuries.svelte';
	import Step8Safety from '$lib/components/steps/Step8Safety.svelte';
	import Step9Childbearing from '$lib/components/steps/Step9Childbearing.svelte';
	import Step10MentalHealth from '$lib/components/steps/Step10MentalHealth.svelte';
	import Step11Summary from '$lib/components/steps/Step11Summary.svelte';

	let errors = $state<{ id: string; message: string }[]>([]);

	const id = $derived(page.params.id ?? 'new');
	const isNew = $derived(id === 'new');

	// Hydrate the wizard whenever the route id changes: a saved draft for that id
	// wins, otherwise seed from the matching sample review (existing id) or a
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
		if (d.context.reviewerName.trim() === '') {
			found.push({ id: 'context-reviewerName', message: 'Reviewing clinician name is required.' });
		}
		if (d.context.reviewerRole === '') {
			found.push({ id: 'context-reviewerRole', message: 'Reviewer role is required.' });
		}
		if (d.profile.patientIdentifier.trim() === '') {
			found.push({
				id: 'profile-patientIdentifier',
				message: 'Patient identifier is required.'
			});
		}
		errors = found;
		return found.length === 0;
	}

	function submit() {
		if (!validate()) {
			document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		assessment.result = review(assessment.data);
		goto(`/epilepsy-review/epilepsy-reviews/${id}/report`);
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
		{isNew ? 'New epilepsy review' : `Epilepsy review ${id}`}
	</h1>
	<p class="mt-1 text-sm text-base-content/70">
		Complete the eleven sections; seizure control and review completeness are computed on submit.
		This is a documentation and decision-support instrument — there is no numeric score.
	</p>
	<Progress label="Review sections" value={TOTAL_STEPS} max={TOTAL_STEPS} />
	<StepList label="Review sections" current={TOTAL_STEPS}>
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

	<Form label="Epilepsy review" onsubmit={submit}>
		<Step1Context />
		<Step2Profile />
		<Step3Seizures />
		<Step4Medication />
		<Step5Triggers />
		<Step6Sudep />
		<Step7Injuries />
		<Step8Safety />
		<Step9Childbearing />
		<Step10MentalHealth />
		<Step11Summary />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Grade &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
