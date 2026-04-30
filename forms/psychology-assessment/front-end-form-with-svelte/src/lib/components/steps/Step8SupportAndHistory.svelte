<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import SectionCard from '$lib/components/ui/SectionCard.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextArea from '$lib/components/ui/TextArea.svelte';

	const s = assessment.data.supportAndHistory;

	const yesNoOptions = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];

	const supportOptions = [
		{ value: 'strong', label: 'Strong' },
		{ value: 'adequate', label: 'Adequate' },
		{ value: 'limited', label: 'Limited' },
		{ value: 'isolated', label: 'Isolated' }
	];
</script>

<SectionCard title="Support and History" description="Background to help your clinician">
	<RadioGroup
		label="Have you ever received mental health support before?"
		name="previousMentalHealthCare"
		options={yesNoOptions}
		bind:value={s.previousMentalHealthCare}
	/>

	{#if s.previousMentalHealthCare === 'yes'}
		<TextArea
			label="Briefly describe (when, what kind, was it helpful?)"
			name="previousMentalHealthDetails"
			bind:value={s.previousMentalHealthDetails}
			rows={3}
		/>
	{/if}

	<RadioGroup
		label="Are you currently in any form of mental health treatment?"
		name="currentlyInTreatment"
		options={yesNoOptions}
		bind:value={s.currentlyInTreatment}
	/>

	{#if s.currentlyInTreatment === 'yes'}
		<TextArea
			label="Describe your current treatment (provider, frequency)"
			name="currentTreatmentDetails"
			bind:value={s.currentTreatmentDetails}
			rows={3}
		/>
	{/if}

	<TextArea
		label="Current medications (psychiatric or otherwise)"
		name="currentMedications"
		bind:value={s.currentMedications}
		placeholder="One per line"
		rows={3}
	/>

	<RadioGroup
		label="Is there a history of mental health conditions in your family?"
		name="familyMentalHealthHistory"
		options={yesNoOptions}
		bind:value={s.familyMentalHealthHistory}
	/>

	{#if s.familyMentalHealthHistory === 'yes'}
		<TextArea
			label="Briefly describe"
			name="familyMentalHealthDetails"
			bind:value={s.familyMentalHealthDetails}
			rows={2}
		/>
	{/if}

	<RadioGroup
		label="How would you describe your current social support?"
		name="socialSupport"
		options={supportOptions}
		bind:value={s.socialSupport}
	/>

	<RadioGroup
		label="Are you concerned about your alcohol or drug use?"
		name="substanceUseConcern"
		options={yesNoOptions}
		bind:value={s.substanceUseConcern}
	/>
</SectionCard>
