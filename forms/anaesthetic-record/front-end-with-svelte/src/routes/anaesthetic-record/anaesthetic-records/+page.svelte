<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleAssessmentRows } from '$lib/data/sample-reports';
	import { statusLabel, urgencyLabel } from '$lib/engine/utils';

	let urgencyFilter = $state('');
	let statusFilter = $state('');
	let gridApi = $state<any>(null);

	const rows = $derived(
		sampleAssessmentRows.filter(
			(r) =>
				(urgencyFilter === '' || r.urgency === urgencyFilter) &&
				(statusFilter === '' || r.status === statusFilter)
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

	// SVAR DataGrid columns. Completeness status, percent, and flag count render
	// through the shared engine output so the dashboard and report stay aligned.
	const columns = [
		{ id: 'id', header: 'Record', width: 130 },
		{ id: 'patientIdentifier', header: 'Patient ID', width: 150, sort: true },
		{ id: 'patientName', header: 'Patient', flexgrow: 2, sort: true },
		{ id: 'theatre', header: 'Theatre', width: 150, sort: true },
		{ id: 'anaesthetistName', header: 'Anaesthetist', width: 150, sort: true },
		{
			id: 'urgency',
			header: 'Urgency',
			width: 120,
			sort: true,
			template: (v: string) => urgencyLabel(v as never) || '—'
		},
		{
			id: 'status',
			header: 'Status',
			width: 130,
			sort: true,
			template: (v: string) => statusLabel(v as never)
		},
		{ id: 'completenessPercent', header: 'Complete %', width: 120, sort: true },
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true },
		{ id: 'operationDate', header: 'Date', width: 120, sort: true }
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'operationDate', order: 'asc' });
		// Open a record when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/anaesthetic-record/anaesthetic-records/${ev.id}`);
		});
	}
</script>

<main class="mx-auto max-w-6xl px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">Anaesthetic record dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				Completeness status, completeness percent, and safety-flag count for anaesthetic records,
				computed by the shared engine. Select a row to open the record.
			</p>
		</div>
		<a href="/anaesthetic-record/anaesthetic-records/new" class="button" data-variant="primary">New record</a>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Urgency</span>
			<select class="select inline-block w-auto" bind:value={urgencyFilter}>
				<option value="">All</option>
				<option value="elective">Elective</option>
				<option value="urgent">Urgent</option>
				<option value="emergency">Emergency</option>
				<option value="immediate">Immediate</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Status</span>
			<select class="select inline-block w-auto" bind:value={statusFilter}>
				<option value="">All</option>
				<option value="complete">Complete</option>
				<option value="partial">Partial</option>
				<option value="incomplete">Incomplete</option>
			</select>
		</label>
	</div>

	<div class="overflow-hidden rounded-xl border border-base-300" style="height: 600px;">
		<GridTheme>
			<Grid data={rows} {columns} {init} />
		</GridTheme>
	</div>

	<p class="mt-4 text-sm text-base-content/60">{rows.length} records</p>
</main>
