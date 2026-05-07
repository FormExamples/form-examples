<script lang="ts">
	import { goto } from '$app/navigation';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { gradeColor, gradeLabel } from '$lib/engine/utils';

	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto('/');
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch('/report/pdf', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.status === 501) {
				pdfError = 'PDF export is not yet available in this version.';
			} else if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `outpatient-outcome-report-${data.patientDetails.familyName}-${new Date().toISOString().slice(0, 10)}.pdf`;
				a.click();
				URL.revokeObjectURL(url);
			} else {
				pdfError = 'Failed to generate PDF. Please try again.';
			}
		} catch {
			pdfError = 'Failed to generate PDF. Please check your connection and try again.';
		}
	}

	function startNew() {
		assessment.reset();
		goto('/');
	}

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

{#if result}
	<div class="min-h-screen bg-gray-50">
		<header class="border-b border-gray-200 bg-white shadow-sm no-print">
			<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
				<h1 class="text-lg font-bold text-gray-900">Outpatient Outcome Report</h1>
				<div class="flex flex-wrap gap-2">
					{#if pdfError}
						<span class="text-sm text-red-600">{pdfError}</span>
					{/if}
					<button
						onclick={downloadPDF}
						class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
					>
						Download PDF
					</button>
					<button
						onclick={() => window.print()}
						class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
					>
						Print
					</button>
					<button
						onclick={startNew}
						class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
					>
						New Report
					</button>
				</div>
			</div>
		</header>

		<main class="mx-auto max-w-4xl px-4 py-6">
			<!-- Overall Grade Banner -->
			<div class="mb-6 rounded-xl border-2 p-6 text-center {gradeColor(result.overallGrade)}">
				<div class="text-5xl font-bold">{result.overallGrade || '—'}</div>
				<div class="mt-1 text-xl font-semibold">{gradeLabel(result.overallGrade)}</div>
				<div class="mt-2 text-sm opacity-75">
					OOCG Overall Grade — Generated {new Date(result.timestamp).toLocaleString()}
				</div>
			</div>

			<!-- Domain Grades -->
			<div class="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
				<h2 class="mb-4 text-lg font-bold text-gray-900">Domain Grades</h2>
				<div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
					{#each domains as dom}
						<div class="rounded-lg border p-4 text-center {gradeColor(result[dom.key])}">
							<div class="text-3xl font-bold">{result[dom.key] || '—'}</div>
							<div class="mt-1 text-sm font-medium">{dom.label}</div>
						</div>
					{/each}
				</div>
			</div>

			<!-- Flagged Issues -->
			{#if result.flaggedIssues.length > 0}
				<div class="mb-6 rounded-xl border border-red-200 bg-white p-6 shadow-sm">
					<h2 class="mb-4 text-lg font-bold text-red-800">Flagged Issues</h2>
					<div class="space-y-2">
						{#each result.flaggedIssues as flag}
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

			<!-- Fired Rules -->
			{#if result.firedRules.length > 0}
				<div class="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
					<h2 class="mb-4 text-lg font-bold text-gray-900">Grading Justification</h2>
					<table class="w-full text-sm">
						<thead>
							<tr class="border-b text-left text-gray-600">
								<th class="pb-2 pr-4">Rule</th>
								<th class="pb-2 pr-4">Domain</th>
								<th class="pb-2 pr-4">Finding</th>
								<th class="pb-2">Grade</th>
							</tr>
						</thead>
						<tbody>
							{#each result.firedRules as rule}
								<tr class="border-b border-gray-100">
									<td class="py-2 pr-4 font-mono text-xs text-gray-500">{rule.id}</td>
									<td class="py-2 pr-4">{rule.domain}</td>
									<td class="py-2 pr-4">{rule.description}</td>
									<td class="py-2">
										<span class="inline-flex h-7 w-7 items-center justify-center rounded-full border font-bold text-sm {gradeColor(rule.grade)}">
											{rule.grade}
										</span>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}

			<!-- Patient & Encounter Summary -->
			<div class="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
				<h2 class="mb-4 text-lg font-bold text-gray-900">Patient & Encounter Summary</h2>
				<dl class="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
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
						<dt class="font-medium text-gray-600">Clinician</dt>
						<dd>{data.encounterDetails.clinicianName || '—'}</dd>
					</div>
					<div>
						<dt class="font-medium text-gray-600">Modality</dt>
						<dd>{data.encounterDetails.modality || '—'}</dd>
					</div>
					<div>
						<dt class="font-medium text-gray-600">Outcome Classification</dt>
						<dd>{data.clinicalOutcome.outcomeClassification || '—'}</dd>
					</div>
					<div>
						<dt class="font-medium text-gray-600">FFT Response</dt>
						<dd>{data.premFft.fftResponse || '—'}</dd>
					</div>
					<div>
						<dt class="font-medium text-gray-600">Signed off by</dt>
						<dd>{data.signOff.reportingClinicianName || '—'} ({data.signOff.reportingClinicianRole || '—'})</dd>
					</div>
				</dl>
			</div>

			{#if data.premFft.fftComment}
				<div class="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
					<h2 class="mb-2 text-lg font-bold text-gray-900">FFT Comment</h2>
					<p class="text-sm text-gray-700">{data.premFft.fftComment}</p>
				</div>
			{/if}
		</main>
	</div>
{/if}
