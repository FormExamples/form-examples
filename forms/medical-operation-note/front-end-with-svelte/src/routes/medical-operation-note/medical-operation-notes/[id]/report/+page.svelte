<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { store } from '$lib/state.svelte';
	import { sampleOperationNotes } from '$lib/data/sample-reports';
	import {
		compositeRiskLabel,
		compositeRiskColor,
		clavienDindoLabel,
		bloodLossBandLabel
	} from '$lib/engine/utils';
	import Button from '$lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');

	// Hydrate the store if the report is opened directly (deep link) before the
	// wizard ran for this id.
	$effect(() => {
		const seed = sampleOperationNotes.find((s) => s.id === id)?.data;
		if (store.id !== id) {
			store.loadForId(id, seed);
		}
	});

	const data = $derived(store.data);
	const result = $derived(store.result);

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/medical-operation-notes/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: store.data, result: store.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `operation-note-${data.patient.lastName || id}.pdf`;
				a.click();
				URL.revokeObjectURL(url);
			} else {
				pdfError = 'Failed to generate PDF. Please try again.';
			}
		} catch {
			pdfError = 'Failed to generate PDF. Please check your connection and try again.';
		}
	}

	const priorityColor: Record<string, string> = {
		high: 'bg-error text-error-content border-error',
		medium: 'bg-warning text-warning-content border-warning',
		low: 'bg-base-300 text-base-content border-base-300'
	};
</script>

<header class="border-b border-base-300 bg-base-100 shadow-sm no-print">
	<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
		<h1 class="text-lg font-bold text-base-content">Medical operation note report</h1>
		<div class="flex items-center gap-3">
			{#if pdfError}
				<span class="text-sm text-error">{pdfError}</span>
			{/if}
			<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
			<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
			<Button data-variant="secondary" onclick={() => goto(`/medical-operation-note/medical-operation-notes/${id}`)}>Edit</Button>
		</div>
	</div>
</header>

<main class="mx-auto max-w-4xl px-4 py-6">
	<!-- Composite-risk banner -->
	<div class="mb-6 rounded-xl border-2 p-6 text-center {compositeRiskColor(result.finalRisk)}">
		<div class="text-3xl font-bold">{compositeRiskLabel(result.finalRisk)}</div>
		<div class="mt-2 flex flex-wrap justify-center gap-6 text-sm">
			<span>Clavien–Dindo: {clavienDindoLabel(result.clavienDindoGrade)}</span>
			<span>Blood loss: {bloodLossBandLabel(result.bloodLossBand)}</span>
			<span>Counts: {result.countsAgreed ? 'agreed' : 'discrepancy'}</span>
			{#if result.asaPhysicalStatus !== null}<span>ASA {result.asaPhysicalStatus}</span>{/if}
		</div>
		{#if result.finalRisk !== result.compositeRisk}
			<div class="mt-2 text-sm opacity-80">
				Surgeon override — computed {compositeRiskLabel(result.compositeRisk)}.
				{#if result.surgeonOverrideReason}Reason: {result.surgeonOverrideReason}{/if}
			</div>
		{/if}
	</div>

	<!-- Safety flags -->
	{#if result.additionalFlags.length > 0}
		<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-error">Safety flags for the surgical team</h2>
			<div class="space-y-2">
				{#each result.additionalFlags as flag (flag.flagId)}
					<div class="flex items-start gap-3 rounded-lg border p-3 {priorityColor[flag.priority]}">
						<span class="mt-0.5 rounded px-2 py-0.5 text-xs font-bold uppercase {priorityColor[flag.priority]}">
							{flag.priority}
						</span>
						<div>
							<span class="font-medium">{flag.category}:</span> {flag.description}
							<div class="mt-1 text-xs opacity-80">{flag.suggestedAction}</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Fired rules -->
	{#if result.firedRules.length > 0}
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Composite-risk justification</h2>
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-base-300 text-left text-base-content/70">
						<th class="pb-2 pr-4">Rule</th>
						<th class="pb-2 pr-4">Instrument</th>
						<th class="pb-2 pr-4">Finding</th>
						<th class="pb-2">Grade</th>
					</tr>
				</thead>
				<tbody>
					{#each result.firedRules as rule (rule.ruleId)}
						<tr class="border-b border-base-200">
							<td class="py-2 pr-4 font-mono text-xs text-base-content/60">{rule.ruleId}</td>
							<td class="py-2 pr-4">{rule.instrument}</td>
							<td class="py-2 pr-4">{rule.description}</td>
							<td class="py-2 font-semibold">{rule.grade}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}

	<!-- Operation & patient summary -->
	<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
		<h2 class="mb-4 text-lg font-bold text-base-content">Operation summary</h2>
		<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
			<div><span class="font-medium text-base-content/70">Hospital:</span> {data.operation.hospital || '—'}</div>
			<div><span class="font-medium text-base-content/70">Theatre:</span> {data.operation.theatreNumber || '—'}</div>
			<div><span class="font-medium text-base-content/70">Patient:</span> {data.patient.firstName} {data.patient.lastName}</div>
			<div><span class="font-medium text-base-content/70">NHS / MRN:</span> {data.patient.nhsNumber || '—'} / {data.patient.mrn || '—'}</div>
			<div><span class="font-medium text-base-content/70">Pre-op diagnosis:</span> {data.diagnosesAndProcedures.preOperativeDiagnosis || '—'}</div>
			<div><span class="font-medium text-base-content/70">Post-op diagnosis:</span> {data.diagnosesAndProcedures.postOperativeDiagnosis || '—'}</div>
			<div class="sm:col-span-2"><span class="font-medium text-base-content/70">Performed:</span> {data.diagnosesAndProcedures.performedProcedures || '—'}</div>
			<div><span class="font-medium text-base-content/70">OPCS-4:</span> {data.diagnosesAndProcedures.opcs4Codes || '—'}</div>
			<div><span class="font-medium text-base-content/70">Urgency:</span> {data.diagnosesAndProcedures.urgency || '—'}</div>
			<div><span class="font-medium text-base-content/70">Recovery:</span> {data.postOperativePlan.recoveryDestination || '—'}</div>
			<div><span class="font-medium text-base-content/70">EBL:</span> {data.safetyCountsEbl.estimatedBloodLossMl ?? '—'} mL</div>
		</div>
	</div>

	<!-- Surgical team -->
	{#if data.team.length > 0}
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Surgical team</h2>
			<ul class="list-disc space-y-1 pl-5 text-sm text-base-content/80">
				{#each data.team as member, i (i)}
					<li>
						<strong>{member.role || '—'}</strong> — {member.name || '—'}
						{#if member.registrationNumber}({member.registrationBody} {member.registrationNumber}){/if}
					</li>
				{/each}
			</ul>
		</div>
	{/if}

	<!-- Electronic signature -->
	<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6 text-sm">
		<span class="font-medium text-base-content/70">Signed electronically:</span>
		{data.signOff.electronicSignatureName || '—'}
		{#if data.signOff.dictationTimestamp}<span class="ml-2 text-base-content/60">({data.signOff.dictationTimestamp})</span>{/if}
	</div>
</main>
