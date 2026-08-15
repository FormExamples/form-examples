<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import {
		categoryColor,
		categoryDescription,
		severityColor,
		priorityColor,
		calculateAge
	} from '#lib/engine/utils.js';
	import Button from '#lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/post-traumatic-stress-assessment/post-traumatic-stress-assessments/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/post-traumatic-stress-assessments/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `post-traumatic-stress-assessment-${data.demographics.lastName || id}.pdf`;
				a.click();
				URL.revokeObjectURL(url);
			} else {
				pdfError = 'Failed to generate PDF. Please try again.';
			}
		} catch {
			pdfError = 'Failed to generate PDF. Please check your connection and try again.';
		}
	}

	const clusters = $derived(
		result
			? [
					{ label: 'B — Intrusion', value: result.clusterScores.b, max: 20 },
					{ label: 'C — Avoidance', value: result.clusterScores.c, max: 8 },
					{ label: 'D — Neg. Alterations', value: result.clusterScores.d, max: 28 },
					{ label: 'E — Arousal', value: result.clusterScores.e, max: 24 }
				]
			: []
	);
</script>

{#if result}
	<header class="border-b border-base-300 bg-base-100 shadow-sm no-print">
		<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
			<h1 class="text-lg font-bold text-base-content">PCL-5 assessment report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button
					data-variant="secondary"
					onclick={() => goto(`/post-traumatic-stress-assessment/post-traumatic-stress-assessments/${id}`)}>Edit</Button
				>
			</div>
		</div>
	</header>

	<main class="mx-16 px-4 py-6">
		<!-- Total score & severity banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {categoryColor(result.category)}">
			<div class="text-4xl font-bold">{result.totalScore} / 80</div>
			<div class="mt-1 text-xl font-semibold">{result.category}</div>
			<div class="mt-1 text-sm">{categoryDescription(result.category)}</div>
			{#if result.probableDsm5Diagnosis}
				<div class="mt-3 inline-block rounded-lg bg-base-100/70 px-3 py-2 text-sm font-medium text-base-content">
					DSM-5 symptom pattern met — probable PTSD (provisional)
				</div>
			{/if}
			<div class="mt-2 text-sm opacity-75">
				Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Cluster subscores -->
		<div class="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
			{#each clusters as c (c.label)}
				<div class="rounded-lg border border-base-300 bg-base-100 p-3 text-center">
					<div class="text-xs uppercase text-base-content/60">{c.label}</div>
					<div class="text-lg font-semibold text-base-content">{c.value} / {c.max}</div>
				</div>
			{/each}
		</div>

		<!-- Flagged issues -->
		{#if result.additionalFlags.length > 0}
			<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-error">Flagged issues for clinician</h2>
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

		<!-- Fired rules -->
		{#if result.firedRules.length > 0}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Scoring justification</h2>
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b border-base-300 text-left text-base-content/70">
							<th class="pb-2 pr-4">Rule</th>
							<th class="pb-2 pr-4">Category</th>
							<th class="pb-2 pr-4">Finding</th>
							<th class="pb-2">Severity</th>
						</tr>
					</thead>
					<tbody>
						{#each result.firedRules as rule (rule.id)}
							<tr class="border-b border-base-200">
								<td class="py-2 pr-4 font-mono text-xs text-base-content/60">{rule.id}</td>
								<td class="py-2 pr-4">{rule.category}</td>
								<td class="py-2 pr-4">{rule.description}</td>
								<td class="py-2">
									<span
										class="inline-block rounded-full border px-3 py-1 text-xs font-bold uppercase {severityColor(rule.severity)}"
										>{rule.severity}</span
									>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}

		<!-- Patient summary -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Patient summary</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div>
					<span class="font-medium text-base-content/70">Name:</span>
					{data.demographics.firstName} {data.demographics.lastName}
				</div>
				<div>
					<span class="font-medium text-base-content/70">DOB:</span> {data.demographics.dateOfBirth}
					{#if calculateAge(data.demographics.dateOfBirth)}(Age {calculateAge(
							data.demographics.dateOfBirth
						)}){/if}
				</div>
				<div><span class="font-medium text-base-content/70">Sex:</span> {data.demographics.sex || 'N/A'}</div>
				<div>
					<span class="font-medium text-base-content/70">Trauma event:</span>
					{data.traumaEvent.eventDescription || 'Not specified'}
				</div>
			</div>
		</div>
	</main>
{/if}
