<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const d = assessment.data.demographics;

	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Demographics">
	<p class="hint">Optional respondent details. This survey is anonymous unless you choose to share.</p>

	<div class="field-grid">
		<Field label="First name" inputId="firstName">
			<TextInput id="firstName" label="First name" bind:value={d.firstName} />
		</Field>
		<Field label="Last name" inputId="lastName">
			<TextInput id="lastName" label="Last name" bind:value={d.lastName} />
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Date of birth" inputId="dob">
			<DateInput id="dob" label="Date of birth" bind:value={d.dateOfBirth} />
		</Field>
		<Field label="Age range" inputId="ageRange">
			<Select id="ageRange" label="Age range" bind:value={d.ageRange}>
				<option value="">-- Select --</option>
				<option value="18-24">18-24</option>
				<option value="25-34">25-34</option>
				<option value="35-44">35-44</option>
				<option value="45-54">45-54</option>
				<option value="55-64">55-64</option>
				<option value="65-74">65-74</option>
				<option value="75-plus">75+</option>
			</Select>
		</Field>
	</div>

	<Field label="Sex">
		<RadioGroup label="Sex">
			<label><input type="radio" class="radio-input" name="sex" value="male" bind:group={d.sex} /> Male</label>
			<label><input type="radio" class="radio-input" name="sex" value="female" bind:group={d.sex} /> Female</label>
			<label><input type="radio" class="radio-input" name="sex" value="other" bind:group={d.sex} /> Other</label>
		</RadioGroup>
	</Field>

	<div class="field-grid">
		<Field label="Ethnicity" inputId="ethnicity">
			<TextInput id="ethnicity" label="Ethnicity" bind:value={d.ethnicity} />
		</Field>
		<Field label="Preferred language" inputId="preferredLanguage">
			<TextInput id="preferredLanguage" label="Preferred language" bind:value={d.preferredLanguage} />
		</Field>
	</div>

	<Field label="Did you require an interpreter?">
		<RadioGroup label="Did you require an interpreter?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="interpreterRequired" value={opt.value} bind:group={d.interpreterRequired} /> {opt.label}</label>
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
