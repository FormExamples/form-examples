<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleChecklistRows } from '$lib/data/sample-reports';
	import { statusLabel, urgencyLabel } from '$lib/checklist/labels';
	import type { ChecklistStatus, Urgency } from '$lib/checklist/types';

	let statusFilter = $state('');
	let urgencyFilter = $state('');

	const rows = $derived(
		sampleChecklistRows.filter(
			(r) =>
				(statusFilter === '' || r.status === statusFilter) &&
				(urgencyFilter === '' || r.urgency === urgencyFilter)
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
		const update = () => (isDark = computeDark());
		update();
		const obs = new MutationObserver(() => setTimeout(update, 120));
		obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
		return () => obs.disconnect();
	});
	const GridTheme = $derived(isDark ? WillowDark : Willow);

	// SVAR DataGrid columns. Status and urgency render through the shared engine
	// labels so the dashboard and report stay aligned.
	const columns = [
		{ id: 'id', header: 'Case', width: 130 },
		{ id: 'caseDate', header: 'Case date', width: 110, sort: true },
		{ id: 'patientName', header: 'Patient', flexgrow: 2, sort: true },
		{ id: 'siteName', header: 'Site', flexgrow: 2, sort: true },
		{ id: 'operatingRoom', header: 'Theatre / OR', width: 120, sort: true },
		{ id: 'surgeonName', header: 'Surgeon', flexgrow: 1, sort: true },
		{ id: 'anaesthetistName', header: 'Anaesthetist', flexgrow: 1, sort: true },
		{
			id: 'urgency',
			header: 'Urgency',
			width: 110,
			sort: true,
			template: (v: Urgency) => urgencyLabel(v)
		},
		{ id: 'surgicalSpecialty', header: 'Specialty', flexgrow: 1, sort: true },
		{
			id: 'status',
			header: 'Status',
			width: 150,
			sort: true,
			template: (v: ChecklistStatus) => statusLabel(v)
		},
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	function init(api: any) {
		api.exec('sort-rows', { key: 'caseDate', order: 'asc' });
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/who-surgical-safety-checklist/who-surgical-safety-checklists/${ev.id}`);
		});
	}
</script>

<main class="mx-16 px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">Surgical safety dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				Lifecycle status and computed safety-flag count for every surgical case, derived by the
				shared engine. Select a row to open the checklist.
			</p>
		</div>
		<a href="/who-surgical-safety-checklist/who-surgical-safety-checklists/new" class="button" data-variant="primary">New checklist</a>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Status</span>
			<select class="select inline-block w-auto" bind:value={statusFilter}>
				<option value="">All</option>
				<option value="not-started">Not started</option>
				<option value="sign-in-complete">Sign In complete</option>
				<option value="time-out-complete">Time Out complete</option>
				<option value="sign-out-complete">Sign Out complete</option>
				<option value="completed">Completed</option>
				<option value="abandoned">Abandoned</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Urgency</span>
			<select class="select inline-block w-auto" bind:value={urgencyFilter}>
				<option value="">All</option>
				<option value="elective">Elective</option>
				<option value="urgent">Urgent</option>
				<option value="emergency">Emergency</option>
				<option value="immediate">Immediate</option>
			</select>
		</label>
	</div>

	<div class="overflow-hidden rounded-xl border border-base-300" style="height: 600px;">
		<GridTheme>
			<Grid data={rows} {columns} {init} />
		</GridTheme>
	</div>

	<p class="mt-4 text-sm text-base-content/60">{rows.length} cases</p>
</main>
