<script lang="ts">
	import { Grid, Willow } from '@svar-ui/svelte-grid';
	import { fetchPatients } from '$lib/api';
	import { patients as samplePatients } from '$lib/data';
	import type { PatientRow } from '$lib/types';

	let patients = $state<PatientRow[]>(samplePatients);
	let loading = $state(true);
	let error = $state('');
	let searchTerm = $state('');
	let timeframeFilter = $state('');
	let flagFilter = $state('all');
	let informedFilter = $state('all');
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

	const timeframeOptions = [
		{ value: '', label: 'All timeframes' },
		{ value: 'urgent', label: 'Urgent (< 24h)' },
		{ value: '2-6-days', label: '2-6 days' },
		{ value: '1-2-weeks', label: '1-2 weeks' },
		{ value: 'over-2-weeks', label: '> 2 weeks' },
	];

	const flagOptions = [
		{ value: 'all', label: 'All status flags' },
		{ value: 'cognitive-impairment', label: 'Cognitive impairment' },
		{ value: 'carer-dependent', label: 'Carer-dependent' },
		{ value: 'spinal', label: 'Spinal precautions' },
		{ value: 'weight-bearing', label: 'Weight-bearing' },
		{ value: 'palliative-care', label: 'Palliative care' },
	];

	const informedOptions = [
		{ value: 'all', label: 'All' },
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' },
	];

	function formatTimeframe(value: string): string {
		switch (value) {
			case 'urgent':
				return 'Urgent (< 24h)';
			case '2-6-days':
				return '2-6 days';
			case '1-2-weeks':
				return '1-2 weeks';
			case 'over-2-weeks':
				return '> 2 weeks';
			default:
				return value || '';
		}
	}

	function formatFlag(value: string): string {
		switch (value) {
			case 'cognitive-impairment':
				return 'Cognitive impairment';
			case 'carer-dependent':
				return 'Carer-dependent';
			case 'spinal':
				return 'Spinal precautions';
			case 'weight-bearing':
				return 'Weight-bearing';
			case 'palliative-care':
				return 'Palliative care';
			default:
				return value;
		}
	}

	function formatStatusFlags(value: string[]): string {
		if (!value || value.length === 0) return '—';
		return value.map(formatFlag).join(', ');
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
			id: 'referralFacility',
			header: 'Referral Facility',
			flexgrow: 1,
			sort: true,
		},
		{
			id: 'primaryCareFacility',
			header: 'Primary Care Facility',
			flexgrow: 1,
			sort: true,
		},
		{
			id: 'finalDiagnosis',
			header: 'Final Diagnosis',
			flexgrow: 1,
			sort: true,
		},
		{
			id: 'followUpTimeframe',
			header: 'Follow-up',
			width: 140,
			sort: true,
			template: (value: string) => formatTimeframe(value),
		},
		{
			id: 'statusFlags',
			header: 'Status Flags',
			flexgrow: 1,
			template: (value: string[]) => formatStatusFlags(value),
		},
		{
			id: 'patientFamilyInformed',
			header: 'Pt/Family Informed',
			width: 150,
			sort: true,
			template: (value: boolean) => (value ? 'Yes' : 'No'),
		},
		{
			id: 'highPriorityFlagCount',
			header: 'High-Priority Flags',
			width: 140,
			sort: true,
		},
		{
			id: 'dischargedAt',
			header: 'Discharged',
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
			// Text search across patient name and facilities
			if (term) {
				const matches =
					row.patientName.toLowerCase().includes(term) ||
					row.referralFacility.toLowerCase().includes(term) ||
					row.primaryCareFacility.toLowerCase().includes(term);
				if (!matches) return false;
			}

			// Follow-up timeframe filter
			if (timeframeFilter && row.followUpTimeframe !== timeframeFilter) {
				return false;
			}

			// Status flag filter
			if (flagFilter !== 'all' && !row.statusFlags.includes(flagFilter)) {
				return false;
			}

			// Patient/family informed filter
			if (informedFilter === 'yes' && !row.patientFamilyInformed) return false;
			if (informedFilter === 'no' && row.patientFamilyInformed) return false;

			return true;
		};

		gridApi.exec('filter-rows', { filter });
	}

	function clearFilters() {
		searchTerm = '';
		timeframeFilter = '';
		flagFilter = 'all';
		informedFilter = 'all';
		if (gridApi) {
			gridApi.exec('filter-rows', { filter: () => true });
		}
	}

	let hasActiveFilters = $derived(
		searchTerm !== '' ||
			timeframeFilter !== '' ||
			flagFilter !== 'all' ||
			informedFilter !== 'all'
	);
</script>

<div class="min-h-screen bg-gray-50">
	<!-- Header -->
	<header class="bg-nhs-blue text-white shadow">
		<div class="mx-auto max-w-7xl px-4 py-4 sm:px-6">
			<h1 class="text-2xl font-bold">WHO Counter-Referral Form — Clinician Dashboard</h1>
			<p class="mt-1 text-sm text-blue-100">
				Discharges back to primary care (SBAR framework) with follow-up timeframe, status flags, and patient/family information status
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

				<!-- Follow-up timeframe -->
				<div>
					<label for="timeframe-filter" class="mb-1 block text-sm font-medium text-gray-700">
						Follow-up timeframe
					</label>
					<select
						id="timeframe-filter"
						bind:value={timeframeFilter}
						onchange={applyFilters}
						class="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
					>
						{#each timeframeOptions as opt (opt.value)}
							<option value={opt.value}>{opt.label}</option>
						{/each}
					</select>
				</div>

				<!-- Status flag -->
				<div>
					<label for="flag-filter" class="mb-1 block text-sm font-medium text-gray-700">
						Status flag
					</label>
					<select
						id="flag-filter"
						bind:value={flagFilter}
						onchange={applyFilters}
						class="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
					>
						{#each flagOptions as opt (opt.value)}
							<option value={opt.value}>{opt.label}</option>
						{/each}
					</select>
				</div>

				<!-- Patient/family informed -->
				<div>
					<label for="informed-filter" class="mb-1 block text-sm font-medium text-gray-700">
						Pt/Family informed
					</label>
					<select
						id="informed-filter"
						bind:value={informedFilter}
						onchange={applyFilters}
						class="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
					>
						{#each informedOptions as opt (opt.value)}
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
			<span>{patients.length} counter-referrals total</span>
			{#if error}
				<span class="text-warning">{error}</span>
			{/if}
		</div>
	</main>
</div>
