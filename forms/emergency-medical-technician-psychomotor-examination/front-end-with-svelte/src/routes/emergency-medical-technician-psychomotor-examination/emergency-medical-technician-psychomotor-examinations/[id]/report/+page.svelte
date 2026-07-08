<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import {
		outcomeLabel,
		outcomeColor,
		triStateLabel,
		triStateColor,
		priorityColor,
		formatPercent,
		candidateName
	} from '$lib/engine/utils';
	import Button from '$lib/components/ui/Button.svelte';

	const plural = 'emergency-medical-technician-psychomotor-examinations';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/emergency-medical-technician-psychomotor-examination/${plural}/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/${plural}/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `emt-psychomotor-examination-${data.candidateExaminerScenario.candidateLastName || id}.pdf`;
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
	{@const c = data.candidateExaminerScenario}
	<header class="border-b border-base-300 bg-base-100 shadow-sm no-print">
		<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
			<h1 class="text-lg font-bold text-base-content">EMT psychomotor examination report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/emergency-medical-technician-psychomotor-examination/${plural}/${id}`)}>Edit</Button>
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-4xl px-4 py-6">
		<!-- Outcome banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {outcomeColor(result.outcome)}">
			<div class="text-3xl font-bold">{outcomeLabel(result.outcome)}</div>
			<div class="mt-2 flex justify-center gap-6 text-sm">
				<span>{result.points} / {result.maxPoints} points</span>
				<span>{formatPercent(result.percent)}</span>
				<span>{result.answeredCount} of {result.totalRules} items scored</span>
			</div>
			<div class="mt-2 text-sm opacity-75">
				Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Critical-criteria failures -->
		{#if result.criticalFailures.length > 0}
			<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-error">Critical-criteria failures</h2>
				<ul class="list-disc space-y-1 pl-5 text-sm text-base-content/80">
					{#each result.criticalFailures as rule (rule.id)}
						<li><span class="font-medium">{rule.category}:</span> {rule.description}</li>
					{/each}
				</ul>
			</div>
		{/if}

		<!-- Flagged issues -->
		{#if result.additionalFlags.length > 0}
			<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-error">Flagged issues for the debrief</h2>
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

		<!-- Checklist results -->
		{#if result.firedRules.length > 0}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Checklist scoring</h2>
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b border-base-300 text-left text-base-content/70">
							<th class="pb-2 pr-4">Item</th>
							<th class="pb-2 pr-4">Category</th>
							<th class="pb-2 pr-4">Skill</th>
							<th class="pb-2 pr-4">Points</th>
							<th class="pb-2">Result</th>
						</tr>
					</thead>
					<tbody>
						{#each result.firedRules as rule (rule.id)}
							<tr class="border-b border-base-200">
								<td class="py-2 pr-4 font-mono text-xs text-base-content/60">{rule.id}</td>
								<td class="py-2 pr-4">
									{rule.category}{#if rule.critical}<span class="ml-1 text-xs font-bold text-error">(critical)</span>{/if}
								</td>
								<td class="py-2 pr-4">{rule.description}</td>
								<td class="py-2 pr-4">{rule.pointsAwarded} / {rule.points}</td>
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
		{/if}

		<!-- Candidate summary -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Candidate &amp; scenario</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div><span class="font-medium text-base-content/70">Candidate:</span> {candidateName(c.candidateFirstName, c.candidateLastName) || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Candidate ID:</span> {c.candidateId || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Attempt:</span> {c.attempt === 'retest' ? 'Retest' : c.attempt === 'first-attempt' ? 'First attempt' : 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Examiner:</span> {c.examinerName || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Session date:</span> {c.sessionDate || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Station / location:</span> {c.stationLocation || 'N/A'}</div>
				<div class="sm:col-span-2"><span class="font-medium text-base-content/70">Chief complaint:</span> {c.chiefComplaintGiven || 'N/A'}</div>
				{#if c.scenarioSummary}
					<div class="sm:col-span-2"><span class="font-medium text-base-content/70">Scenario:</span> {c.scenarioSummary}</div>
				{/if}
			</div>
		</div>

		<!-- Examiner notes -->
		{#if data.criticalCriteriaReview.examinerNotes || data.criticalCriteriaReview.debriefNotes}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Examiner &amp; debrief notes</h2>
				<dl class="space-y-3 text-sm">
					{#if data.criticalCriteriaReview.examinerNotes}
						<div>
							<dt class="font-medium text-base-content/70">Examiner notes</dt>
							<dd class="mt-1 text-base-content/80">{data.criticalCriteriaReview.examinerNotes}</dd>
						</div>
					{/if}
					{#if data.criticalCriteriaReview.debriefNotes}
						<div>
							<dt class="font-medium text-base-content/70">Debrief notes</dt>
							<dd class="mt-1 text-base-content/80">{data.criticalCriteriaReview.debriefNotes}</dd>
						</div>
					{/if}
				</dl>
			</div>
		{/if}
	</main>
{/if}
