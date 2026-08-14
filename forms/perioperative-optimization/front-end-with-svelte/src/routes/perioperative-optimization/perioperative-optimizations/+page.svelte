<script lang="ts">
	// Waiting-list dashboard. The columns that matter are weeks-to-surgery and
	// the domains short on time: together they answer the question a coordinator
	// actually has — which of next month's lists are about to go ahead without
	// the optimisation they were promised?
	import Alert from '$lib/components/ui/Alert.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import { sampleAssessments } from '$lib/data/sample-reports';
	import { DOMAIN_LABELS } from '$lib/engine/domain-rules';
	import { GATE_DECISION_LABELS, READINESS_LABELS } from '$lib/engine/labels';
	import type { AssessmentRow, DomainKey } from '$lib/engine/types';
	import { titleCase } from '$lib/engine/utils';

	const rows: AssessmentRow[] = sampleAssessments;

	let search = $state('');
	let readinessFilter = $state('');
	let domainFilter = $state('');
	let weeksFilter = $state('');
	let decisionFilter = $state('');
	let sortKey = $state<keyof AssessmentRow>('surgeryDate');
	let sortAsc = $state(true);

	const RANKS: Partial<Record<keyof AssessmentRow, Record<string, number>>> = {
		readiness: {
			'ready': 0,
			'optimisation-in-progress': 1,
			'optimisation-required': 2,
			'defer-surgery': 3
		},
		severity: { minor: 0, intermediate: 1, major: 2, 'major-plus': 3 },
		gateDecision: {
			'': 0,
			'proceed': 1,
			'proceed-with-prehabilitation': 2,
			'defer-and-optimise': 3,
			'mdt-review': 4,
			'accept-unoptimised-risk': 5,
			'cancel': 6
		}
	};

	function sortValue(row: AssessmentRow, key: keyof AssessmentRow): number | string {
		const rank = RANKS[key];
		if (rank) return rank[String(row[key])] ?? -1;
		if (key === 'weeksToSurgery') {
			// Unlisted patients sort last rather than pretending to be imminent.
			return row.weeksToSurgery === null ? Number.MAX_SAFE_INTEGER : row.weeksToSurgery;
		}
		const v = row[key];
		if (v === null || v === undefined || v === '') return '￿';
		return typeof v === 'number' ? v : String(v).toLowerCase();
	}

	const visible = $derived.by(() => {
		const needle = search.trim().toLowerCase();
		const filtered = rows.filter((row) => {
			if (readinessFilter && row.readiness !== readinessFilter) return false;
			if (decisionFilter && row.gateDecision !== decisionFilter) return false;
			if (domainFilter && !row.domainsShortOnTime.includes(domainFilter)) return false;
			if (weeksFilter) {
				if (row.weeksToSurgery === null) return false;
				const limit = { lt4: 4, lt8: 8, lt12: 12 }[weeksFilter as 'lt4' | 'lt8' | 'lt12'];
				if (row.weeksToSurgery >= limit) return false;
			}
			if (needle) {
				const hay = [row.patient, row.nhs, row.procedure, row.surgeon, row.id]
					.join(' ')
					.toLowerCase();
				if (!hay.includes(needle)) return false;
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
		Boolean(search || readinessFilter || domainFilter || weeksFilter || decisionFilter)
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
		readinessFilter = '';
		domainFilter = '';
		weeksFilter = '';
		decisionFilter = '';
	}

	const COLUMNS: Array<{ key: keyof AssessmentRow | null; label: string }> = [
		{ key: 'surgeryDate', label: 'Surgery date' },
		{ key: 'weeksToSurgery', label: 'Weeks' },
		{ key: 'patient', label: 'Patient' },
		{ key: 'nhs', label: 'NHS number' },
		{ key: 'procedure', label: 'Procedure' },
		{ key: 'severity', label: 'Severity' },
		{ key: 'readiness', label: 'Readiness' },
		{ key: null, label: 'Domains short on time' },
		{ key: 'actionRequired', label: 'Action' },
		{ key: 'gateDecision', label: 'Gate decision' },
		{ key: 'surgeon', label: 'Surgeon' },
		{ key: 'flagCount', label: 'Flags' }
	];

	const DOMAIN_KEYS: DomainKey[] = [
		'anaemia',
		'glycaemic-control',
		'smoking',
		'alcohol',
		'nutrition',
		'physical-fitness',
		'medication',
		'cardiorespiratory'
	];
</script>

<svelte:head>
	<title>Perioperative Optimization — dashboard</title>
</svelte:head>

<main class="mx-16 px-4 py-8">
	<h1 class="text-2xl font-bold text-base-content">Perioperative Optimization dashboard</h1>
	<p class="mt-2 max-w-3xl text-sm text-base-content/70">
		Surgical readiness and weeks to surgery across the waiting list, sorted by surgery date so the
		most imminent lists come first. A domain short on time cannot be optimised before the listed
		date.
	</p>

	<Alert type="info" class="mt-4">
		No back-end is configured, so this dashboard is showing the sample rows shipped with the app.
	</Alert>

	<section class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5" aria-label="Filters">
		<Field label="Search" inputId="filter-search">
			<TextInput
				id="filter-search"
				label="Search"
				placeholder="Patient, NHS number, procedure, or surgeon"
				bind:value={search}
			/>
		</Field>
		<Field label="Surgical readiness" inputId="filter-readiness">
			<Select id="filter-readiness" label="Surgical readiness" bind:value={readinessFilter}>
				<option value="">All</option>
				<option value="ready">Ready</option>
				<option value="optimisation-in-progress">Optimisation in progress</option>
				<option value="optimisation-required">Optimisation required</option>
				<option value="defer-surgery">Defer surgery</option>
			</Select>
		</Field>
		<Field label="Domain short on time" inputId="filter-domain">
			<Select id="filter-domain" label="Domain short on time" bind:value={domainFilter}>
				<option value="">All</option>
				{#each DOMAIN_KEYS as key (key)}
					<option value={key}>{DOMAIN_LABELS[key]}</option>
				{/each}
			</Select>
		</Field>
		<Field label="Weeks to surgery" inputId="filter-weeks">
			<Select id="filter-weeks" label="Weeks to surgery" bind:value={weeksFilter}>
				<option value="">All</option>
				<option value="lt4">Under 4</option>
				<option value="lt8">Under 8</option>
				<option value="lt12">Under 12</option>
			</Select>
		</Field>
		<Field label="Gate decision" inputId="filter-decision">
			<Select id="filter-decision" label="Gate decision" bind:value={decisionFilter}>
				<option value="">All</option>
				<option value="proceed">Proceed</option>
				<option value="proceed-with-prehabilitation">Proceed with prehabilitation</option>
				<option value="defer-and-optimise">Defer and optimise</option>
				<option value="accept-unoptimised-risk">Accept unoptimised risk</option>
				<option value="mdt-review">MDT review</option>
				<option value="cancel">Cancel</option>
			</Select>
		</Field>
	</section>

	<div class="mt-4 flex gap-2">
		<Button data-variant="secondary" onclick={clearFilters}>Clear filters</Button>
		<a
			class="button"
			data-variant="primary"
			href="/perioperative-optimization/perioperative-optimizations/new"
		>
			New assessment
		</a>
	</div>

	<div class="mt-6 overflow-x-auto">
		<table class="data-table w-full">
			<caption class="sr-only">Perioperative optimisation assessments</caption>
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
						<td class="data-table-td">{row.surgeryDate || '—'}</td>
						<td class="data-table-td">
							{#if row.weeksToSurgery === null}
								<abbr title="No surgery date recorded; gating not applied">—</abbr>
							{:else}
								{row.weeksToSurgery}
							{/if}
						</td>
						<td class="data-table-td">{row.patient}</td>
						<td class="data-table-td">{row.nhs}</td>
						<td class="data-table-td">{row.procedure}</td>
						<td class="data-table-td">{titleCase(row.severity)}</td>
						<td class="data-table-td">{READINESS_LABELS[row.readiness]}</td>
						<td class="data-table-td">
							{row.domainsShortOnTime.length === 0
								? '—'
								: row.domainsShortOnTime
										.map((k) => DOMAIN_LABELS[k as DomainKey] ?? titleCase(k))
										.join(', ')}
						</td>
						<td class="data-table-td">{row.actionRequired}</td>
						<td class="data-table-td">
							{row.gateDecision ? GATE_DECISION_LABELS[row.gateDecision] : 'not recorded'}
						</td>
						<td class="data-table-td">{row.surgeon}</td>
						<td class="data-table-td">{row.flagCount}</td>
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
