<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import {
		completenessLabel,
		completenessColor,
		priorityLabel,
		priorityColor,
		sectionLabel,
		urgencyLabel,
		calculateAge
	} from '#lib/engine/utils.js';
	import Button from '#lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/provider-transfer-request/provider-transfer-requests/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/provider-transfer-requests/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `provider-transfer-request-${data.patientDemographics.lastName || id}.pdf`;
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
			<h1 class="text-lg font-bold text-base-content">Provider transfer request report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/provider-transfer-request/provider-transfer-requests/${id}`)}>Edit</Button>
			</div>
		</div>
	</header>

	<main class="mx-16 px-4 py-6">
		<!-- Completeness banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {completenessColor(result.validation.completeness)}">
			<div class="text-3xl font-bold">{completenessLabel(result.validation.completeness)}</div>
			<div class="mt-2 text-sm">
				{result.validation.totalSatisfied} of {result.validation.totalRequired} fields answered ·
				{result.validation.mandatorySatisfied} of {result.validation.mandatoryRequired} mandatory ·
				Urgency: {urgencyLabel(data.situation.urgency)}
			</div>
			<div class="mt-2 text-sm opacity-75">
				Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Flagged issues -->
		{#if result.flags.length > 0}
			<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-error">Flagged issues for the receiving team</h2>
				<div class="space-y-2">
					{#each result.flags as flag (flag.id)}
						<div class="flex items-start gap-3 rounded-lg border p-3 {priorityColor(flag.priority)}">
							<span class="mt-0.5 rounded px-2 py-0.5 text-xs font-bold uppercase {priorityColor(flag.priority)}">
								{priorityLabel(flag.priority)}
							</span>
							<div><span class="font-medium">{flag.category}:</span> {flag.message}</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Section completeness -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Section completeness</h2>
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-base-300 text-left text-base-content/70">
						<th class="pb-2 pr-4">Section</th>
						<th class="pb-2 pr-4">Answered</th>
						<th class="pb-2">Missing items</th>
					</tr>
				</thead>
				<tbody>
					{#each result.validation.sections as s (s.section)}
						<tr class="border-b border-base-200 align-top">
							<th scope="row" class="py-2 pr-4 text-left font-medium">{sectionLabel(s.section)}</th>
							<td class="py-2 pr-4">
								{s.satisfied} / {s.required}<br />
								<span class="text-base-content/60">{s.mandatorySatisfied}/{s.mandatoryRequired} mandatory</span>
							</td>
							<td class="py-2">
								{#if s.missing.length === 0}
									<span class="text-base-content/60">All required fields completed.</span>
								{:else}
									<ul class="list-disc space-y-1 pl-5 text-base-content/80">
										{#each s.missing as m (m.id)}
											<li>
												<span class="font-mono text-xs text-base-content/60">{m.id}</span> — {m.description}
												{#if m.mandatory}<strong>(mandatory)</strong>{/if}
											</li>
										{/each}
									</ul>
								{/if}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<!-- Patient & transfer summary -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Patient &amp; transfer summary</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div>
					<span class="font-medium text-base-content/70">Patient:</span>
					{data.patientDemographics.firstName} {data.patientDemographics.lastName}
				</div>
				<div>
					<span class="font-medium text-base-content/70">DOB:</span> {data.patientDemographics.dateOfBirth}
					{#if calculateAge(data.patientDemographics.dateOfBirth)}(Age {calculateAge(data.patientDemographics.dateOfBirth)}){/if}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Primary diagnosis:</span>
					{data.situation.primaryDiagnosis || '—'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Conscious level:</span>
					{data.assessment.consciousLevel || '—'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">From:</span>
					{data.requestingProvider.organisation || '—'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">To:</span>
					{data.receivingProvider.organisation || '—'}
				</div>
			</div>
		</div>
	</main>
{/if}
