<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleAdrRows } from '$lib/data/sample-reports';
	import { statusLabel, groupLabel, pad4 } from '$lib/engine/utils';
	import type { Status, DecisionGroup } from '$lib/types';

	let statusFilter = $state('');
	let groupFilter = $state('');
	let gridApi = $state<unknown>(null);

	const rows = $derived(
		sampleAdrRows.filter(
			(r) =>
				(statusFilter === '' || r.status === statusFilter) &&
				(groupFilter === '' || r.decisionGroup === groupFilter)
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

	// SVAR DataGrid columns. Status, group, completeness and flags render through
	// the shared engine output so the register and report stay aligned.
	const columns = [
		{ id: 'number', header: 'No.', width: 80, sort: true, template: (v: number | null) => pad4(v) },
		{ id: 'title', header: 'Title', flexgrow: 2, sort: true },
		{ id: 'status', header: 'Status', width: 120, sort: true, template: (v: Status) => statusLabel(v) },
		{ id: 'decisionGroup', header: 'Group', width: 130, sort: true, template: (v: DecisionGroup) => groupLabel(v) },
		{ id: 'completeness', header: 'Complete', width: 110, sort: true, template: (v: number) => `${v}%` },
		{ id: 'chosenPosition', header: 'Chosen', flexgrow: 1, template: (v: string) => v || '—' },
		{ id: 'authorName', header: 'Author', width: 150, sort: true },
		{ id: 'decisionDate', header: 'Date', width: 120, sort: true, template: (v: string) => v || '—' },
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	function init(api: { exec: (k: string, p: unknown) => void; on: (e: string, cb: (ev: { id?: string | number }) => void) => void }) {
		gridApi = api;
		api.exec('sort-rows', { key: 'number', order: 'asc' });
		// Open a record when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/architecture-decision-record/architecture-decision-records/${ev.id}`);
		});
	}
</script>

<main class="mx-auto max-w-6xl px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">Architecture decision register</h1>
			<p class="mt-1 text-sm text-base-content/70">
				Status, group, completeness, the chosen position, and open flags for each recorded decision,
				computed by the shared engine. Select a row to open the record.
			</p>
		</div>
		<a href="/architecture-decision-record/architecture-decision-records/new" class="button" data-variant="primary">New record</a>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Status</span>
			<select class="select inline-block w-auto" bind:value={statusFilter}>
				<option value="">All</option>
				<option value="pending">Pending</option>
				<option value="decided">Decided</option>
				<option value="approved">Approved</option>
				<option value="superseded">Superseded</option>
				<option value="deprecated">Deprecated</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Group</span>
			<select class="select inline-block w-auto" bind:value={groupFilter}>
				<option value="">All</option>
				<option value="business">Business</option>
				<option value="data">Data</option>
				<option value="integration">Integration</option>
				<option value="presentation">Presentation</option>
				<option value="security">Security</option>
				<option value="infrastructure">Infrastructure</option>
				<option value="operations">Operations</option>
				<option value="governance">Governance</option>
				<option value="other">Other</option>
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
