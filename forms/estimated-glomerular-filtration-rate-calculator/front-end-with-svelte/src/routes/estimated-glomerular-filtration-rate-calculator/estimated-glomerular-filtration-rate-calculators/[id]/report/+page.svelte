<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import {
		stageLabel,
		stageColor,
		priorityLabel,
		priorityColor,
		careSettingLabel,
		clinicianRoleLabel,
		sexLabel,
		equationLabel,
		formatEgfr
	} from '#lib/engine/utils.js';
	import Button from '#lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/estimated-glomerular-filtration-rate-calculator/estimated-glomerular-filtration-rate-calculators/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(
				`/estimated-glomerular-filtration-rate-calculators/${id}/report/pdf`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ data: assessment.data, result: assessment.result })
				}
			);
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `egfr-${data.identification.patientIdentifier || id}.pdf`;
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
				(f) =>
					f.id === 'F-G4-NEPHROLOGY-REFERRAL-001' || f.id === 'F-G5-NEPHROLOGY-REFERRAL-001'
			)
	);
</script>

{#if result}
	<header class="border-b border-base-300 bg-base-100 shadow-sm no-print">
		<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
			<h1 class="text-lg font-bold text-base-content">eGFR report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button
					data-variant="secondary"
					onclick={() => goto(`/estimated-glomerular-filtration-rate-calculator/estimated-glomerular-filtration-rate-calculators/${id}`)}
					>Edit</Button
				>
			</div>
		</div>
	</header>

	<main class="mx-16 px-4 py-6">
		<!-- Result banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {stageColor(result.egfrStage)}">
			<div class="text-3xl font-bold">{formatEgfr(result.egfr)}</div>
			<div class="mt-2 text-sm font-semibold">{stageLabel(result.egfrStage)}</div>
			<div class="mt-2 text-sm opacity-75">
				Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Recommended action -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-2 text-lg font-bold text-base-content">Recommended action</h2>
			{#if result.egfrStage === null}
				<p class="text-sm text-base-content/80">
					A serum creatinine, age, and sex are all required to compute an eGFR. Record the missing
					input and re-calculate.
				</p>
			{:else if isReferral}
				<p class="text-sm text-base-content/80">
					This is a <strong>severely reduced eGFR</strong>. Refer to nephrology per NICE NG203,
					review renally-cleared medicines, and assess the complications of CKD.
				</p>
			{:else if result.egfrStage === 'G1' || result.egfrStage === 'G2'}
				<p class="text-sm text-base-content/80">
					The eGFR is <strong>normal or only mildly decreased</strong>. Interpret in clinical
					context; confirm chronicity over &ge; 3 months before assigning a CKD stage, and check
					albuminuria (ACR).
				</p>
			{:else}
				<p class="text-sm text-base-content/80">
					The eGFR indicates <strong>moderately reduced renal function</strong>. Monitor and manage
					per CKD guidance, review renally-cleared medicines, and check albuminuria (ACR) and blood
					pressure.
				</p>
			{/if}
		</div>

		<!-- Calculation -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Calculation</h2>
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-base-300 text-left text-base-content/70">
						<th class="pb-2 pr-4">Input</th>
						<th class="pb-2">Value</th>
					</tr>
				</thead>
				<tbody>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4">Serum creatinine</td>
						<td class="py-2"
							>{data.creatinine.serumCreatinine === null
								? 'Not recorded'
								: `${data.creatinine.serumCreatinine} µmol/L`}</td
						>
					</tr>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4">Serum creatinine (converted)</td>
						<td class="py-2"
							>{result.serumCreatinineMgDl === null
								? 'Not computed'
								: `${result.serumCreatinineMgDl} mg/dL`}</td
						>
					</tr>
					<tr class="border-b border-base-200 font-semibold">
						<td class="py-2 pr-4">eGFR (CKD-EPI 2021 creatinine)</td>
						<td class="py-2">{formatEgfr(result.egfr)}</td>
					</tr>
					<tr class="border-b border-base-200 font-semibold">
						<td class="py-2 pr-4">CKD G-stage</td>
						<td class="py-2">{result.egfrStage ?? 'N/A'}</td>
					</tr>
				</tbody>
			</table>
			<p class="mt-3 text-xs text-base-content/60">
				eGFR = 142 × min(Scr/κ, 1)^α × max(Scr/κ, 1)^−1.200 × 0.9938^age × (1.012 if female)
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
					{data.identification.ageYears === null ? 'N/A' : `${data.identification.ageYears} years`}
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
					<span class="font-medium text-base-content/70">Clinician:</span>
					{data.context.clinicianName || 'N/A'}
					{#if clinicianRoleLabel(data.context.clinicianRole)}
						({clinicianRoleLabel(data.context.clinicianRole)})
					{/if}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Equation:</span>
					{equationLabel(data.context.equation) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Specimen date:</span>
					{data.creatinine.specimenDate || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Steady state:</span>
					{data.creatinine.steadyState || 'Not recorded'}
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
