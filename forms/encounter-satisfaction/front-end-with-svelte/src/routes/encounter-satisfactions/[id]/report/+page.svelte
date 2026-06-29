<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateAge, satisfactionScoreColor } from '$lib/engine/utils';
	import Button from '$lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/encounter-satisfactions/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/encounter-satisfactions/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `encounter-satisfaction-${data.demographics.lastName || id}.pdf`;
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
			<h1 class="text-lg font-bold text-base-content">Encounter satisfaction report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/encounter-satisfactions/${id}`)}>Edit</Button>
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-4xl px-4 py-6">
		<!-- Composite score banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {satisfactionScoreColor(result.compositeScore)}">
			<div class="text-3xl font-bold">{result.compositeScore.toFixed(1)}/5.0</div>
			<div class="mt-2 text-lg font-semibold">{result.category}</div>
			<div class="mt-2 text-sm opacity-75">
				{result.answeredCount} of 19 questions answered · Generated
				{new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Flagged issues -->
		{#if result.additionalFlags.length > 0}
			<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-error">Flagged issues</h2>
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

		<!-- Domain breakdown -->
		{#if result.domainScores.length > 0}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Score breakdown by domain</h2>
				<div class="space-y-6">
					{#each result.domainScores as domain (domain.domain)}
						<section>
							<h3 class="font-semibold text-base-content">{domain.domain} — {domain.mean.toFixed(1)}/5.0</h3>
							<progress class="progress mt-1 w-full" aria-label={`${domain.domain} score`} max={5} value={domain.mean}></progress>
							<table class="mt-2 w-full text-sm">
								<tbody>
									{#each domain.questions as q (q.id)}
										<tr class="border-b border-base-200">
											<td class="py-1 pr-3 font-mono text-xs text-base-content/60">{q.id}</td>
											<td class="py-1 pr-3">{q.text}</td>
											<td class="py-1 text-right">{q.score}/5</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</section>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Patient & visit summary -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Patient &amp; visit summary</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div><span class="font-medium text-base-content/70">Name:</span> {data.demographics.firstName} {data.demographics.lastName}</div>
				<div>
					<span class="font-medium text-base-content/70">DOB:</span> {data.demographics.dateOfBirth}
					{#if calculateAge(data.demographics.dateOfBirth)}(Age {calculateAge(data.demographics.dateOfBirth)}){/if}
				</div>
				<div><span class="font-medium text-base-content/70">Sex:</span> {data.demographics.sex || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Visit date:</span> {data.visitInformation.visitDate || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Department:</span> {data.visitInformation.department || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Provider:</span> {data.visitInformation.providerName || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Visit type:</span> {data.visitInformation.visitType || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">First visit:</span> {data.visitInformation.firstVisit || 'N/A'}</div>
			</div>
		</div>

		<!-- Patient comments -->
		{#if data.overallSatisfaction.comments}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Patient comments</h2>
				<p class="whitespace-pre-wrap text-sm text-base-content/80">{data.overallSatisfaction.comments}</p>
			</div>
		{/if}
	</main>
{/if}
