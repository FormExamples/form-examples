<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleCarePlanRows } from '$lib/data/sample-reports';
	import { completenessLabel, careSettingLabel, planTypeLabel } from '$lib/engine/utils';

	let settingFilter = $state('');
	let statusFilter = $state('');
	let gridApi = $state<any>(null);

	const rows = $derived(
		sampleCarePlanRows.filter(
			(r) =>
				(settingFilter === '' || r.careSetting === settingFilter) &&
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

	// SVAR DataGrid columns. Status, completeness percent, and flag count render
	// through the shared engine output so the dashboard and report stay aligned.
	const columns = [
		{ id: 'id', header: 'Care plan', width: 140 },
		{ id: 'patientIdentifier', header: 'Patient ID', width: 130, sort: true },
		{ id: 'patientName', header: 'Patient', flexgrow: 2, sort: true },
		{ id: 'authoredDate', header: 'Authored', width: 120, sort: true },
		{
			id: 'planType',
			header: 'Type',
			width: 120,
			sort: true,
			template: (v: string) => planTypeLabel(v as never) || '—'
		},
		{
			id: 'careSetting',
			header: 'Setting',
			width: 180,
			sort: true,
			template: (v: string) => careSettingLabel(v as never) || '—'
		},
		{ id: 'problemCount', header: 'Problems', width: 100, sort: true },
		{
			id: 'completenessPercent',
			header: 'Complete %',
			width: 110,
			sort: true,
			template: (v: number) => `${v}%`
		},
		{
			id: 'status',
			header: 'Status',
			width: 130,
			sort: true,
			template: (v: string) => completenessLabel(v as never)
		},
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'patientName', order: 'asc' });
		// Open a care plan when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/nursing-care-plan/nursing-care-plans/${ev.id}`);
		});
	}
</script>

<main class="mx-16 px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">Nursing care plan dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				Care-plan status, completeness percent, problem count, and flag count for documented care
				plans, computed by the shared engine. Select a row to open the care plan.
			</p>
		</div>
		<a href="/nursing-care-plan/nursing-care-plans/new" class="button" data-variant="primary">New care plan</a>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Care setting</span>
			<select class="select inline-block w-auto" bind:value={settingFilter}>
				<option value="">All</option>
				<option value="hospital-ward">Hospital ward</option>
				<option value="community">Community / district nursing</option>
				<option value="care-home">Care home</option>
				<option value="hospice">Hospice</option>
				<option value="other">Other</option>
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

	<p class="mt-4 text-sm text-base-content/60">{rows.length} care plans</p>
</main>
