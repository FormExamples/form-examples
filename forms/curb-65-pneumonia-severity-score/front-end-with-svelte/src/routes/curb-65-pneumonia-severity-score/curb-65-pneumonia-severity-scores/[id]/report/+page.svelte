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
		scoreVariantLabel,
		dispositionLabel,
		careSettingLabel,
		clinicianRoleLabel,
		sexLabel
	} from '$lib/engine/utils';
	import Button from '$lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/curb-65-pneumonia-severity-score/curb-65-pneumonia-severity-scores/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/curb-65-pneumonia-severity-scores/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `curb-65-assessment-${data.identification.patientIdentifier || id}.pdf`;
				a.click();
				URL.revokeObjectURL(url);
			} else {
				pdfError = 'Failed to generate PDF. Please try again.';
			}
		} catch {
			pdfError = 'Failed to generate PDF. Please check your connection and try again.';
		}
	}

	const confusionValue = $derived(
		data.confusion.confusionPresent === 'yes'
			? data.confusion.amtScore !== null
				? `Present (AMT ${data.confusion.amtScore})`
				: 'Present'
			: data.confusion.confusionPresent === 'no'
				? 'Absent'
				: 'Not recorded'
	);
	const ureaValue = $derived(
		data.urea.ureaMeasured !== 'yes'
			? 'Not measured (CRB-65)'
			: data.urea.ureaMmolL === null
				? 'Not recorded'
				: `${data.urea.ureaMmolL} mmol/L`
	);
	const bpValue = $derived(
		data.bloodPressure.systolicBp === null && data.bloodPressure.diastolicBp === null
			? 'Not recorded'
			: `${data.bloodPressure.systolicBp ?? '—'} / ${data.bloodPressure.diastolicBp ?? '—'} mmHg`
	);
</script>

{#if result}
	<header class="border-b border-base-300 bg-base-100 shadow-sm no-print">
		<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
			<h1 class="text-lg font-bold text-base-content">CURB-65 assessment report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button
					data-variant="secondary"
					onclick={() => goto(`/curb-65-pneumonia-severity-score/curb-65-pneumonia-severity-scores/${id}`)}>Edit</Button
				>
			</div>
		</div>
	</header>

	<main class="mx-16 px-4 py-6">
		<!-- Score banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {riskBandColor(result.riskBand)}">
			<div class="text-3xl font-bold">
				{scoreVariantLabel(result.scoreVariant)}
				{result.totalScore} of {result.scoreVariant === 'curb-65' ? 5 : 4}
			</div>
			<div class="mt-2 text-sm font-semibold">{riskBandLabel(result.riskBand)}</div>
			<div class="mt-2 text-sm opacity-75">
				Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Recommended action -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-2 text-lg font-bold text-base-content">Recommended action</h2>
			<p class="text-sm text-base-content/80">
				<strong>{dispositionLabel(result.recommendedDisposition)}.</strong>
				{result.recommendedSetting}
			</p>
			{#if data.disposition.clinicianOverrideBand}
				<p class="mt-3 text-sm text-base-content/80">
					<strong>Clinician override:</strong> final risk band set to
					{riskBandLabel(data.disposition.clinicianOverrideBand)}
					{#if data.disposition.overrideReason}— {data.disposition.overrideReason}{/if}
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
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4">Confusion (new-onset)</td>
						<td class="py-2 pr-4">{confusionValue}</td>
						<td class="py-2">
							<span
								class="rounded-full border px-2 py-0.5 text-xs font-bold {pointColor(
									result.confusionScore
								)}">{result.confusionScore}</span
							>
						</td>
					</tr>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4">Urea &gt; 7 mmol/L</td>
						<td class="py-2 pr-4">{ureaValue}</td>
						<td class="py-2">
							{#if result.scoreVariant === 'crb-65'}
								<span class="text-xs text-base-content/60">n/a</span>
							{:else}
								<span
									class="rounded-full border px-2 py-0.5 text-xs font-bold {pointColor(
										result.ureaScore
									)}">{result.ureaScore}</span
								>
							{/if}
						</td>
					</tr>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4">Respiratory rate &ge; 30/min</td>
						<td class="py-2 pr-4"
							>{data.respiratory.respiratoryRate === null
								? 'Not recorded'
								: `${data.respiratory.respiratoryRate} breaths/min`}</td
						>
						<td class="py-2">
							<span
								class="rounded-full border px-2 py-0.5 text-xs font-bold {pointColor(
									result.respiratoryRateScore
								)}">{result.respiratoryRateScore}</span
							>
						</td>
					</tr>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4">Systolic &lt; 90 or diastolic &le; 60 mmHg</td>
						<td class="py-2 pr-4">{bpValue}</td>
						<td class="py-2">
							<span
								class="rounded-full border px-2 py-0.5 text-xs font-bold {pointColor(
									result.bloodPressureScore
								)}">{result.bloodPressureScore}</span
							>
						</td>
					</tr>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4">Age &ge; 65 years</td>
						<td class="py-2 pr-4"
							>{data.age.ageYears === null ? 'Not recorded' : `${data.age.ageYears} years`}</td
						>
						<td class="py-2">
							<span
								class="rounded-full border px-2 py-0.5 text-xs font-bold {pointColor(
									result.ageScore
								)}">{result.ageScore}</span
							>
						</td>
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
					<span class="font-medium text-base-content/70">Sex:</span>
					{sexLabel(data.identification.sex) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Care setting:</span>
					{careSettingLabel(data.context.careSetting) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Assessed at:</span>
					{data.context.assessedAt || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Clinician:</span>
					{data.context.clinicianName || 'N/A'}
					{#if clinicianRoleLabel(data.context.clinicianRole)}
						({clinicianRoleLabel(data.context.clinicianRole)})
					{/if}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Variant:</span>
					{scoreVariantLabel(result.scoreVariant)}
				</div>
			</div>
			{#if data.disposition.clinicalNote}
				<div class="mt-4 text-sm">
					<span class="font-medium text-base-content/70">Clinical note:</span>
					<p class="mt-1 text-base-content/80">{data.disposition.clinicalNote}</p>
				</div>
			{/if}
		</div>
	</main>
{/if}
