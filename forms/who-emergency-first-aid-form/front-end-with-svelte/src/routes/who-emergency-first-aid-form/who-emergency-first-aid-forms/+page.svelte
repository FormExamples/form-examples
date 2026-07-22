<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleAssessmentRows } from '$lib/data/sample-reports';
	import { priorityLabel } from '$lib/engine/utils';
	import type { FlagPriority } from '$lib/engine/types';

	let problemFilter = $state('');
	let statusFilter = $state('');
	let gridApi = $state<any>(null);

	const rows = $derived(
		sampleAssessmentRows.filter(
			(r) =>
				(problemFilter === '' || r.problemType === problemFilter) &&
				(statusFilter === '' ||
					(statusFilter === 'complete' ? r.complete : !r.complete))
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

	const problemLabel = (v: string) =>
		v === 'medical' ? 'Medical' : v === 'trauma' ? 'Trauma' : v === 'both' ? 'Medical + Trauma' : '—';

	// SVAR DataGrid columns. Completeness status and flag counts render through
	// the shared engine output so the dashboard and report stay aligned.
	const columns = [
		{ id: 'id', header: 'Encounter', width: 130 },
		{ id: 'patientName', header: 'Patient', flexgrow: 2, sort: true },
		{ id: 'recordedDate', header: 'Recorded', width: 120, sort: true },
		{
			id: 'problemType',
			header: 'Problem',
			width: 140,
			sort: true,
			template: (v: string) => problemLabel(v)
		},
		{
			id: 'complete',
			header: 'Status',
			width: 120,
			sort: true,
			template: (v: boolean) => (v ? 'Complete' : 'Incomplete')
		},
		{ id: 'urgentFlags', header: 'Urgent', width: 90, sort: true },
		{ id: 'totalFlags', header: 'Flags', width: 80, sort: true },
		{
			id: 'topPriority',
			header: 'Top priority',
			width: 120,
			template: (v: FlagPriority | null) => (v ? priorityLabel(v) : '—')
		},
		{
			id: 'tourniquet',
			header: 'Tourniquet',
			width: 110,
			template: (v: boolean) => (v ? 'Yes' : 'No')
		},
		{ id: 'recordedBy', header: 'Recorded by (CFAR)', flexgrow: 1, sort: true }
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'recordedDate', order: 'desc' });
		// Open an encounter when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/who-emergency-first-aid-form/who-emergency-first-aid-forms/${ev.id}`);
		});
	}
</script>

<main class="mx-16 px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">Emergency first aid clinician dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				Completeness status and flagged issues for recorded CFAR encounters, computed by the shared
				engine. Select a row to open the encounter.
			</p>
		</div>
		<a href="/who-emergency-first-aid-form/who-emergency-first-aid-forms/new" class="button" data-variant="primary">New encounter</a>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Problem type</span>
			<select class="select inline-block w-auto" bind:value={problemFilter}>
				<option value="">All</option>
				<option value="medical">Medical</option>
				<option value="trauma">Trauma</option>
				<option value="both">Medical + Trauma</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Status</span>
			<select class="select inline-block w-auto" bind:value={statusFilter}>
				<option value="">All</option>
				<option value="complete">Complete</option>
				<option value="incomplete">Incomplete</option>
			</select>
		</label>
	</div>

	<div class="overflow-hidden rounded-xl border border-base-300" style="height: 600px;">
		<GridTheme>
			<Grid data={rows} {columns} {init} />
		</GridTheme>
	</div>

	<p class="mt-4 text-sm text-base-content/60">{rows.length} encounters</p>
</main>
