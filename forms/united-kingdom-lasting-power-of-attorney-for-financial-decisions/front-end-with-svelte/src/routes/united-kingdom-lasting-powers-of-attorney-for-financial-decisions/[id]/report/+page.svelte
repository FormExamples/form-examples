<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { store } from '$lib/stores/lpa.svelte';
	import {
		decisionModeLabel,
		whenAttorneysCanActLabel,
		bandLabel,
		compositeRiskLabel,
		compositeRiskColor,
		priorityColor
	} from '$lib/validator/labels';
	import Button from '$lib/components/ui/Button.svelte';

	const plural = 'united-kingdom-lasting-powers-of-attorney-for-financial-decisions';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(store.data);
	const result = $derived(store.result);

	const donorFullName = $derived(
		[data.donor.title, data.donor.firstNames, data.donor.lastName]
			.filter((s) => s && s.length > 0)
			.join(' ')
			.trim() || '(unnamed donor)'
	);

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/${plural}/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: store.data, result: store.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `lpa-${data.donor.lastName || id}.pdf`;
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

<header class="border-b border-base-300 bg-base-100 shadow-sm no-print">
	<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
		<h1 class="text-lg font-bold text-base-content">LPA validation report</h1>
		<div class="flex items-center gap-3">
			{#if pdfError}
				<span class="text-sm text-error">{pdfError}</span>
			{/if}
			<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
			<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
			<Button data-variant="secondary" onclick={() => goto(`/${plural}/${id}`)}>Edit</Button>
		</div>
	</div>
</header>

<main class="mx-auto max-w-4xl px-4 py-6">
	<!-- Composite-risk banner -->
	<div class="mb-6 rounded-xl border-2 p-6 text-center {compositeRiskColor(result.compositeRisk)}">
		<div class="text-3xl font-bold">{compositeRiskLabel(result.compositeRisk)} risk</div>
		<div class="mt-2 flex justify-center gap-6 text-sm">
			<span>Validity: {bandLabel(result.validityBand)}</span>
			<span>OPG status: {bandLabel(data.status)}</span>
		</div>
	</div>

	<!-- Fired statutory blockers -->
	{#if result.firedRules.length > 0}
		<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-error">Statutory blockers</h2>
			<div class="space-y-3">
				{#each result.firedRules as rule (rule.ruleId)}
					<div class="rounded-lg border p-3 {priorityColor(rule.priority)}">
						<div class="flex items-start gap-3">
							<span class="mt-0.5 rounded px-2 py-0.5 text-xs font-bold uppercase {priorityColor(rule.priority)}">
								{rule.priority}
							</span>
							<div>
								<div class="font-medium">{rule.message}</div>
								<div class="mt-1 text-sm opacity-80">{rule.remediation}</div>
								<div class="mt-1 font-mono text-xs opacity-70">{rule.ruleId} · {rule.citation}</div>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{:else}
		<div class="mb-6 rounded-xl border border-success/40 bg-base-100 p-6">
			<h2 class="text-lg font-bold text-success">No statutory blockers</h2>
			<p class="mt-1 text-sm text-base-content/70">
				No Mental Capacity Act 2005 or LPA Regulations 2007 blocker rules fired against this deed.
			</p>
		</div>
	{/if}

	<!-- Additional flags -->
	{#if result.additionalFlags.length > 0}
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Additional flags</h2>
			<div class="space-y-2">
				{#each result.additionalFlags as flag (flag.ruleId)}
					<div class="flex items-start gap-3 rounded-lg border p-3 {priorityColor(flag.priority)}">
						<span class="mt-0.5 rounded px-2 py-0.5 text-xs font-bold uppercase {priorityColor(flag.priority)}">
							{flag.priority}
						</span>
						<div>
							<div class="font-medium">{flag.message}</div>
							<div class="mt-1 text-sm opacity-80">{flag.remediation}</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<!-- LPA summary -->
	<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
		<h2 class="mb-4 text-lg font-bold text-base-content">LPA summary</h2>
		<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
			<div><span class="font-medium text-base-content/70">Donor:</span> {donorFullName}</div>
			<div><span class="font-medium text-base-content/70">Donor DOB:</span> {data.donor.dateOfBirth || '—'}</div>
			<div><span class="font-medium text-base-content/70">Decision mode:</span> {decisionModeLabel(data.decisionMode)}</div>
			<div><span class="font-medium text-base-content/70">When attorneys can act:</span> {whenAttorneysCanActLabel(data.whenAttorneysCanAct)}</div>
			<div><span class="font-medium text-base-content/70">Attorneys:</span> {data.attorneys.length}</div>
			<div><span class="font-medium text-base-content/70">Replacement attorneys:</span> {data.replacementAttorneys.length}</div>
			<div><span class="font-medium text-base-content/70">People to notify:</span> {data.peopleToNotify.length}</div>
			<div><span class="font-medium text-base-content/70">OPG reference:</span> {data.opgReferenceNumber || '—'}</div>
		</div>
	</div>

	<!-- Attorneys -->
	{#if data.attorneys.length > 0}
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Attorneys</h2>
			<ul class="list-disc space-y-1 pl-5 text-sm text-base-content/80">
				{#each data.attorneys as a (a.person.id)}
					<li>
						<strong>{[a.person.title, a.person.firstNames, a.person.lastName].filter(Boolean).join(' ')}</strong>
						{#if a.person.isTrustCorporation}<span class="ml-1 rounded bg-base-300 px-1.5 py-0.5 text-xs">trust corporation</span>{/if}
						{#if a.person.dateOfBirth}<span class="opacity-70"> — born {a.person.dateOfBirth}</span>{/if}
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</main>
