<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { gradeOOCG } from '$lib/engine/oocg-grader';
	import { gradeColor, gradeLabel } from '$lib/engine/utils';
	import Badge from '$lib/components/ui/Badge.svelte';

	const data = assessment.data;
	const preview = $derived(gradeOOCG(data));

	const priorityColor: Record<string, string> = {
		critical: 'bg-error text-error-content border-error',
		high: 'bg-error text-error-content border-error',
		medium: 'bg-warning text-warning-content border-warning',
		low: 'bg-base-300 text-base-content border-base-300'
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
		<h2 class="text-2xl font-bold text-base-content">Review & Submit</h2>
		<p class="mt-1 text-sm text-base-content/60">
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
	<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6 shadow-sm">
		<h3 class="mb-4 font-semibold text-base-content">Domain Grades</h3>
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
		<div class="mb-6 rounded-xl border border-error bg-base-100 p-6 shadow-sm">
			<h3 class="mb-4 font-semibold text-error">Flagged Issues ({preview.flaggedIssues.length})</h3>
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
	<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6 shadow-sm">
		<h3 class="mb-4 font-semibold text-base-content">Summary</h3>
		<dl class="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
			<div>
				<dt class="font-medium text-base-content/70">Patient</dt>
				<dd>{data.patientDetails.givenName} {data.patientDetails.familyName}</dd>
			</div>
			<div>
				<dt class="font-medium text-base-content/70">Date of Birth</dt>
				<dd>{data.patientDetails.dateOfBirth || '—'}</dd>
			</div>
			<div>
				<dt class="font-medium text-base-content/70">NHS Number</dt>
				<dd>{data.patientDetails.nhsNumber || '—'}</dd>
			</div>
			<div>
				<dt class="font-medium text-base-content/70">Clinic Date</dt>
				<dd>{data.encounterDetails.clinicDate || '—'}</dd>
			</div>
			<div>
				<dt class="font-medium text-base-content/70">Specialty</dt>
				<dd>{data.encounterDetails.specialty || '—'}</dd>
			</div>
			<div>
				<dt class="font-medium text-base-content/70">Clinical Outcome</dt>
				<dd>{data.clinicalOutcome.outcomeClassification || '—'}</dd>
			</div>
			<div>
				<dt class="font-medium text-base-content/70">Signed off by</dt>
				<dd>{data.signOff.reportingClinicianName || '—'} ({data.signOff.reportingClinicianRole || '—'})</dd>
			</div>
			<div>
				<dt class="font-medium text-base-content/70">Sign-off time</dt>
				<dd>{data.signOff.signedOffAt || '—'}</dd>
			</div>
		</dl>
	</div>
</div>
