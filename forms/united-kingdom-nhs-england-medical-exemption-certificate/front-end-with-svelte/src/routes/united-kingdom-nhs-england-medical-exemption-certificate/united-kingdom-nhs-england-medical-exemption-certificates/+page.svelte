<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleApplicationRows } from '$lib/data/sample-reports';

	const plural = 'united-kingdom-nhs-england-medical-exemption-certificates';

	const OUTCOME_LABELS: Record<string, string> = {
		eligible: 'Eligible',
		ineligible: 'Ineligible',
		'requires-clarification': 'Requires clarification'
	};

	let outcomeFilter = $state('');
	let flaggedFilter = $state('');
	let gridApi = $state<any>(null);

	const rows = $derived(
		sampleApplicationRows.filter(
			(r) =>
				(outcomeFilter === '' || r.outcome === outcomeFilter) &&
				(flaggedFilter === '' ||
					(flaggedFilter === 'flagged' ? r.flagCount > 0 : r.flagCount === 0))
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

	// SVAR DataGrid columns. The eligibility outcome, eligible-condition count,
	// and flag count render through the shared engine output so the dashboard and
	// report stay aligned.
	const columns = [
		{ id: 'id', header: 'Application', width: 150 },
		{ id: 'patientName', header: 'Patient', flexgrow: 2, sort: true },
		{ id: 'practitionerName', header: 'Practitioner', flexgrow: 1, sort: true },
		{ id: 'completionDate', header: 'Completed', width: 120, sort: true },
		{ id: 'conditionCount', header: 'Eligible conds', width: 130, sort: true },
		{
			id: 'outcome',
			header: 'Outcome',
			width: 180,
			sort: true,
			template: (v: string) => OUTCOME_LABELS[v] ?? '—'
		},
		{ id: 'validUntil', header: 'Valid until', width: 120, sort: true, template: (v: string) => v || '—' },
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'patientName', order: 'asc' });
		// Open an application when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/united-kingdom-nhs-england-medical-exemption-certificate/${plural}/${ev.id}`);
		});
	}
</script>

<main class="mx-auto max-w-6xl px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">FP92A practitioner dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				Eligibility outcome, eligible-condition count, and advisory flag count for each FP92A
				application, computed by the shared engine. Select a row to open the application.
			</p>
		</div>
		<a href="/united-kingdom-nhs-england-medical-exemption-certificate/{plural}/new" class="button" data-variant="primary">New application</a>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Outcome</span>
			<select class="select inline-block w-auto" bind:value={outcomeFilter}>
				<option value="">All</option>
				<option value="eligible">Eligible</option>
				<option value="ineligible">Ineligible</option>
				<option value="requires-clarification">Requires clarification</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Flags</span>
			<select class="select inline-block w-auto" bind:value={flaggedFilter}>
				<option value="">All</option>
				<option value="flagged">Has flags</option>
				<option value="clear">No flags</option>
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
