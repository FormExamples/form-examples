<script lang="ts">
	import { Grid, Willow } from '@svar-ui/svelte-grid';
	import { fetchPatients } from '$lib/api';
	import { patients as samplePatients } from '$lib/data';
	import type { PatientRow } from '$lib/types';

	let patients = $state<PatientRow[]>(samplePatients);
	let loading = $state(true);
	let error = $state('');
	let searchTerm = $state('');
	let depressionFilter = $state('');
	let anxietyFilter = $state('');
	let stressFilter = $state('');
	let suicidalFilter = $state('');
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

	const severityOptions = [
		{ value: '', label: 'All severities' },
		{ value: 'Normal', label: 'Normal' },
		{ value: 'Mild', label: 'Mild' },
		{ value: 'Moderate', label: 'Moderate' },
		{ value: 'Severe', label: 'Severe' },
		{ value: 'Extremely Severe', label: 'Extremely Severe' },
	];

	const yesNoOptions = [
		{ value: '', label: 'All' },
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' },
	];

	const columns = [
		{
			id: 'nhsNumber',
			header: 'NHS Number',
			width: 140,
			sort: true,
		},
		{
			id: 'patientName',
			header: 'Patient Name',
			flexgrow: 1,
			sort: true,
		},
		{
			id: 'depressionSeverity',
			header: 'Depression',
			width: 160,
			sort: true,
		},
		{
			id: 'anxietySeverity',
			header: 'Anxiety',
			width: 160,
			sort: true,
		},
		{
			id: 'stressSeverity',
			header: 'Stress',
			width: 160,
			sort: true,
		},
		{
			id: 'suicidalIdeationFlag',
			header: 'Suicidal Ideation',
			width: 150,
			sort: true,
			template: (value: boolean) => (value ? 'Yes' : 'No'),
		},
		{
			id: 'completedAt',
			header: 'Completed',
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
			// Text search across key fields
			if (term) {
				const matches =
					row.nhsNumber.toLowerCase().includes(term) ||
					row.patientName.toLowerCase().includes(term);
				if (!matches) return false;
			}

			// Subscale severity filters
			if (depressionFilter && row.depressionSeverity !== depressionFilter) {
				return false;
			}
			if (anxietyFilter && row.anxietySeverity !== anxietyFilter) {
				return false;
			}
			if (stressFilter && row.stressSeverity !== stressFilter) {
				return false;
			}

			// Suicidal-ideation flag filter
			if (suicidalFilter === 'yes' && !row.suicidalIdeationFlag) return false;
			if (suicidalFilter === 'no' && row.suicidalIdeationFlag) return false;

			return true;
		};

		gridApi.exec('filter-rows', { filter });
	}

	function clearFilters() {
		searchTerm = '';
		depressionFilter = '';
		anxietyFilter = '';
		stressFilter = '';
		suicidalFilter = '';
		if (gridApi) {
			gridApi.exec('filter-rows', { filter: () => true });
		}
	}

	let hasActiveFilters = $derived(
		searchTerm !== '' ||
			depressionFilter !== '' ||
			anxietyFilter !== '' ||
			stressFilter !== '' ||
			suicidalFilter !== ''
	);
</script>

<div class="min-h-screen bg-gray-50">
	<!-- Header -->
	<header class="bg-nhs-blue text-white shadow">
		<div class="mx-auto max-w-7xl px-4 py-4 sm:px-6">
			<h1 class="text-2xl font-bold">Psychology Assessment — Clinician Dashboard</h1>
			<p class="mt-1 text-sm text-blue-100">
				DASS-21 patient list with depression, anxiety, and stress severity plus suicidal-ideation safety flag
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
						placeholder="NHS number or patient name..."
						bind:value={searchTerm}
						oninput={applyFilters}
						class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
					/>
				</div>

				<!-- Depression severity -->
				<div>
					<label for="depression-filter" class="mb-1 block text-sm font-medium text-gray-700">
						Depression
					</label>
					<select
						id="depression-filter"
						bind:value={depressionFilter}
						onchange={applyFilters}
						class="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
					>
						{#each severityOptions as opt (opt.value)}
							<option value={opt.value}>{opt.label}</option>
						{/each}
					</select>
				</div>

				<!-- Anxiety severity -->
				<div>
					<label for="anxiety-filter" class="mb-1 block text-sm font-medium text-gray-700">
						Anxiety
					</label>
					<select
						id="anxiety-filter"
						bind:value={anxietyFilter}
						onchange={applyFilters}
						class="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
					>
						{#each severityOptions as opt (opt.value)}
							<option value={opt.value}>{opt.label}</option>
						{/each}
					</select>
				</div>

				<!-- Stress severity -->
				<div>
					<label for="stress-filter" class="mb-1 block text-sm font-medium text-gray-700">
						Stress
					</label>
					<select
						id="stress-filter"
						bind:value={stressFilter}
						onchange={applyFilters}
						class="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
					>
						{#each severityOptions as opt (opt.value)}
							<option value={opt.value}>{opt.label}</option>
						{/each}
					</select>
				</div>

				<!-- Suicidal-ideation flag -->
				<div>
					<label for="suicidal-filter" class="mb-1 block text-sm font-medium text-gray-700">
						Suicidal Ideation
					</label>
					<select
						id="suicidal-filter"
						bind:value={suicidalFilter}
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
			<span>{patients.length} patients total</span>
			{#if error}
				<span class="text-warning">{error}</span>
			{/if}
		</div>
	</main>
</div>
