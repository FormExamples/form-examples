<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { gradeTransfer } from '#lib/engine/transfer-validator.js';
	import { steps, TOTAL_STEPS } from '#lib/config/steps.js';
	import { sampleAssessments } from '#lib/data/sample-reports.js';

	import Form from '#lib/components/ui/Form.svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import Progress from '#lib/components/ui/Progress.svelte';
	import StepList from '#lib/components/ui/StepList.svelte';
	import StepListItem from '#lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '#lib/components/ui/ErrorSummary.svelte';

	import Step1RequestingProvider from '#lib/components/steps/Step1RequestingProvider.svelte';
	import Step2ReceivingProvider from '#lib/components/steps/Step2ReceivingProvider.svelte';
	import Step3PatientDemographics from '#lib/components/steps/Step3PatientDemographics.svelte';
	import Step4Situation from '#lib/components/steps/Step4Situation.svelte';
	import Step5Background from '#lib/components/steps/Step5Background.svelte';
	import Step6Assessment from '#lib/components/steps/Step6Assessment.svelte';
	import Step7Recommendation from '#lib/components/steps/Step7Recommendation.svelte';
	import Step8TransferLogistics from '#lib/components/steps/Step8TransferLogistics.svelte';
	import Step9SignoffAcknowledgement from '#lib/components/steps/Step9SignoffAcknowledgement.svelte';

	let errors = $state<{ id: string; message: string }[]>([]);

	const id = $derived(page.params.id ?? 'new');
	const isNew = $derived(id === 'new');

	// Hydrate the wizard whenever the route id changes: a saved draft for that id
	// wins, otherwise seed from the matching sample transfer (existing id) or a
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
		if (d.requestingProvider.clinicianName.trim() === '') {
			found.push({ id: 'requesting-clinicianName', message: 'Requesting clinician name is required.' });
		}
		if (d.receivingProvider.clinicianName.trim() === '') {
			found.push({ id: 'receiving-clinicianName', message: 'Receiving clinician name is required.' });
		}
		if (d.patientDemographics.lastName.trim() === '') {
			found.push({ id: 'lastName', message: 'Patient last name is required.' });
		}
		if (d.situation.reasonForTransfer.trim() === '') {
			found.push({ id: 'reasonForTransfer', message: 'Reason for transfer is required.' });
		}
		errors = found;
		return found.length === 0;
	}

	function submit() {
		if (!validate()) {
			document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		assessment.result = gradeTransfer(assessment.data);
		goto(`/provider-transfer-request/provider-transfer-requests/${id}/report`);
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
		{isNew ? 'New provider transfer request' : `Provider transfer request ${id}`}
	</h1>
	<p class="mt-1 text-sm text-base-content/70">
		Complete the nine sections; SBAR completeness and flagged issues are computed on submit.
	</p>
	<Progress label="Transfer sections" value={TOTAL_STEPS} max={TOTAL_STEPS} />
	<StepList label="Transfer sections" current={TOTAL_STEPS}>
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

	<Form label="Provider transfer request" onsubmit={submit}>
		<Step1RequestingProvider />
		<Step2ReceivingProvider />
		<Step3PatientDemographics />
		<Step4Situation />
		<Step5Background />
		<Step6Assessment />
		<Step7Recommendation />
		<Step8TransferLogistics />
		<Step9SignoffAcknowledgement />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Validate &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
