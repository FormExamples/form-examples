<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import {
		riskZoneLabel,
		riskZoneColor,
		percentileBandLabel,
		gestationBandLabel,
		priorityLabel,
		priorityColor,
		careSettingLabel,
		clinicianRoleLabel,
		sexLabel,
		measurementMethodLabel,
		formatTsb
	} from '$lib/engine/utils';
	import Button from '$lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/bhutani-bilirubin-nomogram/bhutani-bilirubin-nomograms/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/bhutani-bilirubin-nomograms/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `bhutani-nomogram-${data.identification.infantIdentifier || id}.pdf`;
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
			<h1 class="text-lg font-bold text-base-content">Bhutani nomogram report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button
					data-variant="secondary"
					onclick={() => goto(`/bhutani-bilirubin-nomogram/bhutani-bilirubin-nomograms/${id}`)}>Edit</Button
				>
			</div>
		</div>
	</header>

	<main class="mx-16 px-4 py-6">
		<!-- Result banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {riskZoneColor(result.riskZone)}">
			<div class="text-2xl font-bold">{riskZoneLabel(result.riskZone)}</div>
			<div class="mt-2 text-sm font-semibold">
				{percentileBandLabel(result.percentileBand)} · gestation band {gestationBandLabel(
					result.gestationBand
				)}
			</div>
			<div class="mt-2 text-sm opacity-75">
				Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Recommended action -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-2 text-lg font-bold text-base-content">Recommended action</h2>
			{#if result.riskZone === null}
				<p class="text-sm text-base-content/80">
					Both the age at measurement and the total serum bilirubin are required to assign a risk
					zone. Record the missing input and re-classify.
				</p>
			{:else if result.aboveExchange}
				<p class="text-sm text-base-content/80">
					<strong>Medical emergency</strong>: the TSB is at or above the exchange-transfusion
					threshold. Seek urgent senior / neonatal review, start intensive phototherapy immediately,
					and prepare for exchange transfusion per local protocol.
				</p>
			{:else if result.abovePhototherapy}
				<p class="text-sm text-base-content/80">
					The TSB is <strong>at or above the phototherapy threshold</strong>. Start phototherapy per
					the gestation-specific NICE chart and repeat the TSB within 4&ndash;6 hours.
				</p>
			{:else if result.riskZone === 'high' || result.riskZone === 'high-intermediate'}
				<p class="text-sm text-base-content/80">
					The TSB is <strong>below the treatment thresholds</strong> but in a higher-risk zone.
					Ensure timely re-testing, closer surveillance, and review against the treatment thresholds.
				</p>
			{:else}
				<p class="text-sm text-base-content/80">
					The TSB is <strong>below the treatment thresholds</strong> and in a lower-risk zone.
					Interpret in clinical context and re-test as indicated; this is a prediction, not a
					diagnosis.
				</p>
			{/if}
		</div>

		<!-- Measurement and classification -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Measurement and classification</h2>
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-base-300 text-left text-base-content/70">
						<th class="pb-2 pr-4">Item</th>
						<th class="pb-2">Value</th>
					</tr>
				</thead>
				<tbody>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4">Age at measurement</td>
						<td class="py-2">{result.ageHours === null ? 'Not recorded' : `${result.ageHours} h`}</td>
					</tr>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4">Total serum bilirubin (TSB)</td>
						<td class="py-2">{formatTsb(data.measurement.totalSerumBilirubinUmolL)}</td>
					</tr>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4">Percentile tracks (p40 / p75 / p95)</td>
						<td class="py-2"
							>{result.p40 === null
								? 'N/A'
								: `${result.p40} / ${result.p75} / ${result.p95} µmol/L`}</td
						>
					</tr>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4">Phototherapy threshold</td>
						<td class="py-2"
							>{result.phototherapyThreshold === null
								? 'N/A'
								: `${result.phototherapyThreshold} µmol/L`} — TSB
							{result.abovePhototherapy ? 'at/above' : 'below'}</td
						>
					</tr>
					<tr class="border-b border-base-200 font-semibold">
						<td class="py-2 pr-4">Exchange-transfusion threshold</td>
						<td class="py-2"
							>{result.exchangeThreshold === null
								? 'N/A'
								: `${result.exchangeThreshold} µmol/L`} — TSB
							{result.aboveExchange ? 'at/above' : 'below'}</td
						>
					</tr>
				</tbody>
			</table>
		</div>

		<!-- Risk factors -->
		{#if result.firedRiskFactors.length > 0}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">
					Risk factors present ({result.firedRiskFactors.length})
				</h2>
				<ul class="list-disc space-y-1 pl-5 text-sm text-base-content/80">
					{#each result.firedRiskFactors as rf (rf.id)}
						<li>{rf.label}</li>
					{/each}
				</ul>
			</div>
		{/if}

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

		<!-- Infant / context summary -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Assessment summary</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div>
					<span class="font-medium text-base-content/70">Infant ID:</span>
					{data.identification.infantIdentifier || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Sex:</span>
					{sexLabel(data.identification.sex) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Gestational age:</span>
					{data.identification.gestationalAgeWeeks === null
						? 'N/A'
						: `${data.identification.gestationalAgeWeeks} weeks`}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Measurement method:</span>
					{measurementMethodLabel(data.measurement.measurementMethod) || 'N/A'}
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
