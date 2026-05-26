<script lang="ts">
	import { goto } from '$app/navigation';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { completenessColor, calculateAge } from '$lib/engine/utils';
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
				a.download = `consent-to-treatment-${data.patientInformation.lastName}-${new Date().toISOString().slice(0, 10)}.pdf`;
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
				<h1 class="text-lg font-bold text-gray-900">Consent Form Summary</h1>
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
			<!-- Completeness Banner -->
			<div
				class="mb-6 rounded-xl border-2 p-6 text-center {completenessColor(
					result.completenessPercent
				)}"
			>
				<div class="text-3xl font-bold">{result.completenessPercent}% Complete</div>
				<div class="mt-1 text-lg">{result.status}</div>
				<div class="mt-2 text-sm opacity-75">
					Generated {new Date(result.timestamp).toLocaleString()}
				</div>
			</div>

			<!-- Additional Flags -->
			{#if result.additionalFlags.length > 0}
				<Panel label="Flagged Issues" class="mb-6">
					<h2 class="mb-4 text-lg font-bold text-red-800">Flagged Issues</h2>
					{#each result.additionalFlags as flag (flag.category + flag.message)}
						<Alert type={priorityType[flag.priority] ?? 'info'} heading={`${flag.priority.toUpperCase()} — ${flag.category}`}>
							<p>{flag.message}</p>
						</Alert>
					{/each}
				</Panel>
			{/if}

			<!-- Missing Fields -->
			{#if result.firedRules.length > 0}
				<Panel label="Missing Required Fields" class="mb-6">
					<h2 class="mb-4 text-lg font-bold text-gray-900">Missing Required Fields</h2>
					<table class="w-full text-sm">
						<thead>
							<tr class="border-b text-left text-gray-600">
								<th class="pb-2 pr-4">Rule</th>
								<th class="pb-2 pr-4">Section</th>
								<th class="pb-2 pr-4">Issue</th>
								<th class="pb-2">Field</th>
							</tr>
						</thead>
						<tbody>
							{#each result.firedRules as rule (rule.id)}
								<tr class="border-b border-gray-100">
									<td class="py-2 pr-4 font-mono text-xs text-gray-500">{rule.id}</td>
									<td class="py-2 pr-4">{rule.section}</td>
									<td class="py-2 pr-4">{rule.description}</td>
									<td class="py-2 font-mono text-xs">{rule.field}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</Panel>
			{/if}

			<!-- Patient Summary -->
			<Panel label="Patient Summary" class="mb-6">
				<h2 class="mb-4 text-lg font-bold text-gray-900">Patient Summary</h2>
				<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
					<div>
						<span class="font-medium text-gray-600">Name:</span>
						{data.patientInformation.firstName}
						{data.patientInformation.lastName}
					</div>
					<div>
						<span class="font-medium text-gray-600">DOB:</span>
						{data.patientInformation.dob}
						{#if calculateAge(data.patientInformation.dob)}
							(Age {calculateAge(data.patientInformation.dob)})
						{/if}
					</div>
					<div>
						<span class="font-medium text-gray-600">Sex:</span>
						{data.patientInformation.sex}
					</div>
					<div>
						<span class="font-medium text-gray-600">NHS Number:</span>
						{data.patientInformation.nhsNumber || 'N/A'}
					</div>
					<div class="sm:col-span-2">
						<span class="font-medium text-gray-600">Address:</span>
						{data.patientInformation.address || 'N/A'}
					</div>
				</div>
			</Panel>

			<!-- Procedure Summary -->
			<Panel label="Procedure Summary" class="mb-6">
				<h2 class="mb-4 text-lg font-bold text-gray-900">Procedure Summary</h2>
				<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
					<div class="sm:col-span-2">
						<span class="font-medium text-gray-600">Procedure:</span>
						{data.procedureDetails.procedureName || 'N/A'}
					</div>
					<div>
						<span class="font-medium text-gray-600">Clinician:</span>
						{data.procedureDetails.treatingClinician || 'N/A'}
					</div>
					<div>
						<span class="font-medium text-gray-600">Department:</span>
						{data.procedureDetails.department || 'N/A'}
					</div>
					<div>
						<span class="font-medium text-gray-600">Scheduled Date:</span>
						{data.procedureDetails.scheduledDate || 'N/A'}
					</div>
					<div>
						<span class="font-medium text-gray-600">Admission Required:</span>
						{data.procedureDetails.admissionRequired || 'N/A'}
					</div>
				</div>
			</Panel>

			<!-- Consent Status -->
			<Panel label="Consent Status" class="mb-6">
				<h2 class="mb-4 text-lg font-bold text-gray-900">Consent Status</h2>
				<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
					<div>
						<span class="font-medium text-gray-600">Patient Consent:</span>
						<span
							class={data.signatureConsent.patientConsent === 'yes'
								? 'text-green-700 font-bold'
								: 'text-red-700 font-bold'}
						>
							{data.signatureConsent.patientConsent === 'yes'
								? 'Given'
								: data.signatureConsent.patientConsent === 'no'
									? 'Refused'
									: 'Pending'}
						</span>
					</div>
					<div>
						<span class="font-medium text-gray-600">Signature Date:</span>
						{data.signatureConsent.signatureDate || 'N/A'}
					</div>
					<div>
						<span class="font-medium text-gray-600">Witness:</span>
						{data.signatureConsent.witnessName || 'N/A'} ({data.signatureConsent.witnessRole ||
							'N/A'})
					</div>
					<div>
						<span class="font-medium text-gray-600">Clinician:</span>
						{data.signatureConsent.clinicianName || 'N/A'} ({data.signatureConsent.clinicianRole ||
							'N/A'})
					</div>
				</div>
			</Panel>
		</main>
	</div>
{/if}
