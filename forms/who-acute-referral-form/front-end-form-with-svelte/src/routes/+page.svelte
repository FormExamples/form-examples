<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { validateReferral } from '$lib/engine/referral-validator';
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
	import Step2FacilityAndTransport from '$lib/components/steps/Step2FacilityAndTransport.svelte';
	import Step3Situation from '$lib/components/steps/Step3Situation.svelte';
	import Step4Background from '$lib/components/steps/Step4Background.svelte';
	import Step5Assessment from '$lib/components/steps/Step5Assessment.svelte';
	import Step6Recommendations from '$lib/components/steps/Step6Recommendations.svelte';
	import Step7ProviderSignoff from '$lib/components/steps/Step7ProviderSignoff.svelte';
	import Step8ReferralFacilityReceipt from '$lib/components/steps/Step8ReferralFacilityReceipt.svelte';

	const title = 'WHO Acute Referral Form';
	const subtitle =
		'SBAR communication framework for inter-facility patient transfers.';

	const stepTitles = [
		'Patient',
		'Facility',
		'Situation',
		'Background',
		'Assessment',
		'Recommendations',
		'Sign-off',
		'Receipt'
	];

	let submitted = $state(false);
	const totalSteps = stepTitles.length;
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
		assessment.validation = validateReferral(assessment.data);
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

		<StepList label={`${title} steps`} current={assessment.currentStep - 1}>
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
			Recommendations) communication framework for inter-facility patient transfers.
			Sections 1–7 are completed by the initiating facility; section 8 is completed by
			the receiving (referral) facility on arrival. When you have completed your part of
			the form, submit it to see a completeness summary and a list of flagged clinical
			issues.
		</Alert>
	</div>

	<Form label={title} onsubmit={submitForm}>
		<div id="form-sections">
			<div class="step-section"><Step1PatientIdentification /></div>
			<div class="step-section"><Step2FacilityAndTransport /></div>
			<div class="step-section"><Step3Situation /></div>
			<div class="step-section"><Step4Background /></div>
			<div class="step-section"><Step5Assessment /></div>
			<div class="step-section"><Step6Recommendations /></div>
			<div class="step-section"><Step7ProviderSignoff /></div>
			<div class="step-section"><Step8ReferralFacilityReceipt /></div>
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
					Referral form is complete. A copy should be sent with the patient to the
					referral facility.
				</Alert>
			{:else}
				<Alert type="warning" heading="The referral form is incomplete">
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
