<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import {
		riskBandLabel,
		riskBandColor,
		priorityLabel,
		priorityColor,
		pointColor,
		careSettingLabel,
		clinicianRoleLabel,
		sexLabel,
		ageBandLabel
	} from '$lib/engine/utils';
	import Button from '$lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/quick-sequential-organ-failure-assessment/quick-sequential-organ-failure-assessments/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/quick-sequential-organ-failure-assessments/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `qsofa-assessment-${data.identification.patientIdentifier || id}.pdf`;
				a.click();
				URL.revokeObjectURL(url);
			} else {
				pdfError = 'Failed to generate PDF. Please try again.';
			}
		} catch {
			pdfError = 'Failed to generate PDF. Please check your connection and try again.';
		}
	}

	const mentationValue = $derived(
		data.mentation.glasgowComaScale !== null
			? `GCS ${data.mentation.glasgowComaScale}`
			: data.mentation.mentationAltered === 'yes'
				? 'Altered from baseline'
				: 'Not recorded'
	);
</script>

{#if result}
	<header class="border-b border-base-300 bg-base-100 shadow-sm no-print">
		<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
			<h1 class="text-lg font-bold text-base-content">qSOFA assessment report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button
					data-variant="secondary"
					onclick={() => goto(`/quick-sequential-organ-failure-assessment/quick-sequential-organ-failure-assessments/${id}`)}>Edit</Button
				>
			</div>
		</div>
	</header>

	<main class="mx-16 px-4 py-6">
		<!-- Score banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {riskBandColor(result.riskBand)}">
			<div class="text-3xl font-bold">qSOFA {result.qsofaScore} of 3</div>
			<div class="mt-2 text-sm font-semibold">{riskBandLabel(result.riskBand)}</div>
			<div class="mt-2 text-sm opacity-75">
				Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Recommended action -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-2 text-lg font-bold text-base-content">Recommended action</h2>
			{#if result.thresholdMet === 'yes'}
				<p class="text-sm text-base-content/80">
					This is a <strong>positive qSOFA screen</strong>. Consider possible sepsis or organ
					dysfunction: obtain senior / critical-care review, calculate a full SOFA score, and
					initiate a sepsis workup and management bundle per local policy.
				</p>
			{:else}
				<p class="text-sm text-base-content/80">
					This is a <strong>negative qSOFA screen</strong>. Continue standard monitoring and
					clinical assessment. A low score does not rule out sepsis — re-score if the patient
					deteriorates.
				</p>
			{/if}
		</div>

		<!-- Criteria -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Criteria</h2>
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-base-300 text-left text-base-content/70">
						<th class="pb-2 pr-4">Criterion</th>
						<th class="pb-2 pr-4">Value</th>
						<th class="pb-2">Point</th>
					</tr>
				</thead>
				<tbody>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4">Respiratory rate &ge; 22/min</td>
						<td class="py-2 pr-4"
							>{data.respiratory.respiratoryRate === null
								? 'Not recorded'
								: `${data.respiratory.respiratoryRate} breaths/min`}</td
						>
						<td class="py-2">
							<span
								class="rounded-full border px-2 py-0.5 text-xs font-bold {pointColor(
									result.respiratoryRatePoint
								)}">{result.respiratoryRatePoint}</span
							>
						</td>
					</tr>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4">Altered mentation (GCS &lt; 15)</td>
						<td class="py-2 pr-4">{mentationValue}</td>
						<td class="py-2">
							<span
								class="rounded-full border px-2 py-0.5 text-xs font-bold {pointColor(
									result.mentationPoint
								)}">{result.mentationPoint}</span
							>
						</td>
					</tr>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4">Systolic BP &le; 100 mmHg</td>
						<td class="py-2 pr-4"
							>{data.circulation.systolicBloodPressure === null
								? 'Not recorded'
								: `${data.circulation.systolicBloodPressure} mmHg`}</td
						>
						<td class="py-2">
							<span
								class="rounded-full border px-2 py-0.5 text-xs font-bold {pointColor(
									result.systolicBloodPressurePoint
								)}">{result.systolicBloodPressurePoint}</span
							>
						</td>
					</tr>
				</tbody>
			</table>
		</div>

		<!-- Flagged issues -->
		{#if result.flaggedIssues.length > 0}
			<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-error">
					Flagged issues ({result.flaggedIssues.length})
				</h2>
				<div class="space-y-2">
					{#each result.flaggedIssues as flag (flag.id)}
						<div class="flex items-start gap-3 rounded-lg border p-3 {priorityColor(flag.priority)}">
							<span
								class="mt-0.5 rounded px-2 py-0.5 text-xs font-bold uppercase {priorityColor(
									flag.priority
								)}"
							>
								{priorityLabel(flag.priority)}
							</span>
							<div>
								<span class="font-medium">{flag.category}:</span>
								{flag.description} — {flag.suggestedAction}
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Patient / context summary -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Assessment summary</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div>
					<span class="font-medium text-base-content/70">Patient ID:</span>
					{data.identification.patientIdentifier || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Age band:</span>
					{ageBandLabel(data.identification.ageBand) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Sex:</span>
					{sexLabel(data.identification.sex) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Care setting:</span>
					{careSettingLabel(data.context.careSetting) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Clinician:</span>
					{data.context.clinicianName || 'N/A'}
					{#if clinicianRoleLabel(data.context.clinicianRole)}
						({clinicianRoleLabel(data.context.clinicianRole)})
					{/if}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Suspected source:</span>
					{data.context.suspectedSource || 'N/A'}
				</div>
			</div>
			{#if data.note.clinicalNote}
				<div class="mt-4 text-sm">
					<span class="font-medium text-base-content/70">Clinical note:</span>
					<p class="mt-1 text-base-content/80">{data.note.clinicalNote}</p>
				</div>
			{/if}
		</div>
	</main>
{/if}
