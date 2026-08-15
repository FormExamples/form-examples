<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/env';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleRequestRows } from '#lib/data/sample-reports.js';
	import {
		examTypeLabel,
		indicationLabel,
		triageTierLabel,
		priorityLabel,
		recommendationLabel
	} from '#lib/engine/utils.js';

	let tierFilter = $state('');
	let recommendationFilter = $state('');
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let gridApi = $state<any>(null);

	const rows = $derived(
		sampleRequestRows.filter(
			(r) =>
				(tierFilter === '' || r.triageTier === tierFilter) &&
				(recommendationFilter === '' || r.recommendation === recommendationFilter)
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

	// SVAR DataGrid columns. Every graded value renders through the shared engine
	// output so the dashboard and report stay aligned.
	const columns = [
		{ id: 'id', header: 'Request', width: 120 },
		{
			id: 'patientName',
			header: 'Patient',
			flexgrow: 2,
			sort: true
		},

		{
			id: 'examType',
			header: 'Exam',
			width: 120,
			sort: true,
			template: (v: string) => examTypeLabel(v)
		},
		{
			id: 'indication',
			header: 'Indication',
			width: 150,
			sort: true,
			template: (v: string) => indicationLabel(v)
		},
		{
			id: 'appropriatenessScore',
			header: 'Appropriate.',
			width: 110,
			sort: true,
			template: (v: number) => `${v} / 9`
		},
		{
			id: 'triageTier',
			header: 'Triage',
			width: 130,
			sort: true,
			template: (v: string) => triageTierLabel(v)
		},
		{
			id: 'twoWeekWaitEligible',
			header: '2WW',
			width: 80,
			template: (v: boolean) => v ? 'Yes' : 'No'
		},
		{
			id: 'priorityBand',
			header: 'Priority',
			width: 100,
			sort: true,
			template: (v: string) => priorityLabel(v)
		},
		{
			id: 'completenessPercent',
			header: 'Complete',
			width: 100,
			sort: true,
			template: (v: number) => `${v}%`
		},
		{
			id: 'recommendation',
			header: 'Recommendation',
			width: 170,
			sort: true,
			template: (v: string) => recommendationLabel(v)
		},
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'patientName', order: 'asc' });
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/mammography-test-request/mammography-test-requests/${ev.id}`);
		});
	}
</script>

<main class="mx-16 px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">Mammography vetting dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				Four-axis grade and cancer-pathway triage for each request, computed by the shared engine.
				Select a row to open the request.
			</p>
		</div>
		<a href="/mammography-test-request/mammography-test-requests/new" class="button" data-variant="primary">New request</a>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Triage tier</span>
			<select class="select inline-block w-auto" bind:value={tierFilter}>
				<option value="">All</option>
				<option value="routine">Routine</option>
				<option value="urgent">Urgent</option>
				<option value="two-week-wait">Two-week-wait</option>
				<option value="emergency">Emergency</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Recommendation</span>
			<select class="select inline-block w-auto" bind:value={recommendationFilter}>
				<option value="">All</option>
				<option value="accept">Accept and book</option>
				<option value="query-referrer">Query the referrer</option>
				<option value="redirect">Redirect</option>
				<option value="reject">Reject</option>
			</select>
		</label>
	</div>

	<div
		class="overflow-hidden rounded-xl border border-base-300"
		style="height: 600px;"
	><GridTheme><Grid data={rows} columns={columns} init={init} /></GridTheme></div>

	<p class="mt-4 text-sm text-base-content/60">{rows.length} requests</p>
</main>
