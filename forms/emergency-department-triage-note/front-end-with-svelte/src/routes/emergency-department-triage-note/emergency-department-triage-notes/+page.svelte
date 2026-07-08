<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleAssessmentRows } from '$lib/data/sample-reports';
	import { careSettingLabel } from '$lib/engine/utils';

	const plural = 'emergency-department-triage-notes';

	let levelFilter = $state('');
	let settingFilter = $state('');
	let gridApi = $state<any>(null);

	const rows = $derived(
		sampleAssessmentRows.filter(
			(r) =>
				(levelFilter === '' || String(r.priorityLevel) === levelFilter) &&
				(settingFilter === '' || r.careSetting === settingFilter)
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

	// SVAR DataGrid columns. Priority level, name, target time, supporting NEWS2,
	// and flag count render through the shared engine output so the dashboard and
	// report stay aligned.
	const columns = [
		{ id: 'id', header: 'Triage', width: 150, sort: true },
		{ id: 'patientIdentifier', header: 'Patient', flexgrow: 2, sort: true },
		{
			id: 'careSetting',
			header: 'Care setting',
			flexgrow: 2,
			sort: true,
			template: (v: string) => careSettingLabel(v as never)
		},
		{ id: 'triagedDate', header: 'Triaged', width: 120, sort: true },
		{ id: 'priorityLevel', header: 'Priority', width: 90, sort: true },
		{ id: 'priorityName', header: 'Category', width: 130, sort: true },
		{
			id: 'targetMinutes',
			header: 'Target',
			width: 110,
			template: (v: number) => (v === 0 ? 'Immediate' : `${v} min`)
		},
		{ id: 'news2Total', header: 'NEWS2', width: 90, sort: true },
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'priorityLevel', order: 'asc' });
		// Open an assessment when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/emergency-department-triage-note/${plural}/${ev.id}`);
		});
	}
</script>

<main class="mx-auto max-w-6xl px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">ED triage clinician dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				Manchester Triage System priority level, category, target time to first assessment,
				supporting NEWS2 aggregate, and flag count for triaged patients, computed by the shared
				engine. Select a row to open the assessment.
			</p>
		</div>
		<a href="/emergency-department-triage-note/{plural}/new" class="button" data-variant="primary">New triage</a>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Priority level</span>
			<select class="select inline-block w-auto" bind:value={levelFilter}>
				<option value="">All</option>
				<option value="1">1 — Immediate</option>
				<option value="2">2 — Very urgent</option>
				<option value="3">3 — Urgent</option>
				<option value="4">4 — Standard</option>
				<option value="5">5 — Non-urgent</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Care setting</span>
			<select class="select inline-block w-auto" bind:value={settingFilter}>
				<option value="">All</option>
				<option value="emergency-department">Emergency department</option>
				<option value="urgent-treatment-centre">Urgent treatment centre</option>
				<option value="minor-injuries-unit">Minor injuries unit</option>
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
