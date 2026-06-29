<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleAssessmentRows } from '$lib/data/sample-reports';
	import { cancerTypeLabel, stageLabel, responseAssessmentLabel } from '$lib/engine/utils';

	let ecogFilter = $state('');
	let cancerTypeFilter = $state('');
	let gridApi = $state<any>(null);

	const rows = $derived(
		sampleAssessmentRows.filter(
			(r) =>
				(ecogFilter === '' || String(r.ecogGrade) === ecogFilter) &&
				(cancerTypeFilter === '' || r.cancerType === cancerTypeFilter)
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

	// SVAR DataGrid columns. The ECOG performance status, stage and treatment
	// response render through the shared engine output so the dashboard and
	// report stay aligned.
	const columns = [
		{ id: 'id', header: 'Assessment', width: 130 },
		{ id: 'patientName', header: 'Patient', flexgrow: 2, sort: true },
		{ id: 'assessedDate', header: 'Assessed', width: 120, sort: true },
		{
			id: 'ecogGrade',
			header: 'ECOG',
			width: 90,
			sort: true,
			template: (v: number) => `ECOG ${v}`
		},
		{
			id: 'cancerType',
			header: 'Cancer type',
			width: 140,
			sort: true,
			template: (v: string) => cancerTypeLabel(v)
		},
		{
			id: 'overallStage',
			header: 'Stage',
			width: 110,
			sort: true,
			template: (v: string) => stageLabel(v)
		},
		{
			id: 'responseAssessment',
			header: 'Response',
			width: 150,
			sort: true,
			template: (v: string) => responseAssessmentLabel(v)
		},
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'patientName', order: 'asc' });
		// Open an assessment when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/oncology-assessments/${ev.id}`);
		});
	}
</script>

<main class="mx-auto max-w-6xl px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">Oncology clinician dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				ECOG performance status, cancer type, stage and treatment response for assessed patients,
				computed by the shared engine. Select a row to open the assessment.
			</p>
		</div>
		<a href="/oncology-assessments/new" class="button" data-variant="primary">New assessment</a>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">ECOG grade</span>
			<select class="select inline-block w-auto" bind:value={ecogFilter}>
				<option value="">All</option>
				<option value="0">ECOG 0</option>
				<option value="1">ECOG 1</option>
				<option value="2">ECOG 2</option>
				<option value="3">ECOG 3</option>
				<option value="4">ECOG 4</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Cancer type</span>
			<select class="select inline-block w-auto" bind:value={cancerTypeFilter}>
				<option value="">All</option>
				<option value="breast">Breast</option>
				<option value="lung">Lung</option>
				<option value="colorectal">Colorectal</option>
				<option value="pancreatic">Pancreatic</option>
				<option value="brain">Brain</option>
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
