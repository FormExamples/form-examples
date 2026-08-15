<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/env';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleLpaRows } from '#lib/data/sample-reports.js';
	import {
		decisionModeLabel,
		whenAttorneysCanActLabel,
		bandLabel,
		compositeRiskLabel
	} from '#lib/validator/labels.js';

	const plural = 'united-kingdom-lasting-powers-of-attorney-for-financial-decisions';

	let riskFilter = $state('');
	let modeFilter = $state('');
	let gridApi = $state<any>(null);

	const rows = $derived(
		sampleLpaRows.filter(
			(r) =>
				(riskFilter === '' || r.compositeRisk === riskFilter) &&
				(modeFilter === '' || r.decisionMode === modeFilter)
		)
	);

	// Follow the active Lily theme: pick the dark SVAR skin when the theme's
	// base surface is dark. Recomputed whenever <html data-theme> changes.
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

	// SVAR DataGrid columns. Validity band and composite risk render through the
	// shared engine output so the dashboard and report stay aligned.
	const columns = [
		{ id: 'donorName', header: 'Donor', flexgrow: 2, sort: true },
		{
			id: 'attorneyCount',
			header: 'Attorneys',
			width: 100,
			sort: true
		},

		{
			id: 'decisionMode',
			header: 'Decision mode',
			width: 200,
			sort: true,
			template: (v: string) => decisionModeLabel(v)
		},
		{
			id: 'whenAttorneysCanAct',
			header: 'When can act',
			width: 200,
			sort: true,
			template: (v: string) => whenAttorneysCanActLabel(v)
		},

		{
			id: 'replacementAttorneyCount',
			header: 'Replacements',
			width: 120,
			sort: true
		},

		{
			id: 'peopleToNotifyCount',
			header: 'Notify',
			width: 90,
			sort: true
		},

		{
			id: 'validityBand',
			header: 'Validity',
			width: 170,
			sort: true,
			template: (v: string) => bandLabel(v)
		},
		{
			id: 'compositeRisk',
			header: 'Risk',
			width: 110,
			sort: true,
			template: (v: string) => compositeRiskLabel(v as never)
		},
		{
			id: 'opgStatus',
			header: 'OPG status',
			width: 170,
			sort: true,
			template: (v: string) => bandLabel(v)
		},
		{ id: 'createdAt', header: 'Created', width: 120, sort: true }
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'donorName', order: 'asc' });
		// Open an LPA when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/united-kingdom-lasting-power-of-attorney-for-financial-decisions/${plural}/${ev.id}`);
		});
	}
</script>

<main class="mx-16 px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">LPA case dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				Validity band and composite risk for each LP1F deed, computed by the shared validation
				engine. Select a row to open the LPA.
			</p>
		</div>
		<a href="/united-kingdom-lasting-power-of-attorney-for-financial-decisions/{plural}/new" class="button" data-variant="primary">New LPA</a>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Composite risk</span>
			<select class="select inline-block w-auto" bind:value={riskFilter}>
				<option value="">All</option>
				<option value="low">Low</option>
				<option value="moderate">Moderate</option>
				<option value="high">High</option>
				<option value="critical">Critical</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Decision mode</span>
			<select class="select inline-block w-auto" bind:value={modeFilter}>
				<option value="">All</option>
				<option value="single_attorney">Single attorney</option>
				<option value="jointly_and_severally">Jointly and severally</option>
				<option value="jointly">Jointly</option>
				<option value="mixed">Mixed</option>
			</select>
		</label>
	</div>

	<div
		class="overflow-hidden rounded-xl border border-base-300"
		style="height: 600px;"
	><GridTheme><Grid data={rows} columns={columns} init={init} /></GridTheme></div>

	<p class="mt-4 text-sm text-base-content/60">{rows.length} LPAs</p>
</main>
