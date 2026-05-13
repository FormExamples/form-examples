<script lang="ts">
	import { page } from '$app/state';
	import { scorecards } from '$lib/data';
	import { bandToRecommendation, RECOMMENDATION_COPY } from '$lib/recommendation';
	import type { Band } from '$lib/types';

	const id = $derived(page.params.id ?? '');
	const row = $derived(scorecards.find((r) => r.id === id));

	const bandClass: Record<Band, string> = {
		low: 'bg-band-low text-band-low-text',
		borderline: 'bg-band-borderline text-band-borderline-text',
		medium: 'bg-band-medium text-band-medium-text',
		high: 'bg-band-high text-band-high-text',
	};
</script>

<svelte:head>
	<title>Scorecard {id} — Agile Consulting Dashboard</title>
</svelte:head>

<main class="max-w-3xl mx-auto px-4 py-6">
	<header class="flex items-baseline justify-between gap-3">
		<h1 class="text-2xl font-bold text-slate-800">Scorecard {id}</h1>
		<a href="/" class="text-sm text-blue-600">← Back to dashboard</a>
	</header>

	{#if !row}
		<section class="bg-yellow-50 border border-yellow-300 rounded p-4 mt-4">
			<p class="text-sm">
				No scorecard found with id <code>{id}</code> in the bundled sample data.
				The reviewer dashboard hands off the id to the Loco backend
				(<code>/api/scorecards/{id}</code>); without the backend running, only
				the 12 demo rows under <code>src/lib/data.ts</code> are visible.
			</p>
		</section>
	{:else}
		<section class="bg-white border border-slate-300 rounded p-4 mt-4">
			<h2 class="text-lg font-semibold text-slate-800">Organization &amp; respondent</h2>
			<dl class="mt-3 grid grid-cols-[10rem_1fr] gap-y-1.5 gap-x-4 text-sm">
				<dt class="text-slate-600">Organization</dt><dd>{row.organizationName}</dd>
				<dt class="text-slate-600">Sector</dt><dd>{row.sector}</dd>
				<dt class="text-slate-600">Size band</dt><dd>{row.sizeBand}</dd>
				<dt class="text-slate-600">Respondent</dt><dd>{row.respondentName}</dd>
				<dt class="text-slate-600">Assessment date</dt><dd>{row.assessmentDate}</dd>
			</dl>
		</section>

		<section class="bg-white border border-slate-300 rounded p-4 mt-4">
			<h2 class="text-lg font-semibold text-slate-800">Score &amp; readiness band</h2>
			<div class="mt-3 flex items-end gap-4 flex-wrap">
				<div>
					<div class="text-3xl font-bold">{row.scoreTotal}</div>
					<div class="text-xs text-slate-600">/ 16 total</div>
				</div>
				<div>
					<div class="text-3xl font-bold">{row.manifestoSubtotal}</div>
					<div class="text-xs text-slate-600">/ 4 manifesto</div>
				</div>
				<div>
					<div class="text-3xl font-bold">{row.principlesSubtotal}</div>
					<div class="text-xs text-slate-600">/ 12 principles</div>
				</div>
				<div class="ml-auto flex flex-col items-end gap-1">
					<span class="inline-block px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wide {bandClass[row.computedBand]}">
						{row.computedBand}
					</span>
					<span class="text-xs text-slate-600">{bandToRecommendation(row.computedBand)}</span>
				</div>
			</div>
			<p class="mt-3 text-sm text-slate-700">{RECOMMENDATION_COPY[row.computedBand]}</p>
		</section>

		<section class="bg-white border border-slate-300 rounded p-4 mt-4">
			<h2 class="text-lg font-semibold text-slate-800">Readiness flags</h2>
			{#if row.flags.length === 0}
				<p class="text-sm text-slate-600 mt-2">No flags fired.</p>
			{:else}
				<ul class="mt-2 space-y-2">
					{#each row.flags as flag (flag.category)}
						<li class="rounded border-l-4 border-red-500 bg-red-50 p-2">
							<div class="font-semibold text-sm">
								{flag.category}
								<span class="text-xs text-slate-500">({flag.priority})</span>
							</div>
						</li>
					{/each}
				</ul>
			{/if}
		</section>

		<section class="bg-blue-50 border border-blue-200 rounded p-4 mt-4 text-sm">
			Item-by-item answers and evidence notes are not bundled in the dashboard
			sample data — fetch <code>/api/scorecards/{id}</code> from the Loco
			backend to see the full assessment.
		</section>
	{/if}
</main>
