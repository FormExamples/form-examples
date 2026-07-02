<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import {
		escalationBandLabel,
		escalationBandColor,
		priorityLabel,
		priorityColor,
		subscoreColor,
		clinicianRoleLabel,
		careSettingLabel,
		ageBandLabel,
		sexLabel,
		respiratoryEffortLabel,
		supplementalOxygenLabel,
		capillaryRefillLabel,
		consciousnessLabel
	} from '$lib/engine/utils';
	import Button from '$lib/components/ui/Button.svelte';

	const plural = 'paediatric-early-warning-scores';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/${plural}/${id}`);
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
				a.download = `pews-assessment-${data.identification.patientIdentifier || id}.pdf`;
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
							data.respiratory.respiratoryRate === null
								? 'Not recorded'
								: `${data.respiratory.respiratoryRate} breaths/min`,
						points: result.subscores.respiratoryRate
					},
					{
						label: 'Respiratory effort',
						value: respiratoryEffortLabel(data.respiratory.respiratoryEffort) || 'Not recorded',
						points: result.subscores.respiratoryEffort
					},
					{
						label: 'Oxygen saturation (SpO2)',
						value:
							data.respiratory.oxygenSaturation === null
								? 'Not recorded'
								: `${data.respiratory.oxygenSaturation}%`,
						points: result.subscores.oxygenSaturation
					},
					{
						label: 'Supplemental oxygen',
						value: supplementalOxygenLabel(data.respiratory.supplementalOxygen) || 'Not recorded',
						points: result.subscores.supplementalOxygen
					},
					{
						label: 'Heart rate',
						value:
							data.cardiovascular.heartRate === null
								? 'Not recorded'
								: `${data.cardiovascular.heartRate} beats/min`,
						points: result.subscores.heartRate
					},
					{
						label: 'Capillary refill',
						value: capillaryRefillLabel(data.cardiovascular.capillaryRefill) || 'Not recorded',
						points: result.subscores.capillaryRefill
					},
					{
						label: 'Consciousness (ACVPU)',
						value: consciousnessLabel(data.behaviour.consciousness) || 'Not recorded',
						points: result.subscores.consciousness
					}
				]
			: []
	);
</script>

{#if result}
	<header class="border-b border-base-300 bg-base-100 shadow-sm no-print">
		<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
			<h1 class="text-lg font-bold text-base-content">PEWS assessment report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/${plural}/${id}`)}>Edit</Button>
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-4xl px-4 py-6">
		<!-- Score banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {escalationBandColor(result.escalationBand)}">
			<div class="text-3xl font-bold">Aggregate PEWS: {result.aggregateScore}</div>
			<div class="mt-2 text-sm font-semibold">
				{escalationBandLabel(result.escalationBand)}{result.singleParameterTrigger
					? ' — single parameter = 3'
					: ''}
			</div>
			<div class="mt-2 text-sm opacity-75">
				Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Recommended response -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-2 text-lg font-bold text-base-content">Recommended response</h2>
			<p class="text-sm text-base-content/80">
				<strong>Monitoring frequency:</strong>
				{result.monitoringFrequency}
			</p>
			<p class="mt-2 text-sm text-base-content/80">{result.recommendation}</p>
			{#if !result.complete}
				<p class="mt-2 text-sm text-error">
					Note: one or more observations (or the age band) were not recorded — the aggregate may
					understate risk.
				</p>
			{/if}
		</div>

		<!-- Override triggers -->
		{#if result.firedTriggers.length > 0}
			<div class="mb-6 rounded-xl border border-warning/40 bg-base-100 p-6">
				<h2 class="mb-2 text-lg font-bold text-base-content">Override triggers</h2>
				<ul class="list-disc space-y-1 pl-5 text-sm text-base-content/80">
					{#each result.firedTriggers as t (t.id)}
						<li>{t.description}</li>
					{/each}
				</ul>
			</div>
		{/if}

		<!-- Parameters -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Parameters</h2>
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
			<h2 class="mb-4 text-lg font-bold text-base-content">Assessment summary</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div>
					<span class="font-medium text-base-content/70">Patient identifier:</span>
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
					<span class="font-medium text-base-content/70">Clinician:</span>
					{data.context.clinicianName || 'N/A'}
					{#if clinicianRoleLabel(data.context.clinicianRole)}
						({clinicianRoleLabel(data.context.clinicianRole)})
					{/if}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Observed at:</span>
					{data.context.observationAt || 'N/A'}
				</div>
			</div>
			{#if data.note.clinicalNotes}
				<div class="mt-4 text-sm">
					<span class="font-medium text-base-content/70">Clinical note:</span>
					<p class="mt-1 text-base-content/80">{data.note.clinicalNotes}</p>
				</div>
			{/if}
		</div>
	</main>
{/if}
