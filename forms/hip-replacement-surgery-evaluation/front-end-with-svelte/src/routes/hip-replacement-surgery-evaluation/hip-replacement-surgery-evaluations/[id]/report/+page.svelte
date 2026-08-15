<script lang="ts">
	// The signed hip-replacement surgery evaluation report: the scores, the
	// fired-rule audit trail, the safety flags, and the management plan. Safety
	// flags are printed whether or not the clinician overrode the candidacy.
	import { page } from '$app/state';
	import Alert from '#lib/components/ui/Alert.svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import Panel from '#lib/components/ui/Panel.svelte';
	import { OHS_ITEMS } from '#lib/config/ohs-items.js';
	import { CANDIDACY_LABELS, OHS_CATEGORY_LABELS } from '#lib/engine/grader.js';
	import { titleCase } from '#lib/engine/utils.js';
	import { evaluationStore } from '#lib/stores/evaluation.svelte.js';

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
				`/hip-replacement-surgery-evaluation/hip-replacement-surgery-evaluations/${id}/report/pdf`,
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
			a.download = 'hip-replacement-surgery-evaluation.pdf';
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
	<title>Hip Replacement Surgery Evaluation — report</title>
</svelte:head>

<main class="mx-16 px-4 py-8">
	<h1 class="text-2xl font-bold text-base-content">Hip Replacement Surgery Evaluation Report</h1>
	<p class="mt-1 text-sm text-base-content/70">
		{patientName}
		{#if d.patient.nhsNumber}· NHS {d.patient.nhsNumber}{/if}
		{#if d.clinician.assessmentDate}· Assessed {d.clinician.assessmentDate}{/if}
		{#if d.clinician.clinicianName}· by {d.clinician.clinicianName}{/if}
	</p>

	{#if result.finalCandidacy !== result.computedCandidacy}
		<Alert type="warning" class="mt-4" heading="Clinician override">
			Computed candidacy was {CANDIDACY_LABELS[result.computedCandidacy]}; the clinician recorded
			{CANDIDACY_LABELS[result.finalCandidacy]}. Reason: {result.overrideReason || 'not stated'}.
			The safety flags below are unaffected by the override.
		</Alert>
	{/if}

	<Panel label="Overall result" class="mt-6">
		<p class="text-lg font-semibold">
			{CANDIDACY_LABELS[result.finalCandidacy]} — {OHS_CATEGORY_LABELS[result.ohsCategory]}
		</p>
	</Panel>

	<h2 class="mt-8 text-lg font-semibold">Oxford Hip Score</h2>
	<table class="data-table mt-2 w-full">
		<thead class="data-table-head">
			<tr class="data-table-row">
				<th class="data-table-th" scope="col">Item</th>
				<th class="data-table-th" scope="col">Score</th>
			</tr>
		</thead>
		<tbody class="data-table-body">
			{#each OHS_ITEMS as item (item.key)}
				<tr class="data-table-row">
					<td class="data-table-td">{item.number}. {item.question}</td>
					<td class="data-table-td">{d.ohs[item.key] === null ? '—' : `${d.ohs[item.key]} / 4`}</td>
				</tr>
			{/each}
		</tbody>
		<tfoot class="data-table-foot">
			<tr class="data-table-row">
				<td class="data-table-td">OHS total — {OHS_CATEGORY_LABELS[result.ohsCategory]}</td>
				<td class="data-table-td">{result.ohsTotal} / 48</td>
			</tr>
		</tfoot>
	</table>

	<h2 class="mt-8 text-lg font-semibold">Imaging and candidacy factors</h2>
	<dl class="mt-2 grid gap-2 sm:grid-cols-2">
		<div><dt class="text-sm text-base-content/70">Kellgren and Lawrence grade</dt><dd>{result.kellgrenLawrenceGrade === null ? '—' : result.kellgrenLawrenceGrade}</dd></div>
		<div><dt class="text-sm text-base-content/70">Body mass index</dt><dd>{result.bmi === null ? '—' : `${result.bmi} kg/m²`}</dd></div>
		<div><dt class="text-sm text-base-content/70">Conservative measures exhausted</dt><dd>{titleCase(d.conservative.conservativeMeasuresExhausted) || '—'}</dd></div>
		<div><dt class="text-sm text-base-content/70">Computed candidacy</dt><dd>{CANDIDACY_LABELS[result.computedCandidacy]}</dd></div>
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
		<div><dt class="text-sm text-base-content/70">Recommendation</dt><dd>{titleCase(d.plan.recommendation) || '—'}</dd></div>
		<div><dt class="text-sm text-base-content/70">Target list date</dt><dd>{d.plan.targetListDate || '—'}</dd></div>
		<div><dt class="text-sm text-base-content/70">Responsible surgeon</dt><dd>{d.plan.responsibleSurgeon || '—'}</dd></div>
		<div><dt class="text-sm text-base-content/70">Clinician notes</dt><dd>{d.summary.clinicianNotes || '—'}</dd></div>
		<div><dt class="text-sm text-base-content/70">Additional notes</dt><dd>{d.summary.additionalNotes || '—'}</dd></div>
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
		<a class="button" data-variant="secondary" href="/hip-replacement-surgery-evaluation/hip-replacement-surgery-evaluations/{id}">
			Back to the evaluation
		</a>
	</div>

	<p class="mt-8 text-xs text-base-content/60">
		Clinical decision support. This report does not diagnose and does not replace the clinical
		judgement of the orthopaedic surgeon or extended-scope physiotherapist. Oxford Hip Score
		reproduced with attribution to Dawson et al. 1996 / Oxford University Innovation.
	</p>
</main>
