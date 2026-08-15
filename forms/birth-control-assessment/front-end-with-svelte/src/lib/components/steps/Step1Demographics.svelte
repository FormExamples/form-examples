<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { calculateBMI, bmiCategory } from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const d = assessment.data.demographics;

	$effect(() => {
		assessment.data.demographics.bmi = calculateBMI(d.weight, d.height);
	});

	const sexOptions = [
		{ value: 'female', label: 'Female' },
		{ value: 'male', label: 'Male' },
		{ value: 'other', label: 'Other' }
	];
</script>

<Fieldset legend="Demographics" description="Basic patient information.">
	<div class="field-grid">
		<TextInput label="First name" name="firstName" bind:value={d.firstName} />
		<TextInput label="Last name" name="lastName" required bind:value={d.lastName} />
	</div>

	<Field label="Date of birth" required inputId="dob">
		<DateInput id="dob" label="Date of birth" required bind:value={d.dateOfBirth} />
	</Field>

	<RadioGroup label="Sex" name="sex" options={sexOptions} bind:value={d.sex} />

	<div class="field-grid field-grid-3">
		<NumberInput label="Weight" unit="kg" name="weight" min={1} max={400} bind:value={d.weight} />
		<NumberInput label="Height" unit="cm" name="height" min={50} max={250} bind:value={d.height} />
		<Field label="BMI" description="Auto-calculated">
			{#if d.bmi}
				<p class="bmi-value">{d.bmi} <span class="bmi-cat">({bmiCategory(d.bmi)})</span></p>
			{:else}
				<p class="bmi-value bmi-empty">—</p>
			{/if}
		</Field>
	</div>
</Fieldset>

<style>
	.field-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}
	.field-grid.field-grid-3 {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}
	@media (max-width: 640px) {
		.field-grid,
		.field-grid.field-grid-3 {
			grid-template-columns: 1fr;
		}
	}
	.bmi-value {
		margin: 0;
		font-weight: 500;
	}
	.bmi-cat {
		color: var(--color-base-content);
		opacity: 0.6;
		font-weight: 400;
	}
	.bmi-empty {
		color: var(--color-base-content);
		opacity: 0.6;
	}
</style>
