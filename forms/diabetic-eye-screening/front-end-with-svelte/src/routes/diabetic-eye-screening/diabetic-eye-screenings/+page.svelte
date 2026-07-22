<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleAssessmentRows } from '$lib/data/sample-reports';
	import { outcomeLabel, referralLabel, retinopathyLabel, maculopathyLabel } from '$lib/engine/utils';

	let outcomeFilter = $state('');
	let referralFilter = $state('');
	let gridApi = $state<any>(null);

	const rows = $derived(
		sampleAssessmentRows.filter(
			(r) =>
				(outcomeFilter === '' || r.outcome === outcomeFilter) &&
				(referralFilter === '' || r.referral === referralFilter)
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

	// SVAR DataGrid columns. Worst-eye grades, outcome, and referral render
	// through the shared engine output so the dashboard and report stay aligned.
	const columns = [
		{ id: 'id', header: 'Screening', width: 140 },
		{ id: 'patientIdentifier', header: 'Patient ID', width: 130, sort: true },
		{ id: 'patientName', header: 'Patient', flexgrow: 2, sort: true },
		{ id: 'screenedDate', header: 'Screened', width: 120, sort: true },
		{
			id: 'worstRetinopathy',
			header: 'Worst R',
			width: 220,
			sort: true,
			template: (v: string) => retinopathyLabel(v)
		},
		{
			id: 'worstMaculopathy',
			header: 'Worst M',
			width: 200,
			sort: true,
			template: (v: string) => maculopathyLabel(v)
		},
		{
			id: 'outcome',
			header: 'Outcome',
			flexgrow: 2,
			sort: true,
			template: (v: string) => outcomeLabel(v)
		},
		{
			id: 'referral',
			header: 'Referral',
			flexgrow: 2,
			sort: true,
			template: (v: string) => referralLabel(v)
		},
		{
			id: 'urgentFlag',
			header: 'Urgent',
			width: 90,
			sort: true,
			template: (v: boolean) => (v ? 'Yes' : '—')
		},
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'patientName', order: 'asc' });
		// Open a screening when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/diabetic-eye-screening/diabetic-eye-screenings/${ev.id}`);
		});
	}
</script>

<main class="mx-16 px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">Diabetic eye screening dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				Worst-eye grades, recall / referral outcome, and safety flags for screened patients,
				computed by the shared engine. Select a row to open the screening.
			</p>
		</div>
		<a href="/diabetic-eye-screening/diabetic-eye-screenings/new" class="button" data-variant="primary">New screening</a>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Outcome</span>
			<select class="select inline-block w-auto" bind:value={outcomeFilter}>
				<option value="">All</option>
				<option value="refer-hes-urgent">Urgent referral to ophthalmology</option>
				<option value="refer-hes">Routine referral to HES</option>
				<option value="refer-slit-lamp">Slit-lamp biomicroscopy</option>
				<option value="surveillance-6-month">6-monthly surveillance</option>
				<option value="routine-12-month">Routine 12-monthly</option>
				<option value="routine-24-month">Routine 24-monthly</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Referral</span>
			<select class="select inline-block w-auto" bind:value={referralFilter}>
				<option value="">All</option>
				<option value="none">No referral</option>
				<option value="hes-routine">Hospital eye service (routine)</option>
				<option value="hes-urgent">Ophthalmology (urgent)</option>
				<option value="slit-lamp">Slit-lamp biomicroscopy</option>
			</select>
		</label>
	</div>

	<div class="overflow-hidden rounded-xl border border-base-300" style="height: 600px;">
		<GridTheme>
			<Grid data={rows} {columns} {init} />
		</GridTheme>
	</div>

	<p class="mt-4 text-sm text-base-content/60">{rows.length} screenings</p>
</main>
