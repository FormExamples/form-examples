<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import SectionCard from '$lib/components/ui/SectionCard.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextArea from '$lib/components/ui/TextArea.svelte';

	const o = assessment.data.otherVisionConditions;

	const yesNoOptions = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<SectionCard
	title="Question 10 — Other Vision Conditions"
	description="Any other vision condition not already covered above."
>
	<RadioGroup
		label="Do you have any other vision condition that may affect your driving?"
		name="otherHasOther"
		options={yesNoOptions}
		bind:value={o.hasOther}
		required
	/>

	{#if o.hasOther === 'yes'}
		<div class="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
			<TextArea
				label="10a) Please describe the condition(s) and which eye(s) are affected"
				name="otherDetails"
				bind:value={o.details}
				rows={4}
				required
			/>
		</div>
	{/if}
</SectionCard>
