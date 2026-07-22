<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleFitNoteRows } from '$lib/data/sample-reports';
	import {
		fitnessCategoryLabel,
		periodComplianceLabel,
		recommendationLabel
	} from '$lib/engine/utils';

	const plural = 'united-kingdom-statements-of-fitness-for-work';

	let fitnessFilter = $state('');
	let recommendationFilter = $state('');
	let gridApi = $state<any>(null);

	const rows = $derived(
		sampleFitNoteRows.filter(
			(r) =>
				(fitnessFilter === '' || r.fitnessCategory === fitnessFilter) &&
				(recommendationFilter === '' || r.recommendation === recommendationFilter)
		)
	);

	// Follow the active Lily theme: pick the dark SVAR skin when the theme's
	// base surface is dark. Recomputed whenever <html data-theme> changes.
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

	// SVAR DataGrid columns. The fitness category, period compliance, validity,
	// and recommendation render through the shared engine output so the dashboard
	// and report stay aligned.
	const columns = [
		{ id: 'id', header: 'Fit note', width: 130 },
		{ id: 'patientName', header: 'Patient', flexgrow: 2, sort: true },
		{ id: 'assessmentDate', header: 'Assessed', width: 120, sort: true },
		{
			id: 'fitnessCategory',
			header: 'Fitness',
			width: 150,
			sort: true,
			template: (v: string) => fitnessCategoryLabel(v as never)
		},
		{
			id: 'periodDays',
			header: 'Days',
			width: 80,
			sort: true,
			template: (v: number | null) => (v === null ? '—' : String(v))
		},
		{
			id: 'periodCompliance',
			header: 'Compliance',
			width: 200,
			sort: true,
			template: (v: string) => periodComplianceLabel(v as never)
		},
		{
			id: 'recommendation',
			header: 'Recommendation',
			flexgrow: 2,
			sort: true,
			template: (v: string) => recommendationLabel(v as never)
		},
		{
			id: 'isValid',
			header: 'Valid',
			width: 80,
			sort: true,
			template: (v: string) => (v === 'yes' ? 'Yes' : 'No')
		},
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'patientName', order: 'asc' });
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/united-kingdom-statement-of-fitness-for-work/${plural}/${ev.id}`);
		});
	}
</script>

<main class="mx-16 px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">Fit-note clinician dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				Fitness category, period compliance, validity, and recommendation for issued fit notes,
				computed by the shared engine. Select a row to open the fit note.
			</p>
		</div>
		<a href="/united-kingdom-statement-of-fitness-for-work/{plural}/new" class="button" data-variant="primary">New fit note</a>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Fitness category</span>
			<select class="select inline-block w-auto" bind:value={fitnessFilter}>
				<option value="">All</option>
				<option value="not_fit">Not fit for work</option>
				<option value="may_be_fit">May be fit for work</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Recommendation</span>
			<select class="select inline-block w-auto" bind:value={recommendationFilter}>
				<option value="">All</option>
				<option value="standard">Standard — no referral</option>
				<option value="refer_occupational_health">Refer to occupational health</option>
				<option value="refer_access_to_work">Refer to Access to Work</option>
				<option value="refer_employment_advisor">Refer to employment advisor</option>
				<option value="review_for_validity">Review for validity</option>
			</select>
		</label>
	</div>

	<div class="overflow-hidden rounded-xl border border-base-300" style="height: 600px;">
		<GridTheme>
			<Grid data={rows} {columns} {init} />
		</GridTheme>
	</div>

	<p class="mt-4 text-sm text-base-content/60">{rows.length} fit notes</p>
</main>
