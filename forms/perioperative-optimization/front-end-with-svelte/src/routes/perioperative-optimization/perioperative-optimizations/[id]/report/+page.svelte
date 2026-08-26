<script lang="ts">
	// The signed optimization report: the domain table, the screening scores, the
	// safety flags, and the prehabilitation plan. Safety flags are printed
	// whether or not the clinician overrode the readiness band.
	import { page } from '$app/state';
	import Alert from '#lib/components/ui/Alert.svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import Panel from '#lib/components/ui/Panel.svelte';
	import { DOMAIN_LABELS } from '#lib/engine/domain-rules.js';
	import { GATE_DECISION_LABELS, READINESS_LABELS, STATUS_LABELS } from '#lib/engine/labels.js';
	import { titleCase } from '#lib/engine/utils.js';
	import { assessmentStore } from '#lib/stores/assessment.svelte.js';

	const id = $derived(page.params.id ?? 'new');

	$effect(() => {
		assessmentStore.load(id);
	});

	const d = assessmentStore.data;
	const result = $derived(assessmentStore.result);

	const patientName = $derived(
		`${d.patient.firstName} ${d.patient.lastName}`.trim() || 'Patient not named'
	);

	let downloading = $state(false);
	let downloadError = $state('');

	async function downloadPdf() {
		downloading = true;
		downloadError = '';
		try {
			const response = await fetch(
				`/perioperative-optimization/perioperative-optimizations/${id}/report/pdf`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						data: assessmentStore.data,
						result,
						generatedAt: new Date().toISOString()
					})
				}
			);
			if (!response.ok) throw new Error(`PDF generation failed: ${response.status}`);
			const blob = await response.blob();
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = 'perioperative-optimization.pdf';
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);
		} catch (e) {
			downloadError = e instanceof Error ? e.message : 'Could not generate the PDF.';
		} finally {
			downloading = false;
		}
	}
</script>

<svelte:head>
	<title>Perioperative Optimization — report</title>
</svelte:head>

