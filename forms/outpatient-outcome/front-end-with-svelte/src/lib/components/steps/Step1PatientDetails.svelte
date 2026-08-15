<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const d = assessment.data.patientDetails;
</script>

<Fieldset title="Patient Details" description="Patient identification and demographics">
	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<TextInput label="Given Name" name="givenName" bind:value={d.givenName} required />
		<TextInput label="Family Name" name="familyName" bind:value={d.familyName} required />
	</div>

	<TextInput label="Date of Birth" name="dateOfBirth" type="date" bind:value={d.dateOfBirth} required />

	<TextInput
		label="NHS Number"
		name="nhsNumber"
		bind:value={d.nhsNumber}
		placeholder="e.g. 123 456 7890"
	/>

	<RadioGroup
		label="Sex"
		name="sex"
		options={[
			{ value: 'male', label: 'Male' },
			{ value: 'female', label: 'Female' },
			{ value: 'other', label: 'Other' },
			{ value: 'prefer_not_to_say', label: 'Prefer not to say' }
		]}
		bind:value={d.sex}
	/>
</Fieldset>
