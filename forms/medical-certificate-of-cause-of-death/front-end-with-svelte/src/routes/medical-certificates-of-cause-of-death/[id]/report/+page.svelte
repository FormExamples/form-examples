<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import {
		validityClassLabel,
		validityClassColor,
		priorityLabel,
		priorityColor,
		gradeLabel,
		sexLabel,
		seenAfterDeathByLabel,
		coronerReasonLabel,
		medicalExaminerStatusLabel,
		yesNoLabel
	} from '$lib/engine/utils';
	import Button from '$lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/medical-certificates-of-cause-of-death/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/medical-certificates-of-cause-of-death/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `mccd-${data.deceased.patientIdentifier || id}.pdf`;
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
			<h1 class="text-lg font-bold text-base-content">MCCD validity report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button
					data-variant="secondary"
					onclick={() => goto(`/medical-certificates-of-cause-of-death/${id}`)}>Edit</Button
				>
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-4xl px-4 py-6">
		<!-- Classification banner -->
		<div class="mb-6 rounded-xl border-2 border-primary bg-base-100 p-6 text-center">
			<div class="text-2xl font-bold text-base-content">
				Validity: {validityClassLabel(result.validityClass)}
			</div>
			<div class="mt-3 flex flex-wrap items-center justify-center gap-3">
				<span
					class="inline-block rounded-full border px-3 py-1 text-sm font-bold {validityClassColor(
						result.validityClass
					)}"
				>
					{validityClassLabel(result.validityClass)}
				</span>
				<span class="text-sm text-base-content/70">
					Coroner referral indicated: {result.coronerReferralIndicated ? 'Yes' : 'No'}
				</span>
			</div>
			<div class="mt-2 text-sm text-base-content/70">
				Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Interpretation -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-2 text-lg font-bold text-base-content">Interpretation</h2>
			{#if result.validityClass === 'refer-to-coroner'}
				<p class="text-sm text-base-content/80">
					A coroner-referral criterion is asserted, so this certificate is classified
					<strong>refer to coroner</strong>. The MCCD should <strong>not</strong> be issued until the
					coroner has considered the case. This is a documentation and validation result only — the
					prescribed statutory certificate remains the definitive legal record.
				</p>
			{:else if result.validityClass === 'incomplete'}
				<p class="text-sm text-base-content/80">
					The certificate is <strong>incomplete</strong>: the direct cause at Part I(a) is missing,
					or the only cause given is a recognised mode of death. Complete the outstanding items
					before the certificate is issued. This tool validates and classifies only — it does not
					diagnose or replace statutory judgement.
				</p>
			{:else}
				<p class="text-sm text-base-content/80">
					The certificate is <strong>valid</strong>: Part I(a) is present, the causal sequence is
					logically ordered, no mode of death stands as the sole cause, and no coroner-referral
					criterion is met. The derived underlying cause is
					<strong>{result.underlyingCause || 'not derived'}</strong>. Medical-examiner scrutiny is
					still required before registration.
				</p>
			{/if}
		</div>

		<!-- Underlying cause -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-2 text-lg font-bold text-base-content">Derived underlying cause</h2>
			<p class="text-sm text-base-content/80">
				{result.underlyingCause || 'Not derived (Part I is empty).'}
			</p>
		</div>

		<!-- Part I sequence -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Part I — direct causal sequence</h2>
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-base-300 text-left text-base-content/70">
						<th class="pb-2 pr-4">Line</th>
						<th class="pb-2 pr-4">Condition</th>
						<th class="pb-2">Interval</th>
					</tr>
				</thead>
				<tbody>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4">I(a)</td>
						<td class="py-2 pr-4">{data.partI.causeIaCondition || '—'}</td>
						<td class="py-2">{data.partI.causeIaInterval || '—'}</td>
					</tr>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4">I(b)</td>
						<td class="py-2 pr-4">{data.partI.causeIbCondition || '—'}</td>
						<td class="py-2">{data.partI.causeIbInterval || '—'}</td>
					</tr>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4">I(c)</td>
						<td class="py-2 pr-4">{data.partI.causeIcCondition || '—'}</td>
						<td class="py-2">{data.partI.causeIcInterval || '—'}</td>
					</tr>
				</tbody>
			</table>
			{#if data.partII.partIiConditions}
				<div class="mt-4 text-sm">
					<span class="font-medium text-base-content/70">Part II (contributory):</span>
					{data.partII.partIiConditions}
					{#if data.partII.partIiInterval}
						<span class="text-base-content/60"> ({data.partII.partIiInterval})</span>
					{/if}
				</div>
			{/if}
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

		<!-- Certificate summary -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Certificate summary</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div>
					<span class="font-medium text-base-content/70">Deceased:</span>
					{data.deceased.deceasedName || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Patient ID:</span>
					{data.deceased.patientIdentifier || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Sex:</span>
					{sexLabel(data.deceased.sex) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Age at death:</span>
					{data.deceased.ageYears != null ? `${data.deceased.ageYears} years` : 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Certifying doctor:</span>
					{data.certification.certifyingDoctorName || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Grade:</span>
					{gradeLabel(data.certification.certifyingDoctorGrade) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Date of death:</span>
					{data.death.dateOfDeath || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Place of death:</span>
					{data.death.placeOfDeath || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Seen after death:</span>
					{seenAfterDeathByLabel(data.death.seenAfterDeathBy) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Referred to coroner:</span>
					{yesNoLabel(data.referral.referredToCoroner) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Coroner reason:</span>
					{coronerReasonLabel(data.referral.coronerReason) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Medical-examiner status:</span>
					{medicalExaminerStatusLabel(data.referral.medicalExaminerStatus) || 'N/A'}
				</div>
			</div>
			{#if data.referral.certifierNote}
				<div class="mt-4 text-sm">
					<span class="font-medium text-base-content/70">Certifier note:</span>
					<p class="mt-1 text-base-content/80">{data.referral.certifierNote}</p>
				</div>
			{/if}
		</div>
	</main>
{/if}
