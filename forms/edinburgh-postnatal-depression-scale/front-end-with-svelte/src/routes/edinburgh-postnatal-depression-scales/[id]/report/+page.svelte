<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { epdsItems } from '$lib/engine/epds-rules';
	import {
		bandLabel,
		bandColor,
		priorityLabel,
		priorityColor,
		itemScoreColor,
		careSettingLabel,
		clinicianRoleLabel,
		perinatalStageLabel,
		ageBandLabel,
		assistanceNeededLabel
	} from '$lib/engine/utils';
	import Button from '$lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/edinburgh-postnatal-depression-scales/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/edinburgh-postnatal-depression-scales/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `epds-assessment-${data.identification.respondentIdentifier || id}.pdf`;
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
			<h1 class="text-lg font-bold text-base-content">EPDS assessment report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button
					data-variant="secondary"
					onclick={() => goto(`/edinburgh-postnatal-depression-scales/${id}`)}>Edit</Button
				>
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-4xl px-4 py-6">
		<!-- Score banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {bandColor(result.band)}">
			<div class="text-3xl font-bold">EPDS {result.totalScore} of 30</div>
			<div class="mt-2 text-sm font-semibold">{bandLabel(result.band)}</div>
			<div class="mt-2 text-sm opacity-75">
				Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Self-harm safety notice -->
		{#if result.selfHarmFlag}
			<div class="mb-6 rounded-xl border-2 border-error bg-error/10 p-6">
				<h2 class="mb-2 text-lg font-bold text-error">Self-harm flag raised</h2>
				<p class="text-sm text-base-content/80">
					Item 10 (thoughts of self-harm) scored {result.item10Score} of 3. Any response other than
					"Never" is a mandatory red flag, regardless of the total score. Perform an immediate
					suicide / self-harm risk assessment and take appropriate safeguarding action.
				</p>
			</div>
		{/if}

		<!-- Recommended action -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-2 text-lg font-bold text-base-content">Recommended action</h2>
			{#if result.band === 'likely'}
				<p class="text-sm text-base-content/80">
					The total is at or above the specific threshold (&ge; 13) — <strong
						>likely depression</strong
					>. Arrange assessment by an appropriately qualified clinician and refer per the local
					perinatal mental-health pathway. This is a screen, not a diagnosis.
				</p>
			{:else if result.band === 'possible'}
				<p class="text-sm text-base-content/80">
					The total is at or above the sensitive threshold (&ge; 10) — <strong
						>possible depression</strong
					>. Arrange further assessment / clinical review and repeat the EPDS in 2-4 weeks, or refer
					per the local pathway.
				</p>
			{:else}
				<p class="text-sm text-base-content/80">
					The total is below the screening thresholds — <strong>lower likelihood</strong>. Continue
					routine support. Review item 10 in every case, regardless of the total.
				</p>
			{/if}
		</div>

		<!-- Item scores -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Item scores</h2>
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-base-300 text-left text-base-content/70">
						<th class="pb-2 pr-4">Item</th>
						<th class="pb-2 pr-4">Statement</th>
						<th class="pb-2">Score</th>
					</tr>
				</thead>
				<tbody>
					{#each epdsItems as item, i (item.number)}
						<tr class="border-b border-base-200">
							<td class="py-2 pr-4"
								>{item.number}{item.direction === 'reverse' ? ' (rev)' : ''}</td
							>
							<td class="py-2 pr-4">{item.statement}</td>
							<td class="py-2">
								<span
									class="rounded-full border px-2 py-0.5 text-xs font-bold {itemScoreColor(
										result.itemScores[i]
									)}">{result.itemScores[i]} / 3</span
								>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
			<p class="mt-3 text-sm text-base-content/70">
				Anxiety subscale (EPDS-3A: items 3, 4, 5): {result.anxietySubscale} of 9.
			</p>
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

		<!-- Respondent / context summary -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Assessment summary</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div>
					<span class="font-medium text-base-content/70">Respondent ID:</span>
					{data.identification.respondentIdentifier || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Age band:</span>
					{ageBandLabel(data.identification.ageBand) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Preferred language:</span>
					{data.identification.preferredLanguage || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Assistance:</span>
					{assistanceNeededLabel(data.identification.assistanceNeeded) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Care setting:</span>
					{careSettingLabel(data.context.careSetting) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Perinatal stage:</span>
					{perinatalStageLabel(data.context.perinatalStage) || 'N/A'}
					{#if data.context.perinatalWeek !== null}
						(week {data.context.perinatalWeek})
					{/if}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Clinician:</span>
					{data.context.clinicianName || 'N/A'}
					{#if clinicianRoleLabel(data.context.clinicianRole)}
						({clinicianRoleLabel(data.context.clinicianRole)})
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
