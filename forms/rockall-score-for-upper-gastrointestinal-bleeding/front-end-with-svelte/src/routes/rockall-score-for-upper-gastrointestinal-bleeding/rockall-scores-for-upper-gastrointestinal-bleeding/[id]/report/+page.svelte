<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import {
		riskBandLabel,
		riskBandColor,
		priorityLabel,
		priorityColor,
		careSettingLabel,
		clinicianRoleLabel,
		comorbidityLabel,
		diagnosisLabel,
		endoscopyPerformedLabel,
		sexLabel,
		shockLabel,
		stigmataLabel,
		formatScore
	} from '$lib/engine/utils';
	import Button from '$lib/components/ui/Button.svelte';

	const plural = 'rockall-scores-for-upper-gastrointestinal-bleeding';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/rockall-score-for-upper-gastrointestinal-bleeding/${plural}/${id}`);
		}
	});

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
				a.download = `rockall-${data.identification.patientIdentifier || id}.pdf`;
				a.click();
				URL.revokeObjectURL(url);
			} else {
				pdfError = 'Failed to generate PDF. Please try again.';
			}
		} catch {
			pdfError = 'Failed to generate PDF. Please check your connection and try again.';
		}
	}

	const sbp = $derived(data.shock.systolicBloodPressure);
	const hr = $derived(data.shock.heartRate);
	const shockValue = $derived(
		sbp === null && hr === null
			? 'Not recorded'
			: `SBP ${sbp === null ? '—' : `${sbp} mmHg`}, HR ${hr === null ? '—' : `${hr} bpm`}`
	);
</script>

{#if result}
	<header class="border-b border-base-300 bg-base-100 shadow-sm no-print">
		<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
			<h1 class="text-lg font-bold text-base-content">Rockall report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/rockall-score-for-upper-gastrointestinal-bleeding/${plural}/${id}`)}>Edit</Button>
			</div>
		</div>
	</header>

	<main class="mx-16 px-4 py-6">
		<!-- Result banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {riskBandColor(result.riskBand)}">
			<div class="text-3xl font-bold">Rockall {formatScore(result)}</div>
			<div class="mt-2 text-sm font-semibold">{riskBandLabel(result.riskBand)}</div>
			<div class="mt-2 text-sm opacity-75">
				{#if result.endoscopyDone}
					Full (post-endoscopy) score · clinical component {result.clinicalRockallScore} of 7
				{:else}
					Pre-endoscopy (clinical) score · full score of 11 pending endoscopy
				{/if}
			</div>
			<div class="mt-1 text-sm opacity-75">
				Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Recommended action -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-2 text-lg font-bold text-base-content">Recommended action</h2>
			{#if result.riskBand === 'high'}
				<p class="text-sm text-base-content/80">
					<strong>High risk of rebleeding and death.</strong> Admit and monitor closely; arrange
					endoscopic therapy, transfusion, and surgical / interventional-radiology input as
					indicated.
				</p>
			{:else if result.riskBand === 'intermediate'}
				<p class="text-sm text-base-content/80">
					<strong>Intermediate risk.</strong> Admit for observation and monitoring; ensure endoscopic
					follow-up and be alert for signs of rebleeding.
				</p>
			{:else if result.riskBand === 'clinical-only'}
				<p class="text-sm text-base-content/80">
					<strong>Pre-endoscopy (clinical) score only.</strong> The full score becomes available once
					endoscopy is recorded. Resuscitate, monitor, and arrange endoscopy per local pathway.
				</p>
			{:else}
				<p class="text-sm text-base-content/80">
					<strong>Low risk.</strong> A low Rockall score supports early discharge or step-down where
					clinically appropriate. Interpret in the full clinical context.
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
						<td class="py-2 pr-4">Age</td>
						<td class="py-2 pr-4"
							>{data.identification.ageYears === null
								? 'Not recorded'
								: `${data.identification.ageYears} years`}</td
						>
						<td class="py-2">{result.agePoints} pt</td>
					</tr>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4">Shock</td>
						<td class="py-2 pr-4">{shockValue} ({shockLabel(result.shockPoints)})</td>
						<td class="py-2">{result.shockPoints} pt</td>
					</tr>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4">Comorbidity</td>
						<td class="py-2 pr-4">{comorbidityLabel(data.comorbidityStep.comorbidity) || 'Not recorded'}</td>
						<td class="py-2">{result.comorbidityPoints} pt</td>
					</tr>
					<tr class="border-b border-base-200 font-semibold">
						<td class="py-2 pr-4">Clinical Rockall score</td>
						<td class="py-2 pr-4"></td>
						<td class="py-2">{result.clinicalRockallScore} / 7</td>
					</tr>
					{#if result.endoscopyDone}
						<tr class="border-b border-base-200">
							<td class="py-2 pr-4">Diagnosis</td>
							<td class="py-2 pr-4">{diagnosisLabel(data.endoscopy.diagnosis) || 'Not recorded'}</td>
							<td class="py-2">{result.diagnosisPoints} pt</td>
						</tr>
						<tr class="border-b border-base-200">
							<td class="py-2 pr-4">Stigmata of recent haemorrhage</td>
							<td class="py-2 pr-4">{stigmataLabel(data.endoscopy.stigmata) || 'Not recorded'}</td>
							<td class="py-2">{result.stigmataPoints} pt</td>
						</tr>
						<tr class="border-b border-base-200 font-semibold">
							<td class="py-2 pr-4">Full Rockall score</td>
							<td class="py-2 pr-4"></td>
							<td class="py-2">{result.fullRockallScore} / 11</td>
						</tr>
					{:else}
						<tr class="border-b border-base-200">
							<td class="py-2 pr-4">Endoscopy</td>
							<td class="py-2 pr-4"
								>{endoscopyPerformedLabel(data.endoscopy.endoscopyPerformed) || 'Not yet performed'}</td
							>
							<td class="py-2">—</td>
						</tr>
					{/if}
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
					<span class="font-medium text-base-content/70">Care setting:</span>
					{careSettingLabel(data.context.careSetting) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Presenting complaint:</span>
					{data.context.presentingComplaint || 'N/A'}
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
