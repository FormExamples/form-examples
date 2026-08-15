<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/env';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleAssessmentRows } from '#lib/data/sample-reports.js';
	import { riskBandLabel } from '#lib/engine/utils.js';

	const plural = 'modified-early-warning-scores';

	let bandFilter = $state('');
	let triggerFilter = $state('');
	let gridApi = $state<any>(null);

	const rows = $derived(
		sampleAssessmentRows.filter(
			(r) =>
				(bandFilter === '' || r.riskBand === bandFilter) &&
				(triggerFilter === '' || String(r.singleParameterTrigger) === triggerFilter)
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
		const update = () => isDark = computeDark();
		update();
		const obs = new MutationObserver(() => setTimeout(update, 120));
		obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
		return () => obs.disconnect();
	});
	const GridTheme = $derived(isDark ? WillowDark : Willow);

	// SVAR DataGrid columns. Aggregate MEWS, risk band, single-parameter trigger,
	// and monitoring frequency render through the shared engine output so the
	// dashboard and report stay aligned.
	const columns = [
		{ id: 'id', header: 'Assessment', width: 150 },
		{ id: 'patientIdentifier', header: 'Patient identifier', flexgrow: 2, sort: true },
		{ id: 'wardLocation', header: 'Ward / location', flexgrow: 2, sort: true },
		{ id: 'observedDate', header: 'Observed', width: 120, sort: true },
		{ id: 'mewsScore', header: 'MEWS', width: 90, sort: true },
		{
			id: 'riskBand',
			header: 'Risk band',
			width: 160,
			sort: true,
			template: (v: string) => riskBandLabel(v as never)
		},
		{
			id: 'singleParameterTrigger',
			header: 'Single-param trigger',
			width: 160,
			template: (v: boolean) => v ? 'Yes' : 'No'
		},
		{ id: 'monitoringFrequency', header: 'Monitoring', flexgrow: 2 },
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'patientIdentifier', order: 'asc' });
		// Open an assessment when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/modified-early-warning-score/${plural}/${ev.id}`);
		});
	}
</script>

<main class="mx-16 px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">MEWS clinician dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				Aggregate MEWS, risk band, single-parameter-trigger flag, and recommended monitoring
				frequency for assessed patients, computed by the shared engine. Select a row to open the
				assessment.
			</p>
		</div>
		<a href="/modified-early-warning-score/{plural}/new" class="button" data-variant="primary">New assessment</a>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Risk band</span>
			<select class="select inline-block w-auto" bind:value={bandFilter}>
				<option value="">All</option>
				<option value="low">Low</option>
				<option value="medium">Medium</option>
				<option value="high">High</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Single-parameter trigger</span>
			<select class="select inline-block w-auto" bind:value={triggerFilter}>
				<option value="">All</option>
				<option value="true">Yes</option>
				<option value="false">No</option>
			</select>
		</label>
	</div>

	<div
		class="overflow-hidden rounded-xl border border-base-300"
		style="height: 600px;"
	><GridTheme><Grid data={rows} columns={columns} init={init} /></GridTheme></div>

	<p class="mt-4 text-sm text-base-content/60">{rows.length} patients</p>
</main>
