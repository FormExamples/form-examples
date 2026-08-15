<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import {
		classificationLabel,
		classificationColor,
		priorityLabel,
		priorityColor,
		careSettingLabel,
		clinicianRoleLabel,
		sexLabel,
		ageBandLabel,
		formatGap
	} from '#lib/engine/utils.js';
	import Button from '#lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/anion-gap-calculator/anion-gap-calculators/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/anion-gap-calculators/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `anion-gap-${data.identification.patientIdentifier || id}.pdf`;
				a.click();
				URL.revokeObjectURL(url);
			} else {
				pdfError = 'Failed to generate PDF. Please try again.';
			}
		} catch {
			pdfError = 'Failed to generate PDF. Please check your connection and try again.';
		}
	}

	const isUrgent = $derived(
		!!result && result.flaggedIssues.some((f) => f.priority === 'urgent')
	);
</script>

{#if result}
	<header class="border-b border-base-300 bg-base-100 shadow-sm no-print">
		<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
			<h1 class="text-lg font-bold text-base-content">Anion gap report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/anion-gap-calculator/anion-gap-calculators/${id}`)}
					>Edit</Button
				>
			</div>
		</div>
	</header>

	<main class="mx-16 px-4 py-6">
		<!-- Result banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {classificationColor(result.classification)}">
			<div class="text-3xl font-bold">{formatGap(result.anionGap)}</div>
			<div class="mt-2 text-sm font-semibold">{classificationLabel(result.classification)}</div>
			{#if result.correctedAnionGap !== null}
				<div class="mt-1 text-sm">
					Albumin-corrected: {formatGap(result.correctedAnionGap)}
				</div>
			{/if}
			<div class="mt-2 text-sm opacity-75">
				Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Recommended action -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-2 text-lg font-bold text-base-content">Recommended action</h2>
			{#if result.classification === 'unknown'}
				<p class="text-sm text-base-content/80">
					Sodium, chloride, and bicarbonate are all required to compute the anion gap. Complete the
					electrolyte panel and re-calculate.
				</p>
			{:else if isUrgent}
				<p class="text-sm text-base-content/80">
					This is a <strong>very high anion gap</strong>. Search for the cause of the metabolic
					acidosis without delay (GOLDMARK / MUDPILES); check lactate, ketones, renal function, and
					a toxicology history.
				</p>
			{:else if result.classification === 'high'}
				<p class="text-sm text-base-content/80">
					The anion gap is <strong>above the reference range</strong>. Investigate a high anion gap
					metabolic acidosis; work through the GOLDMARK / MUDPILES differential.
				</p>
			{:else if result.classification === 'low'}
				<p class="text-sm text-base-content/80">
					The anion gap is <strong>below the reference range</strong>. Consider hypoalbuminaemia (if
					uncorrected), laboratory error, paraproteinaemia, or lithium / bromide toxicity.
				</p>
			{:else}
				<p class="text-sm text-base-content/80">
					The anion gap is <strong>within the reference range</strong>. This does not exclude a
					normal-gap (hyperchloraemic) metabolic acidosis; interpret in the clinical context.
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
						<td class="py-2 pr-4">Serum sodium</td>
						<td class="py-2"
							>{data.electrolytes.sodium === null
								? 'Not recorded'
								: `${data.electrolytes.sodium} mmol/L`}</td
						>
					</tr>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4">Serum potassium (optional)</td>
						<td class="py-2"
							>{data.electrolytes.potassium === null
								? 'Not recorded'
								: `${data.electrolytes.potassium} mmol/L`}</td
						>
					</tr>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4">Serum chloride</td>
						<td class="py-2"
							>{data.electrolytes.chloride === null
								? 'Not recorded'
								: `${data.electrolytes.chloride} mmol/L`}</td
						>
					</tr>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4">Serum bicarbonate</td>
						<td class="py-2"
							>{data.electrolytes.bicarbonate === null
								? 'Not recorded'
								: `${data.electrolytes.bicarbonate} mmol/L`}</td
						>
					</tr>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4">Serum albumin (optional)</td>
						<td class="py-2"
							>{data.albumin.albumin === null ? 'Not recorded' : `${data.albumin.albumin} g/L`}</td
						>
					</tr>
					<tr class="border-b border-base-200 font-semibold">
						<td class="py-2 pr-4">
							Anion gap ({result.includesPotassium
								? 'with potassium; normal 8–16'
								: 'without potassium; normal 8–12'})
						</td>
						<td class="py-2">{formatGap(result.anionGap)}</td>
					</tr>
					<tr class="border-b border-base-200 font-semibold">
						<td class="py-2 pr-4">Albumin-corrected anion gap</td>
						<td class="py-2">{formatGap(result.correctedAnionGap)}</td>
					</tr>
				</tbody>
			</table>
			<p class="mt-3 text-xs text-base-content/60">
				anionGap = {result.includesPotassium
					? '(sodium + potassium) − (chloride + bicarbonate)'
					: 'sodium − (chloride + bicarbonate)'}; correctedAnionGap = anionGap + 0.25 × (40 −
				albumin)
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
					<span class="font-medium text-base-content/70">Clinical context:</span>
					{data.context.clinicalContext || 'N/A'}
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
