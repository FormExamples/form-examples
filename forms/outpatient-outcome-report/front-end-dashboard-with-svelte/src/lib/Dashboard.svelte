<script lang="ts">
	import { Grid, Willow } from '@svar-ui/svelte-grid';
	import { fetchOutcomes } from './api.ts';
	import { outcomes as sampleOutcomes } from './sample-data.ts';
	import type { OutcomeRow, OocgGrade, SubmissionStatus, Modality } from './types.ts';

	let outcomes = $state<OutcomeRow[]>(sampleOutcomes);
	let loading = $state(true);
	let error = $state('');
	let gridApi = $state<any>(null);

	// Filter state
	let overallGradeFilter = $state('');
	let statusFilter = $state('');
	let specialtyFilter = $state('');
	let modalityFilter = $state('');

	// Load from backend, fall back to sample data
	$effect(() => {
		fetchOutcomes()
			.then((items) => {
				if (items.length > 0) {
					outcomes = items;
				}
				loading = false;
			})
			.catch(() => {
				// Backend unavailable — use sample data
				loading = false;
			});
	});

	const gradeOptions = [
		{ value: '', label: 'All grades' },
		{ value: 'A', label: 'A — Excellent' },
		{ value: 'B', label: 'B — Good' },
		{ value: 'C', label: 'C — Acceptable' },
		{ value: 'D', label: 'D — Poor' },
		{ value: 'E', label: 'E — Unacceptable' },
	];

	const statusOptions = [
		{ value: '', label: 'All statuses' },
		{ value: 'draft', label: 'Draft' },
		{ value: 'submitted', label: 'Submitted' },
		{ value: 'reviewed', label: 'Reviewed' },
		{ value: 'urgent', label: 'Urgent' },
	];

	const specialtyOptions = [
		{ value: '', label: 'All specialties' },
		...Array.from(new Set(sampleOutcomes.map((r) => r.specialty)))
			.sort()
			.map((s) => ({ value: s, label: s })),
	];

	const modalityOptions = [
		{ value: '', label: 'All modalities' },
		{ value: 'in_person', label: 'In person' },
		{ value: 'telephone', label: 'Telephone' },
		{ value: 'video', label: 'Video' },
	];

	function gradeClass(grade: OocgGrade): string {
		const map: Record<OocgGrade, string> = {
			A: 'bg-green-100 text-green-800',
			B: 'bg-blue-100 text-blue-800',
			C: 'bg-yellow-100 text-yellow-800',
			D: 'bg-orange-100 text-orange-800',
			E: 'bg-red-100 text-red-800',
		};
		return map[grade] ?? '';
	}

	function statusClass(status: SubmissionStatus): string {
		const map: Record<SubmissionStatus, string> = {
			draft: 'bg-gray-100 text-gray-700',
			submitted: 'bg-blue-100 text-blue-700',
			reviewed: 'bg-green-100 text-green-700',
			urgent: 'bg-red-100 text-red-700',
		};
		return map[status] ?? '';
	}

	function formatModality(m: string): string {
		const map: Record<string, string> = {
			in_person: 'In person',
			telephone: 'Telephone',
			video: 'Video',
		};
		return map[m] ?? m;
	}

	function formatAttendance(a: string): string {
		const map: Record<string, string> = {
			attended: 'Attended',
			dna: 'DNA',
			cancelled_patient: 'Cancelled (pt)',
			cancelled_provider: 'Cancelled (prov)',
			rescheduled: 'Rescheduled',
		};
		return map[a] ?? a;
	}

	const columns = [
		{ id: 'patient', header: 'Patient', flexgrow: 1, sort: true },
		{ id: 'nhsNumber', header: 'NHS Number', width: 140, sort: true },
		{ id: 'clinicDate', header: 'Clinic Date', width: 120, sort: true },
		{ id: 'specialty', header: 'Specialty', width: 140, sort: true },
		{
			id: 'modality',
			header: 'Modality',
			width: 110,
			sort: true,
			template: (v: string) => formatModality(v),
		},
		{ id: 'waitTimeDays', header: 'Wait (days)', width: 100, sort: true },
		{
			id: 'nhsAttendanceOutcome',
			header: 'Attendance',
			width: 140,
			sort: true,
			template: (v: string) => formatAttendance(v),
		},
		{ id: 'clinicalGrade', header: 'Clinical', width: 90, sort: true },
		{ id: 'promGrade', header: 'PROM', width: 80, sort: true },
		{ id: 'premGrade', header: 'PREM', width: 80, sort: true },
		{ id: 'operationalGrade', header: 'Operational', width: 105, sort: true },
		{ id: 'overallGrade', header: 'Overall', width: 85, sort: true },
		{ id: 'flagCount', header: 'Flags', width: 70, sort: true },
		{ id: 'status', header: 'Status', width: 100, sort: true },
	];

	function init(api: any) {
		gridApi = api;
		api.exec('sort-rows', { key: 'clinicDate', order: 'desc' });
	}

	function applyFilters() {
		if (!gridApi) return;
		const filter = (row: OutcomeRow) => {
			if (overallGradeFilter && row.overallGrade !== overallGradeFilter) return false;
			if (statusFilter && row.status !== statusFilter) return false;
			if (specialtyFilter && row.specialty !== specialtyFilter) return false;
			if (modalityFilter && row.modality !== modalityFilter) return false;
			return true;
		};
		gridApi.exec('filter-rows', { filter });
	}

	function clearFilters() {
		overallGradeFilter = '';
		statusFilter = '';
		specialtyFilter = '';
		modalityFilter = '';
		if (gridApi) {
			gridApi.exec('filter-rows', { filter: () => true });
		}
	}

	let hasActiveFilters = $derived(
		overallGradeFilter !== '' ||
			statusFilter !== '' ||
			specialtyFilter !== '' ||
			modalityFilter !== ''
	);

	// Grade summary counts
	let gradeCounts = $derived(
		(['A', 'B', 'C', 'D', 'E'] as OocgGrade[]).map((g) => ({
			grade: g,
			count: outcomes.filter((r) => r.overallGrade === g).length,
		}))
	);
