<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { request } from '#lib/stores/request.svelte.js';
	import Badge from '#lib/components/ui/Badge.svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import Alert from '#lib/components/ui/Alert.svelte';
	import {
		appropriatenessLabel,
		appropriatenessColor,
		contraindicationLabel,
		contraindicationColor,
		triageTierLabel,
		triageTierColor,
		recommendationLabel,
		recommendationColor,
		priorityColor,
		indicationLabel,
		procedureIntentLabel,
		ctHeadStatusLabel,
		settingLabel
	} from '#lib/engine/utils.js';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(request.data);
	const result = $derived(request.result);

	$effect(() => {
		if (!request.result) {
			goto(`/lumbar-puncture-test-request/lumbar-puncture-test-requests/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/lumbar-puncture-test-requests/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: request.data, result: request.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `lumbar-puncture-test-request-${new Date().toISOString().slice(0, 10)}.pdf`;
				a.click();
				URL.revokeObjectURL(url);
			} else {
				pdfError = 'Failed to generate PDF. Please try again.';
			}
		} catch {
			pdfError = 'Failed to generate PDF. Please check your connection and try again.';
		}
	}

	const patientName = $derived(`${data.patient.firstName} ${data.patient.lastName}`.trim());

	function neuroList() {
		const list: string[] = [];
		if (data.neuroSafety.suspectedRaisedIntracranialPressure) list.push('Suspected raised intracranial pressure');
		if (data.neuroSafety.focalNeurologicalSigns) list.push('New focal neurological signs');
		if (data.neuroSafety.reducedConsciousness) list.push('Reduced consciousness (GCS ≤ 9)');
		return list;
	}

	function bleedingList() {
		const list: string[] = [];
		if (data.bleeding.takingAnticoagulant)
			list.push(`Anticoagulant${data.bleeding.anticoagulantAgent ? ` (${data.bleeding.anticoagulantAgent})` : ''}`);
		if (data.bleeding.takingAntiplatelet)
			list.push(`Antiplatelet${data.bleeding.antiplateletAgent ? ` (${data.bleeding.antiplateletAgent})` : ''}`);
		if (data.bleeding.bleedingDisorder) list.push('Known bleeding disorder / coagulopathy');
		if (data.bleeding.localSkinInfection) list.push('Local skin / soft-tissue infection at the puncture site');
		if (data.bleeding.inr !== null) list.push(`INR ${data.bleeding.inr}`);
		if (data.bleeding.plateletCount !== null) list.push(`Platelets ${data.bleeding.plateletCount} ×10⁹/L`);
		return list;
	}
</script>

{#if result}
	<header class="border-b border-base-300 bg-base-100 shadow-sm no-print">
		<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
			<h1 class="text-lg font-bold text-base-content">Lumbar puncture request — vetting report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/lumbar-puncture-test-request/lumbar-puncture-test-requests/${id}`)}>Edit</Button>
			</div>
		</div>
	</header>

	<main class="mx-16 px-4 py-6">
		<!-- Contraindication / emergency alert -->
		{#if result.contraindicationBand === 'contraindicated'}
			<Alert type="error" heading="Contraindicated" class="mb-6">
				<p>
					A safety rule contraindicates lumbar puncture (raised ICP without reassuring imaging, local
					infection, or severe thrombocytopenia). Correct or image first, or choose another pathway.
				</p>
			</Alert>
		{:else if result.triageTier === 'emergency'}
			<Alert type="error" heading="Emergency triage" class="mb-6">
				<p>
					This request auto-escalates to the emergency pathway (suspected meningitis, subarachnoid
					haemorrhage, or CNS infection). Do not wait for a routine slot.
				</p>
			</Alert>
		{:else if result.contraindicationBand === 'caution'}
			<Alert type="warning" heading="Proceed with caution" class="mb-6">
				<p>A safety rule fired (bleeding risk or borderline thrombocytopenia). Address it before LP.</p>
			</Alert>
		{/if}

		<!-- Four-axis vetting grade -->
		<div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
			<div class="rounded-xl border border-base-300 bg-base-100 p-4 text-center">
				<div class="mb-2 text-xs font-semibold uppercase text-base-content/60">Appropriateness</div>
				<Badge
					label={appropriatenessLabel(result.appropriatenessBand)}
					color={appropriatenessColor(result.appropriatenessBand)}
				/>
				<div class="mt-1 text-xs text-base-content/60">Score {result.appropriatenessScore}/9</div>
			</div>
			<div class="rounded-xl border border-base-300 bg-base-100 p-4 text-center">
				<div class="mb-2 text-xs font-semibold uppercase text-base-content/60">Safety</div>
				<Badge
					label={contraindicationLabel(result.contraindicationBand)}
					color={contraindicationColor(result.contraindicationBand)}
				/>
			</div>
			<div class="rounded-xl border border-base-300 bg-base-100 p-4 text-center">
				<div class="mb-2 text-xs font-semibold uppercase text-base-content/60">Completeness</div>
				<div class="text-2xl font-bold text-base-content">{result.completenessPercent}%</div>
			</div>
			<div class="rounded-xl border border-base-300 bg-base-100 p-4 text-center">
				<div class="mb-2 text-xs font-semibold uppercase text-base-content/60">Triage priority</div>
				<Badge label={triageTierLabel(result.triageTier)} color={triageTierColor(result.triageTier)} />
				<div class="mt-1 text-xs text-base-content/60">{result.targetTimeframe}</div>
			</div>
		</div>

		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-2 text-lg font-bold text-base-content">Recommendation</h2>
			<Badge
				label={recommendationLabel(result.recommendation)}
				color={recommendationColor(result.recommendation)}
			/>
			<p class="mt-2 text-xs text-base-content/60">
				Graded {new Date(result.gradedAt).toLocaleString()}
			</p>
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
								<span class="font-medium">{flag.category}:</span>
								{flag.description}
								<div class="mt-0.5 text-xs opacity-80">{flag.suggestedAction}</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Request body -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Request</h2>
			<dl class="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
				<div><dt class="font-medium text-base-content/70">Patient</dt><dd>{patientName || 'N/A'}</dd></div>
				<div><dt class="font-medium text-base-content/70">NHS number</dt><dd>{data.patient.nhsNumber || 'N/A'}</dd></div>
				<div><dt class="font-medium text-base-content/70">Requesting clinician</dt><dd>{data.clinician.clinicianName || 'N/A'}</dd></div>
				<div><dt class="font-medium text-base-content/70">Setting</dt><dd>{settingLabel(data.triage.setting)}</dd></div>
				<div><dt class="font-medium text-base-content/70">Procedure intent</dt><dd>{procedureIntentLabel(data.procedure.procedureIntent)}</dd></div>
				<div><dt class="font-medium text-base-content/70">Primary indication</dt><dd>{indicationLabel(data.procedure.primaryIndication)}</dd></div>
				<div><dt class="font-medium text-base-content/70">Requested urgency</dt><dd>{data.triage.urgency || 'N/A'}</dd></div>
				<div><dt class="font-medium text-base-content/70">Opening pressure required</dt><dd>{data.triage.openingPressureRequired ? 'Yes' : 'No'}</dd></div>
				<div><dt class="font-medium text-base-content/70">CT head status</dt><dd>{ctHeadStatusLabel(data.neuroSafety.ctHeadStatus)}</dd></div>
			</dl>

			<h3 class="mt-4 mb-1 font-semibold text-base-content/80">Clinical question</h3>
			<p class="text-sm text-base-content/80">{data.procedure.clinicalQuestion || 'Not specified'}</p>

			<h3 class="mt-4 mb-1 font-semibold text-base-content/80">Relevant history</h3>
			<p class="text-sm text-base-content/80">{data.procedure.relevantHistory || 'Not specified'}</p>

			<h3 class="mt-4 mb-1 font-semibold text-base-content/80">Raised-ICP / neurological screen</h3>
			{#if neuroList().length > 0}
				<ul class="list-disc pl-5 text-sm text-base-content/80">
					{#each neuroList() as s (s)}
						<li>{s}</li>
					{/each}
				</ul>
			{:else}
				<p class="text-sm text-base-content/80">No raised-ICP features recorded</p>
			{/if}

			<h3 class="mt-4 mb-1 font-semibold text-base-content/80">Bleeding / coagulation</h3>
			{#if bleedingList().length > 0}
				<ul class="list-disc pl-5 text-sm text-base-content/80">
					{#each bleedingList() as b (b)}
						<li>{b}</li>
					{/each}
				</ul>
			{:else}
				<p class="text-sm text-base-content/80">No bleeding risk recorded</p>
			{/if}

			<h3 class="mt-4 mb-1 font-semibold text-base-content/80">Notes</h3>
			<p class="text-sm text-base-content/80">{data.triage.notes || 'None'}</p>
		</div>

		<!-- Fired rules -->
		{#if result.firedRules.length > 0}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Fired rules (audit trail)</h2>
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b text-left text-base-content/70">
							<th class="pb-2 pr-4">Rule</th>
							<th class="pb-2 pr-4">Axis</th>
							<th class="pb-2">Description</th>
						</tr>
					</thead>
					<tbody>
						{#each result.firedRules as rule (rule.ruleId)}
							<tr class="border-b border-base-200">
								<td class="py-2 pr-4 font-mono text-xs text-base-content/60">{rule.ruleId}</td>
								<td class="py-2 pr-4">{rule.axis}</td>
								<td class="py-2">{rule.description}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</main>
{/if}
