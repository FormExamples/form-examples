<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { gradeOOCG } from '#lib/engine/oocg-grader.js';
	import { steps, TOTAL_STEPS } from '#lib/config/steps.js';
	import { sampleAssessments } from '#lib/data/sample-reports.js';

	import Form from '#lib/components/ui/Form.svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import Progress from '#lib/components/ui/Progress.svelte';
	import StepList from '#lib/components/ui/StepList.svelte';
	import StepListItem from '#lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '#lib/components/ui/ErrorSummary.svelte';

	import Step1PatientDetails from '#lib/components/steps/Step1PatientDetails.svelte';
	import Step2EncounterDetails from '#lib/components/steps/Step2EncounterDetails.svelte';
	import Step3OperationalEfficiency from '#lib/components/steps/Step3OperationalEfficiency.svelte';
	import Step4ClinicalOutcome from '#lib/components/steps/Step4ClinicalOutcome.svelte';
	import Step5EQ5D5L from '#lib/components/steps/Step5EQ5D5L.svelte';
	import Step6GRC from '#lib/components/steps/Step6GRC.svelte';
	import Step7PROMIS from '#lib/components/steps/Step7PROMIS.svelte';
	import Step8FFT from '#lib/components/steps/Step8FFT.svelte';
	import Step9FollowupPlan from '#lib/components/steps/Step9FollowupPlan.svelte';
	import Step10SignOff from '#lib/components/steps/Step10SignOff.svelte';
	import Step11ReviewSubmit from '#lib/components/steps/Step11ReviewSubmit.svelte';

	let errors = $state<{ id: string; message: string }[]>([]);

	const id = $derived(page.params.id ?? 'new');
	const isNew = $derived(id === 'new');

	// Hydrate the wizard whenever the route id changes: a saved draft for that id
	// wins, otherwise seed from the matching sample report (existing id) or a
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
		if (d.patientDetails.familyName.trim() === '') {
			found.push({ id: 'familyName', message: 'Patient family name is required.' });
		}
		if (d.patientDetails.dateOfBirth === '') {
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
		assessment.result = gradeOOCG(assessment.data);
		goto(`/outpatient-outcome/outpatient-outcomes/${id}/report`);
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
		{isNew ? 'New outpatient outcome report' : `Outpatient outcome report ${id}`}
	</h1>
	<p class="mt-1 text-sm text-base-content/70">
		Complete the eleven sections; the OOCG domain grades and overall grade are computed on submit.
	</p>
	<Progress label="Report sections" value={TOTAL_STEPS} max={TOTAL_STEPS} />
	<StepList label="Report sections" current={TOTAL_STEPS}>
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

	<Form label="Outpatient outcome report" onsubmit={submit}>
		<Step1PatientDetails />
		<Step2EncounterDetails />
		<Step3OperationalEfficiency />
		<Step4ClinicalOutcome />
		<Step5EQ5D5L />
		<Step6GRC />
		<Step7PROMIS />
		<Step8FFT />
		<Step9FollowupPlan />
		<Step10SignOff />
		<Step11ReviewSubmit />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Compute grade &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
