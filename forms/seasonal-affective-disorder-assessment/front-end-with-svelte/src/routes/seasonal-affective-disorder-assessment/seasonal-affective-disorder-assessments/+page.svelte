<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleAssessmentRows } from '$lib/data/sample-reports';
	import { combinedSeverityLabel, spaqBandLabel, phq9BandLabel } from '$lib/engine/sad-rules';

	let severityFilter = $state('');
	let spaqFilter = $state('');
	let gridApi = $state<any>(null);

	const rows = $derived(
		sampleAssessmentRows.filter(
			(r) =>
				(severityFilter === '' || r.combinedSeverity === severityFilter) &&
				(spaqFilter === '' || r.spaqBand === spaqFilter)
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

	// SVAR DataGrid columns. SPAQ GSS, PHQ-9 score, and the combined severity
	// render through the shared engine output so dashboard and report stay aligned.
	const columns = [
		{ id: 'id', header: 'Assessment', width: 130 },
		{ id: 'patientName', header: 'Patient', flexgrow: 2, sort: true },
		{ id: 'assessedDate', header: 'Assessed', width: 120, sort: true },
		{
			id: 'spaqScore',
			header: 'SPAQ GSS',
			width: 130,
			sort: true,
			template: (v: number, row: any) =>
				`${v}/24 (${spaqBandLabel(row.spaqBand as never)})`
		},
		{
			id: 'phq9Score',
			header: 'PHQ-9',
			width: 150,
			sort: true,
			template: (v: number, row: any) =>
				`${v}/27 (${phq9BandLabel(row.phq9Band as never)})`
		},
		{
			id: 'combinedSeverity',
			header: 'Combined severity',
			width: 160,
			sort: true,
			template: (v: string) => combinedSeverityLabel(v as never)
		},
		{ id: 'riskFlag', header: 'Risk', width: 80, template: (v: boolean) => (v ? 'Yes' : 'No') },
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'patientName', order: 'asc' });
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/seasonal-affective-disorder-assessment/seasonal-affective-disorder-assessments/${ev.id}`);
		});
	}
</script>

<main class="mx-16 px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">SAD clinician dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				SPAQ Global Seasonality Score, PHQ-9 depression severity, and combined severity for assessed
				patients, computed by the shared engine. Select a row to open the assessment.
			</p>
		</div>
		<a href="/seasonal-affective-disorder-assessment/seasonal-affective-disorder-assessments/new" class="button" data-variant="primary">New assessment</a>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Combined severity</span>
			<select class="select inline-block w-auto" bind:value={severityFilter}>
				<option value="">All</option>
				<option value="no-sad">No SAD</option>
				<option value="mild">Mild</option>
				<option value="moderate">Moderate</option>
				<option value="severe">Severe</option>
				<option value="critical">Critical</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">SPAQ band</span>
			<select class="select inline-block w-auto" bind:value={spaqFilter}>
				<option value="">All</option>
				<option value="no-sad">No SAD</option>
				<option value="subsyndromal">Subsyndromal SAD</option>
				<option value="sad-likely">SAD likely</option>
			</select>
		</label>
	</div>

	<div class="overflow-hidden rounded-xl border border-base-300" style="height: 600px;">
		<GridTheme>
			<Grid data={rows} {columns} {init} />
		</GridTheme>
	</div>

	<p class="mt-4 text-sm text-base-content/60">{rows.length} patients</p>
</main>
