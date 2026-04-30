<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import SectionCard from '$lib/components/ui/SectionCard.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextArea from '$lib/components/ui/TextArea.svelte';

	const dl = assessment.data.dailyLiving;

	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<SectionCard
	title="Question 9 — Daily living"
	description="Tell us whether you need help from another person with everyday tasks."
>
	<RadioGroup
		label="Do you need help from another person with your day-to-day living?"
		name="needsHelp"
		options={yesNo}
		bind:value={dl.needsHelp}
		required
	/>

	{#if dl.needsHelp === 'yes'}
		<TextArea
			label="If Yes, please give details of how they help you"
			name="helpDetails"
			bind:value={dl.helpDetails}
			rows={3}
			required
		/>
	{/if}
</SectionCard>
