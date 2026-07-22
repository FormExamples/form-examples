<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { request } from '$lib/stores/request.svelte';
	import {
		appropriatenessBandLabel,
		appropriatenessBandColor,
		suitabilityBandLabel,
		suitabilityBandColor,
		triageTierLabel,
		triageTierColor,
		recommendationColor,
		priorityColor,
		testTypeLabel,
		indicationLabel,
		formatBloodPressure,
		calculateAge
	} from '$lib/engine/utils';
	import Button from '$lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(request.data);
	const result = $derived(request.result);

	$effect(() => {
		if (!request.result) {
			goto(`/ambulatory-blood-pressure-test-request/ambulatory-blood-pressure-test-requests/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/ambulatory-blood-pressure-test-requests/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: request.data, result: request.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `abpm-request-${data.patient.lastName || id}.pdf`;
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
	{@const bp = formatBloodPressure(data.bloodPressure.clinicBpSystolic, data.bloodPressure.clinicBpDiastolic)}
	{@const age = calculateAge(data.patient.dateOfBirth)}
	<header class="border-b border-base-300 bg-base-100 shadow-sm no-print">
		<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
			<h1 class="text-lg font-bold text-base-content">ABPM request vetting report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/ambulatory-blood-pressure-test-request/ambulatory-blood-pressure-test-requests/${id}`)}>Edit</Button>
			</div>
		</div>
	</header>

	<main class="mx-16 px-4 py-6">
		<!-- Recommendation + triage banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {recommendationColor(result.recommendation)}">
			<div class="text-3xl font-bold">{result.recommendationLabel}</div>
			<div class="mt-2 text-sm">
				Triage: {triageTierLabel(result.triageTier)}{result.targetTimeframe ? ` — ${result.targetTimeframe}` : ''}
			</div>
			<div class="mt-2 text-sm opacity-75">
				Generated {new Date(result.timestamp).toLocaleString()} ·
				Test: {testTypeLabel(data.request.testType) || '—'}{bp ? ` · Clinic BP ${bp}` : ''}
			</div>
		</div>

		<!-- Four-axis grade -->
		<div class="mb-6 grid gap-4 sm:grid-cols-2">
			<div class="rounded-xl border border-base-300 bg-base-100 p-4">
				<div class="text-sm font-medium text-base-content/70">A · Appropriateness</div>
				<div class="mt-2 flex items-center gap-3">
					<span class="text-2xl font-bold text-base-content">{result.appropriatenessScore}<span class="text-base font-normal text-base-content/60">/9</span></span>
					<span class="rounded-full border px-3 py-1 text-xs font-bold {appropriatenessBandColor(result.appropriatenessBand)}">
						{appropriatenessBandLabel(result.appropriatenessBand)}
					</span>
				</div>
			</div>
			<div class="rounded-xl border border-base-300 bg-base-100 p-4">
				<div class="text-sm font-medium text-base-content/70">B · Suitability</div>
				<div class="mt-2">
					<span class="rounded-full border px-3 py-1 text-xs font-bold {suitabilityBandColor(result.suitabilityBand)}">
						{suitabilityBandLabel(result.suitabilityBand)}
					</span>
				</div>
			</div>
			<div class="rounded-xl border border-base-300 bg-base-100 p-4">
				<div class="text-sm font-medium text-base-content/70">C · Completeness</div>
				<div class="mt-2 text-2xl font-bold text-base-content">{result.completenessPercent}%</div>
				<div class="mt-2 h-2 w-full overflow-hidden rounded-full bg-base-300">
					<div class="h-full bg-primary" style="width: {result.completenessPercent}%"></div>
				</div>
			</div>
			<div class="rounded-xl border border-base-300 bg-base-100 p-4">
				<div class="text-sm font-medium text-base-content/70">D · Triage priority</div>
				<div class="mt-2">
					<span class="rounded-full border px-3 py-1 text-xs font-bold {triageTierColor(result.triageTier)}">
						{triageTierLabel(result.triageTier)}
					</span>
				</div>
			</div>
		</div>

		<!-- Safety flags -->
		{#if result.flags.length > 0}
			<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-error">Safety flags</h2>
				<div class="space-y-2">
					{#each result.flags as flag (flag.flagId)}
						<div class="flex items-start gap-3 rounded-lg border p-3 {priorityColor(flag.priority)}">
							<span class="mt-0.5 rounded px-2 py-0.5 text-xs font-bold uppercase {priorityColor(flag.priority)}">
								{flag.priority}
							</span>
							<div>
								<span class="font-medium">{flag.category}:</span> {flag.description}
								<div class="mt-1 text-sm opacity-80">{flag.suggestedAction}</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{:else}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6 text-sm text-base-content/70">
				No safety flags raised.
			</div>
		{/if}

		<!-- Fired rules -->
		{#if result.firedRules.length > 0}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Fired rules</h2>
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b border-base-300 text-left text-base-content/70">
							<th class="pb-2 pr-4">Rule</th>
							<th class="pb-2 pr-4">Axis</th>
							<th class="pb-2 pr-4">Category</th>
							<th class="pb-2">Description</th>
						</tr>
					</thead>
					<tbody>
						{#each result.firedRules as rule (rule.ruleId)}
							<tr class="border-b border-base-200">
								<td class="py-2 pr-4 font-mono text-xs text-base-content/60">{rule.ruleId}</td>
								<td class="py-2 pr-4">{rule.axis}</td>
								<td class="py-2 pr-4">{rule.category}</td>
								<td class="py-2">{rule.description}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}

		<!-- Request summary -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Request summary</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div><span class="font-medium text-base-content/70">Patient:</span> {data.patient.firstName} {data.patient.lastName}</div>
				<div>
					<span class="font-medium text-base-content/70">DOB:</span> {data.patient.dateOfBirth || 'N/A'}
					{#if age}(Age {age}){/if}
				</div>
				<div><span class="font-medium text-base-content/70">NHS number:</span> {data.patient.nhsNumber || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Clinic BP:</span> {bp || 'Not recorded'}</div>
				<div><span class="font-medium text-base-content/70">Test type:</span> {testTypeLabel(data.request.testType) || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Indication:</span> {indicationLabel(data.request.primaryIndication) || 'N/A'}</div>
				<div class="sm:col-span-2"><span class="font-medium text-base-content/70">Clinical question:</span> {data.request.clinicalQuestion || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Requesting clinician:</span> {data.clinician.clinicianName || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Referral date:</span> {data.clinician.referralDate || 'N/A'}</div>
			</div>
		</div>
	</main>
{/if}
