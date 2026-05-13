<script lang="ts">
	import { Grid, Willow } from '@svar-ui/svelte-grid';
	import { fetchScorecards, fetchStats, type DashboardStats } from '$lib/api';
	import { scorecards as sampleScorecards } from '$lib/data';
	import { bandToRecommendation } from '$lib/recommendation';
	import type { Band, ScorecardRow } from '$lib/types';

	let rows = $state<ScorecardRow[]>(sampleScorecards);
	let stats = $state<DashboardStats | null>(null);
	let loading = $state(true);
	let error = $state('');
	let searchTerm = $state('');
	let bandFilter = $state<Band | ''>('');
	let sectorFilter = $state('');
	let sizeFilter = $state('');
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let gridApi = $state<any>(null);

	$effect(() => {
		fetchScorecards()
			.then((items) => {
				if (items.length > 0) rows = items;
				loading = false;
			})
			.catch(() => {
				loading = false;
			});
		fetchStats().then((s) => { stats = s; });
	});

	const bandOptions = [
		{ value: '', label: 'All bands' },
		{ value: 'low', label: 'Low' },
		{ value: 'borderline', label: 'Borderline' },
		{ value: 'medium', label: 'Medium' },
		{ value: 'high', label: 'High' },
	] as const;

	const sectors = $derived(
		Array.from(new Set(sampleScorecards.map((r) => r.sector))).sort(),
	);

	const sizeOptions = [
		{ value: '', label: 'All sizes' },
		{ value: 'micro', label: 'Micro' },
		{ value: 'small', label: 'Small' },
		{ value: 'medium', label: 'Medium' },
		{ value: 'large', label: 'Large' },
		{ value: 'enterprise', label: 'Enterprise' },
	];

	const columns = [
		{
			id: 'organizationName',
			header: 'Organization',
			flexgrow: 1,
			sort: true,
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			template: (value: any, row: any) =>
				`<a href="/report/${row.id}" class="text-blue-600 hover:underline">${value}</a>`,
		},
		{ id: 'sector', header: 'Sector', width: 140, sort: true },
		{ id: 'sizeBand', header: 'Size', width: 110, sort: true },
		{ id: 'respondentName', header: 'Respondent', width: 180, sort: true },
		{ id: 'assessmentDate', header: 'Date', width: 110, sort: true },
		{ id: 'scoreTotal', header: 'Score', width: 90, sort: true, template: (v: number) => `${v} / 16` },
		{ id: 'manifestoSubtotal', header: 'Mfst', width: 80, sort: true, template: (v: number) => `${v} / 4` },
		{ id: 'principlesSubtotal', header: 'Prin', width: 80, sort: true, template: (v: number) => `${v} / 12` },
		{ id: 'computedBand', header: 'Band', width: 110, sort: true },
		{ id: 'flagsCount', header: 'Flags', width: 80, sort: true },
		{ id: 'recommendation', header: 'Recommendation', flexgrow: 1, sort: true },
	];

	const annotated = $derived(
		rows.map((r) => ({
			...r,
			flagsCount: r.flags.length,
			recommendation: bandToRecommendation(r.computedBand),
		})),
	);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'scoreTotal', order: 'desc' });
	}

	$effect(() => {
		if (!gridApi) return;
		const term = searchTerm.toLowerCase().trim();
		const filter = (row: ScorecardRow & { flagsCount: number }) => {
			if (bandFilter && row.computedBand !== bandFilter) return false;
			if (sectorFilter && row.sector !== sectorFilter) return false;
			if (sizeFilter && row.sizeBand !== sizeFilter) return false;
			if (term) {
				const blob = `${row.organizationName} ${row.respondentName}`.toLowerCase();
				if (!blob.includes(term)) return false;
			}
			return true;
		};
		gridApi.exec('filter-rows', { handler: filter });
	});

	function resetFilters() {
		searchTerm = '';
		bandFilter = '';
		sectorFilter = '';
		sizeFilter = '';
	}
</script>

