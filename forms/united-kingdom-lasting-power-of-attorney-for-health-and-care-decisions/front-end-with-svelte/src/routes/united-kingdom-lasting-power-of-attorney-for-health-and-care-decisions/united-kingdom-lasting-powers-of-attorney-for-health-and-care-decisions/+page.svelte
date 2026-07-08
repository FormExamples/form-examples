<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleLpaRows } from '$lib/data/sample-reports';
	import { validityStatusLabel } from '$lib/engine/utils';

	const plural = 'united-kingdom-lasting-powers-of-attorney-for-health-and-care-decisions';

	let statusFilter = $state('');
	let jurisdictionFilter = $state('');
	let gridApi = $state<any>(null);

	const rows = $derived(
		sampleLpaRows.filter(
			(r) =>
				(statusFilter === '' || r.validityStatus === statusFilter) &&
				(jurisdictionFilter === '' || r.jurisdiction === jurisdictionFilter)
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

	const capitalize = (v: string) => (v ? v.charAt(0).toUpperCase() + v.slice(1) : '—');
	const decisionRuleLabel = (v: string) =>
		v === 'jointly-and-severally'
			? 'Jointly & severally'
			: v === 'jointly'
				? 'Jointly'
				: v === 'mixed'
					? 'Mixed'
					: '—';

	// SVAR DataGrid columns. Validity status and completeness render through the
	// shared engine output so the dashboard and report stay aligned.
	const columns = [
		{ id: 'id', header: 'Reference', width: 140, sort: true },
		{ id: 'donorName', header: 'Donor', flexgrow: 2, sort: true },
		{
			id: 'jurisdiction',
			header: 'Jurisdiction',
			width: 120,
			sort: true,
			template: (v: string) => capitalize(v)
		},
		{ id: 'attorneyCount', header: 'Attorneys', width: 100, sort: true },
		{
			id: 'decisionRule',
			header: 'Decision rule',
			width: 150,
			template: (v: string) => decisionRuleLabel(v)
		},
		{
			id: 'validityStatus',
			header: 'Validity',
			width: 150,
			sort: true,
			template: (v: string) => validityStatusLabel(v as never)
		},
		{
			id: 'completenessScore',
			header: 'Complete',
			width: 110,
			sort: true,
			template: (v: number) => `${v}%`
		},
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'id', order: 'asc' });
		// Open an application when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/united-kingdom-lasting-power-of-attorney-for-health-and-care-decisions/${plural}/${ev.id}`);
		});
	}
</script>

<main class="mx-auto max-w-6xl px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">LP1H case-worker dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				Statutory validity and completeness for LP1H applications, computed by the shared engine.
				Select a row to open the application.
			</p>
		</div>
		<a href="/united-kingdom-lasting-power-of-attorney-for-health-and-care-decisions/{plural}/new" class="button" data-variant="primary">New application</a>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Validity</span>
			<select class="select inline-block w-auto" bind:value={statusFilter}>
				<option value="">All</option>
				<option value="ready-to-register">Ready to register</option>
				<option value="needs-correction">Needs correction</option>
				<option value="invalid">Invalid</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Jurisdiction</span>
			<select class="select inline-block w-auto" bind:value={jurisdictionFilter}>
				<option value="">All</option>
				<option value="england">England</option>
				<option value="wales">Wales</option>
			</select>
		</label>
	</div>

	<div class="overflow-hidden rounded-xl border border-base-300" style="height: 600px;">
		<GridTheme>
			<Grid data={rows} {columns} {init} />
		</GridTheme>
	</div>

	<p class="mt-4 text-sm text-base-content/60">{rows.length} applications</p>
</main>
