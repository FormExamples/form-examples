<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleAssessmentRows } from '$lib/data/sample-reports';
	import { categoryLabel, enpsClassificationLabel } from '$lib/engine/utils';
	import type { SatisfactionCategory, ENpsClassification } from '$lib/engine/types';

	let categoryFilter = $state('');
	let enpsFilter = $state('');
	let gridApi = $state<any>(null);

	const rows = $derived(
		sampleAssessmentRows.filter(
			(r) =>
				(categoryFilter === '' || r.category === categoryFilter) &&
				(enpsFilter === '' || r.enps === enpsFilter)
		)
	);

	// Follow the active Lily theme: pick the dark SVAR skin when the theme's base
	// surface is dark. Recomputed whenever <html data-theme> changes (after the
	// new theme stylesheet has applied its tokens).
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

	// SVAR DataGrid columns. The composite score, satisfaction category and eNPS
	// classification render through the shared engine output so the dashboard and
	// report stay aligned.
	const columns = [
		{ id: 'id', header: 'Survey', width: 130 },
		{ id: 'department', header: 'Department', flexgrow: 2, sort: true },
		{ id: 'tenure', header: 'Tenure', width: 120, sort: true },
		{ id: 'submittedDate', header: 'Submitted', width: 120, sort: true },
		{
			id: 'compositeScore',
			header: 'Score /100',
			width: 110,
			sort: true,
			template: (v: number | null) => (v === null ? '—' : `${v}`)
		},
		{
			id: 'category',
			header: 'Category',
			width: 120,
			sort: true,
			template: (v: SatisfactionCategory) => categoryLabel(v)
		},
		{
			id: 'enps',
			header: 'eNPS',
			width: 110,
			sort: true,
			template: (v: ENpsClassification) => enpsClassificationLabel(v)
		},
		{
			id: 'retentionRisk',
			header: 'Retention risk',
			width: 120,
			template: (v: boolean) => (v ? 'Yes' : 'No')
		},
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'compositeScore', order: 'asc' });
		// Open a survey when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/employee-satisfaction-survey/employee-satisfaction-surveys/${ev.id}`);
		});
	}
</script>

<main class="mx-auto max-w-6xl px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">Employee satisfaction dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				Composite satisfaction score, category and eNPS for submitted surveys, computed by the
				shared engine. Select a row to open the survey.
			</p>
		</div>
		<a href="/employee-satisfaction-survey/employee-satisfaction-surveys/new" class="button" data-variant="primary">New survey</a>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Category</span>
			<select class="select inline-block w-auto" bind:value={categoryFilter}>
				<option value="">All</option>
				<option value="excellent">Excellent</option>
				<option value="good">Good</option>
				<option value="satisfactory">Satisfactory</option>
				<option value="poor">Poor</option>
				<option value="very-poor">Very Poor</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">eNPS</span>
			<select class="select inline-block w-auto" bind:value={enpsFilter}>
				<option value="">All</option>
				<option value="promoter">Promoter</option>
				<option value="passive">Passive</option>
				<option value="detractor">Detractor</option>
			</select>
		</label>
	</div>

	<div class="overflow-hidden rounded-xl border border-base-300" style="height: 600px;">
		<GridTheme>
			<Grid data={rows} {columns} {init} />
		</GridTheme>
	</div>

	<p class="mt-4 text-sm text-base-content/60">{rows.length} surveys</p>
</main>
