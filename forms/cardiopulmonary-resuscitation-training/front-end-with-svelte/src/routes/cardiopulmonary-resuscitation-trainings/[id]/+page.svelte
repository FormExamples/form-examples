<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { gradeBLS } from '$lib/engine/bls-grader';
	import { steps, TOTAL_STEPS } from '$lib/config/steps';
	import { sampleAssessments } from '$lib/data/sample-reports';

	import Form from '$lib/components/ui/Form.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Progress from '$lib/components/ui/Progress.svelte';
	import StepList from '$lib/components/ui/StepList.svelte';
	import StepListItem from '$lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '$lib/components/ui/ErrorSummary.svelte';

	import Step1TraineeDetails from '$lib/components/steps/Step1TraineeDetails.svelte';
	import Step2SceneSafetyAssessment from '$lib/components/steps/Step2SceneSafetyAssessment.svelte';
	import Step3ResponsivenessBreathing from '$lib/components/steps/Step3ResponsivenessBreathing.svelte';
	import Step4ActivateEmergencyResponse from '$lib/components/steps/Step4ActivateEmergencyResponse.svelte';
	import Step5ChestCompressions from '$lib/components/steps/Step5ChestCompressions.svelte';
	import Step6AirwayRescueBreaths from '$lib/components/steps/Step6AirwayRescueBreaths.svelte';
	import Step7AEDShockDelivery from '$lib/components/steps/Step7AEDShockDelivery.svelte';
	import Step8TeamDynamicsHandoff from '$lib/components/steps/Step8TeamDynamicsHandoff.svelte';

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
		if (d.traineeDetails.lastName.trim() === '') {
			found.push({ id: 'lastName', message: 'Trainee last name is required.' });
		}
		if (d.traineeDetails.sessionDate === '') {
			found.push({ id: 'sessionDate', message: 'Session date is required.' });
		}
		errors = found;
		return found.length === 0;
	}

	function submit() {
		if (!validate()) {
			document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		assessment.result = gradeBLS(assessment.data);
		goto(`/cardiopulmonary-resuscitation-trainings/${id}/report`);
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
			{isNew ? 'New BLS skills verification' : `BLS skills verification ${id}`}
		</h1>
		<p class="mt-1 text-sm text-base-content/70">
			Complete the eight sections; the Pass / Fail outcome and flagged issues are computed on submit.
		</p>
		<Progress label="Verification sections" value={TOTAL_STEPS} max={TOTAL_STEPS} />
		<StepList label="Verification sections" current={TOTAL_STEPS}>
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

	<Form label="BLS skills verification" onsubmit={submit}>
		<Step1TraineeDetails />
		<Step2SceneSafetyAssessment />
		<Step3ResponsivenessBreathing />
		<Step4ActivateEmergencyResponse />
		<Step5ChestCompressions />
		<Step6AirwayRescueBreaths />
		<Step7AEDShockDelivery />
		<Step8TeamDynamicsHandoff />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Grade &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