<main class="max-w-7xl mx-auto px-4 py-6">
	<header class="flex items-baseline justify-between gap-3">
		<div>
			<h1 class="text-2xl font-bold text-slate-800">Agile Consulting Scorecard — Reviewer Dashboard</h1>
			<p class="text-sm text-slate-600 mt-1">
				Aggregate view of submitted scorecards. Filter and sort to identify organizations ready
				to engage external agile consultants and those that should do their homework first.
			</p>
		</div>
		<a href="/import" class="text-sm text-blue-600 whitespace-nowrap">Bulk import →</a>
	</header>

	{#if stats}
		<section class="bg-white border border-slate-300 rounded p-3 mt-4">
			<div class="flex flex-wrap items-end gap-4">
				<div>
					<div class="text-3xl font-bold">{stats.total}</div>
					<div class="text-xs text-slate-600">scorecards</div>
				</div>
				<div>
					<div class="text-3xl font-bold">{stats.averageScore.toFixed(1)}</div>
					<div class="text-xs text-slate-600">avg / 16</div>
				</div>
				<div>
					<div class="text-3xl font-bold {stats.flagCount > 0 ? 'text-red-700' : 'text-green-700'}">{stats.flagCount}</div>
					<div class="text-xs text-slate-600">readiness flags</div>
				</div>
				<div class="flex-1 min-w-[20rem]">
					<div class="text-xs text-slate-600 mb-1">Band distribution</div>
					<div class="flex h-6 rounded overflow-hidden bg-slate-200" title="Low / Borderline / Medium / High">
						{#if stats.byBand.low > 0}
							<div
								class="bg-band-low text-band-low-text text-xs font-semibold flex items-center justify-center"
								style:width="{(stats.byBand.low / stats.total) * 100}%"
								title="Low: {stats.byBand.low}"
							>
								{stats.byBand.low}
							</div>
						{/if}
						{#if stats.byBand.borderline > 0}
							<div
								class="bg-band-borderline text-band-borderline-text text-xs font-semibold flex items-center justify-center"
								style:width="{(stats.byBand.borderline / stats.total) * 100}%"
								title="Borderline: {stats.byBand.borderline}"
							>
								{stats.byBand.borderline}
							</div>
						{/if}
						{#if stats.byBand.medium > 0}
							<div
								class="bg-band-medium text-band-medium-text text-xs font-semibold flex items-center justify-center"
								style:width="{(stats.byBand.medium / stats.total) * 100}%"
								title="Medium: {stats.byBand.medium}"
							>
								{stats.byBand.medium}
							</div>
						{/if}
						{#if stats.byBand.high > 0}
							<div
								class="bg-band-high text-band-high-text text-xs font-semibold flex items-center justify-center"
								style:width="{(stats.byBand.high / stats.total) * 100}%"
								title="High: {stats.byBand.high}"
							>
								{stats.byBand.high}
							</div>
						{/if}
					</div>
					<div class="flex justify-between text-[0.7rem] text-slate-500 mt-1">
						<span>low {stats.byBand.low}</span>
						<span>borderline {stats.byBand.borderline}</span>
						<span>medium {stats.byBand.medium}</span>
						<span>high {stats.byBand.high}</span>
					</div>
				</div>
			</div>
		</section>
	{/if}

	<div class="bg-white border border-slate-300 rounded p-3 mt-4 flex flex-wrap gap-3 items-end">
		<label class="flex flex-col text-xs text-slate-600">
			Band
			<select
				class="mt-1 p-1.5 rounded border border-slate-300 text-sm"
				bind:value={bandFilter}
			>
				{#each bandOptions as opt (opt.value)}
					<option value={opt.value}>{opt.label}</option>
				{/each}
			</select>
		</label>
		<label class="flex flex-col text-xs text-slate-600">
			Sector
			<select
				class="mt-1 p-1.5 rounded border border-slate-300 text-sm"
				bind:value={sectorFilter}
			>
				<option value="">All sectors</option>
				{#each sectors as s (s)}
					<option value={s}>{s}</option>
				{/each}
			</select>
		</label>
		<label class="flex flex-col text-xs text-slate-600">
			Size
			<select
				class="mt-1 p-1.5 rounded border border-slate-300 text-sm"
				bind:value={sizeFilter}
			>
				{#each sizeOptions as opt (opt.value)}
					<option value={opt.value}>{opt.label}</option>
				{/each}
			</select>
		</label>
		<label class="flex flex-col text-xs text-slate-600">
			Search
			<input
				type="search"
				class="mt-1 p-1.5 rounded border border-slate-300 text-sm"
				placeholder="organization or respondent"
				bind:value={searchTerm}
			/>
		</label>
		<button
			type="button"
			class="ml-auto px-3 py-1.5 rounded border border-slate-300 bg-white text-slate-700 text-sm"
			onclick={resetFilters}
		>
			Reset
		</button>
	</div>

	{#if loading}
		<p class="text-sm text-slate-500 mt-3">Loading from API… (showing bundled sample data)</p>
	{/if}
	{#if error}
		<p class="text-sm text-red-700 mt-3">{error}</p>
	{/if}

	<div class="mt-4 bg-white rounded border border-slate-300 overflow-hidden">
		<Willow>
			<Grid data={annotated} {columns} {init}></Grid>
		</Willow>
	</div>
</main>
