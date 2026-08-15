<script lang="ts">
	// Review dashboard: every recorded health screening questionnaire with its
	// PAR-Q+ clearance, AUDIT-C band, composite risk band, referral
	// recommendation, and safety flags. Filterable on each of those.
	import Alert from '#lib/components/ui/Alert.svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import { sampleQuestionnaires } from '#lib/data/sample-reports.js';
	import { PARQ_CLEARANCE_LABELS, RECOMMENDATION_LABELS } from '#lib/engine/grader.js';
	import type { QuestionnaireRow } from '#lib/engine/types.js';
	import { titleCase } from '#lib/engine/utils.js';

	const rows: QuestionnaireRow[] = sampleQuestionnaires;

	let search = $state('');
	let riskFilter = $state('');
	let parqFilter = $state('');
	let auditCFilter = $state('');
	let sortKey = $state<keyof QuestionnaireRow>('assessmentDate');
	let sortAsc = $state(false);

	const RANKS: Partial<Record<keyof QuestionnaireRow, Record<string, number>>> = {
		riskBand: { low: 0, moderate: 1, high: 2, 'refer-urgently': 3 },
		auditCBand: { low: 0, 'increasing-risk': 1, 'higher-risk': 2 },
		recommendation: {
			'clear-to-proceed': 0,
			'routine-review': 1,
			'paediatric-pathway': 2,
			'gp-review-required': 3,
			'refer-urgently': 4
		}
	};

	function sortValue(row: QuestionnaireRow, key: keyof QuestionnaireRow): number | string {
		const rank = RANKS[key];
		if (rank) return rank[String(row[key])] ?? -1;
		const v = row[key];
		if (v === null || v === undefined) return -Infinity;
		return typeof v === 'number' ? v : String(v).toLowerCase();
	}

	const visible = $derived.by(() => {
		const needle = search.trim().toLowerCase();
		const filtered = rows.filter((row) => {
			if (riskFilter && row.riskBand !== riskFilter) return false;
			if (parqFilter && row.parqPlusClearance !== parqFilter) return false;
			if (auditCFilter && row.auditCBand !== auditCFilter) return false;
			if (needle) {
				const haystack = [row.patient, row.identifier, row.assessor, row.id].join(' ').toLowerCase();
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

	const hasFilters = $derived(Boolean(search || riskFilter || parqFilter || auditCFilter));

	function toggleSort(key: keyof QuestionnaireRow) {
		if (sortKey === key) sortAsc = !sortAsc;
		else {
			sortKey = key;
			sortAsc = true;
		}
	}

	function clearFilters() {
		search = '';
		riskFilter = '';
		parqFilter = '';
		auditCFilter = '';
	}

	const COLUMNS: Array<{ key: keyof QuestionnaireRow | null; label: string }> = [
		{ key: 'assessmentDate', label: 'Date' },
		{ key: 'patient', label: 'Patient' },
		{ key: 'identifier', label: 'Identifier' },
		{ key: 'screeningPurpose', label: 'Purpose' },
		{ key: 'parqPlusClearance', label: 'PAR-Q+' },
		{ key: 'auditCScore', label: 'AUDIT-C' },
		{ key: 'auditCBand', label: 'AUDIT-C band' },
		{ key: 'riskBand', label: 'Risk band' },
		{ key: 'recommendation', label: 'Recommendation' },
		{ key: null, label: 'Flags' },
		{ key: 'assessor', label: 'Assessor' }
	];
</script>

<svelte:head>
	<title>Health Screening Questionnaire — dashboard</title>
</svelte:head>

<main class="mx-16 px-4 py-8">
	<h1 class="text-2xl font-bold text-base-content">Health Screening Questionnaire dashboard</h1>
	<p class="mt-2 max-w-3xl text-sm text-base-content/70">
		Every recorded screen with its PAR-Q+ clearance, AUDIT-C band, composite risk band, and
		referral recommendation. The composite risk band uses the max-grade algorithm, so the worst
		finding sets the band.
	</p>

	<Alert type="info" class="mt-4">
		No back-end is configured, so this dashboard is showing the sample rows shipped with the app.
	</Alert>

	<section class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Filters">
		<Field label="Search" inputId="filter-search">
			<TextInput
				id="filter-search"
				label="Search"
				placeholder="Patient, identifier, or assessor"
				bind:value={search}
			/>
		</Field>
		<Field label="Risk band" inputId="filter-risk">
			<Select id="filter-risk" label="Risk band" bind:value={riskFilter}>
				<option value="">All</option>
				<option value="low">Low</option>
				<option value="moderate">Moderate</option>
				<option value="high">High</option>
				<option value="refer-urgently">Refer urgently</option>
			</Select>
		</Field>
		<Field label="PAR-Q+ clearance" inputId="filter-parq">
			<Select id="filter-parq" label="PAR-Q+ clearance" bind:value={parqFilter}>
				<option value="">All</option>
				<option value="cleared">Cleared</option>
				<option value="further-assessment-required">Further assessment required</option>
			</Select>
		</Field>
		<Field label="AUDIT-C band" inputId="filter-auditc">
			<Select id="filter-auditc" label="AUDIT-C band" bind:value={auditCFilter}>
				<option value="">All</option>
				<option value="low">Low</option>
				<option value="increasing-risk">Increasing risk</option>
				<option value="higher-risk">Higher risk</option>
			</Select>
		</Field>
	</section>

	<div class="mt-4 flex gap-2">
		<Button data-variant="secondary" onclick={clearFilters}>Clear filters</Button>
		<a class="button" data-variant="primary" href="/health-screening-questionnaire/health-screening-questionnaires/new">
			New screening
		</a>
	</div>

	<div class="mt-6 overflow-x-auto">
		<table class="data-table w-full">
			<caption class="sr-only">Health screening questionnaires</caption>
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
						<td class="data-table-td">{row.identifier}</td>
						<td class="data-table-td">{titleCase(row.screeningPurpose)}</td>
						<td class="data-table-td">
							{row.parqPlusClearance ? PARQ_CLEARANCE_LABELS[row.parqPlusClearance] : '—'}
						</td>
						<td class="data-table-td">{row.auditCScore === null ? '—' : `${row.auditCScore} / 12`}</td>
						<td class="data-table-td">{row.auditCBand ? titleCase(row.auditCBand) : '—'}</td>
						<td class="data-table-td">{row.riskBand ? titleCase(row.riskBand) : 'Paediatric'}</td>
						<td class="data-table-td">
							{row.recommendation ? RECOMMENDATION_LABELS[row.recommendation] : '—'}
						</td>
						<td class="data-table-td">
							{row.flags.length === 0 ? '—' : row.flags.map((f) => titleCase(f)).join(', ')}
						</td>
						<td class="data-table-td">{row.assessor}</td>
					</tr>
				{/each}
			</tbody>
			<tfoot class="data-table-foot">
				<tr class="data-table-row">
					<td class="data-table-td" colspan={COLUMNS.length}>
						{hasFilters
							? `Showing ${visible.length} of ${rows.length} questionnaires.`
							: `${rows.length} questionnaires.`}
					</td>
				</tr>
			</tfoot>
		</table>
	</div>

	{#if visible.length === 0}
		<p class="empty-message mt-4">No questionnaires match the current filters.</p>
	{/if}
</main>
