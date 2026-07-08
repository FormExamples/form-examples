<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleAssessmentRows } from '$lib/data/sample-reports';
	import { riskBandLabel } from '$lib/engine/utils';

	const plural = 'national-early-warning-score-2s';

	let bandFilter = $state('');
	let redFilter = $state('');
	let gridApi = $state<any>(null);

	const rows = $derived(
		sampleAssessmentRows.filter(
			(r) =>
				(bandFilter === '' || r.riskBand === bandFilter) &&
				(redFilter === '' || String(r.redScore) === redFilter)
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

	// SVAR DataGrid columns. Aggregate, risk band, red score, and monitoring
	// frequency render through the shared engine output so the dashboard and
	// report stay aligned.
	const columns = [
		{ id: 'id', header: 'Assessment', width: 150 },
		{ id: 'patientName', header: 'Patient', flexgrow: 2, sort: true },
		{ id: 'wardOrLocation', header: 'Ward / location', flexgrow: 2, sort: true },
		{ id: 'observedDate', header: 'Observed', width: 120, sort: true },
		{ id: 'aggregate', header: 'NEWS2', width: 90, sort: true },
		{
			id: 'riskBand',
			header: 'Risk band',
			width: 150,
			sort: true,
			template: (v: string) => riskBandLabel(v as never)
		},
		{
			id: 'redScore',
			header: 'Red score',
			width: 110,
			template: (v: boolean) => (v ? 'Yes' : 'No')
		},
		{ id: 'monitoringFrequency', header: 'Monitoring', flexgrow: 2 },
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'patientName', order: 'asc' });
		// Open an assessment when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/national-early-warning-score-2/${plural}/${ev.id}`);
		});
	}
</script>

<main class="mx-auto max-w-6xl px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">NEWS2 clinician dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				Aggregate NEWS2 total, risk band, red-score flag, and recommended monitoring frequency for
				assessed patients, computed by the shared engine. Select a row to open the assessment.
			</p>
		</div>
		<a href="/national-early-warning-score-2/{plural}/new" class="button" data-variant="primary">New assessment</a>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Risk band</span>
			<select class="select inline-block w-auto" bind:value={bandFilter}>
				<option value="">All</option>
				<option value="low">Low</option>
				<option value="low-medium">Low-medium</option>
				<option value="medium">Medium</option>
				<option value="high">High</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Red score</span>
			<select class="select inline-block w-auto" bind:value={redFilter}>
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

	<p class="mt-4 text-sm text-base-content/60">{rows.length} patients</p>
</main>
