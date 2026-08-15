<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import {
		riskBandLabel,
		riskBandColor,
		priorityLabel,
		priorityColor,
		careSettingLabel,
		clinicianRoleLabel,
		presentingComplaintLabel,
		sexLabel,
		ageBandLabel,
		yesNoLabel,
		formatPoint,
		formatScore
	} from '#lib/engine/utils.js';
	import Button from '#lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/glasgow-blatchford-bleeding-score/glasgow-blatchford-bleeding-scores/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/glasgow-blatchford-bleeding-scores/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `glasgow-blatchford-${data.identification.patientIdentifier || id}.pdf`;
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
			<h1 class="text-lg font-bold text-base-content">Glasgow-Blatchford report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button
					data-variant="secondary"
					onclick={() => goto(`/glasgow-blatchford-bleeding-score/glasgow-blatchford-bleeding-scores/${id}`)}>Edit</Button
				>
			</div>
		</div>
	</header>

	<main class="mx-16 px-4 py-6">
		<!-- Result banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {riskBandColor(result.riskBand)}">
			<div class="text-3xl font-bold">
				Glasgow-Blatchford {formatScore(result.gbsScore, result.complete)} / 23
			</div>
			<div class="mt-2 text-sm font-semibold">{riskBandLabel(result.riskBand)}</div>
			<div class="mt-1 text-sm opacity-75">
				Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Recommended action -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-2 text-lg font-bold text-base-content">Recommended action</h2>
			{#if !result.complete}
				<p class="text-sm text-base-content/80">
					One or more parameters are missing, so the score is <strong>provisional</strong> and may
					understate risk. Record the missing parameter(s) and the patient's sex, then re-score; a
					Glasgow-Blatchford total is only valid once all eight parameters are answered.
				</p>
			{:else if result.riskBand === 'high'}
				<p class="text-sm text-base-content/80">
					<strong>High risk.</strong>
					{result.recommendedManagement}
				</p>
			{:else if result.riskBand === 'low-moderate'}
				<p class="text-sm text-base-content/80">
					<strong>Low-moderate risk.</strong>
					{result.recommendedManagement}
				</p>
			{:else}
				<p class="text-sm text-base-content/80">
					<strong>Very low risk.</strong>
					{result.recommendedManagement}
				</p>
			{/if}
		</div>

		<!-- Parameter scoring -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Parameter scoring</h2>
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-base-300 text-left text-base-content/70">
						<th class="pb-2 pr-4">Parameter</th>
						<th class="pb-2 pr-4">Value</th>
						<th class="pb-2">Points</th>
					</tr>
				</thead>
				<tbody>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4">Blood urea</td>
						<td class="py-2 pr-4"
							>{data.labs.bloodUrea === null ? 'Not recorded' : `${data.labs.bloodUrea} mmol/L`}</td
						>
						<td class="py-2">{formatPoint(result.bloodUreaPoints)}</td>
					</tr>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4">Haemoglobin</td>
						<td class="py-2 pr-4"
							>{data.labs.haemoglobin === null ? 'Not recorded' : `${data.labs.haemoglobin} g/L`}</td
						>
						<td class="py-2">{formatPoint(result.haemoglobinPoints)}</td>
					</tr>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4">Systolic blood pressure</td>
						<td class="py-2 pr-4"
							>{data.haemodynamics.systolicBloodPressure === null
								? 'Not recorded'
								: `${data.haemodynamics.systolicBloodPressure} mmHg`}</td
						>
						<td class="py-2">{formatPoint(result.systolicBloodPressurePoints)}</td>
					</tr>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4">Pulse</td>
						<td class="py-2 pr-4"
							>{data.haemodynamics.pulse === null
								? 'Not recorded'
								: `${data.haemodynamics.pulse} beats/min`}</td
						>
						<td class="py-2">{formatPoint(result.pulsePoint)}</td>
					</tr>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4">Melaena</td>
						<td class="py-2 pr-4">{yesNoLabel(data.clinicalMarkers.melaenaPresent) || 'Not recorded'}</td>
						<td class="py-2">{formatPoint(result.melaenaPoint)}</td>
					</tr>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4">Syncope</td>
						<td class="py-2 pr-4">{yesNoLabel(data.clinicalMarkers.syncope) || 'Not recorded'}</td>
						<td class="py-2">{formatPoint(result.syncopePoint)}</td>
					</tr>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4">Hepatic disease</td>
						<td class="py-2 pr-4">{yesNoLabel(data.clinicalMarkers.hepaticDisease) || 'Not recorded'}</td>
						<td class="py-2">{formatPoint(result.hepaticDiseasePoint)}</td>
					</tr>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4">Cardiac failure</td>
						<td class="py-2 pr-4">{yesNoLabel(data.clinicalMarkers.cardiacFailure) || 'Not recorded'}</td>
						<td class="py-2">{formatPoint(result.cardiacFailurePoint)}</td>
					</tr>
					<tr class="border-b border-base-200 font-semibold">
						<td class="py-2 pr-4">Glasgow-Blatchford total</td>
						<td class="py-2 pr-4"></td>
						<td class="py-2">{formatScore(result.gbsScore, result.complete)} / 23</td>
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
					<span class="font-medium text-base-content/70">Presenting complaint:</span>
					{presentingComplaintLabel(data.context.presentingComplaint) || 'N/A'}
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
