<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/env';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleAssessmentRows } from '#lib/data/sample-reports.js';
	import { followUpTimeframeLabel, priorityLabel } from '#lib/engine/utils.js';
	import type { FlagPriority, FollowUpTimeframe } from '#lib/engine/types.js';

	let followUpFilter = $state('');
	let priorityFilter = $state('');
	let gridApi = $state<any>(null);

	const rows = $derived(
		sampleAssessmentRows.filter(
			(r) =>
				(followUpFilter === '' || r.followUpTimeframe === followUpFilter) &&
				(priorityFilter === '' || r.reviewPriority === priorityFilter)
		)
	);

	// Follow the active Lily theme: pick the dark SVAR skin when the theme's base
	// surface is dark. Recomputed whenever <html data-theme> changes (after the
	// new theme stylesheet has applied its tokens).
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

	// SVAR DataGrid columns. Completeness and review priority render through the
	// shared engine output so the dashboard and report stay aligned.
	const columns = [
		{ id: 'id', header: 'Referral', width: 130 },
		{
			id: 'patientName',
			header: 'Patient',
			flexgrow: 2,
			sort: true
		},

		{
			id: 'referralDate',
			header: 'Referred',
			width: 120,
			sort: true
		},

		{
			id: 'followUpTimeframe',
			header: 'Follow-up',
			width: 170,
			sort: true,
			template: (v: FollowUpTimeframe) => followUpTimeframeLabel(v)
		},

		{
			id: 'completeness',
			header: 'Completeness',
			width: 130,
			sort: true
		},

		{
			id: 'reviewPriority',
			header: 'Review priority',
			width: 140,
			sort: true,
			template: (v: FlagPriority | 'none') => v === 'none' ? 'None' : priorityLabel(v)
		},
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'patientName', order: 'asc' });
		// Open a counter-referral when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/who-counter-referral-form/who-counter-referral-forms/${ev.id}`);
		});
	}
</script>

<main class="mx-16 px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">Counter-referral clinician dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				Completeness status, follow-up timeframe, and review priority for counter-referred patients,
				computed by the shared engine. Select a row to open the form.
			</p>
		</div>
		<a href="/who-counter-referral-form/who-counter-referral-forms/new" class="button" data-variant="primary">New form</a>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Follow-up</span>
			<select class="select inline-block w-auto" bind:value={followUpFilter}>
				<option value="">All</option>
				<option value="urgent-within-24-hours">Urgent (within 24h)</option>
				<option value="2-to-6-days">2–6 days</option>
				<option value="1-to-2-weeks">1–2 weeks</option>
				<option value="more-than-2-weeks">More than 2 weeks</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Review priority</span>
			<select class="select inline-block w-auto" bind:value={priorityFilter}>
				<option value="">All</option>
				<option value="urgent">Urgent</option>
				<option value="high">High</option>
				<option value="medium">Medium</option>
				<option value="low">Low</option>
				<option value="none">None</option>
			</select>
		</label>
	</div>

	<div
		class="overflow-hidden rounded-xl border border-base-300"
		style="height: 600px;"
	><GridTheme><Grid data={rows} columns={columns} init={init} /></GridTheme></div>

	<p class="mt-4 text-sm text-base-content/60">{rows.length} patients</p>
</main>
