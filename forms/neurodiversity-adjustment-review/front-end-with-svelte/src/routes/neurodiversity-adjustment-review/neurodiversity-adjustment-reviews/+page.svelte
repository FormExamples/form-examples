<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/env';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleReports } from '#lib/data/sample-reports.js';
	import {
		effectivenessBandLabel,
		wellbeingRiskBandLabel,
		nextStepUrgencyLabel,
		reviewStatusLabel
	} from '#lib/engine/utils.js';

	let effectivenessFilter = $state('');
	let urgencyFilter = $state('');
	let gridApi = $state<any>(null);

	const rows = $derived(
		sampleReports.filter(
			(r) =>
				(effectivenessFilter === '' || r.effectivenessBand === effectivenessFilter) &&
				(urgencyFilter === '' || r.nextStepUrgency === urgencyFilter)
		)
	);

	// Review overview — rolls up the rows currently in view. Reflects the active
	// filters, so slicing by effectiveness or urgency re-scopes the metrics.
	const cards = $derived.by(() => {
		const total = rows.length;
		const pct = (n: number) => total === 0 ? 0 : Math.round(n / total * 100);
		const c = (pred: (r: (typeof rows)[number]) => boolean) => rows.filter(pred).length;
		const effective = pct(c((r) => r.effectivenessBand === 'effective'));
		const ineffective = pct(c((r) => r.effectivenessBand === 'ineffective'));
		const highRisk = pct(c((r) => r.wellbeingRiskBand === 'high-risk'));
		const avgComplete =
			total === 0
				? 0
				: Math.round(rows.reduce((a, r) => a + (r.completenessPercent || 0), 0) / total);
		return [
			{ label: 'Reviews in view', value: String(total), cls: '' },
			{
				label: 'Effective',
				value: effective + '%',
				cls: effective ? 'text-success' : ''
			},

			{
				label: 'Ineffective',
				value: ineffective + '%',
				cls: ineffective ? 'text-error' : ''
			},

			{
				label: 'High wellbeing risk',
				value: highRisk + '%',
				cls: highRisk ? 'text-error' : 'text-success'
			},
			{ label: 'Avg completeness', value: avgComplete + '%', cls: '' }
		];
	});

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

	// SVAR DataGrid columns. Graded axes render through the shared engine label
	// helpers so the dashboard and the report stay in lock-step.
	const columns = [
		{ id: 'id', header: 'Review', width: 140 },
		{ id: 'workerName', header: 'Worker', flexgrow: 2, sort: true },
		{
			id: 'reviewStatus',
			header: 'Status',
			width: 130,
			template: (v: string) => reviewStatusLabel(v as never)
		},
		{ id: 'reviewDate', header: 'Reviewed', width: 120, sort: true },
		{
			id: 'effectivenessBand',
			header: 'Effectiveness',
			width: 150,
			sort: true,
			template: (v: string) => effectivenessBandLabel(v as never)
		},
		{
			id: 'wellbeingRiskBand',
			header: 'Wellbeing risk',
			width: 130,
			sort: true,
			template: (v: string) => wellbeingRiskBandLabel(v as never)
		},
		{
			id: 'nextStepUrgency',
			header: 'Next step',
			width: 150,
			sort: true,
			template: (v: string) => nextStepUrgencyLabel(v as never)
		},
		{ id: 'completenessPercent', header: 'Complete', width: 100, template: (v: number) => `${v}%` },
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'nextStepUrgency', order: 'desc' });
		// Open a review when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/neurodiversity-adjustment-review/neurodiversity-adjustment-reviews/${ev.id}`);
		});
	}
</script>

<main class="mx-16 px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">Graded adjustment reviews</h1>
			<p class="mt-1 text-sm text-base-content/70">
				Four-axis grades for completed neurodiversity adjustment reviews, computed by the shared
				engine. Select a row to open the review.
			</p>
		</div>
		<a href="/neurodiversity-adjustment-review/neurodiversity-adjustment-reviews/new" class="button" data-variant="primary"
			>New review</a
		>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Effectiveness</span>
			<select class="select inline-block w-auto" bind:value={effectivenessFilter}>
				<option value="">All</option>
				<option value="effective">Effective</option>
				<option value="partially-effective">Partially effective</option>
				<option value="ineffective">Ineffective</option>
				<option value="not-yet-assessed">Not yet assessed</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Next-step urgency</span>
			<select class="select inline-block w-auto" bind:value={urgencyFilter}>
				<option value="">All</option>
				<option value="none">None</option>
				<option value="review-scheduled">Review scheduled</option>
				<option value="adjust-now">Adjust now</option>
				<option value="escalate">Escalate</option>
			</select>
		</label>
	</div>

	<section class="mb-4" aria-label="Review overview">
		<div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
			{#each cards as card (card.label)}
				<div class="rounded-lg border border-base-300 bg-base-100 px-3 py-2">
					<div class="text-2xl font-bold tabular-nums {card.cls}">{card.value}</div>
					<div class="text-xs text-base-content/60">{card.label}</div>
				</div>
			{/each}
		</div>
	</section>

	<div
		class="overflow-hidden rounded-xl border border-base-300"
		style="height: 600px;"
	><GridTheme><Grid data={rows} columns={columns} init={init} /></GridTheme></div>

	<p class="mt-4 text-sm text-base-content/60">{rows.length} reviews</p>
</main>
