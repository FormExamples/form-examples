<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/env';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleAssessmentRows } from '#lib/data/sample-reports.js';
	import { bandShortLabel } from '#lib/engine/utils.js';
	import type { Band } from '#lib/engine/types.js';

	const plural = 'agile-consulting-scorecards-for-hiring-help';

	let bandFilter = $state('');
	let sectorFilter = $state('');
	let gridApi = $state<any>(null);

	const sectors = $derived(
		[...new Set(sampleAssessmentRows.map((r) => r.sector))].sort()
	);

	const rows = $derived(
		sampleAssessmentRows.filter(
			(r) =>
				(bandFilter === '' || r.computedBand === bandFilter) &&
				(sectorFilter === '' || r.sector === sectorFilter)
		)
	);

	// Follow the active Lily theme: pick the dark SVAR skin when the theme's
	// base surface is dark. Recomputed whenever <html data-theme> changes (after
	// the new theme stylesheet has applied its tokens).
	let isDark = $state(false);
	function computeDark(): boolean {
		if (!browser) return false;
		const v = getComputedStyle(document.documentElement)
			.getPropertyValue('--color-base-100')
			.trim();
		const m = v.match(/oklch\(\s*([0-9.]+%?)/);
		if (!m) return false;
		const l = m[1].endsWith('%') ? parseFloat(m[1]) / 100 : parseFloat(m[1]);
		return l < 0.5;
	}
	$effect(() => {
		if (!browser) return;
		const update = () => isDark = computeDark();
		update();
		const obs = new MutationObserver(() => setTimeout(update, 120));
		obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
		return () => obs.disconnect();
	});
	const GridTheme = $derived(isDark ? WillowDark : Willow);

	// SVAR DataGrid columns. The score, subtotals, and readiness band render
	// through the shared engine output so the dashboard and report stay aligned.
	const columns = [
		{ id: 'id', header: 'Scorecard', width: 130 },
		{ id: 'organizationName', header: 'Organization', flexgrow: 2, sort: true },
		{ id: 'sector', header: 'Sector', width: 150, sort: true },
		{
			id: 'respondentName',
			header: 'Respondent',
			flexgrow: 1,
			sort: true
		},

		{
			id: 'assessmentDate',
			header: 'Assessed',
			width: 120,
			sort: true
		},

		{
			id: 'scoreTotal',
			header: 'Score',
			width: 90,
			sort: true,
			template: (v: number) => `${v} / 16`
		},

		{
			id: 'manifestoSubtotal',
			header: 'Manifesto',
			width: 110,
			sort: true,
			template: (v: number) => `${v} / 4`
		},

		{
			id: 'principlesSubtotal',
			header: 'Principles',
			width: 110,
			sort: true,
			template: (v: number) => `${v} / 12`
		},

		{
			id: 'computedBand',
			header: 'Readiness',
			width: 120,
			sort: true,
			template: (v: Band) => bandShortLabel(v)
		},
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'scoreTotal', order: 'desc' });
		// Open a scorecard when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/agile-consulting-scorecard-for-hiring-help/${plural}/${ev.id}`);
		});
	}
</script>

<main class="mx-16 px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">Agile readiness reviewer dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				Total score, manifesto and principles subtotals, and readiness band for assessed
				organizations, computed by the shared engine. Select a row to open the scorecard.
			</p>
		</div>
		<a href="/agile-consulting-scorecard-for-hiring-help/{plural}/new" class="button" data-variant="primary">New scorecard</a>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Readiness band</span>
			<select class="select inline-block w-auto" bind:value={bandFilter}>
				<option value="">All</option>
				<option value="low">Low</option>
				<option value="borderline">Borderline</option>
				<option value="medium">Medium</option>
				<option value="high">High</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Sector</span>
			<select class="select inline-block w-auto" bind:value={sectorFilter}>
				<option value="">All</option>
				{#each sectors as s (s)}
					<option value={s}>{s}</option>
				{/each}
			</select>
		</label>
	</div>

	<div
		class="overflow-hidden rounded-xl border border-base-300"
		style="height: 600px;"
	><GridTheme><Grid data={rows} columns={columns} init={init} /></GridTheme></div>

	<p class="mt-4 text-sm text-base-content/60">{rows.length} organizations</p>
</main>
