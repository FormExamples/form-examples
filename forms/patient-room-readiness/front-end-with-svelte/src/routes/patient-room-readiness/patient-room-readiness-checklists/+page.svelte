<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/env';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleAssessmentRows } from '#lib/data/sample-reports.js';

	let search = $state('');
	let readinessFilter = $state<'' | 'ready' | 'not-ready'>('');
	let gridApi = $state<any>(null);

	function isReady(row: { checkedCount: number; totalCount: number }): boolean {
		return row.checkedCount === row.totalCount;
	}

	const rows = $derived(
		sampleAssessmentRows.filter((r) => {
		if (search) {
			const term = search.toLowerCase();
				const matches =
					r.buildingNameOrNumber.toLowerCase().includes(term) ||
					r.roomNameOrNumber.toLowerCase().includes(term) ||
					r.inspectorName.toLowerCase().includes(term);
			if (!matches) return false;
		}
		if (readinessFilter === 'ready' && !isReady(r)) return false;
		if (readinessFilter === 'not-ready' && isReady(r)) return false;
		return true;
		})
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

	// SVAR DataGrid columns. Checked/total both render through the shared
	// tally output so the dashboard and report stay aligned.
	const columns = [
		{ id: 'id', header: 'Checklist', width: 130 },
		{
			id: 'buildingNameOrNumber',
			header: 'Building',
			flexgrow: 1,
			sort: true
		},

		{
			id: 'roomNameOrNumber',
			header: 'Room',
			flexgrow: 1,
			sort: true
		},

		{
			id: 'assessedDate',
			header: 'Inspected',
			width: 120,
			sort: true
		},

		{
			id: 'checkedCount',
			header: 'Checkpoints',
			width: 130,
			sort: true,
			template: (v: number, row: any) => `${v} / ${row.totalCount}`
		},
		{ id: 'inspectorName', header: 'Inspector', flexgrow: 1, sort: true }
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'assessedDate', order: 'desc' });
		// Open a checklist when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/patient-room-readiness/patient-room-readiness-checklists/${ev.id}`);
		});
	}
</script>

<main class="mx-16 px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">Housekeeping dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				Room-readiness checklists by building, room, checkpoint completeness, and inspector. Select
				a row to open the checklist.
			</p>
		</div>
		<a
			href="/patient-room-readiness/patient-room-readiness-checklists/new"
			class="button"
			data-variant="primary">New checklist</a
		>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Search</span>
			<input
				type="search"
				class="search-input inline-block w-auto"
				placeholder="Building, room, or inspector…"
				bind:value={search}
			/>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Readiness</span>
			<select class="select inline-block w-auto" bind:value={readinessFilter}>
				<option value="">All rooms</option>
				<option value="ready">Fully ready (25/25)</option>
				<option value="not-ready">Needs attention</option>
			</select>
		</label>
	</div>

	<div
		class="overflow-hidden rounded-xl border border-base-300"
		style="height: 500px;"
	><GridTheme><Grid data={rows} columns={columns} init={init} /></GridTheme></div>

	<p class="mt-4 text-sm text-base-content/60">{rows.length} rooms</p>
</main>
