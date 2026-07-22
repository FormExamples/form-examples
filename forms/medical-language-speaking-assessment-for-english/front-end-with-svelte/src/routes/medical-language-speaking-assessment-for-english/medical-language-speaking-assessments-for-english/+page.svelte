<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleAssessmentRows } from '$lib/data/sample-reports';
	import { gradeShort, outcomeLabel } from '$lib/engine/utils';

	let gradeFilter = $state('');
	let outcomeFilter = $state('');
	let gridApi = $state<any>(null);

	const rows = $derived(
		sampleAssessmentRows.filter(
			(r) =>
				(gradeFilter === '' || r.grade === gradeFilter) &&
				(outcomeFilter === '' || r.outcome === outcomeFilter)
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

	// SVAR DataGrid columns. The OET grade, 0-500 score and pass/refer outcome
	// render through the shared engine output so the dashboard and report stay
	// aligned.
	const columns = [
		{ id: 'id', header: 'Assessment', width: 120 },
		{ id: 'candidateName', header: 'Candidate', flexgrow: 2, sort: true },
		{ id: 'testDate', header: 'Tested', width: 120, sort: true },
		{ id: 'profession', header: 'Profession', width: 130, sort: true },
		{
			id: 'grade',
			header: 'OET grade',
			width: 110,
			sort: true,
			template: (v: string) => gradeShort(v as never)
		},
		{ id: 'score', header: 'Score / 500', width: 110, sort: true },
		{
			id: 'outcome',
			header: 'Outcome',
			width: 140,
			sort: true,
			template: (v: string) => outcomeLabel(v as never)
		},
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'candidateName', order: 'asc' });
		// Open an assessment when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/medical-language-speaking-assessment-for-english/medical-language-speaking-assessments-for-english/${ev.id}`);
		});
	}
</script>

<main class="mx-16 px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">Speaking assessment dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				OET Medicine speaking sub-test results — letter grade, 0-500 score and registration outcome
				for assessed candidates, computed by the shared engine. Select a row to open the assessment.
			</p>
		</div>
		<a href="/medical-language-speaking-assessment-for-english/medical-language-speaking-assessments-for-english/new" class="button" data-variant="primary">New assessment</a>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">OET grade</span>
			<select class="select inline-block w-auto" bind:value={gradeFilter}>
				<option value="">All</option>
				<option value="A">Grade A</option>
				<option value="B">Grade B</option>
				<option value="C+">Grade C+</option>
				<option value="C">Grade C</option>
				<option value="D">Grade D</option>
				<option value="E">Grade E</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Outcome</span>
			<select class="select inline-block w-auto" bind:value={outcomeFilter}>
				<option value="">All</option>
				<option value="pass">Pass</option>
				<option value="refer">Below threshold</option>
			</select>
		</label>
	</div>

	<div class="overflow-hidden rounded-xl border border-base-300" style="height: 600px;">
		<GridTheme>
			<Grid data={rows} {columns} {init} />
		</GridTheme>
	</div>

	<p class="mt-4 text-sm text-base-content/60">{rows.length} candidates</p>
</main>
