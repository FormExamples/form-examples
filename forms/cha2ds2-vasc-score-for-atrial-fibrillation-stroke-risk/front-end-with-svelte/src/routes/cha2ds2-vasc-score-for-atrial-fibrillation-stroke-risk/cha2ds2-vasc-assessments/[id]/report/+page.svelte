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
		anticoagulationLabel,
		careSettingLabel,
		clinicianRoleLabel,
		atrialFibrillationTypeLabel,
		sexLabel,
		ageBandLabel
	} from '$lib/engine/utils';
	import Button from '$lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/cha2ds2-vasc-score-for-atrial-fibrillation-stroke-risk/cha2ds2-vasc-assessments/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/cha2ds2-vasc-assessments/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `cha2ds2-vasc-assessment-${data.identification.patientIdentifier || id}.pdf`;
				a.click();
				URL.revokeObjectURL(url);
			} else {
				pdfError = 'Failed to generate PDF. Please try again.';
			}
		} catch {
			pdfError = 'Failed to generate PDF. Please check your connection and try again.';
		}
	}

	const yesNo = (v: string) => (v === 'yes' ? 'Yes' : v === 'no' ? 'No' : 'Not recorded');
	const ageValue = $derived(
		data.identification.ageYears === null ? 'Not recorded' : `${data.identification.ageYears} years`
	);
</script>

{#if result}
	<header class="border-b border-base-300 bg-base-100 shadow-sm no-print">
		<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
			<h1 class="text-lg font-bold text-base-content">CHA2DS2-VASc assessment report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button
					data-variant="secondary"
					onclick={() => goto(`/cha2ds2-vasc-score-for-atrial-fibrillation-stroke-risk/cha2ds2-vasc-assessments/${id}`)}>Edit</Button
				>
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-4xl px-4 py-6">
		<!-- Score banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {riskBandColor(result.riskBand)}">
			<div class="text-3xl font-bold">CHA2DS2-VASc {result.cha2ds2VascScore} of 9</div>
			<div class="mt-2 text-sm font-semibold">{riskBandLabel(result.riskBand)}</div>
			<div class="mt-1 text-sm opacity-90">
				Estimated annual stroke rate ~{result.annualStrokeRatePercent}%
			</div>
			<div class="mt-2 text-sm opacity-75">
				Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Recommended action -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-2 text-lg font-bold text-base-content">Recommended action</h2>
			<p class="text-sm font-semibold text-base-content">
				{anticoagulationLabel(result.anticoagulationRecommendation)}
			</p>
			{#if result.riskBand === 'high'}
				<p class="mt-2 text-sm text-base-content/80">
					High stroke risk: offer oral anticoagulation (DOAC preferred, or warfarin with good
					time-in-therapeutic-range) unless contraindicated. Complete a HAS-BLED assessment to weigh
					bleeding risk and correct modifiable factors, then document the shared decision.
				</p>
			{:else if result.riskBand === 'intermediate'}
				<p class="mt-2 text-sm text-base-content/80">
					Intermediate risk: consider oral anticoagulation after shared decision-making, weighing
					stroke risk against bleeding risk (HAS-BLED) and patient preference.
				</p>
			{:else}
				<p class="mt-2 text-sm text-base-content/80">
					Low risk: no antithrombotic therapy is recommended for stroke prevention. Reassess if risk
					factors change. A score driven by the female sex category alone is managed as low risk.
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
						<th class="pb-2">Points</th>
					</tr>
				</thead>
				<tbody>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4">C &mdash; Congestive heart failure</td>
						<td class="py-2 pr-4">{yesNo(data.cardiac.congestiveHeartFailure)}</td>
						<td class="py-2">
							<span class="rounded-full border px-2 py-0.5 text-xs font-bold {pointColor(result.congestiveHeartFailurePoint)}">{result.congestiveHeartFailurePoint}</span>
						</td>
					</tr>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4">H &mdash; Hypertension</td>
						<td class="py-2 pr-4">{yesNo(data.cardiac.hypertension)}</td>
						<td class="py-2">
							<span class="rounded-full border px-2 py-0.5 text-xs font-bold {pointColor(result.hypertensionPoint)}">{result.hypertensionPoint}</span>
						</td>
					</tr>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4">A &mdash; Age (&ge; 75 = 2, 65&ndash;74 = 1)</td>
						<td class="py-2 pr-4">{ageValue}</td>
						<td class="py-2">
							<span class="rounded-full border px-2 py-0.5 text-xs font-bold {pointColor(result.agePoint)}">{result.agePoint}</span>
						</td>
					</tr>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4">D &mdash; Diabetes mellitus</td>
						<td class="py-2 pr-4">{yesNo(data.metabolic.diabetes)}</td>
						<td class="py-2">
							<span class="rounded-full border px-2 py-0.5 text-xs font-bold {pointColor(result.diabetesPoint)}">{result.diabetesPoint}</span>
						</td>
					</tr>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4">S2 &mdash; Prior stroke / TIA / thromboembolism</td>
						<td class="py-2 pr-4">{yesNo(data.metabolic.priorStrokeTiaThromboembolism)}</td>
						<td class="py-2">
							<span class="rounded-full border px-2 py-0.5 text-xs font-bold {pointColor(result.strokePoint)}">{result.strokePoint}</span>
						</td>
					</tr>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4">V &mdash; Vascular disease</td>
						<td class="py-2 pr-4">{yesNo(data.cardiac.vascularDisease)}</td>
						<td class="py-2">
							<span class="rounded-full border px-2 py-0.5 text-xs font-bold {pointColor(result.vascularDiseasePoint)}">{result.vascularDiseasePoint}</span>
						</td>
					</tr>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4">Sc &mdash; Female sex category</td>
						<td class="py-2 pr-4">{sexLabel(data.identification.sex) || 'Not recorded'}</td>
						<td class="py-2">
							<span class="rounded-full border px-2 py-0.5 text-xs font-bold {pointColor(result.sexPoint)}">{result.sexPoint}</span>
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
					<span class="font-medium text-base-content/70">Age band:</span>
					{ageBandLabel(data.identification.ageYears) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Sex:</span>
					{sexLabel(data.identification.sex) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">AF type:</span>
					{atrialFibrillationTypeLabel(data.context.atrialFibrillationType) || 'N/A'}
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
