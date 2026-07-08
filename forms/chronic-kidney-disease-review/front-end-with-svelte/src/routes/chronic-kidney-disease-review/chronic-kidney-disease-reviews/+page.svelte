<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleAssessmentRows } from '$lib/data/sample-reports';
	import {
		gfrCategoryLabel,
		albuminuriaCategoryLabel,
		kdigoRiskZoneLabel,
		reviewStatusLabel
	} from '$lib/engine/utils';

	let zoneFilter = $state('');
	let reviewFilter = $state('');
	let gridApi = $state<any>(null);

	const rows = $derived(
		sampleAssessmentRows
			.map((r) => ({
				...r,
				// A review with no staging is "not classified" rather than a zone.
				zoneDisplay: r.kdigoRiskZone ?? 'not-classified'
			}))
			.filter(
				(r) =>
					(zoneFilter === '' || r.zoneDisplay === zoneFilter) &&
					(reviewFilter === '' || r.reviewStatus === reviewFilter)
			)
	);

	// Follow the active Lily theme: pick the dark SVAR skin when the theme's
	// base surface is dark. Recomputed whenever <html data-theme> changes.
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

	function zoneDisplayLabel(v: string): string {
		return v === 'not-classified' ? 'Not classified' : kdigoRiskZoneLabel(v as never);
	}

	// SVAR DataGrid columns. G-stage, albuminuria stage, KDIGO risk zone, and
	// review completeness render through the shared engine output so the
	// dashboard and report stay aligned.
	const columns = [
		{ id: 'id', header: 'Review', width: 140 },
		{ id: 'patientIdentifier', header: 'Patient ID', width: 150, sort: true },
		{ id: 'patientName', header: 'Patient', flexgrow: 2, sort: true },
		{ id: 'reviewedDate', header: 'Reviewed', width: 120, sort: true },
		{
			id: 'gfrCategory',
			header: 'G-stage',
			width: 90,
			sort: true,
			template: (v: string) => v || '—'
		},
		{
			id: 'albuminuriaCategory',
			header: 'A-stage',
			width: 90,
			sort: true,
			template: (v: string) => v || '—'
		},
		{
			id: 'zoneDisplay',
			header: 'KDIGO risk zone',
			width: 150,
			sort: true,
			template: (v: string) => zoneDisplayLabel(v)
		},
		{
			id: 'reviewStatus',
			header: 'Completeness',
			width: 130,
			sort: true,
			template: (v: string) => reviewStatusLabel(v as never)
		},
		{
			id: 'referralFlag',
			header: 'Referral',
			width: 90,
			sort: true,
			template: (v: boolean) => (v ? 'Yes' : '—')
		},
		{ id: 'highFlagCount', header: 'High flags', width: 100, sort: true },
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'patientName', order: 'asc' });
		// Open a review when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/chronic-kidney-disease-review/chronic-kidney-disease-reviews/${ev.id}`);
		});
	}
</script>

<main class="mx-auto max-w-6xl px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">Chronic kidney disease review dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				G-stage, albuminuria stage, KDIGO risk zone, review completeness, and flags for reviewed
				patients, computed by the shared engine. Select a row to open the review.
			</p>
		</div>
		<a href="/chronic-kidney-disease-review/chronic-kidney-disease-reviews/new" class="button" data-variant="primary">New review</a>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">KDIGO risk zone</span>
			<select class="select inline-block w-auto" bind:value={zoneFilter}>
				<option value="">All</option>
				<option value="low">Low risk</option>
				<option value="moderate">Moderate risk</option>
				<option value="high">High risk</option>
				<option value="very-high">Very high risk</option>
				<option value="not-classified">Not classified</option>
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

	<div class="overflow-hidden rounded-xl border border-base-300" style="height: 600px;">
		<GridTheme>
			<Grid data={rows} {columns} {init} />
		</GridTheme>
	</div>

	<p class="mt-4 text-sm text-base-content/60">{rows.length} patients</p>
</main>
