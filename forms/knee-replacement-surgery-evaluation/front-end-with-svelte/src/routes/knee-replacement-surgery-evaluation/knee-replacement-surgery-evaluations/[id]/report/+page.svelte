<script lang="ts">
	// The signed knee-replacement surgery evaluation report: the scores, the
	// fired-rule audit trail, the safety flags, and the management plan.
	// Safety flags are printed whether or not the clinician overrode the
	// candidacy recommendation.
	import { page } from '$app/state';
	import Alert from '$lib/components/ui/Alert.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Panel from '$lib/components/ui/Panel.svelte';
	import { CANDIDACY_LABELS, OKS_CATEGORY_LABELS } from '$lib/engine/grader';
	import { titleCase } from '$lib/engine/utils';
	import { evaluationStore } from '$lib/stores/evaluation.svelte';

	const id = $derived(page.params.id ?? 'new');

	$effect(() => {
		evaluationStore.load(id);
	});

	const d = evaluationStore.data;
	const result = $derived(evaluationStore.result);

	const patientName = $derived(d.patient.name.trim() || 'Patient not named');

	let downloading = $state(false);
	let downloadError = $state('');

	async function downloadPdf() {
		downloading = true;
		downloadError = '';
		try {
			const response = await fetch(
				`/knee-replacement-surgery-evaluation/knee-replacement-surgery-evaluations/${id}/report/pdf`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						data: evaluationStore.data,
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
			a.download = 'knee-replacement-surgery-evaluation.pdf';
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
	<title>Knee Replacement Surgery Evaluation — report</title>
</svelte:head>

<main class="mx-16 px-4 py-8">
	<h1 class="text-2xl font-bold text-base-content">Knee Replacement Surgery Evaluation Report</h1>
	<p class="mt-1 text-sm text-base-content/70">
		{patientName}
		{#if d.patient.nhsNumber}· NHS {d.patient.nhsNumber}{/if}
		{#if d.history.kneeSide}· Knee {titleCase(d.history.kneeSide)}{/if}
		{#if d.clinician.assessmentDate}· Assessed {d.clinician.assessmentDate}{/if}
		{#if d.clinician.clinicianName}· by {d.clinician.clinicianName}{/if}
	</p>

	{#if result.finalCandidacy !== result.computedCandidacy}
		<Alert type="warning" class="mt-4" heading="Clinician override">
			Computed candidacy was {CANDIDACY_LABELS[result.computedCandidacy]}; the clinician recorded
			{CANDIDACY_LABELS[result.finalCandidacy]}. Reason: {result.overrideReason || 'not stated'}. The
			safety flags below are unaffected by the override.
		</Alert>
	{/if}

	<Panel label="Overall result" class="mt-6">
		<p class="text-lg font-semibold">
			{OKS_CATEGORY_LABELS[result.finalOksCategory]} — {CANDIDACY_LABELS[result.finalCandidacy]}
		</p>
	</Panel>

	<h2 class="mt-8 text-lg font-semibold">Oxford Knee Score</h2>
	<table class="data-table mt-2 w-full">
		<thead class="data-table-head">
			<tr class="data-table-row">
				<th class="data-table-th" scope="col">Item</th>
				<th class="data-table-th" scope="col">Score (0 worst – 4 best)</th>
			</tr>
		</thead>
		<tbody class="data-table-body">
			<tr class="data-table-row">
				<td class="data-table-td">1. Usual knee pain severity</td>
				<td class="data-table-td">{result.oksItemScores.oksPainSeverity ?? '—'}</td>
			</tr>
			<tr class="data-table-row">
				<td class="data-table-td">2. Washing and drying difficulty</td>
				<td class="data-table-td">{result.oksItemScores.oksWashingAndDrying ?? '—'}</td>
			</tr>
			<tr class="data-table-row">
				<td class="data-table-td">3. Transport (car / public transport)</td>
				<td class="data-table-td">{result.oksItemScores.oksTransport ?? '—'}</td>
			</tr>
			<tr class="data-table-row">
				<td class="data-table-td">4. Walking distance before severe pain</td>
				<td class="data-table-td">{result.oksItemScores.oksWalkingDistance ?? '—'}</td>
			</tr>
			<tr class="data-table-row">
				<td class="data-table-td">5. Pain sitting or lying</td>
				<td class="data-table-td">{result.oksItemScores.oksPainSittingOrLying ?? '—'}</td>
			</tr>
			<tr class="data-table-row">
				<td class="data-table-td">6. Limping when walking</td>
				<td class="data-table-td">{result.oksItemScores.oksLimping ?? '—'}</td>
			</tr>
			<tr class="data-table-row">
				<td class="data-table-td">7. Kneeling difficulty</td>
				<td class="data-table-td">{result.oksItemScores.oksKneeling ?? '—'}</td>
			</tr>
			<tr class="data-table-row">
				<td class="data-table-td">8. Night pain frequency</td>
				<td class="data-table-td">{result.oksItemScores.oksNightPainFrequency ?? '—'}</td>
			</tr>
			<tr class="data-table-row">
				<td class="data-table-td">9. Pain interfering with usual work</td>
				<td class="data-table-td">{result.oksItemScores.oksPainInterferingWithWork ?? '—'}</td>
			</tr>
			<tr class="data-table-row">
				<td class="data-table-td">10. Knee giving way</td>
				<td class="data-table-td">{result.oksItemScores.oksGivingWay ?? '—'}</td>
			</tr>
			<tr class="data-table-row">
				<td class="data-table-td">11. Household shopping</td>
				<td class="data-table-td">{result.oksItemScores.oksShopping ?? '—'}</td>
			</tr>
			<tr class="data-table-row">
				<td class="data-table-td">12. Walking down stairs</td>
				<td class="data-table-td">{result.oksItemScores.oksStairs ?? '—'}</td>
			</tr>
		</tbody>
		<tfoot class="data-table-foot">
			<tr class="data-table-row">
				<td class="data-table-td">OKS total — {OKS_CATEGORY_LABELS[result.finalOksCategory]}</td>
				<td class="data-table-td">{result.oksTotal} / 48</td>
			</tr>
		</tfoot>
	</table>

	<h2 class="mt-8 text-lg font-semibold">Secondary instrument</h2>
	<dl class="mt-2 grid gap-2 sm:grid-cols-2">
		<div><dt class="text-sm text-base-content/70">Kellgren-Lawrence grade (medial)</dt><dd>{d.imaging.kellgrenLawrenceGradeMedial ?? '—'}</dd></div>
		<div><dt class="text-sm text-base-content/70">Kellgren-Lawrence grade (lateral)</dt><dd>{d.imaging.kellgrenLawrenceGradeLateral ?? '—'}</dd></div>
		<div><dt class="text-sm text-base-content/70">Kellgren-Lawrence grade (patellofemoral)</dt><dd>{d.imaging.kellgrenLawrenceGradePatellofemoral ?? '—'}</dd></div>
		<div><dt class="text-sm text-base-content/70">Highest Kellgren-Lawrence grade</dt><dd>{result.maxKellgrenLawrenceGrade ?? '—'}</dd></div>
	</dl>

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

	<h2 class="mt-8 text-lg font-semibold">Management plan</h2>
	<dl class="mt-2 grid gap-2 sm:grid-cols-2">
		<div><dt class="text-sm text-base-content/70">Recommendation</dt><dd>{d.plan.planRecommendation ? titleCase(d.plan.planRecommendation) : '—'}</dd></div>
		<div><dt class="text-sm text-base-content/70">Target list date</dt><dd>{d.plan.targetListDate || '—'}</dd></div>
		<div><dt class="text-sm text-base-content/70">Responsible surgeon</dt><dd>{d.plan.responsibleSurgeon || '—'}</dd></div>
	</dl>

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
		<a class="button" data-variant="secondary" href="/knee-replacement-surgery-evaluation/knee-replacement-surgery-evaluations/{id}">
			Back to the evaluation
		</a>
	</div>

	<p class="mt-8 text-xs text-base-content/60">
		Clinical decision support. This report does not make a diagnosis and does not replace the
		clinical judgement of the orthopaedic surgeon or extended-scope physiotherapist. The Oxford
		Knee Score is reproduced with attribution to Dawson, Fitzpatrick, Murray &amp; Carr (1998).
	</p>
</main>
