<script lang="ts">
	// Review dashboard: every recorded hip-replacement surgery evaluation with
	// its Oxford Hip Score, Kellgren and Lawrence grade, surgical-candidacy
	// recommendation, and safety flags. Filterable on each of those, and
	// sortable by clinical severity rather than alphabetically.
	import Alert from '$lib/components/ui/Alert.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import { sampleEvaluations } from '$lib/data/sample-reports';
	import { CANDIDACY_LABELS } from '$lib/engine/grader';
	import type { EvaluationRow } from '$lib/engine/types';
	import { titleCase } from '$lib/engine/utils';

	const rows: EvaluationRow[] = sampleEvaluations;

	let search = $state('');
	let candidacyFilter = $state('');
	let ohsCategoryFilter = $state('');
	let sortKey = $state<keyof EvaluationRow>('assessmentDate');
	let sortAsc = $state(false);

	const RANKS: Partial<Record<keyof EvaluationRow, Record<string, number>>> = {
		ohsCategory: { severe: 0, moderate: 1, 'mild-to-moderate': 2, satisfactory: 3 },
		candidacy: {
			'strong-candidate': 0,
			candidate: 1,
			'continue-conservative': 2,
			'mdt-review': 3,
			'not-indicated': 4
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
			if (candidacyFilter && row.candidacy !== candidacyFilter) return false;
			if (ohsCategoryFilter && row.ohsCategory !== ohsCategoryFilter) return false;
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

	const hasFilters = $derived(Boolean(search || candidacyFilter || ohsCategoryFilter));

	function toggleSort(key: keyof EvaluationRow) {
		if (sortKey === key) sortAsc = !sortAsc;
		else {
			sortKey = key;
			sortAsc = true;
		}
	}

	function clearFilters() {
		search = '';
		candidacyFilter = '';
		ohsCategoryFilter = '';
	}

	const COLUMNS: Array<{ key: keyof EvaluationRow | null; label: string }> = [
		{ key: 'assessmentDate', label: 'Date' },
		{ key: 'patient', label: 'Patient' },
		{ key: 'nhs', label: 'NHS number' },
		{ key: 'bmi', label: 'BMI' },
		{ key: 'ohsTotal', label: 'OHS' },
		{ key: 'ohsCategory', label: 'OHS category' },
		{ key: 'kellgrenLawrenceGrade', label: 'KL grade' },
		{ key: 'candidacy', label: 'Candidacy' },
		{ key: null, label: 'Flags' },
		{ key: 'clinician', label: 'Clinician' }
	];
</script>

<svelte:head>
	<title>Hip Replacement Surgery Evaluation — dashboard</title>
</svelte:head>

<main class="mx-16 px-4 py-8">
	<h1 class="text-2xl font-bold text-base-content">Hip Replacement Surgery Evaluation dashboard</h1>
	<p class="mt-2 max-w-3xl text-sm text-base-content/70">
		Every recorded evaluation with its Oxford Hip Score, Kellgren and Lawrence grade,
		surgical-candidacy recommendation, and safety flags.
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
		<Field label="OHS category" inputId="filter-ohs-category">
			<Select id="filter-ohs-category" label="OHS category" bind:value={ohsCategoryFilter}>
				<option value="">All</option>
				<option value="severe">Severe</option>
				<option value="moderate">Moderate</option>
				<option value="mild-to-moderate">Mild-to-moderate</option>
				<option value="satisfactory">Satisfactory</option>
			</Select>
		</Field>
	</section>

	<div class="mt-4 flex gap-2">
		<Button data-variant="secondary" onclick={clearFilters}>Clear filters</Button>
		<a class="button" data-variant="primary" href="/hip-replacement-surgery-evaluation/hip-replacement-surgery-evaluations/new">
			New evaluation
		</a>
	</div>

	<div class="mt-6 overflow-x-auto">
		<table class="data-table w-full">
			<caption class="sr-only">Hip replacement surgery evaluations</caption>
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
						<td class="data-table-td">{row.bmi === null ? '—' : row.bmi}</td>
						<td class="data-table-td">{row.ohsTotal} / 48</td>
						<td class="data-table-td">{titleCase(row.ohsCategory)}</td>
						<td class="data-table-td">{row.kellgrenLawrenceGrade === null ? '—' : row.kellgrenLawrenceGrade}</td>
						<td class="data-table-td">{CANDIDACY_LABELS[row.candidacy] ?? titleCase(row.candidacy)}</td>
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
