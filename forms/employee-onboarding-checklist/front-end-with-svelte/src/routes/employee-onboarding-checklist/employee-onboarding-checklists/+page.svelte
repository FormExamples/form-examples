<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/env';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleAssessmentRows } from '#lib/data/sample-reports.js';
	import { completionStatusLabel, riskLevelLabel } from '#lib/engine/utils.js';

	let riskFilter = $state('');
	let statusFilter = $state('');
	let gridApi = $state<any>(null);

	const rows = $derived(
		sampleAssessmentRows.filter(
			(r) =>
				(riskFilter === '' || r.riskLevel === riskFilter) &&
				(statusFilter === '' || r.completionStatus === statusFilter)
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

	// SVAR DataGrid columns. Completion status and the overall risk render
	// through the shared engine output so the dashboard and report stay aligned.
	const columns = [
		{ id: 'id', header: 'Checklist', width: 120 },
		{ id: 'employeeName', header: 'Employee', flexgrow: 2, sort: true },
		{ id: 'jobTitle', header: 'Job title', flexgrow: 2, sort: true },
		{
			id: 'assessedDate',
			header: 'Assessed',
			width: 120,
			sort: true
		},

		{
			id: 'completionPercentage',
			header: 'Complete',
			width: 100,
			sort: true,
			template: (v: number) => `${v}%`
		},
		{
			id: 'completionStatus',
			header: 'Status',
			width: 150,
			sort: true,
			template: (v: string) => completionStatusLabel(v as never)
		},
		{
			id: 'riskLevel',
			header: 'Overall risk',
			width: 130,
			sort: true,
			template: (v: string) => riskLevelLabel(v as never)
		},

		{
			id: 'dbsCleared',
			header: 'DBS',
			width: 90,
			template: (v: boolean) => v ? 'Cleared' : 'No'
		},
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'employeeName', order: 'asc' });
		// Open a checklist when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/employee-onboarding-checklist/employee-onboarding-checklists/${ev.id}`);
		});
	}
</script>

<main class="mx-16 px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">Onboarding HR dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				Completion status and overall onboarding risk for staff records, computed by the shared
				engine. Select a row to open the checklist.
			</p>
		</div>
		<a href="/employee-onboarding-checklist/employee-onboarding-checklists/new" class="button" data-variant="primary">New checklist</a>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Overall risk</span>
			<select class="select inline-block w-auto" bind:value={riskFilter}>
				<option value="">All</option>
				<option value="low">Low</option>
				<option value="moderate">Moderate</option>
				<option value="high">High</option>
				<option value="critical">Critical</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Completion status</span>
			<select class="select inline-block w-auto" bind:value={statusFilter}>
				<option value="">All</option>
				<option value="not-started">Not started</option>
				<option value="in-progress">In progress</option>
				<option value="mostly-complete">Mostly complete</option>
				<option value="complete">Complete</option>
			</select>
		</label>
	</div>

	<div
		class="overflow-hidden rounded-xl border border-base-300"
		style="height: 600px;"
	><GridTheme><Grid data={rows} columns={columns} init={init} /></GridTheme></div>

	<p class="mt-4 text-sm text-base-content/60">{rows.length} employees</p>
</main>
