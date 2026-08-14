<script lang="ts">
	// The hip-replacement surgery evaluation wizard: one continuous single page
	// holding all fifteen steps in document order. The step list at the top is
	// a table of contents with completion status, not a pager — the monorepo
	// rule is a single-page wizard, so nothing is hidden behind navigation.
	import { page } from '$app/state';
	import Alert from '$lib/components/ui/Alert.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import ErrorSummary from '$lib/components/ui/ErrorSummary.svelte';
	import Form from '$lib/components/ui/Form.svelte';
	import Panel from '$lib/components/ui/Panel.svelte';
	import Progress from '$lib/components/ui/Progress.svelte';
	import StepList from '$lib/components/ui/StepList.svelte';
	import StepListItem from '$lib/components/ui/StepListItem.svelte';

	import Step1ClinicianIdentification from '$lib/components/steps/Step1ClinicianIdentification.svelte';
	import Step2PatientIdentification from '$lib/components/steps/Step2PatientIdentification.svelte';
	import Step3PresentingHistory from '$lib/components/steps/Step3PresentingHistory.svelte';
	import Step4OxfordHipScore from '$lib/components/steps/Step4OxfordHipScore.svelte';
	import Step5FunctionalLimitations from '$lib/components/steps/Step5FunctionalLimitations.svelte';
	import Step6GaitAndBiomechanical from '$lib/components/steps/Step6GaitAndBiomechanical.svelte';
	import Step7RangeOfMotion from '$lib/components/steps/Step7RangeOfMotion.svelte';
	import Step8StabilityAndStrength from '$lib/components/steps/Step8StabilityAndStrength.svelte';
	import Step9DiagnosticImaging from '$lib/components/steps/Step9DiagnosticImaging.svelte';
	import Step10ConservativeTreatment from '$lib/components/steps/Step10ConservativeTreatment.svelte';
	import Step11GeneralHealthAndFitness from '$lib/components/steps/Step11GeneralHealthAndFitness.svelte';
	import Step12BaselineTests from '$lib/components/steps/Step12BaselineTests.svelte';
	import Step13SharedDecisionMaking from '$lib/components/steps/Step13SharedDecisionMaking.svelte';
	import Step14ManagementPlan from '$lib/components/steps/Step14ManagementPlan.svelte';
	import Step15SummaryAndSignOff from '$lib/components/steps/Step15SummaryAndSignOff.svelte';

	import { steps, TOTAL_STEPS } from '$lib/config/steps';
	import { CANDIDACY_LABELS, OHS_CATEGORY_LABELS } from '$lib/engine/grader';
	import { evaluationStore } from '$lib/stores/evaluation.svelte';

	const id = $derived(page.params.id ?? 'new');

	$effect(() => {
		evaluationStore.load(id);
	});

	const d = evaluationStore.data;
	const result = $derived(evaluationStore.result);

	// Persist on every change so a partly-filled evaluation survives a reload.
	$effect(() => {
		JSON.stringify(evaluationStore.data);
		evaluationStore.save();
	});

	// A representative field per step drives the completion indicator.
	const stepAnswered = $derived([
		Boolean(d.clinician.clinicianName),
		Boolean(d.patient.name),
		Boolean(d.history.affectedSide),
		d.ohs.painSeverity !== null,
		Boolean(d.function.walkingDistanceBeforePain),
		Boolean(d.gait.limpPresent),
		d.rangeOfMotion.flexionDegrees !== null,
		Boolean(d.stability.jointStability),
		Boolean(d.imaging.weightBearingXrayPerformed),
		Boolean(d.conservative.conservativeMeasuresExhausted),
		Boolean(d.fitness.diabetesControlled),
		Boolean(d.baselineTests.fullBloodCountDone),
		Boolean(d.decisionMaking.risksAndBenefitsDiscussed),
		Boolean(d.plan.recommendation),
		Boolean(d.summary.signedByName)
	]);

	const answeredCount = $derived(stepAnswered.filter(Boolean).length);
	const percent = $derived(Math.round((answeredCount / TOTAL_STEPS) * 100));
	const firstUnfinished = $derived(stepAnswered.findIndex((a) => !a) + 1 || TOTAL_STEPS);

	const overrideDiffers = $derived(
		Boolean(d.summary.overrideCandidacy) && d.summary.overrideCandidacy !== result.computedCandidacy
	);

	const errors = $derived.by(() => {
		const list: Array<{ id: string; message: string }> = [];
		if (!d.clinician.clinicianName.trim()) {
			list.push({ id: 'clinician-clinicianName', message: 'Clinician name is required' });
		}
		if (!d.clinician.assessmentDate) {
			list.push({ id: 'clinician-assessmentDate', message: 'Assessment date is required' });
		}
		if (!d.patient.name.trim()) {
			list.push({ id: 'patient-name', message: 'A patient name is required' });
		}
		if (!d.conservative.conservativeMeasuresExhausted) {
			list.push({
				id: 'conservative-conservativeMeasuresExhausted',
				message: 'Whether conservative measures are exhausted is required'
			});
		}
		if (!d.summary.signedByName.trim()) {
			list.push({
				id: 'summary-signedByName',
				message: 'The orthopaedic surgeon or extended-scope physiotherapist must sign before the report is final'
			});
		}
		// An override without a reason is not auditable, so it is an error.
		if (overrideDiffers && !d.summary.overrideReason.trim()) {
			list.push({
				id: 'summary-overrideReason',
				message: 'An override reason is required when the final candidacy differs from the computed candidacy'
			});
		}
		return list;
	});

	let showErrors = $state(false);

	function submit() {
		showErrors = true;
		if (errors.length > 0) return;
		evaluationStore.submitted = true;
		void goToReport();
	}

	async function goToReport() {
		const { goto } = await import('$app/navigation');
		await goto(`/hip-replacement-surgery-evaluation/hip-replacement-surgery-evaluations/${id}/report`);
	}

	function startOver() {
		if (!confirm('Clear all answers and start a fresh evaluation?')) return;
		evaluationStore.reset();
		showErrors = false;
	}

	function scrollToStep(n: number) {
		document.getElementById(`step-${n}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}
</script>

<svelte:head>
	<title>Hip Replacement Surgery Evaluation — evaluation form</title>
</svelte:head>

<main class="mx-16 px-4 py-8">
	<h1 class="text-2xl font-bold text-base-content">Hip Replacement Surgery Evaluation</h1>
	<p class="mt-2 max-w-3xl text-sm text-base-content/70">
		Fifteen steps on one continuous page. The draft is saved to this browser as you work. Safety
		flags are always shown on the summary step and in the final report, whatever candidacy the
		clinician records.
	</p>

	<div class="mt-6">
		<Progress value={percent} max={100} label="Evaluation completion" />
		<p class="mt-1 text-sm text-base-content/70" aria-live="polite">
			{answeredCount} of {TOTAL_STEPS} steps started ({percent}%)
		</p>
	</div>

	<StepList label="Hip replacement surgery evaluation steps" current={firstUnfinished - 1} class="mt-4">
		{#each steps as step (step.number)}
			<StepListItem
				status={stepAnswered[step.number - 1]
					? 'finished'
					: step.number === firstUnfinished
						? 'in-progress'
						: 'waiting'}
				current={step.number === firstUnfinished}
			>
				<button type="button" onclick={() => scrollToStep(step.number)}>{step.shortTitle}</button>
			</StepListItem>
		{/each}
	</StepList>

	<div class="mt-6 grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:items-start">
		<Form label="Hip replacement surgery evaluation" onsubmit={(e: Event) => e.preventDefault()}>
			{#if showErrors && errors.length > 0}
				<ErrorSummary title="Please correct the following">
					<ul>
						{#each errors as error (error.id)}
							<li><a href="#{error.id}">{error.message}</a></li>
						{/each}
					</ul>
				</ErrorSummary>
			{/if}

			<div id="step-1"><Step1ClinicianIdentification /></div>
			<div id="step-2"><Step2PatientIdentification /></div>
			<div id="step-3"><Step3PresentingHistory /></div>
			<div id="step-4"><Step4OxfordHipScore /></div>
			<div id="step-5"><Step5FunctionalLimitations /></div>
			<div id="step-6"><Step6GaitAndBiomechanical /></div>
			<div id="step-7"><Step7RangeOfMotion /></div>
			<div id="step-8"><Step8StabilityAndStrength /></div>
			<div id="step-9"><Step9DiagnosticImaging /></div>
			<div id="step-10"><Step10ConservativeTreatment /></div>
			<div id="step-11"><Step11GeneralHealthAndFitness /></div>
			<div id="step-12"><Step12BaselineTests /></div>
			<div id="step-13"><Step13SharedDecisionMaking /></div>
			<div id="step-14"><Step14ManagementPlan /></div>
			<div id="step-15"><Step15SummaryAndSignOff /></div>

			<div class="button-group mt-6 flex gap-2">
				<Button data-variant="primary" type="button" onclick={submit}>Submit and view report</Button>
				<Button data-variant="secondary" type="button" onclick={startOver}>Start over</Button>
			</div>
		</Form>

		<Panel label="Live scores" class="lg:sticky lg:top-4">
			<h2 class="text-lg font-semibold">Live scores</h2>
			<p class="mt-1 text-sm text-base-content/70">
				Recomputed as you type. Submit to produce the signed report.
			</p>

			{#if overrideDiffers}
				<Alert type="warning" class="mt-3">
					Final candidacy differs from the computed candidacy — an override reason is required.
				</Alert>
			{/if}

			<dl class="mt-4 space-y-2 text-sm">
				<div class="flex justify-between gap-4">
					<dt class="text-base-content/70">Oxford Hip Score</dt>
					<dd class="font-semibold">{result.ohsTotal} / 48 — {OHS_CATEGORY_LABELS[result.ohsCategory] ?? '—'}</dd>
				</div>
				<div class="flex justify-between gap-4">
					<dt class="text-base-content/70">Body mass index</dt>
					<dd class="font-semibold">{result.bmi === null ? '—' : `${result.bmi} kg/m²`}</dd>
				</div>
				<div class="flex justify-between gap-4">
					<dt class="text-base-content/70">Kellgren and Lawrence grade</dt>
					<dd class="font-semibold">{result.kellgrenLawrenceGrade === null ? '—' : result.kellgrenLawrenceGrade}</dd>
				</div>
				<div class="flex justify-between gap-4 border-t border-base-300 pt-2">
					<dt class="text-base-content/70">Computed candidacy</dt>
					<dd class="font-semibold">{CANDIDACY_LABELS[result.computedCandidacy]}</dd>
				</div>
				<div class="flex justify-between gap-4">
					<dt class="text-base-content/70">Final candidacy</dt>
					<dd class="font-semibold">{CANDIDACY_LABELS[result.finalCandidacy]}</dd>
				</div>
			</dl>

			<h3 class="mt-4 text-sm font-semibold">Safety flags</h3>
			{#if result.flags.length === 0}
				<p class="mt-1 text-sm text-base-content/60">None raised.</p>
			{:else}
				<ul class="mt-2 space-y-2 text-sm">
					{#each result.flags as flag (flag.flagId)}
						<li class="rounded border border-base-300 p-2">
							<span class="font-semibold uppercase">{flag.priority}</span>
							<span class="ml-1">{flag.description}</span>
						</li>
					{/each}
				</ul>
			{/if}
		</Panel>
	</div>
</main>
