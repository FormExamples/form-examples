<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/checklist.svelte';
	import { STEPS } from '$lib/config/steps';
	import { TOTAL_ITEMS } from '$lib/config/items';
	import { sampleAssessments } from '$lib/data/sample-reports';

	import Form from '$lib/components/ui/Form.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Progress from '$lib/components/ui/Progress.svelte';
	import StepList from '$lib/components/ui/StepList.svelte';
	import StepListItem from '$lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '$lib/components/ui/ErrorSummary.svelte';

	import Step01Respondent from '$lib/components/steps/Step01Respondent.svelte';
	import Step02Teams from '$lib/components/steps/Step02Teams.svelte';
	import Step03Stakeholders from '$lib/components/steps/Step03Stakeholders.svelte';
	import Step04Practices from '$lib/components/steps/Step04Practices.svelte';
	import Step05Summary from '$lib/components/steps/Step05Summary.svelte';

	const stepComponents = [
		Step01Respondent,
		Step02Teams,
		Step03Stakeholders,
		Step04Practices,
		Step05Summary
	];

	let errors = $state<{ id: string; message: string }[]>([]);

	const id = $derived(page.params.id ?? 'new');
	const isNew = $derived(id === 'new');
	const result = $derived(assessment.result);

	// Hydrate the wizard whenever the route id changes: a saved draft for that id
	// wins, otherwise seed from the matching sample checklist (existing id) or a
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
		if (d.respondent.fullName.trim() === '') {
			found.push({ id: 'respondent-fullName', message: 'Respondent full name is required.' });
		}
		if (d.respondent.teamName.trim() === '') {
			found.push({ id: 'respondent-teamName', message: 'Team being assessed is required.' });
		}
		errors = found;
		return found.length === 0;
	}

	function submit() {
		if (!validate()) {
			document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		goto(`/agile-checklist/agile-checklists/${id}/report`);
	}

	function startOver() {
		const seed = sampleAssessments.find((s) => s.id === id)?.data;
		assessment.reset();
		assessment.loadForId(id, seed);
		errors = [];
	}

	function gotoStep(n: number) {
		assessment.goto(n);
		document.getElementById(`step-${n}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}

	function stepStatus(n: number): 'waiting' | 'in-progress' | 'finished' {
		if (n < assessment.currentStep) return 'finished';
		if (n === assessment.currentStep) return 'in-progress';
		return 'waiting';
	}
</script>

<main class="mx-auto max-w-3xl px-4 py-6">
	<header class="mb-6 no-print">
		<h1 class="text-2xl font-bold text-base-content">
			{isNew ? 'New agile checklist' : `Agile checklist ${id}`}
		</h1>
		<p class="mt-1 text-sm text-base-content/70">
			Complete the five sections; the composite maturity, per-section bands, and flags are computed
			as you go.
		</p>
		<Progress label="Items answered" max={TOTAL_ITEMS} value={result.answeredCount} />
		<p class="mt-1 text-sm text-base-content/60" aria-live="polite">
			{result.answeredCount} of {TOTAL_ITEMS} items answered
		</p>
		<StepList label="Agile checklist steps" current={assessment.currentStep - 1}>
			{#each STEPS as s (s.number)}
				<StepListItem
					status={stepStatus(s.number)}
					current={s.number === assessment.currentStep}
					onclick={() => gotoStep(s.number)}
				>
					{s.short}
				</StepListItem>
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

	<Form label="Agile checklist" onsubmit={submit}>
		<div id="form-sections">
			{#each stepComponents as StepComponent, i (i)}
				<div
					id={`step-${i + 1}`}
					class="mb-5"
					style="scroll-margin-top: 6rem;"
					onmouseenter={() => assessment.goto(i + 1)}
					onfocusin={() => assessment.goto(i + 1)}
					role="region"
					aria-label={STEPS[i].title}
				>
					<StepComponent />
				</div>
			{/each}
		</div>

		<div class="button-group">
			<Button type="submit" data-variant="primary">Generate report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
