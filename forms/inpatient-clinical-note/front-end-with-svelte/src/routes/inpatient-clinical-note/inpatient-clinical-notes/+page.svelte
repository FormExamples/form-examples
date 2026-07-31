<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { browser } from '$app/environment';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleAssessmentRows } from '$lib/data/sample-reports';
	import { acuityLabel, noteTypeShortLabel, statusLabel } from '$lib/engine/utils';

	let statusFilter = $state('');
	let acuityFilter = $state('');
	let wardFilter = $state('');
	let gridApi = $state<any>(null);

	const wards = $derived(
		Array.from(new Set(sampleAssessmentRows.map((r) => r.wardName).filter(Boolean))).sort()
	);

	const rows = $derived(
		sampleAssessmentRows.filter(
			(r) =>
				(statusFilter === '' || r.status === statusFilter) &&
				(acuityFilter === '' || r.acuityBand === acuityFilter) &&
				(wardFilter === '' || r.wardName === wardFilter)
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

	// SVAR DataGrid columns. Completeness status, completeness percentage, and
	// the safety-flag counts render through the shared engine output so the
	// dashboard and report stay aligned.
	const columns = [
		{ id: 'id', header: 'Note', width: 90 },
		{ id: 'hospitalMrn', header: 'Patient ID', width: 130, sort: true },
		{ id: 'patientName', header: 'Patient', flexgrow: 2, sort: true },
		{ id: 'wardName', header: 'Ward', flexgrow: 2, sort: true },
		{
			id: 'noteType',
			header: 'Note type',
			width: 120,
			sort: true,
			template: (v: string) => noteTypeShortLabel(v)
		},
		{ id: 'authorGrade', header: 'Author', width: 100, sort: true },
		{ id: 'noteDate', header: 'Date', width: 120, sort: true },
		{
			id: 'status',
			header: 'Completeness',
			width: 140,
			sort: true,
			template: (v: string) => statusLabel(v as never)
		},
		{
			id: 'completenessPercent',
			header: '%',
			width: 70,
			sort: true,
			template: (v: number) => `${v}%`
		},
		{
			id: 'acuityBand',
			header: 'Acuity',
			width: 110,
			sort: true,
			template: (v: string) => acuityLabel(v as never)
		},
		{
			id: 'news2Total',
			header: 'NEWS2',
			width: 90,
			sort: true,
			template: (v: number | null) => (v === null || v === undefined ? '—' : String(v))
		},
		{ id: 'highFlagCount', header: 'High flags', width: 110, sort: true },
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	function init(api: any) {
		gridApi = api;
		// Sort by acuity descending so the sickest patients are at the top.
		api.exec('sort-rows', { key: 'acuityBand', order: 'desc' });
		// Open a note when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`${base}/inpatient-clinical-note/inpatient-clinical-notes/${ev.id}`);
		});
	}
</script>

<main class="mx-16 px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">Inpatient clinical note dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				Both gradings side by side — documentation completeness and clinical acuity — with NEWS2 and
				safety-flag counts, computed by the shared engine. Sorted by acuity so the sickest patients
				are at the top. Select a row to open the note.
			</p>
		</div>
		<a href="{base}/inpatient-clinical-note/inpatient-clinical-notes/new" class="button" data-variant="primary">New note</a>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Completeness</span>
			<select class="select inline-block w-auto" bind:value={statusFilter}>
				<option value="">All</option>
				<option value="complete">Complete</option>
				<option value="partial">Partial</option>
				<option value="incomplete">Incomplete</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Acuity</span>
			<select class="select inline-block w-auto" bind:value={acuityFilter}>
				<option value="">All</option>
				<option value="stable">Stable</option>
				<option value="watch">Watch</option>
				<option value="escalate">Escalate</option>
				<option value="critical">Critical</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Ward</span>
			<select class="select inline-block w-auto" bind:value={wardFilter}>
				<option value="">All</option>
				{#each wards as w (w)}
					<option value={w}>{w}</option>
				{/each}
			</select>
		</label>
	</div>

	<div class="overflow-hidden rounded-xl border border-base-300" style="height: 600px;">
		<GridTheme>
			<Grid data={rows} {columns} {init} />
		</GridTheme>
	</div>

	<p class="mt-4 text-sm text-base-content/60">{rows.length} notes</p>
</main>
