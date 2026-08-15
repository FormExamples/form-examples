<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/env';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleMeetingRows } from '#lib/data/sample-reports.js';
	import { healthLabel, statusLabel, categoryLabel, formatDateTime } from '#lib/engine/utils.js';

	let healthFilter = $state('');
	let statusFilter = $state('');
	let gridApi = $state<any>(null);

	const rows = $derived(
		sampleMeetingRows.filter(
			(r) =>
				(healthFilter === '' || r.health === healthFilter) &&
				(statusFilter === '' || r.status === statusFilter)
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

	// SVAR DataGrid columns. Duration, acceptance, open actions, outcomes and
	// overall health all render through the shared engine output so the dashboard
	// and report stay aligned.
	const columns = [
		{ id: 'id', header: 'Meeting', width: 130 },
		{ id: 'title', header: 'Title', flexgrow: 2, sort: true },
		{
			id: 'organizerName',
			header: 'Organiser',
			flexgrow: 1,
			sort: true
		},

		{
			id: 'category',
			header: 'Category',
			width: 120,
			sort: true,
			template: (v: string) => categoryLabel(v as never)
		},
		{
			id: 'scheduledStart',
			header: 'Scheduled start',
			width: 160,
			sort: true,
			template: (v: string) => formatDateTime(v)
		},
		{
			id: 'durationMinutes',
			header: 'Duration',
			width: 100,
			sort: true,
			template: (v: number | null) => v == null ? '—' : `${v} min`
		},
		{ id: 'acceptance', header: 'Accepted / total', width: 130 },
		{
			id: 'openActions',
			header: 'Open actions',
			width: 120,
			sort: true
		},

		{
			id: 'outcomeCount',
			header: 'Outcomes',
			width: 100,
			sort: true
		},

		{
			id: 'status',
			header: 'Status',
			width: 120,
			sort: true,
			template: (v: string) => statusLabel(v as never)
		},
		{
			id: 'health',
			header: 'Health',
			width: 140,
			sort: true,
			template: (v: string) => healthLabel(v as never)
		}
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'scheduledStart', order: 'asc' });
		// Open a meeting when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/meeting/meetings/${ev.id}`);
		});
	}
</script>

<main class="mx-16 px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">Meeting dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				Recorded meetings with their duration, acceptance, open actions, outcomes and overall
				health, computed by the shared validation engine. Select a row to open the record.
			</p>
		</div>
		<a href="/meeting/meetings/new" class="button" data-variant="primary">New meeting</a>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Health</span>
			<select class="select inline-block w-auto" bind:value={healthFilter}>
				<option value="">All</option>
				<option value="green">Healthy</option>
				<option value="amber">Needs attention</option>
				<option value="red">Action required</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Status</span>
			<select class="select inline-block w-auto" bind:value={statusFilter}>
				<option value="">All</option>
				<option value="draft">Draft</option>
				<option value="scheduled">Scheduled</option>
				<option value="in-progress">In progress</option>
				<option value="completed">Completed</option>
				<option value="cancelled">Cancelled</option>
			</select>
		</label>
	</div>

	<div
		class="overflow-hidden rounded-xl border border-base-300"
		style="height: 600px;"
	><GridTheme><Grid data={rows} columns={columns} init={init} /></GridTheme></div>

	<p class="mt-4 text-sm text-base-content/60">{rows.length} meetings</p>
</main>
