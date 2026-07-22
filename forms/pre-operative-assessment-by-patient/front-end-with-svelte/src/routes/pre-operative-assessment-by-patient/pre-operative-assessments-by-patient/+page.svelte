<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleAssessmentRows } from '$lib/data/sample-reports';

	let asaFilter = $state('');
	let urgencyFilter = $state('');
	let gridApi = $state<any>(null);

	const rows = $derived(
		sampleAssessmentRows.filter(
			(r) =>
				(asaFilter === '' || String(r.asaGrade) === asaFilter) &&
				(urgencyFilter === '' || r.procedureUrgency === urgencyFilter)
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

	const roman = ['I', 'II', 'III', 'IV', 'V'];

	// SVAR DataGrid columns. The ASA grade and safety flags render through the
	// shared engine output so the dashboard and report stay aligned.
	const columns = [
		{ id: 'id', header: 'Assessment', width: 120 },
		{ id: 'patientName', header: 'Patient', flexgrow: 2, sort: true },
		{ id: 'assessedDate', header: 'Assessed', width: 120, sort: true },
		{
			id: 'asaGrade',
			header: 'ASA grade',
			width: 110,
			sort: true,
			template: (v: number) => `ASA ${roman[v - 1] ?? v}`
		},
		{
			id: 'procedureUrgency',
			header: 'Urgency',
			width: 120,
			sort: true,
			template: (v: string) => (v ? v.charAt(0).toUpperCase() + v.slice(1) : '—')
		},
		{ id: 'airwayFlag', header: 'Airway', width: 90, template: (v: boolean) => (v ? 'Yes' : 'No') },
		{
			id: 'allergyFlag',
			header: 'Allergy',
			width: 90,
			template: (v: boolean) => (v ? 'Yes' : 'No')
		},
		{
			id: 'anticoagulantFlag',
			header: 'Anticoag.',
			width: 100,
			template: (v: boolean) => (v ? 'Yes' : 'No')
		},
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'patientName', order: 'asc' });
		// Open an assessment when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/pre-operative-assessment-by-patient/pre-operative-assessments-by-patient/${ev.id}`);
		});
	}
</script>

<main class="mx-16 px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">Pre-operative clinician dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				ASA Physical Status grade and safety flags for assessed patients, computed by the shared
				engine. Select a row to open the assessment.
			</p>
		</div>
		<a href="/pre-operative-assessment-by-patient/pre-operative-assessments-by-patient/new" class="button" data-variant="primary"
			>New assessment</a
		>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">ASA grade</span>
			<select class="select inline-block w-auto" bind:value={asaFilter}>
				<option value="">All</option>
				<option value="1">ASA I</option>
				<option value="2">ASA II</option>
				<option value="3">ASA III</option>
				<option value="4">ASA IV</option>
				<option value="5">ASA V</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Procedure urgency</span>
			<select class="select inline-block w-auto" bind:value={urgencyFilter}>
				<option value="">All</option>
				<option value="elective">Elective</option>
				<option value="urgent">Urgent</option>
				<option value="emergency">Emergency</option>
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
