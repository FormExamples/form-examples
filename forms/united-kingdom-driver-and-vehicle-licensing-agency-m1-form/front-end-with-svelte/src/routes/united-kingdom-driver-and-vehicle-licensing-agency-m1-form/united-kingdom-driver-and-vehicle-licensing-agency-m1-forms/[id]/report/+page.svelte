<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { calculateAge, priorityLabel } from '#lib/engine/utils.js';
	import Badge from '#lib/components/ui/Badge.svelte';
	import Button from '#lib/components/ui/Button.svelte';

	const plural = 'united-kingdom-driver-and-vehicle-licensing-agency-m1-forms';
	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/united-kingdom-driver-and-vehicle-licensing-agency-m1-form/${plural}/${id}`);
		}
	});

	let pdfError = $state('');

	const conditionLabels: Record<string, string> = {
		anxietyDepressionWithoutImpairment: 'Anxiety or depression (without impairment)',
		anxietyDepressionWithImpairment: 'Anxiety or depression (with suicidal thoughts or impairment)',
		bipolarAffectiveDisorder: 'Bipolar affective disorder',
		eatingDisorder: 'Eating disorder',
		ocdOrPtsd: 'OCD or PTSD',
		personalityDisorder: 'Personality disorder',
		schizophreniaOrPsychosis: 'Schizophrenia, psychosis, delusional or schizoaffective disorder',
		other: 'Other'
	};

	const selectedConditions = $derived(
		Object.entries(conditionLabels)
			.filter(([key]) => (data.mentalHealthConditions as unknown as Record<string, string>)[key] === 'yes')
			.map(([, label]) => label)
	);

	const priorityColor: Record<string, string> = {
		urgent: 'bg-error text-error-content border-error',
		high: 'bg-error text-error-content border-error',
		medium: 'bg-warning text-warning-content border-warning',
		low: 'bg-base-300 text-base-content border-base-300'
	};

	const bannerClass = $derived(
		result && result.complete
			? 'bg-success text-success-content border-success'
			: 'bg-warning text-warning-content border-warning'
	);

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/${plural}/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `dvla-m1-form-${data.personalDetails.fullName || id}.pdf`;
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
			<h1 class="text-lg font-bold text-base-content">DVLA M1 form report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/united-kingdom-driver-and-vehicle-licensing-agency-m1-form/${plural}/${id}`)}>Edit</Button>
			</div>
		</div>
	</header>

	<main class="mx-16 px-4 py-6">
		<!-- Status banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {bannerClass}">
			<div class="text-3xl font-bold">{result.complete ? 'Complete' : 'Incomplete'}</div>
			<div class="mt-2 flex justify-center gap-6 text-sm">
				<span>{result.stoppedAtQ1 ? 'Q1 = No (form stopped)' : 'Q1 = Yes (full form)'}</span>
				<span>{result.conditionCount} condition{result.conditionCount === 1 ? '' : 's'} reported</span>
			</div>
			<div class="mt-2 text-sm opacity-75">
				Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Flagged issues -->
		{#if result.additionalFlags.length > 0}
			<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-error">Flagged issues for DVLA medical assessor</h2>
				<div class="space-y-2">
					{#each result.additionalFlags as flag (flag.id)}
						<div class="flex items-start gap-3 rounded-lg border p-3 {priorityColor[flag.priority]}">
							<span class="mt-0.5 rounded px-2 py-0.5 text-xs font-bold uppercase {priorityColor[flag.priority]}">
								{priorityLabel(flag.priority)}
							</span>
							<div><span class="font-medium">{flag.category}:</span> {flag.message}</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Validation issues -->
		{#if result.firedRules.length > 0}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Validation issues</h2>
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b border-base-300 text-left text-base-content/70">
							<th class="pb-2 pr-4">Rule</th>
							<th class="pb-2 pr-4">Category</th>
							<th class="pb-2 pr-4">Finding</th>
							<th class="pb-2">Priority</th>
						</tr>
					</thead>
					<tbody>
						{#each result.firedRules as rule (rule.id)}
							<tr class="border-b border-base-200">
								<td class="py-2 pr-4 font-mono text-xs text-base-content/60">{rule.id}</td>
								<td class="py-2 pr-4">{rule.category}</td>
								<td class="py-2 pr-4">{rule.message}</td>
								<td class="py-2"><Badge priority={rule.priority} /></td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{:else}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6 text-sm text-base-content/70">
				No validation issues detected.
			</div>
		{/if}

		<!-- Applicant summary -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Applicant summary</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div><span class="font-medium text-base-content/70">Name:</span> {data.personalDetails.fullName}</div>
				<div>
					<span class="font-medium text-base-content/70">DOB:</span> {data.personalDetails.dateOfBirth}
					{#if calculateAge(data.personalDetails.dateOfBirth)}(Age {calculateAge(data.personalDetails.dateOfBirth)}){/if}
				</div>
				<div><span class="font-medium text-base-content/70">Postcode:</span> {data.personalDetails.postcode}</div>
				<div><span class="font-medium text-base-content/70">Contact:</span> {data.personalDetails.contactNumber || '—'}</div>
			</div>
		</div>

		<!-- Reported conditions -->
		{#if selectedConditions.length > 0}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Reported mental health conditions</h2>
				<ul class="list-disc space-y-1 pl-5 text-sm text-base-content/80">
					{#each selectedConditions as condition (condition)}
						<li>{condition}</li>
					{/each}
					{#if data.mentalHealthConditions.other === 'yes' && data.mentalHealthConditions.otherDetails}
						<li><strong>Other details:</strong> {data.mentalHealthConditions.otherDetails}</li>
					{/if}
				</ul>
			</div>
		{/if}
	</main>
{/if}
