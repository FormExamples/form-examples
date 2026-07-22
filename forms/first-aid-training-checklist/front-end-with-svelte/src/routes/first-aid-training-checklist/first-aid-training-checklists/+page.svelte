<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleAssessmentRows } from '$lib/data/sample-reports';
	import { outcomeLabel, traineeRoleLabel, certificationCurrencyLabel } from '$lib/engine/utils';
	import type { Outcome, TraineeRole } from '$lib/engine/types';
	import type { CertificationCurrency } from '$lib/engine/utils';

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
		const update = () => (isDark = computeDark());
		update();
		const obs = new MutationObserver(() => setTimeout(update, 120));
		obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
		return () => obs.disconnect();
	});
	const GridTheme = $derived(isDark ? WillowDark : Willow);

	// SVAR DataGrid columns. The outcome, skills-demonstrated tally, critical-skill
	// failure count, and certification currency all render through the shared
	// engine output so the dashboard and report stay aligned.
	const columns = [
		{ id: 'id', header: 'Assessment', width: 120 },
		{ id: 'traineeName', header: 'Trainee', flexgrow: 2, sort: true },
		{
			id: 'role',
			header: 'Role',
			width: 150,
			sort: true,
			template: (v: string) => traineeRoleLabel(v as TraineeRole) || '—'
		},
		{ id: 'assessedDate', header: 'Assessed', width: 120, sort: true },
		{
			id: 'outcome',
			header: 'Outcome',
			width: 150,
			sort: true,
			template: (v: string) => outcomeLabel(v as Outcome)
		},
		{
			id: 'skillsDemonstrated',
			header: 'Skills',
			width: 90,
			sort: true,
			template: (v: number, row: any) => `${v}/${row.skillsTotal}`
		},
		{ id: 'criticalCount', header: 'Critical fails', width: 110, sort: true },
		{
			id: 'currency',
			header: 'Certification',
			width: 130,
			sort: true,
			template: (v: string) => certificationCurrencyLabel(v as CertificationCurrency)
		},
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'traineeName', order: 'asc' });
		// Open an assessment when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/first-aid-training-checklist/first-aid-training-checklists/${ev.id}`);
		});
	}
</script>

<main class="mx-16 px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">Training coordinator dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				First Aid at Work outcome, skills demonstrated, and critical-skill failures for assessed
				trainees, computed by the shared engine. Select a row to open the assessment.
			</p>
		</div>
		<a href="/first-aid-training-checklist/first-aid-training-checklists/new" class="button" data-variant="primary">New assessment</a>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Outcome</span>
			<select class="select inline-block w-auto" bind:value={outcomeFilter}>
				<option value="">All</option>
				<option value="pass">Pass</option>
				<option value="needs-development">Needs Development</option>
				<option value="fail">Fail</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Role</span>
			<select class="select inline-block w-auto" bind:value={roleFilter}>
				<option value="">All</option>
				<option value="first-aider">First Aider</option>
				<option value="workplace-first-aider">Workplace First Aider</option>
				<option value="instructor-candidate">Instructor Candidate</option>
				<option value="security-officer">Security Officer</option>
				<option value="lifeguard">Lifeguard</option>
				<option value="teacher">Teacher</option>
				<option value="volunteer">Volunteer</option>
				<option value="other">Other</option>
			</select>
		</label>
	</div>

	<div class="overflow-hidden rounded-xl border border-base-300" style="height: 600px;">
		<GridTheme>
			<Grid data={rows} {columns} {init} />
		</GridTheme>
	</div>

	<p class="mt-4 text-sm text-base-content/60">{rows.length} trainees</p>
</main>
