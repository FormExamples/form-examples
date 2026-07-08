<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleAssessmentRows } from '$lib/data/sample-reports';
	import { statusLabel, cprRecommendationLabel } from '$lib/engine/utils';

	let statusFilter = $state('');
	let cprFilter = $state('');

	const rows = $derived(
		sampleAssessmentRows.filter(
			(r) =>
				(statusFilter === '' || r.status === statusFilter) &&
				(cprFilter === '' || r.cprRecommendation === cprFilter)
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

	// SVAR DataGrid columns. Completeness status and CPR recommendation render
	// through the shared engine output so the dashboard and report stay aligned.
	const columns = [
		{ id: 'id', header: 'Plan', width: 130 },
		{ id: 'patientIdentifier', header: 'Patient ID', width: 130, sort: true },
		{ id: 'patientName', header: 'Person', flexgrow: 2, sort: true },
		{ id: 'updatedDate', header: 'Updated', width: 120, sort: true },
		{
			id: 'status',
			header: 'Status',
			width: 130,
			sort: true,
			template: (v: string) => statusLabel(v as never)
		},
		{
			id: 'completenessPercent',
			header: 'Complete',
			width: 110,
			sort: true,
			template: (v: number) => `${v}%`
		},
		{
			id: 'cprRecommendation',
			header: 'CPR',
			width: 220,
			sort: true,
			template: (v: string) => cprRecommendationLabel(v as never)
		},
		{ id: 'clinicianName', header: 'Clinician', width: 150, sort: true },
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	function init(api: any) {
		api.exec('sort-rows', { key: 'patientName', order: 'asc' });
		// Open a plan when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/recommended-summary-plan-for-emergency-care-and-treatment/plans/${ev.id}`);
		});
	}
</script>

<main class="mx-auto max-w-6xl px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">ReSPECT clinician dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				Completeness status, CPR recommendation, and flag count for each plan, computed by the
				shared engine. Select a row to open the plan.
			</p>
		</div>
		<a href="/recommended-summary-plan-for-emergency-care-and-treatment/plans/new" class="button" data-variant="primary">New plan</a>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Status</span>
			<select class="select inline-block w-auto" bind:value={statusFilter}>
				<option value="">All</option>
				<option value="complete">Complete</option>
				<option value="incomplete">Incomplete</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">CPR recommendation</span>
			<select class="select inline-block w-auto" bind:value={cprFilter}>
				<option value="">All</option>
				<option value="attempt">Attempt</option>
				<option value="do-not-attempt">Do not attempt</option>
			</select>
		</label>
	</div>

	<div class="overflow-hidden rounded-xl border border-base-300" style="height: 600px;">
		<GridTheme>
			<Grid data={rows} {columns} {init} />
		</GridTheme>
	</div>

	<p class="mt-4 text-sm text-base-content/60">{rows.length} plans</p>
</main>
