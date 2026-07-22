<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateGrade } from '$lib/engine/grader';
	import { steps, TOTAL_STEPS } from '$lib/config/steps';
	import { sampleAssessments } from '$lib/data/sample-reports';

	import Form from '$lib/components/ui/Form.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Progress from '$lib/components/ui/Progress.svelte';
	import StepList from '$lib/components/ui/StepList.svelte';
	import StepListItem from '$lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '$lib/components/ui/ErrorSummary.svelte';

	import Step1Clinician from '$lib/components/steps/Step1Clinician.svelte';
	import Step2PatientIdentification from '$lib/components/steps/Step2PatientIdentification.svelte';
	import Step3RequestedTest from '$lib/components/steps/Step3RequestedTest.svelte';
	import Step4ClinicalIndication from '$lib/components/steps/Step4ClinicalIndication.svelte';
	import Step5BloodGroupHistory from '$lib/components/steps/Step5BloodGroupHistory.svelte';
	import Step6SampleSafety from '$lib/components/steps/Step6SampleSafety.svelte';
	import Step7TriageSubmit from '$lib/components/steps/Step7TriageSubmit.svelte';

	let errors = $state<{ id: string; message: string }[]>([]);

	const id = $derived(page.params.id ?? 'new');
	const isNew = $derived(id === 'new');

	// Hydrate the wizard whenever the route id changes: a saved draft for that id
	// wins, otherwise seed from the matching sample request (existing id) or a
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
		if (d.clinician.clinicianName.trim() === '') {
			found.push({ id: 'clinician-clinicianName', message: 'Requesting clinician name is required.' });
		}
		if (d.patient.firstName.trim() === '') {
			found.push({ id: 'patient-firstName', message: 'Patient first name is required.' });
		}
		if (d.patient.lastName.trim() === '') {
			found.push({ id: 'patient-lastName', message: 'Patient last name is required.' });
		}
		if (d.request.requestType === '') {
			found.push({ id: 'request-requestType', message: 'Request type is required.' });
		}
		if (d.request.component === '') {
			found.push({ id: 'request-component', message: 'Blood component is required.' });
		}
		if (d.indication.primaryIndication === '') {
			found.push({ id: 'indication-primaryIndication', message: 'Primary indication is required.' });
		}
		if (d.indication.clinicalDetails.trim() === '') {
			found.push({ id: 'indication-clinicalDetails', message: 'Clinical details are required.' });
		}
		if (d.triage.urgency === '') {
			found.push({ id: 'triage-urgency', message: 'Requested urgency is required.' });
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
		goto(`/blood-cross-match-test-request/blood-cross-match-test-requests/${id}/report`);
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
		{isNew ? 'New blood cross-match request' : `Blood cross-match request ${id}`}
	</h1>
	<p class="mt-1 text-sm text-base-content/70">
		Complete the seven sections; the four-axis grade, recommendation, and safety flags are computed
		on submit.
	</p>
	<Progress label="Request sections" value={TOTAL_STEPS} max={TOTAL_STEPS} />
	<StepList label="Request sections" current={TOTAL_STEPS}>
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

	<Form label="Blood cross-match test request" onsubmit={submit}>
		<Step1Clinician />
		<Step2PatientIdentification />
		<Step3RequestedTest />
		<Step4ClinicalIndication />
		<Step5BloodGroupHistory />
		<Step6SampleSafety />
		<Step7TriageSubmit />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Compute grade &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
