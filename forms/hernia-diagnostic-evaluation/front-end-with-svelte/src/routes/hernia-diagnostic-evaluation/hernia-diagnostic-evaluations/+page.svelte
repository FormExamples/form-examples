<script lang="ts">
	// Review dashboard: every recorded hernia diagnostic evaluation with its
	// hernia type, reducibility status, urgency band, and safety flags.
	// Filterable on each of those, and sortable by clinical severity rather
	// than alphabetically.
	import Alert from '$lib/components/ui/Alert.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import { sampleEvaluations } from '$lib/data/sample-reports';
	import { RECOMMENDATION_LABELS, URGENCY_LABELS } from '$lib/engine/grader';
	import type { EvaluationRow } from '$lib/engine/types';
	import { titleCase } from '$lib/engine/utils';

	const rows: EvaluationRow[] = sampleEvaluations;

	let search = $state('');
	let urgencyFilter = $state('');
	let herniaTypeFilter = $state('');
	let reducibilityFilter = $state('');
	let sortKey = $state<keyof EvaluationRow>('assessmentDate');
	let sortAsc = $state(false);

	const RANKS: Partial<Record<keyof EvaluationRow, Record<string, number>>> = {
		finalUrgency: { routine: 0, soon: 1, urgent: 2, emergency: 3 },
		reducibilityStatus: { reducible: 0, irreducible: 1, incarcerated: 2 },
		recommendation: {
			'watchful-waiting': 0,
			'elective-repair-referral': 1,
			'urgent-referral': 2,
			'emergency-referral': 3,
			conservative: 0
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
			if (urgencyFilter && row.finalUrgency !== urgencyFilter) return false;
			if (herniaTypeFilter && row.herniaType !== herniaTypeFilter) return false;
			if (reducibilityFilter && row.reducibilityStatus !== reducibilityFilter) return false;
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

	const hasFilters = $derived(
		Boolean(search || urgencyFilter || herniaTypeFilter || reducibilityFilter)
	);

	function toggleSort(key: keyof EvaluationRow) {
		if (sortKey === key) sortAsc = !sortAsc;
		else {
			sortKey = key;
			sortAsc = true;
		}
	}

	function clearFilters() {
		search = '';
		urgencyFilter = '';
		herniaTypeFilter = '';
		reducibilityFilter = '';
	}

	const COLUMNS: Array<{ key: keyof EvaluationRow | null; label: string }> = [
		{ key: 'assessmentDate', label: 'Date' },
		{ key: 'patient', label: 'Patient' },
		{ key: 'nhs', label: 'NHS number' },
		{ key: 'herniaType', label: 'Hernia type' },
		{ key: 'reducibilityStatus', label: 'Reducibility' },
		{ key: 'finalUrgency', label: 'Urgency' },
		{ key: 'recommendation', label: 'Recommendation' },
		{ key: null, label: 'Flags' },
		{ key: 'clinician', label: 'Clinician' }
	];
</script>

<svelte:head>
	<title>Hernia Diagnostic Evaluation — dashboard</title>
</svelte:head>

<main class="mx-16 px-4 py-8">
	<h1 class="text-2xl font-bold text-base-content">Hernia Diagnostic Evaluation dashboard</h1>
	<p class="mt-2 max-w-3xl text-sm text-base-content/70">
		Every recorded evaluation with its hernia classification, reducibility status, urgency band,
		and safety flags. The urgency band is computed red-flag-first, so a single positive red flag
		sets the band regardless of every other finding.
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
		<Field label="Urgency" inputId="filter-urgency">
			<Select id="filter-urgency" label="Urgency" bind:value={urgencyFilter}>
				<option value="">All</option>
				<option value="routine">Routine</option>
				<option value="soon">Soon</option>
				<option value="urgent">Urgent</option>
				<option value="emergency">Emergency</option>
			</Select>
		</Field>
		<Field label="Hernia type" inputId="filter-hernia-type">
			<Select id="filter-hernia-type" label="Hernia type" bind:value={herniaTypeFilter}>
				<option value="">All</option>
				<option value="inguinal">Inguinal</option>
				<option value="femoral">Femoral</option>
				<option value="umbilical">Umbilical</option>
				<option value="epigastric">Epigastric</option>
				<option value="incisional">Incisional</option>
				<option value="paraumbilical">Paraumbilical</option>
				<option value="spigelian">Spigelian</option>
				<option value="other">Other</option>
			</Select>
		</Field>
		<Field label="Reducibility" inputId="filter-reducibility">
			<Select id="filter-reducibility" label="Reducibility" bind:value={reducibilityFilter}>
				<option value="">All</option>
				<option value="reducible">Reducible</option>
				<option value="irreducible">Irreducible</option>
				<option value="incarcerated">Incarcerated</option>
			</Select>
		</Field>
	</section>

	<div class="mt-4 flex gap-2">
		<Button data-variant="secondary" onclick={clearFilters}>Clear filters</Button>
		<a class="button" data-variant="primary" href="/hernia-diagnostic-evaluation/hernia-diagnostic-evaluations/new">
			New evaluation
		</a>
	</div>

	<div class="mt-6 overflow-x-auto">
		<table class="data-table w-full">
			<caption class="sr-only">Hernia diagnostic evaluations</caption>
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
						<td class="data-table-td">
							<a href="/hernia-diagnostic-evaluation/hernia-diagnostic-evaluations/{row.id}">{row.patient}</a>
						</td>
						<td class="data-table-td">{row.nhs}</td>
						<td class="data-table-td">{titleCase(row.herniaType)}</td>
						<td class="data-table-td">{titleCase(row.reducibilityStatus)}</td>
						<td class="data-table-td">{URGENCY_LABELS[row.finalUrgency]}</td>
						<td class="data-table-td">
							{RECOMMENDATION_LABELS[row.recommendation] ?? titleCase(row.recommendation)}
						</td>
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