<main class="mx-16 px-4 py-8">
	<h1 class="text-2xl font-bold text-base-content">Perioperative Optimization Report</h1>
	<p class="mt-1 text-sm text-base-content/70">
		{patientName}
		{#if d.patient.nhsNumber}· NHS {d.patient.nhsNumber}{/if}
		{#if d.procedure.plannedProcedure}· {d.procedure.plannedProcedure}{/if}
		{#if d.assessment.clinicianName}· assessed by {d.assessment.clinicianName}{/if}
	</p>

	{#if result.gatingApplied}
		<p class="mt-2 text-sm text-base-content/70">
			{result.weeksToSurgery} week{result.weeksToSurgery === 1 ? '' : 's'} between the assessment on
			{d.assessment.assessmentDate} and the planned surgery on {d.procedure.plannedSurgeryDate}.
		</p>
	{:else}
		<Alert type="info" class="mt-4" heading="Gating was not applied">
			No planned surgery date is recorded, so every triggered domain is reported as action required
			rather than being tested against its lead time.
		</Alert>
	{/if}

	{#if result.recommendedEarliestSurgeryDate}
		<Alert type="warning" class="mt-4" heading="Not enough time to optimize">
			Earliest date at which every domain would have its full lead time:
			<strong>{result.recommendedEarliestSurgeryDate}</strong>. Either move the list to that date or
			later, or record an explicit accept-unoptimized-risk decision.
		</Alert>
	{/if}

	{#if result.finalReadiness !== result.computedReadiness}
		<Alert type="warning" class="mt-4" heading="Clinician override">
			Computed band was {READINESS_LABELS[result.computedReadiness]}; the clinician recorded
			{READINESS_LABELS[result.finalReadiness]}. Reason: {result.overrideReason || 'not stated'}. The
			safety flags below are unaffected by the override.
		</Alert>
	{/if}

	<Panel label="Overall result" class="mt-6">
		<p class="text-lg font-semibold">
			{READINESS_LABELS[result.finalReadiness]}
			{#if result.gateDecision}— {GATE_DECISION_LABELS[result.gateDecision]}{/if}
		</p>
	</Panel>

	<h2 class="mt-8 text-lg font-semibold">Optimization domains</h2>
	<div class="mt-2 overflow-x-auto">
		<table class="data-table w-full">
			<thead class="data-table-head">
				<tr class="data-table-row">
					<th class="data-table-th" scope="col">Domain</th>
					<th class="data-table-th" scope="col">Status</th>
					<th class="data-table-th" scope="col">Lead time</th>
					<th class="data-table-th" scope="col">Shortfall</th>
					<th class="data-table-th" scope="col">Finding</th>
					<th class="data-table-th" scope="col">Intervention</th>
				</tr>
			</thead>
			<tbody class="data-table-body">
				{#each result.domains as domainResult (domainResult.domain)}
					<tr class="data-table-row">
						<th class="data-table-th" scope="row">{DOMAIN_LABELS[domainResult.domain]}</th>
						<td class="data-table-td">{STATUS_LABELS[domainResult.status]}</td>
						<td class="data-table-td">{domainResult.leadTimeWeeks} w</td>
						<td class="data-table-td">
							{domainResult.weeksShortfall === null
								? '—'
								: `${domainResult.weeksShortfall} w short`}
						</td>
						<td class="data-table-td">{domainResult.finding || '—'}</td>
						<td class="data-table-td">{domainResult.intervention || '—'}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<h2 class="mt-8 text-lg font-semibold">Screening scores</h2>
	<dl class="mt-2 grid gap-2 sm:grid-cols-2">
		<div><dt class="text-sm text-base-content/70">MUST</dt><dd>{result.mustScore === null ? '—' : `${result.mustScore} / 6 (${titleCase(result.mustRisk)})`}</dd></div>
		<div><dt class="text-sm text-base-content/70">AUDIT-C</dt><dd>{result.auditCScore === null ? '—' : `${result.auditCScore} / 12`}</dd></div>
		<div><dt class="text-sm text-base-content/70">STOP-BANG</dt><dd>{result.stopBangScore === null ? '—' : `${result.stopBangScore} / 8`}</dd></div>
		<div><dt class="text-sm text-base-content/70">Duke Activity Status Index</dt><dd>{result.dukeActivityStatusIndex ?? '—'}</dd></div>
		<div><dt class="text-sm text-base-content/70">Clinical Frailty Scale</dt><dd>{result.clinicalFrailtyScale === null ? '—' : `${result.clinicalFrailtyScale} / 9`}</dd></div>
		<div><dt class="text-sm text-base-content/70">Body mass index</dt><dd>{result.bmi === null ? '—' : `${result.bmi} kg/m²`}</dd></div>
	</dl>

	<h2 class="mt-8 text-lg font-semibold">Safety flags</h2>
	{#if result.flags.length === 0}
		<p class="mt-2 text-sm text-base-content/60">No safety flags raised.</p>
	{:else}
		<ul class="mt-2 space-y-2">
			{#each result.flags as flag (flag.flagId)}
				<li class="rounded border border-base-300 p-3">
					<p class="text-sm font-semibold uppercase">{flag.priority} · {titleCase(flag.category)}</p>
					<p class="mt-1">{flag.description}</p>
					<p class="mt-1 text-sm text-base-content/70">{flag.suggestedAction}</p>
				</li>
			{/each}
		</ul>
	{/if}

	<h2 class="mt-8 text-lg font-semibold">Prehabilitation plan</h2>
	<dl class="mt-2 grid gap-2 sm:grid-cols-2">
		<div><dt class="text-sm text-base-content/70">Anaemia</dt><dd>{d.plan.planAnaemia || '—'}</dd></div>
		<div><dt class="text-sm text-base-content/70">Glycaemic control</dt><dd>{d.plan.planGlycaemicControl || '—'}</dd></div>
		<div><dt class="text-sm text-base-content/70">Smoking</dt><dd>{d.plan.planSmoking || '—'}</dd></div>
		<div><dt class="text-sm text-base-content/70">Alcohol</dt><dd>{d.plan.planAlcohol || '—'}</dd></div>
		<div><dt class="text-sm text-base-content/70">Nutrition</dt><dd>{d.plan.planNutrition || '—'}</dd></div>
		<div><dt class="text-sm text-base-content/70">Physical fitness</dt><dd>{d.plan.planPhysicalFitness || '—'}</dd></div>
		<div><dt class="text-sm text-base-content/70">Medication</dt><dd>{d.plan.planMedication || '—'}</dd></div>
		<div><dt class="text-sm text-base-content/70">Cardiorespiratory</dt><dd>{d.plan.planCardiorespiratory || '—'}</dd></div>
		<div><dt class="text-sm text-base-content/70">Responsible clinician</dt><dd>{d.plan.responsibleClinician || '—'}</dd></div>
		<div><dt class="text-sm text-base-content/70">Next review</dt><dd>{d.plan.nextReviewDate || '—'}</dd></div>
	</dl>

	<p class="mt-6 font-semibold">
		Gate decision: {d.signoff.gateDecision ? GATE_DECISION_LABELS[d.signoff.gateDecision] : 'not recorded'}
	</p>
	<p class="font-semibold">Signed by {d.signoff.signedByName || '— not yet signed —'}</p>

	{#if downloadError}
		<Alert type="error" class="mt-4">{downloadError}</Alert>
	{/if}

	<div class="mt-6 flex gap-2">
		<Button data-variant="primary" onclick={downloadPdf} disabled={downloading}>
			{downloading ? 'Generating…' : 'Download PDF'}
		</Button>
		<a
			class="button"
			data-variant="secondary"
			href="/perioperative-optimization/perioperative-optimizations/{id}"
		>
			Back to the assessment
		</a>
	</div>

	<p class="mt-8 text-xs text-base-content/60">
		Clinical decision support. This report does not diagnose and does not decide whether surgery goes
		ahead; that decision belongs to the responsible surgical and anaesthetic team.
	</p>
</main>
