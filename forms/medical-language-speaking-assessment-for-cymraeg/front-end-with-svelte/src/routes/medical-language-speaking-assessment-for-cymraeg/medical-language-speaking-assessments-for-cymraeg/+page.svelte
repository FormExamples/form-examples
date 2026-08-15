<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/env';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleAssessmentRows } from '#lib/data/sample-reports.js';
	import { gradeShortLabel } from '#lib/engine/utils.js';
	import type { OETGrade } from '#lib/engine/types.js';

	const plural = 'medical-language-speaking-assessments-for-cymraeg';

	let gradeFilter = $state('');
	let thresholdFilter = $state('');
	let gridApi = $state<unknown>(null);

	const rows = $derived(
		sampleAssessmentRows.filter(
			(r) =>
				(gradeFilter === '' || r.grade === gradeFilter) &&
				(thresholdFilter === '' || String(r.thresholdMet) === thresholdFilter)
		)
	);

	// Follow the active Lily theme: pick the dark SVAR skin when the theme's base
	// surface is dark. Recomputed whenever <html data-theme> changes.
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

	// SVAR DataGrid columns. Grade, scaled score, and totals render through the
	// shared engine output so the dashboard and report stay aligned.
	const columns = [
		{ id: 'id', header: 'Assessment', width: 130 },
		{
			id: 'candidateName',
			header: 'Candidate',
			flexgrow: 2,
			sort: true
		},

		{
			id: 'assessedDate',
			header: 'Assessed',
			width: 120,
			sort: true
		},

		{
			id: 'grade',
			header: 'Grade',
			width: 130,
			sort: true,
			template: (v: OETGrade) => gradeShortLabel(v)
		},

		{
			id: 'scaledScore',
			header: 'Score /500',
			width: 110,
			sort: true
		},

		{
			id: 'linguisticTotal',
			header: 'Ling /24',
			width: 100,
			sort: true
		},

		{
			id: 'clinicalTotal',
			header: 'Clin /15',
			width: 100,
			sort: true
		},

		{
			id: 'thresholdMet',
			header: 'Clinical threshold',
			width: 150,
			template: (v: boolean) => v ? 'Met' : 'Below'
		},
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	function init(api: {
		exec: (name: string, args: unknown) => void;
		on: (name: string, cb: (ev: { id?: string | number }) => void) => void;
	}) {
		gridApi = api;
		api.exec('sort-rows', { key: 'candidateName', order: 'asc' });
		api.on('select-row', (ev) => {
			if (ev?.id != null) goto(`/medical-language-speaking-assessment-for-cymraeg/${plural}/${ev.id}`);
		});
	}
</script>

<main class="mx-16 px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">Cymraeg clinical-speaking dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				CEFR-mapped grade, scaled score, and linguistic / clinical totals for assessed candidates,
				computed by the shared engine. Select a row to open the assessment.
			</p>
		</div>
		<a href={`/${plural}/new`} class="button" data-variant="primary">New assessment</a>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Grade</span>
			<select class="select inline-block w-auto" bind:value={gradeFilter}>
				<option value="">All</option>
				<option value="A">A (CEFR C2)</option>
				<option value="B">B (CEFR C1)</option>
				<option value="C+">C+ (CEFR B2+)</option>
				<option value="C">C (CEFR B2)</option>
				<option value="D">D (CEFR B1)</option>
				<option value="E">E (CEFR A2-)</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Clinical threshold</span>
			<select class="select inline-block w-auto" bind:value={thresholdFilter}>
				<option value="">All</option>
				<option value="true">Met</option>
				<option value="false">Below</option>
			</select>
		</label>
	</div>

	<div
		class="overflow-hidden rounded-xl border border-base-300"
		style="height: 600px;"
	><GridTheme><Grid data={rows} columns={columns} init={init} /></GridTheme></div>

	<p class="mt-4 text-sm text-base-content/60">{rows.length} candidates</p>
</main>
