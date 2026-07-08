<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleAssessmentRows } from '$lib/data/sample-reports';
	import { categoryLabel, eligibilityRouteLabel, formatDiameter } from '$lib/engine/utils';

	let routeFilter = $state('');
	let categoryFilter = $state('');
	let gridApi = $state<any>(null);

	const rows = $derived(
		sampleAssessmentRows.filter(
			(r) =>
				(routeFilter === '' || r.eligibilityRoute === routeFilter) &&
				(categoryFilter === '' || r.category === categoryFilter)
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

	// SVAR DataGrid columns. The diameter, category, and referral flag render
	// through the shared engine output so the dashboard and report stay aligned.
	const columns = [
		{ id: 'id', header: 'Assessment', width: 130 },
		{ id: 'patientIdentifier', header: 'Patient ID', width: 130, sort: true },
		{ id: 'patientName', header: 'Patient', flexgrow: 2, sort: true },
		{ id: 'scannedDate', header: 'Scanned', width: 120, sort: true },
		{
			id: 'eligibilityRoute',
			header: 'Eligibility',
			width: 190,
			sort: true,
			template: (v: string) => eligibilityRouteLabel(v as never) || '—'
		},
		{
			id: 'maxAorticDiameterCm',
			header: 'Max diameter',
			width: 130,
			sort: true,
			template: (v: number | null) => formatDiameter(v)
		},
		{
			id: 'category',
			header: 'Category',
			width: 190,
			sort: true,
			template: (v: string) => categoryLabel(v as never)
		},
		{
			id: 'referralFlag',
			header: 'Referral',
			width: 100,
			template: (v: boolean) => (v ? 'Yes' : 'No')
		},
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'patientName', order: 'asc' });
		// Open an assessment when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/abdominal-aortic-aneurysm-screening/abdominal-aortic-aneurysm-screenings/${ev.id}`);
		});
	}
</script>

<main class="mx-auto max-w-6xl px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">AAA screening dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				Maximum aortic diameter and category for scanned patients, computed by the shared engine.
				Select a row to open the assessment.
			</p>
		</div>
		<a href="/abdominal-aortic-aneurysm-screening/abdominal-aortic-aneurysm-screenings/new" class="button" data-variant="primary"
			>New scan</a
		>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Eligibility route</span>
			<select class="select inline-block w-auto" bind:value={routeFilter}>
				<option value="">All</option>
				<option value="routine-year-of-65">Routine — year of 65</option>
				<option value="self-referral-over-65">Self-referral — over 65</option>
				<option value="other">Other</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Category</span>
			<select class="select inline-block w-auto" bind:value={categoryFilter}>
				<option value="">All</option>
				<option value="normal">Normal</option>
				<option value="small">Small aneurysm</option>
				<option value="medium">Medium aneurysm</option>
				<option value="large">Large aneurysm</option>
				<option value="non-visualised">Non-visualised</option>
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
