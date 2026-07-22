<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleAssessmentRows } from '$lib/data/sample-reports';
	import {
		completenessStatusLabel,
		sectionClassShort,
		urgencyLabel
	} from '$lib/engine/utils';

	let sectionFilter = $state('');
	let completenessFilter = $state('');
	let gridApi = $state<any>(null);

	const rows = $derived(
		sampleAssessmentRows.filter(
			(r) =>
				(sectionFilter === '' || r.recommendedSectionClass === sectionFilter) &&
				(completenessFilter === '' || r.completenessStatus === completenessFilter)
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

	// SVAR DataGrid columns. Completeness, recommended-section class, and urgency
	// render through the shared engine output so the dashboard and report stay
	// aligned.
	const columns = [
		{ id: 'id', header: 'Assessment', width: 150 },
		{ id: 'personIdentifier', header: 'Person ID', width: 130, sort: true },
		{ id: 'personName', header: 'Person', flexgrow: 2, sort: true },
		{ id: 'amhpName', header: 'AMHP', flexgrow: 1, sort: true },
		{ id: 'assessedDate', header: 'Assessed', width: 120, sort: true },
		{
			id: 'recommendedSectionClass',
			header: 'Section',
			width: 120,
			sort: true,
			template: (v: string) => sectionClassShort(v as never)
		},
		{
			id: 'completenessStatus',
			header: 'Documentation',
			width: 140,
			sort: true,
			template: (v: string) => completenessStatusLabel(v as never)
		},
		{
			id: 'urgencyClass',
			header: 'Urgency',
			width: 120,
			sort: true,
			template: (v: string) => urgencyLabel(v as never)
		},
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'personName', order: 'asc' });
		// Open an assessment when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/mental-health-act-assessment/mental-health-act-assessments/${ev.id}`);
		});
	}
</script>

<main class="mx-16 px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">MHA clinician dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				Documentation completeness, recommended-section class, urgency, and flag counts for assessed
				people, computed by the shared engine. Select a row to open the assessment. This dashboard
				classifies and validates — it makes no automated decision to detain.
			</p>
		</div>
		<a href="/mental-health-act-assessment/mental-health-act-assessments/new" class="button" data-variant="primary"
			>New assessment</a
		>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Section</span>
			<select class="select inline-block w-auto" bind:value={sectionFilter}>
				<option value="">All</option>
				<option value="section-2">Section 2</option>
				<option value="section-3">Section 3</option>
				<option value="section-4">Section 4</option>
				<option value="section-5-2">Section 5(2)</option>
				<option value="section-5-4">Section 5(4)</option>
				<option value="section-136">Section 136</option>
				<option value="none">None</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Documentation</span>
			<select class="select inline-block w-auto" bind:value={completenessFilter}>
				<option value="">All</option>
				<option value="valid">Valid</option>
				<option value="incomplete">Incomplete</option>
			</select>
		</label>
	</div>

	<div class="overflow-hidden rounded-xl border border-base-300" style="height: 600px;">
		<GridTheme>
			<Grid data={rows} {columns} {init} />
		</GridTheme>
	</div>

	<p class="mt-4 text-sm text-base-content/60">{rows.length} people</p>
</main>
