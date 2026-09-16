<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import {
		riskLabel,
		riskColor,
		reviewPathwayLabel,
		referralLabel,
		reviewIntervalLabel,
		neuropathyStatusLabel,
		pulsesStatusLabel,
		ulcerSeverityLabel,
		previousAmputationLabel,
		yesNoLabel,
		statusLabel,
		priorityLabel,
		priorityColor,
		assessmentSettingLabel,
		diabetesTypeLabel,
		selfCareAbilityLabel
	} from '#lib/engine/utils.js';
	import { Button } from "@lilydesignsystem/svelte-headless";

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/diabetes-podiatry-assessment/diabetes-podiatry-assessments/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(
				`/diabetes-podiatry-assessment/diabetes-podiatry-assessments/${id}/report/pdf`,
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
				a.download = `diabetes-podiatry-assessment-${id}.pdf`;
				a.click();
				URL.revokeObjectURL(url);
			} else {
				pdfError = 'Failed to generate PDF. Please try again.';
			}
		} catch {
			pdfError = 'Failed to generate PDF. Please check your connection and try again.';
		}
	}

	const outcomeRows = $derived(
		result
			? [
					{ label: 'Review interval', value: reviewIntervalLabel(result.reviewIntervalMonths) },
					{ label: 'Referral', value: referralLabel(result.referral) || 'N/A' },
					{ label: 'Right foot risk', value: riskLabel(result.rightFootRisk) || result.rightFootRisk },
					{ label: 'Left foot risk', value: riskLabel(result.leftFootRisk) || result.leftFootRisk }
				]
			: []
	);
</script>

