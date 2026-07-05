<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleRequestRows } from '$lib/data/sample-reports';
	import {
		eligibilityLabel,
		impactLabel,
		priorityTierLabel,
		recommendationLabel,
		statusLabel
	} from '$lib/engine/utils';

	let priorityFilter = $state('');
	let recommendationFilter = $state('');
	let gridApi = $state<any>(null);

	const rows = $derived(
		sampleRequestRows.filter(
			(r) =>
				(priorityFilter === '' || r.priorityTier === priorityFilter) &&
				(recommendationFilter === '' || r.recommendation === recommendationFilter)
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

	// SVAR DataGrid columns. Graded axes render through the shared engine label
	// helpers so the dashboard and the report stay in lock-step.
	const columns = [
		{ id: 'id', header: 'Request', width: 130 },
		{ id: 'workerName', header: 'Worker', flexgrow: 2, sort: true },
		{ id: 'workerJobTitle', header: 'Job title', flexgrow: 2 },
		{ id: 'status', header: 'Status', width: 130, template: (v: string) => statusLabel(v as never) },
		{
			id: 'eligibilityBand',
			header: 'Eligibility',
			width: 140,
			template: (v: string) => eligibilityLabel(v as never)
		},
		{ id: 'impactBand', header: 'Impact', width: 110, template: (v: string) => impactLabel(v as never) },
		{ id: 'completenessPercent', header: 'Complete', width: 100, template: (v: number) => `${v}%` },
		{
			id: 'priorityTier',
			header: 'Priority',
			width: 110,
			sort: true,
			template: (v: string) => priorityTierLabel(v as never)
		},
		{
			id: 'recommendation',
			header: 'Recommendation',
			width: 200,
			template: (v: string) => recommendationLabel(v as never)
		},
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'priorityTier', order: 'asc' });
		// Open a request when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/neurodiversity-adjustment-requests/${ev.id}`);
		});
	}
</script>

<main class="mx-auto max-w-6xl px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">Adjustment-request handling dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				Four-axis grades for incoming neurodiversity adjustment requests, computed by the shared
				engine. Select a row to open the request.
			</p>
		</div>
		<a href="/neurodiversity-adjustment-requests/new" class="button" data-variant="primary">New request</a>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Priority tier</span>
			<select class="select inline-block w-auto" bind:value={priorityFilter}>
				<option value="">All</option>
				<option value="routine">Routine</option>
				<option value="soon">Soon</option>
				<option value="urgent">Urgent</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Recommendation</span>
			<select class="select inline-block w-auto" bind:value={recommendationFilter}>
				<option value="">All</option>
				<option value="progress-to-meeting">Progress to meeting</option>
				<option value="seek-occupational-health">Seek occupational health</option>
				<option value="request-more-detail">Request more detail</option>
				<option value="signpost-access-to-work">Signpost Access to Work</option>
			</select>
		</label>
	</div>

	<div class="overflow-hidden rounded-xl border border-base-300" style="height: 600px;">
		<GridTheme>
			<Grid data={rows} {columns} {init} />
		</GridTheme>
	</div>

	<p class="mt-4 text-sm text-base-content/60">{rows.length} requests</p>
</main>
