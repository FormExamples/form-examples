<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleAssessmentRows } from '$lib/data/sample-reports';
	import { completenessShortLabel } from '$lib/engine/utils';
	import type { CompletenessLevel } from '$lib/engine/types';

	let completenessFilter = $state('');
	let destinationFilter = $state('');
	let gridApi = $state<any>(null);

	const rows = $derived(
		sampleAssessmentRows.filter(
			(r) =>
				(completenessFilter === '' || r.completenessLevel === completenessFilter) &&
				(destinationFilter === '' || r.destination === destinationFilter)
		)
	);

	const destinations = $derived([...new Set(sampleAssessmentRows.map((r) => r.destination))].sort());

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

	// SVAR DataGrid columns. Completeness, mandatory-missing count, follow-up and
	// flag totals render through the shared engine output so the dashboard and
	// report stay aligned.
	const columns = [
		{ id: 'id', header: 'Discharge', width: 130 },
		{ id: 'patientName', header: 'Patient', flexgrow: 2, sort: true },
		{ id: 'dischargeDate', header: 'Discharged', width: 120, sort: true },
		{
			id: 'completenessLevel',
			header: 'Completeness',
			width: 130,
			sort: true,
			template: (v: CompletenessLevel) => completenessShortLabel(v)
		},
		{ id: 'mandatoryMissing', header: 'Mandatory missing', width: 150, sort: true },
		{ id: 'destination', header: 'Destination', width: 140, sort: true },
		{ id: 'followUp', header: 'Follow-up', width: 130, sort: true },
		{
			id: 'reconciliationFlag',
			header: 'Recon. gap',
			width: 110,
			template: (v: boolean) => (v ? 'Yes' : 'No')
		},
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'patientName', order: 'asc' });
		// Open a discharge summary when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/hospital-discharge/hospital-discharges/${ev.id}`);
		});
	}
</script>

<main class="mx-16 px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">Hospital discharge dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				NICE NG27 completeness, outstanding mandatory fields, follow-up arrangement and safety flags
				for each discharge summary, computed by the shared engine. Select a row to open the summary.
			</p>
		</div>
		<a href="/hospital-discharge/hospital-discharges/new" class="button" data-variant="primary">New discharge summary</a>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Completeness</span>
			<select class="select inline-block w-auto" bind:value={completenessFilter}>
				<option value="">All</option>
				<option value="complete">Complete</option>
				<option value="partial">Partial</option>
				<option value="incomplete">Incomplete</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Destination</span>
			<select class="select inline-block w-auto" bind:value={destinationFilter}>
				<option value="">All</option>
				{#each destinations as dest (dest)}
					<option value={dest}>{dest}</option>
				{/each}
			</select>
		</label>
	</div>

	<div class="overflow-hidden rounded-xl border border-base-300" style="height: 600px;">
		<GridTheme>
			<Grid data={rows} {columns} {init} />
		</GridTheme>
	</div>

	<p class="mt-4 text-sm text-base-content/60">{rows.length} discharge summaries</p>
</main>
