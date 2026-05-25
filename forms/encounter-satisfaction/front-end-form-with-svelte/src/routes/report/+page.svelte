<script lang="ts">
	import { goto } from '$app/navigation';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateAge } from '$lib/engine/utils';

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
				a.download = `encounter-satisfaction-${data.demographics.lastName}-${new Date().toISOString().slice(0, 10)}.pdf`;
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

	function categoryAlertType(score: number): 'success' | 'warning' | 'error' {
		if (score >= 3.5) return 'success';
		if (score >= 2.5) return 'warning';
		return 'error';
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
				<h1 class="text-lg font-bold text-gray-900">Satisfaction Report</h1>
				<div class="button-group">
					{#if pdfError}
						<span class="text-sm text-red-600">{pdfError}</span>
					{/if}
					<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
					<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
					<Button data-variant="secondary" onclick={startNew}>New Survey</Button>
				</div>
			</div>
		</header>

		<main class="mx-auto max-w-4xl px-4 py-6">
			<Panel label="Satisfaction report" class="report-panel">
				<Alert
					type={categoryAlertType(result.compositeScore)}
					heading={`${result.compositeScore.toFixed(1)}/5.0 — ${result.category}`}
				>
					<p>
						{result.answeredCount} of 19 questions answered · Generated
						{new Date(result.timestamp).toLocaleString()}
					</p>
				</Alert>

				{#if result.additionalFlags.length > 0}
					<h2>Flagged Issues</h2>
					<ul class="flag-list">
						{#each result.additionalFlags as flag (flag.category + flag.message)}
							<li>
								<Alert type={flagAlertType(flag.priority)}>
									<p>
										<strong>[{flag.priority.toUpperCase()}]</strong>
										{flag.category}: {flag.message}
									</p>
								</Alert>
							</li>
						{/each}
					</ul>
				{/if}

				{#if result.domainScores.length > 0}
					<h2>Score Breakdown by Domain</h2>
					<div class="domain-stack">
						{#each result.domainScores as domain (domain.domain)}
							<section>
								<h3>{domain.domain} — {domain.mean.toFixed(1)}/5.0</h3>
								<progress
									class="progress"
									aria-label={`${domain.domain} score`}
									max={5}
									value={domain.mean}
								></progress>
								<table class="domain-table">
									<tbody>
										{#each domain.questions as q (q.id)}
											<tr>
												<td><code>{q.id}</code></td>
												<td>{q.text}</td>
												<td>{q.score}/5</td>
											</tr>
										{/each}
									</tbody>
								</table>
							</section>
						{/each}
					</div>
				{/if}

				<h2>Patient &amp; Visit Summary</h2>
				<dl class="summary-grid">
					<dt>Name</dt>
					<dd>{data.demographics.firstName} {data.demographics.lastName}</dd>
					<dt>DOB</dt>
					<dd>
						{data.demographics.dateOfBirth}
						{#if calculateAge(data.demographics.dateOfBirth)}
							(Age {calculateAge(data.demographics.dateOfBirth)})
						{/if}
					</dd>
					<dt>Sex</dt>
					<dd>{data.demographics.sex}</dd>
					<dt>Visit Date</dt>
					<dd>{data.visitInformation.visitDate || 'N/A'}</dd>
					<dt>Department</dt>
					<dd>{data.visitInformation.department || 'N/A'}</dd>
					<dt>Provider</dt>
					<dd>{data.visitInformation.providerName || 'N/A'}</dd>
					<dt>Visit Type</dt>
					<dd>{data.visitInformation.visitType || 'N/A'}</dd>
					<dt>First Visit</dt>
					<dd>{data.visitInformation.firstVisit || 'N/A'}</dd>
				</dl>

				{#if data.overallSatisfaction.comments}
					<h2>Patient Comments</h2>
					<p class="comments">{data.overallSatisfaction.comments}</p>
				{/if}
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
	.domain-stack {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.domain-table {
		width: 100%;
		font-size: 0.875rem;
		border-collapse: collapse;
		margin-top: 0.5rem;
	}
	.domain-table td {
		padding: 0.25rem 0.5rem;
		border-bottom: 1px solid var(--color-border);
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
	.comments {
		white-space: pre-wrap;
	}
</style>
