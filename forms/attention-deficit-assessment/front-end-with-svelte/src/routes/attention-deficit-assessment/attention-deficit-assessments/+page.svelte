<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/env';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleAssessmentRows } from '#lib/data/sample-reports.js';
	import { asrsClassificationLabel, adhdSubtypeLabel } from '#lib/engine/utils.js';

	let classificationFilter = $state('');
	let subtypeFilter = $state('');
	let gridApi = $state<any>(null);

	const rows = $derived(
		sampleAssessmentRows.filter(
			(r) =>
				(classificationFilter === '' || r.classification === classificationFilter) &&
				(subtypeFilter === '' || r.subtype === subtypeFilter)
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

	// SVAR DataGrid columns. The ASRS total, classification, and predominant
	// presentation render through the shared engine output so the dashboard and
	// report stay aligned.
	const columns = [
		{ id: 'id', header: 'Assessment', width: 120 },
		{ id: 'patientName', header: 'Patient', flexgrow: 2, sort: true },
		{ id: 'assessedDate', header: 'Assessed', width: 120, sort: true },
		{ id: 'asrsTotal', header: 'ASRS /72', width: 100, sort: true },
		{
			id: 'partAScreenerPositive',
			header: 'Part A screen',
			width: 120,
			template: (v: boolean) => v ? 'Positive' : 'Negative'
		},
		{
			id: 'classification',
			header: 'Classification',
			width: 160,
			sort: true,
			template: (v: string) => asrsClassificationLabel(v)
		},
		{
			id: 'subtype',
			header: 'Presentation',
			width: 200,
			sort: true,
			template: (v: string) => adhdSubtypeLabel(v as never)
		},
		{
			id: 'comorbidityFlag',
			header: 'Comorbid',
			width: 100,
			template: (v: boolean) => v ? 'Yes' : 'No'
		},
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'patientName', order: 'asc' });
		// Open an assessment when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/attention-deficit-assessment/attention-deficit-assessments/${ev.id}`);
		});
	}
</script>

<main class="mx-16 px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">ADHD screening clinician dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				ASRS total, ADHD classification, and predominant presentation for screened patients, computed
				by the shared engine. Select a row to open the assessment.
			</p>
		</div>
		<a href="/attention-deficit-assessment/attention-deficit-assessments/new" class="button" data-variant="primary"
			>New assessment</a
		>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Classification</span>
			<select class="select inline-block w-auto" bind:value={classificationFilter}>
				<option value="">All</option>
				<option value="unlikely">Unlikely ADHD</option>
				<option value="possible">Possible ADHD</option>
				<option value="likely">Likely ADHD</option>
				<option value="highly-likely">Highly Likely ADHD</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Presentation</span>
			<select class="select inline-block w-auto" bind:value={subtypeFilter}>
				<option value="">All</option>
				<option value="inattentive">Predominantly Inattentive</option>
				<option value="hyperactive-impulsive">Predominantly Hyperactive-Impulsive</option>
				<option value="combined">Combined Presentation</option>
				<option value="unspecified">Unspecified</option>
			</select>
		</label>
	</div>

	<div
		class="overflow-hidden rounded-xl border border-base-300"
		style="height: 600px;"
	><GridTheme><Grid data={rows} columns={columns} init={init} /></GridTheme></div>

	<p class="mt-4 text-sm text-base-content/60">{rows.length} patients</p>
</main>
