<script lang="ts">
	// The signed cataract diagnostic evaluation report: the LOCS III scores,
	// surgical-candidacy recommendation, the fired-rule audit trail, the safety
	// flags, and the management plan. Safety flags are printed whether or not
	// the clinician overrode the surgical-candidacy recommendation.
	import { page } from '$app/state';
	import Alert from '#lib/components/ui/Alert.svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import Panel from '#lib/components/ui/Panel.svelte';
	import { LOCS_III_SEVERITY_LABELS, SURGICAL_CANDIDACY_LABELS } from '#lib/engine/grader.js';
	import { titleCase } from '#lib/engine/utils.js';
	import { evaluationStore } from '#lib/stores/evaluation.svelte.js';

	const id = $derived(page.params.id ?? 'new');

	$effect(() => {
		evaluationStore.load(id);
	});

	const d = evaluationStore.data;
	const result = $derived(evaluationStore.result);

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
				`/cataract-diagnostic-evaluation/cataract-diagnostic-evaluations/${id}/report/pdf`,
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
			a.download = 'cataract-diagnostic-evaluation.pdf';
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
	<title>Cataract Diagnostic Evaluation — report</title>
</svelte:head>

<main class="mx-16 px-4 py-8">
	<h1 class="text-2xl font-bold text-base-content">Cataract Diagnostic Evaluation Report</h1>
	<p class="mt-1 text-sm text-base-content/70">
		{patientName}
		{#if d.patient.nhsNumber}· NHS {d.patient.nhsNumber}{/if}
		{#if d.clinician.assessmentDate}· Assessed {d.clinician.assessmentDate}{/if}
		{#if d.clinician.clinicianName}· by {d.clinician.clinicianName}{/if}
	</p>

	{#if result.finalSurgicalCandidacy !== result.computedSurgicalCandidacy}
		<Alert type="warning" class="mt-4" heading="Clinician override">
			Computed candidacy was {SURGICAL_CANDIDACY_LABELS[result.computedSurgicalCandidacy]}; the
			clinician recorded {SURGICAL_CANDIDACY_LABELS[result.finalSurgicalCandidacy]}. Reason:
			{result.overrideReason || 'not stated'}. The safety flags below are unaffected by the
			override.
		</Alert>
	{/if}

	<Panel label="Overall result" class="mt-6">
		<p class="text-lg font-semibold">
			{SURGICAL_CANDIDACY_LABELS[result.finalSurgicalCandidacy]}
		</p>
	</Panel>

	<h2 class="mt-8 text-lg font-semibold">LOCS III — Lens Opacities Classification System III</h2>
	<table class="data-table mt-2 w-full">
		<thead class="data-table-head">
			<tr class="data-table-row">
				<th class="data-table-th" scope="col">Eye</th>
				<th class="data-table-th" scope="col">NO</th>
				<th class="data-table-th" scope="col">NC</th>
				<th class="data-table-th" scope="col">C</th>
				<th class="data-table-th" scope="col">P</th>
				<th class="data-table-th" scope="col">Severity</th>
			</tr>
		</thead>
		<tbody class="data-table-body">
			<tr class="data-table-row">
				<th class="data-table-th" scope="row">Right</th>
				<td class="data-table-td">{d.slitLamp.locsIiiNoRight ?? '—'}</td>
				<td class="data-table-td">{d.slitLamp.locsIiiNcRight ?? '—'}</td>
				<td class="data-table-td">{d.slitLamp.locsIiiCRight ?? '—'}</td>
				<td class="data-table-td">{d.slitLamp.locsIiiPRight ?? '—'}</td>
				<td class="data-table-td">{LOCS_III_SEVERITY_LABELS[result.locsIIISeverityRight]}</td>
			</tr>
			<tr class="data-table-row">
				<th class="data-table-th" scope="row">Left</th>
				<td class="data-table-td">{d.slitLamp.locsIiiNoLeft ?? '—'}</td>
				<td class="data-table-td">{d.slitLamp.locsIiiNcLeft ?? '—'}</td>
				<td class="data-table-td">{d.slitLamp.locsIiiCLeft ?? '—'}</td>
				<td class="data-table-td">{d.slitLamp.locsIiiPLeft ?? '—'}</td>
				<td class="data-table-td">{LOCS_III_SEVERITY_LABELS[result.locsIIISeverityLeft]}</td>
			</tr>
		</tbody>
	</table>

	<h2 class="mt-8 text-lg font-semibold">Visual acuity &amp; glare</h2>
	<dl class="mt-2 grid gap-2 sm:grid-cols-2">
		<div><dt class="text-sm text-base-content/70">Best-corrected VA — right</dt><dd>{d.acuity.bestCorrectedVaLogmarRight ?? '—'} LogMAR {d.acuity.bestCorrectedVaSnellenRight ? `(${d.acuity.bestCorrectedVaSnellenRight})` : ''}</dd></div>
		<div><dt class="text-sm text-base-content/70">Best-corrected VA — left</dt><dd>{d.acuity.bestCorrectedVaLogmarLeft ?? '—'} LogMAR {d.acuity.bestCorrectedVaSnellenLeft ? `(${d.acuity.bestCorrectedVaSnellenLeft})` : ''}</dd></div>
		<div><dt class="text-sm text-base-content/70">Glare functional impact</dt><dd>{titleCase(d.glare.glareFunctionalImpact) || '—'}</dd></div>
		<div><dt class="text-sm text-base-content/70">Functional impact score</dt><dd>{result.functionalImpactScore === null ? '—' : `${result.functionalImpactScore} / 12`}</dd></div>
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

	<h2 class="mt-8 text-lg font-semibold">Management plan</h2>
	<dl class="mt-2 grid gap-2 sm:grid-cols-2">
		<div><dt class="text-sm text-base-content/70">Recommendation</dt><dd>{titleCase(d.management.managementRecommendation) || '—'}</dd></div>
		<div><dt class="text-sm text-base-content/70">Eye(s) for surgery</dt><dd>{titleCase(d.management.eyeForSurgery) || '—'}</dd></div>
		<div><dt class="text-sm text-base-content/70">Risks and benefits counselled</dt><dd>{titleCase(d.management.risksBenefitsCounselled) || '—'}</dd></div>
		<div><dt class="text-sm text-base-content/70">Consent discussed</dt><dd>{titleCase(d.management.consentDiscussed) || '—'}</dd></div>
		<div><dt class="text-sm text-base-content/70">Management notes</dt><dd>{d.management.managementNotes || '—'}</dd></div>
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
		<a class="button" data-variant="secondary" href="/cataract-diagnostic-evaluation/cataract-diagnostic-evaluations/{id}">
			Back to the evaluation
		</a>
	</div>

	<p class="mt-8 text-xs text-base-content/60">
		Clinical decision support. This report does not make a diagnosis and does not replace the
		clinical judgement of an optometrist or ophthalmologist. LOCS III is reproduced with
		attribution to Chylack et al., Arch Ophthalmol 1993.
	</p>
</main>
