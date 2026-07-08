<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { store } from '$lib/stores/assessment.svelte.js';
	import { STEPS, TOTAL_STEPS } from '$lib/config/steps.js';
	import { sampleAssessments } from '$lib/data/sample-reports';

	import Form from '$lib/components/ui/Form.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Progress from '$lib/components/ui/Progress.svelte';
	import StepList from '$lib/components/ui/StepList.svelte';
	import StepListItem from '$lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '$lib/components/ui/ErrorSummary.svelte';

	import Step01 from '$lib/components/steps/Step01Respondent.svelte';
	import Step02 from '$lib/components/steps/Step02CustomerSatisfaction.svelte';
	import Step03 from '$lib/components/steps/Step03WelcomeChange.svelte';
	import Step04 from '$lib/components/steps/Step04DeliverFrequently.svelte';
	import Step05 from '$lib/components/steps/Step05Collaboration.svelte';
	import Step06 from '$lib/components/steps/Step06MotivatedIndividuals.svelte';
	import Step07 from '$lib/components/steps/Step07FaceToFace.svelte';
	import Step08 from '$lib/components/steps/Step08WorkingSoftware.svelte';
	import Step09 from '$lib/components/steps/Step09SustainableDevelopment.svelte';
	import Step10 from '$lib/components/steps/Step10TechnicalExcellence.svelte';
	import Step11 from '$lib/components/steps/Step11Simplicity.svelte';
	import Step12 from '$lib/components/steps/Step12SelfOrganisingTeams.svelte';
	import Step13 from '$lib/components/steps/Step13RegularReflection.svelte';
	import Step14 from '$lib/components/steps/Step14Summary.svelte';

	const stepComponents = [
		Step01, Step02, Step03, Step04, Step05, Step06, Step07,
		Step08, Step09, Step10, Step11, Step12, Step13, Step14
	];

	let errors = $state<{ id: string; message: string }[]>([]);

	const id = $derived(page.params.id ?? 'new');
	const isNew = $derived(id === 'new');
	const result = $derived(store.result);

	// Hydrate the wizard whenever the route id changes: a saved draft for that id
	// wins, otherwise seed from the matching sample assessment (existing id) or a
	// blank draft (new).
	$effect(() => {
		const seed = sampleAssessments.find((s) => s.id === id)?.data;
		if (store.id !== id) {
			store.loadForId(id, seed);
			errors = [];
		}
	});

	function validate(): boolean {
		const d = store.data;
		const found: { id: string; message: string }[] = [];
		if (d.respondent.teamName.trim() === '') {
			found.push({ id: 'teamName', message: 'Team being assessed is required.' });
		}
		if (d.respondent.assessmentDate === '') {
			found.push({ id: 'assessmentDate', message: 'Assessment date is required.' });
		}
		errors = found;
		return found.length === 0;
	}

	function submit() {
		if (!validate()) {
			document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		goto(`/agile-principles-assessment/agile-principles-assessments/${id}/report`);
	}

	function startOver() {
		const seed = sampleAssessments.find((s) => s.id === id)?.data;
		store.reset();
		store.loadForId(id, seed);
		errors = [];
	}
</script>

<main class="mx-auto max-w-3xl px-4 py-6">
	<header class="mb-6 no-print">
		<h1 class="text-2xl font-bold text-base-content">
			{isNew ? 'New agile principles assessment' : `Agile principles assessment ${id}`}
		</h1>
		<p class="mt-1 text-sm text-base-content/70">
			Complete all 14 sections; the composite maturity, per-principle bands, and operational flags
			are computed live and finalised on submit.
		</p>
		<p class="mt-2 text-sm font-medium text-base-content/80">
			{result.answeredCount} of 12 principles scored
		</p>
		<Progress label="Principles scored" value={result.answeredCount} max={12} />
		<StepList label="Assessment sections" current={TOTAL_STEPS}>
			{#each STEPS as step (step.number)}
				<StepListItem status="finished" label={step.title}>{step.short}</StepListItem>
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

	<Form label="Agile principles assessment" onsubmit={submit}>
		<div class="space-y-6">
			{#each stepComponents as StepComponent, i (i)}
				<div id="step-{i + 1}" class="scroll-mt-20 rounded-lg border border-base-300 bg-base-100 p-6 shadow-sm">
					<StepComponent />
				</div>
			{/each}
		</div>

		<div class="button-group mt-8">
			<Button type="submit" data-variant="primary">Compute maturity &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
