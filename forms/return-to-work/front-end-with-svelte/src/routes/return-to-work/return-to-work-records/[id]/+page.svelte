<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { calculateReturnToWork } from '#lib/engine/rtw-grader.js';
	import { steps, TOTAL_STEPS } from '#lib/config/steps.js';
	import { sampleAssessments } from '#lib/data/sample-reports.js';

	import Form from '#lib/components/ui/Form.svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import Progress from '#lib/components/ui/Progress.svelte';
	import StepList from '#lib/components/ui/StepList.svelte';
	import StepListItem from '#lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '#lib/components/ui/ErrorSummary.svelte';

	import Step1Clinician from '#lib/components/steps/Step1Clinician.svelte';
	import Step2Patient from '#lib/components/steps/Step2Patient.svelte';
	import Step3JobContext from '#lib/components/steps/Step3JobContext.svelte';
	import Step4Absence from '#lib/components/steps/Step4Absence.svelte';
	import Step5Reason from '#lib/components/steps/Step5Reason.svelte';
	import Step6Treatment from '#lib/components/steps/Step6Treatment.svelte';
	import Step7Functional from '#lib/components/steps/Step7Functional.svelte';
	import Step8Fitness from '#lib/components/steps/Step8Fitness.svelte';
	import Step9PhasedReturn from '#lib/components/steps/Step9PhasedReturn.svelte';
	import Step10Adjustments from '#lib/components/steps/Step10Adjustments.svelte';
	import Step11FollowUp from '#lib/components/steps/Step11FollowUp.svelte';
	import Step12SignOff from '#lib/components/steps/Step12SignOff.svelte';

	let errors = $state<{ id: string; message: string }[]>([]);

	const id = $derived(page.params.id ?? 'new');
	const isNew = $derived(id === 'new');

	// Hydrate the wizard whenever the route id changes: a saved draft for that id
	// wins, otherwise seed from the matching sample record (existing id) or a
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
		if (d.clinician.name.trim() === '') {
			found.push({ id: 'clinicianName', message: 'Clinician name is required.' });
		}
		if (d.patient.lastName.trim() === '') {
			found.push({ id: 'lastName', message: 'Patient last name is required.' });
		}
		if (d.patient.dateOfBirth === '') {
			found.push({ id: 'dob', message: 'Patient date of birth is required.' });
		}
		if (d.fitness.outcome === '') {
			found.push({ id: 'fitnessOutcome', message: 'A fitness outcome must be selected.' });
		}
		errors = found;
		return found.length === 0;
	}

	function submit() {
		if (!validate()) {
			document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		assessment.result = calculateReturnToWork(assessment.data);
		goto(`/return-to-work/return-to-work-records/${id}/report`);
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
		{isNew ? 'New return-to-work record' : `Return-to-work record ${id}`}
	</h1>
	<p class="mt-1 text-sm text-base-content/70">
		Complete the twelve sections; the fitness statement, restriction priority, and safety flags
		are computed on submit.
	</p>
	<Progress label="Record sections" value={TOTAL_STEPS} max={TOTAL_STEPS} />
	<StepList label="Record sections" current={TOTAL_STEPS}>
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

	<Form label="Return-to-work record" onsubmit={submit}>
		<Step1Clinician />
		<Step2Patient />
		<Step3JobContext />
		<Step4Absence />
		<Step5Reason />
		<Step6Treatment />
		<Step7Functional />
		<Step8Fitness />
		<Step9PhasedReturn />
		<Step10Adjustments />
		<Step11FollowUp />
		<Step12SignOff />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Compute statement &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
