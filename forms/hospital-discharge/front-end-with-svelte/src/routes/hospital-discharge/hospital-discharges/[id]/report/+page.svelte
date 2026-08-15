<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import {
		completenessLabel,
		completenessColor,
		priorityColor,
		calculateAge,
		calculateLengthOfStay,
		destinationLabel,
		careResponsibilityLabel
	} from '#lib/engine/utils.js';
	import Button from '#lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/hospital-discharge/hospital-discharges/${id}`);
		}
	});

	let pdfError = $state('');

	const los = $derived(
		calculateLengthOfStay(data.admissionSummary.admissionDate, data.admissionSummary.dischargeDate)
	);
	const missingRules = $derived(result ? result.firedRules.filter((r) => !r.satisfied) : []);

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/hospital-discharges/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `hospital-discharge-${data.patientDetails.lastName || id}.pdf`;
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
			<h1 class="text-lg font-bold text-base-content">Hospital discharge summary report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/hospital-discharge/hospital-discharges/${id}`)}>Edit</Button>
			</div>
		</div>
	</header>

	<main class="mx-16 px-4 py-6">
		<!-- Completeness banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {completenessColor(result.completenessLevel)}">
			<div class="text-3xl font-bold">{completenessLabel(result.completenessLevel)}</div>
			<div class="mt-2 text-sm">
				Mandatory {result.mandatorySatisfied} of {result.mandatoryTotal} · Optional {result.optionalSatisfied}
				of {result.optionalTotal}
			</div>
			<div class="mt-2 text-sm opacity-75">
				Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Flagged issues -->
		{#if result.additionalFlags.length > 0}
			<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-error">Flagged issues for review</h2>
				<div class="space-y-2">
					{#each result.additionalFlags as flag (flag.id)}
						<div class="flex items-start gap-3 rounded-lg border p-3 {priorityColor(flag.priority)}">
							<span class="mt-0.5 rounded px-2 py-0.5 text-xs font-bold uppercase {priorityColor(flag.priority)}">
								{flag.priority}
							</span>
							<div><span class="font-medium">{flag.category}:</span> {flag.message}</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Outstanding NICE NG27 fields -->
		{#if missingRules.length > 0}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Outstanding NICE NG27 fields</h2>
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b border-base-300 text-left text-base-content/70">
							<th class="pb-2 pr-4">Rule</th>
							<th class="pb-2 pr-4">Category</th>
							<th class="pb-2 pr-4">Field</th>
							<th class="pb-2">Type</th>
						</tr>
					</thead>
					<tbody>
						{#each missingRules as rule (rule.id)}
							<tr class="border-b border-base-200">
								<td class="py-2 pr-4 font-mono text-xs text-base-content/60">{rule.id}</td>
								<td class="py-2 pr-4">{rule.category}</td>
								<td class="py-2 pr-4">{rule.description}</td>
								<td class="py-2">
									<span
										class="rounded px-2 py-0.5 text-xs font-semibold {rule.mandatory
											? 'bg-error text-error-content'
											: 'bg-warning text-warning-content'}"
									>
										{rule.mandatory ? 'Mandatory' : 'Optional'}
									</span>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}

		<!-- Patient summary -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Patient summary</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div><span class="font-medium text-base-content/70">Name:</span> {data.patientDetails.firstName} {data.patientDetails.lastName}</div>
				<div>
					<span class="font-medium text-base-content/70">DOB:</span> {data.patientDetails.dateOfBirth}
					{#if calculateAge(data.patientDetails.dateOfBirth) != null}(Age {calculateAge(data.patientDetails.dateOfBirth)}){/if}
				</div>
				<div><span class="font-medium text-base-content/70">NHS number:</span> {data.patientDetails.nhsNumber || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">GP:</span> {data.patientDetails.gpName} ({data.patientDetails.gpPractice})</div>
				<div><span class="font-medium text-base-content/70">Admitted:</span> {data.admissionSummary.admissionDate || 'N/A'}</div>
				<div>
					<span class="font-medium text-base-content/70">Discharged:</span> {data.admissionSummary.dischargeDate || 'N/A'}
					{#if los != null}({los} day{los === 1 ? '' : 's'}){/if}
				</div>
				<div><span class="font-medium text-base-content/70">Destination:</span> {destinationLabel(data.communityCareInstructions.dischargeDestination)}</div>
				<div><span class="font-medium text-base-content/70">Care responsibility:</span> {careResponsibilityLabel(data.communityCareInstructions.careResponsibility)}</div>
			</div>
		</div>

		<!-- Diagnoses -->
		{#if data.diagnoses.diagnoses.length > 0}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Diagnoses</h2>
				<ul class="list-disc space-y-1 pl-5 text-sm text-base-content/80">
					{#each data.diagnoses.diagnoses as dx (dx.description + dx.icd10)}
						<li>
							<strong>{dx.type === 'primary' ? 'Primary' : 'Secondary'}:</strong>
							{dx.description}{#if dx.icd10} ({dx.icd10}){/if}
						</li>
					{/each}
				</ul>
			</div>
		{/if}

		<!-- Discharge medications -->
		{#if data.dischargeMedications.medications.length > 0}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Discharge medications</h2>
				<ul class="list-disc space-y-1 pl-5 text-sm text-base-content/80">
					{#each data.dischargeMedications.medications as med (med.name + med.dose)}
						<li>
							<strong>{med.name}</strong> {med.dose} {med.route} {med.frequency}{#if med.duration} for {med.duration}{/if}
							{#if med.status}<span class="ml-1 rounded bg-base-200 px-1.5 py-0.5 text-xs">{med.status}</span>{/if}
						</li>
					{/each}
				</ul>
			</div>
		{/if}
	</main>
{/if}
