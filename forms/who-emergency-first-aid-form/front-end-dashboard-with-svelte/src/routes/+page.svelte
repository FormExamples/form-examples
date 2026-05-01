<script lang="ts">
	import { Grid, Willow } from '@svar-ui/svelte-grid';
	import { fetchPatients } from '$lib/api';
	import { patients as samplePatients } from '$lib/data';
	import type { PatientRow } from '$lib/types';

	let patients = $state<PatientRow[]>(samplePatients);
	let loading = $state(true);
	let error = $state('');
	let searchTerm = $state('');
	let problemTypeFilter = $state('');
	let majorBleedingFilter = $state('all');
	let airwayInterventionFilter = $state('all');
	let gcsFilter = $state('');
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

	const problemTypeOptions = [
		{ value: '', label: 'All problem types' },
		{ value: 'medical', label: 'Medical' },
		{ value: 'trauma', label: 'Trauma' },
	];

	const majorBleedingOptions = [
		{ value: 'all', label: 'All' },
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' },
	];

	const airwayInterventionOptions = [
		{ value: 'all', label: 'All' },
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' },
	];

	const gcsOptions = [
		{ value: '', label: 'All GCS levels' },
		{ value: 'alert', label: 'Alert' },
		{ value: 'confused', label: 'Confused' },
		{ value: 'unconscious', label: 'Unconscious' },
	];

	function formatProblemType(value: string): string {
		if (!value) return '';
		return value.charAt(0).toUpperCase() + value.slice(1);
	}

	function formatGcs(value: string): string {
		if (!value) return '';
		return value.charAt(0).toUpperCase() + value.slice(1);
	}

	function formatBool(value: boolean): string {
		return value ? 'Yes' : 'No';
	}

	const columns = [
		{
			id: 'patientName',
			header: 'Patient Name',
			width: 180,
			sort: true,
		},
		{
			id: 'age',
			header: 'Age',
			width: 70,
			sort: true,
		},
		{
			id: 'sex',
			header: 'Sex',
			width: 70,
			sort: true,
		},
		{
			id: 'problemType',
			header: 'Problem',
			width: 110,
			sort: true,
			template: (value: string) => formatProblemType(value),
		},
		{
			id: 'majorBleeding',
			header: 'Major Bleeding',
			width: 130,
			sort: true,
			template: (value: boolean) => formatBool(value),
		},
		{
			id: 'tourniquetApplied',
			header: 'Tourniquet',
			width: 110,
			sort: true,
			template: (value: boolean) => formatBool(value),
		},
		{
			id: 'airwayIntervention',
			header: 'Airway Intv.',
			width: 120,
			sort: true,
			template: (value: boolean) => formatBool(value),
		},
		{
			id: 'gcsLevel',
			header: 'GCS Level',
			width: 130,
			sort: true,
			template: (value: string) => formatGcs(value),
		},
		{
			id: 'urgentFlagCount',
			header: 'Urgent Flags',
			width: 120,
			sort: true,
		},
		{
			id: 'recordedBy',
			header: 'Recorded By (CFAR)',
			flexgrow: 1,
			sort: true,
		},
		{
			id: 'recordedAt',
			header: 'Recorded At',
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
		api.exec('sort-rows', { key: 'recordedAt', order: 'desc' });
	}

	function applyFilters() {
		if (!gridApi) return;

		const term = searchTerm.toLowerCase();

		const filter = (row: PatientRow) => {
			// Text search across patient name and CFAR responder
			if (term) {
				const matches =
					row.patientName.toLowerCase().includes(term) ||
					row.recordedBy.toLowerCase().includes(term);
				if (!matches) return false;
			}

			// Problem type filter
			if (problemTypeFilter && row.problemType !== problemTypeFilter) {
				return false;
			}

			// Major bleeding filter
			if (majorBleedingFilter === 'yes' && !row.majorBleeding) return false;
			if (majorBleedingFilter === 'no' && row.majorBleeding) return false;

			// Airway intervention filter
			if (airwayInterventionFilter === 'yes' && !row.airwayIntervention) return false;
			if (airwayInterventionFilter === 'no' && row.airwayIntervention) return false;

			// GCS level filter
			if (gcsFilter && row.gcsLevel !== gcsFilter) {
				return false;
			}

			return true;
		};

		gridApi.exec('filter-rows', { filter });
	}

	function clearFilters() {
		searchTerm = '';
		problemTypeFilter = '';
		majorBleedingFilter = 'all';
		airwayInterventionFilter = 'all';
		gcsFilter = '';
		if (gridApi) {
			gridApi.exec('filter-rows', { filter: () => true });
		}
	}

	let hasActiveFilters = $derived(
		searchTerm !== '' ||
			problemTypeFilter !== '' ||
			majorBleedingFilter !== 'all' ||
			airwayInterventionFilter !== 'all' ||
			gcsFilter !== ''
	);
</script>

<div class="min-h-screen bg-gray-50">
	<!-- Header -->
	<header class="bg-nhs-blue text-white shadow">
		<div class="mx-auto max-w-7xl px-4 py-4 sm:px-6">
			<h1 class="text-2xl font-bold">WHO Emergency First Aid Form — Clinician Dashboard</h1>
			<p class="mt-1 text-sm text-blue-100">
				CFAR encounters using the CABCDE framework — major bleeding, airway intervention, GCS level, and urgent-flag counts
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
						placeholder="Patient name or CFAR responder..."
						bind:value={searchTerm}
						oninput={applyFilters}
						class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
					/>
				</div>

				<!-- Problem type -->
				<div>
					<label for="problem-filter" class="mb-1 block text-sm font-medium text-gray-700">
						Problem type
					</label>
					<select
						id="problem-filter"
						bind:value={problemTypeFilter}
						onchange={applyFilters}
						class="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
					>
						{#each problemTypeOptions as opt (opt.value)}
							<option value={opt.value}>{opt.label}</option>
						{/each}
					</select>
				</div>

				<!-- Major bleeding -->
				<div>
					<label for="bleeding-filter" class="mb-1 block text-sm font-medium text-gray-700">
						Major bleeding
					</label>
					<select
						id="bleeding-filter"
						bind:value={majorBleedingFilter}
						onchange={applyFilters}
						class="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
					>
						{#each majorBleedingOptions as opt (opt.value)}
							<option value={opt.value}>{opt.label}</option>
						{/each}
					</select>
				</div>

				<!-- Airway intervention -->
				<div>
					<label for="airway-filter" class="mb-1 block text-sm font-medium text-gray-700">
						Airway intervention
					</label>
					<select
						id="airway-filter"
						bind:value={airwayInterventionFilter}
						onchange={applyFilters}
						class="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
					>
						{#each airwayInterventionOptions as opt (opt.value)}
							<option value={opt.value}>{opt.label}</option>
						{/each}
					</select>
				</div>

				<!-- GCS level -->
				<div>
					<label for="gcs-filter" class="mb-1 block text-sm font-medium text-gray-700">
						GCS level
					</label>
					<select
						id="gcs-filter"
						bind:value={gcsFilter}
						onchange={applyFilters}
						class="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
					>
						{#each gcsOptions as opt (opt.value)}
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
			<span>{patients.length} encounters total</span>
			{#if error}
				<span class="text-warning">{error}</span>
			{/if}
		</div>
	</main>
</div>
