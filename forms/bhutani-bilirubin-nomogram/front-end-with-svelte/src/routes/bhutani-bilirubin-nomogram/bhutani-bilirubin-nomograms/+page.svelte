<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleAssessmentRows } from '$lib/data/sample-reports';
	import { careSettingLabel, riskZoneLabel, formatTsb } from '$lib/engine/utils';
	import type { RiskZone } from '$lib/engine/types';

	let settingFilter = $state('');
	let zoneFilter = $state('');
	let gridApi = $state<any>(null);

	const rows = $derived(
		sampleAssessmentRows.filter(
			(r) =>
				(settingFilter === '' || r.careSetting === settingFilter) &&
				(zoneFilter === '' || r.riskZone === zoneFilter)
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

	// SVAR DataGrid columns. Risk zone and treatment-threshold signals render
	// through the shared engine output so the dashboard and report stay aligned.
	const columns = [
		{ id: 'id', header: 'Assessment', width: 130 },
		{ id: 'infantIdentifier', header: 'Infant ID', width: 130, sort: true },
		{ id: 'patientName', header: 'Infant', flexgrow: 2, sort: true },
		{ id: 'assessedDate', header: 'Assessed', width: 120, sort: true },
		{
			id: 'careSetting',
			header: 'Setting',
			width: 150,
			sort: true,
			template: (v: string) => careSettingLabel(v as never) || '—'
		},
		{
			id: 'ageHours',
			header: 'Age (h)',
			width: 90,
			sort: true,
			template: (v: number | null) => (v === null ? '—' : String(v))
		},
		{
			id: 'tsb',
			header: 'TSB',
			width: 110,
			sort: true,
			template: (v: number | null) => formatTsb(v)
		},
		{
			id: 'riskZone',
			header: 'Risk zone',
			width: 190,
			sort: true,
			template: (v: RiskZone) => riskZoneLabel(v)
		},
		{
			id: 'aboveExchange',
			header: 'Exchange',
			width: 100,
			template: (v: boolean) => (v ? 'At/above' : 'Below')
		},
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'patientName', order: 'asc' });
		// Open an assessment when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/bhutani-bilirubin-nomogram/bhutani-bilirubin-nomograms/${ev.id}`);
		});
	}
</script>

<main class="mx-16 px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">Bhutani nomogram dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				Risk zone and treatment-threshold signals for assessed infants, computed by the shared
				engine. Select a row to open the assessment.
			</p>
		</div>
		<a href="/bhutani-bilirubin-nomogram/bhutani-bilirubin-nomograms/new" class="button" data-variant="primary"
			>New assessment</a
		>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Care setting</span>
			<select class="select inline-block w-auto" bind:value={settingFilter}>
				<option value="">All</option>
				<option value="postnatal-ward">Postnatal ward</option>
				<option value="neonatal-unit">Neonatal unit</option>
				<option value="midwife-led-unit">Midwife-led unit</option>
				<option value="community">Community / midwifery follow-up</option>
				<option value="other">Other</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Risk zone</span>
			<select class="select inline-block w-auto" bind:value={zoneFilter}>
				<option value="">All</option>
				<option value="low">Low</option>
				<option value="low-intermediate">Low-intermediate</option>
				<option value="high-intermediate">High-intermediate</option>
				<option value="high">High</option>
			</select>
		</label>
	</div>

	<div class="overflow-hidden rounded-xl border border-base-300" style="height: 600px;">
		<GridTheme>
			<Grid data={rows} {columns} {init} />
		</GridTheme>
	</div>

	<p class="mt-4 text-sm text-base-content/60">{rows.length} infants</p>
</main>
