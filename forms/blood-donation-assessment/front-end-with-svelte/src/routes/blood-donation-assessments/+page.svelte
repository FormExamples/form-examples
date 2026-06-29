<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleAssessmentRows } from '$lib/data/sample-reports';
	import { eligibilityLabel, donorTypeLabel } from '$lib/engine/utils';
	import type { EligibilityStatus, DonorType } from '$lib/engine/types';

	let eligibilityFilter = $state('');
	let donorTypeFilter = $state('');
	let gridApi = $state<any>(null);

	const rows = $derived(
		sampleAssessmentRows.filter(
			(r) =>
				(eligibilityFilter === '' || r.eligibilityStatus === eligibilityFilter) &&
				(donorTypeFilter === '' || r.donorType === donorTypeFilter)
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

	// SVAR DataGrid columns. The eligibility status, deferral window, and flag
	// count render through the shared engine output so the dashboard and report
	// stay aligned.
	const columns = [
		{ id: 'id', header: 'Assessment', width: 130 },
		{ id: 'donorName', header: 'Donor', flexgrow: 2, sort: true },
		{ id: 'assessedDate', header: 'Assessed', width: 120, sort: true },
		{
			id: 'eligibilityStatus',
			header: 'Eligibility',
			width: 160,
			sort: true,
			template: (v: EligibilityStatus) => eligibilityLabel(v)
		},
		{
			id: 'donorType',
			header: 'Donor type',
			width: 110,
			sort: true,
			template: (v: DonorType) => donorTypeLabel(v)
		},
		{
			id: 'hemoglobin',
			header: 'Hb (g/dL)',
			width: 100,
			sort: true,
			template: (v: number | null) => (v == null ? '—' : String(v))
		},
		{ id: 'deferralWindow', header: 'Deferral window', flexgrow: 1, template: (v: string) => v || '—' },
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true },
		{ id: 'riskFlag', header: 'Risk', width: 80, template: (v: boolean) => (v ? 'Yes' : 'No') }
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'donorName', order: 'asc' });
		// Open an assessment when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/blood-donation-assessments/${ev.id}`);
		});
	}
</script>

<main class="mx-auto max-w-6xl px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">Blood donation clinician dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				Eligibility status, deferral window, and risk flags for screened donors, computed by the
				shared engine. Select a row to open the assessment.
			</p>
		</div>
		<a href="/blood-donation-assessments/new" class="button" data-variant="primary">New assessment</a>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Eligibility</span>
			<select class="select inline-block w-auto" bind:value={eligibilityFilter}>
				<option value="">All</option>
				<option value="eligible">Eligible</option>
				<option value="temporarily-deferred">Temporarily Deferred</option>
				<option value="permanently-deferred">Permanently Deferred</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Donor type</span>
			<select class="select inline-block w-auto" bind:value={donorTypeFilter}>
				<option value="">All</option>
				<option value="first-time">First-time</option>
				<option value="regular">Regular</option>
				<option value="lapsed">Lapsed</option>
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
