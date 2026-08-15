<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { resultStore } from '#lib/stores/result.svelte.js';
	import Badge from '#lib/components/ui/Badge.svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import Alert from '#lib/components/ui/Alert.svelte';
	import {
		outcomeClassificationLabel,
		outcomeClassificationColor,
		legalRiskBandLabel,
		legalRiskBandColor,
		followUpUrgencyLabel,
		followUpUrgencyColor,
		priorityColor,
		overallDecisionLabel,
		declineReasonCategoryLabel,
		responseStatusLabel,
		handlingMethodLabel,
		managerRoleLabel
	} from '#lib/engine/utils.js';

	const id = $derived(page.params.id);
	const data = $derived(resultStore.data);
	const result = $derived(resultStore.result);

	$effect(() => {
		if (!resultStore.result) {
			goto(`/neurodiversity-adjustment-response/neurodiversity-adjustment-responses/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/neurodiversity-adjustment-responses/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: resultStore.data, result: resultStore.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `neurodiversity-adjustment-response-${new Date().toISOString().slice(0, 10)}.pdf`;
				a.click();
				URL.revokeObjectURL(url);
			} else {
				pdfError = 'Failed to generate PDF. Please try again.';
			}
		} catch {
			pdfError = 'Failed to generate PDF. Please check your connection and try again.';
		}
	}

	function agreedCategories() {
		const list: string[] = [];
		if (data.agreedWorkingEnvironment) list.push('Working environment');
		if (data.agreedEquipmentTechnology) list.push('Equipment or assistive technology');
		if (data.agreedWorkingArrangements) list.push('Working arrangements');
		if (data.agreedCommunication) list.push('Communication');
		if (data.agreedSupportMentoring) list.push('Support or mentoring');
		if (data.agreedRecruitmentProcess) list.push('Recruitment / assessment process');
		if (data.agreedPolicyDress) list.push('Policy (dress code / uniform, absence)');
		if (data.agreedOther) list.push('Other');
		return list;
	}
</script>

{#if result}
	<header class="border-b border-base-300 bg-base-100 shadow-sm no-print">
		<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
			<h1 class="text-lg font-bold text-base-content">Neurodiversity adjustment response</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button
					data-variant="secondary"
					onclick={() => goto(`/neurodiversity-adjustment-response/neurodiversity-adjustment-responses/${id}`)}>Edit</Button
				>
			</div>
		</div>
	</header>

	<main class="mx-16 px-4 py-6">
		<!-- Discrimination-risk alert -->
		{#if result.legalRiskBand === 'high-risk'}
			<Alert type="error" heading="Discrimination-risk alert" class="mb-6">
				<p>
					Adjustments have been declined for a worker likely covered by the Equality Act 2010
					without adequate justification or alternatives. Reconsider the decision, or record a
					reasonableness justification and offer alternatives before finalising.
				</p>
			</Alert>
		{/if}

		<!-- Four-axis interpretation grade -->
		<div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
			<div class="rounded-xl border border-base-300 bg-base-100 p-4 text-center">
				<div class="mb-2 text-xs font-semibold uppercase text-base-content/60">Outcome</div>
				<Badge
					label={outcomeClassificationLabel(result.outcomeClassification)}
					color={outcomeClassificationColor(result.outcomeClassification)}
				/>
			</div>
			<div class="rounded-xl border border-base-300 bg-base-100 p-4 text-center">
				<div class="mb-2 text-xs font-semibold uppercase text-base-content/60">
					Legal / discrimination risk
				</div>
				<Badge
					label={legalRiskBandLabel(result.legalRiskBand)}
					color={legalRiskBandColor(result.legalRiskBand)}
				/>
			</div>
			<div class="rounded-xl border border-base-300 bg-base-100 p-4 text-center">
				<div class="mb-2 text-xs font-semibold uppercase text-base-content/60">Completeness</div>
				<div class="text-2xl font-bold text-base-content">{result.completenessPercent}%</div>
			</div>
			<div class="rounded-xl border border-base-300 bg-base-100 p-4 text-center">
				<div class="mb-2 text-xs font-semibold uppercase text-base-content/60">
					Follow-up urgency
				</div>
				<Badge
					label={followUpUrgencyLabel(result.followUpUrgency)}
					color={followUpUrgencyColor(result.followUpUrgency)}
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

		<!-- Compliance and risk flags -->
		{#if result.flags.length > 0}
			<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-error">Compliance and risk flags</h2>
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

		<!-- Response body -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Response</h2>
			<dl class="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
				<div>
					<dt class="font-medium text-base-content/70">Responding manager / HR</dt>
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
					<dt class="font-medium text-base-content/70">Originating request</dt>
					<dd>{data.requestReference || 'N/A'}</dd>
				</div>
				<div>
					<dt class="font-medium text-base-content/70">Response status</dt>
					<dd>{responseStatusLabel(data.responseStatus)}</dd>
				</div>
				<div>
					<dt class="font-medium text-base-content/70">Handling method</dt>
					<dd>{handlingMethodLabel(data.handlingMethod)}</dd>
				</div>
				<div>
					<dt class="font-medium text-base-content/70">Overall decision</dt>
					<dd>{overallDecisionLabel(data.overallDecision)}</dd>
				</div>
				<div>
					<dt class="font-medium text-base-content/70">Decline-reason category</dt>
					<dd>{declineReasonCategoryLabel(data.declineReasonCategory)}</dd>
				</div>
				<div>
					<dt class="font-medium text-base-content/70">Effective date</dt>
					<dd>{data.effectiveDate || 'N/A'}</dd>
				</div>
			</dl>

			<h3 class="mt-4 mb-1 font-semibold text-base-content/80">Decision rationale</h3>
			<p class="text-sm text-base-content/80">{data.decisionRationale || 'Not specified'}</p>

			<h3 class="mt-4 mb-1 font-semibold text-base-content/80">Adjustment categories agreed</h3>
			{#if agreedCategories().length > 0}
				<ul class="list-disc pl-5 text-sm text-base-content/80">
					{#each agreedCategories() as c (c)}
						<li>{c}</li>
					{/each}
				</ul>
			{:else}
				<p class="text-sm text-base-content/80">None recorded.</p>
			{/if}
			<p class="mt-1 text-sm text-base-content/70">
				Detail: {data.agreedAdjustmentsDetail || 'None recorded'}
			</p>
			<p class="mt-1 text-sm text-base-content/70">
				Alternatives offered: {data.alternativeAdjustmentsDetail || 'None'}
			</p>

			<h3 class="mt-4 mb-1 font-semibold text-base-content/80">Trial &amp; review</h3>
			<p class="text-sm text-base-content/80">
				Trial period: {data.trialPeriod
					? `Yes${data.trialPeriodWeeks ? ` (${data.trialPeriodWeeks} weeks)` : ''}`
					: 'No'}
			</p>
			<p class="mt-1 text-sm text-base-content/70">
				Review scheduled: {data.reviewScheduled
					? `Yes${data.reviewDate ? ` — ${data.reviewDate}` : ''}`
					: 'No'}
			</p>

			<h3 class="mt-4 mb-1 font-semibold text-base-content/80">Support &amp; responsibilities</h3>
			<p class="text-sm text-base-content/80">
				Occupational health referred: {data.occupationalHealthReferred ? 'Yes' : 'No'} · Access to
				Work: {data.accessToWorkReferred ? 'Yes' : 'No'}
			</p>
			<p class="mt-1 text-sm text-base-content/70">
				Support resources: {data.supportResourcesDetail || 'None recorded'}
			</p>
			<p class="mt-1 text-sm text-base-content/70">
				Responsibilities: {data.responsibilitiesDetail || 'None recorded'}
			</p>
			<p class="mt-1 text-sm text-base-content/70">
				Point of contact: {data.pointOfContact || 'N/A'}
			</p>

			{#if data.escalated}
				<h3 class="mt-4 mb-1 font-semibold text-base-content/80">Escalation</h3>
				<p class="text-sm text-base-content/80">{data.escalationDetail || 'Escalated.'}</p>
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
