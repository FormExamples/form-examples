<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleAssessmentRows } from '$lib/data/sample-reports';

	let categoryFilter = $state('');
	let lossFilter = $state('');
	let gridApi = $state<any>(null);

	const rows = $derived(
		sampleAssessmentRows.filter(
			(r) =>
				(categoryFilter === '' || r.hhiesCategory === categoryFilter) &&
				(lossFilter === '' || r.hearingLossGrade === lossFilter)
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

	// SVAR DataGrid columns. The HHIE-S score, handicap category, worse-ear
	// hearing-loss grade and flag count all render through the shared engine
	// output so the dashboard and report stay aligned.
	const columns = [
		{ id: 'id', header: 'Assessment', width: 120 },
		{ id: 'patientName', header: 'Patient', flexgrow: 2, sort: true },
		{ id: 'assessedDate', header: 'Assessed', width: 120, sort: true },
		{
			id: 'hhiesScore',
			header: 'HHIE-S',
			width: 100,
			sort: true,
			template: (v: number) => `${v}/40`
		},
		{ id: 'hhiesCategory', header: 'Category', flexgrow: 2, sort: true },
		{ id: 'hearingLossGrade', header: 'Hearing loss', width: 130, sort: true },
		{
			id: 'currentAids',
			header: 'Current aids',
			width: 120,
			template: (v: boolean) => (v ? 'Yes' : 'No')
		},
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'patientName', order: 'asc' });
		// Open an assessment when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/hearing-aid-assessment/hearing-aid-assessments/${ev.id}`);
		});
	}
</script>

<main class="mx-16 px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">Hearing aid clinician dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				HHIE-S score and handicap category, worse-ear hearing-loss grade, and audiologist flags for
				assessed patients, computed by the shared engine. Select a row to open the assessment.
			</p>
		</div>
		<a href="/hearing-aid-assessment/hearing-aid-assessments/new" class="button" data-variant="primary">New assessment</a>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">HHIE-S category</span>
			<select class="select inline-block w-auto" bind:value={categoryFilter}>
				<option value="">All</option>
				<option value="No handicap">No handicap</option>
				<option value="Mild to moderate handicap">Mild to moderate handicap</option>
				<option value="Significant handicap">Significant handicap</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Hearing loss</span>
			<select class="select inline-block w-auto" bind:value={lossFilter}>
				<option value="">All</option>
				<option value="Normal">Normal</option>
				<option value="Mild">Mild</option>
				<option value="Moderate">Moderate</option>
				<option value="Severe">Severe</option>
				<option value="Profound">Profound</option>
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
