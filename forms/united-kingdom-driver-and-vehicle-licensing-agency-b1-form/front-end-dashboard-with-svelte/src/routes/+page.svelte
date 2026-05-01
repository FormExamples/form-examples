<script lang="ts">
	import { Grid, Willow } from '@svar-ui/svelte-grid';
	import { fetchPatients } from '$lib/api';
	import { patients as samplePatients } from '$lib/data';
	import type { PatientRow } from '$lib/types';

	let patients = $state<PatientRow[]>(samplePatients);
	let loading = $state(true);
	let error = $state('');
	let searchTerm = $state('');
	let epilepsyFilter = $state('');
	let completenessFilter = $state('');
	let highPriorityFilter = $state('');
	let gridApi = $state<any>(null);

	// Load applicants from backend API, fall back to sample data
	$effect(() => {
		fetchPatients()
			.then((items) => {
				if (items.length > 0) {
					patients = items;
				}
				loading = false;
			})
			.catch(() => {
				// Backend unavailable — use sample data
				loading = false;
			});
	});

	const yesNoOptions = [
		{ value: '', label: 'All' },
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' },
	];

	const completenessOptions = [
		{ value: '', label: 'All applications' },
		{ value: 'complete', label: 'Complete (100%)' },
		{ value: 'partial', label: 'Partial (<100%)' },
	];

	const highPriorityOptions = [
		{ value: '', label: 'All' },
		{ value: 'present', label: 'Has flags' },
		{ value: 'none', label: 'No flags' },
	];

	const columns = [
		{
			id: 'applicantName',
			header: 'Applicant Name',
			flexgrow: 1,
			sort: true,
		},
		{
			id: 'dateOfBirth',
			header: 'Date of Birth',
			width: 130,
			sort: true,
		},
		{
			id: 'drivingLicenceNumber',
			header: 'Licence Number',
			width: 180,
			sort: true,
		},
		{
			id: 'conditionsDeclared',
			header: 'Conditions',
			width: 110,
			sort: true,
		},
		{
			id: 'epilepsyDeclared',
			header: 'Epilepsy',
			width: 110,
			sort: true,
			template: (value: boolean) => (value ? 'Yes' : 'No'),
		},
		{
			id: 'validationCompleteness',
			header: 'Completeness',
			width: 140,
			sort: true,
			template: (value: number) => `${value}%`,
		},
		{
			id: 'highPriorityFlagCount',
			header: 'High-Priority Flags',
			width: 160,
			sort: true,
		},
		{
			id: 'submittedAt',
			header: 'Submitted',
			width: 180,
			sort: true,
			template: (value: string) =>
				value ? new Date(value).toLocaleDateString('en-GB') : '',
		},
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'applicantName', order: 'asc' });
	}

	function applyFilters() {
		if (!gridApi) return;

		const term = searchTerm.toLowerCase();

		const filter = (row: PatientRow) => {
			// Text search by applicant name
			if (term) {
				if (!row.applicantName.toLowerCase().includes(term)) return false;
			}

			// Epilepsy declared filter
			if (epilepsyFilter === 'yes' && !row.epilepsyDeclared) return false;
			if (epilepsyFilter === 'no' && row.epilepsyDeclared) return false;

			// Validation completeness filter
			if (completenessFilter === 'complete' && row.validationCompleteness < 100) return false;
			if (completenessFilter === 'partial' && row.validationCompleteness >= 100) return false;

			// High-priority flag presence filter
			if (highPriorityFilter === 'present' && row.highPriorityFlagCount === 0) return false;
			if (highPriorityFilter === 'none' && row.highPriorityFlagCount > 0) return false;

			return true;
		};

		gridApi.exec('filter-rows', { filter });
	}

	function clearFilters() {
		searchTerm = '';
		epilepsyFilter = '';
		completenessFilter = '';
		highPriorityFilter = '';
		if (gridApi) {
			gridApi.exec('filter-rows', { filter: () => true });
		}
	}

	let hasActiveFilters = $derived(
		searchTerm !== '' ||
			epilepsyFilter !== '' ||
			completenessFilter !== '' ||
			highPriorityFilter !== ''
	);
</script>

<div class="min-h-screen bg-gray-50">
	<!-- Header -->
	<header class="bg-nhs-blue text-white shadow">
		<div class="mx-auto max-w-7xl px-4 py-4 sm:px-6">
			<h1 class="text-2xl font-bold">DVLA B1 Form — Clinician Dashboard</h1>
			<p class="mt-1 text-sm text-blue-100">
				Confidential medical information (neurological): submitted applications, completeness,
				epilepsy declarations, and outstanding high-priority flags
			</p>
		</div>
	</header>

	<main class="mx-auto max-w-7xl px-4 py-6 sm:px-6">
		<!-- Filters bar -->
		<div class="mb-4 rounded-lg bg-white p-4 shadow-sm">
			<div class="flex flex-wrap items-end gap-4">
				<!-- Search -->
				<div class="min-w-[240px] flex-1">
					<label for="search" class="mb-1 block text-sm font-medium text-gray-700">
						Search
					</label>
					<input
						id="search"
						type="text"
						placeholder="Applicant name..."
						bind:value={searchTerm}
						oninput={applyFilters}
						class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
					/>
				</div>

				<!-- Epilepsy declared -->
				<div>
					<label for="epilepsy-filter" class="mb-1 block text-sm font-medium text-gray-700">
						Epilepsy Declared
					</label>
					<select
						id="epilepsy-filter"
						bind:value={epilepsyFilter}
						onchange={applyFilters}
						class="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
					>
						{#each yesNoOptions as opt (opt.value)}
							<option value={opt.value}>{opt.label}</option>
						{/each}
					</select>
				</div>

				<!-- Validation completeness -->
				<div>
					<label for="completeness-filter" class="mb-1 block text-sm font-medium text-gray-700">
						Validation Completeness
					</label>
					<select
						id="completeness-filter"
						bind:value={completenessFilter}
						onchange={applyFilters}
						class="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
					>
						{#each completenessOptions as opt (opt.value)}
							<option value={opt.value}>{opt.label}</option>
						{/each}
					</select>
				</div>

				<!-- High-priority flags -->
				<div>
					<label for="high-priority-filter" class="mb-1 block text-sm font-medium text-gray-700">
						High-Priority Flags
					</label>
					<select
						id="high-priority-filter"
						bind:value={highPriorityFilter}
						onchange={applyFilters}
						class="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
					>
						{#each highPriorityOptions as opt (opt.value)}
							<option value={opt.value}>{opt.label}</option>
						{/each}
					</select>
				</div>

				<!-- Clear filters -->
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

		<!-- Data grid -->
		<div class="rounded-lg bg-white shadow-sm" style="height: 600px;">
			{#if loading}
				<div class="flex h-full items-center justify-center text-muted">
					Loading applicants...
				</div>
			{:else}
				<Willow>
					<Grid data={patients} {columns} {init} />
				</Willow>
			{/if}
		</div>

		<!-- Summary -->
		<div class="mt-4 flex items-center gap-4 text-sm text-muted">
			<span>{patients.length} applicants total</span>
			{#if error}
				<span class="text-warning">{error}</span>
			{/if}
		</div>
	</main>
</div>
