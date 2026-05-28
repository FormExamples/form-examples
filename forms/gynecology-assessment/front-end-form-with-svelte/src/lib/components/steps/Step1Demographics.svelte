<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const d = assessment.data.demographics;
</script>

<Fieldset title="Demographics" description="Basic patient information and menopausal status">
	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<TextInput label="First Name" name="firstName" bind:value={d.firstName} required />
		<TextInput label="Last Name" name="lastName" bind:value={d.lastName} required />
	</div>

	<TextInput label="Date of Birth" name="dob" type="date" bind:value={d.dateOfBirth} required />

	<RadioGroup
		label="Sex"
		name="sex"
		options={[
			{ value: 'female', label: 'Female' },
			{ value: 'other', label: 'Other' }
		]}
		bind:value={d.sex}
		required
	/>

	<Select
		label="Menopausal Status"
		name="menopausalStatus"
		options={[
			{ value: 'pre-menopausal', label: 'Pre-menopausal' },
			{ value: 'peri-menopausal', label: 'Peri-menopausal' },
			{ value: 'post-menopausal', label: 'Post-menopausal' },
			{ value: 'unknown', label: 'Unknown' }
		]}
		bind:value={d.menopausalStatus}
		required
	/>
</Fieldset>
