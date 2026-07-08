<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import {
		severityBandLabel,
		severityBandColor,
		priorityLabel,
		priorityColor,
		settingLabel,
		assessorRoleLabel,
		reactivityLabel
	} from '$lib/engine/utils';
	import Button from '$lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/glasgow-coma-scale/glasgow-coma-scales/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/glasgow-coma-scales/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `glasgow-coma-scale-${id}.pdf`;
				a.click();
				URL.revokeObjectURL(url);
			} else {
				pdfError = 'Failed to generate PDF. Please try again.';
			}
		} catch {
			pdfError = 'Failed to generate PDF. Please check your connection and try again.';
		}
	}

	function componentScore(score: number | null, response: string): string {
		if (response === 'NT') return 'NT';
		if (score === null) return 'Not recorded';
		return String(score);
	}
</script>

{#if result}
	<header class="border-b border-base-300 bg-base-100 shadow-sm no-print">
		<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
			<h1 class="text-lg font-bold text-base-content">Glasgow Coma Scale report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/glasgow-coma-scale/glasgow-coma-scales/${id}`)}
					>Edit</Button
				>
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-4xl px-4 py-6">
		<!-- Score banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {severityBandColor(result.severityBand)}">
			<div class="text-3xl font-bold">GCS {result.totalDisplay || 'Not scored'}</div>
			<div class="mt-2 text-sm font-semibold">
				{result.breakdown || 'Incomplete'} · {severityBandLabel(result.severityBand)}
			</div>
			<div class="mt-1 text-sm opacity-75">
				GCS-Pupils: {result.gcsP !== null ? result.gcsP : 'Not scored'}
			</div>
			<div class="mt-2 text-sm opacity-75">
				Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Recommended action -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-2 text-lg font-bold text-base-content">Recommended action</h2>
			{#if result.totalScore !== null && result.totalScore <= 8}
				<p class="text-sm text-base-content/80">
					This is a <strong>severe impairment (coma)</strong> with GCS &le; 8. The airway may be at
					risk: consider definitive airway management / intubation and urgent senior escalation.
				</p>
			{:else if result.severityBand === 'moderate'}
				<p class="text-sm text-base-content/80">
					This is a <strong>moderate impairment</strong>. Increase observation frequency, identify
					reversible causes, and escalate if the score falls.
				</p>
			{:else if result.severityBand === 'mild'}
				<p class="text-sm text-base-content/80">
					This is a <strong>mild impairment</strong>. Continue structured neuro-observations and
					re-score if the patient deteriorates.
				</p>
			{:else}
				<p class="text-sm text-base-content/80">
					The total GCS is <strong>undefined</strong> because a component is not testable. Report the
					breakdown explicitly and record the reason for each untestable component.
				</p>
			{/if}
		</div>

		<!-- Components -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Components</h2>
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-base-300 text-left text-base-content/70">
						<th class="pb-2 pr-4">Component</th>
						<th class="pb-2 pr-4">Response</th>
						<th class="pb-2">Score</th>
					</tr>
				</thead>
				<tbody>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4">Eye opening (E)</td>
						<td class="py-2 pr-4">{data.eye.eyeResponse || 'Not recorded'}</td>
						<td class="py-2 font-bold"
							>{componentScore(result.eyeScore, data.eye.eyeResponse)}</td
						>
					</tr>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4">Verbal response (V)</td>
						<td class="py-2 pr-4">{data.verbal.verbalResponse || 'Not recorded'}</td>
						<td class="py-2 font-bold"
							>{componentScore(result.verbalScore, data.verbal.verbalResponse)}</td
						>
					</tr>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4">Motor response (M)</td>
						<td class="py-2 pr-4">{data.motor.motorResponse || 'Not recorded'}</td>
						<td class="py-2 font-bold"
							>{componentScore(result.motorScore, data.motor.motorResponse)}</td
						>
					</tr>
				</tbody>
			</table>
		</div>

		<!-- Flagged issues -->
		{#if result.flaggedIssues.length > 0}
			<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-error">
					Flagged issues ({result.flaggedIssues.length})
				</h2>
				<div class="space-y-2">
					{#each result.flaggedIssues as flag (flag.id)}
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
			<h2 class="mb-4 text-lg font-bold text-base-content">Assessment summary</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div>
					<span class="font-medium text-base-content/70">Setting:</span>
					{settingLabel(data.context.setting) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Assessor:</span>
					{data.context.assessorName || 'N/A'}
					{#if assessorRoleLabel(data.context.assessorRole)}
						({assessorRoleLabel(data.context.assessorRole)})
					{/if}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Left pupil:</span>
					{reactivityLabel(data.pupils.leftPupilReactivity) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Right pupil:</span>
					{reactivityLabel(data.pupils.rightPupilReactivity) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Pupil reactivity score:</span>
					{result.pupilReactivityScore !== null ? result.pupilReactivityScore : 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Reason:</span>
					{data.context.reason || 'N/A'}
				</div>
			</div>
			{#if data.note.clinicalNote}
				<div class="mt-4 text-sm">
					<span class="font-medium text-base-content/70">Clinical note:</span>
					<p class="mt-1 text-base-content/80">{data.note.clinicalNote}</p>
				</div>
			{/if}
		</div>
	</main>
{/if}
