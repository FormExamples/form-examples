<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleAssessmentRows } from '$lib/data/sample-reports';
	import { bandLabel, careSettingLabel } from '$lib/engine/utils';

	let settingFilter = $state('');
	let bandFilter = $state('');
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let gridApi = $state<any>(null);

	const rows = $derived(
		sampleAssessmentRows.filter(
			(r) =>
				(settingFilter === '' || r.careSetting === settingFilter) &&
				(bandFilter === '' || r.burdenBand === bandFilter)
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

	// SVAR DataGrid columns. Total score, band, and instrument form render
	// through the shared engine output so the dashboard and report stay aligned.
	const columns = [
		{ id: 'id', header: 'Assessment', width: 120 },
		{ id: 'carerIdentifier', header: 'Carer ID', width: 130, sort: true },
		{ id: 'carerName', header: 'Carer', flexgrow: 2, sort: true },
		{ id: 'assessedDate', header: 'Assessed', width: 120, sort: true },
		{
			id: 'careSetting',
			header: 'Setting',
			width: 190,
			sort: true,
			template: (v: string) => careSettingLabel(v as never) || '—'
		},
		{
			id: 'instrumentForm',
			header: 'Form',
			width: 90,
			sort: true,
			template: (v: string) => (v === 'zbi12' ? 'ZBI-12' : 'ZBI-22')
		},
		{
			id: 'totalScore',
			header: 'Total',
			width: 90,
			sort: true,
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			template: (v: number, row: any) => `${v} / ${row.maxScore}`
		},
		{
			id: 'burdenBand',
			header: 'Band',
			width: 210,
			sort: true,
			template: (v: string) => bandLabel(v as never)
		},
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'carerName', order: 'asc' });
		// Open an assessment when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/zarit-burden-interview/zarit-burden-interviews/${ev.id}`);
		});
	}
</script>

<main class="mx-16 px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">ZBI clinician dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				ZBI total, burden band, and flag count for assessed carers, computed by the shared engine.
				Select a row to open the assessment.
			</p>
		</div>
		<a href="/zarit-burden-interview/zarit-burden-interviews/new" class="button" data-variant="primary">New assessment</a>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Care setting</span>
			<select class="select inline-block w-auto" bind:value={settingFilter}>
				<option value="">All</option>
				<option value="memory-service">Old-age / memory service</option>
				<option value="community">Community / district nursing</option>
				<option value="general-practice">General practice</option>
				<option value="social-care">Social care / carer support</option>
				<option value="other">Other</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Band</span>
			<select class="select inline-block w-auto" bind:value={bandFilter}>
				<option value="">All</option>
				<option value="little-or-none">Little or no burden (0-21)</option>
				<option value="mild-to-moderate">Mild to moderate (22-40)</option>
				<option value="moderate-to-severe">Moderate to severe (41-60)</option>
				<option value="severe">Severe (61-88)</option>
				<option value="lower">ZBI-12 lower (0-16)</option>
				<option value="high">ZBI-12 high (&ge; 17)</option>
			</select>
		</label>
	</div>

	<div class="overflow-hidden rounded-xl border border-base-300" style="height: 600px;">
		<GridTheme>
			<Grid data={rows} {columns} {init} />
		</GridTheme>
	</div>

	<p class="mt-4 text-sm text-base-content/60">{rows.length} carers</p>
</main>
