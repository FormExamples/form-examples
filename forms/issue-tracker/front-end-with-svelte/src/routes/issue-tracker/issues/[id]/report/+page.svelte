<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import {
		priorityLabel,
		bandColor,
		instrumentLabel,
		flagPriorityColor
	} from '$lib/engine/utils';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/issue-tracker/issues/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/issues/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `issue-${id}.pdf`;
				a.click();
				URL.revokeObjectURL(url);
			} else {
				pdfError = 'Failed to generate PDF. Please try again.';
			}
		} catch {
			pdfError = 'Failed to generate PDF. Please check your connection and try again.';
		}
	}

	const scoreLabel = (v: number | string | null) => (v === null || v === '' ? '—' : String(v));
</script>

{#if result}
	<header class="border-b border-base-300 bg-base-100 shadow-sm no-print">
		<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
			<h1 class="text-lg font-bold text-base-content">Issue report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/issue-tracker/issues/${id}`)}>Edit</Button>
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-4xl px-4 py-6">
		<!-- Composite priority banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {bandColor(result.compositePriority)}">
			<div class="text-3xl font-bold">{priorityLabel(result.compositePriority)}</div>
			<div class="mt-2 text-sm opacity-75">
				Worst single band across all seven scoring scales (max-grade).
			</div>
		</div>

		<!-- Flagged issues -->
		{#if result.additionalFlags.length > 0}
			<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-error">Flagged issues for the responder</h2>
				<div class="space-y-2">
					{#each result.additionalFlags as flag (flag.flagId)}
						<div class="flex items-start gap-3 rounded-lg border p-3 {flagPriorityColor(flag.priority)}">
							<span class="mt-0.5 rounded px-2 py-0.5 text-xs font-bold uppercase {flagPriorityColor(flag.priority)}">
								{flag.priority}
							</span>
							<div>
								<span class="font-medium">{flag.category}:</span> {flag.description}
								<div class="mt-1 text-sm opacity-80">{flag.suggestedAction}</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Raw scores -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Raw scores</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div><span class="font-medium text-base-content/70">Priority rank:</span> {scoreLabel(result.scoreByPriorityRank)}</div>
				<div><span class="font-medium text-base-content/70">Severity of impact:</span> {scoreLabel(result.scoreBySeverityOfImpact)}</div>
				<div><span class="font-medium text-base-content/70">Magnitude of damage:</span> {scoreLabel(result.scoreByMagnitudeOfDamage)}</div>
				<div><span class="font-medium text-base-content/70">Harm grade:</span> {scoreLabel(result.scoreByHarmGrade)}</div>
				<div><span class="font-medium text-base-content/70">Failure condition:</span> {scoreLabel(result.scoreByFailureCondition)}</div>
				<div><span class="font-medium text-base-content/70">MoSCoW requirement:</span> {scoreLabel(result.scoreByMoscowRequirement)}</div>
				<div>
					<span class="font-medium text-base-content/70">Frequency of occurrence:</span>
					{result.scoreByFrequencyPercent === null ? '—' : `${result.scoreByFrequencyPercent}%`}
				</div>
			</div>
		</div>

		<!-- Fired rules -->
		{#if result.firedRules.length > 0}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Scoring justification</h2>
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b border-base-300 text-left text-base-content/70">
							<th class="pb-2 pr-4">Rule</th>
							<th class="pb-2 pr-4">Scale</th>
							<th class="pb-2 pr-4">Finding</th>
							<th class="pb-2">Band</th>
						</tr>
					</thead>
					<tbody>
						{#each result.firedRules as rule (rule.ruleId)}
							<tr class="border-b border-base-200">
								<td class="py-2 pr-4 font-mono text-xs text-base-content/60">{rule.ruleId}</td>
								<td class="py-2 pr-4">{instrumentLabel(rule.instrument)}</td>
								<td class="py-2 pr-4">{rule.description}</td>
								<td class="py-2"><Badge band={rule.band} /></td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}

		<!-- Issue summary -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Issue summary</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div class="sm:col-span-2"><span class="font-medium text-base-content/70">Summary:</span> {data.cc.ccSummary || '—'}</div>
				<div><span class="font-medium text-base-content/70">Reporter:</span> {data.reporter.reporterName || '—'}</div>
				<div><span class="font-medium text-base-content/70">Category:</span> {data.reporter.issueCategory || '—'}</div>
				<div><span class="font-medium text-base-content/70">System:</span> {data.reporter.systemName || '—'}</div>
				<div><span class="font-medium text-base-content/70">Environment:</span> {data.reporter.environment || '—'}</div>
				<div><span class="font-medium text-base-content/70">Reported at:</span> {data.reporter.reportedAt || '—'}</div>
				<div><span class="font-medium text-base-content/70">Root cause:</span> {data.dx.dxRootCause || '—'}</div>
			</div>
		</div>
	</main>
{/if}
