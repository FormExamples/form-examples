<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import {
		completenessLevelLabel,
		completenessLevelColor,
		calculateAge,
		formatDate,
		placeLabel,
		priorityColor
	} from '$lib/engine/utils';
	import Button from '$lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/advance-statement-about-care/advance-statements-about-care/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/advance-statements-about-care/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `advance-statement-${data.personalInformation.lastName || id}.pdf`;
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
			<h1 class="text-lg font-bold text-base-content">Advance statement summary</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/advance-statement-about-care/advance-statements-about-care/${id}`)}>
					Edit
				</Button>
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-4xl px-4 py-6">
		<!-- Completeness banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {completenessLevelColor(result.level)}">
			<div class="text-3xl font-bold">{completenessLevelLabel(result.level)}</div>
			<div class="mt-1 text-lg">
				{result.completedCount} of {result.totalCount} sections completed
			</div>
			<div class="mt-2 text-sm opacity-75">
				Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Flagged issues -->
		{#if result.flaggedIssues.length > 0}
			<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-error">Issues requiring attention</h2>
				<div class="space-y-2">
					{#each result.flaggedIssues as flag (flag.id)}
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
								{flag.message}
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Missing sections -->
		{#if result.missingSections.length > 0}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Incomplete sections</h2>
				<div class="space-y-1 text-sm">
					{#each result.missingSections as section (section.id)}
						<div class="flex items-center gap-2">
							{#if section.required}
								<span class="rounded bg-error/10 px-1.5 py-0.5 text-xs text-error">Required</span>
							{:else}
								<span class="rounded bg-base-300 px-1.5 py-0.5 text-xs text-base-content/70">Optional</span>
							{/if}
							<span class="text-base-content/80">{section.section}: {section.description}</span>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Personal information -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Personal information</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div>
					<span class="font-medium text-base-content/70">Name:</span>
					{data.personalInformation.firstName} {data.personalInformation.lastName}
				</div>
				<div>
					<span class="font-medium text-base-content/70">DOB:</span>
					{formatDate(data.personalInformation.dateOfBirth)}
					{#if calculateAge(data.personalInformation.dateOfBirth)}
						(Age {calculateAge(data.personalInformation.dateOfBirth)})
					{/if}
				</div>
				<div>
					<span class="font-medium text-base-content/70">NHS Number:</span>
					{data.personalInformation.nhsNumber || 'Not provided'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">GP:</span>
					{data.personalInformation.gpName || 'Not provided'}
				</div>
			</div>
		</div>

		<!-- Values & beliefs -->
		{#if data.valuesBeliefs.qualityOfLifePriorities || data.valuesBeliefs.whatMakesLifeMeaningful}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Values &amp; beliefs</h2>
				{#if data.valuesBeliefs.qualityOfLifePriorities}
					<div class="mb-3">
						<span class="text-sm font-medium text-base-content/70">Quality of life priorities:</span>
						<p class="mt-1 text-sm text-base-content/80">{data.valuesBeliefs.qualityOfLifePriorities}</p>
					</div>
				{/if}
				{#if data.valuesBeliefs.whatMakesLifeMeaningful}
					<div class="mb-3">
						<span class="text-sm font-medium text-base-content/70">What makes life meaningful:</span>
						<p class="mt-1 text-sm text-base-content/80">{data.valuesBeliefs.whatMakesLifeMeaningful}</p>
					</div>
				{/if}
			</div>
		{/if}

		<!-- Care preferences -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Care preferences</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div>
					<span class="font-medium text-base-content/70">Preferred place of care:</span>
					{placeLabel(data.carePreferences.preferredPlaceOfCare)}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Preferred place of death:</span>
					{placeLabel(data.carePreferences.preferredPlaceOfDeath)}
				</div>
			</div>
		</div>

		<!-- Medical treatment wishes -->
		{#if data.medicalTreatmentWishes.resuscitationWishes || data.medicalTreatmentWishes.painManagementPreferences}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Medical treatment wishes</h2>
				{#if data.medicalTreatmentWishes.resuscitationWishes}
					<div class="mb-3">
						<span class="text-sm font-medium text-base-content/70">Resuscitation wishes:</span>
						<p class="mt-1 text-sm text-base-content/80">{data.medicalTreatmentWishes.resuscitationWishes}</p>
					</div>
				{/if}
				{#if data.medicalTreatmentWishes.painManagementPreferences}
					<div class="mb-3">
						<span class="text-sm font-medium text-base-content/70">Pain management:</span>
						<p class="mt-1 text-sm text-base-content/80">{data.medicalTreatmentWishes.painManagementPreferences}</p>
					</div>
				{/if}
			</div>
		{/if}

		<!-- People important to me -->
		{#if data.peopleImportantToMe.people.length > 0}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">People important to me</h2>
				<div class="space-y-2 text-sm">
					{#each data.peopleImportantToMe.people as person (person.name)}
						{#if person.name}
							<div class="rounded-lg border border-base-300 bg-base-200 p-3">
								<div class="font-medium text-base-content">{person.name} ({person.relationship})</div>
								{#if person.telephone}<div class="text-base-content/70">Tel: {person.telephone}</div>{/if}
								{#if person.role}<div class="text-base-content/70">Role: {person.role}</div>{/if}
							</div>
						{/if}
					{/each}
				</div>
			</div>
		{/if}

		<!-- Signatures -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Signatures</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div>
					<span class="font-medium text-base-content/70">Patient signed:</span>
					{data.signaturesWitnesses.patientSignature ? 'Yes' : 'No'}
					{#if data.signaturesWitnesses.patientSignatureDate}
						({formatDate(data.signaturesWitnesses.patientSignatureDate)})
					{/if}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Witnessed:</span>
					{data.signaturesWitnesses.witnessName
						? `Yes (${data.signaturesWitnesses.witnessName})`
						: 'No'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Review date:</span>
					{data.signaturesWitnesses.reviewDate
						? formatDate(data.signaturesWitnesses.reviewDate)
						: 'Not set'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">HCP acknowledged:</span>
					{data.signaturesWitnesses.healthcareProfessionalName
						? `Yes (${data.signaturesWitnesses.healthcareProfessionalName})`
						: 'No'}
				</div>
			</div>
		</div>
	</main>
{/if}
