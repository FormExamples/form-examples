<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { authorization } from '$lib/stores/authorization.svelte';
	import {
		validityStatusLabel,
		validityStatusColor,
		completenessStatusLabel,
		primaryPurposeLabel,
		signerRelationshipLabel,
		priorityColor,
		calculateAge,
		recordCategoryLabels
	} from '$lib/engine/utils';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(authorization.data);
	const result = $derived(authorization.result);

	$effect(() => {
		if (!authorization.result) {
			goto(`/united-states-hipaa-authorization-form/united-states-hipaa-authorization-forms/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/united-states-hipaa-authorization-forms/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: authorization.data, result: authorization.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `hipaa-authorization-${data.patient.name || id}.pdf`;
				a.click();
				URL.revokeObjectURL(url);
			} else {
				pdfError = 'Failed to generate PDF. Please try again.';
			}
		} catch {
			pdfError = 'Failed to generate PDF. Please check your connection and try again.';
		}
	}

	const categories = $derived(recordCategoryLabels(data.recordsToDisclose));
</script>

{#if result}
	<header class="border-b border-base-300 bg-base-100 shadow-sm no-print">
		<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
			<h1 class="text-lg font-bold text-base-content">HIPAA authorization report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button
					data-variant="secondary"
					onclick={() => goto(`/united-states-hipaa-authorization-form/united-states-hipaa-authorization-forms/${id}`)}>Edit</Button
				>
			</div>
		</div>
	</header>

	<main class="mx-16 px-4 py-6">
		<!-- Validity banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {validityStatusColor(result.validityStatus)}">
			<div class="text-3xl font-bold">{validityStatusLabel(result.validityStatus)}</div>
			<div class="mt-2 text-sm">
				Completeness {result.completenessScore}% ({completenessStatusLabel(result.completenessStatus)})
			</div>
			<div class="mt-2 text-sm opacity-75">
				Generated {new Date(result.validatedAt).toLocaleString()} · engine v{result.validatorVersion}
			</div>
		</div>

		<!-- Fired rules -->
		{#if result.firedRules.length > 0}
			<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-error">Fired rules</h2>
				<div class="space-y-2">
					{#each result.firedRules as rule (rule.ruleId)}
						<div class="flex items-start gap-3 rounded-lg border p-3 {priorityColor(rule.priority)}">
							<span
								class="mt-0.5 rounded px-2 py-0.5 text-xs font-bold uppercase {priorityColor(rule.priority)}"
							>
								{rule.priority}
							</span>
							<div>
								<span class="font-medium">{rule.ruleId}:</span>
								{rule.description}
								<em class="opacity-75">({rule.citation})</em>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{:else}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<p class="text-sm text-base-content/70">
					No HIPAA rules fired — every core element and required statement is present.
				</p>
			</div>
		{/if}

		<!-- Additional flags -->
		{#if result.additionalFlags.length > 0}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Additional flags</h2>
				<div class="space-y-2">
					{#each result.additionalFlags as flag (flag.flagId)}
						<div class="flex items-start gap-3 rounded-lg border p-3 {priorityColor(flag.priority)}">
							<span
								class="mt-0.5 rounded px-2 py-0.5 text-xs font-bold uppercase {priorityColor(flag.priority)}"
							>
								{flag.priority}
							</span>
							<div><span class="font-medium">{flag.category}:</span> {flag.message}</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Authorization summary -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Authorization summary</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div><span class="font-medium text-base-content/70">Patient:</span> {data.patient.name}</div>
				<div>
					<span class="font-medium text-base-content/70">DOB:</span>
					{data.patient.birthDate ?? 'N/A'}
					{#if calculateAge(data.patient.birthDate)}(Age {calculateAge(data.patient.birthDate)}){/if}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Signed by:</span>
					{signerRelationshipLabel(data.signer.relationship)}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Recipient:</span>
					{data.authorizedRecipient.recipientOrganization ||
						data.authorizedRecipient.recipientName ||
						'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Purpose:</span>
					{primaryPurposeLabel(data.purposeOfDisclosure.primaryPurpose)}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Signature date:</span>
					{data.signatureWitness.signatureDate ?? 'N/A'}
				</div>
			</div>
			<div class="mt-4">
				<span class="font-medium text-base-content/70">PHI categories:</span>
				{#if categories.length > 0}
					{#each categories as cat (cat)}
						<Badge label={cat} color="bg-primary/10 text-primary border-primary" />
					{/each}
				{:else}
					<span class="text-base-content/60">None selected</span>
				{/if}
			</div>
		</div>
	</main>
{/if}
