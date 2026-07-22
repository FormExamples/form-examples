<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import {
		categoryLabel,
		categoryColor,
		surveillanceBandLabel,
		priorityLabel,
		priorityColor,
		technicianRoleLabel,
		eligibilityRouteLabel,
		scanTypeLabel,
		sexLabel,
		formatDiameter
	} from '$lib/engine/utils';
	import Button from '$lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/abdominal-aortic-aneurysm-screening/abdominal-aortic-aneurysm-screenings/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/abdominal-aortic-aneurysm-screenings/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `aaa-screening-${data.identification.patientIdentifier || id}.pdf`;
				a.click();
				URL.revokeObjectURL(url);
			} else {
				pdfError = 'Failed to generate PDF. Please try again.';
			}
		} catch {
			pdfError = 'Failed to generate PDF. Please check your connection and try again.';
		}
	}

	const isReferral = $derived(
		!!result &&
			result.flaggedIssues.some(
				(f) => f.id === 'F-VASCULAR-REFERRAL-001' || f.id === 'F-SYMPTOMATIC-ANEURYSM-001'
			)
	);
</script>

{#if result}
	<header class="border-b border-base-300 bg-base-100 shadow-sm no-print">
		<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
			<h1 class="text-lg font-bold text-base-content">AAA screening report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button
					data-variant="secondary"
					onclick={() => goto(`/abdominal-aortic-aneurysm-screening/abdominal-aortic-aneurysm-screenings/${id}`)}>Edit</Button
				>
			</div>
		</div>
	</header>

	<main class="mx-16 px-4 py-6">
		<!-- Result banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {categoryColor(result.category)}">
			<div class="text-3xl font-bold">{formatDiameter(result.maxAorticDiameterCm)}</div>
			<div class="mt-2 text-sm font-semibold">{categoryLabel(result.category)}</div>
			<div class="mt-1 text-sm font-semibold">
				{surveillanceBandLabel(result.surveillanceBand)}
			</div>
			<div class="mt-2 text-sm opacity-75">
				Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Recommended action -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-2 text-lg font-bold text-base-content">Recommended action</h2>
			<p class="text-sm text-base-content/80">{result.recommendedAction}</p>
			{#if result.category === 'non-visualised'}
				<p class="mt-2 text-sm text-base-content/80">
					The aorta was <strong>not adequately measured</strong>, so the result cannot be classified
					as normal. Arrange a re-scan.
				</p>
			{:else if isReferral}
				<p class="mt-2 text-sm text-base-content/80">
					This result requires <strong>vascular referral</strong>. Refer to vascular surgery; if the
					patient is symptomatic arrange emergency assessment now.
				</p>
			{/if}
		</div>

		<!-- Measurement -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Ultrasound measurement</h2>
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-base-300 text-left text-base-content/70">
						<th class="pb-2 pr-4">Measurement</th>
						<th class="pb-2">Value</th>
					</tr>
				</thead>
				<tbody>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4">Aorta adequately visualised</td>
						<td class="py-2">{data.measurement.aortaVisualised || 'Not recorded'}</td>
					</tr>
					<tr class="border-b border-base-200 font-semibold">
						<td class="py-2 pr-4">Maximum aortic diameter</td>
						<td class="py-2">{formatDiameter(result.maxAorticDiameterCm)}</td>
					</tr>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4">Prior maximum diameter</td>
						<td class="py-2">{formatDiameter(data.measurement.priorMaxDiameterCm)}</td>
					</tr>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4">Growth since prior scan</td>
						<td class="py-2">{formatDiameter(result.growthCm)}</td>
					</tr>
				</tbody>
			</table>
			<p class="mt-3 text-xs text-base-content/60">
				Thresholds: normal &lt; 3.0 cm; small 3.0-4.4 cm; medium 4.5-5.4 cm; large &ge; 5.5 cm.
			</p>
		</div>

		<!-- Flagged issues -->
		{#if result.flaggedIssues.length > 0}
			<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-error">
					Flagged issues ({result.flaggedIssues.length})
				</h2>
				<div class="space-y-2">
					{#each result.flaggedIssues as flag (flag.id)}
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

		<!-- Patient / context summary -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Assessment summary</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div>
					<span class="font-medium text-base-content/70">Patient ID:</span>
					{data.identification.patientIdentifier || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Age:</span>
					{data.identification.age === null ? 'N/A' : data.identification.age}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Sex:</span>
					{sexLabel(data.identification.sex) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Eligibility:</span>
					{eligibilityRouteLabel(data.identification.eligibilityRoute) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Scan type:</span>
					{scanTypeLabel(data.identification.scanType) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Symptomatic:</span>
					{data.observations.symptomatic || 'Not recorded'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Technician:</span>
					{data.context.technicianName || 'N/A'}
					{#if technicianRoleLabel(data.context.technicianRole)}
						({technicianRoleLabel(data.context.technicianRole)})
					{/if}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Clinic site:</span>
					{data.context.clinicSite || 'N/A'}
				</div>
			</div>
			{#if data.observations.incidentalFindings}
				<div class="mt-4 text-sm">
					<span class="font-medium text-base-content/70">Incidental findings:</span>
					<p class="mt-1 text-base-content/80">{data.observations.incidentalFindings}</p>
				</div>
			{/if}
			{#if data.result.resultNote}
				<div class="mt-4 text-sm">
					<span class="font-medium text-base-content/70">Result note:</span>
					<p class="mt-1 text-base-content/80">{data.result.resultNote}</p>
				</div>
			{/if}
		</div>
	</main>
{/if}
