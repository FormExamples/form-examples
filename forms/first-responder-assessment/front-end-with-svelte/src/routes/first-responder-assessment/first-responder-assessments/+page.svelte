<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleAssessmentRows } from '$lib/data/sample-reports';
	import {
		competencyLabel,
		fitnessDecisionLabel,
		riskLevelLabel
	} from '$lib/engine/utils';

	let fitnessFilter = $state('');
	let riskFilter = $state('');
	let gridApi = $state<any>(null);

	const rows = $derived(
		sampleAssessmentRows.filter(
			(r) =>
				(fitnessFilter === '' || r.overallFitness === fitnessFilter) &&
				(riskFilter === '' || r.overallRisk === riskFilter)
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

	const roleLabels: Record<string, string> = {
		paramedic: 'Paramedic',
		emt: 'EMT',
		'first-aider': 'First Aider',
		'advanced-paramedic': 'Advanced Paramedic',
		'community-responder': 'Community Responder',
		other: 'Other'
	};

	// SVAR DataGrid columns. Overall competency, fitness decision, and risk
	// render through the shared engine output so the dashboard and report stay
	// aligned.
	const columns = [
		{ id: 'id', header: 'Assessment', width: 120 },
		{ id: 'responderName', header: 'Responder', flexgrow: 2, sort: true },
		{ id: 'assessedDate', header: 'Assessed', width: 120, sort: true },
		{
			id: 'roleType',
			header: 'Role',
			width: 160,
			sort: true,
			template: (v: string) => roleLabels[v] ?? (v || '—')
		},
		{
			id: 'overallCompetency',
			header: 'Competency',
			width: 140,
			sort: true,
			template: (v: string) => competencyLabel(v as never)
		},
		{
			id: 'overallFitness',
			header: 'Fitness decision',
			width: 170,
			sort: true,
			template: (v: string) => fitnessDecisionLabel(v as never)
		},
		{
			id: 'overallRisk',
			header: 'Overall risk',
			width: 130,
			sort: true,
			template: (v: string) => riskLevelLabel(v as never)
		},
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'responderName', order: 'asc' });
		// Open an assessment when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/first-responder-assessment/first-responder-assessments/${ev.id}`);
		});
	}
</script>

<main class="mx-16 px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">First responder assessor dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				Overall competency, fitness decision, and risk for assessed responders, computed by the
				shared engine. Select a row to open the assessment.
			</p>
		</div>
		<a href="/first-responder-assessment/first-responder-assessments/new" class="button" data-variant="primary">New assessment</a>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Fitness decision</span>
			<select class="select inline-block w-auto" bind:value={fitnessFilter}>
				<option value="">All</option>
				<option value="fit-for-duty">Fit for Duty</option>
				<option value="fit-with-restrictions">Fit with Restrictions</option>
				<option value="temporarily-unfit">Temporarily Unfit</option>
				<option value="permanently-unfit">Permanently Unfit</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Overall risk</span>
			<select class="select inline-block w-auto" bind:value={riskFilter}>
				<option value="">All</option>
				<option value="low">Low</option>
				<option value="moderate">Moderate</option>
				<option value="high">High</option>
				<option value="critical">Critical</option>
			</select>
		</label>
	</div>

	<div class="overflow-hidden rounded-xl border border-base-300" style="height: 600px;">
		<GridTheme>
			<Grid data={rows} {columns} {init} />
		</GridTheme>
	</div>

	<p class="mt-4 text-sm text-base-content/60">{rows.length} responders</p>
</main>
