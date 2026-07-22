<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { triage } from '$lib/engine/ed-triage-grader';
	import { steps, TOTAL_STEPS } from '$lib/config/steps';
	import { sampleAssessments } from '$lib/data/sample-reports';

	import Form from '$lib/components/ui/Form.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Progress from '$lib/components/ui/Progress.svelte';
	import StepList from '$lib/components/ui/StepList.svelte';
	import StepListItem from '$lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '$lib/components/ui/ErrorSummary.svelte';

	import Step1Context from '$lib/components/steps/Step1Context.svelte';
	import Step2Arrival from '$lib/components/steps/Step2Arrival.svelte';
	import Step3Identification from '$lib/components/steps/Step3Identification.svelte';
	import Step4Complaint from '$lib/components/steps/Step4Complaint.svelte';
	import Step5Vitals from '$lib/components/steps/Step5Vitals.svelte';
	import Step6Pain from '$lib/components/steps/Step6Pain.svelte';
	import Step7Discriminators from '$lib/components/steps/Step7Discriminators.svelte';
	import Step8Review from '$lib/components/steps/Step8Review.svelte';

	const plural = 'emergency-department-triage-notes';

	let errors = $state<{ id: string; message: string }[]>([]);

	const id = $derived(page.params.id ?? 'new');
	const isNew = $derived(id === 'new');

	// Hydrate the wizard whenever the route id changes: a saved draft for that id
	// wins, otherwise seed from the matching sample assessment (existing id) or a
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
		if (d.context.nurseName.trim() === '') {
			found.push({ id: 'context-nurseName', message: 'Triage nurse name is required.' });
		}
		if (d.context.careSetting === '') {
			found.push({ id: 'context-careSetting', message: 'Care setting is required.' });
		}
		if (d.identification.patientIdentifier.trim() === '') {
			found.push({
				id: 'identification-patientIdentifier',
				message: 'Patient identifier is required.'
			});
		}
		if (d.complaint.presentingComplaint.trim() === '') {
			found.push({
				id: 'complaint-presentingComplaint',
				message: 'Presenting complaint is required.'
			});
		}
		errors = found;
		return found.length === 0;
	}

	function submit() {
		if (!validate()) {
			document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		assessment.result = triage(assessment.data);
		goto(`/emergency-department-triage-note/${plural}/${id}/report`);
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
		{isNew ? 'New ED triage note' : `ED triage note ${id}`}
	</h1>
	<p class="mt-1 text-sm text-base-content/70">
		Complete the eight sections; the Manchester Triage System priority level is computed on submit.
	</p>
	<Progress label="Triage sections" value={TOTAL_STEPS} max={TOTAL_STEPS} />
	<StepList label="Triage sections" current={TOTAL_STEPS}>
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

	<Form label="ED triage note" onsubmit={submit}>
		<Step1Context />
		<Step2Arrival />
		<Step3Identification />
		<Step4Complaint />
		<Step5Vitals />
		<Step6Pain />
		<Step7Discriminators />
		<Step8Review />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Classify triage &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
