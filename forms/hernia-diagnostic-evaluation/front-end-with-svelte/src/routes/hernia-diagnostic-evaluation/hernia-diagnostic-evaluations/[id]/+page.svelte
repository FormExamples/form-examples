<script lang="ts">
	// The hernia diagnostic evaluation wizard: one continuous single page
	// holding all fourteen steps in document order. The step list at the top
	// is a table of contents with completion status, not a pager — the
	// monorepo rule is a single-page wizard, so nothing is hidden behind
	// navigation.
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
	import Step3PresentingComplaintAndHistory from '$lib/components/steps/Step3PresentingComplaintAndHistory.svelte';
	import Step4RiskFactors from '$lib/components/steps/Step4RiskFactors.svelte';
	import Step5VisualInspection from '$lib/components/steps/Step5VisualInspection.svelte';
	import Step6PalpationAndCoughImpulse from '$lib/components/steps/Step6PalpationAndCoughImpulse.svelte';
	import Step7ReducibilityAssessment from '$lib/components/steps/Step7ReducibilityAssessment.svelte';
	import Step8RedFlagScreen from '$lib/components/steps/Step8RedFlagScreen.svelte';
	import Step9ClinicalClassification from '$lib/components/steps/Step9ClinicalClassification.svelte';
	import Step10Imaging from '$lib/components/steps/Step10Imaging.svelte';
	import Step11DifferentialDiagnosis from '$lib/components/steps/Step11DifferentialDiagnosis.svelte';
	import Step12FunctionalImpact from '$lib/components/steps/Step12FunctionalImpact.svelte';
	import Step13ManagementPlan from '$lib/components/steps/Step13ManagementPlan.svelte';
	import Step14SummaryAndSignOff from '$lib/components/steps/Step14SummaryAndSignOff.svelte';

	import { steps, TOTAL_STEPS } from '$lib/config/steps';
	import { RECOMMENDATION_LABELS, URGENCY_LABELS } from '$lib/engine/grader';
	import { evaluationStore } from '$lib/stores/assessment.svelte';

	const id = $derived(page.params.id ?? 'new');

	$effect(() => {
		evaluationStore.load(id);
	});

	const d = evaluationStore.data;
	const result = $derived(evaluationStore.result);

	// Persist on every change so a partly-completed evaluation survives a reload.
	$effect(() => {
		JSON.stringify(evaluationStore.data);
		evaluationStore.save();
	});

	// A representative field per step drives the completion indicator.
	const stepAnswered = $derived([
		Boolean(d.clinician.clinicianName),
		Boolean(d.patient.firstName || d.patient.lastName),
		Boolean(d.history.durationOfBulge),
		d.riskFactors.riskChronicCough !== '' ||
			d.riskFactors.riskConstipationOrStraining !== '' ||
			d.riskFactors.riskHeavyLiftingOccupation !== '' ||
			d.riskFactors.riskObesity !== '' ||
			d.riskFactors.riskSmoking !== '',
		Boolean(d.inspection.inspectionLocation),
		Boolean(d.palpation.palpableMass),
		Boolean(d.reducibility.reducibilityStatus),
		d.redFlags.redFlagSeverePain !== '' ||
			d.redFlags.redFlagVomiting !== '' ||
			d.redFlags.redFlagFever !== '' ||
			d.redFlags.redFlagAbsoluteConstipation !== '' ||
			d.redFlags.redFlagErythemaOrDiscolouration !== '' ||
			d.redFlags.redFlagPreviouslyReducibleNowIrreducible !== '' ||
			d.redFlags.redFlagTachycardia !== '',
		Boolean(d.classification.herniaType),
		Boolean(d.imaging.imagingIndication),
		d.differential.differentialLipoma !== '' ||
			d.differential.differentialLymphadenopathy !== '' ||
			d.differential.differentialHydrocele !== '' ||
			d.differential.differentialUndescendedTestis !== '' ||
			d.differential.differentialFemoralAneurysm !== '' ||
			d.differential.differentialAbscess !== '',
		Boolean(d.functionalImpact.painInterferesWithWorkOrActivity),
		Boolean(d.management.managementPlan),
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
		if (!d.reducibility.reducibilityStatus) {
			list.push({
				id: 'reducibility-reducibilityStatus',
				message: 'A reducibility status is required'
			});
		}
		if (!d.summary.signedByName.trim()) {
			list.push({
				id: 'summary-signedByName',
				message: 'The examining clinician must sign before the report is final'
			});
		}
		// An override without a reason is not auditable, so it is an error.
		if (
			d.summary.overrideUrgency &&
			d.summary.overrideUrgency !== result.computedUrgency &&
			!d.summary.overrideReason.trim()
		) {
			list.push({
				id: 'summary-overrideReason',
				message: 'An override reason is required when the final urgency differs from the computed urgency'
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
		await goto(`/hernia-diagnostic-evaluation/hernia-diagnostic-evaluations/${id}/report`);
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
	<title>Hernia Diagnostic Evaluation — evaluation form</title>
</svelte:head>

<main class="mx-16 px-4 py-8">
	<h1 class="text-2xl font-bold text-base-content">Hernia Diagnostic Evaluation</h1>
	<p class="mt-2 max-w-3xl text-sm text-base-content/70">
		Fourteen steps on one continuous page. The draft is saved to this browser as you work. Step 8
		is the red-flag / emergency symptom screen: a single positive answer there forces emergency
		urgency regardless of every other finding.
	</p>

	<div class="mt-6">
		<Progress value={percent} max={100} label="Evaluation completion" />
		<p class="mt-1 text-sm text-base-content/70" aria-live="polite">
			{answeredCount} of {TOTAL_STEPS} steps started ({percent}%)
		</p>
	</div>

	<StepList label="Hernia diagnostic evaluation steps" current={firstUnfinished - 1} class="mt-4">
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
		<Form label="Hernia diagnostic evaluation" onsubmit={(e: Event) => e.preventDefault()}>
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
			<div id="step-3"><Step3PresentingComplaintAndHistory /></div>
			<div id="step-4"><Step4RiskFactors /></div>
			<div id="step-5"><Step5VisualInspection /></div>
			<div id="step-6"><Step6PalpationAndCoughImpulse /></div>
			<div id="step-7"><Step7ReducibilityAssessment /></div>
			<div id="step-8"><Step8RedFlagScreen /></div>
			<div id="step-9"><Step9ClinicalClassification /></div>
			<div id="step-10"><Step10Imaging /></div>
			<div id="step-11"><Step11DifferentialDiagnosis /></div>
			<div id="step-12"><Step12FunctionalImpact /></div>
			<div id="step-13"><Step13ManagementPlan /></div>
			<div id="step-14"><Step14SummaryAndSignOff /></div>

			<div class="button-group mt-6 flex gap-2">
				<Button data-variant="primary" type="button" onclick={submit}>Submit and view report</Button>
				<Button data-variant="secondary" type="button" onclick={startOver}>Start over</Button>
			</div>
		</Form>

		<Panel label="Live results" class="lg:sticky lg:top-4">
			<h2 class="text-lg font-semibold">Live results</h2>
			<p class="mt-1 text-sm text-base-content/70">
				Recomputed as you type. Submit to produce the signed report.
			</p>

			{#if result.anyRedFlag}
				<Alert type="error" class="mt-3" heading="Emergency: a red flag is positive">
					Any positive red flag requires same-day clinical escalation.
				</Alert>
			{/if}

			<dl class="mt-4 space-y-2 text-sm">
				<div class="flex justify-between gap-4">
					<dt class="text-base-content/70">Hernia type</dt>
					<dd class="font-semibold">{result.herniaType || '—'}</dd>
				</div>
				<div class="flex justify-between gap-4">
					<dt class="text-base-content/70">EHS classification</dt>
					<dd class="font-semibold">{result.ehsClassification || '—'}</dd>
				</div>
				<div class="flex justify-between gap-4">
					<dt class="text-base-content/70">Reducibility</dt>
					<dd class="font-semibold">{result.reducibilityStatus || '—'}</dd>
				</div>
				<div class="flex justify-between gap-4 border-t border-base-300 pt-2">
					<dt class="text-base-content/70">Urgency</dt>
					<dd class="font-semibold">{URGENCY_LABELS[result.finalUrgency]}</dd>
				</div>
				<div class="flex justify-between gap-4">
					<dt class="text-base-content/70">Recommendation</dt>
					<dd class="font-semibold">{RECOMMENDATION_LABELS[result.recommendation]}</dd>
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
