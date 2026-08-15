<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/env';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleAssessmentRows } from '#lib/data/sample-reports.js';
	import { outcomeLabel, roleLabel } from '#lib/engine/utils.js';
	import type { Outcome, TraineeRole } from '#lib/engine/types.js';

	let outcomeFilter = $state('');
	let roleFilter = $state('');
	let gridApi = $state<any>(null);

	const rows = $derived(
		sampleAssessmentRows.filter(
			(r) =>
				(outcomeFilter === '' || r.outcome === outcomeFilter) &&
				(roleFilter === '' || r.role === roleFilter)
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

	// SVAR DataGrid columns. The Pass/Fail outcome, critical-action failures,
	// and deficiency counts render through the shared engine output so the
	// dashboard and report stay aligned.
	const columns = [
		{ id: 'id', header: 'Assessment', width: 130 },
		{
			id: 'traineeName',
			header: 'Trainee',
			flexgrow: 2,
			sort: true
		},

		{
			id: 'role',
			header: 'Role',
			width: 130,
			sort: true,
			template: (v: TraineeRole) => roleLabel(v) || '—'
		},
		{ id: 'sessionDate', header: 'Session', width: 120, sort: true },
		{
			id: 'outcome',
			header: 'Outcome',
			width: 110,
			sort: true,
			template: (v: Outcome) => outcomeLabel(v)
		},
		{ id: 'criticalFailures', header: 'Critical fails', width: 120, sort: true },
		{ id: 'deficiencies', header: 'Deficiencies', width: 120, sort: true },
		{ id: 'flagCount', header: 'Flags', width: 90, sort: true }
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'traineeName', order: 'asc' });
		// Open an assessment when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/cardiopulmonary-resuscitation-training/cardiopulmonary-resuscitation-trainings/${ev.id}`);
		});
	}
</script>

<main class="mx-16 px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">Training coordinator dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				Pass / Fail outcome, critical-action failures, and deficiency counts for assessed trainees,
				computed by the shared engine. Select a row to open the assessment.
			</p>
		</div>
		<a href="/cardiopulmonary-resuscitation-training/cardiopulmonary-resuscitation-trainings/new" class="button" data-variant="primary">New assessment</a>
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
			<span class="mr-2 font-medium text-base-content/80">Role</span>
			<select class="select inline-block w-auto" bind:value={roleFilter}>
				<option value="">All</option>
				<option value="instructor">Instructor</option>
				<option value="first-responder">First responder</option>
				<option value="nurse">Nurse</option>
				<option value="paramedic">Paramedic</option>
				<option value="physician">Physician</option>
				<option value="other">Other</option>
			</select>
		</label>
	</div>

	<div
		class="overflow-hidden rounded-xl border border-base-300"
		style="height: 600px;"
	><GridTheme><Grid data={rows} columns={columns} init={init} /></GridTheme></div>

	<p class="mt-4 text-sm text-base-content/60">{rows.length} trainees</p>
</main>
