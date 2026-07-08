<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import {
		completenessColor,
		calculateAge,
		formatDate,
		formatNhsNumber
	} from '$lib/engine/utils';
	import { recordTypeOptions, purposeOptions } from '$lib/engine/validation-rules';
	import Panel from '$lib/components/ui/Panel.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/medical-records-release-permission/medical-records-release-permissions/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/medical-records-release-permissions/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `medical-records-release-${data.patientInformation.lastName || id}.pdf`;
				a.click();
				URL.revokeObjectURL(url);
			} else {
				pdfError = 'Failed to generate PDF. Please try again.';
			}
		} catch {
			pdfError = 'Failed to generate PDF. Please check your connection and try again.';
		}
	}

	function getPurposeLabel(value: string): string {
		return purposeOptions.find((o) => o.value === value)?.label ?? value;
	}

	function getRecordTypeLabel(value: string): string {
		return recordTypeOptions.find((o) => o.value === value)?.label ?? value;
	}

	const priorityType: Record<string, 'error' | 'warning' | 'info'> = {
		high: 'error',
		medium: 'warning',
		low: 'info'
	};
</script>

{#if result}
	<header class="border-b border-base-300 bg-base-100 shadow-sm no-print">
		<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
			<h1 class="text-lg font-bold text-base-content">Release authorisation summary</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button
					data-variant="secondary"
					onclick={() => goto(`/medical-records-release-permission/medical-records-release-permissions/${id}`)}>Edit</Button
				>
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-4xl px-4 py-6">
		<div
			class="mb-6 rounded-xl border-2 p-6 text-center {completenessColor(result.completenessScore)}"
		>
			<div class="text-3xl font-bold">{result.completenessScore}% Complete</div>
			<div class="mt-1 text-lg">
				{result.completenessStatus} — {result.validationStatus}
			</div>
			<div class="mt-2 text-sm opacity-75">
				Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		{#if result.additionalFlags.length > 0}
			<Panel label="Flagged Issues for Review" class="mb-6">
				<h2 class="mb-4 text-lg font-bold text-error">Flagged issues for review</h2>
				{#each result.additionalFlags as flag (flag.category + flag.message)}
					<Alert
						type={priorityType[flag.priority] ?? 'info'}
						heading={`${flag.priority.toUpperCase()} — ${flag.category}`}
					>
						<p>{flag.message}</p>
					</Alert>
				{/each}
			</Panel>
		{/if}

		{#if result.firedRules.length > 0}
			<Panel label="Validation Issues" class="mb-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Validation issues</h2>
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b border-base-300 text-left text-base-content/70">
							<th class="pb-2 pr-4">Rule</th>
							<th class="pb-2 pr-4">Section</th>
							<th class="pb-2 pr-4">Issue</th>
						</tr>
					</thead>
					<tbody>
						{#each result.firedRules as rule (rule.id)}
							<tr class="border-b border-base-200">
								<td class="py-2 pr-4 font-mono text-xs text-base-content/60">{rule.id}</td>
								<td class="py-2 pr-4">{rule.domain}</td>
								<td class="py-2 pr-4">{rule.description}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</Panel>
		{/if}

		<Panel label="Patient Details" class="mb-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Patient details</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div>
					<span class="font-medium text-base-content/70">Name:</span>
					{data.patientInformation.firstName}
					{data.patientInformation.lastName}
				</div>
				<div>
					<span class="font-medium text-base-content/70">DOB:</span>
					{formatDate(data.patientInformation.dateOfBirth)}
					{#if calculateAge(data.patientInformation.dateOfBirth)}
						(Age {calculateAge(data.patientInformation.dateOfBirth)})
					{/if}
				</div>
				<div>
					<span class="font-medium text-base-content/70">NHS Number:</span>
					{formatNhsNumber(data.patientInformation.nhsNumber)}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Sex:</span>
					{data.patientInformation.sex || 'N/A'}
				</div>
				<div class="sm:col-span-2">
					<span class="font-medium text-base-content/70">Address:</span>
					{data.patientInformation.address || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">GP:</span>
					{data.patientInformation.gpName || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">GP Practice:</span>
					{data.patientInformation.gpPractice || 'N/A'}
				</div>
			</div>
		</Panel>

		<Panel label="Authorized Recipient" class="mb-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Authorised recipient</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div>
					<span class="font-medium text-base-content/70">Name:</span>
					{data.authorizedRecipient.recipientName || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Organization:</span>
					{data.authorizedRecipient.recipientOrganization || 'N/A'}
				</div>
				<div class="sm:col-span-2">
					<span class="font-medium text-base-content/70">Address:</span>
					{data.authorizedRecipient.recipientAddress || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Role:</span>
					{data.authorizedRecipient.recipientRole || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Email:</span>
					{data.authorizedRecipient.recipientEmail || 'N/A'}
				</div>
			</div>
		</Panel>

		<Panel label="Records & Purpose" class="mb-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Records &amp; purpose</h2>
			<div class="text-sm">
				<div class="mb-3">
					<span class="font-medium text-base-content/70">Record Types:</span>
					{#if data.recordsToRelease.recordTypes.length > 0}
						<ul class="mt-1 list-disc pl-5">
							{#each data.recordsToRelease.recordTypes as rt (rt)}
								<li>{getRecordTypeLabel(rt)}</li>
							{/each}
						</ul>
					{:else}
						<span class="text-base-content/50">None selected</span>
					{/if}
				</div>
				{#if data.recordsToRelease.specificDateRange === 'yes'}
					<div class="mb-3">
						<span class="font-medium text-base-content/70">Date Range:</span>
						{formatDate(data.recordsToRelease.dateFrom)} to
						{formatDate(data.recordsToRelease.dateTo)}
					</div>
				{/if}
				<div>
					<span class="font-medium text-base-content/70">Purpose:</span>
					{data.purposeOfRelease.purpose ? getPurposeLabel(data.purposeOfRelease.purpose) : 'N/A'}
					{#if data.purposeOfRelease.purpose === 'other' && data.purposeOfRelease.otherDetails}
						- {data.purposeOfRelease.otherDetails}
					{/if}
				</div>
			</div>
		</Panel>

		<Panel label="Authorization Period" class="mb-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Authorisation period</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-3">
				<div>
					<span class="font-medium text-base-content/70">Start:</span>
					{formatDate(data.authorizationPeriod.startDate)}
				</div>
				<div>
					<span class="font-medium text-base-content/70">End:</span>
					{formatDate(data.authorizationPeriod.endDate)}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Single Use:</span>
					{data.authorizationPeriod.singleUse === 'yes'
						? 'Yes'
						: data.authorizationPeriod.singleUse === 'no'
							? 'No'
							: 'N/A'}
				</div>
			</div>
		</Panel>

		<Panel label="Consent & Signature" class="mb-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Consent &amp; signature</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div>
					<span class="font-medium text-base-content/70">Patient Consent:</span>
					<span
						class={data.signatureConsent.patientSignatureConfirmed === 'yes'
							? 'font-bold text-success'
							: 'font-bold text-error'}
					>
						{data.signatureConsent.patientSignatureConfirmed === 'yes'
							? 'Confirmed'
							: 'Not Confirmed'}
					</span>
				</div>
				<div>
					<span class="font-medium text-base-content/70">Signature Date:</span>
					{formatDate(data.signatureConsent.signatureDate)}
				</div>
				{#if data.signatureConsent.witnessName}
					<div>
						<span class="font-medium text-base-content/70">Witness:</span>
						{data.signatureConsent.witnessName}
					</div>
					<div>
						<span class="font-medium text-base-content/70">Witness Confirmed:</span>
						{data.signatureConsent.witnessSignatureConfirmed === 'yes' ? 'Yes' : 'No'}
					</div>
				{/if}
				{#if data.signatureConsent.parentGuardianName}
					<div class="sm:col-span-2">
						<span class="font-medium text-base-content/70">Parent/Guardian:</span>
						{data.signatureConsent.parentGuardianName}
					</div>
				{/if}
			</div>
		</Panel>
	</main>
{/if}
