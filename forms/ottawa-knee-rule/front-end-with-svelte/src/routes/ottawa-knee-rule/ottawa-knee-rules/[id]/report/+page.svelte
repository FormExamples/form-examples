<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import {
		decisionLabel,
		decisionColor,
		priorityLabel,
		priorityColor,
		criterionColor,
		careSettingLabel,
		clinicianRoleLabel,
		injuryMechanismLabel,
		sexLabel,
		injuredSideLabel,
		yesNoLabel
	} from '$lib/engine/utils';
	import Button from '$lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/ottawa-knee-rule/ottawa-knee-rules/${id}`);
		}
	});

	let pdfError = $state('');

	// The five criterion rows, in wizard order, built in the script so no raw
	// comparison operators appear in template text.
	const criteriaRows = $derived(
		result
			? [
					{
						key: 'age',
						label: 'Age 55 years or older',
						finding: data.age.ageYears != null ? `${data.age.ageYears} years` : 'Not recorded',
						present: result.ageCriterion
					},
					{
						key: 'isolated-patellar',
						label: 'Isolated patellar tenderness',
						finding: `Patellar ${yesNoLabel(data.tenderness.patellarTenderness)} / other bony ${yesNoLabel(data.tenderness.otherBonyTenderness)}`,
						present: result.isolatedPatellarCriterion
					},
					{
						key: 'fibular-head',
						label: 'Fibular head tenderness',
						finding: yesNoLabel(data.tenderness.fibularHeadTenderness),
						present: result.fibularHeadCriterion
					},
					{
						key: 'flexion',
						label: 'Unable to flex the knee to 90 degrees',
						finding: yesNoLabel(data.flexion.unableToFlex90),
						present: result.flexionCriterion
					},
					{
						key: 'weight-bearing',
						label: 'Unable to bear weight (four steps)',
						finding: yesNoLabel(data.weightBearing.unableToBearWeight),
						present: result.weightBearingCriterion
					}
				]
			: []
	);

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/ottawa-knee-rules/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `ottawa-knee-rule-assessment-${data.identification.patientIdentifier || id}.pdf`;
				a.click();
				URL.revokeObjectURL(url);
			} else {
				pdfError = 'Failed to generate PDF. Please try again.';
			}
		} catch {
			pdfError = 'Failed to generate PDF. Please check your connection and try again.';
		}
	}
</script>

{#if result}
	<header class="border-b border-base-300 bg-base-100 shadow-sm no-print">
		<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
			<h1 class="text-lg font-bold text-base-content">Ottawa Knee Rule assessment report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/ottawa-knee-rule/ottawa-knee-rules/${id}`)}
					>Edit</Button
				>
			</div>
		</div>
	</header>

	<main class="mx-16 px-4 py-6">
		<!-- Decision banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {decisionColor(result.decision)}">
			<div class="text-3xl font-bold">{decisionLabel(result.decision)}</div>
			<div class="mt-2 text-sm font-semibold">
				{#if result.xrayIndicated}
					One or more Ottawa Knee Rule criteria are present (ANY-of).
				{:else}
					All five Ottawa Knee Rule criteria are absent.
				{/if}
			</div>
			<div class="mt-2 text-sm opacity-75">
				Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Recommended action -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-2 text-lg font-bold text-base-content">Recommended action</h2>
			{#if result.xrayIndicated}
				<p class="text-sm text-base-content/80">
					<strong>X-ray indicated.</strong> Obtain a knee radiograph series per local protocol and
					manage findings accordingly.
				</p>
			{:else}
				<p class="text-sm text-base-content/80">
					<strong>X-ray not indicated.</strong> A knee radiograph is not required. Provide
					symptomatic treatment, safety-netting, and follow-up advice; re-assess if symptoms fail to
					settle. The rule assesses the need for imaging and does not exclude a fracture on its own.
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
						<th class="pb-2 pr-4">Finding</th>
						<th class="pb-2">State</th>
					</tr>
				</thead>
				<tbody>
					{#each criteriaRows as row (row.key)}
						<tr class="border-b border-base-200">
							<td class="py-2 pr-4">{row.label}</td>
							<td class="py-2 pr-4">{row.finding}</td>
							<td class="py-2">
								<span
									class="rounded-full border px-2 py-0.5 text-xs font-bold {criterionColor(row.present)}"
									>{row.present ? 'Present' : 'Absent'}</span
								>
							</td>
						</tr>
					{/each}
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
					<span class="font-medium text-base-content/70">Sex:</span>
					{sexLabel(data.identification.sex) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Injured side:</span>
					{injuredSideLabel(data.identification.injuredSide) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Injury mechanism:</span>
					{injuryMechanismLabel(data.context.injuryMechanism) || 'N/A'}
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
			</div>
			{#if data.note.clinicalNotes}
				<div class="mt-4 text-sm">
					<span class="font-medium text-base-content/70">Clinical note:</span>
					<p class="mt-1 text-base-content/80">{data.note.clinicalNotes}</p>
				</div>
			{/if}
		</div>
	</main>
{/if}
