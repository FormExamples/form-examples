<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/env';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleAssessmentRows } from '#lib/data/sample-reports.js';
	import { riskTierLabel, careSettingLabel } from '#lib/engine/utils.js';

	let settingFilter = $state('');
	let tierFilter = $state('');
	let gridApi = $state<any>(null);

	const rows = $derived(
		sampleAssessmentRows.filter(
			(r) =>
				(settingFilter === '' || r.careSetting === settingFilter) &&
				(tierFilter === '' || r.riskTier === tierFilter)
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

	// SVAR DataGrid columns. Ideation level, risk tier, and the escalation flag
	// render through the shared engine output so the dashboard and report stay
	// aligned.
	const columns = [
		{ id: 'id', header: 'Assessment', width: 150 },
		{
			id: 'patientIdentifier',
			header: 'Patient ID',
			width: 130,
			sort: true
		},

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
			id: 'careSetting',
			header: 'Care setting',
			flexgrow: 2,
			sort: true,
			template: (v: string) => careSettingLabel(v as never) || '—'
		},

		{
			id: 'ideationLevel',
			header: 'Ideation',
			width: 100,
			sort: true
		},

		{
			id: 'riskTier',
			header: 'Risk tier',
			width: 140,
			sort: true,
			template: (v: string) => riskTierLabel(v as never)
		},
		{
			id: 'escalationFlag',
			header: 'Escalate',
			width: 100,
			template: (v: boolean) => v ? 'Yes' : 'No'
		},
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'patientName', order: 'asc' });
		// Open an assessment when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/columbia-suicide-severity-rating-scale/columbia-suicide-severity-rating-scales/${ev.id}`);
		});
	}
</script>

<main class="mx-16 px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">C-SSRS clinician dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				Ideation level, risk tier, and safety flags for assessed patients, computed by the shared
				engine. Select a row to open the assessment.
			</p>
		</div>
		<a href="/columbia-suicide-severity-rating-scale/columbia-suicide-severity-rating-scales/new" class="button" data-variant="primary"
			>New assessment</a
		>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Care setting</span>
			<select class="select inline-block w-auto" bind:value={settingFilter}>
				<option value="">All</option>
				<option value="mental-health">Mental-health service</option>
				<option value="emergency-department">Emergency department</option>
				<option value="primary-care">Primary care</option>
				<option value="crisis-service">Crisis service</option>
				<option value="inpatient">Inpatient ward</option>
				<option value="other">Other</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Risk tier</span>
			<select class="select inline-block w-auto" bind:value={tierFilter}>
				<option value="">All</option>
				<option value="low">Low risk</option>
				<option value="moderate">Moderate risk</option>
				<option value="high">High risk</option>
			</select>
		</label>
	</div>

	<div
		class="overflow-hidden rounded-xl border border-base-300"
		style="height: 600px;"
	><GridTheme><Grid data={rows} columns={columns} init={init} /></GridTheme></div>

	<p class="mt-4 text-sm text-base-content/60">{rows.length} patients</p>
</main>
