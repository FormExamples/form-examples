<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { formState } from '$stores/formState.svelte';
	import { gradeObjective } from '$engine/composite-grader';
	import { steps, TOTAL_STEPS } from '#lib/config/steps.js';
	import { sampleObjectives } from '#lib/data/sample-reports.js';

	import Form from '#lib/components/ui/Form.svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import Progress from '#lib/components/ui/Progress.svelte';
	import StepList from '#lib/components/ui/StepList.svelte';
	import StepListItem from '#lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '#lib/components/ui/ErrorSummary.svelte';

	import Step01 from '#lib/components/steps/Step01ReporterAndCycle.svelte';
	import Step02 from '#lib/components/steps/Step02Objective.svelte';
	import Step03 from '#lib/components/steps/Step03Participants.svelte';
	import Step04 from '#lib/components/steps/Step04StrategicAlignment.svelte';
	import Step05 from '#lib/components/steps/Step05KeyResults.svelte';
	import Step06 from '#lib/components/steps/Step06Initiatives.svelte';
	import Step07 from '#lib/components/steps/Step07Risks.svelte';
	import Step08 from '#lib/components/steps/Step08CheckIn.svelte';
	import Step09 from '#lib/components/steps/Step09Forecast.svelte';
	import Step10 from '#lib/components/steps/Step10ScoreAndSignOff.svelte';

	let errors = $state<{ id: string; message: string }[]>([]);

	const id = $derived(page.params.id ?? 'new');
	const isNew = $derived(id === 'new');

	// Hydrate the wizard whenever the route id changes: a saved draft for that id
	// wins, otherwise seed from the matching sample objective (existing id) or a
	// blank draft (new).
	$effect(() => {
		const seed = sampleObjectives.find((s) => s.id === id)?.data;
		if (formState.id !== id) {
			formState.loadForId(id, seed);
			errors = [];
		}
	});

	function validate(): boolean {
		const d = formState.data;
		const found: { id: string; message: string }[] = [];
		if (d.objective.obj_title.trim() === '') {
			found.push({ id: 'objTitle', message: 'Objective title is required.' });
		}
		if (d.reporter.name.trim() === '') {
			found.push({ id: 'reporterName', message: 'Reporter name is required.' });
		}
		errors = found;
		return found.length === 0;
	}

	function submit() {
		if (!validate()) {
			document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		formState.result = gradeObjective(formState.buildAssessment());
		goto(`/objectives-and-key-results-tracker/objectives-and-key-results-trackers/${id}/report`);
	}

	function startOver() {
		const seed = sampleObjectives.find((s) => s.id === id)?.data;
		formState.reset();
		formState.loadForId(id, seed);
		errors = [];
	}
</script>

<main class="mx-16 px-4 py-6">
	<h1 class="text-2xl font-bold text-base-content">
		{isNew ? 'New objective' : `Objective ${id}`}
	</h1>
	<p class="mt-1 text-sm text-base-content/70">
		Complete the ten sections; the composite RAG band and flags are computed on submit.
	</p>
	<Progress label="Tracker sections" value={TOTAL_STEPS} max={TOTAL_STEPS} />
	<StepList label="Tracker sections" current={TOTAL_STEPS}>
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

	<Form label="Objectives and key results tracker" onsubmit={submit}>
		<div class="space-y-6">
			<Step01 />
			<Step02 />
			<Step03 />
			<Step04 />
			<Step05 />
			<Step06 />
			<Step07 />
			<Step08 />
			<Step09 />
			<Step10 />
		</div>

		<div class="button-group mt-6">
			<Button type="submit" data-variant="primary">Compute RAG &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
