<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { zaritItems, activeItemNumbers, normalizeInstrumentForm } from '$lib/engine/zarit-rules';
	import {
		bandLabel,
		bandColor,
		priorityLabel,
		priorityColor,
		itemRatingColor,
		careSettingLabel,
		practitionerRoleLabel,
		instrumentFormLabel,
		carerRelationshipLabel,
		carerCoResidentLabel,
		recipientConditionLabel
	} from '$lib/engine/utils';
	import Button from '$lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);
	const instrumentForm = $derived(normalizeInstrumentForm(data));
	const activeSet = $derived(new Set(activeItemNumbers(instrumentForm)));

	$effect(() => {
		if (!assessment.result) {
			goto(`/zarit-burden-interview/zarit-burden-interviews/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/zarit-burden-interviews/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `zbi-assessment-${data.carer.carerIdentifier || id}.pdf`;
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
			<h1 class="text-lg font-bold text-base-content">ZBI assessment report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button
					data-variant="secondary"
					onclick={() => goto(`/zarit-burden-interview/zarit-burden-interviews/${id}`)}>Edit</Button
				>
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-4xl px-4 py-6">
		<!-- Score banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {bandColor(result.burdenBand)}">
			<div class="text-3xl font-bold">ZBI {result.totalScore} of {result.maxScore}</div>
			<div class="mt-2 text-sm font-semibold">
				{instrumentFormLabel(instrumentForm)} — {bandLabel(result.burdenBand)}
			</div>
			<div class="mt-2 text-sm opacity-75">
				Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Recommended action -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-2 text-lg font-bold text-base-content">Recommended action</h2>
			{#if result.burdenBand === 'severe' || result.burdenBand === 'high'}
				<p class="text-sm text-base-content/80">
					The total is in the <strong>severe / high-burden</strong> range. Arrange urgent carer
					support and respite; screen and refer for carer mental-health support; consider the risk to
					the caring arrangement. This is a screen, not a diagnosis.
				</p>
			{:else if result.burdenBand === 'moderate-to-severe'}
				<p class="text-sm text-base-content/80">
					The total is in the <strong>moderate-to-severe-burden</strong> range (41-60). Arrange a
					carer-support assessment and respite; screen for depression and anxiety; review the care
					package.
				</p>
			{:else if result.burdenBand === 'mild-to-moderate'}
				<p class="text-sm text-base-content/80">
					The total is in the <strong>mild-to-moderate-burden</strong> range (22-40). Offer carer
					information and support; signpost respite and peer support; plan a review.
				</p>
			{:else}
				<p class="text-sm text-base-content/80">
					The total is in the <strong>little-or-no-burden</strong> range. Reassure and review;
					re-administer if circumstances change. A low score does not mean no support is needed.
				</p>
			{/if}
		</div>

		<!-- Item ratings -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Item ratings</h2>
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-base-300 text-left text-base-content/70">
						<th class="pb-2 pr-4">Item</th>
						<th class="pb-2 pr-4">Statement</th>
						<th class="pb-2">Rating</th>
					</tr>
				</thead>
				<tbody>
					{#each zaritItems as item, i (item.number)}
						<tr class="border-b border-base-200">
							<td class="py-2 pr-4">
								{item.number}{activeSet.has(item.number) ? '' : ' (n/s)'}
							</td>
							<td class="py-2 pr-4">{item.statement}</td>
							<td class="py-2">
								{#if result.itemRatings[i] === null}
									<span class="text-base-content/60">—</span>
								{:else}
									<span
										class="rounded-full border px-2 py-0.5 text-xs font-bold {itemRatingColor(
											result.itemRatings[i] as number
										)}">{result.itemRatings[i]} / 4</span
									>
								{/if}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
			{#if instrumentForm === 'zbi12'}
				<p class="mt-3 text-sm text-base-content/70">
					Items marked (n/s) are not scored on the ZBI-12 short form.
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

		<!-- Carer / recipient summary -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Assessment summary</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div>
					<span class="font-medium text-base-content/70">Carer ID:</span>
					{data.carer.carerIdentifier || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Relationship:</span>
					{carerRelationshipLabel(data.carer.carerRelationship) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Co-resident:</span>
					{carerCoResidentLabel(data.carer.carerCoResident) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Care hours / week:</span>
					{data.carer.careHoursPerWeek === null ? 'N/A' : data.carer.careHoursPerWeek}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Recipient ID:</span>
					{data.recipient.recipientIdentifier || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Condition:</span>
					{recipientConditionLabel(data.recipient.recipientCondition) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Care setting:</span>
					{careSettingLabel(data.context.careSetting) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Instrument form:</span>
					{instrumentFormLabel(instrumentForm)}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Practitioner:</span>
					{data.context.practitionerName || 'N/A'}
					{#if practitionerRoleLabel(data.context.practitionerRole)}
						({practitionerRoleLabel(data.context.practitionerRole)})
					{/if}
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
