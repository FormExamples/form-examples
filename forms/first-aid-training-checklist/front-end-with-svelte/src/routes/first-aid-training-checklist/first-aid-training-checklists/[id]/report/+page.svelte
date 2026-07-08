<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import {
		outcomeLabel,
		outcomeColor,
		traineeRoleLabel,
		formatTraineeName,
		triStateLabel
	} from '$lib/engine/utils';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/first-aid-training-checklist/first-aid-training-checklists/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/first-aid-training-checklists/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `first-aid-training-checklist-${data.traineeDetails.lastName || id}.pdf`;
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
</script>

{#if result}
	<header class="border-b border-base-300 bg-base-100 shadow-sm no-print">
		<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
			<h1 class="text-lg font-bold text-base-content">First aid competency report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/first-aid-training-checklist/first-aid-training-checklists/${id}`)}>Edit</Button>
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-4xl px-4 py-6">
		<!-- Outcome banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {outcomeColor(result.outcome)}">
			<div class="text-3xl font-bold">{outcomeLabel(result.outcome)}</div>
			<div class="mt-2 flex flex-wrap justify-center gap-6 text-sm">
				<span>{result.passedCount} of {result.totalRules} skills demonstrated</span>
				<span>{result.criticalFailures.length} critical failure(s)</span>
				<span>{result.deficiencies.length} deficiency(ies)</span>
			</div>
			<div class="mt-2 text-sm opacity-75">
				Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Flagged issues -->
		{#if result.additionalFlags.length > 0}
			<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-error">Flagged issues for the examiner</h2>
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

		<!-- Competency checklist -->
		{#if result.firedRules.length > 0}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Competency checklist</h2>
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b border-base-300 text-left text-base-content/70">
							<th class="pb-2 pr-4">Rule</th>
							<th class="pb-2 pr-4">Category</th>
							<th class="pb-2 pr-4">Competency</th>
							<th class="pb-2 pr-4">Critical</th>
							<th class="pb-2">Result</th>
						</tr>
					</thead>
					<tbody>
						{#each result.firedRules as rule (rule.id)}
							<tr class="border-b border-base-200">
								<td class="py-2 pr-4 font-mono text-xs text-base-content/60">{rule.id}</td>
								<td class="py-2 pr-4">{rule.category}</td>
								<td class="py-2 pr-4">{rule.description}</td>
								<td class="py-2 pr-4">{rule.critical ? 'Yes' : '—'}</td>
								<td class="py-2"><Badge status={rule.status} /></td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}

		<!-- Trainee summary -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Trainee summary</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div><span class="font-medium text-base-content/70">Trainee:</span> {formatTraineeName(data.traineeDetails.firstName, data.traineeDetails.lastName) || '—'}</div>
				<div><span class="font-medium text-base-content/70">Trainee ID:</span> {data.traineeDetails.traineeId || '—'}</div>
				<div><span class="font-medium text-base-content/70">Role:</span> {traineeRoleLabel(data.traineeDetails.role) || '—'}</div>
				<div><span class="font-medium text-base-content/70">Session date:</span> {data.traineeDetails.sessionDate || '—'}</div>
				<div><span class="font-medium text-base-content/70">Examiner:</span> {data.traineeDetails.examinerName || '—'}</div>
				<div><span class="font-medium text-base-content/70">Venue:</span> {data.traineeDetails.venue || '—'}</div>
			</div>
		</div>

		<!-- Recording & handover -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Recording &amp; handover</h2>
			<div class="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
				<div><span class="font-medium text-base-content/70">Accident book entry:</span> {triStateLabel(data.recordingReportingHandover.accidentBookEntry)}</div>
				<div><span class="font-medium text-base-content/70">RIDDOR awareness:</span> {triStateLabel(data.recordingReportingHandover.riddorAwareness)}</div>
				<div><span class="font-medium text-base-content/70">SBAR handover:</span> {triStateLabel(data.recordingReportingHandover.structuredHandoffSbar)}</div>
				<div><span class="font-medium text-base-content/70">Confidentiality:</span> {triStateLabel(data.recordingReportingHandover.confidentialityMaintained)}</div>
			</div>
			{#if data.recordingReportingHandover.examinerNotes}
				<p class="mt-4 text-sm"><span class="font-medium text-base-content/70">Examiner notes:</span> {data.recordingReportingHandover.examinerNotes}</p>
			{/if}
			{#if data.recordingReportingHandover.traineeFeedback}
				<p class="mt-2 text-sm"><span class="font-medium text-base-content/70">Trainee feedback:</span> {data.recordingReportingHandover.traineeFeedback}</p>
			{/if}
			{#if data.recordingReportingHandover.debriefNotes}
				<p class="mt-2 text-sm"><span class="font-medium text-base-content/70">Debrief notes:</span> {data.recordingReportingHandover.debriefNotes}</p>
			{/if}
		</div>
	</main>
{/if}
