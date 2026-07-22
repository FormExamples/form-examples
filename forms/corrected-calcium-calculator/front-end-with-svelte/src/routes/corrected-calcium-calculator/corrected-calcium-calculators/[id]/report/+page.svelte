<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import {
		classificationLabel,
		classificationColor,
		priorityLabel,
		priorityColor,
		careSettingLabel,
		clinicianRoleLabel,
		sexLabel,
		ageBandLabel,
		formatCalcium
	} from '$lib/engine/utils';
	import Button from '$lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/corrected-calcium-calculator/corrected-calcium-calculators/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/corrected-calcium-calculators/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `corrected-calcium-${data.identification.patientIdentifier || id}.pdf`;
				a.click();
				URL.revokeObjectURL(url);
			} else {
				pdfError = 'Failed to generate PDF. Please try again.';
			}
		} catch {
			pdfError = 'Failed to generate PDF. Please check your connection and try again.';
		}
	}

	const isSevere = $derived(
		!!result &&
			result.flaggedIssues.some(
				(f) => f.id === 'F-SEVERE-HYPERCALCAEMIA-001' || f.id === 'F-SEVERE-HYPOCALCAEMIA-001'
			)
	);
</script>

{#if result}
	<header class="border-b border-base-300 bg-base-100 shadow-sm no-print">
		<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
			<h1 class="text-lg font-bold text-base-content">Corrected calcium report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button
					data-variant="secondary"
					onclick={() => goto(`/corrected-calcium-calculator/corrected-calcium-calculators/${id}`)}>Edit</Button
				>
			</div>
		</div>
	</header>

	<main class="mx-16 px-4 py-6">
		<!-- Result banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {classificationColor(result.classification)}">
			<div class="text-3xl font-bold">{formatCalcium(result.correctedCalcium)}</div>
			<div class="mt-2 text-sm font-semibold">{classificationLabel(result.classification)}</div>
			<div class="mt-2 text-sm opacity-75">
				Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Recommended action -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-2 text-lg font-bold text-base-content">Recommended action</h2>
			{#if result.classification === 'unknown'}
				<p class="text-sm text-base-content/80">
					Both the measured total calcium and serum albumin are required to compute a corrected
					value. Record the missing input and re-calculate.
				</p>
			{:else if isSevere}
				<p class="text-sm text-base-content/80">
					This is a <strong>severe result</strong>. Seek urgent senior review, monitor ECG, and
					treat per the local hypercalcaemia or hypocalcaemia protocol.
				</p>
			{:else if result.classification === 'normal'}
				<p class="text-sm text-base-content/80">
					The corrected calcium is <strong>within the adult reference range</strong>. Interpret in
					clinical context; the correction is an estimate and does not replace a measured ionised
					calcium.
				</p>
			{:else}
				<p class="text-sm text-base-content/80">
					The corrected calcium is <strong>outside the adult reference range</strong>. Investigate
					the cause and correlate with symptoms; correlate with a repeat or measured ionised calcium
					as indicated.
				</p>
			{/if}
		</div>

		<!-- Calculation -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Calculation</h2>
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-base-300 text-left text-base-content/70">
						<th class="pb-2 pr-4">Input</th>
						<th class="pb-2">Value</th>
					</tr>
				</thead>
				<tbody>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4">Measured total calcium</td>
						<td class="py-2"
							>{data.calcium.totalCalcium === null
								? 'Not recorded'
								: `${data.calcium.totalCalcium} mmol/L`}</td
						>
					</tr>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4">Measured serum albumin</td>
						<td class="py-2"
							>{data.albumin.albumin === null ? 'Not recorded' : `${data.albumin.albumin} g/L`}</td
						>
					</tr>
					<tr class="border-b border-base-200 font-semibold">
						<td class="py-2 pr-4">Corrected calcium (albumin-adjusted)</td>
						<td class="py-2">{formatCalcium(result.correctedCalcium)}</td>
					</tr>
				</tbody>
			</table>
			<p class="mt-3 text-xs text-base-content/60">
				correctedCalcium = totalCalcium + 0.02 × (40 − albumin)
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
					<span class="font-medium text-base-content/70">Symptomatic:</span>
					{data.symptoms.symptomatic || 'Not recorded'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Sample reference:</span>
					{data.context.sampleReference || 'N/A'}
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
