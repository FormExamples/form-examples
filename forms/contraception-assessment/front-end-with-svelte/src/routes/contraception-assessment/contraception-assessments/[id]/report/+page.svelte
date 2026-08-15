<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { ukmecColor, ukmecCategory, calculateAge } from '#lib/engine/utils.js';
	import { methodLabels } from '#lib/engine/ukmec-rules.js';
	import Button from '#lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/contraception-assessment/contraception-assessments/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/contraception-assessments/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `contraception-assessment-${data.demographics.lastName || id}.pdf`;
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
			<h1 class="text-lg font-bold text-base-content">Contraception assessment report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/contraception-assessment/contraception-assessments/${id}`)}>Edit</Button>
			</div>
		</div>
	</header>

	<main class="mx-16 px-4 py-6">
		<!-- Overall UKMEC banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {ukmecColor(result.overallHighestCategory)}">
			<div class="text-3xl font-bold">UKMEC Category {result.overallHighestCategory}</div>
			<div class="mt-1 text-lg">{ukmecCategory(result.overallHighestCategory)}</div>
			{#if result.preferredMethodCategory !== null}
				<div class="mt-2 text-sm opacity-75">
					Preferred method: UKMEC {result.preferredMethodCategory} — {ukmecCategory(result.preferredMethodCategory)}
				</div>
			{/if}
			<div class="mt-2 text-sm opacity-75">
				Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Flagged issues -->
		{#if result.additionalFlags.length > 0}
			<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-error">Flagged issues for clinician</h2>
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

		<!-- UKMEC categories by method -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">UKMEC categories by method</h2>
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-base-300 text-left text-base-content/70">
						<th class="pb-2 pr-4">Method</th>
						<th class="pb-2 pr-4">Category</th>
						<th class="pb-2">Eligibility</th>
					</tr>
				</thead>
				<tbody>
					{#each result.ukmecResults as methodResult (methodResult.method)}
						<tr class="border-b border-base-200">
							<td class="py-2 pr-4 font-medium">{methodResult.methodLabel}</td>
							<td class="py-2 pr-4">
								<span class="inline-block rounded-full border px-3 py-0.5 text-xs font-bold {ukmecColor(methodResult.category)}">
									UKMEC {methodResult.category}
								</span>
							</td>
							<td class="py-2 text-base-content/70">{ukmecCategory(methodResult.category)}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<!-- UKMEC rule details -->
		{#if result.firedRules.length > 0}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">UKMEC rule details</h2>
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b border-base-300 text-left text-base-content/70">
							<th class="pb-2 pr-4">Rule ID</th>
							<th class="pb-2 pr-4">Condition</th>
							<th class="pb-2 pr-4">Detail</th>
							<th class="pb-2">Category</th>
						</tr>
					</thead>
					<tbody>
						{#each result.firedRules as rule (rule.id)}
							<tr class="border-b border-base-200">
								<td class="py-2 pr-4 font-mono text-xs text-base-content/60">{rule.id}</td>
								<td class="py-2 pr-4">{rule.domain}</td>
								<td class="py-2 pr-4">{rule.description}</td>
								<td class="py-2 font-bold">UKMEC {rule.score}</td>
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
				<div>
					<span class="font-medium text-base-content/70">Current method:</span>
					{data.currentContraception.currentMethod ? (methodLabels[data.currentContraception.currentMethod] ?? data.currentContraception.currentMethod) : 'None'}
				</div>
				{#if data.preferencesPriorities.preferredMethod}
					<div class="sm:col-span-2">
						<span class="font-medium text-base-content/70">Preferred method:</span>
						{methodLabels[data.preferencesPriorities.preferredMethod] ?? data.preferencesPriorities.preferredMethod}
					</div>
				{/if}
				<div><span class="font-medium text-base-content/70">BMI:</span> {data.cardiovascularRisk.bmi ?? 'N/A'}</div>
				<div>
					<span class="font-medium text-base-content/70">Blood pressure:</span>
					{data.cardiovascularRisk.bloodPressureSystolic ?? '?'}/{data.cardiovascularRisk.bloodPressureDiastolic ?? '?'} mmHg
				</div>
			</div>
		</div>
	</main>
{/if}
