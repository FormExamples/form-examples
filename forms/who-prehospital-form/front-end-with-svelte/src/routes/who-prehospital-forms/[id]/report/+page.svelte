<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { gcsTotal, priorityLabel, sectionLabel } from '$lib/engine/utils';
	import Button from '$lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/who-prehospital-forms/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/who-prehospital-forms/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `who-prehospital-${data.callerAndScene.patientName || id}.pdf`;
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
		urgent: 'bg-error text-error-content border-error',
		high: 'bg-error text-error-content border-error',
		medium: 'bg-warning text-warning-content border-warning',
		low: 'bg-warning text-warning-content border-warning'
	};

	const triageLabel = (v: string) =>
		v === 'red'
			? 'RED — Immediate'
			: v === 'yellow'
				? 'YELLOW — Urgent'
				: v === 'green'
					? 'GREEN — Non-urgent'
					: '—';

	// Status banner colour: green when complete with no flags, error/warning otherwise.
	const bannerClass = $derived(
		result == null
			? ''
			: result.urgentCount > 0
				? 'bg-error text-error-content border-error'
				: result.highCount > 0
					? 'bg-warning text-warning-content border-warning'
					: result.complete
						? 'bg-success text-success-content border-success'
						: 'bg-warning text-warning-content border-warning'
	);

	const statusHeadline = $derived(
		result == null
			? ''
			: result.urgentCount > 0
				? 'Urgent issues — escalate immediately'
				: result.complete
					? result.flags.length > 0
						? 'Complete — review flagged issues'
						: 'Complete — no issues flagged'
					: 'Incomplete record'
	);

	const gcs = $derived(gcsTotal(data));
</script>

{#if result}
	<header class="border-b border-base-300 bg-base-100 shadow-sm no-print">
		<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
			<h1 class="text-lg font-bold text-base-content">Prehospital report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/who-prehospital-forms/${id}`)}
					>Edit</Button
				>
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-4xl px-4 py-6">
		<!-- Status banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {bannerClass}">
			<div class="text-2xl font-bold">{statusHeadline}</div>
			<div class="mt-2 flex flex-wrap justify-center gap-6 text-sm">
				<span>Triage: {triageLabel(result.triageCategory)}</span>
				<span
					>{result.complete
						? 'All required fields complete'
						: `${result.validation.missing.length} field(s) outstanding`}</span
				>
				{#if result.flags.length > 0}
					<span>{result.flags.length} flag(s)</span>
				{/if}
				{#if result.urgentCount > 0}<span>{result.urgentCount} urgent</span>{/if}
			</div>
			<div class="mt-2 text-sm opacity-75">
				Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Flagged issues -->
		{#if result.flags.length > 0}
			<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-error">Flagged issues for receiving facility</h2>
				<div class="space-y-2">
					{#each result.flags as flag (flag.id)}
						<div class="flex items-start gap-3 rounded-lg border p-3 {priorityColor[flag.priority]}">
							<span
								class="mt-0.5 rounded px-2 py-0.5 text-xs font-bold uppercase {priorityColor[
									flag.priority
								]}"
							>
								{priorityLabel(flag.priority)}
							</span>
							<div><span class="font-medium">{flag.category}:</span> {flag.message}</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Outstanding fields -->
		{#if result.validation.missing.length > 0}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Outstanding fields</h2>
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b border-base-300 text-left text-base-content/70">
							<th class="pb-2 pr-4">Section</th>
							<th class="pb-2">Required field</th>
						</tr>
					</thead>
					<tbody>
						{#each result.validation.missing as m (m.id)}
							<tr class="border-b border-base-200">
								<td class="py-2 pr-4">{sectionLabel(m.section)}</td>
								<td class="py-2">{m.description}</td>
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
				<div>
					<span class="font-medium text-base-content/70">Name:</span>
					{data.callerAndScene.patientName || '—'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">DOB / age:</span>
					{data.callerAndScene.dateOfBirthOrAge || '—'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Sex:</span>
					{data.callerAndScene.sex || '—'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Triage:</span>
					{triageLabel(data.triage.category)}
				</div>
				<div>
					<span class="font-medium text-base-content/70">GCS:</span>
					{gcs === null ? '—' : gcs}
				</div>
				<div>
					<span class="font-medium text-base-content/70">AVPU:</span>
					{data.disability.avpu || '—'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Pregnant:</span>
					{data.chiefComplaintAndVitals.pregnant || '—'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Recorded by:</span>
					{data.disposition.providerName || '—'}
				</div>
			</div>
			{#if data.chiefComplaintAndVitals.chiefComplaint}
				<p class="mt-4 text-sm text-base-content/80">
					<span class="font-medium text-base-content/70">Chief complaint:</span>
					{data.chiefComplaintAndVitals.chiefComplaint}
				</p>
			{/if}
		</div>

		<!-- Assessment & plan -->
		{#if data.assessmentAndPlan.summary || data.assessmentAndPlan.presumptiveDiagnoses}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Assessment &amp; plan</h2>
				<div class="space-y-2 text-sm text-base-content/80">
					{#if data.assessmentAndPlan.summary}
						<p>
							<span class="font-medium text-base-content/70">Summary:</span>
							{data.assessmentAndPlan.summary}
						</p>
					{/if}
					{#if data.assessmentAndPlan.differential}
						<p>
							<span class="font-medium text-base-content/70">Differential:</span>
							{data.assessmentAndPlan.differential}
						</p>
					{/if}
					{#if data.assessmentAndPlan.presumptiveDiagnoses}
						<p>
							<span class="font-medium text-base-content/70">Presumptive diagnoses:</span>
							{data.assessmentAndPlan.presumptiveDiagnoses}
						</p>
					{/if}
				</div>
			</div>
		{/if}
	</main>
{/if}
