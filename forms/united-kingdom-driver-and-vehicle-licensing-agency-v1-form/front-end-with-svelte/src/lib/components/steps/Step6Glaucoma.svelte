<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const g = assessment.data.glaucoma;

	const yesNoOptions = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset
	title="Question 4 — Glaucoma"
	description="Glaucoma is an eye condition that causes damage to the optic nerve, often from increased eye pressure."
>
	<RadioGroup
		label="Do you have glaucoma?"
		name="glaucomaHasCondition"
		options={yesNoOptions}
		bind:value={g.hasCondition}
		required
	/>

	{#if g.hasCondition === 'yes'}
		<div class="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
			<RadioGroup
				label="4a) Which eye(s) are affected?"
				name="glaucomaWhichEyes"
				options={[
					{ value: 'both', label: 'Both eyes' },
					{ value: 'left', label: 'Left eye' },
					{ value: 'right', label: 'Right eye' }
				]}
				bind:value={g.whichEyes}
				required
			/>
		</div>
	{/if}
</Fieldset>
