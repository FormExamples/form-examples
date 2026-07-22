<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleAssessmentRows } from '$lib/data/sample-reports';

	let severityFilter = $state('');
	let anticoagFilter = $state('');
	let gridApi = $state<any>(null);

	/** Map a NIHSS total score to a severity band key. */
	function band(score: number): string {
		if (score === 0) return 'none';
		if (score <= 4) return 'minor';
		if (score <= 15) return 'moderate';
		if (score <= 20) return 'moderate-severe';
		return 'severe';
	}

	const rows = $derived(
		sampleAssessmentRows.filter(
			(r) =>
				(severityFilter === '' || band(r.nihssScore) === severityFilter) &&
				(anticoagFilter === '' || (anticoagFilter === 'yes') === r.anticoagulantFlag)
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

	// SVAR DataGrid columns. The NIHSS score and severity render through the
	// shared engine output so the dashboard and report stay aligned.
	const columns = [
		{ id: 'id', header: 'Assessment', width: 120 },
		{ id: 'patientName', header: 'Patient', flexgrow: 2, sort: true },
		{ id: 'assessedDate', header: 'Assessed', width: 120, sort: true },
		{ id: 'nihssScore', header: 'NIHSS', width: 90, sort: true },
		{ id: 'nihssSeverity', header: 'Severity', flexgrow: 1, sort: true },
		{
			id: 'mrsScore',
			header: 'mRS',
			width: 80,
			sort: true,
			template: (v: number | null) => (v === null ? '—' : String(v))
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
			if (ev?.id != null) goto(`/neurology-assessment/neurology-assessments/${ev.id}`);
		});
	}
</script>

<main class="mx-16 px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">Neurology clinician dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				NIHSS score and severity band for assessed patients, computed by the shared engine. Select a
				row to open the assessment.
			</p>
		</div>
		<a href="/neurology-assessment/neurology-assessments/new" class="button" data-variant="primary">New assessment</a>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">NIHSS severity</span>
			<select class="select inline-block w-auto" bind:value={severityFilter}>
				<option value="">All</option>
				<option value="none">No stroke symptoms</option>
				<option value="minor">Minor (1–4)</option>
				<option value="moderate">Moderate (5–15)</option>
				<option value="moderate-severe">Moderate to severe (16–20)</option>
				<option value="severe">Severe (21–42)</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Anticoagulant</span>
			<select class="select inline-block w-auto" bind:value={anticoagFilter}>
				<option value="">All</option>
				<option value="yes">Yes</option>
				<option value="no">No</option>
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
