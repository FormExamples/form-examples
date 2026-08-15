<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { store } from '#lib/stores/indicators.svelte.js';
	import { STEPS } from '#lib/config/steps.js';
	import { TOTAL_INDICATORS } from '#lib/config/indicators.js';
	import { sampleReports } from '#lib/data/sample-reports.js';

	import Form from '#lib/components/ui/Form.svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import Progress from '#lib/components/ui/Progress.svelte';
	import StepList from '#lib/components/ui/StepList.svelte';
	import StepListItem from '#lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '#lib/components/ui/ErrorSummary.svelte';

	import Step01 from '#lib/components/steps/Step01ReportingPeriod.svelte';
	import Step02 from '#lib/components/steps/Step02Finance.svelte';
	import Step03 from '#lib/components/steps/Step03Process.svelte';
	import Step04 from '#lib/components/steps/Step04LearningAndGrowth.svelte';
	import Step05 from '#lib/components/steps/Step05Customer.svelte';
	import Step06 from '#lib/components/steps/Step06Summary.svelte';

	// 6 steps, auto-wrapped: reporting period (1), one per Balanced Scorecard
	// perspective (2-5, 4 perspectives), summary & sign-off (6).
	const stepComponents = [Step01, Step02, Step03, Step04, Step05, Step06];

	let errors = $state<{ id: string; message: string }[]>([]);

	const id = $derived(page.params.id ?? 'new');
	const isNew = $derived(id === 'new');
	const result = $derived(store.result);

	// Hydrate the wizard whenever the route id changes: a saved draft for that id
	// wins, otherwise seed from the matching sample report (existing id) or a
	// blank draft (new).
	$effect(() => {
		const seed = sampleReports.find((s) => s.id === id)?.data;
		if (store.id !== id) {
			store.loadForId(id, seed);
			errors = [];
		}
	});

	function validate(): boolean {
		const d = store.data;
		const found: { id: string; message: string }[] = [];
		if (d.reportingPeriod.hospitalName.trim() === '') {
			found.push({ id: 'hospitalName', message: 'Hospital / site name is required.' });
		}
		if (d.reportingPeriod.preparedByName.trim() === '') {
			found.push({ id: 'preparedByName', message: 'Prepared-by name is required.' });
		}
		if (d.reportingPeriod.periodMonth === null) {
			found.push({ id: 'periodMonth', message: 'Period month is required.' });
		}
		if (d.reportingPeriod.periodYear === null) {
			found.push({ id: 'periodYear', message: 'Period year is required.' });
		}
		errors = found;
		return found.length === 0;
	}

	function submit() {
		if (!validate()) {
			document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		goto(`/hospital-performance-indicators/hospital-performance-indicator-reports/${id}/report`);
	}

	function startOver() {
		const seed = sampleReports.find((s) => s.id === id)?.data;
		store.reset();
		store.loadForId(id, seed);
		errors = [];
	}

	function gotoStep(n: number) {
		store.goto(n);
		document.getElementById(`step-${n}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}

	function stepStatus(n: number): 'waiting' | 'in-progress' | 'finished' {
		if (n < store.currentStep) return 'finished';
		if (n === store.currentStep) return 'in-progress';
		return 'waiting';
	}
</script>

<main class="mx-16 px-4 py-6">
	<h1 class="text-2xl font-bold text-base-content">
		{isNew ? 'New reporting period' : `Reporting period ${id}`}
	</h1>
	<p class="mt-1 text-sm text-base-content/70">
		Complete the reporting period, all 4 Balanced Scorecard perspectives, and sign-off; the
		indicators-recorded tally is computed as you go.
	</p>
	<Progress label="Indicators recorded" max={TOTAL_INDICATORS} value={result.reportedCount} />
	<p class="mt-1 text-sm text-base-content/60" aria-live="polite">
		{result.reportedCount} of {TOTAL_INDICATORS} indicators recorded
	</p>
	<StepList label="Hospital performance indicators steps" current={store.currentStep - 1}>
		{#each STEPS as s (s.number)}
			<StepListItem
				status={stepStatus(s.number)}
				current={s.number === store.currentStep}
				onclick={() => gotoStep(s.number)}
			>
				{s.short}
			</StepListItem>
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

	<Form label="Hospital performance indicators" onsubmit={submit}>
		<div id="form-sections">
			{#each stepComponents as StepComponent, i (i)}
				<section
					id={`step-${i + 1}`}
					class="mb-5"
					style="scroll-margin-top: 6rem;"
					onmouseenter={() => store.goto(i + 1)}
					onfocusin={() => store.goto(i + 1)}
					aria-label={STEPS[i].title}
				>
					<StepComponent />
				</section>
			{/each}
		</div>

		<div class="button-group">
			<Button type="submit" data-variant="primary">Generate report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
