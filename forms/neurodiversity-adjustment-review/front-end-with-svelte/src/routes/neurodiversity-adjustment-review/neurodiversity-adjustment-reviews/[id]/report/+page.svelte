<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { resultStore } from '#lib/stores/result.svelte.js';
	import Badge from '#lib/components/ui/Badge.svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import Alert from '#lib/components/ui/Alert.svelte';
	import {
		effectivenessBandLabel,
		effectivenessBandColor,
		wellbeingRiskBandLabel,
		wellbeingRiskBandColor,
		nextStepUrgencyLabel,
		nextStepUrgencyColor,
		priorityColor,
		effectivenessRatingLabel,
		workerSatisfiedLabel,
		wellbeingChangeLabel,
		reviewStatusLabel,
		reviewMethodLabel,
		managerRoleLabel
	} from '#lib/engine/utils.js';

	const id = $derived(page.params.id);
	const data = $derived(resultStore.data);
	const result = $derived(resultStore.result);

	$effect(() => {
		if (!resultStore.result) {
			goto(`/neurodiversity-adjustment-review/neurodiversity-adjustment-reviews/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/neurodiversity-adjustment-reviews/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: resultStore.data, result: resultStore.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `neurodiversity-adjustment-review-${new Date().toISOString().slice(0, 10)}.pdf`;
				a.click();
				URL.revokeObjectURL(url);
			} else {
				pdfError = 'Failed to generate PDF. Please try again.';
			}
		} catch {
			pdfError = 'Failed to generate PDF. Please check your connection and try again.';
		}
	}

	/** The per-category effectiveness ratings that were rated or marked in place. */
	function effectivenessCategories() {
		const list: { label: string; value: string }[] = [
			{ label: 'Working environment', value: data.effectivenessWorkingEnvironment },
			{ label: 'Equipment or assistive technology', value: data.effectivenessEquipmentTechnology },
			{ label: 'Working arrangements', value: data.effectivenessWorkingArrangements },
			{ label: 'Communication', value: data.effectivenessCommunication },
			{ label: 'Support or mentoring', value: data.effectivenessSupportMentoring },
			{ label: 'Recruitment / assessment process', value: data.effectivenessRecruitmentProcess },
			{ label: 'Policy (dress code / uniform, absence)', value: data.effectivenessPolicyDress },
			{ label: 'Other', value: data.effectivenessOther }
		];
		return list.filter((c) => c.value !== '');
	}
</script>

{#if result}
	<header class="border-b border-base-300 bg-base-100 shadow-sm no-print">
		<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
			<h1 class="text-lg font-bold text-base-content">Neurodiversity adjustment review</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button
					data-variant="secondary"
					onclick={() => goto(`/neurodiversity-adjustment-review/neurodiversity-adjustment-reviews/${id}`)}>Edit</Button
				>
			</div>
		</div>
	</header>

	<main class="mx-16 px-4 py-6">
		<!-- Adjustments-not-working / wellbeing-risk alert -->
		{#if result.wellbeingRiskBand === 'high-risk'}
			<Alert type="error" heading="Wellbeing-risk alert" class="mb-6">
				<p>
					This review reports a high wellbeing risk — an adjustment that is not working, a
					dissatisfied worker, declining wellbeing, or an escalation. Act promptly; adjust the
					adjustments and consider an occupational-health re-referral.
				</p>
			</Alert>
		{/if}

		<!-- Four-axis interpretation grade -->
		<div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
			<div class="rounded-xl border border-base-300 bg-base-100 p-4 text-center">
				<div class="mb-2 text-xs font-semibold uppercase text-base-content/60">Effectiveness</div>
				<Badge
					label={effectivenessBandLabel(result.effectivenessBand)}
					color={effectivenessBandColor(result.effectivenessBand)}
				/>
			</div>
			<div class="rounded-xl border border-base-300 bg-base-100 p-4 text-center">
				<div class="mb-2 text-xs font-semibold uppercase text-base-content/60">Wellbeing risk</div>
				<Badge
					label={wellbeingRiskBandLabel(result.wellbeingRiskBand)}
					color={wellbeingRiskBandColor(result.wellbeingRiskBand)}
				/>
			</div>
			<div class="rounded-xl border border-base-300 bg-base-100 p-4 text-center">
				<div class="mb-2 text-xs font-semibold uppercase text-base-content/60">Completeness</div>
				<div class="text-2xl font-bold text-base-content">{result.completenessPercent}%</div>
			</div>
			<div class="rounded-xl border border-base-300 bg-base-100 p-4 text-center">
				<div class="mb-2 text-xs font-semibold uppercase text-base-content/60">Next step</div>
				<Badge
					label={nextStepUrgencyLabel(result.nextStepUrgency)}
					color={nextStepUrgencyColor(result.nextStepUrgency)}
				/>
				<div class="mt-1 text-xs text-base-content/60">{result.targetTimeframe}</div>
			</div>
		</div>

		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-2 text-lg font-bold text-base-content">Recommendation</h2>
			<p class="text-sm text-base-content/80">{result.recommendationLabel}</p>
			<p class="mt-2 text-xs text-base-content/60">
				Overall recommendation: <span class="font-semibold">{result.recommendation}</span> · Graded
				{new Date(result.gradedAt).toLocaleString()}
			</p>
		</div>

		<!-- Review flags -->
		{#if result.flags.length > 0}
			<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-error">Review flags</h2>
				<div class="space-y-2">
					{#each result.flags as flag (flag.flagId)}
						<div class="flex items-start gap-3 rounded-lg border p-3 {priorityColor(flag.priority)}">
							<span
								class="mt-0.5 rounded px-2 py-0.5 text-xs font-bold uppercase {priorityColor(
									flag.priority
								)}"
							>
								{flag.priority}
							</span>
							<div>
								<span class="font-medium">{flag.category}:</span>
								{flag.description}
								<div class="mt-0.5 text-xs opacity-80">{flag.suggestedAction}</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Review body -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Review</h2>
			<dl class="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
				<div>
					<dt class="font-medium text-base-content/70">Reviewer (manager / HR)</dt>
					<dd>{data.managerName || 'N/A'}</dd>
				</div>
				<div>
					<dt class="font-medium text-base-content/70">Role</dt>
					<dd>{managerRoleLabel(data.managerRole)}</dd>
				</div>
				<div>
					<dt class="font-medium text-base-content/70">Worker</dt>
					<dd>{data.workerName || 'N/A'}</dd>
				</div>
				<div>
					<dt class="font-medium text-base-content/70">Employee reference</dt>
					<dd>{data.employeeReference || 'N/A'}</dd>
				</div>
				<div>
					<dt class="font-medium text-base-content/70">Originating response</dt>
					<dd>{data.responseReference || 'N/A'}</dd>
				</div>
				<div>
					<dt class="font-medium text-base-content/70">Review status</dt>
					<dd>{reviewStatusLabel(data.reviewStatus)}</dd>
				</div>
				<div>
					<dt class="font-medium text-base-content/70">Review method</dt>
					<dd>{reviewMethodLabel(data.reviewMethod)}</dd>
				</div>
				<div>
					<dt class="font-medium text-base-content/70">Review date</dt>
					<dd>{data.reviewDate || 'N/A'}</dd>
				</div>
				<div>
					<dt class="font-medium text-base-content/70">Next review date</dt>
					<dd>{data.nextReviewDate || 'Not set'}</dd>
				</div>
			</dl>

			<h3 class="mt-4 mb-1 font-semibold text-base-content/80">Effectiveness of adjustments</h3>
			{#if effectivenessCategories().length > 0}
				<ul class="list-disc pl-5 text-sm text-base-content/80">
					{#each effectivenessCategories() as c (c.label)}
						<li>{c.label}: {effectivenessRatingLabel(c.value)}</li>
					{/each}
				</ul>
			{:else}
				<p class="text-sm text-base-content/80">No adjustments rated.</p>
			{/if}

			<h3 class="mt-4 mb-1 font-semibold text-base-content/80">Worker experience</h3>
			<p class="text-sm text-base-content/80">
				Satisfaction: {workerSatisfiedLabel(data.workerSatisfied)} · Wellbeing: {wellbeingChangeLabel(
					data.wellbeingChange
				)}
			</p>
			<p class="mt-1 text-sm text-base-content/70">
				Feedback: {data.workerFeedback || 'None recorded'}
			</p>
			<p class="mt-1 text-sm text-base-content/70">
				Remaining barriers: {data.barriersDetail || 'None recorded'}
			</p>

			<h3 class="mt-4 mb-1 font-semibold text-base-content/80">Changes &amp; next steps</h3>
			<p class="text-sm text-base-content/80">
				Changes needed: {data.changesNeeded ? 'Yes' : 'No'} · Occupational-health re-referral: {data.occupationalHealthRereferral
					? 'Yes'
					: 'No'}
			</p>
			<p class="mt-1 text-sm text-base-content/70">
				Changes detail: {data.changesDetail || 'None recorded'}
			</p>
			<p class="mt-1 text-sm text-base-content/70">
				Updated adjustments: {data.updatedAdjustmentsDetail || 'None recorded'}
			</p>

			{#if data.escalated}
				<h3 class="mt-4 mb-1 font-semibold text-base-content/80">Escalation</h3>
				<p class="text-sm text-base-content/80">{data.escalationDetail || 'Escalated.'}</p>
			{/if}

			{#if data.notes}
				<h3 class="mt-4 mb-1 font-semibold text-base-content/80">Notes</h3>
				<p class="text-sm text-base-content/80">{data.notes}</p>
			{/if}
		</div>

		<!-- Fired rules -->
		{#if result.firedRules.length > 0}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Fired rules (audit trail)</h2>
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b text-left text-base-content/70">
							<th class="pb-2 pr-4">Rule</th>
							<th class="pb-2 pr-4">Axis</th>
							<th class="pb-2">Description</th>
						</tr>
					</thead>
					<tbody>
						{#each result.firedRules as rule (rule.ruleId)}
							<tr class="border-b border-base-200">
								<td class="py-2 pr-4 font-mono text-xs text-base-content/60">{rule.ruleId}</td>
								<td class="py-2 pr-4">{rule.axis}</td>
								<td class="py-2">{rule.description}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</main>
{/if}
