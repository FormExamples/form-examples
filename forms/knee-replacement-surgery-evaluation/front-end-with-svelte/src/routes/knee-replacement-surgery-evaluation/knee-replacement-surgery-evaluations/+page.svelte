<script lang="ts">
	// Review dashboard: every recorded knee-replacement surgery evaluation with
	// its Oxford Knee Score, surgical candidacy, and safety flags. Filterable
	// on each of those, and sortable by clinical severity rather than
	// alphabetically.
	import Alert from '#lib/components/ui/Alert.svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import { sampleEvaluations } from '#lib/data/sample-reports.js';
	import { CANDIDACY_LABELS } from '#lib/engine/grader.js';
	import type { EvaluationRow } from '#lib/engine/types.js';
	import { titleCase } from '#lib/engine/utils.js';

	const rows: EvaluationRow[] = sampleEvaluations;

	let search = $state('');
	let categoryFilter = $state('');
	let candidacyFilter = $state('');
	let kneeSideFilter = $state('');
	let sortKey = $state<keyof EvaluationRow>('assessmentDate');
	let sortAsc = $state(false);

	const RANKS: Partial<Record<keyof EvaluationRow, Record<string, number>>> = {
		oksCategory: { satisfactory: 0, 'mild-to-moderate': 1, moderate: 2, severe: 3 },
		candidacy: {
			'not-indicated': 0,
			'continue-conservative': 1,
			'mdt-review': 2,
			candidate: 3,
			'strong-candidate': 4
		}
	};

	function sortValue(row: EvaluationRow, key: keyof EvaluationRow): number | string {
		const rank = RANKS[key];
		if (rank) return rank[String(row[key])] ?? -1;
		const v = row[key];
		if (v === null || v === undefined) return -Infinity;
		return typeof v === 'number' ? v : String(v).toLowerCase();
	}

	const visible = $derived.by(() => {
		const needle = search.trim().toLowerCase();
		const filtered = rows.filter((row) => {
			if (categoryFilter && row.oksCategory !== categoryFilter) return false;
			if (candidacyFilter && row.candidacy !== candidacyFilter) return false;
			if (kneeSideFilter && row.kneeSide !== kneeSideFilter) return false;
			if (needle) {
				const haystack = [row.patient, row.nhs, row.clinician, row.id].join(' ').toLowerCase();
				if (!haystack.includes(needle)) return false;
			}
			return true;
		});
		const dir = sortAsc ? 1 : -1;
		return [...filtered].sort((a, b) => {
			const av = sortValue(a, sortKey);
			const bv = sortValue(b, sortKey);
			if (av < bv) return -1 * dir;
			if (av > bv) return 1 * dir;
			return 0;
		});
	});

	const hasFilters = $derived(Boolean(search || categoryFilter || candidacyFilter || kneeSideFilter));

	function toggleSort(key: keyof EvaluationRow) {
		if (sortKey === key) sortAsc = !sortAsc;
		else {
			sortKey = key;
			sortAsc = true;
		}
	}

	function clearFilters() {
		search = '';
		categoryFilter = '';
		candidacyFilter = '';
		kneeSideFilter = '';
	}

	const COLUMNS: Array<{ key: keyof EvaluationRow | null; label: string }> = [
		{ key: 'assessmentDate', label: 'Date' },
		{ key: 'patient', label: 'Patient' },
		{ key: 'nhs', label: 'NHS number' },
		{ key: 'kneeSide', label: 'Knee' },
		{ key: 'oksTotal', label: 'OKS' },
		{ key: 'oksCategory', label: 'OKS category' },
		{ key: 'candidacy', label: 'Candidacy' },
		{ key: 'planRecommendation', label: 'Recommendation' },
		{ key: null, label: 'Flags' },
		{ key: 'clinician', label: 'Clinician' }
	];
</script>

<svelte:head>
	<title>Knee Replacement Surgery Evaluation — dashboard</title>
</svelte:head>

