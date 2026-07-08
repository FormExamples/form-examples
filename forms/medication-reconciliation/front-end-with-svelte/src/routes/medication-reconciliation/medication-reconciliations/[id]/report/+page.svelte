<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { isIntentional } from '$lib/engine/medication-reconciliation-rules';
	import {
		statusLabel,
		statusColor,
		priorityLabel,
		priorityColor,
		listSourceLabel,
		highRiskClassLabel,
		discrepancyTypeLabel,
		intendedActionLabel,
		reconciliationTypeLabel,
		careSettingLabel,
		clinicianRoleLabel,
		sexLabel,
		ageBandLabel,
		allergyStatusLabel
	} from '$lib/engine/utils';
	import Button from '$lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/medication-reconciliation/medication-reconciliations/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/medication-reconciliations/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `medication-reconciliation-${data.identification.patientIdentifier || id}.pdf`;
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
			<h1 class="text-lg font-bold text-base-content">Medication reconciliation report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button
					data-variant="secondary"
					onclick={() => goto(`/medication-reconciliation/medication-reconciliations/${id}`)}>Edit</Button
				>
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-4xl px-4 py-6">
		<!-- Status banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {statusColor(result.status)}">
			<div class="text-3xl font-bold">{statusLabel(result.status)}</div>
			<div class="mt-2 text-sm font-semibold">Reconciliation status</div>
			<div class="mt-2 text-sm opacity-75">
				Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Counts -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Counts</h2>
			<table class="w-full text-sm">
				<tbody>
					<tr class="border-b border-base-200">
						<th scope="row" class="py-2 pr-4 text-left font-medium text-base-content/70"
							>Information sources</th
						>
						<td class="py-2"
							>{result.sourceCount} ({result.verifiedSourceCount} verified) — minimum 2 required</td
						>
					</tr>
					<tr class="border-b border-base-200">
						<th scope="row" class="py-2 pr-4 text-left font-medium text-base-content/70"
							>Allergies recorded</th
						>
						<td class="py-2">{result.allergyCount}</td>
					</tr>
					<tr class="border-b border-base-200">
						<th scope="row" class="py-2 pr-4 text-left font-medium text-base-content/70"
							>Line items</th
						>
						<td class="py-2"
							>{result.lineItemCount} — {result.bpmhCount} BPMH, {result.inpatientCount} inpatient</td
						>
					</tr>
					<tr class="border-b border-base-200">
						<th scope="row" class="py-2 pr-4 text-left font-medium text-base-content/70"
							>Discrepancies</th
						>
						<td class="py-2"
							>{result.discrepancyCount} — {result.intentionalCount} intentional,
							{result.unintentionalCount} unintentional</td
						>
					</tr>
					<tr>
						<th scope="row" class="py-2 pr-4 text-left font-medium text-base-content/70"
							>High-risk unintentional</th
						>
						<td class="py-2">{result.highRiskUnintentionalCount}</td>
					</tr>
				</tbody>
			</table>
		</div>

		<!-- Medication line items -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">
				Medication line items ({result.lineItemCount})
			</h2>
			{#if data.lineItems.length === 0}
				<p class="text-sm text-base-content/60">No medicines recorded.</p>
			{:else}
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b border-base-300 text-left text-base-content/70">
							<th class="pb-2 pr-4">Medicine</th>
							<th class="pb-2 pr-4">List</th>
							<th class="pb-2 pr-4">Dose / frequency</th>
							<th class="pb-2 pr-4">Indication</th>
							<th class="pb-2">High-risk</th>
						</tr>
					</thead>
					<tbody>
						{#each data.lineItems as m, i (i)}
							<tr class="border-b border-base-200">
								<th scope="row" class="py-2 pr-4 text-left font-medium"
									>{m.drugName || `Medicine ${i + 1}`}</th
								>
								<td class="py-2 pr-4">{listSourceLabel(m.listSource) || '—'}</td>
								<td class="py-2 pr-4">{[m.dose, m.frequency].filter(Boolean).join(' · ') || '—'}</td>
								<td class="py-2 pr-4">{m.indication || '—'}</td>
								<td class="py-2"
									>{m.highRiskClass && m.highRiskClass !== 'none'
										? highRiskClassLabel(m.highRiskClass)
										: '—'}</td
								>
							</tr>
						{/each}
					</tbody>
				</table>
			{/if}
		</div>

		<!-- Discrepancies -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">
				Discrepancies ({result.discrepancyCount})
			</h2>
			{#if data.discrepancies.length === 0}
				<p class="text-sm text-base-content/60">No discrepancies recorded.</p>
			{:else}
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b border-base-300 text-left text-base-content/70">
							<th class="pb-2 pr-4">Type</th>
							<th class="pb-2 pr-4">Matched items</th>
							<th class="pb-2 pr-4">Action / rationale</th>
							<th class="pb-2">Intent</th>
						</tr>
					</thead>
					<tbody>
						{#each data.discrepancies as d, i (i)}
							<tr class="border-b border-base-200">
								<th scope="row" class="py-2 pr-4 text-left font-medium"
									>{discrepancyTypeLabel(d.discrepancyType) || `Discrepancy ${i + 1}`}</th
								>
								<td class="py-2 pr-4"
									>{[d.bpmhItemRef, d.inpatientItemRef].filter(Boolean).join(' → ') || '—'}</td
								>
								<td class="py-2 pr-4"
									>{intendedActionLabel(d.intendedAction) || '—'}{d.rationale
										? ` — ${d.rationale}`
										: ''}</td
								>
								<td class="py-2">
									{#if isIntentional(d)}
										Intentional
									{:else}
										<strong class="text-error">Unintentional</strong>
									{/if}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			{/if}
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

		<!-- Reconciliation summary -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Reconciliation summary</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div>
					<span class="font-medium text-base-content/70">Patient ID:</span>
					{data.identification.patientIdentifier || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Type:</span>
					{reconciliationTypeLabel(data.encounter.reconciliationType) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Care setting:</span>
					{careSettingLabel(data.encounter.careSetting) || 'N/A'}
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
					<span class="font-medium text-base-content/70">Allergy status:</span>
					{allergyStatusLabel(data.allergyReview.allergyStatus) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Clinician:</span>
					{data.encounter.clinicianName || 'N/A'}
					{#if clinicianRoleLabel(data.encounter.clinicianRole)}
						({clinicianRoleLabel(data.encounter.clinicianRole)})
					{/if}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Reconciled at:</span>
					{data.encounter.reconciledAt || 'N/A'}
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
