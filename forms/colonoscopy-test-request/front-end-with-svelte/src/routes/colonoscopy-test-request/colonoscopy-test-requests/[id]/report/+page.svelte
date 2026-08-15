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
		triageTierLabel,
		triageTierColor,
		riskLabel,
		riskColor,
		recommendationLabel,
		recommendationColor,
		priorityColor,
		procedureLabel,
		indicationLabel,
		settingLabel,
		asaLabel
	} from '#lib/engine/utils.js';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(request.data);
	const result = $derived(request.result);

	$effect(() => {
		if (!request.result) {
			goto(`/colonoscopy-test-request/colonoscopy-test-requests/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/colonoscopy-test-requests/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: request.data, result: request.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `colonoscopy-test-request-${new Date().toISOString().slice(0, 10)}.pdf`;
				a.click();
				URL.revokeObjectURL(url);
			} else {
				pdfError = 'Failed to generate PDF. Please try again.';
			}
		} catch {
			pdfError = 'Failed to generate PDF. Please check your connection and try again.';
		}
	}

	function redFlagList() {
		const list: string[] = [];
		if (data.redFlags.weightLoss) list.push('Unexplained weight loss');
		if (data.redFlags.anaemia) list.push('Iron-deficiency anaemia');
		if (data.redFlags.abdominalMass) list.push('Palpable abdominal / rectal mass');
		if (data.redFlags.rectalBleeding) list.push('Unexplained rectal bleeding');
		return list;
	}
</script>

{#if result}
	<header class="border-b border-base-300 bg-base-100 shadow-sm no-print">
		<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
			<h1 class="text-lg font-bold text-base-content">Colonoscopy request — vetting report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/colonoscopy-test-request/colonoscopy-test-requests/${id}`)}>Edit</Button>
			</div>
		</div>
	</header>

	<main class="mx-16 px-4 py-6">
		<!-- Emergency / two-week-wait alert -->
		{#if result.triageTier === 'emergency'}
			<Alert type="error" heading="Emergency triage" class="mb-6">
				<p>
					This request auto-escalated to emergency (acute presentation with active rectal bleeding).
					Divert to the emergency pathway now; do not wait for a routine clinic.
				</p>
			</Alert>
		{:else if result.twoWeekWaitEligible}
			<Alert type="warning" heading="Suspected-cancer two-week-wait" class="mb-6">
				<p>{result.twoWeekWaitRationale}</p>
			</Alert>
		{/if}

		<!-- Four-axis vetting grade -->
		<div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
			<div class="rounded-xl border border-base-300 bg-base-100 p-4 text-center">
				<div class="mb-2 text-xs font-semibold uppercase text-base-content/60">A. Appropriateness</div>
				<Badge
					label={appropriatenessLabel(result.appropriatenessBand)}
					color={appropriatenessColor(result.appropriatenessBand)}
				/>
				<div class="mt-1 text-xs text-base-content/60">{result.appropriatenessScore}/9</div>
			</div>
			<div class="rounded-xl border border-base-300 bg-base-100 p-4 text-center">
				<div class="mb-2 text-xs font-semibold uppercase text-base-content/60">B. Cancer-pathway urgency</div>
				<Badge label={triageTierLabel(result.triageTier)} color={triageTierColor(result.triageTier)} />
				<div class="mt-1 text-xs text-base-content/60">{result.targetTimeframe}</div>
			</div>
			<div class="rounded-xl border border-base-300 bg-base-100 p-4 text-center">
				<div class="mb-2 text-xs font-semibold uppercase text-base-content/60">C. Completeness</div>
				<div class="text-2xl font-bold text-base-content">{result.completenessPercent}%</div>
			</div>
			<div class="rounded-xl border border-base-300 bg-base-100 p-4 text-center">
				<div class="mb-2 text-xs font-semibold uppercase text-base-content/60">D. Pre-procedure risk</div>
				<Badge label={riskLabel(result.riskBand)} color={riskColor(result.riskBand)} />
			</div>
		</div>

		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-2 text-lg font-bold text-base-content">Recommendation</h2>
			<Badge
				label={recommendationLabel(result.recommendation)}
				color={recommendationColor(result.recommendation)}
			/>
			{#if result.anticoagulantAction}
				<p class="mt-3 text-sm text-base-content/70">{result.anticoagulantAction}</p>
			{/if}
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
				<div><dt class="font-medium text-base-content/70">Patient</dt><dd>{`${data.patient.firstName} ${data.patient.lastName}`.trim() || 'N/A'}</dd></div>
				<div><dt class="font-medium text-base-content/70">NHS number</dt><dd>{data.patient.nhsNumber || 'N/A'}</dd></div>
				<div><dt class="font-medium text-base-content/70">Requesting clinician</dt><dd>{data.clinician.clinicianName || 'N/A'}</dd></div>
				<div><dt class="font-medium text-base-content/70">Care setting</dt><dd>{settingLabel(data.patient.setting)}</dd></div>
				<div><dt class="font-medium text-base-content/70">Requested procedure</dt><dd>{procedureLabel(data.request.procedure)}</dd></div>
				<div><dt class="font-medium text-base-content/70">Primary indication</dt><dd>{indicationLabel(data.request.primaryIndication)}</dd></div>
				<div><dt class="font-medium text-base-content/70">Requested urgency</dt><dd>{data.triage.urgency || 'N/A'}</dd></div>
				<div><dt class="font-medium text-base-content/70">ASA grade</dt><dd>{asaLabel(data.fitness.asaGrade)}</dd></div>
				<div><dt class="font-medium text-base-content/70">FIT result</dt><dd>{data.redFlags.fitResultUgG ?? 'N/A'}{data.redFlags.fitResultUgG != null ? ' µg Hb/g' : ''}</dd></div>
				<div><dt class="font-medium text-base-content/70">Haemoglobin</dt><dd>{data.redFlags.haemoglobinGL ?? 'N/A'}{data.redFlags.haemoglobinGL != null ? ' g/L' : ''}</dd></div>
			</dl>

			<h3 class="mt-4 mb-1 font-semibold text-base-content/80">Clinical question</h3>
			<p class="text-sm text-base-content/80">{data.request.clinicalQuestion || 'Not specified'}</p>

			<h3 class="mt-4 mb-1 font-semibold text-base-content/80">Relevant history</h3>
			<p class="text-sm text-base-content/80">{data.request.relevantHistory || 'Not specified'}</p>

			<h3 class="mt-4 mb-1 font-semibold text-base-content/80">Lower-GI red flags</h3>
			{#if redFlagList().length > 0}
				<ul class="list-disc pl-5 text-sm text-base-content/80">
					{#each redFlagList() as r (r)}
						<li>{r}</li>
					{/each}
				</ul>
			{:else}
				<p class="text-sm text-base-content/80">None recorded</p>
			{/if}

			<h3 class="mt-4 mb-1 font-semibold text-base-content/80">Medication</h3>
			<ul class="list-disc pl-5 text-sm text-base-content/80">
				<li>Anticoagulant: {data.medication.takingAnticoagulant ? `Yes${data.medication.anticoagulantAgent ? ` (${data.medication.anticoagulantAgent})` : ''}` : 'No'}</li>
				<li>Antiplatelet: {data.medication.takingAntiplatelet ? `Yes${data.medication.antiplateletAgent ? ` (${data.medication.antiplateletAgent})` : ''}` : 'No'}</li>
				<li>Diabetes medication: {data.medication.diabetesMedication || 'Not recorded'}</li>
			</ul>

			<h3 class="mt-4 mb-1 font-semibold text-base-content/80">Bowel prep and fitness</h3>
			<ul class="list-disc pl-5 text-sm text-base-content/80">
				<li>Fit for bowel preparation: {data.fitness.fitForBowelPrep ? 'Yes' : 'No'}</li>
				<li>Planned bowel-prep agent: {data.fitness.bowelPrepAgent || 'Not recorded'}</li>
				<li>Chronic kidney disease: {data.fitness.chronicKidneyDisease ? 'Yes' : 'No'}</li>
				<li>eGFR: {data.fitness.egfrMlMin ?? 'Not recorded'}{data.fitness.egfrMlMin != null ? ' mL/min' : ''}</li>
			</ul>

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
