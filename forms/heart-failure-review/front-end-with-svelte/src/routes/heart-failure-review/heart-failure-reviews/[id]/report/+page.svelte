<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import {
		functionalStatusLabel,
		functionalStatusColor,
		optimisationStatusLabel,
		optimisationStatusColor,
		reviewStatusLabel,
		reviewStatusColor,
		priorityLabel,
		priorityColor,
		documentedColor,
		pillarStatusLabel,
		clinicianRoleLabel,
		careSettingLabel,
		heartFailureTypeLabel,
		sexLabel,
		ageBandLabel
	} from '$lib/engine/utils';
	import Button from '$lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/heart-failure-review/heart-failure-reviews/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/heart-failure-reviews/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `heart-failure-review-${data.identification.patientIdentifier || id}.pdf`;
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
		result ? result.domainStatuses.filter((d) => d.documented).length : 0
	);
	const optimisationDetail = $derived(
		result
			? result.medicationOptimisation.status === 'not-applicable'
				? 'no indicated pillar set for this heart-failure type'
				: `${result.medicationOptimisation.prescribedPillars} of ${result.medicationOptimisation.indicatedPillars} indicated pillars prescribed`
			: ''
	);
</script>

{#if result}
	<header class="border-b border-base-300 bg-base-100 shadow-sm no-print">
		<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
			<h1 class="text-lg font-bold text-base-content">Heart-failure review report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/heart-failure-review/heart-failure-reviews/${id}`)}>
					Edit
				</Button>
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-4xl px-4 py-6">
		<!-- Status banners -->
		<div class="mb-6 grid gap-4 sm:grid-cols-3">
			<div class="rounded-xl border-2 p-6 text-center {functionalStatusColor(result.functionalStatus)}">
				<div class="text-sm font-semibold uppercase tracking-wide">NYHA functional status</div>
				<div class="mt-2 text-2xl font-bold">{functionalStatusLabel(result.functionalStatus)}</div>
			</div>
			<div
				class="rounded-xl border-2 p-6 text-center {optimisationStatusColor(
					result.medicationOptimisation.status
				)}"
			>
				<div class="text-sm font-semibold uppercase tracking-wide">Medication optimisation</div>
				<div class="mt-2 text-2xl font-bold">
					{optimisationStatusLabel(result.medicationOptimisation.status)}
				</div>
				<div class="mt-1 text-xs font-semibold">{optimisationDetail}</div>
			</div>
			<div class="rounded-xl border-2 p-6 text-center {reviewStatusColor(result.reviewStatus)}">
				<div class="text-sm font-semibold uppercase tracking-wide">Review completeness</div>
				<div class="mt-2 text-2xl font-bold">{reviewStatusLabel(result.reviewStatus)}</div>
				<div class="mt-1 text-xs font-semibold">
					{documentedCount} of {result.domainStatuses.length} domains ({result.completenessScore}%)
				</div>
			</div>
		</div>

		<div class="mb-6 text-center text-sm text-base-content/60">
			Generated {new Date(result.timestamp).toLocaleString()}
		</div>

		<!-- Interpretation -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-2 text-lg font-bold text-base-content">Interpretation</h2>
			<p class="text-sm text-base-content/80">
				The NYHA functional status is <strong>{functionalStatusLabel(result.functionalStatus)}</strong>,
				derived from the recorded NYHA class. Medication optimisation is
				<strong>{optimisationStatusLabel(result.medicationOptimisation.status)}</strong>
				({optimisationDetail}).
				{#if result.reviewStatus === 'complete'}
					All required review domains are documented — the review is <strong>complete</strong>.
				{:else}
					{result.domainStatuses.length - documentedCount} of {result.domainStatuses.length} required
					domains are undocumented — the review is <strong>{reviewStatusLabel(result.reviewStatus)}</strong>.
				{/if}
				This is a documentation and status-classification report, not a diagnosis or a prescribing
				instrument.
			</p>
		</div>

		<!-- Four-pillar therapy -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Four-pillar medical therapy</h2>
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-base-300 text-left text-base-content/70">
						<th class="pb-2 pr-4">Pillar</th>
						<th class="pb-2 pr-4">Indicated</th>
						<th class="pb-2">Status</th>
					</tr>
				</thead>
				<tbody>
					{#each result.medicationOptimisation.pillars as p (p.key)}
						<tr class="border-b border-base-200">
							<td class="py-2 pr-4">{p.label}</td>
							<td class="py-2 pr-4">{p.indicated ? 'Yes' : 'No'}</td>
							<td class="py-2 font-semibold">{pillarStatusLabel(p.status)}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<!-- Domain documentation -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Review domain documentation</h2>
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-base-300 text-left text-base-content/70">
						<th class="pb-2 pr-4">Domain</th>
						<th class="pb-2">Documented</th>
					</tr>
				</thead>
				<tbody>
					{#each result.domainStatuses as d (d.domain)}
						<tr class="border-b border-base-200">
							<td class="py-2 pr-4">{d.label}</td>
							<td class="py-2">
								<span
									class="rounded-full border px-2 py-0.5 text-xs font-bold {documentedColor(
										d.documented
									)}">{d.documented ? 'Documented' : 'Outstanding'}</span
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
					<span class="font-medium text-base-content/70">HF type:</span>
					{heartFailureTypeLabel(data.diagnosis.heartFailureType) || 'N/A'}
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
					<span class="font-medium text-base-content/70">Review date:</span>
					{data.context.reviewDate || 'N/A'}
				</div>
			</div>
			{#if data.summary.reviewContext}
				<div class="mt-4 text-sm">
					<span class="font-medium text-base-content/70">Clinical note:</span>
					<p class="mt-1 text-base-content/80">{data.summary.reviewContext}</p>
				</div>
			{/if}
		</div>
	</main>
{/if}
