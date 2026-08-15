<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/env';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleAssessmentRows } from '#lib/data/sample-reports.js';
	import { complexityLabel, lensTypeLabel } from '#lib/engine/utils.js';

	let complexityFilter = $state('');
	let lensFilter = $state('');

	const rows = $derived(
		sampleAssessmentRows.filter(
			(r) =>
				(complexityFilter === '' || r.complexity === complexityFilter) &&
				(lensFilter === '' || r.lensType === lensFilter)
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

	// SVAR DataGrid columns. The complexity grade and flag counts render through
	// the shared engine output so the dashboard and report stay aligned.
	const columns = [
		{ id: 'id', header: 'Prescription', width: 130 },
		{ id: 'patientName', header: 'Patient', flexgrow: 2, sort: true },
		{ id: 'issueDate', header: 'Issued', width: 120, sort: true },
		{ id: 'expiryDate', header: 'Expires', width: 120, sort: true },
		{
			id: 'complexity',
			header: 'Complexity',
			width: 130,
			sort: true,
			template: (v: string) => complexityLabel(v as never)
		},
		{
			id: 'lensType',
			header: 'Lens type',
			flexgrow: 1,
			sort: true,
			template: (v: string) => lensTypeLabel(v)
		},

		{
			id: 'prismFlag',
			header: 'Prism',
			width: 90,
			template: (v: boolean) => v ? 'Yes' : 'No'
		},

		{
			id: 'referralFlag',
			header: 'Referral',
			width: 100,
			template: (v: boolean) => v ? 'Yes' : 'No'
		},
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	function init(api: any) {
		api.exec('sort-rows', { key: 'patientName', order: 'asc' });
		// Open a prescription when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/eye-prescription/eye-prescriptions/${ev.id}`);
		});
	}
</script>

<main class="mx-16 px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">Eye prescription dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				Prescription-complexity grade and safety-flag counts for issued prescriptions, computed by the
				shared engine. Select a row to open the prescription.
			</p>
		</div>
		<a href="/eye-prescription/eye-prescriptions/new" class="button" data-variant="primary">New prescription</a>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Complexity</span>
			<select class="select inline-block w-auto" bind:value={complexityFilter}>
				<option value="">All</option>
				<option value="simple">Simple</option>
				<option value="moderate">Moderate</option>
				<option value="complex">Complex</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Lens type</span>
			<select class="select inline-block w-auto" bind:value={lensFilter}>
				<option value="">All</option>
				<option value="single-vision-distance">Single vision — distance</option>
				<option value="single-vision-near">Single vision — near</option>
				<option value="single-vision-intermediate">Single vision — intermediate</option>
				<option value="bifocal">Bifocal</option>
				<option value="trifocal">Trifocal</option>
				<option value="varifocal">Varifocal</option>
				<option value="occupational-varifocal">Occupational varifocal</option>
			</select>
		</label>
	</div>

	<div
		class="overflow-hidden rounded-xl border border-base-300"
		style="height: 600px;"
	><GridTheme><Grid data={rows} columns={columns} init={init} /></GridTheme></div>

	<p class="mt-4 text-sm text-base-content/60">{rows.length} prescriptions</p>
</main>
