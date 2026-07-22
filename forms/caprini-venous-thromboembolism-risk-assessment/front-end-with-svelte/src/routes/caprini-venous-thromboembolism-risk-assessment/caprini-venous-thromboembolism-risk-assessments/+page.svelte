<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleAssessmentRows } from '$lib/data/sample-reports';
	import { riskBandLabel, careSettingLabel, recommendedProphylaxisLabel } from '$lib/engine/utils';

	const plural = 'caprini-venous-thromboembolism-risk-assessments';

	let settingFilter = $state('');
	let bandFilter = $state('');
	let gridApi = $state<any>(null);

	const rows = $derived(
		sampleAssessmentRows.filter(
			(r) =>
				(settingFilter === '' || r.careSetting === settingFilter) &&
				(bandFilter === '' || r.riskBand === bandFilter)
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

	// SVAR DataGrid columns. Caprini score, risk band, and recommended
	// prophylaxis render through the shared engine output so the dashboard and
	// report stay aligned.
	const columns = [
		{ id: 'id', header: 'Assessment', width: 130 },
		{ id: 'patientIdentifier', header: 'Patient ID', width: 120, sort: true },
		{ id: 'patientName', header: 'Patient', flexgrow: 2, sort: true },
		{ id: 'assessedDate', header: 'Assessed', width: 110, sort: true },
		{
			id: 'careSetting',
			header: 'Setting',
			width: 150,
			sort: true,
			template: (v: string) => careSettingLabel(v as never) || '—'
		},
		{ id: 'capriniScore', header: 'Caprini', width: 90, sort: true },
		{
			id: 'riskBand',
			header: 'Risk band',
			width: 170,
			sort: true,
			template: (v: string) => riskBandLabel(v as never)
		},
		{
			id: 'recommendedProphylaxis',
			header: 'Prophylaxis',
			flexgrow: 2,
			template: (v: string) => recommendedProphylaxisLabel(v as never)
		},
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'patientName', order: 'asc' });
		// Open an assessment when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/caprini-venous-thromboembolism-risk-assessment/${plural}/${ev.id}`);
		});
	}
</script>

<main class="mx-16 px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">Caprini VTE clinician dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				Caprini score, risk band, and recommended prophylaxis for assessed patients, computed by the
				shared engine. Select a row to open the assessment.
			</p>
		</div>
		<a href="/caprini-venous-thromboembolism-risk-assessment/{plural}/new" class="button" data-variant="primary">New assessment</a>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Care setting</span>
			<select class="select inline-block w-auto" bind:value={settingFilter}>
				<option value="">All</option>
				<option value="surgical-ward">Surgical ward</option>
				<option value="medical-ward">Medical ward</option>
				<option value="pre-operative-clinic">Pre-operative clinic</option>
				<option value="other">Other</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Risk band</span>
			<select class="select inline-block w-auto" bind:value={bandFilter}>
				<option value="">All</option>
				<option value="very-low">Very low (0-1)</option>
				<option value="low">Low (2)</option>
				<option value="moderate">Moderate (3-4)</option>
				<option value="high">High (5+)</option>
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
