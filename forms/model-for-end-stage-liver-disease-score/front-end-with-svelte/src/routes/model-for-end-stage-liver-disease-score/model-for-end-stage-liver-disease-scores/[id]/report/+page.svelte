<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import {
		mortalityBandLabel,
		mortalityBandColor,
		meldVariantLabel,
		priorityLabel,
		priorityColor,
		careSettingLabel,
		clinicianRoleLabel,
		sexLabel,
		ageBandLabel,
		formatScore
	} from '#lib/engine/utils.js';
	import Button from '#lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/model-for-end-stage-liver-disease-score/model-for-end-stage-liver-disease-scores/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/model-for-end-stage-liver-disease-scores/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `meld-score-${data.identification.patientIdentifier || id}.pdf`;
				a.click();
				URL.revokeObjectURL(url);
			} else {
				pdfError = 'Failed to generate PDF. Please try again.';
			}
		} catch {
			pdfError = 'Failed to generate PDF. Please check your connection and try again.';
		}
	}

	const biliUnit = $derived(data.bilirubin.bilirubinUnit || 'mg/dL');
	const creatUnit = $derived(data.renal.creatinineUnit || 'mg/dL');
</script>

{#if result}
	<header class="border-b border-base-300 bg-base-100 shadow-sm no-print">
		<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
			<h1 class="text-lg font-bold text-base-content">MELD score report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button
					data-variant="secondary"
					onclick={() => goto(`/model-for-end-stage-liver-disease-score/model-for-end-stage-liver-disease-scores/${id}`)}>Edit</Button
				>
			</div>
		</div>
	</header>

	<main class="mx-16 px-4 py-6">
		<!-- Result banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {mortalityBandColor(result.mortalityBand)}">
			<div class="text-3xl font-bold">{formatScore(result.meldScore)}</div>
			<div class="mt-2 text-sm font-semibold">
				{meldVariantLabel(data.context.meldVariant) || 'MELD'} — {mortalityBandLabel(
					result.mortalityBand
				)}
			</div>
			<div class="mt-2 text-sm opacity-75">
				Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Recommended action -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-2 text-lg font-bold text-base-content">Recommended action</h2>
			{#if result.meldScore === null}
				<p class="text-sm text-base-content/80">
					A laboratory input required by the chosen instrument is missing, so no MELD score can be
					computed. Record the missing value and re-calculate.
				</p>
			{:else if result.meldScore >= 30}
				<p class="text-sm text-base-content/80">
					MELD {result.meldScore} indicates <strong>very high short-term mortality</strong>. Arrange
					urgent hepatology / critical-care review and discuss with a transplant centre.
				</p>
			{:else if result.meldScore >= 15}
				<p class="text-sm text-base-content/80">
					MELD {result.meldScore} is <strong>at or above the transplant-benefit threshold</strong>.
					Refer to, or discuss with, a liver transplant centre.
				</p>
			{:else}
				<p class="text-sm text-base-content/80">
					MELD {result.meldScore} reflects <strong>lower short-term mortality</strong>. Continue
					hepatology management and monitor; re-calculate as laboratory values change.
				</p>
			{/if}
		</div>

		<!-- Calculation inputs -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Calculation inputs</h2>
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-base-300 text-left text-base-content/70">
						<th class="pb-2 pr-4">Input</th>
						<th class="pb-2">Value</th>
					</tr>
				</thead>
				<tbody>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4">Total bilirubin</td>
						<td class="py-2"
							>{data.bilirubin.bilirubin === null
								? 'Not recorded'
								: `${data.bilirubin.bilirubin} ${biliUnit}`}</td
						>
					</tr>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4">INR</td>
						<td class="py-2">{data.inr.inr === null ? 'Not recorded' : data.inr.inr}</td>
					</tr>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4">Serum creatinine</td>
						<td class="py-2"
							>{data.renal.creatinine === null
								? 'Not recorded'
								: `${data.renal.creatinine} ${creatUnit}`}</td
						>
					</tr>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4">Dialysis rule</td>
						<td class="py-2"
							>{result.dialysisRuleApplied
								? 'Applied — creatinine set to 4.0 mg/dL'
								: 'Not applied'}</td
						>
					</tr>
					{#if data.context.meldVariant === 'meld-na' || data.context.meldVariant === 'meld-3'}
						<tr class="border-b border-base-200">
							<td class="py-2 pr-4">Serum sodium</td>
							<td class="py-2"
								>{data.sodium.sodium === null ? 'Not recorded' : `${data.sodium.sodium} mEq/L`}</td
							>
						</tr>
					{/if}
					{#if data.context.meldVariant === 'meld-3'}
						<tr class="border-b border-base-200">
							<td class="py-2 pr-4">Serum albumin</td>
							<td class="py-2"
								>{data.albumin.albumin === null ? 'Not recorded' : `${data.albumin.albumin} g/dL`}</td
							>
						</tr>
					{/if}
					<tr class="border-b border-base-200 font-semibold">
						<td class="py-2 pr-4">MELD score (6-40)</td>
						<td class="py-2">{formatScore(result.meldScore)}</td>
					</tr>
				</tbody>
			</table>
			<p class="mt-3 text-xs text-base-content/60">
				meld = round(3.78·ln(bilirubin) + 11.2·ln(INR) + 9.57·ln(creatinine) + 6.43), with the
				dialysis rule, value bounds, and sodium correction applied per the chosen instrument.
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
					<span class="font-medium text-base-content/70">Age band:</span>
					{ageBandLabel(data.identification.ageBand) || 'N/A'}
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
					<span class="font-medium text-base-content/70">Instrument:</span>
					{meldVariantLabel(data.context.meldVariant) || 'N/A'}
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
