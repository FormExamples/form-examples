<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleAssessmentRows } from '$lib/data/sample-reports';
	import {
		outcomeBandLabel,
		readingOutcomeLabel,
		screeningOutcomeLabel
	} from '$lib/engine/utils';

	let unitFilter = $state('');
	let bandFilter = $state('');
	let gridApi = $state<any>(null);

	const rows = $derived(
		sampleAssessmentRows.filter(
			(r) =>
				(unitFilter === '' || r.screeningUnit === unitFilter) &&
				(bandFilter === '' || r.outcomeBand === bandFilter)
		)
	);

	const units = $derived([...new Set(sampleAssessmentRows.map((r) => r.screeningUnit))].sort());

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

	// SVAR DataGrid columns. The reading outcome, imaging classification,
	// screening outcome, outcome band, and flag count all render through the
	// shared engine output so the dashboard and report stay aligned.
	const columns = [
		{ id: 'id', header: 'Record', width: 130 },
		{ id: 'patientIdentifier', header: 'Patient ID', width: 130, sort: true },
		{ id: 'patientName', header: 'Patient', flexgrow: 2, sort: true },
		{ id: 'reportedDate', header: 'Reported', width: 120, sort: true },
		{ id: 'screeningUnit', header: 'Unit', width: 150, sort: true },
		{
			id: 'readingOutcome',
			header: 'Reading',
			width: 160,
			sort: true,
			template: (v: string) => readingOutcomeLabel(v as never)
		},
		{
			id: 'imagingClassification',
			header: 'Class',
			width: 90,
			sort: true,
			template: (v: number | null) => (v == null ? '—' : String(v))
		},
		{
			id: 'screeningOutcome',
			header: 'Outcome',
			width: 200,
			sort: true,
			template: (v: string) => screeningOutcomeLabel(v as never)
		},
		{
			id: 'outcomeBand',
			header: 'Band',
			width: 120,
			sort: true,
			template: (v: string) => outcomeBandLabel(v as never)
		},
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'patientName', order: 'asc' });
		// Open a record when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/breast-screenings/${ev.id}`);
		});
	}
</script>

<main class="mx-auto max-w-6xl px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">Breast screening dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				Reading outcome, imaging classification, screening outcome, outcome band, and safety-flag
				counts for screened women, computed by the shared engine. Select a row to open the record.
			</p>
		</div>
		<a href="/breast-screenings/new" class="button" data-variant="primary">New record</a>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Unit</span>
			<select class="select inline-block w-auto" bind:value={unitFilter}>
				<option value="">All</option>
				{#each units as u (u)}
					<option value={u}>{u}</option>
				{/each}
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Outcome band</span>
			<select class="select inline-block w-auto" bind:value={bandFilter}>
				<option value="">All</option>
				<option value="routine">Routine recall</option>
				<option value="repeat">Technical repeat</option>
				<option value="assessment">Assessment</option>
				<option value="urgent">Urgent</option>
				<option value="referral">Referral</option>
				<option value="incomplete">Incomplete</option>
			</select>
		</label>
	</div>

	<div class="overflow-hidden rounded-xl border border-base-300" style="height: 600px;">
		<GridTheme>
			<Grid data={rows} {columns} {init} />
		</GridTheme>
	</div>

	<p class="mt-4 text-sm text-base-content/60">{rows.length} records</p>
</main>
