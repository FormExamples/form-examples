<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/env';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleAssessmentRows } from '#lib/data/sample-reports.js';
	import {
		functionalStatusLabel,
		optimisationStatusLabel,
		reviewStatusLabel,
		careSettingLabel
	} from '#lib/engine/utils.js';

	let functionalFilter = $state('');
	let optimisationFilter = $state('');
	let reviewFilter = $state('');
	let gridApi = $state<any>(null);

	const rows = $derived(
		sampleAssessmentRows.filter(
			(r) =>
				(functionalFilter === '' || r.functionalStatus === functionalFilter) &&
				(optimisationFilter === '' || r.optimisationStatus === optimisationFilter) &&
				(reviewFilter === '' || r.reviewStatus === reviewFilter)
		)
	);

	// Follow the active Lily theme: pick the dark SVAR skin when the theme's base
	// surface is dark. Recomputed whenever <html data-theme> changes.
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

	// SVAR DataGrid columns. Functional status, medication optimisation, and
	// review completeness render through the shared engine output so the
	// dashboard and report stay aligned.
	const columns = [
		{ id: 'id', header: 'Review', width: 130 },
		{
			id: 'patientIdentifier',
			header: 'Patient ID',
			width: 150,
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
			header: 'Care setting',
			flexgrow: 2,
			sort: true,
			template: (v: string) => careSettingLabel(v as never) || '—'
		},

		{
			id: 'reviewedDate',
			header: 'Reviewed',
			width: 120,
			sort: true
		},

		{
			id: 'functionalStatus',
			header: 'NYHA status',
			width: 150,
			sort: true,
			template: (v: string) => functionalStatusLabel(v as never)
		},
		{
			id: 'optimisationStatus',
			header: 'Optimisation',
			width: 150,
			sort: true,
			template: (v: string) => optimisationStatusLabel(v as never)
		},
		{
			id: 'reviewStatus',
			header: 'Completeness',
			width: 130,
			sort: true,
			template: (v: string) => reviewStatusLabel(v as never)
		},
		{
			id: 'completenessScore',
			header: '%',
			width: 70,
			sort: true,
			template: (v: number) => `${v}%`
		},
		{ id: 'highFlagCount', header: 'High flags', width: 100, sort: true },
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'patientName', order: 'asc' });
		// Open a review when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/heart-failure-review/heart-failure-reviews/${ev.id}`);
		});
	}
</script>

<main class="mx-16 px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">Heart-failure review dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				NYHA functional status, medication-optimisation status, review completeness, and safety
				flags for reviewed patients, computed by the shared engine. Select a row to open the review.
			</p>
		</div>
		<a href="/heart-failure-review/heart-failure-reviews/new" class="button" data-variant="primary">New review</a>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">NYHA status</span>
			<select class="select inline-block w-auto" bind:value={functionalFilter}>
				<option value="">All</option>
				<option value="stable">Stable</option>
				<option value="symptomatic">Symptomatic</option>
				<option value="advanced">Advanced</option>
				<option value="unknown">Not assessed</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Optimisation</span>
			<select class="select inline-block w-auto" bind:value={optimisationFilter}>
				<option value="">All</option>
				<option value="optimised">Optimised</option>
				<option value="partial">Partially optimised</option>
				<option value="suboptimal">Suboptimal</option>
				<option value="not-applicable">Not applicable</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Completeness</span>
			<select class="select inline-block w-auto" bind:value={reviewFilter}>
				<option value="">All</option>
				<option value="complete">Complete</option>
				<option value="partial">Partial</option>
				<option value="incomplete">Incomplete</option>
			</select>
		</label>
	</div>

	<div
		class="overflow-hidden rounded-xl border border-base-300"
		style="height: 600px;"
	><GridTheme><Grid data={rows} columns={columns} init={init} /></GridTheme></div>

	<p class="mt-4 text-sm text-base-content/60">{rows.length} patients</p>
</main>
