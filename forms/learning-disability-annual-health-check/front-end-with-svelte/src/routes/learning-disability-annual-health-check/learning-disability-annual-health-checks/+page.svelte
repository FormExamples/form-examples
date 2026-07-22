<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleAssessmentRows } from '$lib/data/sample-reports';
	import { statusLabel } from '$lib/engine/utils';

	let statusFilter = $state('');
	let hapFilter = $state('');
	let gridApi = $state<any>(null);

	const rows = $derived(
		sampleAssessmentRows.filter(
			(r) =>
				(statusFilter === '' || r.status === statusFilter) &&
				(hapFilter === '' ||
					(hapFilter === 'complete' ? r.healthActionPlanComplete : !r.healthActionPlanComplete))
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

	// SVAR DataGrid columns. Completeness status, completeness percentage, the
	// Health Action Plan gate, and the STOMP flag render through the shared engine
	// output so the dashboard and report stay aligned.
	const columns = [
		{ id: 'id', header: 'Check', width: 150 },
		{ id: 'personIdentifier', header: 'Person ID', width: 150, sort: true },
		{ id: 'personName', header: 'Person', flexgrow: 2, sort: true },
		{ id: 'practiceName', header: 'GP practice', flexgrow: 2, sort: true },
		{ id: 'checkedDate', header: 'Checked', width: 120, sort: true },
		{
			id: 'status',
			header: 'Completeness',
			width: 130,
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
			id: 'healthActionPlanComplete',
			header: 'Health Action Plan',
			width: 150,
			sort: true,
			template: (v: boolean) => (v ? 'Produced & shared' : 'Outstanding')
		},
		{
			id: 'stompFlag',
			header: 'STOMP',
			width: 90,
			sort: true,
			template: (v: boolean) => (v ? 'Flag' : '—')
		},
		{ id: 'highFlagCount', header: 'High flags', width: 100, sort: true },
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'personName', order: 'asc' });
		// Open a check when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/learning-disability-annual-health-check/learning-disability-annual-health-checks/${ev.id}`);
		});
	}
</script>

<main class="mx-16 px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">Annual health check dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				Completeness status, completeness percentage, the Health Action Plan, and the STOMP flag for
				checked people, computed by the shared engine. Select a row to open the check.
			</p>
		</div>
		<a href="/learning-disability-annual-health-check/learning-disability-annual-health-checks/new" class="button" data-variant="primary"
			>New check</a
		>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Completeness</span>
			<select class="select inline-block w-auto" bind:value={statusFilter}>
				<option value="">All</option>
				<option value="complete">Complete</option>
				<option value="incomplete">Incomplete</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Health Action Plan</span>
			<select class="select inline-block w-auto" bind:value={hapFilter}>
				<option value="">All</option>
				<option value="complete">Produced & shared</option>
				<option value="outstanding">Outstanding</option>
			</select>
		</label>
	</div>

	<div class="overflow-hidden rounded-xl border border-base-300" style="height: 600px;">
		<GridTheme>
			<Grid data={rows} {columns} {init} />
		</GridTheme>
	</div>

	<p class="mt-4 text-sm text-base-content/60">{rows.length} people</p>
</main>
