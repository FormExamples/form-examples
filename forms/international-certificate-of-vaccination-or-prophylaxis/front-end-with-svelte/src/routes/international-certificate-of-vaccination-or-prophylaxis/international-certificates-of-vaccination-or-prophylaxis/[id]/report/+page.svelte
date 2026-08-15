<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { certificateStore } from '#lib/stores/certificate.svelte.js';
	import {
		diseaseLabel,
		validityStatusLabel,
		validityStatusColor,
		severityColor,
		overallValidityStatus,
		calculateAge
	} from '#lib/engine/utils.js';
	import Button from '#lib/components/ui/Button.svelte';

	const plural = 'international-certificates-of-vaccination-or-prophylaxis';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(certificateStore.data);
	const result = $derived(certificateStore.result);

	$effect(() => {
		if (!certificateStore.result) {
			goto(`/international-certificate-of-vaccination-or-prophylaxis/${plural}/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/${plural}/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: certificateStore.data, result: certificateStore.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `icvp-${data.patient.surname || id}.pdf`;
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
			<h1 class="text-lg font-bold text-base-content">Certificate report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/international-certificate-of-vaccination-or-prophylaxis/${plural}/${id}`)}>Edit</Button>
			</div>
		</div>
	</header>

	<main class="mx-16 px-4 py-6">
		<!-- Overall validity banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {validityStatusColor(overallValidityStatus(result.overallValid))}">
			<div class="text-3xl font-bold">
				{validityStatusLabel(overallValidityStatus(result.overallValid))}
			</div>
			<div class="mt-2 text-sm opacity-75">
				Validated {new Date(result.validityComputedAt).toLocaleString()}
			</div>
		</div>

		<!-- Fired rules -->
		{#if result.firedRules.length > 0}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Fired rules</h2>
				<div class="space-y-2">
					{#each result.firedRules as rule (rule.code)}
						<div class="flex items-start gap-3 rounded-lg border p-3 {severityColor(rule.severity)}">
							<span class="mt-0.5 rounded px-2 py-0.5 text-xs font-bold uppercase {severityColor(rule.severity)}">
								{rule.severity}
							</span>
							<div><span class="font-medium">{rule.code}:</span> {rule.message}</div>
						</div>
					{/each}
				</div>
			</div>
		{:else}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<p class="text-success">All checks passed. The certificate is valid.</p>
			</div>
		{/if}

		<!-- Per-entry validity -->
		{#if result.perEntryValidity.length > 0}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Per-entry computed validity</h2>
				<ul class="list-disc space-y-1 pl-5 text-sm text-base-content/80">
					{#each result.perEntryValidity as v (v.entryIndex)}
						<li>Entry {v.entryIndex}: valid from {v.validFrom || '—'} to {v.validUntil}</li>
					{/each}
				</ul>
			</div>
		{/if}

		<!-- Vaccinee summary -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Vaccinee summary</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div><span class="font-medium text-base-content/70">Name:</span> {data.patient.givenNames} {data.patient.surname}</div>
				<div>
					<span class="font-medium text-base-content/70">DOB:</span> {data.patient.birthDate}
					{#if calculateAge(data.patient.birthDate)}(Age {calculateAge(data.patient.birthDate)}){/if}
				</div>
				<div><span class="font-medium text-base-content/70">Sex:</span> {data.patient.sex || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Nationality:</span> {data.patient.nationalityAsIso31661Alpha3 || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Centre:</span> {data.center.name} ({data.center.countryAsIso31661Alpha3})</div>
				<div><span class="font-medium text-base-content/70">Clinician:</span> {data.clinician.name}</div>
			</div>
		</div>

		<!-- Vaccination entries -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Vaccination entries</h2>
			<ol class="space-y-3 text-sm text-base-content/80">
				{#each data.entries as e (e.entryIndex)}
					<li class="rounded-lg border border-base-300 p-3">
						<div class="font-semibold text-base-content">{diseaseLabel(e.disease)} — {e.vaccineOrProphylaxisName || '—'}</div>
						<div>Vaccinated {e.vaccinationDate || '—'} · {e.manufacturer || '—'} / batch {e.batchNumber || '—'}</div>
						<div>
							Valid from {e.validityStartsOn || '—'} until
							{e.validityIsLifetime === 'yes' || !e.validityEndsOn ? 'lifetime (2016 IHR amendment)' : e.validityEndsOn}
						</div>
					</li>
				{/each}
			</ol>
		</div>
	</main>
{/if}
