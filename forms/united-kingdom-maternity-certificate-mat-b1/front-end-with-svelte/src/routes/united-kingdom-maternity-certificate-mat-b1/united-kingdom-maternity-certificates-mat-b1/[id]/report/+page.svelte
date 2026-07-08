<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { priorityLabel } from '$lib/engine/utils';
	import Button from '$lib/components/ui/Button.svelte';

	const plural = 'united-kingdom-maternity-certificates-mat-b1';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/united-kingdom-maternity-certificate-mat-b1/${plural}/${id}`);
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
				a.download = `mat-b1-${data.patientIdentification.patientName || id}.pdf`;
				a.click();
				URL.revokeObjectURL(url);
			} else {
				pdfError = 'Failed to generate PDF. Please try again.';
			}
		} catch {
			pdfError = 'Failed to generate PDF. Please check your connection and try again.';
		}
	}

	const priorityColor: Record<string, string> = {
		urgent: 'bg-error text-error-content border-error',
		high: 'bg-error text-error-content border-error',
		medium: 'bg-warning text-warning-content border-warning',
		low: 'bg-warning text-warning-content border-warning'
	};

	const partLabel = (t: string) =>
		t === 'pre' ? 'Part A — pre-confinement' : t === 'post' ? 'Part B — post-confinement' : 'Not selected';
	const issuerLabel = (t: string) =>
		t === 'doctor' ? 'Doctor' : t === 'midwife' ? 'Registered midwife' : 'Not selected';
</script>

{#if result}
	<header class="border-b border-base-300 bg-base-100 shadow-sm no-print">
		<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
			<h1 class="text-lg font-bold text-base-content">MAT B1 validation report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/united-kingdom-maternity-certificate-mat-b1/${plural}/${id}`)}>Edit</Button>
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-4xl px-4 py-6">
		<!-- Status banner -->
		<div
			class="mb-6 rounded-xl border-2 p-6 text-center {result.complete
				? 'bg-success text-success-content border-success'
				: 'bg-error text-error-content border-error'}"
		>
			<div class="text-3xl font-bold">{result.complete ? 'Complete' : 'Incomplete'}</div>
			<div class="mt-2 flex flex-wrap justify-center gap-6 text-sm">
				<span>{partLabel(result.certificateType)}</span>
				<span>{issuerLabel(result.issuerType)}</span>
				{#if result.weeksBeforeEwc !== null}
					<span>{result.weeksBeforeEwc} weeks before EWC</span>
				{/if}
			</div>
			<div class="mt-2 text-sm opacity-75">
				Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Additional flags -->
		{#if result.additionalFlags.length > 0}
			<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-error">Flagged issues</h2>
				<div class="space-y-2">
					{#each result.additionalFlags as flag (flag.id)}
						<div class="flex items-start gap-3 rounded-lg border p-3 {priorityColor[flag.priority]}">
							<span
								class="mt-0.5 rounded px-2 py-0.5 text-xs font-bold uppercase {priorityColor[flag.priority]}"
							>
								{priorityLabel(flag.priority)}
							</span>
							<div><span class="font-medium">{flag.category}:</span> {flag.message}</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Fired rules -->
		{#if result.firedRules.length > 0}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Validation findings</h2>
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b border-base-300 text-left text-base-content/70">
							<th class="pb-2 pr-4">Rule</th>
							<th class="pb-2 pr-4">Category</th>
							<th class="pb-2 pr-4">Finding</th>
							<th class="pb-2">Priority</th>
						</tr>
					</thead>
					<tbody>
						{#each result.firedRules as rule (rule.id)}
							<tr class="border-b border-base-200">
								<td class="py-2 pr-4 font-mono text-xs text-base-content/60">{rule.id}</td>
								<td class="py-2 pr-4">{rule.category}</td>
								<td class="py-2 pr-4">{rule.message}</td>
								<td class="py-2">{priorityLabel(rule.priority)}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{:else}
			<div class="mb-6 rounded-xl border border-success/40 bg-base-100 p-6">
				<p class="text-sm text-base-content/80">
					No completeness or consistency issues detected.
				</p>
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
				</div>
				<div>
					<span class="font-medium text-base-content/70">NHS number:</span>
					{data.patientIdentification.nhsNumber || 'N/A'}
				</div>
			</div>
		</div>

		<!-- Certificate details -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Certificate details</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div>
					<span class="font-medium text-base-content/70">Certificate number:</span>
					{data.issuer.certificateNumber || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Issue date:</span>
					{data.issuer.issueDate || 'N/A'}
				</div>
				{#if result.certificateType === 'pre'}
					<div>
						<span class="font-medium text-base-content/70">Expected date of confinement:</span>
						{data.preConfinement.expectedDateOfConfinement || 'N/A'}
					</div>
					<div>
						<span class="font-medium text-base-content/70">Examination date:</span>
						{data.preConfinement.examinationDate || 'N/A'}
					</div>
				{:else if result.certificateType === 'post'}
					<div>
						<span class="font-medium text-base-content/70">Baby's date of birth:</span>
						{data.postConfinement.actualDateOfBirth || 'N/A'}
					</div>
					<div>
						<span class="font-medium text-base-content/70">Expected date of confinement:</span>
						{data.postConfinement.expectedDateOfConfinement || 'N/A'}
					</div>
				{/if}
				<div>
					<span class="font-medium text-base-content/70">Duplicate:</span>
					{data.issuer.isDuplicate === 'yes' ? 'Yes' : data.issuer.isDuplicate === 'no' ? 'No' : 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Completed in ink:</span>
					{data.issuer.completedInInk === 'yes' ? 'Yes' : data.issuer.completedInInk === 'no' ? 'No' : 'N/A'}
				</div>
			</div>
		</div>

		<!-- Issuer details -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Issuer details</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div><span class="font-medium text-base-content/70">Issuer type:</span> {issuerLabel(result.issuerType)}</div>
				{#if result.issuerType === 'doctor'}
					<div><span class="font-medium text-base-content/70">Doctor:</span> {data.issuer.doctor.doctorName || 'N/A'}</div>
					<div><span class="font-medium text-base-content/70">Practice:</span> {data.issuer.doctor.practiceName || 'N/A'}</div>
					<div><span class="font-medium text-base-content/70">Address:</span> {data.issuer.doctor.practiceAddress || 'N/A'}</div>
					<div><span class="font-medium text-base-content/70">Stamp applied:</span> {data.issuer.doctor.stampApplied === 'yes' ? 'Yes' : 'No'}</div>
				{:else if result.issuerType === 'midwife'}
					<div><span class="font-medium text-base-content/70">Midwife:</span> {data.issuer.midwife.midwifeName || 'N/A'}</div>
					<div><span class="font-medium text-base-content/70">NMC PIN:</span> {data.issuer.midwife.nmcPin || 'N/A'}</div>
					<div><span class="font-medium text-base-content/70">NMC expiry:</span> {data.issuer.midwife.nmcExpiryDate || 'N/A'}</div>
				{/if}
			</div>
		</div>
	</main>
{/if}
