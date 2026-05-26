<script lang="ts">
	import { goto } from '$app/navigation';
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

	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto('/');
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch('/report/pdf', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `medical-records-release-${data.patientInformation.lastName}-${new Date().toISOString().slice(0, 10)}.pdf`;
				a.click();
				URL.revokeObjectURL(url);
			} else {
				pdfError = 'Failed to generate PDF. Please try again.';
			}
		} catch {
			pdfError = 'Failed to generate PDF. Please check your connection and try again.';
		}
	}

	function startNew() {
		assessment.reset();
		goto('/');
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
	<div class="min-h-screen bg-gray-50">
		<header class="border-b border-gray-200 bg-white shadow-sm no-print">
			<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
				<h1 class="text-lg font-bold text-gray-900">Release Authorization Summary</h1>
				<div class="button-group">
					{#if pdfError}
						<span class="text-sm text-red-600">{pdfError}</span>
					{/if}
					<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
					<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
					<Button data-variant="secondary" onclick={startNew}>New Form</Button>
				</div>
			</div>
		</header>

		<main class="mx-auto max-w-4xl px-4 py-6">
			<div
				class="mb-6 rounded-xl border-2 p-6 text-center {completenessColor(
					result.completenessScore
				)}"
			>
				<div class="text-3xl font-bold">{result.completenessScore}% Complete</div>
				<div class="mt-1 text-lg">
					{result.completenessStatus} - {result.validationStatus}
				</div>
				<div class="mt-2 text-sm opacity-75">
					Generated {new Date(result.timestamp).toLocaleString()}
				</div>
			</div>

			{#if result.additionalFlags.length > 0}
				<Panel label="Flagged Issues for Review" class="mb-6">
					<h2 class="mb-4 text-lg font-bold text-red-800">Flagged Issues for Review</h2>
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
					<h2 class="mb-4 text-lg font-bold text-gray-900">Validation Issues</h2>
					<table class="w-full text-sm">
						<thead>
							<tr class="border-b text-left text-gray-600">
								<th class="pb-2 pr-4">Rule</th>
								<th class="pb-2 pr-4">Section</th>
								<th class="pb-2 pr-4">Issue</th>
							</tr>
						</thead>
						<tbody>
							{#each result.firedRules as rule (rule.id)}
								<tr class="border-b border-gray-100">
									<td class="py-2 pr-4 font-mono text-xs text-gray-500">{rule.id}</td>
									<td class="py-2 pr-4">{rule.domain}</td>
									<td class="py-2 pr-4">{rule.description}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</Panel>
			{/if}

			<Panel label="Patient Details" class="mb-6">
				<h2 class="mb-4 text-lg font-bold text-gray-900">Patient Details</h2>
				<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
					<div>
						<span class="font-medium text-gray-600">Name:</span>
						{data.patientInformation.firstName}
						{data.patientInformation.lastName}
					</div>
					<div>
						<span class="font-medium text-gray-600">DOB:</span>
						{formatDate(data.patientInformation.dateOfBirth)}
						{#if calculateAge(data.patientInformation.dateOfBirth)}
							(Age {calculateAge(data.patientInformation.dateOfBirth)})
						{/if}
					</div>
					<div>
						<span class="font-medium text-gray-600">NHS Number:</span>
						{formatNhsNumber(data.patientInformation.nhsNumber)}
					</div>
					<div>
						<span class="font-medium text-gray-600">Sex:</span>
						{data.patientInformation.sex || 'N/A'}
					</div>
					<div class="sm:col-span-2">
						<span class="font-medium text-gray-600">Address:</span>
						{data.patientInformation.address || 'N/A'}
					</div>
					<div>
						<span class="font-medium text-gray-600">GP:</span>
						{data.patientInformation.gpName || 'N/A'}
					</div>
					<div>
						<span class="font-medium text-gray-600">GP Practice:</span>
						{data.patientInformation.gpPractice || 'N/A'}
					</div>
				</div>
			</Panel>

			<Panel label="Authorized Recipient" class="mb-6">
				<h2 class="mb-4 text-lg font-bold text-gray-900">Authorized Recipient</h2>
				<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
					<div>
						<span class="font-medium text-gray-600">Name:</span>
						{data.authorizedRecipient.recipientName || 'N/A'}
					</div>
					<div>
						<span class="font-medium text-gray-600">Organization:</span>
						{data.authorizedRecipient.recipientOrganization || 'N/A'}
					</div>
					<div class="sm:col-span-2">
						<span class="font-medium text-gray-600">Address:</span>
						{data.authorizedRecipient.recipientAddress || 'N/A'}
					</div>
					<div>
						<span class="font-medium text-gray-600">Role:</span>
						{data.authorizedRecipient.recipientRole || 'N/A'}
					</div>
					<div>
						<span class="font-medium text-gray-600">Email:</span>
						{data.authorizedRecipient.recipientEmail || 'N/A'}
					</div>
				</div>
			</Panel>

			<Panel label="Records & Purpose" class="mb-6">
				<h2 class="mb-4 text-lg font-bold text-gray-900">Records & Purpose</h2>
				<div class="text-sm">
					<div class="mb-3">
						<span class="font-medium text-gray-600">Record Types:</span>
						{#if data.recordsToRelease.recordTypes.length > 0}
							<ul class="mt-1 list-disc pl-5">
								{#each data.recordsToRelease.recordTypes as rt (rt)}
									<li>{getRecordTypeLabel(rt)}</li>
								{/each}
							</ul>
						{:else}
							<span class="text-gray-400">None selected</span>
						{/if}
					</div>
					{#if data.recordsToRelease.specificDateRange === 'yes'}
						<div class="mb-3">
							<span class="font-medium text-gray-600">Date Range:</span>
							{formatDate(data.recordsToRelease.dateFrom)} to
							{formatDate(data.recordsToRelease.dateTo)}
						</div>
					{/if}
					<div>
						<span class="font-medium text-gray-600">Purpose:</span>
						{data.purposeOfRelease.purpose
							? getPurposeLabel(data.purposeOfRelease.purpose)
							: 'N/A'}
						{#if data.purposeOfRelease.purpose === 'other' && data.purposeOfRelease.otherDetails}
							- {data.purposeOfRelease.otherDetails}
						{/if}
					</div>
				</div>
			</Panel>

			<Panel label="Authorization Period" class="mb-6">
				<h2 class="mb-4 text-lg font-bold text-gray-900">Authorization Period</h2>
				<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-3">
					<div>
						<span class="font-medium text-gray-600">Start:</span>
						{formatDate(data.authorizationPeriod.startDate)}
					</div>
					<div>
						<span class="font-medium text-gray-600">End:</span>
						{formatDate(data.authorizationPeriod.endDate)}
					</div>
					<div>
						<span class="font-medium text-gray-600">Single Use:</span>
						{data.authorizationPeriod.singleUse === 'yes'
							? 'Yes'
							: data.authorizationPeriod.singleUse === 'no'
								? 'No'
								: 'N/A'}
					</div>
				</div>
			</Panel>

			<Panel label="Consent & Signature" class="mb-6">
				<h2 class="mb-4 text-lg font-bold text-gray-900">Consent & Signature</h2>
				<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
					<div>
						<span class="font-medium text-gray-600">Patient Consent:</span>
						<span
							class={data.signatureConsent.patientSignatureConfirmed === 'yes'
								? 'text-green-700 font-bold'
								: 'text-red-700 font-bold'}
						>
							{data.signatureConsent.patientSignatureConfirmed === 'yes'
								? 'Confirmed'
								: 'Not Confirmed'}
						</span>
					</div>
					<div>
						<span class="font-medium text-gray-600">Signature Date:</span>
						{formatDate(data.signatureConsent.signatureDate)}
					</div>
					{#if data.signatureConsent.witnessName}
						<div>
							<span class="font-medium text-gray-600">Witness:</span>
							{data.signatureConsent.witnessName}
						</div>
						<div>
							<span class="font-medium text-gray-600">Witness Confirmed:</span>
							{data.signatureConsent.witnessSignatureConfirmed === 'yes' ? 'Yes' : 'No'}
						</div>
					{/if}
					{#if data.signatureConsent.parentGuardianName}
						<div class="sm:col-span-2">
							<span class="font-medium text-gray-600">Parent/Guardian:</span>
							{data.signatureConsent.parentGuardianName}
						</div>
					{/if}
				</div>
			</Panel>
		</main>
	</div>
{/if}
