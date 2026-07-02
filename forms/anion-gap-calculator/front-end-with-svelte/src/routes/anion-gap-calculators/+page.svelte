<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleAssessmentRows } from '$lib/data/sample-reports';
	import { classificationLabel, careSettingLabel, formatGap } from '$lib/engine/utils';

	let settingFilter = $state('');
	let classificationFilter = $state('');
	let gridApi = $state<any>(null);

	const rows = $derived(
		sampleAssessmentRows.filter(
			(r) =>
				(settingFilter === '' || r.careSetting === settingFilter) &&
				(classificationFilter === '' || r.classification === classificationFilter)
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

	// SVAR DataGrid columns. Anion gap, corrected gap, classification, and the
	// urgent flag render through the shared engine output so the dashboard and
	// report stay aligned.
	const columns = [
		{ id: 'id', header: 'Assessment', width: 130 },
		{ id: 'patientIdentifier', header: 'Patient ID', width: 130, sort: true },
		{ id: 'patientName', header: 'Patient', flexgrow: 2, sort: true },
		{ id: 'assessedDate', header: 'Assessed', width: 120, sort: true },
		{
			id: 'careSetting',
			header: 'Setting',
			width: 160,
			sort: true,
			template: (v: string) => careSettingLabel(v as never) || '—'
		},
		{
			id: 'anionGap',
			header: 'Anion gap',
			width: 120,
			sort: true,
			template: (v: number | null) => formatGap(v)
		},
		{
			id: 'correctedAnionGap',
			header: 'Corrected',
			width: 120,
			sort: true,
			template: (v: number | null) => formatGap(v)
		},
		{
			id: 'classification',
			header: 'Classification',
			width: 170,
			sort: true,
			template: (v: string) => classificationLabel(v as never)
		},
		{
			id: 'urgentFlag',
			header: 'Urgent',
			width: 100,
			template: (v: boolean) => (v ? 'Yes' : 'No')
		},
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'patientName', order: 'asc' });
		// Open an assessment when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/anion-gap-calculators/${ev.id}`);
		});
	}
</script>

<main class="mx-auto max-w-6xl px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">Anion gap dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				Anion gap and classification for assessed patients, computed by the shared engine. Select a
				row to open the assessment.
			</p>
		</div>
		<a href="/anion-gap-calculators/new" class="button" data-variant="primary">New calculation</a>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Care setting</span>
			<select class="select inline-block w-auto" bind:value={settingFilter}>
				<option value="">All</option>
				<option value="emergency-department">Emergency department</option>
				<option value="ward">Ward</option>
				<option value="intensive-care">Intensive care</option>
				<option value="laboratory">Laboratory</option>
				<option value="other">Other</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Classification</span>
			<select class="select inline-block w-auto" bind:value={classificationFilter}>
				<option value="">All</option>
				<option value="low">Low</option>
				<option value="normal">Normal</option>
				<option value="high">High</option>
				<option value="very-high">Very high</option>
				<option value="unknown">Unknown</option>
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
