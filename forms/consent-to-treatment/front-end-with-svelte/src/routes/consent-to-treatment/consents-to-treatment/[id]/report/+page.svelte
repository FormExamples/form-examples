<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { completenessColor, calculateAge } from '$lib/engine/utils';
	import Panel from '$lib/components/ui/Panel.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/consent-to-treatment/consents-to-treatment/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/consents-to-treatment/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `consent-to-treatment-${data.patientInformation.lastName || id}.pdf`;
				a.click();
				URL.revokeObjectURL(url);
			} else {
				pdfError = 'Failed to generate PDF. Please try again.';
			}
		} catch {
			pdfError = 'Failed to generate PDF. Please check your connection and try again.';
		}
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
			<h1 class="text-lg font-bold text-base-content">Consent form summary</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/consent-to-treatment/consents-to-treatment/${id}`)}>Edit</Button>
			</div>
		</div>
	</header>

	<main class="mx-16 px-4 py-6">
		<!-- Completeness banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {completenessColor(result.completenessPercent)}">
			<div class="text-3xl font-bold">{result.completenessPercent}% Complete</div>
			<div class="mt-1 text-lg">{result.status}</div>
			<div class="mt-2 text-sm opacity-75">
				Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Flagged issues -->
		{#if result.additionalFlags.length > 0}
			<Panel label="Flagged issues" class="mb-6">
				<h2 class="mb-4 text-lg font-bold text-error">Flagged issues</h2>
				{#each result.additionalFlags as flag (flag.category + flag.message)}
					<Alert type={priorityType[flag.priority] ?? 'info'} heading={`${flag.priority.toUpperCase()} — ${flag.category}`}>
						<p>{flag.message}</p>
					</Alert>
				{/each}
			</Panel>
		{/if}

		<!-- Missing fields -->
		{#if result.firedRules.length > 0}
			<Panel label="Missing required fields" class="mb-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Missing required fields</h2>
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b border-base-300 text-left text-base-content/70">
							<th class="pb-2 pr-4">Rule</th>
							<th class="pb-2 pr-4">Section</th>
							<th class="pb-2 pr-4">Issue</th>
							<th class="pb-2">Field</th>
						</tr>
					</thead>
					<tbody>
						{#each result.firedRules as rule (rule.id)}
							<tr class="border-b border-base-200">
								<td class="py-2 pr-4 font-mono text-xs text-base-content/60">{rule.id}</td>
								<td class="py-2 pr-4">{rule.section}</td>
								<td class="py-2 pr-4">{rule.description}</td>
								<td class="py-2 font-mono text-xs">{rule.field}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</Panel>
		{/if}

		<!-- Patient summary -->
		<Panel label="Patient summary" class="mb-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Patient summary</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div>
					<span class="font-medium text-base-content/70">Name:</span>
					{data.patientInformation.firstName}
					{data.patientInformation.lastName}
				</div>
				<div>
					<span class="font-medium text-base-content/70">DOB:</span>
					{data.patientInformation.dob}
					{#if calculateAge(data.patientInformation.dob)}
						(Age {calculateAge(data.patientInformation.dob)})
					{/if}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Sex:</span>
					{data.patientInformation.sex}
				</div>
				<div>
					<span class="font-medium text-base-content/70">NHS Number:</span>
					{data.patientInformation.nhsNumber || 'N/A'}
				</div>
				<div class="sm:col-span-2">
					<span class="font-medium text-base-content/70">Address:</span>
					{data.patientInformation.address || 'N/A'}
				</div>
			</div>
		</Panel>

		<!-- Procedure summary -->
		<Panel label="Procedure summary" class="mb-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Procedure summary</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div class="sm:col-span-2">
					<span class="font-medium text-base-content/70">Procedure:</span>
					{data.procedureDetails.procedureName || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Clinician:</span>
					{data.procedureDetails.treatingClinician || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Department:</span>
					{data.procedureDetails.department || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Scheduled Date:</span>
					{data.procedureDetails.scheduledDate || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Admission Required:</span>
					{data.procedureDetails.admissionRequired || 'N/A'}
				</div>
			</div>
		</Panel>

		<!-- Consent status -->
		<Panel label="Consent status" class="mb-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Consent status</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div>
					<span class="font-medium text-base-content/70">Patient Consent:</span>
					<span
						class={data.signatureConsent.patientConsent === 'yes'
							? 'font-bold text-success'
							: 'font-bold text-error'}
					>
						{data.signatureConsent.patientConsent === 'yes'
							? 'Given'
							: data.signatureConsent.patientConsent === 'no'
								? 'Refused'
								: 'Pending'}
					</span>
				</div>
				<div>
					<span class="font-medium text-base-content/70">Signature Date:</span>
					{data.signatureConsent.signatureDate || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Witness:</span>
					{data.signatureConsent.witnessName || 'N/A'} ({data.signatureConsent.witnessRole || 'N/A'})
				</div>
				<div>
					<span class="font-medium text-base-content/70">Clinician:</span>
					{data.signatureConsent.clinicianName || 'N/A'} ({data.signatureConsent.clinicianRole || 'N/A'})
				</div>
			</div>
		</Panel>
	</main>
{/if}
