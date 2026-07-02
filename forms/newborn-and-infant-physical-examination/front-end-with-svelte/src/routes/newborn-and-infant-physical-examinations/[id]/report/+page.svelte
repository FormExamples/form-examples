<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import {
		outcomeLabel,
		outcomeColor,
		componentResultLabel,
		componentResultColor,
		componentLabel,
		priorityLabel,
		priorityColor,
		urgencyLabel,
		urgencyColor,
		practitionerRoleLabel,
		careSettingLabel,
		examinationContextLabel,
		sexLabel
	} from '$lib/engine/utils';
	import Button from '$lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/newborn-and-infant-physical-examinations/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/newborn-and-infant-physical-examinations/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `nipe-examination-${data.identification.babyIdentifier || id}.pdf`;
				a.click();
				URL.revokeObjectURL(url);
			} else {
				pdfError = 'Failed to generate PDF. Please try again.';
			}
		} catch {
			pdfError = 'Failed to generate PDF. Please check your connection and try again.';
		}
	}

	const componentRows = $derived(
		result
			? [
					{ key: 'eyes', label: 'Eyes', result: result.eyesResult },
					{ key: 'heart', label: 'Heart', result: result.heartResult },
					{ key: 'hips', label: 'Hips', result: result.hipsResult },
					{ key: 'testes', label: 'Testes', result: result.testesResult }
				]
			: []
	);
</script>

{#if result}
	<header class="border-b border-base-300 bg-base-100 shadow-sm no-print">
		<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
			<h1 class="text-lg font-bold text-base-content">NIPE screening report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button
					data-variant="secondary"
					onclick={() => goto(`/newborn-and-infant-physical-examinations/${id}`)}>Edit</Button
				>
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-4xl px-4 py-6">
		<!-- Outcome banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {outcomeColor(result.overallOutcome)}">
			<div class="text-3xl font-bold">{outcomeLabel(result.overallOutcome)}</div>
			<div class="mt-2 text-sm font-semibold">
				Completeness {result.completenessPercent}% · {result.completeness}
			</div>
			<div class="mt-2 text-sm opacity-75">
				Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Interpretation -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-2 text-lg font-bold text-base-content">Interpretation</h2>
			{#if result.overallOutcome === 'refer'}
				<p class="text-sm text-base-content/80">
					This screen is a <strong>Refer</strong>: one or more key components require onward
					referral. Action every referral pathway below within its stated timeframe. A screening
					classification is not a diagnosis.
				</p>
			{:else if result.overallOutcome === 'incomplete'}
				<p class="text-sm text-base-content/80">
					This screen is <strong>Incomplete</strong>: one or more applicable key components were not
					examined. Complete or re-attempt the outstanding component(s) to finish the screen.
				</p>
			{:else}
				<p class="text-sm text-base-content/80">
					This screen is <strong>Satisfactory</strong>: all applicable key components were examined
					and within normal limits. A satisfactory screen is not a guarantee of health; safety-net
					and re-examine at the 6-8 week review as scheduled.
				</p>
			{/if}
		</div>

		<!-- Key components -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Key components</h2>
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-base-300 text-left text-base-content/70">
						<th class="pb-2 pr-4">Component</th>
						<th class="pb-2">Result</th>
					</tr>
				</thead>
				<tbody>
					{#each componentRows as row (row.key)}
						<tr class="border-b border-base-200">
							<td class="py-2 pr-4">{row.label}</td>
							<td class="py-2">
								<span
									class="rounded-full border px-2 py-0.5 text-xs font-bold {componentResultColor(
										row.result
									)}">{componentResultLabel(row.result)}</span
								>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<!-- Referral pathways -->
		{#if result.referrals.length > 0}
			<div class="mb-6 rounded-xl border border-warning/40 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">
					Referral pathways ({result.referrals.length})
				</h2>
				<div class="space-y-2">
					{#each result.referrals as ref (ref.component)}
						<div class="flex items-start gap-3 rounded-lg border p-3 {urgencyColor(ref.urgency)}">
							<span
								class="mt-0.5 rounded px-2 py-0.5 text-xs font-bold uppercase {urgencyColor(
									ref.urgency
								)}"
							>
								{urgencyLabel(ref.urgency)}
							</span>
							<div>
								<span class="font-medium">{componentLabel(ref.component)}:</span>
								{ref.pathway}
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

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

		<!-- Baby / context summary -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Examination summary</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div>
					<span class="font-medium text-base-content/70">Baby ID:</span>
					{data.identification.babyIdentifier || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Name:</span>
					{data.identification.babyName || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Sex:</span>
					{sexLabel(data.identification.sex) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Context:</span>
					{examinationContextLabel(data.context.examinationContext) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Practitioner:</span>
					{data.context.practitionerName || 'N/A'}
					{#if practitionerRoleLabel(data.context.practitionerRole)}
						({practitionerRoleLabel(data.context.practitionerRole)})
					{/if}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Care setting:</span>
					{careSettingLabel(data.context.careSetting) || 'N/A'}
				</div>
			</div>
			{#if data.summary.clinicalNote}
				<div class="mt-4 text-sm">
					<span class="font-medium text-base-content/70">Clinical note:</span>
					<p class="mt-1 text-base-content/80">{data.summary.clinicalNote}</p>
				</div>
			{/if}
		</div>
	</main>
{/if}
