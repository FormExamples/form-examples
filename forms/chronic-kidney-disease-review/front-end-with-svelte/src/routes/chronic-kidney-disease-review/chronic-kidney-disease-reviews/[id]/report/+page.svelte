<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import {
		gfrCategoryLabel,
		gfrCategoryColor,
		albuminuriaCategoryLabel,
		albuminuriaCategoryColor,
		kdigoRiskZoneLabel,
		kdigoRiskZoneColor,
		reviewStatusLabel,
		reviewStatusColor,
		priorityLabel,
		priorityColor,
		documentedColor,
		clinicianRoleLabel,
		careSettingLabel,
		sexLabel,
		ageBandLabel,
		diabetesStatusLabel,
		primaryCauseLabel,
		referralDecisionLabel
	} from '$lib/engine/utils';
	import Button from '$lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/chronic-kidney-disease-review/chronic-kidney-disease-reviews/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/chronic-kidney-disease-reviews/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `chronic-kidney-disease-review-${data.patient.patientIdentifier || id}.pdf`;
				a.click();
				URL.revokeObjectURL(url);
			} else {
				pdfError = 'Failed to generate PDF. Please try again.';
			}
		} catch {
			pdfError = 'Failed to generate PDF. Please check your connection and try again.';
		}
	}

	const documentedCount = $derived(
		result ? result.componentStatuses.filter((c) => c.documented).length : 0
	);
	const bpNote = $derived(
		result === null || result.bloodPressureAtTarget === null
			? 'blood pressure not recorded'
			: result.bloodPressureAtTarget
				? 'recorded blood pressure at target'
				: 'recorded blood pressure above target'
	);
</script>

{#if result}
	<header class="border-b border-base-300 bg-base-100 shadow-sm no-print">
		<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
			<h1 class="text-lg font-bold text-base-content">Chronic kidney disease review report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button
					data-variant="secondary"
					onclick={() => goto(`/chronic-kidney-disease-review/chronic-kidney-disease-reviews/${id}`)}>Edit</Button
				>
			</div>
		</div>
	</header>

	<main class="mx-16 px-4 py-6">
		<!-- KDIGO risk zone + completeness banner -->
		<div class="mb-6 grid gap-4 sm:grid-cols-2">
			<div class="rounded-xl border-2 p-6 text-center {kdigoRiskZoneColor(result.kdigoRiskZone)}">
				<div class="text-3xl font-bold">
					KDIGO {kdigoRiskZoneLabel(result.kdigoRiskZone)}
				</div>
				<div class="mt-2 text-sm font-semibold">
					G-stage {gfrCategoryLabel(result.gfrCategory)} · A-stage {albuminuriaCategoryLabel(
						result.albuminuriaCategory
					)}
				</div>
			</div>
			<div class="rounded-xl border-2 p-6 text-center {reviewStatusColor(result.reviewStatus)}">
				<div class="text-3xl font-bold">Review: {reviewStatusLabel(result.reviewStatus)}</div>
				<div class="mt-2 text-sm font-semibold">
					{documentedCount} of {result.componentStatuses.length} bundle items documented
				</div>
			</div>
		</div>

		<div class="mb-6 flex flex-wrap items-center justify-center gap-3 text-sm">
			<span class="rounded-full border px-3 py-1 font-bold {gfrCategoryColor(result.gfrCategory)}"
				>{gfrCategoryLabel(result.gfrCategory)}</span
			>
			<span
				class="rounded-full border px-3 py-1 font-bold {albuminuriaCategoryColor(
					result.albuminuriaCategory
				)}">{albuminuriaCategoryLabel(result.albuminuriaCategory)}</span
			>
			<span class="text-base-content/60"
				>Generated {new Date(result.timestamp).toLocaleString()}</span
			>
		</div>

		<!-- Blood-pressure target -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-2 text-lg font-bold text-base-content">Blood-pressure target</h2>
			<p class="text-sm text-base-content/80">
				{#if result.bloodPressureTarget}
					Target
					<strong
						>{result.bloodPressureTarget.systolic}/{result.bloodPressureTarget.diastolic}</strong
					>
					mmHg — {bpNote}.
				{:else}
					No blood-pressure target derived.
				{/if}
			</p>
		</div>

		<!-- Interpretation -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-2 text-lg font-bold text-base-content">Interpretation</h2>
			<p class="text-sm text-base-content/80">
				{#if result.kdigoRiskZone === null}
					KDIGO staging could not be completed — the eGFR and/or urine ACR is missing. Record both to
					determine the risk zone.
				{:else if result.kdigoRiskZone === 'very-high'}
					The KDIGO risk zone is <strong>very high</strong>. Consider or arrange nephrology referral
					and increase monitoring frequency per NICE NG203.
				{:else if result.kdigoRiskZone === 'high'}
					The KDIGO risk zone is <strong>high</strong>. Optimise management and monitor more
					frequently per NICE NG203.
				{:else if result.kdigoRiskZone === 'moderate'}
					The KDIGO risk zone is <strong>moderate</strong>. Continue structured annual review and
					risk-factor management.
				{:else}
					The KDIGO risk zone is <strong>low</strong>. Continue routine annual review.
				{/if}
				{#if result.reviewStatus === 'complete'}
					All {result.componentStatuses.length} review bundle items are recorded.
				{:else if result.reviewStatus === 'incomplete'}
					The review is <strong>incomplete</strong> — core bundle items are missing.
				{:else}
					{result.componentStatuses.length - documentedCount} review bundle item(s) remain
					<strong>outstanding</strong>.
				{/if}
			</p>
		</div>

		<!-- Review completeness -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Review completeness</h2>
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-base-300 text-left text-base-content/70">
						<th class="pb-2 pr-4">Component</th>
						<th class="pb-2">Status</th>
					</tr>
				</thead>
				<tbody>
					{#each result.componentStatuses as c (c.component)}
						<tr class="border-b border-base-200">
							<td class="py-2 pr-4">{c.label}</td>
							<td class="py-2">
								<span
									class="rounded-full border px-2 py-0.5 text-xs font-bold {documentedColor(
										c.documented
									)}">{c.documented ? 'Recorded' : 'Outstanding'}</span
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
			<h2 class="mb-4 text-lg font-bold text-base-content">Review summary</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div>
					<span class="font-medium text-base-content/70">Patient ID:</span>
					{data.patient.patientIdentifier || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Age band:</span>
					{ageBandLabel(data.patient.ageBand) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Sex:</span>
					{sexLabel(data.patient.sex) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Diabetes:</span>
					{diabetesStatusLabel(data.patient.diabetesStatus) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Primary cause:</span>
					{primaryCauseLabel(data.patient.primaryCause) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Referral decision:</span>
					{referralDecisionLabel(data.summary.referralDecision) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Clinician:</span>
					{data.context.clinicianName || 'N/A'}
					{#if clinicianRoleLabel(data.context.clinicianRole)}
						({clinicianRoleLabel(data.context.clinicianRole)})
					{/if}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Care setting:</span>
					{careSettingLabel(data.context.careSetting) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Date of review:</span>
					{data.context.reviewedAt || 'N/A'}
				</div>
			</div>
			{#if data.summary.clinicalNote}
				<div class="mt-4 text-sm">
					<span class="font-medium text-base-content/70">Clinician note and plan:</span>
					<p class="mt-1 text-base-content/80">{data.summary.clinicalNote}</p>
				</div>
			{/if}
		</div>
	</main>
{/if}
