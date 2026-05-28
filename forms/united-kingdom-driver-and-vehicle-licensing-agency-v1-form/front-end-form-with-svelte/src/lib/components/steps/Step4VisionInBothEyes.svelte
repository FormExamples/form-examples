<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import Checkbox from '$lib/components/ui/Checkbox.svelte';

	const v = assessment.data.visionInBothEyes;

	const yesNoOptions = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset
	title="Question 2 — Vision in Both Eyes"
	description="Do not include long or short sightedness."
>
	<RadioGroup
		label="Do you have vision in both eyes?"
		name="hasVisionInBothEyes"
		options={yesNoOptions}
		bind:value={v.hasVisionInBothEyes}
		required
	/>

	{#if v.hasVisionInBothEyes === 'no'}
		<div class="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
			<RadioGroup
				label="2a) Which eye do you see with?"
				name="whichEye"
				options={[
					{ value: 'left', label: 'Left eye only' },
					{ value: 'right', label: 'Right eye only' }
				]}
				bind:value={v.whichEye}
				required
			/>

			<RadioGroup
				label="2b) How long have you had vision in only one eye?"
				name="duration"
				options={[
					{ value: 'since-birth-or-childhood', label: 'Since birth or childhood' },
					{
						value: 'health-or-injury',
						label: 'As a result of a health condition, accident or injury'
					}
				]}
				bind:value={v.duration}
				stack
				required
			/>

			<RadioGroup
				label="2c) Have you adapted to vision in one eye?"
				name="adaptation"
				options={[
					{ value: 'adapted-advised', label: 'Yes, advised by a healthcare professional' },
					{ value: 'adapted-self', label: 'Yes, but not advised by a healthcare professional' },
					{ value: 'not-adapted', label: 'No, not yet adapted' }
				]}
				bind:value={v.adaptation}
				stack
				required
			/>

			<Checkbox
				label="I confirm I have adapted (or completed an adaptation period) to driving with vision in only one eye, as required by DVLA."
				name="monocularDeclarationConfirmed"
				bind:checked={v.monocularDeclarationConfirmed}
				required
			/>
		</div>
	{/if}
</Fieldset>
