<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleReviewRows } from '$lib/data/sample-reports';
	import { reviewStatusLabel, burdenBandLabel, careSettingLabel } from '$lib/engine/utils';

	let settingFilter = $state('');
	let statusFilter = $state('');
	let gridApi = $state<any>(null);

	const rows = $derived(
		sampleReviewRows.filter(
			(r) =>
				(settingFilter === '' || r.careSetting === settingFilter) &&
				(statusFilter === '' || r.reviewStatus === statusFilter)
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

	// SVAR DataGrid columns. Status, counts, and band render through the shared
	// engine output so the dashboard and report stay aligned.
	const columns = [
		{ id: 'id', header: 'Review', width: 140 },
		{ id: 'patientIdentifier', header: 'Patient ID', width: 130, sort: true },
		{ id: 'patientName', header: 'Patient', flexgrow: 2, sort: true },
		{ id: 'reviewedDate', header: 'Reviewed', width: 120, sort: true },
		{
			id: 'careSetting',
			header: 'Setting',
			width: 170,
			sort: true,
			template: (v: string) => careSettingLabel(v as never) || '—'
		},
		{ id: 'medicineCount', header: 'Medicines', width: 100, sort: true },
		{ id: 'anticholinergicBurdenScore', header: 'ACB', width: 80, sort: true },
		{
			id: 'burdenBand',
			header: 'Burden',
			width: 150,
			sort: true,
			template: (v: string) => burdenBandLabel(v as never)
		},
		{
			id: 'reviewStatus',
			header: 'Status',
			width: 130,
			sort: true,
			template: (v: string) => reviewStatusLabel(v as never)
		},
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'patientName', order: 'asc' });
		// Open a review when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/structured-medication-review/structured-medication-reviews/${ev.id}`);
		});
	}
</script>

<main class="mx-16 px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">Structured medication review dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				Review status, medicine and anticholinergic-burden indicators, and flag count for reviewed
				patients, computed by the shared engine. Select a row to open the review.
			</p>
		</div>
		<a href="/structured-medication-review/structured-medication-reviews/new" class="button" data-variant="primary">New review</a>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Care setting</span>
			<select class="select inline-block w-auto" bind:value={settingFilter}>
				<option value="">All</option>
				<option value="gp-practice">GP practice</option>
				<option value="pcn">Primary Care Network</option>
				<option value="care-home">Care home</option>
				<option value="community-pharmacy">Community pharmacy</option>
				<option value="patient-home">Patient's home</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Status</span>
			<select class="select inline-block w-auto" bind:value={statusFilter}>
				<option value="">All</option>
				<option value="complete">Complete</option>
				<option value="incomplete">Incomplete</option>
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
