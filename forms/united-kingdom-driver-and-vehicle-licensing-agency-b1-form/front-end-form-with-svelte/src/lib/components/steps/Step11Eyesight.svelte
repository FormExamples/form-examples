<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import SectionCard from '$lib/components/ui/SectionCard.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextArea from '$lib/components/ui/TextArea.svelte';

	const e = assessment.data.eyesight;

	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<SectionCard
	title="Question 11 — Eyesight"
	description="Tell us whether your condition has affected your eyesight."
>
	<RadioGroup
		label="Has your condition caused problems with your eyesight?"
		name="hasEyesightProblems"
		options={yesNo}
		bind:value={e.hasEyesightProblems}
		required
	/>

	{#if e.hasEyesightProblems === 'yes'}
		<TextArea
			label="If Yes, please give details"
			name="eyesightDetails"
			bind:value={e.details}
			rows={3}
			required
		/>
	{/if}
</SectionCard>
