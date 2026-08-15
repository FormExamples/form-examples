<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { ipssScoreColor, calculateAge, qolLabel } from '#lib/engine/utils.js';
	import Button from '#lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/urology-assessment/urology-assessments/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/urology-assessments/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `urology-assessment-${data.demographics.lastName || id}.pdf`;
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
			<h1 class="text-lg font-bold text-base-content">Urology assessment report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/urology-assessment/urology-assessments/${id}`)}>Edit</Button>
			</div>
		</div>
	</header>

	<main class="mx-16 px-4 py-6">
		<!-- IPSS score banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {ipssScoreColor(result.ipssScore)}">
			<div class="text-3xl font-bold">IPSS {result.ipssScore}/35</div>
			<div class="mt-1 text-lg">{result.ipssCategory}</div>
			{#if result.qolScore !== null}
				<div class="mt-2 text-sm">Quality of life: {qolLabel(result.qolScore)} ({result.qolScore}/6)</div>
			{/if}
			<div class="mt-2 text-sm opacity-75">
				Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Flagged issues -->
		{#if result.additionalFlags.length > 0}
			<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-error">Flagged issues for urologist</h2>
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

		<!-- IPSS breakdown -->
		{#if result.firedRules.length > 0}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">IPSS score breakdown</h2>
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b border-base-300 text-left text-base-content/70">
							<th class="pb-2 pr-4">Question</th>
							<th class="pb-2 pr-4">Domain</th>
							<th class="pb-2 pr-4">Item</th>
							<th class="pb-2">Score</th>
						</tr>
					</thead>
					<tbody>
						{#each result.firedRules as rule (rule.id)}
							<tr class="border-b border-base-200">
								<td class="py-2 pr-4 font-mono text-xs text-base-content/60">{rule.id}</td>
								<td class="py-2 pr-4">{rule.domain}</td>
								<td class="py-2 pr-4">{rule.description}</td>
								<td class="py-2 font-bold">{rule.score}/5</td>
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
				<div><span class="font-medium text-base-content/70">Urgency:</span> {data.chiefComplaint.urgency || 'N/A'}</div>
				<div class="sm:col-span-2"><span class="font-medium text-base-content/70">Primary concern:</span> {data.chiefComplaint.primaryConcern || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Duration:</span> {data.chiefComplaint.duration || 'N/A'}</div>
			</div>
		</div>

		<!-- Renal function & labs -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Renal function &amp; lab results</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div><span class="font-medium text-base-content/70">Creatinine:</span> {data.renalFunction.creatinine !== null ? `${data.renalFunction.creatinine} µmol/L` : 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">eGFR:</span> {data.renalFunction.eGFR !== null ? `${data.renalFunction.eGFR} mL/min` : 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">PSA:</span> {data.renalFunction.psa !== null ? `${data.renalFunction.psa} ng/mL` : 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Urinalysis:</span> {data.renalFunction.urinalysis || 'N/A'}</div>
			</div>
		</div>

		<!-- Medications -->
		{#if data.currentMedications.alphaBlockers.length > 0 || data.currentMedications.fiveAlphaReductaseInhibitors.length > 0 || data.currentMedications.anticholinergics.length > 0 || data.currentMedications.otherMedications.length > 0}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Current medications</h2>
				{#if data.currentMedications.alphaBlockers.length > 0}
					<h3 class="text-sm font-semibold text-base-content/70">Alpha blockers</h3>
					<ul class="mb-3 list-disc space-y-1 pl-5 text-sm text-base-content/80">
						{#each data.currentMedications.alphaBlockers as med (med.name)}
							<li>{med.name} {med.dose} {med.frequency}</li>
						{/each}
					</ul>
				{/if}
				{#if data.currentMedications.fiveAlphaReductaseInhibitors.length > 0}
					<h3 class="text-sm font-semibold text-base-content/70">5-alpha reductase inhibitors</h3>
					<ul class="mb-3 list-disc space-y-1 pl-5 text-sm text-base-content/80">
						{#each data.currentMedications.fiveAlphaReductaseInhibitors as med (med.name)}
							<li>{med.name} {med.dose} {med.frequency}</li>
						{/each}
					</ul>
				{/if}
				{#if data.currentMedications.anticholinergics.length > 0}
					<h3 class="text-sm font-semibold text-base-content/70">Anticholinergics</h3>
					<ul class="mb-3 list-disc space-y-1 pl-5 text-sm text-base-content/80">
						{#each data.currentMedications.anticholinergics as med (med.name)}
							<li>{med.name} {med.dose} {med.frequency}</li>
						{/each}
					</ul>
				{/if}
				{#if data.currentMedications.otherMedications.length > 0}
					<h3 class="text-sm font-semibold text-base-content/70">Other medications</h3>
					<ul class="list-disc space-y-1 pl-5 text-sm text-base-content/80">
						{#each data.currentMedications.otherMedications as med (med.name)}
							<li>{med.name} {med.dose} {med.frequency}</li>
						{/each}
					</ul>
				{/if}
			</div>
		{/if}
	</main>
{/if}
