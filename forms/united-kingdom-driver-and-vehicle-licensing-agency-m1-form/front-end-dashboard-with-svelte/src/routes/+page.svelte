<script lang="ts">
	import { Grid, Willow } from '@svar-ui/svelte-grid';
	import { fetchPatients } from '$lib/api';
	import { patients as samplePatients, conditionCategories } from '$lib/data';
	import type { PatientRow } from '$lib/types';

	let patients = $state<PatientRow[]>(samplePatients);
	let loading = $state(true);
	let error = $state('');
	let searchTerm = $state('');
	let conditionFilter = $state('');
	let suicidalFilter = $state('');
	let recentContactFilter = $state('');
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

	const conditionOptions = [
		{ value: '', label: 'All conditions' },
		{ value: conditionCategories.anxietyDepressionMild, label: 'Anxiety/depression (mild)' },
		{ value: conditionCategories.anxietyDepressionSevere, label: 'Anxiety/depression (severe)' },
		{ value: conditionCategories.bipolar, label: 'Bipolar' },
		{ value: conditionCategories.eatingDisorder, label: 'Eating disorder' },
		{ value: conditionCategories.ocdPtsd, label: 'OCD/PTSD' },
		{ value: conditionCategories.personalityDisorder, label: 'Personality disorder' },
		{
			value: conditionCategories.schizophreniaPsychosis,
			label: 'Schizophrenia/psychosis',
		},
		{ value: conditionCategories.other, label: 'Other' },
	];

	const yesNoOptions = [
		{ value: '', label: 'All' },
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' },
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
			header: 'Driving Licence',
			width: 180,
			sort: true,
		},
		{
			id: 'mentalHealthConditions',
			header: 'Conditions',
			flexgrow: 1,
			sort: false,
			template: (value: string[]) => (value && value.length > 0 ? value.join('; ') : '—'),
		},
		{
			id: 'suicidalThoughtsVariant',
			header: 'Suicidal Variant',
			width: 140,
			sort: true,
			template: (value: boolean) => (value ? 'Yes' : 'No'),
		},
		{
			id: 'recentContact',
			header: 'Recent Contact',
			width: 140,
			sort: true,
			template: (value: boolean) => (value ? 'Yes' : 'No'),
		},
		{
			id: 'highPriorityFlagCount',
			header: 'High-Priority Flags',
			width: 150,
			sort: true,
		},
		{
			id: 'submittedAt',
			header: 'Submitted',
			width: 170,
			sort: true,
			template: (value: string) => {
				if (!value) return '';
				const d = new Date(value);
				return Number.isNaN(d.getTime()) ? value : d.toLocaleString('en-GB');
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

			// Mental-health condition filter (matches if any of the row's
			// conditions equals the selected category label)
			if (conditionFilter) {
				if (!row.mentalHealthConditions.includes(conditionFilter)) return false;
			}

			// Suicidal-thoughts variant filter
			if (suicidalFilter === 'yes' && !row.suicidalThoughtsVariant) return false;
			if (suicidalFilter === 'no' && row.suicidalThoughtsVariant) return false;

			// Recent contact filter
			if (recentContactFilter === 'yes' && !row.recentContact) return false;
			if (recentContactFilter === 'no' && row.recentContact) return false;

			return true;
		};

		gridApi.exec('filter-rows', { filter });
	}

	function clearFilters() {
		searchTerm = '';
		conditionFilter = '';
		suicidalFilter = '';
		recentContactFilter = '';
		if (gridApi) {
			gridApi.exec('filter-rows', { filter: () => true });
		}
	}

	let hasActiveFilters = $derived(
		searchTerm !== '' ||
			conditionFilter !== '' ||
			suicidalFilter !== '' ||
			recentContactFilter !== ''
	);
</script>

<div class="min-h-screen bg-gray-50">
	<!-- Header -->
	<header class="bg-nhs-blue text-white shadow">
		<div class="mx-auto max-w-7xl px-4 py-4 sm:px-6">
			<h1 class="text-2xl font-bold">UK DVLA M1 — Clinician Dashboard</h1>
			<p class="mt-1 text-sm text-blue-100">
				Confidential medical information (mental health) — applicant list with primary
				condition, suicidal-thoughts variant, and recent healthcare contact
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

				<!-- Mental health condition -->
				<div>
					<label for="condition-filter" class="mb-1 block text-sm font-medium text-gray-700">
						Primary Condition
					</label>
					<select
						id="condition-filter"
						bind:value={conditionFilter}
						onchange={applyFilters}
						class="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
					>
						{#each conditionOptions as opt (opt.value)}
							<option value={opt.value}>{opt.label}</option>
						{/each}
					</select>
				</div>

				<!-- Suicidal thoughts variant -->
				<div>
					<label for="suicidal-filter" class="mb-1 block text-sm font-medium text-gray-700">
						Suicidal Variant
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

				<!-- Recent contact -->
				<div>
					<label for="contact-filter" class="mb-1 block text-sm font-medium text-gray-700">
						Recent Contact
					</label>
					<select
						id="contact-filter"
						bind:value={recentContactFilter}
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
