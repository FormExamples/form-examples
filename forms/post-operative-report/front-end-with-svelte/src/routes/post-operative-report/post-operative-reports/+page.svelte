<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleAssessmentRows } from '$lib/data/sample-reports';
	import { gradeShortLabel, dispositionLabel } from '$lib/engine/utils';
	import type { ClavienDindoGradeKey, DispositionLocation } from '$lib/engine/types';

	let gradeFilter = $state('');
	let dispositionFilter = $state('');
	let gridApi = $state<any>(null);

	const rows = $derived(
		sampleAssessmentRows.filter(
			(r) =>
				(gradeFilter === '' || r.overallGrade === gradeFilter) &&
				(dispositionFilter === '' || r.disposition === dispositionFilter)
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

	// SVAR DataGrid columns. The overall Clavien-Dindo grade, complication count,
	// and flag count render through the shared engine output so the dashboard and
	// report stay aligned.
	const columns = [
		{ id: 'id', header: 'Report', width: 130 },
		{ id: 'patientName', header: 'Patient', flexgrow: 2, sort: true },
		{ id: 'procedureName', header: 'Procedure', flexgrow: 2, sort: true },
		{ id: 'surgeryDate', header: 'Surgery date', width: 130, sort: true },
		{
			id: 'overallGrade',
			header: 'Clavien-Dindo',
			width: 130,
			sort: true,
			template: (v: ClavienDindoGradeKey) => `Grade ${gradeShortLabel(v) || '0'}`
		},
		{ id: 'complicationCount', header: 'Complications', width: 130, sort: true },
		{
			id: 'disposition',
			header: 'Disposition',
			width: 150,
			sort: true,
			template: (v: DispositionLocation) => dispositionLabel(v)
		},
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'patientName', order: 'asc' });
		// Open a report when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/post-operative-report/post-operative-reports/${ev.id}`);
		});
	}
</script>

<main class="mx-auto max-w-6xl px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">Post-operative clinician dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				Overall Clavien-Dindo grade, complication count, and disposition for reported operations,
				computed by the shared engine. Select a row to open the report.
			</p>
		</div>
		<a href="/post-operative-report/post-operative-reports/new" class="button" data-variant="primary">New report</a>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Clavien-Dindo grade</span>
			<select class="select inline-block w-auto" bind:value={gradeFilter}>
				<option value="">All</option>
				<option value="grade-0">Grade 0</option>
				<option value="grade-i">Grade I</option>
				<option value="grade-ii">Grade II</option>
				<option value="grade-iiia">Grade IIIa</option>
				<option value="grade-iiib">Grade IIIb</option>
				<option value="grade-iva">Grade IVa</option>
				<option value="grade-ivb">Grade IVb</option>
				<option value="grade-v">Grade V</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Disposition</span>
			<select class="select inline-block w-auto" bind:value={dispositionFilter}>
				<option value="">All</option>
				<option value="recovery">Recovery / PACU</option>
				<option value="ward">Surgical ward</option>
				<option value="hdu">High dependency unit</option>
				<option value="icu">Intensive care unit</option>
				<option value="theatre">Returned to theatre</option>
				<option value="home">Discharged home</option>
			</select>
		</label>
	</div>

	<div class="overflow-hidden rounded-xl border border-base-300" style="height: 600px;">
		<GridTheme>
			<Grid data={rows} {columns} {init} />
		</GridTheme>
	</div>

	<p class="mt-4 text-sm text-base-content/60">{rows.length} reports</p>
</main>
