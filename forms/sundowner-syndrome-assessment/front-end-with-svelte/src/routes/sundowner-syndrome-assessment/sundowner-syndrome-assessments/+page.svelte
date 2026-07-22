<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleAssessmentRows } from '$lib/data/sample-reports';
	import { severityLabel } from '$lib/engine/utils';
	import type { Severity } from '$lib/engine/types';

	let severityFilter = $state('');
	let cmaiBandFilter = $state('');
	let gridApi = $state<any>(null);

	// CMAI severity bands, matching the engine thresholds.
	function cmaiBand(score: number): string {
		if (score > 120) return 'critical';
		if (score >= 76) return 'severe';
		if (score >= 46) return 'moderate';
		return 'mild';
	}

	const rows = $derived(
		sampleAssessmentRows.filter(
			(r) =>
				(severityFilter === '' || r.severity === severityFilter) &&
				(cmaiBandFilter === '' || cmaiBand(r.cmaiScore) === cmaiBandFilter)
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

	// SVAR DataGrid columns. CMAI / NPI totals, severity band, and flag counts
	// render through the shared engine output so the dashboard and report stay
	// aligned.
	const columns = [
		{ id: 'id', header: 'Assessment', width: 120 },
		{ id: 'patientName', header: 'Patient', flexgrow: 2, sort: true },
		{ id: 'assessedDate', header: 'Assessed', width: 120, sort: true },
		{
			id: 'severity',
			header: 'Severity',
			width: 120,
			sort: true,
			template: (v: string) => severityLabel(v as Severity)
		},
		{ id: 'cmaiScore', header: 'CMAI (/203)', width: 120, sort: true },
		{ id: 'npiScore', header: 'NPI (/144)', width: 110, sort: true },
		{ id: 'highPriorityFlags', header: 'High flags', width: 100, sort: true },
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'patientName', order: 'asc' });
		// Open an assessment when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/sundowner-syndrome-assessment/sundowner-syndrome-assessments/${ev.id}`);
		});
	}
</script>

<main class="mx-16 px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">Sundowner clinician dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				CMAI / NPI totals and severity band for assessed patients, computed by the shared engine.
				Select a row to open the assessment.
			</p>
		</div>
		<a href="/sundowner-syndrome-assessment/sundowner-syndrome-assessments/new" class="button" data-variant="primary">New assessment</a>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Severity</span>
			<select class="select inline-block w-auto" bind:value={severityFilter}>
				<option value="">All</option>
				<option value="mild">Mild</option>
				<option value="moderate">Moderate</option>
				<option value="severe">Severe</option>
				<option value="critical">Critical</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">CMAI band</span>
			<select class="select inline-block w-auto" bind:value={cmaiBandFilter}>
				<option value="">All</option>
				<option value="mild">Mild (29-45)</option>
				<option value="moderate">Moderate (46-75)</option>
				<option value="severe">Severe (76-120)</option>
				<option value="critical">Critical (&gt;120)</option>
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
