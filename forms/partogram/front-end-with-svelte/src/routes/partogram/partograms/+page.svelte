<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/env';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleAssessmentRows } from '#lib/data/sample-reports.js';
	import { progressLabel, careSettingLabel, parityLabel } from '#lib/engine/utils.js';

	let careSettingFilter = $state('');
	let progressFilter = $state('');
	let gridApi = $state<any>(null);

	const rows = $derived(
		sampleAssessmentRows.filter(
			(r) =>
				(careSettingFilter === '' || r.careSetting === careSettingFilter) &&
				(progressFilter === '' || r.progressClassification === progressFilter)
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

	// SVAR DataGrid columns. Progress classification, latest dilatation, elapsed
	// hours, and flag count render through the shared engine output so the
	// dashboard and report stay aligned.
	const columns = [
		{ id: 'id', header: 'Record', width: 130 },
		{
			id: 'patientIdentifier',
			header: 'Patient ID',
			width: 130,
			sort: true
		},

		{
			id: 'patientName',
			header: 'Patient',
			flexgrow: 2,
			sort: true
		},

		{
			id: 'careSetting',
			header: 'Setting',
			width: 130,
			sort: true,
			template: (v: string) => careSettingLabel(v as never) || '—'
		},
		{
			id: 'parity',
			header: 'Parity',
			width: 120,
			sort: true,
			template: (v: string) => parityLabel(v as never) || '—'
		},
		{
			id: 'progressClassification',
			header: 'Progress',
			width: 160,
			sort: true,
			template: (v: string) => progressLabel(v as never)
		},
		{
			id: 'latestDilatationCm',
			header: 'Dilatation',
			width: 110,
			sort: true,
			template: (v: number | null) => v === null ? '—' : `${v} cm`
		},
		{
			id: 'elapsedHours',
			header: 'Elapsed',
			width: 100,
			sort: true,
			template: (v: number | null) => v === null ? '—' : `${v.toFixed(1)} h`
		},
		{ id: 'observationCount', header: 'Obs', width: 70, sort: true },
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'activePhaseStartAt', order: 'asc' });
		// Open a record when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/partogram/partograms/${ev.id}`);
		});
	}
</script>

<main class="mx-16 px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">Partogram dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				Progress classification, latest dilatation, elapsed hours, and flag count for partograms,
				computed by the shared engine. Select a row to open the record.
			</p>
		</div>
		<a href="/partogram/partograms/new" class="button" data-variant="primary">New partogram</a>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Care setting</span>
			<select class="select inline-block w-auto" bind:value={careSettingFilter}>
				<option value="">All</option>
				<option value="labour-ward">Labour ward</option>
				<option value="birth-centre">Birth centre</option>
				<option value="triage">Triage</option>
				<option value="other">Other</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Progress</span>
			<select class="select inline-block w-auto" bind:value={progressFilter}>
				<option value="">All</option>
				<option value="normal">Normal</option>
				<option value="alertLineCrossed">Alert line crossed</option>
				<option value="actionLineCrossed">Action line crossed</option>
			</select>
		</label>
	</div>

	<div
		class="overflow-hidden rounded-xl border border-base-300"
		style="height: 600px;"
	><GridTheme><Grid data={rows} columns={columns} init={init} /></GridTheme></div>

	<p class="mt-4 text-sm text-base-content/60">{rows.length} partograms</p>
</main>
