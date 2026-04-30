<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import SectionCard from '$lib/components/ui/SectionCard.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const d = assessment.data.demographics;
</script>

<SectionCard title="Demographics" description="Basic information about you">
	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<TextInput label="First Name" name="firstName" bind:value={d.firstName} required />
		<TextInput label="Last Name" name="lastName" bind:value={d.lastName} required />
	</div>

	<TextInput
		label="Date of Birth"
		name="dob"
		type="date"
		bind:value={d.dateOfBirth}
		required
	/>

	<RadioGroup
		label="Sex"
		name="sex"
		options={[
			{ value: 'male', label: 'Male' },
			{ value: 'female', label: 'Female' },
			{ value: 'other', label: 'Other' },
			{ value: 'prefer-not-to-say', label: 'Prefer not to say' }
		]}
		bind:value={d.sex}
	/>

	<TextInput
		label="Occupation"
		name="occupation"
		bind:value={d.occupation}
		placeholder="e.g. Teacher, Software Developer, Student"
	/>
</SectionCard>
