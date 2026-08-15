<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { request } from '#lib/stores/request.svelte.js';
	import { calculateGrade } from '#lib/engine/grader.js';
	import { steps, TOTAL_STEPS } from '#lib/config/steps.js';
	import { sampleRequests } from '#lib/data/sample-reports.js';

	import Form from '#lib/components/ui/Form.svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import Progress from '#lib/components/ui/Progress.svelte';
	import StepList from '#lib/components/ui/StepList.svelte';
	import StepListItem from '#lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '#lib/components/ui/ErrorSummary.svelte';

	import Step1Clinician from '#lib/components/steps/Step1Clinician.svelte';
	import Step2Patient from '#lib/components/steps/Step2Patient.svelte';
	import Step3Examination from '#lib/components/steps/Step3Examination.svelte';
	import Step4Contrast from '#lib/components/steps/Step4Contrast.svelte';
	import Step5MriSafety from '#lib/components/steps/Step5MriSafety.svelte';
	import Step6PriorImaging from '#lib/components/steps/Step6PriorImaging.svelte';
	import Step7Logistics from '#lib/components/steps/Step7Logistics.svelte';
	import Step8Triage from '#lib/components/steps/Step8Triage.svelte';

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
		if (d.patient.lastName.trim() === '') {
			found.push({ id: 'lastName', message: 'Patient last name is required.' });
		}
		if (d.clinician.clinicianName.trim() === '') {
			found.push({ id: 'clinicianName', message: 'Requesting clinician name is required.' });
		}
		if (d.request.bodyRegion === '') {
			found.push({ id: 'bodyRegion', message: 'Body region is required.' });
		}
		if (d.request.primaryIndication === '') {
			found.push({ id: 'primaryIndication', message: 'Primary indication is required.' });
		}
		if (d.request.clinicalQuestion.trim() === '') {
			found.push({ id: 'clinicalQuestion', message: 'A specific clinical question is required.' });
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
		goto(`/mri-scan-test-request/mri-scan-test-requests/${id}/report`);
	}

	function startOver() {
		const seed = sampleRequests.find((s) => s.id === id)?.data;
		request.reset();
		request.loadForId(id, seed);
		errors = [];
	}
</script>

<main class="mx-16 px-4 py-6">
	<h1 class="text-2xl font-bold text-base-content">
		{isNew ? 'New MRI scan request' : `MRI scan request ${id}`}
	</h1>
	<p class="mt-1 text-sm text-base-content/70">
		Complete the eight sections; the four-axis vetting grade and safety flags are computed on submit.
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

	<Form label="MRI scan request" onsubmit={submit}>
		<Step1Clinician />
		<Step2Patient />
		<Step3Examination />
		<Step4Contrast />
		<Step5MriSafety />
		<Step6PriorImaging />
		<Step7Logistics />
		<Step8Triage />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Compute grade &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
