<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import {
		statusLabel,
		statusColor,
		riskLevelLabel,
		riskLevelColor,
		priorityLabel,
		priorityColor,
		documentedColor,
		clinicianRoleLabel,
		careSettingLabel,
		sexLabel,
		ageBandLabel
	} from '$lib/engine/utils';
	import Button from '$lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/mental-state-examination/mental-state-examinations/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/mental-state-examinations/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `mse-${data.identification.patientIdentifier || id}.pdf`;
				a.click();
				URL.revokeObjectURL(url);
			} else {
				pdfError = 'Failed to generate PDF. Please try again.';
			}
		} catch {
			pdfError = 'Failed to generate PDF. Please check your connection and try again.';
		}
	}

	const documentedCount = $derived(
		result ? result.domainStatuses.filter((d) => d.documented).length : 0
	);
</script>

{#if result}
	<header class="border-b border-base-300 bg-base-100 shadow-sm no-print">
		<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
			<h1 class="text-lg font-bold text-base-content">MSE report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button
					data-variant="secondary"
					onclick={() => goto(`/mental-state-examination/mental-state-examinations/${id}`)}>Edit</Button
				>
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-4xl px-4 py-6">
		<!-- Completeness + risk banner -->
		<div class="mb-6 grid gap-4 sm:grid-cols-2">
			<div class="rounded-xl border-2 p-6 text-center {statusColor(result.status)}">
				<div class="text-3xl font-bold">{statusLabel(result.status)}</div>
				<div class="mt-2 text-sm font-semibold">
					{documentedCount} of {result.domainStatuses.length} ASEPTIC domains documented ({result.completenessPercent}%)
				</div>
			</div>
			<div class="rounded-xl border-2 p-6 text-center {riskLevelColor(result.riskLevel)}">
				<div class="text-3xl font-bold">Risk: {riskLevelLabel(result.riskLevel)}</div>
				<div class="mt-2 text-sm font-semibold">
					{result.flags.length
						? `${result.flags.length} safety ${result.flags.length === 1 ? 'flag' : 'flags'} raised`
						: 'No safety flags raised'}
				</div>
			</div>
		</div>

		<div class="mb-6 text-center text-sm text-base-content/60">
			Generated {new Date(result.timestamp).toLocaleString()}
		</div>

		<!-- Interpretation -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-2 text-lg font-bold text-base-content">Interpretation</h2>
			<p class="text-sm text-base-content/80">
				{#if result.status === 'complete'}
					All seven ASEPTIC domains are documented — the examination record is
					<strong>complete</strong>.
				{:else}
					{result.domainStatuses.length - documentedCount} of {result.domainStatuses.length} ASEPTIC
					domains are undocumented — the examination record is <strong>partial</strong>. Complete
					the outstanding domains so the mental state record is whole.
				{/if}
				{#if result.riskLevel === 'none'}
					No safety flags were raised.
				{:else}
					The risk indicator is <strong>{riskLevelLabel(result.riskLevel)}</strong>, driven by the
					highest-priority safety flag raised. This is not a diagnosis and does not replace a full
					risk assessment.
				{/if}
			</p>
		</div>

		<!-- Domain documentation -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">ASEPTIC domain documentation</h2>
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-base-300 text-left text-base-content/70">
						<th class="pb-2 pr-4">Domain</th>
						<th class="pb-2">Documented</th>
					</tr>
				</thead>
				<tbody>
					{#each result.domainStatuses as d (d.domain)}
						<tr class="border-b border-base-200">
							<td class="py-2 pr-4">{d.label}</td>
							<td class="py-2">
								<span
									class="rounded-full border px-2 py-0.5 text-xs font-bold {documentedColor(
										d.documented
									)}">{d.documented ? 'Documented' : 'Outstanding'}</span
								>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<!-- Flagged issues -->
		{#if result.flags.length > 0}
			<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-error">
					Flagged issues ({result.flags.length})
				</h2>
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
								{flag.description} — {flag.suggestedAction}
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Patient / context summary -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Examination summary</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div>
					<span class="font-medium text-base-content/70">Patient ID:</span>
					{data.identification.patientIdentifier || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Age band:</span>
					{ageBandLabel(data.identification.ageBand) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Sex:</span>
					{sexLabel(data.identification.sex) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Care setting:</span>
					{careSettingLabel(data.context.careSetting) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Clinician:</span>
					{data.context.clinicianName || 'N/A'}
					{#if clinicianRoleLabel(data.context.clinicianRole)}
						({clinicianRoleLabel(data.context.clinicianRole)})
					{/if}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Assessed at:</span>
					{data.context.assessedAt || 'N/A'}
				</div>
			</div>
			{#if data.context.assessmentReason}
				<div class="mt-4 text-sm">
					<span class="font-medium text-base-content/70">Reason for assessment:</span>
					<p class="mt-1 text-base-content/80">{data.context.assessmentReason}</p>
				</div>
			{/if}
			{#if data.summary.clinicalFormulation}
				<div class="mt-4 text-sm">
					<span class="font-medium text-base-content/70">Clinical formulation:</span>
					<p class="mt-1 text-base-content/80">{data.summary.clinicalFormulation}</p>
				</div>
			{/if}
		</div>
	</main>
{/if}
