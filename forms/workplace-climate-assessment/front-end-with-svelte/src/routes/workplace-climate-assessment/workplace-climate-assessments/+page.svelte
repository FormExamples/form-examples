<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleAssessmentRows } from '$lib/data/sample-reports';
	import { categoryLabel, domainLabel, DOMAIN_LABELS } from '$lib/engine/utils';
	import type { ClimateCategory, GradedDomainKey } from '$lib/engine/types';

	let categoryFilter = $state('');
	let worstDomainFilter = $state('');
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let gridApi = $state<any>(null);

	const rows = $derived(
		sampleAssessmentRows.filter(
			(r) =>
				(categoryFilter === '' || r.category === categoryFilter) &&
				(worstDomainFilter === '' || r.worstDomain === worstDomainFilter)
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
		const update = () => (isDark = computeDark());
		update();
		const obs = new MutationObserver(() => setTimeout(update, 120));
		obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
		return () => obs.disconnect();
	});
	const GridTheme = $derived(isDark ? WillowDark : Willow);

	const domainKeys = Object.keys(DOMAIN_LABELS) as GradedDomainKey[];

	// SVAR DataGrid columns. The composite index, category and worst domain
	// render through the shared engine output so the dashboard and report stay
	// aligned.
	const columns = [
		{ id: 'id', header: 'Response', width: 120 },
		{ id: 'department', header: 'Department', flexgrow: 2, sort: true },
		{ id: 'submittedDate', header: 'Submitted', width: 120, sort: true },
		{
			id: 'compositeScore',
			header: 'Index',
			width: 100,
			sort: true,
			template: (v: number | null) => (v === null ? '—' : `${v}/100`)
		},
		{
			id: 'category',
			header: 'Climate',
			width: 130,
			sort: true,
			template: (v: ClimateCategory) => categoryLabel(v)
		},
		{ id: 'worstDomain', header: 'Lowest domain', flexgrow: 2, sort: true },
		{ id: 'recommend', header: 'Recommend', width: 130, sort: true },
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'department', order: 'asc' });
		// Open a response when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/workplace-climate-assessment/workplace-climate-assessments/${ev.id}`);
		});
	}
</script>

<main class="mx-auto max-w-6xl px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">Workplace climate leadership dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				Anonymous, aggregate Workplace Climate Index per response, computed by the shared engine.
				Select a row to open the response.
			</p>
		</div>
		<a href="/workplace-climate-assessment/workplace-climate-assessments/new" class="button" data-variant="primary">New response</a>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Climate category</span>
			<select class="select inline-block w-auto" bind:value={categoryFilter}>
				<option value="">All</option>
				<option value="thriving">Thriving (85-100)</option>
				<option value="healthy">Healthy (70-84)</option>
				<option value="developing">Developing (50-69)</option>
				<option value="strained">Strained (25-49)</option>
				<option value="critical">Critical (0-24)</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Lowest domain</span>
			<select class="select inline-block w-auto" bind:value={worstDomainFilter}>
				<option value="">All</option>
				{#each domainKeys as key (key)}
					<option value={domainLabel(key)}>{domainLabel(key)}</option>
				{/each}
			</select>
		</label>
	</div>

	<div class="overflow-hidden rounded-xl border border-base-300" style="height: 600px;">
		<GridTheme>
			<Grid data={rows} {columns} {init} />
		</GridTheme>
	</div>

	<p class="mt-4 text-sm text-base-content/60">{rows.length} responses</p>
</main>
