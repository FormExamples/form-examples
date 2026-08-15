<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/env';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleAssessmentRows } from '#lib/data/sample-reports.js';
	import { outcomeLabel } from '#lib/engine/utils.js';

	let outcomeFilter = $state('');
	let criticalFilter = $state('');
	let gridApi = $state<any>(null);

	const rows = $derived(
		sampleAssessmentRows.filter(
			(r) =>
				(outcomeFilter === '' || r.outcome === outcomeFilter) &&
				(criticalFilter === '' ||
					(criticalFilter === 'with' ? r.criticalCount > 0 : r.criticalCount === 0))
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
		const update = () => isDark = computeDark();
		update();
		const obs = new MutationObserver(() => setTimeout(update, 120));
		obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
		return () => obs.disconnect();
	});
	const GridTheme = $derived(isDark ? WillowDark : Willow);

	// SVAR DataGrid columns. The overall outcome, finding counts and flags render
	// through the shared engine output so the dashboard and report stay aligned.
	const columns = [
		{ id: 'id', header: 'Audit', width: 130 },
		{ id: 'siteName', header: 'Site', flexgrow: 2, sort: true },
		{ id: 'auditDate', header: 'Audited', width: 120, sort: true },
		{
			id: 'outcome',
			header: 'Outcome',
			width: 150,
			sort: true,
			template: (v: string) => outcomeLabel(v as never)
		},

		{
			id: 'findingCount',
			header: 'Findings',
			width: 100,
			sort: true
		},

		{
			id: 'criticalCount',
			header: 'Critical',
			width: 90,
			sort: true
		},

		{
			id: 'riddorFlag',
			header: 'RIDDOR',
			width: 100,
			template: (v: boolean) => v ? 'Outstanding' : 'OK'
		},
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'siteName', order: 'asc' });
		// Open an audit when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/workplace-safety-assessment/workplace-safety-assessments/${ev.id}`);
		});
	}
</script>

<main class="mx-16 px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">Workplace safety dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				Overall outcome, finding counts and flags for audited sites, computed by the shared engine.
				Select a row to open the audit.
			</p>
		</div>
		<a href="/workplace-safety-assessment/workplace-safety-assessments/new" class="button" data-variant="primary">New audit</a>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Outcome</span>
			<select class="select inline-block w-auto" bind:value={outcomeFilter}>
				<option value="">All</option>
				<option value="compliant">Compliant</option>
				<option value="minor">Minor Findings</option>
				<option value="major">Major Findings</option>
				<option value="critical">Critical Findings</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Critical findings</span>
			<select class="select inline-block w-auto" bind:value={criticalFilter}>
				<option value="">All</option>
				<option value="with">With critical findings</option>
				<option value="without">No critical findings</option>
			</select>
		</label>
	</div>

	<div
		class="overflow-hidden rounded-xl border border-base-300"
		style="height: 600px;"
	><GridTheme><Grid data={rows} columns={columns} init={init} /></GridTheme></div>

	<p class="mt-4 text-sm text-base-content/60">{rows.length} sites</p>
</main>
