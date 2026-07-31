<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import {
		acuityColor,
		acuityLabel,
		escalationStatusLabel,
		noteTypeLabel,
		priorityColor,
		priorityLabel,
		statusColor,
		statusLabel,
		vteStatusLabel
	} from '$lib/engine/utils';
	import Button from '$lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	/** Acuity rules only, for the "why this band" section. */
	const acuityRules = $derived(result ? result.firedRules.filter((r) => r.engine === 'acuity') : []);

	$effect(() => {
		if (!assessment.result) {
			goto(`${base}/inpatient-clinical-note/inpatient-clinical-notes/${id}`);
		}
	});

	let pdfError = $state('');

	/** Lily-token classes for a component-presence badge. */
	function presentColor(present: boolean): string {
		return present
			? 'bg-success text-success-content border-success'
			: 'bg-error text-error-content border-error';
	}

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(
				`${base}/inpatient-clinical-note/inpatient-clinical-notes/${id}/report/pdf`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ data: assessment.data, result: assessment.result })
				}
			);
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `inpatient-clinical-note-${data.admission.hospitalMrn || id}.pdf`;
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
			<h1 class="text-lg font-bold text-base-content">Inpatient clinical note report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button
					data-variant="secondary"
					onclick={() => goto(`${base}/inpatient-clinical-note/inpatient-clinical-notes/${id}`)}
				>
					Edit
				</Button>
			</div>
		</div>
	</header>

	<main class="mx-16 px-4 py-6">
		<!-- Both gradings, side by side: they answer different questions. -->
		<div class="mb-6 grid gap-4 sm:grid-cols-2">
			<div class="rounded-xl border-2 p-6 text-center {statusColor(result.status)}">
				<div class="text-sm font-semibold uppercase opacity-80">Completeness</div>
				<div class="text-3xl font-bold">{statusLabel(result.status)}</div>
				<div class="mt-2 text-sm font-semibold">
					{result.documentedRequired} of {result.totalRequired} required components documented ({result.completenessPercent}%)
				</div>
			</div>
			<div class="rounded-xl border-2 p-6 text-center {acuityColor(result.acuityBand)}">
				<div class="text-sm font-semibold uppercase opacity-80">Clinical acuity</div>
				<div class="text-3xl font-bold">{acuityLabel(result.acuityBand)}</div>
				<div class="mt-2 text-sm font-semibold">
					{result.news2Total === null ? 'NEWS2 not recorded' : `NEWS2 ${result.news2Total}`}
				</div>
			</div>
		</div>

		{#if result.acuityOverridden}
			<div class="mb-6 rounded-xl border border-warning bg-base-100 p-4 text-sm">
				The author overrode the computed acuity band of
				<strong>{acuityLabel(result.computedAcuityBand)}</strong>
				to <strong>{acuityLabel(result.acuityBand)}</strong>. Both are recorded.
				{#if data.signOff.authorOverrideReason}
					<span class="mt-1 block text-base-content/70">
						Reason: {data.signOff.authorOverrideReason}
					</span>
				{/if}
			</div>
		{/if}

		<div class="mb-6 text-center text-sm text-base-content/60">
			Generated {new Date(result.timestamp).toLocaleString()}
			{#if data.header.noteType}
				— {noteTypeLabel(data.header.noteType)}
			{/if}
		</div>

		<!-- Interpretation -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-2 text-lg font-bold text-base-content">Interpretation</h2>
			<p class="text-sm text-base-content/80">
				{#if result.status === 'complete'}
					All {result.totalRequired} components required for this note type are documented. The entry
					stands alone — another clinician can safely continue care. A <strong>Complete</strong>
					grade means the record is well documented, not that the clinical care was correct.
				{:else if result.status === 'partial'}
					The header, the impression, and the plan are documented, but one or more other required
					components are missing. The entry is usable but has documentation gaps — complete the
					outstanding components.
				{:else}
					The <strong>header, the impression, or the plan is missing</strong>, or fewer than half the
					required components are documented. The entry cannot safely stand alone. Record the
					missing components before it is used to continue care.
				{/if}
			</p>
			<p class="mt-3 text-sm text-base-content/70">
				The acuity band transcribes the published RCP NEWS2 escalation thresholds and the recorded
				deterioration markers into a band, taking the worst finding. It is not a diagnosis and not a
				deterioration prediction.
			</p>
		</div>

		<!-- Note component presence -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Note component presence</h2>
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-base-300 text-left text-base-content/70">
						<th class="pb-2 pr-4">Component</th>
						<th class="pb-2 pr-4">Class</th>
						<th class="pb-2">Presence</th>
					</tr>
				</thead>
				<tbody>
					{#each result.componentStatuses as c (c.component)}
						<tr class="border-b border-base-200">
							<td class="py-2 pr-4">{c.label}</td>
							<td class="py-2 pr-4 text-base-content/70">
								{c.required ? 'Required' : 'Recommended'}
							</td>
							<td class="py-2">
								<span
									class="rounded-full border px-2 py-0.5 text-xs font-bold {presentColor(c.present)}"
									>{c.present ? 'Documented' : 'Absent'}</span
								>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
			<p class="mt-3 text-xs text-base-content/60">
				Which components are required depends on the note type — see the domain spec §4.2.
			</p>
		</div>

		<!-- Why this acuity band -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">
				Acuity rules fired ({acuityRules.length})
			</h2>
			{#if acuityRules.length === 0}
				<p class="text-sm text-base-content/70">
					No acuity rule fired — the band defaults to Stable. A note with no observations recorded
					fires no NEWS2 rule at all.
				</p>
			{:else}
				<ul class="space-y-2 text-sm">
					{#each acuityRules as r (r.id)}
						<li class="flex items-start gap-3">
							<span
								class="mt-0.5 rounded border px-2 py-0.5 text-xs font-bold uppercase {acuityColor(
									r.band || 'stable'
								)}"
							>
								{acuityLabel(r.band || 'stable')}
							</span>
							<span><span class="font-medium">{r.id}:</span> {r.description}</span>
						</li>
					{/each}
				</ul>
			{/if}
		</div>

		<!-- Safety flags -->
		{#if result.flags.length > 0}
			<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-error">Safety flags ({result.flags.length})</h2>
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

		<!-- Note summary -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Note summary</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div>
					<span class="font-medium text-base-content/70">Note type:</span>
					{noteTypeLabel(data.header.noteType) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Note at:</span>
					{data.header.noteAt || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Patient:</span>
					{data.admission.patientName || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Patient ID:</span>
					{data.admission.hospitalMrn || data.admission.nhsNumber || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Ward:</span>
					{data.header.wardName || 'N/A'}
					{#if data.header.bedNumber}({data.header.bedNumber}){/if}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Admitted:</span>
					{data.admission.admissionAt || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Author:</span>
					{data.header.authorName || 'N/A'}
					{#if data.header.authorGrade}({data.header.authorGrade}){/if}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Responsible consultant:</span>
					{data.header.responsibleConsultantName || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">VTE assessment:</span>
					{vteStatusLabel(data.risks.vteStatus) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Escalation status:</span>
					{escalationStatusLabel(data.planning.escalationStatus) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Problems on the list:</span>
					{data.problems.rows.length}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Outstanding jobs:</span>
					{data.planning.jobs.filter((j) => j.status !== 'done' && j.status !== 'cancelled').length}
				</div>
			</div>

			{#if data.assessment.clinicalImpression}
				<div class="mt-4 text-sm">
					<span class="font-medium text-base-content/70">Clinical impression:</span>
					<p class="mt-1 text-base-content/80">{data.assessment.clinicalImpression}</p>
				</div>
			{/if}

			{#if data.planning.plan}
				<div class="mt-4 text-sm">
					<span class="font-medium text-base-content/70">Plan:</span>
					<p class="mt-1 text-base-content/80">{data.planning.plan}</p>
				</div>
			{/if}
		</div>
	</main>
{/if}
