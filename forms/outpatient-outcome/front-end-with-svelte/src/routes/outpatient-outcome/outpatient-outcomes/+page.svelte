<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleAssessmentRows } from '$lib/data/sample-reports';

	let gradeFilter = $state('');
	let specialtyFilter = $state('');
	let gridApi = $state<any>(null);

	const specialties = $derived(
		[...new Set(sampleAssessmentRows.map((r) => r.specialty))].filter(Boolean).sort()
	);

	const rows = $derived(
		sampleAssessmentRows.filter(
			(r) =>
				(gradeFilter === '' || r.overallGrade === gradeFilter) &&
				(specialtyFilter === '' || r.specialty === specialtyFilter)
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

	const gradeCell = (v: string) => (v ? v : '—');

	// SVAR DataGrid columns. The four OOCG domain grades and the overall grade
	// render through the shared engine output so the dashboard and report stay
	// aligned.
	const columns = [
		{ id: 'id', header: 'Report', width: 130, sort: true },
		{ id: 'patientName', header: 'Patient', flexgrow: 2, sort: true },
		{ id: 'assessedDate', header: 'Clinic date', width: 120, sort: true },
		{ id: 'specialty', header: 'Specialty', width: 140, sort: true },
		{
			id: 'overallGrade',
			header: 'Overall',
			width: 100,
			sort: true,
			template: gradeCell
		},
		{ id: 'clinicalGrade', header: 'Clinical', width: 90, sort: true, template: gradeCell },
		{ id: 'promGrade', header: 'PROM', width: 80, sort: true, template: gradeCell },
		{ id: 'premGrade', header: 'PREM', width: 80, sort: true, template: gradeCell },
		{ id: 'operationalGrade', header: 'Operational', width: 110, sort: true, template: gradeCell },
		{
			id: 'waitTimeDays',
			header: 'Wait (d)',
			width: 90,
			sort: true,
			template: (v: number | null) => (v == null ? '—' : String(v))
		},
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'patientName', order: 'asc' });
		// Open a report when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/outpatient-outcome/outpatient-outcomes/${ev.id}`);
		});
	}
</script>

<main class="mx-auto max-w-6xl px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">Outpatient outcome dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				OOCG domain grades and overall grade for reported outpatient episodes, computed by the shared
				engine. Select a row to open the report.
			</p>
		</div>
		<a href="/outpatient-outcome/outpatient-outcomes/new" class="button" data-variant="primary">New report</a>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Overall grade</span>
			<select class="select inline-block w-auto" bind:value={gradeFilter}>
				<option value="">All</option>
				<option value="A">A — Excellent</option>
				<option value="B">B — Good</option>
				<option value="C">C — Unchanged</option>
				<option value="D">D — Poor</option>
				<option value="E">E — Very poor</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Specialty</span>
			<select class="select inline-block w-auto" bind:value={specialtyFilter}>
				<option value="">All</option>
				{#each specialties as s (s)}
					<option value={s}>{s}</option>
				{/each}
			</select>
		</label>
	</div>

	<div class="overflow-hidden rounded-xl border border-base-300" style="height: 600px;">
		<GridTheme>
			<Grid data={rows} {columns} {init} />
		</GridTheme>
	</div>

	<p class="mt-4 text-sm text-base-content/60">{rows.length} reports · overall grade is the worst of the four domains</p>
</main>
