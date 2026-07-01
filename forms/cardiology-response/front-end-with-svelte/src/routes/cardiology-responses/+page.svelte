<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleReports } from '$lib/data/sample-reports';
	import {
		responseClassificationLabel,
		severityLabel,
		followUpUrgencyLabel,
		consultationTypeLabel,
		responseStatusLabel
	} from '$lib/engine/utils';

	let classificationFilter = $state('');
	let urgencyFilter = $state('');
	let gridApi = $state<any>(null);

	const rows = $derived(
		sampleReports.filter(
			(r) =>
				(classificationFilter === '' || r.responseClassification === classificationFilter) &&
				(urgencyFilter === '' || r.followUpUrgency === urgencyFilter)
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

	// SVAR DataGrid columns. Graded axes render through the shared engine label
	// helpers so the dashboard and the report stay in lock-step.
	const columns = [
		{ id: 'id', header: 'Response', width: 90 },
		{ id: 'patientName', header: 'Patient', flexgrow: 2, sort: true },
		{
			id: 'consultationType',
			header: 'Consultation',
			flexgrow: 2,
			template: (v: string) => consultationTypeLabel(v as never)
		},
		{
			id: 'responseStatus',
			header: 'Status',
			width: 110,
			template: (v: string) => responseStatusLabel(v as never)
		},
		{ id: 'respondedDate', header: 'Responded', width: 120, sort: true },
		{
			id: 'responseClassification',
			header: 'Classification',
			width: 150,
			template: (v: string) => responseClassificationLabel(v as never)
		},
		{ id: 'severity', header: 'Severity', width: 120, template: (v: string) => severityLabel(v as never) },
		{
			id: 'followUpUrgency',
			header: 'Urgency',
			width: 140,
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
			if (ev?.id != null) goto(`/cardiology-responses/${ev.id}`);
		});
	}
</script>

<main class="mx-auto max-w-5xl px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">Graded cardiology responses</h1>
			<p class="mt-1 text-sm text-base-content/70">
				Four-axis interpretation grades for completed cardiology responses, computed by the shared
				engine. Select a row to open the response.
			</p>
		</div>
		<a href="/cardiology-responses/new" class="button" data-variant="primary">New response</a>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Classification</span>
			<select class="select inline-block w-auto" bind:value={classificationFilter}>
				<option value="">All</option>
				<option value="no-abnormality">No abnormality</option>
				<option value="cardiac-condition">Cardiac condition</option>
				<option value="critical">Critical</option>
				<option value="inconclusive">Inconclusive</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Follow-up urgency</span>
			<select class="select inline-block w-auto" bind:value={urgencyFilter}>
				<option value="">All</option>
				<option value="routine">Routine</option>
				<option value="recommended">Recommended</option>
				<option value="urgent">Urgent</option>
				<option value="critical-alert">Critical alert</option>
			</select>
		</label>
	</div>

	<div class="overflow-hidden rounded-xl border border-base-300" style="height: 600px;">
		<GridTheme>
			<Grid data={rows} {columns} {init} />
		</GridTheme>
	</div>

	<p class="mt-4 text-sm text-base-content/60">{rows.length} responses</p>
</main>
