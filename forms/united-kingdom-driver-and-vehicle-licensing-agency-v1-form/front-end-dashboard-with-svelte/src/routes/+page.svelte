<script lang="ts">
	import { Grid, Willow } from '@svar-ui/svelte-grid';
	import { fetchPatients } from '$lib/api';
	import { patients as samplePatients } from '$lib/data';
	import type { PatientRow } from '$lib/types';

	let patients = $state<PatientRow[]>(samplePatients);
	let loading = $state(true);
	let error = $state('');
	let searchTerm = $state('');
	let monocularFilter = $state('');
	let glaucomaFilter = $state('');
	let diplopiaFilter = $state('');
	let completenessFilter = $state('');
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

	const yesNoOptions = [
		{ value: '', label: 'All' },
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' },
	];

	const completenessOptions = [
		{ value: '', label: 'All' },
		{ value: 'complete', label: 'Complete (100%)' },
		{ value: 'partial', label: 'Partial (<100%)' },
	];

	const columns = [
		{
			id: 'drivingLicenceNumber',
			header: 'Licence Number',
			width: 170,
			sort: true,
		},
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
			id: 'monocularVision',
			header: 'Monocular',
			width: 110,
			sort: true,
			template: (value: boolean) => (value ? 'Yes' : 'No'),
		},
		{
			id: 'glaucomaDeclared',
			header: 'Glaucoma',
			width: 110,
			sort: true,
			template: (value: boolean) => (value ? 'Yes' : 'No'),
		},
		{
			id: 'diplopiaDeclared',
			header: 'Diplopia',
			width: 110,
			sort: true,
			template: (value: boolean) => (value ? 'Yes' : 'No'),
		},
		{
			id: 'highPriorityFlagCount',
			header: 'Flags',
			width: 80,
			sort: true,
		},
		{
			id: 'validationCompleteness',
			header: 'Complete',
			width: 110,
			sort: true,
			template: (value: number) => `${value}%`,
		},
		{
			id: 'submittedAt',
			header: 'Submitted',
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

			// Monocular vision filter
			if (monocularFilter === 'yes' && !row.monocularVision) return false;
			if (monocularFilter === 'no' && row.monocularVision) return false;

			// Glaucoma declared filter
			if (glaucomaFilter === 'yes' && !row.glaucomaDeclared) return false;
			if (glaucomaFilter === 'no' && row.glaucomaDeclared) return false;

			// Diplopia declared filter
			if (diplopiaFilter === 'yes' && !row.diplopiaDeclared) return false;
			if (diplopiaFilter === 'no' && row.diplopiaDeclared) return false;

			// Validation completeness filter
			if (completenessFilter === 'complete' && row.validationCompleteness < 100) return false;
			if (completenessFilter === 'partial' && row.validationCompleteness >= 100) return false;

			return true;
		};

		gridApi.exec('filter-rows', { filter });
	}

	function clearFilters() {
		searchTerm = '';
		monocularFilter = '';
		glaucomaFilter = '';
		diplopiaFilter = '';
		completenessFilter = '';
		if (gridApi) {
			gridApi.exec('filter-rows', { filter: () => true });
		}
	}

	let hasActiveFilters = $derived(
		searchTerm !== '' ||
			monocularFilter !== '' ||
			glaucomaFilter !== '' ||
			diplopiaFilter !== '' ||
			completenessFilter !== ''
	);
</script>

<div class="min-h-screen bg-gray-50">
	<!-- Header -->
	<header class="bg-nhs-blue text-white shadow">
		<div class="mx-auto max-w-7xl px-4 py-4 sm:px-6">
			<h1 class="text-2xl font-bold">UK DVLA V1 Form — Clinician Dashboard</h1>
			<p class="mt-1 text-sm text-blue-100">
				Vision self-declaration applicant list with monocular vision, glaucoma, and diplopia flags
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

				<!-- Monocular vision -->
				<div>
					<label for="monocular-filter" class="mb-1 block text-sm font-medium text-gray-700">
						Monocular Vision
					</label>
					<select
						id="monocular-filter"
						bind:value={monocularFilter}
						onchange={applyFilters}
						class="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
					>
						{#each yesNoOptions as opt (opt.value)}
							<option value={opt.value}>{opt.label}</option>
						{/each}
					</select>
				</div>

				<!-- Glaucoma -->
				<div>
					<label for="glaucoma-filter" class="mb-1 block text-sm font-medium text-gray-700">
						Glaucoma Declared
					</label>
					<select
						id="glaucoma-filter"
						bind:value={glaucomaFilter}
						onchange={applyFilters}
						class="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
					>
						{#each yesNoOptions as opt (opt.value)}
							<option value={opt.value}>{opt.label}</option>
						{/each}
					</select>
				</div>

				<!-- Diplopia -->
				<div>
					<label for="diplopia-filter" class="mb-1 block text-sm font-medium text-gray-700">
						Diplopia Declared
					</label>
					<select
						id="diplopia-filter"
						bind:value={diplopiaFilter}
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
						Completeness
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
