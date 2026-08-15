<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/env';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleAssessmentRows } from '#lib/data/sample-reports.js';
	import { resultClassLabel, managementActionLabel, careSettingLabel } from '#lib/engine/utils.js';

	let careSettingFilter = $state('');
	let resultClassFilter = $state('');
	let gridApi = $state<any>(null);

	const rows = $derived(
		sampleAssessmentRows.filter(
			(r) =>
				(careSettingFilter === '' || r.careSetting === careSettingFilter) &&
				(resultClassFilter === '' || r.resultClass === resultClassFilter)
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
		const update = () => isDark = computeDark();
		update();
		const obs = new MutationObserver(() => setTimeout(update, 120));
		obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
		return () => obs.disconnect();
	});
	const GridTheme = $derived(isDark ? WillowDark : Willow);

	// SVAR DataGrid columns. Result class, management action, and the urgent /
	// flag indicators render through the shared engine output so the dashboard
	// and report stay aligned.
	const columns = [
		{ id: 'id', header: 'Screening', width: 140 },
		{
			id: 'patientIdentifier',
			header: 'Patient ID',
			width: 130,
			sort: true
		},

		{
			id: 'patientName',
			header: 'Patient',
			flexgrow: 2,
			sort: true
		},

		{
			id: 'careSetting',
			header: 'Setting',
			width: 180,
			sort: true,
			template: (v: string) => careSettingLabel(v as never) || '—'
		},

		{
			id: 'screenedDate',
			header: 'Screened',
			width: 120,
			sort: true
		},

		{
			id: 'resultClass',
			header: 'Result class',
			flexgrow: 2,
			sort: true,
			template: (v: string) => resultClassLabel(v as never)
		},
		{
			id: 'managementAction',
			header: 'Management',
			flexgrow: 2,
			sort: true,
			template: (v: string) => managementActionLabel(v as never)
		},
		{
			id: 'urgentFlag',
			header: 'Urgent',
			width: 90,
			sort: true,
			template: (v: boolean) => v ? 'Yes' : '—'
		},
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'patientName', order: 'asc' });
		// Open a screening when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/cervical-screening/cervical-screenings/${ev.id}`);
		});
	}
</script>

<main class="mx-16 px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">Cervical screening dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				Result class, management action, and safety flags for screened patients, computed by the
				shared engine. Select a row to open the screening.
			</p>
		</div>
		<a href="/cervical-screening/cervical-screenings/new" class="button" data-variant="primary">New screening</a>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Setting</span>
			<select class="select inline-block w-auto" bind:value={careSettingFilter}>
				<option value="">All</option>
				<option value="general-practice">General practice</option>
				<option value="sexual-health">Sexual & reproductive health</option>
				<option value="other">Other</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Result class</span>
			<select class="select inline-block w-auto" bind:value={resultClassFilter}>
				<option value="">All</option>
				<option value="hpv-negative">HPV negative</option>
				<option value="hpv-positive-cytology-normal">HPV positive, cytology normal</option>
				<option value="hpv-positive-cytology-abnormal-low">HPV positive, abnormal (low)</option>
				<option value="hpv-positive-cytology-abnormal-high">HPV positive, abnormal (high)</option>
				<option value="hpv-positive-cytology-pending">HPV positive, cytology outstanding</option>
				<option value="inadequate">Inadequate sample</option>
				<option value="cease-not-eligible">Cease / not eligible</option>
				<option value="pending">Pending</option>
			</select>
		</label>
	</div>

	<div
		class="overflow-hidden rounded-xl border border-base-300"
		style="height: 600px;"
	><GridTheme><Grid data={rows} columns={columns} init={init} /></GridTheme></div>

	<p class="mt-4 text-sm text-base-content/60">{rows.length} screenings</p>
</main>
