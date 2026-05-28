<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const e = assessment.data.eyesightStandards;
</script>

<Fieldset
	title="Question 1 — Eyesight Standards"
	description="Your eyesight must not be worse than 6/12 (decimal 0.5) on the Snellen scale. You must be able to read a number plate from 20 metres (about 5 parked cars in length), with or without glasses or corrective lenses."
>
	<RadioGroup
		label="Do you meet the eyesight standard for driving?"
		name="meetsStandard"
		options={[
			{ value: 'yes-without-correction', label: 'Yes, without glasses or corrective lenses' },
			{ value: 'yes-with-correction', label: 'Yes, with glasses or corrective lenses' },
			{ value: 'no', label: 'No' }
		]}
		bind:value={e.meetsStandard}
		stack
		required
	/>
</Fieldset>
