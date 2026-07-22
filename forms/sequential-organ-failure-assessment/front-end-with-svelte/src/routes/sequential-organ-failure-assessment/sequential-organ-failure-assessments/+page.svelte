<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleAssessmentRows } from '$lib/data/sample-reports';
	import { mortalityBandLabel, careLocationLabel } from '$lib/engine/utils';

	let locationFilter = $state('');
	let bandFilter = $state('');
	let gridApi = $state<any>(null);

	const rows = $derived(
		sampleAssessmentRows.filter(
			(r) =>
				(locationFilter === '' || r.careLocation === locationFilter) &&
				(bandFilter === '' || r.mortalityBand === bandFilter)
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

	// SVAR DataGrid columns. Total SOFA, delta-SOFA, mortality band, and Sepsis-3
	// render through the shared engine output so the dashboard and report stay
	// aligned.
	const columns = [
		{ id: 'id', header: 'Assessment', width: 120 },
		{ id: 'patientIdentifier', header: 'Patient ID', width: 130, sort: true },
		{ id: 'patientName', header: 'Patient', flexgrow: 2, sort: true },
		{ id: 'assessedDate', header: 'Assessed', width: 120, sort: true },
		{
			id: 'careLocation',
			header: 'Location',
			width: 160,
			sort: true,
			template: (v: string) => careLocationLabel(v as never) || '—'
		},
		{ id: 'totalSofa', header: 'Total SOFA', width: 110, sort: true },
		{
			id: 'deltaSofa',
			header: 'Delta',
			width: 90,
			sort: true,
			template: (v: number | null) => (v === null ? '—' : `${v >= 0 ? '+' : ''}${v}`)
		},
		{
			id: 'mortalityBand',
			header: 'Mortality band',
			width: 170,
			sort: true,
			template: (v: string) => mortalityBandLabel(v as never)
		},
		{
			id: 'sepsis3',
			header: 'Sepsis-3',
			width: 100,
			template: (v: boolean) => (v ? 'Yes' : 'No')
		},
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'totalSofa', order: 'desc' });
		// Open an assessment when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/sequential-organ-failure-assessment/sequential-organ-failure-assessments/${ev.id}`);
		});
	}
</script>

<main class="mx-16 px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">SOFA clinician dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				Total SOFA, delta-SOFA, mortality band, and Sepsis-3 status for assessed patients, computed
				by the shared engine. Select a row to open the assessment.
			</p>
		</div>
		<a href="/sequential-organ-failure-assessment/sequential-organ-failure-assessments/new" class="button" data-variant="primary"
			>New assessment</a
		>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Care location</span>
			<select class="select inline-block w-auto" bind:value={locationFilter}>
				<option value="">All</option>
				<option value="icu">Intensive care unit</option>
				<option value="hdu">High-dependency unit</option>
				<option value="critical-care-outreach">Critical-care outreach</option>
				<option value="acute-medical-unit">Acute medical unit</option>
				<option value="emergency-department">Emergency department</option>
				<option value="other">Other</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Mortality band</span>
			<select class="select inline-block w-auto" bind:value={bandFilter}>
				<option value="">All</option>
				<option value="low">Low</option>
				<option value="moderate">Moderate</option>
				<option value="high">High</option>
				<option value="veryHigh">Very high</option>
				<option value="extreme">Extreme</option>
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
