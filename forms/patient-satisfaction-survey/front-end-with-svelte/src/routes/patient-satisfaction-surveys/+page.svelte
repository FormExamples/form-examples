<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleAssessmentRows } from '$lib/data/sample-reports';
	import { satisfactionCategoryLabel } from '$lib/engine/utils';
	import type { SatisfactionCategory } from '$lib/engine/types';

	let categoryFilter = $state('');
	let visitTypeFilter = $state('');
	let gridApi = $state<any>(null);

	const rows = $derived(
		sampleAssessmentRows.filter(
			(r) =>
				(categoryFilter === '' || r.category === categoryFilter) &&
				(visitTypeFilter === '' || r.visitType === visitTypeFilter)
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

	const visitTypeLabel: Record<string, string> = {
		outpatient: 'Outpatient',
		inpatient: 'Inpatient',
		'day-case': 'Day case',
		emergency: 'Emergency',
		telehealth: 'Telehealth',
		'home-visit': 'Home visit'
	};

	// SVAR DataGrid columns. Satisfaction score and category render through the
	// shared engine output so the dashboard and report stay aligned.
	const columns = [
		{ id: 'id', header: 'Survey', width: 120 },
		{ id: 'patientName', header: 'Patient', flexgrow: 2, sort: true },
		{ id: 'surveyedDate', header: 'Surveyed', width: 120, sort: true },
		{
			id: 'visitType',
			header: 'Visit type',
			width: 120,
			sort: true,
			template: (v: string) => visitTypeLabel[v] ?? (v || '—')
		},
		{ id: 'score', header: 'Score', width: 90, sort: true, template: (v: number) => `${v}/100` },
		{
			id: 'category',
			header: 'Satisfaction',
			width: 130,
			sort: true,
			template: (v: SatisfactionCategory) => satisfactionCategoryLabel(v)
		},
		{
			id: 'complaintFlag',
			header: 'Complaint',
			width: 100,
			template: (v: boolean) => (v ? 'Yes' : 'No')
		},
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'score', order: 'desc' });
		// Open a survey when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/patient-satisfaction-surveys/${ev.id}`);
		});
	}
</script>

<main class="mx-auto max-w-6xl px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">Patient satisfaction dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				Normalized satisfaction score and category for completed surveys, computed by the shared
				engine. Select a row to open the survey.
			</p>
		</div>
		<a href="/patient-satisfaction-surveys/new" class="button" data-variant="primary">New survey</a>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Satisfaction</span>
			<select class="select inline-block w-auto" bind:value={categoryFilter}>
				<option value="">All</option>
				<option value="excellent">Excellent</option>
				<option value="good">Good</option>
				<option value="satisfactory">Satisfactory</option>
				<option value="poor">Poor</option>
				<option value="very-poor">Very Poor</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Visit type</span>
			<select class="select inline-block w-auto" bind:value={visitTypeFilter}>
				<option value="">All</option>
				<option value="outpatient">Outpatient</option>
				<option value="inpatient">Inpatient</option>
				<option value="day-case">Day case</option>
				<option value="emergency">Emergency</option>
				<option value="telehealth">Telehealth</option>
				<option value="home-visit">Home visit</option>
			</select>
		</label>
	</div>

	<div class="overflow-hidden rounded-xl border border-base-300" style="height: 600px;">
		<GridTheme>
			<Grid data={rows} {columns} {init} />
		</GridTheme>
	</div>

	<p class="mt-4 text-sm text-base-content/60">{rows.length} surveys</p>
</main>
