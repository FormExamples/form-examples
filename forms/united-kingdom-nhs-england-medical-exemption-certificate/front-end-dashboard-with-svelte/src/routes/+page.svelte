<script lang="ts">
	import { Grid, Willow } from '@svar-ui/svelte-grid';
	import { fetchApplications } from '$lib/api';
	import { applications as sampleApplications } from '$lib/data';
	import { CONDITION_LABELS, OUTCOME_LABELS, STATUS_LABELS, type ApplicationRow } from '$lib/types';

	let applications = $state<ApplicationRow[]>(sampleApplications);
	let loading = $state(true);
	let error = $state('');
	let searchTerm = $state('');
	let outcomeFilter = $state('');
	let statusFilter = $state('');
	let conditionFilter = $state('');
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let gridApi = $state<any>(null);

	$effect(() => {
		fetchApplications()
			.then((items) => {
				if (items.length > 0) applications = items;
				loading = false;
			})
			.catch(() => {
				error = 'Backend unreachable — showing bundled sample applications.';
				loading = false;
			});
	});

	const outcomeOptions = [
		{ value: '', label: 'All outcomes' },
		{ value: 'eligible', label: 'Eligible' },
		{ value: 'ineligible', label: 'Ineligible' },
		{ value: 'requires-clarification', label: 'Requires clarification' }
	];

	const statusOptions = [
		{ value: '', label: 'All statuses' },
		{ value: 'draft', label: 'Draft' },
		{ value: 'ready-to-post', label: 'Ready to post' },
		{ value: 'posted', label: 'Posted' },
		{ value: 'issued', label: 'Issued' },
		{ value: 'rejected', label: 'Rejected' },
		{ value: 'expired', label: 'Expired' }
	];

	const conditionOptions = [
		{ value: '', label: 'All conditions' },
		...Object.entries(CONDITION_LABELS).map(([value, label]) => ({ value, label }))
	];

	const columns = [
		{ id: 'certificateNumber', header: 'Certificate No.', width: 160, sort: true },
		{ id: 'patientName', header: 'Patient', flexgrow: 1, sort: true },
		{ id: 'nhsNumber', header: 'NHS Number', width: 140, sort: true },
		{ id: 'patientDateOfBirth', header: 'DOB', width: 110, sort: true },
		{
			id: 'conditions',
			header: 'Conditions',
			flexgrow: 1,
			template: (value: string[]) =>
				(value ?? []).map((c) => CONDITION_LABELS[c] ?? c).join(', ')
		},
		{
			id: 'outcome',
			header: 'Outcome',
			width: 160,
			sort: true,
			template: (value: string) => OUTCOME_LABELS[value] ?? value
		},
		{ id: 'validFrom', header: 'Valid From', width: 110, sort: true },
		{ id: 'validUntil', header: 'Valid Until', width: 110, sort: true },
		{
			id: 'status',
			header: 'Status',
			width: 130,
			sort: true,
			template: (value: string) => STATUS_LABELS[value] ?? value
		},
		{ id: 'flagCount', header: 'Flags', width: 80, sort: true }
	];

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'patientName', order: 'asc' });
	}

	function applyFilters() {
		if (!gridApi) return;
		const term = searchTerm.toLowerCase();
		const filter = (row: ApplicationRow) => {
			if (term) {
				const blob = [row.patientName, row.nhsNumber, row.certificateNumber]
					.join(' ')
					.toLowerCase();
				if (!blob.includes(term)) return false;
			}
			if (outcomeFilter && row.outcome !== outcomeFilter) return false;
			if (statusFilter && row.status !== statusFilter) return false;
			if (conditionFilter && !(row.conditions ?? []).includes(conditionFilter)) return false;
			return true;
		};
		gridApi.exec('filter-rows', { filter });
	}

	function clearFilters() {
		searchTerm = '';
		outcomeFilter = '';
		statusFilter = '';
		conditionFilter = '';
		if (gridApi) gridApi.exec('filter-rows', { filter: () => true });
	}

	let hasActiveFilters = $derived(
		searchTerm !== '' || outcomeFilter !== '' || statusFilter !== '' || conditionFilter !== ''
	);
</script>

<div class="min-h-screen bg-gray-50">
	<header class="bg-nhs-blue text-white shadow">
		<div class="mx-auto max-w-7xl px-4 py-4 sm:px-6">
			<h1 class="text-2xl font-bold">FP92A — Medical Exemption Certificate Dashboard</h1>
			<p class="mt-1 text-sm text-blue-100">
				UK NHS Business Services Authority — applications log, eligibility outcomes, and certificate
				validity.
			</p>
		</div>
	</header>

	<main class="mx-auto max-w-7xl px-4 py-6 sm:px-6">
		<div class="mb-4 rounded-lg bg-white p-4 shadow-sm">
			<div class="flex flex-wrap items-end gap-4">
				<div class="min-w-[240px] flex-1">
					<label for="search" class="mb-1 block text-sm font-medium text-gray-700">Search</label>
					<input
						id="search"
						type="text"
						placeholder="Patient name, NHS number, certificate number…"
						bind:value={searchTerm}
						oninput={applyFilters}
						class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
					/>
				</div>

				<div>
					<label for="outcome-filter" class="mb-1 block text-sm font-medium text-gray-700">
						Outcome
					</label>
					<select
						id="outcome-filter"
						bind:value={outcomeFilter}
						onchange={applyFilters}
						class="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
					>
						{#each outcomeOptions as opt (opt.value)}
							<option value={opt.value}>{opt.label}</option>
						{/each}
					</select>
				</div>

				<div>
					<label for="status-filter" class="mb-1 block text-sm font-medium text-gray-700">
						Status
					</label>
					<select
						id="status-filter"
						bind:value={statusFilter}
						onchange={applyFilters}
						class="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
					>
						{#each statusOptions as opt (opt.value)}
							<option value={opt.value}>{opt.label}</option>
						{/each}
					</select>
				</div>

				<div>
					<label for="condition-filter" class="mb-1 block text-sm font-medium text-gray-700">
						Condition
					</label>
					<select
						id="condition-filter"
						bind:value={conditionFilter}
						onchange={applyFilters}
						class="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
					>
						{#each conditionOptions as opt (opt.value)}
							<option value={opt.value}>{opt.label}</option>
						{/each}
					</select>
				</div>

				{#if hasActiveFilters}
					<button
						onclick={clearFilters}
						class="rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
					>
						Clear filters
					</button>
				{/if}
			</div>
		</div>

		<div class="rounded-lg bg-white shadow-sm" style="height: 600px;">
			{#if loading}
				<div class="flex h-full items-center justify-center text-muted">Loading applications…</div>
			{:else}
				<Willow>
					<Grid data={applications} {columns} {init} />
				</Willow>
			{/if}
		</div>

		<div class="mt-4 flex items-center gap-4 text-sm text-muted">
			<span>{applications.length} applications total</span>
			{#if error}
				<span class="text-warning">{error}</span>
			{/if}
		</div>
	</main>
</div>
