<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleAssessmentRows } from '$lib/data/sample-reports';
	import { completenessLevelLabel } from '$lib/engine/utils';

	let levelFilter = $state('');
	let witnessFilter = $state('');
	let gridApi = $state<any>(null);

	const rows = $derived(
		sampleAssessmentRows.filter(
			(r) =>
				(levelFilter === '' || r.completenessLevel === levelFilter) &&
				(witnessFilter === '' || String(r.witnessed) === witnessFilter)
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

	// SVAR DataGrid columns. The completeness level, section counts, and flags
	// render through the shared engine output so the dashboard and report stay
	// aligned.
	const columns = [
		{ id: 'id', header: 'Statement', width: 130 },
		{ id: 'patientName', header: 'Patient', flexgrow: 2, sort: true },
		{ id: 'nhsNumber', header: 'NHS number', width: 130 },
		{ id: 'assessedDate', header: 'Assessed', width: 120, sort: true },
		{
			id: 'completenessLevel',
			header: 'Completeness',
			width: 130,
			sort: true,
			template: (v: string) => completenessLevelLabel(v)
		},
		{
			id: 'completedCount',
			header: 'Sections',
			width: 110,
			template: (v: number, row: any) => `${v} / ${row.totalCount}`
		},
		{
			id: 'witnessed',
			header: 'Witnessed',
			width: 110,
			sort: true,
			template: (v: boolean) => (v ? 'Yes' : 'No')
		},
		{ id: 'reviewDate', header: 'Review date', width: 130, template: (v: string) => v || '—' },
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'patientName', order: 'asc' });
		// Open a statement when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/advance-statements-about-care/${ev.id}`);
		});
	}
</script>

<main class="mx-auto max-w-6xl px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">Advance statement clinician dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				Completeness level, section counts, and validity flags for recorded statements, computed by
				the shared engine. Select a row to open the statement.
			</p>
		</div>
		<a href="/advance-statements-about-care/new" class="button" data-variant="primary">New statement</a>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Completeness</span>
			<select class="select inline-block w-auto" bind:value={levelFilter}>
				<option value="">All</option>
				<option value="incomplete">Incomplete</option>
				<option value="partial">Partial</option>
				<option value="complete">Complete</option>
				<option value="verified">Verified</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Witnessed</span>
			<select class="select inline-block w-auto" bind:value={witnessFilter}>
				<option value="">All</option>
				<option value="true">Yes</option>
				<option value="false">No</option>
			</select>
		</label>
	</div>

	<div class="overflow-hidden rounded-xl border border-base-300" style="height: 600px;">
		<GridTheme>
			<Grid data={rows} {columns} {init} />
		</GridTheme>
	</div>

	<p class="mt-4 text-sm text-base-content/60">{rows.length} statements</p>
</main>
