<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const sh = assessment.data.sexualHealth;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset title="Sexual Health" description="Sexual activity, contraception, and STI history">
	<RadioGroup
		label="Are you currently sexually active?"
		name="sexuallyActive"
		options={yesNo}
		bind:value={sh.sexuallyActive}
	/>

	<TextInput
		label="Current contraception method"
		name="contraceptionMethod"
		bind:value={sh.contraceptionMethod}
		placeholder="e.g., combined pill, IUD, condoms, none..."
	/>

	<RadioGroup
		label="Do you have a history of sexually transmitted infections (STIs)?"
		name="stiHistory"
		options={yesNo}
		bind:value={sh.stiHistory}
	/>

	{#if sh.stiHistory === 'yes'}
		<TextAreaInput
			label="Please provide details"
			name="stiDetails"
			bind:value={sh.stiDetails}
			placeholder="e.g., chlamydia 2020, treated with antibiotics..."
		/>
	{/if}
</Fieldset>
