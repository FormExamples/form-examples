<script lang="ts">
	import { Grid, Willow } from '@svar-ui/svelte-grid';
	import { fetchPatients } from '$lib/api';
	import { patients as samplePatients } from '$lib/data';
	import type { PatientRow } from '$lib/types';

	let patients = $state<PatientRow[]>(samplePatients);
	let loading = $state(true);
	let error = $state('');
	let searchTerm = $state('');
	let triageFilter = $state('all');
	let sceneTypeFilter = $state('');
	let reassessmentFilter = $state('all');
	let handoverFilter = $state('all');
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
		{ value: 'all', label: 'All triage levels' },
		{ value: 'red', label: 'RED — Immediate' },
		{ value: 'yellow', label: 'YELLOW — Urgent' },
		{ value: 'green', label: 'GREEN — Non-urgent' },
	];

	const sceneTypeOptions = [
		{ value: '', label: 'All scene types' },
		{ value: 'home', label: 'Home' },
		{ value: 'roadside', label: 'Roadside' },
		{ value: 'workplace', label: 'Workplace' },
		{ value: 'public', label: 'Public' },
		{ value: 'medical-facility', label: 'Medical facility' },
		{ value: 'other', label: 'Other' },
	];

	const reassessmentOptions = [
		{ value: 'all', label: 'All reassessment counts' },
		{ value: '0', label: '0 reassessments' },
		{ value: '1', label: '1 reassessment' },
		{ value: '2', label: '2 reassessments' },
		{ value: '3', label: '3 reassessments' },
	];

	const handoverOptions = [
		{ value: 'all', label: 'All handover statuses' },
		{ value: 'yes', label: 'Handover complete' },
		{ value: 'no', label: 'In progress' },
	];

	function formatSceneType(value: string): string {
		switch (value) {
			case 'home':
				return 'Home';
			case 'roadside':
				return 'Roadside';
			case 'workplace':
				return 'Workplace';
			case 'public':
				return 'Public';
			case 'medical-facility':
				return 'Medical facility';
			case 'other':
				return 'Other';
			default:
				return value || '';
		}
	}

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
			id: 'sceneType',
			header: 'Scene',
			width: 140,
			sort: true,
			template: (value: string) => formatSceneType(value),
		},
		{
			id: 'chiefComplaint',
			header: 'Chief Complaint',
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
			id: 'gcsTotal',
			header: 'GCS',
			width: 70,
			sort: true,
			template: (value: number | null) => (value === null ? '—' : String(value)),
		},
		{
			id: 'reassessmentCount',
			header: 'Reassessments',
			width: 130,
			sort: true,
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
			id: 'dispatchedAt',
			header: 'Dispatched',
			width: 180,
			sort: true,
			template: (value: string) => {
				if (!value) return '—';
				const d = new Date(value);
				return Number.isNaN(d.getTime()) ? value : d.toLocaleString();
			},
		},
		{
			id: 'handoverAt',
			header: 'Handover',
			width: 180,
			sort: true,
			template: (value: string | null) => {
				if (!value) return 'In progress';
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

			// Triage filter
			if (triageFilter !== 'all' && row.triageCategory !== triageFilter) {
				return false;
			}

			// Scene type filter
			if (sceneTypeFilter && row.sceneType !== sceneTypeFilter) {
				return false;
			}

			// Reassessment count filter
			if (reassessmentFilter !== 'all') {
				const target = Number(reassessmentFilter);
				if (row.reassessmentCount !== target) return false;
			}

			// Handover filter
			if (handoverFilter === 'yes' && !row.handoverAt) return false;
			if (handoverFilter === 'no' && row.handoverAt) return false;

			return true;
		};

		gridApi.exec('filter-rows', { filter });
	}

	function clearFilters() {
		searchTerm = '';
		triageFilter = 'all';
		sceneTypeFilter = '';
		reassessmentFilter = 'all';
		handoverFilter = 'all';
		if (gridApi) {
			gridApi.exec('filter-rows', { filter: () => true });
		}
	}

	let hasActiveFilters = $derived(
		searchTerm !== '' ||
			triageFilter !== 'all' ||
			sceneTypeFilter !== '' ||
			reassessmentFilter !== 'all' ||
			handoverFilter !== 'all'
	);
</script>

<div class="min-h-screen bg-gray-50">
	<!-- Header -->
	<header class="bg-nhs-blue text-white shadow">
		<div class="mx-auto max-w-7xl px-4 py-4 sm:px-6">
			<h1 class="text-2xl font-bold">WHO Prehospital Form — Clinician Dashboard</h1>
			<p class="mt-1 text-sm text-blue-100">
				EMS prehospital encounters with scene type, triage category, GCS, reassessments, and handover status
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

				<!-- Triage -->
				<div>
					<label for="triage-filter" class="mb-1 block text-sm font-medium text-gray-700">
						Triage
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

				<!-- Scene type -->
				<div>
					<label for="scene-filter" class="mb-1 block text-sm font-medium text-gray-700">
						Scene type
					</label>
					<select
						id="scene-filter"
						bind:value={sceneTypeFilter}
						onchange={applyFilters}
						class="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
					>
						{#each sceneTypeOptions as opt (opt.value)}
							<option value={opt.value}>{opt.label}</option>
						{/each}
					</select>
				</div>

				<!-- Reassessment count -->
				<div>
					<label for="reassessment-filter" class="mb-1 block text-sm font-medium text-gray-700">
						Reassessments
					</label>
					<select
						id="reassessment-filter"
						bind:value={reassessmentFilter}
						onchange={applyFilters}
						class="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
					>
						{#each reassessmentOptions as opt (opt.value)}
							<option value={opt.value}>{opt.label}</option>
						{/each}
					</select>
				</div>

				<!-- Handover -->
				<div>
					<label for="handover-filter" class="mb-1 block text-sm font-medium text-gray-700">
						Handover
					</label>
					<select
						id="handover-filter"
						bind:value={handoverFilter}
						onchange={applyFilters}
						class="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
					>
						{#each handoverOptions as opt (opt.value)}
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
