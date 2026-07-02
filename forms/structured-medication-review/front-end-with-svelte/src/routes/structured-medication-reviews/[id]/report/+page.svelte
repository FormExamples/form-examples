<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import {
		reviewStatusLabel,
		reviewStatusColor,
		burdenBandLabel,
		burdenBandColor,
		polypharmacyBandLabel,
		anticholinergicBandLabel,
		priorityLabel,
		priorityColor,
		highRiskClassLabel,
		adherenceLabel,
		careSettingLabel,
		consultationModeLabel,
		clinicianRoleLabel,
		frailtyLabel,
		sexLabel,
		ageBandLabel
	} from '$lib/engine/utils';
	import Button from '$lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/structured-medication-reviews/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/structured-medication-reviews/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `structured-medication-review-${data.identification.patientIdentifier || id}.pdf`;
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
			<h1 class="text-lg font-bold text-base-content">Structured medication review report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/structured-medication-reviews/${id}`)}
					>Edit</Button
				>
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-4xl px-4 py-6">
		<!-- Status + burden banners -->
		<div class="mb-6 grid gap-4 sm:grid-cols-2">
			<div class="rounded-xl border-2 p-6 text-center {reviewStatusColor(result.reviewStatus)}">
				<div class="text-3xl font-bold">{reviewStatusLabel(result.reviewStatus)}</div>
				<div class="mt-2 text-sm font-semibold">Review status</div>
				<div class="mt-2 text-sm opacity-75">
					Generated {new Date(result.timestamp).toLocaleString()}
				</div>
			</div>
			<div class="rounded-xl border-2 p-6 text-center {burdenBandColor(result.burdenBand)}">
				<div class="text-3xl font-bold">{burdenBandLabel(result.burdenBand)}</div>
				<div class="mt-2 text-sm font-semibold">Composite medicines burden</div>
				<div class="mt-2 text-sm opacity-75">
					ACB {result.anticholinergicBurdenScore} · {result.regularMedicineCount} regular medicine(s)
				</div>
			</div>
		</div>

		<!-- Indicators -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Indicators</h2>
			<table class="w-full text-sm">
				<tbody>
					<tr class="border-b border-base-200">
						<th scope="row" class="py-2 pr-4 text-left font-medium text-base-content/70">Medicines</th>
						<td class="py-2">{result.medicineCount} total, {result.regularMedicineCount} regular</td>
					</tr>
					<tr class="border-b border-base-200">
						<th scope="row" class="py-2 pr-4 text-left font-medium text-base-content/70">Polypharmacy</th
						>
						<td class="py-2">{polypharmacyBandLabel(result.polypharmacyBand)}</td>
					</tr>
					<tr class="border-b border-base-200">
						<th scope="row" class="py-2 pr-4 text-left font-medium text-base-content/70"
							>Anticholinergic burden</th
						>
						<td class="py-2"
							>{result.anticholinergicBurdenScore} — {anticholinergicBandLabel(
								result.anticholinergicBand
							)}</td
						>
					</tr>
					<tr>
						<th scope="row" class="py-2 pr-4 text-left font-medium text-base-content/70"
							>STOPP / START</th
						>
						<td class="py-2">{result.stopFlags.length} STOPP, {result.startFlags.length} START</td>
					</tr>
				</tbody>
			</table>
		</div>

		<!-- Medicines -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Medicines ({result.medicineCount})</h2>
			{#if data.medicines.length === 0}
				<p class="text-sm text-base-content/60">No medicines recorded.</p>
			{:else}
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b border-base-300 text-left text-base-content/70">
							<th class="pb-2 pr-4">Medicine</th>
							<th class="pb-2 pr-4">Indication</th>
							<th class="pb-2 pr-4">Adherence</th>
							<th class="pb-2 pr-4">ACB</th>
							<th class="pb-2">High-risk</th>
						</tr>
					</thead>
					<tbody>
						{#each data.medicines as m, i (i)}
							<tr class="border-b border-base-200">
								<th scope="row" class="py-2 pr-4 text-left font-medium"
									>{m.drugName || `Medicine ${i + 1}`}{m.formStrength ? ` — ${m.formStrength}` : ''}</th
								>
								<td class="py-2 pr-4">{m.indication || '—'}</td>
								<td class="py-2 pr-4">{adherenceLabel(m.adherence) || '—'}</td>
								<td class="py-2 pr-4">{m.anticholinergicBurdenPoints ?? '—'}</td>
								<td class="py-2"
									>{m.isHighRisk === 'yes'
										? highRiskClassLabel(m.highRiskClass) || 'Yes'
										: '—'}</td
								>
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

		<!-- Review summary -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Review summary</h2>
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
					<span class="font-medium text-base-content/70">Frailty:</span>
					{frailtyLabel(data.identification.frailtyStatus) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Care setting:</span>
					{careSettingLabel(data.context.careSetting) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Consultation:</span>
					{consultationModeLabel(data.context.consultationMode) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Clinician:</span>
					{data.context.clinicianName || 'N/A'}
					{#if clinicianRoleLabel(data.context.clinicianRole)}
						({clinicianRoleLabel(data.context.clinicianRole)})
					{/if}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Reviewed at:</span>
					{data.context.reviewedAt || 'N/A'}
				</div>
			</div>
			{#if data.problems.whatMattersToPatient}
				<div class="mt-4 text-sm">
					<span class="font-medium text-base-content/70">What matters to the patient:</span>
					<p class="mt-1 text-base-content/80">{data.problems.whatMattersToPatient}</p>
				</div>
			{/if}
			{#if data.goals.sharedDecisions}
				<div class="mt-4 text-sm">
					<span class="font-medium text-base-content/70">Shared decisions:</span>
					<p class="mt-1 text-base-content/80">{data.goals.sharedDecisions}</p>
				</div>
			{/if}
			{#if data.note.clinicalNote}
				<div class="mt-4 text-sm">
					<span class="font-medium text-base-content/70">Clinical note:</span>
					<p class="mt-1 text-base-content/80">{data.note.clinicalNote}</p>
				</div>
			{/if}
		</div>
	</main>
{/if}
