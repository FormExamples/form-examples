<script lang="ts">
	// The signed health screening report: the scores, the fired-rule audit
	// trail, the safety flags, and the recommendation. Safety flags are printed
	// whether or not the assessor overrode the risk band.
	import { page } from '$app/state';
	import Alert from '#lib/components/ui/Alert.svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import Panel from '#lib/components/ui/Panel.svelte';
	import {
		AUDIT_C_BAND_LABELS,
		PARQ_CLEARANCE_LABELS,
		RECOMMENDATION_LABELS,
		RISK_BAND_LABELS
	} from '#lib/engine/grader.js';
	import { titleCase } from '#lib/engine/utils.js';
	import { questionnaireStore } from '#lib/stores/questionnaire.svelte.js';

	const id = $derived(page.params.id ?? 'new');

	$effect(() => {
		questionnaireStore.load(id);
	});

	const d = questionnaireStore.data;
	const result = $derived(questionnaireStore.result);

	const patientName = $derived(d.patient.name.trim() || 'Not named');

	let downloading = $state(false);
	let downloadError = $state('');

	async function downloadPdf() {
		downloading = true;
		downloadError = '';
		try {
			const response = await fetch(
				`/health-screening-questionnaire/health-screening-questionnaires/${id}/report/pdf`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						data: questionnaireStore.data,
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
			a.download = 'health-screening-questionnaire.pdf';
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
	<title>Health Screening Questionnaire — report</title>
</svelte:head>

<main class="mx-16 px-4 py-8">
	<h1 class="text-2xl font-bold text-base-content">Health Screening Questionnaire Report</h1>
	<p class="mt-1 text-sm text-base-content/70">
		{patientName}
		{#if d.patient.identifierValue}· {d.patient.identifierValue}{/if}
		{#if d.context.assessmentDate}· Assessed {d.context.assessmentDate}{/if}
		{#if d.assessor.name}· by {d.assessor.name}{/if}
	</p>

	{#if result.isPaediatric}
		<Alert type="info" class="mt-4" heading="Paediatric respondent">
			PAR-Q+ and AUDIT-C are not validated below 16 years. This screen has not been scored; redirect
			to a paediatric-specific health-screening pathway.
		</Alert>
	{:else if result.finalRiskBand !== result.computedRiskBand}
		<Alert type="warning" class="mt-4" heading="Assessor override">
			Computed risk band was {titleCase(result.computedRiskBand)}; the assessor recorded
			{titleCase(result.finalRiskBand)}. Reason: {result.overrideReason || 'not stated'}. The
			safety flags below are unaffected by the override.
		</Alert>
	{/if}

	<Panel label="Overall result" class="mt-6">
		<p class="text-lg font-semibold">
			{result.isPaediatric ? 'Not scored — paediatric' : RISK_BAND_LABELS[result.finalRiskBand || 'low']}
			— {RECOMMENDATION_LABELS[result.finalRecommendation || 'clear-to-proceed']}
		</p>
	</Panel>

	<h2 class="mt-8 text-lg font-semibold">PAR-Q+ — Physical Activity Readiness Questionnaire</h2>
	<p class="mt-2">
		{result.parqPlusClearance ? PARQ_CLEARANCE_LABELS[result.parqPlusClearance] : 'Not completed'}
	</p>

	<h2 class="mt-8 text-lg font-semibold">AUDIT-C — Alcohol Use Screen</h2>
	<p class="mt-2">
		{result.auditCScore === null ? 'Not completed' : `${result.auditCScore} / 12`}
		{result.auditCBand ? `— ${AUDIT_C_BAND_LABELS[result.auditCBand]}` : ''}
	</p>

	<h2 class="mt-8 text-lg font-semibold">Fired rules</h2>
	{#if result.firedRules.length === 0}
		<p class="mt-2 text-sm text-base-content/60">No rules fired.</p>
	{:else}
		<table class="data-table mt-2 w-full">
			<thead class="data-table-head">
				<tr class="data-table-row">
					<th class="data-table-th" scope="col">Rule</th>
					<th class="data-table-th" scope="col">Instrument</th>
					<th class="data-table-th" scope="col">Component</th>
					<th class="data-table-th" scope="col">Band</th>
					<th class="data-table-th" scope="col">Why it fired</th>
				</tr>
			</thead>
			<tbody class="data-table-body">
				{#each result.firedRules as fired (fired.ruleId + fired.description)}
					<tr class="data-table-row">
						<th class="data-table-th" scope="row">{fired.ruleId}</th>
						<td class="data-table-td">{fired.instrument.toUpperCase()}</td>
						<td class="data-table-td">{fired.component}</td>
						<td class="data-table-td">{fired.band}</td>
						<td class="data-table-td">{fired.description}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}

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

	<h2 class="mt-8 text-lg font-semibold">Notes</h2>
	<p class="mt-2">{d.summary.notes || '—'}</p>

	<p class="mt-6 font-semibold">
		Signed by {d.summary.signedByName || '— not yet signed —'}
	</p>

	{#if downloadError}
		<Alert type="error" class="mt-4">{downloadError}</Alert>
	{/if}

	<div class="mt-6 flex gap-2">
		<Button data-variant="primary" onclick={downloadPdf} disabled={downloading}>
			{downloading ? 'Generating…' : 'Download PDF'}
		</Button>
		<a class="button" data-variant="secondary" href="/health-screening-questionnaire/health-screening-questionnaires/{id}">
			Back to the screening
		</a>
	</div>

	<p class="mt-8 text-xs text-base-content/60">
		Clinical decision support. This report does not make a diagnosis and does not replace the
		clinical judgement of a qualified professional. PAR-Q+ is reproduced with attribution to the
		PAR-Q+ Collaboration; AUDIT-C is reproduced with attribution to Bush et al. 1998.
	</p>
</main>
