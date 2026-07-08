<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import {
		resultClassLabel,
		resultClassColor,
		managementActionLabel,
		priorityLabel,
		priorityColor,
		clinicianRoleLabel,
		sexLabel,
		sampleAdequacyLabel,
		withinAgeRangeLabel,
		formatHb
	} from '$lib/engine/utils';
	import Button from '$lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/bowel-cancer-screening-with-faecal-immunochemical-test/fit-screenings/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/fit-screenings/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `fit-screening-${data.identification.participantIdentifier || id}.pdf`;
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
			<h1 class="text-lg font-bold text-base-content">Bowel cancer screening (FIT) report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/bowel-cancer-screening-with-faecal-immunochemical-test/fit-screenings/${id}`)}>Edit</Button>
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-4xl px-4 py-6">
		<!-- Result banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {resultClassColor(result.resultClass)}">
			<div class="text-3xl font-bold">{resultClassLabel(result.resultClass)}</div>
			<div class="mt-2 text-sm font-semibold">{managementActionLabel(result.managementAction)}</div>
			<div class="mt-2 text-sm opacity-75">
				Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Symptomatic-pathway alert -->
		{#if result.symptomaticPathway}
			<div class="mb-6 rounded-xl border-2 border-error bg-error/10 p-4 text-error">
				<strong>Urgent suspected-cancer pathway.</strong> Red-flag symptoms were reported. Refer on the
				urgent suspected lower-gastrointestinal cancer pathway regardless of the FIT result — a negative
				screen does not exclude cancer.
			</div>
		{/if}

		<!-- Recommended action -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-2 text-lg font-bold text-base-content">Recommended action</h2>
			{#if result.status === 'incomplete'}
				<p class="text-sm text-base-content/80">
					The kit is returned and adequate but no faecal haemoglobin value has been recorded, so the
					result <strong>cannot be classified</strong>. Obtain the assay value from the laboratory
					and re-run the classification.
				</p>
			{:else if result.resultClass === 'positive'}
				<p class="text-sm text-base-content/80">
					This is a <strong>positive screen</strong>. Refer for colonoscopy via the screening
					colonoscopy pathway and inform the participant of the result.
				</p>
			{:else if result.resultClass === 'spoilt'}
				<p class="text-sm text-base-content/80">
					The sample was <strong>not adequate</strong>. Reissue a FIT kit with instructions to avoid
					the spoilage cause and repeat the test.
				</p>
			{:else if result.resultClass === 'negative'}
				<p class="text-sm text-base-content/80">
					This is a <strong>negative screen</strong>. Return the participant to routine two-yearly
					recall. A negative screen does not exclude cancer in a symptomatic person.
				</p>
			{:else}
				<p class="text-sm text-base-content/80">
					No sample was available to classify. Send a reminder and reissue the FIT kit; record the
					non-participation for the screening episode.
				</p>
			{/if}
		</div>

		<!-- Kit and result -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Kit and result</h2>
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-base-300 text-left text-base-content/70">
						<th class="pb-2 pr-4">Item</th>
						<th class="pb-2">Value</th>
					</tr>
				</thead>
				<tbody>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4">Kit returned</td>
						<td class="py-2">{data.kit.kitReturned || 'Not recorded'}</td>
					</tr>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4">Sample adequacy</td>
						<td class="py-2">{sampleAdequacyLabel(data.kit.sampleAdequacy) || 'Not recorded'}</td>
					</tr>
					<tr class="border-b border-base-200 font-semibold">
						<td class="py-2 pr-4">Faecal haemoglobin</td>
						<td class="py-2">{formatHb(data.result.faecalHaemoglobinUgG)}</td>
					</tr>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4">Programme threshold applied</td>
						<td class="py-2"
							>{data.result.thresholdApplied === null
								? 'Not recorded'
								: `${data.result.thresholdApplied} µg Hb/g`}</td
						>
					</tr>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4">Assay / analyser</td>
						<td class="py-2">{data.result.assay || 'Not recorded'}</td>
					</tr>
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

		<!-- Participant / context summary -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Assessment summary</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div>
					<span class="font-medium text-base-content/70">Participant ID:</span>
					{data.identification.participantIdentifier || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">NHS number:</span>
					{data.identification.nhsNumber || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Age:</span>
					{data.identification.participantAge === null
						? 'N/A'
						: `${data.identification.participantAge} years`}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Sex:</span>
					{sexLabel(data.identification.sex) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Eligibility:</span>
					{withinAgeRangeLabel(data.eligibility.withinAgeRange) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Screening hub:</span>
					{data.context.screeningHub || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Clinician:</span>
					{data.context.clinicianName || 'N/A'}
					{#if clinicianRoleLabel(data.context.clinicianRole)}
						({clinicianRoleLabel(data.context.clinicianRole)})
					{/if}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Red-flag symptoms:</span>
					{data.symptoms.redFlagSymptoms || 'Not recorded'}
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
