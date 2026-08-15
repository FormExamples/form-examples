<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const d = assessment.data.demographics;

	const sexOptions = [
		{ value: 'male', label: 'Male' },
		{ value: 'female', label: 'Female' },
		{ value: 'other', label: 'Other' }
	];
</script>

<Fieldset legend="Demographics">
	<p class="hint">Basic patient information and care setting.</p>

	<div class="field-grid">
		<Field label="First name" required inputId="firstName">
			<TextInput id="firstName" label="First name" required bind:value={d.firstName} />
		</Field>
		<Field label="Last name" required inputId="lastName">
			<TextInput id="lastName" label="Last name" required bind:value={d.lastName} />
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Date of birth" required inputId="dob">
			<DateInput id="dob" label="Date of birth" required bind:value={d.dateOfBirth} />
		</Field>
		<Field label="Age (years)" inputId="age">
			<NumberInput id="age" label="Age" min={0} max={130} bind:value={d.age} />
		</Field>
	</div>

	<Field label="Sex">
		<RadioGroup label="Sex">
			{#each sexOptions as opt (opt.value)}
				<label>
					<input type="radio" class="radio-input" name="sex" value={opt.value} bind:group={d.sex} />
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Care setting" inputId="careSetting">
		<Select id="careSetting" label="Care setting" bind:value={d.careSetting}>
			<option value="">— Select —</option>
			<option value="inpatient">Inpatient (hospital)</option>
			<option value="outpatient">Outpatient clinic</option>
			<option value="community">Community / home</option>
			<option value="long-term-care">Long-term care / nursing home</option>
			<option value="rehab">Rehabilitation unit</option>
		</Select>
	</Field>

	<Field label="Primary diagnosis" inputId="primaryDiagnosis">
		<TextInput id="primaryDiagnosis" label="Primary diagnosis" placeholder="e.g. Stroke, hip fracture" bind:value={d.primaryDiagnosis} />
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
