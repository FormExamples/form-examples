<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleAssessmentRows } from '$lib/data/sample-reports';
	import { eligibilityLabel, riskLevelLabel, donorTypeLabel } from '$lib/engine/utils';

	let eligibilityFilter = $state('');
	let riskFilter = $state('');
	let gridApi = $state<any>(null);

	const rows = $derived(
		sampleAssessmentRows.filter(
			(r) =>
				(eligibilityFilter === '' || r.eligibility === eligibilityFilter) &&
				(riskFilter === '' || r.riskLevel === riskFilter)
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

	// SVAR DataGrid columns. Eligibility and overall risk render through the
	// shared engine output so the dashboard and report stay aligned.
	const columns = [
		{ id: 'id', header: 'Assessment', width: 120 },
		{ id: 'donorName', header: 'Donor', flexgrow: 2, sort: true },
		{ id: 'assessedDate', header: 'Assessed', width: 120, sort: true },
		{
			id: 'donorType',
			header: 'Donor type',
			width: 120,
			sort: true,
			template: (v: string) => donorTypeLabel(v as never)
		},
		{
			id: 'eligibility',
			header: 'Eligibility',
			width: 170,
			sort: true,
			template: (v: string) => eligibilityLabel(v as never)
		},
		{
			id: 'riskLevel',
			header: 'Overall risk',
			width: 130,
			sort: true,
			template: (v: string) => riskLevelLabel(v as never)
		},
		{
			id: 'infectionFlag',
			header: 'Infection',
			width: 100,
			template: (v: boolean) => (v ? 'Yes' : 'No')
		},
		{
			id: 'immunoFlag',
			header: 'Immuno.',
			width: 100,
			template: (v: boolean) => (v ? 'Yes' : 'No')
		},
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'donorName', order: 'asc' });
		// Open an assessment when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/organ-donation-assessments/${ev.id}`);
		});
	}
</script>

<main class="mx-auto max-w-6xl px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">Organ donation clinician dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				Eligibility and overall donor risk for assessed donors, computed by the shared engine. Select
				a row to open the assessment.
			</p>
		</div>
		<a href="/organ-donation-assessments/new" class="button" data-variant="primary">New assessment</a>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Eligibility</span>
			<select class="select inline-block w-auto" bind:value={eligibilityFilter}>
				<option value="">All</option>
				<option value="suitable">Suitable</option>
				<option value="conditionally-suitable">Conditionally suitable</option>
				<option value="unsuitable">Unsuitable</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Overall risk</span>
			<select class="select inline-block w-auto" bind:value={riskFilter}>
				<option value="">All</option>
				<option value="low">Low</option>
				<option value="moderate">Moderate</option>
				<option value="high">High</option>
				<option value="critical">Critical</option>
			</select>
		</label>
	</div>

	<div class="overflow-hidden rounded-xl border border-base-300" style="height: 600px;">
		<GridTheme>
			<Grid data={rows} {columns} {init} />
		</GridTheme>
	</div>

	<p class="mt-4 text-sm text-base-content/60">{rows.length} donors</p>
</main>
