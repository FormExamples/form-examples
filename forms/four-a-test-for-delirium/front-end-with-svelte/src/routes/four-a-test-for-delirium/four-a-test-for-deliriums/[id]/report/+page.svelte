<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import {
		interpretationBandLabel,
		interpretationBandColor,
		priorityLabel,
		priorityColor,
		pointColor,
		settingLabel,
		alertnessLabel,
		amt4Label,
		attentionLabel,
		acuteChangeLabel,
		acuteChangeSourceLabel
	} from '$lib/engine/utils';
	import Button from '$lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/four-a-test-for-delirium/four-a-test-for-deliriums/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/four-a-test-for-deliriums/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `4at-assessment-${data.identification.patientIdentifier || id}.pdf`;
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
			<h1 class="text-lg font-bold text-base-content">4AT delirium screen report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button
					data-variant="secondary"
					onclick={() => goto(`/four-a-test-for-delirium/four-a-test-for-deliriums/${id}`)}>Edit</Button
				>
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-4xl px-4 py-6">
		<!-- Score banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {interpretationBandColor(result.interpretationBand)}">
			<div class="text-3xl font-bold">4AT {result.totalScore} of 12</div>
			<div class="mt-2 text-sm font-semibold">{interpretationBandLabel(result.interpretationBand)}</div>
			<div class="mt-2 text-sm opacity-75">
				Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Recommended action -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-2 text-lg font-bold text-base-content">Recommended action</h2>
			{#if result.interpretationBand === 'possibleDelirium'}
				<p class="text-sm text-base-content/80">
					A score of 4 or more indicates <strong>possible delirium</strong>, with or without
					cognitive impairment. Undertake a full clinical assessment against DSM-5 / ICD-10 delirium
					criteria, search for precipitants, and instigate delirium management per local policy.
				</p>
			{:else if result.interpretationBand === 'possibleCognitiveImpairment'}
				<p class="text-sm text-base-content/80">
					A score of 1 to 3 indicates <strong>possible cognitive impairment</strong>. Arrange
					further cognitive assessment and obtain a collateral history to distinguish delirium from
					established cognitive impairment.
				</p>
			{:else}
				<p class="text-sm text-base-content/80">
					A score of 0 means <strong>delirium or severe cognitive impairment is unlikely</strong>. A
					score of 0 does not exclude delirium if the acute-change information (item 4) could not be
					reliably obtained.
				</p>
			{/if}
		</div>

		<!-- Items -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Items</h2>
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-base-300 text-left text-base-content/70">
						<th class="pb-2 pr-4">Item</th>
						<th class="pb-2 pr-4">Response</th>
						<th class="pb-2">Score</th>
					</tr>
				</thead>
				<tbody>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4">1. Alertness</td>
						<td class="py-2 pr-4">{alertnessLabel(data.item1.alertness) || 'Not recorded'}</td>
						<td class="py-2">
							<span class="rounded-full border px-2 py-0.5 text-xs font-bold {pointColor(result.item1Score)}"
								>{result.item1Score} / 4</span
							>
						</td>
					</tr>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4">2. AMT4</td>
						<td class="py-2 pr-4">{amt4Label(data.item2.amt4) || 'Not recorded'}</td>
						<td class="py-2">
							<span class="rounded-full border px-2 py-0.5 text-xs font-bold {pointColor(result.item2Score)}"
								>{result.item2Score} / 2</span
							>
						</td>
					</tr>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4">3. Attention (months backwards)</td>
						<td class="py-2 pr-4">{attentionLabel(data.item3.attentionMonths) || 'Not recorded'}</td>
						<td class="py-2">
							<span class="rounded-full border px-2 py-0.5 text-xs font-bold {pointColor(result.item3Score)}"
								>{result.item3Score} / 2</span
							>
						</td>
					</tr>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4">4. Acute change or fluctuating course</td>
						<td class="py-2 pr-4">{acuteChangeLabel(data.item4.acuteChange) || 'Not recorded'}</td>
						<td class="py-2">
							<span class="rounded-full border px-2 py-0.5 text-xs font-bold {pointColor(result.item4Score)}"
								>{result.item4Score} / 4</span
							>
						</td>
					</tr>
				</tbody>
			</table>
			<p class="mt-3 text-xs text-base-content/60">
				Item 4 information source: {acuteChangeSourceLabel(data.item4.acuteChangeSource) || 'N/A'}
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

		<!-- Patient / assessment summary -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Assessment summary</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div>
					<span class="font-medium text-base-content/70">Patient ID:</span>
					{data.identification.patientIdentifier || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Patient name:</span>
					{data.identification.patientName || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Date of birth:</span>
					{data.identification.dateOfBirth || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Setting:</span>
					{settingLabel(data.identification.setting) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Assessment date:</span>
					{data.identification.assessmentDate || 'N/A'}
					{#if data.identification.assessmentTime}
						at {data.identification.assessmentTime}
					{/if}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Assessor:</span>
					{data.identification.assessorName || 'N/A'}
					{#if data.identification.assessorRole}
						({data.identification.assessorRole})
					{/if}
				</div>
			</div>
			{#if data.note.clinicalNotes}
				<div class="mt-4 text-sm">
					<span class="font-medium text-base-content/70">Clinical notes:</span>
					<p class="mt-1 text-base-content/80">{data.note.clinicalNotes}</p>
				</div>
			{/if}
		</div>
	</main>
{/if}