<main class="mx-16 px-4 py-8">
	<h1 class="text-2xl font-bold text-base-content">Knee Replacement Surgery Evaluation dashboard</h1>
	<p class="mt-2 max-w-3xl text-sm text-base-content/70">
		Every recorded evaluation with its Oxford Knee Score, surgical candidacy, and safety flags.
	</p>

	<Alert type="info" class="mt-4">
		No back-end is configured, so this dashboard is showing the sample rows shipped with the app.
	</Alert>

	<section class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Filters">
		<Field label="Search" inputId="filter-search">
			<TextInput
				id="filter-search"
				label="Search"
				placeholder="Patient, NHS number, or clinician"
				bind:value={search}
			/>
		</Field>
		<Field label="OKS category" inputId="filter-category">
			<Select id="filter-category" label="OKS category" bind:value={categoryFilter}>
				<option value="">All</option>
				<option value="severe">Severe</option>
				<option value="moderate">Moderate</option>
				<option value="mild-to-moderate">Mild to moderate</option>
				<option value="satisfactory">Satisfactory</option>
			</Select>
		</Field>
		<Field label="Candidacy" inputId="filter-candidacy">
			<Select id="filter-candidacy" label="Candidacy" bind:value={candidacyFilter}>
				<option value="">All</option>
				<option value="strong-candidate">Strong candidate</option>
				<option value="candidate">Candidate</option>
				<option value="continue-conservative">Continue conservative</option>
				<option value="not-indicated">Not indicated</option>
				<option value="mdt-review">MDT review</option>
			</Select>
		</Field>
		<Field label="Knee side" inputId="filter-knee-side">
			<Select id="filter-knee-side" label="Knee side" bind:value={kneeSideFilter}>
				<option value="">All</option>
				<option value="left">Left</option>
				<option value="right">Right</option>
				<option value="bilateral">Bilateral</option>
			</Select>
		</Field>
	</section>

	<div class="mt-4 flex gap-2">
		<Button data-variant="secondary" onclick={clearFilters}>Clear filters</Button>
		<a class="button" data-variant="primary" href="/knee-replacement-surgery-evaluation/knee-replacement-surgery-evaluations/new">
			New evaluation
		</a>
	</div>

	<div class="mt-6 overflow-x-auto">
		<table class="data-table w-full">
			<caption class="sr-only">Knee-replacement surgery evaluations</caption>
			<thead class="data-table-head">
				<tr class="data-table-row">
					{#each COLUMNS as column (column.label)}
						<th
							class="data-table-th"
							scope="col"
							aria-sort={column.key && sortKey === column.key
								? sortAsc
									? 'ascending'
									: 'descending'
								: undefined}
						>
							{#if column.key}
								<button type="button" onclick={() => toggleSort(column.key!)}>{column.label}</button>
							{:else}
								{column.label}
							{/if}
						</th>
					{/each}
				</tr>
			</thead>
			<tbody class="data-table-body">
				{#each visible as row (row.id)}
					<tr class="data-table-row">
						<td class="data-table-td">{row.assessmentDate}</td>
						<td class="data-table-td">{row.patient}</td>
						<td class="data-table-td">{row.nhs}</td>
						<td class="data-table-td">{titleCase(row.kneeSide)}</td>
						<td class="data-table-td">{row.oksTotal} / 48</td>
						<td class="data-table-td">{titleCase(row.oksCategory)}</td>
						<td class="data-table-td">{CANDIDACY_LABELS[row.candidacy] ?? titleCase(row.candidacy)}</td>
						<td class="data-table-td">{titleCase(row.planRecommendation)}</td>
						<td class="data-table-td">
							{row.flags.length === 0 ? '—' : row.flags.map((f) => titleCase(f)).join(', ')}
						</td>
						<td class="data-table-td">{row.clinician}</td>
					</tr>
				{/each}
			</tbody>
			<tfoot class="data-table-foot">
				<tr class="data-table-row">
					<td class="data-table-td" colspan={COLUMNS.length}>
						{hasFilters
							? `Showing ${visible.length} of ${rows.length} evaluations.`
							: `${rows.length} evaluations.`}
					</td>
				</tr>
			</tfoot>
		</table>
	</div>

	{#if visible.length === 0}
		<p class="empty-message mt-4">No evaluations match the current filters.</p>
	{/if}
</main>
