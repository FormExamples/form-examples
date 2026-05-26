<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { validateCfar } from '$lib/engine/cfar-validator';
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
	import Step2ReferralTransport from '$lib/components/steps/Step2ReferralTransport.svelte';
	import Step3Situation from '$lib/components/steps/Step3Situation.svelte';
	import Step4Background from '$lib/components/steps/Step4Background.svelte';
	import Step5MajorBleeding from '$lib/components/steps/Step5MajorBleeding.svelte';
	import Step6Airway from '$lib/components/steps/Step6Airway.svelte';
	import Step7Breathing from '$lib/components/steps/Step7Breathing.svelte';
	import Step8Circulation from '$lib/components/steps/Step8Circulation.svelte';
	import Step9Disability from '$lib/components/steps/Step9Disability.svelte';
	import Step10Exposure from '$lib/components/steps/Step10Exposure.svelte';
	import Step11Recommendations from '$lib/components/steps/Step11Recommendations.svelte';
	import Step12ResponderDetails from '$lib/components/steps/Step12ResponderDetails.svelte';

	const title = 'WHO Emergency First Aid Form';
	const subtitle =
		'CABCDE framework for Community First Aid Responders.';

	const stepTitles = [
		'Patient',
		'Transport',
		'Situation',
		'Background',
		'Bleeding',
		'Airway',
		'Breathing',
		'Circulation',
		'Disability',
		'Exposure',
		'Recommendations',
		'Responder'
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
		assessment.validation = validateCfar(assessment.data);
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
			This single-page form documents an emergency first aid encounter using the
			CABCDE framework (Catastrophic bleeding, Airway, Breathing, Circulation,
			Disability, Exposure). All sections are presented on one page and completed
			by a Community First Aid Responder. Submit the form to see a completeness
			summary and a list of flagged clinical issues for handover.
		</Alert>
	</div>

	<Form label={title} onsubmit={submitForm}>
		<div id="form-sections">
			<div class="step-section"><Step1PatientIdentification /></div>
			<div class="step-section"><Step2ReferralTransport /></div>
			<div class="step-section"><Step3Situation /></div>
			<div class="step-section"><Step4Background /></div>
			<div class="step-section"><Step5MajorBleeding /></div>
			<div class="step-section"><Step6Airway /></div>
			<div class="step-section"><Step7Breathing /></div>
			<div class="step-section"><Step8Circulation /></div>
			<div class="step-section"><Step9Disability /></div>
			<div class="step-section"><Step10Exposure /></div>
			<div class="step-section"><Step11Recommendations /></div>
			<div class="step-section"><Step12ResponderDetails /></div>
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
					Form is complete. Send a copy of this form with the patient to the referral
					facility.
				</Alert>
			{:else}
				<Alert type="warning" heading="The form is incomplete">
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
