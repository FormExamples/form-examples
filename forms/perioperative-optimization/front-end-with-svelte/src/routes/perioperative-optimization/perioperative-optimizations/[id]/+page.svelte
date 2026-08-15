<script lang="ts">
	// The optimisation wizard: one continuous single page holding all sixteen
	// steps in document order. The live panel keeps the weeks remaining and the
	// per-domain statuses visible throughout, because the time available is the
	// number the whole assessment turns on.
	import { page } from '$app/state';
	import Alert from '#lib/components/ui/Alert.svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import ErrorSummary from '#lib/components/ui/ErrorSummary.svelte';
	import Form from '#lib/components/ui/Form.svelte';
	import Panel from '#lib/components/ui/Panel.svelte';
	import Progress from '#lib/components/ui/Progress.svelte';
	import StepList from '#lib/components/ui/StepList.svelte';
	import StepListItem from '#lib/components/ui/StepListItem.svelte';

	import Step1AssessmentContext from '#lib/components/steps/Step1AssessmentContext.svelte';
	import Step2PatientAndProcedure from '#lib/components/steps/Step2PatientAndProcedure.svelte';
	import Step3MedicalHistory from '#lib/components/steps/Step3MedicalHistory.svelte';
	import Step4Medications from '#lib/components/steps/Step4Medications.svelte';
	import Step5Allergies from '#lib/components/steps/Step5Allergies.svelte';
	import Step6AnaemiaAndIronStudies from '#lib/components/steps/Step6AnaemiaAndIronStudies.svelte';
	import Step7GlycaemicControl from '#lib/components/steps/Step7GlycaemicControl.svelte';
	import Step8Smoking from '#lib/components/steps/Step8Smoking.svelte';
	import Step9Alcohol from '#lib/components/steps/Step9Alcohol.svelte';
	import Step10NutritionalScreening from '#lib/components/steps/Step10NutritionalScreening.svelte';
	import Step11PhysicalFitness from '#lib/components/steps/Step11PhysicalFitness.svelte';
	import Step12FrailtyAndCognition from '#lib/components/steps/Step12FrailtyAndCognition.svelte';
	import Step13Cardiorespiratory from '#lib/components/steps/Step13Cardiorespiratory.svelte';
	import Step14ReadinessAndSupport from '#lib/components/steps/Step14ReadinessAndSupport.svelte';
	import Step15OptimisationPlan from '#lib/components/steps/Step15OptimisationPlan.svelte';
	import Step16SummaryAndSignOff from '#lib/components/steps/Step16SummaryAndSignOff.svelte';

	import { steps, TOTAL_STEPS } from '#lib/config/steps.js';
	import { DOMAIN_LABELS } from '#lib/engine/domain-rules.js';
	import { READINESS_LABELS, STATUS_LABELS } from '#lib/engine/labels.js';
	import { assessmentStore } from '#lib/stores/assessment.svelte.js';

	const id = $derived(page.params.id ?? 'new');

	$effect(() => {
		assessmentStore.load(id);
	});

	const d = assessmentStore.data;
	const result = $derived(assessmentStore.result);

	$effect(() => {
		JSON.stringify(assessmentStore.data);
		assessmentStore.save();
	});

	// A representative field per step drives the completion indicator.
	const stepAnswered = $derived([
		Boolean(d.assessment.clinicianName),
		Boolean(d.procedure.plannedProcedure),
		Boolean(d.history.conditionCardiac),
		Boolean(d.medication.takesPrescriptionMedicines),
		Boolean(d.allergy.hasDrugAllergy),
		d.anaemia.haemoglobinGPerL !== null,
		Boolean(d.glycaemic.diabetesType),
		Boolean(d.smoking.smokingStatus),
		d.alcohol.alcoholUnitsPerWeek !== null,
		d.nutrition.weightAsKg !== null,
		Boolean(d.fitness.usualActivityLevel),
		d.frailty.clinicalFrailtyScale !== null,
		d.cardioresp.systolicBp !== null,
		Boolean(d.social.anxietyLevel),
		Boolean(d.plan.responsibleClinician),
		Boolean(d.signoff.gateDecision)
	]);

	const answeredCount = $derived(stepAnswered.filter(Boolean).length);
	const percent = $derived(Math.round((answeredCount / TOTAL_STEPS) * 100));
	const firstUnfinished = $derived(stepAnswered.findIndex((a) => !a) + 1 || TOTAL_STEPS);

	const errors = $derived.by(() => {
		const list: Array<{ id: string; message: string }> = [];
		if (!d.assessment.clinicianName.trim()) {
			list.push({ id: 'assessment-clinicianName', message: 'Assessor name is required' });
		}
		if (!d.assessment.assessmentDate) {
			list.push({ id: 'assessment-assessmentDate', message: 'Assessment date is required' });
		}
		if (!d.patient.firstName.trim() && !d.patient.lastName.trim()) {
			list.push({ id: 'patient-firstName', message: 'A patient name is required' });
		}
		if (!d.procedure.plannedProcedure.trim()) {
			list.push({ id: 'procedure-plannedProcedure', message: 'The planned procedure is required' });
		}
		if (!d.signoff.gateDecision) {
			list.push({ id: 'signoff-gateDecision', message: 'A gate decision is required' });
		}
		if (!d.signoff.signedByName.trim()) {
			list.push({ id: 'signoff-signedByName', message: 'A signature is required' });
		}
		// An override without a reason is not auditable.
		if (
			d.signoff.overrideReadiness &&
			d.signoff.overrideReadiness !== result.computedReadiness &&
			!d.signoff.overrideReason.trim()
		) {
			list.push({
				id: 'signoff-overrideReason',
				message: 'An override reason is required when the final band differs from the computed band'
			});
		}
		// Proceeding against a computed deferral is the hazard the form exists to
		// prevent; the team must choose deferral or record accepting the risk.
		if (
			result.computedReadiness === 'defer-surgery' &&
			['proceed', 'proceed-with-prehabilitation'].includes(d.signoff.gateDecision)
		) {
			list.push({
				id: 'signoff-gateDecision',
				message:
					'The computed band is "Defer surgery". Choose "Defer and optimise", or record "Accept unoptimised risk" explicitly'
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
		await goto(`/perioperative-optimization/perioperative-optimizations/${id}/report`);
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
	<title>Perioperative Optimization — assessment</title>
</svelte:head>

<main class="mx-16 px-4 py-8">
	<h1 class="text-2xl font-bold text-base-content">Perioperative Optimization</h1>
	<p class="mt-2 max-w-3xl text-sm text-base-content/70">
		Sixteen steps on one continuous page. Each of the eight optimisation domains is graded against
		the weeks remaining before surgery, so a finding becomes a decision. The draft is saved to this
		browser as you work.
	</p>

	<div class="mt-6">
		<Progress value={percent} max={100} label="Assessment completion" />
		<p class="mt-1 text-sm text-base-content/70" aria-live="polite">
			{answeredCount} of {TOTAL_STEPS} steps started ({percent}%)
		</p>
	</div>

	<StepList label="Perioperative optimisation steps" current={firstUnfinished - 1} class="mt-4">
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
		<Form label="Perioperative optimisation assessment" onsubmit={(e: Event) => e.preventDefault()}>
			{#if showErrors && errors.length > 0}
				<ErrorSummary title="Please correct the following">
					<ul>
						{#each errors as error (error.id + error.message)}
							<li><a href="#{error.id}">{error.message}</a></li>
						{/each}
					</ul>
				</ErrorSummary>
			{/if}

			<div id="step-1"><Step1AssessmentContext /></div>
			<div id="step-2"><Step2PatientAndProcedure /></div>
			<div id="step-3"><Step3MedicalHistory /></div>
			<div id="step-4"><Step4Medications /></div>
			<div id="step-5"><Step5Allergies /></div>
			<div id="step-6"><Step6AnaemiaAndIronStudies /></div>
			<div id="step-7"><Step7GlycaemicControl /></div>
			<div id="step-8"><Step8Smoking /></div>
			<div id="step-9"><Step9Alcohol /></div>
			<div id="step-10"><Step10NutritionalScreening /></div>
			<div id="step-11"><Step11PhysicalFitness /></div>
			<div id="step-12"><Step12FrailtyAndCognition /></div>
			<div id="step-13"><Step13Cardiorespiratory /></div>
			<div id="step-14"><Step14ReadinessAndSupport /></div>
			<div id="step-15"><Step15OptimisationPlan /></div>
			<div id="step-16"><Step16SummaryAndSignOff /></div>

			<div class="button-group mt-6 flex gap-2">
				<Button data-variant="primary" type="button" onclick={submit}>Submit and view report</Button>
				<Button data-variant="secondary" type="button" onclick={startOver}>Start over</Button>
			</div>
		</Form>

		<Panel label="Live optimisation status" class="lg:sticky lg:top-4">
			<h2 class="text-lg font-semibold">Live status</h2>

			<p class="mt-1 text-sm text-base-content/70">
				{#if result.gatingApplied}
					<strong>{result.weeksToSurgery}</strong>
					week{result.weeksToSurgery === 1 ? '' : 's'} to surgery
				{:else}
					No surgery date — gating not applied
				{/if}
			</p>

			<p class="mt-2">
				<strong>{READINESS_LABELS[result.finalReadiness]}</strong>
			</p>

			{#if result.recommendedEarliestSurgeryDate}
				<Alert type="warning" class="mt-3">
					Earliest date at which every domain would have its full lead time:
					<strong>{result.recommendedEarliestSurgeryDate}</strong>.
				</Alert>
			{/if}

			<h3 class="mt-4 text-sm font-semibold">Domains</h3>
			<ul class="mt-2 space-y-1 text-sm">
				{#each result.domains as domainResult (domainResult.domain)}
					<li class="flex justify-between gap-2">
						<span class="text-base-content/70">{DOMAIN_LABELS[domainResult.domain]}</span>
						<span class="font-semibold whitespace-nowrap">
							{STATUS_LABELS[domainResult.status]}
							{#if domainResult.weeksShortfall !== null}
								({domainResult.weeksShortfall} w short)
							{/if}
						</span>
					</li>
				{/each}
			</ul>

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
