<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import {
		resultClassLabel,
		resultClassColor,
		managementActionLabel,
		statusLabel,
		priorityLabel,
		priorityColor,
		sampleTakerRoleLabel,
		careSettingLabel,
		hpvResultLabel,
		cytologyGradeLabel,
		sampleAdequacyLabel
	} from '#lib/engine/utils.js';
	import Button from '#lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/cervical-screening/cervical-screenings/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/cervical-screenings/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `cervical-screening-${data.identification.patientIdentifier || id}.pdf`;
				a.click();
				URL.revokeObjectURL(url);
			} else {
				pdfError = 'Failed to generate PDF. Please try again.';
			}
		} catch {
			pdfError = 'Failed to generate PDF. Please check your connection and try again.';
		}
	}

	const resultRows = $derived(
		result
			? [
					{ label: 'Sample adequacy', value: sampleAdequacyLabel(data.adequacy.sampleAdequacy) || 'N/A' },
					{ label: 'Primary hrHPV', value: hpvResultLabel(data.hpv.hpvResult) || 'N/A' },
					{ label: 'Reflex cytology', value: cytologyGradeLabel(data.cytology.cytologyGrade) || 'N/A' }
				]
			: []
	);
</script>

{#if result}
	<header class="border-b border-base-300 bg-base-100 shadow-sm no-print">
		<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
			<h1 class="text-lg font-bold text-base-content">Cervical screening report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/cervical-screening/cervical-screenings/${id}`)}>Edit</Button>
			</div>
		</div>
	</header>

	<main class="mx-16 px-4 py-6">
		<!-- Result banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {resultClassColor(result.resultClass)}">
			<div class="text-3xl font-bold">{resultClassLabel(result.resultClass)}</div>
			<div class="mt-2 text-sm font-semibold">
				{managementActionLabel(result.managementAction)} · {statusLabel(result.status)}
			</div>
			<div class="mt-2 text-sm opacity-75">
				Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Interpretation -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-2 text-lg font-bold text-base-content">Interpretation</h2>
			{#if result.resultClass === 'hpv-positive-cytology-abnormal-high'}
				<p class="text-sm text-base-content/80">
					hrHPV positive with high-grade dyskaryosis — <strong>urgent colposcopy referral</strong>.
					Action the referral within its local timeframe. A screening classification is not a
					diagnosis.
				</p>
			{:else if result.resultClass === 'hpv-positive-cytology-abnormal-low'}
				<p class="text-sm text-base-content/80">
					hrHPV positive with borderline or low-grade dyskaryosis — <strong>routine colposcopy
					referral</strong>. Refer per the local pathway.
				</p>
			{:else if result.resultClass === 'hpv-negative'}
				<p class="text-sm text-base-content/80">
					hrHPV not detected on an adequate sample — <strong>routine recall</strong> at the
					age-appropriate interval. A negative screen is not a guarantee of health; safety-net any
					symptoms.
				</p>
			{:else if result.status === 'incomplete'}
				<p class="text-sm text-base-content/80">
					This record is <strong>incomplete</strong>: eligibility, consent, adequacy, or the required
					result field for the reached branch is missing. Complete the outstanding field(s) to
					classify and report the result.
				</p>
			{:else}
				<p class="text-sm text-base-content/80">
					Recommended management: <strong>{managementActionLabel(result.managementAction)}</strong>.
					A screening classification is not a diagnosis.
				</p>
			{/if}
		</div>

		<!-- Result detail -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Result</h2>
			<table class="w-full text-sm">
				<tbody>
					{#each resultRows as row (row.label)}
						<tr class="border-b border-base-200">
							<td class="py-2 pr-4 text-base-content/70">{row.label}</td>
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
			<h2 class="mb-4 text-lg font-bold text-base-content">Screening summary</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div>
					<span class="font-medium text-base-content/70">Patient ID:</span>
					{data.identification.patientIdentifier || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">NHS number:</span>
					{data.identification.nhsNumber || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Age:</span>
					{data.identification.age !== null ? data.identification.age : 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Care setting:</span>
					{careSettingLabel(data.context.careSetting) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Sample-taker:</span>
					{data.context.sampleTakerName || 'N/A'}
					{#if sampleTakerRoleLabel(data.context.sampleTakerRole)}
						({sampleTakerRoleLabel(data.context.sampleTakerRole)})
					{/if}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Sample taken:</span>
					{data.context.sampleTakenAt || 'N/A'}
				</div>
			</div>
			{#if data.note.clinicalContext}
				<div class="mt-4 text-sm">
					<span class="font-medium text-base-content/70">Clinical note:</span>
					<p class="mt-1 text-base-content/80">{data.note.clinicalContext}</p>
				</div>
			{/if}
		</div>
	</main>
{/if}
