<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/env';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleAssessmentRows } from '#lib/data/sample-reports.js';

	let categoryFilter = $state('');
	let gridApi = $state<any>(null);

	const rows = $derived(
		sampleAssessmentRows.filter((r) => categoryFilter === '' || r.aq10Category === categoryFilter)
	);
	const categories = $derived([...new Set(sampleAssessmentRows.map((r) => r.aq10Category))]);

	let isDark = $state(false);
	function computeDark(): boolean {
		if (!browser) return false;
		const v = getComputedStyle(document.documentElement).getPropertyValue('--color-base-100').trim();
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

	const columns = [
		{ id: 'id', header: 'Assessment', width: 120 },
		{ id: 'patientName', header: 'Patient', flexgrow: 2, sort: true },
		{ id: 'assessedDate', header: 'Assessed', width: 120, sort: true },
		{ id: 'aq10Score', header: 'AQ-10', width: 100, sort: true, template: (v: number) => `${v} / 10` },
		{ id: 'aq10Category', header: 'Category', flexgrow: 1, sort: true },
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'aq10Score', order: 'asc' });
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/autism-assessment/autism-assessments/${ev.id}`);
		});
	}
</script>

<main class="mx-16 px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">Autism screening dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				AQ-10 score and screening category for screened patients, computed by the shared engine.
				Select a row to open the assessment.
			</p>
		</div>
		<a href="/autism-assessment/autism-assessments/new" class="button" data-variant="primary">New assessment</a>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Category</span>
			<select class="select inline-block w-auto" bind:value={categoryFilter}>
				<option value="">All</option>
				{#each categories as c (c)}
					<option value={c}>{c}</option>
				{/each}
			</select>
		</label>
	</div>

	<div
		class="overflow-hidden rounded-xl border border-base-300"
		style="height: 600px;"
	><GridTheme><Grid data={rows} columns={columns} init={init} /></GridTheme></div>

	<p class="mt-4 text-sm text-base-content/60">{rows.length} patients</p>
</main>
