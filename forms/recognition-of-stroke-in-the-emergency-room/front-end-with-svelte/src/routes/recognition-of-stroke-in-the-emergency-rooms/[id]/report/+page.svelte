<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import {
		bandLabel,
		bandColor,
		priorityLabel,
		priorityColor,
		pointColor,
		signed,
		careSettingLabel,
		clinicianRoleLabel,
		sexLabel,
		ageBandLabel,
		hypoglycaemiaCorrectedLabel
	} from '$lib/engine/utils';
	import Button from '$lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/recognition-of-stroke-in-the-emergency-rooms/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/recognition-of-stroke-in-the-emergency-rooms/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `rosier-assessment-${data.identification.patientIdentifier || id}.pdf`;
				a.click();
				URL.revokeObjectURL(url);
			} else {
				pdfError = 'Failed to generate PDF. Please try again.';
			}
		} catch {
			pdfError = 'Failed to generate PDF. Please check your connection and try again.';
		}
	}

	const yn = (v: string) => (v === 'yes' ? 'Yes' : v === 'no' ? 'No' : 'Not recorded');
	const glucose = $derived(data.precondition.bloodGlucose);

	const criteria = $derived(
		result
			? [
					{ label: 'Loss of consciousness / syncope', answer: yn(data.mimics.lossOfConsciousness), point: result.lossOfConsciousnessPoint },
					{ label: 'Seizure activity', answer: yn(data.mimics.seizureActivity), point: result.seizureActivityPoint },
					{ label: 'Asymmetric facial weakness', answer: yn(data.signs.facialWeakness), point: result.facialWeaknessPoint },
					{ label: 'Asymmetric arm weakness', answer: yn(data.signs.armWeakness), point: result.armWeaknessPoint },
					{ label: 'Asymmetric leg weakness', answer: yn(data.signs.legWeakness), point: result.legWeaknessPoint },
					{ label: 'Speech disturbance', answer: yn(data.signs.speechDisturbance), point: result.speechDisturbancePoint },
					{ label: 'Visual field defect', answer: yn(data.signs.visualFieldDefect), point: result.visualFieldDefectPoint }
				]
			: []
	);
</script>

{#if result}
	<header class="border-b border-base-300 bg-base-100 shadow-sm no-print">
		<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
			<h1 class="text-lg font-bold text-base-content">ROSIER assessment report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button
					data-variant="secondary"
					onclick={() => goto(`/recognition-of-stroke-in-the-emergency-rooms/${id}`)}>Edit</Button
				>
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-4xl px-4 py-6">
		<!-- Score banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {bandColor(result.band)}">
			<div class="text-3xl font-bold">ROSIER {signed(result.rosierScore)} (range -2 to +5)</div>
			<div class="mt-2 text-sm font-semibold">{bandLabel(result.band)}</div>
			<div class="mt-2 text-sm opacity-75">
				Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Recommended action -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-2 text-lg font-bold text-base-content">Recommended action</h2>
			{#if result.band === 'stroke-likely'}
				<p class="text-sm text-base-content/80">
					This is a <strong>positive ROSIER screen</strong>. Activate the acute stroke pathway:
					urgent stroke-team referral, immediate CT / imaging, and start the thrombolysis /
					reperfusion clock. Time is brain.
				</p>
			{:else}
				<p class="text-sm text-base-content/80">
					This is a <strong>negative ROSIER screen</strong>. Stroke is unlikely but
					<strong>not excluded</strong>. Consider stroke mimics and alternative diagnoses; if
					clinical suspicion of stroke remains, escalate regardless of the score.
				</p>
			{/if}
		</div>

		<!-- Precondition -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-2 text-lg font-bold text-base-content">Blood glucose precondition</h2>
			<p class="text-sm text-base-content/80">
				Blood glucose:
				<strong>{glucose === null ? 'Not recorded' : `${glucose} mmol/L`}</strong>{#if glucose !== null && glucose < 3.5}
					<span class="text-error"> — below 3.5 mmol/L (hypoglycaemia mimic)</span>{/if}. Hypoglycaemia
				corrected:
				<strong
					>{hypoglycaemiaCorrectedLabel(data.precondition.hypoglycaemiaCorrected) ||
						'Not recorded'}</strong
				>.
			</p>
		</div>

		<!-- Criteria -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Criteria</h2>
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-base-300 text-left text-base-content/70">
						<th class="pb-2 pr-4">Criterion</th>
						<th class="pb-2 pr-4">Answer</th>
						<th class="pb-2">Point</th>
					</tr>
				</thead>
				<tbody>
					{#each criteria as c (c.label)}
						<tr class="border-b border-base-200">
							<td class="py-2 pr-4">{c.label}</td>
							<td class="py-2 pr-4">{c.answer}</td>
							<td class="py-2">
								<span
									class="rounded-full border px-2 py-0.5 text-xs font-bold {pointColor(c.point)}"
									>{signed(c.point)}</span
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
					<span class="font-medium text-base-content/70">Symptom onset:</span>
					{data.context.symptomOnsetAt || 'N/A'}
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
