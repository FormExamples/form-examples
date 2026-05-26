<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { validateM1 } from '$lib/engine/m1-validator';

	import Form from '$lib/components/ui/Form.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Progress from '$lib/components/ui/Progress.svelte';
	import StepList from '$lib/components/ui/StepList.svelte';
	import StepListItem from '$lib/components/ui/StepListItem.svelte';
	import Panel from '$lib/components/ui/Panel.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';

	import Step1PersonalDetails from '$lib/components/steps/Step1PersonalDetails.svelte';
	import Step2HealthcareProfessionals from '$lib/components/steps/Step2HealthcareProfessionals.svelte';
	import Step3DiagnosisConfirmation from '$lib/components/steps/Step3DiagnosisConfirmation.svelte';
	import Step4MentalHealthConditions from '$lib/components/steps/Step4MentalHealthConditions.svelte';
	import Step5RecentContact from '$lib/components/steps/Step5RecentContact.svelte';
	import Step6Authorisation from '$lib/components/steps/Step6Authorisation.svelte';

	const title = 'DVLA M1 — Confidential Medical Information';
	const subtitle = 'Mental health — UK Driver and Vehicle Licensing Agency';
	const steps = [
		{ step: 1, title: 'Personal Details' },
		{ step: 2, title: 'Healthcare Professionals' },
		{ step: 3, title: 'Diagnosis Confirmation' },
		{ step: 4, title: 'Mental Health Conditions' },
		{ step: 5, title: 'Recent Contact' },
		{ step: 6, title: 'Authorisation' }
	];

	function submitForm() {
		assessment.result = validateM1(assessment.data);
		if (typeof window !== 'undefined') {
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	}

	function startOver() {
		assessment.reset();
	}
</script>

<header class="page-header no-print">
	<div class="page-header-inner">
		<h1>{title}</h1>
		<p class="subtitle">{subtitle}</p>
		<Progress label="Form completion" max={100} value={0} />
		<StepList label="DVLA M1 steps">
			{#each steps as s (s.step)}
				<StepListItem status="waiting">{s.title}</StepListItem>
			{/each}
		</StepList>
	</div>
</header>

<main>
	<Alert type="info">
		<p>
			This single-page form captures the information needed by the Drivers
			Medical Group at DVLA Swansea to assess your fitness to drive in
			relation to a mental health condition. Your responses are confidential
			and used only by the DVLA medical assessor and your healthcare
			professional.
		</p>
	</Alert>

	<Form label={title} onsubmit={submitForm}>
		<Step1PersonalDetails />
		<Step2HealthcareProfessionals />
		<Step3DiagnosisConfirmation />
		<Step4MentalHealthConditions />
		<Step5RecentContact />
		<Step6Authorisation />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Submit Form</Button>
			<Button data-variant="secondary" onclick={startOver}>Start over</Button>
		</div>
	</Form>

	<Panel label="Submission Summary" class="report-panel">
		{#if !assessment.result}
			<p class="empty-message">Submit the form to see the submission summary.</p>
		{:else}
			{@const r = assessment.result}
			<h2>Submission Summary</h2>
			<p class="subtle">Generated at {new Date(r.timestamp).toLocaleString()}</p>

			<div class="report-grid">
				<div class="summary-box">
					<p class="subtle">Branch</p>
					<p><strong>{r.stoppedAtQ1 ? 'Q1 = No (stopped)' : 'Q1 = Yes (full form)'}</strong></p>
				</div>
				<div class="summary-box">
					<p class="subtle">Conditions reported</p>
					<p><strong>{r.conditionCount}</strong></p>
				</div>
				<div class="summary-box">
					<p class="subtle">Completeness</p>
					<p><strong>{r.complete ? 'Complete' : 'Incomplete'}</strong></p>
				</div>
			</div>

			{#if r.additionalFlags.length > 0}
				<h3>Clinical flags</h3>
				<ul>
					{#each r.additionalFlags as flag (flag.id)}
						<li>
							<Badge priority={flag.priority} />
							<span class="subtle"> {flag.category}</span><br />
							{flag.message}
						</li>
					{/each}
				</ul>
			{/if}

			{#if r.firedRules.length > 0}
				<h3>Validation issues</h3>
				<ul>
					{#each r.firedRules as rule (rule.id)}
						<li>
							<Badge priority={rule.priority} />
							<span class="subtle"> {rule.category} · {rule.id}</span><br />
							{rule.message}
						</li>
					{/each}
				</ul>
			{:else}
				<p>No validation issues detected.</p>
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
		box-shadow: 0 1px 2px rgba(0,0,0,0.05);
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
	.report-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1rem;
		margin-bottom: 1rem;
	}
	@media (max-width: 640px) {
		.report-grid { grid-template-columns: 1fr; }
	}
	.summary-box {
		background: var(--color-bg);
		border: 1px solid var(--color-border);
		border-radius: 0.375rem;
		padding: 0.75rem;
	}
	.summary-box p { margin: 0 0 0.25rem; }
</style>
