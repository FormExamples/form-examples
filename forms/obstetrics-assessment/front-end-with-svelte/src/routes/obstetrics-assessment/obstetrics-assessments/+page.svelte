<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/env';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleAssessmentRows } from '#lib/data/sample-reports.js';
	import { riskLevelShortLabel } from '#lib/engine/utils.js';

	let riskFilter = $state('');
	let pathwayFilter = $state('');
	let gridApi = $state<any>(null);

	const rows = $derived(
		sampleAssessmentRows.filter(
			(r) =>
				(riskFilter === '' || r.riskLevel === riskFilter) &&
				(pathwayFilter === '' || r.carePathway === pathwayFilter)
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

	// SVAR DataGrid columns. The risk level and care pathway render through the
	// shared engine output so the dashboard and report stay aligned.
	const columns = [
		{ id: 'id', header: 'Assessment', width: 120 },
		{ id: 'patientName', header: 'Patient', flexgrow: 2, sort: true },
		{ id: 'assessedDate', header: 'Booked', width: 120, sort: true },
		{ id: 'gestation', header: 'Gestation', width: 110, sort: true },
		{
			id: 'riskLevel',
			header: 'Risk level',
			width: 130,
			sort: true,
			template: (v: string) => riskLevelShortLabel(v as never)
		},

		{
			id: 'carePathway',
			header: 'Care pathway',
			width: 150,
			sort: true
		},

		{
			id: 'safeguardingFlag',
			header: 'Safeguarding',
			width: 120,
			template: (v: boolean) => v ? 'Yes' : 'No'
		},
		{
			id: 'mentalHealthFlag',
			header: 'Mental health',
			width: 120,
			template: (v: boolean) => v ? 'Yes' : 'No'
		},
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'patientName', order: 'asc' });
		// Open an assessment when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/obstetrics-assessment/obstetrics-assessments/${ev.id}`);
		});
	}
</script>

<main class="mx-16 px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">Maternity team dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				NG201 antenatal risk level and recommended care pathway for assessed pregnancies, computed by
				the shared engine. Select a row to open the assessment.
			</p>
		</div>
		<a href="/obstetrics-assessment/obstetrics-assessments/new" class="button" data-variant="primary">New assessment</a>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Risk level</span>
			<select class="select inline-block w-auto" bind:value={riskFilter}>
				<option value="">All</option>
				<option value="low">Low</option>
				<option value="moderate">Moderate</option>
				<option value="high">High</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Care pathway</span>
			<select class="select inline-block w-auto" bind:value={pathwayFilter}>
				<option value="">All</option>
				<option value="Midwifery-led">Midwifery-led</option>
				<option value="Shared / Obstetric">Shared / Obstetric</option>
				<option value="Consultant-led">Consultant-led</option>
			</select>
		</label>
	</div>

	<div
		class="overflow-hidden rounded-xl border border-base-300"
		style="height: 600px;"
	><GridTheme><Grid data={rows} columns={columns} init={init} /></GridTheme></div>

	<p class="mt-4 text-sm text-base-content/60">{rows.length} pregnancies</p>
</main>
