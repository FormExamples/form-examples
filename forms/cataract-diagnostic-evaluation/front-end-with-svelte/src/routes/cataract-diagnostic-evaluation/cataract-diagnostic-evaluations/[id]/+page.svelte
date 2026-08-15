<script lang="ts">
	// The cataract diagnostic evaluation wizard: one continuous single page
	// holding all fifteen steps in document order. The step list at the top is
	// a table of contents with completion status, not a pager — the monorepo
	// rule is a single-page wizard, so nothing is hidden behind navigation.
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
	import Step3PresentingSymptoms from '#lib/components/steps/Step3PresentingSymptoms.svelte';
	import Step4OcularAndMedicalHistory from '#lib/components/steps/Step4OcularAndMedicalHistory.svelte';
	import Step5VisualAcuity from '#lib/components/steps/Step5VisualAcuity.svelte';
	import Step6Refraction from '#lib/components/steps/Step6Refraction.svelte';
	import Step7SlitLampExamination from '#lib/components/steps/Step7SlitLampExamination.svelte';
	import Step8GlareTesting from '#lib/components/steps/Step8GlareTesting.svelte';
	import Step9Tonometry from '#lib/components/steps/Step9Tonometry.svelte';
	import Step10DilatedFundusExamination from '#lib/components/steps/Step10DilatedFundusExamination.svelte';
	import Step11DifferentialDiagnosis from '#lib/components/steps/Step11DifferentialDiagnosis.svelte';
	import Step12Biometry from '#lib/components/steps/Step12Biometry.svelte';
	import Step13FunctionalImpact from '#lib/components/steps/Step13FunctionalImpact.svelte';
	import Step14ManagementPlan from '#lib/components/steps/Step14ManagementPlan.svelte';
	import Step15SummarySignOff from '#lib/components/steps/Step15SummarySignOff.svelte';

	import { steps, TOTAL_STEPS } from '#lib/config/steps.js';
	import { LOCS_III_SEVERITY_LABELS, SURGICAL_CANDIDACY_LABELS } from '#lib/engine/grader.js';
	import { evaluationStore } from '#lib/stores/evaluation.svelte.js';

	const id = $derived(page.params.id ?? 'new');

	$effect(() => {
		evaluationStore.load(id);
	});

	const d = evaluationStore.data;
	const result = $derived(evaluationStore.result);

	// Persist on every change so a partly-filled evaluation survives a reload —
	// the full evaluation typically runs 1 to 2 hours.
	$effect(() => {
		JSON.stringify(evaluationStore.data);
		evaluationStore.save();
	});

	// A representative field per step drives the completion indicator.
	const stepAnswered = $derived([
		Boolean(d.clinician.clinicianName),
		Boolean(d.patient.firstName || d.patient.lastName),
		Boolean(d.symptoms.blurredVision),
		Boolean(d.history.historyDiabetes),
		d.acuity.bestCorrectedVaLogmarRight !== null || d.acuity.bestCorrectedVaLogmarLeft !== null,
		d.refraction.refractionSphereRight !== null || d.refraction.refractionSphereLeft !== null,
		d.slitLamp.locsIiiNoRight !== null || d.slitLamp.locsIiiNoLeft !== null,
		Boolean(d.glare.glareFunctionalImpact),
		d.tonometry.intraocularPressureRightMmhg !== null || d.tonometry.intraocularPressureLeftMmhg !== null,
		Boolean(d.fundus.dilatedFundusExamPerformed),
		Boolean(d.differential.glaucomaSuspected),
		Boolean(d.biometry.biometryPerformed),
		d.functional.functionalDifficultyReading !== null,
		Boolean(d.management.managementRecommendation),
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
		if (!d.patient.firstName.trim() && !d.patient.lastName.trim()) {
			list.push({ id: 'patient-firstName', message: 'A patient name is required' });
		}
		if (!d.summary.signedByName.trim()) {
			list.push({
				id: 'summary-signedByName',
				message: 'An optometrist or ophthalmologist must sign before the report is final'
			});
		}
		// An override without a reason is not auditable, so it is an error.
		if (
			d.summary.overrideSurgicalCandidacy &&
			d.summary.overrideSurgicalCandidacy !== result.computedSurgicalCandidacy &&
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
		await goto(`/cataract-diagnostic-evaluation/cataract-diagnostic-evaluations/${id}/report`);
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
	<title>Cataract Diagnostic Evaluation — evaluation form</title>
</svelte:head>

<main class="mx-16 px-4 py-8">
	<h1 class="text-2xl font-bold text-base-content">Cataract Diagnostic Evaluation</h1>
	<p class="mt-2 max-w-3xl text-sm text-base-content/70">
		Fifteen steps on one continuous page. The draft is saved to this browser as you work. The full
		evaluation typically takes 1 to 2 hours, because it requires pupil dilation and precise
		structural measurements of the eye.
	</p>

	<div class="mt-6">
		<Progress value={percent} max={100} label="Evaluation completion" />
		<p class="mt-1 text-sm text-base-content/70" aria-live="polite">
			{answeredCount} of {TOTAL_STEPS} steps started ({percent}%)
		</p>
	</div>

	<StepList label="Cataract diagnostic evaluation steps" current={firstUnfinished - 1} class="mt-4">
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
		<Form label="Cataract diagnostic evaluation" onsubmit={(e: Event) => e.preventDefault()}>
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
			<div id="step-3"><Step3PresentingSymptoms /></div>
			<div id="step-4"><Step4OcularAndMedicalHistory /></div>
			<div id="step-5"><Step5VisualAcuity /></div>
			<div id="step-6"><Step6Refraction /></div>
			<div id="step-7"><Step7SlitLampExamination /></div>
			<div id="step-8"><Step8GlareTesting /></div>
			<div id="step-9"><Step9Tonometry /></div>
			<div id="step-10"><Step10DilatedFundusExamination /></div>
			<div id="step-11"><Step11DifferentialDiagnosis /></div>
			<div id="step-12"><Step12Biometry /></div>
			<div id="step-13"><Step13FunctionalImpact /></div>
			<div id="step-14"><Step14ManagementPlan /></div>
			<div id="step-15"><Step15SummarySignOff /></div>

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

			<dl class="mt-4 space-y-2 text-sm">
				<div class="flex justify-between gap-4">
					<dt class="text-base-content/70">LOCS III — right</dt>
					<dd class="font-semibold">{LOCS_III_SEVERITY_LABELS[result.locsIIISeverityRight]}</dd>
				</div>
				<div class="flex justify-between gap-4">
					<dt class="text-base-content/70">LOCS III — left</dt>
					<dd class="font-semibold">{LOCS_III_SEVERITY_LABELS[result.locsIIISeverityLeft]}</dd>
				</div>
				<div class="flex justify-between gap-4">
					<dt class="text-base-content/70">Functional impact score</dt>
					<dd class="font-semibold">
						{result.functionalImpactScore === null ? '—' : `${result.functionalImpactScore} / 12`}
					</dd>
				</div>
				<div class="flex justify-between gap-4 border-t border-base-300 pt-2">
					<dt class="text-base-content/70">Computed candidacy</dt>
					<dd class="font-semibold">{SURGICAL_CANDIDACY_LABELS[result.computedSurgicalCandidacy]}</dd>
				</div>
				<div class="flex justify-between gap-4">
					<dt class="text-base-content/70">Final candidacy</dt>
					<dd class="font-semibold">{SURGICAL_CANDIDACY_LABELS[result.finalSurgicalCandidacy]}</dd>
				</div>
			</dl>

			{#if result.finalSurgicalCandidacy !== result.computedSurgicalCandidacy}
				<Alert type="warning" class="mt-3">
					Clinician override in effect: {result.overrideReason || 'no reason recorded yet'}.
				</Alert>
			{/if}

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

			<h3 class="mt-4 text-sm font-semibold">Fired rules</h3>
			{#if result.firedRules.length === 0}
				<p class="mt-1 text-sm text-base-content/60">None yet.</p>
			{:else}
				<ul class="mt-2 space-y-1 text-sm">
					{#each result.firedRules as fired (fired.ruleId + fired.component)}
						<li class="text-base-content/80">{fired.description}</li>
					{/each}
				</ul>
			{/if}
		</Panel>
	</div>
</main>
