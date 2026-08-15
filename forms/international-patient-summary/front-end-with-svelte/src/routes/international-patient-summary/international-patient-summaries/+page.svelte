<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/env';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleAssessmentRows } from '#lib/data/sample-reports.js';
	import { completenessLevelLabel } from '#lib/engine/utils.js';
	import type { CompletenessLevel } from '#lib/engine/types.js';

	let completenessFilter = $state('');
	let allergyFilter = $state('');
	let gridApi = $state<any>(null);

	const rows = $derived(
		sampleAssessmentRows.filter(
			(r) =>
				(completenessFilter === '' || r.completeness === completenessFilter) &&
				(allergyFilter === '' || String(r.allergyFlag) === allergyFilter)
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

	// SVAR DataGrid columns. The completeness level and populated-section counts
	// render through the shared engine output so the dashboard and report stay
	// aligned.
	const columns = [
		{ id: 'id', header: 'IPS', width: 130 },
		{
			id: 'patientName',
			header: 'Patient',
			flexgrow: 2,
			sort: true
		},

		{
			id: 'assessedDate',
			header: 'Updated',
			width: 120,
			sort: true
		},

		{
			id: 'completeness',
			header: 'Completeness',
			width: 140,
			sort: true,
			template: (v: string) => completenessLevelLabel(v as CompletenessLevel)
		},
		{ id: 'mandatory', header: 'Mandatory', width: 110, sort: true },
		{ id: 'optional', header: 'Optional', width: 100, sort: true },
		{
			id: 'allergyFlag',
			header: 'Allergy',
			width: 90,
			template: (v: boolean) => v ? 'Yes' : 'No'
		},
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'patientName', order: 'asc' });
		// Open an IPS when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/international-patient-summary/international-patient-summaries/${ev.id}`);
		});
	}
</script>

<main class="mx-16 px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">IPS clinician dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				Completeness level and populated-section counts for compiled patient summaries, computed by the
				shared engine. Select a row to open the IPS.
			</p>
		</div>
		<a href="/international-patient-summary/international-patient-summaries/new" class="button" data-variant="primary">New IPS</a>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Completeness</span>
			<select class="select inline-block w-auto" bind:value={completenessFilter}>
				<option value="">All</option>
				<option value="complete">Complete</option>
				<option value="partial">Partial</option>
				<option value="incomplete">Incomplete</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Allergy recorded</span>
			<select class="select inline-block w-auto" bind:value={allergyFilter}>
				<option value="">All</option>
				<option value="true">Yes</option>
				<option value="false">No</option>
			</select>
		</label>
	</div>

	<div
		class="overflow-hidden rounded-xl border border-base-300"
		style="height: 600px;"
	><GridTheme><Grid data={rows} columns={columns} init={init} /></GridTheme></div>

	<p class="mt-4 text-sm text-base-content/60">{rows.length} patient summaries</p>
</main>
