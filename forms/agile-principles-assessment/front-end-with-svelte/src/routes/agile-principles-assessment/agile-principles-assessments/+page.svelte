<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/env';
	import { Grid, Willow, WillowDark } from '@svar-ui/svelte-grid';
	import { sampleAssessmentRows } from '#lib/data/sample-reports.js';

	let maturityFilter = $state('');
	let roleFilter = $state('');
	let gridApi = $state<any>(null);

	const rows = $derived(
		sampleAssessmentRows.filter(
			(r) =>
				(maturityFilter === '' || r.maturity === maturityFilter) &&
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

	function maturityLabel(m: string): string {
		switch (m) {
			case 'optimising':
				return 'Optimising';
			case 'mature':
				return 'Mature';
			case 'developing':
				return 'Developing';
			case 'initial':
				return 'Initial';
			case 'ad-hoc':
				return 'Ad-hoc';
			default:
				return 'Insufficient data';
		}
	}

	// SVAR DataGrid columns. The composite maturity, mean score, weak-principle
	// count, and flag count all render through the shared engine output so the
	// dashboard and report stay aligned.
	const columns = [
		{ id: 'id', header: 'Assessment', width: 130 },
		{ id: 'respondent', header: 'Respondent', flexgrow: 2, sort: true },
		{ id: 'role', header: 'Role', width: 150, sort: true, template: (v: string) => v || '—' },
		{ id: 'team', header: 'Team', width: 120, sort: true },
		{
			id: 'assessedDate',
			header: 'Assessed',
			width: 120,
			sort: true
		},

		{
			id: 'answered',
			header: 'Answered',
			width: 100,
			sort: true,
			template: (v: number) => `${v}/12`
		},
		{
			id: 'meanScore',
			header: 'Mean',
			width: 90,
			sort: true,
			template: (v: number | null) => v === null ? '—' : v.toFixed(2)
		},
		{
			id: 'maturity',
			header: 'Maturity',
			width: 150,
			sort: true,
			template: (v: string) => maturityLabel(v)
		},
		{ id: 'weakCount', header: 'Weak', width: 80, sort: true },
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	const ROLES = [
		'individual-contributor',
		'team-lead',
		'scrum-master',
		'product-owner',
		'engineering-manager',
		'agile-coach',
		'executive-sponsor',
		'other'
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'respondent', order: 'asc' });
		// Open an assessment when its row is selected.
		api.on('select-row', (ev: { id?: string | number }) => {
			if (ev?.id != null) goto(`/agile-principles-assessment/agile-principles-assessments/${ev.id}`);
		});
	}
</script>

<main class="mx-16 px-4 py-6">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-base-content">Agile coaching dashboard</h1>
			<p class="mt-1 text-sm text-base-content/70">
				Composite agility maturity, mean score, and operational flag counts for assessed teams,
				computed by the shared engine. Select a row to open the assessment.
			</p>
		</div>
		<a href="/agile-principles-assessment/agile-principles-assessments/new" class="button" data-variant="primary"
			>New assessment</a
		>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Maturity</span>
			<select class="select inline-block w-auto" bind:value={maturityFilter}>
				<option value="">All</option>
				<option value="optimising">Optimising</option>
				<option value="mature">Mature</option>
				<option value="developing">Developing</option>
				<option value="initial">Initial</option>
				<option value="ad-hoc">Ad-hoc</option>
				<option value="insufficient-data">Insufficient data</option>
			</select>
		</label>
		<label class="text-sm">
			<span class="mr-2 font-medium text-base-content/80">Role</span>
			<select class="select inline-block w-auto" bind:value={roleFilter}>
				<option value="">All</option>
				{#each ROLES as r (r)}
					<option value={r}>{r}</option>
				{/each}
			</select>
		</label>
	</div>

	<div
		class="overflow-hidden rounded-xl border border-base-300"
		style="height: 600px;"
	><GridTheme><Grid data={rows} columns={columns} init={init} /></GridTheme></div>

	<p class="mt-4 text-sm text-base-content/60">{rows.length} assessments</p>
</main>
