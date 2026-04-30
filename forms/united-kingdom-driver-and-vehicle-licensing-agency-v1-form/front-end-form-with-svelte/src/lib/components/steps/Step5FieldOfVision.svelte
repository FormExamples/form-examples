<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import SectionCard from '$lib/components/ui/SectionCard.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextArea from '$lib/components/ui/TextArea.svelte';

	const f = assessment.data.fieldOfVision;

	const yesNoOptions = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<SectionCard
	title="Question 3 — Field of Vision"
	description="Field of vision is the total area you can see when looking straight ahead, including peripheral (side) vision."
>
	<RadioGroup
		label="Have you been told by your healthcare professional or optician/optometrist that you have a problem with your field of vision?"
		name="vfHasProblem"
		options={yesNoOptions}
		bind:value={f.hasProblem}
		required
	/>

	{#if f.hasProblem === 'yes'}
		<div class="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
			<RadioGroup
				label="3a) Is the visual-field problem caused solely by an eye condition?"
				name="vfCausedSolely"
				options={yesNoOptions}
				bind:value={f.causedSolelyByEyeCondition}
				required
			/>

			{#if f.causedSolelyByEyeCondition === 'no'}
				<RadioGroup
					label="3b) What is the cause?"
					name="vfCause"
					options={[
						{ value: 'brain-tumour', label: 'Brain tumour' },
						{ value: 'head-injury', label: 'Head injury' },
						{ value: 'stroke', label: 'Stroke' },
						{ value: 'other', label: 'Other' }
					]}
					bind:value={f.cause}
					stack
					required
				/>

				{#if f.cause === 'other'}
					<TextArea
						label="Please describe the other cause"
						name="vfCauseOtherDetails"
						bind:value={f.causeOtherDetails}
						rows={3}
						required
					/>
				{/if}
			{/if}
		</div>
	{/if}
</SectionCard>
