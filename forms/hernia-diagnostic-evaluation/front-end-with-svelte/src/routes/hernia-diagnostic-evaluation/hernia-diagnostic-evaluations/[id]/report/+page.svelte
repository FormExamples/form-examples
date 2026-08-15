<script lang="ts">
	// The signed hernia diagnostic evaluation report: the classification, the
	// urgency band, the fired-rule audit trail, the safety flags, and the
	// management plan. Safety flags are printed whether or not the clinician
	// overrode the urgency band.
	import { page } from '$app/state';
	import Alert from '#lib/components/ui/Alert.svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import Panel from '#lib/components/ui/Panel.svelte';
	import { RECOMMENDATION_LABELS, URGENCY_LABELS } from '#lib/engine/grader.js';
	import { titleCase } from '#lib/engine/utils.js';
	import { evaluationStore } from '#lib/stores/assessment.svelte.js';

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
				`/hernia-diagnostic-evaluation/hernia-diagnostic-evaluations/${id}/report/pdf`,
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
			a.download = 'hernia-diagnostic-evaluation.pdf';
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
	<title>Hernia Diagnostic Evaluation — report</title>
</svelte:head>

<main class="mx-16 px-4 py-8">
	<h1 class="text-2xl font-bold text-base-content">Hernia Diagnostic Evaluation Report</h1>
	<p class="mt-1 text-sm text-base-content/70">
		{patientName}
		{#if d.patient.nhsNumber}· NHS {d.patient.nhsNumber}{/if}
		{#if d.clinician.assessmentDate}· Assessed {d.clinician.assessmentDate}{/if}
		{#if d.clinician.clinicianName}· by {d.clinician.clinicianName}{/if}
	</p>

	{#if result.anyRedFlag}
		<Alert type="error" class="mt-4" heading="Emergency: a red flag is positive">
			At least one red-flag symptom was positive. Any positive red flag requires same-day
			clinical escalation regardless of what this report displays.
		</Alert>
	{/if}

	{#if result.finalUrgency !== result.computedUrgency}
		<Alert type="warning" class="mt-4" heading="Clinician override">
			Computed urgency was {URGENCY_LABELS[result.computedUrgency]}; the clinician recorded
			{URGENCY_LABELS[result.finalUrgency]}. Reason: {result.overrideReason || 'not stated'}. The
			safety flags below are unaffected by the override.
		</Alert>
	{/if}

	<Panel label="Overall result" class="mt-6">
		<p class="text-lg font-semibold">
			{URGENCY_LABELS[result.finalUrgency]} — {RECOMMENDATION_LABELS[result.recommendation]}
		</p>
	</Panel>

	<h2 class="mt-8 text-lg font-semibold">Classification</h2>
	<dl class="mt-2 grid gap-2 sm:grid-cols-2">
		<div><dt class="text-sm text-base-content/70">Hernia type</dt><dd>{titleCase(result.herniaType) || '—'}</dd></div>
		<div><dt class="text-sm text-base-content/70">EHS subtype</dt><dd>{titleCase(result.herniaSubtype) || '—'}</dd></div>
		<div><dt class="text-sm text-base-content/70">EHS classification</dt><dd>{result.ehsClassification || '—'}</dd></div>
		<div><dt class="text-sm text-base-content/70">EHS size grade</dt><dd>{result.ehsSizeGrade || '—'}</dd></div>
		<div><dt class="text-sm text-base-content/70">Reducibility status</dt><dd>{titleCase(result.reducibilityStatus) || '—'}</dd></div>
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
					<th class="data-table-th" scope="col">Why it fired</th>
				</tr>
			</thead>
			<tbody class="data-table-body">
				{#each result.firedRules as fired (fired.ruleId + fired.description)}
					<tr class="data-table-row">
						<th class="data-table-th" scope="row">{fired.ruleId}</th>
						<td class="data-table-td">{fired.instrument.toUpperCase()}</td>
						<td class="data-table-td">{fired.component}</td>
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
		<div><dt class="text-sm text-base-content/70">Management plan</dt><dd>{titleCase(d.management.managementPlan) || '—'}</dd></div>
		<div><dt class="text-sm text-base-content/70">Conservative detail</dt><dd>{d.management.conservativeDetail || '—'}</dd></div>
		<div><dt class="text-sm text-base-content/70">Referral made</dt><dd>{titleCase(d.management.referralMade) || '—'}</dd></div>
		<div><dt class="text-sm text-base-content/70">Referral target timeframe</dt><dd>{titleCase(d.management.referralTargetTimeframe) || '—'}</dd></div>
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
		<a class="button" data-variant="secondary" href="/hernia-diagnostic-evaluation/hernia-diagnostic-evaluations/{id}">
			Back to the evaluation
		</a>
	</div>

	<p class="mt-8 text-xs text-base-content/60">
		Clinical decision support. This report does not make a diagnosis and does not replace the
		clinical judgement of the examining clinician. Any positive red flag requires same-day
		clinical escalation regardless of what this report displays.
	</p>
</main>
