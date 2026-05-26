<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { validateMatB1 } from '$lib/engine/mat-b1-validator';
	import Form from '$lib/components/ui/Form.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Progress from '$lib/components/ui/Progress.svelte';
	import StepList from '$lib/components/ui/StepList.svelte';
	import StepListItem from '$lib/components/ui/StepListItem.svelte';
	import Panel from '$lib/components/ui/Panel.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';

	import Step1PatientIdentification from '$lib/components/steps/Step1PatientIdentification.svelte';
	import Step2PreConfinement from '$lib/components/steps/Step2PreConfinement.svelte';
	import Step3PostConfinement from '$lib/components/steps/Step3PostConfinement.svelte';
	import Step4IssuerValidation from '$lib/components/steps/Step4IssuerValidation.svelte';

	const title = 'UK Maternity Certificate (MAT B1)';
	const subtitle = 'DWP MAT B1 — completeness validation and credential check';

	const steps = [
		{ step: 1, title: 'Patient Identification' },
		{ step: 2, title: 'Pre-Confinement Certificate (Part A)' },
		{ step: 3, title: 'Post-Confinement Certificate (Part B)' },
		{ step: 4, title: 'Issuer Validation' }
	];

	function submitForm() {
		assessment.result = validateMatB1(assessment.data);
		if (typeof document !== 'undefined') {
			requestAnimationFrame(() => {
				document.getElementById('mat-b1-result')?.scrollIntoView({ behavior: 'smooth' });
			});
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
		<StepList label="MAT B1 steps">
			{#each steps as s (s.step)}
				<StepListItem status="waiting">{s.title}</StepListItem>
			{/each}
		</StepList>
	</div>
</header>

<main>
	<Alert type="info">
		<p>
			This single-page form captures the data needed to issue an official UK
			DWP MAT B1 maternity certificate. Choose either Part A (pre-confinement)
			or Part B (post-confinement) — they are mutually exclusive — and provide
			the issuer details for the doctor or registered midwife signing the
			certificate.
		</p>
	</Alert>

	<Form label={title} onsubmit={submitForm}>
		<Step1PatientIdentification />
		<Step2PreConfinement />
		<Step3PostConfinement />
		<Step4IssuerValidation />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Validate Certificate</Button>
			<Button data-variant="secondary" onclick={startOver}>Start over</Button>
		</div>
	</Form>

	<Panel label="Validation Result" class="report-panel">
		<div id="mat-b1-result">
			{#if !assessment.result}
				<p class="empty-message">Submit the form to see the validation result.</p>
			{:else}
				{@const result = assessment.result}
				<h2>Validation Result</h2>

				<div class="report-grid">
					<div class="summary-box">
						<p class="subtle">Status</p>
						<p>
							{#if result.complete}
								<strong style="color: var(--color-success);">Complete</strong>
							{:else}
								<strong style="color: var(--color-danger);">Incomplete</strong>
							{/if}
						</p>
					</div>
					<div class="summary-box">
						<p class="subtle">Branch</p>
						<p>
							<strong>
								{result.certificateType === 'pre'
									? 'Part A — pre-confinement'
									: result.certificateType === 'post'
										? 'Part B — post-confinement'
										: 'Not selected'}
							</strong>
							{#if result.issuerType}
								· {result.issuerType === 'doctor' ? 'Doctor' : 'Midwife'}
							{/if}
						</p>
					</div>
				</div>

				{#if result.weeksBeforeEwc !== null}
					<p>
						Examination is <strong>{result.weeksBeforeEwc}</strong> weeks before
						the expected date of confinement.
					</p>
				{/if}

				{#if result.firedRules.length > 0}
					<h3>Issues to resolve ({result.firedRules.length})</h3>
					<ul>
						{#each result.firedRules as r (r.id)}
							<li>
								<Badge priority={r.priority} />
								<span class="subtle"> {r.id} · {r.category}</span><br />
								{r.message}
							</li>
						{/each}
					</ul>
				{:else}
					<Alert type="success">
						<p>No completeness or consistency issues detected.</p>
					</Alert>
				{/if}

				{#if result.additionalFlags.length > 0}
					<h3>Additional flags ({result.additionalFlags.length})</h3>
					<ul>
						{#each result.additionalFlags as f (f.id)}
							<li>
								<Badge priority={f.priority} />
								<span class="subtle"> {f.id} · {f.category}</span><br />
								{f.message}
							</li>
						{/each}
					</ul>
				{/if}
			{/if}
		</div>
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
	.report-panel h2 {
		margin: 0 0 0.75rem;
		font-size: 1.5rem;
	}
	.report-panel h3 {
		font-size: 1.0625rem;
		margin: 1rem 0 0.5rem;
	}
	.report-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
		margin-bottom: 1rem;
	}
	@media (max-width: 640px) {
		.report-grid {
			grid-template-columns: 1fr;
		}
	}
	.subtle {
		color: var(--color-muted);
		font-size: 0.875rem;
		margin: 0;
	}
	.summary-box {
		background: var(--color-bg);
		border: 1px solid var(--color-border);
		border-radius: 0.375rem;
		padding: 0.75rem;
	}
	.summary-box p {
		margin: 0 0 0.25rem;
	}
</style>
