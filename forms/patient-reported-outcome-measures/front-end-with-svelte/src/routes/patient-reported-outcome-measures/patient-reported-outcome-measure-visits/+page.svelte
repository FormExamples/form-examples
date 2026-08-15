<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/env';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleVisitRows } from '#lib/data/sample-reports.js';

	let visitFilter = $state('');
	let ndiBandFilter = $state('');

	const rows = $derived(
		sampleVisitRows.filter(
			(r) =>
				(visitFilter === '' || r.visit === visitFilter) &&
				(ndiBandFilter === '' || r.ndiBand === ndiBandFilter)
		)
	);

	const visitOptions = Array.from(new Set(sampleVisitRows.map((r) => r.visit).filter(Boolean)));

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

	// SVAR DataGrid columns. All computed values render through the shared
	// engine output so the dashboard and report stay aligned.
	const columns = [
		{ id: 'id', header: 'Visit ID', width: 140 },
		{ id: 'subjectId', header: 'Subject', width: 110, sort: true },
		{ id: 'subjectName', header: 'Name', flexgrow: 2, sort: true },
		{ id: 'visit', header: 'Visit', width: 100, sort: true },
		{ id: 'assessmentDate', header: 'Date', width: 110, sort: true },
		{
			id: 'sf36Pcs',
			header: 'SF-36 PCS (approx.)',
			width: 150,
			sort: true,
			template: (v: number | null) => typeof v === 'number' ? v.toFixed(1) : '—'
		},
		{
			id: 'sf36Mcs',
			header: 'SF-36 MCS (approx.)',
			width: 150,
			sort: true,
			template: (v: number | null) => typeof v === 'number' ? v.toFixed(1) : '—'
		},
		{
			id: 'ndiPercentage',
			header: 'NDI %',
			width: 90,
			sort: true,
			template: (v: number | null) => typeof v === 'number' ? v.toFixed(1) : '—'
		},
		{ id: 'ndiBand', header: 'NDI band', width: 130, sort: true },
		{
			id: 'mjoaTotal',
			header: 'mJOA',
			width: 80,
			sort: true,
			template: (v: number | null) => typeof v === 'number' ? String(v) : '—'
		},
		{ id: 'mjoaBand', header: 'mJOA band', width: 110, sort: true },
		{
			id: 'eq5dIndex',
			header: 'EQ-5D index',
			width: 110,
			sort: true,
			template: (v: number | null) => typeof v === 'number' ? v.toFixed(3) : '—'
		}
	];

	function init(api: any) {
		api.exec('sort-rows', { key: 'subjectName', order: 'asc' });
		// Open a visit when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null)
				goto(`/patient-reported-outcome-measures/patient-reported-outcome-measure-visits/${ev.id}`);
		});
	}
</script>

<main class="mx-16 px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">PRO measures clinician dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				SF-36 summary approximations, NDI band, mJOA band, and EQ-5D index for recorded visits,
				computed by the shared engine. Select a row to open the visit.
			</p>
		</div>
		<a
			href="/patient-reported-outcome-measures/patient-reported-outcome-measure-visits/new"
			class="button"
			data-variant="primary">New visit</a
		>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Visit</span>
			<select class="select inline-block w-auto" bind:value={visitFilter}>
				<option value="">All</option>
				{#each visitOptions as v (v)}
					<option value={v}>{v}</option>
				{/each}
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">NDI band</span>
			<select class="select inline-block w-auto" bind:value={ndiBandFilter}>
				<option value="">All</option>
				<option value="no-disability">No disability</option>
				<option value="mild">Mild</option>
				<option value="moderate">Moderate</option>
				<option value="severe">Severe</option>
				<option value="complete">Complete</option>
			</select>
		</label>
	</div>

	<div
		class="overflow-hidden rounded-xl border border-base-300"
		style="height: 600px;"
	><GridTheme><Grid data={rows} columns={columns} init={init} /></GridTheme></div>

	<p class="mt-4 text-sm text-base-content/60">{rows.length} visits</p>
</main>
