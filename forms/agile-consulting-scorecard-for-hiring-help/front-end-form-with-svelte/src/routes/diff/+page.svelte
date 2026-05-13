<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { parseAssessment, safeParseAssessment } from '$lib/engine/schema';
	import { diffAssessments, type ScorecardDiff } from '$lib/engine/diff';
	import type { AgileConsultingScorecardAssessment, Band } from '$lib/engine/types';

	let priorJsonText = $state('');
	let priorAssessment = $state<AgileConsultingScorecardAssessment | null>(null);
	let loadError = $state<string | null>(null);

	const diff = $derived<ScorecardDiff | null>(
		priorAssessment ? diffAssessments(priorAssessment, assessment.data) : null,
	);

	function loadFromText(text: string) {
		loadError = null;
		try {
			const parsed: unknown = JSON.parse(text);
			const result = safeParseAssessment(parsed);
			if (!result.success) {
				loadError = `Invalid assessment: ${result.error.issues
					.slice(0, 3)
					.map((i) => `${i.path.join('.')}: ${i.message}`)
					.join('; ')}`;
				return;
			}
			priorAssessment = result.data;
			priorJsonText = text;
		} catch (e) {
			loadError = `JSON parse error: ${e instanceof Error ? e.message : String(e)}`;
		}
	}

	async function onFileChange(e: Event) {
		const target = e.currentTarget as HTMLInputElement;
		const file = target.files?.[0];
		if (!file) return;
		const text = await file.text();
		loadFromText(text);
	}

	const deltaClass = (n: number) =>
		n > 0 ? 'text-green-700' : n < 0 ? 'text-red-700' : 'text-slate-500';

	const bandClass: Record<Band, string> = {
		low: 'bg-band-low text-band-low-text',
		borderline: 'bg-band-borderline text-band-borderline-text',
		medium: 'bg-band-medium text-band-medium-text',
		high: 'bg-band-high text-band-high-text',
	};

	const ITEM_LABEL: Record<string, string> = {
		m1: 'Manifesto 1 — Individuals and interactions',
		m2: 'Manifesto 2 — Working software',
		m3: 'Manifesto 3 — Customer collaboration',
		m4: 'Manifesto 4 — Responding to change',
		p1: 'Principle 1 — Customer satisfaction',
		p2: 'Principle 2 — Welcome changing requirements',
		p3: 'Principle 3 — Deliver frequently',
		p4: 'Principle 4 — Business + developers daily',
		p5: 'Principle 5 — Motivated individuals',
		p6: 'Principle 6 — Face-to-face',
		p7: 'Principle 7 — Working software primary measure',
		p8: 'Principle 8 — Sustainable pace',
		p9: 'Principle 9 — Technical excellence',
		p10: 'Principle 10 — Simplicity',
		p11: 'Principle 11 — Self-organizing teams',
		p12: 'Principle 12 — Reflection',
	};

	const answerLabel = (a: boolean | null) =>
		a === true ? 'Yes' : a === false ? 'No' : '—';
</script>

<svelte:head>
	<title>Diff — Agile Consulting Scorecard</title>
</svelte:head>

