<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { resultStore } from '$lib/stores/result.svelte';
	import { calculateGrade } from '$lib/engine/grader';
	import { steps, TOTAL_STEPS } from '$lib/config/steps';
	import { sampleReports } from '$lib/data/sample-reports';

	import Form from '$lib/components/ui/Form.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Progress from '$lib/components/ui/Progress.svelte';
	import StepList from '$lib/components/ui/StepList.svelte';
	import StepListItem from '$lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '$lib/components/ui/ErrorSummary.svelte';

	import Step1ResponseIdentification from '$lib/components/steps/Step1ResponseIdentification.svelte';
	import Step2PatientIdentification from '$lib/components/steps/Step2PatientIdentification.svelte';
	import Step3ClinicalAssessment from '$lib/components/steps/Step3ClinicalAssessment.svelte';
	import Step4StructuredFindings from '$lib/components/steps/Step4StructuredFindings.svelte';
	import Step5DiagnosisMeasurement from '$lib/components/steps/Step5DiagnosisMeasurement.svelte';
	import Step6ManagementFollowUp from '$lib/components/steps/Step6ManagementFollowUp.svelte';
	import Step7SignOff from '$lib/components/steps/Step7SignOff.svelte';

	const id = $derived(page.params.id ?? 'new');
	const isNew = $derived(id === 'new');

	// Load the draft for this id whenever the route param changes. For a known
	// sample row, seed a blank draft with the row's patient/consultation fields.
	$effect(() => {
		const current = id;
		if (resultStore.id !== current) {
			const sample = sampleReports.find((r) => r.id === current);
			resultStore.loadForId(
				current,
				sample
					? {
							patientName: sample.patientName,
							consultationType: sample.consultationType,
							responseStatus: sample.responseStatus,
							respondedDate: sample.respondedDate
						}
					: undefined
			);
		}
	});

	let errors = $state<{ id: string; message: string }[]>([]);

	function validate(): boolean {
		const d = resultStore.data;
		const found: { id: string; message: string }[] = [];
		if (d.respondingClinician.trim() === '') {
			found.push({ id: 'respondingClinician', message: 'Responding clinician is required.' });
		}
		if (d.responseStatus === '') {
			found.push({ id: 'responseStatus', message: 'Response status is required.' });
		}
		if (d.patientName.trim() === '') {
			found.push({ id: 'patientName', message: 'Patient name is required.' });
		}
		if (d.clinicalSummary.trim() === '') {
			found.push({ id: 'clinicalSummary', message: 'Clinical summary is required.' });
		}
		errors = found;
		return found.length === 0;
	}

	function submit() {
		if (!validate()) {
			document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		resultStore.result = calculateGrade(resultStore.data);
		goto(`/cardiology-response/cardiology-responses/${id}/report`);
	}

	function startOver() {
		resultStore.reset();
		errors = [];
	}
</script>

<main class="mx-16 px-4 py-6">
	<h1 class="text-2xl font-bold text-base-content">
		{isNew ? 'New cardiology response' : `Cardiology response ${id}`}
	</h1>
	<p class="mt-1 text-sm text-base-content/70">
		Complete the seven sections; the four-axis interpretation grade is computed on submit.
	</p>
	<Progress label="Response sections" value={TOTAL_STEPS} max={TOTAL_STEPS} />
	<StepList label="Response sections" current={TOTAL_STEPS}>
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

	<Form label="Cardiology response" onsubmit={submit}>
		<Step1ResponseIdentification />
		<Step2PatientIdentification />
		<Step3ClinicalAssessment />
		<Step4StructuredFindings />
		<Step5DiagnosisMeasurement />
		<Step6ManagementFollowUp />
		<Step7SignOff />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Compute grade &amp; view response</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
