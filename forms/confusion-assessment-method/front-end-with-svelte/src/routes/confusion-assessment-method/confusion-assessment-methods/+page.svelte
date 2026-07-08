<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleAssessmentRows } from '$lib/data/sample-reports';
	import { classificationLabel, camVariantLabel, motoricSubtypeLabel } from '$lib/engine/utils';

	let variantFilter = $state('');
	let classificationFilter = $state('');
	let gridApi = $state<any>(null);

	const rows = $derived(
		sampleAssessmentRows.filter(
			(r) =>
				(variantFilter === '' || r.camVariant === variantFilter) &&
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

	// SVAR DataGrid columns. Classification, positive-feature count, and the
	// delirium flag render through the shared engine output so the dashboard and
	// report stay aligned.
	const columns = [
		{ id: 'id', header: 'Assessment', width: 130 },
		{ id: 'patientIdentifier', header: 'Patient ID', width: 130, sort: true },
		{ id: 'patientName', header: 'Patient', flexgrow: 2, sort: true },
		{ id: 'wardUnit', header: 'Ward / unit', flexgrow: 2, sort: true },
		{ id: 'assessedDate', header: 'Assessed', width: 120, sort: true },
		{
			id: 'camVariant',
			header: 'Variant',
			width: 130,
			sort: true,
			template: (v: string) => camVariantLabel(v as never) || '—'
		},
		{
			id: 'classification',
			header: 'Classification',
			width: 160,
			sort: true,
			template: (v: string) => classificationLabel(v as never)
		},
		{
			id: 'motoricSubtype',
			header: 'Subtype',
			width: 120,
			sort: true,
			template: (v: string) => motoricSubtypeLabel(v as never) || '—'
		},
		{
			id: 'deliriumFlag',
			header: 'Delirium',
			width: 100,
			template: (v: boolean) => (v ? 'Yes' : 'No')
		},
		{ id: 'positiveCount', header: 'Positive', width: 90, sort: true },
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'patientName', order: 'asc' });
		// Open an assessment when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/confusion-assessment-method/confusion-assessment-methods/${ev.id}`);
		});
	}
</script>

<main class="mx-auto max-w-6xl px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">CAM clinician dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				Delirium classification, positive features, and safety flags for assessed patients, computed
				by the shared engine. Select a row to open the assessment.
			</p>
		</div>
		<a href="/confusion-assessment-method/confusion-assessment-methods/new" class="button" data-variant="primary"
			>New assessment</a
		>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Variant</span>
			<select class="select inline-block w-auto" bind:value={variantFilter}>
				<option value="">All</option>
				<option value="cam">CAM (standard bedside)</option>
				<option value="cam-icu">CAM-ICU (ventilated / non-verbal)</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Classification</span>
			<select class="select inline-block w-auto" bind:value={classificationFilter}>
				<option value="">All</option>
				<option value="present">Delirium present</option>
				<option value="absent">Delirium absent</option>
				<option value="unable-to-assess">Unable to assess</option>
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
