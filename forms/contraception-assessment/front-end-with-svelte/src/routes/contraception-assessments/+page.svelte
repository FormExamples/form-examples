<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleAssessmentRows } from '$lib/data/sample-reports';
	import { ukmecCategory } from '$lib/engine/utils';

	let ukmecFilter = $state('');
	let flaggedFilter = $state('');
	let gridApi = $state<any>(null);

	const rows = $derived(
		sampleAssessmentRows.filter(
			(r) =>
				(ukmecFilter === '' || String(r.ukmecCategory) === ukmecFilter) &&
				(flaggedFilter === '' ||
					(flaggedFilter === 'flagged' ? r.flagCount > 0 : r.flagCount === 0))
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

	// SVAR DataGrid columns. The overall UKMEC category and the preferred-method
	// category render through the shared engine output so the dashboard and the
	// report stay aligned.
	const columns = [
		{ id: 'id', header: 'Assessment', width: 130 },
		{ id: 'patientName', header: 'Patient', flexgrow: 2, sort: true },
		{ id: 'assessedDate', header: 'Assessed', width: 120, sort: true },
		{
			id: 'ukmecCategory',
			header: 'Overall UKMEC',
			width: 220,
			sort: true,
			template: (v: number) => `UKMEC ${v} — ${ukmecCategory(v as 1 | 2 | 3 | 4)}`
		},
		{ id: 'preferredMethod', header: 'Preferred method', flexgrow: 2, sort: true },
		{
			id: 'preferredMethodCategory',
			header: 'Preferred UKMEC',
			width: 130,
			sort: true,
			template: (v: number | null) => (v ? `UKMEC ${v}` : '—')
		},
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'patientName', order: 'asc' });
		// Open an assessment when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/contraception-assessments/${ev.id}`);
		});
	}
</script>

<main class="mx-auto max-w-6xl px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">Contraception clinician dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				Overall UKMEC category and preferred-method eligibility for assessed patients, computed by the
				shared engine. Select a row to open the assessment.
			</p>
		</div>
		<a href="/contraception-assessments/new" class="button" data-variant="primary">New assessment</a>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Overall UKMEC</span>
			<select class="select inline-block w-auto" bind:value={ukmecFilter}>
				<option value="">All</option>
				<option value="1">UKMEC 1 — No restriction</option>
				<option value="2">UKMEC 2 — Advantages outweigh risks</option>
				<option value="3">UKMEC 3 — Risks outweigh advantages</option>
				<option value="4">UKMEC 4 — Unacceptable health risk</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Flagged issues</span>
			<select class="select inline-block w-auto" bind:value={flaggedFilter}>
				<option value="">All</option>
				<option value="flagged">Has flags</option>
				<option value="none">No flags</option>
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
