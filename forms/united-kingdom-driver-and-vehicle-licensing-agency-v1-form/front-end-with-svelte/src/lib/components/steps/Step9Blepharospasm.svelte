<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const b = assessment.data.blepharospasm;

	const yesNoOptions = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset
	title="Question 7 — Blepharospasm"
	description="Blepharospasm is an involuntary spasm of the eyelid muscles."
>
	<RadioGroup
		label="Do you have blepharospasm?"
		name="blephHasCondition"
		options={yesNoOptions}
		bind:value={b.hasCondition}
		required
	/>

	{#if b.hasCondition === 'yes'}
		<div class="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
			<RadioGroup
				label="7a) Which eye(s) are affected?"
				name="blephWhichEyes"
				options={[
					{ value: 'both', label: 'Both eyes' },
					{ value: 'left', label: 'Left eye' },
					{ value: 'right', label: 'Right eye' }
				]}
				bind:value={b.whichEyes}
				required
			/>

			<RadioGroup
				label="7b) Have you had any treatment for blepharospasm?"
				name="blephHasHadTreatment"
				options={yesNoOptions}
				bind:value={b.hasHadTreatment}
				required
			/>

			<RadioGroup
				label="7c) Is your healthcare professional satisfied that the blepharospasm is adequately controlled?"
				name="blephAdequatelyControlled"
				options={yesNoOptions}
				bind:value={b.adequatelyControlled}
				required
			/>
		</div>
	{/if}
</Fieldset>
