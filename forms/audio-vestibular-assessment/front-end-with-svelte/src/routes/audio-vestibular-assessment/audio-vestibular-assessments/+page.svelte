<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleAssessmentRows } from '$lib/data/sample-reports';
	import {
		hearingLossGradeShort,
		dhiHandicapShort
	} from '$lib/engine/utils';
	import type { HearingLossGrade, DhiHandicapLevel } from '$lib/engine/types';

	let hearingFilter = $state('');
	let handicapFilter = $state('');
	let gridApi = $state<any>(null);

	const rows = $derived(
		sampleAssessmentRows.filter(
			(r) =>
				(hearingFilter === '' || r.hearingLossGrade === hearingFilter) &&
				(handicapFilter === '' || r.dhiHandicapLevel === handicapFilter)
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

	// SVAR DataGrid columns. The WHO hearing-loss grade and DHI handicap level
	// render through the shared engine output so the dashboard and report stay
	// aligned.
	const columns = [
		{ id: 'id', header: 'Assessment', width: 120 },
		{ id: 'patientName', header: 'Patient', flexgrow: 2, sort: true },
		{ id: 'assessedDate', header: 'Assessed', width: 120, sort: true },
		{
			id: 'betterEarPta',
			header: 'Better-ear PTA',
			width: 130,
			sort: true,
			template: (v: number | null) => (v == null ? '—' : `${v} dB`)
		},
		{
			id: 'hearingLossGrade',
			header: 'WHO hearing grade',
			width: 170,
			sort: true,
			template: (v: HearingLossGrade) => hearingLossGradeShort(v)
		},
		{ id: 'dhiTotal', header: 'DHI', width: 80, sort: true },
		{
			id: 'dhiHandicapLevel',
			header: 'DHI handicap',
			width: 140,
			sort: true,
			template: (v: DhiHandicapLevel) => dhiHandicapShort(v)
		},
		{
			id: 'vestibularFlag',
			header: 'Vestibular',
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
			if (ev?.id != null) goto(`/audio-vestibular-assessment/audio-vestibular-assessments/${ev.id}`);
		});
	}
</script>

<main class="mx-16 px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">Audio-vestibular clinician dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				WHO hearing-loss grade and Dizziness Handicap Inventory results for assessed patients,
				computed by the shared engine. Select a row to open the assessment.
			</p>
		</div>
		<a href="/audio-vestibular-assessment/audio-vestibular-assessments/new" class="button" data-variant="primary">New assessment</a>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">WHO hearing grade</span>
			<select class="select inline-block w-auto" bind:value={hearingFilter}>
				<option value="">All</option>
				<option value="normal">Normal</option>
				<option value="mild">Mild</option>
				<option value="moderate">Moderate</option>
				<option value="moderately-severe">Moderately Severe</option>
				<option value="severe">Severe</option>
				<option value="profound">Profound</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">DHI handicap</span>
			<select class="select inline-block w-auto" bind:value={handicapFilter}>
				<option value="">All</option>
				<option value="no-handicap">No Handicap</option>
				<option value="mild">Mild</option>
				<option value="moderate">Moderate</option>
				<option value="severe">Severe</option>
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
