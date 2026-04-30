<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import SectionCard from '$lib/components/ui/SectionCard.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';

	const dv = assessment.data.doubleVision;

	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<SectionCard
	title="Question 10 — Double vision (diplopia)"
	description="Diplopia means seeing two of an object."
>
	<RadioGroup
		label="Do you have double vision?"
		name="hasDoubleVision"
		options={yesNo}
		bind:value={dv.hasDoubleVision}
		required
	/>

	{#if dv.hasDoubleVision === 'yes'}
		<RadioGroup
			label="a) Is your double vision suppressed or controlled?"
			name="suppressedOrControlled"
			options={yesNo}
			bind:value={dv.suppressedOrControlled}
			required
		/>

		{#if dv.suppressedOrControlled === 'yes'}
			<RadioGroup
				label="b) If Yes, how is it controlled?"
				name="correctionMethod"
				options={[
					{ value: 'patch', label: 'Patch' },
					{ value: 'prism', label: 'Prism' },
					{ value: 'glasses-or-lenses', label: 'Glasses or lenses' },
					{ value: 'other', label: 'Other' }
				]}
				bind:value={dv.correctionMethod}
				required
			/>

			{#if dv.correctionMethod === 'other'}
				<TextInput
					label="Please describe the other method"
					name="correctionMethodOther"
					bind:value={dv.correctionMethodOther}
					required
				/>
			{/if}
		{/if}
	{/if}
</SectionCard>
