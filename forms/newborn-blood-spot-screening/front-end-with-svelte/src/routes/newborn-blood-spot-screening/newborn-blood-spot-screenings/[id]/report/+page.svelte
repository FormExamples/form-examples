<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import {
		outcomeLabel,
		outcomeColor,
		resultClassLabel,
		resultClassColor,
		referralStatusLabel,
		referralStatusColor,
		priorityLabel,
		priorityColor,
		sampleTakerRoleLabel,
		careSettingLabel,
		sexLabel
	} from '#lib/engine/utils.js';
	import Button from '#lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/newborn-blood-spot-screening/newborn-blood-spot-screenings/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/newborn-blood-spot-screenings/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `blood-spot-screening-${data.babyId.nhsNumber || id}.pdf`;
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
			<h1 class="text-lg font-bold text-base-content">Blood spot screening report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button
					data-variant="secondary"
					onclick={() => goto(`/newborn-blood-spot-screening/newborn-blood-spot-screenings/${id}`)}>Edit</Button
				>
			</div>
		</div>
	</header>

	<main class="mx-16 px-4 py-6">
		<!-- Outcome banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {outcomeColor(result.overallOutcome)}">
			<div class="text-3xl font-bold">{outcomeLabel(result.overallOutcome)}</div>
			<div class="mt-2 text-sm font-semibold">
				Referral status: {referralStatusLabel(result.referralStatus)}
				{#if result.ageAtSampleDays !== null}
					· age at sample: day {result.ageAtSampleDays}
				{/if}
			</div>
			<div class="mt-2 text-sm opacity-75">
				Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Interpretation -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-2 text-lg font-bold text-base-content">Interpretation</h2>
			{#if result.overallOutcome === 'referral-required'}
				<p class="text-sm text-base-content/80">
					One or more conditions are <strong>suspected</strong>: refer urgently to each named
					specialist service without waiting for the other results. A suspected screen is not a
					diagnosis — it identifies a baby who needs urgent diagnostic assessment.
				</p>
			{:else if result.overallOutcome === 'repeat-required'}
				<p class="text-sm text-base-content/80">
					A <strong>repeat sample</strong> is required to complete screening. Arrange the repeat
					within the day 5–8 window where possible.
				</p>
			{:else if result.overallOutcome === 'incomplete'}
				<p class="text-sm text-base-content/80">
					Screening is <strong>incomplete</strong>: one or more results are still outstanding.
					Follow up to obtain the outstanding results.
				</p>
			{:else if result.overallOutcome === 'declined-only-outstanding'}
				<p class="text-sm text-base-content/80">
					Screening is complete for the accepted conditions; one or more conditions were
					<strong>declined</strong>. Confirm the decline is documented and informed.
				</p>
			{:else}
				<p class="text-sm text-base-content/80">
					All screened conditions are <strong>not suspected</strong>. A negative screen reduces but
					does not eliminate the chance of a condition; inform the parents of the result.
				</p>
			{/if}
		</div>

		<!-- Condition results -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Condition results</h2>
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-base-300 text-left text-base-content/70">
						<th class="pb-2 pr-4">Condition</th>
						<th class="pb-2">Result</th>
					</tr>
				</thead>
				<tbody>
					{#each result.conditionResults as row (row.code)}
						<tr class="border-b border-base-200">
							<td class="py-2 pr-4">{row.label} ({row.short})</td>
							<td class="py-2">
								<span
									class="rounded-full border px-2 py-0.5 text-xs font-bold {resultClassColor(
										row.result
									)}">{resultClassLabel(row.result)}</span
								>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<!-- Urgent referrals -->
		{#if result.referrals.length > 0}
			<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-error">
					Urgent referrals ({result.referrals.length})
				</h2>
				<div class="space-y-2">
					{#each result.referrals as ref (ref.code)}
						<div
							class="flex items-start gap-3 rounded-lg border p-3 {referralStatusColor('urgent')}"
						>
							<span class="mt-0.5 rounded px-2 py-0.5 text-xs font-bold uppercase">Urgent</span>
							<div>{ref.service}</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Flagged issues -->
		{#if result.flaggedIssues.length > 0}
			<div class="mb-6 rounded-xl border border-warning/40 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">
					Flagged issues ({result.flaggedIssues.length})
				</h2>
				<div class="space-y-2">
					{#each result.flaggedIssues as flag (flag.id)}
						<div class="flex items-start gap-3 rounded-lg border p-3 {priorityColor(flag.priority)}">
							<span class="mt-0.5 rounded px-2 py-0.5 text-xs font-bold uppercase">
								{priorityLabel(flag.priority)}
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

		<!-- Baby / context summary -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Screening summary</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div>
					<span class="font-medium text-base-content/70">NHS number:</span>
					{data.babyId.nhsNumber || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Name:</span>
					{data.babyId.babyName || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Sex:</span>
					{sexLabel(data.babyId.sex) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Date of birth:</span>
					{data.babyId.dateOfBirth || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Sample-taker:</span>
					{data.sampleTaker.sampleTakerName || 'N/A'}
					{#if sampleTakerRoleLabel(data.sampleTaker.sampleTakerRole)}
						({sampleTakerRoleLabel(data.sampleTaker.sampleTakerRole)})
					{/if}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Care setting:</span>
					{careSettingLabel(data.sampleTaker.careSetting) || 'N/A'}
				</div>
			</div>
			{#if data.summary.clinicalContext}
				<div class="mt-4 text-sm">
					<span class="font-medium text-base-content/70">Clinical context:</span>
					<p class="mt-1 text-base-content/80">{data.summary.clinicalContext}</p>
				</div>
			{/if}
		</div>
	</main>
{/if}
