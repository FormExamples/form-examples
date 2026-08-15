<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { gradeForm } from '#lib/engine/grader.js';
	import { steps, TOTAL_STEPS } from '#lib/config/steps.js';
	import { sampleAssessments } from '#lib/data/sample-reports.js';

	import Form from '#lib/components/ui/Form.svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import Progress from '#lib/components/ui/Progress.svelte';
	import StepList from '#lib/components/ui/StepList.svelte';
	import StepListItem from '#lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '#lib/components/ui/ErrorSummary.svelte';

	import Step1ScreeningProgramPrivacyNotice from '#lib/components/steps/Step1ScreeningProgramPrivacyNotice.svelte';
	import Step2AcknowledgmentSignature from '#lib/components/steps/Step2AcknowledgmentSignature.svelte';

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
		const ack = assessment.data.acknowledgment;
		const found: { id: string; message: string }[] = [];
		if (!ack.agreed) {
			found.push({ id: 'agreed', message: 'You must acknowledge the privacy notice.' });
		}
		if (ack.patientTypedFullName.trim() === '') {
			found.push({ id: 'patientTypedFullName', message: 'Full name is required.' });
		}
		if (ack.patientTypedDate === '') {
			found.push({ id: 'patientTypedDate', message: "Today's date is required." });
		}
		errors = found;
		return found.length === 0;
	}

	function submit() {
		if (!validate()) {
			document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		assessment.result = gradeForm(assessment.data);
		goto(`/screening-program-privacy-notice/screening-program-privacy-notices/${id}/report`);
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
		{isNew ? 'New privacy-notice acknowledgment' : `Privacy-notice acknowledgment ${id}`}
	</h1>
	<p class="mt-1 text-sm text-base-content/70">
		Read the notice, then acknowledge and sign; the completeness status is computed on submit.
	</p>
	<Progress label="Acknowledgment sections" value={TOTAL_STEPS} max={TOTAL_STEPS} />
	<StepList label="Acknowledgment sections" current={TOTAL_STEPS}>
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

	<Form label="Screening program privacy notice acknowledgment" onsubmit={submit}>
		<Step1ScreeningProgramPrivacyNotice />
		<Step2AcknowledgmentSignature />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Submit &amp; view summary</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
