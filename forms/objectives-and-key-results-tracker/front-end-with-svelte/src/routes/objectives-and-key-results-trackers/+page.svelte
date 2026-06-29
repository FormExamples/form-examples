<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleObjectiveRows } from '$lib/data/sample-reports';
	import { ragLabel } from '$engine/utils';
	import type { RagBand } from '$engine/types';

	let levelFilter = $state('');
	let ragFilter = $state('');
	let gridApi = $state<any>(null);

	const rows = $derived(
		sampleObjectiveRows.filter(
			(r) =>
				(levelFilter === '' || r.level === levelFilter) && (ragFilter === '' || r.rag === ragFilter)
		)
	);

	// Follow the active Lily theme: pick the dark SVAR skin when the theme's base
	// surface is dark. Recomputed whenever <html data-theme> changes (after the new
	// theme stylesheet has applied its tokens).
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

	// SVAR DataGrid columns. The composite RAG band renders through the shared
	// engine output so the dashboard and report stay aligned.
	const columns = [
		{ id: 'id', header: 'Objective', width: 130 },
		{ id: 'objectiveTitle', header: 'Title', flexgrow: 2, sort: true },
		{ id: 'owner', header: 'Owner', width: 140, sort: true },
		{ id: 'level', header: 'Level', width: 120, sort: true },
		{ id: 'updatedDate', header: 'Updated', width: 120, sort: true },
		{
			id: 'rag',
			header: 'RAG',
			width: 120,
			sort: true,
			template: (v: RagBand) => ragLabel(v)
		},
		{
			id: 'progressPercent',
			header: 'Progress',
			width: 100,
			sort: true,
			template: (v: number | null) => (v == null ? '—' : `${v}%`)
		},
		{
			id: 'confidenceDecile',
			header: 'Confidence',
			width: 110,
			sort: true,
			template: (v: number | null) => (v == null ? '—' : `${v}/10`)
		},
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'objectiveTitle', order: 'asc' });
		// Open an objective when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/objectives-and-key-results-trackers/${ev.id}`);
		});
	}
</script>

<main class="mx-auto max-w-6xl px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">OKR review dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				Composite RAG band, progress, and confidence for tracked objectives, computed by the shared
				engine. Select a row to open the objective.
			</p>
		</div>
		<a href="/objectives-and-key-results-trackers/new" class="button" data-variant="primary">New objective</a>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Level</span>
			<select class="select inline-block w-auto" bind:value={levelFilter}>
				<option value="">All</option>
				<option value="individual">Individual</option>
				<option value="team">Team</option>
				<option value="department">Department</option>
				<option value="company">Company</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">RAG</span>
			<select class="select inline-block w-auto" bind:value={ragFilter}>
				<option value="">All</option>
				<option value="green">On track</option>
				<option value="amber">At risk</option>
				<option value="red">Off track</option>
			</select>
		</label>
	</div>

	<div class="overflow-hidden rounded-xl border border-base-300" style="height: 600px;">
		<GridTheme>
			<Grid data={rows} {columns} {init} />
		</GridTheme>
	</div>

	<p class="mt-4 text-sm text-base-content/60">{rows.length} objectives</p>
</main>
