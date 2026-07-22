<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import {
		progressLabel,
		progressColor,
		priorityLabel,
		priorityColor,
		clinicianRoleLabel,
		careSettingLabel,
		ageBandLabel,
		parityLabel,
		membranesLabel,
		durationBandLabel,
		contractionStrengthLabel,
		liquorStateLabel,
		mouldingLabel
	} from '$lib/engine/utils';
	import Button from '$lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/partogram/partograms/${id}`);
		}
	});

	let pdfError = $state('');

	const fmtCm = (v: number | null) => (v === null ? '—' : `${v.toFixed(1)} cm`);
	const fmtHours = (v: number | null) => (v === null ? '—' : `${v.toFixed(1)} h`);

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/partograms/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `partogram-${data.patient.patientIdentifier || id}.pdf`;
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
			<h1 class="text-lg font-bold text-base-content">Partogram report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/partogram/partograms/${id}`)}>Edit</Button>
			</div>
		</div>
	</header>

	<main class="mx-16 px-4 py-6">
		<!-- Progress banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {progressColor(result.progressClassification)}">
			<div class="text-3xl font-bold">{progressLabel(result.progressClassification)}</div>
			<div class="mt-2 text-sm font-semibold">
				{result.latestDilatationCm === null
					? 'No cervical dilatation recorded — progress cannot be plotted'
					: `Latest dilatation ${result.latestDilatationCm} cm at ${fmtHours(result.elapsedHours)} of active labour`}
			</div>
			<div class="mt-2 text-sm opacity-75">
				Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Reference lines -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Reference lines</h2>
			<table class="w-full text-sm">
				<tbody>
					<tr class="border-b border-base-200">
						<th class="py-2 pr-4 text-left font-medium text-base-content/70">Elapsed time (t)</th>
						<td class="py-2">{fmtHours(result.elapsedHours)}</td>
					</tr>
					<tr class="border-b border-base-200">
						<th class="py-2 pr-4 text-left font-medium text-base-content/70">Latest dilatation</th>
						<td class="py-2">{fmtCm(result.latestDilatationCm)}</td>
					</tr>
					<tr class="border-b border-base-200">
						<th class="py-2 pr-4 text-left font-medium text-base-content/70">Alert line expects</th>
						<td class="py-2">{fmtCm(result.alertLineExpectedCm)}</td>
					</tr>
					<tr class="border-b border-base-200">
						<th class="py-2 pr-4 text-left font-medium text-base-content/70">Action line expects</th>
						<td class="py-2">{fmtCm(result.actionLineExpectedCm)}</td>
					</tr>
				</tbody>
			</table>
		</div>

		<!-- Observation series -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">
				Observation series ({data.observations.length})
			</h2>
			{#if data.observations.length === 0}
				<p class="text-sm text-base-content/70">No observations recorded.</p>
			{:else}
				<div class="overflow-x-auto">
					<table class="w-full text-sm">
						<thead>
							<tr class="border-b border-base-300 text-left text-base-content/70">
								<th class="pb-2 pr-4">Time</th>
								<th class="pb-2 pr-4">Dil.</th>
								<th class="pb-2 pr-4">Desc.</th>
								<th class="pb-2 pr-4">Ctx/10</th>
								<th class="pb-2 pr-4">FHR</th>
								<th class="pb-2 pr-4">Liquor</th>
								<th class="pb-2 pr-4">Mould.</th>
								<th class="pb-2">BP</th>
							</tr>
						</thead>
						<tbody>
							{#each data.observations as obs, i (i)}
								<tr class="border-b border-base-200">
									<td class="py-2 pr-4">{obs.observedAt || `Set ${i + 1}`}</td>
									<td class="py-2 pr-4">{obs.cervicalDilatationCm ?? '—'}</td>
									<td class="py-2 pr-4">{obs.descentFifths === null ? '—' : `${obs.descentFifths}/5`}</td>
									<td class="py-2 pr-4">
										{obs.contractionsPer10Min ?? '—'}
										{#if obs.contractionDurationBand || obs.contractionStrength}
											<span class="text-base-content/60">
												({durationBandLabel(obs.contractionDurationBand)}{obs.contractionDurationBand &&
												obs.contractionStrength
													? ', '
													: ''}{contractionStrengthLabel(obs.contractionStrength)})
											</span>
										{/if}
									</td>
									<td class="py-2 pr-4">{obs.fetalHeartRate ?? '—'}</td>
									<td class="py-2 pr-4">{liquorStateLabel(obs.liquorState) || '—'}</td>
									<td class="py-2 pr-4">{mouldingLabel(obs.moulding) || '—'}</td>
									<td class="py-2">{obs.systolicBloodPressure ?? '—'}/{obs.diastolicBloodPressure ?? '—'}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
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

		<!-- Labour context summary -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Labour context</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div>
					<span class="font-medium text-base-content/70">Patient ID:</span>
					{data.patient.patientIdentifier || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Recorded by:</span>
					{data.context.clinicianName || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Role:</span>
					{clinicianRoleLabel(data.context.clinicianRole) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Care setting:</span>
					{careSettingLabel(data.context.careSetting) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Age band:</span>
					{ageBandLabel(data.patient.ageBand) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Parity:</span>
					{parityLabel(data.patient.parity) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Gestation:</span>
					{data.patient.gestationWeeks === null ? 'N/A' : `${data.patient.gestationWeeks} weeks`}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Membranes:</span>
					{membranesLabel(data.admission.membranesOnAdmission) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Active phase started:</span>
					{result.activePhaseStartAt || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Risk factors:</span>
					{data.admission.riskFactors || 'N/A'}
				</div>
			</div>
		</div>
	</main>
{/if}
