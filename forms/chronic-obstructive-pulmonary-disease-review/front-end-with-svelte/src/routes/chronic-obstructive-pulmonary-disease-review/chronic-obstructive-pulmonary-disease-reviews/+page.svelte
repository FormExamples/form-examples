<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/env';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleAssessmentRows } from '#lib/data/sample-reports.js';

	import {
		goldGradeShort,
		abeGroupShort,
		reviewStatusLabel,
		reviewTypeLabel
	} from '#lib/engine/utils.js';

	const plural = 'chronic-obstructive-pulmonary-disease-reviews';
	let goldFilter = $state('');
	let abeFilter = $state('');
	let gridApi = $state<any>(null);

	const rows = $derived(
		sampleAssessmentRows.filter(
			(r) =>
				(goldFilter === '' || String(r.goldGrade) === goldFilter) &&
				(abeFilter === '' || r.abeGroup === abeFilter)
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

	// SVAR DataGrid columns. GOLD grade, ABE group, and review completeness
	// render through the shared engine output so the dashboard and report stay
	// aligned.
	const columns = [
		{ id: 'id', header: 'Review', width: 150 },
		{
			id: 'patientIdentifier',
			header: 'Patient ID',
			width: 130,
			sort: true
		},

		{
			id: 'patientName',
			header: 'Patient',
			flexgrow: 2,
			sort: true
		},

		{
			id: 'reviewType',
			header: 'Review type',
			flexgrow: 2,
			sort: true,
			template: (v: string) => reviewTypeLabel(v as never) || '—'
		},

		{
			id: 'reviewedDate',
			header: 'Reviewed',
			width: 120,
			sort: true
		},

		{
			id: 'goldGrade',
			header: 'GOLD',
			width: 90,
			sort: true,
			template: (v: number | null) => goldGradeShort(v as never)
		},
		{
			id: 'abeGroup',
			header: 'ABE',
			width: 90,
			sort: true,
			template: (v: string | null) => abeGroupShort(v as never)
		},
		{
			id: 'reviewStatus',
			header: 'Completeness',
			width: 140,
			sort: true,
			template: (v: string) => reviewStatusLabel(v as never)
		},
		{ id: 'highFlagCount', header: 'High flags', width: 100, sort: true },
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'patientName', order: 'asc' });
		// Open a review when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/chronic-obstructive-pulmonary-disease-review/${plural}/${ev.id}`);
		});
	}
</script>

<main class="mx-16 px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">COPD review clinician dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				GOLD airflow grade, ABE assessment group, review completeness, and clinical flags for
				reviewed patients, computed by the shared engine. Select a row to open the review.
			</p>
		</div>
		<a href="/chronic-obstructive-pulmonary-disease-review/{plural}/new" class="button" data-variant="primary">New review</a>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">GOLD grade</span>
			<select class="select inline-block w-auto" bind:value={goldFilter}>
				<option value="">All</option>
				<option value="1">GOLD 1</option>
				<option value="2">GOLD 2</option>
				<option value="3">GOLD 3</option>
				<option value="4">GOLD 4</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">ABE group</span>
			<select class="select inline-block w-auto" bind:value={abeFilter}>
				<option value="">All</option>
				<option value="A">Group A</option>
				<option value="B">Group B</option>
				<option value="E">Group E</option>
			</select>
		</label>
	</div>

	<div
		class="overflow-hidden rounded-xl border border-base-300"
		style="height: 600px;"
	><GridTheme><Grid data={rows} columns={columns} init={init} /></GridTheme></div>

	<p class="mt-4 text-sm text-base-content/60">{rows.length} patients</p>
</main>
