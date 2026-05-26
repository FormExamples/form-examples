<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { validateCounterReferral } from '$lib/engine/counter-referral-validator';
	import { detectFlaggedIssues } from '$lib/engine/flagged-issues';

	// Lily Svelte headless contract — local shape-equivalent components.
	import Form from '$lib/components/ui/Form.svelte';
	import Panel from '$lib/components/ui/Panel.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Progress from '$lib/components/ui/Progress.svelte';
	import StepList from '$lib/components/ui/StepList.svelte';
	import StepListItem from '$lib/components/ui/StepListItem.svelte';

	import Step1PatientIdentification from '$lib/components/steps/Step1PatientIdentification.svelte';
	import Step2FacilityDetails from '$lib/components/steps/Step2FacilityDetails.svelte';
	import Step3Situation from '$lib/components/steps/Step3Situation.svelte';
	import Step4Background from '$lib/components/steps/Step4Background.svelte';
	import Step5Assessment from '$lib/components/steps/Step5Assessment.svelte';
	import Step6Recommendations from '$lib/components/steps/Step6Recommendations.svelte';
	import Step7ProviderSignoff from '$lib/components/steps/Step7ProviderSignoff.svelte';

	const title = 'WHO Counter-Referral Form';
	const subtitle =
		'SBAR communication framework for returning patients to primary care.';

	const stepTitles = [
		'Patient',
		'Facility',
		'Situation',
		'Background',
		'Assessment',
		'Recommendations',
		'Sign-off'
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
		assessment.validation = validateCounterReferral(assessment.data);
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
			This single-page form follows the SBAR (Situation, Background, Assessment,
			Recommendations) communication framework for counter-referral, returning the
			patient from the referral facility back to primary care. Complete all sections
			and submit to see a completeness summary and flagged clinical issues.
		</Alert>
	</div>

	<Form label={title} onsubmit={submitForm}>
		<div id="form-sections">
			<div class="step-section"><Step1PatientIdentification /></div>
			<div class="step-section"><Step2FacilityDetails /></div>
			<div class="step-section"><Step3Situation /></div>
			<div class="step-section"><Step4Background /></div>
			<div class="step-section"><Step5Assessment /></div>
			<div class="step-section"><Step6Recommendations /></div>
			<div class="step-section"><Step7ProviderSignoff /></div>
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
				<Alert type="success">
					Counter-referral form is complete. A copy should be sent with the patient to
					the primary care facility.
				</Alert>
			{:else}
				<Alert type="warning" heading="The counter-referral form is incomplete">
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
