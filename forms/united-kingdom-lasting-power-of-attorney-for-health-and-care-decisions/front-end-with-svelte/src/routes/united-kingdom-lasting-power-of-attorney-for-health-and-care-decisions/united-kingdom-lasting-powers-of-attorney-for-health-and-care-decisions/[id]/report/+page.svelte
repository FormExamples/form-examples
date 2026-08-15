<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { lpaStore } from '#lib/stores/lpa.svelte.js';
	import { validityStatusLabel, validityStatusColor, severityColor } from '#lib/engine/utils.js';
	import Button from '#lib/components/ui/Button.svelte';

	const plural = 'united-kingdom-lasting-powers-of-attorney-for-health-and-care-decisions';

	const id = $derived(page.params.id ?? 'new');
	const app = $derived(lpaStore.application);
	const v = $derived(lpaStore.validity);

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/${plural}/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ application: lpaStore.application, validity: lpaStore.validity })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `lp1h-${app.donor.familyName || id}.pdf`;
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
		<h1 class="text-lg font-bold text-base-content">LP1H validity report</h1>
		<div class="flex items-center gap-3">
			{#if pdfError}
				<span class="text-sm text-error">{pdfError}</span>
			{/if}
			<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
			<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
			<Button data-variant="secondary" onclick={() => goto(`/united-kingdom-lasting-power-of-attorney-for-health-and-care-decisions/${plural}/${id}`)}>Edit</Button>
		</div>
	</div>
</header>

<main class="mx-16 px-4 py-6">
	<!-- Validity banner -->
	<div class="mb-6 rounded-xl border-2 p-6 text-center {validityStatusColor(v.validityStatus)}">
		<div class="text-3xl font-bold">{validityStatusLabel(v.validityStatus)}</div>
		<div class="mt-2 flex justify-center gap-6 text-sm">
			<span>{v.completenessScore}% complete</span>
			{#if v.effectiveDate}<span>Effective {v.effectiveDate}</span>{/if}
		</div>
		<div class="mt-2 text-sm opacity-75">
			Engine v{v.engineVersion} · generated {new Date(v.computedAt).toLocaleString()}
		</div>
	</div>

	<!-- Fired statutory rules -->
	{#if v.firedRules.length > 0}
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Fired statutory rules</h2>
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-base-300 text-left text-base-content/70">
						<th class="pb-2 pr-4">Severity</th>
						<th class="pb-2 pr-4">Rule</th>
						<th class="pb-2 pr-4">Finding</th>
						<th class="pb-2">Correction</th>
					</tr>
				</thead>
				<tbody>
					{#each v.firedRules as rule (rule.ruleId)}
						<tr class="border-b border-base-200 align-top">
							<td class="py-2 pr-4">
								<span
									class="rounded border px-2 py-0.5 text-xs font-bold uppercase {severityColor(
										rule.severity
									)}"
								>
									{rule.severity}
								</span>
							</td>
							<td class="py-2 pr-4 font-mono text-xs text-base-content/60">{rule.ruleId}</td>
							<td class="py-2 pr-4">{rule.description}</td>
							<td class="py-2 text-base-content/70">{rule.suggestedCorrection}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}

	<!-- Ambiguity / risk flags -->
	{#if v.additionalFlags.length > 0}
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Ambiguity and risk flags</h2>
			<ul class="space-y-2 text-sm">
				{#each v.additionalFlags as flag (flag.flagId)}
					<li class="rounded-lg border border-base-300 bg-base-200 p-3">
						<span class="font-mono text-xs text-base-content/60">{flag.category}</span>
						<span class="ml-1 text-base-content">— {flag.description}</span>
						<p class="mt-1 text-xs text-base-content/60">{flag.suggestedAction}</p>
					</li>
				{/each}
			</ul>
		</div>
	{/if}

	<!-- Donor and certificate provider -->
	<div class="mb-6 grid gap-6 sm:grid-cols-2">
		<div class="rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-2 text-lg font-bold text-base-content">Donor (s.1)</h2>
			<p class="text-base-content">
				{app.donor.title} {app.donor.givenNames} {app.donor.familyName}
			</p>
			<p class="text-xs text-base-content/60">
				DOB {app.donor.birthDate || '—'} · {app.donor.jurisdiction || 'jurisdiction not set'}
			</p>
			<p class="text-xs text-base-content/60">{app.donor.postalAddressAsFullText}</p>
		</div>
		<div class="rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-2 text-lg font-bold text-base-content">Certificate provider (s.10)</h2>
			{#if app.certificateProvider}
				<p class="text-base-content">
					{app.certificateProvider.givenNames} {app.certificateProvider.familyName}
				</p>
				<p class="text-xs text-base-content/60">
					{app.certificateProvider.route || '—'}
					{#if app.certificateProvider.route === 'skill-based'}
						· {app.certificateProvider.profession}
					{/if}
				</p>
			{:else}
				<p class="text-xs text-base-content/60">Not yet nominated.</p>
			{/if}
		</div>
	</div>

	<!-- Attorneys -->
	<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
		<h2 class="mb-2 text-lg font-bold text-base-content">Attorneys (s.2)</h2>
		{#if app.attorneys.length === 0}
			<p class="text-xs text-base-content/60">None named.</p>
		{:else}
			<ol class="list-decimal pl-5 text-sm text-base-content">
				{#each app.attorneys as a, i (i)}
					<li>
						{a.givenNames} {a.familyName} · DOB {a.birthDate || '—'} · {a.relationshipToDonor || '—'}
					</li>
				{/each}
			</ol>
		{/if}
		<p class="mt-2 text-xs text-base-content/60">Decision rule: {app.decisionRule || '—'}</p>
	</div>

	<!-- Life-sustaining treatment and registration -->
	<div class="mb-6 grid gap-6 sm:grid-cols-2">
		<div class="rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-2 text-lg font-bold text-base-content">Life-sustaining treatment (s.5)</h2>
			<p class="text-base-content">{app.lstChoice || '—'}</p>
			<p class="text-xs text-base-content/60">Donor initialled: {app.lstDonorInitialled || '—'}</p>
		</div>
		<div class="rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-2 text-lg font-bold text-base-content">Registration (Part C)</h2>
			<p class="text-base-content">{app.registration.applicantRole || '—'}</p>
			<p class="text-xs text-base-content/60">
				Fee £{app.registration.feeAmountPounds.toFixed(2)} ({app.registration.feeRemission || 'none'})
			</p>
		</div>
	</div>

	{#if app.preferences.length > 0}
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-2 text-lg font-bold text-base-content">Preferences (s.7 — non-binding)</h2>
			<ul class="list-disc pl-5 text-sm text-base-content">
				{#each app.preferences as p, i (i)}
					<li>
						<span class="text-xs uppercase tracking-wide text-base-content/60"
							>[{p.category || 'other'}]</span
						>
						{p.statement}
					</li>
				{/each}
			</ul>
		</div>
	{/if}

	{#if app.instructions.length > 0}
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-2 text-lg font-bold text-base-content">Instructions (s.7 — binding)</h2>
			<ul class="list-disc pl-5 text-sm text-base-content">
				{#each app.instructions as ins, i (i)}
					<li>
						<span class="text-xs uppercase tracking-wide text-base-content/60"
							>[{ins.category || 'other'}]</span
						>
						{ins.statement}
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</main>
