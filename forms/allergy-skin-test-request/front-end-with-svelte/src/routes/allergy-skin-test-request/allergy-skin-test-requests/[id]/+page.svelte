<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { request } from '$lib/stores/request.svelte';
	import { calculateGrade } from '$lib/engine/grader';
	import { countSelectedPanels } from '$lib/engine/rules';
	import { steps, TOTAL_STEPS } from '$lib/config/steps';
	import { sampleRequests } from '$lib/data/sample-reports';

	import Form from '$lib/components/ui/Form.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Progress from '$lib/components/ui/Progress.svelte';
	import StepList from '$lib/components/ui/StepList.svelte';
	import StepListItem from '$lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '$lib/components/ui/ErrorSummary.svelte';

	import Step1Clinician from '$lib/components/steps/Step1Clinician.svelte';
	import Step2Patient from '$lib/components/steps/Step2Patient.svelte';
	import Step3RequestedTest from '$lib/components/steps/Step3RequestedTest.svelte';
	import Step4ClinicalIndication from '$lib/components/steps/Step4ClinicalIndication.svelte';
	import Step5ValiditySafety from '$lib/components/steps/Step5ValiditySafety.svelte';
	import Step6TriageLogistics from '$lib/components/steps/Step6TriageLogistics.svelte';
	import Step7Review from '$lib/components/steps/Step7Review.svelte';

	let errors = $state<{ id: string; message: string }[]>([]);

	const id = $derived(page.params.id ?? 'new');
	const isNew = $derived(id === 'new');

	// Hydrate the wizard whenever the route id changes: a saved draft for that id
	// wins, otherwise seed from the matching sample request (existing id) or a
	// blank draft (new).
	$effect(() => {
		const seed = sampleRequests.find((s) => s.id === id)?.data;
		if (request.id !== id) {
			request.loadForId(id, seed);
			errors = [];
		}
	});

	function validate(): boolean {
		const d = request.data;
		const found: { id: string; message: string }[] = [];
		if (d.clinician.clinicianName.trim() === '') {
			found.push({ id: 'clinicianName', message: 'Requesting clinician name is required.' });
		}
		if (d.patient.lastName.trim() === '') {
			found.push({ id: 'lastName', message: 'Patient last name is required.' });
		}
		if (d.test.testType === '') {
			found.push({ id: 'testType', message: 'Requested test type is required.' });
		}
		if (countSelectedPanels(d.test) === 0) {
			found.push({ id: 'allergenPanels', message: 'Select at least one allergen panel.' });
		}
		if (d.indication.primaryIndication === '') {
			found.push({ id: 'primaryIndication', message: 'Primary indication is required.' });
		}
		if (d.indication.clinicalQuestion.trim() === '') {
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
		goto(`/allergy-skin-test-request/allergy-skin-test-requests/${id}/report`);
	}

	function startOver() {
		const seed = sampleRequests.find((s) => s.id === id)?.data;
		request.reset();
		request.loadForId(id, seed);
		errors = [];
	}
</script>

<main class="mx-auto max-w-3xl px-4 py-6">
	<header class="mb-6 no-print">
		<h1 class="text-2xl font-bold text-base-content">
			{isNew ? 'New allergy skin test request' : `Allergy skin test request ${id}`}
		</h1>
		<p class="mt-1 text-sm text-base-content/70">
			Complete the seven sections; the four-axis grade — appropriateness, validity and safety,
			completeness, and triage — plus safety flags are computed on submit.
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

	<Form label="Allergy skin test request" onsubmit={submit}>
		<Step1Clinician />
		<Step2Patient />
		<Step3RequestedTest />
		<Step4ClinicalIndication />
		<Step5ValiditySafety />
		<Step6TriageLogistics />
		<Step7Review />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Compute grade &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
