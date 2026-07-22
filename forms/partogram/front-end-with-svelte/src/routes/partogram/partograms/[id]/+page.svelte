<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateGrade } from '$lib/engine/partogram-grader';
	import { steps, TOTAL_STEPS } from '$lib/config/steps';
	import { sampleAssessments } from '$lib/data/sample-reports';

	import Form from '$lib/components/ui/Form.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Progress from '$lib/components/ui/Progress.svelte';
	import StepList from '$lib/components/ui/StepList.svelte';
	import StepListItem from '$lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '$lib/components/ui/ErrorSummary.svelte';

	import Step1LabourContext from '$lib/components/steps/Step1LabourContext.svelte';
	import Step2PatientIdentification from '$lib/components/steps/Step2PatientIdentification.svelte';
	import Step3AdmissionFindings from '$lib/components/steps/Step3AdmissionFindings.svelte';
	import Step4ObservationSeries from '$lib/components/steps/Step4ObservationSeries.svelte';
	import Step5SummaryAndProgress from '$lib/components/steps/Step5SummaryAndProgress.svelte';

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
		if (d.context.clinicianName.trim() === '') {
			found.push({ id: 'context-clinicianName', message: 'Recording clinician is required.' });
		}
		if (d.context.clinicianRole === '') {
			found.push({ id: 'context-clinicianRole', message: 'Clinician role is required.' });
		}
		if (d.context.activePhaseStartAt.trim() === '') {
			found.push({
				id: 'context-activePhaseStartAt',
				message: 'Active-phase start time is required.'
			});
		}
		if (d.patient.patientIdentifier.trim() === '') {
			found.push({ id: 'patient-patientIdentifier', message: 'Patient identifier is required.' });
		}
		errors = found;
		return found.length === 0;
	}

	function submit() {
		if (!validate()) {
			document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		assessment.result = calculateGrade(assessment.data);
		goto(`/partogram/partograms/${id}/report`);
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
		{isNew ? 'New partogram' : `Partogram ${id}`}
	</h1>
	<p class="mt-1 text-sm text-base-content/70">
		Complete the five sections; the labour-progress classification and flagged issues are computed
		on submit.
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

	<Form label="Partogram" onsubmit={submit}>
		<Step1LabourContext />
		<Step2PatientIdentification />
		<Step3AdmissionFindings />
		<Step4ObservationSeries />
		<Step5SummaryAndProgress />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Submit &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
