<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleAssessmentRows } from '$lib/data/sample-reports';
	import { maturityLabel, bandLabel, pctOrDash } from '$lib/engine/utils';
	import type { Band, Maturity } from '$lib/engine/types';

	let maturityFilter = $state('');
	let weakFilter = $state('');
	let gridApi = $state<any>(null);

	const rows = $derived(
		sampleAssessmentRows.filter(
			(r) =>
				(maturityFilter === '' || r.maturity === maturityFilter) &&
				(weakFilter === '' || r.weakSection === weakFilter)
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

	const cap = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '—');

	// SVAR DataGrid columns. Composite maturity, overall percentage, and the
	// per-section bands all render through the shared engine output so the
	// dashboard and report stay aligned.
	const columns = [
		{ id: 'id', header: 'Checklist', width: 120 },
		{ id: 'respondent', header: 'Respondent', flexgrow: 2, sort: true },
		{ id: 'team', header: 'Team', width: 120, sort: true },
		{ id: 'assessedDate', header: 'Assessed', width: 120, sort: true },
		{
			id: 'maturity',
			header: 'Maturity',
			width: 130,
			sort: true,
			template: (v: Maturity) => maturityLabel(v)
		},
		{
			id: 'overallPercent',
			header: 'Overall',
			width: 90,
			sort: true,
			template: (v: number | null) => pctOrDash(v)
		},
		{ id: 'teamsBand', header: 'Teams', width: 100, template: (v: Band) => bandLabel(v) },
		{
			id: 'stakeholdersBand',
			header: 'Stakeholders',
			width: 120,
			template: (v: Band) => bandLabel(v)
		},
		{ id: 'practicesBand', header: 'Practices', width: 100, template: (v: Band) => bandLabel(v) },
		{ id: 'weakSection', header: 'Weakest', width: 120, template: (v: string) => cap(v) },
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'respondent', order: 'asc' });
		// Open a checklist when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/agile-checklists/${ev.id}`);
		});
	}
</script>

<main class="mx-auto max-w-6xl px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">Agile coach dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				Composite maturity, overall percentage, and per-section bands for assessed teams, computed by
				the shared engine. Select a row to open the checklist.
			</p>
		</div>
		<a href="/agile-checklists/new" class="button" data-variant="primary">New checklist</a>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Maturity</span>
			<select class="select inline-block w-auto" bind:value={maturityFilter}>
				<option value="">All</option>
				<option value="optimising">Optimising</option>
				<option value="mature">Mature</option>
				<option value="developing">Developing</option>
				<option value="initial">Initial</option>
				<option value="ad-hoc">Ad-hoc</option>
				<option value="insufficient-data">Insufficient data</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Weakest section</span>
			<select class="select inline-block w-auto" bind:value={weakFilter}>
				<option value="">All</option>
				<option value="teams">Teams</option>
				<option value="stakeholders">Stakeholders</option>
				<option value="practices">Practices</option>
			</select>
		</label>
	</div>

	<div class="overflow-hidden rounded-xl border border-base-300" style="height: 600px;">
		<GridTheme>
			<Grid data={rows} {columns} {init} />
		</GridTheme>
	</div>

	<p class="mt-4 text-sm text-base-content/60">{rows.length} teams</p>
</main>
