<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { calculateBMI, bmiCategory, calculateAge } from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const d = assessment.data.demographics;

	$effect(() => {
		assessment.data.demographics.bmi = calculateBMI(d.weight, d.height);
		assessment.data.demographics.age = calculateAge(d.dateOfBirth);
	});

	const sexOptions = [
		{ value: 'male', label: 'Male' },
		{ value: 'female', label: 'Female' },
		{ value: 'other', label: 'Other' }
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

	<div class="field-grid">
		<Field label="Date of Birth" required inputId="dob">
			<DateInput id="dob" label="Date of Birth" required bind:value={d.dateOfBirth} />
		</Field>
		<Field label="Age" description="Auto-calculated from DOB">
			{#if d.age != null}
				<p class="readout">{d.age} <span class="readout-muted">years</span></p>
			{:else}
				<p class="readout readout-empty">—</p>
			{/if}
		</Field>
	</div>

	<Field label="Sex" required>
		<RadioGroup label="Sex">
			{#each sexOptions as opt (opt.value)}
				<label>
					<input type="radio" class="radio-input" name="sex" value={opt.value} bind:group={d.sex} required />
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Ethnicity" inputId="ethnicity">
		<Select id="ethnicity" label="Ethnicity" bind:value={d.ethnicity}>
			<option value="">— Select —</option>
			<option value="white">White</option>
			<option value="black">Black / African / Caribbean</option>
			<option value="asian">Asian</option>
			<option value="hispanic">Hispanic / Latino</option>
			<option value="middle-eastern">Middle Eastern</option>
			<option value="mixed">Mixed / Multiple</option>
			<option value="other">Other</option>
			<option value="prefer-not-to-say">Prefer not to say</option>
		</Select>
	</Field>

	<div class="field-grid field-grid-3">
		<Field label="Weight (kg)" inputId="weight">
			<NumberInput id="weight" label="Weight" min={1} max={400} bind:value={d.weight} />
		</Field>
		<Field label="Height (cm)" inputId="height">
			<NumberInput id="height" label="Height" min={50} max={250} bind:value={d.height} />
		</Field>
		<Field label="BMI" description="Auto-calculated">
			{#if d.bmi != null}
				<p class="readout">{d.bmi} <span class="readout-muted">({bmiCategory(d.bmi)})</span></p>
			{:else}
				<p class="readout readout-empty">—</p>
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
	.readout {
		margin: 0;
		font-weight: 500;
	}
	.readout-muted {
		color: var(--color-muted);
		font-weight: 400;
	}
	.readout-empty {
		color: var(--color-muted);
	}
</style>
