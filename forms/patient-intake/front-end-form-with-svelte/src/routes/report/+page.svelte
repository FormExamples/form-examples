<script lang="ts">
	import { goto } from '$app/navigation';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { riskLevelLabel, riskLevelColor, calculateAge } from '$lib/engine/utils';
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
				a.download = `patient-intake-${data.personalInformation.fullName.replace(/\s+/g, '-')}-${new Date().toISOString().slice(0, 10)}.pdf`;
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
				<h1 class="text-lg font-bold text-gray-900">Intake Report</h1>
				<div class="button-group">
					{#if pdfError}
						<span class="text-sm text-red-600">{pdfError}</span>
					{/if}
					<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
					<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
					<Button data-variant="secondary" onclick={startNew}>New Intake</Button>
				</div>
			</div>
		</header>

		<main class="mx-auto max-w-4xl px-4 py-6">
			<div class="mb-6 rounded-xl border-2 p-6 text-center {riskLevelColor(result.riskLevel)}">
				<div class="text-3xl font-bold capitalize">{result.riskLevel} Risk</div>
				<div class="mt-1 text-lg">{riskLevelLabel(result.riskLevel)}</div>
				<div class="mt-2 text-sm opacity-75">
					Generated {new Date(result.timestamp).toLocaleString()}
				</div>
			</div>

			{#if result.additionalFlags.length > 0}
				<Panel label="Flagged Issues for Clinician" class="mb-6">
					<h2 class="mb-4 text-lg font-bold text-red-800">Flagged Issues for Clinician</h2>
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
				<Panel label="Risk Classification Justification" class="mb-6">
					<h2 class="mb-4 text-lg font-bold text-gray-900">Risk Classification Justification</h2>
					<table class="w-full text-sm">
						<thead>
							<tr class="border-b text-left text-gray-600">
								<th class="pb-2 pr-4">Rule</th>
								<th class="pb-2 pr-4">Category</th>
								<th class="pb-2 pr-4">Finding</th>
								<th class="pb-2">Risk</th>
							</tr>
						</thead>
						<tbody>
							{#each result.firedRules as rule (rule.id)}
								<tr class="border-b border-gray-100">
									<td class="py-2 pr-4 font-mono text-xs text-gray-500">{rule.id}</td>
									<td class="py-2 pr-4">{rule.category}</td>
									<td class="py-2 pr-4">{rule.description}</td>
									<td class="py-2 capitalize">{rule.riskLevel}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</Panel>
			{/if}

			<Panel label="Patient Summary" class="mb-6">
				<h2 class="mb-4 text-lg font-bold text-gray-900">Patient Summary</h2>
				<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
					<div>
						<span class="font-medium text-gray-600">Name:</span>
						{data.personalInformation.fullName}
					</div>
					<div>
						<span class="font-medium text-gray-600">DOB:</span>
						{data.personalInformation.dateOfBirth}
						{#if calculateAge(data.personalInformation.dateOfBirth)}
							(Age {calculateAge(data.personalInformation.dateOfBirth)})
						{/if}
					</div>
					<div>
						<span class="font-medium text-gray-600">Sex:</span>
						{data.personalInformation.sex}
					</div>
					<div>
						<span class="font-medium text-gray-600">NHS Number:</span>
						{data.insuranceAndId.nhsNumber || 'N/A'}
					</div>
					<div class="sm:col-span-2">
						<span class="font-medium text-gray-600">Reason for Visit:</span>
						{data.reasonForVisit.primaryReason}
						({data.reasonForVisit.urgencyLevel})
					</div>
				</div>
			</Panel>

			{#if data.medications.length > 0}
				<Panel label="Medications" class="mb-6">
					<h2 class="mb-4 text-lg font-bold text-gray-900">Medications</h2>
					<ul class="list-disc space-y-1 pl-5 text-sm">
						{#each data.medications as med (med.name + med.dose)}
							<li>
								{med.name} {med.dose} {med.frequency} (prescribed by {med.prescriber || 'N/A'})
							</li>
						{/each}
					</ul>
				</Panel>
			{/if}

			{#if data.allergies.length > 0}
				<Panel label="Allergies" class="mb-6">
					<h2 class="mb-4 text-lg font-bold text-gray-900">Allergies</h2>
					<ul class="list-disc space-y-1 pl-5 text-sm">
						{#each data.allergies as allergy (allergy.allergen)}
							<li>
								<strong>{allergy.allergen}</strong> ({allergy.allergyType}) - {allergy.reaction}
								{#if allergy.severity}
									<span
										class="ml-1 rounded px-1.5 py-0.5 text-xs {allergy.severity ===
										'anaphylaxis'
											? 'bg-red-100 text-red-700'
											: 'bg-yellow-100 text-yellow-700'}"
									>
										{allergy.severity}
									</span>
								{/if}
							</li>
						{/each}
					</ul>
				</Panel>
			{/if}
		</main>
	</div>
{/if}
