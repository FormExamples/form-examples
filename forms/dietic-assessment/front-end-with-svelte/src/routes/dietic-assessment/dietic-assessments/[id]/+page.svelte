<script lang="ts">
	// The dietetic assessment wizard: one continuous single page holding all
	// sixteen steps in document order. The step list at the top is a table of
	// contents with completion status, not a pager — the monorepo rule is a
	// single-page wizard, so nothing is hidden behind navigation.
	import { page } from '$app/state';
	import Alert from '$lib/components/ui/Alert.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import ErrorSummary from '$lib/components/ui/ErrorSummary.svelte';
	import Form from '$lib/components/ui/Form.svelte';
	import Panel from '$lib/components/ui/Panel.svelte';
	import Progress from '$lib/components/ui/Progress.svelte';
	import StepList from '$lib/components/ui/StepList.svelte';
	import StepListItem from '$lib/components/ui/StepListItem.svelte';

	import Step1DietitianIdentification from '$lib/components/steps/Step1DietitianIdentification.svelte';
	import Step2PatientIdentification from '$lib/components/steps/Step2PatientIdentification.svelte';
	import Step3MedicalHistory from '$lib/components/steps/Step3MedicalHistory.svelte';
	import Step4MedicationAndSupplements from '$lib/components/steps/Step4MedicationAndSupplements.svelte';
	import Step5Anthropometry from '$lib/components/steps/Step5Anthropometry.svelte';
	import Step6Biochemistry from '$lib/components/steps/Step6Biochemistry.svelte';
	import Step7PhysicalExamination from '$lib/components/steps/Step7PhysicalExamination.svelte';
	import Step8DietaryRecall from '$lib/components/steps/Step8DietaryRecall.svelte';
	import Step9FluidsAndHydration from '$lib/components/steps/Step9FluidsAndHydration.svelte';
	import Step10PreferencesAndAllergies from '$lib/components/steps/Step10PreferencesAndAllergies.svelte';
	import Step11GastrointestinalAndSwallowing from '$lib/components/steps/Step11GastrointestinalAndSwallowing.svelte';
	import Step12LifestyleAndEnvironment from '$lib/components/steps/Step12LifestyleAndEnvironment.svelte';
	import Step13ActivityAndFunction from '$lib/components/steps/Step13ActivityAndFunction.svelte';
	import Step14ReadinessToChange from '$lib/components/steps/Step14ReadinessToChange.svelte';
	import Step15ScreeningAndDiagnosis from '$lib/components/steps/Step15ScreeningAndDiagnosis.svelte';
	import Step16CarePlanAndSignOff from '$lib/components/steps/Step16CarePlanAndSignOff.svelte';

	import { steps, TOTAL_STEPS } from '$lib/config/steps';
	import { COMPOSITE_RISK_LABELS, MUST_RISK_LABELS, RECOMMENDATION_LABELS } from '$lib/engine/grader';
	import { assessmentStore } from '$lib/stores/assessment.svelte';

	const id = $derived(page.params.id ?? 'new');

	$effect(() => {
		assessmentStore.load(id);
	});

	const d = assessmentStore.data;
	const result = $derived(assessmentStore.result);

	// Persist on every change so a partly-filled assessment survives a reload —
	// an initial appointment runs 45 to 60 minutes.
	$effect(() => {
		JSON.stringify(assessmentStore.data);
		assessmentStore.save();
	});

	// A representative field per step drives the completion indicator.
	const stepAnswered = $derived([
		Boolean(d.dietitian.dietitianName),
		Boolean(d.patient.firstName || d.patient.lastName),
		Boolean(d.history.conditionDiabetes),
		Boolean(d.medication.takesPrescriptionMedicines),
		Boolean(d.anthropometry.measurementMethod),
		Boolean(d.biochemistry.bloodsSampleDate),
		Boolean(d.physicalExam.muscleWastingSeverity),
		Boolean(d.dietaryRecall.appetite),
		d.hydration.fluidIntakeMlPerDay !== null,
		Boolean(d.preferences.hasFoodAllergy),
		Boolean(d.gastrointestinal.appetiteChange),
		Boolean(d.environment.livingSituation),
		Boolean(d.activity.activityLevel),
		Boolean(d.behavioural.stageOfChange),
		Boolean(d.screening.acutelyIll),
		Boolean(d.plan.interventionType)
	]);

	// True once there is anything to compute an anthropometric score from.
	const anthropometryStarted = $derived(
		Boolean(d.anthropometry.measurementMethod) ||
			d.anthropometry.weightAsKg !== null ||
			d.anthropometry.midUpperArmCircumferenceAsCm !== null ||
			d.anthropometry.usualWeightAsKg !== null
	);

	const answeredCount = $derived(stepAnswered.filter(Boolean).length);
	const percent = $derived(Math.round((answeredCount / TOTAL_STEPS) * 100));
	const firstUnfinished = $derived(stepAnswered.findIndex((a) => !a) + 1 || TOTAL_STEPS);

	const errors = $derived.by(() => {
		const list: Array<{ id: string; message: string }> = [];
		if (!d.dietitian.dietitianName.trim()) {
			list.push({ id: 'dietitian-dietitianName', message: 'Dietitian name is required' });
		}
		if (!d.dietitian.assessmentDate) {
			list.push({ id: 'dietitian-assessmentDate', message: 'Assessment date is required' });
		}
		if (!d.patient.firstName.trim() && !d.patient.lastName.trim()) {
			list.push({ id: 'patient-firstName', message: 'A patient name is required' });
		}
		if (!d.plan.signedByName.trim()) {
			list.push({
				id: 'plan-signedByName',
				message: 'A registered dietitian must sign before the report is final'
			});
		}
		// An override without a reason is not auditable, so it is an error.
		if (
			d.plan.overrideCompositeRisk &&
			d.plan.overrideCompositeRisk !== result.computedCompositeRisk &&
			!d.plan.overrideReason.trim()
		) {
			list.push({
				id: 'plan-overrideReason',
				message: 'An override reason is required when the final risk differs from the computed risk'
			});
		}
		return list;
	});

	let showErrors = $state(false);

	function submit() {
		showErrors = true;
		if (errors.length > 0) return;
		assessmentStore.submitted = true;
		void goToReport();
	}

	async function goToReport() {
		const { goto } = await import('$app/navigation');
		await goto(`/dietic-assessment/dietic-assessments/${id}/report`);
	}

	function startOver() {
		if (!confirm('Clear all answers and start a fresh assessment?')) return;
		assessmentStore.reset();
		showErrors = false;
	}

	function scrollToStep(n: number) {
		document.getElementById(`step-${n}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}
</script>

<svelte:head>
	<title>Dietetic Assessment — assessment form</title>
</svelte:head>

<main class="mx-16 px-4 py-8">
	<h1 class="text-2xl font-bold text-base-content">Dietetic Assessment</h1>
	<p class="mt-2 max-w-3xl text-sm text-base-content/70">
		Sixteen steps on one continuous page. The draft is saved to this browser as you work. Being
		weighed distresses some patients: step 5 accepts a declined weight and estimates the MUST body
		mass index component from mid-upper-arm circumference instead.
	</p>

	<div class="mt-6">
		<Progress value={percent} max={100} label="Assessment completion" />
		<p class="mt-1 text-sm text-base-content/70" aria-live="polite">
			{answeredCount} of {TOTAL_STEPS} steps started ({percent}%)
		</p>
	</div>

	<StepList label="Dietetic assessment steps" current={firstUnfinished - 1} class="mt-4">
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
		<Form label="Dietetic assessment" onsubmit={(e: Event) => e.preventDefault()}>
			{#if showErrors && errors.length > 0}
				<ErrorSummary title="Please correct the following">
					<ul>
						{#each errors as error (error.id)}
							<li><a href="#{error.id}">{error.message}</a></li>
						{/each}
					</ul>
				</ErrorSummary>
			{/if}

			<div id="step-1"><Step1DietitianIdentification /></div>
			<div id="step-2"><Step2PatientIdentification /></div>
			<div id="step-3"><Step3MedicalHistory /></div>
			<div id="step-4"><Step4MedicationAndSupplements /></div>
			<div id="step-5"><Step5Anthropometry /></div>
			<div id="step-6"><Step6Biochemistry /></div>
			<div id="step-7"><Step7PhysicalExamination /></div>
			<div id="step-8"><Step8DietaryRecall /></div>
			<div id="step-9"><Step9FluidsAndHydration /></div>
			<div id="step-10"><Step10PreferencesAndAllergies /></div>
			<div id="step-11"><Step11GastrointestinalAndSwallowing /></div>
			<div id="step-12"><Step12LifestyleAndEnvironment /></div>
			<div id="step-13"><Step13ActivityAndFunction /></div>
			<div id="step-14"><Step14ReadinessToChange /></div>
			<div id="step-15"><Step15ScreeningAndDiagnosis /></div>
			<div id="step-16"><Step16CarePlanAndSignOff /></div>

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

			<!-- Only warn once the dietitian has entered something to estimate from,
			     so a blank form does not open with a caveat. -->
			{#if result.mustIsEstimated && anthropometryStarted}
				<Alert type="info" class="mt-3">
					This MUST score is an estimate — one or more components was derived from mid-upper-arm
					circumference, the subjective weight-loss criterion, or an adjusted weight.
				</Alert>
			{/if}

			<dl class="mt-4 space-y-2 text-sm">
				<div class="flex justify-between gap-4">
					<dt class="text-base-content/70">MUST</dt>
					<dd class="font-semibold">{result.mustScore} / 6 — {MUST_RISK_LABELS[result.mustRisk]}</dd>
				</div>
				<div class="flex justify-between gap-4">
					<dt class="text-base-content/70">Body mass index</dt>
					<dd class="font-semibold">{result.bmi === null ? '—' : `${result.bmi} kg/m²`}</dd>
				</div>
				<div class="flex justify-between gap-4">
					<dt class="text-base-content/70">Unplanned weight loss</dt>
					<dd class="font-semibold">
						{result.weightLossPercent === null ? '—' : `${result.weightLossPercent}%`}
					</dd>
				</div>
				<div class="flex justify-between gap-4">
					<dt class="text-base-content/70">GLIM</dt>
					<dd class="font-semibold">{result.glimDiagnosis}</dd>
				</div>
				<div class="flex justify-between gap-4">
					<dt class="text-base-content/70">Refeeding risk</dt>
					<dd class="font-semibold">{result.refeedingRisk}</dd>
				</div>
				<div class="flex justify-between gap-4">
					<dt class="text-base-content/70">SARC-F</dt>
					<dd class="font-semibold">{result.sarcfScore === null ? '—' : `${result.sarcfScore} / 10`}</dd>
				</div>
				<div class="flex justify-between gap-4">
					<dt class="text-base-content/70">SCOFF</dt>
					<dd class="font-semibold">{result.scoffScore === null ? '—' : `${result.scoffScore} / 5`}</dd>
				</div>
				<div class="flex justify-between gap-4 border-t border-base-300 pt-2">
					<dt class="text-base-content/70">Composite risk</dt>
					<dd class="font-semibold">{COMPOSITE_RISK_LABELS[result.finalCompositeRisk]}</dd>
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
