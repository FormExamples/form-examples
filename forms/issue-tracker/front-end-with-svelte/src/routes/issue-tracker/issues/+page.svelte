<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleAssessmentRows } from '$lib/data/sample-reports';
	import { priorityLabel } from '$lib/engine/utils';
	import type { CompositePriority } from '$lib/engine/types';

	let priorityFilter = $state('');
	let categoryFilter = $state('');
	let gridApi = $state<any>(null);

	const rows = $derived(
		sampleAssessmentRows.filter(
			(r) =>
				(priorityFilter === '' || r.compositePriority === priorityFilter) &&
				(categoryFilter === '' || r.category === categoryFilter)
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

	// SVAR DataGrid columns. The composite priority, severity, and harm grade
	// render through the shared engine output so the dashboard and report stay
	// aligned.
	const columns = [
		{ id: 'id', header: 'Issue', width: 120 },
		{ id: 'summary', header: 'Summary', flexgrow: 2, sort: true },
		{ id: 'reportedDate', header: 'Reported', width: 120, sort: true },
		{ id: 'category', header: 'Category', width: 150, sort: true },
		{ id: 'environment', header: 'Environment', width: 130, sort: true },
		{
			id: 'compositePriority',
			header: 'Priority',
			width: 140,
			sort: true,
			template: (v: CompositePriority) => priorityLabel(v)
		},
		{ id: 'severity', header: 'Severity', width: 100, sort: true, template: (v: number | null) => (v === null ? '—' : String(v)) },
		{ id: 'harm', header: 'Harm', width: 80, sort: true, template: (v: number | null) => (v === null ? '—' : String(v)) },
		{
			id: 'frequency',
			header: 'Freq.',
			width: 90,
			sort: true,
			template: (v: number | null) => (v === null ? '—' : `${v}%`)
		},
		{
			id: 'regulatoryFlag',
			header: 'Regulatory',
			width: 110,
			template: (v: boolean) => (v ? 'Yes' : 'No')
		},
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'id', order: 'asc' });
		// Open an issue when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/issue-tracker/issues/${ev.id}`);
		});
	}
</script>

<main class="mx-16 px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">Issue triage dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				Composite priority, severity, harm grade, and safety-flag count for reported issues,
				computed by the shared engine. Select a row to open the issue.
			</p>
		</div>
		<a href="/issue-tracker/issues/new" class="button" data-variant="primary">New issue</a>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Priority</span>
			<select class="select inline-block w-auto" bind:value={priorityFilter}>
				<option value="">All</option>
				<option value="low">Low</option>
				<option value="moderate">Moderate</option>
				<option value="high">High</option>
				<option value="critical">Critical</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Category</span>
			<select class="select inline-block w-auto" bind:value={categoryFilter}>
				<option value="">All</option>
				<option value="software-defect">Software defect</option>
				<option value="service-outage">Service outage</option>
				<option value="performance">Performance</option>
				<option value="security">Security</option>
				<option value="data-protection">Data protection</option>
				<option value="clinical-safety">Clinical safety</option>
				<option value="workplace-safety">Workplace safety</option>
				<option value="medical-device">Medical device</option>
				<option value="regulatory">Regulatory</option>
				<option value="project-blocker">Project blocker</option>
				<option value="customer-complaint">Customer complaint</option>
				<option value="hardware-fault">Hardware fault</option>
				<option value="process">Process</option>
				<option value="other">Other</option>
			</select>
		</label>
	</div>

	<div class="overflow-hidden rounded-xl border border-base-300" style="height: 600px;">
		<GridTheme>
			<Grid data={rows} {columns} {init} />
		</GridTheme>
	</div>

	<p class="mt-4 text-sm text-base-content/60">{rows.length} issues</p>
</main>
