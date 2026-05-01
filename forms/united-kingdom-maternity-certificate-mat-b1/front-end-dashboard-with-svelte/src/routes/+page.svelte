<script lang="ts">
	import { Grid, Willow } from '@svar-ui/svelte-grid';
	import { fetchPatients } from '$lib/api';
	import { patients as samplePatients } from '$lib/data';
	import type { PatientRow } from '$lib/types';

	let patients = $state<PatientRow[]>(samplePatients);
	let loading = $state(true);
	let error = $state('');
	let searchTerm = $state('');
	let certificateTypeFilter = $state('');
	let issuerTypeFilter = $state('');
	let duplicateFilter = $state('');
	let gridApi = $state<any>(null);

	// Load patients from backend API, fall back to sample data
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

	const certificateTypeOptions = [
		{ value: '', label: 'All certificate types' },
		{ value: 'pre', label: 'Pre-confinement (Part A)' },
		{ value: 'post', label: 'Post-confinement (Part B)' },
	];

	const issuerTypeOptions = [
		{ value: '', label: 'All issuers' },
		{ value: 'doctor', label: 'Doctor' },
		{ value: 'midwife', label: 'Midwife' },
	];

	const yesNoOptions = [
		{ value: '', label: 'All' },
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' },
	];

	const columns = [
		{
			id: 'certificateNumber',
			header: 'Certificate No.',
			width: 180,
			sort: true,
		},
		{
			id: 'patientName',
			header: 'Patient Name',
			flexgrow: 1,
			sort: true,
		},
		{
			id: 'dateOfBirth',
			header: 'Patient DOB',
			width: 120,
			sort: true,
		},
		{
			id: 'certificateType',
			header: 'Type',
			width: 90,
			sort: true,
			template: (value: string) => (value === 'pre' ? 'Part A' : value === 'post' ? 'Part B' : ''),
		},
		{
			id: 'expectedDateOfConfinement',
			header: 'EWC',
			width: 120,
			sort: true,
		},
		{
			id: 'actualDateOfBirth',
			header: 'Actual DOB',
			width: 120,
			sort: true,
			template: (value: string | null) => value ?? '',
		},
		{
			id: 'issuerType',
			header: 'Issuer',
			width: 100,
			sort: true,
			template: (value: string) => (value ? value.charAt(0).toUpperCase() + value.slice(1) : ''),
		},
		{
			id: 'issuerName',
			header: 'Issuer Name',
			width: 200,
			sort: true,
		},
		{
			id: 'issuerNmcPin',
			header: 'NMC PIN',
			width: 110,
			sort: true,
		},
		{
			id: 'isDuplicate',
			header: 'Duplicate',
			width: 100,
			sort: true,
			template: (value: boolean) => (value ? 'DUPLICATE' : ''),
		},
		{
			id: 'highPriorityFlagCount',
			header: 'Flags',
			width: 80,
			sort: true,
		},
		{
			id: 'issuedAt',
			header: 'Issued',
			width: 170,
			sort: true,
			template: (value: string) => {
				if (!value) return '';
				const d = new Date(value);
				return Number.isNaN(d.getTime()) ? value : d.toLocaleString();
			},
		},
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'patientName', order: 'asc' });
	}

	function applyFilters() {
		if (!gridApi) return;

		const term = searchTerm.toLowerCase();

		const filter = (row: PatientRow) => {
			// Text search across patient name and certificate number
			if (term) {
				const matches =
					row.patientName.toLowerCase().includes(term) ||
					row.certificateNumber.toLowerCase().includes(term);
				if (!matches) return false;
			}

			// Certificate type filter
			if (certificateTypeFilter && row.certificateType !== certificateTypeFilter) {
				return false;
			}

			// Issuer type filter
			if (issuerTypeFilter && row.issuerType !== issuerTypeFilter) {
				return false;
			}

			// Duplicate filter
			if (duplicateFilter === 'yes' && !row.isDuplicate) return false;
			if (duplicateFilter === 'no' && row.isDuplicate) return false;

			return true;
		};

		gridApi.exec('filter-rows', { filter });
	}

	function clearFilters() {
		searchTerm = '';
		certificateTypeFilter = '';
		issuerTypeFilter = '';
		duplicateFilter = '';
		if (gridApi) {
			gridApi.exec('filter-rows', { filter: () => true });
		}
	}

	let hasActiveFilters = $derived(
		searchTerm !== '' ||
			certificateTypeFilter !== '' ||
			issuerTypeFilter !== '' ||
			duplicateFilter !== ''
	);
</script>

<div class="min-h-screen bg-gray-50">
	<!-- Header -->
	<header class="bg-nhs-blue text-white shadow">
		<div class="mx-auto max-w-7xl px-4 py-4 sm:px-6">
			<h1 class="text-2xl font-bold">
				UK Maternity Certificate MAT B1 — Clinician Dashboard
			</h1>
			<p class="mt-1 text-sm text-blue-100">
				DWP MAT B1 issuance log for SMP, Maternity Allowance, and Sure Start Maternity Grant claims
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
						placeholder="Patient name or certificate number..."
						bind:value={searchTerm}
						oninput={applyFilters}
						class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
					/>
				</div>

				<!-- Certificate type -->
				<div>
					<label for="certificate-type-filter" class="mb-1 block text-sm font-medium text-gray-700">
						Certificate Type
					</label>
					<select
						id="certificate-type-filter"
						bind:value={certificateTypeFilter}
						onchange={applyFilters}
						class="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
					>
						{#each certificateTypeOptions as opt (opt.value)}
							<option value={opt.value}>{opt.label}</option>
						{/each}
					</select>
				</div>

				<!-- Issuer type -->
				<div>
					<label for="issuer-type-filter" class="mb-1 block text-sm font-medium text-gray-700">
						Issuer Type
					</label>
					<select
						id="issuer-type-filter"
						bind:value={issuerTypeFilter}
						onchange={applyFilters}
						class="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
					>
						{#each issuerTypeOptions as opt (opt.value)}
							<option value={opt.value}>{opt.label}</option>
						{/each}
					</select>
				</div>

				<!-- Duplicate -->
				<div>
					<label for="duplicate-filter" class="mb-1 block text-sm font-medium text-gray-700">
						Duplicate
					</label>
					<select
						id="duplicate-filter"
						bind:value={duplicateFilter}
						onchange={applyFilters}
						class="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
					>
						{#each yesNoOptions as opt (opt.value)}
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
					Loading patients...
				</div>
			{:else}
				<Willow>
					<Grid data={patients} {columns} {init} />
				</Willow>
			{/if}
		</div>

		<!-- Summary -->
		<div class="mt-4 flex items-center gap-4 text-sm text-muted">
			<span>{patients.length} certificates total</span>
			{#if error}
				<span class="text-warning">{error}</span>
			{/if}
		</div>
	</main>
</div>
