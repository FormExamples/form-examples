<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { requestStore } from '$lib/stores/request.svelte';
	import { calculateGrade } from '$lib/engine/grader';
	import { countSelectedTests } from '$lib/engine/utils';
	import { steps, TOTAL_STEPS } from '$lib/config/steps';
	import { sampleRequests } from '$lib/data/sample-reports';

	import Form from '$lib/components/ui/Form.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Progress from '$lib/components/ui/Progress.svelte';
	import StepList from '$lib/components/ui/StepList.svelte';
	import StepListItem from '$lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '$lib/components/ui/ErrorSummary.svelte';

	import Step1RequestingClinician from '$lib/components/steps/Step1RequestingClinician.svelte';
	import Step2PatientIdentification from '$lib/components/steps/Step2PatientIdentification.svelte';
	import Step3RequestedTests from '$lib/components/steps/Step3RequestedTests.svelte';
	import Step4ClinicalContext from '$lib/components/steps/Step4ClinicalContext.svelte';
	import Step5SymptomsAndRedFlags from '$lib/components/steps/Step5SymptomsAndRedFlags.svelte';
	import Step6Specimen from '$lib/components/steps/Step6Specimen.svelte';
	import Step7TriageAndSubmit from '$lib/components/steps/Step7TriageAndSubmit.svelte';

	let errors = $state<{ id: string; message: string }[]>([]);

	const id = $derived(page.params.id ?? 'new');
	const isNew = $derived(id === 'new');

	// Hydrate the wizard whenever the route id changes: a saved draft for that id
	// wins, otherwise seed from the matching sample request (existing id) or a
	// blank draft (new).
	$effect(() => {
		const seed = sampleRequests.find((s) => s.id === id)?.request;
		if (requestStore.id !== id) {
			requestStore.loadForId(id, seed);
			errors = [];
		}
	});

	function validate(): boolean {
		const d = requestStore.data;
		const found: { id: string; message: string }[] = [];
		if (d.clinician.clinicianName.trim() === '') {
			found.push({ id: 'clinicianName', message: 'Requesting clinician name is required.' });
		}
		if (d.patient.firstName.trim() === '') {
			found.push({ id: 'firstName', message: 'Patient first name is required.' });
		}
		if (d.patient.lastName.trim() === '') {
			found.push({ id: 'lastName', message: 'Patient last name is required.' });
		}
		if (d.patient.nhsNumber.trim() === '') {
			found.push({ id: 'nhsNumber', message: 'NHS number is required.' });
		}
		if (countSelectedTests(d.tests) === 0) {
			found.push({ id: 'tests', message: 'Select at least one requested test.' });
		}
		if (d.context.primaryIndication === '') {
			found.push({ id: 'primaryIndication', message: 'Primary clinical indication is required.' });
		}
		if (d.specimen.specimenType === '') {
			found.push({ id: 'specimenType', message: 'Specimen type is required.' });
		}
		errors = found;
		return found.length === 0;
	}

	function submit() {
		if (!validate()) {
			document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		requestStore.result = calculateGrade(requestStore.data);
		goto(`/urinalysis-test-request/urinalysis-test-requests/${id}/report`);
	}

	function startOver() {
		const seed = sampleRequests.find((s) => s.id === id)?.request;
		requestStore.reset();
		requestStore.loadForId(id, seed);
		errors = [];
	}
</script>

<main class="mx-auto max-w-3xl px-4 py-6">
	<header class="mb-6 no-print">
		<h1 class="text-2xl font-bold text-base-content">
			{isNew ? 'New urinalysis test request' : `Urinalysis test request ${id}`}
		</h1>
		<p class="mt-1 text-sm text-base-content/70">
			Complete the seven sections; the four-axis vetting grade is computed on submit.
		</p>
		<Progress label="Request sections" value={TOTAL_STEPS} max={TOTAL_STEPS} />
		<StepList label="Request sections" current={TOTAL_STEPS}>
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

	<Form label="Urinalysis test request" onsubmit={submit}>
		<Step1RequestingClinician />
		<Step2PatientIdentification />
		<Step3RequestedTests />
		<Step4ClinicalContext />
		<Step5SymptomsAndRedFlags />
		<Step6Specimen />
		<Step7TriageAndSubmit />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Compute grade &amp; view vetting report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
