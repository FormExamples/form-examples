<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import {
		clinicianRoleLabel,
		eligibilityLabel,
		episodeTypeLabel,
		imagingClassLabel,
		outcomeBandColor,
		outcomeBandLabel,
		priorityColor,
		priorityLabel,
		readingOutcomeLabel,
		screeningOutcomeLabel
	} from '$lib/engine/utils';
	import Button from '$lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/breast-screening/breast-screenings/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/breast-screenings/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `breast-screening-${data.identification.patientIdentifier || id}.pdf`;
				a.click();
				URL.revokeObjectURL(url);
			} else {
				pdfError = 'Failed to generate PDF. Please try again.';
			}
		} catch {
			pdfError = 'Failed to generate PDF. Please check your connection and try again.';
		}
	}

	const classificationRows = $derived(
		result
			? [
					{ label: 'Eligibility', value: eligibilityLabel(result.eligibilityStatus) || 'Not determined' },
					{ label: 'Reading outcome', value: readingOutcomeLabel(result.readingOutcome) },
					{ label: 'Imaging classification', value: imagingClassLabel(result.imagingClassification) },
					{
						label: 'Screening outcome / next action',
						value: screeningOutcomeLabel(result.screeningOutcome)
					},
					{ label: 'Record status', value: result.status === 'complete' ? 'Complete' : 'Incomplete' }
				]
			: []
	);
</script>

{#if result}
	<header class="border-b border-base-300 bg-base-100 shadow-sm no-print">
		<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
			<h1 class="text-lg font-bold text-base-content">Breast screening report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/breast-screening/breast-screenings/${id}`)}>Edit</Button>
			</div>
		</div>
	</header>

	<main class="mx-16 px-4 py-6">
		<!-- Outcome banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {outcomeBandColor(result.outcomeBand)}">
			<div class="text-3xl font-bold">{screeningOutcomeLabel(result.screeningOutcome)}</div>
			<div class="mt-2 text-sm font-semibold">
				Outcome band: {outcomeBandLabel(result.outcomeBand)} · {result.status === 'complete'
					? 'Complete'
					: 'Incomplete'}
			</div>
			<div class="mt-2 text-sm opacity-75">
				Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Interpretation -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-2 text-lg font-bold text-base-content">Recommended action</h2>
			{#if result.outcomeBand === 'urgent'}
				<p class="text-sm text-base-content/80">
					This is an <strong>urgent</strong> outcome. Refer to the breast clinic without delay for
					tissue diagnosis and MDT discussion.
				</p>
			{:else if result.outcomeBand === 'referral'}
				<p class="text-sm text-base-content/80">
					The woman is <strong>symptomatic</strong>. This is not a screening outcome — refer via the
					symptomatic breast pathway rather than screening.
				</p>
			{:else if result.outcomeBand === 'assessment'}
				<p class="text-sm text-base-content/80">
					Book the woman into an <strong>assessment clinic</strong> (or short-interval follow-up as
					classified) and record the assessment result.
				</p>
			{:else if result.outcomeBand === 'repeat'}
				<p class="text-sm text-base-content/80">
					<strong>Repeat the mammogram</strong> — the images could not be reported reliably. Address
					positioning, exposure, or movement.
				</p>
			{:else if result.outcomeBand === 'routine'}
				<p class="text-sm text-base-content/80">
					Return the woman to <strong>routine 3-yearly recall</strong>. A normal result does not
					exclude interval cancer — report new symptoms promptly.
				</p>
			{:else}
				<p class="text-sm text-base-content/80">
					The record is <strong>incomplete</strong>. Complete the required inputs to finalise the
					screening outcome.
				</p>
			{/if}
		</div>

		<!-- Classification -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Classification</h2>
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-base-300 text-left text-base-content/70">
						<th class="pb-2 pr-4">Item</th>
						<th class="pb-2">Value</th>
					</tr>
				</thead>
				<tbody>
					{#each classificationRows as row (row.label)}
						<tr class="border-b border-base-200">
							<td class="py-2 pr-4">{row.label}</td>
							<td class="py-2 font-medium">{row.value}</td>
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
			<h2 class="mb-4 text-lg font-bold text-base-content">Record summary</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div>
					<span class="font-medium text-base-content/70">Patient ID:</span>
					{data.identification.patientIdentifier || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Age:</span>
					{data.identification.ageYears !== null ? `${data.identification.ageYears} years` : 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Episode type:</span>
					{episodeTypeLabel(data.context.episodeType) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Screening unit:</span>
					{data.context.screeningUnit || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Clinician:</span>
					{data.context.clinicianName || 'N/A'}
					{#if clinicianRoleLabel(data.context.clinicianRole)}
						({clinicianRoleLabel(data.context.clinicianRole)})
					{/if}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Last screened:</span>
					{data.identification.lastScreenedDate || 'N/A'}
				</div>
			</div>
			{#if data.note.clinicalContext}
				<div class="mt-4 text-sm">
					<span class="font-medium text-base-content/70">Clinical context:</span>
					<p class="mt-1 text-base-content/80">{data.note.clinicalContext}</p>
				</div>
			{/if}
		</div>
	</main>
{/if}
