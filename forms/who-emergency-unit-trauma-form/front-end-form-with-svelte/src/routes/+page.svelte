<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { validateEuTrauma } from '$lib/engine/eu-trauma-validator';
	import { detectFlaggedIssues } from '$lib/engine/flagged-issues';

	// Lily Svelte headless contract — local shape-equivalent components.
	import Form from '$lib/components/ui/Form.svelte';
	import Panel from '$lib/components/ui/Panel.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Progress from '$lib/components/ui/Progress.svelte';
	import StepList from '$lib/components/ui/StepList.svelte';
	import StepListItem from '$lib/components/ui/StepListItem.svelte';

	import Step1PatientRegistration from '$lib/components/steps/Step1PatientRegistration.svelte';
	import Step2ChiefComplaintAndVitals from '$lib/components/steps/Step2ChiefComplaintAndVitals.svelte';
	import Step3HighRiskSigns from '$lib/components/steps/Step3HighRiskSigns.svelte';
	import Step4Triage from '$lib/components/steps/Step4Triage.svelte';
	import Step5Airway from '$lib/components/steps/Step5Airway.svelte';
	import Step6Breathing from '$lib/components/steps/Step6Breathing.svelte';
	import Step7Circulation from '$lib/components/steps/Step7Circulation.svelte';
	import Step8Disability from '$lib/components/steps/Step8Disability.svelte';
	import Step9ExposureAndFast from '$lib/components/steps/Step9ExposureAndFast.svelte';
	import Step10InjuryHistory from '$lib/components/steps/Step10InjuryHistory.svelte';
	import Step11PastHistories from '$lib/components/steps/Step11PastHistories.svelte';
	import Step12PhysicalExam from '$lib/components/steps/Step12PhysicalExam.svelte';
	import Step13AssessmentAndPlan from '$lib/components/steps/Step13AssessmentAndPlan.svelte';
	import Step14Diagnostics from '$lib/components/steps/Step14Diagnostics.svelte';
	import Step15MedicationsAndProcedures from '$lib/components/steps/Step15MedicationsAndProcedures.svelte';
	import Step16Reassessment from '$lib/components/steps/Step16Reassessment.svelte';
	import Step17Disposition from '$lib/components/steps/Step17Disposition.svelte';

	const title = 'WHO Emergency Unit Form: Trauma';
	const subtitle =
		'Trauma encounter from arrival through disposition, with FAST + ABCDE.';

	const stepTitles = [
		'Registration',
		'Complaint',
		'High-risk',
		'Triage',
		'Airway',
		'Breathing',
		'Circulation',
		'Disability',
		'Exposure',
		'Injury',
		'PMH',
		'Exam',
		'Plan',
		'Dx',
		'Meds',
		'Reassess',
		'Disposition'
	];

	let submitted = $state(false);
	const percentComplete = $derived(
		assessment.validation
			? Math.round(
				(assessment.validation.totalSatisfied /
					Math.max(1, assessment.validation.totalRequired)) *
					100
			)
			: 0
	);

	function submitForm(e?: SubmitEvent) {
		if (e) e.preventDefault?.();
		assessment.validation = validateEuTrauma(assessment.data);
		assessment.flags = detectFlaggedIssues(assessment.data);
		submitted = true;
		if (typeof window !== 'undefined') {
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	}

	function startOver() {
		assessment.reset();
		submitted = false;
	}
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<a class="skip-link visually-hidden" href="#form-sections">Skip to questionnaire</a>

<header class="page-header no-print">
	<div class="page-header-inner">
		<h1>{title}</h1>
		<p class="subtitle">{subtitle}</p>

		<Progress label="Form completion" max={100} value={percentComplete} />
		<p class="subtitle" aria-live="polite">{percentComplete}% complete</p>

		<StepList label={`${title} steps`}>
			{#each stepTitles as t, i (i)}
				<StepListItem status={submitted ? 'finished' : 'waiting'}>
					{t}
				</StepListItem>
			{/each}
		</StepList>
	</div>
</header>

<main>
	<div class="intro">
		<Alert type="info">
			This single-page form documents an emergency unit trauma encounter from
			arrival through disposition: registration, vitals, high-risk signs and trauma
			indicators, triage, ABCDE primary survey with FAST ultrasound, injury history,
			past histories, physical exam, assessment and plan, diagnostics, medications and
			procedures, reassessment, and final disposition. Submit when complete to see a
			completeness summary and any flagged clinical issues.
		</Alert>
	</div>

	<Form label={title} onsubmit={submitForm}>
		<div id="form-sections">
			<div class="step-section"><Step1PatientRegistration /></div>
			<div class="step-section"><Step2ChiefComplaintAndVitals /></div>
			<div class="step-section"><Step3HighRiskSigns /></div>
			<div class="step-section"><Step4Triage /></div>
			<div class="step-section"><Step5Airway /></div>
			<div class="step-section"><Step6Breathing /></div>
			<div class="step-section"><Step7Circulation /></div>
			<div class="step-section"><Step8Disability /></div>
			<div class="step-section"><Step9ExposureAndFast /></div>
			<div class="step-section"><Step10InjuryHistory /></div>
			<div class="step-section"><Step11PastHistories /></div>
			<div class="step-section"><Step12PhysicalExam /></div>
			<div class="step-section"><Step13AssessmentAndPlan /></div>
			<div class="step-section"><Step14Diagnostics /></div>
			<div class="step-section"><Step15MedicationsAndProcedures /></div>
			<div class="step-section"><Step16Reassessment /></div>
			<div class="step-section"><Step17Disposition /></div>
		</div>

		<div class="button-group">
			<Button type="submit" data-variant="primary">Submit form</Button>
			<Button type="button" data-variant="secondary" onclick={startOver}>Start over</Button>
		</div>
	</Form>

	<Panel label="Submission summary" aria-live="polite">
		{#if !submitted || !assessment.validation}
			<p class="empty-message">Submit the form to see the completeness summary and flagged issues.</p>
		{:else}
			<h2>Submission summary</h2>
			<p>
				{assessment.validation.totalSatisfied} of
				{assessment.validation.totalRequired} required fields completed.
			</p>
			{#if assessment.validation.complete}
				<Alert type="success">The encounter record is complete.</Alert>
			{:else}
				<Alert type="warning" heading="The encounter record is incomplete">
					<ul>
						{#each assessment.validation.missing as miss (miss.id)}
							<li><strong>{miss.id}</strong> — {miss.description}</li>
						{/each}
					</ul>
				</Alert>
			{/if}

			{#if assessment.flags.length > 0}
				<h3>Flagged issues for clinician review</h3>
				<ul>
					{#each assessment.flags as flag (flag.id)}
						<li>
							<strong>[{flag.priority}]</strong>
							{flag.category}: {flag.message}
						</li>
					{/each}
				</ul>
			{/if}
		{/if}
	</Panel>
</main>
