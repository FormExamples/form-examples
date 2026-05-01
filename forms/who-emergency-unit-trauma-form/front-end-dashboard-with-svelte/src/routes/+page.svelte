<script lang="ts">
	import { Grid, Willow } from '@svar-ui/svelte-grid';
	import { fetchPatients } from '$lib/api';
	import { patients as samplePatients } from '$lib/data';
	import type { PatientRow } from '$lib/types';

	let patients = $state<PatientRow[]>(samplePatients);
	let loading = $state(true);
	let error = $state('');
	let searchTerm = $state('');
	let triageFilter = $state('');
	let mechanismFilter = $state('');
	let deadOnArrivalFilter = $state('all');
	let dispositionFilter = $state('');
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

	const triageOptions = [
		{ value: '', label: 'All triage categories' },
		{ value: 'red', label: 'RED — Immediate' },
		{ value: 'yellow', label: 'YELLOW — Urgent' },
		{ value: 'green', label: 'GREEN — Non-urgent' },
	];

	const mechanismOptions = [
		{ value: '', label: 'All mechanisms' },
		{ value: 'road-traffic', label: 'Road traffic' },
		{ value: 'fall', label: 'Fall' },
		{ value: 'penetrating', label: 'Penetrating' },
		{ value: 'blunt', label: 'Blunt' },
		{ value: 'burn', label: 'Burn' },
		{ value: 'other', label: 'Other' },
	];

	const deadOnArrivalOptions = [
		{ value: 'all', label: 'All' },
		{ value: 'yes', label: 'Dead on arrival: Yes' },
		{ value: 'no', label: 'Dead on arrival: No' },
	];

	const dispositionOptions = [
		{ value: '', label: 'All dispositions' },
		{ value: 'admit', label: 'Admit' },
		{ value: 'transfer', label: 'Transfer' },
		{ value: 'discharge', label: 'Discharge' },
		{ value: 'died', label: 'Died' },
		{ value: 'lwbs', label: 'LWBS' },
	];

	function formatTriage(value: string): string {
		switch (value) {
			case 'red':
				return 'RED — Immediate';
			case 'yellow':
				return 'YELLOW — Urgent';
			case 'green':
				return 'GREEN — Non-urgent';
			default:
				return value || '';
		}
	}

	function formatMechanism(value: string): string {
		switch (value) {
			case 'road-traffic':
				return 'Road traffic';
			case 'fall':
				return 'Fall';
			case 'penetrating':
				return 'Penetrating';
			case 'blunt':
				return 'Blunt';
			case 'burn':
				return 'Burn';
			case 'other':
				return 'Other';
			default:
				return value || '';
		}
	}

	function formatDisposition(value: string): string {
		switch (value) {
			case 'admit':
				return 'Admit';
			case 'transfer':
				return 'Transfer';
			case 'discharge':
				return 'Discharge';
			case 'died':
				return 'Died';
			case 'lwbs':
				return 'LWBS';
			default:
				return value || '';
		}
	}

	const columns = [
		{
			id: 'patientName',
			header: 'Patient Name',
			width: 180,
			sort: true,
		},
		{
			id: 'dateOfBirth',
			header: 'DOB',
			width: 110,
			sort: true,
		},
		{
			id: 'sex',
			header: 'Sex',
			width: 70,
			sort: true,
		},
		{
			id: 'injuryLocation',
			header: 'Injury Location',
			flexgrow: 1,
			sort: true,
		},
		{
			id: 'triageCategory',
			header: 'Triage',
			width: 160,
			sort: true,
			template: (value: string) => formatTriage(value),
		},
		{
			id: 'mechanism',
			header: 'Mechanism',
			width: 130,
			sort: true,
			template: (value: string) => formatMechanism(value),
		},
		{
			id: 'gcsTotal',
			header: 'GCS',
			width: 80,
			sort: true,
			template: (value: number | null) => (value === null ? '—' : String(value)),
		},
		{
			id: 'fastPositive',
			header: 'FAST+',
			width: 90,
			sort: true,
			template: (value: boolean) => (value ? 'Yes' : 'No'),
		},
		{
			id: 'deadOnArrival',
			header: 'DOA',
			width: 80,
			sort: true,
			template: (value: boolean) => (value ? 'Yes' : 'No'),
		},
		{
			id: 'urgentFlagCount',
			header: 'Urgent Flags',
			width: 120,
			sort: true,
		},
		{
			id: 'disposition',
			header: 'Disposition',
			width: 130,
			sort: true,
			template: (value: string) => formatDisposition(value),
		},
		{
			id: 'providerName',
			header: 'Provider',
			width: 150,
			sort: true,
		},
		{
			id: 'dispositionAt',
			header: 'Disposition Time',
			width: 180,
			sort: true,
			template: (value: string | null) => {
				if (!value) return '—';
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
			// Text search across patient name and injury location
			if (term) {
				const matches =
					row.patientName.toLowerCase().includes(term) ||
					row.injuryLocation.toLowerCase().includes(term);
				if (!matches) return false;
			}

			// Triage category filter
			if (triageFilter && row.triageCategory !== triageFilter) {
				return false;
			}

			// Mechanism filter
			if (mechanismFilter && row.mechanism !== mechanismFilter) {
				return false;
			}

			// Dead on arrival filter
			if (deadOnArrivalFilter === 'yes' && !row.deadOnArrival) return false;
			if (deadOnArrivalFilter === 'no' && row.deadOnArrival) return false;

			// Disposition filter
			if (dispositionFilter && row.disposition !== dispositionFilter) {
				return false;
			}

			return true;
		};

		gridApi.exec('filter-rows', { filter });
	}

	function clearFilters() {
		searchTerm = '';
		triageFilter = '';
		mechanismFilter = '';
		deadOnArrivalFilter = 'all';
		dispositionFilter = '';
		if (gridApi) {
			gridApi.exec('filter-rows', { filter: () => true });
		}
	}

	let hasActiveFilters = $derived(
		searchTerm !== '' ||
			triageFilter !== '' ||
			mechanismFilter !== '' ||
			deadOnArrivalFilter !== 'all' ||
			dispositionFilter !== ''
	);
</script>

<div class="min-h-screen bg-gray-50">
	<!-- Header -->
	<header class="bg-nhs-blue text-white shadow">
		<div class="mx-auto max-w-7xl px-4 py-4 sm:px-6">
			<h1 class="text-2xl font-bold">WHO Emergency Unit Form: Trauma — Clinician Dashboard</h1>
			<p class="mt-1 text-sm text-blue-100">
				Trauma emergency encounters with triage category, injury mechanism, GCS, FAST status, and disposition outcomes
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
						placeholder="Patient name or injury location..."
						bind:value={searchTerm}
						oninput={applyFilters}
						class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
					/>
				</div>

				<!-- Triage category -->
				<div>
					<label for="triage-filter" class="mb-1 block text-sm font-medium text-gray-700">
						Triage category
					</label>
					<select
						id="triage-filter"
						bind:value={triageFilter}
						onchange={applyFilters}
						class="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
					>
						{#each triageOptions as opt (opt.value)}
							<option value={opt.value}>{opt.label}</option>
						{/each}
					</select>
				</div>

				<!-- Mechanism -->
				<div>
					<label for="mechanism-filter" class="mb-1 block text-sm font-medium text-gray-700">
						Mechanism
					</label>
					<select
						id="mechanism-filter"
						bind:value={mechanismFilter}
						onchange={applyFilters}
						class="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
					>
						{#each mechanismOptions as opt (opt.value)}
							<option value={opt.value}>{opt.label}</option>
						{/each}
					</select>
				</div>

				<!-- Dead on arrival -->
				<div>
					<label for="doa-filter" class="mb-1 block text-sm font-medium text-gray-700">
						Dead on arrival
					</label>
					<select
						id="doa-filter"
						bind:value={deadOnArrivalFilter}
						onchange={applyFilters}
						class="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
					>
						{#each deadOnArrivalOptions as opt (opt.value)}
							<option value={opt.value}>{opt.label}</option>
						{/each}
					</select>
				</div>

				<!-- Disposition -->
				<div>
					<label for="disposition-filter" class="mb-1 block text-sm font-medium text-gray-700">
						Disposition
					</label>
					<select
						id="disposition-filter"
						bind:value={dispositionFilter}
						onchange={applyFilters}
						class="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
					>
						{#each dispositionOptions as opt (opt.value)}
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
