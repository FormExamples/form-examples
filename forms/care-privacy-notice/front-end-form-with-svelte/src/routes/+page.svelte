<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { validateForm } from '$lib/engine/form-validator';
	import { detectAdditionalFlags } from '$lib/engine/flagged-issues';

	import Form from '$lib/components/ui/Form.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Panel from '$lib/components/ui/Panel.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';

	import Step1PracticeConfiguration from '$lib/components/steps/Step1PracticeConfiguration.svelte';
	import Step2PrivacyNotice from '$lib/components/steps/Step2PrivacyNotice.svelte';
	import Step3AcknowledgmentSignature from '$lib/components/steps/Step3AcknowledgmentSignature.svelte';

	const submitted = $derived(assessment.result !== null);

	function submitForm() {
		const { completeness, status, firedRules } = validateForm(assessment.data);
		const additionalFlags = detectAdditionalFlags(assessment.data);
		assessment.result = {
			completenessPercent: completeness,
			status,
			firedRules,
			additionalFlags,
			timestamp: new Date().toISOString()
		};
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	function startNew() {
		assessment.reset();
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	function alertTypeFor(percent: number): 'success' | 'warning' | 'error' {
		if (percent >= 100) return 'success';
		if (percent >= 60) return 'warning';
		return 'error';
	}
</script>

<div class="min-h-screen bg-gray-50">
	<header class="border-b border-nhs-blue bg-nhs-blue shadow-sm no-print">
		<div class="mx-auto max-w-2xl px-4 py-4">
			<h1 class="text-xl font-bold text-white">Care Privacy Notice</h1>
			<p class="mt-0.5 text-sm text-blue-100">
				Based on the BMA GDPR template for GP practices
			</p>
		</div>
	</header>

	<main class="mx-auto max-w-2xl px-4 py-8">
		{#if submitted && assessment.result}
			<Panel label="Submission summary" class="report-panel">
				<div class="report-header no-print">
					<h2>Submission Summary</h2>
					<div class="button-group">
						<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
						<Button data-variant="primary" onclick={startNew}>New Form</Button>
					</div>
				</div>

				<Alert
					type={alertTypeFor(assessment.result.completenessPercent)}
					heading={`${assessment.result.completenessPercent}% Complete — ${assessment.result.status}`}
				>
					<p>Generated {new Date(assessment.result.timestamp).toLocaleString()}</p>
				</Alert>

				{#if assessment.result.additionalFlags.length > 0}
					<h3>Flagged Issues</h3>
					<ul class="flag-list">
						{#each assessment.result.additionalFlags as flag (flag.category + flag.message)}
							<li>
								<Alert type={flag.priority === 'high' ? 'error' : flag.priority === 'medium' ? 'warning' : 'info'}>
									<p>
										<strong>[{flag.priority.toUpperCase()}]</strong>
										{flag.category}: {flag.message}
									</p>
								</Alert>
							</li>
						{/each}
					</ul>
				{/if}

				{#if assessment.result.firedRules.length > 0}
					<h3>Missing Required Fields</h3>
					<table class="missing-table">
						<thead>
							<tr>
								<th>Rule</th>
								<th>Section</th>
								<th>Issue</th>
								<th>Field</th>
							</tr>
						</thead>
						<tbody>
							{#each assessment.result.firedRules as rule (rule.id)}
								<tr>
									<td><code>{rule.id}</code></td>
									<td>{rule.section}</td>
									<td>{rule.description}</td>
									<td><code>{rule.field}</code></td>
								</tr>
							{/each}
						</tbody>
					</table>
				{/if}

				<h3>Acknowledgment Summary</h3>
				<dl class="summary-grid">
					<dt>Acknowledged</dt>
					<dd
						class={assessment.data.acknowledgmentSignature.agreed ? 'positive' : 'negative'}
					>
						{assessment.data.acknowledgmentSignature.agreed ? 'Yes' : 'No'}
					</dd>
					<dt>Patient Name</dt>
					<dd>{assessment.data.acknowledgmentSignature.patientTypedFullName || 'N/A'}</dd>
					<dt>Date</dt>
					<dd>{assessment.data.acknowledgmentSignature.patientTypedDate || 'N/A'}</dd>
					<dt>Practice</dt>
					<dd>{assessment.data.practiceConfiguration.practiceName || 'N/A'}</dd>
				</dl>
			</Panel>
		{:else}
			<Form label="Care Privacy Notice" onsubmit={submitForm}>
				<Step1PracticeConfiguration />
				<Step2PrivacyNotice />
				<Step3AcknowledgmentSignature />

				<div class="button-group">
					<Button type="submit" data-variant="primary">
						Submit Privacy Notice Acknowledgment
					</Button>
				</div>
				<p class="footer-note">
					For clinical administration only. Based on BMA GDPR template for GP practices.
				</p>
			</Form>
		{/if}
	</main>
</div>

<style>
	.report-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}
	.report-header h2 {
		font-size: 1.5rem;
		font-weight: 700;
		margin: 0;
	}
	.report-header :global(.button-group) {
		margin-top: 0;
	}
	.flag-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}
	.missing-table {
		width: 100%;
		font-size: 0.875rem;
		border-collapse: collapse;
	}
	.missing-table th,
	.missing-table td {
		text-align: left;
		padding: 0.375rem 0.5rem;
		border-bottom: 1px solid var(--color-border);
	}
	.missing-table th { color: var(--color-muted); font-weight: 600; }
	.summary-grid {
		display: grid;
		grid-template-columns: max-content 1fr;
		gap: 0.5rem 1rem;
		margin: 0;
		font-size: 0.9375rem;
	}
	.summary-grid dt {
		font-weight: 500;
		color: var(--color-muted);
	}
	.summary-grid dd { margin: 0; }
	.positive { color: var(--color-success); font-weight: 600; }
	.negative { color: var(--color-danger); font-weight: 600; }
	.footer-note {
		text-align: center;
		font-size: 0.75rem;
		color: var(--color-muted);
		margin-top: 0.75rem;
	}
</style>
