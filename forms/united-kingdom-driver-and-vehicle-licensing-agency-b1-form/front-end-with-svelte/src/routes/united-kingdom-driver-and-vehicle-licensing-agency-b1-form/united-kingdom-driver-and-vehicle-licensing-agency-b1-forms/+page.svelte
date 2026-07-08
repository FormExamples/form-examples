<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleAssessmentRows } from '$lib/data/sample-reports';
	import { statusLabel } from '$lib/engine/utils';

	const plural = 'united-kingdom-driver-and-vehicle-licensing-agency-b1-forms';

	let statusFilter = $state('');
	let epilepsyFilter = $state('');
	let gridApi = $state<any>(null);

	const rows = $derived(
		sampleAssessmentRows.filter(
			(r) =>
				(statusFilter === '' || (statusFilter === 'complete' ? r.complete : !r.complete)) &&
				(epilepsyFilter === '' ||
					(epilepsyFilter === 'yes' ? r.epilepsyDeclared : !r.epilepsyDeclared))
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

	// SVAR DataGrid columns. Completeness status, declared conditions, epilepsy
	// declaration, and flag counts render through the shared engine output so the
	// dashboard and report stay aligned.
	const columns = [
		{ id: 'id', header: 'Reference', width: 130 },
		{ id: 'applicantName', header: 'Applicant', flexgrow: 2, sort: true },
		{ id: 'submittedAt', header: 'Submitted', width: 120, sort: true },
		{ id: 'conditionsDeclared', header: 'Conditions', width: 110, sort: true },
		{
			id: 'epilepsyDeclared',
			header: 'Epilepsy',
			width: 100,
			template: (v: boolean) => (v ? 'Yes' : 'No')
		},
		{
			id: 'completeness',
			header: 'Complete %',
			width: 120,
			sort: true,
			template: (v: number) => `${v}%`
		},
		{
			id: 'complete',
			header: 'Status',
			width: 120,
			sort: true,
			template: (v: boolean) => statusLabel(v)
		},
		{ id: 'highPriorityFlagCount', header: 'High flags', width: 100, sort: true },
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'applicantName', order: 'asc' });
		// Open a form when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/united-kingdom-driver-and-vehicle-licensing-agency-b1-form/${plural}/${ev.id}`);
		});
	}
</script>

<main class="mx-auto max-w-6xl px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">DVLA B1 clinician dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				Completeness status, declared conditions, epilepsy declaration, and flag counts for submitted
				B1 forms, computed by the shared engine. Select a row to open the form.
			</p>
		</div>
		<a href="/united-kingdom-driver-and-vehicle-licensing-agency-b1-form/{plural}/new" class="button" data-variant="primary">New form</a>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Status</span>
			<select class="select inline-block w-auto" bind:value={statusFilter}>
				<option value="">All</option>
				<option value="complete">Complete</option>
				<option value="incomplete">Incomplete</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Epilepsy</span>
			<select class="select inline-block w-auto" bind:value={epilepsyFilter}>
				<option value="">All</option>
				<option value="yes">Declared</option>
				<option value="no">Not declared</option>
			</select>
		</label>
	</div>

	<div class="overflow-hidden rounded-xl border border-base-300" style="height: 600px;">
		<GridTheme>
			<Grid data={rows} {columns} {init} />
		</GridTheme>
	</div>

	<p class="mt-4 text-sm text-base-content/60">{rows.length} forms</p>
</main>
