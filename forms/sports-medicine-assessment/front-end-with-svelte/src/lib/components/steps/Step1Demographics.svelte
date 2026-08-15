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
		{ value: 'male', label: 'Male' },
		{ value: 'female', label: 'Female' },
		{ value: 'other', label: 'Other' }
	];
</script>

<Fieldset legend="Demographics">
	<p class="hint">Basic athlete information and emergency contact.</p>

	<div class="field-grid">
		<Field label="First name" inputId="firstName">
			<TextInput id="firstName" label="First name" bind:value={d.firstName} />
		</Field>
		<Field label="Last name" required inputId="lastName">
			<TextInput id="lastName" label="Last name" required bind:value={d.lastName} />
		</Field>
	</div>

	<Field label="Date of birth" required inputId="dob">
		<DateInput id="dob" label="Date of birth" required bind:value={d.dateOfBirth} />
	</Field>

	<Field label="Sex" required>
		<RadioGroup label="Sex">
			{#each sexOptions as opt (opt.value)}
				<label>
					<input type="radio" class="radio-input" name="sex" value={opt.value} bind:group={d.sex} />
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<div class="field-grid field-grid-3">
		<Field label="Weight (kg)" inputId="weight">
			<NumberInput id="weight" label="Weight" min={1} max={400} bind:value={d.weight} />
		</Field>
		<Field label="Height (cm)" inputId="height">
			<NumberInput id="height" label="Height" min={50} max={250} bind:value={d.height} />
		</Field>
		<Field label="BMI" description="Auto-calculated">
			{#if d.bmi}
				<p class="bmi-value">{d.bmi} <span class="bmi-cat">({bmiCategory(d.bmi)})</span></p>
			{:else}
				<p class="bmi-value bmi-empty">—</p>
			{/if}
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Emergency contact name" inputId="emergencyContactName">
			<TextInput id="emergencyContactName" label="Emergency contact name" bind:value={d.emergencyContactName} />
		</Field>
		<Field label="Emergency contact phone" inputId="emergencyContactPhone">
			<TextInput id="emergencyContactPhone" label="Emergency contact phone" bind:value={d.emergencyContactPhone} />
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
		color: var(--color-muted);
		font-weight: 400;
	}
	.bmi-empty {
		color: var(--color-muted);
	}
</style>
