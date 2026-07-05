<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { page } from '$app/state';
	import { requestStore } from '$lib/stores/result.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import {
		eligibilityLabel,
		eligibilityColor,
		impactLabel,
		impactColor,
		priorityTierLabel,
		priorityTierColor,
		recommendationLabel,
		recommendationColor,
		priorityColor,
		statusLabel,
		currentImpactLabel,
		conditionList,
		difficultyList,
		adjustmentList
	} from '$lib/engine/utils';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(requestStore.data);
	const result = $derived(requestStore.result);

	// Request → response handoff (producer). Package the worker/manager identity
	// and requested adjustment categories into a same-origin localStorage handoff
	// that the sibling response app consumes to open a pre-filled response.
	const HANDOFF_KEY = 'neurodiversity-adjustment.handoff.v1';
	const ADJUSTMENT_CATEGORY: Record<string, string> = {
		adjustmentWorkingEnvironment: 'working-environment',
		adjustmentEquipmentTechnology: 'equipment-technology',
		adjustmentWorkingArrangements: 'working-arrangements',
		adjustmentCommunication: 'communication',
		adjustmentSupportMentoring: 'support-mentoring',
		adjustmentRecruitmentProcess: 'recruitment-process',
		adjustmentPolicyDress: 'policy-dress',
		adjustmentOther: 'other'
	};
	// Only offer the handoff where both apps are served together (monorepo layout).
	const canHandoff = $derived(
		browser && window.location.pathname.includes('/neurodiversity-adjustment-request/')
	);

	function draftResponse() {
		if (!browser) return;
		const d = requestStore.data as unknown as Record<string, unknown>;
		const requestedCategories = Object.keys(ADJUSTMENT_CATEGORY).filter((k) => d[k] === true).map((k) => ADJUSTMENT_CATEGORY[k]);
		const slug = (data.workerName || 'worker').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 24);
		const now = new Date();
		const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
		const handoff = {
			requestReference: `REQ-${stamp}-${slug || 'worker'}`,
			worker: { name: data.workerName, jobTitle: data.workerJobTitle, department: data.workerDepartment },
			manager: { name: data.managerName, jobTitle: data.managerJobTitle, department: data.managerDepartment },
			requestedCategories,
			createdAt: now.toISOString()
		};
		try {
			localStorage.setItem(HANDOFF_KEY, JSON.stringify(handoff));
		} catch {
			/* ignore */
		}
		// Same-origin transform: swap the sibling form directory and target the
		// response app's new-draft route, preserving any base-path prefix.
		const url = window.location.href
			.replace('/neurodiversity-adjustment-request/', '/neurodiversity-adjustment-response/')
			.replace(/\/neurodiversity-adjustment-requests\/[^/]+\/report[^]*$/, '/neurodiversity-adjustment-responses/new');
		window.location.href = url;
	}

	$effect(() => {
		if (!requestStore.result) {
			goto(`/neurodiversity-adjustment-requests/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/neurodiversity-adjustment-requests/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: requestStore.data, result: requestStore.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `neurodiversity-adjustment-request-${new Date().toISOString().slice(0, 10)}.pdf`;
				a.click();
				URL.revokeObjectURL(url);
			} else {
				pdfError = 'Failed to generate PDF. Please try again.';
			}
		} catch {
			pdfError = 'Failed to generate PDF. Please check your connection and try again.';
		}
	}

	const conditions = $derived(conditionList(data));
	const difficulties = $derived(difficultyList(data));
	const adjustments = $derived(adjustmentList(data));
</script>

{#if result}
	<header class="border-b border-base-300 bg-base-100 shadow-sm no-print">
		<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
			<h1 class="text-lg font-bold text-base-content">Neurodiversity adjustment request — report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				{#if canHandoff}
					<Button data-variant="secondary" onclick={draftResponse}>Draft the employer response →</Button>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/neurodiversity-adjustment-requests/${id}`)}>Edit</Button>
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-4xl px-4 py-6">
		<!-- Wellbeing / duty alert -->
		{#if result.impactBand === 'high-risk'}
			<Alert type="error" heading="High wellbeing risk" class="mb-6">
				<p>
					This request reports a high wellbeing risk (absence / burnout risk or severe impact).
					Handle as a priority and respond without unreasonable delay.
				</p>
			</Alert>
		{:else if result.eligibilityBand === 'likely-covered'}
			<Alert type="warning" heading="Disability duty likely engaged" class="mb-6">
				<p>
					The Equality Act 2010 duty to make reasonable adjustments is likely engaged. Treat this as
					a formal request.
				</p>
			</Alert>
		{/if}

		<!-- Four-axis grade -->
		<div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
			<div class="rounded-xl border border-base-300 bg-base-100 p-4 text-center">
				<div class="mb-2 text-xs font-semibold uppercase text-base-content/60">Eligibility</div>
				<Badge
					label={eligibilityLabel(result.eligibilityBand)}
					color={eligibilityColor(result.eligibilityBand)}
				/>
			</div>
			<div class="rounded-xl border border-base-300 bg-base-100 p-4 text-center">
				<div class="mb-2 text-xs font-semibold uppercase text-base-content/60">Impact / wellbeing</div>
				<Badge label={impactLabel(result.impactBand)} color={impactColor(result.impactBand)} />
			</div>
			<div class="rounded-xl border border-base-300 bg-base-100 p-4 text-center">
				<div class="mb-2 text-xs font-semibold uppercase text-base-content/60">Completeness</div>
				<div class="text-2xl font-bold text-base-content">{result.completenessPercent}%</div>
			</div>
			<div class="rounded-xl border border-base-300 bg-base-100 p-4 text-center">
				<div class="mb-2 text-xs font-semibold uppercase text-base-content/60">Priority</div>
				<Badge label={priorityTierLabel(result.priorityTier)} color={priorityTierColor(result.priorityTier)} />
				<div class="mt-1 text-xs text-base-content/60">{result.targetTimeframe}</div>
			</div>
		</div>

		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-2 text-lg font-bold text-base-content">Recommendation</h2>
			<Badge
				label={recommendationLabel(result.recommendation)}
				color={recommendationColor(result.recommendation)}
			/>
			<p class="mt-2 text-xs text-base-content/60">
				Graded {new Date(result.gradedAt).toLocaleString()}
			</p>
		</div>

		<!-- Compliance and wellbeing flags -->
		{#if result.flags.length > 0}
			<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-error">Compliance and wellbeing flags</h2>
				<div class="space-y-2">
					{#each result.flags as flag (flag.flagId)}
						<div class="flex items-start gap-3 rounded-lg border p-3 {priorityColor(flag.priority)}">
							<span class="mt-0.5 rounded px-2 py-0.5 text-xs font-bold uppercase {priorityColor(flag.priority)}">
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

		<!-- Request body -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Request</h2>
			<dl class="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
				<div><dt class="font-medium text-base-content/70">Worker</dt><dd>{data.workerName || 'N/A'}</dd></div>
				<div><dt class="font-medium text-base-content/70">Job title</dt><dd>{data.workerJobTitle || 'N/A'}</dd></div>
				<div><dt class="font-medium text-base-content/70">Manager / HR contact</dt><dd>{data.managerName || 'N/A'}</dd></div>
				<div><dt class="font-medium text-base-content/70">Status</dt><dd>{statusLabel(data.status)}</dd></div>
				<div><dt class="font-medium text-base-content/70">Diagnosis status</dt><dd>{data.diagnosisStatus || 'N/A'}</dd></div>
				<div><dt class="font-medium text-base-content/70">Current impact</dt><dd>{currentImpactLabel(data.currentImpact)}</dd></div>
				<div><dt class="font-medium text-base-content/70">At risk of absence</dt><dd>{data.atRiskOfAbsence ? 'Yes' : 'No'}</dd></div>
				<div><dt class="font-medium text-base-content/70">Requested urgency</dt><dd>{data.urgency || 'N/A'}</dd></div>
				<div><dt class="font-medium text-base-content/70">Disclosure consent</dt><dd>{data.disclosureConsent ? 'Given' : 'Not given'}</dd></div>
			</dl>

			<h3 class="mt-4 mb-1 font-semibold text-base-content/80">Neurodivergent profile</h3>
			{#if conditions.length > 0}
				<ul class="list-disc pl-5 text-sm text-base-content/80">
					{#each conditions as c (c)}<li>{c}</li>{/each}
				</ul>
			{:else}
				<p class="text-sm text-base-content/80">None recorded</p>
			{/if}

			<h3 class="mt-4 mb-1 font-semibold text-base-content/80">Functional difficulties</h3>
			{#if difficulties.length > 0}
				<ul class="list-disc pl-5 text-sm text-base-content/80">
					{#each difficulties as diff (diff)}<li>{diff}</li>{/each}
				</ul>
			{:else}
				<p class="text-sm text-base-content/80">None recorded</p>
			{/if}

			<h3 class="mt-4 mb-1 font-semibold text-base-content/80">Tasks and situations affected</h3>
			<p class="text-sm text-base-content/80">{data.tasksSituationsAffected || 'Not specified'}</p>

			<h3 class="mt-4 mb-1 font-semibold text-base-content/80">Requested adjustments</h3>
			{#if adjustments.length > 0}
				<ul class="list-disc pl-5 text-sm text-base-content/80">
					{#each adjustments as adj (adj)}<li>{adj}</li>{/each}
				</ul>
			{:else}
				<p class="text-sm text-base-content/80">None recorded</p>
			{/if}

			<h3 class="mt-4 mb-1 font-semibold text-base-content/80">Requested-adjustments detail</h3>
			<p class="text-sm text-base-content/80">{data.adjustmentsRequestedDetail || 'Not specified'}</p>

			<h3 class="mt-4 mb-1 font-semibold text-base-content/80">Worker strengths</h3>
			<p class="text-sm text-base-content/80">{data.workerStrengths || 'Not specified'}</p>

			<h3 class="mt-4 mb-1 font-semibold text-base-content/80">Notes</h3>
			<p class="text-sm text-base-content/80">{data.notes || 'None'}</p>
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
