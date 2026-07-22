<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { classifyProblem } from '$lib/engine/nursing-care-plan-rules';
	import {
		completenessLabel,
		completenessColor,
		priorityLabel,
		priorityColor,
		adlCategoryLabel,
		actualOrPotentialLabel,
		linkedRiskLabel,
		metStatusLabel,
		carriedOutLabel,
		nurseRoleLabel,
		planTypeLabel,
		careSettingLabel,
		sexLabel
	} from '$lib/engine/utils';
	import Button from '$lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/nursing-care-plan/nursing-care-plans/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/nursing-care-plans/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `nursing-care-plan-${data.patient.patientIdentifier || id}.pdf`;
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
			<h1 class="text-lg font-bold text-base-content">Nursing care plan report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/nursing-care-plan/nursing-care-plans/${id}`)}>Edit</Button>
			</div>
		</div>
	</header>

	<main class="mx-16 px-4 py-6">
		<!-- Status banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {completenessColor(result.status)}">
			<div class="text-3xl font-bold">{completenessLabel(result.status)}</div>
			<div class="mt-2 text-sm font-semibold">
				Care-plan status · {result.completenessPercent}% complete
			</div>
			<div class="mt-2 text-sm opacity-75">
				Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Plan summary -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Plan summary</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div>
					<span class="font-medium text-base-content/70">Patient ID:</span>
					{data.patient.patientIdentifier || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Patient:</span>
					{data.patient.patientName || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Sex:</span>
					{sexLabel(data.patient.sex) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Plan type:</span>
					{planTypeLabel(data.planContext.planType) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Care setting:</span>
					{careSettingLabel(data.planContext.careSetting) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Authoring nurse:</span>
					{data.planContext.nurseName || 'N/A'}
					{#if nurseRoleLabel(data.planContext.nurseRole)}
						({nurseRoleLabel(data.planContext.nurseRole)})
					{/if}
				</div>
			</div>
		</div>

		<!-- Problems -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Problems ({data.problems.length})</h2>
			{#if data.problems.length === 0}
				<p class="text-sm text-base-content/60">No problems recorded.</p>
			{:else}
				<div class="space-y-4">
					{#each data.problems as p, i (p.id)}
						<div class="rounded-lg border border-base-300 p-4">
							<div class="mb-2 flex items-center justify-between gap-3">
								<h3 class="text-sm font-bold text-base-content">
									Problem {i + 1}: {p.problemStatement || '(no statement)'}
								</h3>
								<span
									class="rounded-full border px-3 py-0.5 text-xs font-bold {completenessColor(
										classifyProblem(p)
									)}"
								>
									{completenessLabel(classifyProblem(p))}
								</span>
							</div>
							<p class="mb-3 text-xs text-base-content/60">
								{adlCategoryLabel(p.adlCategory) || '—'}
								{#if p.actualOrPotential}
									· {actualOrPotentialLabel(p.actualOrPotential)}
								{/if}
								· Linked risk: {linkedRiskLabel(p.linkedRisk) || '—'} · Next review: {p.nextReviewDate ||
									'—'}
							</p>
							<div class="space-y-1 text-sm">
								<div>
									<span class="font-medium text-base-content/70">Goals ({p.goals.length}):</span>
									{#if p.goals.length === 0}
										<span class="text-base-content/60"> none</span>
									{:else}
										<ul class="ml-4 list-disc text-base-content/80">
											{#each p.goals as g (g.id)}
												<li>
													{g.goalText || '(blank)'}
													{#if g.targetDate}(target {g.targetDate}){/if} — {metStatusLabel(g.met) ||
														'not evaluated'}
												</li>
											{/each}
										</ul>
									{/if}
								</div>
								<div>
									<span class="font-medium text-base-content/70"
										>Interventions ({p.interventions.length}):</span
									>
									{#if p.interventions.length === 0}
										<span class="text-base-content/60"> none</span>
									{:else}
										<ul class="ml-4 list-disc text-base-content/80">
											{#each p.interventions as iv (iv.id)}
												<li>
													{iv.interventionText || '(blank)'} — {carriedOutLabel(iv.carriedOut) ||
														'not recorded'}
												</li>
											{/each}
										</ul>
									{/if}
								</div>
								<div>
									<span class="font-medium text-base-content/70">Evaluation:</span>
									<span class="text-base-content/80">
										{p.evaluationNote || '(none recorded)'}
										{#if metStatusLabel(p.goalMet)}
											· {metStatusLabel(p.goalMet)}
										{/if}
									</span>
								</div>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>

		<!-- Flagged issues -->
		{#if result.flags.length > 0}
			<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-error">Flagged issues ({result.flags.length})</h2>
				<div class="space-y-2">
					{#each result.flags as flag (flag.id)}
						<div class="flex items-start gap-3 rounded-lg border p-3 {priorityColor(flag.priority)}">
							<span
								class="mt-0.5 rounded px-2 py-0.5 text-xs font-bold uppercase {priorityColor(
									flag.priority
								)}"
							>
								{priorityLabel(flag.priority)}
							</span>
							<div>
								<span class="font-medium">{flag.category}:</span>
								{flag.message}
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Handover note -->
		{#if data.summary.handoverNote}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Handover note</h2>
				<p class="text-sm text-base-content/80">{data.summary.handoverNote}</p>
			</div>
		{/if}
	</main>
{/if}
