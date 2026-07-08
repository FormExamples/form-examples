<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import {
		priorityLevelColor,
		priorityLabel,
		priorityColor,
		subscoreColor,
		targetLabel,
		careSettingLabel,
		arrivalModeLabel,
		ageBandLabel,
		sexLabel,
		acvpuLabel,
		airOrOxygenLabel
	} from '$lib/engine/utils';
	import Button from '$lib/components/ui/Button.svelte';

	const plural = 'emergency-department-triage-notes';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/emergency-department-triage-note/${plural}/${id}`);
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
				a.download = `ed-triage-note-${data.identification.patientIdentifier || id}.pdf`;
				a.click();
				URL.revokeObjectURL(url);
			} else {
				pdfError = 'Failed to generate PDF. Please try again.';
			}
		} catch {
			pdfError = 'Failed to generate PDF. Please check your connection and try again.';
		}
	}

	const parameterRows = $derived(
		result
			? [
					{
						label: 'Respiratory rate',
						value:
							data.vitals.respiratoryRate === null
								? 'Not recorded'
								: `${data.vitals.respiratoryRate} breaths/min`,
						points: result.subscores.respiratoryRate
					},
					{
						label: 'Oxygen saturation (SpO2)',
						value: data.vitals.spo2 === null ? 'Not recorded' : `${data.vitals.spo2}%`,
						points: result.subscores.spo2
					},
					{
						label: 'Air or oxygen',
						value: airOrOxygenLabel(data.vitals.onOxygen) || 'Not recorded',
						points: result.subscores.oxygen
					},
					{
						label: 'Systolic blood pressure',
						value:
							data.vitals.systolicBp === null ? 'Not recorded' : `${data.vitals.systolicBp} mmHg`,
						points: result.subscores.systolicBp
					},
					{
						label: 'Pulse',
						value: data.vitals.pulse === null ? 'Not recorded' : `${data.vitals.pulse} beats/min`,
						points: result.subscores.pulse
					},
					{
						label: 'Consciousness (ACVPU)',
						value: acvpuLabel(data.vitals.consciousnessAcvpu) || 'Not recorded',
						points: result.subscores.consciousness
					},
					{
						label: 'Temperature',
						value:
							data.vitals.temperature === null ? 'Not recorded' : `${data.vitals.temperature} °C`,
						points: result.subscores.temperature
					}
				]
			: []
	);
</script>

{#if result}
	<header class="border-b border-base-300 bg-base-100 shadow-sm no-print">
		<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
			<h1 class="text-lg font-bold text-base-content">ED triage note report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/emergency-department-triage-note/${plural}/${id}`)}>Edit</Button>
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-4xl px-4 py-6">
		<!-- Priority banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {priorityLevelColor(result.priorityLevel)}">
			<div class="text-3xl font-bold">
				Priority {result.priorityLevel} — {result.priorityName}
			</div>
			<div class="mt-2 text-sm font-semibold">
				{result.priorityColour.toUpperCase()} · {targetLabel(result.priorityLevel)}
			</div>
			<div class="mt-2 text-sm opacity-75">
				Supporting NEWS2 aggregate {result.news2Total} · generated
				{new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Fired discriminators -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-2 text-lg font-bold text-base-content">Classification basis</h2>
			<p class="text-sm text-base-content/80">
				The priority level is the most urgent (lowest) level any finding forces; missing vital signs
				never lower the category.
			</p>
			{#if result.firedDiscriminators.length > 0}
				<ul class="mt-3 space-y-1 text-sm">
					{#each result.firedDiscriminators as f (f.id)}
						<li class="text-base-content/80">
							<span class="font-semibold">Level {f.level}</span>
							— {f.category}: {f.description}
						</li>
					{/each}
				</ul>
			{:else}
				<p class="mt-3 text-sm text-base-content/70">
					No discriminators fired — default {result.priorityName} category.
				</p>
			{/if}
			{#if !result.complete}
				<p class="mt-3 text-sm text-error">
					Note: one or more core observations were not recorded — the supporting NEWS2 aggregate may
					understate risk.
				</p>
			{/if}
		</div>

		<!-- Parameters -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">
				Triage vital signs (supporting NEWS2)
			</h2>
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-base-300 text-left text-base-content/70">
						<th class="pb-2 pr-4">Parameter</th>
						<th class="pb-2 pr-4">Value</th>
						<th class="pb-2">Score</th>
					</tr>
				</thead>
				<tbody>
					{#each parameterRows as row (row.label)}
						<tr class="border-b border-base-200">
							<td class="py-2 pr-4">{row.label}</td>
							<td class="py-2 pr-4">{row.value}</td>
							<td class="py-2">
								<span
									class="rounded-full border px-2 py-0.5 text-xs font-bold {subscoreColor(row.points)}"
								>
									{row.points === null ? '—' : row.points}
								</span>
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
			<h2 class="mb-4 text-lg font-bold text-base-content">Triage summary</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div>
					<span class="font-medium text-base-content/70">Patient identifier:</span>
					{data.identification.patientIdentifier || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Age band / sex:</span>
					{ageBandLabel(data.identification.ageBand) || 'N/A'}{sexLabel(data.identification.sex)
						? ` / ${sexLabel(data.identification.sex)}`
						: ''}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Care setting:</span>
					{careSettingLabel(data.context.careSetting) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Arrival mode:</span>
					{arrivalModeLabel(data.arrival.arrivalMode) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Triage nurse:</span>
					{data.context.nurseName || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Triaged at:</span>
					{data.context.triagedAt || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Pain score:</span>
					{data.pain.painScore === null ? 'N/A' : `${data.pain.painScore}/10`}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Symptom onset:</span>
					{data.complaint.symptomOnset || 'N/A'}
				</div>
			</div>
			{#if data.complaint.presentingComplaint}
				<div class="mt-4 text-sm">
					<span class="font-medium text-base-content/70">Presenting complaint:</span>
					<p class="mt-1 text-base-content/80">{data.complaint.presentingComplaint}</p>
				</div>
			{/if}
			{#if data.note.clinicalNotes}
				<div class="mt-4 text-sm">
					<span class="font-medium text-base-content/70">Triage note:</span>
					<p class="mt-1 text-base-content/80">{data.note.clinicalNotes}</p>
				</div>
			{/if}
		</div>
	</main>
{/if}
