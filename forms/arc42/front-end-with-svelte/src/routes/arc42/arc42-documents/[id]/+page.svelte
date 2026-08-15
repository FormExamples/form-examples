<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { store } from '#lib/stores/documentation.svelte.js';
	import { calculateMaturity } from '#lib/grading/maturity-grader.js';
	import { steps, TOTAL_STEPS } from '#lib/config/steps.js';
	import { sampleDocuments } from '#lib/data/sample-reports.js';

	import Form from '#lib/components/ui/Form.svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import Progress from '#lib/components/ui/Progress.svelte';
	import StepList from '#lib/components/ui/StepList.svelte';
	import StepListItem from '#lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '#lib/components/ui/ErrorSummary.svelte';

	import Step01Introduction from '#lib/components/steps/Step01Introduction.svelte';
	import Step02Constraints from '#lib/components/steps/Step02Constraints.svelte';
	import Step03ContextAndScope from '#lib/components/steps/Step03ContextAndScope.svelte';
	import Step04SolutionStrategy from '#lib/components/steps/Step04SolutionStrategy.svelte';
	import Step05BuildingBlocks from '#lib/components/steps/Step05BuildingBlocks.svelte';
	import Step06RuntimeView from '#lib/components/steps/Step06RuntimeView.svelte';
	import Step07DeploymentView from '#lib/components/steps/Step07DeploymentView.svelte';
	import Step08CrosscuttingConcepts from '#lib/components/steps/Step08CrosscuttingConcepts.svelte';
	import Step09ArchitecturalDecisions from '#lib/components/steps/Step09ArchitecturalDecisions.svelte';
	import Step10QualityRequirements from '#lib/components/steps/Step10QualityRequirements.svelte';
	import Step11RisksAndDebt from '#lib/components/steps/Step11RisksAndDebt.svelte';
	import Step12Summary from '#lib/components/steps/Step12Summary.svelte';

	let errors = $state<{ id: string; message: string }[]>([]);

	const id = $derived(page.params.id ?? 'new');
	const isNew = $derived(id === 'new');

	// Hydrate the wizard whenever the route id changes: a saved draft for that id
	// wins, otherwise seed from the matching sample document (existing id) or a
	// blank draft (new).
	$effect(() => {
		const seed = sampleDocuments.find((s) => s.id === id)?.data;
		if (store.id !== id) {
			store.loadForId(id, seed);
			errors = [];
		}
	});

	function validate(): boolean {
		const d = store.data;
		const found: { id: string; message: string }[] = [];
		if (d.architecture.name.trim() === '') {
			found.push({ id: 'architectureName', message: 'Architecture name is required.' });
		}
		errors = found;
		return found.length === 0;
	}

	function submit() {
		if (!validate()) {
			document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		store.result = calculateMaturity(store.data);
		goto(`/arc42/arc42-documents/${id}/report`);
	}

	function startOver() {
		const seed = sampleDocuments.find((s) => s.id === id)?.data;
		store.reset();
		store.loadForId(id, seed);
		errors = [];
	}
</script>

<main class="mx-16 px-4 py-6">
	<h1 class="text-2xl font-bold text-base-content">
		{isNew ? 'New arc42 document' : `arc42 document ${id}`}
	</h1>
	<p class="mt-1 text-sm text-base-content/70">
		Complete the twelve arc42 sections; the maturity band and completeness are computed on submit.
	</p>
	<Progress label="arc42 sections" value={TOTAL_STEPS} max={TOTAL_STEPS} />
	<StepList label="arc42 sections" current={TOTAL_STEPS}>
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

	<Form label="arc42 architecture documentation" onsubmit={submit}>
		<Step01Introduction />
		<Step02Constraints />
		<Step03ContextAndScope />
		<Step04SolutionStrategy />
		<Step05BuildingBlocks />
		<Step06RuntimeView />
		<Step07DeploymentView />
		<Step08CrosscuttingConcepts />
		<Step09ArchitecturalDecisions />
		<Step10QualityRequirements />
		<Step11RisksAndDebt />
		<Step12Summary />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Compute maturity &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
