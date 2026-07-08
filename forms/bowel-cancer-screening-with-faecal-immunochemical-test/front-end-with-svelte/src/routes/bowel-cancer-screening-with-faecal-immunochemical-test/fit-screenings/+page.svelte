<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleAssessmentRows } from '$lib/data/sample-reports';
	import { resultClassLabel, managementActionLabel, formatHb } from '$lib/engine/utils';

	let hubFilter = $state('');
	let resultFilter = $state('');
	let gridApi = $state<any>(null);

	const rows = $derived(
		sampleAssessmentRows.filter(
			(r) =>
				(hubFilter === '' || r.screeningHub === hubFilter) &&
				(resultFilter === '' || r.resultClass === resultFilter)
		)
	);

	const hubs = $derived([...new Set(sampleAssessmentRows.map((r) => r.screeningHub))].sort());

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

	// SVAR DataGrid columns. Result class, management action, and the symptomatic
	// flag render through the shared engine output so the dashboard and report
	// stay aligned.
	const columns = [
		{ id: 'id', header: 'Record', width: 130 },
		{ id: 'participantIdentifier', header: 'Participant ID', width: 140, sort: true },
		{ id: 'participantName', header: 'Participant', flexgrow: 2, sort: true },
		{ id: 'reviewedDate', header: 'Reviewed', width: 120, sort: true },
		{ id: 'screeningHub', header: 'Hub', width: 140, sort: true },
		{
			id: 'faecalHb',
			header: 'Faecal Hb',
			width: 120,
			sort: true,
			template: (v: number | null) => formatHb(v)
		},
		{
			id: 'resultClass',
			header: 'Result',
			width: 190,
			sort: true,
			template: (v: string) => resultClassLabel(v as never)
		},
		{
			id: 'managementAction',
			header: 'Management',
			width: 190,
			sort: true,
			template: (v: string) => managementActionLabel(v as never)
		},
		{
			id: 'symptomaticPathway',
			header: 'Symptomatic',
			width: 120,
			template: (v: boolean) => (v ? 'Yes' : 'No')
		},
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'participantName', order: 'asc' });
		// Open a record when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/bowel-cancer-screening-with-faecal-immunochemical-test/fit-screenings/${ev.id}`);
		});
	}
</script>

<main class="mx-auto max-w-6xl px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">FIT screening dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				Result class and management action for screening episodes, computed by the shared engine.
				Select a row to open the record.
			</p>
		</div>
		<a href="/bowel-cancer-screening-with-faecal-immunochemical-test/fit-screenings/new" class="button" data-variant="primary">New screening</a>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Screening hub</span>
			<select class="select inline-block w-auto" bind:value={hubFilter}>
				<option value="">All</option>
				{#each hubs as hub (hub)}
					<option value={hub}>{hub}</option>
				{/each}
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Result</span>
			<select class="select inline-block w-auto" bind:value={resultFilter}>
				<option value="">All</option>
				<option value="negative">Negative</option>
				<option value="positive">Positive</option>
				<option value="spoilt">Spoilt</option>
			</select>
		</label>
	</div>

	<div class="overflow-hidden rounded-xl border border-base-300" style="height: 600px;">
		<GridTheme>
			<Grid data={rows} {columns} {init} />
		</GridTheme>
	</div>

	<p class="mt-4 text-sm text-base-content/60">{rows.length} screening episodes</p>
</main>
