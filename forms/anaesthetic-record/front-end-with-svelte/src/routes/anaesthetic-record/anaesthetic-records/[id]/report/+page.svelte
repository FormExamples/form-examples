<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import {
		statusLabel,
		statusColor,
		priorityLabel,
		priorityColor,
		urgencyLabel,
		sexLabel,
		asaLabel,
		anaestheticTechniqueLabel,
		airwayTechniqueLabel,
		recoveryDestinationLabel,
		doseUnitLabel,
		routeLabel,
		drugCategoryLabel,
		eventTypeLabel,
		monitoringModalityLabel
	} from '$lib/engine/utils';
	import Button from '$lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/anaesthetic-record/anaesthetic-records/${id}`);
		}
	});

	let pdfError = $state('');

	const satisfied = $derived(result ? result.firedRules.filter((r) => r.satisfied).length : 0);
	const missing = $derived(result ? result.firedRules.filter((r) => !r.satisfied) : []);
	const monitoringText = $derived(
		data.monitoring.monitoringModalities.length === 0
			? '—'
			: data.monitoring.monitoringModalities.map(monitoringModalityLabel).join(', ')
	);

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/anaesthetic-records/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `anaesthetic-record-${data.identification.patientIdentifier || id}.pdf`;
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
			<h1 class="text-lg font-bold text-base-content">Anaesthetic record report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/anaesthetic-record/anaesthetic-records/${id}`)}>Edit</Button>
			</div>
		</div>
	</header>

	<main class="mx-16 px-4 py-6">
		<!-- Status banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {statusColor(result.status)}">
			<div class="text-3xl font-bold">{statusLabel(result.status)}</div>
			<div class="mt-2 text-sm font-semibold">
				{result.completenessPercent}% complete — {satisfied} of {result.firedRules.length} mandatory items
			</div>
			<div class="mt-2 text-sm opacity-75">
				Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Mandatory items -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Mandatory items</h2>
			<table class="w-full text-sm">
				<tbody>
					<tr class="border-b border-base-200">
						<th class="py-2 pr-4 text-left font-medium text-base-content/70">Completeness</th>
						<td class="py-2"
							>{result.completenessPercent}% ({satisfied} of {result.firedRules.length} items)</td
						>
					</tr>
					<tr class="border-b border-base-200">
						<th class="py-2 pr-4 text-left font-medium text-base-content/70">Critical items missing</th>
						<td class="py-2">{result.criticalMissing}</td>
					</tr>
					<tr class="border-b border-base-200">
						<th class="py-2 pr-4 text-left font-medium text-base-content/70"
							>Non-critical items missing</th
						>
						<td class="py-2">{result.noncriticalMissing}</td>
					</tr>
					<tr class="border-b border-base-200">
						<th class="py-2 pr-4 text-left font-medium text-base-content/70">Monitoring modalities</th>
						<td class="py-2">{monitoringText}</td>
					</tr>
				</tbody>
			</table>
		</div>

		<!-- Missing items -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Missing items ({missing.length})</h2>
			{#if missing.length === 0}
				<p class="text-sm text-base-content/70">All mandatory items are present.</p>
			{:else}
				<div class="space-y-2">
					{#each missing as rule (rule.id)}
						<div
							class="flex items-start gap-3 rounded-lg border p-3 {rule.category === 'critical'
								? priorityColor('high')
								: priorityColor('low')}"
						>
							<span
								class="mt-0.5 rounded px-2 py-0.5 text-xs font-bold uppercase {rule.category ===
								'critical'
									? priorityColor('high')
									: priorityColor('low')}"
							>
								{rule.category === 'critical' ? 'Critical' : 'Non-critical'}
							</span>
							<div>{rule.label}</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>

		<!-- Drugs -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Drugs ({data.drugs.length})</h2>
			{#if data.drugs.length === 0}
				<p class="text-sm text-base-content/70">No drugs recorded.</p>
			{:else}
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b border-base-300 text-left text-base-content/70">
							<th class="pb-2 pr-4">Drug</th>
							<th class="pb-2 pr-4">Category</th>
							<th class="pb-2 pr-4">Dose</th>
							<th class="pb-2">Route</th>
						</tr>
					</thead>
					<tbody>
						{#each data.drugs as drug, i (i)}
							<tr class="border-b border-base-200">
								<td class="py-2 pr-4">{drug.drugName || `Drug ${i + 1}`}</td>
								<td class="py-2 pr-4">{drugCategoryLabel(drug.category) || '—'}</td>
								<td class="py-2 pr-4"
									>{drug.dose === null ? '—' : `${drug.dose} ${doseUnitLabel(drug.doseUnit)}`}</td
								>
								<td class="py-2">{routeLabel(drug.route) || '—'}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			{/if}
		</div>

		<!-- Timed observations -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">
				Timed observations ({data.observations.length})
			</h2>
			{#if data.observations.length === 0}
				<p class="text-sm text-base-content/70">No observations recorded.</p>
			{:else}
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b border-base-300 text-left text-base-content/70">
							<th class="pb-2 pr-4">Time</th>
							<th class="pb-2 pr-4">BP</th>
							<th class="pb-2 pr-4">HR</th>
							<th class="pb-2">SpO2</th>
						</tr>
					</thead>
					<tbody>
						{#each data.observations as obs, i (i)}
							<tr class="border-b border-base-200">
								<td class="py-2 pr-4">{obs.observedAt || `Set ${i + 1}`}</td>
								<td class="py-2 pr-4"
									>{obs.systolicBloodPressure ?? '—'}/{obs.diastolicBloodPressure ?? '—'}</td
								>
								<td class="py-2 pr-4">{obs.heartRate ?? '—'}</td>
								<td class="py-2">{obs.spo2 ?? '—'}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			{/if}
		</div>

		<!-- Events -->
		{#if data.events.length > 0}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">
					Events and complications ({data.events.length})
				</h2>
				<div class="space-y-2 text-sm">
					{#each data.events as event, i (i)}
						<div class="rounded-lg border border-base-200 p-3">
							<span class="font-medium">{eventTypeLabel(event.eventType) || `Event ${i + 1}`}:</span>
							{event.management || '—'}
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Flagged issues -->
		{#if result.flaggedIssues.length > 0}
			<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-error">
					Safety flags ({result.flaggedIssues.length})
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

		<!-- Case summary -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Case summary</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div>
					<span class="font-medium text-base-content/70">Patient ID:</span>
					{data.identification.patientIdentifier || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Patient:</span>
					{data.identification.patientName || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Sex:</span>
					{sexLabel(data.identification.sex) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Theatre:</span>
					{data.identification.theatre || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Anaesthetist:</span>
					{data.identification.anaesthetistName || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Surgeon:</span>
					{data.identification.surgeonName || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Procedure:</span>
					{data.identification.plannedProcedure || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Urgency:</span>
					{urgencyLabel(data.identification.urgency) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Technique:</span>
					{anaestheticTechniqueLabel(data.identification.anaestheticTechnique) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">ASA:</span>
					{asaLabel(data.asaAirway.asaStatus) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Airway:</span>
					{airwayTechniqueLabel(data.airway.airwayTechnique) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Recovery destination:</span>
					{recoveryDestinationLabel(data.handover.recoveryDestination) || 'N/A'}
				</div>
			</div>
		</div>
	</main>
{/if}
