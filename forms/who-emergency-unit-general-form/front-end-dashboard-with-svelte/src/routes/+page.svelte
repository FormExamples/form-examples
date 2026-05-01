<script lang="ts">
	import { Grid, Willow } from '@svar-ui/svelte-grid';
	import { fetchPatients } from '$lib/api';
	import { patients as samplePatients } from '$lib/data';
	import type { PatientRow } from '$lib/types';

	let patients = $state<PatientRow[]>(samplePatients);
	let loading = $state(true);
	let error = $state('');
	let searchTerm = $state('');
	let arrivalModeFilter = $state('');
	let avpuFilter = $state('');
	let highRiskFilter = $state('all');
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

	const arrivalModeOptions = [
		{ value: '', label: 'All arrival modes' },
		{ value: 'walking', label: 'Walking' },
		{ value: 'wheelchair', label: 'Wheelchair' },
		{ value: 'stretcher', label: 'Stretcher' },
		{ value: 'ambulance', label: 'Ambulance' },
	];

	const avpuOptions = [
		{ value: '', label: 'All AVPU levels' },
		{ value: 'A', label: 'A — Alert' },
		{ value: 'V', label: 'V — Verbal' },
		{ value: 'P', label: 'P — Pain' },
		{ value: 'U', label: 'U — Unresponsive' },
	];

	const highRiskOptions = [
		{ value: 'all', label: 'All' },
		{ value: 'yes', label: 'High-risk signs: Yes' },
		{ value: 'no', label: 'High-risk signs: No' },
	];

	const dispositionOptions = [
		{ value: '', label: 'All dispositions' },
		{ value: 'admit', label: 'Admit' },
		{ value: 'transfer', label: 'Transfer' },
		{ value: 'discharge', label: 'Discharge' },
		{ value: 'died', label: 'Died' },
		{ value: 'lwbs', label: 'LWBS' },
	];

	function formatArrivalMode(value: string): string {
		if (!value) return '';
		return value.charAt(0).toUpperCase() + value.slice(1);
	}

	function formatAvpu(value: string): string {
		switch (value) {
			case 'A':
				return 'A — Alert';
			case 'V':
				return 'V — Verbal';
			case 'P':
				return 'P — Pain';
			case 'U':
				return 'U — Unresponsive';
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
			id: 'arrivalMode',
			header: 'Arrival',
			width: 110,
			sort: true,
			template: (value: string) => formatArrivalMode(value),
		},
		{
			id: 'chiefComplaint',
			header: 'Chief Complaint',
			flexgrow: 1,
			sort: true,
		},
		{
			id: 'avpu',
			header: 'AVPU',
			width: 150,
			sort: true,
			template: (value: string) => formatAvpu(value),
		},
		{
			id: 'highRiskSignsPresent',
			header: 'High Risk',
			width: 100,
			sort: true,
			template: (value: boolean) => (value ? 'Yes' : 'No'),
		},
		{
			id: 'disposition',
			header: 'Disposition',
			width: 130,
			sort: true,
			template: (value: string) => formatDisposition(value),
		},
		{
			id: 'urgentFlagCount',
			header: 'Urgent Flags',
			width: 120,
			sort: true,
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
			// Text search across patient name and chief complaint
			if (term) {
				const matches =
					row.patientName.toLowerCase().includes(term) ||
					row.chiefComplaint.toLowerCase().includes(term);
				if (!matches) return false;
			}

			// Arrival mode filter
			if (arrivalModeFilter && row.arrivalMode !== arrivalModeFilter) {
				return false;
			}

			// AVPU filter
			if (avpuFilter && row.avpu !== avpuFilter) {
				return false;
			}

			// High-risk signs filter
			if (highRiskFilter === 'yes' && !row.highRiskSignsPresent) return false;
			if (highRiskFilter === 'no' && row.highRiskSignsPresent) return false;

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
		arrivalModeFilter = '';
		avpuFilter = '';
		highRiskFilter = 'all';
		dispositionFilter = '';
		if (gridApi) {
			gridApi.exec('filter-rows', { filter: () => true });
		}
	}

	let hasActiveFilters = $derived(
		searchTerm !== '' ||
			arrivalModeFilter !== '' ||
			avpuFilter !== '' ||
			highRiskFilter !== 'all' ||
			dispositionFilter !== ''
	);
</script>

<div class="min-h-screen bg-gray-50">
	<!-- Header -->
	<header class="bg-nhs-blue text-white shadow">
		<div class="mx-auto max-w-7xl px-4 py-4 sm:px-6">
			<h1 class="text-2xl font-bold">WHO Emergency Unit Form: General — Clinician Dashboard</h1>
			<p class="mt-1 text-sm text-blue-100">
				Non-trauma emergency encounters with arrival mode, AVPU level, high-risk signs, and disposition outcomes
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
						placeholder="Patient name or chief complaint..."
						bind:value={searchTerm}
						oninput={applyFilters}
						class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
					/>
				</div>

				<!-- Arrival mode -->
				<div>
					<label for="arrival-filter" class="mb-1 block text-sm font-medium text-gray-700">
						Arrival mode
					</label>
					<select
						id="arrival-filter"
						bind:value={arrivalModeFilter}
						onchange={applyFilters}
						class="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
					>
						{#each arrivalModeOptions as opt (opt.value)}
							<option value={opt.value}>{opt.label}</option>
						{/each}
					</select>
				</div>

				<!-- AVPU -->
				<div>
					<label for="avpu-filter" class="mb-1 block text-sm font-medium text-gray-700">
						AVPU level
					</label>
					<select
						id="avpu-filter"
						bind:value={avpuFilter}
						onchange={applyFilters}
						class="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
					>
						{#each avpuOptions as opt (opt.value)}
							<option value={opt.value}>{opt.label}</option>
						{/each}
					</select>
				</div>

				<!-- High-risk signs -->
				<div>
					<label for="high-risk-filter" class="mb-1 block text-sm font-medium text-gray-700">
						High-risk signs
					</label>
					<select
						id="high-risk-filter"
						bind:value={highRiskFilter}
						onchange={applyFilters}
						class="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
					>
						{#each highRiskOptions as opt (opt.value)}
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
