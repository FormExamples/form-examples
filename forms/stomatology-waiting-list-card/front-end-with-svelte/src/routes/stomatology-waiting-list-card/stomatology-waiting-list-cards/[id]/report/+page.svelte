<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { store } from '$lib/stores/card.svelte';
	import {
		waitingTimeStatusLabel,
		waitingTimeStatusColor,
		clinicalPriorityLabel,
		flagPriorityColor
	} from '$lib/engine/utils';
	import Button from '$lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(store.data);
	const result = $derived(store.result);

	$effect(() => {
		if (!store.result) {
			goto(`/stomatology-waiting-list-card/stomatology-waiting-list-cards/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/stomatology-waiting-list-cards/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: store.data, result: store.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `stomatology-waiting-list-card-${data.patient.name || id}.pdf`;
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
			<h1 class="text-lg font-bold text-base-content">Waiting list card report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/stomatology-waiting-list-card/stomatology-waiting-list-cards/${id}`)}>
					Edit
				</Button>
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-4xl px-4 py-6">
		<!-- Waiting Time Status banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {waitingTimeStatusColor(result.waitingTimeStatus)}">
			<div class="text-3xl font-bold">{waitingTimeStatusLabel(result.waitingTimeStatus)}</div>
			<div class="mt-2 flex flex-wrap justify-center gap-6 text-sm">
				{#if result.clinicalPriority}<span>{clinicalPriorityLabel(result.clinicalPriority)}</span>{/if}
				{#if result.targetWaitWeeks !== null}<span>Target {result.targetWaitWeeks} wk</span>{/if}
				{#if result.weeksWaited !== null}<span>Waited {result.weeksWaited} wk</span>{/if}
			</div>
		</div>

		<!-- Key dates -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Waiting time</h2>
			<div class="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
				<div><span class="font-medium text-base-content/70">Days waited:</span> {result.daysWaited ?? '—'}</div>
				<div><span class="font-medium text-base-content/70">Days to target:</span> {result.daysToTarget ?? '—'}</div>
				<div><span class="font-medium text-base-content/70">Days to breach:</span> {result.daysToBreach ?? '—'}</div>
				<div><span class="font-medium text-base-content/70">Days to appointment:</span> {result.daysToAppointment ?? '—'}</div>
				<div><span class="font-medium text-base-content/70">RTT clock-start:</span> {data.waitingList.rttClockStartDate ?? '—'}</div>
				<div><span class="font-medium text-base-content/70">Next appointment:</span> {data.appointment.appointmentDate ?? '—'}</div>
			</div>
		</div>

		<!-- Flagged issues -->
		{#if result.additionalFlags.length > 0}
			<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-error">Flagged issues for the booking team</h2>
				<div class="space-y-2">
					{#each result.additionalFlags as flag (flag.flagId)}
						<div class="flex items-start gap-3 rounded-lg border p-3 {flagPriorityColor(flag.priority)}">
							<span class="mt-0.5 rounded px-2 py-0.5 text-xs font-bold uppercase {flagPriorityColor(flag.priority)}">
								{flag.priority}
							</span>
							<div>
								<span class="font-medium">{flag.category}:</span> {flag.description}
								<div class="mt-1 text-sm opacity-80">Suggested action: {flag.suggestedAction}</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Fired rules -->
		{#if result.firedRules.length > 0}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Status justification</h2>
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b border-base-300 text-left text-base-content/70">
							<th class="pb-2 pr-4">Rule</th>
							<th class="pb-2 pr-4">Instrument</th>
							<th class="pb-2 pr-4">Finding</th>
							<th class="pb-2">Band</th>
						</tr>
					</thead>
					<tbody>
						{#each result.firedRules as rule (rule.ruleId)}
							<tr class="border-b border-base-300/60">
								<td class="py-2 pr-4 font-mono text-xs text-base-content/60">{rule.ruleId}</td>
								<td class="py-2 pr-4">{rule.instrument}</td>
								<td class="py-2 pr-4">{rule.description}</td>
								<td class="py-2">{waitingTimeStatusLabel(rule.band)}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}

		<!-- Patient & waiting list summary -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Card summary</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div><span class="font-medium text-base-content/70">Patient:</span> {data.patient.name || '—'}</div>
				<div><span class="font-medium text-base-content/70">NHS number:</span> {data.patient.unitedKingdomNhsNumber || '—'}</div>
				<div><span class="font-medium text-base-content/70">Specialty:</span> {data.waitingList.specialty || '—'}</div>
				<div><span class="font-medium text-base-content/70">Procedure:</span> {data.waitingList.procedureDescription || '—'}</div>
				<div><span class="font-medium text-base-content/70">Practitioner:</span> {data.practitioner.name || '—'}</div>
				<div><span class="font-medium text-base-content/70">Organisation:</span> {data.practitioner.organisationName || '—'}</div>
			</div>
		</div>
	</main>
{/if}
