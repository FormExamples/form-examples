<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleAssessmentRows } from '$lib/data/sample-reports';

	let gradeFilter = $state('');
	let oxygenFilter = $state('');
	let gridApi = $state<any>(null);

	const rows = $derived(
		sampleAssessmentRows.filter(
			(r) =>
				(gradeFilter === '' || String(r.mrcGrade) === gradeFilter) &&
				(oxygenFilter === '' || (oxygenFilter === 'yes' ? r.oxygenFlag : !r.oxygenFlag))
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

	// SVAR DataGrid columns. The MRC dyspnoea grade and severity render through
	// the shared engine output so the dashboard and report stay aligned.
	const columns = [
		{ id: 'id', header: 'Assessment', width: 120 },
		{ id: 'patientName', header: 'Patient', flexgrow: 2, sort: true },
		{ id: 'assessedDate', header: 'Assessed', width: 120, sort: true },
		{
			id: 'mrcGrade',
			header: 'MRC grade',
			width: 110,
			sort: true,
			template: (v: number) => `MRC ${v}`
		},
		{ id: 'severity', header: 'Severity', width: 140, sort: true },
		{ id: 'oxygenFlag', header: 'Oxygen', width: 90, template: (v: boolean) => (v ? 'Yes' : 'No') },
		{ id: 'allergyFlag', header: 'Allergy', width: 90, template: (v: boolean) => (v ? 'Yes' : 'No') },
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'patientName', order: 'asc' });
		// Open an assessment when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/respirology-assessment/respirology-assessments/${ev.id}`);
		});
	}
</script>

<main class="mx-16 px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">Respirology clinician dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				MRC dyspnoea grade and severity for assessed patients, computed by the shared engine. Select a
				row to open the assessment.
			</p>
		</div>
		<a href="/respirology-assessment/respirology-assessments/new" class="button" data-variant="primary">New assessment</a>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">MRC grade</span>
			<select class="select inline-block w-auto" bind:value={gradeFilter}>
				<option value="">All</option>
				<option value="1">MRC 1</option>
				<option value="2">MRC 2</option>
				<option value="3">MRC 3</option>
				<option value="4">MRC 4</option>
				<option value="5">MRC 5</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Oxygen therapy</span>
			<select class="select inline-block w-auto" bind:value={oxygenFilter}>
				<option value="">All</option>
				<option value="yes">Yes</option>
				<option value="no">No</option>
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
