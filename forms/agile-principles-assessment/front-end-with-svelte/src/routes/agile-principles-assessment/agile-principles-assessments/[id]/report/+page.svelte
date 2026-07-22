<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { store } from '$lib/stores/assessment.svelte.js';
	import { PRINCIPLES } from '$lib/config/principles.js';
	import { sampleAssessments } from '$lib/data/sample-reports';
	import Button from '$lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const d = $derived(store.data);
	const r = $derived(store.result);

	// Hydrate on direct navigation so the report renders even without going
	// through the wizard first.
	$effect(() => {
		const seed = sampleAssessments.find((s) => s.id === id)?.data;
		if (store.id !== id) {
			store.loadForId(id, seed);
		}
	});

	function maturityLabel(m: string): string {
		if (m === 'insufficient-data') return 'INSUFFICIENT DATA';
		return m.toUpperCase();
	}

	function maturityColor(m: string): string {
		switch (m) {
			case 'optimising':
			case 'mature':
				return 'bg-success text-success-content border-success';
			case 'developing':
			case 'initial':
				return 'bg-warning text-warning-content border-warning';
			case 'ad-hoc':
				return 'bg-error text-error-content border-error';
			default:
				return 'bg-base-300 text-base-content border-base-300';
		}
	}

	function bandClass(b: string): string {
		if (b === 'high') return 'text-success';
		if (b === 'mid') return 'text-warning';
		if (b === 'low') return 'text-error';
		return 'text-base-content/40';
	}

	const priorityColor: Record<string, string> = {
		high: 'bg-error text-error-content border-error',
		medium: 'bg-warning text-warning-content border-warning',
		low: 'bg-base-300 text-base-content border-base-300'
	};

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/agile-principles-assessments/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: store.data, result: store.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `agile-principles-assessment-${d.respondent.teamName || id}.pdf`;
				a.click();
				URL.revokeObjectURL(url);
			} else {
				pdfError = 'Failed to generate PDF. Please try again.';
			}
		} catch {
			pdfError = 'Failed to generate PDF. Please check your connection and try again.';
		}
	}
</script>

