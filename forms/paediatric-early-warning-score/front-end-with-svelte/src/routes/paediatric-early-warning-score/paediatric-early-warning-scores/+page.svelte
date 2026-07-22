<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleAssessmentRows } from '$lib/data/sample-reports';
	import { escalationBandLabel, ageBandLabel } from '$lib/engine/utils';

	const plural = 'paediatric-early-warning-scores';

	let bandFilter = $state('');
	let ageBandFilter = $state('');
	let gridApi = $state<any>(null);

	const rows = $derived(
		sampleAssessmentRows.filter(
			(r) =>
				(bandFilter === '' || r.escalationBand === bandFilter) &&
				(ageBandFilter === '' || r.ageBand === ageBandFilter)
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

	// SVAR DataGrid columns. Aggregate, escalation band, single-parameter trigger,
	// and monitoring frequency render through the shared engine output so the
	// dashboard and report stay aligned.
	const columns = [
		{ id: 'id', header: 'Assessment', width: 160 },
		{
			id: 'ageBand',
			header: 'Age band',
			width: 150,
			sort: true,
			template: (v: string) => ageBandLabel(v as never)
		},
		{ id: 'careSetting', header: 'Care setting', flexgrow: 2, sort: true },
		{ id: 'observedDate', header: 'Observed', width: 120, sort: true },
		{ id: 'aggregateScore', header: 'PEWS', width: 80, sort: true },
		{
			id: 'escalationBand',
			header: 'Escalation',
			width: 160,
			sort: true,
			template: (v: string) => escalationBandLabel(v as never)
		},
		{
			id: 'singleParameterTrigger',
			header: 'Single param = 3',
			width: 140,
			template: (v: boolean) => (v ? 'Yes' : 'No')
		},
		{ id: 'monitoringFrequency', header: 'Monitoring', flexgrow: 2 },
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'observedDate', order: 'asc' });
		// Open an assessment when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/paediatric-early-warning-score/${plural}/${ev.id}`);
		});
	}
</script>

<main class="mx-16 px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">PEWS clinician dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				Aggregate PEWS total, escalation band, single-parameter trigger, and recommended monitoring
				frequency for assessed children, computed by the shared age-banded engine. Select a row to
				open the assessment.
			</p>
		</div>
		<a href="/paediatric-early-warning-score/{plural}/new" class="button" data-variant="primary">New assessment</a>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Escalation band</span>
			<select class="select inline-block w-auto" bind:value={bandFilter}>
				<option value="">All</option>
				<option value="routine">Routine</option>
				<option value="low">Low</option>
				<option value="medium">Medium</option>
				<option value="high">High</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Age band</span>
			<select class="select inline-block w-auto" bind:value={ageBandFilter}>
				<option value="">All</option>
				<option value="neonate">Neonate</option>
				<option value="infant">Infant</option>
				<option value="young-child">Young child</option>
				<option value="child">Child</option>
				<option value="adolescent">Adolescent</option>
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
