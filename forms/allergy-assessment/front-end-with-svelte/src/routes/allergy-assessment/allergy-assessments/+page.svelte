<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/env';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleAssessmentRows } from '#lib/data/sample-reports.js';
	import { severityLabel } from '#lib/engine/utils.js';

	let severityFilter = $state('');
	let anaphylaxisFilter = $state('');
	let gridApi = $state<any>(null);

	const rows = $derived(
		sampleAssessmentRows.filter(
			(r) =>
				(severityFilter === '' || r.severityLevel === severityFilter) &&
				(anaphylaxisFilter === '' || String(r.anaphylaxisFlag) === anaphylaxisFilter)
		)
	);

	// Follow the active Lily theme: dark SVAR skin when the base surface is dark.
	let isDark = $state(false);
	function computeDark(): boolean {
		if (!browser) return false;
		const v = getComputedStyle(document.documentElement).getPropertyValue('--color-base-100').trim();
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

	const columns = [
		{ id: 'id', header: 'Assessment', width: 120 },
		{
			id: 'patientName',
			header: 'Patient',
			flexgrow: 2,
			sort: true
		},

		{
			id: 'assessedDate',
			header: 'Assessed',
			width: 120,
			sort: true
		},

		{
			id: 'severityLevel',
			header: 'Severity',
			width: 130,
			sort: true,
			template: (v: string) => severityLabel(v as never)
		},
		{ id: 'allergenCount', header: 'Allergens', width: 110, sort: true },
		{ id: 'burdenScore', header: 'Burden', width: 100, sort: true },
		{
			id: 'anaphylaxisFlag',
			header: 'Anaphylaxis',
			width: 120,
			template: (v: boolean) => v ? 'Yes' : 'No'
		},
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'patientName', order: 'asc' });
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/allergy-assessment/allergy-assessments/${ev.id}`);
		});
	}
</script>

<main class="mx-16 px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">Allergy clinician dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				Allergy severity, burden score, and anaphylaxis risk for assessed patients, computed by the
				shared engine. Select a row to open the assessment.
			</p>
		</div>
		<a href="/allergy-assessment/allergy-assessments/new" class="button" data-variant="primary">New assessment</a>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Severity</span>
			<select class="select inline-block w-auto" bind:value={severityFilter}>
				<option value="">All</option>
				<option value="mild">Mild</option>
				<option value="moderate">Moderate</option>
				<option value="severe">Severe</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Anaphylaxis</span>
			<select class="select inline-block w-auto" bind:value={anaphylaxisFilter}>
				<option value="">All</option>
				<option value="true">Yes</option>
				<option value="false">No</option>
			</select>
		</label>
	</div>

	<div
		class="overflow-hidden rounded-xl border border-base-300"
		style="height: 600px;"
	><GridTheme><Grid data={rows} columns={columns} init={init} /></GridTheme></div>

	<p class="mt-4 text-sm text-base-content/60">{rows.length} patients</p>
</main>
