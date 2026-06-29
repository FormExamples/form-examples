<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateAge } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const d = assessment.data.demographics;

	$effect(() => {
		assessment.data.demographics.ageYears = calculateAge(d.dateOfBirth);
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
		<Field label="First name" required inputId="firstName">
			<TextInput id="firstName" label="First name" required bind:value={d.firstName} />
		</Field>
		<Field label="Last name" required inputId="lastName">
			<TextInput id="lastName" label="Last name" required bind:value={d.lastName} />
		</Field>
	</div>

	<div class="field-grid field-grid-3">
		<Field label="Date of birth" required inputId="dob">
			<DateInput id="dob" label="Date of birth" required bind:value={d.dateOfBirth} />
		</Field>
		<Field label="Age (years)" description="Auto-calculated, or override" inputId="ageYears">
			<NumberInput id="ageYears" label="Age" min={0} max={130} bind:value={d.ageYears} />
		</Field>
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
	</div>

	<Field label="Primary diagnosis" description="e.g. Alzheimer's disease, vascular dementia" inputId="primaryDiagnosis">
		<TextInput id="primaryDiagnosis" label="Primary diagnosis" bind:value={d.primaryDiagnosis} />
	</Field>

	<Field label="Care setting" description="e.g. home, residential care, hospital ward" inputId="careSetting">
		<TextInput id="careSetting" label="Care setting" bind:value={d.careSetting} />
	</Field>
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
</style>
