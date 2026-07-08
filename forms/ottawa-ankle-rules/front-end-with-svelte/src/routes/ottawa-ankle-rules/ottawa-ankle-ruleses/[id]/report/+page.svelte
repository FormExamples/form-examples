<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import {
		decisionLabel,
		decisionColor,
		decisionSummaryLabel,
		weightBearingColor,
		priorityLabel,
		priorityColor,
		careSettingLabel,
		clinicianRoleLabel,
		injuredSideLabel,
		sexLabel,
		yesNoLabel
	} from '$lib/engine/utils';
	import Button from '$lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/ottawa-ankle-rules/ottawa-ankle-ruleses/${id}`);
		}
	});

	let pdfError = $state('');

	// The eight criterion rows, in wizard order, built in the script so no raw
	// comparison operators appear in template text.
	const criteriaRows = $derived([
		{ label: 'Malleolar-zone pain (ankle precondition)', region: 'Ankle', value: yesNoLabel(data.painZones.malleolarZonePain) },
		{ label: 'A1 — Lateral malleolus tenderness', region: 'Ankle', value: yesNoLabel(data.ankleTenderness.lateralMalleolusTenderness) },
		{ label: 'A2 — Medial malleolus tenderness', region: 'Ankle', value: yesNoLabel(data.ankleTenderness.medialMalleolusTenderness) },
		{ label: 'Midfoot-zone pain (foot precondition)', region: 'Foot', value: yesNoLabel(data.painZones.midfootZonePain) },
		{ label: 'F1 — Fifth-metatarsal-base tenderness', region: 'Foot', value: yesNoLabel(data.footTenderness.fifthMetatarsalBaseTenderness) },
		{ label: 'F2 — Navicular tenderness', region: 'Foot', value: yesNoLabel(data.footTenderness.navicularTenderness) },
		{ label: 'Able to bear weight immediately after injury', region: 'Both', value: yesNoLabel(data.weightBearing.ableToBearWeightImmediately) },
		{ label: 'Able to bear weight now, at assessment', region: 'Both', value: yesNoLabel(data.weightBearing.ableToBearWeightNow) }
	]);

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/ottawa-ankle-ruleses/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `ottawa-ankle-rules-assessment-${data.identification.patientIdentifier || id}.pdf`;
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
			<h1 class="text-lg font-bold text-base-content">Ottawa Ankle / Foot Rules report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button
					data-variant="secondary"
					onclick={() => goto(`/ottawa-ankle-rules/ottawa-ankle-ruleses/${id}`)}>Edit</Button
				>
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-4xl px-4 py-6">
		<!-- Decision banner -->
		<div
			class="mb-6 rounded-xl border-2 p-6 text-center {decisionColor(
				result.ankleXrayIndicated || result.footXrayIndicated
			)}"
		>
			<div class="text-3xl font-bold">
				{decisionSummaryLabel(result.ankleXrayIndicated, result.footXrayIndicated)}
			</div>
			<div class="mt-2 flex flex-wrap justify-center gap-3 text-sm font-semibold">
				<span class="inline-block rounded-full border px-3 py-1 {decisionColor(result.ankleXrayIndicated)}">
					Ankle: {decisionLabel(result.ankleXrayIndicated)}
				</span>
				<span class="inline-block rounded-full border px-3 py-1 {decisionColor(result.footXrayIndicated)}">
					Foot: {decisionLabel(result.footXrayIndicated)}
				</span>
			</div>
			<div class="mt-2 text-sm opacity-90">
				Unable to bear weight:
				<span class="inline-block rounded-full border px-2 py-0.5 {weightBearingColor(result.unableToBearWeight)}">
					{result.unableToBearWeight ? 'Yes' : 'No'}
				</span>
			</div>
			<div class="mt-2 text-sm opacity-75">
				Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Recommended pathway -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-2 text-lg font-bold text-base-content">Recommended pathway</h2>
			<p class="text-sm text-base-content/80">
				This is a boolean decision rule, not a score. The two decisions are independent; "unable to
				bear weight" is
				<strong>{result.unableToBearWeight ? 'present' : 'absent'}</strong> and, when present, drives
				both regions.
			</p>
			{#if result.ankleXrayIndicated}
				<p class="mt-3 text-sm text-base-content/80">
					<strong>Ankle X-ray indicated.</strong> Malleolar-zone pain with malleolus tenderness or
					inability to bear weight — request an <strong>ankle radiograph series</strong>.
				</p>
			{:else}
				<p class="mt-3 text-sm text-base-content/80">
					<strong>Ankle X-ray not indicated.</strong> A clinically significant ankle fracture is
					unlikely — manage as a soft-tissue injury, safety-net, and review if not improving.
				</p>
			{/if}
			{#if result.footXrayIndicated}
				<p class="mt-3 text-sm text-base-content/80">
					<strong>Foot X-ray indicated.</strong> Midfoot-zone pain with fifth-metatarsal-base or
					navicular tenderness or inability to bear weight — request a
					<strong>foot radiograph series</strong>.
				</p>
			{:else}
				<p class="mt-3 text-sm text-base-content/80">
					<strong>Foot X-ray not indicated.</strong> A clinically significant midfoot fracture is
					unlikely — manage conservatively and safety-net.
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
						<th class="pb-2 pr-4">Region</th>
						<th class="pb-2">Answer</th>
					</tr>
				</thead>
				<tbody>
					{#each criteriaRows as row (row.label)}
						<tr class="border-b border-base-200">
							<td class="py-2 pr-4">{row.label}</td>
							<td class="py-2 pr-4">{row.region}</td>
							<td class="py-2">{row.value}</td>
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
					<span class="font-medium text-base-content/70">Age (years):</span>
					{data.identification.ageYears ?? 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Sex:</span>
					{sexLabel(data.identification.sex) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Injured side:</span>
					{injuredSideLabel(data.context.injuredSide) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Care setting:</span>
					{careSettingLabel(data.context.careSetting) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Assessment reliable:</span>
					{yesNoLabel(data.applicability.assessmentReliable)}
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
