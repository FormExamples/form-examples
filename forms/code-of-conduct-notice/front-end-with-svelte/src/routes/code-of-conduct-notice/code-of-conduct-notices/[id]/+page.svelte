<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateNoticeGrade } from '$lib/engine/notice-grader';
	import { steps, TOTAL_STEPS } from '$lib/config/steps';
	import { sampleAssessments } from '$lib/data/sample-reports';

	import Form from '$lib/components/ui/Form.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Progress from '$lib/components/ui/Progress.svelte';
	import StepList from '$lib/components/ui/StepList.svelte';
	import StepListItem from '$lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '$lib/components/ui/ErrorSummary.svelte';

	import Step1RecipientDetails from '$lib/components/steps/Step1RecipientDetails.svelte';
	import Step2CodeOfConductNotice from '$lib/components/steps/Step2CodeOfConductNotice.svelte';
	import Step3AcknowledgementSignature from '$lib/components/steps/Step3AcknowledgementSignature.svelte';

	let errors = $state<{ id: string; message: string }[]>([]);

	const id = $derived(page.params.id ?? 'new');
	const isNew = $derived(id === 'new');

	// Hydrate the wizard whenever the route id changes: a saved draft for that id
	// wins, otherwise seed from the matching sample notice (existing id) or a
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
		if (d.recipientDetails.organisationName.trim() === '') {
			found.push({ id: 'rd-organisationName', message: 'Organisation name is required.' });
		}
		if (d.recipientDetails.recipientName.trim() === '') {
			found.push({ id: 'rd-recipientName', message: 'Recipient name is required.' });
		}
		if (d.recipientDetails.recipientRole.trim() === '') {
			found.push({ id: 'rd-recipientRole', message: 'Recipient role is required.' });
		}
		if (!d.acknowledgementSignature.agreed) {
			found.push({ id: 'ack-agreed', message: 'You must check the acknowledgement checkbox.' });
		}
		if (d.acknowledgementSignature.recipientTypedFullName.trim() === '') {
			found.push({ id: 'ack-recipientTypedFullName', message: 'Please type your full name.' });
		}
		if (d.acknowledgementSignature.recipientTypedDate === '') {
			found.push({ id: 'ack-recipientTypedDate', message: "Please enter today's date." });
		}
		errors = found;
		return found.length === 0;
	}

	function submit() {
		if (!validate()) {
			document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		assessment.result = calculateNoticeGrade(assessment.data);
		goto(`/code-of-conduct-notice/code-of-conduct-notices/${id}/report`);
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
		{isNew ? 'New code of conduct notice' : `Code of conduct notice ${id}`}
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

	<Form label="Code of conduct notice" onsubmit={submit}>
		<Step1RecipientDetails />
		<Step2CodeOfConductNotice />
		<Step3AcknowledgementSignature />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Validate &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
