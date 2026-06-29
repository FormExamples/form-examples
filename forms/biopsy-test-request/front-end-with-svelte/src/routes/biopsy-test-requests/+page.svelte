<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleRequestRows } from '$lib/data/sample-reports';
	import {
		appropriatenessBandLabel,
		bleedingRiskLabel,
		biopsySiteLabel,
		indicationLabel,
		triageTierLabel
	} from '$lib/engine/utils';

	let bleedingFilter = $state('');
	let triageFilter = $state('');
	let gridApi = $state<any>(null);

	const rows = $derived(
		sampleRequestRows.filter(
			(r) =>
				(bleedingFilter === '' || r.bleedingRiskBand === bleedingFilter) &&
				(triageFilter === '' || r.triageTier === triageFilter)
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

	// SVAR DataGrid columns. Appropriateness band, bleeding-risk band, and the
	// triage tier render through the shared engine output so the dashboard and
	// report stay aligned.
	const columns = [
		{ id: 'id', header: 'Request', width: 130 },
		{ id: 'patientName', header: 'Patient', flexgrow: 2, sort: true },
		{ id: 'referralDate', header: 'Referred', width: 120, sort: true },
		{
			id: 'biopsySite',
			header: 'Site',
			width: 110,
			sort: true,
			template: (v: string) => biopsySiteLabel(v) || '—'
		},
		{
			id: 'indication',
			header: 'Indication',
			width: 160,
			sort: true,
			template: (v: string) => indicationLabel(v) || '—'
		},
		{
			id: 'appropriatenessBand',
			header: 'Appropriateness',
			width: 160,
			sort: true,
			template: (v: string) => appropriatenessBandLabel(v as never)
		},
		{
			id: 'bleedingRiskBand',
			header: 'Bleeding risk',
			width: 120,
			sort: true,
			template: (v: string) => bleedingRiskLabel(v as never)
		},
		{
			id: 'triageTier',
			header: 'Triage',
			width: 130,
			sort: true,
			template: (v: string) => triageTierLabel(v as never)
		},
		{
			id: 'twoWeekWaitEligible',
			header: '2WW',
			width: 80,
			template: (v: boolean) => (v ? 'Yes' : 'No')
		},
		{ id: 'completenessPercent', header: 'Complete', width: 100, sort: true, template: (v: number) => `${v}%` },
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'referralDate', order: 'asc' });
		// Open a request when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/biopsy-test-requests/${ev.id}`);
		});
	}
</script>

<main class="mx-auto max-w-6xl px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">Biopsy request vetting dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				Appropriateness, periprocedural bleeding risk, and triage tier for incoming requests,
				computed by the shared engine. Select a row to open the request.
			</p>
		</div>
		<a href="/biopsy-test-requests/new" class="button" data-variant="primary">New request</a>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Bleeding risk</span>
			<select class="select inline-block w-auto" bind:value={bleedingFilter}>
				<option value="">All</option>
				<option value="low">Low</option>
				<option value="moderate">Moderate</option>
				<option value="high">High</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Triage tier</span>
			<select class="select inline-block w-auto" bind:value={triageFilter}>
				<option value="">All</option>
				<option value="routine">Routine</option>
				<option value="urgent">Urgent</option>
				<option value="two-week-wait">Two-week wait</option>
				<option value="emergency">Emergency</option>
			</select>
		</label>
	</div>

	<div class="overflow-hidden rounded-xl border border-base-300" style="height: 600px;">
		<GridTheme>
			<Grid data={rows} {columns} {init} />
		</GridTheme>
	</div>

	<p class="mt-4 text-sm text-base-content/60">{rows.length} requests</p>
</main>
