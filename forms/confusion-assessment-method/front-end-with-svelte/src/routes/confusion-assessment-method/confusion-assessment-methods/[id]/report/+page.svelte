<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import {
		classificationLabel,
		classificationColor,
		featureStateLabel,
		featureStateColor,
		priorityLabel,
		priorityColor,
		assessorRoleLabel,
		camVariantLabel,
		sexLabel,
		ageBandLabel,
		consciousnessLevelLabel,
		motoricSubtypeLabel
	} from '$lib/engine/utils';
	import Button from '$lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/confusion-assessment-method/confusion-assessment-methods/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/confusion-assessment-methods/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `cam-assessment-${data.identification.patientIdentifier || id}.pdf`;
				a.click();
				URL.revokeObjectURL(url);
			} else {
				pdfError = 'Failed to generate PDF. Please try again.';
			}
		} catch {
			pdfError = 'Failed to generate PDF. Please check your connection and try again.';
		}
	}

	const featureRows = $derived(
		result
			? [
					{
						n: 1,
						label: 'Feature 1 — acute onset and fluctuating course',
						recorded: featureStateLabel(data.feature1.acuteOnsetFluctuating),
						positive: result.feature1Positive
					},
					{
						n: 2,
						label: 'Feature 2 — inattention',
						recorded: featureStateLabel(data.feature2.inattention),
						positive: result.feature2Positive
					},
					{
						n: 3,
						label: 'Feature 3 — disorganised thinking',
						recorded: featureStateLabel(data.feature3.disorganisedThinking),
						positive: result.feature3Positive
					},
					{
						n: 4,
						label: 'Feature 4 — altered level of consciousness',
						recorded: featureStateLabel(data.feature4.alteredConsciousness),
						positive: result.feature4Positive
					}
				]
			: []
	);

	function featureStatusLabel(positive: boolean | null): string {
		if (positive === null) return 'Not assessed';
		return positive ? 'Positive' : 'Negative';
	}
</script>

{#if result}
	<header class="border-b border-base-300 bg-base-100 shadow-sm no-print">
		<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
			<h1 class="text-lg font-bold text-base-content">CAM assessment report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button
					data-variant="secondary"
					onclick={() => goto(`/confusion-assessment-method/confusion-assessment-methods/${id}`)}>Edit</Button
				>
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-4xl px-4 py-6">
		<!-- Classification banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {classificationColor(result.classification)}">
			<div class="text-3xl font-bold">{classificationLabel(result.classification)}</div>
			<div class="mt-2 text-sm font-semibold">
				{result.positiveFeatures.length
					? `Positive features: ${result.positiveFeatures.join(', ')}`
					: 'No positive features'}
			</div>
			<div class="mt-2 text-sm opacity-75">
				Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Interpretation -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-2 text-lg font-bold text-base-content">Interpretation</h2>
			{#if result.classification === 'unable-to-assess'}
				<p class="text-sm text-base-content/80">
					This assessment is <strong>unable to be completed</strong>: the CAM-ICU patient is
					unrousable (RASS {data.feature4.rassScore}). The diagnostic algorithm was not evaluated.
					Provide supportive care and re-assess when arousal improves.
				</p>
			{:else if result.deliriumPresent}
				<p class="text-sm text-base-content/80">
					The CAM algorithm <strong>1 AND 2 AND (3 OR 4)</strong> is satisfied.
					<strong>Delirium is present.</strong> Delirium is a medical emergency with a reversible
					cause in most cases — begin the PINCH ME screen and search for the precipitant.
				</p>
			{:else}
				<p class="text-sm text-base-content/80">
					The CAM algorithm <strong>1 AND 2 AND (3 OR 4)</strong> is not satisfied.
					<strong>Delirium is absent</strong> on this screen. A single negative screen does not
					exclude delirium — re-screen at least once per shift in at-risk patients.
				</p>
			{/if}
			{#if motoricSubtypeLabel(result.motoricSubtype)}
				<p class="mt-2 text-sm text-base-content/70">
					Motoric subtype: <strong>{motoricSubtypeLabel(result.motoricSubtype)}</strong>.
				</p>
			{/if}
		</div>

		<!-- Features -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Features</h2>
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-base-300 text-left text-base-content/70">
						<th class="pb-2 pr-4">Feature</th>
						<th class="pb-2 pr-4">Recorded</th>
						<th class="pb-2">Result</th>
					</tr>
				</thead>
				<tbody>
					{#each featureRows as row (row.n)}
						<tr class="border-b border-base-200">
							<td class="py-2 pr-4">{row.label}</td>
							<td class="py-2 pr-4">{row.recorded}</td>
							<td class="py-2">
								<span
									class="rounded-full border px-2 py-0.5 text-xs font-bold {featureStateColor(
										row.positive
									)}">{featureStatusLabel(row.positive)}</span
								>
							</td>
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
					<span class="font-medium text-base-content/70">Variant:</span>
					{camVariantLabel(data.context.camVariant) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Assessor:</span>
					{data.context.assessorName || 'N/A'}
					{#if assessorRoleLabel(data.context.assessorRole)}
						({assessorRoleLabel(data.context.assessorRole)})
					{/if}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Ward / unit:</span>
					{data.context.wardUnit || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Level of consciousness:</span>
					{consciousnessLevelLabel(data.feature4.consciousnessLevel) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Motoric subtype:</span>
					{motoricSubtypeLabel(result.motoricSubtype) || 'N/A'}
				</div>
			</div>
			{#if data.result.recommendedActions}
				<div class="mt-4 text-sm">
					<span class="font-medium text-base-content/70">Recommended actions:</span>
					<p class="mt-1 text-base-content/80">{data.result.recommendedActions}</p>
				</div>
			{/if}
			{#if data.result.clinicalNote}
				<div class="mt-4 text-sm">
					<span class="font-medium text-base-content/70">Clinical note:</span>
					<p class="mt-1 text-base-content/80">{data.result.clinicalNote}</p>
				</div>
			{/if}
		</div>
	</main>
{/if}
