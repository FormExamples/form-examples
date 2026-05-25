<script lang="ts">
	import { goto } from '$app/navigation';
	import { assessment } from '$lib/stores/assessment.svelte';

	import Panel from '$lib/components/ui/Panel.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto('/');
		}
	});

	function startNew() {
		assessment.reset();
		goto('/');
	}

	function alertTypeFor(percent: number): 'success' | 'warning' | 'error' {
		if (percent >= 100) return 'success';
		if (percent >= 60) return 'warning';
		return 'error';
	}
</script>

{#if result}
	<div class="min-h-screen bg-gray-50">
		<header class="border-b border-gray-200 bg-white shadow-sm no-print">
			<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
				<h1 class="text-lg font-bold text-gray-900">Privacy Notice Summary</h1>
				<div class="button-group">
					<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
					<Button data-variant="secondary" onclick={startNew}>New Form</Button>
				</div>
			</div>
		</header>

		<main class="mx-auto max-w-4xl px-4 py-6">
			<Panel label="Privacy notice summary" class="report-panel">
				<Alert
					type={alertTypeFor(result.completenessPercent)}
					heading={`${result.completenessPercent}% Complete — ${result.status}`}
				>
					<p>Generated {new Date(result.timestamp).toLocaleString()}</p>
				</Alert>

				{#if result.additionalFlags.length > 0}
					<h2>Flagged Issues</h2>
					<ul class="flag-list">
						{#each result.additionalFlags as flag (flag.category + flag.message)}
							<li>
								<Alert
									type={flag.priority === 'high'
										? 'error'
										: flag.priority === 'medium'
											? 'warning'
											: 'info'}
								>
									<p>
										<strong>[{flag.priority.toUpperCase()}]</strong>
										{flag.category}: {flag.message}
									</p>
								</Alert>
							</li>
						{/each}
					</ul>
				{/if}

				{#if result.firedRules.length > 0}
					<h2>Missing Required Fields</h2>
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
							{#each result.firedRules as rule (rule.id)}
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

				<h2>Acknowledgment Summary</h2>
				<dl class="summary-grid">
					<dt>Acknowledged</dt>
					<dd class={data.acknowledgmentSignature.agreed ? 'positive' : 'negative'}>
						{data.acknowledgmentSignature.agreed ? 'Yes' : 'No'}
					</dd>
					<dt>Patient Name</dt>
					<dd>{data.acknowledgmentSignature.patientTypedFullName || 'N/A'}</dd>
					<dt>Date</dt>
					<dd>{data.acknowledgmentSignature.patientTypedDate || 'N/A'}</dd>
					<dt>Practice</dt>
					<dd>{data.practiceConfiguration.practiceName || 'N/A'}</dd>
				</dl>
			</Panel>
		</main>
	</div>
{/if}

<style>
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
	.missing-table th {
		color: var(--color-muted);
		font-weight: 600;
	}
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
	.summary-grid dd {
		margin: 0;
	}
	.positive {
		color: var(--color-success);
		font-weight: 600;
	}
	.negative {
		color: var(--color-danger);
		font-weight: 600;
	}
</style>
