<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateGrade } from '$lib/engine/fluid-balance-grader';
	import { steps, TOTAL_STEPS } from '$lib/config/steps';
	import { sampleAssessments } from '$lib/data/sample-reports';

	import Form from '$lib/components/ui/Form.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Progress from '$lib/components/ui/Progress.svelte';
	import StepList from '$lib/components/ui/StepList.svelte';
	import StepListItem from '$lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '$lib/components/ui/ErrorSummary.svelte';

	import Step1ChartContext from '$lib/components/steps/Step1ChartContext.svelte';
	import Step2PatientWeight from '$lib/components/steps/Step2PatientWeight.svelte';
	import Step3IntakeEntries from '$lib/components/steps/Step3IntakeEntries.svelte';
	import Step4OutputEntries from '$lib/components/steps/Step4OutputEntries.svelte';
	import Step5SummaryAndNote from '$lib/components/steps/Step5SummaryAndNote.svelte';

	let errors = $state<{ id: string; message: string }[]>([]);

	const id = $derived(page.params.id ?? 'new');
	const isNew = $derived(id === 'new');

	// Hydrate the wizard whenever the route id changes: a saved draft for that id
	// wins, otherwise seed from the matching sample chart (existing id) or a blank
	// draft (new).
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
		if (d.context.clinicianName.trim() === '') {
			found.push({
				id: 'context-clinicianName',
				message: 'Charting clinician name is required.'
			});
		}
		if (d.context.clinicianRole === '') {
			found.push({ id: 'context-clinicianRole', message: 'Clinician role is required.' });
		}
		if (d.context.patientIdentifier.trim() === '') {
			found.push({ id: 'context-patientIdentifier', message: 'Patient identifier is required.' });
		}
		errors = found;
		return found.length === 0;
	}

	function submit() {
		if (!validate()) {
			document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		assessment.result = calculateGrade(assessment.data);
		goto(`/fluid-balance-chart/fluid-balance-charts/${id}/report`);
	}

	function startOver() {
		const seed = sampleAssessments.find((s) => s.id === id)?.data;
		assessment.reset();
		assessment.loadForId(id, seed);
		errors = [];
	}
</script>

<main class="mx-auto max-w-3xl px-4 py-6">
	<header class="mb-6 no-print">
		<h1 class="text-2xl font-bold text-base-content">
			{isNew ? 'New fluid balance chart' : `Fluid balance chart ${id}`}
		</h1>
		<p class="mt-1 text-sm text-base-content/70">
			Complete the five sections; the totals, net balance, fluid status, and safety flags are
			computed on submit.
		</p>
		<Progress label="Chart sections" value={TOTAL_STEPS} max={TOTAL_STEPS} />
		<StepList label="Chart sections" current={TOTAL_STEPS}>
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

	<Form label="Fluid balance chart" onsubmit={submit}>
		<Step1ChartContext />
		<Step2PatientWeight />
		<Step3IntakeEntries />
		<Step4OutputEntries />
		<Step5SummaryAndNote />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Submit &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
