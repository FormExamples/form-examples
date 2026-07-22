<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleReconciliationRows } from '$lib/data/sample-reports';
	import {
		statusLabel,
		careSettingLabel,
		reconciliationTypeLabel
	} from '$lib/engine/utils';

	let settingFilter = $state('');
	let statusFilter = $state('');
	let gridApi = $state<any>(null);

	const rows = $derived(
		sampleReconciliationRows.filter(
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

	// SVAR DataGrid columns. Status, counts, and flag count render through the
	// shared engine output so the dashboard and report stay aligned.
	const columns = [
		{ id: 'id', header: 'Reconciliation', width: 140 },
		{ id: 'patientIdentifier', header: 'Patient ID', width: 130, sort: true },
		{ id: 'patientName', header: 'Patient', flexgrow: 2, sort: true },
		{ id: 'reconciledDate', header: 'Reconciled', width: 120, sort: true },
		{
			id: 'reconciliationType',
			header: 'Type',
			width: 120,
			sort: true,
			template: (v: string) => reconciliationTypeLabel(v as never) || '—'
		},
		{
			id: 'careSetting',
			header: 'Setting',
			width: 160,
			sort: true,
			template: (v: string) => careSettingLabel(v as never) || '—'
		},
		{ id: 'sourceCount', header: 'Sources', width: 90, sort: true },
		{ id: 'discrepancyCount', header: 'Discrepancies', width: 130, sort: true },
		{
			id: 'status',
			header: 'Status',
			width: 190,
			sort: true,
			template: (v: string) => statusLabel(v as never)
		},
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'patientName', order: 'asc' });
		// Open a reconciliation when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/medication-reconciliation/medication-reconciliations/${ev.id}`);
		});
	}
</script>

<main class="mx-16 px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">Medication reconciliation dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				Reconciliation status, source and discrepancy counts, and safety-flag count for reconciled
				patients, computed by the shared engine. Select a row to open the reconciliation.
			</p>
		</div>
		<a href="/medication-reconciliation/medication-reconciliations/new" class="button" data-variant="primary"
			>New reconciliation</a
		>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Care setting</span>
			<select class="select inline-block w-auto" bind:value={settingFilter}>
				<option value="">All</option>
				<option value="emergency-department">Emergency department</option>
				<option value="acute-medical-unit">Acute medical unit</option>
				<option value="surgical-admissions">Surgical admissions</option>
				<option value="ward">Ward</option>
				<option value="critical-care">Critical care</option>
				<option value="other">Other</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Status</span>
			<select class="select inline-block w-auto" bind:value={statusFilter}>
				<option value="">All</option>
				<option value="complete">Complete</option>
				<option value="discrepancies-outstanding">Discrepancies outstanding</option>
				<option value="incomplete">Incomplete</option>
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
