<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { request } from '$lib/stores/request.svelte';
	import {
		appropriatenessLabel,
		appropriatenessColor,
		timingLabel,
		timingColor,
		triageTierLabel,
		triageTierColor,
		recommendationLabel,
		recommendationColor,
		indicationLabel,
		priorityColor,
		selectedAssayLabels
	} from '$lib/engine/utils';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(request.data);
	const result = $derived(request.result);
	const assays = $derived(selectedAssayLabels(data));

	$effect(() => {
		if (!request.result) {
			goto(`/toxicology-test-request/toxicology-test-requests/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/toxicology-test-requests/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: request.data, result: request.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `toxicology-test-request-${data.patient.lastName || id}.pdf`;
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
			<h1 class="text-lg font-bold text-base-content">Toxicology test request report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/toxicology-test-request/toxicology-test-requests/${id}`)}>Edit</Button>
			</div>
		</div>
	</header>

	<main class="mx-16 px-4 py-6">
		<!-- Triage banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {triageTierColor(result.triageTier)}">
			<div class="text-3xl font-bold">{triageTierLabel(result.triageTier)}</div>
			<div class="mt-2 text-sm">{result.targetTimeframe || 'No target timeframe'}</div>
			<div class="mt-2 text-sm opacity-75">
				Generated {new Date(result.gradedAt).toLocaleString()}
			</div>
		</div>

		<!-- Four-axis grade -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Vetting grade (four axes)</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div class="flex items-center justify-between gap-2">
					<span class="font-medium text-base-content/70">A. Appropriateness ({result.appropriatenessScore}/9)</span>
					<Badge label={appropriatenessLabel(result.appropriatenessBand)} color={appropriatenessColor(result.appropriatenessBand)} />
				</div>
				<div class="flex items-center justify-between gap-2">
					<span class="font-medium text-base-content/70">B. Ingestion timing</span>
					<Badge label={timingLabel(result.timingBand)} color={timingColor(result.timingBand)} />
				</div>
				<div class="flex items-center justify-between gap-2">
					<span class="font-medium text-base-content/70">C. Request completeness</span>
					<span class="font-semibold text-base-content">{result.completenessPercent}%</span>
				</div>
				<div class="flex items-center justify-between gap-2">
					<span class="font-medium text-base-content/70">D. Triage priority</span>
					<Badge label={triageTierLabel(result.triageTier)} color={triageTierColor(result.triageTier)} />
				</div>
				<div class="flex items-center justify-between gap-2 sm:col-span-2">
					<span class="font-medium text-base-content/70">Recommendation</span>
					<Badge label={recommendationLabel(result.recommendation)} color={recommendationColor(result.recommendation)} />
				</div>
			</div>
		</div>

		<!-- Flagged issues -->
		{#if result.flags.length > 0}
			<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-error">Safety flags</h2>
				<div class="space-y-2">
					{#each result.flags as flag (flag.flagId)}
						<div class="flex items-start gap-3 rounded-lg border p-3 {priorityColor(flag.priority)}">
							<span class="mt-0.5 rounded px-2 py-0.5 text-xs font-bold uppercase {priorityColor(flag.priority)}">
								{flag.priority}
							</span>
							<div>
								<span class="font-medium">{flag.category}:</span> {flag.description}
								<div class="mt-1 text-xs opacity-80">{flag.suggestedAction}</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Fired rules -->
		{#if result.firedRules.length > 0}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Vetting justification</h2>
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b border-base-300 text-left text-base-content/70">
							<th class="pb-2 pr-4">Rule</th>
							<th class="pb-2 pr-4">Axis</th>
							<th class="pb-2">Finding</th>
						</tr>
					</thead>
					<tbody>
						{#each result.firedRules as rule (rule.ruleId)}
							<tr class="border-b border-base-200">
								<td class="py-2 pr-4 font-mono text-xs text-base-content/60">{rule.ruleId}</td>
								<td class="py-2 pr-4">{rule.axis}</td>
								<td class="py-2">{rule.description}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}

		<!-- Patient and request summary -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Patient and request summary</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div><span class="font-medium text-base-content/70">Name:</span> {data.patient.firstName} {data.patient.lastName}</div>
				<div><span class="font-medium text-base-content/70">DOB:</span> {data.patient.dateOfBirth || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">NHS number:</span> {data.patient.nhsNumber || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Indication:</span> {indicationLabel(data.clinical.primaryIndication)}</div>
				<div><span class="font-medium text-base-content/70">Requesting clinician:</span> {data.clinician.clinicianName || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Setting:</span> {data.triage.setting || 'N/A'}</div>
			</div>
		</div>

		<!-- Requested assays -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Requested assays</h2>
			{#if assays.length > 0}
				<ul class="list-disc space-y-1 pl-5 text-sm text-base-content/80">
					{#each assays as assay (assay)}
						<li>{assay}</li>
					{/each}
				</ul>
			{:else}
				<p class="text-sm text-base-content/60">No assays selected.</p>
			{/if}
		</div>
	</main>
{/if}
