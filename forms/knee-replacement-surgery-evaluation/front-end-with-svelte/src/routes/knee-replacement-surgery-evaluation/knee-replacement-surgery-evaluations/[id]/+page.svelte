<script lang="ts">
	// The knee-replacement surgery evaluation wizard: one continuous single
	// page holding all fifteen steps in document order. The step list at the
	// top is a table of contents with completion status, not a pager — the
	// monorepo rule is a single-page wizard, so nothing is hidden behind
	// navigation.
	import { page } from '$app/state';
	import Alert from '#lib/components/ui/Alert.svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import ErrorSummary from '#lib/components/ui/ErrorSummary.svelte';
	import Form from '#lib/components/ui/Form.svelte';
	import Panel from '#lib/components/ui/Panel.svelte';
	import Progress from '#lib/components/ui/Progress.svelte';
	import StepList from '#lib/components/ui/StepList.svelte';
	import StepListItem from '#lib/components/ui/StepListItem.svelte';

	import Step1ClinicianIdentification from '#lib/components/steps/Step1ClinicianIdentification.svelte';
	import Step2PatientIdentification from '#lib/components/steps/Step2PatientIdentification.svelte';
	import Step3PresentingHistory from '#lib/components/steps/Step3PresentingHistory.svelte';
	import Step4OxfordKneeScore from '#lib/components/steps/Step4OxfordKneeScore.svelte';
	import Step5FunctionalLimitations from '#lib/components/steps/Step5FunctionalLimitations.svelte';
	import Step6RangeOfMotion from '#lib/components/steps/Step6RangeOfMotion.svelte';
	import Step7StabilityAlignment from '#lib/components/steps/Step7StabilityAlignment.svelte';
	import Step8StrengthEffusion from '#lib/components/steps/Step8StrengthEffusion.svelte';
	import Step9DiagnosticImaging from '#lib/components/steps/Step9DiagnosticImaging.svelte';
	import Step10ConservativeTreatment from '#lib/components/steps/Step10ConservativeTreatment.svelte';
	import Step11GeneralHealth from '#lib/components/steps/Step11GeneralHealth.svelte';
	import Step12PreOpBloods from '#lib/components/steps/Step12PreOpBloods.svelte';
	import Step13SharedDecisionMaking from '#lib/components/steps/Step13SharedDecisionMaking.svelte';
	import Step14ManagementPlan from '#lib/components/steps/Step14ManagementPlan.svelte';
	import Step15Summary from '#lib/components/steps/Step15Summary.svelte';

	import { steps, TOTAL_STEPS } from '#lib/config/steps.js';
	import { CANDIDACY_LABELS, OKS_CATEGORY_LABELS } from '#lib/engine/grader.js';
	import { evaluationStore } from '#lib/stores/evaluation.svelte.js';

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
		Boolean(d.history.kneeSide),
		d.oks.oksPainSeverity !== null,
		Boolean(d.functional.walkingDistanceBeforePain),
		d.rangeOfMotion.flexionDegrees !== null,
		Boolean(d.stability.coronalDeformityType),
		Boolean(d.strength.effusionPresent),
		Boolean(d.imaging.weightBearingXrayPerformed),
		Boolean(d.conservative.conservativeMeasuresExhausted),
		Boolean(d.generalHealth.smokingStatus),
		Boolean(d.preOpBloods.fbcDone),
		Boolean(d.sharedDecision.risksBenefitsDiscussed),
		Boolean(d.plan.planRecommendation),
		Boolean(d.summary.signedByName)
	]);

	const answeredCount = $derived(stepAnswered.filter(Boolean).length);
	const percent = $derived(Math.round((answeredCount / TOTAL_STEPS) * 100));
	const firstUnfinished = $derived(stepAnswered.findIndex((a) => !a) + 1 || TOTAL_STEPS);

	const errors = $derived.by(() => {
		const list: Array<{ id: string; message: string }> = [];
		if (!d.clinician.clinicianName.trim()) {
			list.push({ id: 'clinician-clinicianName', message: 'Clinician name is required' });
		}
		if (!d.clinician.assessmentDate) {
			list.push({ id: 'clinician-assessmentDate', message: 'Assessment date is required' });
		}
		if (!d.patient.name.trim()) {
			list.push({ id: 'patient-name', message: 'Patient name is required' });
		}
		if (!d.summary.signedByName.trim()) {
			list.push({
				id: 'summary-signedByName',
				message: 'A clinician must sign before the report is final'
			});
		}
		// An override without a reason is not auditable, so it is an error.
		if (
			d.summary.overrideCandidacy &&
			d.summary.overrideCandidacy !== result.computedCandidacy &&
			!d.summary.overrideReason.trim()
		) {
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
		await goto(`/knee-replacement-surgery-evaluation/knee-replacement-surgery-evaluations/${id}/report`);
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
	<title>Knee Replacement Surgery Evaluation — evaluation form</title>
</svelte:head>

<main class="mx-16 px-4 py-8">
	<h1 class="text-2xl font-bold text-base-content">Knee Replacement Surgery Evaluation</h1>
	<p class="mt-2 max-w-3xl text-sm text-base-content/70">
		Fifteen steps on one continuous page. The draft is saved to this browser as you work.
	</p>

	<div class="mt-6">
		<Progress value={percent} max={100} label="Evaluation completion" />
		<p class="mt-1 text-sm text-base-content/70" aria-live="polite">
			{answeredCount} of {TOTAL_STEPS} steps started ({percent}%)
		</p>
	</div>

	<StepList label="Knee-replacement surgery evaluation steps" current={firstUnfinished - 1} class="mt-4">
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
		<Form label="Knee-replacement surgery evaluation" onsubmit={(e: Event) => e.preventDefault()}>
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
			<div id="step-4"><Step4OxfordKneeScore /></div>
			<div id="step-5"><Step5FunctionalLimitations /></div>
			<div id="step-6"><Step6RangeOfMotion /></div>
			<div id="step-7"><Step7StabilityAlignment /></div>
			<div id="step-8"><Step8StrengthEffusion /></div>
			<div id="step-9"><Step9DiagnosticImaging /></div>
			<div id="step-10"><Step10ConservativeTreatment /></div>
			<div id="step-11"><Step11GeneralHealth /></div>
			<div id="step-12"><Step12PreOpBloods /></div>
			<div id="step-13"><Step13SharedDecisionMaking /></div>
			<div id="step-14"><Step14ManagementPlan /></div>
			<div id="step-15"><Step15Summary /></div>

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

			{#if result.oksTotal > 0 && result.finalCandidacy !== result.computedCandidacy}
				<Alert type="warning" class="mt-3">
					Clinician override in effect: computed candidacy was
					{CANDIDACY_LABELS[result.computedCandidacy]}.
				</Alert>
			{/if}

			<dl class="mt-4 space-y-2 text-sm">
				<div class="flex justify-between gap-4">
					<dt class="text-base-content/70">Oxford Knee Score</dt>
					<dd class="font-semibold">{result.oksTotal} / 48 — {OKS_CATEGORY_LABELS[result.computedOksCategory]}</dd>
				</div>
				<div class="flex justify-between gap-4">
					<dt class="text-base-content/70">Highest Kellgren-Lawrence grade</dt>
					<dd class="font-semibold">{result.maxKellgrenLawrenceGrade ?? '—'}</dd>
				</div>
				<div class="flex justify-between gap-4 border-t border-base-300 pt-2">
					<dt class="text-base-content/70">Candidacy</dt>
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
