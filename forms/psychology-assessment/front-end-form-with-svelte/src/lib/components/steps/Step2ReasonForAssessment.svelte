<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import SectionCard from '$lib/components/ui/SectionCard.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextArea from '$lib/components/ui/TextArea.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';

	const r = assessment.data.reasonForAssessment;
</script>

<SectionCard
	title="Reason for Assessment"
	description="Tell us why you are completing this assessment today"
>
	<RadioGroup
		label="Referral source"
		name="reason"
		options={[
			{ value: 'self-referral', label: 'Self-referral' },
			{ value: 'gp-referral', label: 'GP / primary care' },
			{ value: 'employer-referral', label: 'Employer / occupational health' },
			{ value: 'follow-up', label: 'Follow-up appointment' },
			{ value: 'screening', label: 'Routine screening' },
			{ value: 'other', label: 'Other' }
		]}
		bind:value={r.reason}
	/>

	{#if r.reason === 'other'}
		<TextInput
			label="Please describe the referral source"
			name="reasonDetails"
			bind:value={r.reasonDetails}
		/>
	{/if}

	<TextArea
		label="What is your primary concern?"
		name="primaryConcern"
		bind:value={r.primaryConcern}
		placeholder="In your own words, what brought you here today?"
		rows={4}
	/>

	<NumberInput
		label="How long have you experienced these symptoms?"
		name="symptomDurationWeeks"
		bind:value={r.symptomDurationWeeks}
		unit="weeks"
		min={0}
		max={520}
	/>
</SectionCard>
