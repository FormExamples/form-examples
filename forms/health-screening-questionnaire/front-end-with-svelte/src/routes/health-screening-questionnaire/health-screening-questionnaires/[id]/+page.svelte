<script lang="ts">
	// The health screening questionnaire wizard: one continuous single page
	// holding all fourteen steps in document order. The step list at the top is
	// a table of contents with completion status, not a pager — the monorepo
	// rule is a single-page wizard, so nothing is hidden behind navigation.
	// Step 10 (occupational factors) is rendered only when step 1's
	// screeningPurpose is occupational-pre-placement.
	import { page } from '$app/state';
	import Alert from '$lib/components/ui/Alert.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import ErrorSummary from '$lib/components/ui/ErrorSummary.svelte';
	import Form from '$lib/components/ui/Form.svelte';
	import Panel from '$lib/components/ui/Panel.svelte';
	import Progress from '$lib/components/ui/Progress.svelte';
	import StepList from '$lib/components/ui/StepList.svelte';
	import StepListItem from '$lib/components/ui/StepListItem.svelte';

	import Step1AssessmentContext from '$lib/components/steps/Step1AssessmentContext.svelte';
	import Step2PersonalDetails from '$lib/components/steps/Step2PersonalDetails.svelte';
	import Step3ActivityAndDiet from '$lib/components/steps/Step3ActivityAndDiet.svelte';
	import Step4SmokingAndAlcohol from '$lib/components/steps/Step4SmokingAndAlcohol.svelte';
	import Step5MedicalHistory from '$lib/components/steps/Step5MedicalHistory.svelte';
	import Step6FamilyHistory from '$lib/components/steps/Step6FamilyHistory.svelte';
	import Step7SymptomReview from '$lib/components/steps/Step7SymptomReview.svelte';
	import Step8ParqPlus from '$lib/components/steps/Step8ParqPlus.svelte';
	import Step9VitalSigns from '$lib/components/steps/Step9VitalSigns.svelte';
	import Step10Occupational from '$lib/components/steps/Step10Occupational.svelte';
	import Step11Wellbeing from '$lib/components/steps/Step11Wellbeing.svelte';
	import Step12Vaccination from '$lib/components/steps/Step12Vaccination.svelte';
	import Step13Consent from '$lib/components/steps/Step13Consent.svelte';
	import Step14Summary from '$lib/components/steps/Step14Summary.svelte';

	import { steps, TOTAL_STEPS } from '$lib/config/steps';
	import { RECOMMENDATION_LABELS, RISK_BAND_LABELS } from '$lib/engine/grader';
	import { questionnaireStore } from '$lib/stores/questionnaire.svelte';

	const id = $derived(page.params.id ?? 'new');

	$effect(() => {
		questionnaireStore.load(id);
	});

	const d = questionnaireStore.data;
	const result = $derived(questionnaireStore.result);

	// Persist on every change so a partly-filled questionnaire survives a reload.
	$effect(() => {
		JSON.stringify(questionnaireStore.data);
		questionnaireStore.save();
	});

	const occupationalStepShown = $derived(d.context.screeningPurpose === 'occupational-pre-placement');
	const activeStepCount = $derived(occupationalStepShown ? TOTAL_STEPS : TOTAL_STEPS - 1);

	// A representative field per step drives the completion indicator.
	const stepAnswered = $derived(
		[
			Boolean(d.context.screeningPurpose),
			Boolean(d.patient.name),
			Boolean(d.activityDiet.usualActivityLevel),
			d.smokingAlcohol.auditCFrequency !== null,
			Boolean(d.medicalHistory.conditionDiabetes),
			Boolean(d.familyHistory.familyHistoryPrematureCardiacEvent),
			Boolean(d.symptoms.symptomPalpitations),
			Boolean(d.parq.parqDiagnosedHeartCondition),
			d.vitals.heightAsCm !== null || d.vitals.weightAsKg !== null,
			occupationalStepShown ? Boolean(d.occupational.jobRole) : null,
			d.wellbeing.stressLevel !== null,
			Boolean(d.vaccination.vaccinationUpToDate),
			Boolean(d.consent.consentToScreening),
			Boolean(d.summary.signedByName)
		].filter((v): v is boolean => v !== null)
	);

	const answeredCount = $derived(stepAnswered.filter(Boolean).length);
	const percent = $derived(Math.round((answeredCount / activeStepCount) * 100));
	const firstUnfinished = $derived(stepAnswered.findIndex((a) => !a) + 1 || activeStepCount);

	const visibleSteps = $derived(occupationalStepShown ? steps : steps.filter((s) => s.number !== 10));

	const errors = $derived.by(() => {
		const list: Array<{ id: string; message: string }> = [];
		if (!d.context.screeningPurpose) {
			list.push({ id: 'context-screeningPurpose', message: 'Screening purpose is required' });
		}
		if (!d.assessor.name.trim()) {
			list.push({ id: 'assessor-name', message: 'Assessor name is required' });
		}
		if (!d.context.assessmentDate) {
			list.push({ id: 'context-assessmentDate', message: 'Assessment date is required' });
		}
		if (!d.patient.name.trim()) {
			list.push({ id: 'patient-name', message: 'A name for the person being screened is required' });
		}
		if (!d.consent.consentToScreening) {
			list.push({ id: 'consent-consentToScreening', message: 'Consent to screening is required' });
		}
		if (!d.summary.signedByName.trim()) {
			list.push({
				id: 'summary-signedByName',
				message: 'The assessor must sign before the report is final'
			});
		}
		// An override without a reason is not auditable, so it is an error.
		if (
			d.summary.overrideRiskBand &&
			d.summary.overrideRiskBand !== result.computedRiskBand &&
			!d.summary.overrideReason.trim()
		) {
			list.push({
				id: 'summary-overrideReason',
				message: 'An override reason is required when the final risk band differs from the computed value'
			});
		}
		return list;
	});

	let showErrors = $state(false);

	function submit() {
		showErrors = true;
		if (errors.length > 0) return;
		questionnaireStore.submitted = true;
		void goToReport();
	}

	async function goToReport() {
		const { goto } = await import('$app/navigation');
		await goto(`/health-screening-questionnaire/health-screening-questionnaires/${id}/report`);
	}

	function startOver() {
		if (!confirm('Clear all answers and start a fresh screening?')) return;
		questionnaireStore.reset();
		showErrors = false;
	}

	function scrollToStep(n: number) {
		document.getElementById(`step-${n}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}
</script>

<svelte:head>
	<title>Health Screening Questionnaire — screening form</title>
</svelte:head>

<main class="mx-16 px-4 py-8">
	<h1 class="text-2xl font-bold text-base-content">Health Screening Questionnaire</h1>
	<p class="mt-2 max-w-3xl text-sm text-base-content/70">
		Fourteen steps on one continuous page. The draft is saved to this browser as you work. Step 10
		(occupational factors) only appears when the screening purpose is occupational pre-placement.
	</p>

	<div class="mt-6">
		<Progress value={percent} max={100} label="Screening completion" />
		<p class="mt-1 text-sm text-base-content/70" aria-live="polite">
			{answeredCount} of {activeStepCount} steps started ({percent}%)
		</p>
	</div>

	<StepList label="Health screening questionnaire steps" current={firstUnfinished - 1} class="mt-4">
		{#each visibleSteps as step (step.number)}
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
		<Form label="Health screening questionnaire" onsubmit={(e: Event) => e.preventDefault()}>
			{#if showErrors && errors.length > 0}
				<ErrorSummary title="Please correct the following">
					<ul>
						{#each errors as error (error.id)}
							<li><a href="#{error.id}">{error.message}</a></li>
						{/each}
					</ul>
				</ErrorSummary>
			{/if}

			<div id="step-1"><Step1AssessmentContext /></div>
			<div id="step-2"><Step2PersonalDetails /></div>
			<div id="step-3"><Step3ActivityAndDiet /></div>
			<div id="step-4"><Step4SmokingAndAlcohol /></div>
			<div id="step-5"><Step5MedicalHistory /></div>
			<div id="step-6"><Step6FamilyHistory /></div>
			<div id="step-7"><Step7SymptomReview /></div>
			<div id="step-8"><Step8ParqPlus /></div>
			<div id="step-9"><Step9VitalSigns /></div>
			{#if occupationalStepShown}
				<div id="step-10"><Step10Occupational /></div>
			{/if}
			<div id="step-11"><Step11Wellbeing /></div>
			<div id="step-12"><Step12Vaccination /></div>
			<div id="step-13"><Step13Consent /></div>
			<div id="step-14"><Step14Summary /></div>

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

			{#if result.flags.some((f) => f.priority === 'high')}
				<Alert type="warning" class="mt-3">
					A high-priority safety flag has been raised. Review the flags below before submitting.
				</Alert>
			{/if}

			<dl class="mt-4 space-y-2 text-sm">
				<div class="flex justify-between gap-4">
					<dt class="text-base-content/70">PAR-Q+ clearance</dt>
					<dd class="font-semibold">{result.parqPlusClearance || '—'}</dd>
				</div>
				<div class="flex justify-between gap-4">
					<dt class="text-base-content/70">AUDIT-C</dt>
					<dd class="font-semibold">
						{result.auditCScore === null ? '—' : `${result.auditCScore} / 12`}
					</dd>
				</div>
				<div class="flex justify-between gap-4">
					<dt class="text-base-content/70">Body mass index</dt>
					<dd class="font-semibold">{result.bodyMassIndex === null ? '—' : `${result.bodyMassIndex} kg/m²`}</dd>
				</div>
				<div class="flex justify-between gap-4 border-t border-base-300 pt-2">
					<dt class="text-base-content/70">Risk band</dt>
					<dd class="font-semibold">
						{result.isPaediatric ? 'Paediatric — not scored' : RISK_BAND_LABELS[result.finalRiskBand || 'low']}
					</dd>
				</div>
				<div class="flex justify-between gap-4">
					<dt class="text-base-content/70">Recommendation</dt>
					<dd class="font-semibold">{RECOMMENDATION_LABELS[result.finalRecommendation || 'clear-to-proceed']}</dd>
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
