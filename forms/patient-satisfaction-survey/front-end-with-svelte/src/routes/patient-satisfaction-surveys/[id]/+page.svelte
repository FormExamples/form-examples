<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateSatisfactionGrade } from '$lib/engine/grader';
	import { steps, TOTAL_STEPS } from '$lib/config/steps';
	import { sampleAssessments } from '$lib/data/sample-reports';

	import Form from '$lib/components/ui/Form.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Progress from '$lib/components/ui/Progress.svelte';
	import StepList from '$lib/components/ui/StepList.svelte';
	import StepListItem from '$lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '$lib/components/ui/ErrorSummary.svelte';

	import Step1Demographics from '$lib/components/steps/Step1Demographics.svelte';
	import Step2VisitDetails from '$lib/components/steps/Step2VisitDetails.svelte';
	import Step3AccessWaitingTimes from '$lib/components/steps/Step3AccessWaitingTimes.svelte';
	import Step4CommunicationInformation from '$lib/components/steps/Step4CommunicationInformation.svelte';
	import Step5ClinicalCareQuality from '$lib/components/steps/Step5ClinicalCareQuality.svelte';
	import Step6StaffAttitude from '$lib/components/steps/Step6StaffAttitude.svelte';
	import Step7EnvironmentFacilities from '$lib/components/steps/Step7EnvironmentFacilities.svelte';
	import Step8DischargeFollowUp from '$lib/components/steps/Step8DischargeFollowUp.svelte';
	import Step9OverallExperience from '$lib/components/steps/Step9OverallExperience.svelte';
	import Step10CommentsSuggestions from '$lib/components/steps/Step10CommentsSuggestions.svelte';

	let errors = $state<{ id: string; message: string }[]>([]);

	const id = $derived(page.params.id ?? 'new');
	const isNew = $derived(id === 'new');

	// Hydrate the wizard whenever the route id changes: a saved draft for that id
	// wins, otherwise seed from the matching sample survey (existing id) or a
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
		if (d.visitDetails.visitDate === '') {
			found.push({ id: 'visitDate', message: 'Visit date is required.' });
		}
		if (d.overallExperience.overallSatisfaction === null) {
			found.push({
				id: 'overallSatisfaction',
				message: 'Overall satisfaction rating is required.'
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
		assessment.result = calculateSatisfactionGrade(assessment.data);
		goto(`/patient-satisfaction-surveys/${id}/report`);
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
			{isNew ? 'New patient satisfaction survey' : `Patient satisfaction survey ${id}`}
		</h1>
		<p class="mt-1 text-sm text-base-content/70">
			Complete the ten sections; the normalized satisfaction score and category are computed on
			submit.
		</p>
		<Progress label="Survey sections" value={TOTAL_STEPS} max={TOTAL_STEPS} />
		<StepList label="Survey sections" current={TOTAL_STEPS}>
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

	<Form label="Patient satisfaction survey" onsubmit={submit}>
		<Step1Demographics />
		<Step2VisitDetails />
		<Step3AccessWaitingTimes />
		<Step4CommunicationInformation />
		<Step5ClinicalCareQuality />
		<Step6StaffAttitude />
		<Step7EnvironmentFacilities />
		<Step8DischargeFollowUp />
		<Step9OverallExperience />
		<Step10CommentsSuggestions />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Compute score &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
