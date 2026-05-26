<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateBMI, bmiCategory } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const d = assessment.data.demographics;
	const sexOptions = [
		{ value: 'male', label: 'Male' },
		{ value: 'female', label: 'Female' },
		{ value: 'other', label: 'Other' }
	];

	$effect(() => {
		const bmi = calculateBMI(d.weight, d.height);
		assessment.data.demographics.bmi = bmi;
	});
</script>

<Fieldset legend="Demographics">
	<p class="hint">Basic patient information.</p>

	<div class="field-grid">
		<Field label="First Name" required inputId="firstName">
			<TextInput id="firstName" label="First name" required bind:value={d.firstName} />
		</Field>
		<Field label="Last Name" required inputId="lastName">
			<TextInput id="lastName" label="Last name" required bind:value={d.lastName} />
		</Field>
	</div>

	<Field label="Date of Birth" required inputId="dob">
		<DateInput id="dob" label="Date of birth" required bind:value={d.dateOfBirth} />
	</Field>

	<Field label="Sex" required>
		<RadioGroup label="Sex">
			{#each sexOptions as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="sex" value={opt.value} bind:group={d.sex} required /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<div class="field-grid field-grid-3">
		<Field label="Weight (kg)" required inputId="weight">
			<NumberInput id="weight" label="Weight" min={1} max={400} required bind:value={d.weight} />
		</Field>
		<Field label="Height (cm)" required inputId="height">
			<NumberInput id="height" label="Height" min={50} max={250} required bind:value={d.height} />
		</Field>
		<Field label="BMI" description={d.bmi ? `${d.bmi} (${bmiCategory(d.bmi)})` : 'Auto-calculated'}>
			<p class="static-value">{d.bmi ?? '—'}</p>
		</Field>
	</div>
</Fieldset>

<style>
	.field-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
	.field-grid.field-grid-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
	@media (max-width: 640px) {
		.field-grid, .field-grid.field-grid-3 { grid-template-columns: 1fr; }
	}
	.static-value { margin: 0; font-weight: 500; }
</style>
