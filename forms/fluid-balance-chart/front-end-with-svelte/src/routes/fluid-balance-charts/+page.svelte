<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleAssessmentRows } from '$lib/data/sample-reports';
	import { fluidStatusLabel } from '$lib/engine/utils';

	let statusFilter = $state('');
	let wardFilter = $state('');
	let gridApi = $state<any>(null);

	// Distinct wards present in the sample data (for the ward filter dropdown).
	const wards = Array.from(new Set(sampleAssessmentRows.map((r) => r.wardOrUnit))).sort();

	const rows = $derived(
		sampleAssessmentRows.filter(
			(r) =>
				(statusFilter === '' || r.fluidStatus === statusFilter) &&
				(wardFilter === '' || r.wardOrUnit === wardFilter)
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

	// SVAR DataGrid columns. Totals, net balance, urine rate, and fluid status all
	// render through the shared engine output so the dashboard and report stay aligned.
	const columns = [
		{ id: 'id', header: 'Chart', width: 140 },
		{ id: 'patientIdentifier', header: 'Patient ID', width: 130, sort: true },
		{ id: 'patientName', header: 'Patient', flexgrow: 2, sort: true },
		{ id: 'wardOrUnit', header: 'Ward / unit', width: 180, sort: true },
		{ id: 'totalIntakeMl', header: 'Intake (mL)', width: 110, sort: true },
		{ id: 'totalOutputMl', header: 'Output (mL)', width: 110, sort: true },
		{
			id: 'netBalanceMl',
			header: 'Net (mL)',
			width: 100,
			sort: true,
			template: (v: number) => `${v >= 0 ? '+' : ''}${v}`
		},
		{
			id: 'urineOutputRateMlPerKgPerHour',
			header: 'Urine mL/kg/h',
			width: 130,
			sort: true,
			template: (v: number | null) => (v === null ? '—' : v.toFixed(2))
		},
		{
			id: 'fluidStatus',
			header: 'Fluid status',
			width: 130,
			sort: true,
			template: (v: string) => fluidStatusLabel(v as never)
		},
		{ id: 'chartStartAt', header: 'Start', width: 150, sort: true }
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'chartStartAt', order: 'asc' });
		// Open a chart when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/fluid-balance-charts/${ev.id}`);
		});
	}
</script>

<main class="mx-auto max-w-6xl px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">Fluid balance dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				Total intake and output, net balance, urine-output rate, and fluid status for each chart,
				computed by the shared engine. Select a row to open the chart.
			</p>
		</div>
		<a href="/fluid-balance-charts/new" class="button" data-variant="primary">New chart</a>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Fluid status</span>
			<select class="select inline-block w-auto" bind:value={statusFilter}>
				<option value="">All</option>
				<option value="balanced">Balanced</option>
				<option value="positive">Positive</option>
				<option value="negative">Negative</option>
				<option value="oliguria">Oliguria</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Ward / unit</span>
			<select class="select inline-block w-auto" bind:value={wardFilter}>
				<option value="">All</option>
				{#each wards as ward (ward)}
					<option value={ward}>{ward}</option>
				{/each}
			</select>
		</label>
	</div>

	<div class="overflow-hidden rounded-xl border border-base-300" style="height: 600px;">
		<GridTheme>
			<Grid data={rows} {columns} {init} />
		</GridTheme>
	</div>

	<p class="mt-4 text-sm text-base-content/60">{rows.length} charts</p>
</main>
