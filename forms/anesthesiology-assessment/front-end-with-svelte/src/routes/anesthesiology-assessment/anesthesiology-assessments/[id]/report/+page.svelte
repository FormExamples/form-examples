<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import {
		riskLevelLabel,
		riskLevelColor,
		priorityColor,
		asaClassLabel,
		mallampatiLabel,
		bmiCategory,
		calculateAge
	} from '#lib/engine/utils.js';
	import Badge from '#lib/components/ui/Badge.svelte';
	import Button from '#lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/anesthesiology-assessment/anesthesiology-assessments/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/anesthesiology-assessments/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `anesthesiology-assessment-${data.demographics.lastName || id}.pdf`;
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
			<h1 class="text-lg font-bold text-base-content">Anaesthesiology assessment report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/anesthesiology-assessment/anesthesiology-assessments/${id}`)}>Edit</Button>
			</div>
		</div>
	</header>

	<main class="mx-16 px-4 py-6">
		<!-- Overall risk banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {riskLevelColor(result.overallRisk)}">
			<div class="text-3xl font-bold">{riskLevelLabel(result.overallRisk)}</div>
			<div class="mt-2 text-sm opacity-75">
				Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Score summary -->
		<div class="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
			<div class="rounded-xl border border-base-300 bg-base-100 p-4 text-center">
				<div class="text-xs font-medium uppercase tracking-wide text-base-content/60">ASA</div>
				<div class="mt-1 text-xl font-bold text-base-content">
					{result.asa.class ? result.asa.class.toUpperCase() : '—'}{result.asa.emergency ? 'E' : ''}
				</div>
				<div class="mt-1 text-xs text-base-content/70">{riskLevelLabel(result.asa.riskLevel)}</div>
			</div>
			<div class="rounded-xl border border-base-300 bg-base-100 p-4 text-center">
				<div class="text-xs font-medium uppercase tracking-wide text-base-content/60">Mallampati</div>
				<div class="mt-1 text-xl font-bold text-base-content">
					{result.airway.mallampatiClass ? result.airway.mallampatiClass.toUpperCase() : '—'}
				</div>
				<div class="mt-1 text-xs text-base-content/70">{riskLevelLabel(result.airway.riskLevel)}</div>
			</div>
			<div class="rounded-xl border border-base-300 bg-base-100 p-4 text-center">
				<div class="text-xs font-medium uppercase tracking-wide text-base-content/60">RCRI</div>
				<div class="mt-1 text-xl font-bold text-base-content">{result.rcri.score}</div>
				<div class="mt-1 text-xs text-base-content/70">MACE {result.rcri.macePercent}%</div>
			</div>
			<div class="rounded-xl border border-base-300 bg-base-100 p-4 text-center">
				<div class="text-xs font-medium uppercase tracking-wide text-base-content/60">STOP-BANG</div>
				<div class="mt-1 text-xl font-bold text-base-content">{result.stopbang.score} / 8</div>
				<div class="mt-1 text-xs text-base-content/70">{riskLevelLabel(result.stopbang.riskLevel)}</div>
			</div>
		</div>

		<!-- Flagged issues -->
		{#if result.additionalFlags.length > 0}
			<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-error">Flagged issues for the anaesthetist</h2>
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

		<!-- Fired rules -->
		{#if result.firedRules.length > 0}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Risk assessment justification</h2>
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b border-base-300 text-left text-base-content/70">
							<th class="pb-2 pr-4">Rule</th>
							<th class="pb-2 pr-4">Category</th>
							<th class="pb-2 pr-4">Finding</th>
							<th class="pb-2">Risk</th>
						</tr>
					</thead>
					<tbody>
						{#each result.firedRules as rule (rule.id)}
							<tr class="border-b border-base-200">
								<td class="py-2 pr-4 font-mono text-xs text-base-content/60">{rule.id}</td>
								<td class="py-2 pr-4">{rule.category}</td>
								<td class="py-2 pr-4">{rule.description}</td>
								<td class="py-2"><Badge risk={rule.riskLevel} /></td>
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
					<span class="font-medium text-base-content/70">BMI:</span> {data.vitalSigns.bmi ?? 'N/A'}
					{#if data.vitalSigns.bmi}({bmiCategory(data.vitalSigns.bmi)}){/if}
				</div>
				<div><span class="font-medium text-base-content/70">ASA:</span> {asaClassLabel(result.asa.class)}</div>
				<div><span class="font-medium text-base-content/70">Airway:</span> {mallampatiLabel(result.airway.mallampatiClass)}</div>
				<div><span class="font-medium text-base-content/70">Procedure:</span> {data.plannedSurgery.procedureName || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Proposed anaesthesia:</span> {data.plannedSurgery.proposedAnaesthesia || 'N/A'}</div>
			</div>
		</div>

		<!-- Allergies -->
		{#if data.allergies.list.length > 0}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Allergies &amp; adverse reactions</h2>
				<ul class="list-disc space-y-1 pl-5 text-sm text-base-content/80">
					{#each data.allergies.list as allergy (allergy.allergen)}
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
