<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleAssessmentRows } from '$lib/data/sample-reports';
	import { riskLevelShortLabel } from '$lib/engine/utils';
	import type { RiskLevel } from '$lib/engine/types';

	let riskFilter = $state('');
	let deptFilter = $state('');

	const departments = $derived(
		Array.from(new Set(sampleAssessmentRows.map((r) => r.department))).sort()
	);

	const rows = $derived(
		sampleAssessmentRows.filter(
			(r) =>
				(riskFilter === '' || r.overallRisk === riskFilter) &&
				(deptFilter === '' || r.department === deptFilter)
		)
	);

	// Follow the active Lily theme: pick the dark SVAR skin when the theme's base
	// surface is dark. Recomputed whenever <html data-theme> changes (after the
	// new theme stylesheet has applied its tokens).
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

	// SVAR DataGrid columns. The overall concern level and worst domain render
	// through the shared engine output so the dashboard and report stay aligned.
	const columns = [
		{ id: 'id', header: 'Response', width: 130 },
		{ id: 'department', header: 'Department / team', flexgrow: 2, sort: true },
		{ id: 'tenureBand', header: 'Tenure', width: 130, sort: true },
		{ id: 'submittedDate', header: 'Submitted', width: 120, sort: true },
		{
			id: 'overallRisk',
			header: 'Overall concern',
			width: 140,
			sort: true,
			template: (v: string) => riskLevelShortLabel(v as RiskLevel)
		},
		{ id: 'worstDomain', header: 'Worst domain', width: 160, sort: true },
		{ id: 'answeredCount', header: 'Answered', width: 100, sort: true },
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	function init(api: { exec: (a: string, b: unknown) => void; on: (e: string, cb: (ev: { id?: string | number }) => void) => void }) {
		api.exec('sort-rows', { key: 'overallRisk', order: 'desc' });
		// Open a response when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/workplace-stress-assessments/${ev.id}`);
		});
	}
</script>

<main class="mx-auto max-w-6xl px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">Occupational-health dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				Anonymous survey responses with their overall HSE concern level and worst-scoring domain,
				computed by the shared engine. Select a row to open the response.
			</p>
		</div>
		<a href="/workplace-stress-assessments/new" class="button" data-variant="primary">New survey</a>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Overall concern</span>
			<select class="select inline-block w-auto" bind:value={riskFilter}>
				<option value="">All</option>
				<option value="low">Low</option>
				<option value="moderate">Moderate</option>
				<option value="high">High</option>
				<option value="very-high">Very High</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Department</span>
			<select class="select inline-block w-auto" bind:value={deptFilter}>
				<option value="">All</option>
				{#each departments as dept (dept)}
					<option value={dept}>{dept}</option>
				{/each}
			</select>
		</label>
	</div>

	<div class="overflow-hidden rounded-xl border border-base-300" style="height: 600px;">
		<GridTheme>
			<Grid data={rows} {columns} {init} />
		</GridTheme>
	</div>

	<p class="mt-4 text-sm text-base-content/60">{rows.length} responses</p>
</main>