<header class="border-b border-base-300 bg-base-100 shadow-sm no-print">
	<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
		<h1 class="text-lg font-bold text-base-content">Agile principles assessment report</h1>
		<div class="flex items-center gap-3">
			{#if pdfError}
				<span class="text-sm text-error">{pdfError}</span>
			{/if}
			<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
			<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
			<Button data-variant="secondary" onclick={() => goto(`/agile-principles-assessment/agile-principles-assessments/${id}`)}>
				Edit
			</Button>
		</div>
	</div>
</header>

<main class="mx-16 px-4 py-6">
	<!-- Composite maturity banner -->
	<div class="mb-6 rounded-xl border-2 p-6 text-center {maturityColor(r.maturity)}">
		<div class="text-3xl font-bold">{maturityLabel(r.maturity)}</div>
		<div class="mt-2 text-sm">
			Mean {r.meanScore !== null ? r.meanScore.toFixed(2) : '— (insufficient data)'}
			· {r.answeredCount} / 12 answered{r.weightsCustomised
				? ` · weighted ${r.weightedMeanScore !== null ? r.weightedMeanScore.toFixed(2) : '—'}`
				: ''}
		</div>
	</div>

	<!-- Respondent summary -->
	<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
		<h2 class="mb-4 text-lg font-bold text-base-content">Respondent</h2>
		<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
			<div>
				<span class="font-medium text-base-content/70">Respondent:</span>
				{d.respondent.isAnonymous ? 'Anonymous' : d.respondent.fullName || '—'}
			</div>
			<div>
				<span class="font-medium text-base-content/70">Role:</span>
				{d.respondent.isAnonymous ? '—' : d.respondent.role || '—'}
			</div>
			<div><span class="font-medium text-base-content/70">Team:</span> {d.respondent.teamName || '—'}</div>
			<div>
				<span class="font-medium text-base-content/70">Organisation:</span>
				{d.respondent.organisationName || '—'}
			</div>
			<div><span class="font-medium text-base-content/70">Date:</span> {d.respondent.assessmentDate || '—'}</div>
			<div><span class="font-medium text-base-content/70">Cadence:</span> {d.respondent.assessmentPeriod || '—'}</div>
		</div>
	</div>

	<!-- Operational flags -->
	{#if r.additionalFlags.length > 0}
		<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-error">Operational flags</h2>
			<div class="space-y-2">
				{#each r.additionalFlags as flag (flag.flagId + (flag.principleNumber ?? ''))}
					<div class="flex items-start gap-3 rounded-lg border p-3 {priorityColor[flag.priority]}">
						<span class="mt-0.5 rounded px-2 py-0.5 text-xs font-bold uppercase {priorityColor[flag.priority]}">
							{flag.priority}
						</span>
						<div>
							<span class="font-medium">{flag.category}:</span>
							{flag.description}
							<span class="opacity-80">— {flag.suggestedAction}</span>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Per-principle scores -->
	<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
		<h2 class="mb-4 text-lg font-bold text-base-content">Per-principle scores</h2>
		<table class="w-full text-sm">
			<thead>
				<tr class="border-b border-base-300 text-left text-base-content/70">
					<th class="pb-2 pr-4">#</th>
					<th class="pb-2 pr-4">Principle</th>
					<th class="pb-2 pr-4">Score</th>
					<th class="pb-2 pr-4">Band</th>
					<th class="pb-2">Comment</th>
				</tr>
			</thead>
			<tbody>
				{#each PRINCIPLES as p (p.number)}
					{@const resp = d.responses[p.number - 1]}
					{@const band = r.perPrincipleBands[p.number - 1]}
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4 font-mono text-xs text-base-content/60">P{p.number}</td>
						<td class="py-2 pr-4">{p.shortTitle}</td>
						<td class="py-2 pr-4">{resp.score ?? '—'}</td>
						<td class="py-2 pr-4 font-medium uppercase {bandClass(band)}">
							{band === 'unanswered' ? '—' : band}
						</td>
						<td class="py-2 text-base-content/70">{resp.comment || '—'}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<!-- Fired coaching rules -->
	{#if r.firedRules.length > 0}
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Coaching notes</h2>
			<ul class="space-y-2 text-sm">
				{#each r.firedRules as rule (rule.ruleId)}
					<li>
						<code class="text-xs text-base-content/60">{rule.ruleId}</code>
						— P{rule.principleNumber} {rule.band.toUpperCase()}:
						{rule.description || '(no coaching note)'}
					</li>
				{/each}
			</ul>
		</div>
	{/if}

	<!-- Action plan -->
	{#if d.actionPlan.topAction1 || d.actionPlan.topAction2 || d.actionPlan.topAction3 || d.actionPlan.coachNotes || d.actionPlan.overallNotes}
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Action plan</h2>
			{#if d.actionPlan.topAction1 || d.actionPlan.topAction2 || d.actionPlan.topAction3}
				<ol class="list-inside list-decimal space-y-1 text-sm text-base-content/80">
					{#if d.actionPlan.topAction1}<li>{d.actionPlan.topAction1}</li>{/if}
					{#if d.actionPlan.topAction2}<li>{d.actionPlan.topAction2}</li>{/if}
					{#if d.actionPlan.topAction3}<li>{d.actionPlan.topAction3}</li>{/if}
				</ol>
			{/if}
			{#if d.actionPlan.coachNotes}
				<h3 class="mt-4 font-semibold text-base-content">Coach notes</h3>
				<p class="mt-1 whitespace-pre-line text-sm text-base-content/70">{d.actionPlan.coachNotes}</p>
			{/if}
			{#if d.actionPlan.overallNotes}
				<h3 class="mt-4 font-semibold text-base-content">Overall notes</h3>
				<p class="mt-1 whitespace-pre-line text-sm text-base-content/70">{d.actionPlan.overallNotes}</p>
			{/if}
		</div>
	{/if}
</main>
