<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import SectionCard from '$lib/components/ui/SectionCard.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';

	const b = assessment.data.blackouts;

	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<SectionCard
	title="Question 3 — Blackouts"
	description="A blackout is any episode of altered or lost consciousness."
>
	<RadioGroup
		label="Have you ever had a blackout(s) or altered level of consciousness?"
		name="hadBlackouts"
		options={yesNo}
		bind:value={b.hadBlackouts}
		required
	/>

	{#if b.hadBlackouts === 'yes'}
		<TextInput
			label="Date of blackout"
			name="blackoutDate"
			type="date"
			bind:value={b.blackoutDate}
			required
		/>
	{/if}
</SectionCard>
