<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const r = assessment.data.retinitisPigmentosa;

	const yesNoOptions = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset
	title="Question 5 — Retinitis Pigmentosa"
	description="Retinitis pigmentosa is an inherited eye condition that causes progressive vision loss, especially in low light or peripheral vision."
>
	<RadioGroup
		label="Do you have retinitis pigmentosa?"
		name="rpHasCondition"
		options={yesNoOptions}
		bind:value={r.hasCondition}
		required
	/>

	{#if r.hasCondition === 'yes'}
		<div class="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
			<RadioGroup
				label="5a) Which eye(s) are affected?"
				name="rpWhichEyes"
				options={[
					{ value: 'both', label: 'Both eyes' },
					{ value: 'left', label: 'Left eye' },
					{ value: 'right', label: 'Right eye' }
				]}
				bind:value={r.whichEyes}
				required
			/>
		</div>
	{/if}
</Fieldset>
