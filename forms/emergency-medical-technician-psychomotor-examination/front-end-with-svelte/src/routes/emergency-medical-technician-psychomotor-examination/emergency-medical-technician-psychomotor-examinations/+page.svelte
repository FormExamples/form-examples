<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleAssessmentRows } from '$lib/data/sample-reports';
	import { outcomeLabel } from '$lib/engine/utils';
	import type { ExamAttempt, Outcome } from '$lib/engine/types';

	const plural = 'emergency-medical-technician-psychomotor-examinations';

	let outcomeFilter = $state('');
	let attemptFilter = $state('');
	let gridApi = $state<any>(null);

	const rows = $derived(
		sampleAssessmentRows.filter(
			(r) =>
				(outcomeFilter === '' || r.outcome === outcomeFilter) &&
				(attemptFilter === '' || r.attempt === attemptFilter)
		)
	);

	// Follow the active Lily theme: pick the dark SVAR skin when the theme's base
	// surface is dark. Recomputed whenever <html data-theme> changes (after the
	// new theme stylesheet has applied its tokens).
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

	const attemptLabel: Record<ExamAttempt, string> = {
		'first-attempt': 'First attempt',
		retest: 'Retest',
		'': '—'
	};

	// SVAR DataGrid columns. Outcome, points, percent, and critical-criteria
	// count render through the shared engine output so the dashboard and report
	// stay aligned.
	const columns = [
		{ id: 'id', header: 'Examination', width: 150 },
		{ id: 'candidateName', header: 'Candidate', flexgrow: 2, sort: true },
		{ id: 'sessionDate', header: 'Date', width: 120, sort: true },
		{
			id: 'attempt',
			header: 'Attempt',
			width: 120,
			sort: true,
			template: (v: ExamAttempt) => attemptLabel[v] ?? '—'
		},
		{
			id: 'outcome',
			header: 'Outcome',
			width: 110,
			sort: true,
			template: (v: Outcome) => outcomeLabel(v)
		},
		{ id: 'score', header: 'Points', width: 100 },
		{ id: 'percent', header: 'Percent', width: 100, sort: true, template: (v: number) => `${v}%` },
		{ id: 'criticalCount', header: 'Critical fails', width: 120, sort: true },
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'candidateName', order: 'asc' });
		// Open an examination when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/emergency-medical-technician-psychomotor-examination/${plural}/${ev.id}`);
		});
	}
</script>

<main class="mx-auto max-w-6xl px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">Training coordinator dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				Pass / Fail outcome, points, and critical-criteria failures for graded candidates, computed
				by the shared engine. Select a row to open the examination.
			</p>
		</div>
		<a href="/emergency-medical-technician-psychomotor-examination/{plural}/new" class="button" data-variant="primary">New examination</a>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Outcome</span>
			<select class="select inline-block w-auto" bind:value={outcomeFilter}>
				<option value="">All</option>
				<option value="pass">Pass</option>
				<option value="fail">Fail</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Attempt</span>
			<select class="select inline-block w-auto" bind:value={attemptFilter}>
				<option value="">All</option>
				<option value="first-attempt">First attempt</option>
				<option value="retest">Retest</option>
			</select>
		</label>
	</div>

	<div class="overflow-hidden rounded-xl border border-base-300" style="height: 600px;">
		<GridTheme>
			<Grid data={rows} {columns} {init} />
		</GridTheme>
	</div>

	<p class="mt-4 text-sm text-base-content/60">{rows.length} candidates</p>
</main>
