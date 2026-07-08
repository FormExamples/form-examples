<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleAssessmentRows } from '$lib/data/sample-reports';
	import { priorityLevelShortLabel } from '$lib/engine/utils';
	import type { PriorityLevel } from '$lib/engine/types';

	let priorityFilter = $state('');
	let typeFilter = $state('');
	let gridApi = $state<any>(null);

	const rows = $derived(
		sampleAssessmentRows.filter(
			(r) =>
				(priorityFilter === '' || r.priorityLevel === priorityFilter) &&
				(typeFilter === '' || r.requestType === typeFilter)
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

	// SVAR DataGrid columns. The priority classification renders through the
	// shared engine output so the dashboard and report stay aligned.
	const columns = [
		{ id: 'id', header: 'Request', width: 130 },
		{ id: 'patientName', header: 'Patient', flexgrow: 2, sort: true },
		{ id: 'clinicianName', header: 'Clinician', flexgrow: 1, sort: true },
		{ id: 'medicationName', header: 'Medication', flexgrow: 1, sort: true },
		{ id: 'dosage', header: 'Dosage', width: 130, sort: true },
		{ id: 'requestType', header: 'Type', width: 90, sort: true },
		{
			id: 'priorityLevel',
			header: 'Priority',
			width: 120,
			sort: true,
			template: (v: PriorityLevel) => priorityLevelShortLabel(v)
		},
		{ id: 'requestDate', header: 'Date', width: 120, sort: true },
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'requestDate', order: 'desc' });
		// Open a request when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/prescription-request/prescription-requests/${ev.id}`);
		});
	}
</script>

<main class="mx-auto max-w-6xl px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">Prescription request clinician dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				Priority classification and flag counts for prescription requests, computed by the shared
				engine. Select a row to open the request.
			</p>
		</div>
		<a href="/prescription-request/prescription-requests/new" class="button" data-variant="primary">New request</a>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Priority</span>
			<select class="select inline-block w-auto" bind:value={priorityFilter}>
				<option value="">All</option>
				<option value="routine">Routine</option>
				<option value="urgent">Urgent</option>
				<option value="emergency">Emergency</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Type</span>
			<select class="select inline-block w-auto" bind:value={typeFilter}>
				<option value="">All</option>
				<option value="New">New</option>
				<option value="Refill">Refill</option>
			</select>
		</label>
	</div>

	<div class="overflow-hidden rounded-xl border border-base-300" style="height: 600px;">
		<GridTheme>
			<Grid data={rows} {columns} {init} />
		</GridTheme>
	</div>

	<p class="mt-4 text-sm text-base-content/60">{rows.length} prescription requests</p>
</main>
