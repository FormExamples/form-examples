<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateAge, priorityLabel, sectionLabel } from '$lib/engine/utils';
	import Button from '$lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/who-emergency-first-aid-form/who-emergency-first-aid-forms/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/who-emergency-first-aid-forms/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `who-emergency-first-aid-${data.patientIdentification.patientName || id}.pdf`;
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
		low: 'bg-base-300 text-base-content border-base-300'
	};

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

	const problemSummary = $derived.by(() => {
		const parts: string[] = [];
		if (data.situation.medical) parts.push('Medical');
		if (data.situation.trauma) parts.push('Trauma');
		return parts.join(' + ') || '—';
	});
</script>

{#if result}
	<header class="border-b border-base-300 bg-base-100 shadow-sm no-print">
		<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
			<h1 class="text-lg font-bold text-base-content">Emergency first aid report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/who-emergency-first-aid-form/who-emergency-first-aid-forms/${id}`)}
					>Edit</Button
				>
			</div>
		</div>
	</header>

	<main class="mx-16 px-4 py-6">
		<!-- Status banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {bannerClass}">
			<div class="text-2xl font-bold">{statusHeadline}</div>
			<div class="mt-2 flex flex-wrap justify-center gap-6 text-sm">
				<span>{result.complete ? 'All required fields complete' : `${result.validation.missing.length} field(s) outstanding`}</span>
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
				<div><span class="font-medium text-base-content/70">Name:</span> {data.patientIdentification.patientName || '—'}</div>
				<div>
					<span class="font-medium text-base-content/70">DOB:</span>
					{data.patientIdentification.dateOfBirth || '—'}
					{#if calculateAge(data.patientIdentification.dateOfBirth)}(Age {calculateAge(data.patientIdentification.dateOfBirth)}){/if}
				</div>
				<div><span class="font-medium text-base-content/70">Sex:</span> {data.patientIdentification.sex || '—'}</div>
				<div><span class="font-medium text-base-content/70">Problem:</span> {problemSummary}</div>
				<div><span class="font-medium text-base-content/70">Pregnant:</span> {data.situation.pregnant || '—'}</div>
				<div><span class="font-medium text-base-content/70">Recorded by:</span> {data.responderDetails.name || '—'}</div>
			</div>
			{#if data.situation.whatHappened}
				<p class="mt-4 text-sm text-base-content/80">
					<span class="font-medium text-base-content/70">What happened:</span>
					{data.situation.whatHappened}
				</p>
			{/if}
		</div>

		<!-- Background -->
		{#if data.background.pastMedicalAndSurgicalHistory || data.background.currentMedicationsOrAllergies}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Background</h2>
				<div class="space-y-2 text-sm text-base-content/80">
					{#if data.background.pastMedicalAndSurgicalHistory}
						<p><span class="font-medium text-base-content/70">Past medical &amp; surgical history:</span> {data.background.pastMedicalAndSurgicalHistory}</p>
					{/if}
					{#if data.background.currentMedicationsOrAllergies}
						<p><span class="font-medium text-base-content/70">Medications / allergies:</span> {data.background.currentMedicationsOrAllergies}</p>
					{/if}
				</div>
			</div>
		{/if}
	</main>
{/if}
