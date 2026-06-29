<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleAssessmentRows } from '$lib/data/sample-reports';

	let riskFilter = $state('');
	let asaFilter = $state('');
	let gridApi = $state<any>(null);

	const rows = $derived(
		sampleAssessmentRows.filter(
			(r) =>
				(riskFilter === '' || r.compositeRisk === riskFilter) &&
				(asaFilter === '' || r.asaGrade === asaFilter)
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

	const riskLabel: Record<string, string> = {
		low: 'Low',
		moderate: 'Moderate',
		high: 'High',
		critical: 'Critical'
	};

	// SVAR DataGrid columns. The ASA grade, RCRI, STOP-BANG, CFS, composite risk,
	// and flag count all render through the shared engine output so the dashboard
	// and report stay aligned.
	const columns = [
		{ id: 'id', header: 'Assessment', width: 130 },
		{ id: 'patientName', header: 'Patient', flexgrow: 2, sort: true },
		{ id: 'assessedDate', header: 'Assessed', width: 120, sort: true },
		{ id: 'procedure', header: 'Procedure', flexgrow: 2 },
		{
			id: 'asaGrade',
			header: 'ASA',
			width: 80,
			sort: true,
			template: (v: string) => (v ? `ASA ${v}` : '—')
		},
		{ id: 'rcriScore', header: 'RCRI', width: 80, sort: true },
		{ id: 'stopbangScore', header: 'STOP-BANG', width: 110, sort: true },
		{
			id: 'frailtyScale',
			header: 'CFS',
			width: 80,
			sort: true,
			template: (v: number | null) => (v == null ? '—' : String(v))
		},
		{
			id: 'compositeRisk',
			header: 'Composite risk',
			width: 140,
			sort: true,
			template: (v: string) => riskLabel[v] ?? v
		},
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'patientName', order: 'asc' });
		// Open an assessment when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/pre-operative-assessments-by-clinician/${ev.id}`);
		});
	}
</script>

<main class="mx-auto max-w-6xl px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">Clinician pre-operative review dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				Computed ASA grade, adjunct scores (RCRI / STOP-BANG / CFS), and composite perioperative risk
				for assessed patients, computed by the shared engine. Select a row to open the assessment.
			</p>
		</div>
		<a href="/pre-operative-assessments-by-clinician/new" class="button" data-variant="primary">New assessment</a>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Composite risk</span>
			<select class="select inline-block w-auto" bind:value={riskFilter}>
				<option value="">All</option>
				<option value="low">Low</option>
				<option value="moderate">Moderate</option>
				<option value="high">High</option>
				<option value="critical">Critical</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">ASA grade</span>
			<select class="select inline-block w-auto" bind:value={asaFilter}>
				<option value="">All</option>
				<option value="I">ASA I</option>
				<option value="II">ASA II</option>
				<option value="III">ASA III</option>
				<option value="IV">ASA IV</option>
				<option value="V">ASA V</option>
				<option value="VI">ASA VI</option>
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
