<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleAssessmentRows } from '$lib/data/sample-reports';
	import { news2ResponseLabel, mtsCategoryLabel } from '$lib/engine/utils';

	let responseFilter = $state('');
	let mtsFilter = $state('');
	let gridApi = $state<any>(null);

	const rows = $derived(
		sampleAssessmentRows.filter(
			(r) =>
				(responseFilter === '' || r.news2Response === responseFilter) &&
				(mtsFilter === '' || r.mtsCategory === mtsFilter)
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

	// SVAR DataGrid columns. The NEWS2 score and clinical response render through
	// the shared engine output so the dashboard and report stay aligned.
	const columns = [
		{ id: 'id', header: 'Card', width: 110 },
		{ id: 'patientName', header: 'Patient', flexgrow: 2, sort: true },
		{ id: 'assessedDate', header: 'Attended', width: 120, sort: true },
		{ id: 'news2Score', header: 'NEWS2', width: 90, sort: true },
		{
			id: 'news2Response',
			header: 'Clinical response',
			width: 230,
			sort: true,
			template: (v: string) => news2ResponseLabel(v as never)
		},
		{
			id: 'mtsCategory',
			header: 'Triage (MTS)',
			width: 170,
			sort: true,
			template: (v: string) => mtsCategoryLabel(v) || '—'
		},
		{ id: 'chiefComplaint', header: 'Chief complaint', flexgrow: 2 },
		{ id: 'allergyFlag', header: 'Allergy', width: 90, template: (v: boolean) => (v ? 'Yes' : 'No') },
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'news2Score', order: 'desc' });
		// Open a casualty card when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/casualty-card-form/casualty-cards/${ev.id}`);
		});
	}
</script>

<main class="mx-16 px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">Casualty card clinician dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				NEWS2 score and clinical response for ED attendances, computed by the shared engine. Select a
				row to open the casualty card.
			</p>
		</div>
		<a href="/casualty-card-form/casualty-cards/new" class="button" data-variant="primary">New card</a>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Clinical response</span>
			<select class="select inline-block w-auto" bind:value={responseFilter}>
				<option value="">All</option>
				<option value="low">Low</option>
				<option value="low-medium">Low-Medium</option>
				<option value="medium">Medium</option>
				<option value="high">High</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Triage (MTS)</span>
			<select class="select inline-block w-auto" bind:value={mtsFilter}>
				<option value="">All</option>
				<option value="1-immediate">1 — Immediate</option>
				<option value="2-very-urgent">2 — Very Urgent</option>
				<option value="3-urgent">3 — Urgent</option>
				<option value="4-standard">4 — Standard</option>
				<option value="5-non-urgent">5 — Non-Urgent</option>
			</select>
		</label>
	</div>

	<div class="overflow-hidden rounded-xl border border-base-300" style="height: 600px;">
		<GridTheme>
			<Grid data={rows} {columns} {init} />
		</GridTheme>
	</div>

	<p class="mt-4 text-sm text-base-content/60">{rows.length} attendances</p>
</main>
