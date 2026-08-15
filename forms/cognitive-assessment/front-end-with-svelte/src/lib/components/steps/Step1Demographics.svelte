<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const d = assessment.data.demographics;

	const sexOptions = [
		{ value: 'male', label: 'Male' },
		{ value: 'female', label: 'Female' },
		{ value: 'other', label: 'Other' }
	];

	const handednessOptions = [
		{ value: 'right', label: 'Right' },
		{ value: 'left', label: 'Left' },
		{ value: 'ambidextrous', label: 'Ambidextrous' }
	];
</script>

<Fieldset legend="Demographics">
	<p class="hint">Basic patient information.</p>

	<div class="field-grid">
		<Field label="First Name" required inputId="firstName">
			<TextInput id="firstName" label="First Name" required bind:value={d.firstName} />
		</Field>
		<Field label="Last Name" required inputId="lastName">
			<TextInput id="lastName" label="Last Name" required bind:value={d.lastName} />
		</Field>
	</div>

	<Field label="Date of Birth" required inputId="dob">
		<DateInput id="dob" label="Date of Birth" required bind:value={d.dateOfBirth} />
	</Field>

	<Field label="Sex" required>
		<RadioGroup label="Sex">
			{#each sexOptions as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="sex" value={opt.value} bind:group={d.sex} required /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Education Level" required inputId="educationLevel">
		<Select id="educationLevel" label="Education Level" required bind:value={d.educationLevel}>
			<option value="">-- Select --</option>
			<option value="none">No formal education</option>
			<option value="primary">Primary school</option>
			<option value="secondary">Secondary school</option>
			<option value="university">University/College</option>
			<option value="postgraduate">Postgraduate</option>
		</Select>
	</Field>

	<Field label="Primary Language" required inputId="primaryLanguage">
		<TextInput id="primaryLanguage" label="Primary Language" required placeholder="e.g., English, Spanish, Mandarin..." bind:value={d.primaryLanguage} />
	</Field>

	<Field label="Handedness">
		<RadioGroup label="Handedness">
			{#each handednessOptions as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="handedness" value={opt.value} bind:group={d.handedness} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
</Fieldset>

<style>
	.field-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}
	@media (max-width: 640px) {
		.field-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
