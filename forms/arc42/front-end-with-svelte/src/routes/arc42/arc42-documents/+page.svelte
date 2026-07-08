<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleDocumentRows } from '$lib/data/sample-reports';
	import { maturityLabel, recommendationLabel } from '$lib/grading/utils';
	import type { Maturity } from '$lib/grading/types';

	let maturityFilter = $state('');
	let recommendationFilter = $state('');
	let gridApi = $state<any>(null);

	const rows = $derived(
		sampleDocumentRows.filter(
			(r) =>
				(maturityFilter === '' || r.maturity === maturityFilter) &&
				(recommendationFilter === '' || r.recommendation === recommendationFilter)
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

	// SVAR DataGrid columns. The maturity band, completed-section count, flags,
	// and recommendation render through the shared engine output so the dashboard
	// and report stay aligned.
	const columns = [
		{ id: 'id', header: 'Document', width: 150 },
		{ id: 'name', header: 'Architecture', flexgrow: 2, sort: true },
		{ id: 'owner', header: 'Owner', flexgrow: 1, sort: true },
		{ id: 'updatedDate', header: 'Updated', width: 120, sort: true },
		{
			id: 'maturity',
			header: 'Maturity',
			width: 120,
			sort: true,
			template: (v: Maturity) => maturityLabel(v)
		},
		{
			id: 'sectionsComplete',
			header: 'Complete',
			width: 110,
			sort: true,
			template: (v: number) => `${v}/12`
		},
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true },
		{
			id: 'recommendation',
			header: 'Recommendation',
			width: 150,
			template: (v: string) => recommendationLabel(v)
		}
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'name', order: 'asc' });
		// Open a document when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/arc42/arc42-documents/${ev.id}`);
		});
	}
</script>

<main class="mx-auto max-w-6xl px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">Architecture dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				Maturity band, completed-section count, open flags, and sign-off recommendation for each
				documented architecture, computed by the shared engine. Select a row to open the document.
			</p>
		</div>
		<a href="/arc42/arc42-documents/new" class="button" data-variant="primary">New document</a>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Maturity</span>
			<select class="select inline-block w-auto" bind:value={maturityFilter}>
				<option value="">All</option>
				<option value="draft">Draft</option>
				<option value="reviewable">Reviewable</option>
				<option value="ready">Ready</option>
				<option value="mature">Mature</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Recommendation</span>
			<select class="select inline-block w-auto" bind:value={recommendationFilter}>
				<option value="">All</option>
				<option value="proceed">Proceed</option>
				<option value="revise-first">Revise first</option>
				<option value="block">Block</option>
			</select>
		</label>
	</div>

	<div class="overflow-hidden rounded-xl border border-base-300" style="height: 600px;">
		<GridTheme>
			<Grid data={rows} {columns} {init} />
		</GridTheme>
	</div>

	<p class="mt-4 text-sm text-base-content/60">{rows.length} documents</p>
</main>
