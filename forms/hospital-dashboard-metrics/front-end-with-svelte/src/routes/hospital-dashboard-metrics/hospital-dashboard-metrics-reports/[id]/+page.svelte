<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { store } from '$lib/stores/metrics.svelte';
	import { STEPS } from '$lib/config/steps';
	import { TOTAL_METRICS } from '$lib/config/metrics';
	import { sampleReports } from '$lib/data/sample-reports';

	import Form from '$lib/components/ui/Form.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Progress from '$lib/components/ui/Progress.svelte';
	import StepList from '$lib/components/ui/StepList.svelte';
	import StepListItem from '$lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '$lib/components/ui/ErrorSummary.svelte';

	import Step01 from '$lib/components/steps/Step01ReportingPeriod.svelte';
	import Step02 from '$lib/components/steps/Step02AntibioticsNarcoticsCulture.svelte';
	import Step03 from '$lib/components/steps/Step03InpatientWard.svelte';
	import Step04 from '$lib/components/steps/Step04EmergencyDepartment.svelte';
	import Step05 from '$lib/components/steps/Step05InfectionControl.svelte';
	import Step06 from '$lib/components/steps/Step06BloodBank.svelte';
	import Step07 from '$lib/components/steps/Step07Opd.svelte';
	import Step08 from '$lib/components/steps/Step08SurgeryOperatingRoom.svelte';
	import Step09 from '$lib/components/steps/Step09Pharmacy.svelte';
	import Step10 from '$lib/components/steps/Step10Radiology.svelte';
	import Step11 from '$lib/components/steps/Step11PatientFlowWaitingTimes.svelte';
	import Step12 from '$lib/components/steps/Step12HumanResources.svelte';
	import Step13 from '$lib/components/steps/Step13PatientExperience.svelte';
	import Step14 from '$lib/components/steps/Step14Ovr.svelte';
	import Step15 from '$lib/components/steps/Step15FacilitiesBiomedical.svelte';
	import Step16 from '$lib/components/steps/Step16Summary.svelte';

	// 16 steps, auto-wrapped: reporting period (1), one per KPI category
	// (2-15, 14 categories), summary & sign-off (16).
	const stepComponents = [
		Step01, Step02, Step03, Step04, Step05, Step06, Step07, Step08,
		Step09, Step10, Step11, Step12, Step13, Step14, Step15, Step16
	];

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
		goto(`/hospital-dashboard-metrics/hospital-dashboard-metrics-reports/${id}/report`);
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
		Complete the reporting period, all 14 KPI categories, and sign-off; the metrics-recorded
		tally is computed as you go.
	</p>
	<Progress label="Metrics recorded" max={TOTAL_METRICS} value={result.reportedCount} />
	<p class="mt-1 text-sm text-base-content/60" aria-live="polite">
		{result.reportedCount} of {TOTAL_METRICS} metrics recorded
	</p>
	<StepList label="Hospital dashboard metrics steps" current={store.currentStep - 1}>
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

	<Form label="Hospital dashboard metrics" onsubmit={submit}>
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
