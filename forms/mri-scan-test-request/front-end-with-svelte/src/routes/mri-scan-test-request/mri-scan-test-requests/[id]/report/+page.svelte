<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { request } from '$lib/stores/request.svelte';
	import {
		bodyRegionLabel,
		indicationLabel,
		appropriatenessLabel,
		appropriatenessColor,
		mriSafetyLabel,
		mriSafetyColor,
		contrastRenalLabel,
		contrastRenalColor,
		triageTierLabel,
		triageTierColor,
		recommendationLabel,
		recommendationColor,
		priorityColor,
		calculateAge
	} from '$lib/engine/utils';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(request.data);
	const result = $derived(request.result);

	$effect(() => {
		if (!request.result) {
			goto(`/mri-scan-test-request/mri-scan-test-requests/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/mri-scan-test-requests/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: request.data, result: request.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `mri-scan-test-request-${data.patient.lastName || id}.pdf`;
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
			<h1 class="text-lg font-bold text-base-content">MRI request — vetting report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/mri-scan-test-request/mri-scan-test-requests/${id}`)}>Edit</Button>
			</div>
		</div>
	</header>

	<main class="mx-16 px-4 py-6">
		<!-- Recommendation banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {recommendationColor(result.recommendation)}">
			<div class="text-3xl font-bold">{recommendationLabel(result.recommendation)}</div>
			<div class="mt-2 flex flex-wrap justify-center gap-3 text-sm">
				<span class="inline-block rounded-full border px-3 py-1 font-semibold {triageTierColor(result.triageTier)}">
					{triageTierLabel(result.triageTier)}{result.targetTimeframe ? ` · ${result.targetTimeframe}` : ''}
				</span>
			</div>
			<div class="mt-2 text-sm opacity-75">
				Generated {new Date(result.gradedAt).toLocaleString()}
			</div>
		</div>

		<!-- Four-axis grade -->
		<div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
			<div class="rounded-xl border border-base-300 bg-base-100 p-5">
				<div class="text-sm font-medium text-base-content/70">A · Appropriateness</div>
				<div class="mt-2 flex items-center gap-3">
					<span class="text-2xl font-bold text-base-content">{result.appropriatenessScore}<span class="text-base font-normal text-base-content/60">/9</span></span>
					<Badge label={appropriatenessLabel(result.appropriatenessBand)} color={appropriatenessColor(result.appropriatenessBand)} />
				</div>
			</div>
			<div class="rounded-xl border border-base-300 bg-base-100 p-5">
				<div class="text-sm font-medium text-base-content/70">B · MRI safety</div>
				<div class="mt-2 flex flex-wrap items-center gap-2">
					<Badge label={mriSafetyLabel(result.mriSafetyBand)} color={mriSafetyColor(result.mriSafetyBand)} />
					{#if result.contrastRenalFlag !== 'none'}
						<Badge label={`Gad / renal: ${contrastRenalLabel(result.contrastRenalFlag)}`} color={contrastRenalColor(result.contrastRenalFlag)} />
					{/if}
				</div>
			</div>
			<div class="rounded-xl border border-base-300 bg-base-100 p-5">
				<div class="text-sm font-medium text-base-content/70">C · Completeness</div>
				<div class="mt-2 text-2xl font-bold text-base-content">{result.completenessPercent}%</div>
			</div>
			<div class="rounded-xl border border-base-300 bg-base-100 p-5">
				<div class="text-sm font-medium text-base-content/70">D · Triage priority</div>
				<div class="mt-2">
					<Badge label={triageTierLabel(result.triageTier)} color={triageTierColor(result.triageTier)} />
				</div>
			</div>
		</div>

		<!-- Safety flags -->
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
								<div class="mt-1 text-sm opacity-80">{flag.suggestedAction}</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Fired rules -->
		{#if result.firedRules.length > 0}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Fired rules</h2>
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b border-base-300 text-left text-base-content/70">
							<th class="pb-2 pr-4">Rule</th>
							<th class="pb-2 pr-4">Axis</th>
							<th class="pb-2">Description</th>
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

		<!-- Request summary -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Request summary</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div><span class="font-medium text-base-content/70">Patient:</span> {data.patient.firstName} {data.patient.lastName}</div>
				<div>
					<span class="font-medium text-base-content/70">DOB:</span> {data.patient.dateOfBirth}
					{#if calculateAge(data.patient.dateOfBirth)}(Age {calculateAge(data.patient.dateOfBirth)}){/if}
				</div>
				<div><span class="font-medium text-base-content/70">Body region:</span> {bodyRegionLabel(data.request.bodyRegion)}</div>
				<div><span class="font-medium text-base-content/70">Indication:</span> {indicationLabel(data.request.primaryIndication)}</div>
				<div class="sm:col-span-2"><span class="font-medium text-base-content/70">Clinical question:</span> {data.request.clinicalQuestion}</div>
				<div><span class="font-medium text-base-content/70">Requesting clinician:</span> {data.clinician.clinicianName}</div>
				<div><span class="font-medium text-base-content/70">Contrast:</span> {data.contrast.contrastRequired || 'N/A'}</div>
			</div>
		</div>
	</main>
{/if}
