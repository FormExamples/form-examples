<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import {
		childPughClassLabel,
		childPughClassColor,
		surgicalRiskLabel,
		priorityLabel,
		priorityColor,
		careSettingLabel,
		clinicianRoleLabel,
		aetiologyLabel,
		sexLabel,
		ageBandLabel,
		ascitesLabel,
		encephalopathyLabel,
		formatPoint,
		formatScore
	} from '$lib/engine/utils';
	import Button from '$lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/child-pugh-scores/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/child-pugh-scores/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `child-pugh-${data.identification.patientIdentifier || id}.pdf`;
				a.click();
				URL.revokeObjectURL(url);
			} else {
				pdfError = 'Failed to generate PDF. Please try again.';
			}
		} catch {
			pdfError = 'Failed to generate PDF. Please check your connection and try again.';
		}
	}

	const coagValue = $derived(
		data.coagulation.inr !== null
			? `INR ${data.coagulation.inr}`
			: data.coagulation.prothrombinTimeProlongation !== null
				? `PT +${data.coagulation.prothrombinTimeProlongation} s`
				: 'Not recorded'
	);
</script>

{#if result}
	<header class="border-b border-base-300 bg-base-100 shadow-sm no-print">
		<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
			<h1 class="text-lg font-bold text-base-content">Child-Pugh report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/child-pugh-scores/${id}`)}>Edit</Button
				>
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-4xl px-4 py-6">
		<!-- Result banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {childPughClassColor(result.childPughClass)}">
			<div class="text-3xl font-bold">
				Child-Pugh {formatScore(result.childPughScore, result.complete)}
			</div>
			<div class="mt-2 text-sm font-semibold">{childPughClassLabel(result.childPughClass)}</div>
			<div class="mt-2 text-sm opacity-75">
				~1-year survival {result.oneYearSurvival} · ~2-year survival {result.twoYearSurvival} ·
				peri-operative risk {surgicalRiskLabel(result.surgicalRisk)}
			</div>
			<div class="mt-1 text-sm opacity-75">
				Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Recommended action -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-2 text-lg font-bold text-base-content">Recommended action</h2>
			{#if !result.complete}
				<p class="text-sm text-base-content/80">
					One or more parameters are missing, so the score and class are <strong>provisional</strong
					>. Record the missing parameter(s) and re-score; a Child-Pugh total is only valid once all
					five parameters are answered.
				</p>
			{:else if result.childPughClass === 'C'}
				<p class="text-sm text-base-content/80">
					<strong>Class C — decompensated cirrhosis.</strong> Review goals of care, optimise
					management of decompensation, involve hepatology, and consider transplant assessment.
					Elective surgery carries prohibitive peri-operative risk.
				</p>
			{:else if result.childPughClass === 'B'}
				<p class="text-sm text-base-content/80">
					<strong>Class B — significant functional compromise.</strong> Optimise before elective
					surgery, involve anaesthetics early, and discuss the raised peri-operative risk with the
					patient.
				</p>
			{:else}
				<p class="text-sm text-base-content/80">
					<strong>Class A — well-compensated disease.</strong> Interpret in clinical context; the
					score supports prognostic discussion and is not a substitute for clinical judgement.
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
						<td class="py-2 pr-4">Total bilirubin</td>
						<td class="py-2 pr-4"
							>{data.bilirubin.totalBilirubin === null
								? 'Not recorded'
								: `${data.bilirubin.totalBilirubin} µmol/L`}</td
						>
						<td class="py-2">{formatPoint(result.bilirubinPoint)}</td>
					</tr>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4">Serum albumin</td>
						<td class="py-2 pr-4"
							>{data.albumin.serumAlbumin === null
								? 'Not recorded'
								: `${data.albumin.serumAlbumin} g/L`}</td
						>
						<td class="py-2">{formatPoint(result.albuminPoint)}</td>
					</tr>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4">Coagulation</td>
						<td class="py-2 pr-4">{coagValue}</td>
						<td class="py-2">{formatPoint(result.coagulationPoint)}</td>
					</tr>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4">Ascites</td>
						<td class="py-2 pr-4">{ascitesLabel(data.ascitesStep.ascites) || 'Not graded'}</td>
						<td class="py-2">{formatPoint(result.ascitesPoint)}</td>
					</tr>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4">Hepatic encephalopathy</td>
						<td class="py-2 pr-4"
							>{encephalopathyLabel(data.encephalopathyStep.encephalopathy) || 'Not graded'}</td
						>
						<td class="py-2">{formatPoint(result.encephalopathyPoint)}</td>
					</tr>
					<tr class="border-b border-base-200 font-semibold">
						<td class="py-2 pr-4">Child-Pugh total</td>
						<td class="py-2 pr-4"></td>
						<td class="py-2">{formatScore(result.childPughScore, result.complete)}</td>
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
					<span class="font-medium text-base-content/70">Aetiology:</span>
					{aetiologyLabel(data.context.aetiology) || 'N/A'}
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
