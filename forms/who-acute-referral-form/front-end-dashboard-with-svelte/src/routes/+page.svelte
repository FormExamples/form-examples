<script lang="ts">
	import { Grid, Willow } from '@svar-ui/svelte-grid';
	import { fetchPatients } from '$lib/api';
	import { patients as samplePatients } from '$lib/data';
	import type { PatientRow } from '$lib/types';

	let patients = $state<PatientRow[]>(samplePatients);
	let loading = $state(true);
	let error = $state('');
	let searchTerm = $state('');
	let modeFilter = $state('');
	let statusFilter = $state('');
	let urgentFilter = $state('all');
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

	const modeOptions = [
		{ value: '', label: 'All modes' },
		{ value: 'road', label: 'Road' },
		{ value: 'air', label: 'Air' },
		{ value: 'sea', label: 'Sea' },
	];

	const statusOptions = [
		{ value: '', label: 'All statuses' },
		{ value: 'initiated', label: 'Initiated' },
		{ value: 'in-transit', label: 'In transit' },
		{ value: 'arrived', label: 'Arrived' },
		{ value: 'feedback-received', label: 'Feedback received' },
	];

	const urgentOptions = [
		{ value: 'all', label: 'All' },
		{ value: 'has', label: 'Has urgent flags' },
		{ value: 'none', label: 'No urgent flags' },
	];

	function formatStatus(value: string): string {
		switch (value) {
			case 'initiated':
				return 'Initiated';
			case 'in-transit':
				return 'In transit';
			case 'arrived':
				return 'Arrived';
			case 'feedback-received':
				return 'Feedback received';
			default:
				return value || '';
		}
	}

	function formatMode(value: string): string {
		if (!value) return '';
		return value.charAt(0).toUpperCase() + value.slice(1);
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
			id: 'initiatingFacility',
			header: 'Initiating Facility',
			flexgrow: 1,
			sort: true,
		},
		{
			id: 'referralFacility',
			header: 'Referral Facility',
			flexgrow: 1,
			sort: true,
		},
		{
			id: 'modeOfTransfer',
			header: 'Mode',
			width: 90,
			sort: true,
			template: (value: string) => formatMode(value),
		},
		{
			id: 'primaryDiagnosis',
			header: 'Primary Diagnosis',
			flexgrow: 1,
			sort: true,
		},
		{
			id: 'transferStatus',
			header: 'Status',
			width: 160,
			sort: true,
			template: (value: string) => formatStatus(value),
		},
		{
			id: 'urgentFlagCount',
			header: 'Urgent Flags',
			width: 120,
			sort: true,
		},
		{
			id: 'departureTime',
			header: 'Departure',
			width: 170,
			sort: true,
			template: (value: string) => {
				if (!value) return '';
				const d = new Date(value);
				return Number.isNaN(d.getTime()) ? value : d.toLocaleString();
			},
		},
		{
			id: 'arrivalTime',
			header: 'Arrival',
			width: 170,
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
			// Text search across patient name and facilities
			if (term) {
				const matches =
					row.patientName.toLowerCase().includes(term) ||
					row.initiatingFacility.toLowerCase().includes(term) ||
					row.referralFacility.toLowerCase().includes(term);
				if (!matches) return false;
			}

			// Mode of transfer filter
			if (modeFilter && row.modeOfTransfer !== modeFilter) {
				return false;
			}

			// Transfer status filter
			if (statusFilter && row.transferStatus !== statusFilter) {
				return false;
			}

			// Urgent flag filter
			if (urgentFilter === 'has' && row.urgentFlagCount <= 0) return false;
			if (urgentFilter === 'none' && row.urgentFlagCount > 0) return false;

			return true;
		};

		gridApi.exec('filter-rows', { filter });
	}

	function clearFilters() {
		searchTerm = '';
		modeFilter = '';
		statusFilter = '';
		urgentFilter = 'all';
		if (gridApi) {
			gridApi.exec('filter-rows', { filter: () => true });
		}
	}

	let hasActiveFilters = $derived(
		searchTerm !== '' ||
			modeFilter !== '' ||
			statusFilter !== '' ||
			urgentFilter !== 'all'
	);
</script>

<div class="min-h-screen bg-gray-50">
	<!-- Header -->
	<header class="bg-nhs-blue text-white shadow">
		<div class="mx-auto max-w-7xl px-4 py-4 sm:px-6">
			<h1 class="text-2xl font-bold">WHO Acute Referral Form — Clinician Dashboard</h1>
			<p class="mt-1 text-sm text-blue-100">
				Inter-facility patient transfers (SBAR framework) with mode of transfer, transfer status, and urgent-flag counts
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
						placeholder="Patient name or facility..."
						bind:value={searchTerm}
						oninput={applyFilters}
						class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
					/>
				</div>

				<!-- Mode of transfer -->
				<div>
					<label for="mode-filter" class="mb-1 block text-sm font-medium text-gray-700">
						Mode of transfer
					</label>
					<select
						id="mode-filter"
						bind:value={modeFilter}
						onchange={applyFilters}
						class="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
					>
						{#each modeOptions as opt (opt.value)}
							<option value={opt.value}>{opt.label}</option>
						{/each}
					</select>
				</div>

				<!-- Transfer status -->
				<div>
					<label for="status-filter" class="mb-1 block text-sm font-medium text-gray-700">
						Transfer status
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

				<!-- Urgent flags -->
				<div>
					<label for="urgent-filter" class="mb-1 block text-sm font-medium text-gray-700">
						Urgent flags
					</label>
					<select
						id="urgent-filter"
						bind:value={urgentFilter}
						onchange={applyFilters}
						class="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
					>
						{#each urgentOptions as opt (opt.value)}
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
			<span>{patients.length} referrals total</span>
			{#if error}
				<span class="text-warning">{error}</span>
			{/if}
		</div>
	</main>
</div>