</script>

<div class="min-h-screen bg-gray-50">
	<!-- Header -->
	<header class="bg-nhs-blue text-white shadow">
		<div class="mx-auto max-w-full px-4 py-4 sm:px-6">
			<h1 class="text-2xl font-bold">Outpatient Outcome Report — Clinician Dashboard</h1>
			<p class="mt-1 text-sm text-blue-100">
				OOCG submissions with four-domain composite grading
			</p>
		</div>
	</header>

	<main class="mx-auto max-w-full px-4 py-6 sm:px-6">
		<!-- Grade summary strip -->
		<div class="mb-4 flex flex-wrap gap-2">
			{#each gradeCounts as { grade, count } (grade)}
				<div class="flex items-center gap-1.5 rounded-lg border bg-white px-3 py-2 shadow-sm">
					<span
						class="inline-flex h-6 w-6 items-center justify-center rounded text-xs font-bold {gradeClass(grade as OocgGrade)}"
					>
						{grade}
					</span>
					<span class="text-sm font-medium text-gray-700">{count}</span>
				</div>
			{/each}
			<div class="flex items-center gap-1.5 rounded-lg border bg-white px-3 py-2 shadow-sm">
				<span class="text-sm text-gray-500">Total:</span>
				<span class="text-sm font-medium text-gray-700">{outcomes.length}</span>
			</div>
			<div class="flex items-center gap-1.5 rounded-lg border bg-white px-3 py-2 shadow-sm">
				<span class="text-sm text-gray-500">Urgent:</span>
				<span class="text-sm font-medium text-red-700"
					>{outcomes.filter((r) => r.status === 'urgent').length}</span
				>
			</div>
		</div>

		<!-- Filters bar -->
		<div class="mb-4 rounded-lg bg-white p-4 shadow-sm">
			<div class="flex flex-wrap items-end gap-4">
				<!-- Overall Grade -->
				<div>
					<label for="grade-filter" class="mb-1 block text-sm font-medium text-gray-700">
						Overall Grade
					</label>
					<select
						id="grade-filter"
						bind:value={overallGradeFilter}
						onchange={applyFilters}
						class="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
					>
						{#each gradeOptions as opt (opt.value)}
							<option value={opt.value}>{opt.label}</option>
						{/each}
					</select>
				</div>

				<!-- Status -->
				<div>
					<label for="status-filter" class="mb-1 block text-sm font-medium text-gray-700">
						Status
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

				<!-- Specialty -->
				<div>
					<label for="specialty-filter" class="mb-1 block text-sm font-medium text-gray-700">
						Specialty
					</label>
					<select
						id="specialty-filter"
						bind:value={specialtyFilter}
						onchange={applyFilters}
						class="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
					>
						{#each specialtyOptions as opt (opt.value)}
							<option value={opt.value}>{opt.label}</option>
						{/each}
					</select>
				</div>

				<!-- Modality -->
				<div>
					<label for="modality-filter" class="mb-1 block text-sm font-medium text-gray-700">
						Modality
					</label>
					<select
						id="modality-filter"
						bind:value={modalityFilter}
						onchange={applyFilters}
						class="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
					>
						{#each modalityOptions as opt (opt.value)}
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
					Loading outcomes...
				</div>
			{:else}
				<Willow>
					<Grid data={outcomes} {columns} {init} />
				</Willow>
			{/if}
		</div>

		<!-- Footer summary -->
		<div class="mt-4 flex items-center gap-4 text-sm text-muted">
			<span>{outcomes.length} records total</span>
			{#if error}
				<span class="text-warning">{error}</span>
			{:else}
				<span class="text-gray-400">Sample data — connect backend at localhost:5150</span>
			{/if}
		</div>
	</main>
</div>
