<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { requestStore } from '$lib/stores/result.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import {
		appropriatenessLabel,
		appropriatenessColor,
		safetyLabel,
		safetyColor,
		triageTierLabel,
		triageTierColor,
		recommendationLabel,
		recommendationColor,
		priorityColor,
		requestedServiceLabel,
		referralReasonLabel,
		statusLabel
	} from '$lib/engine/utils';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(requestStore.data);
	const result = $derived(requestStore.result);

	$effect(() => {
		if (!requestStore.result) {
			goto(`/nuclear-medicine-test-request/cardiology-requests/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/cardiology-requests/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: requestStore.data, result: requestStore.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `cardiology-request-${new Date().toISOString().slice(0, 10)}.pdf`;
				a.click();
				URL.revokeObjectURL(url);
			} else {
				pdfError = 'Failed to generate PDF. Please try again.';
			}
		} catch {
			pdfError = 'Failed to generate PDF. Please check your connection and try again.';
		}
	}

	function symptomList() {
		const list: string[] = [];
		if (data.symptomChestPain) list.push('Chest pain');
		if (data.symptomBreathlessness) list.push('Breathlessness');
		if (data.symptomPalpitations) list.push('Palpitations');
		if (data.symptomSyncope) list.push('Syncope / blackout');
		if (data.symptomOedema) list.push('Peripheral oedema');
		return list;
	}

	function historyList() {
		const list: string[] = [];
		if (data.knownCoronaryArteryDisease) list.push('Known coronary artery disease');
		if (data.previousMi) list.push('Previous myocardial infarction');
		if (data.heartFailure) list.push('Established heart failure');
		if (data.valveDisease) list.push('Valve disease');
		if (data.arrhythmia) list.push('Arrhythmia');
		if (data.hypertension) list.push('Hypertension');
		if (data.diabetes) list.push('Diabetes');
		return list;
	}
</script>

{#if result}
	<header class="border-b border-base-300 bg-base-100 shadow-sm no-print">
		<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
			<h1 class="text-lg font-bold text-base-content">Cardiology referral — vetting report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/nuclear-medicine-test-request/cardiology-requests/${id}`)}>Edit</Button>
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-4xl px-4 py-6">
		<!-- Emergency / red-flag alert -->
		{#if result.triageTier === 'emergency'}
			<Alert type="error" heading="Emergency triage" class="mb-6">
				<p>
					This referral contains an acute red flag (suspected ACS or elevated troponin). Divert to
					the emergency pathway now; do not wait for a routine clinic.
				</p>
			</Alert>
		{:else if result.safetyBand === 'red-flag'}
			<Alert type="warning" heading="Red-flag referral" class="mb-6">
				<p>This referral fired a red-flag safety rule and has been escalated for urgent vetting.</p>
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
			</div>
			<div class="rounded-xl border border-base-300 bg-base-100 p-4 text-center">
				<div class="mb-2 text-xs font-semibold uppercase text-base-content/60">Safety</div>
				<Badge label={safetyLabel(result.safetyBand)} color={safetyColor(result.safetyBand)} />
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

		<!-- Referral body -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Referral</h2>
			<dl class="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
				<div><dt class="font-medium text-base-content/70">Patient</dt><dd>{data.patientName || 'N/A'}</dd></div>
				<div><dt class="font-medium text-base-content/70">NHS number</dt><dd>{data.nhsNumber || 'N/A'}</dd></div>
				<div><dt class="font-medium text-base-content/70">Referring clinician</dt><dd>{data.referringClinician || 'N/A'}</dd></div>
				<div><dt class="font-medium text-base-content/70">Status</dt><dd>{statusLabel(data.status)}</dd></div>
				<div><dt class="font-medium text-base-content/70">Requested service</dt><dd>{requestedServiceLabel(data.requestedService)}</dd></div>
				<div><dt class="font-medium text-base-content/70">Referral reason</dt><dd>{referralReasonLabel(data.referralReason)}</dd></div>
				<div><dt class="font-medium text-base-content/70">Requested urgency</dt><dd>{data.urgency || 'N/A'}</dd></div>
				<div><dt class="font-medium text-base-content/70">Troponin</dt><dd>{data.troponinStatus || 'N/A'}</dd></div>
				<div><dt class="font-medium text-base-content/70">BNP</dt><dd>{data.bnpStatus || 'N/A'}</dd></div>
			</dl>

			<h3 class="mt-4 mb-1 font-semibold text-base-content/80">Clinical question</h3>
			<p class="text-sm text-base-content/80">{data.clinicalQuestion || 'Not specified'}</p>

			<h3 class="mt-4 mb-1 font-semibold text-base-content/80">Relevant history</h3>
			<p class="text-sm text-base-content/80">{data.relevantHistory || 'Not specified'}</p>

			<h3 class="mt-4 mb-1 font-semibold text-base-content/80">Symptoms</h3>
			{#if symptomList().length > 0}
				<ul class="list-disc pl-5 text-sm text-base-content/80">
					{#each symptomList() as s (s)}
						<li>{s}</li>
					{/each}
				</ul>
			{:else}
				<p class="text-sm text-base-content/80">None recorded</p>
			{/if}

			<h3 class="mt-4 mb-1 font-semibold text-base-content/80">Cardiac history and risk factors</h3>
			{#if historyList().length > 0}
				<ul class="list-disc pl-5 text-sm text-base-content/80">
					{#each historyList() as h (h)}
						<li>{h}</li>
					{/each}
				</ul>
			{:else}
				<p class="text-sm text-base-content/80">None recorded</p>
			{/if}

			<h3 class="mt-4 mb-1 font-semibold text-base-content/80">Notes</h3>
			<p class="text-sm text-base-content/80">{data.notes || 'None'}</p>
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
