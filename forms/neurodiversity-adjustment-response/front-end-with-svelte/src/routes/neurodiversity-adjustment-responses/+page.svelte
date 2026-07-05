<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleReports } from '$lib/data/sample-reports';
	import {
		outcomeClassificationLabel,
		legalRiskBandLabel,
		followUpUrgencyLabel,
		responseStatusLabel
	} from '$lib/engine/utils';

	let outcomeFilter = $state('');
	let urgencyFilter = $state('');
	let gridApi = $state<any>(null);

	const rows = $derived(
		sampleReports.filter(
			(r) =>
				(outcomeFilter === '' || r.outcomeClassification === outcomeFilter) &&
				(urgencyFilter === '' || r.followUpUrgency === urgencyFilter)
		)
	);

	// Compliance overview — rolls up the rows currently in view. Reflects the
	// active filters, so slicing by outcome or urgency re-scopes the metrics.
	const cards = $derived.by(() => {
		const total = rows.length;
		const pct = (n: number) => (total === 0 ? 0 : Math.round((n / total) * 100));
		const c = (pred: (r: (typeof rows)[number]) => boolean) => rows.filter(pred).length;
		const agreedSet = ['fully-agreed', 'partially-agreed', 'alternative-offered'] as string[];
		const agreed = pct(c((r) => agreedSet.includes(r.outcomeClassification)));
		const declined = pct(c((r) => r.outcomeClassification === 'declined'));
		const highRisk = pct(c((r) => r.legalRiskBand === 'high-risk'));
		const escalation = pct(c((r) => r.followUpUrgency === 'escalation-needed'));
		const avgComplete =
			total === 0
				? 0
				: Math.round(rows.reduce((a, r) => a + (r.completenessPercent || 0), 0) / total);
		return [
			{ label: 'Responses in view', value: String(total), cls: '' },
			{ label: 'Agreed (full / part)', value: agreed + '%', cls: 'text-success' },
			{ label: 'Declined', value: declined + '%', cls: declined ? 'text-warning' : '' },
			{
				label: 'Discrimination-risk',
				value: highRisk + '%',
				cls: highRisk ? 'text-error' : 'text-success'
			},
			{ label: 'Escalation', value: escalation + '%', cls: escalation ? 'text-error' : '' },
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
		const update = () => (isDark = computeDark());
		update();
		const obs = new MutationObserver(() => setTimeout(update, 120));
		obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
		return () => obs.disconnect();
	});
	const GridTheme = $derived(isDark ? WillowDark : Willow);

	// SVAR DataGrid columns. Graded axes render through the shared engine label
	// helpers so the dashboard and the report stay in lock-step.
	const columns = [
		{ id: 'id', header: 'Response', width: 130 },
		{ id: 'workerName', header: 'Worker', flexgrow: 2, sort: true },
		{
			id: 'responseStatus',
			header: 'Status',
			width: 130,
			template: (v: string) => responseStatusLabel(v as never)
		},
		{ id: 'respondedDate', header: 'Responded', width: 120, sort: true },
		{
			id: 'outcomeClassification',
			header: 'Outcome',
			width: 150,
			template: (v: string) => outcomeClassificationLabel(v as never)
		},
		{
			id: 'legalRiskBand',
			header: 'Legal risk',
			width: 120,
			sort: true,
			template: (v: string) => legalRiskBandLabel(v as never)
		},
		{
			id: 'followUpUrgency',
			header: 'Urgency',
			width: 150,
			sort: true,
			template: (v: string) => followUpUrgencyLabel(v as never)
		},
		{ id: 'completenessPercent', header: 'Complete', width: 100, template: (v: number) => `${v}%` },
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'followUpUrgency', order: 'desc' });
		// Open a response when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/neurodiversity-adjustment-responses/${ev.id}`);
		});
	}
</script>

<main class="mx-auto max-w-5xl px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">Graded adjustment responses</h1>
			<p class="mt-1 text-sm text-base-content/70">
				Four-axis grades for completed neurodiversity adjustment responses, computed by the shared
				engine. Select a row to open the response.
			</p>
		</div>
		<a href="/neurodiversity-adjustment-responses/new" class="button" data-variant="primary"
			>New response</a
		>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Outcome</span>
			<select class="select inline-block w-auto" bind:value={outcomeFilter}>
				<option value="">All</option>
				<option value="fully-agreed">Fully agreed</option>
				<option value="partially-agreed">Partially agreed</option>
				<option value="alternative-offered">Alternative offered</option>
				<option value="declined">Declined</option>
				<option value="deferred">Deferred</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Follow-up urgency</span>
			<select class="select inline-block w-auto" bind:value={urgencyFilter}>
				<option value="">All</option>
				<option value="none">None</option>
				<option value="review-scheduled">Review scheduled</option>
				<option value="urgent-review">Urgent review</option>
				<option value="escalation-needed">Escalation needed</option>
			</select>
		</label>
	</div>

	<section class="mb-4" aria-label="Compliance overview">
		<div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
			{#each cards as card (card.label)}
				<div class="rounded-lg border border-base-300 bg-base-100 px-3 py-2">
					<div class="text-2xl font-bold tabular-nums {card.cls}">{card.value}</div>
					<div class="text-xs text-base-content/60">{card.label}</div>
				</div>
			{/each}
		</div>
	</section>

	<div class="overflow-hidden rounded-xl border border-base-300" style="height: 600px;">
		<GridTheme>
			<Grid data={rows} {columns} {init} />
		</GridTheme>
	</div>

	<p class="mt-4 text-sm text-base-content/60">{rows.length} responses</p>
</main>
