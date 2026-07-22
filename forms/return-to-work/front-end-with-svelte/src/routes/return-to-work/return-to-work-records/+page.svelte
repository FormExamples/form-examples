<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleAssessmentRows } from '$lib/data/sample-reports';
	import { fitnessStatementLabel, restrictionPriorityLabel } from '$lib/engine/utils';
	import type { FitnessStatement, RestrictionPriority } from '$lib/engine/types';

	let fitnessFilter = $state('');
	let priorityFilter = $state('');
	let gridApi = $state<any>(null);

	const rows = $derived(
		sampleAssessmentRows.filter(
			(r) =>
				(fitnessFilter === '' || r.fitnessStatement === fitnessFilter) &&
				(priorityFilter === '' || r.restrictionPriority === priorityFilter)
		)
	);

	// Follow the active Lily theme: pick the dark SVAR skin when the theme's base
	// surface is dark. Recomputed whenever <html data-theme> changes (after the
	// new theme stylesheet has applied its tokens).
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

	// SVAR DataGrid columns. The fitness statement and restriction priority render
	// through the shared engine output so the dashboard and report stay aligned.
	const columns = [
		{ id: 'id', header: 'Record', width: 130 },
		{ id: 'patientName', header: 'Patient', flexgrow: 2, sort: true },
		{ id: 'assessedDate', header: 'Assessed', width: 120, sort: true },
		{
			id: 'fitnessStatement',
			header: 'Fitness',
			width: 160,
			sort: true,
			template: (v: string) => fitnessStatementLabel(v as FitnessStatement)
		},
		{
			id: 'restrictionPriority',
			header: 'Priority',
			width: 120,
			sort: true,
			template: (v: string) => restrictionPriorityLabel(v as RestrictionPriority)
		},
		{
			id: 'phasedReturnFlag',
			header: 'Phased',
			width: 90,
			template: (v: boolean) => (v ? 'Yes' : 'No')
		},
		{ id: 'daysAbsent', header: 'Days absent', width: 110, sort: true },
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'patientName', order: 'asc' });
		// Open a record when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/return-to-work/return-to-work-records/${ev.id}`);
		});
	}
</script>

<main class="mx-16 px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">Return-to-work dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				Fitness statements and restriction priorities for assessed employees, computed by the
				shared engine. Select a row to open the record.
			</p>
		</div>
		<a href="/return-to-work/return-to-work-records/new" class="button" data-variant="primary">New record</a>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Fitness</span>
			<select class="select inline-block w-auto" bind:value={fitnessFilter}>
				<option value="">All</option>
				<option value="fit">Fit for work</option>
				<option value="may-be-fit">May be fit — with adjustments</option>
				<option value="not-fit">Not fit for work</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Restriction priority</span>
			<select class="select inline-block w-auto" bind:value={priorityFilter}>
				<option value="">All</option>
				<option value="routine">Routine</option>
				<option value="standard">Standard</option>
				<option value="restricted">Restricted</option>
				<option value="high-risk">High-risk</option>
			</select>
		</label>
	</div>

	<div class="overflow-hidden rounded-xl border border-base-300" style="height: 600px;">
		<GridTheme>
			<Grid data={rows} {columns} {init} />
		</GridTheme>
	</div>

	<p class="mt-4 text-sm text-base-content/60">{rows.length} records</p>
</main>
