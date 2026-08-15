<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/env';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleRequestRows } from '#lib/data/sample-reports.js';
	import {
		bodyRegionLabel,
		indicationLabel,
		mriSafetyLabel,
		triageTierLabel,
		recommendationLabel
	} from '#lib/engine/utils.js';

	let recommendationFilter = $state('');
	let triageFilter = $state('');
	let gridApi = $state<any>(null);

	const rows = $derived(
		sampleRequestRows.filter(
			(r) =>
				(recommendationFilter === '' || r.recommendation === recommendationFilter) &&
				(triageFilter === '' || r.triageTier === triageFilter)
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

	// SVAR DataGrid columns. The safety band, triage tier, and recommendation all
	// render through the shared engine output so the dashboard and report stay aligned.
	const columns = [
		{ id: 'id', header: 'Request', width: 120, sort: true },
		{
			id: 'patientName',
			header: 'Patient',
			flexgrow: 2,
			sort: true
		},

		{
			id: 'referralDate',
			header: 'Referred',
			width: 120,
			sort: true
		},

		{
			id: 'bodyRegion',
			header: 'Region',
			width: 130,
			sort: true,
			template: (v: string) => bodyRegionLabel(v as never)
		},
		{
			id: 'primaryIndication',
			header: 'Indication',
			width: 150,
			sort: true,
			template: (v: string) => indicationLabel(v as never)
		},
		{
			id: 'mriSafetyBand',
			header: 'MRI safety',
			width: 160,
			sort: true,
			template: (v: string) => mriSafetyLabel(v as never)
		},
		{
			id: 'triageTier',
			header: 'Triage',
			width: 110,
			sort: true,
			template: (v: string) => triageTierLabel(v as never)
		},
		{
			id: 'recommendation',
			header: 'Recommendation',
			width: 170,
			sort: true,
			template: (v: string) => recommendationLabel(v as never)
		},
		{ id: 'completenessPercent', header: 'Complete', width: 100, sort: true, template: (v: number) => `${v}%` },
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'patientName', order: 'asc' });
		// Open a request when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/mri-scan-test-request/mri-scan-test-requests/${ev.id}`);
		});
	}
</script>

<main class="mx-16 px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">MRI vetting dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				Four-axis vetting grades for incoming MRI requests, computed by the shared engine. Select a
				row to open the request.
			</p>
		</div>
		<a href="/mri-scan-test-request/mri-scan-test-requests/new" class="button" data-variant="primary">New request</a>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Recommendation</span>
			<select class="select inline-block w-auto" bind:value={recommendationFilter}>
				<option value="">All</option>
				<option value="accept">Accept and book</option>
				<option value="query-referrer">Query the referrer</option>
				<option value="redirect">Redirect / modify protocol</option>
				<option value="reject">Reject</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Triage tier</span>
			<select class="select inline-block w-auto" bind:value={triageFilter}>
				<option value="">All</option>
				<option value="routine">Routine</option>
				<option value="urgent">Urgent</option>
				<option value="emergency">Emergency</option>
			</select>
		</label>
	</div>

	<div
		class="overflow-hidden rounded-xl border border-base-300"
		style="height: 600px;"
	><GridTheme><Grid data={rows} columns={columns} init={init} /></GridTheme></div>

	<p class="mt-4 text-sm text-base-content/60">{rows.length} requests</p>
</main>