<main class="max-w-3xl mx-auto px-4 py-6">
	<header class="flex items-baseline justify-between gap-3">
		<h1 class="text-2xl font-bold text-slate-800">Compare with prior snapshot</h1>
		<a href="/" class="text-sm text-blue-600">← Back to wizard</a>
	</header>
	<p class="text-sm text-slate-600 mt-1">
		Load a previously exported assessment (the JSON you downloaded last time)
		to see what's changed since then. Useful for the "retake in ~3 months"
		check-in recommended by the seed.
	</p>

	<section class="bg-blue-50 border border-blue-200 rounded p-4 mt-4">
		<h2 class="text-lg font-semibold text-slate-800">Load prior assessment</h2>
		<div class="flex flex-wrap gap-2 mt-2">
			<input type="file" accept="application/json,.json" onchange={onFileChange} />
			<button
				type="button"
				class="px-3 py-1.5 rounded border border-blue-500 bg-white text-blue-700 text-sm"
				onclick={() => loadFromText(priorJsonText)}
			>
				Load pasted JSON
			</button>
		</div>
		<textarea
			class="w-full mt-2 p-2 rounded border border-slate-300 font-mono text-xs"
			rows="4"
			placeholder="…or paste assessment JSON here"
			bind:value={priorJsonText}
		></textarea>
		{#if loadError}
			<p class="mt-2 text-sm text-red-700">{loadError}</p>
		{/if}
	</section>

	{#if diff}
		<section class="bg-white border border-slate-300 rounded p-4 mt-4">
			<h2 class="text-lg font-semibold text-slate-800">Summary</h2>
			<div class="grid grid-cols-3 gap-3 mt-3 text-center">
				<div class="rounded border border-slate-300 p-3">
					<div class="text-2xl font-bold {deltaClass(diff.scoreDelta)}">
						{diff.scoreDelta > 0 ? '+' : ''}{diff.scoreDelta}
					</div>
					<div class="text-xs text-slate-600">total points</div>
				</div>
				<div class="rounded border border-slate-300 p-3">
					<div class="text-2xl font-bold {deltaClass(diff.manifestoDelta)}">
						{diff.manifestoDelta > 0 ? '+' : ''}{diff.manifestoDelta}
					</div>
					<div class="text-xs text-slate-600">manifesto</div>
				</div>
				<div class="rounded border border-slate-300 p-3">
					<div class="text-2xl font-bold {deltaClass(diff.principlesDelta)}">
						{diff.principlesDelta > 0 ? '+' : ''}{diff.principlesDelta}
					</div>
					<div class="text-xs text-slate-600">principles</div>
				</div>
			</div>

			<div class="mt-4 flex items-center gap-3 flex-wrap">
				<span class="text-sm text-slate-600">Band</span>
				<span class="inline-block px-2 py-0.5 rounded-full text-xs font-bold uppercase {bandClass[diff.bandBefore]}">
					{diff.bandBefore}
				</span>
				<span class="text-slate-400">→</span>
				<span class="inline-block px-2 py-0.5 rounded-full text-xs font-bold uppercase {bandClass[diff.bandAfter]}">
					{diff.bandAfter}
				</span>
				{#if diff.bandChanged}
					<span class="text-sm font-semibold text-blue-700">band changed</span>
				{:else}
					<span class="text-sm text-slate-500">band unchanged</span>
				{/if}
			</div>
		</section>

		{#if diff.improved.length > 0}
			<section class="bg-green-50 border border-green-200 rounded p-4 mt-4">
				<h2 class="text-lg font-semibold text-green-900">Improved ({diff.improved.length})</h2>
				<ul class="mt-2 space-y-1 text-sm">
					{#each diff.improved as item (item.itemKey)}
						<li>
							<strong>{ITEM_LABEL[item.itemKey] ?? item.itemKey}</strong> —
							{answerLabel(item.before)} → {answerLabel(item.after)}
						</li>
					{/each}
				</ul>
			</section>
		{/if}

		{#if diff.regressed.length > 0}
			<section class="bg-red-50 border border-red-200 rounded p-4 mt-4">
				<h2 class="text-lg font-semibold text-red-900">Regressed ({diff.regressed.length})</h2>
				<ul class="mt-2 space-y-1 text-sm">
					{#each diff.regressed as item (item.itemKey)}
						<li>
							<strong>{ITEM_LABEL[item.itemKey] ?? item.itemKey}</strong> —
							{answerLabel(item.before)} → {answerLabel(item.after)}
						</li>
					{/each}
				</ul>
			</section>
		{/if}

		{#if diff.newFlags.length > 0}
			<section class="bg-red-50 border border-red-200 rounded p-4 mt-4">
				<h2 class="text-lg font-semibold text-red-900">New flags ({diff.newFlags.length})</h2>
				<ul class="mt-2 space-y-1 text-sm">
					{#each diff.newFlags as flag}
						<li><strong>{flag.category}</strong> ({flag.priority})</li>
					{/each}
				</ul>
			</section>
		{/if}

		{#if diff.clearedFlags.length > 0}
			<section class="bg-green-50 border border-green-200 rounded p-4 mt-4">
				<h2 class="text-lg font-semibold text-green-900">Cleared flags ({diff.clearedFlags.length})</h2>
				<ul class="mt-2 space-y-1 text-sm">
					{#each diff.clearedFlags as flag}
						<li><strong>{flag.category}</strong> ({flag.priority})</li>
					{/each}
				</ul>
			</section>
		{/if}

		{#if diff.improved.length === 0 && diff.regressed.length === 0 && diff.newFlags.length === 0 && diff.clearedFlags.length === 0}
			<section class="bg-slate-50 border border-slate-300 rounded p-4 mt-4 text-sm text-slate-600">
				No item-level or flag-level changes between the two snapshots.
			</section>
		{/if}
	{:else}
		<section class="bg-slate-50 border border-slate-300 rounded p-4 mt-4 text-sm text-slate-600">
			No prior snapshot loaded yet. The "current" snapshot is the one held by
			the wizard (visit <a href="/" class="text-blue-600 underline">/</a> to
			edit it).
		</section>
	{/if}
</main>
