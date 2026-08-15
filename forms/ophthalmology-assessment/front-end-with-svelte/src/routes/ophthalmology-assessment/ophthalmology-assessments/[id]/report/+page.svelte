<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import {
		vaGradeLabel,
		vaGradeColor,
		calculateAge,
		iopStatusLabel,
		iopStatusColor
	} from '#lib/engine/utils.js';
	import Badge from '#lib/components/ui/Badge.svelte';
	import Button from '#lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/ophthalmology-assessment/ophthalmology-assessments/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/ophthalmology-assessments/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `ophthalmology-assessment-${data.demographics.lastName || id}.pdf`;
				a.click();
				URL.revokeObjectURL(url);
			} else {
				pdfError = 'Failed to generate PDF. Please try again.';
			}
		} catch {
			pdfError = 'Failed to generate PDF. Please check your connection and try again.';
		}
	}

	const priorityColor: Record<string, string> = {
		high: 'bg-error text-error-content border-error',
		medium: 'bg-warning text-warning-content border-warning',
		low: 'bg-base-300 text-base-content border-base-300'
	};
</script>

{#if result}
	<header class="border-b border-base-300 bg-base-100 shadow-sm no-print">
		<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
			<h1 class="text-lg font-bold text-base-content">Ophthalmology assessment report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/ophthalmology-assessment/ophthalmology-assessments/${id}`)}>Edit</Button>
			</div>
		</div>
	</header>

	<main class="mx-16 px-4 py-6">
		<!-- VA grade banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {vaGradeColor(result.vaGrade)}">
			<div class="text-3xl font-bold">{vaGradeLabel(result.vaGrade)}</div>
			<div class="mt-2 text-sm opacity-75">
				Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Flagged issues -->
		{#if result.additionalFlags.length > 0}
			<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-error">Flagged issues for ophthalmologist</h2>
				<div class="space-y-2">
					{#each result.additionalFlags as flag (flag.id)}
						<div class="flex items-start gap-3 rounded-lg border p-3 {priorityColor[flag.priority]}">
							<span class="mt-0.5 rounded px-2 py-0.5 text-xs font-bold uppercase {priorityColor[flag.priority]}">
								{flag.priority}
							</span>
							<div><span class="font-medium">{flag.category}:</span> {flag.message}</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Fired rules -->
		{#if result.firedRules.length > 0}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">VA grade justification</h2>
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b border-base-300 text-left text-base-content/70">
							<th class="pb-2 pr-4">Rule</th>
							<th class="pb-2 pr-4">System</th>
							<th class="pb-2 pr-4">Finding</th>
							<th class="pb-2">Grade</th>
						</tr>
					</thead>
					<tbody>
						{#each result.firedRules as rule (rule.id)}
							<tr class="border-b border-base-200">
								<td class="py-2 pr-4 font-mono text-xs text-base-content/60">{rule.id}</td>
								<td class="py-2 pr-4">{rule.system}</td>
								<td class="py-2 pr-4">{rule.description}</td>
								<td class="py-2"><Badge grade={rule.grade} /></td>
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
				<div><span class="font-medium text-base-content/70">Name:</span> {data.demographics.firstName} {data.demographics.lastName}</div>
				<div>
					<span class="font-medium text-base-content/70">DOB:</span> {data.demographics.dateOfBirth}
					{#if calculateAge(data.demographics.dateOfBirth)}(Age {calculateAge(data.demographics.dateOfBirth)}){/if}
				</div>
				<div><span class="font-medium text-base-content/70">Sex:</span> {data.demographics.sex}</div>
				<div><span class="font-medium text-base-content/70">Affected eye:</span> {data.chiefComplaint.affectedEye}</div>
				<div class="sm:col-span-2">
					<span class="font-medium text-base-content/70">Primary concern:</span> {data.chiefComplaint.primaryConcern}
				</div>
			</div>
		</div>

		<!-- Visual acuity details -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Visual acuity</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div><span class="font-medium text-base-content/70">Right eye (corrected):</span> {data.visualAcuity.distanceVaRightCorrected || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Left eye (corrected):</span> {data.visualAcuity.distanceVaLeftCorrected || 'N/A'}</div>
				<div>
					<span class="font-medium text-base-content/70">IOP right:</span>
					<span class={iopStatusColor(data.anteriorSegment.iopRight)}>
						{data.anteriorSegment.iopRight ?? 'N/A'} mmHg ({iopStatusLabel(data.anteriorSegment.iopRight)})
					</span>
				</div>
				<div>
					<span class="font-medium text-base-content/70">IOP left:</span>
					<span class={iopStatusColor(data.anteriorSegment.iopLeft)}>
						{data.anteriorSegment.iopLeft ?? 'N/A'} mmHg ({iopStatusLabel(data.anteriorSegment.iopLeft)})
					</span>
				</div>
			</div>
		</div>

		<!-- Medications -->
		{#if data.currentMedications.eyeDrops.length > 0 || data.currentMedications.oralMedications.length > 0}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Medications</h2>
				{#if data.currentMedications.eyeDrops.length > 0}
					<h3 class="mb-2 font-medium text-base-content/80">Eye drops</h3>
					<ul class="mb-3 list-disc space-y-1 pl-5 text-sm text-base-content/80">
						{#each data.currentMedications.eyeDrops as med (med.name)}
							<li>{med.name} {med.dose} {med.frequency}</li>
						{/each}
					</ul>
				{/if}
				{#if data.currentMedications.oralMedications.length > 0}
					<h3 class="mb-2 font-medium text-base-content/80">Oral medications</h3>
					<ul class="list-disc space-y-1 pl-5 text-sm text-base-content/80">
						{#each data.currentMedications.oralMedications as med (med.name)}
							<li>{med.name} {med.dose} {med.frequency}</li>
						{/each}
					</ul>
				{/if}
			</div>
		{/if}

		<!-- Drug allergies -->
		{#if data.currentMedications.ophthalmicDrugAllergies.length > 0}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Ophthalmic drug allergies</h2>
				<ul class="list-disc space-y-1 pl-5 text-sm text-base-content/80">
					{#each data.currentMedications.ophthalmicDrugAllergies as allergy (allergy.allergen)}
						<li>
							<strong>{allergy.allergen}</strong> — {allergy.reaction}
							{#if allergy.severity}
								<span class="ml-1 rounded px-1.5 py-0.5 text-xs {allergy.severity === 'anaphylaxis' ? 'bg-error text-error-content' : 'bg-warning text-warning-content'}">
									{allergy.severity}
								</span>
							{/if}
						</li>
					{/each}
				</ul>
			</div>
		{/if}
	</main>
{/if}
