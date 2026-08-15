<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/env';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleAssessmentRows } from '#lib/data/sample-reports.js';
	import { diseaseActivityLabel, diagnosisLabel } from '#lib/engine/utils.js';
	import type { DiseaseActivity, DiseaseHistory } from '#lib/engine/types.js';

	let activityFilter = $state('');
	let diagnosisFilter = $state('');
	let gridApi = $state<any>(null);

	const rows = $derived(
		sampleAssessmentRows.filter(
			(r) =>
				(activityFilter === '' || r.diseaseActivity === activityFilter) &&
				(diagnosisFilter === '' || r.diagnosis === diagnosisFilter)
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

	// SVAR DataGrid columns. The DAS28 score and disease activity render through
	// the shared engine output so the dashboard and report stay aligned.
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
			id: 'diagnosis',
			header: 'Diagnosis',
			width: 160,
			sort: true,
			template: (v: DiseaseHistory['primaryDiagnosis']) => diagnosisLabel(v)
		},
		{
			id: 'das28Score',
			header: 'DAS28',
			width: 90,
			sort: true,
			template: (v: number | null) => v === null ? '—' : v.toFixed(2)
		},
		{
			id: 'diseaseActivity',
			header: 'Disease activity',
			width: 160,
			sort: true,
			template: (v: DiseaseActivity | null) => diseaseActivityLabel(v)
		},

		{
			id: 'allergyFlag',
			header: 'Allergy',
			width: 90,
			template: (v: boolean) => v ? 'Yes' : 'No'
		},

		{
			id: 'biologicFlag',
			header: 'Biologic',
			width: 95,
			template: (v: boolean) => v ? 'Yes' : 'No'
		},
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'patientName', order: 'asc' });
		// Open an assessment when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/rheumatology-assessment/rheumatology-assessments/${ev.id}`);
		});
	}
</script>

<main class="mx-16 px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">Rheumatology clinician dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				DAS28 disease activity score and classification for assessed patients, computed by the shared
				engine. Select a row to open the assessment.
			</p>
		</div>
		<a href="/rheumatology-assessment/rheumatology-assessments/new" class="button" data-variant="primary">New assessment</a>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Disease activity</span>
			<select class="select inline-block w-auto" bind:value={activityFilter}>
				<option value="">All</option>
				<option value="remission">Remission</option>
				<option value="low">Low</option>
				<option value="moderate">Moderate</option>
				<option value="high">High</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Diagnosis</span>
			<select class="select inline-block w-auto" bind:value={diagnosisFilter}>
				<option value="">All</option>
				<option value="rheumatoid-arthritis">Rheumatoid arthritis</option>
				<option value="psoriatic-arthritis">Psoriatic arthritis</option>
				<option value="ankylosing-spondylitis">Ankylosing spondylitis</option>
				<option value="systemic-lupus">Systemic lupus</option>
				<option value="gout">Gout</option>
				<option value="osteoarthritis">Osteoarthritis</option>
				<option value="other">Other</option>
			</select>
		</label>
	</div>

	<div
		class="overflow-hidden rounded-xl border border-base-300"
		style="height: 600px;"
	><GridTheme><Grid data={rows} columns={columns} init={init} /></GridTheme></div>

	<p class="mt-4 text-sm text-base-content/60">{rows.length} patients</p>
</main>
