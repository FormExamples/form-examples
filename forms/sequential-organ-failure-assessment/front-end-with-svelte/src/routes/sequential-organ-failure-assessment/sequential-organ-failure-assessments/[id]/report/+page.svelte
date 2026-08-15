<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import {
		mortalityBandLabel,
		mortalityBandColor,
		priorityLabel,
		priorityColor,
		subScoreColor,
		careLocationLabel,
		roleLabel,
		sexLabel,
		suspectedInfectionLabel,
		respiratorySupportLabel,
		vasopressorLabel
	} from '#lib/engine/utils.js';
	import type { OrganSystem } from '#lib/engine/types.js';
	import Button from '#lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/sequential-organ-failure-assessment/sequential-organ-failure-assessments/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/sequential-organ-failure-assessments/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `sofa-assessment-${data.baseline.patientIdentifier || id}.pdf`;
				a.click();
				URL.revokeObjectURL(url);
			} else {
				pdfError = 'Failed to generate PDF. Please try again.';
			}
		} catch {
			pdfError = 'Failed to generate PDF. Please check your connection and try again.';
		}
	}

	const ratioText = $derived(
		data.respiration.pao2Fio2Ratio !== null
			? `${data.respiration.pao2Fio2Ratio} mmHg`
			: data.respiration.pao2 !== null &&
				  data.respiration.fio2 !== null &&
				  data.respiration.fio2 > 0
				? `${Math.round(data.respiration.pao2 / data.respiration.fio2)} mmHg (derived)`
				: 'Not recorded'
	);

	const systemRows = $derived(
		result
			? ([
					{
						system: 'respiration' as OrganSystem,
						label: 'Respiration (PaO2/FiO2)',
						value: `${ratioText}, ${respiratorySupportLabel(data.respiration.respiratorySupport) || 'support not recorded'}`,
						score: result.subScores.respiration
					},
					{
						system: 'coagulation' as OrganSystem,
						label: 'Coagulation (platelets)',
						value:
							data.coagulation.platelets === null
								? 'Not recorded'
								: `${data.coagulation.platelets} x10^9/L`,
						score: result.subScores.coagulation
					},
					{
						system: 'liver' as OrganSystem,
						label: 'Liver (bilirubin)',
						value: data.liver.bilirubin === null ? 'Not recorded' : `${data.liver.bilirubin} umol/L`,
						score: result.subScores.liver
					},
					{
						system: 'cardiovascular' as OrganSystem,
						label: 'Cardiovascular (MAP / vasopressor)',
						value: `${data.cardiovascular.map === null ? 'MAP not recorded' : `MAP ${data.cardiovascular.map} mmHg`}, ${vasopressorLabel(data.cardiovascular.vasopressor) || 'vasopressor not recorded'}`,
						score: result.subScores.cardiovascular
					},
					{
						system: 'cns' as OrganSystem,
						label: 'CNS (Glasgow Coma Scale)',
						value:
							data.cns.glasgowComaScale === null
								? 'Not recorded'
								: `GCS ${data.cns.glasgowComaScale}`,
						score: result.subScores.cns
					},
					{
						system: 'renal' as OrganSystem,
						label: 'Renal (creatinine / urine)',
						value: `${data.renal.creatinine === null ? 'Cr not recorded' : `Cr ${data.renal.creatinine} umol/L`}, ${data.renal.urineOutput === null ? 'UO not recorded' : `UO ${data.renal.urineOutput} mL/day`}`,
						score: result.subScores.renal
					}
				])
			: []
	);
</script>

{#if result}
	<header class="border-b border-base-300 bg-base-100 shadow-sm no-print">
		<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
			<h1 class="text-lg font-bold text-base-content">SOFA assessment report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button
					data-variant="secondary"
					onclick={() => goto(`/sequential-organ-failure-assessment/sequential-organ-failure-assessments/${id}`)}>Edit</Button
				>
			</div>
		</div>
	</header>

	<main class="mx-16 px-4 py-6">
		<!-- Score banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {mortalityBandColor(result.mortalityBand)}">
			<div class="text-3xl font-bold">Total SOFA {result.totalSofa} of 24</div>
			<div class="mt-2 text-sm font-semibold">
				{mortalityBandLabel(result.mortalityBand)} mortality-risk band
				{#if result.deltaSofa !== null}
					· Delta-SOFA {result.deltaSofa >= 0 ? '+' : ''}{result.deltaSofa}
				{/if}
			</div>
			<div class="mt-2 text-sm opacity-75">
				Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Recommended action -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-2 text-lg font-bold text-base-content">Recommended action</h2>
			{#if result.sepsis3}
				<p class="text-sm text-base-content/80">
					An acute rise in total SOFA of <strong>&ge; 2 points</strong> with suspected infection
					<strong>meets the Sepsis-3 criterion</strong>. Commence the sepsis six, obtain source
					control, and escalate to critical care.
				</p>
			{:else if result.totalSofa >= 12}
				<p class="text-sm text-base-content/80">
					A high total SOFA indicates significant organ dysfunction and high predicted ICU
					mortality. Ensure senior critical-care review and that ceilings of care and
					treatment-escalation plans are documented.
				</p>
			{:else}
				<p class="text-sm text-base-content/80">
					Continue current management and serial SOFA scoring. A rising score over the first 48
					hours predicts worse outcome regardless of the admission value — re-score if the patient
					deteriorates.
				</p>
			{/if}
			{#if !result.complete}
				<p class="mt-2 text-sm text-warning">
					One or more organ systems were not scored — the total may understate the true risk.
				</p>
			{/if}
		</div>

		<!-- Organ-system sub-scores -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Organ-system sub-scores</h2>
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-base-300 text-left text-base-content/70">
						<th class="pb-2 pr-4">System</th>
						<th class="pb-2 pr-4">Value</th>
						<th class="pb-2">Sub-score</th>
					</tr>
				</thead>
				<tbody>
					{#each systemRows as row (row.system)}
						<tr class="border-b border-base-200">
							<td class="py-2 pr-4">{row.label}</td>
							<td class="py-2 pr-4">{row.value}</td>
							<td class="py-2">
								<span
									class="rounded-full border px-2 py-0.5 text-xs font-bold {subScoreColor(row.score)}"
									>{row.score === null ? '—' : row.score}</span
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
					{data.baseline.patientIdentifier || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Age:</span>
					{data.baseline.ageYears === null ? 'N/A' : `${data.baseline.ageYears} y`}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Sex:</span>
					{sexLabel(data.baseline.sex) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Suspected infection:</span>
					{suspectedInfectionLabel(data.baseline.suspectedInfection) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Care location:</span>
					{careLocationLabel(data.context.careLocation) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Baseline SOFA:</span>
					{data.baseline.baselineSofaTotal === null ? 'N/A' : data.baseline.baselineSofaTotal}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Assessor:</span>
					{data.context.assessorName || 'N/A'}
					{#if roleLabel(data.context.assessorRole)}
						({roleLabel(data.context.assessorRole)})
					{/if}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Admission diagnosis:</span>
					{data.baseline.admissionDiagnosis || 'N/A'}
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
