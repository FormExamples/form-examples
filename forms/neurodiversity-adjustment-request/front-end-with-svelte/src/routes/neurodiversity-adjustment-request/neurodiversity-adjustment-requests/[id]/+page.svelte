<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { requestStore } from '$lib/stores/result.svelte';
	import { calculateGrade } from '$lib/engine/grader';
	import { steps, TOTAL_STEPS } from '$lib/config/steps';
	import { sampleRequests } from '$lib/data/sample-reports';

	import Form from '$lib/components/ui/Form.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Progress from '$lib/components/ui/Progress.svelte';
	import StepList from '$lib/components/ui/StepList.svelte';
	import StepListItem from '$lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '$lib/components/ui/ErrorSummary.svelte';

	import Step1WorkerAndRole from '$lib/components/steps/Step1WorkerAndRole.svelte';
	import Step2Handler from '$lib/components/steps/Step2Handler.svelte';
	import Step3NeurodivergentProfile from '$lib/components/steps/Step3NeurodivergentProfile.svelte';
	import Step4FunctionalDifficulties from '$lib/components/steps/Step4FunctionalDifficulties.svelte';
	import Step5RequestedAdjustments from '$lib/components/steps/Step5RequestedAdjustments.svelte';
	import Step6EvidenceAndSupport from '$lib/components/steps/Step6EvidenceAndSupport.svelte';
	import Step7ImpactAndUrgency from '$lib/components/steps/Step7ImpactAndUrgency.svelte';
	import Step8ReviewAndSubmit from '$lib/components/steps/Step8ReviewAndSubmit.svelte';

	let errors = $state<{ id: string; message: string }[]>([]);

	const id = $derived(page.params.id ?? 'new');
	const isNew = $derived(id === 'new');

	// Hydrate the wizard whenever the route id changes: a saved draft for that id
	// wins, otherwise seed from the matching sample request (existing id) or a
	// blank draft (new).
	$effect(() => {
		const seed = sampleRequests.find((s) => s.id === id)?.request;
		if (requestStore.id !== id) {
			requestStore.loadForId(id, seed);
			errors = [];
		}
	});

	function validate(): boolean {
		const d = requestStore.data;
		const found: { id: string; message: string }[] = [];
		if (d.workerName.trim() === '') {
			found.push({ id: 'workerName', message: 'Worker name is required.' });
		}
		if (d.workerJobTitle.trim() === '') {
			found.push({ id: 'workerJobTitle', message: 'Job title is required.' });
		}
		if (d.managerName.trim() === '') {
			found.push({ id: 'managerName', message: 'Manager / HR contact name is required.' });
		}
		errors = found;
		return found.length === 0;
	}

	function submit() {
		if (!validate()) {
			document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		requestStore.result = calculateGrade(requestStore.data);
		goto(`/neurodiversity-adjustment-request/neurodiversity-adjustment-requests/${id}/report`);
	}

	function startOver() {
		const seed = sampleRequests.find((s) => s.id === id)?.request;
		requestStore.reset();
		requestStore.loadForId(id, seed);
		errors = [];
	}
</script>

<main class="mx-16 px-4 py-6">
	<h1 class="text-2xl font-bold text-base-content">
		{isNew ? 'New neurodiversity adjustment request' : `Adjustment request ${id}`}
	</h1>
	<p class="mt-1 text-sm text-base-content/70">
		Complete the eight sections; the four-axis grade is computed on submit.
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

	<Form label="Neurodiversity adjustment request" onsubmit={submit}>
		<Step1WorkerAndRole />
		<Step2Handler />
		<Step3NeurodivergentProfile />
		<Step4FunctionalDifficulties />
		<Step5RequestedAdjustments />
		<Step6EvidenceAndSupport />
		<Step7ImpactAndUrgency />
		<Step8ReviewAndSubmit />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Compute grade &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
