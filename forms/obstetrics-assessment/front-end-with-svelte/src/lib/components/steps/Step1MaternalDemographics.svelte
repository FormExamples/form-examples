<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateBMI, bmiCategory, calculateAge } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const d = assessment.data.maternalDemographics;

	$effect(() => {
		assessment.data.maternalDemographics.bmi = calculateBMI(d.weight, d.height);
	});

	// Auto-derive age at booking from the date of birth (mirrors the HTML form).
	$effect(() => {
		const age = calculateAge(d.dateOfBirth);
		if (age != null) assessment.data.maternalDemographics.ageAtBooking = age;
	});

	const ethnicityOptions = [
		{ value: 'white-british', label: 'White - British' },
		{ value: 'white-other', label: 'White - other' },
		{ value: 'asian-indian', label: 'Asian - Indian' },
		{ value: 'asian-pakistani', label: 'Asian - Pakistani' },
		{ value: 'asian-bangladeshi', label: 'Asian - Bangladeshi' },
		{ value: 'asian-other', label: 'Asian - other' },
		{ value: 'black-african', label: 'Black - African' },
		{ value: 'black-caribbean', label: 'Black - Caribbean' },
		{ value: 'black-other', label: 'Black - other' },
		{ value: 'mixed', label: 'Mixed / multiple' },
		{ value: 'other', label: 'Other' },
		{ value: 'prefer-not-to-say', label: 'Prefer not to say' }
	];
	const partnerOptions = [
		{ value: 'married-cohabiting', label: 'Married / cohabiting' },
		{ value: 'single', label: 'Single' },
		{ value: 'separated', label: 'Separated / divorced' },
		{ value: 'widowed', label: 'Widowed' },
		{ value: 'prefer-not-to-say', label: 'Prefer not to say' }
	];
</script>

<Fieldset legend="Maternal Demographics">
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
		<Field label="Age at booking (years)" inputId="ageAtBooking" description="Auto-derived from date of birth">
			<NumberInput id="ageAtBooking" label="Age at booking" min={10} max={60} bind:value={d.ageAtBooking} />
		</Field>
	</div>

	<Field label="Ethnicity" inputId="ethnicity">
		<Select id="ethnicity" label="Ethnicity" bind:value={d.ethnicity}>
			<option value="">— Select —</option>
			{#each ethnicityOptions as opt (opt.value)}
				<option value={opt.value}>{opt.label}</option>
			{/each}
		</Select>
	</Field>

	<div class="field-grid field-grid-3">
		<Field label="Weight (kg)" inputId="weight">
			<NumberInput id="weight" label="Weight" min={30} max={250} step={0.1} bind:value={d.weight} />
		</Field>
		<Field label="Height (cm)" inputId="height">
			<NumberInput id="height" label="Height" min={100} max={220} bind:value={d.height} />
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
		<Field label="Occupation" inputId="occupation">
			<TextInput id="occupation" label="Occupation" bind:value={d.occupation} />
		</Field>
		<Field label="Partner / support status" inputId="partnerStatus">
			<Select id="partnerStatus" label="Partner / support status" bind:value={d.partnerStatus}>
				<option value="">— Select —</option>
				{#each partnerOptions as opt (opt.value)}
					<option value={opt.value}>{opt.label}</option>
				{/each}
			</Select>
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
