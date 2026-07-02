<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import {
		twoLevelBandLabel,
		twoLevelBandColor,
		threeLevelBandLabel,
		threeLevelBandColor,
		recommendedInvestigationLabel,
		priorityLabel,
		priorityColor,
		pointColor,
		careSettingLabel,
		clinicianRoleLabel,
		sexLabel,
		ageBandLabel,
		symptomaticLegLabel,
		yesNoLabel
	} from '$lib/engine/utils';
	import Button from '$lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/wells-score-for-deep-vein-thromboses/${id}`);
		}
	});

	let pdfError = $state('');

	// The ten scored rows, in wizard order, built in the script so no raw
	// comparison operators appear in template text.
	const criteriaRows = $derived([
		{ label: 'Active cancer', value: yesNoLabel(data.predisposing.activeCancer), points: 'active-cancer' },
		{
			label: 'Paralysis / immobilisation',
			value: yesNoLabel(data.predisposing.paralysisOrImmobilisation),
			points: 'paralysis-or-immobilisation'
		},
		{
			label: 'Bedridden ≥ 3 days or major surgery ≤ 12 weeks',
			value: yesNoLabel(data.predisposing.recentlyBedriddenOrSurgery),
			points: 'recently-bedridden-or-surgery'
		},
		{
			label: 'Localised deep-vein tenderness',
			value: yesNoLabel(data.examination.localisedTenderness),
			points: 'localised-tenderness'
		},
		{ label: 'Entire leg swollen', value: yesNoLabel(data.examination.entireLegSwollen), points: 'entire-leg-swollen' },
		{
			label: 'Calf swelling ≥ 3 cm',
			value: yesNoLabel(data.examination.calfSwellingOver3cm),
			points: 'calf-swelling-over-3cm'
		},
		{
			label: 'Pitting oedema (symptomatic leg)',
			value: yesNoLabel(data.examination.pittingOedema),
			points: 'pitting-oedema'
		},
		{
			label: 'Collateral superficial veins',
			value: yesNoLabel(data.examination.collateralSuperficialVeins),
			points: 'collateral-superficial-veins'
		},
		{
			label: 'Previously documented DVT',
			value: yesNoLabel(data.predisposing.previouslyDocumentedDvt),
			points: 'previously-documented-dvt'
		},
		{
			label: 'Alternative diagnosis at least as likely',
			value: yesNoLabel(data.alternative.alternativeDiagnosisAsLikely),
			points: 'alternative-diagnosis-as-likely'
		}
	]);

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/wells-score-for-deep-vein-thromboses/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `wells-dvt-assessment-${data.identification.patientIdentifier || id}.pdf`;
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
			<h1 class="text-lg font-bold text-base-content">Wells DVT assessment report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button
					data-variant="secondary"
					onclick={() => goto(`/wells-score-for-deep-vein-thromboses/${id}`)}>Edit</Button
				>
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-4xl px-4 py-6">
		<!-- Score banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {twoLevelBandColor(result.twoLevelBand)}">
			<div class="text-3xl font-bold">Wells score {result.wellsScore}</div>
			<div class="mt-2 text-sm font-semibold">{twoLevelBandLabel(result.twoLevelBand)}</div>
			<div class="mt-1 text-sm opacity-90">
				Three-level: {threeLevelBandLabel(result.threeLevelBand)}
			</div>
			<div class="mt-2 text-sm opacity-75">
				Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Recommended action -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-2 text-lg font-bold text-base-content">Recommended action</h2>
			{#if result.twoLevelBand === 'likely'}
				<p class="text-sm text-base-content/80">
					<strong>DVT likely.</strong> Offer a
					<strong>{recommendedInvestigationLabel(result.recommendedInvestigation)}</strong>, ideally
					within 4 hours. If the scan cannot be done within 4 hours, offer a D-dimer test and interim
					anticoagulation, then a scan within 24 hours.
				</p>
			{:else}
				<p class="text-sm text-base-content/80">
					<strong>DVT unlikely.</strong> Offer a
					<strong>{recommendedInvestigationLabel(result.recommendedInvestigation)}</strong> with a
					result available within 4 hours (or interim anticoagulation if not). A negative D-dimer
					effectively excludes DVT; a positive D-dimer triggers a proximal leg vein ultrasound. A low
					score does not by itself exclude DVT.
				</p>
			{/if}
		</div>

		<!-- Criteria -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Criteria</h2>
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-base-300 text-left text-base-content/70">
						<th class="pb-2 pr-4">Criterion</th>
						<th class="pb-2 pr-4">Present</th>
						<th class="pb-2">Points</th>
					</tr>
				</thead>
				<tbody>
					{#each criteriaRows as row (row.points)}
						<tr class="border-b border-base-200">
							<td class="py-2 pr-4">{row.label}</td>
							<td class="py-2 pr-4">{row.value}</td>
							<td class="py-2">
								<span
									class="rounded-full border px-2 py-0.5 text-xs font-bold {pointColor(
										result.criterionPoints[row.points]
									)}">{result.criterionPoints[row.points]}</span
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
					<span class="font-medium text-base-content/70">Symptomatic leg:</span>
					{symptomaticLegLabel(data.identification.symptomaticLeg) || 'N/A'}
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
			</div>
			{#if data.note.clinicalNotes}
				<div class="mt-4 text-sm">
					<span class="font-medium text-base-content/70">Clinical note:</span>
					<p class="mt-1 text-base-content/80">{data.note.clinicalNotes}</p>
				</div>
			{/if}
		</div>
	</main>
{/if}
