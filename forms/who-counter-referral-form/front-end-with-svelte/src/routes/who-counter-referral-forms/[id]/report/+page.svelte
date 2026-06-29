<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import {
		calculateAge,
		followUpTimeframeLabel,
		priorityColor,
		priorityLabel,
		sectionLabel
	} from '$lib/engine/utils';
	import Button from '$lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const validation = $derived(assessment.validation);
	const flags = $derived(assessment.flags);

	$effect(() => {
		if (!assessment.validation) {
			goto(`/who-counter-referral-forms/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/who-counter-referral-forms/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					data: assessment.data,
					validation: assessment.validation,
					flags: assessment.flags
				})
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `who-counter-referral-${data.patientIdentification.patientName || id}.pdf`;
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

{#if validation}
	<header class="border-b border-base-300 bg-base-100 shadow-sm no-print">
		<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
			<h1 class="text-lg font-bold text-base-content">WHO counter-referral report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/who-counter-referral-forms/${id}`)}
					>Edit</Button
				>
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-4xl px-4 py-6">
		<!-- Completeness banner -->
		<div
			class="mb-6 rounded-xl border-2 p-6 text-center {validation.complete
				? 'bg-success text-success-content border-success'
				: 'bg-warning text-warning-content border-warning'}"
		>
			<div class="text-3xl font-bold">
				{validation.complete ? 'Form complete' : 'Form incomplete'}
			</div>
			<div class="mt-2 text-sm">
				{validation.totalSatisfied} of {validation.totalRequired} required fields completed
			</div>
			<div class="mt-2 text-sm opacity-75">Generated {new Date().toLocaleString()}</div>
		</div>

		<!-- Flagged issues -->
		{#if flags.length > 0}
			<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-error">Flagged issues for primary care</h2>
				<div class="space-y-2">
					{#each flags as flag (flag.id)}
						<div class="flex items-start gap-3 rounded-lg border p-3 {priorityColor(flag.priority)}">
							<span
								class="mt-0.5 rounded px-2 py-0.5 text-xs font-bold uppercase {priorityColor(
									flag.priority
								)}"
							>
								{priorityLabel(flag.priority)}
							</span>
							<div><span class="font-medium">{flag.category}:</span> {flag.message}</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Outstanding required fields -->
		{#if validation.missing.length > 0}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Outstanding required fields</h2>
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b border-base-300 text-left text-base-content/70">
							<th class="pb-2 pr-4">Rule</th>
							<th class="pb-2 pr-4">Section</th>
							<th class="pb-2">Required field</th>
						</tr>
					</thead>
					<tbody>
						{#each validation.missing as rule (rule.id)}
							<tr class="border-b border-base-200">
								<td class="py-2 pr-4 font-mono text-xs text-base-content/60">{rule.id}</td>
								<td class="py-2 pr-4">{sectionLabel(rule.section)}</td>
								<td class="py-2">{rule.description}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}

		<!-- Patient summary -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Patient summary</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div>
					<span class="font-medium text-base-content/70">Name:</span>
					{data.patientIdentification.patientName || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">DOB:</span>
					{data.patientIdentification.dateOfBirth || 'N/A'}
					{#if calculateAge(data.patientIdentification.dateOfBirth)}(Age {calculateAge(
							data.patientIdentification.dateOfBirth
						)}){/if}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Sex:</span>
					{data.patientIdentification.sex || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Follow-up:</span>
					{followUpTimeframeLabel(data.facilityDetails.followUpTimeframe)}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Referral facility:</span>
					{data.facilityDetails.referralFacility.name || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Primary care facility:</span>
					{data.facilityDetails.primaryCareFacility.name || 'N/A'}
				</div>
			</div>
		</div>

		<!-- Clinical summary -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Clinical summary</h2>
			<dl class="space-y-3 text-sm">
				<div>
					<dt class="font-medium text-base-content/70">Primary diagnosis</dt>
					<dd class="mt-1 text-base-content/80">{data.situation.primaryDiagnosis || 'N/A'}</dd>
				</div>
				<div>
					<dt class="font-medium text-base-content/70">Final diagnoses</dt>
					<dd class="mt-1 text-base-content/80">{data.assessment.finalDiagnoses || 'N/A'}</dd>
				</div>
				<div>
					<dt class="font-medium text-base-content/70">Follow-up plan</dt>
					<dd class="mt-1 text-base-content/80">{data.recommendations.followUpPlan || 'N/A'}</dd>
				</div>
				<div>
					<dt class="font-medium text-base-content/70">If condition deteriorates</dt>
					<dd class="mt-1 text-base-content/80">
						{data.recommendations.deteriorationInstructions || 'N/A'}
					</dd>
				</div>
			</dl>
		</div>
	</main>
{/if}
