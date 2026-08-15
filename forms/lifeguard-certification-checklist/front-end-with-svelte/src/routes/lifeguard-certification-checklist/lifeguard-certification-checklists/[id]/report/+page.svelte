<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import {
		outcomeLabel,
		outcomeColor,
		triStateLabel,
		triStateColor,
		priorityColor,
		calculateAge,
		venueTypeLabel
	} from '#lib/engine/utils.js';
	import Button from '#lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/lifeguard-certification-checklist/lifeguard-certification-checklists/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/lifeguard-certification-checklists/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `lifeguard-certification-checklist-${data.candidateDetails.lastName || id}.pdf`;
				a.click();
				URL.revokeObjectURL(url);
			} else {
				pdfError = 'Failed to generate PDF. Please try again.';
			}
		} catch {
			pdfError = 'Failed to generate PDF. Please check your connection and try again.';
		}
	}
</script>

{#if result}
	<header class="border-b border-base-300 bg-base-100 shadow-sm no-print">
		<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
			<h1 class="text-lg font-bold text-base-content">Lifeguard certification report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/lifeguard-certification-checklist/lifeguard-certification-checklists/${id}`)}>Edit</Button>
			</div>
		</div>
	</header>

	<main class="mx-16 px-4 py-6">
		<!-- Outcome banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {outcomeColor(result.outcome)}">
			<div class="text-3xl font-bold">{outcomeLabel(result.outcome)}</div>
			<div class="mt-2 flex flex-wrap justify-center gap-6 text-sm">
				<span>{result.criticalFailures.length} critical failure{result.criticalFailures.length === 1 ? '' : 's'}</span>
				<span>{result.deficiencies.length} deficiency{result.deficiencies.length === 1 ? '' : 'ies'}</span>
				<span>{result.answeredCount}/{result.totalRules} competencies assessed</span>
			</div>
			<div class="mt-2 text-sm opacity-75">
				Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Flagged issues -->
		{#if result.additionalFlags.length > 0}
			<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-error">Flagged issues for examiner</h2>
				<div class="space-y-2">
					{#each result.additionalFlags as flag (flag.id)}
						<div class="flex items-start gap-3 rounded-lg border p-3 {priorityColor(flag.priority)}">
							<span class="mt-0.5 rounded px-2 py-0.5 text-xs font-bold uppercase {priorityColor(flag.priority)}">
								{flag.priority}
							</span>
							<div><span class="font-medium">{flag.category}:</span> {flag.message}</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Competency results -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Competency results</h2>
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
							<td class="py-2">
								<span class="inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold {triStateColor(rule.status)}">
									{triStateLabel(rule.status)}
								</span>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<!-- Candidate summary -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Candidate summary</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div><span class="font-medium text-base-content/70">Name:</span> {data.candidateDetails.firstName} {data.candidateDetails.lastName}</div>
				<div><span class="font-medium text-base-content/70">Candidate ID:</span> {data.candidateDetails.candidateId || 'N/A'}</div>
				<div>
					<span class="font-medium text-base-content/70">DOB:</span> {data.candidateDetails.dateOfBirth || 'N/A'}
					{#if calculateAge(data.candidateDetails.dateOfBirth)}(Age {calculateAge(data.candidateDetails.dateOfBirth)}){/if}
				</div>
				<div><span class="font-medium text-base-content/70">Venue:</span> {venueTypeLabel(data.candidateDetails.venueType)}{data.candidateDetails.venueName ? ` — ${data.candidateDetails.venueName}` : ''}</div>
				<div><span class="font-medium text-base-content/70">Session date:</span> {data.candidateDetails.sessionDate || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Examiner:</span> {data.candidateDetails.examinerName || 'N/A'}</div>
			</div>
		</div>

		<!-- Examiner debrief -->
		{#if data.overallResultSignoff.strengths || data.overallResultSignoff.developmentAreas || data.overallResultSignoff.examinerNotes || data.overallResultSignoff.candidateFeedback}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Debrief &amp; feedback</h2>
				<dl class="space-y-3 text-sm">
					{#if data.overallResultSignoff.strengths}
						<div><dt class="font-medium text-base-content/70">Strengths</dt><dd class="mt-1 text-base-content/80">{data.overallResultSignoff.strengths}</dd></div>
					{/if}
					{#if data.overallResultSignoff.developmentAreas}
						<div><dt class="font-medium text-base-content/70">Development areas</dt><dd class="mt-1 text-base-content/80">{data.overallResultSignoff.developmentAreas}</dd></div>
					{/if}
					{#if data.overallResultSignoff.examinerNotes}
						<div><dt class="font-medium text-base-content/70">Examiner notes</dt><dd class="mt-1 text-base-content/80">{data.overallResultSignoff.examinerNotes}</dd></div>
					{/if}
					{#if data.overallResultSignoff.candidateFeedback}
						<div><dt class="font-medium text-base-content/70">Candidate feedback</dt><dd class="mt-1 text-base-content/80">{data.overallResultSignoff.candidateFeedback}</dd></div>
					{/if}
				</dl>
			</div>
		{/if}
	</main>
{/if}
