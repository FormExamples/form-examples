<script lang="ts">
	// The signed dietetic report: the scores, the fired-rule audit trail, the
	// safety flags, and the care plan. Safety flags are printed whether or not
	// the dietitian overrode the composite risk category.
	import { page } from '$app/state';
	import Alert from '$lib/components/ui/Alert.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Panel from '$lib/components/ui/Panel.svelte';
	import {
		COMPOSITE_RISK_LABELS,
		GLIM_DIAGNOSIS_LABELS,
		MUST_RISK_LABELS,
		RECOMMENDATION_LABELS
	} from '$lib/engine/grader';
	import { titleCase } from '$lib/engine/utils';
	import { assessmentStore } from '$lib/stores/assessment.svelte';

	const id = $derived(page.params.id ?? 'new');

	$effect(() => {
		assessmentStore.load(id);
	});

	const d = assessmentStore.data;
	const result = $derived(assessmentStore.result);

	const patientName = $derived(
		`${d.patient.firstName} ${d.patient.lastName}`.trim() || 'Patient not named'
	);

	const pesFilled = $derived(
		Boolean(
			d.screening.pesProblem.trim() ||
				d.screening.pesEtiology.trim() ||
				d.screening.pesSignsSymptoms.trim()
		)
	);

	let downloading = $state(false);
	let downloadError = $state('');

	async function downloadPdf() {
		downloading = true;
		downloadError = '';
		try {
			const response = await fetch(
				`/dietic-assessment/dietic-assessments/${id}/report/pdf`,
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
			a.download = 'dietic-assessment.pdf';
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
	<title>Dietetic Assessment — report</title>
</svelte:head>

<main class="mx-16 px-4 py-8">
	<h1 class="text-2xl font-bold text-base-content">Dietetic Assessment Report</h1>
	<p class="mt-1 text-sm text-base-content/70">
		{patientName}
		{#if d.patient.nhsNumber}· NHS {d.patient.nhsNumber}{/if}
		{#if d.dietitian.assessmentDate}· Assessed {d.dietitian.assessmentDate}{/if}
		{#if d.dietitian.dietitianName}· by {d.dietitian.dietitianName}{/if}
	</p>

	{#if result.mustIsEstimated}
		<Alert type="info" class="mt-4" heading="This MUST score is an estimate">
			One or more components was derived from mid-upper-arm circumference, the subjective
			weight-loss criterion, or an adjusted weight. Treat the risk category as indicative and repeat
			the screen when a measured height and weight are available.
		</Alert>
	{/if}

	{#if result.finalCompositeRisk !== result.computedCompositeRisk}
		<Alert type="warning" class="mt-4" heading="Dietitian override">
			Computed risk was {titleCase(result.computedCompositeRisk)}; the dietitian recorded
			{titleCase(result.finalCompositeRisk)}. Reason: {result.overrideReason || 'not stated'}. The
			safety flags below are unaffected by the override.
		</Alert>
	{/if}

	<Panel label="Overall result" class="mt-6">
		<p class="text-lg font-semibold">
			{COMPOSITE_RISK_LABELS[result.finalCompositeRisk]} — {RECOMMENDATION_LABELS[
				result.recommendation
			]}
		</p>
	</Panel>

	<h2 class="mt-8 text-lg font-semibold">MUST — Malnutrition Universal Screening Tool</h2>
	<table class="data-table mt-2 w-full">
		<thead class="data-table-head">
			<tr class="data-table-row">
				<th class="data-table-th" scope="col">Component</th>
				<th class="data-table-th" scope="col">Score</th>
			</tr>
		</thead>
		<tbody class="data-table-body">
			<tr class="data-table-row">
				<td class="data-table-td">
					Step 1 · Body mass index{result.bmi === null ? ' (estimated)' : ` (${result.bmi} kg/m²)`}
				</td>
				<td class="data-table-td">{result.mustBmiScore}</td>
			</tr>
			<tr class="data-table-row">
				<td class="data-table-td">
					Step 2 · Unplanned weight loss{result.weightLossPercent === null
						? ''
						: ` (${result.weightLossPercent}%)`}
				</td>
				<td class="data-table-td">{result.mustWeightLossScore}</td>
			</tr>
			<tr class="data-table-row">
				<td class="data-table-td">Step 3 · Acute disease effect</td>
				<td class="data-table-td">{result.mustAcuteDiseaseScore}</td>
			</tr>
		</tbody>
		<tfoot class="data-table-foot">
			<tr class="data-table-row">
				<td class="data-table-td">MUST total — {MUST_RISK_LABELS[result.mustRisk]}</td>
				<td class="data-table-td">{result.mustScore} / 6</td>
			</tr>
		</tfoot>
	</table>

	<h2 class="mt-8 text-lg font-semibold">Secondary instruments</h2>
	<dl class="mt-2 grid gap-2 sm:grid-cols-2">
		<div><dt class="text-sm text-base-content/70">GLIM</dt><dd>{GLIM_DIAGNOSIS_LABELS[result.glimDiagnosis]}</dd></div>
		<div><dt class="text-sm text-base-content/70">Refeeding-syndrome risk</dt><dd>{titleCase(result.refeedingRisk)}</dd></div>
		<div><dt class="text-sm text-base-content/70">GLIM phenotypic criteria</dt><dd>{result.glimPhenotypicCriteria.join(', ') || 'none'}</dd></div>
		<div><dt class="text-sm text-base-content/70">GLIM etiologic criteria</dt><dd>{result.glimEtiologicCriteria.join(', ') || 'none'}</dd></div>
		<div><dt class="text-sm text-base-content/70">NRS-2002</dt><dd>{result.nrs2002Score === null ? '—' : `${result.nrs2002Score} / 7`}</dd></div>
		<div><dt class="text-sm text-base-content/70">SARC-F</dt><dd>{result.sarcfScore === null ? '—' : `${result.sarcfScore} / 10`}</dd></div>
		<div><dt class="text-sm text-base-content/70">SCOFF</dt><dd>{result.scoffScore === null ? '—' : `${result.scoffScore} / 5`}</dd></div>
		<div>
			<dt class="text-sm text-base-content/70">Estimated requirements</dt>
			<dd>
				{result.energyRequirementKcal === null ? '—' : `${result.energyRequirementKcal} kcal/day`}
				{result.proteinRequirementG === null ? '' : `· ${result.proteinRequirementG} g protein/day`}
			</dd>
		</div>
	</dl>

	{#if pesFilled}
		<h2 class="mt-8 text-lg font-semibold">Nutrition and dietetic diagnosis</h2>
		<p class="mt-2">
			<strong>{d.screening.pesProblem || '—'}</strong>
			related to {d.screening.pesEtiology || '—'}
			as evidenced by {d.screening.pesSignsSymptoms || '—'}.
		</p>
	{/if}

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
					<th class="data-table-th" scope="col">Score</th>
					<th class="data-table-th" scope="col">Why it fired</th>
				</tr>
			</thead>
			<tbody class="data-table-body">
				{#each result.firedRules as fired (fired.ruleId + fired.description)}
					<tr class="data-table-row">
						<th class="data-table-th" scope="row">{fired.ruleId}</th>
						<td class="data-table-td">{fired.instrument.toUpperCase()}</td>
						<td class="data-table-td">{fired.component}</td>
						<td class="data-table-td">{fired.score === null ? '—' : fired.score}</td>
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

	<h2 class="mt-8 text-lg font-semibold">Nutrition care plan</h2>
	<dl class="mt-2 grid gap-2 sm:grid-cols-2">
		<div><dt class="text-sm text-base-content/70">Intervention</dt><dd>{titleCase(d.plan.interventionType) || '—'}</dd></div>
		<div><dt class="text-sm text-base-content/70">Prescribed supplement</dt><dd>{d.plan.prescribedSupplement || '—'}</dd></div>
		<div><dt class="text-sm text-base-content/70">Goal 1</dt><dd>{d.plan.goal1 || '—'}</dd></div>
		<div><dt class="text-sm text-base-content/70">Goal 2</dt><dd>{d.plan.goal2 || '—'}</dd></div>
		<div><dt class="text-sm text-base-content/70">Goal 3</dt><dd>{d.plan.goal3 || '—'}</dd></div>
		<div><dt class="text-sm text-base-content/70">Monitoring</dt><dd>{d.plan.monitoringIndicators || '—'}</dd></div>
		<div><dt class="text-sm text-base-content/70">Review date</dt><dd>{d.plan.reviewDate || '—'}</dd></div>
		<div><dt class="text-sm text-base-content/70">Onward referral</dt><dd>{d.plan.onwardReferral || '—'}</dd></div>
	</dl>

	<p class="mt-6 font-semibold">
		Signed by {d.plan.signedByName || '— not yet signed —'}
	</p>

	{#if downloadError}
		<Alert type="error" class="mt-4">{downloadError}</Alert>
	{/if}

	<div class="mt-6 flex gap-2">
		<Button data-variant="primary" onclick={downloadPdf} disabled={downloading}>
			{downloading ? 'Generating…' : 'Download PDF'}
		</Button>
		<a class="button" data-variant="secondary" href="/dietic-assessment/dietic-assessments/{id}">
			Back to the assessment
		</a>
	</div>

	<p class="mt-8 text-xs text-base-content/60">
		Clinical decision support. This report does not make a diagnosis and does not replace the
		clinical judgement of a registered dietitian. MUST is reproduced with attribution to BAPEN.
	</p>
</main>
