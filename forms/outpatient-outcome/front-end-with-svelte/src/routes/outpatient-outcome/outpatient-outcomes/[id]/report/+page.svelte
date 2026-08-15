<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { gradeColor, gradeLabel, calculateAge } from '#lib/engine/utils.js';
	import Button from '#lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/outpatient-outcome/outpatient-outcomes/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/outpatient-outcomes/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `outpatient-outcome-${data.patientDetails.familyName || id}.pdf`;
				a.click();
				URL.revokeObjectURL(url);
			} else {
				pdfError = 'Failed to generate PDF. Please try again.';
			}
		} catch {
			pdfError = 'Failed to generate PDF. Please check your connection and try again.';
		}
	}

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

{#if result}
	<header class="border-b border-base-300 bg-base-100 shadow-sm no-print">
		<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
			<h1 class="text-lg font-bold text-base-content">Outpatient outcome report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/outpatient-outcome/outpatient-outcomes/${id}`)}>Edit</Button>
			</div>
		</div>
	</header>

	<main class="mx-16 px-4 py-6">
		<!-- Overall grade banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {gradeColor(result.overallGrade)}">
			<div class="text-5xl font-bold">{result.overallGrade || '—'}</div>
			<div class="mt-1 text-xl font-semibold">{gradeLabel(result.overallGrade)}</div>
			<div class="mt-2 text-sm opacity-75">
				OOCG Overall Grade — Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Domain grades -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6 shadow-sm">
			<h2 class="mb-4 text-lg font-bold text-base-content">Domain grades</h2>
			<div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
				{#each domains as dom (dom.key)}
					<div class="rounded-lg border p-4 text-center {gradeColor(result[dom.key])}">
						<div class="text-3xl font-bold">{result[dom.key] || '—'}</div>
						<div class="mt-1 text-sm font-medium">{dom.label}</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- Flagged issues -->
		{#if result.flaggedIssues.length > 0}
			<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6 shadow-sm">
				<h2 class="mb-4 text-lg font-bold text-error">Flagged issues</h2>
				<div class="space-y-2">
					{#each result.flaggedIssues as flag (flag.id)}
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

		<!-- Fired rules -->
		{#if result.firedRules.length > 0}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6 shadow-sm">
				<h2 class="mb-4 text-lg font-bold text-base-content">Grading justification</h2>
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b border-base-300 text-left text-base-content/70">
							<th class="pb-2 pr-4">Rule</th>
							<th class="pb-2 pr-4">Domain</th>
							<th class="pb-2 pr-4">Finding</th>
							<th class="pb-2">Grade</th>
						</tr>
					</thead>
					<tbody>
						{#each result.firedRules as rule (rule.id)}
							<tr class="border-b border-base-200">
								<td class="py-2 pr-4 font-mono text-xs text-base-content/60">{rule.id}</td>
								<td class="py-2 pr-4">{rule.domain}</td>
								<td class="py-2 pr-4">{rule.description}</td>
								<td class="py-2">
									<span class="inline-flex h-7 w-7 items-center justify-center rounded-full border text-sm font-bold {gradeColor(rule.grade)}">
										{rule.grade}
									</span>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}

		<!-- Patient & encounter summary -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6 shadow-sm">
			<h2 class="mb-4 text-lg font-bold text-base-content">Patient &amp; encounter summary</h2>
			<dl class="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
				<div>
					<dt class="font-medium text-base-content/70">Patient</dt>
					<dd>{data.patientDetails.givenName} {data.patientDetails.familyName}</dd>
				</div>
				<div>
					<dt class="font-medium text-base-content/70">Date of birth</dt>
					<dd>
						{data.patientDetails.dateOfBirth || '—'}
						{#if calculateAge(data.patientDetails.dateOfBirth)}(Age {calculateAge(data.patientDetails.dateOfBirth)}){/if}
					</dd>
				</div>
				<div>
					<dt class="font-medium text-base-content/70">NHS number</dt>
					<dd>{data.patientDetails.nhsNumber || '—'}</dd>
				</div>
				<div>
					<dt class="font-medium text-base-content/70">Clinic date</dt>
					<dd>{data.encounterDetails.clinicDate || '—'}</dd>
				</div>
				<div>
					<dt class="font-medium text-base-content/70">Specialty</dt>
					<dd>{data.encounterDetails.specialty || '—'}</dd>
				</div>
				<div>
					<dt class="font-medium text-base-content/70">Clinician</dt>
					<dd>{data.encounterDetails.clinicianName || '—'}</dd>
				</div>
				<div>
					<dt class="font-medium text-base-content/70">Modality</dt>
					<dd>{data.encounterDetails.modality || '—'}</dd>
				</div>
				<div>
					<dt class="font-medium text-base-content/70">Outcome classification</dt>
					<dd>{data.clinicalOutcome.outcomeClassification || '—'}</dd>
				</div>
				<div>
					<dt class="font-medium text-base-content/70">FFT response</dt>
					<dd>{data.premFft.fftResponse || '—'}</dd>
				</div>
				<div>
					<dt class="font-medium text-base-content/70">Signed off by</dt>
					<dd>{data.signOff.reportingClinicianName || '—'} ({data.signOff.reportingClinicianRole || '—'})</dd>
				</div>
			</dl>
		</div>

		{#if data.premFft.fftComment}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6 shadow-sm">
				<h2 class="mb-2 text-lg font-bold text-base-content">FFT comment</h2>
				<p class="text-sm text-base-content/80">{data.premFft.fftComment}</p>
			</div>
		{/if}
	</main>
{/if}
