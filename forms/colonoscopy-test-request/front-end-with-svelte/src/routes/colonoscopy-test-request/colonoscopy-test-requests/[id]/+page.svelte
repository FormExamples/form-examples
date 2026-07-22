<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { request } from '$lib/stores/request.svelte';
	import { calculateGrade } from '$lib/engine/grader';
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
	import Step3RequestedProcedure from '$lib/components/steps/Step3RequestedProcedure.svelte';
	import Step4RedFlagsAndTriageLabs from '$lib/components/steps/Step4RedFlagsAndTriageLabs.svelte';
	import Step5Medication from '$lib/components/steps/Step5Medication.svelte';
	import Step6BowelPrepAndFitness from '$lib/components/steps/Step6BowelPrepAndFitness.svelte';
	import Step7TriageAndSubmit from '$lib/components/steps/Step7TriageAndSubmit.svelte';

	let errors = $state<{ id: string; message: string }[]>([]);

	const id = $derived(page.params.id ?? 'new');
	const isNew = $derived(id === 'new');

	// Hydrate the wizard whenever the route id changes: a saved draft for that id
	// wins, otherwise seed from the matching sample request (existing id) or a
	// blank draft (new).
	$effect(() => {
		const seed = sampleRequests.find((s) => s.id === id)?.request;
		if (request.id !== id) {
			request.loadForId(id, seed);
			errors = [];
		}
	});

	function validate(): boolean {
		const d = request.data;
		const found: { id: string; message: string }[] = [];
		if (d.clinician.clinicianName.trim() === '') {
			found.push({ id: 'clinicianName', message: 'Requesting clinician is required.' });
		}
		if (d.patient.firstName.trim() === '' || d.patient.lastName.trim() === '') {
			found.push({ id: 'firstName', message: 'Patient first and last name are required.' });
		}
		if (d.request.procedure === '') {
			found.push({ id: 'procedure', message: 'Requested procedure is required.' });
		}
		if (d.request.primaryIndication === '') {
			found.push({ id: 'primaryIndication', message: 'Primary indication is required.' });
		}
		if (d.request.clinicalQuestion.trim() === '') {
			found.push({ id: 'clinicalQuestion', message: 'Specific clinical question is required.' });
		}
		if (d.triage.urgency === '') {
			found.push({ id: 'urgency', message: 'Requested urgency is required.' });
		}
		errors = found;
		return found.length === 0;
	}

	function submit() {
		if (!validate()) {
			document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		request.result = calculateGrade(request.data);
		goto(`/colonoscopy-test-request/colonoscopy-test-requests/${id}/report`);
	}

	function startOver() {
		const seed = sampleRequests.find((s) => s.id === id)?.request;
		request.reset();
		request.loadForId(id, seed);
		errors = [];
	}
</script>

<main class="mx-16 px-4 py-6">
	<h1 class="text-2xl font-bold text-base-content">
		{isNew ? 'New colonoscopy request' : `Colonoscopy request ${id}`}
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

	{#if errors.length > 0}
		<ErrorSummary title="Please fix the following before submitting" class="mb-6">
			<ul>
				{#each errors as e (e.id)}
					<li><a href={`#${e.id}`}>{e.message}</a></li>
				{/each}
			</ul>
		</ErrorSummary>
	{/if}

	<Form label="Colonoscopy request" onsubmit={submit}>
		<Step1RequestingClinician />
		<Step2PatientIdentification />
		<Step3RequestedProcedure />
		<Step4RedFlagsAndTriageLabs />
		<Step5Medication />
		<Step6BowelPrepAndFitness />
		<Step7TriageAndSubmit />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Compute grade &amp; view vetting report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
