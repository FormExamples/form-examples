<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleAssessmentRows } from '$lib/data/sample-reports';
	import { clearanceLabel } from '$lib/engine/utils';

	let clearanceFilter = $state('');
	let contactFilter = $state('');
	let gridApi = $state<any>(null);

	const rows = $derived(
		sampleAssessmentRows.filter(
			(r) =>
				(clearanceFilter === '' || r.clearance === clearanceFilter) &&
				(contactFilter === '' || r.contactLevel === contactFilter)
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

	const contactLabel: Record<string, string> = {
		low: 'Low',
		moderate: 'Moderate',
		high: 'High'
	};

	// SVAR DataGrid columns. The PPE clearance decision and the safety flags
	// render through the shared engine output so the dashboard and report stay
	// aligned.
	const columns = [
		{ id: 'id', header: 'Assessment', width: 130 },
		{ id: 'athleteName', header: 'Athlete', flexgrow: 2, sort: true },
		{ id: 'assessedDate', header: 'Assessed', width: 120, sort: true },
		{ id: 'sport', header: 'Sport', width: 130, sort: true },
		{
			id: 'contactLevel',
			header: 'Contact',
			width: 110,
			sort: true,
			template: (v: string) => contactLabel[v] ?? '—'
		},
		{
			id: 'clearance',
			header: 'Clearance',
			flexgrow: 2,
			sort: true,
			template: (v: string) => clearanceLabel(v as never)
		},
		{
			id: 'concussionFlag',
			header: 'Concussion',
			width: 110,
			template: (v: boolean) => (v ? 'Yes' : 'No')
		},
		{ id: 'redSFlag', header: 'RED-S', width: 90, template: (v: boolean) => (v ? 'Yes' : 'No') },
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'athleteName', order: 'asc' });
		// Open an assessment when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/sports-medicine-assessments/${ev.id}`);
		});
	}
</script>

<main class="mx-auto max-w-6xl px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">Sports medicine clinician dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				PPE clearance decisions and safety flags for assessed athletes, computed by the shared
				engine. Select a row to open the assessment.
			</p>
		</div>
		<a href="/sports-medicine-assessments/new" class="button" data-variant="primary">New assessment</a>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Clearance</span>
			<select class="select inline-block w-auto" bind:value={clearanceFilter}>
				<option value="">All</option>
				<option value="cleared">Cleared</option>
				<option value="conditional">Cleared with Conditions</option>
				<option value="pending">Not Cleared Pending Further Evaluation</option>
				<option value="not-cleared">Not Cleared for Sport</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Contact level</span>
			<select class="select inline-block w-auto" bind:value={contactFilter}>
				<option value="">All</option>
				<option value="low">Low</option>
				<option value="moderate">Moderate</option>
				<option value="high">High</option>
			</select>
		</label>
	</div>

	<div class="overflow-hidden rounded-xl border border-base-300" style="height: 600px;">
		<GridTheme>
			<Grid data={rows} {columns} {init} />
		</GridTheme>
	</div>

	<p class="mt-4 text-sm text-base-content/60">{rows.length} athletes</p>
</main>
