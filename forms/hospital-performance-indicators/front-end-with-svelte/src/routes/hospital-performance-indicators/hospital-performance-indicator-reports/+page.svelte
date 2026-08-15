<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/env';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleReportRows } from '#lib/data/sample-reports.js';

	let hospitalFilter = $state('');
	let completenessFilter = $state('');
	const rows = $derived(sampleReportRows.filter((r) => (hospitalFilter === '' || r.hospitalName === hospitalFilter) && (completenessFilter === '' || completenessFilter === 'complete' && r.reportedCount === r.totalCount || completenessFilter === 'incomplete' && r.reportedCount < r.totalCount)));
	const hospitalOptions = Array.from(new Set(sampleReportRows.map((r) => r.hospitalName)));

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

	// SVAR DataGrid columns. Indicators-recorded counts all render through the
	// shared engine output so the dashboard and report stay aligned.
	const columns = [
		{ id: 'id', header: 'Report', width: 140 },
		{ id: 'hospitalName', header: 'Hospital', flexgrow: 2, sort: true },
		{ id: 'preparedByName', header: 'Prepared by', flexgrow: 1, sort: true },
		{ id: 'period', header: 'Period', width: 100, sort: true },
		{ id: 'reportedCount', header: 'Indicators recorded', width: 150, sort: true },
		{ id: 'totalCount', header: 'Total indicators', width: 120, sort: true }
	];

	function init(api: any) {
		api.exec('sort-rows', { key: 'hospitalName', order: 'asc' });
		// Open a reporting period when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null)
				goto(`/hospital-performance-indicators/hospital-performance-indicator-reports/${ev.id}`);
		});
	}
</script>

<main class="mx-16 px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">Administrator review dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				Indicators recorded out of 50, for each reporting period, computed by the shared engine.
				Select a row to open the reporting period.
			</p>
		</div>
		<a
			href="/hospital-performance-indicators/hospital-performance-indicator-reports/new"
			class="button"
			data-variant="primary">New reporting period</a
		>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Hospital</span>
			<select class="select inline-block w-auto" bind:value={hospitalFilter}>
				<option value="">All</option>
				{#each hospitalOptions as h (h)}
					<option value={h}>{h}</option>
				{/each}
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Completeness</span>
			<select class="select inline-block w-auto" bind:value={completenessFilter}>
				<option value="">All</option>
				<option value="complete">Complete</option>
				<option value="incomplete">Incomplete</option>
			</select>
		</label>
	</div>

	<div
		class="overflow-hidden rounded-xl border border-base-300"
		style="height: 600px;"
	><GridTheme><Grid data={rows} columns={columns} init={init} /></GridTheme></div>

	<p class="mt-4 text-sm text-base-content/60">{rows.length} reporting periods</p>
</main>
