<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import {
		riskBandLabel,
		riskBandColor,
		priorityLabel,
		priorityColor,
		pointColor,
		careSettingLabel,
		clinicianRoleLabel,
		sexLabel,
		ageModifierLabel
	} from '#lib/engine/utils.js';
	import Button from '#lib/components/ui/Button.svelte';

	const plural = 'centor-score-for-streptococcal-pharyngitises';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/centor-score-for-streptococcal-pharyngitis/${plural}/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/${plural}/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `centor-assessment-${data.identification.patientIdentifier || id}.pdf`;
				a.click();
				URL.revokeObjectURL(url);
			} else {
				pdfError = 'Failed to generate PDF. Please try again.';
			}
		} catch {
			pdfError = 'Failed to generate PDF. Please check your connection and try again.';
		}
	}

	function feverValue(): string {
		if (data.fever.feverOver38 === 'yes') return 'History of fever / > 38 °C';
		if (data.fever.measuredTemperatureCelsius !== null)
			return `Measured ${data.fever.measuredTemperatureCelsius} °C`;
		if (data.fever.feverOver38 === 'no') return 'No fever';
		return 'Not recorded';
	}

	function yn(value: string): string {
		if (value === 'yes') return 'Yes';
		if (value === 'no') return 'No';
		return 'Not recorded';
	}
</script>

{#if result}
	<header class="border-b border-base-300 bg-base-100 shadow-sm no-print">
		<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
			<h1 class="text-lg font-bold text-base-content">Centor / McIsaac assessment report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/centor-score-for-streptococcal-pharyngitis/${plural}/${id}`)}>Edit</Button>
			</div>
		</div>
	</header>

	<main class="mx-16 px-4 py-6">
		<!-- Score banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {riskBandColor(result.riskBand)}">
			<div class="text-3xl font-bold">McIsaac {result.mcIsaacScore}</div>
			<div class="mt-1 text-sm font-semibold">Centor total {result.centorScore} of 4</div>
			<div class="mt-2 text-sm font-semibold">{riskBandLabel(result.riskBand)}</div>
			<div class="mt-2 text-sm opacity-75">
				Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Recommended action -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-2 text-lg font-bold text-base-content">Recommended action</h2>
			{#if result.riskBand === 'high'}
				<p class="text-sm text-base-content/80">
					<strong>High probability</strong> of streptococcal infection. Consider a rapid antigen
					detection test (RADT) or throat swab, or empirical antibiotics under
					antimicrobial-stewardship principles, with safety-netting.
				</p>
			{:else if result.riskBand === 'moderate'}
				<p class="text-sm text-base-content/80">
					<strong>Intermediate probability</strong> of streptococcal infection. Consider a rapid
					antigen detection test (RADT) or throat swab; treat with antibiotics only if positive or
					clinically indicated.
				</p>
			{:else}
				<p class="text-sm text-base-content/80">
					<strong>Low probability</strong> of streptococcal infection. Avoid a swab and antibiotics;
					give self-care and safety-netting advice, as most sore throats are viral and
					self-limiting.
				</p>
			{/if}
		</div>

		<!-- Criteria -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Centor criteria</h2>
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-base-300 text-left text-base-content/70">
						<th class="pb-2 pr-4">Criterion</th>
						<th class="pb-2 pr-4">Value</th>
						<th class="pb-2">Point</th>
					</tr>
				</thead>
				<tbody>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4">Tonsillar exudate or swelling</td>
						<td class="py-2 pr-4">{yn(data.exudate.tonsillarExudate)}</td>
						<td class="py-2">
							<span
								class="rounded-full border px-2 py-0.5 text-xs font-bold {pointColor(
									result.tonsillarExudatePoint
								)}">{result.tonsillarExudatePoint}</span
							>
						</td>
					</tr>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4">Tender anterior cervical nodes</td>
						<td class="py-2 pr-4">{yn(data.nodes.tenderAnteriorCervicalNodes)}</td>
						<td class="py-2">
							<span
								class="rounded-full border px-2 py-0.5 text-xs font-bold {pointColor(
									result.tenderNodesPoint
								)}">{result.tenderNodesPoint}</span
							>
						</td>
					</tr>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4">Fever (&gt; 38 °C or history)</td>
						<td class="py-2 pr-4">{feverValue()}</td>
						<td class="py-2">
							<span
								class="rounded-full border px-2 py-0.5 text-xs font-bold {pointColor(
									result.feverPoint
								)}">{result.feverPoint}</span
							>
						</td>
					</tr>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4">Cough absent</td>
						<td class="py-2 pr-4">{yn(data.cough.absenceOfCough)}</td>
						<td class="py-2">
							<span
								class="rounded-full border px-2 py-0.5 text-xs font-bold {pointColor(
									result.coughAbsentPoint
								)}">{result.coughAbsentPoint}</span
							>
						</td>
					</tr>
				</tbody>
			</table>
			<p class="mt-3 text-sm text-base-content/70">
				McIsaac age modifier: {ageModifierLabel(result.ageModifier)}.
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
					<span class="font-medium text-base-content/70">Age:</span>
					{data.identification.ageYears === null ? 'N/A' : `${data.identification.ageYears} years`}
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
					<span class="font-medium text-base-content/70">Assessed at:</span>
					{data.context.assessedAt || 'N/A'}
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
