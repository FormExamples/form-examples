<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleAssessmentRows } from '$lib/data/sample-reports';
	import { riskLevelLabel, asaClassShort, mallampatiShort } from '$lib/engine/utils';
	import type { AsaClass, MallampatiClass, RiskLevel } from '$lib/engine/types';

	let riskFilter = $state('');
	let asaFilter = $state('');
	let gridApi = $state<any>(null);

	const rows = $derived(
		sampleAssessmentRows.filter(
			(r) =>
				(riskFilter === '' || r.riskLevel === riskFilter) &&
				(asaFilter === '' || r.asaClass === asaFilter)
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

	// SVAR DataGrid columns. The ASA / Mallampati classes, RCRI and STOP-BANG
	// scores, and the composite risk all render through the shared engine output
	// so the dashboard and report stay aligned.
	const columns = [
		{ id: 'id', header: 'Assessment', width: 120 },
		{ id: 'patientName', header: 'Patient', flexgrow: 2, sort: true },
		{ id: 'assessedDate', header: 'Assessed', width: 120, sort: true },
		{
			id: 'asaClass',
			header: 'ASA',
			width: 90,
			sort: true,
			template: (v: AsaClass) => asaClassShort(v)
		},
		{
			id: 'mallampatiClass',
			header: 'Mallampati',
			width: 110,
			sort: true,
			template: (v: MallampatiClass) => mallampatiShort(v)
		},
		{ id: 'rcriScore', header: 'RCRI', width: 80, sort: true },
		{ id: 'stopbangScore', header: 'STOP-BANG', width: 110, sort: true },
		{
			id: 'riskLevel',
			header: 'Overall risk',
			width: 130,
			sort: true,
			template: (v: RiskLevel) => riskLevelLabel(v)
		},
		{ id: 'airwayFlag', header: 'Difficult airway', width: 140, template: (v: boolean) => (v ? 'Yes' : 'No') },
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'patientName', order: 'asc' });
		// Open an assessment when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/anesthesiology-assessments/${ev.id}`);
		});
	}
</script>

<main class="mx-auto max-w-6xl px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">Anaesthetist dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				ASA / Mallampati classification, RCRI and STOP-BANG scores, and composite perioperative risk
				for assessed patients, computed by the shared engine. Select a row to open the assessment.
			</p>
		</div>
		<a href="/anesthesiology-assessments/new" class="button" data-variant="primary">New assessment</a>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Overall risk</span>
			<select class="select inline-block w-auto" bind:value={riskFilter}>
				<option value="">All</option>
				<option value="low">Low</option>
				<option value="medium">Moderate</option>
				<option value="high">High</option>
				<option value="critical">Critical</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">ASA class</span>
			<select class="select inline-block w-auto" bind:value={asaFilter}>
				<option value="">All</option>
				<option value="i">ASA I</option>
				<option value="ii">ASA II</option>
				<option value="iii">ASA III</option>
				<option value="iv">ASA IV</option>
				<option value="v">ASA V</option>
				<option value="vi">ASA VI</option>
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
