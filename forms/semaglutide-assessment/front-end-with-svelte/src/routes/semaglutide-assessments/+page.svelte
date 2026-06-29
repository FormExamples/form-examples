<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleAssessmentRows } from '$lib/data/sample-reports';
	import { eligibilityLabel } from '$lib/engine/utils';

	let eligibilityFilter = $state('');
	let indicationFilter = $state('');
	let gridApi = $state<any>(null);

	const rows = $derived(
		sampleAssessmentRows.filter(
			(r) =>
				(eligibilityFilter === '' || r.eligibilityStatus === eligibilityFilter) &&
				(indicationFilter === '' || r.primaryIndication === indicationFilter)
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

	const indicationLabels: Record<string, string> = {
		'type2-diabetes': 'Type 2 diabetes',
		'weight-management': 'Weight management',
		'cardiovascular-risk-reduction': 'CV risk reduction'
	};

	// SVAR DataGrid columns. Eligibility status, BMI / category, indication and
	// contraindication / flag counts render through the shared engine output so
	// the dashboard and report stay aligned.
	const columns = [
		{ id: 'id', header: 'Assessment', width: 120 },
		{ id: 'patientName', header: 'Patient', flexgrow: 2, sort: true },
		{ id: 'assessedDate', header: 'Assessed', width: 120, sort: true },
		{
			id: 'eligibilityStatus',
			header: 'Eligibility',
			width: 240,
			sort: true,
			template: (v: string) => eligibilityLabel(v)
		},
		{
			id: 'bmi',
			header: 'BMI',
			width: 80,
			sort: true,
			template: (v: number | null) => (v != null ? v.toFixed(1) : '—')
		},
		{ id: 'bmiCategory', header: 'BMI category', width: 150, sort: true },
		{
			id: 'primaryIndication',
			header: 'Indication',
			width: 160,
			sort: true,
			template: (v: string) => indicationLabels[v] ?? v ?? '—'
		},
		{ id: 'absoluteCount', header: 'Absolute', width: 95, sort: true },
		{ id: 'relativeCount', header: 'Relative', width: 90, sort: true },
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'patientName', order: 'asc' });
		// Open an assessment when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/semaglutide-assessments/${ev.id}`);
		});
	}
</script>

<main class="mx-auto max-w-6xl px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">Semaglutide clinician dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				Eligibility status, BMI category, indication, and contraindication / flag counts for assessed
				patients, computed by the shared engine. Select a row to open the assessment.
			</p>
		</div>
		<a href="/semaglutide-assessments/new" class="button" data-variant="primary">New assessment</a>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Eligibility</span>
			<select class="select inline-block w-auto" bind:value={eligibilityFilter}>
				<option value="">All</option>
				<option value="Eligible">Eligible</option>
				<option value="Conditional">Conditional</option>
				<option value="Ineligible">Ineligible</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Indication</span>
			<select class="select inline-block w-auto" bind:value={indicationFilter}>
				<option value="">All</option>
				<option value="type2-diabetes">Type 2 diabetes</option>
				<option value="weight-management">Weight management</option>
				<option value="cardiovascular-risk-reduction">CV risk reduction</option>
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
