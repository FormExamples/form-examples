<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { gradeLabel, gradeColor, isAtOrAboveClinicalThreshold } from '$lib/engine/utils';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	const plural = 'medical-language-speaking-assessments-for-cymraeg';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/medical-language-speaking-assessment-for-cymraeg/${plural}/${id}`);
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
				a.download = `cymraeg-assessment-${data.candidate.candidateName || id}.pdf`;
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
			<h1 class="text-lg font-bold text-base-content">Cymraeg clinical-speaking report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/medical-language-speaking-assessment-for-cymraeg/${plural}/${id}`)}>Edit</Button>
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-4xl px-4 py-6">
		<!-- Overall grade banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {gradeColor(result.grade)}">
			<div class="text-3xl font-bold">{gradeLabel(result.grade)}</div>
			<div class="mt-2 flex flex-wrap justify-center gap-6 text-sm">
				<span>Scaled score {result.scaledScore} / 500</span>
				<span>Linguistic {result.linguisticTotal} / 24</span>
				<span>Clinical {result.clinicalTotal} / 15</span>
			</div>
			<div class="mt-2 text-sm opacity-75">
				{isAtOrAboveClinicalThreshold(result.grade)
					? 'At or above the typical Welsh-medium clinical threshold (Grade B / CEFR C1).'
					: 'Below the typical Welsh-medium clinical threshold (Grade B / CEFR C1).'}
			</div>
			<div class="mt-1 text-sm opacity-75">
				Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Flagged issues -->
		{#if result.additionalFlags.length > 0}
			<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-error">Flagged issues</h2>
				<div class="space-y-2">
					{#each result.additionalFlags as flag (flag.id)}
						<div class="flex items-start gap-3 rounded-lg border p-3 {priorityColor[flag.priority]}">
							<span
								class="mt-0.5 rounded px-2 py-0.5 text-xs font-bold uppercase {priorityColor[
									flag.priority
								]}"
							>
								{flag.priority}
							</span>
							<div><span class="font-medium">{flag.category}:</span> {flag.message}</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Per-criterion scores -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Per-criterion scores</h2>
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-base-300 text-left text-base-content/70">
						<th class="pb-2 pr-4">Criterion</th>
						<th class="pb-2 pr-4">Max</th>
						<th class="pb-2 pr-4">Role-play 1</th>
						<th class="pb-2 pr-4">Role-play 2</th>
						<th class="pb-2">Mean</th>
					</tr>
				</thead>
				<tbody>
					{#each result.perCriterionScores as s (s.id)}
						<tr class="border-b border-base-200">
							<td class="py-2 pr-4">{s.label}</td>
							<td class="py-2 pr-4 text-base-content/60">{s.maxScore}</td>
							<td class="py-2 pr-4">{s.rolePlay1Score ?? '—'}</td>
							<td class="py-2 pr-4">{s.rolePlay2Score ?? '—'}</td>
							<td class="py-2 font-semibold">{s.meanScore ?? '—'}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<!-- Candidate summary -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Candidate summary</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div><span class="font-medium text-base-content/70">Candidate ID:</span> {data.candidate.candidateId}</div>
				<div><span class="font-medium text-base-content/70">Name:</span> {data.candidate.candidateName}</div>
				<div><span class="font-medium text-base-content/70">Examiner:</span> {data.candidate.examinerName}</div>
				<div><span class="font-medium text-base-content/70">Test centre:</span> {data.candidate.testCentre || '—'}</div>
				<div><span class="font-medium text-base-content/70">Test date:</span> {data.candidate.testDate || '—'}</div>
				<div><span class="font-medium text-base-content/70">Grade</span> <Badge grade={result.grade} /></div>
			</div>
		</div>

		<!-- Examiner feedback -->
		{#if data.clinicalIndicators.examinerNotes.trim().length > 0}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Examiner feedback</h2>
				<p class="whitespace-pre-line text-sm text-base-content/80">
					{data.clinicalIndicators.examinerNotes}
				</p>
			</div>
		{/if}
	</main>
{/if}
