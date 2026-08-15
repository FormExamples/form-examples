<script lang="ts">
	// Review dashboard: every recorded dietetic assessment with its MUST score,
	// GLIM diagnosis, refeeding risk, composite nutrition risk, and safety
	// flags. Filterable on each of those, and sortable by clinical severity
	// rather than alphabetically.
	import Alert from '#lib/components/ui/Alert.svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import { sampleAssessments } from '#lib/data/sample-reports.js';
	import { RECOMMENDATION_LABELS } from '#lib/engine/grader.js';
	import type { AssessmentRow } from '#lib/engine/types.js';
	import { titleCase } from '#lib/engine/utils.js';

	const rows: AssessmentRow[] = sampleAssessments;

	let search = $state('');
	let riskFilter = $state('');
	let mustFilter = $state('');
	let glimFilter = $state('');
	let refeedingFilter = $state('');
	let sortKey = $state<keyof AssessmentRow>('assessmentDate');
	let sortAsc = $state(false);

	const RANKS: Partial<Record<keyof AssessmentRow, Record<string, number>>> = {
		mustRisk: { low: 0, medium: 1, high: 2 },
		glimDiagnosis: { none: 0, moderate: 1, severe: 2 },
		refeedingRisk: { none: 0, high: 1, highest: 2 },
		compositeRisk: { low: 0, moderate: 1, high: 2, critical: 3 },
		recommendation: {
			discharge: 0,
			'routine-care': 1,
			'observe-and-rescreen': 2,
			'dietetic-treatment-plan': 3,
			'urgent-referral': 4
		}
	};

	function sortValue(row: AssessmentRow, key: keyof AssessmentRow): number | string {
		const rank = RANKS[key];
		if (rank) return rank[String(row[key])] ?? -1;
		const v = row[key];
		if (v === null || v === undefined) return -Infinity;
		return typeof v === 'number' ? v : String(v).toLowerCase();
	}

	const visible = $derived.by(() => {
		const needle = search.trim().toLowerCase();
		const filtered = rows.filter((row) => {
			if (riskFilter && row.compositeRisk !== riskFilter) return false;
			if (mustFilter && row.mustRisk !== mustFilter) return false;
			if (glimFilter && row.glimDiagnosis !== glimFilter) return false;
			if (refeedingFilter && row.refeedingRisk !== refeedingFilter) return false;
			if (needle) {
				const haystack = [row.patient, row.nhs, row.dietitian, row.id].join(' ').toLowerCase();
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
		Boolean(search || riskFilter || mustFilter || glimFilter || refeedingFilter)
	);

	function toggleSort(key: keyof AssessmentRow) {
		if (sortKey === key) sortAsc = !sortAsc;
		else {
			sortKey = key;
			sortAsc = true;
		}
	}

	function clearFilters() {
		search = '';
		riskFilter = '';
		mustFilter = '';
		glimFilter = '';
		refeedingFilter = '';
	}

	const COLUMNS: Array<{ key: keyof AssessmentRow | null; label: string }> = [
		{ key: 'assessmentDate', label: 'Date' },
		{ key: 'patient', label: 'Patient' },
		{ key: 'nhs', label: 'NHS number' },
		{ key: 'bmi', label: 'BMI' },
		{ key: 'weightLossPercent', label: 'Weight loss' },
		{ key: 'mustScore', label: 'MUST' },
		{ key: 'mustRisk', label: 'MUST risk' },
		{ key: 'glimDiagnosis', label: 'GLIM' },
		{ key: 'refeedingRisk', label: 'Refeeding' },
		{ key: 'compositeRisk', label: 'Composite risk' },
		{ key: 'recommendation', label: 'Recommendation' },
		{ key: null, label: 'Flags' },
		{ key: 'dietitian', label: 'Dietitian' },
		{ key: 'reviewDate', label: 'Review' }
	];
</script>

<svelte:head>
	<title>Dietetic Assessment — dashboard</title>
</svelte:head>

<main class="mx-16 px-4 py-8">
	<h1 class="text-2xl font-bold text-base-content">Dietetic Assessment dashboard</h1>
	<p class="mt-2 max-w-3xl text-sm text-base-content/70">
		Every recorded assessment with its MUST score, GLIM diagnosis, refeeding risk, composite
		nutrition risk, and safety flags. Composite risk uses the max-grade algorithm, so the worst
		finding sets the band.
	</p>

	<Alert type="info" class="mt-4">
		No back-end is configured, so this dashboard is showing the sample rows shipped with the app.
	</Alert>

	<section class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5" aria-label="Filters">
		<Field label="Search" inputId="filter-search">
			<TextInput
				id="filter-search"
				label="Search"
				placeholder="Patient, NHS number, or dietitian"
				bind:value={search}
			/>
		</Field>
		<Field label="Composite risk" inputId="filter-risk">
			<Select id="filter-risk" label="Composite risk" bind:value={riskFilter}>
				<option value="">All</option>
				<option value="low">Low</option>
				<option value="moderate">Moderate</option>
				<option value="high">High</option>
				<option value="critical">Critical</option>
			</Select>
		</Field>
		<Field label="MUST risk" inputId="filter-must">
			<Select id="filter-must" label="MUST risk" bind:value={mustFilter}>
				<option value="">All</option>
				<option value="low">Low (0)</option>
				<option value="medium">Medium (1)</option>
				<option value="high">High (2 or more)</option>
			</Select>
		</Field>
		<Field label="GLIM diagnosis" inputId="filter-glim">
			<Select id="filter-glim" label="GLIM diagnosis" bind:value={glimFilter}>
				<option value="">All</option>
				<option value="none">None</option>
				<option value="moderate">Moderate</option>
				<option value="severe">Severe</option>
			</Select>
		</Field>
		<Field label="Refeeding risk" inputId="filter-refeeding">
			<Select id="filter-refeeding" label="Refeeding risk" bind:value={refeedingFilter}>
				<option value="">All</option>
				<option value="none">None</option>
				<option value="high">High</option>
				<option value="highest">Highest</option>
			</Select>
		</Field>
	</section>

	<div class="mt-4 flex gap-2">
		<Button data-variant="secondary" onclick={clearFilters}>Clear filters</Button>
		<a class="button" data-variant="primary" href="/dietic-assessment/dietic-assessments/new">
			New assessment
		</a>
	</div>

	<div class="mt-6 overflow-x-auto">
		<table class="data-table w-full">
			<caption class="sr-only">Dietetic assessments</caption>
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
						<td class="data-table-td">
							{#if row.bmi === null}
								<abbr title="Estimated from mid-upper-arm circumference">est.</abbr>
							{:else}
								{row.bmi}
							{/if}
						</td>
						<td class="data-table-td">
							{row.weightLossPercent === null ? '—' : `${row.weightLossPercent}%`}
						</td>
						<td class="data-table-td">
							{row.mustScore}{row.mustIsEstimated ? ' (est.)' : ''}
						</td>
						<td class="data-table-td">{titleCase(row.mustRisk)}</td>
						<td class="data-table-td">{titleCase(row.glimDiagnosis)}</td>
						<td class="data-table-td">{titleCase(row.refeedingRisk)}</td>
						<td class="data-table-td">{titleCase(row.compositeRisk)}</td>
						<td class="data-table-td">
							{RECOMMENDATION_LABELS[row.recommendation] ?? titleCase(row.recommendation)}
						</td>
						<td class="data-table-td">
							{row.flags.length === 0 ? '—' : row.flags.map((f) => titleCase(f)).join(', ')}
						</td>
						<td class="data-table-td">{row.dietitian}</td>
						<td class="data-table-td">{row.reviewDate}</td>
					</tr>
				{/each}
			</tbody>
			<tfoot class="data-table-foot">
				<tr class="data-table-row">
					<td class="data-table-td" colspan={COLUMNS.length}>
						{hasFilters
							? `Showing ${visible.length} of ${rows.length} assessments.`
							: `${rows.length} assessments.`}
					</td>
				</tr>
			</tfoot>
		</table>
	</div>

	{#if visible.length === 0}
		<p class="empty-message mt-4">No assessments match the current filters.</p>
	{/if}
</main>
