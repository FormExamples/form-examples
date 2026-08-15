<script lang="ts">
	// Review dashboard: every recorded cataract diagnostic evaluation with its
	// LOCS III severity per eye, computed and final surgical candidacy, and
	// safety flags. Filterable on each of those, and sortable by clinical
	// severity rather than alphabetically.
	import Alert from '#lib/components/ui/Alert.svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import { sampleEvaluations } from '#lib/data/sample-reports.js';
	import { LOCS_III_SEVERITY_LABELS, SURGICAL_CANDIDACY_LABELS } from '#lib/engine/grader.js';
	import type { EvaluationRow } from '#lib/engine/types.js';
	import { titleCase } from '#lib/engine/utils.js';

	const rows: EvaluationRow[] = sampleEvaluations;

	let search = $state('');
	let candidacyFilter = $state('');
	let severityFilter = $state('');
	let sortKey = $state<keyof EvaluationRow>('assessmentDate');
	let sortAsc = $state(false);

	const RANKS: Partial<Record<keyof EvaluationRow, Record<string, number>>> = {
		locsIIISeverityRight: { '': -1, mild: 0, moderate: 1, severe: 2 },
		locsIIISeverityLeft: { '': -1, mild: 0, moderate: 1, severe: 2 },
		computedSurgicalCandidacy: { '': -1, 'not-indicated': 0, consider: 1, indicated: 2, 'urgent-referral': 3 },
		finalSurgicalCandidacy: { '': -1, 'not-indicated': 0, consider: 1, indicated: 2, 'urgent-referral': 3 }
	};

	function sortValue(row: EvaluationRow, key: keyof EvaluationRow): number | string {
		const rank = RANKS[key];
		if (rank) return rank[String(row[key])] ?? -2;
		const v = row[key];
		if (v === null || v === undefined) return -Infinity;
		return typeof v === 'number' ? v : String(v).toLowerCase();
	}

	function worseSeverity(row: EvaluationRow): string {
		const order = ['', 'mild', 'moderate', 'severe'];
		return order.indexOf(row.locsIIISeverityLeft) > order.indexOf(row.locsIIISeverityRight)
			? row.locsIIISeverityLeft
			: row.locsIIISeverityRight;
	}

	const visible = $derived.by(() => {
		const needle = search.trim().toLowerCase();
		const filtered = rows.filter((row) => {
			if (candidacyFilter && row.finalSurgicalCandidacy !== candidacyFilter) return false;
			if (severityFilter && worseSeverity(row) !== severityFilter) return false;
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

	const hasFilters = $derived(Boolean(search || candidacyFilter || severityFilter));

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
		severityFilter = '';
	}

	const COLUMNS: Array<{ key: keyof EvaluationRow | null; label: string }> = [
		{ key: 'assessmentDate', label: 'Date' },
		{ key: 'patient', label: 'Patient' },
		{ key: 'nhs', label: 'NHS number' },
		{ key: 'locsIIISeverityRight', label: 'LOCS III — right' },
		{ key: 'locsIIISeverityLeft', label: 'LOCS III — left' },
		{ key: 'computedSurgicalCandidacy', label: 'Computed candidacy' },
		{ key: 'finalSurgicalCandidacy', label: 'Final candidacy' },
		{ key: null, label: 'Flags' },
		{ key: 'clinician', label: 'Clinician' }
	];
</script>

<svelte:head>
	<title>Cataract Diagnostic Evaluation — dashboard</title>
</svelte:head>

<main class="mx-16 px-4 py-8">
	<h1 class="text-2xl font-bold text-base-content">Cataract Diagnostic Evaluation dashboard</h1>
	<p class="mt-2 max-w-3xl text-sm text-base-content/70">
		Every recorded evaluation with its LOCS III severity per eye, computed and final surgical
		candidacy, and safety flags. Surgical candidacy uses the max-grade algorithm, so the worse eye
		and the worse finding set the band.
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
		<Field label="Worse-eye LOCS III severity" inputId="filter-severity">
			<Select id="filter-severity" label="Worse-eye LOCS III severity" bind:value={severityFilter}>
				<option value="">All</option>
				<option value="mild">Mild</option>
				<option value="moderate">Moderate</option>
				<option value="severe">Severe</option>
			</Select>
		</Field>
		<Field label="Final surgical candidacy" inputId="filter-candidacy">
			<Select id="filter-candidacy" label="Final surgical candidacy" bind:value={candidacyFilter}>
				<option value="">All</option>
				<option value="not-indicated">Not indicated</option>
				<option value="consider">Consider</option>
				<option value="indicated">Indicated</option>
				<option value="urgent-referral">Urgent referral</option>
			</Select>
		</Field>
	</section>

	<div class="mt-4 flex gap-2">
		<Button data-variant="secondary" onclick={clearFilters}>Clear filters</Button>
		<a class="button" data-variant="primary" href="/cataract-diagnostic-evaluation/cataract-diagnostic-evaluations/new">
			New evaluation
		</a>
	</div>

	<div class="mt-6 overflow-x-auto">
		<table class="data-table w-full">
			<caption class="sr-only">Cataract diagnostic evaluations</caption>
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
						<td class="data-table-td">{LOCS_III_SEVERITY_LABELS[row.locsIIISeverityRight] ?? '—'}</td>
						<td class="data-table-td">{LOCS_III_SEVERITY_LABELS[row.locsIIISeverityLeft] ?? '—'}</td>
						<td class="data-table-td">{SURGICAL_CANDIDACY_LABELS[row.computedSurgicalCandidacy] ?? '—'}</td>
						<td class="data-table-td">{SURGICAL_CANDIDACY_LABELS[row.finalSurgicalCandidacy] ?? '—'}</td>
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
