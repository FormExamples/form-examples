<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleAssessmentRows } from '$lib/data/sample-reports';
	import { validityStatusLabel } from '$lib/engine/utils';

	let statusFilter = $state('');
	let lifeSustainingFilter = $state('');
	let gridApi = $state<any>(null);

	const rows = $derived(
		sampleAssessmentRows.filter(
			(r) =>
				(statusFilter === '' || r.validityStatus === statusFilter) &&
				(lifeSustainingFilter === '' ||
					(lifeSustainingFilter === 'yes' ? r.lifeSustainingRefusal : !r.lifeSustainingRefusal))
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

	// SVAR DataGrid columns. The validity status renders through the shared
	// engine output so the dashboard and report stay aligned.
	const columns = [
		{ id: 'id', header: 'ADRT', width: 140 },
		{ id: 'patientName', header: 'Patient', flexgrow: 2, sort: true },
		{ id: 'createdDate', header: 'Created', width: 120, sort: true },
		{
			id: 'validityStatus',
			header: 'Validity',
			width: 240,
			sort: true,
			template: (v: string) => validityStatusLabel(v)
		},
		{
			id: 'lifeSustainingRefusal',
			header: 'Life-sustaining',
			width: 130,
			template: (v: boolean) => (v ? 'Yes' : 'No')
		},
		{
			id: 'witnessed',
			header: 'Witnessed',
			width: 110,
			template: (v: boolean) => (v ? 'Yes' : 'No')
		},
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'patientName', order: 'asc' });
		// Open an ADRT when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/advance-decisions-to-refuse-treatment/${ev.id}`);
		});
	}
</script>

<main class="mx-auto max-w-6xl px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">ADRT clinician dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				Legal validity status and life-sustaining / witness flags for recorded ADRTs, computed by the
				shared engine. Select a row to open the document.
			</p>
		</div>
		<a href="/advance-decisions-to-refuse-treatment/new" class="button" data-variant="primary">New ADRT</a>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Validity status</span>
			<select class="select inline-block w-auto" bind:value={statusFilter}>
				<option value="">All</option>
				<option value="draft">Draft</option>
				<option value="complete">Complete</option>
				<option value="valid">Valid</option>
				<option value="invalid">Invalid</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Life-sustaining refusal</span>
			<select class="select inline-block w-auto" bind:value={lifeSustainingFilter}>
				<option value="">All</option>
				<option value="yes">Yes</option>
				<option value="no">No</option>
			</select>
		</label>
	</div>

	<div class="overflow-hidden rounded-xl border border-base-300" style="height: 600px;">
		<GridTheme>
			<Grid data={rows} {columns} {init} />
		</GridTheme>
	</div>

	<p class="mt-4 text-sm text-base-content/60">{rows.length} ADRTs</p>
</main>
