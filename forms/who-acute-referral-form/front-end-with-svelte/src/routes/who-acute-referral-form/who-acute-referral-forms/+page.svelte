<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/env';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleAssessmentRows } from '#lib/data/sample-reports.js';
	import { modeOfTransferLabel } from '#lib/engine/utils.js';
	import type { ModeOfTransfer } from '#lib/engine/types.js';

	let completenessFilter = $state('');
	let modeFilter = $state('');
	let gridApi = $state<any>(null);

	const rows = $derived(
		sampleAssessmentRows.filter(
			(r) =>
				(completenessFilter === '' || r.completeness === completenessFilter) &&
				(modeFilter === '' || r.modeOfTransfer === modeFilter)
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
		const update = () => isDark = computeDark();
		update();
		const obs = new MutationObserver(() => setTimeout(update, 120));
		obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
		return () => obs.disconnect();
	});
	const GridTheme = $derived(isDark ? WillowDark : Willow);

	// SVAR DataGrid columns. Completeness status, transport mode, and flag counts
	// render through the shared engine output so the dashboard and report stay
	// aligned.
	const columns = [
		{ id: 'id', header: 'Referral', width: 120 },
		{ id: 'patientName', header: 'Patient', flexgrow: 2, sort: true },
		{ id: 'referralDate', header: 'Date', width: 110, sort: true },
		{
			id: 'initiatingFacility',
			header: 'From (initiating)',
			flexgrow: 2,
			sort: true
		},

		{
			id: 'referralFacility',
			header: 'To (referral)',
			flexgrow: 2,
			sort: true
		},

		{
			id: 'modeOfTransfer',
			header: 'Mode',
			width: 150,
			sort: true,
			template: (v: ModeOfTransfer) => modeOfTransferLabel(v)
		},

		{
			id: 'primaryDiagnosis',
			header: 'Diagnosis',
			flexgrow: 2,
			sort: true
		},

		{
			id: 'completeness',
			header: 'Status',
			width: 120,
			sort: true,
			template: (v: string) => v === 'complete' ? 'Complete' : 'Incomplete'
		},
		{ id: 'completionPercent', header: 'Complete %', width: 110, sort: true, template: (v: number) => `${v}%` },
		{ id: 'urgentFlagCount', header: 'Urgent', width: 90, sort: true },
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'patientName', order: 'asc' });
		// Open a referral when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/who-acute-referral-form/who-acute-referral-forms/${ev.id}`);
		});
	}
</script>

<main class="mx-16 px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">Acute referral clinician dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				Completeness status, transport mode, and flagged-issue counts for each referral, computed by
				the shared engine. Select a row to open the referral.
			</p>
		</div>
		<a href="/who-acute-referral-form/who-acute-referral-forms/new" class="button" data-variant="primary">New referral</a>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Status</span>
			<select class="select inline-block w-auto" bind:value={completenessFilter}>
				<option value="">All</option>
				<option value="complete">Complete</option>
				<option value="incomplete">Incomplete</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Mode of transfer</span>
			<select class="select inline-block w-auto" bind:value={modeFilter}>
				<option value="">All</option>
				<option value="ground">Ground (ambulance)</option>
				<option value="air">Air</option>
				<option value="sea">Sea</option>
			</select>
		</label>
	</div>

	<div
		class="overflow-hidden rounded-xl border border-base-300"
		style="height: 600px;"
	><GridTheme><Grid data={rows} columns={columns} init={init} /></GridTheme></div>

	<p class="mt-4 text-sm text-base-content/60">{rows.length} referrals</p>
</main>
