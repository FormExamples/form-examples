<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import SectionCard from '$lib/components/ui/SectionCard.svelte';
	import YesNoQuestion from '$lib/components/ui/YesNoQuestion.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';

	const r = assessment.data.recentContact;
	const stoppedAtQ1 = $derived(
		assessment.data.diagnosisConfirmation.hasMentalHealthDiagnosis === 'no'
	);
</script>

<SectionCard
	title="Question 3 — Recent Contact"
	description="Recent contact with your healthcare professional about your mental health condition"
>
	{#if stoppedAtQ1}
		<div class="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900">
			You answered <strong>No</strong> to Question 1. The DVLA instructions ask you
			not to complete this question.
		</div>
	{:else}
		<YesNoQuestion
			label="Have you had any contact (any phone, video or face-to-face consultation) with your healthcare professional about your mental health condition in the last 12 months?"
			name="hadRecentContact"
			bind:value={r.hadRecentContact}
		/>

		{#if r.hadRecentContact === 'yes'}
			<p class="mt-2 mb-2 text-sm text-gray-700">
				If yes, supply the last date of any contact (DD/MM/YYYY):
			</p>
			<TextInput
				label="Doctor — date last seen"
				name="doctorLastDate"
				type="date"
				bind:value={r.doctorLastDate}
			/>
			<TextInput
				label="Consultant — date last seen"
				name="consultantLastDate"
				type="date"
				bind:value={r.consultantLastDate}
			/>
			<TextInput
				label="Community psychiatric nurse — date last seen"
				name="cpnLastDate"
				type="date"
				bind:value={r.communityPsychiatricNurseLastDate}
			/>
		{/if}
	{/if}
</SectionCard>
