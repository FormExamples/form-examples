<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleOperationNoteRows } from '$lib/data/sample-reports';
	import { compositeRiskLabel, clavienDindoLabel } from '$lib/engine/utils';

	let riskFilter = $state('');
	let urgencyFilter = $state('');
	let gridApi = $state<any>(null);

	const rows = $derived(
		sampleOperationNoteRows.filter(
			(r) =>
				(riskFilter === '' || r.compositeRisk === riskFilter) &&
				(urgencyFilter === '' || r.urgency === urgencyFilter)
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

	// SVAR DataGrid columns. The composite risk, Clavien–Dindo grade, blood-loss
	// band, counts state, never-event flag, and flag count all render through the
	// shared engine output so the dashboard and report stay aligned.
	const columns = [
		{ id: 'id', header: 'Note', width: 120 },
		{ id: 'patientName', header: 'Patient', width: 150, sort: true },
		{ id: 'hospital', header: 'Hospital', flexgrow: 2, sort: true },
		{ id: 'surgeon', header: 'Lead surgeon', width: 150, sort: true },
		{ id: 'procedure', header: 'Primary procedure (OPCS-4)', flexgrow: 3, sort: true },
		{ id: 'urgency', header: 'Urgency', width: 110, sort: true },
		{
			id: 'compositeRisk',
			header: 'Composite risk',
			width: 130,
			sort: true,
			template: (v: string) => compositeRiskLabel(v as never)
		},
		{
			id: 'clavienDindoGrade',
			header: 'Clavien–Dindo',
			width: 130,
			sort: true,
			template: (v: string) => clavienDindoLabel(v as never)
		},
		{ id: 'estimatedBloodLossMl', header: 'EBL (mL)', width: 100, sort: true },
		{ id: 'countsAgreed', header: 'Counts', width: 90, template: (v: boolean) => (v ? 'Agreed' : 'Discrepancy') },
		{ id: 'neverEventFlagged', header: 'Never event', width: 110, template: (v: boolean) => (v ? 'Yes' : 'No') },
		{ id: 'recoveryDestination', header: 'Recovery', width: 110, sort: true },
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true },
		{ id: 'signed', header: 'Signed', width: 90, template: (v: boolean) => (v ? 'Yes' : 'No') }
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'patientName', order: 'asc' });
		// Open a note when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/medical-operation-notes/${ev.id}`);
		});
	}
</script>

<main class="mx-auto max-w-6xl px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">Operation-note clinician dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				Composite operative risk, Clavien–Dindo grade, blood loss, counts, and safety flags for
				recorded operations, computed by the shared engine. Select a row to open the note.
			</p>
		</div>
		<a href="/medical-operation-notes/new" class="button" data-variant="primary">New note</a>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Composite risk</span>
			<select class="select inline-block w-auto" bind:value={riskFilter}>
				<option value="">All</option>
				<option value="routine">Routine</option>
				<option value="complicated">Complicated</option>
				<option value="high-risk">High-risk</option>
				<option value="critical">Critical</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Urgency</span>
			<select class="select inline-block w-auto" bind:value={urgencyFilter}>
				<option value="">All</option>
				<option value="elective">Elective</option>
				<option value="scheduled">Scheduled</option>
				<option value="urgent">Urgent</option>
				<option value="immediate">Immediate</option>
			</select>
		</label>
	</div>

	<div class="overflow-hidden rounded-xl border border-base-300" style="height: 600px;">
		<GridTheme>
			<Grid data={rows} {columns} {init} />
		</GridTheme>
	</div>

	<p class="mt-4 text-sm text-base-content/60">{rows.length} operations</p>
</main>
