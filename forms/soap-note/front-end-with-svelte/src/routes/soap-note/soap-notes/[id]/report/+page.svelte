<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import {
		statusLabel,
		statusColor,
		priorityLabel,
		priorityColor,
		presentColor,
		clinicianRoleLabel,
		careSettingLabel,
		encounterTypeLabel,
		sexLabel,
		ageBandLabel
	} from '#lib/engine/utils.js';
	import Button from '#lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/soap-note/soap-notes/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/soap-notes/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `soap-note-${data.identification.patientIdentifier || id}.pdf`;
				a.click();
				URL.revokeObjectURL(url);
			} else {
				pdfError = 'Failed to generate PDF. Please try again.';
			}
		} catch {
			pdfError = 'Failed to generate PDF. Please check your connection and try again.';
		}
	}

	const presentCount = $derived(
		result ? result.sectionStatuses.filter((s) => s.present).length : 0
	);
</script>

{#if result}
	<header class="border-b border-base-300 bg-base-100 shadow-sm no-print">
		<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
			<h1 class="text-lg font-bold text-base-content">SOAP note report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/soap-note/soap-notes/${id}`)}>Edit</Button>
			</div>
		</div>
	</header>

	<main class="mx-16 px-4 py-6">
		<!-- Completeness banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {statusColor(result.status)}">
			<div class="text-3xl font-bold">{statusLabel(result.status)}</div>
			<div class="mt-2 text-sm font-semibold">
				{presentCount} of {result.sectionStatuses.length} SOAP sections present ({result.completenessPercent}%
				complete)
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
					All required components are present. The note stands alone — another clinician can safely
					continue care. A <strong>Complete</strong> grade means the note is well documented, not that
					the clinical care was correct.
				{:else if result.status === 'partial'}
					Both the Assessment and the Plan are present, but one or more other required components are
					missing. The note is usable but has documentation gaps — complete the outstanding
					components.
				{:else}
					The <strong>Assessment or the Plan is missing</strong>. The note cannot safely stand alone: a
					critical section is absent. Record the missing section before the note is used to continue
					care.
				{/if}
			</p>
		</div>

		<!-- SOAP section presence -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">SOAP section presence</h2>
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-base-300 text-left text-base-content/70">
						<th class="pb-2 pr-4">Section</th>
						<th class="pb-2">Presence</th>
					</tr>
				</thead>
				<tbody>
					{#each result.sectionStatuses as s (s.section)}
						<tr class="border-b border-base-200">
							<td class="py-2 pr-4">{s.label}</td>
							<td class="py-2">
								<span
									class="rounded-full border px-2 py-0.5 text-xs font-bold {presentColor(s.present)}"
									>{s.present ? 'Present' : 'Absent'}</span
								>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
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

		<!-- Patient / context summary -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Encounter summary</h2>
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
					<span class="font-medium text-base-content/70">Encounter type:</span>
					{encounterTypeLabel(data.context.encounterType) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Clinician:</span>
					{data.context.clinicianName || 'N/A'}
					{#if clinicianRoleLabel(data.context.clinicianRole)}
						({clinicianRoleLabel(data.context.clinicianRole)})
					{/if}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Encountered at:</span>
					{data.context.encounteredAt || 'N/A'}
				</div>
			</div>
			{#if data.summary.clinicalNote}
				<div class="mt-4 text-sm">
					<span class="font-medium text-base-content/70">Clinical note:</span>
					<p class="mt-1 text-base-content/80">{data.summary.clinicalNote}</p>
				</div>
			{/if}
		</div>
	</main>
{/if}