{#if result}
	<header class="border-b border-base-300 bg-base-100 shadow-sm no-print">
		<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
			<h1 class="text-lg font-bold text-base-content">Diabetes podiatry assessment report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button
					data-variant="secondary"
					onclick={() => goto(`/diabetes-podiatry-assessment/diabetes-podiatry-assessments/${id}`)}
					>Edit</Button
				>
			</div>
		</div>
	</header>

	<main class="mx-16 px-4 py-6">
		<!-- Outcome banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {riskColor(result.overallRisk)}">
			<div class="text-3xl font-bold">{riskLabel(result.overallRisk)}</div>
			<div class="mt-2 text-sm font-semibold">
				{reviewPathwayLabel(result.reviewPathway)} · {referralLabel(result.referral)} · {reviewIntervalLabel(
					result.reviewIntervalMonths
				)} · {statusLabel(result.status)}
			</div>
			<div class="mt-2 text-sm opacity-75">
				Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Interpretation -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-2 text-lg font-bold text-base-content">Interpretation</h2>
			{#if result.reviewPathway === 'urgent-mdt-referral'}
				<p class="text-sm text-base-content/80">
					An active ulcer or suspected Charcot foot on at least one foot — <strong
						>urgent referral to the multidisciplinary foot team (same or next working day)</strong
					>. This is a risk classification, not a diagnosis; act on the referral immediately.
				</p>
			{:else if result.reviewPathway === 'high-risk-review'}
				<p class="text-sm text-base-content/80">
					High risk from previous ulceration/amputation history, renal replacement therapy, or two
					or more combined risk factors on one foot — <strong
						>review by the multidisciplinary foot team</strong
					>.
				</p>
			{:else if result.reviewPathway === 'moderate-risk-review'}
				<p class="text-sm text-base-content/80">
					One risk factor on the worse foot — <strong
						>6-monthly review by the foot protection service</strong
					>.
				</p>
			{:else if result.status === 'incomplete'}
				<p class="text-sm text-base-content/80">
					This record is <strong>incomplete</strong>: a foot is missing its neuropathy or pulses
					test result. Complete the outstanding test(s) so the classification does not understate
					risk.
				</p>
			{:else}
				<p class="text-sm text-base-content/80">
					No risk factors on either foot — <strong>annual review</strong>. A risk classification is
					not a diagnosis.
				</p>
			{/if}
		</div>

		<!-- Per-foot examination -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Per-foot examination</h2>
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-base-300 text-left text-base-content/70">
						<th class="py-2 pr-4">Foot</th>
						<th class="py-2 pr-4">Neuropathy</th>
						<th class="py-2 pr-4">Pulses</th>
						<th class="py-2 pr-4">Deformity</th>
						<th class="py-2 pr-4">Callus</th>
						<th class="py-2 pr-4">Skin breakdown</th>
						<th class="py-2 pr-4">Active ulcer</th>
						<th class="py-2 pr-4">Previous ulcer</th>
						<th class="py-2 pr-4">Previous amputation</th>
						<th class="py-2">Suspected Charcot</th>
					</tr>
				</thead>
				<tbody>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4 font-medium">Right</td>
						<td class="py-2 pr-4">{neuropathyStatusLabel(data.rightFoot.neuropathyStatus) || '—'}</td>
						<td class="py-2 pr-4">{pulsesStatusLabel(data.rightFoot.pulsesStatus) || '—'}</td>
						<td class="py-2 pr-4">{yesNoLabel(data.rightFoot.deformity) || '—'}</td>
						<td class="py-2 pr-4">{yesNoLabel(data.rightFoot.callus) || '—'}</td>
						<td class="py-2 pr-4">{yesNoLabel(data.rightFoot.skinBreakdown) || '—'}</td>
						<td class="py-2 pr-4"
							>{data.rightFoot.activeUlcer === 'yes'
								? `Yes (${ulcerSeverityLabel(data.rightFoot.ulcerSeverity) || 'severity unset'})`
								: 'No'}</td
						>
						<td class="py-2 pr-4">{yesNoLabel(data.rightFoot.previousUlcer) || '—'}</td>
						<td class="py-2 pr-4">{previousAmputationLabel(data.rightFoot.previousAmputation) || '—'}</td>
						<td class="py-2">{yesNoLabel(data.rightFoot.suspectedCharcot) || '—'}</td>
					</tr>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4 font-medium">Left</td>
						<td class="py-2 pr-4">{neuropathyStatusLabel(data.leftFoot.neuropathyStatus) || '—'}</td>
						<td class="py-2 pr-4">{pulsesStatusLabel(data.leftFoot.pulsesStatus) || '—'}</td>
						<td class="py-2 pr-4">{yesNoLabel(data.leftFoot.deformity) || '—'}</td>
						<td class="py-2 pr-4">{yesNoLabel(data.leftFoot.callus) || '—'}</td>
						<td class="py-2 pr-4">{yesNoLabel(data.leftFoot.skinBreakdown) || '—'}</td>
						<td class="py-2 pr-4"
							>{data.leftFoot.activeUlcer === 'yes'
								? `Yes (${ulcerSeverityLabel(data.leftFoot.ulcerSeverity) || 'severity unset'})`
								: 'No'}</td
						>
						<td class="py-2 pr-4">{yesNoLabel(data.leftFoot.previousUlcer) || '—'}</td>
						<td class="py-2 pr-4">{previousAmputationLabel(data.leftFoot.previousAmputation) || '—'}</td>
						<td class="py-2">{yesNoLabel(data.leftFoot.suspectedCharcot) || '—'}</td>
					</tr>
				</tbody>
			</table>
		</div>

		<!-- Outcome detail -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Outcome</h2>
			<table class="w-full text-sm">
				<tbody>
					{#each outcomeRows as row (row.label)}
						<tr class="border-b border-base-200">
							<td class="py-2 pr-4 text-base-content/70">{row.label}</td>
							<td class="py-2 font-medium">{row.value}</td>
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
					<span class="font-medium text-base-content/70">Diabetes type:</span>
					{diabetesTypeLabel(data.riskFactors.diabetesType) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Years since diagnosis:</span>
					{data.riskFactors.yearsSinceDiagnosis !== null ? data.riskFactors.yearsSinceDiagnosis : 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Renal replacement therapy:</span>
					{yesNoLabel(data.riskFactors.onRenalReplacementTherapy) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Visual acuity impairment:</span>
					{yesNoLabel(data.riskFactors.visualAcuityImpairment) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Self-care ability:</span>
					{selfCareAbilityLabel(data.riskFactors.selfCareAbility) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Footwear appropriate:</span>
					{yesNoLabel(data.riskFactors.footwearAppropriate) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Assessed:</span>
					{data.context.assessedAt || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Setting:</span>
					{assessmentSettingLabel(data.context.assessmentSetting) || 'N/A'}
				</div>
			</div>
			{#if data.note.clinicalContext}
				<div class="mt-4 text-sm">
					<span class="font-medium text-base-content/70">Clinical note:</span>
					<p class="mt-1 text-base-content/80">{data.note.clinicalContext}</p>
				</div>
			{/if}
		</div>
	</main>
{/if}
