<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { validateEuGeneral } from '$lib/engine/eu-general-validator';
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
	import Step4Airway from '$lib/components/steps/Step4Airway.svelte';
	import Step5Breathing from '$lib/components/steps/Step5Breathing.svelte';
	import Step6Circulation from '$lib/components/steps/Step6Circulation.svelte';
	import Step7Disability from '$lib/components/steps/Step7Disability.svelte';
	import Step8HistoryOfPresentIllness from '$lib/components/steps/Step8HistoryOfPresentIllness.svelte';
	import Step9ReviewOfSystems from '$lib/components/steps/Step9ReviewOfSystems.svelte';
	import Step10PastMedicalHistory from '$lib/components/steps/Step10PastMedicalHistory.svelte';
	import Step11PhysicalExam from '$lib/components/steps/Step11PhysicalExam.svelte';
	import Step12Diagnostics from '$lib/components/steps/Step12Diagnostics.svelte';
	import Step13AdditionalInterventions from '$lib/components/steps/Step13AdditionalInterventions.svelte';
	import Step14AssessmentAndPlan from '$lib/components/steps/Step14AssessmentAndPlan.svelte';
	import Step15Reassessment from '$lib/components/steps/Step15Reassessment.svelte';
	import Step16Disposition from '$lib/components/steps/Step16Disposition.svelte';

	const title = 'WHO Emergency Unit Form: General';
	const subtitle =
		'Non-trauma emergency unit encounter from arrival through disposition.';

	const stepTitles = [
		'Registration',
		'Complaint',
		'High-risk',
		'Airway',
		'Breathing',
		'Circulation',
		'Disability',
		'HPI',
		'ROS',
		'PMH',
		'Exam',
		'Dx',
		'Interventions',
		'Plan',
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
		assessment.validation = validateEuGeneral(assessment.data);
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
			This single-page form documents a non-trauma emergency unit encounter from
			arrival through disposition: registration, vitals, ABCD primary survey, history,
			review of systems, past medical history, physical exam, diagnostics, interventions,
			assessment and plan, reassessment, and final disposition. Submit when complete to see
			a completeness summary and any flagged clinical issues.
		</Alert>
	</div>

	<Form label={title} onsubmit={submitForm}>
		<div id="form-sections">
			<div class="step-section"><Step1PatientRegistration /></div>
			<div class="step-section"><Step2ChiefComplaintAndVitals /></div>
			<div class="step-section"><Step3HighRiskSigns /></div>
			<div class="step-section"><Step4Airway /></div>
			<div class="step-section"><Step5Breathing /></div>
			<div class="step-section"><Step6Circulation /></div>
			<div class="step-section"><Step7Disability /></div>
			<div class="step-section"><Step8HistoryOfPresentIllness /></div>
			<div class="step-section"><Step9ReviewOfSystems /></div>
			<div class="step-section"><Step10PastMedicalHistory /></div>
			<div class="step-section"><Step11PhysicalExam /></div>
			<div class="step-section"><Step12Diagnostics /></div>
			<div class="step-section"><Step13AdditionalInterventions /></div>
			<div class="step-section"><Step14AssessmentAndPlan /></div>
			<div class="step-section"><Step15Reassessment /></div>
			<div class="step-section"><Step16Disposition /></div>
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
