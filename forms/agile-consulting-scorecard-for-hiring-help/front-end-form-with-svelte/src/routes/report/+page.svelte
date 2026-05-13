<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { getRecommendedActions } from '$lib/engine/recommendations';
	import { toPreTenderSummary } from '$lib/engine/pre-tender';

	const actions = $derived(getRecommendedActions(assessment.data));

	let downloading = $state(false);
	let error = $state<string | null>(null);

	let backendUrl = $state('http://localhost:5150');
	let submitting = $state(false);
	let submitResult = $state<{ id: string; url: string } | null>(null);
	let submitError = $state<string | null>(null);

	async function submitToBackend() {
		submitting = true;
		submitError = null;
		submitResult = null;
		try {
			const base = backendUrl.replace(/\/+$/, '');
			const res = await fetch(`${base}/api/scorecards`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(assessment.data),
			});
			if (!res.ok) {
				const body = await res.text();
				throw new Error(`${res.status} ${res.statusText} — ${body.slice(0, 200)}`);
			}
			const row = (await res.json()) as { id: string };
			submitResult = { id: row.id, url: `${base}/api/scorecards/${row.id}` };
		} catch (e) {
			submitError = e instanceof Error ? e.message : String(e);
		} finally {
			submitting = false;
		}
	}

	function downloadPreTender() {
		const summary = toPreTenderSummary(assessment.data, assessment.grade);
		const blob = new Blob([JSON.stringify(summary, null, 2)], {
			type: 'application/json',
		});
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'agile-consulting-scorecard-pre-tender.json';
		document.body.appendChild(a);
		a.click();
		a.remove();
		URL.revokeObjectURL(url);
	}

	async function downloadPdf() {
		downloading = true;
		error = null;
		try {
			const res = await fetch('/report/pdf', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(assessment.data),
			});
			if (!res.ok) {
				const body = await res.text();
				throw new Error(`PDF endpoint returned ${res.status}: ${body.slice(0, 200)}`);
			}
			const blob = await res.blob();
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = 'agile-consulting-scorecard-for-hiring-help.pdf';
			document.body.appendChild(a);
			a.click();
			a.remove();
			URL.revokeObjectURL(url);
		} catch (e) {
			error = e instanceof Error ? e.message : String(e);
		} finally {
			downloading = false;
		}
	}
</script>

<svelte:head>
	<title>Report — Agile Consulting Scorecard</title>
</svelte:head>

<main class="max-w-3xl mx-auto px-4 py-6">
	<header class="flex items-baseline justify-between gap-3">
		<h1 class="text-2xl font-bold text-slate-800">Scorecard report</h1>
		<a href="/" class="text-sm text-blue-600">← Back to wizard</a>
	</header>

	<section class="bg-white border border-slate-300 rounded p-4 mt-4">
		<div class="flex items-end gap-4 flex-wrap">
			<div>
				<div class="text-3xl font-bold">{assessment.grade.scoreTotal}</div>
				<div class="text-xs text-slate-600">/ 16 total</div>
			</div>
			<div>
				<div class="text-3xl font-bold">{assessment.grade.manifestoSubtotal}</div>
				<div class="text-xs text-slate-600">/ 4 manifesto</div>
			</div>
			<div>
				<div class="text-3xl font-bold">{assessment.grade.principlesSubtotal}</div>
				<div class="text-xs text-slate-600">/ 12 principles</div>
			</div>
			<div class="ml-auto">
				<span class="inline-block px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wide bg-blue-100 text-blue-900">
					{assessment.grade.computedBand}
				</span>
			</div>
		</div>
	</section>

	<section class="mt-4 flex flex-wrap gap-2">
		<button
			type="button"
			class="px-4 py-2 rounded bg-blue-500 text-white disabled:opacity-50"
			disabled={downloading}
			onclick={downloadPdf}
		>
			{downloading ? 'Building PDF…' : 'Download PDF'}
		</button>
		<button
			type="button"
			class="px-4 py-2 rounded border border-blue-500 bg-white text-blue-700"
			onclick={downloadPreTender}
			title="Redacted JSON suitable to share with prospective consultants"
		>
			Download pre-tender JSON
		</button>
		{#if error}
			<p class="mt-2 text-sm text-red-700 w-full">{error}</p>
		{/if}
	</section>

	<section class="mt-4 bg-white border border-slate-300 rounded p-4">
		<h2 class="text-lg font-semibold text-slate-800">Submit to backend</h2>
		<p class="text-sm text-slate-600 mt-1">
			POSTs the assessment to the Rust axum server's
			<code>/api/scorecards</code> endpoint. Start the backend with
			<code>cargo run --bin agile-consulting-scorecard-server</code>
			from the <code>full-stack-with-loco-tera-htmx-alpine/</code>
			directory.
		</p>
		<div class="flex flex-wrap gap-2 mt-2">
			<input
				type="url"
				class="flex-1 min-w-[20rem] p-1.5 rounded border border-slate-300 text-sm"
				bind:value={backendUrl}
				placeholder="http://localhost:5150"
			/>
			<button
				type="button"
				class="px-4 py-2 rounded bg-blue-500 text-white disabled:opacity-50"
				disabled={submitting}
				onclick={submitToBackend}
			>
				{submitting ? 'Submitting…' : 'Submit to backend'}
			</button>
		</div>
		{#if submitResult}
			<p class="mt-2 text-sm text-green-800">
				✓ Submitted as <code>{submitResult.id}</code> —
				<a class="text-blue-600 underline" href={submitResult.url} target="_blank" rel="noopener">{submitResult.url}</a>
			</p>
		{/if}
		{#if submitError}
			<p class="mt-2 text-sm text-red-700">{submitError}</p>
		{/if}
	</section>

	<section class="mt-4 bg-white border border-slate-300 rounded p-4">
		<h2 class="text-lg font-semibold text-slate-800">Readiness flags</h2>
		{#if assessment.grade.additionalFlags.length === 0}
			<p class="text-sm text-slate-600 mt-2">No flags fired.</p>
		{:else}
			<ul class="mt-2 space-y-2">
				{#each assessment.grade.additionalFlags as flag}
					<li class="rounded border-l-4 border-red-500 bg-red-50 p-2">
						<div class="font-semibold text-sm">
							{flag.category} <span class="text-xs text-slate-500">({flag.priority})</span>
						</div>
						<div class="text-sm">{flag.description}</div>
						<div class="text-xs text-slate-600 mt-1">
							<strong>Suggested action:</strong> {flag.suggestedAction}
						</div>
					</li>
				{/each}
			</ul>
		{/if}
	</section>

	<section class="mt-4 bg-white border border-slate-300 rounded p-4">
		<h2 class="text-lg font-semibold text-slate-800">Recommended next actions</h2>
		{#if actions.length === 0}
			<p class="text-sm text-slate-600 mt-2">
				No items marked "No" — no specific interventions recommended.
			</p>
		{:else}
			<p class="text-sm text-slate-600 mt-2">
				One per item the respondent marked "No". Work through these before
				(or alongside) any agile-consulting engagement.
			</p>
			<ol class="mt-3 space-y-3 list-decimal pl-5">
				{#each actions as action (action.itemKey)}
					<li>
						<div class="font-semibold text-sm">{action.heading}</div>
						<div class="text-sm mt-1">{action.intervention}</div>
						<div class="text-xs text-slate-600 mt-1 italic">
							Why: {action.rationale}
						</div>
					</li>
				{/each}
			</ol>
		{/if}
	</section>
</main>
