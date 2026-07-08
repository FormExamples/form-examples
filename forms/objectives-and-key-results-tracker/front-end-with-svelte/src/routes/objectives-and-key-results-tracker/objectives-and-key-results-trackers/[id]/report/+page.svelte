<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { formState } from '$stores/formState.svelte';
	import { ragLabel, ragColor, flagPriorityColor } from '$engine/utils';
	import Button from '$lib/components/ui/Button.svelte';
	import RagBadge from '$lib/components/ui/RagBadge.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(formState.data);
	const result = $derived(formState.result);

	$effect(() => {
		if (!formState.result) {
			goto(`/objectives-and-key-results-tracker/objectives-and-key-results-trackers/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/objectives-and-key-results-trackers/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: formState.data, result: formState.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `okr-${data.objective.obj_title || id}.pdf`;
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
			<h1 class="text-lg font-bold text-base-content">OKR tracker report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/objectives-and-key-results-tracker/objectives-and-key-results-trackers/${id}`)}>Edit</Button>
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-4xl px-4 py-6">
		<!-- Composite RAG banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {ragColor(result.computedCompositeRag)}">
			<div class="text-3xl font-bold">{ragLabel(result.computedCompositeRag)}</div>
			<div class="mt-2 flex justify-center gap-6 text-sm">
				<span>Progress: {data.scores.progressPercent ?? '—'}%</span>
				<span>Confidence: {data.scores.confidenceDecile ?? '—'}/10</span>
			</div>
		</div>

		<!-- Flagged issues -->
		{#if result.flags.length > 0}
			<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-error">Flagged issues</h2>
				<div class="space-y-2">
					{#each result.flags as flag (flag.flagCode)}
						<div class="flex items-start gap-3 rounded-lg border p-3 {flagPriorityColor(flag.priority)}">
							<span class="mt-0.5 rounded px-2 py-0.5 text-xs font-bold uppercase {flagPriorityColor(flag.priority)}">
								{flag.priority}
							</span>
							<div><span class="font-medium">{flag.flagCode}:</span> {flag.description}</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Fired rules -->
		{#if result.rulesFired.length > 0}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Scoring justification</h2>
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b border-base-300 text-left text-base-content/70">
							<th class="pb-2 pr-4">Rule</th>
							<th class="pb-2 pr-4">Instrument</th>
							<th class="pb-2 pr-4">Finding</th>
							<th class="pb-2">Band</th>
						</tr>
					</thead>
					<tbody>
						{#each result.rulesFired as rule (rule.ruleId)}
							<tr class="border-b border-base-200">
								<td class="py-2 pr-4 font-mono text-xs text-base-content/60">{rule.ruleId}</td>
								<td class="py-2 pr-4">{rule.instrument}</td>
								<td class="py-2 pr-4">{rule.description}</td>
								<td class="py-2">
									{#if rule.grade === 'green' || rule.grade === 'amber' || rule.grade === 'red'}
										<RagBadge band={rule.grade} />
									{:else}
										<span class="text-base-content/70">{rule.grade}</span>
									{/if}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}

		<!-- Objective summary -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Objective summary</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div><span class="font-medium text-base-content/70">Title:</span> {data.objective.obj_title || '—'}</div>
				<div><span class="font-medium text-base-content/70">Level:</span> {data.cycle.level || '—'}</div>
				<div><span class="font-medium text-base-content/70">Reporter:</span> {data.reporter.name || '—'}</div>
				<div><span class="font-medium text-base-content/70">DRI:</span> {data.participants.dri || '—'}</div>
				<div><span class="font-medium text-base-content/70">Cycle:</span> {data.cycle.cycle || '—'}</div>
				<div><span class="font-medium text-base-content/70">Theme:</span> {data.objective.strategic_theme || '—'}</div>
			</div>
		</div>

		<!-- Key results -->
		{#if data.keyResults.length > 0}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Key results</h2>
				<ul class="list-disc space-y-1 pl-5 text-sm text-base-content/80">
					{#each data.keyResults as kr (kr.position)}
						<li>
							<strong>{kr.position}. {kr.title || '(untitled)'}</strong>
							{#if kr.krType}<span class="text-base-content/60"> — {kr.krType}</span>{/if}
							{#if kr.currentValue != null || kr.targetValue != null}
								<span> ({kr.currentValue ?? '—'} / {kr.targetValue ?? '—'})</span>
							{/if}
						</li>
					{/each}
				</ul>
			</div>
		{/if}
	</main>
{/if}
