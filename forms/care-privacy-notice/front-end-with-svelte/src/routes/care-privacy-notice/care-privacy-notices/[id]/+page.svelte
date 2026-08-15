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

	import Step1PracticeConfiguration from '#lib/components/steps/Step1PracticeConfiguration.svelte';
	import Step2PrivacyNotice from '#lib/components/steps/Step2PrivacyNotice.svelte';
	import Step3AcknowledgmentSignature from '#lib/components/steps/Step3AcknowledgmentSignature.svelte';

	let errors = $state<{ id: string; message: string }[]>([]);

	const id = $derived(page.params.id ?? 'new');
	const isNew = $derived(id === 'new');

	// Hydrate the wizard whenever the route id changes: a saved draft for that id
	// wins, otherwise seed from the matching sample acknowledgment (existing id)
	// or a blank draft (new).
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
		if (d.practiceConfiguration.practiceName.trim() === '') {
			found.push({ id: 'practiceName', message: 'Practice name is required.' });
		}
		if (d.practiceConfiguration.dpoName.trim() === '') {
			found.push({ id: 'dpoName', message: 'Data Protection Officer name is required.' });
		}
		if (!d.acknowledgmentSignature.agreed) {
			found.push({ id: 'agreed', message: 'The patient must acknowledge the privacy notice.' });
		}
		if (d.acknowledgmentSignature.patientTypedFullName.trim() === '') {
			found.push({ id: 'patientTypedFullName', message: 'The patient must type their full name.' });
		}
		if (d.acknowledgmentSignature.patientTypedDate === '') {
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
		goto(`/care-privacy-notice/care-privacy-notices/${id}/report`);
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
		{isNew ? 'New privacy notice' : `Privacy notice ${id}`}
	</h1>
	<p class="mt-1 text-sm text-base-content/70">
		Complete the three sections; the completeness status is computed on submit.
	</p>
	<Progress label="Notice sections" value={TOTAL_STEPS} max={TOTAL_STEPS} />
	<StepList label="Notice sections" current={TOTAL_STEPS}>
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

	<Form label="Care privacy notice" onsubmit={submit}>
		<Step1PracticeConfiguration />
		<Step2PrivacyNotice />
		<Step3AcknowledgmentSignature />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Validate &amp; view summary</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
