<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import {
		statusLabel,
		statusColor,
		priorityLabel,
		priorityColor,
		presentColor,
		clinicianGradeLabel,
		observationTrendLabel,
		vteStatusLabel,
		escalationStatusLabel
	} from '$lib/engine/utils';
	import Button from '$lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/ward-round-note/ward-round-notes/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/ward-round-notes/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `ward-round-note-${data.identification.patientIdentifier || id}.pdf`;
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
			<h1 class="text-lg font-bold text-base-content">Ward round note report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/ward-round-note/ward-round-notes/${id}`)}>Edit</Button>
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-4xl px-4 py-6">
		<!-- Completeness banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {statusColor(result.status)}">
			<div class="text-3xl font-bold">{statusLabel(result.status)}</div>
			<div class="mt-2 text-sm font-semibold">
				{result.documentedRequired} of {result.totalRequired} required components documented ({result.completenessPercent}%
				complete)
			</div>
		</div>

		<div class="mb-6 text-center text-sm text-base-content/60">
			Generated {new Date(result.timestamp).toLocaleString()}
		</div>

		<!-- Interpretation -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-2 text-lg font-bold text-base-content">Interpretation</h2>
			<p class="text-sm text-base-content/80">
				{#if result.status === 'complete'}
					All required components are documented. The entry stands alone — another clinician can
					safely continue care between shifts. A <strong>Complete</strong> grade means the entry is
					well documented, not that the clinical care was correct.
				{:else if result.status === 'partial'}
					The review header and the plan are documented, but one or more other required components
					are missing. The entry is usable but has documentation gaps — complete the outstanding
					components.
				{:else}
					The <strong>review header or the plan is missing</strong>, or fewer than half the required
					components are documented. The entry cannot safely stand alone. Record the missing
					components before it is used to continue care.
				{/if}
			</p>
		</div>

		<!-- Review component presence -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Review component presence</h2>
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-base-300 text-left text-base-content/70">
						<th class="pb-2 pr-4">Component</th>
						<th class="pb-2 pr-4">Class</th>
						<th class="pb-2">Presence</th>
					</tr>
				</thead>
				<tbody>
					{#each result.componentStatuses as c (c.component)}
						<tr class="border-b border-base-200">
							<td class="py-2 pr-4">{c.label}</td>
							<td class="py-2 pr-4 text-base-content/70">
								{c.required ? 'Required' : 'Recommended'}
							</td>
							<td class="py-2">
								<span
									class="rounded-full border px-2 py-0.5 text-xs font-bold {presentColor(c.present)}"
									>{c.present ? 'Documented' : 'Absent'}</span
								>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<!-- Safety flags -->
		{#if result.flags.length > 0}
			<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-error">Safety flags ({result.flags.length})</h2>
				<div class="space-y-2">
					{#each result.flags as flag (flag.id)}
						<div class="flex items-start gap-3 rounded-lg border p-3 {priorityColor(flag.priority)}">
							<span
								class="mt-0.5 rounded px-2 py-0.5 text-xs font-bold uppercase {priorityColor(
									flag.priority
								)}"
							>
								{priorityLabel(flag.priority)}
							</span>
							<div>
								<span class="font-medium">{flag.category}:</span>
								{flag.description} — {flag.suggestedAction}
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Patient / review summary -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Review summary</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div>
					<span class="font-medium text-base-content/70">Patient ID:</span>
					{data.identification.patientIdentifier || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Admission date:</span>
					{data.identification.admissionDate || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Ward / location:</span>
					{data.header.ward || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Reviewed at:</span>
					{data.header.reviewedAt || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Clinician:</span>
					{data.header.clinicianName || 'N/A'}
					{#if clinicianGradeLabel(data.header.clinicianGrade)}
						({clinicianGradeLabel(data.header.clinicianGrade)})
					{/if}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Latest NEWS2:</span>
					{data.examination.news2Total === null ? 'N/A' : data.examination.news2Total}
					{#if observationTrendLabel(data.examination.observationTrend)}
						({observationTrendLabel(data.examination.observationTrend)})
					{/if}
				</div>
				<div>
					<span class="font-medium text-base-content/70">VTE assessment:</span>
					{vteStatusLabel(data.vte.vteStatus) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Escalation status:</span>
					{escalationStatusLabel(data.escalation.escalationStatus) || 'N/A'}
				</div>
			</div>
			{#if data.summary.clinicalNote}
				<div class="mt-4 text-sm">
					<span class="font-medium text-base-content/70">Clinical note:</span>
					<p class="mt-1 text-base-content/80">{data.summary.clinicalNote}</p>
				</div>
			{/if}
		</div>
	</main>
{/if}
