<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const nok = assessment.data.nextOfKinGP.nextOfKin;
	const gp = assessment.data.nextOfKinGP.gp;
</script>

<Fieldset title="Next of Kin & GP" description="Emergency contact and GP details">
	<h3 class="mb-3 text-lg font-semibold text-base-content">Next of Kin</h3>
	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<TextInput label="Name" name="nokName" bind:value={nok.name} />
		<TextInput label="Relationship" name="nokRelationship" bind:value={nok.relationship} />
	</div>
	<TextInput label="Phone" name="nokPhone" bind:value={nok.phone} type="tel" />
	<RadioGroup
		label="Next of Kin Notified?"
		name="nokNotified"
		bind:value={nok.notified}
		options={[
			{ value: 'yes', label: 'Yes' },
			{ value: 'no', label: 'No' }
		]}
	/>

	<hr class="my-6 border-base-300" />

	<h3 class="mb-3 text-lg font-semibold text-base-content">General Practitioner</h3>
	<TextInput label="GP Name" name="gpName" bind:value={gp.name} />
	<TextInput label="Practice Name" name="gpPracticeName" bind:value={gp.practiceName} />
	<TextInput label="Practice Address" name="gpPracticeAddress" bind:value={gp.practiceAddress} />
	<TextInput label="Practice Phone" name="gpPracticePhone" bind:value={gp.practicePhone} type="tel" />
</Fieldset>
