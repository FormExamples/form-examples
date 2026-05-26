<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { validateB1 } from '$lib/engine/b1-validator';
	import { detectFlaggedIssues } from '$lib/engine/flagged-issues';

	import Form from '$lib/components/ui/Form.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Progress from '$lib/components/ui/Progress.svelte';
	import StepList from '$lib/components/ui/StepList.svelte';
	import StepListItem from '$lib/components/ui/StepListItem.svelte';
	import Panel from '$lib/components/ui/Panel.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';

	import Step1PersonalDetails from '$lib/components/steps/Step1PersonalDetails.svelte';
	import Step2HealthcareProfessionals from '$lib/components/steps/Step2HealthcareProfessionals.svelte';
	import Step3ConditionHistory from '$lib/components/steps/Step3ConditionHistory.svelte';
	import Step4TreatmentProvider from '$lib/components/steps/Step4TreatmentProvider.svelte';
	import Step5Blackouts from '$lib/components/steps/Step5Blackouts.svelte';
	import Step6Seizures from '$lib/components/steps/Step6Seizures.svelte';
	import Step7Medication from '$lib/components/steps/Step7Medication.svelte';
	import Step8VpShunt from '$lib/components/steps/Step8VpShunt.svelte';
	import Step9DailyLiving from '$lib/components/steps/Step9DailyLiving.svelte';
	import Step10DoubleVision from '$lib/components/steps/Step10DoubleVision.svelte';
	import Step11Eyesight from '$lib/components/steps/Step11Eyesight.svelte';
	import Step12VehicleAdaptations from '$lib/components/steps/Step12VehicleAdaptations.svelte';
	import Step13Authorisation from '$lib/components/steps/Step13Authorisation.svelte';

	let submitted = $state(false);

	const title = 'DVLA B1 — Confidential medical information (neurological)';
	const subtitle = 'Neurological — UK Driver and Vehicle Licensing Agency';

	const steps = [
		{ step: 1, title: 'Personal Details' },
		{ step: 2, title: 'Healthcare Professionals' },
		{ step: 3, title: 'Condition History' },
		{ step: 4, title: 'Treatment Provider' },
		{ step: 5, title: 'Blackouts' },
		{ step: 6, title: 'Seizures' },
		{ step: 7, title: 'Medication' },
		{ step: 8, title: 'VP Shunt' },
		{ step: 9, title: 'Daily Living' },
		{ step: 10, title: 'Double Vision' },
		{ step: 11, title: 'Eyesight' },
		{ step: 12, title: 'Vehicle Adaptations' },
		{ step: 13, title: 'Authorisation' }
	];

	function submitForm() {
		assessment.validation = validateB1(assessment.data);
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
	<title>DVLA B1 — Confidential medical information (neurological)</title>
</svelte:head>

<header class="page-header no-print">
	<div class="page-header-inner">
		<h1>{title}</h1>
		<p class="subtitle">{subtitle}</p>
		<Progress label="Form completion" max={100} value={0} />
		<StepList label="DVLA B1 steps">
			{#each steps as s (s.step)}
				<StepListItem status="waiting">{s.title}</StepListItem>
			{/each}
		</StepList>
	</div>
</header>

<main>
	<Alert type="info">
		<p>
			This single-page form collects the medical information the Driver and
			Vehicle Licensing Agency (DVLA) requires to assess your fitness to drive
			following a neurological condition. All sections are presented on one
			page; conditional questions appear only when they apply to your answers.
			When you have completed the form, submit it to see a completeness summary
			and a list of flagged issues.
		</p>
	</Alert>

	<Form label={title} onsubmit={submitForm}>
		<Step1PersonalDetails />
		<Step2HealthcareProfessionals />
		<Step3ConditionHistory />
		<Step4TreatmentProvider />
		<Step5Blackouts />
		<Step6Seizures />
		<Step7Medication />
		<Step8VpShunt />
		<Step9DailyLiving />
		<Step10DoubleVision />
		<Step11Eyesight />
		<Step12VehicleAdaptations />
		<Step13Authorisation />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Submit Form</Button>
			<Button data-variant="secondary" onclick={startOver}>Start over</Button>
		</div>
	</Form>

	<Panel label="Submission summary" class="report-panel">
		{#if !submitted || !assessment.validation}
			<p class="empty-message">Submit the form to see the completeness summary.</p>
		{:else}
			<h2>Submission summary</h2>
			<p>
				{assessment.validation.totalSatisfied} of
				{assessment.validation.totalRequired} required fields completed.
			</p>
			{#if assessment.validation.complete}
				<Alert type="success">
					<p>
						Form is complete. Please print and send to the DVLA Drivers Medical
						Group, Swansea, SA99 1DF, or email <code>eftd@dvla.gov.uk</code>.
					</p>
				</Alert>
			{:else}
				<Alert type="warning">
					<p class="font-medium">The form is incomplete. Please review the missing items below:</p>
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
							<strong>[{flag.priority}]</strong> {flag.category}: {flag.message}
						</li>
					{/each}
				</ul>
			{/if}
		{/if}
	</Panel>
</main>

<style>
	.page-header {
		background: var(--color-surface);
		border-bottom: 1px solid var(--color-border);
		position: sticky;
		top: 0;
		z-index: 10;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
	}
	.page-header-inner {
		max-width: 56rem;
		margin: 0 auto;
		padding: 1rem;
	}
	.page-header h1 {
		font-size: 1.25rem;
		font-weight: 600;
		margin: 0 0 0.25rem;
	}
	.subtitle {
		color: var(--color-muted);
		font-size: 0.875rem;
		margin: 0 0 0.75rem;
	}
	main {
		max-width: 56rem;
		margin: 0 auto;
		padding: 1.5rem 1rem 4rem;
	}
</style>
