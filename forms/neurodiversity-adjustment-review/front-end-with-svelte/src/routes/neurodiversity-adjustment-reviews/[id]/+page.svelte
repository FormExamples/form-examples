<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { resultStore } from '$lib/stores/result.svelte';
	import { calculateGrade } from '$lib/engine/grader';
	import { steps, TOTAL_STEPS } from '$lib/config/steps';
	import { sampleReports } from '$lib/data/sample-reports';

	import Form from '$lib/components/ui/Form.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Progress from '$lib/components/ui/Progress.svelte';
	import StepList from '$lib/components/ui/StepList.svelte';
	import StepListItem from '$lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '$lib/components/ui/ErrorSummary.svelte';

	import Step1ReviewIdentification from '$lib/components/steps/Step1ReviewIdentification.svelte';
	import Step2WorkerIdentification from '$lib/components/steps/Step2WorkerIdentification.svelte';
	import Step3Effectiveness from '$lib/components/steps/Step3Effectiveness.svelte';
	import Step4WorkerExperience from '$lib/components/steps/Step4WorkerExperience.svelte';
	import Step5ChangesAndNextSteps from '$lib/components/steps/Step5ChangesAndNextSteps.svelte';
	import Step6SignOff from '$lib/components/steps/Step6SignOff.svelte';

	const id = $derived(page.params.id ?? 'new');
	const isNew = $derived(id === 'new');

	// Load the draft for this id whenever the route param changes. Seed a known
	// sample row's identity so opening a dashboard row pre-fills the header.
	$effect(() => {
		const current = id;
		if (resultStore.id === current) return;
		const sample = sampleReports.find((r) => r.id === current);
		resultStore.loadForId(
			current,
			sample
				? {
						workerName: sample.workerName,
						reviewStatus: sample.reviewStatus,
						reviewDate: sample.reviewDate
					}
				: undefined
		);
	});

	let errors = $state<{ id: string; message: string }[]>([]);

	function validate(): boolean {
		const d = resultStore.data;
		const found: { id: string; message: string }[] = [];
		if (d.managerName.trim() === '') {
			found.push({ id: 'managerName', message: 'Reviewer (manager / HR contact) is required.' });
		}
		if (d.reviewStatus === '') {
			found.push({ id: 'reviewStatus', message: 'Review status is required.' });
		}
		if (d.workerName.trim() === '') {
			found.push({ id: 'workerName', message: 'Worker name is required.' });
		}
		errors = found;
		return found.length === 0;
	}

	function submit() {
		if (!validate()) {
			document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		resultStore.result = calculateGrade(resultStore.data);
		goto(`/neurodiversity-adjustment-reviews/${id}/report`);
	}

	function startOver() {
		resultStore.reset();
		errors = [];
	}
</script>

<main class="mx-auto max-w-3xl px-4 py-6">
	<header class="mb-6 no-print">
		<h1 class="text-2xl font-bold text-base-content">
			{isNew ? 'New adjustment review' : `Adjustment review ${id}`}
		</h1>
		<p class="mt-1 text-sm text-base-content/70">
			Complete the six sections; the four-axis grade is computed on submit.
		</p>
		<Progress label="Review sections" value={TOTAL_STEPS} max={TOTAL_STEPS} />
		<StepList label="Review sections" current={TOTAL_STEPS}>
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

	<Form label="Neurodiversity adjustment review" onsubmit={submit}>
		<Step1ReviewIdentification />
		<Step2WorkerIdentification />
		<Step3Effectiveness />
		<Step4WorkerExperience />
		<Step5ChangesAndNextSteps />
		<Step6SignOff />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Compute grade &amp; view review</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
