<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleAssessmentRows } from '$lib/data/sample-reports';
	import { readinessBandLabel, anaestheticTechniqueLabel } from '$lib/engine/utils';

	const plural = 'post-anaesthesia-care-unit-records';

	let techniqueFilter = $state('');
	let bandFilter = $state('');
	let gridApi = $state<any>(null);

	const rows = $derived(
		sampleAssessmentRows.filter(
			(r) =>
				(techniqueFilter === '' || r.anaestheticTechnique === techniqueFilter) &&
				(bandFilter === '' || r.readinessBand === bandFilter)
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

	// SVAR DataGrid columns. Aldrete total, readiness band, and not-ready flag
	// render through the shared engine output so the dashboard and report stay
	// aligned.
	const columns = [
		{ id: 'id', header: 'Record', width: 150 },
		{ id: 'patientIdentifier', header: 'Patient ID', width: 130, sort: true },
		{ id: 'patientName', header: 'Patient', flexgrow: 2, sort: true },
		{ id: 'admittedDate', header: 'Admitted', width: 120, sort: true },
		{
			id: 'anaestheticTechnique',
			header: 'Technique',
			width: 160,
			sort: true,
			template: (v: string) => anaestheticTechniqueLabel(v as never) || '—'
		},
		{ id: 'aldreteTotal', header: 'Aldrete', width: 90, sort: true },
		{
			id: 'readinessBand',
			header: 'Readiness',
			width: 220,
			sort: true,
			template: (v: string) => readinessBandLabel(v as never)
		},
		{
			id: 'notReadyFlag',
			header: 'Not ready',
			width: 100,
			template: (v: boolean) => (v ? 'Yes' : 'No')
		},
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'patientName', order: 'asc' });
		// Open a record when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/post-anaesthesia-care-unit-record/${plural}/${ev.id}`);
		});
	}
</script>

<main class="mx-auto max-w-6xl px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">PACU recovery-team dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				Modified Aldrete total, readiness band, and flags for recovering patients, computed by the
				shared engine. Select a row to open the record.
			</p>
		</div>
		<a href="/post-anaesthesia-care-unit-record/{plural}/new" class="button" data-variant="primary">New record</a>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Technique</span>
			<select class="select inline-block w-auto" bind:value={techniqueFilter}>
				<option value="">All</option>
				<option value="general">General anaesthesia</option>
				<option value="regional">Regional anaesthesia</option>
				<option value="sedation">Procedural sedation</option>
				<option value="combined">Combined</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Readiness</span>
			<select class="select inline-block w-auto" bind:value={bandFilter}>
				<option value="">All</option>
				<option value="discharge-ready">Discharge-ready</option>
				<option value="not-ready">Not ready</option>
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
