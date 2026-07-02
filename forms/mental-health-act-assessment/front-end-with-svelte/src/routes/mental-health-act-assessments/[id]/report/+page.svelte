<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import {
		completenessStatusLabel,
		completenessStatusColor,
		sectionClassLabel,
		urgencyLabel,
		urgencyColor,
		criterionLabel,
		criterionColor,
		priorityLabel,
		priorityColor,
		locationLabel,
		ageBandLabel,
		sexLabel,
		imminenceLabel,
		outcomeLabel,
		conveyanceLabel
	} from '$lib/engine/utils';
	import Button from '$lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/mental-health-act-assessments/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/mental-health-act-assessments/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `mha-assessment-${data.identification.personIdentifier || id}.pdf`;
				a.click();
				URL.revokeObjectURL(url);
			} else {
				pdfError = 'Failed to generate PDF. Please try again.';
			}
		} catch {
			pdfError = 'Failed to generate PDF. Please check your connection and try again.';
		}
	}

	const signatoriesPresent = $derived(
		result ? result.requiredSignatories.filter((s) => s.present).length : 0
	);
	const signatoriesTotal = $derived(result ? result.requiredSignatories.length : 0);
</script>

{#if result}
	<header class="border-b border-base-300 bg-base-100 shadow-sm no-print">
		<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
			<h1 class="text-lg font-bold text-base-content">MHA assessment report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button
					data-variant="secondary"
					onclick={() => goto(`/mental-health-act-assessments/${id}`)}>Edit</Button
				>
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-4xl px-4 py-6">
		<!-- Classification banner -->
		<div class="mb-6 rounded-xl border-2 border-primary bg-base-100 p-6 text-center">
			<div class="text-2xl font-bold text-base-content">
				{sectionClassLabel(result.recommendedSectionClass)}
			</div>
			<div class="mt-3 flex flex-wrap items-center justify-center gap-3">
				<span
					class="inline-block rounded-full border px-3 py-1 text-sm font-bold {completenessStatusColor(
						result.completenessStatus
					)}"
				>
					Documentation: {completenessStatusLabel(result.completenessStatus)}
				</span>
				<span
					class="inline-block rounded-full border px-3 py-1 text-sm font-bold {urgencyColor(
						result.urgencyClass
					)}"
				>
					Urgency: {urgencyLabel(result.urgencyClass)}
				</span>
			</div>
			<div class="mt-2 text-sm text-base-content/70">
				Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Interpretation -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-2 text-lg font-bold text-base-content">Interpretation</h2>
			{#if result.completenessStatus === 'valid'}
				<p class="text-sm text-base-content/80">
					The documentation required by the recommended section is <strong>complete</strong>: all
					{signatoriesTotal} required signatories are recorded and every applicable statutory
					criterion is met with evidence. This is a documentation and validation result only — the
					decision to make an application and detain rests with the professionals, and the prescribed
					statutory forms remain the definitive legal record.
				</p>
			{:else}
				<p class="text-sm text-base-content/80">
					The documentation is <strong>incomplete</strong>: {signatoriesPresent} of {signatoriesTotal}
					required signatories are recorded, and one or more applicable criteria are not yet met with
					evidence. Complete the outstanding items before an application is made. This tool validates
					documentation and classifies only — it makes no automated decision to detain.
				</p>
			{/if}
		</div>

		<!-- Required signatories -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">
				Required signatories ({signatoriesPresent} of {signatoriesTotal})
			</h2>
			{#if result.requiredSignatories.length > 0}
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b border-base-300 text-left text-base-content/70">
							<th class="pb-2 pr-4">Signatory</th>
							<th class="pb-2">Present</th>
						</tr>
					</thead>
					<tbody>
						{#each result.requiredSignatories as s (s.role)}
							<tr class="border-b border-base-200">
								<td class="py-2 pr-4">{s.label}</td>
								<td class="py-2">
									<span
										class="rounded-full border px-2 py-0.5 text-xs font-bold {criterionColor(
											s.present
										)}">{s.present ? 'Yes' : 'No'}</span
									>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			{:else}
				<p class="text-sm text-base-content/70">
					No statutory signatories are required for this outcome.
				</p>
			{/if}
		</div>

		<!-- Statutory criteria -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Statutory criteria</h2>
			{#if result.criteriaSummary.length > 0}
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b border-base-300 text-left text-base-content/70">
							<th class="pb-2 pr-4">Criterion</th>
							<th class="pb-2 pr-4">Status</th>
							<th class="pb-2">Evidence</th>
						</tr>
					</thead>
					<tbody>
						{#each result.criteriaSummary as c (c.criterion)}
							<tr class="border-b border-base-200">
								<td class="py-2 pr-4">{c.label}</td>
								<td class="py-2 pr-4">
									<span
										class="rounded-full border px-2 py-0.5 text-xs font-bold {criterionColor(
											c.status === 'met' ? true : c.status === '' ? null : false
										)}">{criterionLabel(c.status)}</span
									>
								</td>
								<td class="py-2">{c.evidencePresent ? 'Recorded' : 'Missing'}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			{:else}
				<p class="text-sm text-base-content/70">
					No statutory criteria are required for this outcome.
				</p>
			{/if}
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

		<!-- Assessment summary -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Assessment summary</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div>
					<span class="font-medium text-base-content/70">Person ID:</span>
					{data.identification.personIdentifier || 'N/A'}
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
					<span class="font-medium text-base-content/70">Location:</span>
					{locationLabel(data.context.location) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">AMHP:</span>
					{data.professionals.amhpName || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Risk imminence:</span>
					{imminenceLabel(data.risk.riskImminence) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Outcome:</span>
					{outcomeLabel(data.recommendation.outcome) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Conveyance:</span>
					{conveyanceLabel(data.recommendation.conveyance) || 'N/A'}
				</div>
			</div>
			{#if data.recommendation.clinicalLegalNote}
				<div class="mt-4 text-sm">
					<span class="font-medium text-base-content/70">Clinical and legal note:</span>
					<p class="mt-1 text-base-content/80">{data.recommendation.clinicalLegalNote}</p>
				</div>
			{/if}
		</div>
	</main>
{/if}
