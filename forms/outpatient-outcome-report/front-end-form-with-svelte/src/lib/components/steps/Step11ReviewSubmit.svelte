<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { gradeOOCG } from '$lib/engine/oocg-grader';
	import { gradeColor, gradeLabel } from '$lib/engine/utils';
	import Badge from '$lib/components/ui/Badge.svelte';

	const data = assessment.data;
	const preview = $derived(gradeOOCG(data));

	const priorityColor: Record<string, string> = {
		critical: 'bg-red-200 text-red-900 border-red-400',
		high: 'bg-red-100 text-red-800 border-red-300',
		medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
		low: 'bg-gray-100 text-gray-700 border-gray-300'
	};

	const domains = [
		{ key: 'clinicalGrade', label: 'Clinical' },
		{ key: 'promGrade', label: 'PROM' },
		{ key: 'premGrade', label: 'PREM' },
		{ key: 'operationalGrade', label: 'Operational' }
	] as const;
</script>

<div class="mx-auto max-w-2xl">
	<div class="mb-6">
		<h2 class="text-2xl font-bold text-gray-900">Review & Submit</h2>
		<p class="mt-1 text-sm text-gray-500">
			Review the derived grades and flagged issues before submitting this report.
		</p>
	</div>

	<!-- Overall Grade -->
	<div class="mb-6 rounded-xl border-2 p-6 text-center {gradeColor(preview.overallGrade)}">
		<div class="text-4xl font-bold">{preview.overallGrade || '—'}</div>
		<div class="mt-1 text-lg font-semibold">{gradeLabel(preview.overallGrade)}</div>
		<div class="mt-1 text-sm opacity-75">Overall OOCG Grade (worst of four domains)</div>
	</div>

	<!-- Domain Grades -->
	<div class="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
		<h3 class="mb-4 font-semibold text-gray-900">Domain Grades</h3>
		<div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
			{#each domains as dom}
				<div class="rounded-lg border p-3 text-center {gradeColor(preview[dom.key])}">
					<div class="text-2xl font-bold">{preview[dom.key] || '—'}</div>
					<div class="mt-1 text-xs font-medium">{dom.label}</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Flagged Issues -->
	{#if preview.flaggedIssues.length > 0}
		<div class="mb-6 rounded-xl border border-red-200 bg-white p-6 shadow-sm">
			<h3 class="mb-4 font-semibold text-red-800">Flagged Issues ({preview.flaggedIssues.length})</h3>
			<div class="space-y-2">
				{#each preview.flaggedIssues as flag}
					<div class="flex items-start gap-3 rounded-lg border p-3 {priorityColor[flag.priority]}">
						<span class="mt-0.5 rounded px-2 py-0.5 text-xs font-bold uppercase {priorityColor[flag.priority]}">
							{flag.priority}
						</span>
						<div>
							<span class="font-medium">{flag.category}:</span>
							{flag.message}
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Patient Summary -->
	<div class="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
		<h3 class="mb-4 font-semibold text-gray-900">Summary</h3>
		<dl class="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
			<div>
				<dt class="font-medium text-gray-600">Patient</dt>
				<dd>{data.patientDetails.givenName} {data.patientDetails.familyName}</dd>
			</div>
			<div>
				<dt class="font-medium text-gray-600">Date of Birth</dt>
				<dd>{data.patientDetails.dateOfBirth || '—'}</dd>
			</div>
			<div>
				<dt class="font-medium text-gray-600">NHS Number</dt>
				<dd>{data.patientDetails.nhsNumber || '—'}</dd>
			</div>
			<div>
				<dt class="font-medium text-gray-600">Clinic Date</dt>
				<dd>{data.encounterDetails.clinicDate || '—'}</dd>
			</div>
			<div>
				<dt class="font-medium text-gray-600">Specialty</dt>
				<dd>{data.encounterDetails.specialty || '—'}</dd>
			</div>
			<div>
				<dt class="font-medium text-gray-600">Clinical Outcome</dt>
				<dd>{data.clinicalOutcome.outcomeClassification || '—'}</dd>
			</div>
			<div>
				<dt class="font-medium text-gray-600">Signed off by</dt>
				<dd>{data.signOff.reportingClinicianName || '—'} ({data.signOff.reportingClinicianRole || '—'})</dd>
			</div>
			<div>
				<dt class="font-medium text-gray-600">Sign-off time</dt>
				<dd>{data.signOff.signedOffAt || '—'}</dd>
			</div>
		</dl>
	</div>
</div>
