<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { store } from '#lib/stores/assessment.svelte.js';
	import { fitnessBandColor, fitnessBandLabel, priorityColor } from '#lib/engine/utils.js';
	import Button from '#lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(store.data);
	const result = $derived(store.result);

	$effect(() => {
		if (!store.result) {
			goto(`/medical-information-form-for-air-travel/medical-information-forms-for-air-travel/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/medical-information-forms-for-air-travel/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: store.data, result: store.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `medif-${data.passenger.lastName || id}.pdf`;
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
			<h1 class="text-lg font-bold text-base-content">MEDIF fitness-to-fly report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button
					data-variant="secondary"
					onclick={() => goto(`/medical-information-form-for-air-travel/medical-information-forms-for-air-travel/${id}`)}>Edit</Button
				>
			</div>
		</div>
	</header>

	<main class="mx-16 px-4 py-6">
		<!-- Fitness band banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {fitnessBandColor(result.fitnessBand)}">
			<div class="text-3xl font-bold">{fitnessBandLabel(result.fitnessBand)}</div>
			<div class="mt-2 text-sm">{result.deskRecommendation}</div>
			<div class="mt-2 text-sm opacity-75">Valid until {result.validUntil || '—'}</div>
		</div>

		<!-- Safety flags -->
		{#if result.safetyFlags.length > 0}
			<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-error">Safety flags for the medical desk</h2>
				<div class="space-y-2">
					{#each result.safetyFlags as flag (flag.flagId)}
						<div class="flex items-start gap-3 rounded-lg border p-3 {priorityColor(flag.priority)}">
							<span class="mt-0.5 rounded px-2 py-0.5 text-xs font-bold uppercase {priorityColor(flag.priority)}">
								{flag.priority}
							</span>
							<div>
								<span class="font-medium">{flag.category}:</span>
								{flag.description}
								<div class="text-sm opacity-80">{flag.suggestedAction}</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Fired rules -->
		{#if result.firedRules.length > 0}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Fitness band justification</h2>
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b border-base-300 text-left text-base-content/70">
							<th class="pb-2 pr-4">Rule</th>
							<th class="pb-2 pr-4">Category</th>
							<th class="pb-2 pr-4">Finding</th>
							<th class="pb-2">Band</th>
						</tr>
					</thead>
					<tbody>
						{#each result.firedRules as rule (rule.ruleId)}
							<tr class="border-b border-base-200">
								<td class="py-2 pr-4 font-mono text-xs text-base-content/60">{rule.ruleId}</td>
								<td class="py-2 pr-4">{rule.category}</td>
								<td class="py-2 pr-4">{rule.description}</td>
								<td class="py-2">{fitnessBandLabel(rule.band)}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}

		<!-- Passenger & trip summary -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Passenger and trip</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div><span class="font-medium text-base-content/70">Passenger:</span> {data.passenger.firstName} {data.passenger.lastName}</div>
				<div><span class="font-medium text-base-content/70">Date of birth:</span> {data.passenger.dateOfBirth || '—'}</div>
				<div><span class="font-medium text-base-content/70">Airline:</span> {data.trip.airlineName || '—'}</div>
				<div><span class="font-medium text-base-content/70">Flight:</span> {data.trip.outboundFlightNumber || '—'} ({data.trip.outboundOriginIata || '?'} → {data.trip.outboundDestinationIata || '?'})</div>
				<div><span class="font-medium text-base-content/70">Departure:</span> {data.trip.outboundDate || '—'}</div>
				<div><span class="font-medium text-base-content/70">Physician:</span> {data.physician.physicianName || '—'}</div>
				<div><span class="font-medium text-base-content/70">Primary diagnosis:</span> {data.diagnosis.primaryDiagnosis || '—'}</div>
				<div><span class="font-medium text-base-content/70">Physician declaration:</span> {data.signoff.physicianDeclaration || '—'}</div>
			</div>
		</div>
	</main>
{/if}
