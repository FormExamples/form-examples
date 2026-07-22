<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleAssessmentRows } from '$lib/data/sample-reports';
	import { severityBandLabel, ppsBandLabel } from '$lib/engine/utils';
	import type { SeverityBand } from '$lib/engine/types';

	let severityFilter = $state('');
	let ppsFilter = $state('');
	let gridApi = $state<any>(null);

	const rows = $derived(
		sampleAssessmentRows.filter(
			(r) =>
				(severityFilter === '' || r.severityBand === severityFilter) &&
				(ppsFilter === '' || r.ppsBand === ppsFilter)
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

	// SVAR DataGrid columns. The ESAS-r total, severity band, and severe-symptom
	// count render through the shared engine output so the dashboard and report
	// stay aligned.
	const columns = [
		{ id: 'id', header: 'Assessment', width: 110 },
		{ id: 'patientName', header: 'Patient', flexgrow: 2, sort: true },
		{ id: 'assessedDate', header: 'Assessed', width: 120, sort: true },
		{ id: 'esasTotal', header: 'ESAS-r total', width: 120, sort: true },
		{
			id: 'severityBand',
			header: 'Severity',
			width: 130,
			sort: true,
			template: (v: string) => severityBandLabel(v as SeverityBand)
		},
		{ id: 'ppsScore', header: 'PPS', width: 80, sort: true, template: (v: number | null) => String(v ?? '—') },
		{ id: 'severeSymptomCount', header: 'Severe sx', width: 100, sort: true },
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'esasTotal', order: 'desc' });
		// Open an assessment when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/palliative-assessment/palliative-assessments/${ev.id}`);
		});
	}
</script>

<main class="mx-16 px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">Palliative MDT dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				ESAS-r total, severity band, performance status, and safety flags for assessed patients,
				computed by the shared engine. Select a row to open the assessment.
			</p>
		</div>
		<a href="/palliative-assessment/palliative-assessments/new" class="button" data-variant="primary">New assessment</a>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Severity</span>
			<select class="select inline-block w-auto" bind:value={severityFilter}>
				<option value="">All</option>
				<option value="none">{severityBandLabel('none')}</option>
				<option value="mild">{severityBandLabel('mild')}</option>
				<option value="moderate">{severityBandLabel('moderate')}</option>
				<option value="severe">{severityBandLabel('severe')}</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">PPS band</span>
			<select class="select inline-block w-auto" bind:value={ppsFilter}>
				<option value="">All</option>
				<option value="high">{ppsBandLabel('high')}</option>
				<option value="moderate">{ppsBandLabel('moderate')}</option>
				<option value="low">{ppsBandLabel('low')}</option>
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
