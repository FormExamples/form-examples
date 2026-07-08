<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import {
		riskBandLabel,
		riskBandColor,
		priorityLabel,
		priorityColor,
		pointColor,
		careSettingLabel,
		clinicianRoleLabel,
		sexLabel,
		workingDiagnosisLabel
	} from '$lib/engine/utils';
	import type { YesNo } from '$lib/engine/types';
	import Button from '$lib/components/ui/Button.svelte';

	const plural = 'timi-risk-score-for-acute-coronary-syndromes';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/timi-risk-score-for-acute-coronary-syndrome/${plural}/${id}`);
		}
	});

	function yesNoLabel(v: YesNo): string {
		return v === 'yes' ? 'Yes' : v === 'no' ? 'No' : 'Not recorded';
	}

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
				a.download = `timi-assessment-${data.identification.patientIdentifier || id}.pdf`;
				a.click();
				URL.revokeObjectURL(url);
			} else {
				pdfError = 'Failed to generate PDF. Please try again.';
			}
		} catch {
			pdfError = 'Failed to generate PDF. Please check your connection and try again.';
		}
	}

	const criteria = $derived(
		result
			? [
					{ label: 'Age &ge; 65 years', value: data.riskProfile.ageOver65, point: result.agePoint },
					{
						label: '&ge; 3 coronary risk factors',
						value: data.riskProfile.threeOrMoreCadRiskFactors,
						point: result.riskFactorPoint
					},
					{
						label: 'Known CAD (stenosis &ge; 50%)',
						value: data.cardiacHistory.knownCadStenosis,
						point: result.knownCadPoint
					},
					{
						label: 'Aspirin use in prior 7 days',
						value: data.cardiacHistory.aspirinUsePrior7Days,
						point: result.aspirinPoint
					},
					{
						label: '&ge; 2 anginal episodes in 24 h',
						value: data.presentation.twoOrMoreAnginaEpisodes24h,
						point: result.anginaPoint
					},
					{
						label: 'ST deviation &ge; 0.5 mm',
						value: data.investigations.stDeviation,
						point: result.stDeviationPoint
					},
					{
						label: 'Positive cardiac marker',
						value: data.investigations.positiveCardiacMarker,
						point: result.cardiacMarkerPoint
					}
				]
			: []
	);
</script>

{#if result}
	<header class="border-b border-base-300 bg-base-100 shadow-sm no-print">
		<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
			<h1 class="text-lg font-bold text-base-content">TIMI UA/NSTEMI assessment report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/timi-risk-score-for-acute-coronary-syndrome/${plural}/${id}`)}>Edit</Button>
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-4xl px-4 py-6">
		<!-- Score banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {riskBandColor(result.riskBand)}">
			<div class="text-3xl font-bold">TIMI {result.timiScore} of 7</div>
			<div class="mt-2 text-sm font-semibold">{riskBandLabel(result.riskBand)}</div>
			<div class="mt-1 text-sm font-semibold">
				~{result.fourteenDayRiskPercent}% 14-day risk of death, MI, or urgent revascularisation
			</div>
			<div class="mt-2 text-sm opacity-75">
				Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Recommended action -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-2 text-lg font-bold text-base-content">Recommended action</h2>
			{#if result.riskBand === 'high'}
				<p class="text-sm text-base-content/80">
					<strong>High risk.</strong> Pursue an early invasive strategy with urgent cardiology /
					coronary-care involvement and intensified antithrombotic and anti-ischaemic therapy.
				</p>
			{:else if result.riskBand === 'intermediate'}
				<p class="text-sm text-base-content/80">
					<strong>Intermediate risk.</strong> Admit for observation with guideline-directed medical
					therapy; an early invasive strategy should be considered for most, with cardiology review.
				</p>
			{:else}
				<p class="text-sm text-base-content/80">
					<strong>Low risk.</strong> Consider a conservative, ischaemia-guided strategy with
					continued monitoring and serial troponin. A low score does not exclude an acute coronary
					syndrome — re-score if the patient deteriorates.
				</p>
			{/if}
		</div>

		<!-- Criteria -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Criteria</h2>
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-base-300 text-left text-base-content/70">
						<th class="pb-2 pr-4">Criterion</th>
						<th class="pb-2 pr-4">Value</th>
						<th class="pb-2">Point</th>
					</tr>
				</thead>
				<tbody>
					{#each criteria as c (c.label)}
						<tr class="border-b border-base-200">
							<td class="py-2 pr-4">{@html c.label}</td>
							<td class="py-2 pr-4">{yesNoLabel(c.value)}</td>
							<td class="py-2">
								<span
									class="rounded-full border px-2 py-0.5 text-xs font-bold {pointColor(c.point)}"
									>{c.point}</span
								>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
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
					<span class="font-medium text-base-content/70">Sex:</span>
					{sexLabel(data.identification.sex) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Working diagnosis:</span>
					{workingDiagnosisLabel(data.context.workingDiagnosis) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Care setting:</span>
					{careSettingLabel(data.context.careSetting) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Clinician:</span>
					{data.context.clinicianName || 'N/A'}
					{#if clinicianRoleLabel(data.context.clinicianRole)}
						({clinicianRoleLabel(data.context.clinicianRole)})
					{/if}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Assessed at:</span>
					{data.context.assessedAt || 'N/A'}
				</div>
			</div>
			{#if data.note.clinicalNote}
				<div class="mt-4 text-sm">
					<span class="font-medium text-base-content/70">Clinical note:</span>
					<p class="mt-1 text-base-content/80">{data.note.clinicalNote}</p>
				</div>
			{/if}
		</div>
	</main>
{/if}
