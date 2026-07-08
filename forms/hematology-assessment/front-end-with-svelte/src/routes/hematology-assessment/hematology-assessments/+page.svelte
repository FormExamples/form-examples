<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleAssessmentRows } from '$lib/data/sample-reports';
	import { abnormalityLevelLabel } from '$lib/engine/utils';
	import type { AbnormalityLevel } from '$lib/engine/types';

	let levelFilter = $state('');
	let specimenFilter = $state('');
	let gridApi = $state<any>(null);

	const rows = $derived(
		sampleAssessmentRows.filter(
			(r) =>
				(levelFilter === '' || r.abnormalityLevel === levelFilter) &&
				(specimenFilter === '' || r.specimenType === specimenFilter)
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

	const specimenLabels: Record<string, string> = {
		edtaBlood: 'EDTA Blood',
		citratedBlood: 'Citrated Blood',
		serumSample: 'Serum Sample',
		boneMarrow: 'Bone Marrow',
		other: 'Other'
	};

	// SVAR DataGrid columns. The abnormality classification and composite score
	// render through the shared engine output so the dashboard and report stay
	// aligned.
	const columns = [
		{ id: 'id', header: 'Assessment', width: 120 },
		{ id: 'patientName', header: 'Patient', flexgrow: 2, sort: true },
		{ id: 'assessedDate', header: 'Assessed', width: 120, sort: true },
		{
			id: 'specimenType',
			header: 'Specimen',
			width: 130,
			sort: true,
			template: (v: string) => specimenLabels[v] ?? v ?? '—'
		},
		{
			id: 'abnormalityLevel',
			header: 'Classification',
			width: 170,
			sort: true,
			template: (v: string) => abnormalityLevelLabel(v as AbnormalityLevel)
		},
		{ id: 'abnormalityScore', header: 'Score', width: 90, sort: true, template: (v: number) => `${v}%` },
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true },
		{ id: 'transfusionFlag', header: 'Transf. rxn', width: 110, template: (v: boolean) => (v ? 'Yes' : 'No') },
		{ id: 'anticoagFlag', header: 'Anticoag.', width: 100, template: (v: boolean) => (v ? 'Yes' : 'No') }
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'patientName', order: 'asc' });
		// Open an assessment when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/hematology-assessment/hematology-assessments/${ev.id}`);
		});
	}
</script>

<main class="mx-auto max-w-6xl px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">Hematology clinician dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				Composite abnormality classification and score for assessed patients, computed by the shared
				engine. Select a row to open the assessment.
			</p>
		</div>
		<a href="/hematology-assessment/hematology-assessments/new" class="button" data-variant="primary">New assessment</a>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Classification</span>
			<select class="select inline-block w-auto" bind:value={levelFilter}>
				<option value="">All</option>
				<option value="normal">Normal</option>
				<option value="mildAbnormality">Mild Abnormality</option>
				<option value="moderateAbnormality">Moderate Abnormality</option>
				<option value="severeAbnormality">Severe Abnormality</option>
				<option value="critical">Critical</option>
				<option value="draft">Draft</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Specimen type</span>
			<select class="select inline-block w-auto" bind:value={specimenFilter}>
				<option value="">All</option>
				<option value="edtaBlood">EDTA Blood</option>
				<option value="citratedBlood">Citrated Blood</option>
				<option value="serumSample">Serum Sample</option>
				<option value="boneMarrow">Bone Marrow</option>
				<option value="other">Other</option>
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
