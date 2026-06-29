<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleAssessmentRows } from '$lib/data/sample-reports';
	import { devScreenLabel } from '$lib/engine/utils';

	let resultFilter = $state('');
	let immunizationFilter = $state('');
	let gridApi = $state<any>(null);

	const rows = $derived(
		sampleAssessmentRows.filter(
			(r) =>
				(resultFilter === '' || r.overallResult === resultFilter) &&
				(immunizationFilter === '' ||
					(immunizationFilter === 'yes') === r.immunizationUpToDate)
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

	// SVAR DataGrid columns. The developmental screen result and flag count
	// render through the shared engine output so the dashboard and report stay
	// aligned.
	const columns = [
		{ id: 'id', header: 'Assessment', width: 120 },
		{ id: 'patientName', header: 'Patient', flexgrow: 2, sort: true },
		{ id: 'assessedDate', header: 'Assessed', width: 120, sort: true },
		{
			id: 'overallResult',
			header: 'Screen result',
			width: 190,
			sort: true,
			template: (v: string) => devScreenLabel(v)
		},
		{
			id: 'immunizationUpToDate',
			header: 'Immunised',
			width: 110,
			template: (v: boolean) => (v ? 'Up to date' : 'Not up to date')
		},
		{ id: 'growthFlag', header: 'Growth', width: 90, template: (v: boolean) => (v ? 'Flag' : 'OK') },
		{ id: 'allergyFlag', header: 'Allergy', width: 90, template: (v: boolean) => (v ? 'Yes' : 'No') },
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'patientName', order: 'asc' });
		// Open an assessment when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/pediatric-assessments/${ev.id}`);
		});
	}
</script>

<main class="mx-auto max-w-6xl px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">Paediatric clinician dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				Developmental screen result, immunisation status, and safety flags for screened children,
				computed by the shared engine. Select a row to open the assessment.
			</p>
		</div>
		<a href="/pediatric-assessments/new" class="button" data-variant="primary">New assessment</a>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Screen result</span>
			<select class="select inline-block w-auto" bind:value={resultFilter}>
				<option value="">All</option>
				<option value="normal">Normal Development</option>
				<option value="developmental-concern">Developmental Concern</option>
				<option value="developmental-delay">Developmental Delay</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Immunisation</span>
			<select class="select inline-block w-auto" bind:value={immunizationFilter}>
				<option value="">All</option>
				<option value="yes">Up to date</option>
				<option value="no">Not up to date</option>
			</select>
		</label>
	</div>

	<div class="overflow-hidden rounded-xl border border-base-300" style="height: 600px;">
		<GridTheme>
			<Grid data={rows} {columns} {init} />
		</GridTheme>
	</div>

	<p class="mt-4 text-sm text-base-content/60">{rows.length} children</p>
</main>
