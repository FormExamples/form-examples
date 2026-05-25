<script lang="ts">
	import { goto } from '$app/navigation';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { hearingGradeLabel, calculateAge, affectedEarLabel, hearingLossTypeLabel } from '$lib/engine/utils';
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
				a.download = `audiology-assessment-${data.demographics.lastName}-${new Date().toISOString().slice(0, 10)}.pdf`;
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

	function gradeAlertType(grade: string): 'success' | 'warning' | 'error' {
		if (grade === 'normal') return 'success';
		if (grade === 'mild' || grade === 'moderate') return 'warning';
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
			<Panel label="Audiology report" class="report-panel">
				<Alert type={gradeAlertType(result.hearingGrade)} heading={`${result.hearingGrade.charAt(0).toUpperCase() + result.hearingGrade.slice(1)} — ${hearingGradeLabel(result.hearingGrade)}`}>
					<p>Generated {new Date(result.timestamp).toLocaleString()}</p>
				</Alert>

				{#if result.additionalFlags.length > 0}
					<h2>Flagged Issues for Audiologist</h2>
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
					<h2>Hearing Grade Justification</h2>
					<table class="domain-table">
						<thead>
							<tr><th>Rule</th><th>System</th><th>Finding</th><th>Grade</th></tr>
						</thead>
						<tbody>
							{#each result.firedRules as rule (rule.id)}
								<tr>
									<td><code>{rule.id}</code></td>
									<td>{rule.system}</td>
									<td>{rule.description}</td>
									<td><Badge grade={rule.grade} /></td>
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
					<dt>Affected Ear</dt>
					<dd>{affectedEarLabel(data.chiefComplaint.affectedEar)}</dd>
					<dt>Hearing Loss Type</dt>
					<dd>{hearingLossTypeLabel(data.audiometricResults.hearingLossType)}</dd>
					<dt>Onset</dt>
					<dd>{data.chiefComplaint.onset || 'N/A'}</dd>
				</dl>

				<h2>Audiometric Results</h2>
				<dl class="summary-grid">
					<dt>PTA Right</dt>
					<dd>{data.audiometricResults.pureToneAverageRight ?? 'N/A'} dB HL</dd>
					<dt>PTA Left</dt>
					<dd>{data.audiometricResults.pureToneAverageLeft ?? 'N/A'} dB HL</dd>
					<dt>Word Recognition Right</dt>
					<dd>{data.audiometricResults.wordRecognitionScoreRight ?? 'N/A'}%</dd>
					<dt>Word Recognition Left</dt>
					<dd>{data.audiometricResults.wordRecognitionScoreLeft ?? 'N/A'}%</dd>
				</dl>

				{#if data.tinnitusAssessment.presence === 'yes'}
					<h2>Tinnitus</h2>
					<dl class="summary-grid">
						<dt>Affected Ear</dt>
						<dd>{affectedEarLabel(data.tinnitusAssessment.affectedEar)}</dd>
						<dt>Character</dt>
						<dd>{data.tinnitusAssessment.character || 'N/A'}</dd>
						<dt>Severity</dt>
						<dd>{data.tinnitusAssessment.severity || 'N/A'}</dd>
						<dt>THI Score</dt>
						<dd>{data.tinnitusAssessment.tinnitusHandicapInventoryScore ?? 'N/A'}</dd>
					</dl>
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
</style>
