<script lang="ts">
	import { goto } from '$app/navigation';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { asrsClassificationLabel, adhdSubtypeLabel, calculateAge } from '$lib/engine/utils';
	import Badge from '$lib/components/ui/Badge.svelte';
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

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch('/report/pdf', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `adhd-assessment-${data.demographics.lastName}-${new Date().toISOString().slice(0, 10)}.pdf`;
				a.click();
				URL.revokeObjectURL(url);
			} else {
				pdfError = 'Failed to generate PDF. Please try again.';
			}
		} catch {
			pdfError = 'Failed to generate PDF. Please check your connection and try again.';
		}
	}

	function startNew() {
		assessment.reset();
		goto('/');
	}

	function classifyAlertType(classification: string): 'success' | 'warning' | 'error' {
		if (classification === 'highly-consistent' || classification === 'highly_consistent') return 'error';
		if (classification === 'possible' || classification === 'consistent') return 'warning';
		return 'success';
	}

	function flagAlertType(priority: string): 'info' | 'warning' | 'error' {
		if (priority === 'high') return 'error';
		if (priority === 'medium') return 'warning';
		return 'info';
	}
</script>

{#if result}
	<div class="min-h-screen bg-gray-50">
		<header class="border-b border-gray-200 bg-white shadow-sm no-print">
			<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
				<h1 class="text-lg font-bold text-gray-900">Assessment Report</h1>
				<div class="button-group">
					{#if pdfError}<span class="text-sm text-red-600">{pdfError}</span>{/if}
					<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
					<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
					<Button data-variant="secondary" onclick={startNew}>New Assessment</Button>
				</div>
			</div>
		</header>

		<main class="mx-auto max-w-4xl px-4 py-6">
			<Panel label="ADHD assessment report" class="report-panel">
				<Alert
					type={classifyAlertType(result.classification)}
					heading={`ASRS Total: ${result.asrsTotal}/72 — ${asrsClassificationLabel(result.classification)}`}
				>
					<p>{adhdSubtypeLabel(result.subtype)}</p>
					<p>Generated {new Date(result.timestamp).toLocaleString()}</p>
				</Alert>

				<h2>Score Breakdown</h2>
				<dl class="summary-grid">
					<dt>Part A Score</dt>
					<dd>{result.partAScore}/24</dd>
					<dt>Part B Score</dt>
					<dd>{result.partBScore}/48</dd>
					<dt>Inattentive Subscore</dt>
					<dd>{result.inattentiveSubscore}</dd>
					<dt>Hyperactive-Impulsive Subscore</dt>
					<dd>{result.hyperactiveImpulsiveSubscore}</dd>
					<dt>Part A Screener</dt>
					<dd>{result.partAScreenerPositive ? 'POSITIVE' : 'Negative'}</dd>
				</dl>

				{#if result.additionalFlags.length > 0}
					<h2>Flagged Issues for Clinician</h2>
					<ul class="flag-list">
						{#each result.additionalFlags as flag (flag.category + flag.message)}
							<li>
								<Alert type={flagAlertType(flag.priority)}>
									<p><strong>[{flag.priority.toUpperCase()}]</strong> {flag.category}: {flag.message}</p>
								</Alert>
							</li>
						{/each}
					</ul>
				{/if}

				{#if result.firedRules.length > 0}
					<h2>Classification Justification</h2>
					<table class="domain-table">
						<thead>
							<tr>
								<th>Rule</th>
								<th>Domain</th>
								<th>Finding</th>
								<th>Classification</th>
							</tr>
						</thead>
						<tbody>
							{#each result.firedRules as rule (rule.id)}
								<tr>
									<td><code>{rule.id}</code></td>
									<td>{rule.domain}</td>
									<td>{rule.description}</td>
									<td><Badge classification={rule.classification} /></td>
								</tr>
							{/each}
						</tbody>
					</table>
				{/if}

				<h2>Patient Summary</h2>
				<dl class="summary-grid">
					<dt>Name</dt>
					<dd>{data.demographics.firstName} {data.demographics.lastName}</dd>
					<dt>DOB</dt>
					<dd>
						{data.demographics.dateOfBirth}
						{#if calculateAge(data.demographics.dateOfBirth)} (Age {calculateAge(data.demographics.dateOfBirth)}){/if}
					</dd>
					<dt>Sex</dt>
					<dd>{data.demographics.sex}</dd>
					<dt>Occupation</dt>
					<dd>{data.demographics.occupation || 'N/A'}</dd>
				</dl>

				{#if data.medications.length > 0}
					<h2>Medications</h2>
					<ul>
						{#each data.medications as med (med.name)}
							<li>{med.name} {med.dose} {med.frequency}</li>
						{/each}
					</ul>
				{/if}

				{#if data.allergies.length > 0}
					<h2>Allergies</h2>
					<ul>
						{#each data.allergies as allergy (allergy.allergen)}
							<li>
								<strong>{allergy.allergen}</strong> — {allergy.reaction}
								{#if allergy.severity}<span class="severity-badge">{allergy.severity}</span>{/if}
							</li>
						{/each}
					</ul>
				{/if}
			</Panel>
		</main>
	</div>
{/if}

<style>
	.flag-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.25rem; }
	.domain-table { width: 100%; font-size: 0.875rem; border-collapse: collapse; margin-top: 0.5rem; }
	.domain-table td, .domain-table th { padding: 0.25rem 0.5rem; border-bottom: 1px solid var(--color-border); text-align: left; }
	.summary-grid { display: grid; grid-template-columns: max-content 1fr; gap: 0.5rem 1rem; margin: 0; font-size: 0.9375rem; }
	.summary-grid dt { font-weight: 500; color: var(--color-muted); }
	.summary-grid dd { margin: 0; }
	.severity-badge {
		display: inline-block;
		padding: 0.125rem 0.5rem;
		background: var(--color-warning-bg);
		color: var(--color-warning);
		border-radius: 9999px;
		font-size: 0.75rem;
		font-weight: 500;
		margin-left: 0.25rem;
	}
</style>
