<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import {
		satisfactionCategoryLabel,
		satisfactionCategoryColor,
		scoreColor,
		likertLabel,
		calculateAge
	} from '$lib/engine/utils';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/patient-satisfaction-survey/patient-satisfaction-surveys/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/patient-satisfaction-surveys/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `patient-satisfaction-survey-${data.demographics.lastName || id}.pdf`;
				a.click();
				URL.revokeObjectURL(url);
			} else {
				pdfError = 'Failed to generate PDF. Please try again.';
			}
		} catch {
			pdfError = 'Failed to generate PDF. Please check your connection and try again.';
		}
	}

	const priorityColor: Record<string, string> = {
		high: 'bg-error text-error-content border-error',
		medium: 'bg-warning text-warning-content border-warning',
		low: 'bg-base-300 text-base-content border-base-300'
	};

	const domainLabels: [keyof NonNullable<typeof result>['domainScores'], string][] = [
		['access', 'Access & Waiting Times'],
		['communication', 'Communication & Information'],
		['clinicalCare', 'Clinical Care Quality'],
		['staff', 'Staff Attitude'],
		['environment', 'Environment & Facilities'],
		['discharge', 'Discharge & Follow-up'],
		['overall', 'Overall Experience']
	];
</script>

{#if result}
	<header class="border-b border-base-300 bg-base-100 shadow-sm no-print">
		<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
			<h1 class="text-lg font-bold text-base-content">Patient satisfaction survey report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/patient-satisfaction-survey/patient-satisfaction-surveys/${id}`)}
					>Edit</Button
				>
			</div>
		</div>
	</header>

	<main class="mx-16 px-4 py-6">
		<!-- Overall score banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {satisfactionCategoryColor(result.satisfactionCategory)}">
			<div class="text-4xl font-bold">{result.normalizedScore} / 100</div>
			<div class="mt-2 text-lg font-semibold">
				{satisfactionCategoryLabel(result.satisfactionCategory)}
			</div>
			<div class="mt-2 text-sm opacity-75">
				Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Domain scores -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Domain scores</h2>
			<div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
				{#each domainLabels as [key, label] (key)}
					<div class="flex items-center justify-between rounded-lg border p-3 {scoreColor(result.domainScores[key])}">
						<span class="text-sm font-medium">{label}</span>
						<span class="text-sm font-bold">
							{result.domainScores[key] === null ? 'N/A' : `${result.domainScores[key]}`}
						</span>
					</div>
				{/each}
			</div>
		</div>

		<!-- Flagged issues -->
		{#if result.additionalFlags.length > 0}
			<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-error">Flagged issues for service quality</h2>
				<div class="space-y-2">
					{#each result.additionalFlags as flag (flag.id)}
						<div class="flex items-start gap-3 rounded-lg border p-3 {priorityColor[flag.priority]}">
							<span class="mt-0.5 rounded px-2 py-0.5 text-xs font-bold uppercase {priorityColor[flag.priority]}">
								{flag.priority}
							</span>
							<div><span class="font-medium">{flag.category}:</span> {flag.message}</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Fired rules -->
		{#if result.firedRules.length > 0}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Improvement areas identified</h2>
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b border-base-300 text-left text-base-content/70">
							<th class="pb-2 pr-4">Rule</th>
							<th class="pb-2 pr-4">Domain</th>
							<th class="pb-2 pr-4">Finding</th>
							<th class="pb-2">Severity</th>
						</tr>
					</thead>
					<tbody>
						{#each result.firedRules as rule (rule.id)}
							<tr class="border-b border-base-200">
								<td class="py-2 pr-4 font-mono text-xs text-base-content/60">{rule.id}</td>
								<td class="py-2 pr-4">{rule.domain}</td>
								<td class="py-2 pr-4">{rule.description}</td>
								<td class="py-2"><Badge severity={rule.severity} /></td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}

		<!-- Respondent summary -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Respondent summary</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div>
					<span class="font-medium text-base-content/70">Name:</span>
					{`${data.demographics.firstName} ${data.demographics.lastName}`.trim() || 'Anonymous'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">DOB:</span> {data.demographics.dateOfBirth || 'N/A'}
					{#if calculateAge(data.demographics.dateOfBirth)}(Age {calculateAge(data.demographics.dateOfBirth)}){/if}
				</div>
				<div><span class="font-medium text-base-content/70">Visit date:</span> {data.visitDetails.visitDate || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Visit type:</span> {data.visitDetails.visitType || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Department:</span> {data.visitDetails.department || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Would recommend:</span> {likertLabel(data.overallExperience.wouldRecommend)}</div>
			</div>
		</div>

		<!-- Comments -->
		{#if data.commentsSuggestions.whatWentWell || data.commentsSuggestions.whatCouldImprove}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Patient comments</h2>
				<dl class="space-y-3 text-sm">
					{#if data.commentsSuggestions.whatWentWell}
						<div>
							<dt class="font-medium text-base-content/70">What went well</dt>
							<dd class="mt-1 text-base-content/80">{data.commentsSuggestions.whatWentWell}</dd>
						</div>
					{/if}
					{#if data.commentsSuggestions.whatCouldImprove}
						<div>
							<dt class="font-medium text-base-content/70">What could improve</dt>
							<dd class="mt-1 text-base-content/80">{data.commentsSuggestions.whatCouldImprove}</dd>
						</div>
					{/if}
				</dl>
			</div>
		{/if}
	</main>
{/if}
