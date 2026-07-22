<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import {
		riskCategoryLabel,
		riskCategoryColor,
		bandLabel,
		priorityLabel,
		priorityColor,
		careSettingLabel,
		clinicianRoleLabel,
		presentationTypeLabel,
		sexLabel,
		killipClassLabel,
		normaliseCreatinine
	} from '$lib/engine/utils';
	import Button from '$lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/grace-score-for-acute-coronary-syndrome/grace-scores-for-acute-coronary-syndrome/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/grace-scores-for-acute-coronary-syndrome/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `grace-assessment-${data.identification.patientIdentifier || id}.pdf`;
				a.click();
				URL.revokeObjectURL(url);
			} else {
				pdfError = 'Failed to generate PDF. Please try again.';
			}
		} catch {
			pdfError = 'Failed to generate PDF. Please check your connection and try again.';
		}
	}

	const creatValue = $derived.by(() => {
		if (data.renal.serumCreatinine === null) return 'Not recorded';
		const raw = `${data.renal.serumCreatinine} ${data.renal.serumCreatinineUnit || ''}`.trim();
		const mgdl = normaliseCreatinine(data.renal.serumCreatinine, data.renal.serumCreatinineUnit);
		return data.renal.serumCreatinineUnit === 'umol/L' && mgdl !== null
			? `${raw} (${mgdl.toFixed(2)} mg/dL)`
			: raw;
	});

	function yesNo(v: string): string {
		return v === 'yes' ? 'Yes' : v === 'no' ? 'No' : 'Not recorded';
	}
</script>

{#if result}
	<header class="border-b border-base-300 bg-base-100 shadow-sm no-print">
		<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
			<h1 class="text-lg font-bold text-base-content">GRACE assessment report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button
					data-variant="secondary"
					onclick={() => goto(`/grace-score-for-acute-coronary-syndrome/grace-scores-for-acute-coronary-syndrome/${id}`)}>Edit</Button
				>
			</div>
		</div>
	</header>

	<main class="mx-16 px-4 py-6">
		<!-- Score banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {riskCategoryColor(result.riskCategory)}">
			<div class="text-3xl font-bold">GRACE {result.gracePoints} points</div>
			<div class="mt-2 text-sm font-semibold">{riskCategoryLabel(result.riskCategory)}</div>
			<div class="mt-2 text-sm opacity-75">
				Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Mortality bands -->
		<div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
			<div class="rounded-xl border border-base-300 bg-base-100 p-4 text-center">
				<div class="text-xs font-semibold uppercase text-base-content/60">In-hospital mortality</div>
				<div class="mt-1 text-lg font-bold text-base-content">
					{bandLabel(result.inHospitalMortalityBand)}
				</div>
			</div>
			<div class="rounded-xl border border-base-300 bg-base-100 p-4 text-center">
				<div class="text-xs font-semibold uppercase text-base-content/60">6-month mortality</div>
				<div class="mt-1 text-lg font-bold text-base-content">
					{bandLabel(result.sixMonthMortalityBand)}
				</div>
			</div>
			<div class="rounded-xl border border-base-300 bg-base-100 p-4 text-center">
				<div class="text-xs font-semibold uppercase text-base-content/60">Overall (worse band)</div>
				<div class="mt-1 text-lg font-bold text-base-content">
					{riskCategoryLabel(result.riskCategory)}
				</div>
			</div>
		</div>

		<!-- Recommended strategy -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-2 text-lg font-bold text-base-content">Recommended strategy</h2>
			<p class="text-sm text-base-content/80">{result.invasiveStrategy}</p>
			<p class="mt-2 text-xs text-base-content/60">
				Bands: in-hospital &le; 108 low, 109&ndash;140 intermediate, &gt; 140 high; 6-month &le; 88
				low, 89&ndash;118 intermediate, &gt; 118 high. Overall category is the worse of the two.
			</p>
		</div>

		<!-- GRACE variables -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">GRACE variables</h2>
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-base-300 text-left text-base-content/70">
						<th class="pb-2 pr-4">Variable</th>
						<th class="pb-2 pr-4">Value</th>
						<th class="pb-2">Points</th>
					</tr>
				</thead>
				<tbody>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4">Age</td>
						<td class="py-2 pr-4"
							>{data.identification.ageYears === null
								? 'Not recorded'
								: `${data.identification.ageYears} years`}</td
						>
						<td class="py-2 font-bold">{result.agePoints}</td>
					</tr>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4">Heart rate</td>
						<td class="py-2 pr-4"
							>{data.haemodynamics.heartRate === null
								? 'Not recorded'
								: `${data.haemodynamics.heartRate} beats/min`}</td
						>
						<td class="py-2 font-bold">{result.heartRatePoints}</td>
					</tr>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4">Systolic BP (inverse weight)</td>
						<td class="py-2 pr-4"
							>{data.haemodynamics.systolicBloodPressure === null
								? 'Not recorded'
								: `${data.haemodynamics.systolicBloodPressure} mmHg`}</td
						>
						<td class="py-2 font-bold">{result.sbpPoints}</td>
					</tr>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4">Serum creatinine</td>
						<td class="py-2 pr-4">{creatValue}</td>
						<td class="py-2 font-bold">{result.creatininePoints}</td>
					</tr>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4">Killip class</td>
						<td class="py-2 pr-4"
							>{killipClassLabel(data.heartFailure.killipClass) || 'Not recorded'}</td
						>
						<td class="py-2 font-bold">{result.killipPoints}</td>
					</tr>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4">Cardiac arrest at admission</td>
						<td class="py-2 pr-4">{yesNo(data.highRiskFeatures.cardiacArrestAtAdmission)}</td>
						<td class="py-2 font-bold">{result.arrestPoints}</td>
					</tr>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4">ST-segment deviation</td>
						<td class="py-2 pr-4">{yesNo(data.highRiskFeatures.stSegmentDeviation)}</td>
						<td class="py-2 font-bold">{result.stPoints}</td>
					</tr>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4">Elevated cardiac enzymes</td>
						<td class="py-2 pr-4">{yesNo(data.highRiskFeatures.elevatedCardiacEnzymes)}</td>
						<td class="py-2 font-bold">{result.enzymePoints}</td>
					</tr>
					<tr class="border-t-2 border-base-300">
						<td class="py-2 pr-4 font-bold">Total</td>
						<td class="py-2 pr-4"></td>
						<td class="py-2 font-bold">{result.gracePoints}</td>
					</tr>
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
					<span class="font-medium text-base-content/70">Age:</span>
					{data.identification.ageYears === null ? 'N/A' : `${data.identification.ageYears} years`}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Sex:</span>
					{sexLabel(data.identification.sex) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Presentation:</span>
					{presentationTypeLabel(data.context.presentationType) || 'N/A'}
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
